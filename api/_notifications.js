function cleanHeaderValue(value, maxLength = 320) {
  return String(value || '').replace(/[\r\n]+/g, ' ').trim().slice(0, maxLength);
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function fieldRows(inquiry) {
  return [
    ['Inquiry ID', inquiry.id],
    ['Submitted', inquiry.createdAt],
    ['Name', inquiry.name],
    ['Company', inquiry.company],
    ['Country / Region', inquiry.country],
    ['Business Role', inquiry.businessRole],
    ['Email', inquiry.email],
    ['Phone / WhatsApp', inquiry.phone],
    ['Product Category', inquiry.product],
    ['Product Reference', inquiry.productName],
    ['Item No.', inquiry.itemNo],
    ['Target Quantity', inquiry.quantity],
    ['Trade Term', inquiry.tradeTerm],
    ['Quote Currency', inquiry.quoteCurrency],
    ['Source Page', inquiry.sourceUrl],
    ['First Landing Page', inquiry.landingPath],
    ['Referrer Host', inquiry.referrerHost],
    ['UTM Source', inquiry.utmSource],
    ['UTM Medium', inquiry.utmMedium],
    ['UTM Campaign', inquiry.utmCampaign],
    ['UTM Content', inquiry.utmContent],
    ['UTM Term', inquiry.utmTerm]
  ].filter(([, value]) => String(value || '').trim());
}

function buildInquiryNotification(inquiry) {
  const rows = fieldRows(inquiry);
  const subject = cleanHeaderValue(`New Huagui website inquiry ${inquiry.id} - ${inquiry.company || inquiry.name}`);
  const text = [
    subject,
    '',
    ...rows.map(([label, value]) => `${label}: ${String(value)}`),
    '',
    'Customer Message:',
    String(inquiry.message || '')
  ].join('\n');
  const htmlRows = rows.map(([label, value]) => (
    `<tr><th align="left" style="padding:6px 12px 6px 0;vertical-align:top">${escapeHtml(label)}</th>` +
    `<td style="padding:6px 0">${escapeHtml(value)}</td></tr>`
  )).join('');
  const html = `<!doctype html><html><body style="font-family:Arial,sans-serif;color:#2f2d2c">` +
    `<h1 style="font-size:20px;color:#880830">${escapeHtml(subject)}</h1>` +
    `<table style="border-collapse:collapse">${htmlRows}</table>` +
    `<h2 style="font-size:16px;margin-top:24px">Customer Message</h2>` +
    `<p style="white-space:pre-wrap">${escapeHtml(inquiry.message || '')}</p>` +
    `</body></html>`;
  return { subject, text, html };
}

async function notifyNewInquiry(inquiry, { fetchImpl = global.fetch, timeoutMs = 5000 } = {}) {
  const apiKey = String(process.env.RESEND_API_KEY || '').trim();
  const to = cleanHeaderValue(process.env.INQUIRY_NOTIFICATION_TO);
  const from = cleanHeaderValue(process.env.INQUIRY_NOTIFICATION_FROM);
  if (!apiKey || !to || !from) {
    return { sent: false, reason: 'not-configured' };
  }

  const message = buildInquiryNotification(inquiry);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), Math.max(1, timeoutMs));
  let response;
  try {
    response = await fetchImpl('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `inquiry/${inquiry.id}`
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: inquiry.email,
        subject: message.subject,
        text: message.text,
        html: message.html
      }),
      signal: controller.signal
    });
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    const error = new Error(`Inquiry notification provider returned HTTP ${response.status}.`);
    error.statusCode = response.status;
    throw error;
  }
  const result = await response.json().catch(() => ({}));
  return { sent: true, id: result.id || '' };
}

module.exports = {
  buildInquiryNotification,
  escapeHtml,
  notifyNewInquiry
};
