const crypto = require('crypto');
const fs = require('fs/promises');
const path = require('path');

const INQUIRY_STATUSES = [
  'new',
  'read',
  'qualified',
  'quoted',
  'sample_sent',
  'won',
  'disqualified',
  'resolved'
];
const STATUS_TIMESTAMP_FIELDS = {
  read: 'readAt',
  qualified: 'qualifiedAt',
  quoted: 'quotedAt',
  sample_sent: 'sampleSentAt',
  won: 'wonAt',
  disqualified: 'disqualifiedAt',
  resolved: 'resolvedAt'
};
const MAX_STATUS_HISTORY = 100;
const META_DELIVERY_EVENT_NAMES = [
  'Lead',
  'QualifiedLead',
  'QuoteSent',
  'SampleSent',
  'OrderWon'
];
const META_DELIVERY_STATUSES = ['pending', 'sending', 'sent', 'failed', 'skipped'];
const META_DELIVERY_LEASE_MS = 2 * 60 * 1000;
const MAX_BLOB_MUTATION_ATTEMPTS = 8;
const INQUIRIES_BLOB_PREFIX = String(process.env.INQUIRIES_BLOB_PREFIX || 'inquiries')
  .trim()
  .replace(/^\/+|\/+$/g, '') || 'inquiries';
const LOCAL_INQUIRIES_PATH = path.join(
  process.cwd(),
  'huagui_company_site',
  'data',
  'inquiries.json'
);
let localInquiryMutationQueue = Promise.resolve();

function isVercelRuntime() {
  return Boolean(process.env.VERCEL);
}

function canUseLocalStorage() {
  return !isVercelRuntime() || process.env.VERCEL_ENV === 'development';
}

function hasInquiryBlobStorage() {
  return Boolean(
    process.env.INQUIRIES_BLOB_READ_WRITE_TOKEN ||
    process.env.INQUIRIES_BLOB_STORE_ID ||
    process.env.INQUIRIES_STORE_ID
  );
}

function inquiryBlobClientOptions() {
  const storeId = process.env.INQUIRIES_BLOB_STORE_ID || process.env.INQUIRIES_STORE_ID;
  return {
    ...(process.env.INQUIRIES_BLOB_READ_WRITE_TOKEN
      ? { token: process.env.INQUIRIES_BLOB_READ_WRITE_TOKEN }
      : {}),
    ...(storeId
      ? { storeId }
      : {})
  };
}

function storageMode() {
  if (hasInquiryBlobStorage()) return 'private-blob';
  if (canUseLocalStorage()) return 'local-file';
  return 'unavailable';
}

function storageUnavailableError() {
  const error = new Error('Private inquiry storage is not configured.');
  error.statusCode = 503;
  return error;
}

function cleanText(value, maxLength) {
  return String(value || '')
    .replace(/\u0000/g, '')
    .trim()
    .slice(0, maxLength);
}

function toIsoString(value, fallback = '') {
  if (!value) return fallback;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date.toISOString();
}

function normalizeMetaDeliveries(value) {
  const source = value && typeof value === 'object' ? value : {};
  const deliveries = {};
  META_DELIVERY_EVENT_NAMES.forEach(eventName => {
    const raw = source[eventName];
    if (!raw || typeof raw !== 'object' || !META_DELIVERY_STATUSES.includes(raw.status)) return;
    deliveries[eventName] = {
      status: raw.status,
      attempts: Math.max(0, Math.min(1000, Number.parseInt(raw.attempts, 10) || 0)),
      createdAt: toIsoString(raw.createdAt),
      updatedAt: toIsoString(raw.updatedAt),
      claimedAt: toIsoString(raw.claimedAt),
      claimToken: cleanText(raw.claimToken, 120),
      lastAttemptAt: toIsoString(raw.lastAttemptAt),
      sentAt: toIsoString(raw.sentAt),
      failedAt: toIsoString(raw.failedAt),
      skippedAt: toIsoString(raw.skippedAt),
      reason: cleanText(raw.reason, 160),
      lastError: cleanText(raw.lastError, 500),
      providerEventId: cleanText(raw.providerEventId, 160),
      providerTraceId: cleanText(raw.providerTraceId, 160)
    };
  });
  return deliveries;
}

