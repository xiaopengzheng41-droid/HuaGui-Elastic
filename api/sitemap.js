const { loadProducts } = require('./_cms');

const ORIGIN = 'https://www.huaguielastic.com';
const LOCALES = ['', '/es', '/pt-br', '/ru', '/ar'];
const PAGES = ['', '/products.html', '/service.html', '/factory.html', '/exhibitions.html', '/faq.html', '/about.html', '/contact.html', '/privacy.html'];

function escapeXml(value) {
  return String(value).replace(/[<>&'\"]/g, character => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;'
  })[character]);
}

module.exports = async function sitemapHandler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end('Method not allowed');
  }

  let products = [];
  try {
    products = await loadProducts({ includeDrafts: false });
  } catch (error) {
    // The static pages remain discoverable if the product store is temporarily unavailable.
  }

  const paths = [
    ...LOCALES.flatMap(locale => PAGES.map(page => `${locale}${page}` || '/')),
    ...LOCALES.flatMap(locale => products
      .filter(product => product && product.status === 'published' && product.slug && !/^(test|new)-product$/i.test(product.slug))
      .map(product => `${locale}/products/${encodeURIComponent(product.slug)}`))
  ];

  const urls = [...new Set(paths)].map(path => `  <url><loc>${escapeXml(`${ORIGIN}${path}`)}</loc></url>`).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600');
  return res.status(200).send(xml);
};
