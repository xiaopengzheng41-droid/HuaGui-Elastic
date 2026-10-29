const test = require('node:test');
const assert = require('node:assert/strict');

const {
  INQUIRY_STATUSES,
  META_DELIVERY_LEASE_MS,
  claimMetaDeliveryState,
  completeMetaDeliveryState,
  mutatePrivateInquiry,
  normalizeStoredInquiry,
  prepareMetaDelivery,
  serializeLocalInquiryOperation,
  transitionInquiryStatus,
  validateInquiryInput,
  validateInquiryStatusUpdate
} = require('../api/_inquiries');
const { deliverMetaStageEvent } = require('../api/admin/inquiries');
const { deliverMetaLead } = require('../api/contact');

function legacyInquiry(overrides = {}) {
  return {
    id: 'HG-20261029-ABCDEF1234567890',
    status: 'new',
    name: 'Buyer',
    company: 'Buyer Co.',
    country: 'Brazil',
    businessRole: 'distributor',
    email: 'buyer@example.com',
    message: 'Please quote.',
    privacyConsent: true,
    createdAt: '2026-10-29T08:00:00.000Z',
    updatedAt: '2026-10-29T08:00:00.000Z',
    ...overrides
  };
}

test('funnel keeps legacy statuses and adds the complete B2B sales stages', () => {
  assert.deepEqual(INQUIRY_STATUSES, [
    'new',
    'read',
    'qualified',
    'quoted',
    'sample_sent',
    'won',
    'disqualified',
    'resolved'
  ]);

  const legacyResolved = normalizeStoredInquiry(legacyInquiry({
    status: 'resolved',
    resolvedAt: '2026-10-29T09:00:00.000Z'
  }));
  assert.equal(legacyResolved.status, 'resolved');
  assert.equal(legacyResolved.resolvedAt, '2026-10-29T09:00:00.000Z');
  assert.deepEqual(legacyResolved.statusHistory, []);
});

test('status transitions preserve history and stage timestamps', () => {
  const qualified = transitionInquiryStatus(
    legacyInquiry(),
    'qualified',
    {},
    new Date('2026-10-29T09:00:00.000Z')
  );
  assert.equal(qualified.status, 'qualified');
  assert.equal(qualified.qualifiedAt, '2026-10-29T09:00:00.000Z');
  assert.deepEqual(qualified.statusHistory, [{
    fromStatus: 'new',
    status: 'qualified',
    changedAt: '2026-10-29T09:00:00.000Z',
    reason: ''
  }]);

  const quoted = transitionInquiryStatus(
    qualified,
    'quoted',
    {},
    new Date('2026-10-29T10:00:00.000Z')
  );
  assert.equal(quoted.status, 'quoted');
  assert.equal(quoted.qualifiedAt, '2026-10-29T09:00:00.000Z');
  assert.equal(quoted.quotedAt, '2026-10-29T10:00:00.000Z');
  assert.equal(quoted.statusHistory.length, 2);
});

test('disqualification requires and stores a bounded reason', () => {
  assert.throws(
    () => validateInquiryStatusUpdate('disqualified', {}),
    /reason is required/i
  );
  const reason = 'Quantity is below the production MOQ.';
  const disqualified = transitionInquiryStatus(
    legacyInquiry(),
    'disqualified',
    { disqualificationReason: reason },
    new Date('2026-10-29T11:00:00.000Z')
  );
  assert.equal(disqualified.disqualificationReason, reason);
  assert.equal(disqualified.disqualifiedAt, '2026-10-29T11:00:00.000Z');
  assert.equal(disqualified.statusHistory[0].reason, reason);

  const reopened = transitionInquiryStatus(
    disqualified,
    'read',
    {},
    new Date('2026-10-29T12:00:00.000Z')
  );
  assert.equal(reopened.status, 'read');
  assert.equal(reopened.disqualificationReason, '');
  assert.equal(reopened.disqualifiedAt, null);
  assert.equal(reopened.statusHistory.length, 2);
});

