import jwt, { SignOptions } from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { Resend } from 'resend';
import { config } from '../config';
import { userDataAccess } from '../data-access';
import { getVerificationEmailTemplate } from '../templates';

const { serverConfig, emailConfig } = config;

interface VerificationResult {
  success: boolean;
  userId?: string;
  error?: string;
}

interface EmailVerificationTokenPayload {
  userId: string;
  type: string;
  id: string;
  iat?: number;
  exp?: number;
}

/**
 * Send verification email using Resend
 */
async function sendVerificationEmail(email: string, username: string, token: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!emailConfig.resendApiKey) {
      return { success: false, error: 'Email service not configured' };
    }

    const resend = new Resend(emailConfig.resendApiKey);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const verificationUrl = `${frontendUrl}/auth/verify-email/${token}`;
    
    const { subject, html } = getVerificationEmailTemplate(verificationUrl, username);
    
    const result = await resend.emails.send({
      from: emailConfig.resendFromEmail || 'noreply@bloxytrades.com',
      to: email,
      subject,
      html,
    });

    if (result.error) {
      return { success: false, error: result.error.message || 'Failed to send email' };
    }

    return { success: true };
  } catch (error: any) {
    console.error('sendVerificationEmail error:', error);
    return { success: false, error: error.message || 'Failed to send verification email' };
  }
}

export class VerificationService {
  /**
   * Generate a verification token and save it to the user record
   */
  async generateVerificationToken(userId: string): Promise<string> {
    const tokenId = uuid();
    const signOptions: SignOptions = { expiresIn: serverConfig.jwtExpiresIn as SignOptions['expiresIn'] };
    const token = jwt.sign(
      { userId, type: 'email-verification', id: tokenId },
      serverConfig.jwtSecret as string,
      signOptions
    );

    // Calculate expiration date (24 hours from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await userDataAccess.updateById(
      userId,
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
      const decoded = jwt.verify(token, serverConfig.jwtSecret as string) as EmailVerificationTokenPayload;

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
      await userDataAccess.findOneAndUpdate(
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
