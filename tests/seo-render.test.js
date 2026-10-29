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
  renderNotFound,
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

test('Spanish factory capacity uses linear meters rather than square meters', () => {
  const html = renderStaticPage({ page: 'about', locale: 'es', products });
  assert.match(html, /1,5 millones de metros/i);
  assert.doesNotMatch(html, /1,5 millones de metros cuadrados/i);
});

test('about page embeds the optimized company video without autoplay in every locale', () => {
  const videoPath = path.join(ROOT, 'huagui_company_site/assets/videos/huagui-elastic-factory-company-introduction-en.mp4');
  const posterPath = path.join(ROOT, 'huagui_company_site/assets/images/video-posters/huagui-elastic-factory-company-video.jpg');
  assert.ok(fs.statSync(videoPath).size > 1_000_000, 'optimized company video is unexpectedly small');
  assert.ok(fs.statSync(videoPath).size < 25_000_000, 'optimized company video is too large for the website');
  assert.ok(fs.statSync(posterPath).size > 10_000, 'company video poster is unexpectedly small');

  for (const locale of LOCALES) {
    const html = renderStaticPage({ page: 'about', locale, products });
    assert.match(html, /<video\b[^>]*\bcontrols\b[^>]*\bplaysinline\b[^>]*\bpreload=["']metadata["'][^>]*>/i, `${locale} video controls`);
    assert.match(html, /poster=["']assets\/images\/video-posters\/huagui-elastic-factory-company-video\.jpg["']/i, `${locale} poster`);
    assert.match(html, /<source\b[^>]*src=["']assets\/videos\/huagui-elastic-factory-company-introduction-en\.mp4["'][^>]*type=["']video\/mp4["']/i, `${locale} video source`);
    assert.doesNotMatch(html, /<video\b[^>]*\bautoplay\b/i, `${locale} video must not autoplay`);
  }

  const spanish = renderStaticPage({ page: 'about', locale: 'es', products });
  assert.match(spanish, /Conozca nuestra fábrica, productos y proceso de producción/i);
  assert.match(spanish, /Audio en inglés · Subtítulos en inglés/i);
});

test('non-English source localizes key image alternatives and accessibility labels', () => {
  const product = products.find(item => item.slug === 'h6896');
  assert.ok(product, 'H6896 fixture is missing');
  const expected = {
    es: {
      toggle: 'Abrir o cerrar el menú', highlights: 'Características destacadas del producto', details: 'Detalles del producto', gallery: 'Galería de imágenes del producto',
      homeAlts: ['Elástico para tirantes de sujetador y lencería', 'Tirantes para ropa de ciclismo', 'Opciones de personalización de hilo elástico y color'],
      galleryAlt: 'H6896 | Elástico para tirantes de sujetador - Anverso y reverso'
    },
    'pt-br': {
      toggle: 'Abrir ou fechar o menu', highlights: 'Destaques do produto', details: 'Detalhes do produto', gallery: 'Galeria de imagens do produto',
      homeAlts: ['Elástico para alças de sutiã e lingerie', 'Alças para vestuário de ciclismo', 'Opções de personalização de fios elásticos e cores'],
      galleryAlt: 'H6896 | Elástico para alça de sutiã - Frente e verso'
    },
    ru: {
      toggle: 'Открыть или закрыть меню', highlights: 'Ключевые характеристики изделия', details: 'Сведения об изделии', gallery: 'Галерея изображений изделия',
      homeAlts: ['Эластичная лента для бретелей бюстгальтеров и белья', 'Бретели для велоодежды', 'Варианты индивидуального подбора эластичной нити и цвета'],
      galleryAlt: 'H6896 | Эластичная лента для бретелей - Лицевая и изнаночная стороны'
    },
    ar: {
      toggle: 'فتح أو إغلاق القائمة', highlights: 'أبرز مواصفات المنتج', details: 'تفاصيل المنتج', gallery: 'معرض صور المنتج',
      homeAlts: ['شريط مطاطي لحمالات الصدر واللانجري', 'حمالات ملابس ركوب الدراجات', 'خيارات تخصيص الخيوط المطاطية والألوان'],
      galleryAlt: 'H6896 | شريط مطاطي لحمالات الصدر - الوجه والظهر'
    }
  };

  for (const [locale, labels] of Object.entries(expected)) {
    const home = renderStaticPage({ page: 'index', locale, products });
    assert.ok(home.includes(`aria-label="${labels.toggle}"`), `${locale} menu aria-label is not localized`);
    labels.homeAlts.forEach(alt => assert.ok(home.includes(`alt="${alt}"`), `${locale} missing localized home alt: ${alt}`));
    assert.doesNotMatch(home, /aria-label=["']Toggle menu["']/i);
    assert.doesNotMatch(home, /alt=["'](?:Bra strap elastic for lingerie|Cycling apparel straps|Elastic yarn and color customization options)["']/i);

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

test('home and inquiry source expose the four catalog categories and confirmed MOQ in every locale', () => {
  const expectedCategory = {
    en: 'Activewear Elastics',
    es: 'Elásticos para ropa deportiva',
    'pt-br': 'Elásticos para moda fitness',
    ru: 'Резинки для спортивной одежды',
    ar: 'مطاط للملابس الرياضية'
  };
  const expectedMoq = {
    en: '30,000 meters per product',
    es: '30.000 metros por producto',
    'pt-br': '30.000 metros por produto',
    ru: '30 000 метров на один вид продукции',
    ar: '30,000 متر لكل منتج'
  };

  for (const locale of LOCALES) {
    const home = renderStaticPage({ page: 'index', locale, products });
    assert.ok(home.includes(expectedCategory[locale]), `${locale} home is missing Activewear`);
    assert.match(home, />4<\/div>\s*<div class=["']stat-label["']>/i, `${locale} home category count is not four`);
    assert.doesNotMatch(home, /href=["'][^"']*cat=lingerie&amp;tag=binding/i, `${locale} home still uses Binding as a main category`);

    const contact = renderStaticPage({ page: 'contact', locale, products });
    assert.match(contact, /<option value=["']activewear["']>/i, `${locale} inquiry form is missing Activewear`);
    assert.ok(contact.includes(expectedMoq[locale]), `${locale} inquiry page is missing the confirmed MOQ`);
    assert.doesNotMatch(contact, /5[,.]000m\s*\/\s*20[,.]000m/i, `${locale} inquiry page still suggests a sub-MOQ quantity`);
  }
});

test('FAQ publishes bounded third-party test evidence without restricted report identifiers', () => {
  const expectedQuestion = {
    en: 'What third-party test results are available?',
    es: '¿Qué resultados de pruebas de terceros están disponibles?',
    'pt-br': 'Quais resultados de testes de terceiros estão disponíveis?',
    ru: 'Какие результаты независимых испытаний доступны?',
    ar: 'ما نتائج اختبارات الجهات الخارجية المتاحة؟'
  };
  const forbidden = /\b(?:TÜV|TUV|Intertek|HAODE)\b|BY-20230901-0018|64\.405\.23|GZHT0/i;

  for (const locale of LOCALES) {
    const html = renderStaticPage({ page: 'faq', locale, products });
    assert.ok(html.includes(expectedQuestion[locale]), `${locale} FAQ is missing the localized testing question`);
    assert.match(html, /4-5/, `${locale} FAQ is missing representative grade evidence`);
    assert.doesNotMatch(html, forbidden, `${locale} FAQ exposes a restricted institution or report identifier`);

    const script = html.match(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/i);
    assert.ok(script, `${locale} FAQ JSON-LD is missing`);
    const jsonLd = JSON.parse(script[1]);
    const item = jsonLd.mainEntity.find(entry => entry.name === expectedQuestion[locale]);
    assert.ok(item, `${locale} FAQ JSON-LD is missing localized test evidence`);
    assert.match(item.acceptedAnswer.text, /4-5/);
    assert.doesNotMatch(item.acceptedAnswer.text, forbidden);
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

  const missingPage = await callHandler(handler, { query: { locale: 'en', page: 'not-found' }, url: '/missing-page' });
  assert.equal(missingPage.statusCode, 404);
  assert.match(missingPage.headers['content-type'], /^text\/html/i);
  assert.equal(missingPage.headers['content-language'], 'en');
  assert.match(missingPage.headers['x-robots-tag'], /noindex/i);
  assert.match(missingPage.body, /<base href=["']\/["']>/i);
  assert.match(missingPage.body, /Page Not Found/i);
  assert.match(missingPage.body, /HUAGUI ELASTIC/i);

  const missingArabicPage = await callHandler(handler, { query: { locale: 'ar', page: 'not-found' }, url: '/ar/missing-page' });
  assert.equal(missingArabicPage.statusCode, 404);
  assert.equal(missingArabicPage.headers['content-language'], 'ar');
  assert.match(missingArabicPage.body, /<html[^>]+lang=["']ar["'][^>]+dir=["']rtl["']/i);
  assert.match(missingArabicPage.body, /الصفحة غير موجودة/);
  assert.match(missingArabicPage.body, /الصفحة أو المنتج المطلوب غير متاح/);
  assert.doesNotMatch(missingArabicPage.body, /This product is not currently published/i);
  assert.doesNotMatch(missingArabicPage.body, /["']@type["']\s*:\s*["']Product["']/i);

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
  assert.equal(rewrites.get('/robots.txt'), '/huagui_company_site/robots.txt');
  assert.equal(rewrites.get('/admin.html'), '/huagui_company_site/admin.html');
  assert.equal(rewrites.get('/:locale(es|pt-br|ru|ar)/(.*)'), '/api/seo?locale=:locale&page=not-found');
  assert.equal(rewrites.get('/(.*)'), '/api/seo?locale=en&page=not-found');
  assert.equal([...rewrites.values()].includes('/huagui_company_site/$1'), false);

  const includeFiles = config.functions?.['api/seo.js']?.includeFiles;
  assert.equal(typeof includeFiles, 'string');
  assert.match(includeFiles, /data\/products\.json/);
  assert.doesNotMatch(includeFiles, /assets\/images/);
});

test('branded not-found pages use generic localized copy and root-relative assets', () => {
  const expected = {
    en: ['Page Not Found', 'The requested product or page is not available.'],
    es: ['Página no encontrada', 'La página o el producto solicitado no está disponible.'],
    'pt-br': ['Página não encontrada', 'A página ou o produto solicitado não está disponível.'],
    ru: ['Страница не найдена', 'Запрошенная страница или товар недоступны.'],
    ar: ['الصفحة غير موجودة', 'الصفحة أو المنتج المطلوب غير متاح.']
  };
  for (const locale of LOCALES) {
    const html = renderNotFound({ locale });
    assert.match(html, /<base href=["']\/["']>/i, `${locale} missing base href`);
    assert.match(html, /<meta name=["']robots["'] content=["']noindex, nofollow["']>/i);
    assert.ok(html.includes(expected[locale][0]), `${locale} missing localized 404 title`);
    assert.ok(html.includes(expected[locale][1]), `${locale} missing localized 404 message`);
    assert.match(html, /src=["']assets\/images\/huagui-logo\.png["']/i);
    assert.match(html, /href=["']\/assets\/css\/style\.css/i);
    assert.match(html, /data-seo-shell=["']header["']/i);
    assert.match(html, /data-seo-shell=["']footer["']/i);
  }
});
