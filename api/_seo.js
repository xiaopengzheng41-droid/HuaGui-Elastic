const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ORIGIN = 'https://www.huaguielastic.com';
const SITE_ROOT = path.join(process.cwd(), 'huagui_company_site');
const LOCALES = ['en', 'es', 'pt-br', 'ru', 'ar'];
const LOCALE_META = {
  en: { lang: 'en', dir: 'ltr', ogLocale: 'en_US' },
  es: { lang: 'es', dir: 'ltr', ogLocale: 'es_ES' },
  'pt-br': { lang: 'pt-BR', dir: 'ltr', ogLocale: 'pt_BR' },
  ru: { lang: 'ru', dir: 'ltr', ogLocale: 'ru_RU' },
  ar: { lang: 'ar', dir: 'rtl', ogLocale: 'ar_AR' }
};

const PAGE_FILES = {
  index: 'index.html',
  products: 'products.html',
  service: 'service.html',
  factory: 'factory.html',
  exhibitions: 'exhibitions.html',
  faq: 'faq.html',
  about: 'about.html',
  contact: 'contact.html',
  privacy: 'privacy.html'
};

const PAGE_META = {
  en: {
    index: ['Huagui Elastic | Custom Underwear Elastic Manufacturer', 'Custom underwear, lingerie and bra elastic webbing manufacturer. Printed, jacquard, binding, picot and bra strap elastics with OEM development.'],
    products: ['Underwear & Lingerie Elastic Webbing Products | Huagui', 'Browse Huagui elastic webbing for underwear, lingerie, bras and intimate apparel by model, construction, material, width and application.'],
    service: ['Custom Elastic Webbing Development | Huagui Elastic', 'Develop custom elastic webbing with buyer-specified logo, pattern, color, width, stretch, handfeel and packing for intimate apparel production.'],
    factory: ['Elastic Webbing Factory & Quality Control | Huagui', 'See Huagui production, weaving, crochet, continuous dyeing, package dyeing and pre-shipment quality-control capabilities.'],
    exhibitions: ['Global Intimate Apparel Trade Fairs | Huagui Elastic', 'See Huagui Elastic at intimate apparel and textile exhibitions in Latin America, South Asia and Southeast Asia.'],
    faq: ['Elastic Webbing Buyer FAQ | Huagui Elastic', 'Answers about custom elastic MOQ, color quantity, samples, lead time, capacity, materials, color fastness, trade terms and distributor cooperation.'],
    about: ['About Huagui Elastic | Manufacturer Since 1987', 'Shantou Huagui Industrial Co., Ltd. has manufactured custom elastic webbing for underwear, lingerie and bras since 1987.'],
    contact: ['Request Elastic Samples & Quotation | Huagui Elastic', 'Contact Huagui Elastic for samples, product development, wholesale quotations and distributor cooperation. English-language sales support.'],
    privacy: ['Privacy Policy | Huagui Elastic', 'Read how Huagui Elastic handles business inquiry details, contact information and submitted product requirements.']
  },
  es: {
    index: ['Huagui Elastic | Fabricante de elásticos para ropa interior', 'Fabricante de cintas elásticas para ropa interior, lencería y sujetadores. Elásticos estampados, jacquard, de ribete, picot y para tirantes con desarrollo OEM.'],
    products: ['Cintas elásticas para ropa interior y lencería | Huagui', 'Explore cintas elásticas Huagui por modelo, construcción, material, ancho y aplicación para ropa interior, lencería y sujetadores.'],
    service: ['Desarrollo de cintas elásticas personalizadas | Huagui', 'Desarrolle cintas elásticas con logotipo, diseño, color, ancho, elasticidad, tacto y embalaje especificados para prendas íntimas.'],
    factory: ['Fábrica y control de calidad de cintas elásticas | Huagui', 'Conozca la producción, tejido, crochet, teñido continuo, teñido en paquetes y control de calidad de Huagui.'],
    exhibitions: ['Ferias internacionales de ropa íntima | Huagui Elastic', 'Conozca la presencia de Huagui Elastic en ferias textiles y de ropa íntima en América Latina, Asia del Sur y Sudeste Asiático.'],
    faq: ['Preguntas de compradores de cintas elásticas | Huagui', 'Respuestas sobre MOQ, cantidad por color, muestras, plazos, capacidad, materiales, solidez del color, términos comerciales y distribuidores.'],
    about: ['Sobre Huagui Elastic | Fabricante desde 1987', 'Shantou Huagui Industrial Co., Ltd. fabrica cintas elásticas personalizadas para ropa interior, lencería y sujetadores desde 1987.'],
    contact: ['Solicitar muestras y cotización de elásticos | Huagui', 'Contacte con Huagui Elastic para muestras, desarrollo de productos, cotizaciones mayoristas y cooperación con distribuidores.'],
    privacy: ['Política de privacidad | Huagui Elastic', 'Conozca cómo Huagui Elastic trata los datos de consultas comerciales, información de contacto y requisitos de producto enviados.']
  },
  'pt-br': {
    index: ['Huagui Elastic | Fabricante de elásticos para roupa íntima', 'Fabricante de fitas elásticas para roupa íntima, lingerie e sutiãs. Elásticos estampados, jacquard, para debrum, picot e alças com desenvolvimento OEM.'],
    products: ['Fitas elásticas para roupa íntima e lingerie | Huagui', 'Veja as fitas elásticas Huagui por modelo, construção, material, largura e aplicação para roupa íntima, lingerie e sutiãs.'],
    service: ['Desenvolvimento de fitas elásticas personalizadas | Huagui', 'Desenvolva fitas elásticas com logo, padrão, cor, largura, elasticidade, toque e embalagem definidos para moda íntima.'],
    factory: ['Fábrica e controle de qualidade de fitas elásticas | Huagui', 'Conheça a produção, tecelagem, crochê, tingimento contínuo, tingimento em pacotes e controle de qualidade da Huagui.'],
    exhibitions: ['Feiras internacionais de moda íntima | Huagui Elastic', 'Veja a participação da Huagui Elastic em feiras têxteis e de moda íntima na América Latina, Sul da Ásia e Sudeste Asiático.'],
    faq: ['Perguntas de compradores de fitas elásticas | Huagui', 'Respostas sobre MOQ, quantidade por cor, amostras, prazo, capacidade, materiais, solidez da cor, termos comerciais e distribuidores.'],
    about: ['Sobre a Huagui Elastic | Fabricante desde 1987', 'A Shantou Huagui Industrial Co., Ltd. fabrica fitas elásticas personalizadas para roupa íntima, lingerie e sutiãs desde 1987.'],
    contact: ['Solicite amostras e cotação de elásticos | Huagui', 'Fale com a Huagui Elastic sobre amostras, desenvolvimento de produtos, cotações por atacado e parceria com distribuidores.'],
    privacy: ['Política de privacidade | Huagui Elastic', 'Saiba como a Huagui Elastic trata dados de consultas comerciais, informações de contato e requisitos de produtos enviados.']
  },
  ru: {
    index: ['Huagui Elastic | Производитель эластичных лент для белья', 'Производитель эластичных лент для нижнего белья, бюстгальтеров и интимной одежды: печать, жаккард, окантовка, пико и бретели под заказ.'],
    products: ['Эластичные ленты для нижнего белья | Huagui', 'Каталог эластичных лент Huagui по модели, конструкции, материалу, ширине и применению для нижнего белья и бюстгальтеров.'],
    service: ['Разработка эластичных лент под заказ | Huagui', 'Разработка лент с заданными логотипом, рисунком, цветом, шириной, растяжимостью, тактильностью и упаковкой.'],
    factory: ['Фабрика эластичных лент и контроль качества | Huagui', 'Производство, ткачество, вязание, непрерывное и пакетное крашение, а также контроль качества на фабрике Huagui.'],
    exhibitions: ['Международные выставки нижнего белья | Huagui Elastic', 'Участие Huagui Elastic в текстильных выставках и выставках нижнего белья в Латинской Америке, Южной и Юго-Восточной Азии.'],
    faq: ['Вопросы покупателей эластичных лент | Huagui', 'Ответы о MOQ, минимуме на цвет, образцах, сроках, мощности, материалах, стойкости окраски, условиях поставки и дистрибуции.'],
    about: ['О компании Huagui Elastic | Производитель с 1987 года', 'Shantou Huagui Industrial Co., Ltd. производит эластичные ленты для нижнего белья, бюстгальтеров и интимной одежды с 1987 года.'],
    contact: ['Запрос образцов и цены на эластичные ленты | Huagui', 'Свяжитесь с Huagui Elastic для получения образцов, разработки продукта, оптовой цены и обсуждения дистрибуции.'],
    privacy: ['Политика конфиденциальности | Huagui Elastic', 'Как Huagui Elastic обрабатывает данные деловых запросов, контактную информацию и требования к продукту.']
  },
  ar: {
    index: ['Huagui Elastic | مصنع أشرطة مطاطية للملابس الداخلية', 'مصنع أشرطة مطاطية مخصصة للملابس الداخلية واللانجري وحمالات الصدر، تشمل الطباعة والجاكارد والحواف والبيكو والحمالات.'],
    products: ['أشرطة مطاطية للملابس الداخلية واللانجري | Huagui', 'استعرض أشرطة Huagui المطاطية حسب الموديل والبنية والخامة والعرض والاستخدام للملابس الداخلية واللانجري وحمالات الصدر.'],
    service: ['تطوير أشرطة مطاطية مخصصة | Huagui', 'تطوير أشرطة مطاطية بشعار ونقشة ولون وعرض ومرونة وملمس وتعبئة حسب متطلبات منتجات الملابس الداخلية.'],
    factory: ['مصنع الأشرطة المطاطية ومراقبة الجودة | Huagui', 'تعرّف على قدرات Huagui في الإنتاج والنسيج والكروشيه والصباغة المستمرة وصباغة الخيوط وفحص الجودة.'],
    exhibitions: ['معارض الملابس الداخلية والمنسوجات الدولية | Huagui', 'مشاركة Huagui Elastic في معارض المنسوجات والملابس الداخلية في أمريكا اللاتينية وجنوب آسيا وجنوب شرق آسيا.'],
    faq: ['أسئلة مشتري الأشرطة المطاطية | Huagui', 'إجابات حول الحد الأدنى للطلب واللون والعينات والمهلة والطاقة والخامات وثبات اللون وشروط التجارة والتوزيع.'],
    about: ['عن Huagui Elastic | مصنع منذ عام 1987', 'تنتج Shantou Huagui Industrial Co., Ltd. أشرطة مطاطية مخصصة للملابس الداخلية واللانجري وحمالات الصدر منذ عام 1987.'],
    contact: ['اطلب عينات وعرض سعر للأشرطة المطاطية | Huagui', 'تواصل مع Huagui Elastic للحصول على عينات وتطوير منتجات وعروض أسعار بالجملة ومناقشة شراكة التوزيع.'],
    privacy: ['سياسة الخصوصية | Huagui Elastic', 'تعرّف على كيفية تعامل Huagui Elastic مع بيانات الاستفسارات التجارية ومعلومات الاتصال ومتطلبات المنتجات المرسلة.']
  }
};

