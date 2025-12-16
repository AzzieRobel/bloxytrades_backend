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
    } catch (error: any) {
      console.error('AuthController.register error:', error);
      const message = error?.message || 'An error occurred during registration';

      if (message.includes('already in use') || message.includes('duplicate')) {
        return res.status(409).json({ message: 'Email or username is already registered. Please try logging in instead.' });
      }

      const statusCode = message.includes('required') || message.includes('Invalid') ? 400 : 500;
      res.status(statusCode).json({ message });
    }
  };

  login = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const { identifier, password } = req.body;
      const result = await this.authService.login(identifier, password);
      res.json(result);
    } catch (error: any) {
      console.error('AuthController.login error:', error);
      const message = error?.message || 'An error occurred during login';

      if (message.includes('Invalid email/username') || message.includes('Invalid password'))
        return res.status(401).json({ message: 'Invalid email/username or password.' });
      if (message.includes('banned'))
        return res.status(403).json({ message: 'Your account has been banned. Please contact support.' });

      const statusCode = message.includes('already') || message.includes('Invalid') ? 400 : 500;
      res.status(statusCode).json({ message });
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
    } catch (error: any) {
      console.error('AuthController.googleLogin error:', error);
      const message = error?.message || 'An error occurred during Google login';

      // Return appropriate status codes based on error type
      if (message.includes('Invalid') || message.includes('token')) {
        return res.status(401).json({ message: 'Invalid Google authentication. Please try again.' });
      }
      if (message.includes('banned')) {
        return res.status(403).json({ message: 'Your account has been banned. Please contact support.' });
      }
      if (message.includes('not configured')) {
        return res.status(503).json({ message: 'Google login is currently unavailable. Please try again later.' });
      }
      res.status(500).json({ message });
    }
  };
}

