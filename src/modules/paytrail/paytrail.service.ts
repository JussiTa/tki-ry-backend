import axios from 'axios';
import { calculateHmac } from './hmac';
import { PaytrailClient } from '@paytrail/paytrail-js-sdk/dist/paytrail-client';
import { PaymentMethodGroup } from '@paytrail/paytrail-js-sdk/dist/models/request/request-model/payment-method-group.model';

const ACCOUNT = '375917';
const SECRET = 'SAIPPUAKAUPPIAS';

const headers = {
  'checkout-account': ACCOUNT,
  'checkout-algorithm': 'sha256',
  'checkout-method': 'POST',
  'checkout-nonce': '564635208570151',
  'checkout-timestamp': '2025-01-02T10:01:31.904Z',
};

const body = {
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
    success: 'https://ecom.example.com/cart/success',
    cancel: 'https://ecom.example.com/cart/cancel',
  },
};

export class PayTrailService {
  constructor() {}

  async createPayment() {
    // Expected HMAC: 9a4a7735279de4c99268e4566a5526ae887e73e6e58f2918cb2309ccac366129
    const jee = calculateHmac(SECRET, headers, body);

    const client = new PaytrailClient({
      merchantId: 375917,
      secretKey: 'SAIPPUAKAUPPIAS',
      platformName: 'test',
    });

    // Example
    // const res = await client.listGroupedProviders({
    //   amount: 1,
    //   groups: [PaymentMethodGroup.Mobile, PaymentMethodGroup.CreditCard],
    // });

    const res = await client.createPayment(body);

  }
  // const config = {
  //   headers: {
  //     'Content-Type': 'application/json;charset=utf-8',
  //     signature: jee,
  //   },
  //   body: {
  //     stamp: 'd2568f2a-e4c6-40ba-a7cd-d573382ce548',
  //     reference: '9187445',
  //     amount: 1590,
  //     currency: 'EUR',
  //     language: 'FI',
  //     items: [
  //       {
  //         unitPrice: 1590,
  //         units: 1,
  //         vatPercentage: 25.5,
  //         productCode: '#927502759',
  //         stamp: '10743336-b969-4d5c-87f7-0ef8594d24ef',
  //       },
  //     ],
  //     customer: {
  //       email: 'erja.esimerkki@example.org',
  //     },
  //     redirectUrls: {
  //       success: 'https://ecom.example.org/success',
  //       cancel: 'https://ecom.example.org/cancel',
  //     },
  //     callbackUrls: {
  //       success: 'https://ecom.example.org/success',
  //       cancel: 'https://ecom.example.org/cancel',
  //     },
  //   },
  // };

  // axios
  //   .post('https://services.paytrail.com/payments', config)
  //   .then((res) => console.log(res.data));
}
