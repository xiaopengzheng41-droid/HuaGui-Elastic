const {
  claimInquiryMetaDelivery,
  completeInquiryMetaDelivery,
  createInquiry,
  queueInquiryMetaDelivery
} = require('./_inquiries');
const { parseJsonBody, sendError, sendJson } = require('./_cms');
const { requestMetaContext, sendMetaLeadEvent } = require('./_meta');
const { notifyNewInquiry } = require('./_notifications');
const { applyRateLimit } = require('./_rate-limit');

async function deliverMetaLead(
  inquiry,
  metaContext,
  {
    queueDelivery = queueInquiryMetaDelivery,
    claimDelivery = claimInquiryMetaDelivery,
    completeDelivery = completeInquiryMetaDelivery,
    sendEvent = sendMetaLeadEvent
  } = {}
) {
  const queued = await queueDelivery(inquiry.id, 'Lead');
  const claim = await claimDelivery(queued.inquiry.id, 'Lead');
  if (!claim.claimed) {
    return { inquiry: claim.inquiry, delivery: claim.delivery };
  }

  let outcome;
  try {
    const eventTime = new Date(claim.delivery?.createdAt || claim.inquiry.createdAt || Date.now());
    const provider = await sendEvent(claim.inquiry, {
      context: metaContext,
      now: Number.isNaN(eventTime.getTime()) ? new Date() : eventTime
    });
    if (provider.sent) {
      outcome = {
        status: 'sent',
        eventId: provider.eventId,
        traceId: provider.traceId
      };
    } else if (provider.reason === 'no-marketing-consent') {
      outcome = { status: 'skipped', reason: provider.reason };
    } else {
      outcome = {
        status: 'failed',
        reason: provider.reason || 'provider-did-not-accept',
        error: provider.reason || 'Meta did not accept the event.',
        eventId: provider.eventId
      };
    }
  } catch (metaError) {
    console.error('Meta Lead event failed', {
      inquiryId: claim.inquiry.id,
      error: metaError.message
    });
    outcome = {
      status: 'failed',
      reason: 'provider-error',
      error: metaError.message
    };
  }
  const completed = await completeDelivery(
    claim.inquiry.id,
    'Lead',
    claim.claimToken,
    outcome
  );
  return { inquiry: completed.inquiry, delivery: completed.delivery };
}

function allowedContactOrigin(req) {
  const fetchSite = String(req.headers['sec-fetch-site'] || '').toLowerCase();
  if (fetchSite === 'cross-site') return false;

  const origin = String(req.headers.origin || '').trim();
  if (!origin) return true;
  try {
    const url = new URL(origin);
    const hostname = url.hostname.toLowerCase();
    const requestHost = String(req.headers.host || '').toLowerCase();
    const configured = String(process.env.CONTACT_ALLOWED_ORIGINS || '')
      .split(',')
      .map(value => value.trim())
      .filter(Boolean);
    if (url.host.toLowerCase() === requestHost) return true;
    if (configured.includes(url.origin)) return true;
    if (['huaguielastic.com', 'www.huaguielastic.com'].includes(hostname)) return true;
    if (['localhost', '127.0.0.1'].includes(hostname)) return true;
    return hostname.endsWith('.vercel.app') && hostname.startsWith('huagui-elastic-preview');
  } catch {
    return false;
  }
}

module.exports = async function contactHandler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendError(res, 405, 'Method not allowed');
  }

  const contentType = String(req.headers['content-type'] || '').split(';')[0].trim().toLowerCase();
  if (contentType !== 'application/json') {
    return sendError(res, 415, 'Content-Type must be application/json.');
  }
  if (!allowedContactOrigin(req)) {
    return sendError(res, 403, 'Cross-site inquiry submissions are not allowed.');
  }
  const rateLimit = applyRateLimit(req, res, 'contact', {
    limit: 5,
    windowMs: 10 * 60 * 1000
  });
  if (!rateLimit.allowed) {
    return sendError(res, 429, 'Too many inquiry attempts. Please wait and try again.');
  }

  try {
    const body = await parseJsonBody(req, 32 * 1024);

    // Honeypot fields are hidden from real visitors. Return a neutral response to bots.
    if (String(body.website || '').trim()) {
      return sendJson(res, 201, { ok: true }, { 'Cache-Control': 'no-store' });
    }

    const metaContext = requestMetaContext(req, body);
    let inquiry = await createInquiry({
      ...body,
      marketingConsent: metaContext.marketingConsent,
      metaFbp: metaContext.fbp,
      metaFbc: metaContext.fbc,
      metaEventSourceUrl: metaContext.eventSourceUrl,
      sourceUrl: body.sourceUrl || req.headers.referer || ''
    });
    try {
      await notifyNewInquiry(inquiry);
    } catch (notificationError) {
      console.error('Inquiry notification failed', {
        inquiryId: inquiry.id,
        error: notificationError.message
      });
    }
    try {
      const metaDelivery = await deliverMetaLead(inquiry, metaContext);
      inquiry = metaDelivery.inquiry;
    } catch (metaDeliveryError) {
      console.error('Meta Lead delivery state failed', {
        inquiryId: inquiry.id,
        error: metaDeliveryError.message
      });
    }
    return sendJson(res, 201, {
      ok: true,
      inquiry: {
        id: inquiry.id,
        createdAt: inquiry.createdAt
      }
    }, {
      'Cache-Control': 'no-store'
    });
  } catch (error) {
    const statusCode = error.statusCode || (error instanceof SyntaxError ? 400 : 500);
    return sendError(res, statusCode, error.message || 'Unable to submit inquiry');
  }
};

module.exports.allowedContactOrigin = allowedContactOrigin;
module.exports.deliverMetaLead = deliverMetaLead;
