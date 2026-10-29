const { createInquiry } = require('./_inquiries');
const { parseJsonBody, sendError, sendJson } = require('./_cms');
const { notifyNewInquiry } = require('./_notifications');
const { applyRateLimit } = require('./_rate-limit');

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

    const inquiry = await createInquiry({
      ...body,
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
