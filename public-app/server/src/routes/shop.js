import { Router } from 'express';
import { validateSession } from '../middleware/session.js';

const router = Router();

/**
 * GET /api/shop
 * Returns the current shop's stored details (saved on install). No access_token.
 */
router.get('/', validateSession, (req, res) => {
  const shop = req.shop;
  if (!shop) {
    return res.status(404).json({ error: 'Shop not found' });
  }
  res.json({
    id: shop.id,
    shopDomain: shop.shopDomain,
    shopName: shop.shopName,
    email: shop.email,
    currency: shop.currency,
    planDisplayName: shop.planDisplayName,
    timezone: shop.timezone,
    phone: shop.phone,
    primaryLocale: shop.primaryLocale,
    countryCode: shop.countryCode,
    countryName: shop.countryName,
    scope: shop.scope,
    installDate: shop.installDate,
    createdAt: shop.createdAt,
    updatedAt: shop.updatedAt,
  });
});

export default router;