test('repeating the same stage is idempotent', () => {
  const inquiry = normalizeStoredInquiry(legacyInquiry({ status: 'read' }));
  const repeated = transitionInquiryStatus(
    inquiry,
    'read',
    {},
    new Date('2026-10-29T13:00:00.000Z')
  );
  assert.equal(repeated.updatedAt, inquiry.updatedAt);
  assert.deepEqual(repeated.statusHistory, []);
});

test('status transition metadata can prevent duplicate downstream events', () => {
  const original = normalizeStoredInquiry(legacyInquiry({ status: 'qualified' }));
  const repeated = transitionInquiryStatus(
    original,
    'qualified',
    {},
    new Date('2026-10-29T14:00:00.000Z')
  );
  assert.equal(repeated.updatedAt, original.updatedAt);

  const quoted = transitionInquiryStatus(
    original,
    'quoted',
    {},
    new Date('2026-10-29T14:00:00.000Z')
  );
  assert.notEqual(quoted.updatedAt, original.updatedAt);
});

test('inquiry validation stores only bounded Meta attribution fields', () => {
  const inquiry = validateInquiryInput({
    name: 'Buyer',
    company: 'Buyer Co.',
    country: 'Brazil',
    businessRole: 'distributor',
    email: 'buyer@example.com',
    message: 'Please quote.',
    privacyConsent: 'accepted',
    marketingConsent: 'accepted',
    metaFbp: 'x'.repeat(400),
    metaFbc: 'y'.repeat(400),
    metaEventSourceUrl: `https://example.com/${'z'.repeat(600)}`
  });
  assert.equal(inquiry.marketingConsent, true);
  assert.equal(inquiry.metaFbp.length, 255);
  assert.equal(inquiry.metaFbc.length, 255);
  assert.equal(inquiry.metaEventSourceUrl.length, 500);

  const denied = validateInquiryInput({
    name: 'Buyer',
    company: 'Buyer Co.',
    country: 'Brazil',
    businessRole: 'distributor',
    email: 'buyer@example.com',
    message: 'Please quote.',
    privacyConsent: 'accepted',
    marketingConsent: false,
    metaFbp: 'fb.1.123.456',
    metaFbc: 'fb.1.123.click',
    metaEventSourceUrl: 'https://www.huaguielastic.com/contact.html'
  });
  assert.equal(denied.marketingConsent, false);
  assert.equal(denied.metaFbp, '');
  assert.equal(denied.metaFbc, '');
  assert.equal(denied.metaEventSourceUrl, '');
});

test('Meta stage delivery is claimed once, can retry after failure, and stays sent', () => {
  const base = legacyInquiry({ marketingConsent: true, status: 'qualified' });
  const prepared = prepareMetaDelivery(base, 'QualifiedLead', new Date('2026-10-29T14:00:00.000Z'));
  assert.equal(prepared.delivery.status, 'pending');

  const first = claimMetaDeliveryState(prepared.inquiry, 'QualifiedLead', {
    now: new Date('2026-10-29T14:00:01.000Z'),
    claimToken: 'claim-1'
  });
  assert.equal(first.claimed, true);
  assert.equal(first.delivery.status, 'sending');
  assert.equal(first.delivery.attempts, 1);

  const duplicate = claimMetaDeliveryState(first.inquiry, 'QualifiedLead', {
    now: new Date('2026-10-29T14:00:02.000Z'),
    claimToken: 'claim-2'
  });
  assert.equal(duplicate.claimed, false);
  assert.equal(duplicate.delivery.claimToken, 'claim-1');

  const failed = completeMetaDeliveryState(
    first.inquiry,
    'QualifiedLead',
    'claim-1',
    { status: 'failed', reason: 'provider-error', error: 'HTTP 503' },
    new Date('2026-10-29T14:00:03.000Z')
  );
  assert.equal(failed.completed, true);
  assert.equal(failed.delivery.status, 'failed');

  const retry = claimMetaDeliveryState(failed.inquiry, 'QualifiedLead', {
    now: new Date('2026-10-29T14:00:04.000Z'),
    claimToken: 'claim-3'
  });
  assert.equal(retry.claimed, true);
  assert.equal(retry.delivery.attempts, 2);

  const sent = completeMetaDeliveryState(
    retry.inquiry,
    'QualifiedLead',
    'claim-3',
    { status: 'sent', eventId: 'inquiry:QualifiedLead', traceId: 'trace' },
    new Date('2026-10-29T14:00:05.000Z')
  );
  assert.equal(sent.delivery.status, 'sent');
  const afterSent = claimMetaDeliveryState(sent.inquiry, 'QualifiedLead', {
    now: new Date('2026-10-29T14:00:06.000Z'),
    claimToken: 'claim-4'
  });
  assert.equal(afterSent.claimed, false);
  assert.equal(afterSent.delivery.status, 'sent');
});

