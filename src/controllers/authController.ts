import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const { username, email, password } = req.body;
      const result = await this.authService.register(username, email, password);
      res.status(201).json(result);
    } catch (error) {
      console.error('AuthController.register error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  login = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const { identifier, password } = req.body;
      const result = await this.authService.login(identifier, password);
      res.json(result);
    } catch (error) {
      console.error('AuthController.login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  refreshSession = async (_req: Request, res: Response, _next: NextFunction) => {
    try {
      res.json({ message: 'Refresh token endpoint placeholder' });
    } catch (error) {
      console.error('AuthController.refreshSession error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  googleLogin = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const { idToken } = req.body;
      const result = await this.authService.loginWithGoogle(idToken);
      res.json(result);
    } catch (error) {
      console.error('AuthController.googleLogin error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
}

