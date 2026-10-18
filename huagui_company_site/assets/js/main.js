// ========== Global Contact ==========
const CONTACT_INFO = {
  email: 'evenzheng@vip.163.com',
  address: 'No. 1 Jintian Road, Xiashan, Chaonan District, Shantou, Guangdong, China',
  tel: '+86 0754 8776 3266',
  sales: {
    name: 'Mr. Zheng',
    wechat: '+86 13822883266',
    whatsapp: '+86 13531183266',
    whatsappUrl: 'https://wa.me/8613531183266',
    replyLanguage: 'English'
  },
  people: [
    {
      name: 'Mr. Zheng',
      mobileWechat: '+86 13822883266',
      whatsapp: '+86 13531183266'
    }
  ]
};

const SOCIAL_INFO = {
  instagram: 'https://www.instagram.com/huaguielastic/',
  facebook: 'https://www.facebook.com/huaguielastic/'
};

window.HUAGUI_CONTACT_INFO = CONTACT_INFO;
window.HUAGUI_SOCIAL_INFO = SOCIAL_INFO;

function getContactCardsHtml() {
  return `
    <div class="contact-info-card">
      <div class="contact-info-icon">@</div>
      <div>
        <h4>Email</h4>
        <p>${CONTACT_INFO.email}</p>
      </div>
    </div>
    <div class="contact-info-card">
      <div class="contact-info-icon">T</div>
      <div>
        <h4>Tel</h4>
        <p>${CONTACT_INFO.tel}</p>
      </div>
    </div>
    <div class="contact-info-card">
      <div class="contact-info-icon">W</div>
      <div>
        <h4>Global WhatsApp & WeChat</h4>
        <p>${CONTACT_INFO.sales.name}<br><a href="${CONTACT_INFO.sales.whatsappUrl}" target="_blank" rel="noopener">WhatsApp: ${CONTACT_INFO.sales.whatsapp}</a><br>WeChat: ${CONTACT_INFO.sales.wechat}<br>Reply language: ${CONTACT_INFO.sales.replyLanguage}</p>
      </div>
    </div>
    <div class="contact-info-card">
      <div class="contact-info-icon">CN</div>
      <div>
        <h4>Address</h4>
        <p>${CONTACT_INFO.address}</p>
      </div>
    </div>
  `;
}

function renderGlobalContactInfo() {
  const contactInfo = document.querySelector('[data-contact-info]');
  if (contactInfo) {
    contactInfo.innerHTML = getContactCardsHtml();
  }
}

// ========== Header/Footer Injection ==========
function injectFavicons() {
  const icons = [
    { rel: 'icon', type: 'image/png', href: 'assets/images/huagui-logo.png' },
    { rel: 'apple-touch-icon', href: 'assets/images/huagui-logo.png' }
  ];
  icons.forEach(icon => {
    if (document.head.querySelector(`link[rel="${icon.rel}"]`)) return;
    const link = document.createElement('link');
    Object.entries(icon).forEach(([key, value]) => link.setAttribute(key, value));
    document.head.appendChild(link);
  });
  if (!document.head.querySelector('meta[name="theme-color"]')) {
    const theme = document.createElement('meta');
    theme.name = 'theme-color';
    theme.content = '#880830';
    document.head.appendChild(theme);
  }
}

function injectHeader() {
  const path = window.location.pathname;
  const isActive = (page) => path.endsWith(page) || (page === 'index.html' && path.endsWith('/')) ? ' class="active"' : '';
  const header = document.createElement('header');
  header.innerHTML = `
    <nav class="navbar" id="navbar">
      <div class="container">
        <a href="index.html" class="navbar-logo" aria-label="Huagui Elastic home">
          <img src="assets/images/huagui-logo.png" alt="Huagui Elastic logo">
          <span>HUAGUI ELASTIC</span>
        </a>
        <ul class="navbar-links" id="navLinks">
          <li><a href="index.html"${isActive('index.html')}>HOME</a></li>
          <li><a href="products.html"${isActive('products.html')}>PRODUCTS</a></li>
          <li><a href="service.html"${isActive('service.html')}>CUSTOM SOLUTIONS</a></li>
          <li><a href="factory.html"${isActive('factory.html')}>FACTORY</a></li>
          <li><a href="exhibitions.html"${isActive('exhibitions.html')}>EXHIBITIONS</a></li>
          <li><a href="faq.html"${isActive('faq.html')}>FAQ</a></li>
          <li><a href="about.html"${isActive('about.html')}>ABOUT US</a></li>
          <li><a href="contact.html"${isActive('contact.html')}>CONTACT</a></li>
        </ul>
        <button class="navbar-toggle" id="navToggle" aria-label="Toggle menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  `;
  document.getElementById('app').prepend(header);
}

function injectFooter() {
  const footer = document.createElement('footer');
  footer.innerHTML = `
    <div class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-about">
            <div class="footer-logo">
              <img src="assets/images/huagui-logo.png" alt="Huagui Elastic logo">
              <span>HUAGUI ELASTIC</span>
            </div>
            <p>Custom elastic webbing manufacturer for underwear, lingerie, bras, and intimate apparel brands.</p>
            <p>Printed, jacquard, plain, fold over, picot, knitted, binding, and bra strap elastic solutions.</p>
            <div class="footer-social-links" aria-label="Huagui Elastic social media">
              <a href="${SOCIAL_INFO.instagram}" target="_blank" rel="noopener noreferrer" aria-label="Follow Huagui Elastic on Instagram">Instagram</a>
              <a href="${SOCIAL_INFO.facebook}" target="_blank" rel="noopener noreferrer" aria-label="Follow Huagui Elastic on Facebook">Facebook</a>
            </div>
            <p class="footer-social-note">New factory and product Reels published daily.</p>
          </div>
          <div class="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="index.html">Home</a></li>
              <li><a href="products.html">Products</a></li>
              <li><a href="service.html">Custom Solutions</a></li>
              <li><a href="factory.html">Factory</a></li>
              <li><a href="faq.html">Buyer FAQ</a></li>
              <li><a href="contact.html">Contact</a></li>
              <li><a href="privacy.html">Privacy Policy</a></li>
            </ul>
          </div>
          <div class="footer-links">
            <h4>Products</h4>
            <ul>
              <li><a href="products.html?cat=mens">Men's Underwear Elastics</a></li>
              <li><a href="products.html?cat=womens">Women's Underwear Elastics</a></li>
              <li><a href="products.html?cat=lingerie">Bra & Lingerie Elastics</a></li>
              <li><a href="products.html?cat=activewear">Activewear Elastics</a></li>
              <li><a href="products.html?tag=binding">Binding & Edge Elastics</a></li>
            </ul>
          </div>
          <div class="footer-links">
            <h4>Contact</h4>
            <ul>
              <li>${CONTACT_INFO.email}</li>
              <li>Tel: ${CONTACT_INFO.tel}</li>
              <li><a href="${CONTACT_INFO.sales.whatsappUrl}" target="_blank" rel="noopener">WhatsApp: ${CONTACT_INFO.sales.whatsapp}</a></li>
              <li>WeChat: ${CONTACT_INFO.sales.wechat}</li>
              <li>English-language sales support</li>
              <li>${CONTACT_INFO.address}</li>
              <li>Sample and bulk order support</li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2026 Huagui Elastic. Custom elastic webbing for global intimate apparel brands.</p>
        </div>
      </div>
    </div>
  `;
  document.getElementById('app').appendChild(footer);
}

// ========== Hero Slider ==========
function initSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dots .dot');
  if (!slides.length) return;
  let current = 0;
  let interval;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = index;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.dataset.index, 10));
      resetInterval();
    });
  });

  function next() { goTo((current + 1) % slides.length); }
  function resetInterval() { clearInterval(interval); interval = setInterval(next, 5000); }
  resetInterval();

  const slider = document.getElementById('heroSlider');
  if (slider) {
    slider.addEventListener('mouseenter', () => clearInterval(interval));
    slider.addEventListener('mouseleave', resetInterval);
  }
}

// ========== Mobile Menu ==========
function initMobileMenu() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => links.classList.toggle('active'));
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar')) links.classList.remove('active');
  });
}

function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  });
}

// ========== Product Data ==========
const CATEGORY_LABELS = {
  mens: "Men's Underwear Elastics",
  womens: "Women's Underwear Elastics",
  lingerie: 'Bra & Lingerie Elastics',
  activewear: 'Activewear Elastics'
};

const LEGACY_SPEC_LABELS = ['Width', 'Material', 'Printing', 'Handfeel'];

const IMAGE_LABEL_PRESETS = [
  { label: 'Front & Back', group: 'Product Display' },
  { label: 'Front', group: 'Product Display' },
  { label: 'Back', group: 'Product Display' },
  { label: 'Colors', group: 'Product Display' },
  { label: 'Application', group: 'Application' }
];

const PRODUCT_PREVIEW_KEY = 'huagui_product_preview';

