const buckets = new Map();

function clientAddress(req) {
  const forwarded = String(
    req.headers['x-vercel-forwarded-for'] ||
    req.headers['x-forwarded-for'] ||
    req.headers['x-real-ip'] ||
    ''
  ).split(',')[0].trim();
  return forwarded || req.socket?.remoteAddress || 'unknown';
}

function pruneBuckets(now) {
  if (buckets.size < 2000) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

function checkRateLimit(key, { limit, windowMs, now = Date.now() }) {
  pruneBuckets(now);
  const existing = buckets.get(key);
  const bucket = !existing || existing.resetAt <= now
    ? { count: 0, resetAt: now + windowMs }
    : existing;

  bucket.count += 1;
  buckets.set(key, bucket);
  const remaining = Math.max(0, limit - bucket.count);
  return {
    allowed: bucket.count <= limit,
    limit,
    remaining,
    resetAt: bucket.resetAt,
    retryAfter: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000))
  };
}

function applyRateLimit(req, res, namespace, options) {
  const result = checkRateLimit(`${namespace}:${clientAddress(req)}`, options);
  res.setHeader('RateLimit-Limit', String(result.limit));
  res.setHeader('RateLimit-Remaining', String(result.remaining));
  res.setHeader('RateLimit-Reset', String(Math.ceil(result.resetAt / 1000)));
  if (!result.allowed) res.setHeader('Retry-After', String(result.retryAfter));
  return result;
}

module.exports = {
  applyRateLimit,
  checkRateLimit,
  clientAddress
};
