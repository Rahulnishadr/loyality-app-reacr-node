import { Router } from 'express';
import { validateSession } from '../middleware/session.js';
import * as billingService from '../services/billing.js';
import { config } from '../config/index.js';

const router = Router();

/**
 * GET /api/billing/check
 * Returns { hasActivePlan: boolean, confirmationUrl?: string }
 */
router.get('/check', validateSession, async (req, res) => {
  try {
    const active = await billingService.getActiveRecurringCharge(req.shop);
    if (active) {
      return res.json({ hasActivePlan: true });
    }
    const returnUrl = `${config.appUrl}/api/billing/return?shop=${req.shopDomain}`;
    const { confirmationUrl } = await billingService.createRecurringSubscription(req.shop, returnUrl);
    res.json({ hasActivePlan: false, confirmationUrl });
  } catch (err) {
    console.error('Billing check error:', err);
    res.status(500).json({ error: 'Billing error' });
  }
});

/**
 * GET /api/billing/return
 * Redirect after merchant approves charge; activate the charge.
 */
router.get('/return', validateSession, async (req, res) => {
  const chargeId = req.query.charge_id;
  if (!chargeId) {
    return res.redirect(`${config.frontendUrl}?shop=${req.shopDomain}&billing=missing`);
  }
  try {
    await billingService.activateRecurringCharge(req.shop, chargeId);
    res.redirect(`${config.frontendUrl}?shop=${req.shopDomain}&host=${req.query.host || ''}`);
  } catch (err) {
    console.error('Billing activate error:', err);
    res.redirect(`${config.frontendUrl}?shop=${req.shopDomain}&billing=error`);
  }
});

export default router;