const DEFAULT_PRODUCTS = [
  {
    "slug": "46mm",
    "name": "46 mm Silicone Grip Elastic",
    "category": "mens",
    "categoryLabel": "Men's Underwear Elastics",
    "status": "published",
    "sortOrder": 20,
    "image": "assets/images/products/catalog-2026/46mm/01.jpg",
    "gallery": [
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/46mm/01.jpg",
        "label": "Main View",
        "alt": "46 mm Silicone Grip Elastic product view 1",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/46mm/02.jpg",
        "label": "Product View 2",
        "alt": "46 mm Silicone Grip Elastic product view 2",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/46mm/03.jpg",
        "label": "Product View 3",
        "alt": "46 mm Silicone Grip Elastic product view 3",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/46mm/04.jpg",
        "label": "Product View 4",
        "alt": "46 mm Silicone Grip Elastic product view 4",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/46mm/05.jpg",
        "label": "Product View 5",
        "alt": "46 mm Silicone Grip Elastic product view 5",
        "rotate": false
      }
    ],
    "tags": [
      "silicone-grip"
    ],
    "specs": [
      {
        "label": "Item No.",
        "value": "46mm 硅胶带"
      },
      {
        "label": "Width",
        "value": "46 mm"
      },
      {
        "label": "Material",
        "value": "Polyester & Spandex"
      },
      {
        "label": "Application",
        "value": "Cycling shorts leg openings"
      }
    ],
    "intro": "Silicone Grip Elastic for cycling shorts leg openings, available for buyer-specific color, width, stretch, logo, and packing development.",
    "applications": [
      "Cycling shorts leg openings"
    ],
    "customOptions": [
      "Color matching",
      "Width and stretch",
      "Logo or pattern",
      "Roll and carton packing"
    ]
  },
  {
    "slug": "46mm-2",
    "name": "46 mm Ribbed Elastic Webbing",
    "category": "activewear",
    "categoryLabel": "Activewear Elastics",
    "status": "published",
    "sortOrder": 30,
    "image": "assets/images/products/catalog-2026/46mm-2/01.jpg",
    "gallery": [
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/46mm-2/01.jpg",
        "label": "Main View",
        "alt": "46 mm Ribbed Elastic Webbing product view 1",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/46mm-2/02.jpg",
        "label": "Product View 2",
        "alt": "46 mm Ribbed Elastic Webbing product view 2",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/46mm-2/03.jpg",
        "label": "Product View 3",
        "alt": "46 mm Ribbed Elastic Webbing product view 3",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/46mm-2/04.jpg",
        "label": "Product View 4",
        "alt": "46 mm Ribbed Elastic Webbing product view 4",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/46mm-2/05.jpg",
        "label": "Product View 5",
        "alt": "46 mm Ribbed Elastic Webbing product view 5",
        "rotate": false
      }
    ],
    "tags": [
      "activewear"
    ],
    "specs": [
      {
        "label": "Item No.",
        "value": "46mm 横纹带"
      },
      {
        "label": "Width",
        "value": "46 mm"
      },
      {
        "label": "Material",
        "value": "Polyester & Spandex"
      },
      {
        "label": "Application",
        "value": "Cycling apparel straps"
      }
    ],
    "intro": "Elastic Webbing for cycling apparel straps, available for buyer-specific color, width, stretch, logo, and packing development.",
    "applications": [
      "Cycling apparel straps"
    ],
    "customOptions": [
      "Color matching",
      "Width and stretch",
      "Logo or pattern",
      "Roll and carton packing"
    ]
  },
  {
    "slug": "5209",
    "name": "5209 | Fold Over Elastic",
    "category": "lingerie",
    "categoryLabel": "Bra & Lingerie Elastics",
    "status": "published",
    "sortOrder": 50,
    "image": "assets/images/products/catalog-2026/5209/01.jpg",
    "gallery": [
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/5209/01.jpg",
        "label": "Main View",
        "alt": "5209 | Fold Over Elastic product view 1",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/5209/02.jpg",
        "label": "Product View 2",
        "alt": "5209 | Fold Over Elastic product view 2",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/5209/03.jpg",
        "label": "Product View 3",
        "alt": "5209 | Fold Over Elastic product view 3",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/5209/04.jpg",
        "label": "Product View 4",
        "alt": "5209 | Fold Over Elastic product view 4",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/5209/05.jpg",
        "label": "Product View 5",
        "alt": "5209 | Fold Over Elastic product view 5",
        "rotate": false
      }
    ],
    "tags": [
      "fold-over",
      "binding"
    ],
    "specs": [
      {
        "label": "Item No.",
        "value": "5209"
      },
      {
        "label": "Width",
        "value": "13 / 15 mm"
      },
      {
        "label": "Material",
        "value": "Nylon & Spandex / Polyester & Latex / Polyester & Spandex"
      },
      {
        "label": "Application",
        "value": "Apparel binding"
      }
    ],
    "intro": "Fold Over Elastic for apparel binding, available for buyer-specific color, width, stretch, logo, and packing development.",
    "applications": [
      "Apparel binding"
    ],
    "customOptions": [
      "Color matching",
      "Width and stretch",
      "Logo or pattern",
      "Roll and carton packing"
    ]
  },
  {
    "slug": "5627",
    "name": "5627 | Picot Elastic",
    "category": "womens",
    "categoryLabel": "Women's Underwear Elastics",
    "status": "published",
    "sortOrder": 90,
    "image": "assets/images/products/catalog-2026/5627/01.jpg",
    "gallery": [
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/5627/01.jpg",
        "label": "Main View",
        "alt": "5627 | Picot Elastic product view 1",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/5627/02.jpg",
        "label": "Product View 2",
        "alt": "5627 | Picot Elastic product view 2",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/5627/03.jpg",
        "label": "Product View 3",
        "alt": "5627 | Picot Elastic product view 3",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/5627/04.jpg",
        "label": "Product View 4",
        "alt": "5627 | Picot Elastic product view 4",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/5627/05.jpg",
        "label": "Product View 5",
        "alt": "5627 | Picot Elastic product view 5",
        "rotate": false
      }
    ],
    "tags": [
      "picot",
      "waistband"
    ],
    "specs": [
      {
        "label": "Item No.",
        "value": "5627"
      },
      {
        "label": "Width",
        "value": "9 mm"
      },
      {
        "label": "Material",
        "value": "Nylon & Spandex"
      },
      {
        "label": "Application",
        "value": "Women's underwear waist and leg openings"
      }
    ],
    "intro": "Picot Elastic for women's underwear waist and leg openings, available for buyer-specific color, width, stretch, logo, and packing development.",
    "applications": [
      "Women's underwear waist and leg openings"
    ],
    "customOptions": [
      "Color matching",
      "Width and stretch",
      "Logo or pattern",
      "Roll and carton packing"
    ]
  },
  {
    "slug": "5862",
    "name": "5862 | Picot Elastic",
    "category": "womens",
    "categoryLabel": "Women's Underwear Elastics",
    "status": "published",
    "sortOrder": 100,
    "image": "assets/images/products/catalog-2026/5862/01.jpg",
    "gallery": [
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/5862/01.jpg",
        "label": "Main View",
        "alt": "5862 | Picot Elastic product view 1",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/5862/02.jpg",
        "label": "Product View 2",
        "alt": "5862 | Picot Elastic product view 2",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/5862/03.jpg",
        "label": "Product View 3",
        "alt": "5862 | Picot Elastic product view 3",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/5862/04.jpg",
        "label": "Product View 4",
        "alt": "5862 | Picot Elastic product view 4",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/5862/05.jpg",
        "label": "Product View 5",
        "alt": "5862 | Picot Elastic product view 5",
        "rotate": false
      }
    ],
    "tags": [
      "picot",
      "waistband"
    ],
    "specs": [
      {
        "label": "Item No.",
        "value": "5862"
      },
      {
        "label": "Width",
        "value": "8 mm"
      },
      {
        "label": "Material",
        "value": "Nylon & Spandex"
      },
      {
        "label": "Application",
        "value": "Women's underwear waist and leg openings"
      }
    ],
    "intro": "Picot Elastic for women's underwear waist and leg openings, available for buyer-specific color, width, stretch, logo, and packing development.",
    "applications": [
      "Women's underwear waist and leg openings"
    ],
    "customOptions": [
      "Color matching",
      "Width and stretch",
      "Logo or pattern",
      "Roll and carton packing"
    ]
  },
  {
    "slug": "6243",
    "name": "6243 | Fold Over Elastic",
    "category": "lingerie",
    "categoryLabel": "Bra & Lingerie Elastics",
    "status": "published",
    "sortOrder": 110,
    "image": "assets/images/products/catalog-2026/6243/01.jpg",
    "gallery": [
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/6243/01.jpg",
        "label": "Main View",
        "alt": "6243 | Fold Over Elastic product view 1",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/6243/02.jpg",
        "label": "Product View 2",
        "alt": "6243 | Fold Over Elastic product view 2",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/6243/03.jpg",
        "label": "Product View 3",
        "alt": "6243 | Fold Over Elastic product view 3",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/6243/04.jpg",
        "label": "Product View 4",
        "alt": "6243 | Fold Over Elastic product view 4",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/6243/05.jpg",
        "label": "Product View 5",
        "alt": "6243 | Fold Over Elastic product view 5",
        "rotate": false
      }
    ],
    "tags": [
      "fold-over",
      "binding"
    ],
    "specs": [
      {
        "label": "Item No.",
        "value": "6243"
      },
      {
        "label": "Width",
        "value": "10–40 mm"
      },
      {
        "label": "Material",
        "value": "Nylon & Spandex"
      },
      {
        "label": "Application",
        "value": "Apparel binding"
      }
    ],
    "intro": "Fold Over Elastic for apparel binding, available for buyer-specific color, width, stretch, logo, and packing development.",
    "applications": [
      "Apparel binding"
    ],
    "customOptions": [
      "Color matching",
      "Width and stretch",
      "Logo or pattern",
      "Roll and carton packing"
    ]
  },
  {
    "slug": "9188",
    "name": "9188 | Jacquard Elastic",
    "category": "activewear",
    "categoryLabel": "Activewear Elastics",
    "status": "published",
    "sortOrder": 130,
    "image": "assets/images/products/catalog-2026/9188/01.jpg",
    "gallery": [
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/9188/01.jpg",
        "label": "Main View",
        "alt": "9188 | Jacquard Elastic product view 1",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/9188/02.jpg",
        "label": "Product View 2",
        "alt": "9188 | Jacquard Elastic product view 2",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/9188/03.jpg",
        "label": "Product View 3",
        "alt": "9188 | Jacquard Elastic product view 3",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/9188/04.jpg",
        "label": "Product View 4",
        "alt": "9188 | Jacquard Elastic product view 4",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/9188/05.jpg",
        "label": "Product View 5",
        "alt": "9188 | Jacquard Elastic product view 5",
        "rotate": false
      }
    ],
    "tags": [
      "activewear",
      "jacquard",
      "waistband"
    ],
    "specs": [
      {
        "label": "Item No.",
        "value": "9188"
      },
      {
        "label": "Width",
        "value": "100 mm"
      },
      {
        "label": "Material",
        "value": "Nylon & Spandex"
      },
      {
        "label": "Application",
        "value": "Sportswear waistbands"
      }
    ],
    "intro": "Jacquard Elastic for sportswear waistbands, available for buyer-specific color, width, stretch, logo, and packing development.",
    "applications": [
      "Sportswear waistbands"
    ],
    "customOptions": [
      "Color matching",
      "Width and stretch",
      "Logo or pattern",
      "Roll and carton packing"
    ]
  },
  {
    "slug": "50084",
    "name": "50084 | Picot Elastic",
    "category": "activewear",
    "categoryLabel": "Activewear Elastics",
    "status": "published",
    "sortOrder": 150,
    "image": "assets/images/products/catalog-2026/50084/01.jpg",
    "gallery": [
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/50084/01.jpg",
        "label": "Main View",
        "alt": "50084 | Picot Elastic product view 1",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/50084/02.jpg",
        "label": "Product View 2",
        "alt": "50084 | Picot Elastic product view 2",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/50084/03.jpg",
        "label": "Product View 3",
        "alt": "50084 | Picot Elastic product view 3",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/50084/04.jpg",
        "label": "Product View 4",
        "alt": "50084 | Picot Elastic product view 4",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/50084/05.jpg",
        "label": "Product View 5",
        "alt": "50084 | Picot Elastic product view 5",
        "rotate": false
      }
    ],
    "tags": [
      "activewear",
      "picot"
    ],
    "specs": [
      {
        "label": "Item No.",
        "value": "50084"
      },
      {
        "label": "Width",
        "value": "13/16 mm"
      },
      {
        "label": "Material",
        "value": "Nylon & Spandex"
      },
      {
        "label": "Application",
        "value": "Mesh elastic trims"
      }
    ],
    "intro": "Picot Elastic for mesh elastic trims, available for buyer-specific color, width, stretch, logo, and packing development.",
    "applications": [
      "Mesh elastic trims"
    ],
    "customOptions": [
      "Color matching",
      "Width and stretch",
      "Logo or pattern",
      "Roll and carton packing"
    ]
  },
  {
    "slug": "50216",
    "name": "50216 | Elastic Webbing",
    "category": "activewear",
    "categoryLabel": "Activewear Elastics",
    "status": "published",
    "sortOrder": 190,
    "image": "assets/images/products/catalog-2026/50216/01.jpg",
    "gallery": [
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/50216/01.jpg",
        "label": "Main View",
        "alt": "50216 | Elastic Webbing product view 1",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/50216/02.jpg",
        "label": "Product View 2",
        "alt": "50216 | Elastic Webbing product view 2",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/50216/03.jpg",
        "label": "Product View 3",
        "alt": "50216 | Elastic Webbing product view 3",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/50216/04.jpg",
        "label": "Product View 4",
        "alt": "50216 | Elastic Webbing product view 4",
        "rotate": false
      }
    ],
    "tags": [
      "activewear",
      "waistband"
    ],
    "specs": [
      {
        "label": "Item No.",
        "value": "50216"
      },
      {
        "label": "Width",
        "value": "31 mm"
      },
      {
        "label": "Material",
        "value": "Nylon & Spandex"
      },
      {
        "label": "Application",
        "value": "Women's underwear waistbands"
      }
    ],
    "intro": "Elastic Webbing for women's underwear waistbands, available for buyer-specific color, width, stretch, logo, and packing development.",
    "applications": [
      "Women's underwear waistbands"
    ],
    "customOptions": [
      "Color matching",
      "Width and stretch",
      "Logo or pattern",
      "Roll and carton packing"
    ]
  },
  {
    "slug": "50282",
    "name": "50282 | Elastic Webbing",
    "category": "activewear",
    "categoryLabel": "Activewear Elastics",
    "status": "published",
    "sortOrder": 210,
    "image": "assets/images/products/catalog-2026/50282/01.jpg",
    "gallery": [
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/50282/01.jpg",
        "label": "Main View",
        "alt": "50282 | Elastic Webbing product view 1",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/50282/02.jpg",
        "label": "Product View 2",
        "alt": "50282 | Elastic Webbing product view 2",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/50282/03.jpg",
        "label": "Product View 3",
        "alt": "50282 | Elastic Webbing product view 3",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/50282/04.jpg",
        "label": "Product View 4",
        "alt": "50282 | Elastic Webbing product view 4",
        "rotate": false
      }
    ],
    "tags": [
      "activewear",
      "waistband"
    ],
    "specs": [
      {
        "label": "Item No.",
        "value": "50282"
      },
      {
        "label": "Width",
        "value": "26 mm"
      },
      {
        "label": "Material",
        "value": "Nylon & Spandex"
      },
      {
        "label": "Application",
        "value": "Women's underwear waistbands"
      }
    ],
    "intro": "Elastic Webbing for women's underwear waistbands, available for buyer-specific color, width, stretch, logo, and packing development.",
    "applications": [
      "Women's underwear waistbands"
    ],
    "customOptions": [
      "Color matching",
      "Width and stretch",
      "Logo or pattern",
      "Roll and carton packing"
    ]
  },
  {
    "slug": "50292",
    "name": "50292 | Elastic Webbing",
    "category": "activewear",
    "categoryLabel": "Activewear Elastics",
    "status": "published",
    "sortOrder": 220,
    "image": "assets/images/products/catalog-2026/50292/01.jpg",
    "gallery": [
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/50292/01.jpg",
        "label": "Main View",
        "alt": "50292 | Elastic Webbing product view 1",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/50292/02.jpg",
        "label": "Product View 2",
        "alt": "50292 | Elastic Webbing product view 2",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/50292/03.jpg",
        "label": "Product View 3",
        "alt": "50292 | Elastic Webbing product view 3",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/50292/04.jpg",
        "label": "Product View 4",
        "alt": "50292 | Elastic Webbing product view 4",
        "rotate": false
      }
    ],
    "tags": [
      "activewear",
      "waistband"
    ],
    "specs": [
      {
        "label": "Item No.",
        "value": "50292"
      },
      {
        "label": "Width",
        "value": "43 mm"
      },
      {
        "label": "Material",
        "value": "Nylon & Spandex"
      },
      {
        "label": "Application",
        "value": "Women's underwear waistbands"
      }
    ],
    "intro": "Elastic Webbing for women's underwear waistbands, available for buyer-specific color, width, stretch, logo, and packing development.",
    "applications": [
      "Women's underwear waistbands"
    ],
    "customOptions": [
      "Color matching",
      "Width and stretch",
      "Logo or pattern",
      "Roll and carton packing"
    ]
  },
  {
    "slug": "50298",
    "name": "50298 | Elastic Webbing",
    "category": "activewear",
    "categoryLabel": "Activewear Elastics",
    "status": "published",
    "sortOrder": 230,
    "image": "assets/images/products/catalog-2026/50298/01.jpg",
    "gallery": [
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/50298/01.jpg",
        "label": "Main View",
        "alt": "50298 | Elastic Webbing product view 1",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/50298/02.jpg",
        "label": "Product View 2",
        "alt": "50298 | Elastic Webbing product view 2",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/50298/03.jpg",
        "label": "Product View 3",
        "alt": "50298 | Elastic Webbing product view 3",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/50298/04.jpg",
        "label": "Product View 4",
        "alt": "50298 | Elastic Webbing product view 4",
        "rotate": false
      }
    ],
    "tags": [
      "activewear",
      "waistband"
    ],
    "specs": [
      {
        "label": "Item No.",
        "value": "50298"
      },
      {
        "label": "Width",
        "value": "34 mm"
      },
      {
        "label": "Material",
        "value": "Nylon & Spandex"
      },
      {
        "label": "Application",
        "value": "Women's underwear waistbands"
      }
    ],
    "intro": "Elastic Webbing for women's underwear waistbands, available for buyer-specific color, width, stretch, logo, and packing development.",
    "applications": [
      "Women's underwear waistbands"
    ],
    "customOptions": [
      "Color matching",
      "Width and stretch",
      "Logo or pattern",
      "Roll and carton packing"
    ]
  },
  {
    "slug": "50314",
    "name": "50314 | Plain Elastic",
    "category": "activewear",
    "categoryLabel": "Activewear Elastics",
    "status": "published",
    "sortOrder": 240,
    "image": "assets/images/products/catalog-2026/50314/01.jpg",
    "gallery": [
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/50314/01.jpg",
        "label": "Main View",
        "alt": "50314 | Plain Elastic product view 1",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/50314/02.jpg",
        "label": "Product View 2",
        "alt": "50314 | Plain Elastic product view 2",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/50314/03.jpg",
        "label": "Product View 3",
        "alt": "50314 | Plain Elastic product view 3",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/50314/04.jpg",
        "label": "Product View 4",
        "alt": "50314 | Plain Elastic product view 4",
        "rotate": false
      }
    ],
    "tags": [
      "activewear",
      "plain",
      "waistband"
    ],
    "specs": [
      {
        "label": "Item No.",
        "value": "50314"
      },
      {
        "label": "Width",
        "value": "31 mm"
      },
      {
        "label": "Material",
        "value": "Nylon & Spandex"
      },
      {
        "label": "Application",
        "value": "Women's underwear waistbands"
      }
    ],
    "intro": "Plain Elastic for women's underwear waistbands, available for buyer-specific color, width, stretch, logo, and packing development.",
    "applications": [
      "Women's underwear waistbands"
    ],
    "customOptions": [
      "Color matching",
      "Width and stretch",
      "Logo or pattern",
      "Roll and carton packing"
    ]
  },
  {
    "slug": "50326",
    "name": "50326 | Picot Elastic",
    "category": "womens",
    "categoryLabel": "Women's Underwear Elastics",
    "status": "published",
    "sortOrder": 250,
    "image": "assets/images/products/catalog-2026/50326/01.jpg",
    "gallery": [
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/50326/01.jpg",
        "label": "Main View",
        "alt": "50326 | Picot Elastic product view 1",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/50326/02.jpg",
        "label": "Product View 2",
        "alt": "50326 | Picot Elastic product view 2",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/50326/03.jpg",
        "label": "Product View 3",
        "alt": "50326 | Picot Elastic product view 3",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/50326/04.jpg",
        "label": "Product View 4",
        "alt": "50326 | Picot Elastic product view 4",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/50326/05.jpg",
        "label": "Product View 5",
        "alt": "50326 | Picot Elastic product view 5",
        "rotate": false
      }
    ],
    "tags": [
      "picot",
      "waistband"
    ],
    "specs": [
      {
        "label": "Item No.",
        "value": "50326"
      },
      {
        "label": "Width",
        "value": "9 mm"
      },
      {
        "label": "Material",
        "value": "Nylon & Spandex"
      },
      {
        "label": "Application",
        "value": "Women's underwear waist and leg openings"
      }
    ],
    "intro": "Picot Elastic for women's underwear waist and leg openings, available for buyer-specific color, width, stretch, logo, and packing development.",
    "applications": [
      "Women's underwear waist and leg openings"
    ],
    "customOptions": [
      "Color matching",
      "Width and stretch",
      "Logo or pattern",
      "Roll and carton packing"
    ]
  },
  {
    "slug": "reflective-binding",
    "name": "Reflective Binding Elastic",
    "category": "activewear",
    "categoryLabel": "Activewear Elastics",
    "status": "published",
    "sortOrder": 270,
    "image": "assets/images/products/catalog-2026/reflective-binding/01.jpg",
    "gallery": [
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/reflective-binding/01.jpg",
        "label": "Main View",
        "alt": "Reflective Binding Elastic product view 1",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/reflective-binding/02.jpg",
        "label": "Product View 2",
        "alt": "Reflective Binding Elastic product view 2",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/reflective-binding/03.jpg",
        "label": "Product View 3",
        "alt": "Reflective Binding Elastic product view 3",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/reflective-binding/04.jpg",
        "label": "Product View 4",
        "alt": "Reflective Binding Elastic product view 4",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/reflective-binding/05.jpg",
        "label": "Product View 5",
        "alt": "Reflective Binding Elastic product view 5",
        "rotate": false
      }
    ],
    "tags": [
      "activewear",
      "binding",
      "reflective"
    ],
    "specs": [
      {
        "label": "Item No.",
        "value": "反光包边"
      },
      {
        "label": "Width",
        "value": "20 mm"
      },
      {
        "label": "Material",
        "value": "Nylon & Spandex"
      },
      {
        "label": "Application",
        "value": "Outdoor and activewear binding"
      }
    ],
    "intro": "Reflective Binding Elastic for outdoor and activewear binding, available for buyer-specific color, width, stretch, logo, and packing development.",
    "applications": [
      "Outdoor and activewear binding"
    ],
    "customOptions": [
      "Color matching",
      "Width and stretch",
      "Logo or pattern",
      "Roll and carton packing"
    ]
  },
  {
    "slug": "lurex-star-flag",
    "name": "Metallic Star-and-Stripe Jacquard Elastic",
    "category": "activewear",
    "categoryLabel": "Activewear Elastics",
    "status": "published",
    "sortOrder": 280,
    "image": "assets/images/products/catalog-2026/lurex-star-flag/01.jpg",
    "gallery": [
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/lurex-star-flag/01.jpg",
        "label": "Main View",
        "alt": "Metallic Star-and-Stripe Jacquard Elastic product view 1",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/lurex-star-flag/02.jpg",
        "label": "Product View 2",
        "alt": "Metallic Star-and-Stripe Jacquard Elastic product view 2",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/lurex-star-flag/03.jpg",
        "label": "Product View 3",
        "alt": "Metallic Star-and-Stripe Jacquard Elastic product view 3",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/lurex-star-flag/04.jpg",
        "label": "Product View 4",
        "alt": "Metallic Star-and-Stripe Jacquard Elastic product view 4",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/lurex-star-flag/05.jpg",
        "label": "Product View 5",
        "alt": "Metallic Star-and-Stripe Jacquard Elastic product view 5",
        "rotate": false
      }
    ],
    "tags": [
      "activewear",
      "lurex",
      "jacquard",
      "waistband"
    ],
    "specs": [
      {
        "label": "Item No.",
        "value": "金银丝星条旗"
      },
      {
        "label": "Width",
        "value": "50 mm"
      },
      {
        "label": "Material",
        "value": "Polyester & Spandex"
      },
      {
        "label": "Application",
        "value": "Elastic waistbands"
      }
    ],
    "intro": "Jacquard Elastic for elastic waistbands, available for buyer-specific color, width, stretch, logo, and packing development.",
    "applications": [
      "Elastic waistbands"
    ],
    "customOptions": [
      "Color matching",
      "Width and stretch",
      "Logo or pattern",
      "Roll and carton packing"
    ]
  },
  {
    "slug": "happy-jacquard",
    "name": "HAPPY Jacquard Elastic",
    "category": "activewear",
    "categoryLabel": "Activewear Elastics",
    "status": "published",
    "sortOrder": 290,
    "image": "assets/images/products/catalog-2026/happy-jacquard/01.jpg",
    "gallery": [
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/happy-jacquard/01.jpg",
        "label": "Main View",
        "alt": "HAPPY Jacquard Elastic product view 1",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/happy-jacquard/02.jpg",
        "label": "Product View 2",
        "alt": "HAPPY Jacquard Elastic product view 2",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/happy-jacquard/03.jpg",
        "label": "Product View 3",
        "alt": "HAPPY Jacquard Elastic product view 3",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/happy-jacquard/04.jpg",
        "label": "Product View 4",
        "alt": "HAPPY Jacquard Elastic product view 4",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/happy-jacquard/05.jpg",
        "label": "Product View 5",
        "alt": "HAPPY Jacquard Elastic product view 5",
        "rotate": false
      }
    ],
    "tags": [
      "activewear",
      "jacquard",
      "waistband"
    ],
    "specs": [
      {
        "label": "Item No.",
        "value": "提花带HAPPY"
      },
      {
        "label": "Width",
        "value": "20 mm"
      },
      {
        "label": "Material",
        "value": "Polyester & Spandex"
      },
      {
        "label": "Application",
        "value": "Elastic waistbands"
      }
    ],
    "intro": "Jacquard Elastic for elastic waistbands, available for buyer-specific color, width, stretch, logo, and packing development.",
    "applications": [
      "Elastic waistbands"
    ],
    "customOptions": [
      "Color matching",
      "Width and stretch",
      "Logo or pattern",
      "Roll and carton packing"
    ]
  },
  {
    "slug": "be-patient-printing",
    "name": "BE PATIENT Printed Elastic",
    "category": "activewear",
    "categoryLabel": "Activewear Elastics",
    "status": "published",
    "sortOrder": 300,
    "image": "assets/images/products/catalog-2026/be-patient-printing/01.jpg",
    "gallery": [
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/be-patient-printing/01.jpg",
        "label": "Main View",
        "alt": "BE PATIENT Printed Elastic product view 1",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/be-patient-printing/02.jpg",
        "label": "Product View 2",
        "alt": "BE PATIENT Printed Elastic product view 2",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/be-patient-printing/03.jpg",
        "label": "Product View 3",
        "alt": "BE PATIENT Printed Elastic product view 3",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/be-patient-printing/04.jpg",
        "label": "Product View 4",
        "alt": "BE PATIENT Printed Elastic product view 4",
        "rotate": false
      }
    ],
    "tags": [
      "activewear",
      "printed",
      "waistband"
    ],
    "specs": [
      {
        "label": "Item No.",
        "value": "BE Patient:printing"
      },
      {
        "label": "Width",
        "value": "35 mm"
      },
      {
        "label": "Material",
        "value": "Nylon & Spandex / Polyester & Spandex"
      },
      {
        "label": "Application",
        "value": "Elastic waistbands"
      }
    ],
    "intro": "Printed Elastic for elastic waistbands, available for buyer-specific color, width, stretch, logo, and packing development.",
    "applications": [
      "Elastic waistbands"
    ],
    "customOptions": [
      "Color matching",
      "Width and stretch",
      "Logo or pattern",
      "Roll and carton packing"
    ]
  },
  {
    "slug": "g7236",
    "name": "G7236 | Embossed Elastic",
    "category": "lingerie",
    "categoryLabel": "Bra & Lingerie Elastics",
    "status": "published",
    "sortOrder": 320,
    "image": "assets/images/products/catalog-2026/g7236/01.jpg",
    "gallery": [
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/g7236/01.jpg",
        "label": "Main View",
        "alt": "G7236 | Embossed Elastic product view 1",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/g7236/02.jpg",
        "label": "Product View 2",
        "alt": "G7236 | Embossed Elastic product view 2",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/g7236/03.jpg",
        "label": "Product View 3",
        "alt": "G7236 | Embossed Elastic product view 3",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/g7236/04.jpg",
        "label": "Product View 4",
        "alt": "G7236 | Embossed Elastic product view 4",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/g7236/05.jpg",
        "label": "Product View 5",
        "alt": "G7236 | Embossed Elastic product view 5",
        "rotate": false
      }
    ],
    "tags": [
      "embossed",
      "bra-strap"
    ],
    "specs": [
      {
        "label": "Item No.",
        "value": "G7236"
      },
      {
        "label": "Width",
        "value": "10 mm"
      },
      {
        "label": "Material",
        "value": "Polyester"
      },
      {
        "label": "Application",
        "value": "Lingerie & Intimate Apparel"
      }
    ],
    "intro": "Embossed Elastic for lingerie & intimate apparel, available for buyer-specific color, width, stretch, logo, and packing development.",
    "applications": [
      "Lingerie & Intimate Apparel"
    ],
    "customOptions": [
      "Color matching",
      "Width and stretch",
      "Logo or pattern",
      "Roll and carton packing"
    ]
  },
  {
    "slug": "h6352",
    "name": "H6352 | Picot Elastic",
    "category": "lingerie",
    "categoryLabel": "Bra & Lingerie Elastics",
    "status": "published",
    "sortOrder": 330,
    "image": "assets/images/products/catalog-2026/h6352/01.jpg",
    "gallery": [
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h6352/01.jpg",
        "label": "Main View",
        "alt": "H6352 | Picot Elastic product view 1",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h6352/02.jpg",
        "label": "Product View 2",
        "alt": "H6352 | Picot Elastic product view 2",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h6352/03.jpg",
        "label": "Product View 3",
        "alt": "H6352 | Picot Elastic product view 3",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h6352/04.jpg",
        "label": "Product View 4",
        "alt": "H6352 | Picot Elastic product view 4",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h6352/05.jpg",
        "label": "Product View 5",
        "alt": "H6352 | Picot Elastic product view 5",
        "rotate": false
      }
    ],
    "tags": [
      "picot"
    ],
    "specs": [
      {
        "label": "Item No.",
        "value": "H6352"
      },
      {
        "label": "Width",
        "value": "8 / 10 / 12 / 13 / 15 / 21 / 25 / 30 mm"
      },
      {
        "label": "Material",
        "value": "Nylon & Spandex"
      },
      {
        "label": "Application",
        "value": "Bra bands and picot edging"
      }
    ],
    "intro": "Picot Elastic for bra bands and picot edging, available for buyer-specific color, width, stretch, logo, and packing development.",
    "applications": [
      "Bra bands and picot edging"
    ],
    "customOptions": [
      "Color matching",
      "Width and stretch",
      "Logo or pattern",
      "Roll and carton packing"
    ]
  },
  {
    "slug": "h6377",
    "name": "H6377 | Picot Elastic",
    "category": "lingerie",
    "categoryLabel": "Bra & Lingerie Elastics",
    "status": "published",
    "sortOrder": 340,
    "image": "assets/images/products/catalog-2026/h6377/01.jpg",
    "gallery": [
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h6377/01.jpg",
        "label": "Main View",
        "alt": "H6377 | Picot Elastic product view 1",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h6377/02.jpg",
        "label": "Product View 2",
        "alt": "H6377 | Picot Elastic product view 2",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h6377/03.jpg",
        "label": "Product View 3",
        "alt": "H6377 | Picot Elastic product view 3",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h6377/04.jpg",
        "label": "Product View 4",
        "alt": "H6377 | Picot Elastic product view 4",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h6377/05.jpg",
        "label": "Product View 5",
        "alt": "H6377 | Picot Elastic product view 5",
        "rotate": false
      }
    ],
    "tags": [
      "picot"
    ],
    "specs": [
      {
        "label": "Item No.",
        "value": "H6377"
      },
      {
        "label": "Width",
        "value": "09/11/12/15 mm"
      },
      {
        "label": "Material",
        "value": "Nylon & Spandex"
      },
      {
        "label": "Application",
        "value": "Bra bands and picot edging"
      }
    ],
    "intro": "Picot Elastic for bra bands and picot edging, available for buyer-specific color, width, stretch, logo, and packing development.",
    "applications": [
      "Bra bands and picot edging"
    ],
    "customOptions": [
      "Color matching",
      "Width and stretch",
      "Logo or pattern",
      "Roll and carton packing"
    ]
  },
  {
    "slug": "h6529",
    "name": "H6529 | Picot Elastic",
    "category": "lingerie",
    "categoryLabel": "Bra & Lingerie Elastics",
    "status": "published",
    "sortOrder": 350,
    "image": "assets/images/products/catalog-2026/h6529/01.jpg",
    "gallery": [
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h6529/01.jpg",
        "label": "Main View",
        "alt": "H6529 | Picot Elastic product view 1",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h6529/02.jpg",
        "label": "Product View 2",
        "alt": "H6529 | Picot Elastic product view 2",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h6529/03.jpg",
        "label": "Product View 3",
        "alt": "H6529 | Picot Elastic product view 3",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h6529/04.jpg",
        "label": "Product View 4",
        "alt": "H6529 | Picot Elastic product view 4",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h6529/05.jpg",
        "label": "Product View 5",
        "alt": "H6529 | Picot Elastic product view 5",
        "rotate": false
      }
    ],
    "tags": [
      "picot"
    ],
    "specs": [
      {
        "label": "Item No.",
        "value": "H6529"
      },
      {
        "label": "Width",
        "value": "9 / 11 / 12 mm"
      },
      {
        "label": "Material",
        "value": "Nylon & Spandex"
      },
      {
        "label": "Application",
        "value": "Bra bands and picot edging"
      }
    ],
    "intro": "Picot Elastic for bra bands and picot edging, available for buyer-specific color, width, stretch, logo, and packing development.",
    "applications": [
      "Bra bands and picot edging"
    ],
    "customOptions": [
      "Color matching",
      "Width and stretch",
      "Logo or pattern",
      "Roll and carton packing"
    ]
  },
  {
    "slug": "h6693",
    "name": "H6693 | Picot Elastic",
    "category": "lingerie",
    "categoryLabel": "Bra & Lingerie Elastics",
    "status": "published",
    "sortOrder": 370,
    "image": "assets/images/products/catalog-2026/h6693/01.jpg",
    "gallery": [
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h6693/01.jpg",
        "label": "Main View",
        "alt": "H6693 | Picot Elastic product view 1",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h6693/02.jpg",
        "label": "Product View 2",
        "alt": "H6693 | Picot Elastic product view 2",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h6693/03.jpg",
        "label": "Product View 3",
        "alt": "H6693 | Picot Elastic product view 3",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h6693/04.jpg",
        "label": "Product View 4",
        "alt": "H6693 | Picot Elastic product view 4",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h6693/05.jpg",
        "label": "Product View 5",
        "alt": "H6693 | Picot Elastic product view 5",
        "rotate": false
      }
    ],
    "tags": [
      "picot"
    ],
    "specs": [
      {
        "label": "Item No.",
        "value": "H6693"
      },
      {
        "label": "Width",
        "value": "10 mm"
      },
      {
        "label": "Material",
        "value": "Nylon & Spandex"
      },
      {
        "label": "Application",
        "value": "Bras and underwear"
      }
    ],
    "intro": "Picot Elastic for bras and underwear, available for buyer-specific color, width, stretch, logo, and packing development.",
    "applications": [
      "Bras and underwear"
    ],
    "customOptions": [
      "Color matching",
      "Width and stretch",
      "Logo or pattern",
      "Roll and carton packing"
    ]
  },
  {
    "slug": "h6726",
    "name": "H6726 | Picot Elastic",
    "category": "lingerie",
    "categoryLabel": "Bra & Lingerie Elastics",
    "status": "published",
    "sortOrder": 380,
    "image": "assets/images/products/catalog-2026/h6726/01.jpg",
    "gallery": [
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h6726/01.jpg",
        "label": "Main View",
        "alt": "H6726 | Picot Elastic product view 1",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h6726/02.jpg",
        "label": "Product View 2",
        "alt": "H6726 | Picot Elastic product view 2",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h6726/03.jpg",
        "label": "Product View 3",
        "alt": "H6726 | Picot Elastic product view 3",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h6726/04.jpg",
        "label": "Product View 4",
        "alt": "H6726 | Picot Elastic product view 4",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h6726/05.jpg",
        "label": "Product View 5",
        "alt": "H6726 | Picot Elastic product view 5",
        "rotate": false
      }
    ],
    "tags": [
      "picot",
      "decorative-edge"
    ],
    "specs": [
      {
        "label": "Item No.",
        "value": "H6726"
      },
      {
        "label": "Width",
        "value": "12/15 mm"
      },
      {
        "label": "Material",
        "value": "Nylon & Spandex"
      },
      {
        "label": "Application",
        "value": "Bra bands and picot edging"
      }
    ],
    "intro": "Picot Elastic for bra bands and picot edging, available for buyer-specific color, width, stretch, logo, and packing development.",
    "applications": [
      "Bra bands and picot edging"
    ],
    "customOptions": [
      "Color matching",
      "Width and stretch",
      "Logo or pattern",
      "Roll and carton packing"
    ]
  },
  {
    "slug": "h6807",
    "name": "H6807 | Bra Strap Elastic",
    "category": "lingerie",
    "categoryLabel": "Bra & Lingerie Elastics",
    "status": "published",
    "sortOrder": 390,
    "image": "assets/images/products/catalog-2026/h6807/01.jpg",
    "gallery": [
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h6807/01.jpg",
        "label": "Main View",
        "alt": "H6807 | Bra Strap Elastic product view 1",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h6807/02.jpg",
        "label": "Product View 2",
        "alt": "H6807 | Bra Strap Elastic product view 2",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h6807/03.jpg",
        "label": "Product View 3",
        "alt": "H6807 | Bra Strap Elastic product view 3",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h6807/04.jpg",
        "label": "Product View 4",
        "alt": "H6807 | Bra Strap Elastic product view 4",
        "rotate": false
      }
    ],
    "tags": [
      "bra-strap"
    ],
    "specs": [
      {
        "label": "Item No.",
        "value": "H6807"
      },
      {
        "label": "Width",
        "value": "07/8/10/12/15/20/25/30 mm"
      },
      {
        "label": "Material",
        "value": "Nylon & Spandex"
      },
      {
        "label": "Application",
        "value": "Bra and lingerie shoulder straps"
      }
    ],
    "intro": "Bra Strap Elastic for bra and lingerie shoulder straps, available for buyer-specific color, width, stretch, logo, and packing development.",
    "applications": [
      "Bra and lingerie shoulder straps"
    ],
    "customOptions": [
      "Color matching",
      "Width and stretch",
      "Logo or pattern",
      "Roll and carton packing"
    ]
  },
  {
    "slug": "h6896",
    "name": "H6896 | Bra Strap Elastic",
    "category": "lingerie",
    "categoryLabel": "Bra & Lingerie Elastics",
    "status": "published",
    "sortOrder": 400,
    "image": "assets/images/products/catalog-2026/h6896/01.jpg",
    "gallery": [
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h6896/01.jpg",
        "label": "Main View",
        "alt": "H6896 | Bra Strap Elastic product view 1",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h6896/02.jpg",
        "label": "Product View 2",
        "alt": "H6896 | Bra Strap Elastic product view 2",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h6896/03.jpg",
        "label": "Product View 3",
        "alt": "H6896 | Bra Strap Elastic product view 3",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h6896/04.jpg",
        "label": "Product View 4",
        "alt": "H6896 | Bra Strap Elastic product view 4",
        "rotate": false
      }
    ],
    "tags": [
      "bra-strap"
    ],
    "specs": [
      {
        "label": "Item No.",
        "value": "H6896"
      },
      {
        "label": "Width",
        "value": "07/8/10/12/15/20/25/30 mm"
      },
      {
        "label": "Material",
        "value": "Nylon & Spandex"
      },
      {
        "label": "Application",
        "value": "Bra and lingerie shoulder straps"
      }
    ],
    "intro": "Bra Strap Elastic for bra and lingerie shoulder straps, available for buyer-specific color, width, stretch, logo, and packing development.",
    "applications": [
      "Bra and lingerie shoulder straps"
    ],
    "customOptions": [
      "Color matching",
      "Width and stretch",
      "Logo or pattern",
      "Roll and carton packing"
    ]
  },
  {
    "slug": "h6904",
    "name": "H6904 | Bra Strap Elastic",
    "category": "lingerie",
    "categoryLabel": "Bra & Lingerie Elastics",
    "status": "published",
    "sortOrder": 410,
    "image": "assets/images/products/catalog-2026/h6904/01.jpg",
    "gallery": [
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h6904/01.jpg",
        "label": "Main View",
        "alt": "H6904 | Bra Strap Elastic product view 1",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h6904/02.jpg",
        "label": "Product View 2",
        "alt": "H6904 | Bra Strap Elastic product view 2",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h6904/03.jpg",
        "label": "Product View 3",
        "alt": "H6904 | Bra Strap Elastic product view 3",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h6904/04.jpg",
        "label": "Product View 4",
        "alt": "H6904 | Bra Strap Elastic product view 4",
        "rotate": false
      }
    ],
    "tags": [
      "bra-strap"
    ],
    "specs": [
      {
        "label": "Item No.",
        "value": "H6904"
      },
      {
        "label": "Width",
        "value": "07/8/10/12/15/20/25/30 mm"
      },
      {
        "label": "Material",
        "value": "Nylon & Spandex"
      },
      {
        "label": "Application",
        "value": "Bra and lingerie shoulder straps"
      }
    ],
    "intro": "Bra Strap Elastic for bra and lingerie shoulder straps, available for buyer-specific color, width, stretch, logo, and packing development.",
    "applications": [
      "Bra and lingerie shoulder straps"
    ],
    "customOptions": [
      "Color matching",
      "Width and stretch",
      "Logo or pattern",
      "Roll and carton packing"
    ]
  },
  {
    "slug": "h7000",
    "name": "H7000 | Bra Strap Elastic",
    "category": "lingerie",
    "categoryLabel": "Bra & Lingerie Elastics",
    "status": "published",
    "sortOrder": 420,
    "image": "assets/images/products/catalog-2026/h7000/01.jpg",
    "gallery": [
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h7000/01.jpg",
        "label": "Main View",
        "alt": "H7000 | Bra Strap Elastic product view 1",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h7000/02.jpg",
        "label": "Product View 2",
        "alt": "H7000 | Bra Strap Elastic product view 2",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h7000/03.jpg",
        "label": "Product View 3",
        "alt": "H7000 | Bra Strap Elastic product view 3",
        "rotate": false
      }
    ],
    "tags": [
      "bra-strap"
    ],
    "specs": [
      {
        "label": "Item No.",
        "value": "H7000"
      },
      {
        "label": "Width",
        "value": "12/14 mm"
      },
      {
        "label": "Material",
        "value": "Nylon & Spandex"
      },
      {
        "label": "Application",
        "value": "Bra and lingerie shoulder straps"
      }
    ],
    "intro": "Bra Strap Elastic for bra and lingerie shoulder straps, available for buyer-specific color, width, stretch, logo, and packing development.",
    "applications": [
      "Bra and lingerie shoulder straps"
    ],
    "customOptions": [
      "Color matching",
      "Width and stretch",
      "Logo or pattern",
      "Roll and carton packing"
    ]
  },
  {
    "slug": "h7039",
    "name": "H7039 | Bra Strap Elastic",
    "category": "lingerie",
    "categoryLabel": "Bra & Lingerie Elastics",
    "status": "published",
    "sortOrder": 430,
    "image": "assets/images/products/catalog-2026/h7039/01.jpg",
    "gallery": [
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h7039/01.jpg",
        "label": "Main View",
        "alt": "H7039 | Bra Strap Elastic product view 1",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h7039/02.jpg",
        "label": "Product View 2",
        "alt": "H7039 | Bra Strap Elastic product view 2",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h7039/03.jpg",
        "label": "Product View 3",
        "alt": "H7039 | Bra Strap Elastic product view 3",
        "rotate": false
      }
    ],
    "tags": [
      "bra-strap"
    ],
    "specs": [
      {
        "label": "Item No.",
        "value": "H7039"
      },
      {
        "label": "Width",
        "value": "07/8/10/12/15/20/25/30 mm"
      },
      {
        "label": "Material",
        "value": "Nylon & Spandex"
      },
      {
        "label": "Application",
        "value": "Bra and lingerie shoulder straps"
      }
    ],
    "intro": "Bra Strap Elastic for bra and lingerie shoulder straps, available for buyer-specific color, width, stretch, logo, and packing development.",
    "applications": [
      "Bra and lingerie shoulder straps"
    ],
    "customOptions": [
      "Color matching",
      "Width and stretch",
      "Logo or pattern",
      "Roll and carton packing"
    ]
  },
  {
    "slug": "h7042",
    "name": "H7042 | Bra Strap Elastic",
    "category": "lingerie",
    "categoryLabel": "Bra & Lingerie Elastics",
    "status": "published",
    "sortOrder": 440,
    "image": "assets/images/products/catalog-2026/h7042/01.jpg",
    "gallery": [
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h7042/01.jpg",
        "label": "Main View",
        "alt": "H7042 | Bra Strap Elastic product view 1",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h7042/02.jpg",
        "label": "Product View 2",
        "alt": "H7042 | Bra Strap Elastic product view 2",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h7042/03.jpg",
        "label": "Product View 3",
        "alt": "H7042 | Bra Strap Elastic product view 3",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h7042/04.jpg",
        "label": "Product View 4",
        "alt": "H7042 | Bra Strap Elastic product view 4",
        "rotate": false
      }
    ],
    "tags": [
      "bra-strap"
    ],
    "specs": [
      {
        "label": "Item No.",
        "value": "H7042"
      },
      {
        "label": "Width",
        "value": "21/23 mm"
      },
      {
        "label": "Material",
        "value": "Nylon & Spandex"
      },
      {
        "label": "Application",
        "value": "Bra and lingerie shoulder straps"
      }
    ],
    "intro": "Bra Strap Elastic for bra and lingerie shoulder straps, available for buyer-specific color, width, stretch, logo, and packing development.",
    "applications": [
      "Bra and lingerie shoulder straps"
    ],
    "customOptions": [
      "Color matching",
      "Width and stretch",
      "Logo or pattern",
      "Roll and carton packing"
    ]
  },
  {
    "slug": "h7138",
    "name": "H7138 | Bra Strap Elastic",
    "category": "lingerie",
    "categoryLabel": "Bra & Lingerie Elastics",
    "status": "published",
    "sortOrder": 450,
    "image": "assets/images/products/catalog-2026/h7138/01.jpg",
    "gallery": [
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h7138/01.jpg",
        "label": "Main View",
        "alt": "H7138 | Bra Strap Elastic product view 1",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h7138/02.jpg",
        "label": "Product View 2",
        "alt": "H7138 | Bra Strap Elastic product view 2",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h7138/03.jpg",
        "label": "Product View 3",
        "alt": "H7138 | Bra Strap Elastic product view 3",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h7138/04.jpg",
        "label": "Product View 4",
        "alt": "H7138 | Bra Strap Elastic product view 4",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h7138/05.jpg",
        "label": "Product View 5",
        "alt": "H7138 | Bra Strap Elastic product view 5",
        "rotate": false
      }
    ],
    "tags": [
      "bra-strap"
    ],
    "specs": [
      {
        "label": "Item No.",
        "value": "H7138"
      },
      {
        "label": "Width",
        "value": "7/10/13 mm"
      },
      {
        "label": "Material",
        "value": "Nylon & Spandex"
      },
      {
        "label": "Application",
        "value": "Bra and lingerie shoulder straps"
      }
    ],
    "intro": "Bra Strap Elastic for bra and lingerie shoulder straps, available for buyer-specific color, width, stretch, logo, and packing development.",
    "applications": [
      "Bra and lingerie shoulder straps"
    ],
    "customOptions": [
      "Color matching",
      "Width and stretch",
      "Logo or pattern",
      "Roll and carton packing"
    ]
  },
  {
    "slug": "h7162",
    "name": "H7162 | Bra Strap Elastic",
    "category": "lingerie",
    "categoryLabel": "Bra & Lingerie Elastics",
    "status": "published",
    "sortOrder": 460,
    "image": "assets/images/products/catalog-2026/h7162/01.jpg",
    "gallery": [
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h7162/01.jpg",
        "label": "Main View",
        "alt": "H7162 | Bra Strap Elastic product view 1",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h7162/02.jpg",
        "label": "Product View 2",
        "alt": "H7162 | Bra Strap Elastic product view 2",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h7162/03.jpg",
        "label": "Product View 3",
        "alt": "H7162 | Bra Strap Elastic product view 3",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h7162/04.jpg",
        "label": "Product View 4",
        "alt": "H7162 | Bra Strap Elastic product view 4",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h7162/05.jpg",
        "label": "Product View 5",
        "alt": "H7162 | Bra Strap Elastic product view 5",
        "rotate": false
      }
    ],
    "tags": [
      "bra-strap"
    ],
    "specs": [
      {
        "label": "Item No.",
        "value": "H7162"
      },
      {
        "label": "Width",
        "value": "10 / 11 / 15 mm"
      },
      {
        "label": "Material",
        "value": "Nylon & Spandex"
      },
      {
        "label": "Application",
        "value": "Bra and lingerie shoulder straps"
      }
    ],
    "intro": "Bra Strap Elastic for bra and lingerie shoulder straps, available for buyer-specific color, width, stretch, logo, and packing development.",
    "applications": [
      "Bra and lingerie shoulder straps"
    ],
    "customOptions": [
      "Color matching",
      "Width and stretch",
      "Logo or pattern",
      "Roll and carton packing"
    ]
  },
  {
    "slug": "h7181",
    "name": "H7181 | Bra Strap Elastic",
    "category": "lingerie",
    "categoryLabel": "Bra & Lingerie Elastics",
    "status": "published",
    "sortOrder": 470,
    "image": "assets/images/products/catalog-2026/h7181/01.jpg",
    "gallery": [
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h7181/01.jpg",
        "label": "Main View",
        "alt": "H7181 | Bra Strap Elastic product view 1",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h7181/02.jpg",
        "label": "Product View 2",
        "alt": "H7181 | Bra Strap Elastic product view 2",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h7181/03.jpg",
        "label": "Product View 3",
        "alt": "H7181 | Bra Strap Elastic product view 3",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h7181/04.jpg",
        "label": "Product View 4",
        "alt": "H7181 | Bra Strap Elastic product view 4",
        "rotate": false
      }
    ],
    "tags": [
      "bra-strap"
    ],
    "specs": [
      {
        "label": "Item No.",
        "value": "H7181"
      },
      {
        "label": "Width",
        "value": "15/17/20/25 mm"
      },
      {
        "label": "Material",
        "value": "Nylon & Spandex"
      },
      {
        "label": "Application",
        "value": "Bra and lingerie shoulder straps"
      }
    ],
    "intro": "Bra Strap Elastic for bra and lingerie shoulder straps, available for buyer-specific color, width, stretch, logo, and packing development.",
    "applications": [
      "Bra and lingerie shoulder straps"
    ],
    "customOptions": [
      "Color matching",
      "Width and stretch",
      "Logo or pattern",
      "Roll and carton packing"
    ]
  },
  {
    "slug": "h7189",
    "name": "H7189 | Bra Strap Elastic",
    "category": "lingerie",
    "categoryLabel": "Bra & Lingerie Elastics",
    "status": "published",
    "sortOrder": 480,
    "image": "assets/images/products/catalog-2026/h7189/01.jpg",
    "gallery": [
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h7189/01.jpg",
        "label": "Main View",
        "alt": "H7189 | Bra Strap Elastic product view 1",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h7189/02.jpg",
        "label": "Product View 2",
        "alt": "H7189 | Bra Strap Elastic product view 2",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h7189/03.jpg",
        "label": "Product View 3",
        "alt": "H7189 | Bra Strap Elastic product view 3",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h7189/04.jpg",
        "label": "Product View 4",
        "alt": "H7189 | Bra Strap Elastic product view 4",
        "rotate": false
      }
    ],
    "tags": [
      "bra-strap"
    ],
    "specs": [
      {
        "label": "Item No.",
        "value": "H7189"
      },
      {
        "label": "Width",
        "value": "13/17 mm"
      },
      {
        "label": "Material",
        "value": "Nylon & Spandex"
      },
      {
        "label": "Application",
        "value": "Bra and lingerie shoulder straps"
      }
    ],
    "intro": "Bra Strap Elastic for bra and lingerie shoulder straps, available for buyer-specific color, width, stretch, logo, and packing development.",
    "applications": [
      "Bra and lingerie shoulder straps"
    ],
    "customOptions": [
      "Color matching",
      "Width and stretch",
      "Logo or pattern",
      "Roll and carton packing"
    ]
  },
  {
    "slug": "h7203",
    "name": "H7203 | Bra Strap Elastic",
    "category": "lingerie",
    "categoryLabel": "Bra & Lingerie Elastics",
    "status": "published",
    "sortOrder": 490,
    "image": "assets/images/products/catalog-2026/h7203/01.jpg",
    "gallery": [
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h7203/01.jpg",
        "label": "Main View",
        "alt": "H7203 | Bra Strap Elastic product view 1",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h7203/02.jpg",
        "label": "Product View 2",
        "alt": "H7203 | Bra Strap Elastic product view 2",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h7203/03.jpg",
        "label": "Product View 3",
        "alt": "H7203 | Bra Strap Elastic product view 3",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h7203/04.jpg",
        "label": "Product View 4",
        "alt": "H7203 | Bra Strap Elastic product view 4",
        "rotate": false
      }
    ],
    "tags": [
      "bra-strap"
    ],
    "specs": [
      {
        "label": "Item No.",
        "value": "H7203"
      },
      {
        "label": "Width",
        "value": "15/20 mm"
      },
      {
        "label": "Material",
        "value": "Nylon & Spandex"
      },
      {
        "label": "Application",
        "value": "Bra and lingerie shoulder straps"
      }
    ],
    "intro": "Bra Strap Elastic for bra and lingerie shoulder straps, available for buyer-specific color, width, stretch, logo, and packing development.",
    "applications": [
      "Bra and lingerie shoulder straps"
    ],
    "customOptions": [
      "Color matching",
      "Width and stretch",
      "Logo or pattern",
      "Roll and carton packing"
    ]
  },
  {
    "slug": "h7214",
    "name": "H7214 | Bra Strap Elastic",
    "category": "lingerie",
    "categoryLabel": "Bra & Lingerie Elastics",
    "status": "published",
    "sortOrder": 500,
    "image": "assets/images/products/catalog-2026/h7214/01.jpg",
    "gallery": [
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h7214/01.jpg",
        "label": "Main View",
        "alt": "H7214 | Bra Strap Elastic product view 1",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h7214/02.jpg",
        "label": "Product View 2",
        "alt": "H7214 | Bra Strap Elastic product view 2",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h7214/03.jpg",
        "label": "Product View 3",
        "alt": "H7214 | Bra Strap Elastic product view 3",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h7214/04.jpg",
        "label": "Product View 4",
        "alt": "H7214 | Bra Strap Elastic product view 4",
        "rotate": false
      }
    ],
    "tags": [
      "bra-strap"
    ],
    "specs": [
      {
        "label": "Item No.",
        "value": "H7214"
      },
      {
        "label": "Width",
        "value": "21 mm"
      },
      {
        "label": "Material",
        "value": "Nylon & Spandex"
      },
      {
        "label": "Application",
        "value": "Bra and lingerie shoulder straps"
      }
    ],
    "intro": "Bra Strap Elastic for bra and lingerie shoulder straps, available for buyer-specific color, width, stretch, logo, and packing development.",
    "applications": [
      "Bra and lingerie shoulder straps"
    ],
    "customOptions": [
      "Color matching",
      "Width and stretch",
      "Logo or pattern",
      "Roll and carton packing"
    ]
  },
  {
    "slug": "h7231",
    "name": "H7231 | Bra Strap Elastic",
    "category": "lingerie",
    "categoryLabel": "Bra & Lingerie Elastics",
    "status": "published",
    "sortOrder": 510,
    "image": "assets/images/products/catalog-2026/h7231/01.jpg",
    "gallery": [
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h7231/01.jpg",
        "label": "Main View",
        "alt": "H7231 | Bra Strap Elastic product view 1",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h7231/02.jpg",
        "label": "Product View 2",
        "alt": "H7231 | Bra Strap Elastic product view 2",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h7231/03.jpg",
        "label": "Product View 3",
        "alt": "H7231 | Bra Strap Elastic product view 3",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h7231/04.jpg",
        "label": "Product View 4",
        "alt": "H7231 | Bra Strap Elastic product view 4",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h7231/05.jpg",
        "label": "Product View 5",
        "alt": "H7231 | Bra Strap Elastic product view 5",
        "rotate": false
      }
    ],
    "tags": [
      "bra-strap"
    ],
    "specs": [
      {
        "label": "Item No.",
        "value": "H7231"
      },
      {
        "label": "Width",
        "value": "12 mm"
      },
      {
        "label": "Material",
        "value": "Nylon & Spandex"
      },
      {
        "label": "Application",
        "value": "Bra and lingerie shoulder straps"
      }
    ],
    "intro": "Bra Strap Elastic for bra and lingerie shoulder straps, available for buyer-specific color, width, stretch, logo, and packing development.",
    "applications": [
      "Bra and lingerie shoulder straps"
    ],
    "customOptions": [
      "Color matching",
      "Width and stretch",
      "Logo or pattern",
      "Roll and carton packing"
    ]
  },
  {
    "slug": "h7235silicone",
    "name": "H7235Silicone | Silicone Printed Elastic",
    "category": "lingerie",
    "categoryLabel": "Bra & Lingerie Elastics",
    "status": "published",
    "sortOrder": 520,
    "image": "assets/images/products/catalog-2026/h7235silicone/01.jpg",
    "gallery": [
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h7235silicone/01.jpg",
        "label": "Main View",
        "alt": "H7235Silicone | Silicone Printed Elastic product view 1",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h7235silicone/02.jpg",
        "label": "Product View 2",
        "alt": "H7235Silicone | Silicone Printed Elastic product view 2",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h7235silicone/03.jpg",
        "label": "Product View 3",
        "alt": "H7235Silicone | Silicone Printed Elastic product view 3",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h7235silicone/04.jpg",
        "label": "Product View 4",
        "alt": "H7235Silicone | Silicone Printed Elastic product view 4",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h7235silicone/05.jpg",
        "label": "Product View 5",
        "alt": "H7235Silicone | Silicone Printed Elastic product view 5",
        "rotate": false
      }
    ],
    "tags": [
      "silicone-grip",
      "printed",
      "bra-strap"
    ],
    "specs": [
      {
        "label": "Item No.",
        "value": "H7235Silicone"
      },
      {
        "label": "Width",
        "value": "15 mm"
      },
      {
        "label": "Material",
        "value": "Nylon & Spandex"
      },
      {
        "label": "Application",
        "value": "Lingerie Shoulder Straps & Intimate Apparel"
      }
    ],
    "intro": "Silicone Printed Elastic for lingerie shoulder straps & intimate apparel, available for buyer-specific color, width, stretch, logo, and packing development.",
    "applications": [
      "Lingerie Shoulder Straps & Intimate Apparel"
    ],
    "customOptions": [
      "Color matching",
      "Width and stretch",
      "Logo or pattern",
      "Roll and carton packing"
    ]
  },
  {
    "slug": "h60019",
    "name": "H60019 | Elastic Webbing",
    "category": "activewear",
    "categoryLabel": "Activewear Elastics",
    "status": "published",
    "sortOrder": 530,
    "image": "assets/images/products/catalog-2026/h60019/01.jpg",
    "gallery": [
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h60019/01.jpg",
        "label": "Main View",
        "alt": "H60019 | Elastic Webbing product view 1",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h60019/02.jpg",
        "label": "Product View 2",
        "alt": "H60019 | Elastic Webbing product view 2",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h60019/03.jpg",
        "label": "Product View 3",
        "alt": "H60019 | Elastic Webbing product view 3",
        "rotate": false
      }
    ],
    "tags": [
      "activewear"
    ],
    "specs": [
      {
        "label": "Item No.",
        "value": "H60019"
      },
      {
        "label": "Width",
        "value": "6/10 mm"
      },
      {
        "label": "Material",
        "value": "Nylon & Spandex / Nylon"
      },
      {
        "label": "Application",
        "value": "Bra and shapewear underwire casing"
      }
    ],
    "intro": "Elastic Webbing for bra and shapewear underwire casing, available for buyer-specific color, width, stretch, logo, and packing development.",
    "applications": [
      "Bra and shapewear underwire casing"
    ],
    "customOptions": [
      "Color matching",
      "Width and stretch",
      "Logo or pattern",
      "Roll and carton packing"
    ]
  },
  {
    "slug": "h60045",
    "name": "H60045 | Picot Elastic",
    "category": "lingerie",
    "categoryLabel": "Bra & Lingerie Elastics",
    "status": "published",
    "sortOrder": 540,
    "image": "assets/images/products/catalog-2026/h60045/01.jpg",
    "gallery": [
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h60045/01.jpg",
        "label": "Main View",
        "alt": "H60045 | Picot Elastic product view 1",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h60045/02.jpg",
        "label": "Product View 2",
        "alt": "H60045 | Picot Elastic product view 2",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h60045/03.jpg",
        "label": "Product View 3",
        "alt": "H60045 | Picot Elastic product view 3",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h60045/04.jpg",
        "label": "Product View 4",
        "alt": "H60045 | Picot Elastic product view 4",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h60045/05.jpg",
        "label": "Product View 5",
        "alt": "H60045 | Picot Elastic product view 5",
        "rotate": false
      }
    ],
    "tags": [
      "picot",
      "decorative-edge"
    ],
    "specs": [
      {
        "label": "Item No.",
        "value": "H60045"
      },
      {
        "label": "Width",
        "value": "11/13/14/17/20 mm"
      },
      {
        "label": "Material",
        "value": "Nylon & Spandex / Polyester & Latex"
      },
      {
        "label": "Application",
        "value": "Bra bands and picot edging"
      }
    ],
    "intro": "Picot Elastic for bra bands and picot edging, available for buyer-specific color, width, stretch, logo, and packing development.",
    "applications": [
      "Bra bands and picot edging"
    ],
    "customOptions": [
      "Color matching",
      "Width and stretch",
      "Logo or pattern",
      "Roll and carton packing"
    ]
  },
  {
    "slug": "h60066",
    "name": "H60066 | Picot Elastic",
    "category": "lingerie",
    "categoryLabel": "Bra & Lingerie Elastics",
    "status": "published",
    "sortOrder": 550,
    "image": "assets/images/products/catalog-2026/h60066/01.jpg",
    "gallery": [
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h60066/01.jpg",
        "label": "Main View",
        "alt": "H60066 | Picot Elastic product view 1",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h60066/02.jpg",
        "label": "Product View 2",
        "alt": "H60066 | Picot Elastic product view 2",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h60066/03.jpg",
        "label": "Product View 3",
        "alt": "H60066 | Picot Elastic product view 3",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h60066/04.jpg",
        "label": "Product View 4",
        "alt": "H60066 | Picot Elastic product view 4",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h60066/05.jpg",
        "label": "Product View 5",
        "alt": "H60066 | Picot Elastic product view 5",
        "rotate": false
      }
    ],
    "tags": [
      "picot"
    ],
    "specs": [
      {
        "label": "Item No.",
        "value": "H60066"
      },
      {
        "label": "Width",
        "value": "12/13 mm"
      },
      {
        "label": "Material",
        "value": "Nylon & Spandex"
      },
      {
        "label": "Application",
        "value": "Bra bands and picot edging"
      }
    ],
    "intro": "Picot Elastic for bra bands and picot edging, available for buyer-specific color, width, stretch, logo, and packing development.",
    "applications": [
      "Bra bands and picot edging"
    ],
    "customOptions": [
      "Color matching",
      "Width and stretch",
      "Logo or pattern",
      "Roll and carton packing"
    ]
  },
  {
    "slug": "h60128",
    "name": "H60128 | Plain Elastic",
    "category": "lingerie",
    "categoryLabel": "Bra & Lingerie Elastics",
    "status": "published",
    "sortOrder": 560,
    "image": "assets/images/products/catalog-2026/h60128/01.jpg",
    "gallery": [
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h60128/01.jpg",
        "label": "Main View",
        "alt": "H60128 | Plain Elastic product view 1",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h60128/02.jpg",
        "label": "Product View 2",
        "alt": "H60128 | Plain Elastic product view 2",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h60128/03.jpg",
        "label": "Product View 3",
        "alt": "H60128 | Plain Elastic product view 3",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h60128/04.jpg",
        "label": "Product View 4",
        "alt": "H60128 | Plain Elastic product view 4",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h60128/05.jpg",
        "label": "Product View 5",
        "alt": "H60128 | Plain Elastic product view 5",
        "rotate": false
      }
    ],
    "tags": [
      "plain"
    ],
    "specs": [
      {
        "label": "Item No.",
        "value": "H60128"
      },
      {
        "label": "Width",
        "value": "8/10/12/15 mm"
      },
      {
        "label": "Material",
        "value": "Nylon & Spandex"
      },
      {
        "label": "Application",
        "value": "Bra bands and picot edging"
      }
    ],
    "intro": "Plain Elastic for bra bands and picot edging, available for buyer-specific color, width, stretch, logo, and packing development.",
    "applications": [
      "Bra bands and picot edging"
    ],
    "customOptions": [
      "Color matching",
      "Width and stretch",
      "Logo or pattern",
      "Roll and carton packing"
    ]
  },
  {
    "slug": "h60131",
    "name": "H60131 | Picot Elastic",
    "category": "lingerie",
    "categoryLabel": "Bra & Lingerie Elastics",
    "status": "published",
    "sortOrder": 570,
    "image": "assets/images/products/catalog-2026/h60131/01.jpg",
    "gallery": [
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h60131/01.jpg",
        "label": "Main View",
        "alt": "H60131 | Picot Elastic product view 1",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h60131/02.jpg",
        "label": "Product View 2",
        "alt": "H60131 | Picot Elastic product view 2",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h60131/03.jpg",
        "label": "Product View 3",
        "alt": "H60131 | Picot Elastic product view 3",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h60131/04.jpg",
        "label": "Product View 4",
        "alt": "H60131 | Picot Elastic product view 4",
        "rotate": false
      }
    ],
    "tags": [
      "picot",
      "decorative-edge"
    ],
    "specs": [
      {
        "label": "Item No.",
        "value": "H60131"
      },
      {
        "label": "Width",
        "value": "11/13 mm"
      },
      {
        "label": "Material",
        "value": "Nylon & Spandex"
      },
      {
        "label": "Application",
        "value": "Bra bands and picot edging"
      }
    ],
    "intro": "Picot Elastic for bra bands and picot edging, available for buyer-specific color, width, stretch, logo, and packing development.",
    "applications": [
      "Bra bands and picot edging"
    ],
    "customOptions": [
      "Color matching",
      "Width and stretch",
      "Logo or pattern",
      "Roll and carton packing"
    ]
  },
  {
    "slug": "h60190",
    "name": "H60190 | Jacquard Bra Strap Elastic",
    "category": "activewear",
    "categoryLabel": "Activewear Elastics",
    "status": "published",
    "sortOrder": 590,
    "image": "assets/images/products/catalog-2026/h60190/01.jpg",
    "gallery": [
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h60190/01.jpg",
        "label": "Main View",
        "alt": "H60190 | Jacquard Bra Strap Elastic product view 1",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h60190/02.jpg",
        "label": "Product View 2",
        "alt": "H60190 | Jacquard Bra Strap Elastic product view 2",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h60190/03.jpg",
        "label": "Product View 3",
        "alt": "H60190 | Jacquard Bra Strap Elastic product view 3",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h60190/04.jpg",
        "label": "Product View 4",
        "alt": "H60190 | Jacquard Bra Strap Elastic product view 4",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h60190/05.jpg",
        "label": "Product View 5",
        "alt": "H60190 | Jacquard Bra Strap Elastic product view 5",
        "rotate": false
      }
    ],
    "tags": [
      "activewear",
      "jacquard",
      "bra-strap",
      "binding"
    ],
    "specs": [
      {
        "label": "Item No.",
        "value": "H60190"
      },
      {
        "label": "Width",
        "value": "15 mm"
      },
      {
        "label": "Material",
        "value": "Nylon & Spandex"
      },
      {
        "label": "Application",
        "value": "Bra bands, picot edging, and shoulder straps"
      }
    ],
    "intro": "Jacquard Bra Strap Elastic for bra bands, picot edging, and shoulder straps, available for buyer-specific color, width, stretch, logo, and packing development.",
    "applications": [
      "Bra bands, picot edging, and shoulder straps"
    ],
    "customOptions": [
      "Color matching",
      "Width and stretch",
      "Logo or pattern",
      "Roll and carton packing"
    ]
  },
  {
    "slug": "h60198",
    "name": "H60198 | Jacquard Bra Strap Elastic",
    "category": "lingerie",
    "categoryLabel": "Bra & Lingerie Elastics",
    "status": "published",
    "sortOrder": 600,
    "image": "assets/images/products/catalog-2026/h60198/01.jpg",
    "gallery": [
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h60198/01.jpg",
        "label": "Main View",
        "alt": "H60198 | Jacquard Bra Strap Elastic product view 1",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h60198/02.jpg",
        "label": "Product View 2",
        "alt": "H60198 | Jacquard Bra Strap Elastic product view 2",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h60198/03.jpg",
        "label": "Product View 3",
        "alt": "H60198 | Jacquard Bra Strap Elastic product view 3",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h60198/04.jpg",
        "label": "Product View 4",
        "alt": "H60198 | Jacquard Bra Strap Elastic product view 4",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/h60198/05.jpg",
        "label": "Product View 5",
        "alt": "H60198 | Jacquard Bra Strap Elastic product view 5",
        "rotate": false
      }
    ],
    "tags": [
      "jacquard",
      "bra-strap",
      "waistband"
    ],
    "specs": [
      {
        "label": "Item No.",
        "value": "H60198"
      },
      {
        "label": "Width",
        "value": "16 mm"
      },
      {
        "label": "Material",
        "value": "Nylon & Spandex"
      },
      {
        "label": "Application",
        "value": "Lingerie Shoulder Straps & Lace Underwear Waistbands"
      }
    ],
    "intro": "Jacquard Bra Strap Elastic for lingerie shoulder straps & lace underwear waistbands, available for buyer-specific color, width, stretch, logo, and packing development.",
    "applications": [
      "Lingerie Shoulder Straps & Lace Underwear Waistbands"
    ],
    "customOptions": [
      "Color matching",
      "Width and stretch",
      "Logo or pattern",
      "Roll and carton packing"
    ]
  },
  {
    "slug": "hg50354",
    "name": "HG50354 | Jacquard Elastic",
    "category": "activewear",
    "categoryLabel": "Activewear Elastics",
    "status": "published",
    "sortOrder": 610,
    "image": "assets/images/products/catalog-2026/hg50354/01.jpg",
    "gallery": [
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/hg50354/01.jpg",
        "label": "Main View",
        "alt": "HG50354 | Jacquard Elastic product view 1",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/hg50354/02.jpg",
        "label": "Product View 2",
        "alt": "HG50354 | Jacquard Elastic product view 2",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/hg50354/03.jpg",
        "label": "Product View 3",
        "alt": "HG50354 | Jacquard Elastic product view 3",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/hg50354/04.jpg",
        "label": "Product View 4",
        "alt": "HG50354 | Jacquard Elastic product view 4",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/hg50354/05.jpg",
        "label": "Product View 5",
        "alt": "HG50354 | Jacquard Elastic product view 5",
        "rotate": false
      }
    ],
    "tags": [
      "activewear",
      "jacquard",
      "waistband"
    ],
    "specs": [
      {
        "label": "Item No.",
        "value": "HG50354"
      },
      {
        "label": "Width",
        "value": "50 mm"
      },
      {
        "label": "Material",
        "value": "Polyester & Spandex"
      },
      {
        "label": "Application",
        "value": "Football, basketball, and sportswear waistbands"
      }
    ],
    "intro": "Jacquard Elastic for football, basketball, and sportswear waistbands, available for buyer-specific color, width, stretch, logo, and packing development.",
    "applications": [
      "Football, basketball, and sportswear waistbands"
    ],
    "customOptions": [
      "Color matching",
      "Width and stretch",
      "Logo or pattern",
      "Roll and carton packing"
    ]
  },
  {
    "slug": "ht20-4222",
    "name": "HT20-4222 | Silicone Grip Elastic",
    "category": "mens",
    "categoryLabel": "Men's Underwear Elastics",
    "status": "published",
    "sortOrder": 620,
    "image": "assets/images/products/catalog-2026/ht20-4222/01.jpg",
    "gallery": [
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/ht20-4222/01.jpg",
        "label": "Main View",
        "alt": "HT20-4222 | Silicone Grip Elastic product view 1",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/ht20-4222/02.jpg",
        "label": "Product View 2",
        "alt": "HT20-4222 | Silicone Grip Elastic product view 2",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/ht20-4222/03.jpg",
        "label": "Product View 3",
        "alt": "HT20-4222 | Silicone Grip Elastic product view 3",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/ht20-4222/04.jpg",
        "label": "Product View 4",
        "alt": "HT20-4222 | Silicone Grip Elastic product view 4",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/ht20-4222/05.jpg",
        "label": "Product View 5",
        "alt": "HT20-4222 | Silicone Grip Elastic product view 5",
        "rotate": false
      }
    ],
    "tags": [
      "silicone-grip"
    ],
    "specs": [
      {
        "label": "Item No.",
        "value": "HT20-4222"
      },
      {
        "label": "Width",
        "value": "10 / 15 mm"
      },
      {
        "label": "Material",
        "value": "Polyester"
      },
      {
        "label": "Application",
        "value": "Non-slip elastic applications"
      }
    ],
    "intro": "Silicone Grip Elastic for non-slip elastic applications, available for buyer-specific color, width, stretch, logo, and packing development.",
    "applications": [
      "Non-slip elastic applications"
    ],
    "customOptions": [
      "Color matching",
      "Width and stretch",
      "Logo or pattern",
      "Roll and carton packing"
    ]
  },
  {
    "slug": "jq124",
    "name": "JQ124 | Jacquard Elastic",
    "category": "mens",
    "categoryLabel": "Men's Underwear Elastics",
    "status": "published",
    "sortOrder": 630,
    "image": "assets/images/products/catalog-2026/jq124/01.jpg",
    "gallery": [
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/jq124/01.jpg",
        "label": "Main View",
        "alt": "JQ124 | Jacquard Elastic product view 1",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/jq124/02.jpg",
        "label": "Product View 2",
        "alt": "JQ124 | Jacquard Elastic product view 2",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/jq124/03.jpg",
        "label": "Product View 3",
        "alt": "JQ124 | Jacquard Elastic product view 3",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/jq124/04.jpg",
        "label": "Product View 4",
        "alt": "JQ124 | Jacquard Elastic product view 4",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/jq124/05.jpg",
        "label": "Product View 5",
        "alt": "JQ124 | Jacquard Elastic product view 5",
        "rotate": false
      }
    ],
    "tags": [
      "jacquard",
      "printed",
      "waistband"
    ],
    "specs": [
      {
        "label": "Item No.",
        "value": "JQ124"
      },
      {
        "label": "Width",
        "value": "25 mm"
      },
      {
        "label": "Material",
        "value": "Polyester & Spandex"
      },
      {
        "label": "Application",
        "value": "Elastic waistbands"
      }
    ],
    "intro": "Jacquard Elastic for elastic waistbands, available for buyer-specific color, width, stretch, logo, and packing development.",
    "applications": [
      "Elastic waistbands"
    ],
    "customOptions": [
      "Color matching",
      "Width and stretch",
      "Logo or pattern",
      "Roll and carton packing"
    ]
  },
  {
    "slug": "jq129",
    "name": "JQ129 | Jacquard Elastic",
    "category": "mens",
    "categoryLabel": "Men's Underwear Elastics",
    "status": "published",
    "sortOrder": 640,
    "image": "assets/images/products/catalog-2026/jq129/01.jpg",
    "gallery": [
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/jq129/01.jpg",
        "label": "Main View",
        "alt": "JQ129 | Jacquard Elastic product view 1",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/jq129/02.jpg",
        "label": "Product View 2",
        "alt": "JQ129 | Jacquard Elastic product view 2",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/jq129/03.jpg",
        "label": "Product View 3",
        "alt": "JQ129 | Jacquard Elastic product view 3",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/jq129/04.jpg",
        "label": "Product View 4",
        "alt": "JQ129 | Jacquard Elastic product view 4",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/jq129/05.jpg",
        "label": "Product View 5",
        "alt": "JQ129 | Jacquard Elastic product view 5",
        "rotate": false
      }
    ],
    "tags": [
      "jacquard",
      "printed",
      "waistband"
    ],
    "specs": [
      {
        "label": "Item No.",
        "value": "JQ129"
      },
      {
        "label": "Width",
        "value": "30 mm"
      },
      {
        "label": "Material",
        "value": "Polyester & Spandex"
      },
      {
        "label": "Application",
        "value": "Elastic waistbands"
      }
    ],
    "intro": "Jacquard Elastic for elastic waistbands, available for buyer-specific color, width, stretch, logo, and packing development.",
    "applications": [
      "Elastic waistbands"
    ],
    "customOptions": [
      "Color matching",
      "Width and stretch",
      "Logo or pattern",
      "Roll and carton packing"
    ]
  },
  {
    "slug": "jq130",
    "name": "JQ130 | Jacquard Elastic",
    "category": "mens",
    "categoryLabel": "Men's Underwear Elastics",
    "status": "published",
    "sortOrder": 650,
    "image": "assets/images/products/catalog-2026/jq130/01.jpg",
    "gallery": [
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/jq130/01.jpg",
        "label": "Main View",
        "alt": "JQ130 | Jacquard Elastic product view 1",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/jq130/02.jpg",
        "label": "Product View 2",
        "alt": "JQ130 | Jacquard Elastic product view 2",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/jq130/03.jpg",
        "label": "Product View 3",
        "alt": "JQ130 | Jacquard Elastic product view 3",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/jq130/04.jpg",
        "label": "Product View 4",
        "alt": "JQ130 | Jacquard Elastic product view 4",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/jq130/05.jpg",
        "label": "Product View 5",
        "alt": "JQ130 | Jacquard Elastic product view 5",
        "rotate": false
      }
    ],
    "tags": [
      "jacquard",
      "printed",
      "waistband"
    ],
    "specs": [
      {
        "label": "Item No.",
        "value": "JQ130"
      },
      {
        "label": "Width",
        "value": "35 mm"
      },
      {
        "label": "Material",
        "value": "Polyester & Spandex"
      },
      {
        "label": "Application",
        "value": "Elastic waistbands"
      }
    ],
    "intro": "Jacquard Elastic for elastic waistbands, available for buyer-specific color, width, stretch, logo, and packing development.",
    "applications": [
      "Elastic waistbands"
    ],
    "customOptions": [
      "Color matching",
      "Width and stretch",
      "Logo or pattern",
      "Roll and carton packing"
    ]
  },
  {
    "slug": "n6294",
    "name": "N6294 | Bra Strap Elastic",
    "category": "lingerie",
    "categoryLabel": "Bra & Lingerie Elastics",
    "status": "published",
    "sortOrder": 660,
    "image": "assets/images/products/catalog-2026/n6294/01.jpg",
    "gallery": [
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/n6294/01.jpg",
        "label": "Main View",
        "alt": "N6294 | Bra Strap Elastic product view 1",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/n6294/02.jpg",
        "label": "Product View 2",
        "alt": "N6294 | Bra Strap Elastic product view 2",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/n6294/03.jpg",
        "label": "Product View 3",
        "alt": "N6294 | Bra Strap Elastic product view 3",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/n6294/04.jpg",
        "label": "Product View 4",
        "alt": "N6294 | Bra Strap Elastic product view 4",
        "rotate": false
      }
    ],
    "tags": [
      "bra-strap"
    ],
    "specs": [
      {
        "label": "Item No.",
        "value": "N6294"
      },
      {
        "label": "Width",
        "value": "25/30 mm"
      },
      {
        "label": "Material",
        "value": "Nylon & Spandex"
      },
      {
        "label": "Application",
        "value": "Bra and lingerie shoulder straps"
      }
    ],
    "intro": "Bra Strap Elastic for bra and lingerie shoulder straps, available for buyer-specific color, width, stretch, logo, and packing development.",
    "applications": [
      "Bra and lingerie shoulder straps"
    ],
    "customOptions": [
      "Color matching",
      "Width and stretch",
      "Logo or pattern",
      "Roll and carton packing"
    ]
  },
  {
    "slug": "onitademas",
    "name": "onitadeMas | Jacquard Elastic",
    "category": "activewear",
    "categoryLabel": "Activewear Elastics",
    "status": "published",
    "sortOrder": 670,
    "image": "assets/images/products/catalog-2026/onitademas/01.jpg",
    "gallery": [
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/onitademas/01.jpg",
        "label": "Main View",
        "alt": "onitadeMas | Jacquard Elastic product view 1",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/onitademas/02.jpg",
        "label": "Product View 2",
        "alt": "onitadeMas | Jacquard Elastic product view 2",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/onitademas/03.jpg",
        "label": "Product View 3",
        "alt": "onitadeMas | Jacquard Elastic product view 3",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/onitademas/04.jpg",
        "label": "Product View 4",
        "alt": "onitadeMas | Jacquard Elastic product view 4",
        "rotate": false
      }
    ],
    "tags": [
      "activewear",
      "jacquard",
      "waistband"
    ],
    "specs": [
      {
        "label": "Item No.",
        "value": "onitadeMas"
      },
      {
        "label": "Width",
        "value": "25 mm"
      },
      {
        "label": "Material",
        "value": "Nylon & Spandex"
      },
      {
        "label": "Application",
        "value": "Elastic waistbands"
      }
    ],
    "intro": "Jacquard Elastic for elastic waistbands, available for buyer-specific color, width, stretch, logo, and packing development.",
    "applications": [
      "Elastic waistbands"
    ],
    "customOptions": [
      "Color matching",
      "Width and stretch",
      "Logo or pattern",
      "Roll and carton packing"
    ]
  },
  {
    "slug": "spooky-babe-slicone",
    "name": "SPOOKY BABE Silicone Printed Elastic",
    "category": "mens",
    "categoryLabel": "Men's Underwear Elastics",
    "status": "published",
    "sortOrder": 680,
    "image": "assets/images/products/catalog-2026/spooky-babe-slicone/01.jpg",
    "gallery": [
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/spooky-babe-slicone/01.jpg",
        "label": "Main View",
        "alt": "SPOOKY BABE Silicone Printed Elastic product view 1",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/spooky-babe-slicone/02.jpg",
        "label": "Product View 2",
        "alt": "SPOOKY BABE Silicone Printed Elastic product view 2",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/spooky-babe-slicone/03.jpg",
        "label": "Product View 3",
        "alt": "SPOOKY BABE Silicone Printed Elastic product view 3",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/spooky-babe-slicone/04.jpg",
        "label": "Product View 4",
        "alt": "SPOOKY BABE Silicone Printed Elastic product view 4",
        "rotate": false
      },
      {
        "group": "Product Display",
        "src": "assets/images/products/catalog-2026/spooky-babe-slicone/05.jpg",
        "label": "Product View 5",
        "alt": "SPOOKY BABE Silicone Printed Elastic product view 5",
        "rotate": false
      }
    ],
    "tags": [
      "silicone-grip",
      "printed",
      "waistband"
    ],
    "specs": [
      {
        "label": "Item No.",
        "value": "SPOOKY BABE:SLICONE"
      },
      {
        "label": "Width",
        "value": "35 mm"
      },
      {
        "label": "Material",
        "value": "Nylon & Spandex"
      },
      {
        "label": "Application",
        "value": "Elastic waistbands"
      }
    ],
    "intro": "Silicone Printed Elastic for elastic waistbands, available for buyer-specific color, width, stretch, logo, and packing development.",
    "applications": [
      "Elastic waistbands"
    ],
    "customOptions": [
      "Color matching",
      "Width and stretch",
      "Logo or pattern",
      "Roll and carton packing"
    ]
  }
];

