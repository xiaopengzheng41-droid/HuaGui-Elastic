const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const {
  buildMetaFunnelEvent,
  metaEventId,
  publicMetaConfig,
  requestMetaContext,
  sendMetaFunnelEvent,
  sendMetaLeadEvent
} = require('../api/_meta');
const { metaEventNameForStatus } = require('../api/admin/inquiries');

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

function inquiry(overrides = {}) {
  return {
    id: 'HG-20261029-ABCDEF1234567890',
    marketingConsent: true,
    email: 'Buyer@Example.com',
    phone: '+55 (11) 1234-5678',
    product: 'lingerie',
    productName: 'H6896 | Bra Strap Elastic',
    itemNo: 'H6896',
    quoteCurrency: 'USD',
    sourceUrl: 'https://www.huaguielastic.com/contact.html?utm_source=meta',
    metaFbp: 'fb.1.1793262562.1234567890',
    metaFbc: 'fb.1.1793262562.valid-click-id',
    ...overrides
  };
}

function browserRuntime({ consent, pixelId = '123456789012345', cookie = '' } = {}) {
  const values = new Map(consent ? [['huagui_measurement_consent_v2', JSON.stringify(consent)]] : []);
  const localStorage = {
    getItem: key => values.get(key) || null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: key => values.delete(key)
  };
  const sessionStorage = {
    getItem() { return null; },
    setItem() {},
    removeItem() {}
  };
  const document = {
    cookie,
    referrer: '',
    documentElement: { lang: 'en' },
    head: { appendChild() {} },
    body: { appendChild() {} },
    addEventListener() {},
    querySelector() { return null; },
    createElement() {
      return {
        dataset: {},
        addEventListener() {},
        appendChild() {},
        querySelector() { return null; },
        remove() {},
        setAttribute() {}
      };
    }
  };
  const window = { document, localStorage, sessionStorage, HUAGUI_I18N: { locale: 'en' } };
  const location = {
    pathname: '/contact.html',
    search: '?utm_source=meta',
    origin: 'https://www.huaguielastic.com',
    href: 'https://www.huaguielastic.com/contact.html?utm_source=meta'
  };
  const context = {
    window,
    document,
    location,
    fetch: async () => ({
      json: async () => ({ analytics: { measurementId: '' }, meta: { pixelId } })
    }),
    URL,
    URLSearchParams,
    console,
    setTimeout,
    clearTimeout,
    decodeURIComponent
  };
  vm.runInNewContext(
    fs.readFileSync(path.join(ROOT, 'huagui_company_site', 'assets', 'js', 'analytics.js'), 'utf8'),
    context
  );
  return { window, localStorage };
}

test('public Meta config exposes only a valid numeric Pixel ID', async () => {
  await withEnv({ META_PIXEL_ID: '123456789012345', META_DATASET_ID: '123456789012345' }, () => {
    assert.deepEqual(publicMetaConfig(), { pixelId: '123456789012345' });
  });
  await withEnv({ META_PIXEL_ID: 'pixel-secret<script>' }, () => {
    assert.deepEqual(publicMetaConfig(), { pixelId: '' });
  });
});

test('CAPI requires the same web data source used by the browser Pixel', async () => {
  await withEnv({
    META_PIXEL_ID: '123456789012345',
    META_DATASET_ID: '999999999999999',
    META_CAPI_ACCESS_TOKEN: 'test-access-token-long-enough',
    META_GRAPH_API_VERSION: 'v25.0'
  }, async () => {
    assert.deepEqual(
      await sendMetaLeadEvent(inquiry()),
      { sent: false, reason: 'not-configured', eventId: inquiry().id }
    );
  });
});

