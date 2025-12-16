import { NextFunction, Request, Response } from 'express';
import { UserService } from '../services/UserService';

class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public getProfile = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const user = await this.userService.getProfile(req.user!.id);
      res.json({ user });
    } catch (error) {
      console.error('UserController.getProfile error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public updateProfile = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const user = await this.userService.updateProfile(req.user!.id, req.body);
      res.json({ user });
    } catch (error) {
      console.error('UserController.updateProfile error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
}

export default UserController;