let products = normalizePublicProducts(DEFAULT_PRODUCTS);
let featuredProducts = products.slice(0, 6);
let isPreviewMode = false;

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

function normalizeArray(value) {
  if (Array.isArray(value)) return value.map(item => String(item || '').trim()).filter(Boolean);
  if (typeof value === 'string') return value.split(/\r?\n|,/).map(item => item.trim()).filter(Boolean);
  return [];
}

function normalizeFeatureList(value) {
  if (Array.isArray(value)) return value.map(item => String(item || '').trim()).filter(Boolean);
  if (typeof value === 'string') return value.split(/\r?\n/).map(item => item.trim()).filter(Boolean);
  return [];
}

function normalizeSpecRow(item, index = 0) {
  if (item && typeof item === 'object') {
    const label = String(item.label || item.name || item.key || item.title || '').trim();
    const value = String(item.value || item.text || item.detail || item.content || '').trim();
    if (!label && !value) return null;
    return {
      label: label || (LEGACY_SPEC_LABELS[index] || `Specification ${index + 1}`),
      value
    };
  }

  const text = String(item || '').trim();
  if (!text) return null;
  const match = text.match(/^([^:：]{1,40})[:：]\s*(.+)$/);
  if (match) {
    return {
      label: match[1].trim(),
      value: match[2].trim()
    };
  }
  return {
    label: LEGACY_SPEC_LABELS[index] || `Specification ${index + 1}`,
    value: text
  };
}

