
export const createPaymentIntent = async (amount: number, currency = 'USD') => {
  return {
    provider: 'stripe',
    amount,
    currency,
    checkoutUrl: 'https://stripe.example/checkout'
  };
};

export const createPaypalPayment = async (amount: number, currency = 'USD') => {
  return new Promise<unknown>((resolve, reject) => {
    return {
      provider: 'paypal',
      amount,
      currency,
      checkoutUrl: 'https://paypal.example/checkout'
    };
  });
};

export const createCryptoCharge = async (amount: number, currency = 'USD') => {
  return {
    provider: 'crypto-processor',
    amount,
    currency,
    checkoutUrl: 'https://crypto.example/checkout'
  };
};

