import assert from 'node:assert/strict';

const input = process.env.SEO_BASE_URL;
if (!input) {
  console.error('Set SEO_BASE_URL to a Vercel preview or production origin.');
  process.exit(2);
}

const base = new URL(input);
base.pathname = '/';
base.search = '';
base.hash = '';

const cases = [
  ['/', 200, 'en', 'ltr'],
  ['/es', 200, 'es', 'ltr'],
  ['/pt-br', 200, 'pt-BR', 'ltr'],
  ['/ru', 200, 'ru', 'ltr'],
  ['/ar', 200, 'ar', 'rtl'],
  ['/products/h6896', 200, 'en', 'ltr'],
  ['/es/products/h6896', 200, 'es', 'ltr'],
  ['/products/not-real', 404, 'en', 'ltr'],
  ['/missing-page', 404, 'en', 'ltr'],
  ['/ar/missing-page', 404, 'ar', 'rtl']
];

for (const [pathname, status, lang, dir] of cases) {
  const response = await fetch(new URL(pathname, base), { redirect: 'manual' });
  const html = await response.text();
  assert.equal(response.status, status, `${pathname}: status`);
  assert.match(response.headers.get('content-type') || '', /^text\/html/i, `${pathname}: content type`);
  assert.match(html, new RegExp(`<html[^>]+lang=["']${lang}["'][^>]+dir=["']${dir}["']`, 'i'), `${pathname}: lang/dir`);
  if (status === 200) {
    assert.match(html, /<link\b[^>]*rel=["']canonical["']/i, `${pathname}: canonical`);
    assert.equal([...html.matchAll(/hreflang=/gi)].length, 6, `${pathname}: hreflang count`);
    assert.match(html, /<meta\b[^>]*(?:property=["']og:title["']|name=["']twitter:card["'])/i, `${pathname}: social metadata`);
  } else {
    assert.match(html, /noindex/i, `${pathname}: noindex`);
    assert.match(response.headers.get('x-robots-tag') || '', /noindex/i, `${pathname}: X-Robots-Tag`);
    assert.match(html, /data-seo-shell=["']header["']/i, `${pathname}: branded header`);
  }
  console.log(`PASS ${status} ${pathname}`);
}

const product = await (await fetch(new URL('/ar/products/h6896', base))).text();
assert.match(product, /<main id=["']productDetail["']>[\s\S]*H6896/i, 'product source body');
assert.match(product, /id=["']productStructuredData["']/i, 'product JSON-LD');

const filtered = await (await fetch(new URL('/products.html?cat=mens&tag=printed', base))).text();
const canonical = filtered.match(/<link\b[^>]*rel=["']canonical["'][^>]*>/i)?.[0] || '';
assert.match(canonical, /href=["']https:\/\/www\.huaguielastic\.com\/products\.html["']/i);
assert.doesNotMatch(canonical, /\?/);

const sitemapResponse = await fetch(new URL('/sitemap.xml', base));
const sitemap = await sitemapResponse.text();
assert.equal(sitemapResponse.status, 200);
assert.match(sitemap, /xmlns:xhtml=/i);
assert.ok([...sitemap.matchAll(/<url>/gi)].length > 45, 'sitemap URL count is unexpectedly small');

const robotsResponse = await fetch(new URL('/robots.txt', base));
const robots = await robotsResponse.text();
assert.equal(robotsResponse.status, 200, '/robots.txt: status');
assert.match(robotsResponse.headers.get('content-type') || '', /^text\/plain/i, '/robots.txt: content type');
assert.match(robots, /Sitemap:\s*https:\/\/www\.huaguielastic\.com\/sitemap\.xml/i, '/robots.txt: sitemap');

console.log(`SEO live smoke test passed for ${base.origin}`);