function normalizeSpecRows(value) {
  const rows = Array.isArray(value)
    ? value
    : (typeof value === 'string' ? value.split(/\r?\n/) : []);
  return rows
    .map((item, index) => normalizeSpecRow(item, index))
    .filter(Boolean);
}

function hasStructuredSpecs(value) {
  return Array.isArray(value) && value.some(item => item && typeof item === 'object');
}

function productSpecRows(source) {
  const rows = normalizeSpecRows(source.specs);
  if (hasStructuredSpecs(source.specs) || !rows.length) return rows;

  const labels = new Set(rows.map(row => row.label.toLowerCase()));
  const applications = normalizeArray(source.applications);
  const customOptions = normalizeArray(source.customOptions);
  const legacyDetailRows = [
    { label: 'Color', value: 'Pantone or fabric color matching available' },
    { label: 'Elasticity', value: 'Custom stretch tension and recovery control' },
    { label: 'Usage', value: applications.join(', ') },
    { label: 'Packing', value: customOptions[3] || 'Roll length and carton packing' }
  ];

  legacyDetailRows.forEach(row => {
    if (!row.value || labels.has(row.label.toLowerCase())) return;
    rows.push(row);
    labels.add(row.label.toLowerCase());
  });
  return rows;
}

function specSummary(specs) {
  return normalizeSpecRows(specs)
    .filter(spec => spec.value)
    .map(spec => (spec.label ? `${spec.label}: ${spec.value}` : spec.value))
    .filter(Boolean);
}

