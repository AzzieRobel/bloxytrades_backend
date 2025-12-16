import { NextFunction, Request, Response } from 'express';
import { createCryptoCharge, createPaymentIntent, createPaypalPayment } from '../services/paymentService';

export const payWithStripe = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const { amount, currency } = req.body;
    const intent = await createPaymentIntent(amount, currency);
    res.status(201).json({ intent });
  } catch (error) {
    console.error('PaymentController.payWithStripe error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const payWithPaypal = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const { amount, currency } = req.body;
    const payment = await createPaypalPayment(amount, currency);
    res.status(201).json({ payment });
  } catch (error) {
    console.error('PaymentController.payWithPaypal error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const payWithCrypto = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const { amount, currency } = req.body;
    const charge = await createCryptoCharge(amount, currency);
    res.status(201).json({ charge });
  } catch (error) {
    console.error('PaymentController.payWithCrypto error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

