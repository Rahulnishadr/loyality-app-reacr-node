import crypto from 'crypto';
import { Shop } from '../db/index.js';
import { config } from '../config/index.js';

function getSessionToken(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  return null;
}

function getShopFromQuery(req) {
  return req.query.shop || null;
}

/**
 * Verify Shopify session token (JWT from App Bridge / id_token in URL).
 * JWT format: header.payload.signature
 */
function verifySessionToken(token) {
  if (!token || !config.shopify.apiSecret) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const signingInput = `${encodedHeader}.${encodedPayload}`;
    let expectedHmac = crypto
      .createHmac('sha256', config.shopify.apiSecret)
      .update(signingInput)
      .digest('base64');
    expectedHmac = expectedHmac.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    if (encodedSignature !== expectedHmac) return null;
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

/**
 * Middleware: ensure request is from a valid session.
 * Sets req.shopDomain and req.shop (DB row).
 */
export async function validateSession(req, res, next) {
  const token = getSessionToken(req);
  const shopFromQuery = getShopFromQuery(req);

  if (token) {
    const payload = verifySessionToken(token);
    if (payload && payload.dest) {
      const shopDomain = payload.dest.replace(/^https?:\/\//, '').split('/')[0];
      if (shopDomain) {
        const shop = await Shop.findOne({ where: { shopDomain } });
        if (shop) {
          req.shopDomain = shopDomain;
          req.shop = shop;
          return next();
        }
      }
    }
  }

  if (shopFromQuery) {
    const normalized = shopFromQuery.includes('.myshopify.com')
      ? shopFromQuery
      : `${shopFromQuery}.myshopify.com`;
    const shop = await Shop.findOne({ where: { shopDomain: normalized } });
    if (shop) {
      req.shopDomain = normalized;
      req.shop = shop;
      return next();
    }
  }

  res.status(401).json({ error: 'Unauthorized', message: 'Invalid or missing session' });
}

/**
 * Require shop in query (for install route).
 */
export function requireShopQuery(req, res, next) {
  if (!req.query.shop) {
    return res.status(400).send('Missing shop parameter');
  }
  next();
}
