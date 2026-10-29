const crypto = require('crypto');
const net = require('net');

const META_EVENT_NAMES = new Set([
  'Lead',
  'QualifiedLead',
  'QuoteSent',
  'SampleSent',
  'OrderWon'
]);

function cleanText(value, maxLength) {
  return String(value || '')
    .replace(/\u0000/g, '')
    .trim()
    .slice(0, maxLength);
}

function metaConfig() {
  const pixelId = cleanText(process.env.META_PIXEL_ID, 40);
  const datasetId = cleanText(process.env.META_DATASET_ID, 40);
  const accessToken = cleanText(process.env.META_CAPI_ACCESS_TOKEN, 2000);
  const graphApiVersion = cleanText(process.env.META_GRAPH_API_VERSION, 20);
  const testEventCode = cleanText(process.env.META_TEST_EVENT_CODE, 120);
  const validId = value => /^\d{8,30}$/.test(value);
  return {
    pixelId: validId(pixelId) ? pixelId : '',
    datasetId: validId(datasetId) && datasetId === pixelId ? datasetId : '',
    accessToken: accessToken.length >= 20 ? accessToken : '',
    graphApiVersion: /^v\d{1,3}\.\d{1,2}$/.test(graphApiVersion) ? graphApiVersion : '',
    testEventCode
  };
}

function publicMetaConfig() {
  return { pixelId: metaConfig().pixelId };
}

function normalizeMetaBrowserToken(value) {
  const token = cleanText(value, 255);
  return /^fb\.\d\.\d{10,13}\.[A-Za-z0-9_-]{1,200}$/.test(token) ? token : '';
}

function safeEventSourceUrl(value) {
  try {
    const url = new URL(cleanText(value, 500));
    const hostname = url.hostname.toLowerCase();
    const allowed = hostname === 'huaguielastic.com' ||
      hostname === 'www.huaguielastic.com' ||
      (hostname.startsWith('huagui-elastic-preview') && hostname.endsWith('.vercel.app'));
    if (url.protocol !== 'https:' || !allowed) return '';
    url.search = '';
    url.hash = '';
    return url.toString().slice(0, 500);
  } catch {
    return '';
  }
}

function requestMetaContext(req, body = {}) {
  const forwarded = cleanText(req?.headers?.['x-forwarded-for'], 200).split(',')[0].trim();
  const directIp = cleanText(req?.headers?.['x-real-ip'] || req?.socket?.remoteAddress, 80);
  const candidateIp = forwarded || directIp;
  const marketingConsent = body.marketingConsent === 'granted';
  return {
    marketingConsent,
    fbp: marketingConsent ? normalizeMetaBrowserToken(body.metaFbp) : '',
    fbc: marketingConsent ? normalizeMetaBrowserToken(body.metaFbc) : '',
    eventSourceUrl: marketingConsent
      ? safeEventSourceUrl(body.metaEventSourceUrl || body.sourceUrl)
      : '',
    clientIpAddress: net.isIP(candidateIp) ? candidateIp : '',
    clientUserAgent: cleanText(req?.headers?.['user-agent'], 512)
  };
}

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function normalizedEmail(value) {
  const email = cleanText(value, 254).toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : '';
}

function normalizedPhone(value) {
  return cleanText(value, 80).replace(/\D/g, '').slice(0, 20);
}

function buildUserData(inquiry, context = {}) {
  const userData = {};
  const email = normalizedEmail(inquiry?.email);
  const phone = normalizedPhone(inquiry?.phone);
  if (email) userData.em = [sha256(email)];
  if (phone) userData.ph = [sha256(phone)];
  if (context.clientIpAddress && net.isIP(context.clientIpAddress)) {
    userData.client_ip_address = context.clientIpAddress;
  }
  if (context.clientUserAgent) userData.client_user_agent = cleanText(context.clientUserAgent, 512);
  const fbp = normalizeMetaBrowserToken(context.fbp || inquiry?.metaFbp);
  const fbc = normalizeMetaBrowserToken(context.fbc || inquiry?.metaFbc);
  if (fbp) userData.fbp = fbp;
  if (fbc) userData.fbc = fbc;
  return userData;
}