function validateInquiryInput(input) {
  const marketingConsent = input.marketingConsent === true || input.marketingConsent === 'accepted';
  const inquiry = {
    name: cleanText(input.name, 120),
    company: cleanText(input.company, 180),
    country: cleanText(input.country, 120),
    businessRole: cleanText(input.businessRole, 80),
    email: cleanText(input.email, 254).toLowerCase(),
    phone: cleanText(input.phone, 80),
    product: cleanText(input.product, 40),
    productName: cleanText(input.productName, 160),
    itemNo: cleanText(input.itemNo, 100),
    quantity: cleanText(input.quantity, 120),
    tradeTerm: cleanText(input.tradeTerm, 20),
    quoteCurrency: cleanText(input.quoteCurrency, 20),
    message: cleanText(input.message, 5000),
    sourceUrl: cleanText(input.sourceUrl, 500),
    submissionId: cleanText(input.submissionId, 120),
    landingPath: cleanText(input.landingPath, 500),
    referrerHost: cleanText(input.referrerHost, 255),
    utmSource: cleanText(input.utmSource, 160),
    utmMedium: cleanText(input.utmMedium, 160),
    utmCampaign: cleanText(input.utmCampaign, 200),
    utmContent: cleanText(input.utmContent, 200),
    utmTerm: cleanText(input.utmTerm, 200),
    marketingConsent,
    metaFbp: marketingConsent ? cleanText(input.metaFbp, 255) : '',
    metaFbc: marketingConsent ? cleanText(input.metaFbc, 255) : '',
    metaEventSourceUrl: marketingConsent ? cleanText(input.metaEventSourceUrl, 500) : '',
    privacyConsent: input.privacyConsent === 'accepted'
  };

  if (!inquiry.name || !inquiry.company || !inquiry.country || !inquiry.businessRole || !inquiry.email || !inquiry.message) {
    const error = new Error('Name, company, country, business role, email, and message are required.');
    error.statusCode = 400;
    throw error;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiry.email)) {
    const error = new Error('Please enter a valid email address.');
    error.statusCode = 400;
    throw error;
  }
  if (!inquiry.privacyConsent) {
    const error = new Error('Please accept the Privacy Policy before sending your inquiry.');
    error.statusCode = 400;
    throw error;
  }
  return inquiry;
}

function createInquiryId(now = new Date(), submissionId = '') {
  const safeSubmissionId = cleanText(submissionId, 120);
  const prefixedDate = safeSubmissionId.match(/^(\d{4})(\d{2})(\d{2})-/);
  const parsedDate = prefixedDate
    ? new Date(`${prefixedDate[1]}-${prefixedDate[2]}-${prefixedDate[3]}T00:00:00.000Z`)
    : null;
  const validPrefixedDate = parsedDate && !Number.isNaN(parsedDate.getTime()) &&
    parsedDate.toISOString().slice(0, 10).replace(/-/g, '') === prefixedDate[1] + prefixedDate[2] + prefixedDate[3];
  const date = validPrefixedDate
    ? prefixedDate[1] + prefixedDate[2] + prefixedDate[3]
    : now.toISOString().slice(0, 10).replace(/-/g, '');
  const suffix = safeSubmissionId
    ? crypto.createHash('sha256').update(safeSubmissionId).digest('hex').slice(0, 16).toUpperCase()
    : crypto.randomBytes(8).toString('hex').toUpperCase();
  return `HG-${date}-${suffix}`;
}

function inquiryPathForId(id) {
  const match = String(id || '').match(/^HG-(\d{4})(\d{2})(\d{2})-[A-F0-9]{8}(?:[A-F0-9]{8})?$/);
  if (!match) {
    const error = new Error('Invalid inquiry ID.');
    error.statusCode = 400;
    throw error;
  }
  return `${INQUIRIES_BLOB_PREFIX}/${match[1]}/${match[2]}/${id}.json`;
}

