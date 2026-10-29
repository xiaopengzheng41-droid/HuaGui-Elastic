const {
  claimInquiryMetaDelivery,
  completeInquiryMetaDelivery,
  listInquiries,
  storageMode,
  updateInquiryStatus
} = require('../_inquiries');
const { parseJsonBody, requireAdmin, sendError, sendJson } = require('../_cms');
const { sendMetaFunnelEvent } = require('../_meta');

const META_EVENT_BY_STATUS = Object.freeze({
  qualified: 'QualifiedLead',
  quoted: 'QuoteSent',
  sample_sent: 'SampleSent',
  won: 'OrderWon'
});

function metaEventNameForStatus(status) {
  return META_EVENT_BY_STATUS[String(status || '').trim()] || '';
}

function metaDeliveryResponse(eventName, delivery, overrides = {}) {
  const status = delivery?.status || 'not-applicable';
  return {
    eventName: eventName || '',
    status,
    sent: status === 'sent',
    retryable: status === 'failed',
    reason: delivery?.reason || '',
    attempts: Number(delivery?.attempts || 0),
    ...overrides
  };
}

function metaDeliveryEventTime(delivery, fallback) {
  const timestamp = new Date(delivery?.createdAt || fallback || Date.now());
  return Number.isNaN(timestamp.getTime()) ? new Date() : timestamp;
}

async function deliverMetaStageEvent(
  inquiry,
  eventName,
  {
    claimDelivery = claimInquiryMetaDelivery,
    completeDelivery = completeInquiryMetaDelivery,
    sendEvent = sendMetaFunnelEvent
  } = {}
) {
  if (!eventName) {
    return {
      inquiry,
      meta: metaDeliveryResponse('', null)
    };
  }

  const claim = await claimDelivery(inquiry.id, eventName);
  if (!claim.claimed) {
    return {
      inquiry: claim.inquiry,
      meta: metaDeliveryResponse(eventName, claim.delivery, {
        reason: claim.delivery?.status === 'sending' ? 'delivery-in-progress' : claim.delivery?.reason || ''
      })
    };
  }

  let outcome;
  try {
    const provider = await sendEvent(claim.inquiry, eventName, {
      now: metaDeliveryEventTime(claim.delivery, claim.inquiry.updatedAt)
    });
    if (provider.sent) {
      outcome = {
        status: 'sent',
        eventId: provider.eventId,
        traceId: provider.traceId
      };
    } else if (provider.reason === 'no-marketing-consent') {
      outcome = { status: 'skipped', reason: provider.reason };
    } else {
      outcome = {
        status: 'failed',
        reason: provider.reason || 'provider-did-not-accept',
        error: provider.reason || 'Meta did not accept the event.',
        eventId: provider.eventId
      };
    }
  } catch (metaError) {
    console.error('Meta funnel event failed', {
      inquiryId: claim.inquiry.id,
      status: claim.inquiry.status,
      error: metaError.message
    });
    outcome = {
      status: 'failed',
      reason: 'provider-error',
      error: metaError.message
    };
  }

  const completed = await completeDelivery(
    claim.inquiry.id,
    eventName,
    claim.claimToken,
    outcome
  );
  return {
    inquiry: completed.inquiry,
    meta: metaDeliveryResponse(eventName, completed.delivery, {
      completed: completed.completed
    })
  };
}

module.exports = async function adminInquiriesHandler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!['GET', 'PATCH'].includes(req.method)) {
    res.setHeader('Allow', 'GET, PATCH');
    return sendError(res, 405, 'Method not allowed');
  }
  if (!requireAdmin(req, res)) return;

  try {
    if (req.method === 'GET') {
      const inquiries = await listInquiries();
      return sendJson(res, 200, {
        ok: true,
        inquiries,
        storage: storageMode()
      }, {
        'Cache-Control': 'no-store'
      });
    }

    const body = await parseJsonBody(req, 16 * 1024);
    let inquiry = await updateInquiryStatus(
      String(body.id || ''),
      String(body.status || ''),
      {
        disqualificationReason: body.disqualificationReason,
        metaEventName: metaEventNameForStatus(body.status)
      }
    );
    const metaEventName = metaEventNameForStatus(inquiry.status);
    const eventNames = [
      ...(inquiry.metaDeliveries?.Lead ? ['Lead'] : []),
      ...(metaEventName ? [metaEventName] : [])
    ];
    const metaDeliveries = [];
    for (const eventName of [...new Set(eventNames)]) {
      const delivery = await deliverMetaStageEvent(inquiry, eventName);
      inquiry = delivery.inquiry;
      metaDeliveries.push(delivery.meta);
    }
    const primaryMeta = metaDeliveries.find(item => item.eventName === metaEventName) ||
      metaDeliveries[metaDeliveries.length - 1] ||
      metaDeliveryResponse('', null);
    const meta = {
      ...primaryMeta,
      deliveries: metaDeliveries
    };
    return sendJson(res, 200, {
      ok: true,
      inquiry,
      meta
    }, {
      'Cache-Control': 'no-store'
    });
  } catch (error) {
    const statusCode = error.statusCode || (error instanceof SyntaxError ? 400 : 500);
    return sendError(res, statusCode, error.message || 'Unable to manage inquiries');
  }
};

module.exports.metaEventNameForStatus = metaEventNameForStatus;
module.exports.deliverMetaStageEvent = deliverMetaStageEvent;
module.exports.metaDeliveryResponse = metaDeliveryResponse;
module.exports.metaDeliveryEventTime = metaDeliveryEventTime;