test('stale sending leases are reclaimed without allowing stale completion to overwrite', () => {
  const first = claimMetaDeliveryState(
    legacyInquiry({ marketingConsent: true, status: 'quoted' }),
    'QuoteSent',
    {
      now: new Date('2026-10-29T15:00:00.000Z'),
      claimToken: 'stale-claim'
    }
  );
  const reclaimed = claimMetaDeliveryState(first.inquiry, 'QuoteSent', {
    now: new Date(new Date('2026-10-29T15:00:00.000Z').getTime() + META_DELIVERY_LEASE_MS + 1),
    claimToken: 'fresh-claim'
  });
  assert.equal(reclaimed.claimed, true);
  assert.equal(reclaimed.delivery.attempts, 2);
  assert.equal(reclaimed.delivery.claimToken, 'fresh-claim');

  const staleCompletion = completeMetaDeliveryState(
    reclaimed.inquiry,
    'QuoteSent',
    'stale-claim',
    { status: 'sent' },
    new Date('2026-10-29T15:03:00.000Z')
  );
  assert.equal(staleCompletion.completed, false);
  assert.equal(staleCompletion.delivery.status, 'sending');
  assert.equal(staleCompletion.delivery.claimToken, 'fresh-claim');
});

test('Meta stage delivery is persistently skipped when marketing consent is absent', () => {
  const prepared = prepareMetaDelivery(
    legacyInquiry({ marketingConsent: false, status: 'won' }),
    'OrderWon',
    new Date('2026-10-29T16:00:00.000Z')
  );
  assert.equal(prepared.delivery.status, 'skipped');
  assert.equal(prepared.delivery.reason, 'no-marketing-consent');
  const claim = claimMetaDeliveryState(prepared.inquiry, 'OrderWon', {
    claimToken: 'never-used'
  });
  assert.equal(claim.claimed, false);
});

test('private inquiry mutation retries an ETag conflict using the latest record', async () => {
  class BlobPreconditionFailedError extends Error {}
  const versions = [
    legacyInquiry({ status: 'new' }),
    legacyInquiry({
      status: 'read',
      updatedAt: '2026-10-29T17:00:00.000Z',
      readAt: '2026-10-29T17:00:00.000Z',
      statusHistory: [{
        fromStatus: 'new',
        status: 'read',
        changedAt: '2026-10-29T17:00:00.000Z',
        reason: ''
      }]
    })
  ];
  let reads = 0;
  const puts = [];
  const blobClient = {
    BlobPreconditionFailedError,
    async get() {
      const index = Math.min(reads, versions.length - 1);
      reads += 1;
      return {
        statusCode: 200,
        text: async () => JSON.stringify(versions[index]),
        blob: { etag: `v${index + 1}` }
      };
    },
    async put(pathname, body, options) {
      puts.push({ pathname, body, options });
      if (puts.length === 1) throw new BlobPreconditionFailedError('conflict');
      return { pathname, etag: 'v3' };
    }
  };
  const result = await mutatePrivateInquiry(
    legacyInquiry().id,
    inquiry => ({
      inquiry: transitionInquiryStatus(
        inquiry,
        'qualified',
        {},
        new Date('2026-10-29T17:01:00.000Z')
      ),
      changed: true
    }),
    { blobClient, maxAttempts: 2 }
  );
  assert.equal(reads, 2);
  assert.equal(puts[0].options.ifMatch, 'v1');
  assert.equal(puts[1].options.ifMatch, 'v2');
  assert.equal(result.inquiry.status, 'qualified');
  assert.equal(result.inquiry.statusHistory[0].status, 'read');
  assert.equal(result.inquiry.statusHistory[1].fromStatus, 'read');
});