function normalizeStatusHistory(value) {
  if (!Array.isArray(value)) return [];
  return value
    .slice(-MAX_STATUS_HISTORY)
    .map(entry => {
      const source = entry && typeof entry === 'object' ? entry : {};
      const status = INQUIRY_STATUSES.includes(source.status) ? source.status : '';
      if (!status) return null;
      return {
        fromStatus: INQUIRY_STATUSES.includes(source.fromStatus) ? source.fromStatus : '',
        status,
        changedAt: cleanText(source.changedAt, 40),
        reason: cleanText(source.reason, 500)
      };
    })
    .filter(Boolean);
}

function normalizeStoredInquiry(value) {
  const source = value && typeof value === 'object' ? value : {};
  const status = INQUIRY_STATUSES.includes(source.status) ? source.status : 'new';
  return {
    id: cleanText(source.id, 40),
    status,
    name: cleanText(source.name, 120),
    company: cleanText(source.company, 180),
    country: cleanText(source.country, 120),
    businessRole: cleanText(source.businessRole, 80),
    email: cleanText(source.email, 254),
    phone: cleanText(source.phone, 80),
    product: cleanText(source.product, 40),
    productName: cleanText(source.productName, 160),
    itemNo: cleanText(source.itemNo, 100),
    quantity: cleanText(source.quantity, 120),
    tradeTerm: cleanText(source.tradeTerm, 20),
    quoteCurrency: cleanText(source.quoteCurrency, 20),
    message: cleanText(source.message, 5000),
    sourceUrl: cleanText(source.sourceUrl, 500),
    landingPath: cleanText(source.landingPath, 500),
    referrerHost: cleanText(source.referrerHost, 255),
    utmSource: cleanText(source.utmSource, 160),
    utmMedium: cleanText(source.utmMedium, 160),
    utmCampaign: cleanText(source.utmCampaign, 200),
    utmContent: cleanText(source.utmContent, 200),
    utmTerm: cleanText(source.utmTerm, 200),
    marketingConsent: source.marketingConsent === true,
    metaFbp: cleanText(source.metaFbp, 255),
    metaFbc: cleanText(source.metaFbc, 255),
    metaEventSourceUrl: cleanText(source.metaEventSourceUrl, 500),
    metaDeliveries: normalizeMetaDeliveries(source.metaDeliveries),
    privacyConsent: source.privacyConsent === true,
    createdAt: source.createdAt || new Date().toISOString(),
    updatedAt: source.updatedAt || source.createdAt || new Date().toISOString(),
    readAt: source.readAt || null,
    qualifiedAt: source.qualifiedAt || null,
    quotedAt: source.quotedAt || null,
    sampleSentAt: source.sampleSentAt || null,
    wonAt: source.wonAt || null,
    disqualifiedAt: source.disqualifiedAt || null,
    resolvedAt: source.resolvedAt || null,
    disqualificationReason: cleanText(source.disqualificationReason, 500),
    statusHistory: normalizeStatusHistory(source.statusHistory)
  };
}

function validateInquiryStatusUpdate(status, options = {}) {
  const normalizedStatus = cleanText(status, 40);
  if (!INQUIRY_STATUSES.includes(normalizedStatus)) {
    const error = new Error('Invalid inquiry status.');
    error.statusCode = 400;
    throw error;
  }
  const disqualificationReason = cleanText(options.disqualificationReason, 500);
  if (normalizedStatus === 'disqualified' && !disqualificationReason) {
    const error = new Error('A disqualification reason is required.');
    error.statusCode = 400;
    throw error;
  }
  return {
    status: normalizedStatus,
    disqualificationReason: normalizedStatus === 'disqualified' ? disqualificationReason : ''
  };
}

function transitionInquiryStatus(value, status, options = {}, now = new Date()) {
  const inquiry = normalizeStoredInquiry(value);
  const update = validateInquiryStatusUpdate(status, options);
  const changedAt = now instanceof Date ? now.toISOString() : new Date(now).toISOString();
  const sameStatus = inquiry.status === update.status;
  const sameReason = inquiry.disqualificationReason === update.disqualificationReason;
  if (sameStatus && sameReason) return inquiry;

  const timestampField = STATUS_TIMESTAMP_FIELDS[update.status];
  const statusHistory = [
    ...inquiry.statusHistory,
    {
      fromStatus: inquiry.status,
      status: update.status,
      changedAt,
      reason: update.disqualificationReason
    }
  ].slice(-MAX_STATUS_HISTORY);

  return normalizeStoredInquiry({
    ...inquiry,
    status: update.status,
    updatedAt: changedAt,
    ...(timestampField ? { [timestampField]: changedAt } : {}),
    resolvedAt: update.status === 'resolved' ? changedAt : null,
    disqualifiedAt: update.status === 'disqualified' ? changedAt : null,
    disqualificationReason: update.disqualificationReason,
    statusHistory
  });
}