const TRANSLATOR_SOURCES = [
  'assets/js/leaf-translations.js',
  'assets/js/page-translations.js',
  'assets/js/i18n.js'
];
const translatorCache = new Map();

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeXml(value) {
  return escapeHtml(value).replace(/&#39;/g, '&apos;');
}

function decodeEntities(value) {
  return String(value ?? '')
    .replace(/&nbsp;/gi, '\u00a0')
    .replace(/&copy;/gi, '©')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&apos;|&#39;/gi, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)));
}

function createTranslator(locale) {
  if (locale === 'en') return value => String(value ?? '');
  if (translatorCache.has(locale)) return translatorCache.get(locale);

  const documentStub = {
    documentElement: { lang: '', dir: '', dataset: {} },
    head: { querySelector: () => null, appendChild: () => {} },
    createElement: () => ({ setAttribute(key, value) { this[key] = value; } }),
    addEventListener: () => {}
  };
  const sandbox = {
    window: {},
    location: {
      pathname: `/${locale}`,
      hostname: 'www.huaguielastic.com',
      search: '',
      origin: ORIGIN
    },
    document: documentStub,
    URL,
    console
  };
  vm.createContext(sandbox);
  TRANSLATOR_SOURCES.forEach(file => {
    const source = fs.readFileSync(path.join(SITE_ROOT, file), 'utf8');
    vm.runInContext(source, sandbox, { filename: file });
  });
  const translate = sandbox.window.HUAGUI_I18N?.translate;
  if (typeof translate !== 'function') throw new Error(`Unable to initialize ${locale} translation.`);
  translatorCache.set(locale, translate);
  return translate;
}

function translateHtml(html, locale) {
  if (locale === 'en') return html;
  const translate = createTranslator(locale);
  let skippedTag = '';
  return html.split(/(<[^>]+>)/g).map(part => {
    if (!part) return part;
    if (part.startsWith('<')) {
      const closing = part.match(/^<\/\s*(script|style|textarea)\b/i);
      if (closing) skippedTag = '';
      const opening = part.match(/^<\s*(script|style|textarea)\b/i);
      if (opening && !/^<\//.test(part)) skippedTag = opening[1].toLowerCase();
      if (skippedTag || closing || opening) return part;
      return part.replace(/\b(alt|title|placeholder|aria-label)=(['"])(.*?)\2/gi, (match, name, quote, value) => {
        const decoded = decodeEntities(value);
        const translated = translate(decoded);
        return translated === decoded ? match : `${name}=${quote}${escapeHtml(translated)}${quote}`;
      });
    }
    if (skippedTag || !part.trim()) return part;
    const leading = part.match(/^\s*/)?.[0] || '';
    const trailing = part.match(/\s*$/)?.[0] || '';
    const raw = part.slice(leading.length, part.length - trailing.length || undefined);
    const decoded = decodeEntities(raw);
    const translated = translate(decoded);
    return translated === decoded ? part : `${leading}${escapeHtml(translated)}${trailing}`;
  }).join('');
}

function localePrefix(locale) {
  return locale === 'en' ? '' : `/${locale}`;
}

function pagePath(locale, page, slug = '') {
  const prefix = localePrefix(locale);
  if (page === 'index') return prefix || '/';
  if (page === 'product') return `${prefix}/products/${encodeURIComponent(slug)}`;
  return `${prefix}/${PAGE_FILES[page]}`;
}

function absoluteUrl(value) {
  const text = String(value || '').trim();
  if (!text) return `${ORIGIN}/assets/images/huagui-logo.png`;
  if (/^https?:\/\//i.test(text)) return text;
  return new URL(text.startsWith('/') ? text : `/${text}`, `${ORIGIN}/`).href;
}

function serializeJsonLd(value) {
  return JSON.stringify(value, null, 2)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

function localizeAnchorHrefs(html, locale) {
  if (locale === 'en') {
    return html.replace(/(<a\b[^>]*\bhref=['"])index\.html(?=([?'"]))/gi, '$1/');
  }
  return html.replace(/(<a\b[^>]*\bhref=)(['"])(.*?)\2/gi, (match, before, quote, href) => {
    const value = String(href || '').trim();
    if (!value || value.startsWith('#') || /^(?:https?:|mailto:|tel:|javascript:|\/\/)/i.test(value)) return match;
    const url = new URL(value, `${ORIGIN}/`);
    if (url.origin !== ORIGIN || url.pathname.startsWith('/api/') || url.pathname.startsWith('/assets/') || url.pathname.startsWith('/uploads/')) return match;
    let pathname = url.pathname;
    const first = pathname.split('/').filter(Boolean)[0]?.toLowerCase();
    if (LOCALES.includes(first)) pathname = `/${pathname.split('/').filter(Boolean).slice(1).join('/')}`;
    if (pathname === '/index.html' || pathname === '/') pathname = '';
    url.pathname = `/${locale}${pathname}`;
    return `${before}${quote}${url.pathname}${url.search}${url.hash}${quote}`;
  });
}

function headerHtml(page) {
  const nav = [
    ['index', 'HOME'], ['products', 'PRODUCTS'], ['service', 'CUSTOM SOLUTIONS'],
    ['factory', 'FACTORY'], ['exhibitions', 'EXHIBITIONS'], ['faq', 'FAQ'],
    ['about', 'ABOUT US'], ['contact', 'CONTACT']
  ];
  return `<header data-seo-shell="header">
    <nav class="navbar" id="navbar">
      <div class="container">
        <a href="index.html" class="navbar-logo" aria-label="Huagui Elastic home">
          <img src="assets/images/huagui-logo.png" alt="Huagui Elastic logo"><span>HUAGUI ELASTIC</span>
        </a>
        <ul class="navbar-links" id="navLinks">${nav.map(([key, label]) => `<li><a href="${PAGE_FILES[key]}"${key === page ? ' class="active"' : ''}>${label}</a></li>`).join('')}</ul>
        <button class="navbar-toggle" id="navToggle" aria-label="Toggle menu"><span></span><span></span><span></span></button>
      </div>
    </nav>
  </header>`;
}

function footerHtml() {
  return `<footer data-seo-shell="footer"><div class="footer"><div class="container">
    <div class="footer-grid">
      <div class="footer-about">
        <div class="footer-logo"><img src="assets/images/huagui-logo.png" alt="Huagui Elastic logo"><span>HUAGUI ELASTIC</span></div>
        <p>Custom elastic webbing manufacturer for underwear, lingerie, bras, and intimate apparel brands.</p>
        <p>Printed, jacquard, plain, fold over, picot, knitted, binding, and bra strap elastic solutions.</p>
        <div class="footer-social-links" aria-label="Huagui Elastic social media"><a href="https://www.instagram.com/huaguielastic/" target="_blank" rel="noopener noreferrer">Instagram</a><a href="https://www.facebook.com/huaguielastic/" target="_blank" rel="noopener noreferrer">Facebook</a></div>
        <p class="footer-social-note">New factory and product Reels published daily.</p>
      </div>
      <div class="footer-links"><h4>Quick Links</h4><ul>
        <li><a href="index.html">Home</a></li><li><a href="products.html">Products</a></li><li><a href="service.html">Custom Solutions</a></li><li><a href="factory.html">Factory</a></li><li><a href="faq.html">Buyer FAQ</a></li><li><a href="contact.html">Contact</a></li><li><a href="privacy.html">Privacy Policy</a></li>
      </ul></div>
      <div class="footer-links"><h4>Products</h4><ul>
        <li><a href="products.html?cat=mens">Men's Underwear Elastics</a></li><li><a href="products.html?cat=womens">Women's Underwear Elastics</a></li><li><a href="products.html?cat=lingerie">Bra &amp; Lingerie Elastics</a></li><li><a href="products.html?cat=activewear">Activewear Elastics</a></li><li><a href="products.html?tag=binding">Binding &amp; Edge Elastics</a></li>
      </ul></div>
      <div class="footer-links"><h4>Contact</h4><ul>
        <li>evenzheng@vip.163.com</li><li>Tel: +86 0754 8776 3266</li><li><a href="https://wa.me/8613531183266" target="_blank" rel="noopener">WhatsApp: +86 13531183266</a></li><li>WeChat: +86 13822883266</li><li>English-language sales support</li><li>No. 1 Jintian Road, Xiashan, Chaonan District, Shantou, Guangdong, China</li><li>Sample and bulk order support</li>
      </ul></div>
    </div>
    <div class="footer-bottom"><p>&copy; 2026 Huagui Elastic. Custom elastic webbing for global intimate apparel brands.</p></div>
  </div></div></footer>`;
}

function injectShell(html, page) {
  let output = html.replace(/<div id="app">/i, `<div id="app">${headerHtml(page)}`);
  output = output.replace(/<\/main>\s*<\/div>\s*(?=<script)/i, `</main>${footerHtml()}</div>`);
  return output;
}

function removeExistingSeoTags(html) {
  return html
    .replace(/\s*<link\b[^>]*\brel=['"](?:canonical|alternate)['"][^>]*>/gi, '')
    .replace(/\s*<meta\b[^>]*(?:property=['"]og:[^'"]+['"]|name=['"](?:twitter:[^'"]+|robots)['"])[^>]*>/gi, '');
}

function alternateLinks(page, slug = '') {
  const links = LOCALES.map(locale => `<link rel="alternate" hreflang="${LOCALE_META[locale].lang}" href="${ORIGIN}${pagePath(locale, page, slug)}">`);
  links.push(`<link rel="alternate" hreflang="x-default" href="${ORIGIN}${pagePath('en', page, slug)}">`);
  return links.join('\n  ');
}

function injectSeoHead(html, { locale, page, slug = '', title, description, image, type = 'website', robots = 'index, follow, max-image-preview:large' }) {
  const canonical = `${ORIGIN}${pagePath(locale, page, slug)}`;
  const pageImage = absoluteUrl(image || 'assets/images/factory-crochet-workshop.webp');
  const meta = LOCALE_META[locale];
  let output = removeExistingSeoTags(html)
    .replace(/<html\b[^>]*>/i, `<html lang="${meta.lang}" dir="${meta.dir}" data-locale="${locale}">`)
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`)
    .replace(/<meta\s+name=['"]description['"][^>]*>/i, `<meta name="description" content="${escapeHtml(description)}">`);
  const tags = `<meta name="robots" content="${robots}">
  <link rel="canonical" href="${canonical}">
  ${alternateLinks(page, slug)}
  <meta property="og:type" content="${type}">
  <meta property="og:site_name" content="Huagui Elastic">
  <meta property="og:locale" content="${meta.ogLocale}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${pageImage}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${pageImage}">`;
  output = output.replace(/<\/head>/i, `  ${tags}\n</head>`);
  return output;
}

function formatTag(tag) {
  const labels = {
    printed: 'Printed', jacquard: 'Jacquard', debossed: 'Debossed', embossed: 'Embossed', lurex: 'Lurex', plain: 'Plain',
    'fold-over': 'Fold Over', picot: 'Picot', 'silicone-grip': 'Silicone Grip', 'bra-strap': 'Bra Strap', waistband: 'Waistband',
    lingerie: 'Lingerie', activewear: 'Activewear', binding: 'Binding', 'decorative-edge': 'Decorative Edge', reflective: 'Reflective',
    'elastic-tape': 'Elastic Tape', knitted: 'Knitted', 'womens-underwear': "Women's Underwear"
  };
  return labels[tag] || tag;
}

function itemNumber(product) {
  return product.specs?.find(spec => /^item\s*(?:no\.?|number)$/i.test(String(spec.label || '').trim()))?.value || '';
}

function productCardsHtml(products, locale) {
  const translate = createTranslator(locale);
  return products.map(product => {
    const url = pagePath(locale, 'product', product.slug);
    const name = translate(product.name);
    return `<article class="product-card" data-seo-product-card>
      <a class="product-card-img" href="${url}" aria-label="${escapeHtml(name)}"><img src="${escapeHtml(product.image)}" alt="${escapeHtml(name)}" loading="lazy"></a>
      <div class="product-card-body">
        <p class="material">${escapeHtml(translate(product.categoryLabel))}</p>
        <h3><a href="${url}">${escapeHtml(name)}</a></h3>
        <div class="tag-row">${(product.tags || []).map(tag => `<span>${escapeHtml(translate(formatTag(tag)))}</span>`).join('')}</div>
        <div class="specs">${(product.specs || []).filter(spec => spec.label && spec.value).slice(0, 4).map(spec => `<span>${escapeHtml(translate(spec.label))}: ${escapeHtml(translate(spec.value))}</span>`).join('')}</div>
        <a href="${url}" class="btn-inquiry">${escapeHtml(translate('View Details'))}</a>
      </div>
    </article>`;
  }).join('');
}

function injectCatalog(html, products, locale) {
  return html
    .replace(/<p class="product-count" id="productCount">[\s\S]*?<\/p>/i, `<p class="product-count" id="productCount">${products.length} elastic solutions</p>`)
    .replace(/<div class="products-grid" id="productsGrid"><\/div>/i, `<div class="products-grid" id="productsGrid">${productCardsHtml(products, locale)}</div>`);
}

function injectFeaturedProducts(html, products, locale) {
  return html.replace(/<div class="products-grid" id="featuredProducts"><\/div>/i, `<div class="products-grid" id="featuredProducts">${productCardsHtml(products.slice(0, 6), locale)}</div>`);
}

function localizeFaqJsonLd(html, locale) {
  if (locale === 'en') return html;
  const translate = createTranslator(locale);
  return html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi, (match, json) => {
    try {
      const data = JSON.parse(json);
      if (data['@type'] !== 'FAQPage' || !Array.isArray(data.mainEntity)) return match;
      data.mainEntity.forEach(item => {
        if (item.name) item.name = translate(item.name);
        if (item.acceptedAnswer?.text) item.acceptedAnswer.text = translate(item.acceptedAnswer.text);
      });
      return `<script type="application/ld+json">\n${JSON.stringify(data, null, 2)}\n  </script>`;
    } catch {
      return match;
    }
  });
}

function productDescription(product, locale) {
  const translate = createTranslator(locale);
  const name = translate(product.name);
  const applicationSource = product.applications?.[0] || product.specs?.find(spec => /^application$/i.test(spec.label))?.value || '';
  const application = translate(applicationSource);
  const suffix = {
    en: `Custom color, width, stretch, logo and packing from Huagui Elastic.`,
    es: 'Color, ancho, elasticidad, logotipo y embalaje personalizados de Huagui Elastic.',
    'pt-br': 'Cor, largura, elasticidade, logo e embalagem personalizados da Huagui Elastic.',
    ru: 'Цвет, ширина, растяжимость, логотип и упаковка под заказ от Huagui Elastic.',
    ar: 'لون وعرض ومرونة وشعار وتعبئة مخصصة من Huagui Elastic.'
  }[locale];
  const forApplication = application ? {
    en: `${name} for ${application}.`,
    es: `${name} para ${application}.`,
    'pt-br': `${name} para ${application}.`,
    ru: `${name} для применения: ${application}.`,
    ar: `${name} للاستخدام في ${application}.`
  }[locale] : name;
  return `${forApplication} ${suffix}`;
}

function productTitle(product, locale) {
  const name = createTranslator(locale)(product.name);
  return {
    en: `${name} Manufacturer | Huagui Elastic`,
    es: `Fabricante de ${name} | Huagui Elastic`,
    'pt-br': `Fabricante de ${name} | Huagui Elastic`,
    ru: `Производитель ${name} | Huagui Elastic`,
    ar: `مصنع ${name} | Huagui Elastic`
  }[locale];
}

function productDetailHtml(product, locale) {
  const translate = createTranslator(locale);
  const name = translate(product.name);
  const intro = translate(product.intro || productDescription(product, locale));
  const gallery = (product.gallery || []).filter(item => item?.src);
  const mainImage = gallery[0] || { src: product.image, label: 'Product Display', alt: name };
  const quote = `${pagePath(locale, 'contact')}?${new URLSearchParams({ productName: product.name, category: product.category, itemNo: itemNumber(product) }).toString()}`;
  return `<section class="product-detail-shell" data-seo-product-detail><div class="container">
    <div class="breadcrumb"><a href="${pagePath(locale, 'index')}">${escapeHtml(translate('Home'))}</a><span>/</span><a href="${pagePath(locale, 'products')}">${escapeHtml(translate('Products'))}</a><span>/</span><strong>${escapeHtml(translate(product.categoryLabel))}</strong></div>
    <div class="product-detail-layout">
      <aside class="detail-sidebar">
        <p class="section-label">${escapeHtml(translate(product.categoryLabel))}</p><h1>${escapeHtml(name)}</h1><div class="detail-title-dash"></div>
        <p class="product-intro">${escapeHtml(intro)}</p>
        <a href="${escapeHtml(quote)}" class="btn btn-primary mobile-primary-cta">${escapeHtml(translate('Request Quote'))}</a>
        <div class="detail-highlight-icons" aria-label="Product highlights"><div><span>↔</span><span>${escapeHtml(translate('Custom Width'))}</span></div><div><span>●</span><span>${escapeHtml(translate('Color Matching'))}</span></div><div><span>≈</span><span>${escapeHtml(translate('Stretch To Spec'))}</span></div></div>
        <div class="tag-row">${(product.tags || []).map(tag => `<span>${escapeHtml(translate(formatTag(tag)))}</span>`).join('')}</div>
      </aside>
      <section class="detail-main-column" aria-label="Product details">
        <div class="product-gallery-card"><div class="image-note"><strong>${escapeHtml(translate(mainImage.label || 'Product Display'))}</strong><span>${escapeHtml(translate('Click thumbnails to view available product angles.'))}</span></div><div class="product-main-image"><img src="${escapeHtml(mainImage.src || product.image)}" alt="${escapeHtml(translate(mainImage.alt || name))}"></div></div>
        <div class="product-info-table"><div class="product-info-head"><h2>${escapeHtml(translate('Product Details'))}</h2><p>${escapeHtml(translate('Buyer-focused product features and fabric parameters for quotation review.'))}</p></div>
          ${(product.features || []).length ? `<section class="product-detail-block"><h3>${escapeHtml(translate('Features'))}</h3><ul class="product-feature-list">${product.features.map(feature => `<li>${escapeHtml(translate(feature))}</li>`).join('')}</ul></section>` : ''}
          <section class="product-detail-block product-spec-block"><h3>${escapeHtml(translate('Specifications'))}</h3><table class="product-spec-table" aria-label="Product specifications"><tbody>${(product.specs || []).filter(spec => spec.label && spec.value).map(spec => `<tr><th scope="row">${escapeHtml(translate(spec.label))}</th><td>${escapeHtml(translate(spec.value))}</td></tr>`).join('')}</tbody></table></section>
        </div>
      </section>
      <aside class="detail-thumbs" aria-label="Product image gallery"><p>${escapeHtml(translate('Gallery'))}</p><div class="product-thumbs">${gallery.map((item, index) => `<div class="product-thumb-section"><span class="product-thumb-group">${escapeHtml(translate(item.group || 'Product Display'))}</span><span class="product-thumb-media"><img src="${escapeHtml(item.src)}" alt="${escapeHtml(translate(item.alt || `${name} view ${index + 1}`))}" loading="lazy"></span><span class="product-thumb-name">${escapeHtml(translate(item.label || `View ${index + 1}`))}</span></div>`).join('')}</div></aside>
    </div>
  </div></section>
  <section class="cta-banner" style="background-image:url('${escapeHtml(product.image)}')"><div class="hero-overlay"></div><div class="container cta-banner-content"><h2>${escapeHtml(translate(`Need ${product.name} With Your Brand Details?`))}</h2><p>${escapeHtml(translate('Send width, color, logo artwork, target quantity, and garment application for a faster quotation.'))}</p><a href="${escapeHtml(quote)}" class="btn btn-white">${escapeHtml(translate('Start Inquiry'))}</a></div></section>`;
}

function productStructuredData(product, locale) {
  const translate = createTranslator(locale);
  const image = (product.gallery || []).filter(item => item?.src).map(item => absoluteUrl(item.src));
  if (!image.length && product.image) image.push(absoluteUrl(product.image));
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    url: `${ORIGIN}${pagePath(locale, 'product', product.slug)}`,
    name: translate(product.name),
    description: productDescription(product, locale),
    image,
    ...(itemNumber(product) ? { sku: itemNumber(product) } : {}),
    brand: { '@type': 'Brand', name: 'Huagui Elastic' },
    manufacturer: {
      '@type': 'Organization',
      '@id': `${ORIGIN}/#organization`,
      name: 'Huagui Elastic',
      legalName: 'Shantou Huagui Industrial Co., Ltd.',
      url: `${ORIGIN}/`
    },
    category: translate(product.categoryLabel),
    additionalProperty: (product.specs || []).filter(spec => spec.label && spec.value).map(spec => ({ '@type': 'PropertyValue', name: translate(spec.label), value: translate(spec.value) }))
  };
}

function productBreadcrumbStructuredData(product, locale) {
  const translate = createTranslator(locale);
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: translate('Home'), item: `${ORIGIN}${pagePath(locale, 'index')}` },
      { '@type': 'ListItem', position: 2, name: translate('Products'), item: `${ORIGIN}${pagePath(locale, 'products')}` },
      { '@type': 'ListItem', position: 3, name: translate(product.name), item: `${ORIGIN}${pagePath(locale, 'product', product.slug)}` }
    ]
  };
}

function renderStaticPage({ page, locale, products = [] }) {
  const file = PAGE_FILES[page];
  if (!file) return null;
  let html = fs.readFileSync(path.join(SITE_ROOT, file), 'utf8');
  if (page === 'products') html = injectCatalog(html, products, locale);
  if (page === 'index') html = injectFeaturedProducts(html, products, locale);
  html = injectShell(html, page);
  html = localizeAnchorHrefs(html, locale);
  html = translateHtml(html, locale);
  if (page === 'faq') html = localizeFaqJsonLd(html, locale);
  const [title, description] = PAGE_META[locale][page];
  return injectSeoHead(html, { locale, page, title, description, image: page === 'products' && products[0]?.image ? products[0].image : undefined });
}

function renderProductPage({ product, locale }) {
  let html = fs.readFileSync(path.join(SITE_ROOT, 'product-detail.html'), 'utf8');
  html = html.replace(
    /<link\s+rel=['"]preload['"]\s+as=['"]image['"][^>]*>/i,
    `<link rel="preload" as="image" href="${escapeHtml(product.image)}" fetchpriority="high">`
  );
  html = html.replace('<main id="productDetail"></main>', `<main id="productDetail">${productDetailHtml(product, locale)}</main>`);
  html = injectShell(html, 'product');
  html = localizeAnchorHrefs(html, locale);
  html = translateHtml(html, locale);
  const structured = `<script id="productStructuredData" type="application/ld+json">\n${serializeJsonLd(productStructuredData(product, locale))}\n  </script>\n  <script id="productBreadcrumbStructuredData" type="application/ld+json">\n${serializeJsonLd(productBreadcrumbStructuredData(product, locale))}\n  </script>`;
  html = html.replace(/<\/head>/i, `  ${structured}\n</head>`);
  return injectSeoHead(html, {
    locale,
    page: 'product',
    slug: product.slug,
    title: productTitle(product, locale),
    description: productDescription(product, locale),
    image: product.image,
    type: 'product'
  });
}

function renderNotFound({ locale = 'en' } = {}) {
  const title = locale === 'en' ? 'Page Not Found | Huagui Elastic' : createTranslator(locale)('Product Not Found');
  const message = locale === 'en' ? 'The requested product or page is not available.' : createTranslator(locale)('This product is not currently published.');
  const html = `<!DOCTYPE html><html lang="${LOCALE_META[locale].lang}" dir="${LOCALE_META[locale].dir}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="robots" content="noindex, nofollow"><title>${escapeHtml(title)}</title><link rel="stylesheet" href="/assets/css/style.css?v=site-cms-20260718-inquiries"></head><body><div id="app">${headerHtml('')}<main><section class="section"><div class="container"><p class="section-label">404</p><h1>${escapeHtml(title)}</h1><p>${escapeHtml(message)}</p><a href="${pagePath(locale, 'products')}" class="btn btn-primary">${escapeHtml(createTranslator(locale)('View Products'))}</a></div></section></main>${footerHtml()}</div></body></html>`;
  return localizeAnchorHrefs(translateHtml(html, locale), locale);
}

function validLocale(value) {
  const locale = String(value || 'en').toLowerCase();
  return LOCALES.includes(locale) ? locale : 'en';
}

function validPage(value) {
  const page = String(value || 'index').toLowerCase().replace(/\.html$/, '');
  return PAGE_FILES[page] ? page : '';
}

module.exports = {
  LOCALES,
  LOCALE_META,
  ORIGIN,
  PAGE_FILES,
  createTranslator,
  escapeXml,
  pagePath,
  renderNotFound,
  renderProductPage,
  renderStaticPage,
  validLocale,
  validPage
};
