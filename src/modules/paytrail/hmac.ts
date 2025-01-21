import { createHmac } from 'crypto';

export const ACCOUNT = '375917';
export const SECRET = 'SAIPPUAKAUPPIAS';

export const headers = {
  'checkout-account': ACCOUNT,
  'checkout-algorithm': 'sha256',
  'checkout-method': 'POST',
  'checkout-nonce': '564635208570151',
  'checkout-timestamp': '2025-01-02T10:01:31.904Z',
};

export const body = {
  stamp: crypto.randomUUID(),
  reference: '3759170',
  amount: 1525,
  currency: 'EUR',
  language: 'FI',
  items: [
    {
      unitPrice: 1525,
      units: 1,
      vatPercentage: 25.5,
      productCode: '#1234',
      deliveryDate: '2018-09-01',
    },
  ],
  customer: {
    email: 'test.customer@example.com',
  },
  redirectUrls: {
    success: 'https://tkiry-frontend.onrender.com/success',
    cancel: 'https://tkiry-frontend.onrender.com/cancel',
  },
};

/**
 * Calculate HMAC
 *
 * @param {string} secret Merchant shared secret
 * @param {object} params Headers or query string parameters
 * @param {object|undefined} body Request body or empty string for GET requests
 */

export const calculateHmac = (secret: string, params: any, body: any) => {
  const hmacPayload = Object.keys(params)
    .sort()
    .map((key) => [key, params[key]].join(':'))
    .concat(body ? JSON.stringify(body) : '')
    .join('\n');

  return createHmac('sha256', secret).update(hmacPayload).digest('hex');
};
