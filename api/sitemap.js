const { loadProductsSnapshot } = require('./_cms');
const {
  LOCALES,
  LOCALE_META,
  ORIGIN,
  PAGE_FILES,
  escapeXml,
  pagePath
} = require('./_seo');

const PUBLIC_PAGES = Object.keys(PAGE_FILES);

function reliableLastModified(value) {
  if (!value) return '';
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp) || timestamp > Date.now()) return '';
  return new Date(timestamp).toISOString();
}

function alternateLinks(page, slug = '') {
  const links = LOCALES.map(locale => {
    const href = `${ORIGIN}${pagePath(locale, page, slug)}`;
    return `    <xhtml:link rel="alternate" hreflang="${LOCALE_META[locale].lang}" href="${escapeXml(href)}"/>`;
  });
  links.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(`${ORIGIN}${pagePath('en', page, slug)}`)}"/>`);
  return links.join('\n');
}

function urlEntry(locale, page, slug = '', lastModified = '') {
  const location = `${ORIGIN}${pagePath(locale, page, slug)}`;
  const lastmod = lastModified ? `\n    <lastmod>${escapeXml(lastModified)}</lastmod>` : '';
  return `  <url>\n    <loc>${escapeXml(location)}</loc>${lastmod}\n${alternateLinks(page, slug)}\n  </url>`;
}

module.exports = async function sitemapHandler(req, res) {
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).end('Method not allowed');
  }

  let snapshot = { products: [], updatedAt: '' };
  try {
    snapshot = await loadProductsSnapshot({ includeDrafts: false });
  } catch (error) {
    // Keep the static pages discoverable if the product store is temporarily unavailable.
  }

  const productLastModified = reliableLastModified(snapshot.updatedAt);
  const products = snapshot.products.filter(product => (
    product &&
    product.status === 'published' &&
    product.slug &&
    !/^(test|new)-product$/i.test(product.slug)
  ));

  const entries = [
    ...PUBLIC_PAGES.flatMap(page => LOCALES.map(locale => urlEntry(locale, page))),
    ...products.flatMap(product => LOCALES.map(locale => urlEntry(locale, 'product', product.slug, productLastModified)))
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600');
  if (req.method === 'HEAD') return res.status(200).end();
  return res.status(200).send(xml);
};
