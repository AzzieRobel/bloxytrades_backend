import { Request, Response, NextFunction } from 'express';
import { VerificationService } from '../services/VerificationService';

const verificationService = new VerificationService();

export class VerificationController {
  /**
   * Verify email using token from URL
   * GET /api/auth/verify-email/:token
   */
  verifyEmail = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const { token } = req.params;
      
      if (!token) {
        return res.status(400).json({ message: 'Verification token is required' });
      }

      const result = await verificationService.verifyToken(token);

      if (!result.success) {
        return res.status(400).json({ message: result.error || 'Verification failed' });
      }

      res.json({ 
        message: 'Email verified successfully',
        success: true 
      });
    } catch (error: any) {
      console.error('VerificationController.verifyEmail error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  /**
   * Resend verification email
   * POST /api/auth/resend-verification
   * Requires authentication
   */
  resendVerification = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const result = await verificationService.sendVerificationEmail(userId);

      if (!result.success) {
        return res.status(400).json({ message: result.error || 'Failed to send verification email' });
      }

      res.json({ 
        message: 'Verification email sent successfully',
        success: true 
      });
    } catch (error: any) {
      console.error('VerificationController.resendVerification error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
}

export const verificationController = new VerificationController();