function validateMetaDeliveryEventName(eventName) {
  const normalized = cleanText(eventName, 80);
  if (!META_DELIVERY_EVENT_NAMES.includes(normalized)) {
    const error = new Error('Invalid Meta delivery event.');
    error.statusCode = 400;
    throw error;
  }
  return normalized;
}

function prepareMetaDelivery(value, eventName, now = new Date()) {
  const inquiry = normalizeStoredInquiry(value);
  const normalizedEventName = validateMetaDeliveryEventName(eventName);
  const existing = inquiry.metaDeliveries[normalizedEventName];
  if (existing) {
    return { inquiry, changed: false, delivery: existing };
  }

  const updatedAt = toIsoString(now, new Date().toISOString());
  const consented = inquiry.marketingConsent === true;
  const delivery = {
    status: consented ? 'pending' : 'skipped',
    attempts: 0,
    createdAt: updatedAt,
    updatedAt,
    claimedAt: '',
    claimToken: '',
    lastAttemptAt: '',
    sentAt: '',
    failedAt: '',
    skippedAt: consented ? '' : updatedAt,
    reason: consented ? '' : 'no-marketing-consent',
    lastError: '',
    providerEventId: '',
    providerTraceId: ''
  };
  const updated = normalizeStoredInquiry({
    ...inquiry,
    metaDeliveries: {
      ...inquiry.metaDeliveries,
      [normalizedEventName]: delivery
    }
  });
  return {
    inquiry: updated,
    changed: true,
    delivery: updated.metaDeliveries[normalizedEventName]
  };
}

function claimMetaDeliveryState(
  value,
  eventName,
  {
    now = new Date(),
    leaseMs = META_DELIVERY_LEASE_MS,
    claimToken = crypto.randomUUID()
  } = {}
) {
  const normalizedEventName = validateMetaDeliveryEventName(eventName);
  const prepared = prepareMetaDelivery(value, normalizedEventName, now);
  const inquiry = prepared.inquiry;
  const delivery = inquiry.metaDeliveries[normalizedEventName];
  const nowDate = now instanceof Date ? now : new Date(now);
  const nowIso = toIsoString(nowDate, new Date().toISOString());
  const claimedAtMs = delivery.claimedAt ? new Date(delivery.claimedAt).getTime() : 0;
  const sendingIsFresh = delivery.status === 'sending' &&
    Number.isFinite(claimedAtMs) &&
    claimedAtMs > 0 &&
    nowDate.getTime() - claimedAtMs < Math.max(1, leaseMs);

  if (['sent', 'skipped'].includes(delivery.status) || sendingIsFresh) {
    return {
      inquiry,
      changed: prepared.changed,
      claimed: false,
      claimToken: '',
      delivery
    };
  }

  const claimedDelivery = {
    ...delivery,
    status: 'sending',
    attempts: delivery.attempts + 1,
    updatedAt: nowIso,
    claimedAt: nowIso,
    claimToken: cleanText(claimToken, 120),
    lastAttemptAt: nowIso,
    failedAt: '',
    reason: '',
    lastError: ''
  };
  const updated = normalizeStoredInquiry({
    ...inquiry,
    metaDeliveries: {
      ...inquiry.metaDeliveries,
      [normalizedEventName]: claimedDelivery
    }
  });
  return {
    inquiry: updated,
    changed: true,
    claimed: true,
    claimToken: claimedDelivery.claimToken,
    delivery: updated.metaDeliveries[normalizedEventName]
  };
}

