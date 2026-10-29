const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const { createInquiryId, inquiryPathForId, validateInquiryInput } = require('../api/_inquiries');
const { buildInquiryNotification, notifyNewInquiry } = require('../api/_notifications');
const { checkRateLimit } = require('../api/_rate-limit');
const { publicAnalyticsConfig } = require('../api/public-config');
const { allowedContactOrigin } = require('../api/contact');
const { loadProducts } = require('../api/_cms');
const { LOCALES, renderStaticPage } = require('../api/_seo');

const ROOT = path.resolve(__dirname, '..');

function withEnv(values, callback) {
  const previous = Object.fromEntries(Object.keys(values).map(key => [key, process.env[key]]));
  Object.entries(values).forEach(([key, value]) => {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  });
  return Promise.resolve(callback()).finally(() => {
    Object.entries(previous).forEach(([key, value]) => {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    });
  });
}

function validInquiry(overrides = {}) {
  return {
    name: 'Buyer Name',
    company: 'Buyer Company',
    country: 'Brazil',
    businessRole: 'distributor',
    email: 'buyer@example.com',
    phone: '+55 11 0000 0000',
    product: 'lingerie',
    productName: 'H6896 | Bra Strap Elastic',
    itemNo: 'H6896',
    quantity: '30000m',
    tradeTerm: 'EXW',
    quoteCurrency: 'USD',
    message: 'Please quote this item.',
    sourceUrl: 'https://www.huaguielastic.com/contact.html?utm_source=meta',
    submissionId: '6f088b5d-244a-47c6-8dc6-76f8153d7ecb',
    landingPath: '/products/h6896',
    referrerHost: 'instagram.com',
    utmSource: 'meta',
    utmMedium: 'paid_social',
    utmCampaign: 'brazil_distributors',
    utmContent: 'factory_video',
    utmTerm: 'elastic_webbing',
    privacyConsent: 'accepted',
    ...overrides
  };
}

function loadAnalyticsRuntime({ sessionValue = '', consent = '', fetchConfig = '' } = {}) {
  const storage = initial => {
    const values = new Map(Object.entries(initial));
    return {
      getItem: key => values.get(key) || null,
      setItem: (key, value) => values.set(key, String(value)),
      removeItem: key => values.delete(key)
    };
  };
  const listeners = {};
  const sessionStorage = storage(sessionValue ? { huagui_session_attribution_v1: sessionValue } : {});
  const localStorage = storage(consent ? { huagui_analytics_consent_v1: consent } : {});
  const document = {
    cookie: '',
    referrer: '',
    documentElement: { lang: 'en' },
    head: { appendChild() {} },
    body: { appendChild() {} },
    addEventListener(name, handler) { listeners[name] = handler; },
    querySelector() { return null; },
    createElement() {
      return {
        dataset: {},
        addEventListener() {},
        appendChild() {},
        querySelector() { return { addEventListener() {} }; },
        remove() {},
        setAttribute() {}
      };
    }
  };
  const window = {
    document,
    sessionStorage,
    localStorage,
    HUAGUI_I18N: { locale: 'en' }
  };
  const context = {
    window,
    document,
    location: {
      pathname: '/products/h6896',
      search: '?utm_source=meta',
      origin: 'https://www.huaguielastic.com'
    },
    fetch: async () => ({ json: async () => ({ analytics: { measurementId: fetchConfig } }) }),
    URL,
    URLSearchParams,
    console,
    setTimeout,
    clearTimeout
  };
  vm.runInNewContext(
    fs.readFileSync(path.join(ROOT, 'huagui_company_site', 'assets', 'js', 'analytics.js'), 'utf8'),
    context
  );
  return { listeners, localStorage, sessionStorage, window };
}

