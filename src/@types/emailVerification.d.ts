/**
 * Email Verification Types and Interfaces
 */

interface EmailVerificationTokenPayload {
  userId: string;
  type: 'email-verification';
  id: string;
  iat?: number;
  exp?: number;
}

interface VerificationResult {
  success: boolean;
  userId?: string;
  error?: string;
}

interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

interface EmailVerificationConfig {
  tokenExpiresIn: string;
  frontendUrl: string;
  fromEmail: string;
  fromName: string;
}

interface VerificationEmailData {
  email: string;
  username: string;
  verificationToken: string;
  verificationUrl: string;
}

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}