import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { config } from '../config';
import { userDataAccess } from '../data-access';
import { sendVerificationEmail } from './emailService';
import type { VerificationResult, EmailVerificationTokenPayload } from '../@types/emailVerification';

export class VerificationService {
  /**
   * Generate a verification token and save it to the user record
   */
  async generateVerificationToken(userId: string): Promise<string> {
    const tokenId = uuid();
    const token = jwt.sign(
      { userId, type: 'email-verification', id: tokenId },
      config.jwtSecret as string,
      { expiresIn: config.emailVerificationTokenExpiresIn }
    );
    
    // Calculate expiration date (24 hours from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await userDataAccess.update(
      { id: userId } as any,
      {
        emailVerificationToken: token,
        emailVerificationTokenExpires: expiresAt,
      } as any
    );

    return token;
  }

  /**
   * Verify the email verification token
   */
  async verifyToken(token: string): Promise<VerificationResult> {
    try {
      const decoded = jwt.verify(token, config.jwtSecret as string) as EmailVerificationTokenPayload;
      
      if (decoded.type !== 'email-verification') {
        return { success: false, error: 'Invalid token type' };
      }

      const user = await userDataAccess.findOne({ id: decoded.userId } as any);
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      if (user.emailVerified) {
        return { success: false, error: 'Email already verified' };
      }

      // Verify token matches stored token
      if (user.emailVerificationToken !== token) {
        return { success: false, error: 'Invalid or expired token' };
      }

      // Check if token has expired
      if (user.emailVerificationTokenExpires && new Date() > user.emailVerificationTokenExpires) {
        return { success: false, error: 'Token expired' };
      }

      // Mark email as verified
      await userDataAccess.update(
        { id: decoded.userId } as any,
        {
          emailVerified: true,
          emailVerifiedAt: new Date(),
          emailVerificationToken: null,
          emailVerificationTokenExpires: null,
        } as any
      );

      return { success: true, userId: decoded.userId };
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        return { success: false, error: 'Token expired' };
      }
      if (error.name === 'JsonWebTokenError') {
        return { success: false, error: 'Invalid token' };
      }
      return { success: false, error: 'Invalid or expired token' };
    }
  }

  /**
   * Send verification email to user
   */
  async sendVerificationEmail(userId: string): Promise<VerificationResult> {
    const user = await userDataAccess.findOne({ id: userId } as any);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    if (user.emailVerified) {
      return { success: false, error: 'Email already verified' };
    }

    const token = await this.generateVerificationToken(userId);
    const result = await sendVerificationEmail(user.email, user.username, token);

    if (!result.success) {
      return { success: false, error: result.error || 'Failed to send email' };
    }

    return { success: true, userId };
  }
}

