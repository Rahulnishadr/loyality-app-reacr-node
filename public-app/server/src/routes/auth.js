import { Router } from 'express';
import crypto from 'crypto';
import { Shop } from '../db/index.js';
import { config } from '../config/index.js';
import { requireShopQuery } from '../middleware/session.js';
import { sendInstallNotification } from '../services/email.js';

const router = Router();

function getRedirectUri() {
  return `${config.appUrl}/auth/callback`;
}

function buildInstallUrl(shop, state) {
  const scopes = config.shopify.scopes.join(',');
  const redirectUri = getRedirectUri();
  const clientId = config.shopify.apiKey;
  const params = new URLSearchParams({
    client_id: clientId,
    scope: scopes,
    redirect_uri: redirectUri,
    state,
    grant_options: '[]',
  });
  const shopDomain = shop.includes('.myshopify.com') ? shop : `${shop}.myshopify.com`;
  return `https://${shopDomain}/admin/oauth/authorize?${params.toString()}`;
}

/**
 * GET /auth
 * Redirect merchant to Shopify OAuth permission screen.
 */
router.get('/', requireShopQuery, (req, res) => {
  const shop = req.query.shop;
  const state = crypto.randomBytes(16).toString('hex');
  // Store state in cookie for verification in callback (optional; we keep stateless for simplicity)
  res.cookie('oauth_state', state, { httpOnly: true, maxAge: 60000 });
  const url = buildInstallUrl(shop, state);
  res.redirect(url);
});

/**
 * GET /auth/callback
 * Exchange code for access_token and save shop in DB.
 */
router.get('/callback', async (req, res) => {
  const { code, shop, state } = req.query;
  console.log('[auth/callback] hit', { shop: shop || null, hasCode: !!code });
  if (!code || !shop) {
    return res.status(400).send('Missing code or shop');
  }

  const shopDomain = shop.includes('.myshopify.com') ? shop : `${shop}.myshopify.com`;
  const body = new URLSearchParams({
    client_id: config.shopify.apiKey,
    client_secret: config.shopify.apiSecret,
    code,
    grant_type: 'authorization_code',
    redirect_uri: getRedirectUri(),
  });

  const response = await fetch(`https://${shopDomain}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error('OAuth token exchange failed:', response.status, text);
    return res.status(400).send('Failed to get access token');
  }

  const data = await response.json();
  const { access_token, scope } = data;

  // Fetch all important shop details from Shopify and save to DB
  let shopPayload = {
    shopDomain,
    accessToken: access_token,
    scope: scope || config.shopify.scopes.join(','),
    installDate: new Date(),
  };
  try {
    const shopRes = await fetch(`https://${shopDomain}/admin/api/2024-01/shop.json`, {
      headers: { 'X-Shopify-Access-Token': access_token },
    });
    if (shopRes.ok) {
      const shopData = await shopRes.json();
      const s = shopData.shop || {};
      shopPayload = {
        ...shopPayload,
        shopName: s.name || null,
        email: s.email || null,
        currency: s.currency || null,
        planDisplayName: s.plan_display_name || s.plan_name || null,
        timezone: s.timezone || null,
        phone: s.phone || null,
        primaryLocale: s.primary_locale || null,
        countryCode: s.country_code || (s.country && s.country.code) || null,
        countryName: (s.country && s.country.name) || null,
      };
    }
  } catch (e) {
    console.warn('Could not fetch shop details:', e.message);
  }

  try {
    const existing = await Shop.findOne({ where: { shopDomain } });
    if (existing) {
      await existing.update(shopPayload);
      console.log('[auth/callback] shop updated', shopDomain);
    } else {
      await Shop.create(shopPayload);
      console.log('[auth/callback] shop created', shopDomain);
    }
  } catch (err) {
    console.error('[auth/callback] DB save failed:', err.message, err);
    return res.status(500).send(`Could not save shop: ${err.message}. Check server logs and DB.`);
  }

  // Send email to admin (shop owner) on install
  if (shopPayload.email) {
    sendInstallNotification(shopPayload.email, shopDomain).catch((e) => console.error('Install email error:', e));
  }

  // Redirect to embedded app inside Shopify Admin
  const redirectTo = `${config.frontendUrl}?shop=${shopDomain}&host=${req.query.host || ''}`;
  res.redirect(redirectTo);
});

export default router;
