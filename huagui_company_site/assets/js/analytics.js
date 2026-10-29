(() => {
  const CONSENT_KEY = 'huagui_analytics_consent_v1';
  const ATTRIBUTION_KEY = 'huagui_session_attribution_v1';
  const ALLOWED_EVENTS = new Set([
    'generate_lead',
    'click_whatsapp',
    'click_email',
    'request_quote',
    'view_product'
  ]);
  const ALLOWED_PARAMS = new Set([
    'locale',
    'page_type',
    'product_slug',
    'item_no',
    'category',
    'cta_placement'
  ]);
  const COPY = {
    en: {
      title: 'Help us improve this website',
      body: 'With your permission, we use Google Analytics to understand anonymous page visits and inquiry actions. We never send names, email addresses, phone numbers, companies, or messages to analytics.',
      accept: 'Accept analytics',
      decline: 'Decline',
      privacy: 'Privacy Policy',
      preferences: 'Analytics preferences'
    },
    es: {
      title: 'Ayúdenos a mejorar este sitio web',
      body: 'Con su permiso, usamos Google Analytics para comprender las visitas anónimas a las páginas y las acciones de consulta. Nunca enviamos nombres, correos electrónicos, números de teléfono, empresas ni mensajes a Analytics.',
      accept: 'Aceptar analíticas',
      decline: 'Rechazar',
      privacy: 'Política de privacidad',
      preferences: 'Preferencias de analíticas'
    },
    'pt-br': {
      title: 'Ajude-nos a melhorar este site',
      body: 'Com sua permissão, usamos o Google Analytics para entender visitas anônimas às páginas e ações de consulta. Nunca enviamos nomes, endereços de e-mail, números de telefone, empresas ou mensagens para o Analytics.',
      accept: 'Aceitar análises',
      decline: 'Recusar',
      privacy: 'Política de privacidade',
      preferences: 'Preferências de análise'
    },
    ru: {
      title: 'Помогите нам улучшить сайт',
      body: 'С вашего разрешения мы используем Google Analytics, чтобы анализировать обезличенные посещения страниц и действия, связанные с запросами. Мы никогда не передаем в систему аналитики имена, адреса электронной почты, номера телефонов, названия компаний или сообщения.',
      accept: 'Разрешить аналитику',
      decline: 'Отклонить',
      privacy: 'Политика конфиденциальности',
      preferences: 'Настройки аналитики'
    },
    ar: {
      title: 'ساعدنا على تحسين هذا الموقع',
      body: 'بموافقتك، نستخدم Google Analytics لفهم زيارات الصفحات وإجراءات الاستفسار بصورة مجهولة. لا نرسل مطلقًا الأسماء أو عناوين البريد الإلكتروني أو أرقام الهواتف أو أسماء الشركات أو الرسائل إلى خدمة التحليلات.',
      accept: 'قبول التحليلات',
      decline: 'رفض',
      privacy: 'سياسة الخصوصية',
      preferences: 'تفضيلات التحليلات'
    }
  };

  let measurementId = '';
  let analyticsEnabled = false;
  let eventQueue = [];

  function locale() {
    return window.HUAGUI_I18N?.locale || ({ 'pt-BR': 'pt-br' }[document.documentElement.lang] || document.documentElement.lang || 'en');
  }

  function pageType() {
    const path = location.pathname;
    if (/\/products\/[^/]+$/.test(path) || path.endsWith('/product-detail.html')) return 'product_detail';
    if (path.endsWith('/products.html')) return 'products';
    if (path.endsWith('/contact.html')) return 'contact';
    if (path.endsWith('/privacy.html')) return 'privacy';
    if (path === '/' || /^\/(?:es|pt-br|ru|ar)\/?$/.test(path)) return 'home';
    return path.split('/').filter(Boolean).at(-1)?.replace(/\.html$/, '') || 'other';
  }

  function safeStorage(storageName, action, ...args) {
    try {
      const storage = window[storageName];
      return storage[action](...args);
    } catch {
      return null;
    }
  }

  function cleanAttributionValue(value, maxLength = 200) {
    return String(value || '').trim().slice(0, maxLength);
  }

  function normalizeAttribution(source = {}) {
    return {
      landingPath: cleanAttributionValue(source.landingPath, 500),
      referrerHost: cleanAttributionValue(source.referrerHost, 255),
      utmSource: cleanAttributionValue(source.utmSource),
      utmMedium: cleanAttributionValue(source.utmMedium),
      utmCampaign: cleanAttributionValue(source.utmCampaign),
      utmContent: cleanAttributionValue(source.utmContent),
      utmTerm: cleanAttributionValue(source.utmTerm)
    };
  }

  function captureAttribution() {
    const stored = safeStorage('sessionStorage', 'getItem', ATTRIBUTION_KEY);
    if (stored) {
      try { return normalizeAttribution(JSON.parse(stored)); } catch { /* replace malformed session value */ }
    }
    const params = new URLSearchParams(location.search);
    let referrerHost = '';
    try {
      const referrer = document.referrer ? new URL(document.referrer) : null;
      if (referrer && referrer.origin !== location.origin) referrerHost = referrer.hostname;
    } catch { /* ignore invalid referrer */ }
    const attribution = normalizeAttribution({
      landingPath: cleanAttributionValue(location.pathname, 500),
      referrerHost: cleanAttributionValue(referrerHost, 255),
      utmSource: cleanAttributionValue(params.get('utm_source')),
      utmMedium: cleanAttributionValue(params.get('utm_medium')),
      utmCampaign: cleanAttributionValue(params.get('utm_campaign')),
      utmContent: cleanAttributionValue(params.get('utm_content')),
      utmTerm: cleanAttributionValue(params.get('utm_term'))
    });
    safeStorage('sessionStorage', 'setItem', ATTRIBUTION_KEY, JSON.stringify(attribution));
    return attribution;
  }

  const attribution = captureAttribution();

  function cleanEventParams(params = {}) {
    const output = {
      locale: locale(),
      page_type: pageType()
    };
    Object.entries(params).forEach(([key, value]) => {
      if (!ALLOWED_PARAMS.has(key) || value === undefined || value === null) return;
      output[key] = String(value).trim().slice(0, 100);
    });
    return output;
  }

  function dispatchEvent(name, params) {
    if (!analyticsEnabled || typeof window.gtag !== 'function') return;
    window.gtag('event', name, cleanEventParams(params));
  }

  function track(name, params = {}) {
    if (!ALLOWED_EVENTS.has(name)) return false;
    if (analyticsConsent() !== 'granted') return false;
    if (!analyticsEnabled) {
      eventQueue.push([name, cleanEventParams(params)]);
      if (eventQueue.length > 20) eventQueue = eventQueue.slice(-20);
      return false;
    }
    dispatchEvent(name, params);
    return true;
  }

  function trackLinkClick(event) {
    const anchor = event.target.closest?.('a[href]');
    if (!anchor) return;
    const rawHref = anchor.getAttribute('href') || '';
    const placement = anchor.dataset.analyticsPlacement || (
      anchor.closest('.footer') ? 'footer' :
      anchor.closest('.quick-contact') ? 'product_quick_contact' :
      anchor.classList.contains('btn') ? 'button' : 'link'
    );
    if (/^mailto:/i.test(rawHref)) {
      track('click_email', { cta_placement: placement });
      return;
    }
    if (/https?:\/\/(?:api\.)?wa\.me\//i.test(rawHref)) {
      track('click_whatsapp', { cta_placement: placement });
      return;
    }
    try {
      const url = new URL(rawHref, location.origin);
      const isContact = url.origin === location.origin && url.pathname.endsWith('/contact.html');
      if (isContact && (anchor.classList.contains('btn') || url.searchParams.has('productName'))) {
        track('request_quote', {
          cta_placement: placement,
          item_no: url.searchParams.get('itemNo') || '',
          category: url.searchParams.get('category') || ''
        });
      }
    } catch { /* ignore malformed links */ }
  }

  function analyticsConsent() {
    return safeStorage('localStorage', 'getItem', CONSENT_KEY) || '';
  }

  function removeGoogleAnalyticsCookies() {
    document.cookie.split(';').forEach(part => {
      const name = part.split('=')[0].trim();
      if (!name.startsWith('_ga')) return;
      document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
      document.cookie = `${name}=; Max-Age=0; Path=/; Domain=.huaguielastic.com; SameSite=Lax`;
    });
  }

  function disableAnalytics() {
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied'
      });
    }
    analyticsEnabled = false;
    eventQueue = [];
    removeGoogleAnalyticsCookies();
  }

  function enableAnalytics() {
    if (!measurementId || analyticsEnabled) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
    analyticsEnabled = true;
    const queued = eventQueue;
    eventQueue = [];
    queued.forEach(([name, params]) => dispatchEvent(name, params));
    if (!document.querySelector(`script[data-huagui-ga4="${measurementId}"]`)) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
      script.dataset.huaguiGa4 = measurementId;
      document.head.appendChild(script);
    }
  }

  function removeConsentPanel() {
    document.querySelector('[data-analytics-consent]')?.remove();
  }

  function saveConsent(value) {
    safeStorage('localStorage', 'setItem', CONSENT_KEY, value);
    removeConsentPanel();
    if (value === 'granted') enableAnalytics();
    else disableAnalytics();
  }

  function renderConsentPanel() {
    removeConsentPanel();
    const language = COPY[locale()] ? locale() : 'en';
    const text = COPY[language];
    const prefix = language === 'en' ? '' : `/${language}`;
    const panel = document.createElement('section');
    panel.className = 'analytics-consent';
    panel.dataset.analyticsConsent = '';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-live', 'polite');
    panel.setAttribute('aria-label', text.title);
    panel.innerHTML = `
      <div class="analytics-consent-copy">
        <strong>${text.title}</strong>
        <p>${text.body} <a href="${prefix}/privacy.html">${text.privacy}</a></p>
      </div>
      <div class="analytics-consent-actions">
        <button type="button" class="btn btn-primary" data-analytics-accept>${text.accept}</button>
        <button type="button" class="btn btn-outline" data-analytics-decline>${text.decline}</button>
      </div>`;
    panel.querySelector('[data-analytics-accept]').addEventListener('click', () => saveConsent('granted'));
    panel.querySelector('[data-analytics-decline]').addEventListener('click', () => saveConsent('denied'));
    document.body.appendChild(panel);
  }

  function addPreferencesControl() {
    if (document.querySelector('[data-analytics-preferences]')) return;
    const footer = document.querySelector('.footer-bottom');
    if (!footer) return;
    const language = COPY[locale()] ? locale() : 'en';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'analytics-preferences';
    button.dataset.analyticsPreferences = '';
    button.textContent = COPY[language].preferences;
    button.addEventListener('click', renderConsentPanel);
    footer.appendChild(button);
  }

  async function init() {
    try {
      const response = await fetch('/api/public-config', { headers: { Accept: 'application/json' } });
      const config = await response.json();
      measurementId = /^G-[A-Z0-9]{4,20}$/.test(config?.analytics?.measurementId || '')
        ? config.analytics.measurementId
        : '';
    } catch {
      measurementId = '';
    }
    if (!measurementId) {
      eventQueue = [];
      return;
    }
    addPreferencesControl();
    const consent = analyticsConsent();
    if (consent === 'granted') enableAnalytics();
    else if (consent !== 'denied') renderConsentPanel();
  }

  window.HUAGUI_ANALYTICS = {
    getAttribution: () => ({ ...attribution }),
    init,
    track
  };

  document.addEventListener('click', trackLinkClick);
  document.addEventListener('DOMContentLoaded', init);
})();
