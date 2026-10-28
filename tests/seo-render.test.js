const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const { loadProducts } = require('../api/_cms');
const {
  LOCALES,
  LOCALE_META,
  ORIGIN,
  PAGE_FILES,
  createTranslator,
  pagePath,
  renderProductPage,
  renderStaticPage
} = require('../api/_seo');

const ROOT = path.resolve(__dirname, '..');

function occurrences(source, pattern) {
  return [...String(source).matchAll(pattern)].length;
}

function attributeValues(source, tagPattern, attribute) {
  return [...String(source).matchAll(tagPattern)]
    .map(match => match[0].match(new RegExp(`\\b${attribute}=["']([^"']+)["']`, 'i'))?.[1])
    .filter(Boolean);
}

function extractJsonLdById(html, id) {
  const match = String(html).match(new RegExp(`<script[^>]+id=["']${id}["'][^>]*>([\\s\\S]*?)<\\/script>`, 'i'));
  assert.ok(match, `missing JSON-LD script #${id}`);
  return JSON.parse(match[1]);
}

function mockResponse() {
  return {
    statusCode: 200,
    headers: {},
    body: '',
    setHeader(name, value) {
      this.headers[String(name).toLowerCase()] = value;
      return this;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    send(value = '') {
      this.body = String(value);
      return this;
    },
    end(value = '') {
      this.body = String(value);
      return this;
    }
  };
}

async function callHandler(handler, { method = 'GET', query = {}, url = '/' } = {}) {
  const req = { method, query, url, headers: {} };
  const res = mockResponse();
  await handler(req, res);
  return res;
}

let products;

test.before(async () => {
  products = await loadProducts({ includeDrafts: false });
  assert.ok(products.length > 0, 'published product fixture is empty');
});

test('all public page types render complete crawlable HTML in five locales', () => {
  for (const locale of LOCALES) {
    for (const page of Object.keys(PAGE_FILES)) {
      const html = renderStaticPage({ page, locale, products });
      assert.ok(html.startsWith('<!DOCTYPE html>'), `${locale}/${page} missing doctype`);
      assert.match(html, new RegExp(`<html[^>]+lang=["']${LOCALE_META[locale].lang}["'][^>]+dir=["']${LOCALE_META[locale].dir}["']`, 'i'));
      assert.match(html, /<title>[^<]+<\/title>/i);
      assert.match(html, /<meta\s+name=["']description["'][^>]+content=["'][^"']+/i);
      assert.equal(occurrences(html, /<link\b[^>]*rel=["']canonical["'][^>]*>/gi), 1, `${locale}/${page} canonical count`);
      assert.equal(occurrences(html, /<link\b[^>]*rel=["']alternate["'][^>]*hreflang=/gi), 6, `${locale}/${page} hreflang count`);
      assert.match(html, /<meta\b[^>]*property=["']og:title["']/i);
      assert.match(html, /<meta\b[^>]*property=["']og:description["']/i);
      assert.match(html, /<meta\b[^>]*property=["']og:url["']/i);
      assert.match(html, /<meta\b[^>]*property=["']og:image["']/i);
      assert.match(html, /<meta\b[^>]*name=["']twitter:card["'][^>]*summary_large_image/i);

      const canonical = attributeValues(html, /<link\b[^>]*rel=["']canonical["'][^>]*>/gi, 'href');
      assert.deepEqual(canonical, [`${ORIGIN}${pagePath(locale, page)}`]);
      const hreflangs = attributeValues(html, /<link\b[^>]*rel=["']alternate["'][^>]*>/gi, 'hreflang').sort();
      assert.deepEqual(hreflangs, ['ar', 'en', 'es', 'pt-BR', 'ru', 'x-default'].sort());
    }
  }
});

test('localized pages expose localized source text and locale-prefixed internal product URLs', () => {
  const english = renderStaticPage({ page: 'products', locale: 'en', products });
  const englishTitle = english.match(/<title>([^<]+)<\/title>/i)?.[1];
  for (const locale of LOCALES.filter(value => value !== 'en')) {
    const html = renderStaticPage({ page: 'products', locale, products });
    const title = html.match(/<title>([^<]+)<\/title>/i)?.[1];
    assert.notEqual(title, englishTitle, `${locale} title remained English`);
    assert.match(html, new RegExp(`href=["']/${locale}/products/${products[0].slug}["']`, 'i'));
  }
});

test('non-English source localizes key image alternatives and accessibility labels', () => {
  const product = products.find(item => item.slug === 'h6896');
  assert.ok(product, 'H6896 fixture is missing');
  const expected = {
    es: {
      toggle: 'Abrir o cerrar el menú', highlights: 'Características destacadas del producto', details: 'Detalles del producto', gallery: 'Galería de imágenes del producto',
      homeAlts: ['Elástico para tirantes de sujetador y lencería', 'Elástico de ribete plegable para ropa íntima', 'Opciones de personalización de hilo elástico y color'],
      galleryAlt: 'H6896 | Elástico para tirantes de sujetador - Anverso y reverso'
    },
    'pt-br': {
      toggle: 'Abrir ou fechar o menu', highlights: 'Destaques do produto', details: 'Detalhes do produto', gallery: 'Galeria de imagens do produto',
      homeAlts: ['Elástico para alças de sutiã e lingerie', 'Elástico de debrum dobrável para moda íntima', 'Opções de personalização de fios elásticos e cores'],
      galleryAlt: 'H6896 | Elástico para alça de sutiã - Frente e verso'
    },
    ru: {
      toggle: 'Открыть или закрыть меню', highlights: 'Ключевые характеристики изделия', details: 'Сведения об изделии', gallery: 'Галерея изображений изделия',
      homeAlts: ['Эластичная лента для бретелей бюстгальтеров и белья', 'Складная окантовочная эластичная лента для нижнего белья', 'Варианты индивидуального подбора эластичной нити и цвета'],
      galleryAlt: 'H6896 | Эластичная лента для бретелей - Лицевая и изнаночная стороны'
    },
    ar: {
      toggle: 'فتح أو إغلاق القائمة', highlights: 'أبرز مواصفات المنتج', details: 'تفاصيل المنتج', gallery: 'معرض صور المنتج',
      homeAlts: ['شريط مطاطي لحمالات الصدر واللانجري', 'شريط مطاطي قابل للطي لحواف الملابس الداخلية', 'خيارات تخصيص الخيوط المطاطية والألوان'],
      galleryAlt: 'H6896 | شريط مطاطي لحمالات الصدر - الوجه والظهر'
    }
  };

  for (const [locale, labels] of Object.entries(expected)) {
    const home = renderStaticPage({ page: 'index', locale, products });
    assert.ok(home.includes(`aria-label="${labels.toggle}"`), `${locale} menu aria-label is not localized`);
    labels.homeAlts.forEach(alt => assert.ok(home.includes(`alt="${alt}"`), `${locale} missing localized home alt: ${alt}`));
    assert.doesNotMatch(home, /aria-label=["']Toggle menu["']/i);
    assert.doesNotMatch(home, /alt=["'](?:Bra strap elastic for lingerie|Fold over binding elastic for intimate apparel|Elastic yarn and color customization options)["']/i);

    const detail = renderProductPage({ product, locale });
    for (const ariaLabel of [labels.toggle, labels.highlights, labels.details, labels.gallery]) {
      assert.ok(detail.includes(`aria-label="${ariaLabel}"`), `${locale} missing localized aria-label: ${ariaLabel}`);
    }
    assert.ok(detail.includes(`alt="${labels.galleryAlt}"`), `${locale} missing localized H6896 gallery alt`);
    assert.doesNotMatch(detail, /aria-label=["'](?:Toggle menu|Product highlights|Product details|Product image gallery)["']/i);
    assert.doesNotMatch(detail, /alt=["'][^"']*H6896[^"']*(?:Front(?:\s*&amp;\s*Back)?|Back|Colors)[^"']*["']/i);

    const translate = createTranslator(locale);
    assert.doesNotMatch(translate('H6896 | Bra Strap Elastic product view 2'), /Bra Strap Elastic|product view/i);
    assert.doesNotMatch(translate('Product View 2'), /Product View/i);
  }
});

test('catalog source contains every published product exactly once as a server-rendered card', () => {
  const html = renderStaticPage({ page: 'products', locale: 'en', products });
  assert.match(html, new RegExp(`>${products.length} elastic solutions<`, 'i'));
  assert.equal(occurrences(html, /data-seo-product-card/g), products.length);
  assert.equal(occurrences(html, /<div class=["']products-grid["'] id=["']productsGrid["']>\s*<\/div>/gi), 0);
  assert.doesNotMatch(html, /13 elastic products/i);
  const slugs = attributeValues(html, /<a\b[^>]*class=["'][^"']*product-card-img[^"']*["'][^>]*>/gi, 'href')
    .map(href => href.split('/').filter(Boolean).at(-1));
  assert.equal(new Set(slugs).size, products.length);
});

test('H6896 product source contains visible facts and valid Product JSON-LD without invented commercial claims', () => {
  const product = products.find(item => item.slug === 'h6896');
  assert.ok(product, 'H6896 fixture is missing');
  for (const locale of LOCALES) {
    const translate = createTranslator(locale);
    const html = renderProductPage({ product, locale });
    assert.match(html, /<main id=["']productDetail["']>[\s\S]*?<h1[^>]*>[\s\S]*?H6896/i);
    assert.match(html, /<table[^>]+product-spec-table/i);
    for (const spec of product.specs) {
      const value = translate(spec.value);
      assert.ok(html.includes(value.replace(/&/g, '&amp;')) || html.includes(value), `${locale} missing ${spec.label} value`);
    }
    assert.ok(html.includes(product.image));
    assert.match(html, /Request Quote|Solicit|cotação|Запрос|عرض سعر/i);

    const jsonLd = extractJsonLdById(html, 'productStructuredData');
    assert.equal(jsonLd['@type'], 'Product');
    assert.equal(jsonLd.url, `${ORIGIN}${pagePath(locale, 'product', product.slug)}`);
    assert.equal(jsonLd.sku, 'H6896');
    assert.ok(jsonLd.name.includes('H6896'));
    assert.ok(Array.isArray(jsonLd.image) && jsonLd.image.length > 0);
    assert.equal(jsonLd.brand.name, 'Huagui Elastic');
    assert.equal(jsonLd.manufacturer.legalName, 'Shantou Huagui Industrial Co., Ltd.');
    assert.ok(Array.isArray(jsonLd.additionalProperty) && jsonLd.additionalProperty.length >= 4);
    assert.equal('offers' in jsonLd, false);
    assert.equal('aggregateRating' in jsonLd, false);
    assert.equal('review' in jsonLd, false);

    const breadcrumb = extractJsonLdById(html, 'productBreadcrumbStructuredData');
    assert.equal(breadcrumb['@type'], 'BreadcrumbList');
    assert.equal(breadcrumb.itemListElement.length, 3);
    assert.equal(breadcrumb.itemListElement.at(-1).item, jsonLd.url);
  }
});

test('SEO HTML handler returns real 404/noindex and rejects unsupported methods', async () => {
  const seoHandlerPath = path.join(ROOT, 'api', 'seo.js');
  assert.ok(fs.existsSync(seoHandlerPath), 'api/seo.js is required for status-code verification');
  delete require.cache[require.resolve(seoHandlerPath)];
  const handler = require(seoHandlerPath);

  const missing = await callHandler(handler, { query: { locale: 'es', page: 'product', slug: 'not-real' }, url: '/es/products/not-real' });
  assert.equal(missing.statusCode, 404);
  assert.match(missing.headers['content-type'], /^text\/html/i);
  assert.match(missing.body, /noindex/i);
  assert.doesNotMatch(missing.body, /["']@type["']\s*:\s*["']Product["']/i);

  const method = await callHandler(handler, { method: 'POST', query: { locale: 'en', page: 'index' } });
  assert.equal(method.statusCode, 405);
  assert.match(String(method.headers.allow), /GET/i);
});

test('handler ignores catalog filter query parameters when generating canonical', async () => {
  const seoHandlerPath = path.join(ROOT, 'api', 'seo.js');
  assert.ok(fs.existsSync(seoHandlerPath), 'api/seo.js is required for canonical verification');
  delete require.cache[require.resolve(seoHandlerPath)];
  const handler = require(seoHandlerPath);
  const res = await callHandler(handler, {
    query: { locale: 'en', page: 'products', cat: 'mens', tag: 'printed' },
    url: '/products.html?cat=mens&tag=printed'
  });
  assert.equal(res.statusCode, 200);
  assert.match(res.body, /<link\b[^>]*rel=["']canonical["'][^>]*href=["']https:\/\/www\.huaguielastic\.com\/products\.html["']/i);
  assert.doesNotMatch(res.body.match(/<link\b[^>]*rel=["']canonical["'][^>]*>/i)?.[0] || '', /\?/);
});

test('sitemap contains all localized public URLs with reciprocal alternates', async () => {
  const sitemapHandler = require('../api/sitemap');
  const res = await callHandler(sitemapHandler, { url: '/sitemap.xml' });
  assert.equal(res.statusCode, 200);
  assert.match(res.headers['content-type'], /xml/i);
  assert.match(res.body, /xmlns:xhtml=["']http:\/\/www\.w3\.org\/1999\/xhtml["']/i);
  const urls = [...res.body.matchAll(/<url>([\s\S]*?)<\/url>/gi)].map(match => match[1]);
  assert.equal(urls.length, Object.keys(PAGE_FILES).length * LOCALES.length + products.length * LOCALES.length);
  const locations = urls.map(block => block.match(/<loc>(.*?)<\/loc>/i)?.[1]);
  assert.equal(new Set(locations).size, locations.length);
  for (const block of urls) {
    assert.equal(occurrences(block, /<xhtml:link\b[^>]*rel=["']alternate["'][^>]*>/gi), 6);
    assert.doesNotMatch(block, /\?/);
    for (const value of [...block.matchAll(/<lastmod>(.*?)<\/lastmod>/gi)].map(match => match[1])) {
      const date = new Date(value);
      assert.equal(Number.isNaN(date.getTime()), false, `invalid lastmod ${value}`);
      assert.ok(date.getTime() <= Date.now(), `future lastmod ${value}`);
    }
  }
});

test('robots rules protect administration for general and named AI crawlers', () => {
  const robots = fs.readFileSync(path.join(ROOT, 'huagui_company_site', 'robots.txt'), 'utf8');
  for (const agent of ['*', 'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot']) {
    const block = robots.match(new RegExp(`User-agent:\\s*${agent === '*' ? '\\\\*' : agent}([\\s\\S]*?)(?=\\nUser-agent:|\\nSitemap:|$)`, 'i'))?.[1] || '';
    assert.match(block, /Allow:\s*\//i, `${agent} missing Allow`);
    assert.match(block, /Disallow:\s*\/admin\b/i, `${agent} can crawl admin`);
    assert.match(block, /Disallow:\s*\/api\/admin\//i, `${agent} can crawl admin API`);
  }
  assert.match(robots, /Sitemap:\s*https:\/\/www\.huaguielastic\.com\/sitemap\.xml/i);
});

test('Vercel routes public HTML through the SEO renderer without bundling product images', () => {
  const config = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));
  const rewrites = new Map(config.rewrites.map(rule => [rule.source, rule.destination]));

  assert.equal(rewrites.get('/'), '/api/seo?locale=en&page=index');
  assert.equal(rewrites.get('/:locale(es|pt-br|ru|ar)'), '/api/seo?locale=:locale&page=index');
  assert.equal(rewrites.get('/products/:slug'), '/api/seo?locale=en&page=product&slug=:slug');
  assert.equal(rewrites.get('/:locale(es|pt-br|ru|ar)/products/:slug'), '/api/seo?locale=:locale&page=product&slug=:slug');
  assert.equal(rewrites.get('/product-detail.html'), '/api/seo?locale=en&page=product');
  assert.match(rewrites.get('/:page(index|products|service|factory|exhibitions|faq|about|contact|privacy).html') || '', /^\/api\/seo/);

  const includeFiles = config.functions?.['api/seo.js']?.includeFiles;
  assert.equal(typeof includeFiles, 'string');
  assert.match(includeFiles, /data\/products\.json/);
  assert.doesNotMatch(includeFiles, /assets\/images/);
});
