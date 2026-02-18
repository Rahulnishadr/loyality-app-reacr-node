import axios from 'axios';

const API_BASE = '/api';

/**
 * Make API call with auth token from localStorage
 * @param {string} path - API path (e.g., '/customer/admintransaction')
 * @param {string} method - HTTP method (GET, POST, PUT, PATCH, DELETE)
 * @param {object} data - Request body
 * @returns {Promise<{status: number, data: any}>}
 */
export async function apiCall(path, method = 'GET', data = null) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const config = {
    method: method.toUpperCase(),
    url: `${API_BASE}${path}`,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };
  if (data && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
    config.data = data;
  }
  const response = await axios(config);
  return { status: response.status, data: response.data };
}
