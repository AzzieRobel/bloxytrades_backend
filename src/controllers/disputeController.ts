import { NextFunction, Request, Response } from 'express';
import { DisputeService } from '../services/DisputeService';

export class DisputeController {
  private disputeService: DisputeService;

  constructor() {
    this.disputeService = new DisputeService();
  }

  createDispute = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const dispute = await this.disputeService.createDispute(req.user!.id, req.body);
      res.status(201).json({ dispute });
    } catch (error) {
      console.error('DisputeController.createDispute error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  resolveDispute = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const { id } = req.params;
      const { decision } = req.body;
      const dispute = await this.disputeService.resolveDispute(id, decision, req.user!.id);
      res.json({ dispute });
    } catch (error) {
      console.error('DisputeController.resolveDispute error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
}

