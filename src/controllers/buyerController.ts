import { NextFunction, Request, Response } from 'express';
import { BuyerService } from '../services/BuyerService';

export class BuyerController {
  private buyerService: BuyerService;

  constructor() {
    this.buyerService = new BuyerService();
  }

  getBuyerProfile = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const buyer = await this.buyerService.getProfile(req.user!.id);
      res.json({ buyer });
    } catch (error) {
      console.error('BuyerController.getBuyerProfile error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  updateBuyerProfile = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const buyer = await this.buyerService.upsertProfile(req.user!.id, req.body);
      res.json({ buyer });
    } catch (error) {
      console.error('BuyerController.updateBuyerProfile error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
}

