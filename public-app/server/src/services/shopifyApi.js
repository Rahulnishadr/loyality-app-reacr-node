/**
 * Make authenticated request to Shopify Admin API for a given shop.
 * Loads access_token from DB (via shop row).
 */

export async function shopifyRequest(shop, path, options = {}) {
  const token = shop.accessToken;
  if (!token) {
    throw new Error('Shop has no access token');
  }
  const url = `https://${shop.shopDomain}/admin/api/2024-01${path.startsWith('/') ? path : `/${path}`}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Shopify API error ${response.status}: ${text}`);
  }
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
}

export async function getCustomers(shop, limit = 50) {
  const data = await shopifyRequest(shop, `/customers.json?limit=${limit}`);
  return data.customers || [];
}