function buildCustomData(inquiry) {
  const customData = {};
  const category = cleanText(inquiry?.product, 40);
  const currency = cleanText(inquiry?.quoteCurrency, 3).toUpperCase();
  if (['mens', 'womens', 'lingerie', 'activewear', 'binding', 'other'].includes(category)) {
    customData.content_category = category;
  }
  if (/^(?:USD|CNY)$/.test(currency)) customData.currency = currency;
  return customData;
}

function metaEventId(inquiryId, eventName) {
  const id = cleanText(inquiryId, 80);
  if (!id) return '';
  return eventName === 'Lead' ? id : `${id}:${eventName}`;
}

function buildMetaFunnelEvent(inquiry, eventName, context = {}, now = new Date()) {
  if (!META_EVENT_NAMES.has(eventName)) {
    const error = new Error('Unsupported Meta funnel event.');
    error.statusCode = 400;
    throw error;
  }
  const inquiryId = cleanText(inquiry?.id, 80);
  if (!inquiryId) {
    const error = new Error('Inquiry ID is required for Meta event deduplication.');
    error.statusCode = 400;
    throw error;
  }
  const storedConsent = inquiry?.marketingConsent === true || inquiry?.marketingConsent === 'granted';
  if (!storedConsent) return null;
  const timestamp = now instanceof Date ? now : new Date(now);
  const eventSourceUrl = safeEventSourceUrl(
    context.eventSourceUrl || inquiry?.metaEventSourceUrl || inquiry?.sourceUrl
  ) || 'https://www.huaguielastic.com/contact.html';
  return {
    event_name: eventName,
    event_time: Math.floor(timestamp.getTime() / 1000),
    event_id: metaEventId(inquiryId, eventName),
    action_source: 'website',
    event_source_url: eventSourceUrl,
    user_data: buildUserData(inquiry, context),
    custom_data: buildCustomData(inquiry)
  };
}

async function sendMetaFunnelEvent(
  inquiry,
  eventName,
  { context = {}, fetchImpl = global.fetch, timeoutMs = 5000, now = new Date() } = {}
) {
  const event = buildMetaFunnelEvent(inquiry, eventName, context, now);
  if (!event) return { sent: false, reason: 'no-marketing-consent' };
  const config = metaConfig();
  if (!config.datasetId || !config.accessToken || !config.graphApiVersion) {
    return { sent: false, reason: 'not-configured', eventId: event.event_id };
  }

  const body = { data: [event] };
  if (config.testEventCode) body.test_event_code = config.testEventCode;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), Math.max(1, timeoutMs));
  let response;
  try {
    response = await fetchImpl(
      `https://graph.facebook.com/${config.graphApiVersion}/${config.datasetId}/events`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
        signal: controller.signal
      }
    );
  } finally {
    clearTimeout(timer);
  }
  if (!response.ok) {
    const error = new Error(`Meta Conversions API returned HTTP ${response.status}.`);
    error.statusCode = response.status;
    throw error;
  }
  const result = await response.json().catch(() => ({}));
  return {
    sent: true,
    eventId: event.event_id,
    eventsReceived: Number(result.events_received || 0),
    traceId: cleanText(result.fbtrace_id, 120)
  };
}

function sendMetaLeadEvent(inquiry, options) {
  return sendMetaFunnelEvent(inquiry, 'Lead', options);
}

module.exports = {
  META_EVENT_NAMES,
  buildMetaFunnelEvent,
  buildUserData,
  metaConfig,
  metaEventId,
  normalizeMetaBrowserToken,
  publicMetaConfig,
  requestMetaContext,
  safeEventSourceUrl,
  sendMetaFunnelEvent,
  sendMetaLeadEvent
};
