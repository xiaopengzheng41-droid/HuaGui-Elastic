(() => {
  const CONSENT_KEY = 'huagui_measurement_consent_v2';
  const LEGACY_ANALYTICS_CONSENT_KEY = 'huagui_analytics_consent_v1';
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
    'cta_placement',
    'event_id'
  ]);
  const META_EVENT_MAP = Object.freeze({
    generate_lead: 'Lead',
    view_product: 'ViewContent'
  });
  const COPY = {
    en: {
      title: 'Choose your measurement preferences',
      body: 'You can allow anonymous analytics and separately allow Meta advertising measurement. Essential website and inquiry functions always remain available.',
      analyticsTitle: 'Analytics',
      analyticsBody: 'Google Analytics measures anonymous page visits and inquiry actions.',
      marketingTitle: 'Marketing measurement',
      marketingBody: 'Meta Pixel measures advertising visits and inquiry conversions. Server events are sent only after a consented inquiry is saved.',
      save: 'Save choices',
      acceptAll: 'Accept all',
      decline: 'Reject non-essential',
      privacy: 'Privacy Policy',
      preferences: 'Measurement preferences'
    },
    es: {
      title: 'Elija sus preferencias de medición',
      body: 'Puede permitir analíticas anónimas y, por separado, la medición publicitaria de Meta. Las funciones esenciales del sitio y las consultas siempre permanecen disponibles.',
      analyticsTitle: 'Analíticas',
      analyticsBody: 'Google Analytics mide visitas anónimas y acciones de consulta.',
      marketingTitle: 'Medición de marketing',
      marketingBody: 'Meta Pixel mide visitas publicitarias y conversiones de consultas. Los eventos del servidor solo se envían tras guardar una consulta con consentimiento.',
      save: 'Guardar opciones',
      acceptAll: 'Aceptar todo',
      decline: 'Rechazar lo no esencial',
      privacy: 'Política de privacidad',
      preferences: 'Preferencias de medición'
    },
    'pt-br': {
      title: 'Escolha suas preferências de medição',
      body: 'Você pode permitir análises anônimas e, separadamente, a medição de publicidade da Meta. As funções essenciais do site e das consultas permanecem disponíveis.',
      analyticsTitle: 'Análises',
      analyticsBody: 'O Google Analytics mede visitas anônimas e ações de consulta.',
      marketingTitle: 'Medição de marketing',
      marketingBody: 'O Meta Pixel mede visitas de anúncios e conversões de consultas. Eventos do servidor só são enviados após salvar uma consulta consentida.',
      save: 'Salvar escolhas',
      acceptAll: 'Aceitar tudo',
      decline: 'Rejeitar não essenciais',
      privacy: 'Política de privacidade',
      preferences: 'Preferências de medição'
    },
    ru: {
      title: 'Выберите настройки измерения',
      body: 'Вы можете разрешить обезличенную аналитику и отдельно — рекламные измерения Meta. Основные функции сайта и отправки запросов всегда доступны.',
      analyticsTitle: 'Аналитика',
      analyticsBody: 'Google Analytics измеряет обезличенные посещения и действия с запросами.',
      marketingTitle: 'Маркетинговые измерения',
      marketingBody: 'Meta Pixel измеряет рекламные посещения и конверсии запросов. Серверные события отправляются только после сохранения запроса с согласием.',
      save: 'Сохранить выбор',
      acceptAll: 'Принять всё',
      decline: 'Отклонить необязательное',
      privacy: 'Политика конфиденциальности',
      preferences: 'Настройки измерения'
    },
    ar: {
      title: 'اختر تفضيلات القياس',
      body: 'يمكنك السماح بالتحليلات المجهولة وبشكل منفصل بقياس إعلانات Meta. تظل وظائف الموقع والاستفسارات الأساسية متاحة دائمًا.',
      analyticsTitle: 'التحليلات',
      analyticsBody: 'يقيس Google Analytics زيارات الصفحات وإجراءات الاستفسار بصورة مجهولة.',
      marketingTitle: 'قياس التسويق',
      marketingBody: 'يقيس Meta Pixel زيارات الإعلانات وتحويلات الاستفسارات. لا تُرسل أحداث الخادم إلا بعد حفظ استفسار تمت الموافقة عليه.',
      save: 'حفظ الاختيارات',
      acceptAll: 'قبول الكل',
      decline: 'رفض غير الضروري',
      privacy: 'سياسة الخصوصية',
      preferences: 'تفضيلات القياس'
    }
  };

  let measurementId = '';
  let pixelId = '';
  let analyticsEnabled = false;
  let metaEnabled = false;
  let analyticsEventQueue = [];
  let metaEventQueue = [];

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

  function dispatchAnalyticsEvent(name, params) {
    if (!analyticsEnabled || typeof window.gtag !== 'function') return;
    window.gtag('event', name, cleanEventParams(params));
  }

  function metaEventParams(name, params = {}) {
    const clean = cleanEventParams(params);
    const output = {};
    if (['mens', 'womens', 'lingerie', 'activewear', 'binding', 'other'].includes(clean.category)) {
      output.content_category = clean.category;
    }
    if (name === 'view_product' && /^[A-Za-z0-9_-]{1,100}$/.test(clean.item_no || '')) {
      output.content_ids = [clean.item_no];
    }
    if (name === 'view_product' && /^[A-Za-z0-9_-]{1,100}$/.test(clean.product_slug || '')) {
      output.content_name = clean.product_slug;
    }
    return output;
  }

  function dispatchMetaEvent(name, params) {
    const metaName = META_EVENT_MAP[name];
    if (!metaName || !metaEnabled || typeof window.fbq !== 'function') return;
    const eventId = cleanEventParams(params).event_id;
    const options = eventId ? { eventID: eventId } : undefined;
    window.fbq('track', metaName, metaEventParams(name, params), options);
  }

  function track(name, params = {}) {
    if (!ALLOWED_EVENTS.has(name)) return false;
    const cleaned = cleanEventParams(params);
    let dispatched = false;
    if (analyticsConsent() === 'granted') {
      if (analyticsEnabled) {
        dispatchAnalyticsEvent(name, cleaned);
        dispatched = true;
      } else {
        analyticsEventQueue.push([name, cleaned]);
        if (analyticsEventQueue.length > 20) analyticsEventQueue = analyticsEventQueue.slice(-20);
      }
    }
    if (marketingConsent() === 'granted' && META_EVENT_MAP[name]) {
      if (metaEnabled) {
        dispatchMetaEvent(name, cleaned);
        dispatched = true;
      } else {
        metaEventQueue.push([name, cleaned]);
        if (metaEventQueue.length > 20) metaEventQueue = metaEventQueue.slice(-20);
      }
    }
    return dispatched;
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

  function consentPreferences() {
    const stored = safeStorage('localStorage', 'getItem', CONSENT_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return {
          analytics: ['granted', 'denied'].includes(parsed.analytics) ? parsed.analytics : '',
          marketing: ['granted', 'denied'].includes(parsed.marketing) ? parsed.marketing : ''
        };
      } catch { /* fall through to the legacy analytics choice */ }
    }
    const legacy = safeStorage('localStorage', 'getItem', LEGACY_ANALYTICS_CONSENT_KEY);
    return {
      analytics: ['granted', 'denied'].includes(legacy) ? legacy : '',
      marketing: ''
    };
  }

  function analyticsConsent() {
    return consentPreferences().analytics;
  }

  function marketingConsent() {
    return consentPreferences().marketing;
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
    analyticsEventQueue = [];
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
    const queued = analyticsEventQueue;
    analyticsEventQueue = [];
    queued.forEach(([name, params]) => dispatchAnalyticsEvent(name, params));
    if (!document.querySelector(`script[data-huagui-ga4="${measurementId}"]`)) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
      script.dataset.huaguiGa4 = measurementId;
      document.head.appendChild(script);
    }
  }

  function readCookie(name) {
    const prefix = `${name}=`;
    const value = document.cookie.split(';').map(part => part.trim()).find(part => part.startsWith(prefix));
    if (!value) return '';
    try {
      return decodeURIComponent(value.slice(prefix.length)).slice(0, 255);
    } catch {
      return '';
    }
  }

  function removeMetaCookies() {
    ['_fbp', '_fbc'].forEach(name => {
      document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
      document.cookie = `${name}=; Max-Age=0; Path=/; Domain=.huaguielastic.com; SameSite=Lax`;
    });
  }

  function disableMeta() {
    if (typeof window.fbq === 'function') window.fbq('consent', 'revoke');
    metaEnabled = false;
    metaEventQueue = [];
    removeMetaCookies();
  }

  function enableMeta() {
    if (!pixelId || metaEnabled) return;
    if (typeof window.fbq !== 'function') {
      const fbq = function fbq() {
        if (fbq.callMethod) fbq.callMethod.apply(fbq, arguments);
        else fbq.queue.push(arguments);
      };
      fbq.push = fbq;
      fbq.loaded = true;
      fbq.version = '2.0';
      fbq.queue = [];
      window.fbq = fbq;
      window._fbq = fbq;
    }
    window.fbq('consent', 'grant');
    window.fbq('init', pixelId);
    window.fbq('track', 'PageView');
    metaEnabled = true;
    const queued = metaEventQueue;
    metaEventQueue = [];
    queued.forEach(([name, params]) => dispatchMetaEvent(name, params));
    if (!document.querySelector(`script[data-huagui-meta-pixel="${pixelId}"]`)) {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      script.dataset.huaguiMetaPixel = pixelId;
      document.head.appendChild(script);
    }
  }

  function removeConsentPanel() {
    document.querySelector('[data-analytics-consent]')?.remove();
  }

  function saveConsent(preferences) {
    const normalized = {
      analytics: measurementId
        ? (preferences.analytics === 'granted' ? 'granted' : 'denied')
        : '',
      marketing: pixelId
        ? (preferences.marketing === 'granted' ? 'granted' : 'denied')
        : ''
    };
    safeStorage('localStorage', 'setItem', CONSENT_KEY, JSON.stringify(normalized));
    safeStorage('localStorage', 'removeItem', LEGACY_ANALYTICS_CONSENT_KEY);
    removeConsentPanel();
    if (normalized.analytics === 'granted') enableAnalytics();
    else disableAnalytics();
    if (normalized.marketing === 'granted') enableMeta();
    else disableMeta();
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
    const preferences = consentPreferences();
    const analyticsChoice = measurementId ? `
      <label class="measurement-consent-choice">
        <input type="checkbox" data-consent-analytics>
        <span><strong>${text.analyticsTitle}</strong><small>${text.analyticsBody}</small></span>
      </label>` : '';
    const marketingChoice = pixelId ? `
      <label class="measurement-consent-choice">
        <input type="checkbox" data-consent-marketing>
        <span><strong>${text.marketingTitle}</strong><small>${text.marketingBody}</small></span>
      </label>` : '';
    panel.innerHTML = `
      <div class="analytics-consent-copy">
        <strong>${text.title}</strong>
        <p>${text.body} <a href="${prefix}/privacy.html">${text.privacy}</a></p>
        <div class="measurement-consent-choices">${analyticsChoice}${marketingChoice}</div>
      </div>
      <div class="analytics-consent-actions">
        <button type="button" class="btn btn-primary" data-consent-save>${text.save}</button>
        <button type="button" class="btn btn-outline" data-consent-accept-all>${text.acceptAll}</button>
        <button type="button" class="btn btn-outline" data-analytics-decline>${text.decline}</button>
      </div>`;
    const analyticsInput = panel.querySelector('[data-consent-analytics]');
    const marketingInput = panel.querySelector('[data-consent-marketing]');
    if (analyticsInput) analyticsInput.checked = preferences.analytics === 'granted';
    if (marketingInput) marketingInput.checked = preferences.marketing === 'granted';
    panel.querySelector('[data-consent-save]').addEventListener('click', () => saveConsent({
      analytics: analyticsInput?.checked ? 'granted' : 'denied',
      marketing: marketingInput?.checked ? 'granted' : 'denied'
    }));
    panel.querySelector('[data-consent-accept-all]').addEventListener('click', () => saveConsent({
      analytics: measurementId ? 'granted' : 'denied',
      marketing: pixelId ? 'granted' : 'denied'
    }));
    panel.querySelector('[data-analytics-decline]').addEventListener('click', () => saveConsent({
      analytics: 'denied',
      marketing: 'denied'
    }));
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
      pixelId = /^\d{8,30}$/.test(config?.meta?.pixelId || '')
        ? config.meta.pixelId
        : '';
    } catch {
      measurementId = '';
      pixelId = '';
    }
    if (!measurementId && !pixelId) {
      analyticsEventQueue = [];
      metaEventQueue = [];
      return;
    }
    addPreferencesControl();
    const preferences = consentPreferences();
    if (preferences.analytics === 'granted') enableAnalytics();
    else if (preferences.analytics === 'denied') disableAnalytics();
    if (preferences.marketing === 'granted') enableMeta();
    else if (preferences.marketing === 'denied') disableMeta();
    const needsAnalyticsChoice = Boolean(measurementId) && !preferences.analytics;
    const needsMarketingChoice = Boolean(pixelId) && !preferences.marketing;
    if (needsAnalyticsChoice || needsMarketingChoice) renderConsentPanel();
  }

  function getMetaContext() {
    if (marketingConsent() !== 'granted') {
      return {
        marketingConsent: 'denied',
        metaFbp: '',
        metaFbc: '',
        metaEventSourceUrl: ''
      };
    }
    const fallbackUrl = `${location.origin}${location.pathname}${location.search || ''}`;
    return {
      marketingConsent: 'granted',
      metaFbp: readCookie('_fbp'),
      metaFbc: readCookie('_fbc'),
      metaEventSourceUrl: String(location.href || fallbackUrl).slice(0, 500)
    };
  }

  window.HUAGUI_ANALYTICS = {
    getAttribution: () => ({ ...attribution }),
    getConsent: () => ({ ...consentPreferences() }),
    getMetaContext,
    init,
    track
  };

  document.addEventListener('click', trackLinkClick);
  document.addEventListener('DOMContentLoaded', init);
})();