test('local inquiry mutations are serialized in call order', async () => {
  const order = [];
  await Promise.all([
    serializeLocalInquiryOperation(async () => {
      order.push('first-start');
      await new Promise(resolve => setTimeout(resolve, 10));
      order.push('first-end');
    }),
    serializeLocalInquiryOperation(async () => {
      order.push('second-start');
      order.push('second-end');
    })
  ]);
  assert.deepEqual(order, ['first-start', 'first-end', 'second-start', 'second-end']);
});

test('admin Meta delivery does not double-send an active claim and records retryable failure', async () => {
  const base = normalizeStoredInquiry(legacyInquiry({ marketingConsent: true, status: 'qualified' }));
  let sendCalls = 0;
  const inProgress = await deliverMetaStageEvent(base, 'QualifiedLead', {
    claimDelivery: async () => ({
      inquiry: base,
      claimed: false,
      delivery: { status: 'sending', attempts: 1, reason: '' }
    }),
    sendEvent: async () => {
      sendCalls += 1;
      return { sent: true };
    }
  });
  assert.equal(sendCalls, 0);
  assert.equal(inProgress.meta.status, 'sending');

  let completedOutcome;
  let sentAt;
  const failed = await deliverMetaStageEvent(base, 'QualifiedLead', {
    claimDelivery: async () => ({
      inquiry: base,
      claimed: true,
      claimToken: 'claim',
      delivery: {
        status: 'sending',
        attempts: 1,
        createdAt: '2026-10-29T13:59:00.000Z'
      }
    }),
    sendEvent: async (inquiry, eventName, options) => {
      sendCalls += 1;
      sentAt = options.now.toISOString();
      return { sent: false, reason: 'not-configured', eventId: `${base.id}:QualifiedLead` };
    },
    completeDelivery: async (id, eventName, claimToken, outcome) => {
      completedOutcome = { id, eventName, claimToken, outcome };
      return {
        inquiry: base,
        completed: true,
        delivery: {
          status: 'failed',
          attempts: 1,
          reason: outcome.reason
        }
      };
    }
  });
  assert.equal(sendCalls, 1);
  assert.equal(sentAt, '2026-10-29T13:59:00.000Z');
  assert.equal(completedOutcome.outcome.status, 'failed');
  assert.equal(completedOutcome.outcome.reason, 'not-configured');
  assert.equal(failed.meta.status, 'failed');
  assert.equal(failed.meta.retryable, true);
});

test('contact Lead delivery uses the same persistent claim and completion contract', async () => {
  const base = normalizeStoredInquiry(legacyInquiry({ marketingConsent: true }));
  let completedOutcome;
  let sentAt;
  const delivered = await deliverMetaLead(base, { marketingConsent: true }, {
    queueDelivery: async () => ({
      inquiry: prepareMetaDelivery(base, 'Lead', new Date('2026-10-29T18:00:00.000Z')).inquiry
    }),
    claimDelivery: async () => ({
      inquiry: base,
      claimed: true,
      claimToken: 'lead-claim',
      delivery: {
        status: 'sending',
        attempts: 1,
        createdAt: '2026-10-29T08:00:00.000Z'
      }
    }),
    sendEvent: async (inquiry, options) => {
      sentAt = options.now.toISOString();
      return {
        sent: false,
        reason: 'not-configured',
        eventId: base.id
      };
    },
    completeDelivery: async (id, eventName, claimToken, outcome) => {
      completedOutcome = { id, eventName, claimToken, outcome };
      return {
        inquiry: base,
        delivery: { status: 'failed', attempts: 1, reason: outcome.reason }
      };
    }
  });
  assert.equal(completedOutcome.eventName, 'Lead');
  assert.equal(sentAt, '2026-10-29T08:00:00.000Z');
  assert.equal(completedOutcome.outcome.status, 'failed');
  assert.equal(completedOutcome.outcome.reason, 'not-configured');
  assert.equal(delivered.delivery.status, 'failed');
});
