import { PaytrailClient } from '@paytrail/paytrail-js-sdk/dist/paytrail-client';
import {
  PaymentData,
  PaymentGroups,
  PaymentProviders,
  Customer,
} from '../interface';

export class PayTrailService {
  constructor() {}

  async createPayment(user: Customer) {
    console.log(user);
    const client = new PaytrailClient({
      merchantId: 375917,
      secretKey: 'SAIPPUAKAUPPIAS',
      platformName: 'test',
    });
    const standardData = {
      stamp: crypto.randomUUID(),
      reference: '9187445',
      amount: user.totalAmount,
      currency: 'EUR',
      language: 'FI',
      customer: {
        email: user.email,
      },
      redirectUrls: {
        success: 'https://tki-ry-frontend.onrender.com/success',
        cancel: 'https://tki-ry-frontend.onrender.com/cancel',
      },
      callbackUrls: {
        success: 'https://tki-ry-frontend.onrender.com/success',
        cancel: 'https://tki-ry-frontend.onrender.com/cancel',
      },
    };

    const data = await client.createPayment(standardData);
    console.log(data);
    const providers = data.data.providers.map((item) => {
      const provider: PaymentProviders = {
        id: item.id,
        name: item.name,
        svg: item.svg,
        url: item.url,
        icon: item.icon,
        group: item.group,
        parameters: item.parameters,
      };
      return provider;
    });

    const groups = data.data.groups.map((item) => {
      const group: PaymentGroups = {
        id: item.id,
        name: item.name,
        svg: item.svg,
      };
      return group;
    });

    const paymentData: PaymentData = {
      providers: providers,
      groups: groups,
    };

    return paymentData;
  }
}
