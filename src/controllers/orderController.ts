import { NextFunction, Request, Response } from 'express';
import { placeInEscrow, releaseEscrow } from '../services/escrowService';
import { OrderService } from '../services/OrderService';

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  createOrder = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const payload = { ...req.body };
      const order = await this.orderService.createOrder(req.user!.id, payload);
      const escrow = await placeInEscrow(order.id);
      res.status(201).json({ order, escrow });
    } catch (error) {
      console.error('OrderController.createOrder error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  updateOrderStatus = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const order = await this.orderService.updateStatus(id, status);
      res.json({ order });
    } catch (error) {
      console.error('OrderController.updateOrderStatus error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  releaseOrder = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const { id } = req.params;
      const escrow = await releaseEscrow(id);
      res.json({ escrow });
    } catch (error) {
      console.error('OrderController.releaseOrder error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
}

