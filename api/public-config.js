const { sendError, sendJson } = require('./_cms');

function publicAnalyticsConfig() {
  const measurementId = String(process.env.GA4_MEASUREMENT_ID || '').trim().toUpperCase();
  return {
    measurementId: /^G-[A-Z0-9]{4,20}$/.test(measurementId) ? measurementId : ''
  };
}

module.exports = async function publicConfigHandler(req, res) {
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=300, stale-while-revalidate=600');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return sendError(res, 405, 'Method not allowed');
  }
  return sendJson(res, 200, {
    ok: true,
    analytics: publicAnalyticsConfig()
  });
};

module.exports.publicAnalyticsConfig = publicAnalyticsConfig;
