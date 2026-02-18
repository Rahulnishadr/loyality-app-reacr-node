import { shopifyRequest } from './shopifyApi.js';

const RECURRING_PLAN_NAME = 'Default Plan';
const RECURRING_PLAN_PRICE = '5.00';
const RECURRING_PLAN_TEST = true;

/**
 * Create a recurring subscription (test mode) and return confirmation URL.
 * Merchant must be sent to this URL to approve the charge.
 */
export async function createRecurringSubscription(shop, returnUrl, trialDays = 0) {
  const body = {
    recurring_application_charge: {
      name: RECURRING_PLAN_NAME,
      price: RECURRING_PLAN_PRICE,
      return_url: returnUrl,
      test: RECURRING_PLAN_TEST,
      trial_days: trialDays,
    },
  };
  const data = await shopifyRequest(shop, '/recurring_application_charges.json', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  const charge = data.recurring_application_charge;
  return {
    confirmationUrl: charge.confirmation_url,
    chargeId: charge.id,
  };
}

/**
 * Activate a charge after merchant has approved it.
 */
export async function activateRecurringCharge(shop, chargeId) {
  await shopifyRequest(shop, `/recurring_application_charges/${chargeId}/activate.json`, {
    method: 'POST',
    body: JSON.stringify({}),
  });
}

/**
 * Check if shop has an active recurring charge.
 */
export async function getActiveRecurringCharge(shop) {
  const data = await shopifyRequest(shop, '/recurring_application_charges.json?status=active');
  const charges = data.recurring_application_charges || [];
  return charges[0] || null;
}
