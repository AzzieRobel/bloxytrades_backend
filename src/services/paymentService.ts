import { stripe } from '../config/stripe';
import { paypal } from '../config/paypal';
import { cryptoProcessorConfig } from '../config/cryptoProcessor';

export const createPaymentIntent = async (amount: number, currency = 'USD') => {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }
  return stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency
  });
};

export const createPaypalPayment = async (amount: number, currency = 'USD') => {
  return new Promise((resolve, reject) => {
    paypal.payment.create(
      {
        intent: 'sale',
        payer: { payment_method: 'paypal' },
        transactions: [{ amount: { total: amount.toFixed(2), currency } }],
        redirect_urls: {
          return_url: 'https://example.com/success',
          cancel_url: 'https://example.com/cancel'
        }
      },
      (error, payment) => {
        if (error) reject(error);
        else resolve(payment);
      }
    );
  });
};

export const createCryptoCharge = async (amount: number, currency = 'USD') => {
  return {
    provider: cryptoProcessorConfig.provider,
    amount,
    currency,
    checkoutUrl: 'https://crypto.example/checkout'
  };
};