test('request context requires explicit marketing consent and allow-lists Meta fields', () => {
  const context = requestMetaContext({
    headers: {
      'x-forwarded-for': '203.0.113.8, 10.0.0.1',
      'user-agent': 'Buyer Browser'
    }
  }, {
    marketingConsent: 'granted',
    metaFbp: 'fb.1.1793262562.1234567890',
    metaFbc: 'fb.1.1793262562.valid-click-id',
    metaEventSourceUrl: 'https://www.huaguielastic.com/contact.html?utm_source=meta'
  });
  assert.equal(context.marketingConsent, true);
  assert.equal(context.clientIpAddress, '203.0.113.8');
  assert.equal(context.clientUserAgent, 'Buyer Browser');
  assert.equal(context.fbp, 'fb.1.1793262562.1234567890');
  assert.match(context.eventSourceUrl, /^https:\/\/www\.huaguielastic\.com\//);
  assert.equal(requestMetaContext({ headers: {} }, {
    marketingConsent: 'yes',
    metaFbp: 'fb.1.1793262562.1234567890',
    metaFbc: 'fb.1.1793262562.valid-click-id',
    metaEventSourceUrl: 'https://www.huaguielastic.com/contact.html?email=buyer@example.com'
  }).marketingConsent, false);
  const denied = requestMetaContext({ headers: {} }, {
    marketingConsent: 'denied',
    metaFbp: 'fb.1.1793262562.1234567890',
    metaFbc: 'fb.1.1793262562.valid-click-id',
    metaEventSourceUrl: 'https://www.huaguielastic.com/contact.html?email=buyer@example.com'
  });
  assert.equal(denied.fbp, '');
  assert.equal(denied.fbc, '');
  assert.equal(denied.eventSourceUrl, '');
  assert.equal(context.eventSourceUrl, 'https://www.huaguielastic.com/contact.html');
  assert.equal(requestMetaContext({ headers: {} }, {
    marketingConsent: 'granted',
    metaFbp: 'buyer.name',
    metaFbc: 'secret-message'
  }).fbp, '');
});

test('CAPI events use deterministic IDs and contain only hashed contact identifiers', () => {
  const event = buildMetaFunnelEvent(inquiry(), 'Lead', {
    marketingConsent: true,
    clientIpAddress: '203.0.113.8',
    clientUserAgent: 'Buyer Browser'
  }, new Date('2026-10-29T08:29:22.000Z'));
  assert.equal(event.event_id, 'HG-20261029-ABCDEF1234567890');
  assert.equal(event.event_time, 1793262562);
  assert.equal(metaEventId(inquiry().id, 'QualifiedLead'), `${inquiry().id}:QualifiedLead`);
  assert.match(event.user_data.em[0], /^[a-f0-9]{64}$/);
  assert.match(event.user_data.ph[0], /^[a-f0-9]{64}$/);
  const serialized = JSON.stringify(event);
  assert.doesNotMatch(serialized, /Buyer@Example\.com/i);
  assert.doesNotMatch(serialized, /Buyer Name|Buyer Company|Please quote/i);
  assert.equal(buildMetaFunnelEvent(inquiry({ marketingConsent: false }), 'Lead'), null);
  assert.equal(buildMetaFunnelEvent(inquiry({ marketingConsent: false }), 'Lead', {
    marketingConsent: true
  }), null);
  assert.equal(event.custom_data.content_name, undefined);
  assert.equal(event.custom_data.content_ids, undefined);
});

test('CAPI safely skips when not configured or marketing consent is absent', async () => {
  await withEnv({
    META_DATASET_ID: undefined,
    META_CAPI_ACCESS_TOKEN: undefined,
    META_GRAPH_API_VERSION: undefined
  }, async () => {
    assert.deepEqual(
      await sendMetaLeadEvent(inquiry()),
      { sent: false, reason: 'not-configured', eventId: inquiry().id }
    );
    assert.deepEqual(
      await sendMetaLeadEvent(inquiry({ marketingConsent: false })),
      { sent: false, reason: 'no-marketing-consent' }
    );
  });
});

test('CAPI sends a consented event without leaking the token or raw buyer details', async () => {
  let request;
  await withEnv({
    META_PIXEL_ID: '123456789012345',
    META_DATASET_ID: '123456789012345',
    META_CAPI_ACCESS_TOKEN: 'test-access-token-long-enough',
    META_GRAPH_API_VERSION: 'v25.0',
    META_TEST_EVENT_CODE: 'TEST123'
  }, async () => {
    const result = await sendMetaFunnelEvent(inquiry(), 'QualifiedLead', {
      context: { marketingConsent: true },
      now: new Date('2026-10-29T08:29:22.000Z'),
      fetchImpl: async (url, options) => {
        request = { url, options };
        return {
          ok: true,
          status: 200,
          json: async () => ({ events_received: 1, fbtrace_id: 'trace-123' })
        };
      }
    });
    assert.deepEqual(result, {
      sent: true,
      eventId: `${inquiry().id}:QualifiedLead`,
      eventsReceived: 1,
      traceId: 'trace-123'
    });
  });
  assert.equal(request.url, 'https://graph.facebook.com/v25.0/123456789012345/events');
  assert.equal(request.url.includes('test-access-token'), false);
  assert.equal(request.options.headers.Authorization, 'Bearer test-access-token-long-enough');
  const payload = JSON.parse(request.options.body);
  assert.equal(payload.test_event_code, 'TEST123');
  assert.equal(payload.data[0].event_name, 'QualifiedLead');
  assert.doesNotMatch(request.options.body, /Buyer@Example\.com/i);
});

test('browser Pixel remains disabled without consent and deduplicates consented Lead events', async () => {
  const denied = browserRuntime({ consent: { analytics: 'denied', marketing: 'denied' } });
  await denied.window.HUAGUI_ANALYTICS.init();
  assert.equal(typeof denied.window.fbq, 'undefined');

  const granted = browserRuntime({
    consent: { analytics: 'denied', marketing: 'granted' },
    cookie: '_fbp=fb.1.1793262562.1234567890; _fbc=fb.1.1793262562.valid-click-id'
  });
  await granted.window.HUAGUI_ANALYTICS.init();
  granted.window.HUAGUI_ANALYTICS.track('generate_lead', {
    category: 'lingerie',
    item_no: 'Buyer-Name-buyer_example_com',
    product_slug: 'secret-message',
    event_id: inquiry().id
  });
  const commands = granted.window.fbq.queue.map(entry => Array.from(entry));
  assert.equal(commands.some(entry => entry[0] === 'init' && entry[1] === '123456789012345'), true);
  assert.equal(commands.some(entry => entry[0] === 'track' && entry[1] === 'PageView'), true);
  const lead = commands.find(entry => entry[0] === 'track' && entry[1] === 'Lead');
  assert.equal(lead[3].eventID, inquiry().id);
  assert.equal(lead[2].content_category, 'lingerie');
  assert.equal(lead[2].content_ids, undefined);
  assert.equal(lead[2].content_name, undefined);
  assert.deepEqual(JSON.parse(JSON.stringify(granted.window.HUAGUI_ANALYTICS.getMetaContext())), {
    marketingConsent: 'granted',
    metaFbp: 'fb.1.1793262562.1234567890',
    metaFbc: 'fb.1.1793262562.valid-click-id',
    metaEventSourceUrl: 'https://www.huaguielastic.com/contact.html?utm_source=meta'
  });
});

test('production CSP permits consented Pixel loading and server event requests', () => {
  const config = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));
  const headers = config.headers.find(rule => rule.source === '/(.*)')?.headers || [];
  const csp = headers.find(header => header.key === 'Content-Security-Policy')?.value || '';
  assert.match(csp, /script-src[^;]*https:\/\/connect\.facebook\.net/);
  assert.match(csp, /connect-src[^;]*https:\/\/www\.facebook\.com/);
  assert.match(csp, /connect-src[^;]*https:\/\/graph\.facebook\.com/);
});

