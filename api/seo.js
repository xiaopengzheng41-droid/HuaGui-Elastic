const { loadProducts } = require('./_cms');
const {
  LOCALES,
  LOCALE_META,
  renderNotFound,
  renderProductPage,
  renderStaticPage,
  validPage
} = require('./_seo');

function queryValue(value) {
  return Array.isArray(value) ? value[0] : value;
}

function sendHtml(res, statusCode, html, headers = {}) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  Object.entries(headers).forEach(([name, value]) => res.setHeader(name, value));
  return res.end(html);
}

function unavailableHtml(locale) {
  const meta = LOCALE_META[locale] || LOCALE_META.en;
  const copy = {
    en: ['Temporarily Unavailable | Huagui Elastic', 'The product catalog is temporarily unavailable. Please try again shortly.'],
    es: ['Temporalmente no disponible | Huagui Elastic', 'El catálogo de productos no está disponible temporalmente. Inténtelo de nuevo en breve.'],
    'pt-br': ['Temporariamente indisponível | Huagui Elastic', 'O catálogo de produtos está temporariamente indisponível. Tente novamente em instantes.'],
    ru: ['Временно недоступно | Huagui Elastic', 'Каталог продукции временно недоступен. Повторите попытку позже.'],
    ar: ['غير متاح مؤقتاً | Huagui Elastic', 'كتالوج المنتجات غير متاح مؤقتاً. يرجى المحاولة بعد قليل.']
  }[locale] || [];
  return `<!DOCTYPE html><html lang="${meta.lang}" dir="${meta.dir}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="robots" content="noindex, nofollow"><title>${copy[0]}</title><link rel="stylesheet" href="/assets/css/style.css"></head><body><main><section class="section"><div class="container"><h1>${copy[0]}</h1><p>${copy[1]}</p></div></section></main></body></html>`;
}

module.exports = async function seoHandler(req, res) {
  const method = String(req.method || 'GET').toUpperCase();
  if (!['GET', 'HEAD'].includes(method)) {
    res.setHeader('Allow', 'GET, HEAD');
    return sendHtml(res, 405, 'Method not allowed', { 'Cache-Control': 'no-store' });
  }

  const requestedLocale = String(queryValue(req.query?.locale) || 'en').toLowerCase();
  const locale = LOCALES.includes(requestedLocale) ? requestedLocale : 'en';
  const requestedPage = String(queryValue(req.query?.page) || 'index').toLowerCase();
  const page = requestedPage === 'product' ? 'product' : validPage(requestedPage);

  if (!LOCALES.includes(requestedLocale) || !page) {
    const body = method === 'HEAD' ? '' : renderNotFound({ locale });
    return sendHtml(res, 404, body, {
      'Content-Language': LOCALE_META[locale].lang,
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow'
    });
  }

  let products = [];
  if (page === 'index' || page === 'products' || page === 'product') {
    try {
      products = await loadProducts({ includeDrafts: false });
    } catch (error) {
      console.error('SEO product loading failed:', error?.message || error);
      const body = method === 'HEAD' ? '' : unavailableHtml(locale);
      return sendHtml(res, 503, body, {
        'Content-Language': LOCALE_META[locale].lang,
        'Cache-Control': 'no-store',
        'Retry-After': '60',
        'X-Robots-Tag': 'noindex, nofollow'
      });
    }
  }

  let html;
  if (page === 'product') {
    const slug = String(queryValue(req.query?.slug) || '').trim();
    const product = products.find(item => item.slug === slug);
    if (!product) {
      const body = method === 'HEAD' ? '' : renderNotFound({ locale });
      return sendHtml(res, 404, body, {
        'Content-Language': LOCALE_META[locale].lang,
        'Cache-Control': 'no-store',
        'X-Robots-Tag': 'noindex, nofollow'
      });
    }
    html = renderProductPage({ product, locale });
  } else {
    html = renderStaticPage({ page, locale, products });
  }

  return sendHtml(res, 200, method === 'HEAD' ? '' : html, {
    'Content-Language': LOCALE_META[locale].lang,
    'Cache-Control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300'
  });
};