function completeMetaDeliveryState(value, eventName, claimToken, outcome = {}, now = new Date()) {
  const inquiry = normalizeStoredInquiry(value);
  const normalizedEventName = validateMetaDeliveryEventName(eventName);
  const delivery = inquiry.metaDeliveries[normalizedEventName];
  const normalizedClaimToken = cleanText(claimToken, 120);
  if (!delivery || delivery.status !== 'sending' || delivery.claimToken !== normalizedClaimToken) {
    return { inquiry, changed: false, completed: false, delivery: delivery || null };
  }

  const status = ['sent', 'failed', 'skipped'].includes(outcome.status)
    ? outcome.status
    : 'failed';
  const updatedAt = toIsoString(now, new Date().toISOString());
  const completedDelivery = {
    ...delivery,
    status,
    updatedAt,
    claimedAt: '',
    claimToken: '',
    sentAt: status === 'sent' ? updatedAt : '',
    failedAt: status === 'failed' ? updatedAt : '',
    skippedAt: status === 'skipped' ? updatedAt : '',
    reason: cleanText(outcome.reason, 160),
    lastError: status === 'failed' ? cleanText(outcome.error || outcome.reason, 500) : '',
    providerEventId: cleanText(outcome.eventId || delivery.providerEventId, 160),
    providerTraceId: cleanText(outcome.traceId || delivery.providerTraceId, 160)
  };
  const updated = normalizeStoredInquiry({
    ...inquiry,
    metaDeliveries: {
      ...inquiry.metaDeliveries,
      [normalizedEventName]: completedDelivery
    }
  });
  return {
    inquiry: updated,
    changed: true,
    completed: true,
    delivery: updated.metaDeliveries[normalizedEventName]
  };
}

function existingInquiryForRetry(existing, attempted) {
  if (!existing || !attempted || existing.id !== attempted.id) return null;
  return normalizeStoredInquiry(existing);
}

function sortInquiries(inquiries) {
  return [...inquiries].sort((a, b) => {
    const dateOrder = String(b.createdAt || '').localeCompare(String(a.createdAt || ''));
    if (dateOrder !== 0) return dateOrder;
    return String(b.id || '').localeCompare(String(a.id || ''));
  });
}

async function streamToText(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString('utf8');
}

async function blobToText(blobResult) {
  if (!blobResult) return '';
  if (typeof blobResult.text === 'function') return blobResult.text();
  if (blobResult.stream) return streamToText(blobResult.stream);
  if (blobResult.body) return streamToText(blobResult.body);
  return '';
}

function serializeLocalInquiryOperation(operation) {
  const run = localInquiryMutationQueue.then(operation, operation);
  localInquiryMutationQueue = run.catch(() => {});
  return run;
}

async function readLocalDocument() {
  try {
    const raw = await fs.readFile(LOCAL_INQUIRIES_PATH, 'utf8');
    const document = JSON.parse(raw);
    const inquiries = Array.isArray(document) ? document : document.inquiries;
    return {
      version: 1,
      updatedAt: document.updatedAt || null,
      inquiries: (Array.isArray(inquiries) ? inquiries : []).map(normalizeStoredInquiry)
    };
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { version: 1, updatedAt: null, inquiries: [] };
    }
    throw error;
  }
}

async function writeLocalDocument(inquiries) {
  const document = {
    version: 1,
    updatedAt: new Date().toISOString(),
    inquiries: sortInquiries(inquiries).map(normalizeStoredInquiry)
  };
  await fs.mkdir(path.dirname(LOCAL_INQUIRIES_PATH), { recursive: true });
  await fs.writeFile(LOCAL_INQUIRIES_PATH, `${JSON.stringify(document, null, 2)}\n`, 'utf8');
  return document;
}

async function readPrivateInquiryRecord(pathname, blobClient) {
  const client = blobClient || await import('@vercel/blob');
  const blob = await client.get(pathname, {
    access: 'private',
    useCache: false,
    ...inquiryBlobClientOptions()
  });
  if (!blob || blob.statusCode !== 200) return null;
  const raw = await blobToText(blob);
  if (!raw) return null;
  return {
    inquiry: normalizeStoredInquiry(JSON.parse(raw)),
    etag: cleanText(blob.blob?.etag || blob.etag, 200)
  };
}

async function readPrivateInquiry(pathname, blobClient) {
  const record = await readPrivateInquiryRecord(pathname, blobClient);
  return record ? record.inquiry : null;
}

