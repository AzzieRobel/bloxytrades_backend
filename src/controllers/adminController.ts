import { NextFunction, Request, Response } from 'express';
import { AdminService } from '../services/AdminService';

export class AdminController {
  private adminService: AdminService;

  constructor() {
    this.adminService = new AdminService();
  }

  getStats = async (_req: Request, res: Response, _next: NextFunction) => {
    try {
      const stats = await this.adminService.getStats();
      res.json({ stats });
    } catch (error) {
      console.error('AdminController.getStats error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  banUser = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await this.adminService.banUser(id);
      res.json({ user });
    } catch (error) {
      console.error('AdminController.banUser error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
}

