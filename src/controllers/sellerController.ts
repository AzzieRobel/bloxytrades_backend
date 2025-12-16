import { NextFunction, Request, Response } from 'express';
import { SellerService } from '../services/SellerService';

export class SellerController {
  private sellerService: SellerService;

  constructor() {
    this.sellerService = new SellerService();
  }

  getSellerProfile = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const seller = await this.sellerService.getProfile(req.user!.id);
      res.json({ seller });
    } catch (error) {
      console.error('SellerController.getSellerProfile error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  updateSellerProfile = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const seller = await this.sellerService.upsertProfile(req.user!.id, req.body);
      res.json({ seller });
    } catch (error) {
      console.error('SellerController.updateSellerProfile error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  getDashboard = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const data = await this.sellerService.getDashboard(req.user!.id);
      res.json(data);
    } catch (error) {
      console.error('SellerController.getDashboard error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  getSalesHistory = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const orders = await this.sellerService.getSalesHistory(req.user!.id);
      res.json({ orders });
    } catch (error) {
      console.error('SellerController.getSalesHistory error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
}