async function writePrivateInquiry(inquiry, { ifMatch = '', blobClient } = {}) {
  const client = blobClient || await import('@vercel/blob');
  const pathname = inquiryPathForId(inquiry.id);
  await client.put(pathname, `${JSON.stringify(normalizeStoredInquiry(inquiry), null, 2)}\n`, {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
    ...(ifMatch ? { ifMatch } : {}),
    ...inquiryBlobClientOptions()
  });
  return inquiry;
}

function isBlobPreconditionFailedError(error, blobClient) {
  const ErrorClass = blobClient?.BlobPreconditionFailedError;
  return Boolean(
    (ErrorClass && error instanceof ErrorClass) ||
    error?.name === 'BlobPreconditionFailedError' ||
    /Precondition failed: ETag mismatch/i.test(String(error?.message || ''))
  );
}

async function mutatePrivateInquiry(
  id,
  mutator,
  { blobClient, maxAttempts = MAX_BLOB_MUTATION_ATTEMPTS } = {}
) {
  const pathname = inquiryPathForId(id);
  const client = blobClient || await import('@vercel/blob');
  for (let attempt = 0; attempt < Math.max(1, maxAttempts); attempt += 1) {
    const record = await readPrivateInquiryRecord(pathname, client);
    if (!record) {
      const error = new Error('Inquiry not found.');
      error.statusCode = 404;
      throw error;
    }
    const mutation = await mutator(record.inquiry);
    if (!mutation || mutation.changed === false) {
      return mutation || { inquiry: record.inquiry, changed: false };
    }
    if (!record.etag) {
      const error = new Error('Inquiry version is unavailable for a safe update.');
      error.statusCode = 503;
      throw error;
    }
    try {
      await writePrivateInquiry(mutation.inquiry, {
        ifMatch: record.etag,
        blobClient: client
      });
      return mutation;
    } catch (error) {
      if (!isBlobPreconditionFailedError(error, client) || attempt + 1 >= maxAttempts) {
        if (isBlobPreconditionFailedError(error, client)) {
          error.statusCode = 409;
          error.message = 'Inquiry changed concurrently. Please retry.';
        }
        throw error;
      }
    }
  }
  const error = new Error('Inquiry changed concurrently. Please retry.');
  error.statusCode = 409;
  throw error;
}

async function mutateLocalInquiry(id, mutator) {
  return serializeLocalInquiryOperation(async () => {
    const document = await readLocalDocument();
    const index = document.inquiries.findIndex(inquiry => inquiry.id === id);
    if (index === -1) {
      const error = new Error('Inquiry not found.');
      error.statusCode = 404;
      throw error;
    }
    const mutation = await mutator(document.inquiries[index]);
    if (!mutation || mutation.changed === false) {
      return mutation || { inquiry: document.inquiries[index], changed: false };
    }
    document.inquiries[index] = mutation.inquiry;
    await writeLocalDocument(document.inquiries);
    return mutation;
  });
}

async function mutateStoredInquiry(id, mutator, options = {}) {
  if (hasInquiryBlobStorage()) return mutatePrivateInquiry(id, mutator, options);
  if (!canUseLocalStorage()) throw storageUnavailableError();
  return mutateLocalInquiry(id, mutator);
}

async function listPrivateInquiries() {
  const { list } = await import('@vercel/blob');
  const blobs = [];
  let cursor;
  do {
    const page = await list({
      prefix: `${INQUIRIES_BLOB_PREFIX}/`,
      limit: 1000,
      ...(cursor ? { cursor } : {}),
      ...inquiryBlobClientOptions()
    });
    blobs.push(...page.blobs.filter(blob => blob.pathname.endsWith('.json')));
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);

  const recentBlobs = blobs
    .sort((a, b) => b.pathname.localeCompare(a.pathname))
    .slice(0, 500);
  const inquiries = [];
  for (let index = 0; index < recentBlobs.length; index += 20) {
    const batch = recentBlobs.slice(index, index + 20);
    const results = await Promise.all(batch.map(blob => readPrivateInquiry(blob.pathname)));
    inquiries.push(...results.filter(Boolean));
  }
  return sortInquiries(inquiries);
}