test('qualified funnel stages map only commercial progress to Meta events', () => {
  assert.equal(metaEventNameForStatus('qualified'), 'QualifiedLead');
  assert.equal(metaEventNameForStatus('quoted'), 'QuoteSent');
  assert.equal(metaEventNameForStatus('sample_sent'), 'SampleSent');
  assert.equal(metaEventNameForStatus('won'), 'OrderWon');
  assert.equal(metaEventNameForStatus('new'), '');
  assert.equal(metaEventNameForStatus('disqualified'), '');
  assert.equal(metaEventNameForStatus('resolved'), '');
});

test('privacy copy discloses consent-gated Meta measurement without obsolete claims', () => {
  const privacy = fs.readFileSync(path.join(ROOT, 'huagui_company_site', 'privacy.html'), 'utf8');
  const i18n = fs.readFileSync(path.join(ROOT, 'huagui_company_site', 'assets', 'js', 'i18n.js'), 'utf8');
  assert.match(privacy, /Meta Pixel loads only after marketing consent/);
  assert.match(privacy, /hashed email or phone values/);
  assert.match(privacy, /We do not send names, company names, inquiry messages, files, or quotations to Meta/);
  assert.doesNotMatch(`${privacy}\n${i18n}`, /We do not currently use advertising cookies or Meta Pixel/);
});