function normalizeImageLabelKey(value) {
  return String(value || '').trim().toLowerCase().replace(/&/g, 'and').replace(/\s+/g, ' ');
}

function imagePresetForIndex(index) {
  return IMAGE_LABEL_PRESETS[Math.min(index, IMAGE_LABEL_PRESETS.length - 1)];
}

function imagePresetForLabel(label, index = 0) {
  const key = normalizeImageLabelKey(label);
  const preset = IMAGE_LABEL_PRESETS.find(item => normalizeImageLabelKey(item.label) === key);
  if (preset) return preset;
  return imagePresetForIndex(index);
}

function imageAlt(productName, label) {
  return `${productName || 'Product'} - ${label}`;
}

function normalizeGallery(product) {
  const rawGallery = Array.isArray(product.gallery) ? product.gallery : [];
  const shouldPrependImage = Boolean(product.image && !rawGallery.some(item => {
    const src = typeof item === 'string' ? item : String((item && item.src) || '').trim();
    return src === product.image;
  }));
  const gallery = rawGallery.map((item, index) => {
    const labelIndex = index + (shouldPrependImage ? 1 : 0);
    const preset = imagePresetForLabel(typeof item === 'string' ? '' : (item && (item.label || item.thumbLabel)), labelIndex);
    if (typeof item === 'string') {
      return {
        group: preset.group,
        src: item,
        label: preset.label,
        alt: imageAlt(product.name, preset.label),
        rotate: false
      };
    }
    const source = item && typeof item === 'object' ? item : {};
    return {
      group: preset.group,
      src: String(source.src || '').trim(),
      label: preset.label,
      alt: imageAlt(product.name, preset.label),
      rotate: Boolean(source.rotate)
    };
  }).filter(item => item.src);

  if (shouldPrependImage) {
    const preset = imagePresetForIndex(0);
    gallery.unshift({
      group: preset.group,
      src: product.image,
      label: preset.label,
      alt: imageAlt(product.name, preset.label),
      rotate: false
    });
  }

  return gallery;
}

