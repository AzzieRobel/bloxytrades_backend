/**
 * Email Verification Types and Interfaces
 */

export interface EmailVerificationTokenPayload {
  userId: string;
  type: 'email-verification';
  id: string;
  iat?: number;
  exp?: number;
}

export interface VerificationResult {
  success: boolean;
  userId?: string;
  error?: string;
}

export interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

export interface EmailVerificationConfig {
  tokenExpiresIn: string;
  frontendUrl: string;
  fromEmail: string;
  fromName: string;
}

export interface VerificationEmailData {
  email: string;
  username: string;
  verificationToken: string;
  verificationUrl: string;
}

