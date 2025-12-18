import { NextFunction, Request, Response } from 'express';
import { userService } from '../services';

export class UserController {
  public getProfile = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const user = await userService.getProfile(req.user!.id);
      res.json({ user });
    } catch (error) {
      console.error('UserController.getProfile error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public updateProfile = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const data = { newEmail: req.body.newEmail, newUsername: req.body.newUsername, id: req.body.id };
      const user = await userService.updateProfile(data);
      res.status(200).json({ user });
    } catch (error) {
      console.error('UserController.updateProfile error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public changePassword = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const data = { id: req.body.id, currentPassword: req.body.currentPassword, newPassword: req.body.newPassword };
      await userService.changePassword(data);
      res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
      console.error('UserController.changePassword error:', error);
      res.status(500).json({ message: 'Failed to change password' });
    }
  };
}