function normalizeProductForSite(product, index = 0, includeDraft = false) {
  const source = product && typeof product === 'object' ? product : {};
  const status = source.status || 'published';
  if (!includeDraft && status !== 'published') return null;

  const category = CATEGORY_LABELS[source.category] ? source.category : 'mens';
  const name = String(source.name || 'Untitled Product').trim();
  const normalized = {
    slug: String(source.slug || `product-${index + 1}`).trim(),
    name,
    category,
    categoryLabel: CATEGORY_LABELS[category],
    status,
    sortOrder: Number.isFinite(Number(source.sortOrder)) ? Number(source.sortOrder) : (index + 1) * 10,
    image: String(source.image || '').trim(),
    tags: normalizeArray(source.tags),
    features: normalizeFeatureList(source.features),
    specs: productSpecRows(source),
    intro: String(source.intro || '').trim(),
    applications: normalizeArray(source.applications),
    customOptions: normalizeArray(source.customOptions)
  };
  normalized.gallery = normalizeGallery({ ...source, ...normalized });
  return normalized;
}

function normalizePublicProducts(items) {
  return (Array.isArray(items) ? items : [])
    .map((item, index) => normalizeProductForSite(item, index))
    .filter(Boolean)
    .filter(item => !/^(test|new)-product$/i.test(item.slug) && !/^(test|new) product$/i.test(item.name))
    .sort((a, b) => {
      const order = Number(a.sortOrder || 0) - Number(b.sortOrder || 0);
      if (order !== 0) return order;
      return a.name.localeCompare(b.name);
    });
}

