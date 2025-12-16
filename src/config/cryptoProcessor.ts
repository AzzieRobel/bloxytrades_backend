interface CryptoProcessorConfig {
  provider: 'placeholder';
  apiKey: string;
  webhookSecret: string;
}

export const cryptoProcessorConfig: CryptoProcessorConfig = {
  provider: 'placeholder',
  apiKey: process.env.CRYPTO_API_KEY || '',
  webhookSecret: process.env.CRYPTO_WEBHOOK_SECRET || ''
};