test('inquiry validation preserves only bounded attribution fields and submission retries share an ID', () => {
  const input = validInquiry({ utmCampaign: 'x'.repeat(400) });
  const output = validateInquiryInput(input);
  assert.equal(output.landingPath, '/products/h6896');
  assert.equal(output.referrerHost, 'instagram.com');
  assert.equal(output.utmSource, 'meta');
  assert.equal(output.utmCampaign.length, 200);
  const now = new Date('2026-10-29T01:00:00.000Z');
  const id = createInquiryId(now, input.submissionId);
  assert.equal(id, createInquiryId(now, input.submissionId));
  assert.match(id, /^HG-20261029-[A-F0-9]{16}$/);
  assert.notEqual(id, createInquiryId(now, `${input.submissionId}-new`));
  assert.equal(inquiryPathForId('HG-20261029-ABCDEF12'), 'inquiries/2026/10/HG-20261029-ABCDEF12.json');
  assert.equal(inquiryPathForId('HG-20261029-ABCDEF1234567890'), 'inquiries/2026/10/HG-20261029-ABCDEF1234567890.json');
});

test('notification content escapes customer HTML and uses an idempotency key', async () => {
  const inquiry = {
    ...validInquiry(),
    id: 'HG-20261029-ABCDEF12',
    createdAt: '2026-10-29T01:00:00.000Z',
    company: '<img src=x onerror=alert(1)>'
  };
  const message = buildInquiryNotification(inquiry);
  assert.doesNotMatch(message.html, /<img src=x/i);
  assert.match(message.html, /&lt;img src=x onerror=alert\(1\)&gt;/);

  let request;
  await withEnv({
    RESEND_API_KEY: 'test-key',
    INQUIRY_NOTIFICATION_TO: 'sales@huaguielastic.com',
    INQUIRY_NOTIFICATION_FROM: 'Huagui Website <website@example.com>'
  }, async () => {
    const result = await notifyNewInquiry(inquiry, {
      fetchImpl: async (url, options) => {
        request = { url, options };
        return { ok: true, status: 200, json: async () => ({ id: 'email_123' }) };
      }
    });
    assert.deepEqual(result, { sent: true, id: 'email_123' });
  });
  assert.equal(request.url, 'https://api.resend.com/emails');
  assert.equal(request.options.headers['Idempotency-Key'], `inquiry/${inquiry.id}`);
  const body = JSON.parse(request.options.body);
  assert.equal(body.reply_to, inquiry.email);
  assert.equal(body.to[0], 'sales@huaguielastic.com');
});

test('notification safely skips when email provider variables are absent', async () => {
  await withEnv({
    RESEND_API_KEY: undefined,
    INQUIRY_NOTIFICATION_TO: undefined,
    INQUIRY_NOTIFICATION_FROM: undefined
  }, async () => {
    const result = await notifyNewInquiry({ id: 'HG-20261029-ABCDEF12' }, {
      fetchImpl: async () => { throw new Error('fetch must not run'); }
    });
    assert.deepEqual(result, { sent: false, reason: 'not-configured' });
  });
});

test('notification aborts a stalled provider request', async () => {
  await withEnv({
    RESEND_API_KEY: 'test-key',
    INQUIRY_NOTIFICATION_TO: 'sales@huaguielastic.com',
    INQUIRY_NOTIFICATION_FROM: 'Huagui Website <website@example.com>'
  }, async () => {
    await assert.rejects(
      notifyNewInquiry({ ...validInquiry(), id: 'HG-20261029-ABCDEF1234567890' }, {
        timeoutMs: 10,
        fetchImpl: async (url, options) => new Promise((resolve, reject) => {
          options.signal.addEventListener('abort', () => reject(Object.assign(new Error('aborted'), { name: 'AbortError' })));
        })
      }),
      error => error.name === 'AbortError'
    );
  });
});

test('analytics attribution storage is allow-listed and denied events are not replayed later', async () => {
  const malicious = JSON.stringify({
    landingPath: '/first',
    utmSource: 'meta',
    utmCampaign: 'x'.repeat(300),
    name: 'Injected Buyer',
    message: 'Injected message',
    privacyConsent: 'accepted',
    submissionId: 'attacker-controlled'
  });
  const runtime = loadAnalyticsRuntime({
    sessionValue: malicious,
    consent: 'denied',
    fetchConfig: 'G-TEST12345'
  });
  const attribution = runtime.window.HUAGUI_ANALYTICS.getAttribution();
  assert.deepEqual(Object.keys(attribution).sort(), [
    'landingPath', 'referrerHost', 'utmCampaign', 'utmContent', 'utmMedium', 'utmSource', 'utmTerm'
  ]);
  assert.equal(attribution.utmCampaign.length, 200);
  assert.equal('name' in attribution, false);
  runtime.window.HUAGUI_ANALYTICS.track('view_product', { product_slug: 'h6896' });
  runtime.localStorage.setItem('huagui_analytics_consent_v1', 'granted');
  await runtime.window.HUAGUI_ANALYTICS.init();
  const commands = (runtime.window.dataLayer || []).map(entry => Array.from(entry));
  assert.equal(commands.some(entry => entry[0] === 'event' && entry[1] === 'view_product'), false);
});