async function createInquiry(input) {
  const validated = validateInquiryInput(input);
  const now = new Date();
  let inquiry = normalizeStoredInquiry({
    ...validated,
    id: createInquiryId(now, validated.submissionId),
    status: 'new',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    resolvedAt: null
  });
  inquiry = prepareMetaDelivery(inquiry, 'Lead', now).inquiry;

  if (hasInquiryBlobStorage()) {
    const existing = existingInquiryForRetry(
      await readPrivateInquiry(inquiryPathForId(inquiry.id)),
      inquiry
    );
    if (existing) return existing;
    await writePrivateInquiry(inquiry);
    return inquiry;
  }
  if (!canUseLocalStorage()) throw storageUnavailableError();

  return serializeLocalInquiryOperation(async () => {
    const document = await readLocalDocument();
    const existingIndex = document.inquiries.findIndex(item => item.id === inquiry.id);
    if (existingIndex !== -1) {
      return existingInquiryForRetry(document.inquiries[existingIndex], inquiry);
    }
    document.inquiries.push(inquiry);
    await writeLocalDocument(document.inquiries);
    return inquiry;
  });
}

async function listInquiries() {
  if (hasInquiryBlobStorage()) return listPrivateInquiries();
  if (!canUseLocalStorage()) throw storageUnavailableError();
  return serializeLocalInquiryOperation(async () => {
    const document = await readLocalDocument();
    return sortInquiries(document.inquiries);
  });
}

async function updateInquiryStatus(id, status, options = {}) {
  validateInquiryStatusUpdate(status, options);
  const now = new Date();
  const mutation = await mutateStoredInquiry(id, inquiry => {
    const previous = normalizeStoredInquiry(inquiry);
    let updated = transitionInquiryStatus(previous, status, options, now);
    const statusChanged = previous.status !== updated.status ||
      previous.disqualificationReason !== updated.disqualificationReason;
    let deliveryChanged = false;
    if (options.metaEventName) {
      const prepared = prepareMetaDelivery(updated, options.metaEventName, now);
      updated = prepared.inquiry;
      deliveryChanged = prepared.changed;
    }
    return {
      inquiry: updated,
      changed: statusChanged || deliveryChanged,
      statusChanged
    };
  });
  Object.defineProperty(mutation.inquiry, '_statusChanged', {
    value: Boolean(mutation.statusChanged),
    enumerable: false
  });
  return mutation.inquiry;
}

async function claimInquiryMetaDelivery(id, eventName, options = {}) {
  const now = options.now || new Date();
  const claimToken = cleanText(options.claimToken, 120) || crypto.randomUUID();
  return mutateStoredInquiry(id, inquiry => claimMetaDeliveryState(inquiry, eventName, {
    now,
    leaseMs: options.leaseMs,
    claimToken
  }), options);
}

async function queueInquiryMetaDelivery(id, eventName, options = {}) {
  const now = options.now || new Date();
  return mutateStoredInquiry(
    id,
    inquiry => prepareMetaDelivery(inquiry, eventName, now),
    options
  );
}

async function completeInquiryMetaDelivery(id, eventName, claimToken, outcome = {}, options = {}) {
  const now = options.now || new Date();
  return mutateStoredInquiry(
    id,
    inquiry => completeMetaDeliveryState(inquiry, eventName, claimToken, outcome, now),
    options
  );
}

module.exports = {
  INQUIRY_STATUSES,
  META_DELIVERY_EVENT_NAMES,
  META_DELIVERY_LEASE_MS,
  META_DELIVERY_STATUSES,
  claimInquiryMetaDelivery,
  claimMetaDeliveryState,
  completeInquiryMetaDelivery,
  completeMetaDeliveryState,
  createInquiryId,
  createInquiry,
  existingInquiryForRetry,
  inquiryPathForId,
  listInquiries,
  mutatePrivateInquiry,
  normalizeStoredInquiry,
  prepareMetaDelivery,
  queueInquiryMetaDelivery,
  serializeLocalInquiryOperation,
  storageMode,
  transitionInquiryStatus,
  updateInquiryStatus,
  validateInquiryStatusUpdate,
  validateInquiryInput
};
