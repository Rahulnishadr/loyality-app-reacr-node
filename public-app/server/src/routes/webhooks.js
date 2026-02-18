import { Router } from 'express';
import crypto from 'crypto';
import { Shop, Customer, LoyaltyTransaction } from '../db/index.js';
import { config } from '../config/index.js';

const router = Router();

function verifyWebhookHmac(body, hmacHeader) {
  if (!hmacHeader) return false;
  // HMAC must be computed over the raw request body string – never an object
  let raw;
  if (typeof body === 'string') {
    raw = body;
  } else if (Buffer.isBuffer(body)) {
    raw = body.toString('utf8');
  } else {
    return false; // body was parsed as JSON (wrong middleware order) – cannot verify
  }
  if (!raw) return false;
  const hash = crypto
    .createHmac('sha256', config.shopify.apiSecret)
    .update(raw, 'utf8')
    .digest('base64');
  return hash === hmacHeader;
}

/**
 *
 * POST /webhooks/app/uninstalled
 * Delete shop and all related data from DB.
 */
router.post('/app/uninstalled', async (req, res) => {
  const hmac = req.headers['x-shopify-hmac-sha256'];
  const raw = req.rawBody ? (Buffer.isBuffer(req.rawBody) ? req.rawBody.toString('utf8') : req.rawBody) : req.body;
  if (!raw || !hmac || !verifyWebhookHmac(raw, hmac)) {
    return res.status(401).send('Unauthorized');
  }
  try {
    const payload = typeof raw === 'string' ? JSON.parse(raw) : raw;
    const shopDomain = payload.myshopify_domain || payload.domain;
    if (!shopDomain) {
      return res.status(400).send('Missing shop domain');
    }
    const shop = await Shop.findOne({ where: { shopDomain } });
    if (shop) {
      await shop.destroy();
    }
    res.status(200).send('OK');
  } catch (err) {
    console.error('app/uninstalled webhook error:', err);
    res.status(500).send('Error');
  }
});

/**
 * GDPR: customers/data_request
 * Return any data you store about the customer.
 */
router.post('/customers/data_request', (req, res) => {
  const hmac = req.headers['x-shopify-hmac-sha256'];
  const raw = req.rawBody ? (Buffer.isBuffer(req.rawBody) ? req.rawBody.toString('utf8') : req.rawBody) : req.body;
  if (!raw || !hmac || !verifyWebhookHmac(raw, hmac)) {
    return res.status(401).send('Unauthorized');
  }
  // TODO: Look up customer by shop + customer id and return their data (notes, points, transactions)
  res.status(200).send('OK');
});

/**
 * GDPR: customers/redact
 * Delete or anonymize customer data.
 */
router.post('/customers/redact', async (req, res) => {
  const hmac = req.headers['x-shopify-hmac-sha256'];
  const raw = req.rawBody ? (Buffer.isBuffer(req.rawBody) ? req.rawBody.toString('utf8') : req.rawBody) : req.body;
  if (!raw || !hmac || !verifyWebhookHmac(raw, hmac)) {
    return res.status(401).send('Unauthorized');
  }
  try {
    const payload = typeof raw === 'string' ? JSON.parse(raw) : raw;
    const { shop_domain, customer } = payload;
    if (shop_domain && customer && customer.id) {
      const shop = await Shop.findOne({ where: { shopDomain: shop_domain } });
      if (shop) {
        await Customer.destroy({ where: { shopId: shop.id, shopifyCustomerId: customer.id } });
      }
    }
    res.status(200).send('OK');
  } catch (err) {
    console.error('customers/redact webhook error:', err);
    res.status(500).send('Error');
  }
});

/**
 * GDPR: shop/redact
 * Delete shop data (similar to uninstall).
 */
router.post('/shop/redact', async (req, res) => {
  const hmac = req.headers['x-shopify-hmac-sha256'];
  const raw = req.rawBody ? (Buffer.isBuffer(req.rawBody) ? req.rawBody.toString('utf8') : req.rawBody) : req.body;
  if (!raw || !hmac || !verifyWebhookHmac(raw, hmac)) {
    return res.status(401).send('Unauthorized');
  }
  try {
    const payload = typeof raw === 'string' ? JSON.parse(raw) : raw;
    const shopDomain = payload.myshopify_domain || payload.shop_domain;
    if (shopDomain) {
      const shop = await Shop.findOne({ where: { shopDomain } });
      if (shop) await shop.destroy();
    }
    res.status(200).send('OK');
  } catch (err) {
    console.error('shop/redact webhook error:', err);
    res.status(500).send('Error');
  }
});

export default router;