test('public analytics config accepts only GA4 measurement IDs', async () => {
  await withEnv({ GA4_MEASUREMENT_ID: 'G-ABC1234567' }, () => {
    assert.deepEqual(publicAnalyticsConfig(), { measurementId: 'G-ABC1234567' });
  });
  await withEnv({ GA4_MEASUREMENT_ID: 'not-a-measurement-id' }, () => {
    assert.deepEqual(publicAnalyticsConfig(), { measurementId: '' });
  });
});

test('contact origin checks reject cross-site fetches while allowing production and previews', () => {
  assert.equal(allowedContactOrigin({ headers: { 'sec-fetch-site': 'cross-site', origin: 'https://evil.example' } }), false);
  assert.equal(allowedContactOrigin({ headers: { origin: 'https://www.huaguielastic.com', host: 'www.huaguielastic.com' } }), true);
  assert.equal(allowedContactOrigin({ headers: { origin: 'https://huagui-elastic-preview-abc-ezheng.vercel.app', host: 'preview.example' } }), true);
  assert.equal(allowedContactOrigin({ headers: { origin: 'https://evil.example', host: 'www.huaguielastic.com' } }), false);
});

test('fixed-window limiter returns a retry interval after the configured limit', () => {
  const options = { limit: 2, windowMs: 60_000, now: 1_000 };
  assert.equal(checkRateLimit('postlaunch-test', options).allowed, true);
  assert.equal(checkRateLimit('postlaunch-test', options).allowed, true);
  const blocked = checkRateLimit('postlaunch-test', options);
  assert.equal(blocked.allowed, false);
  assert.equal(blocked.retryAfter, 60);
});

test('all public pages load the consent-aware analytics layer and privacy copy is localized', async () => {
  const pages = ['index', 'products', 'service', 'factory', 'exhibitions', 'faq', 'about', 'contact', 'privacy'];
  pages.forEach(page => {
    const source = fs.readFileSync(path.join(ROOT, 'huagui_company_site', `${page}.html`), 'utf8');
    assert.match(source, /assets\/js\/analytics\.js\?v=postlaunch-20261029a/);
  });
  const productSource = fs.readFileSync(path.join(ROOT, 'huagui_company_site', 'product-detail.html'), 'utf8');
  assert.match(productSource, /assets\/js\/analytics\.js\?v=postlaunch-20261029a/);

  const products = await loadProducts({ includeDrafts: false });
  for (const locale of LOCALES.filter(value => value !== 'en')) {
    const html = renderStaticPage({ page: 'privacy', locale, products });
    assert.doesNotMatch(html, /We also record the inquiry source page/i, `${locale} attribution copy remained English`);
    assert.doesNotMatch(html, /If Google Analytics is configured/i, `${locale} analytics copy remained English`);
  }
});

test('Vercel applies baseline security headers to every route', () => {
  const config = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));
  const globalHeaders = config.headers.find(rule => rule.source === '/(.*)')?.headers || [];
  const values = Object.fromEntries(globalHeaders.map(header => [header.key.toLowerCase(), header.value]));
  assert.equal(values['x-content-type-options'], 'nosniff');
  assert.equal(values['x-frame-options'], 'DENY');
  assert.equal(values['referrer-policy'], 'strict-origin-when-cross-origin');
  assert.match(values['permissions-policy'], /camera=\(\)/);
  assert.match(values['content-security-policy'], /frame-ancestors 'none'/);
  assert.match(values['content-security-policy'], /www\.googletagmanager\.com/);
});
