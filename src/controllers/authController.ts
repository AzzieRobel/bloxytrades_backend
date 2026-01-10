import { NextFunction, Request, Response } from 'express';
import { authService, googleAuthService } from '../services';

export class AuthController {

  constructor() { }

  register = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const { username, email, password } = req.body;
      const result = await authService.register(username, email, password);
      res.status(201).json(result);
    } catch (error: any) {
      console.error('AuthController.register error:', error);
      const message = error?.message || 'An error occurred during registration';

      if (message.includes('already in use') || message.includes('duplicate'))
        return res.status(409).json({ message: 'Email or username is already registered. Please try logging in instead.' });

      const statusCode = message.includes('required') || message.includes('Invalid') ? 400 : 500;
      res.status(statusCode).json({ message });
    }
  };

  login = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const { identifier, password } = req.body;
      const result = await authService.login(identifier, password);
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

  async googleAuth(req: Request, res: Response) {
    try {
      const url = await googleAuthService.googleAuth();
      // Return the URL as a JSON object with url property for consistency
      res.json({ url });
    } catch (error: any) {
      console.error('AuthController.googleAuth error:', error);
      res.status(500).json({ message: 'Error getting Google auth URL', error: error.message });
    }
  }

  async googleLogin(req: Request, res: Response) {
    try {
      const { code } = req.body;

      if (!code || typeof code !== 'string') {
        return res.status(400).json({ message: 'Authorization code is required' });
      }

      const result = await googleAuthService.googleLogin(code);
      res.json(result);
    } catch (error: any) {
      console.error('AuthController.googleLogin error:', error);
      const message = error?.message || 'Error logging in with Google';

      // Return appropriate status codes based on error type
      let statusCode = 500;
      if (message.includes('already linked') || message.includes('already in use')) {
        statusCode = 409; // Conflict
      } else if (message.includes('Invalid') || message.includes('token') || message.includes('email')) {
        statusCode = 400; // Bad Request
      }

      res.status(statusCode).json({ message });
    }
  }
}