function getPreviewProduct() {
  const params = new URLSearchParams(window.location.search);
  if (!params.has('preview')) return null;
  try {
    const raw = sessionStorage.getItem(PRODUCT_PREVIEW_KEY);
    if (!raw) return null;
    return normalizeProductForSite(JSON.parse(raw), 0, true);
  } catch (error) {
    console.warn('Unable to load product preview.', error);
    return null;
  }
}

function freshDataUrl(url) {
  if (window.location.protocol === 'file:') return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}cmsFresh=${Date.now()}`;
}

async function fetchProductsFrom(url) {
  const response = await fetch(freshDataUrl(url), {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
  });
  if (!response.ok) throw new Error(`Unable to load ${url}`);
  const data = await response.json();
  return data.products || data;
}

async function loadSiteProducts() {
  const previewProduct = getPreviewProduct();
  if (previewProduct) {
    isPreviewMode = true;
    products = [previewProduct];
    featuredProducts = products;
    return;
  }

  const sources = window.location.protocol === 'file:'
    ? ['data/products.json']
    : ['/api/products', 'data/products.json'];

  for (const source of sources) {
    try {
      products = normalizePublicProducts(await fetchProductsFrom(source));
      featuredProducts = products.slice(0, 6);
      return;
    } catch (error) {
      console.warn(error.message);
    }
  }

  products = normalizePublicProducts(DEFAULT_PRODUCTS);
  featuredProducts = products.slice(0, 6);
}

function renderProductCards(containerId, items) {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (!items.length) {
    container.innerHTML = '<div class="empty-state"><strong>Products for this filter are being prepared.</strong><span>Contact Huagui with your target construction, width, color, quantity, and application for a custom-development review.</span><a href="contact.html" class="btn btn-outline">Send Requirements</a></div>';
    return;
  }
  container.innerHTML = items.map(p => `
    <article class="product-card">
      <a class="product-card-img" href="${escapeHtml(productPublicUrl(p.slug))}" aria-label="${escapeHtml(p.name)}">
        <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" loading="lazy">
      </a>
      <div class="product-card-body">
        <p class="material">${escapeHtml(p.categoryLabel)}</p>
        <h3><a href="${escapeHtml(productPublicUrl(p.slug))}">${escapeHtml(p.name)}</a></h3>
        <div class="tag-row">${p.tags.map(tag => `<span>${escapeHtml(formatTag(tag))}</span>`).join('')}</div>
        <div class="specs">${specSummary(p.specs).slice(0, 4).map(s => `<span>${escapeHtml(s)}</span>`).join('')}</div>
        <a href="${escapeHtml(productPublicUrl(p.slug))}" class="btn-inquiry">View Details</a>
      </div>
    </article>
  `).join('');
}

function productPublicUrl(slug) {
  const encodedSlug = encodeURIComponent(slug);
  const isLocalPreview = window.location.protocol === 'file:'
    || window.location.hostname === '127.0.0.1'
    || window.location.hostname === 'localhost';
  if (isLocalPreview) return `product-detail.html?slug=${encodedSlug}`;

  const locale = window.HUAGUI_I18N?.locale || 'en';
  const prefix = locale === 'en' ? '' : `/${locale}`;
  return `${prefix}/products/${encodedSlug}`;
}

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
}

function setProductSeo(product) {
  const translate = window.HUAGUI_I18N?.translate || (value => value);
  const localizedName = translate(product.name);
  const description = translate(product.intro || `${product.name} manufactured by Huagui Elastic for underwear, lingerie, bras, and intimate apparel production.`);
  document.title = `${localizedName} Manufacturer | Huagui Elastic`;
  upsertMeta('meta[name="description"]', { name: 'description', content: description });
  upsertMeta('meta[property="og:title"]', { property: 'og:title', content: document.title });
  upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
  upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'product' });
  upsertMeta('meta[property="og:url"]', { property: 'og:url', content: window.location.href });
  if (product.image) upsertMeta('meta[property="og:image"]', { property: 'og:image', content: new URL(product.image, window.location.origin).href });

  const itemNo = product.specs.find(spec => /^item\s*(no\.?|number)$/i.test(spec.label.trim()))?.value || '';

  document.getElementById('productStructuredData')?.remove();
  const structuredData = document.createElement('script');
  structuredData.id = 'productStructuredData';
  structuredData.type = 'application/ld+json';
  structuredData.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: localizedName,
    description,
    image: product.gallery.map(item => new URL(item.src, window.location.origin).href),
    ...(itemNo ? { sku: itemNo } : {}),
    brand: { '@type': 'Brand', name: 'Huagui Elastic' },
    manufacturer: {
      '@type': 'Organization',
      '@id': 'https://www.huaguielastic.com/#organization',
      name: 'Huagui Elastic',
      legalName: 'Shantou Huagui Industrial Co., Ltd.',
      url: 'https://www.huaguielastic.com/'
    },
    category: translate(product.categoryLabel),
    additionalProperty: product.specs.filter(spec => spec.label && spec.value).map(spec => ({
      '@type': 'PropertyValue',
      name: translate(spec.label),
      value: translate(spec.value)
    }))
  });
  document.head.appendChild(structuredData);
}

function formatTag(tag) {
  const labels = {
    'printed': 'Printed',
    'jacquard': 'Jacquard',
    'debossed': 'Debossed',
    'embossed': 'Embossed',
    'lurex': 'Lurex',
    'plain': 'Plain',
    'fold-over': 'Fold Over',
    'picot': 'Picot',
    'silicone-grip': 'Silicone Grip',
    'bra-strap': 'Bra Strap',
    'waistband': 'Waistband',
    'lingerie': 'Lingerie',
    'activewear': 'Activewear',
    'binding': 'Binding',
    'decorative-edge': 'Decorative Edge',
    reflective: 'Reflective',
    'elastic-tape': 'Elastic Tape',
    'knitted': 'Knitted',
    'womens-underwear': "Women's Underwear"
  };
  return labels[tag] || tag;
}

// ========== Products Page ==========
function initProductsPage() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  let currentCat = 'all';
  let currentTag = 'all';

  function filterProducts() {
    const filtered = products.filter(p => {
      const catMatch = currentCat === 'all' || p.category === currentCat;
      const tagMatch = currentTag === 'all' || p.tags.includes(currentTag);
      return catMatch && tagMatch;
    });
    renderProductCards('productsGrid', filtered);
    const count = document.getElementById('productCount');
    if (count) count.textContent = `${filtered.length} elastic solutions`;
  }

  document.querySelectorAll('[data-cat]').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('[data-cat]').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentCat = tab.dataset.cat;
      filterProducts();
    });
  });

  document.querySelectorAll('[data-tag]').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('[data-tag]').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentTag = tab.dataset.tag;
      filterProducts();
    });
  });

  const params = new URLSearchParams(window.location.search);
  const catParam = params.get('cat');
  const tagParam = params.get('tag');
  if (catParam) {
    const targetCat = document.querySelector(`[data-cat="${catParam}"]`);
    if (targetCat) targetCat.click();
  }
  if (tagParam) {
    const targetTag = document.querySelector(`[data-tag="${tagParam}"]`);
    if (targetTag) targetTag.click();
  }
  filterProducts();
}

// ========== Product Detail Page ==========
function syncProductMainImageLayout(image) {
  const frame = image && image.closest('.product-main-image');
  if (!frame || !image.naturalWidth || !image.naturalHeight) return;

  const rotated = image.classList.contains('is-rotated');
  const displayWidth = rotated ? image.naturalHeight : image.naturalWidth;
  const displayHeight = rotated ? image.naturalWidth : image.naturalHeight;
  frame.style.setProperty('--gallery-aspect', `${displayWidth} / ${displayHeight}`);

  requestAnimationFrame(() => {
    if (rotated) {
      image.style.setProperty('--gallery-rotated-width', `${frame.clientHeight}px`);
      image.style.setProperty('--gallery-rotated-height', `${frame.clientWidth}px`);
    } else {
      image.style.removeProperty('--gallery-rotated-width');
      image.style.removeProperty('--gallery-rotated-height');
    }
  });
}

function initProductDetailPage() {
  const page = document.getElementById('productDetail');
  if (!page) return;

  const params = new URLSearchParams(window.location.search);
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  const cleanPathSlug = pathParts.includes('products') && !pathParts.at(-1).endsWith('.html') ? pathParts.at(-1) : '';
  const slug = params.get('slug') || cleanPathSlug || (products[0] && products[0].slug) || 'printed-waistbands';
  const product = products.find(p => p.slug === slug) || (isPreviewMode ? products[0] : null);
  if (!product) {
    document.title = 'Huagui Elastic - Product Not Found';
    page.innerHTML = `
      <section class="section">
        <div class="container">
          <div class="breadcrumb">
            <a href="index.html">Home</a><span>/</span><a href="products.html">Products</a>
          </div>
          <div class="empty-detail">
            <p class="section-label">Product Catalog</p>
            <h1>Product Not Found</h1>
            <p>This product is not currently published.</p>
            <a href="products.html" class="btn btn-primary">View Products</a>
          </div>
        </div>
      </section>
    `;
    return;
  }
  const gallery = (product.gallery && product.gallery.length ? product.gallery : [product.image]).map((item, index) => {
    if (typeof item === 'string') {
      return {
        group: 'Gallery',
        src: item,
        label: `View ${index + 1}`,
        alt: `${product.name} view ${index + 1}`
      };
    }
    return {
      group: item.group || 'Gallery',
      src: item.src,
      label: item.label || item.thumbLabel || `View ${index + 1}`,
      alt: item.alt || `${product.name} ${item.label || `view ${index + 1}`}`,
      rotate: Boolean(item.rotate)
    };
  }).filter(item => item.src);
  if (!gallery.length) {
    gallery.push({
      group: 'Gallery',
      src: 'assets/images/products/catalog-2026/jq124/jq124-jacquard-elastic-main-view.jpg',
      label: 'Preview Image',
      alt: `${product.name} preview image`,
      rotate: false
    });
  }
  const galleryGroups = gallery.reduce((groups, image, index) => {
    if (!groups.has(image.group)) groups.set(image.group, []);
    groups.get(image.group).push({ ...image, index });
    return groups;
  }, new Map());
  const productFeatures = product.features;
  const fallbackSpecificationRows = [
    { label: 'Material', value: 'Nylon / Polyester / Spandex' },
    { label: 'Width', value: 'Custom width available' },
    { label: 'Color', value: 'Pantone or fabric color matching available' },
    { label: 'Elasticity', value: 'Custom stretch tension and recovery control' },
    { label: 'Usage', value: product.applications.join(', ') },
    { label: 'Packing', value: product.customOptions[3] || 'Roll length and carton packing' }
  ].filter(row => row.value);
  const specificationRows = product.specs.length ? product.specs : fallbackSpecificationRows;
  const hasItemNoRow = specificationRows.some(spec => /^item\s*(no\.?|number)$/i.test(spec.label.trim()));
  const displaySpecificationRows = specificationRows.filter(spec => spec.label && spec.value);
  const itemNo = displaySpecificationRows.find(spec => /^item\s*(no\.?|number)$/i.test(spec.label.trim()))?.value || '';
  const quoteParams = new URLSearchParams({
    productName: product.name,
    category: product.category,
    itemNo
  });
  const quoteUrl = `contact.html?${quoteParams.toString()}`;

  setProductSeo(product);
  page.innerHTML = `
    <section class="product-detail-shell">
      <div class="container">
        ${isPreviewMode ? '<div class="preview-ribbon"><strong>Preview</strong><span>This product is not published yet.</span></div>' : ''}
        <div class="breadcrumb">
          <a href="index.html">Home</a><span>/</span><a href="products.html">Products</a><span>/</span><strong>${escapeHtml(product.categoryLabel)}</strong>
        </div>

        <div class="product-detail-layout">
          <aside class="detail-sidebar">
            <p class="section-label">${escapeHtml(product.categoryLabel)}</p>
            <h1>${escapeHtml(product.name)}</h1>
            <div class="detail-title-dash"></div>
            <p class="product-intro">${escapeHtml(product.intro)}</p>
            <a href="${escapeHtml(quoteUrl)}" class="btn btn-primary mobile-primary-cta">Request Quote</a>
            <div class="detail-highlight-icons" aria-label="Product highlights">
              <div>
                <span class="detail-highlight-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 4C11 4 6 8 5 16c5 1 11-2 14-12Z"/><path d="M5 16c2-3 5-5 9-7"/></svg></span>
                <span>Custom Width</span>
              </div>
              <div>
                <span class="detail-highlight-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><circle cx="9" cy="8" r="1.5"/><circle cx="15" cy="10" r="1.5"/><circle cx="10" cy="15" r="1.5"/><circle cx="16" cy="16" r="1.5"/></svg></span>
                <span>Color Matching</span>
              </div>
              <div>
                <span class="detail-highlight-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8c3 2 5 2 8 0s5-2 8 0"/><path d="M4 12c3 2 5 2 8 0s5-2 8 0"/><path d="M4 16c3 2 5 2 8 0s5-2 8 0"/></svg></span>
                <span>Stretch To Spec</span>
              </div>
            </div>
            <div class="tag-row">${product.tags.map(tag => `<span>${escapeHtml(formatTag(tag))}</span>`).join('')}</div>

            <div class="custom-summary">
              <h3>Customize Your Elastic</h3>
              <div class="custom-summary-grid">
                <span><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h4"/></svg>Custom Logo</span>
                <span><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="9" cy="9" r="1.5"/><circle cx="15" cy="9" r="1.5"/><circle cx="9" cy="15" r="1.5"/><circle cx="15" cy="15" r="1.5"/></svg>Custom Color</span>
                <span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h16M4 6h8M4 18h12"/></svg>Custom Width</span>
                <span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7l8-4 8 4-8 4-8-4z"/><path d="M4 12l8 4 8-4"/><path d="M4 17l8 4 8-4"/></svg>Custom Packing</span>
              </div>
              <a href="${escapeHtml(quoteUrl)}" class="btn btn-primary">Request Quote</a>
            </div>

            <div class="quick-contact">
              <a href="mailto:${escapeHtml(CONTACT_INFO.email)}" class="quick-contact-card">
                <span class="quick-contact-icon email"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg></span>
                <span class="quick-contact-text"><strong>Email</strong><span>${escapeHtml(CONTACT_INFO.email)}</span></span>
              </a>
              <a href="${escapeHtml(CONTACT_INFO.sales.whatsappUrl)}" target="_blank" rel="noopener" class="quick-contact-card">
                <span class="quick-contact-icon chat"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg></span>
                <span class="quick-contact-text"><strong>Global WhatsApp</strong><span>${escapeHtml(CONTACT_INFO.sales.whatsapp)}</span></span>
              </a>
              <a href="contact.html" class="quick-contact-card">
                <span class="quick-contact-icon chat"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg></span>
                <span class="quick-contact-text"><strong>WeChat</strong><span>${escapeHtml(CONTACT_INFO.sales.wechat)}</span></span>
              </a>
            </div>
          </aside>

          <section class="detail-main-column" aria-label="Product details">
            <div class="product-gallery-card">
              <div class="image-note"><strong data-gallery-caption>${escapeHtml(gallery[0].label)}</strong><span>Click thumbnails to view available product angles.</span></div>
              <div class="product-main-image"><img class="${gallery[0].rotate ? 'is-rotated' : ''}" src="${escapeHtml(gallery[0].src)}" alt="${escapeHtml(gallery[0].alt)}"></div>
            </div>
            <div class="product-info-table">
              <div class="product-info-head">
                <h2>Product Details</h2>
                <p>Buyer-focused product features and fabric parameters for quotation review.</p>
              </div>
              ${productFeatures.length ? `<section class="product-detail-block" aria-labelledby="product-features-title">
                <h3 id="product-features-title">Features</h3>
                <ul class="product-feature-list">
                  ${productFeatures.map(feature => `<li><span class="feature-check" aria-hidden="true"></span>${escapeHtml(feature)}</li>`).join('')}
                </ul>
              </section>` : ''}
              <section class="product-detail-block product-spec-block" aria-labelledby="product-specifications-title">
                <h3 id="product-specifications-title">Specifications</h3>
                <table class="product-spec-table" aria-label="Product specifications">
                  <tbody>
                    ${displaySpecificationRows.map(spec => `<tr><th scope="row">${escapeHtml(spec.label)}</th><td>${escapeHtml(spec.value)}</td></tr>`).join('')}
                  </tbody>
                </table>
              </section>
            </div>
          </section>

          <aside class="detail-thumbs" aria-label="Product image gallery">
            <p>Gallery</p>
            <div class="product-thumbs">
              ${Array.from(galleryGroups.entries()).map(([group, images]) => `
                <div class="product-thumb-section">
                  <span class="product-thumb-group">${escapeHtml(group)}</span>
                  ${images.map(image => `
                    <button class="${image.index === 0 ? 'active' : ''}" data-gallery-src="${escapeHtml(image.src)}" data-gallery-alt="${escapeHtml(image.alt)}" data-gallery-label="${escapeHtml(image.label)}" data-gallery-rotate="${image.rotate ? 'true' : 'false'}" aria-label="View ${escapeHtml(image.label)}">
                      <span class="product-thumb-index">${image.index + 1}</span>
                      <span class="product-thumb-media">
                        <img class="${image.rotate ? 'is-rotated' : ''}" src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}">
                      </span>
                      <span class="product-thumb-name">${escapeHtml(image.label)}</span>
                    </button>
                  `).join('')}
                </div>
              `).join('')}
            </div>
          </aside>
        </div>
      </div>
    </section>

    <section class="cta-banner" style="background-image: url('${escapeHtml(product.image)}');">
      <div class="hero-overlay"></div>
      <div class="container cta-banner-content">
        <h2>Need ${escapeHtml(product.name)} With Your Brand Details?</h2>
        <p>Send width, color, logo artwork, target quantity, and garment application for a faster quotation.</p>
        <a href="${escapeHtml(quoteUrl)}" class="btn btn-white">Start Inquiry</a>
      </div>
    </section>
  `;

  const mainImage = page.querySelector('.detail-main-column .product-main-image img');
  const syncMainImage = () => syncProductMainImageLayout(mainImage);
  mainImage.addEventListener('load', syncMainImage);
  syncMainImage();
  if ('ResizeObserver' in window) {
    const galleryResizeObserver = new ResizeObserver(syncMainImage);
    galleryResizeObserver.observe(mainImage.parentElement);
  }

  page.querySelectorAll('[data-gallery-src]').forEach(button => {
    button.addEventListener('click', () => {
      page.querySelectorAll('[data-gallery-src]').forEach(item => item.classList.remove('active'));
      button.classList.add('active');
      const caption = page.querySelector('[data-gallery-caption]');
      mainImage.src = button.dataset.gallerySrc;
      mainImage.alt = button.dataset.galleryAlt;
      mainImage.classList.toggle('is-rotated', button.dataset.galleryRotate === 'true');
      if (caption) caption.textContent = button.dataset.galleryLabel;
    });
  });
}

function applyContactQueryContext(contactForm) {
  const params = new URLSearchParams(window.location.search);
  const productName = params.get('productName')?.trim() || '';
  const itemNo = params.get('itemNo')?.trim() || '';
  const productCategory = params.get('category')?.trim() || '';
  const productSelect = contactForm.elements.product;
  const productNameField = contactForm.elements.productName;
  const itemNoField = contactForm.elements.itemNo;

  if (productSelect && productCategory && Array.from(productSelect.options).some(option => option.value === productCategory)) {
    productSelect.value = productCategory;
  }
  if (productNameField) productNameField.value = productName;
  if (itemNoField) itemNoField.value = itemNo;

  const reference = contactForm.querySelector('[data-product-reference]');
  if (!reference || !productName) return;
  reference.hidden = false;
  const name = reference.querySelector('[data-product-reference-name]');
  const item = reference.querySelector('[data-product-reference-item]');
  if (name) name.textContent = productName;
  if (item) item.textContent = itemNo ? `Item No. ${itemNo}` : 'Product detail page inquiry';
}

function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  const submitButton = contactForm.querySelector('[data-contact-submit]');
  const status = contactForm.querySelector('[data-contact-status]');
  applyContactQueryContext(contactForm);

  contactForm.addEventListener('submit', async event => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(contactForm).entries());
    payload.sourceUrl = window.location.href;

    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    status.textContent = 'Saving your inquiry securely...';
    status.dataset.tone = 'neutral';

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.ok === false) {
        throw new Error(data.error || 'Unable to send your inquiry. Please try again.');
      }

      const inquiryId = data.inquiry && data.inquiry.id;
      status.textContent = inquiryId
        ? `Thank you. Your inquiry ${inquiryId} has been saved. Huagui will contact you soon.`
        : 'Thank you. Your inquiry has been received.';
      status.dataset.tone = 'success';
      contactForm.reset();
      applyContactQueryContext(contactForm);
    } catch (error) {
      status.textContent = error.message || 'Unable to send your inquiry. Please try again.';
      status.dataset.tone = 'error';
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Send Inquiry';
    }
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  injectFavicons();
  injectHeader();
  injectFooter();
  initContactForm();
  await loadSiteProducts();

  setTimeout(() => {
    initSlider();
    initMobileMenu();
    initNavbarScroll();
    renderProductCards('featuredProducts', featuredProducts);
    initProductsPage();
    initProductDetailPage();
    renderGlobalContactInfo();
  }, 0);
});
