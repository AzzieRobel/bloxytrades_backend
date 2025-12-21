import { baseEmailTemplate } from './baseTemplate';
import { config } from '../../config';

/**
 * Email Verification Template
 * 
 * To customize this email:
 * 1. Edit the `content` variable below to change the email body text
 * 2. Edit the `subject` variable to change the email subject line
 * 3. For styling changes, edit `backend/src/templates/email/styles.ts`
 * 4. For layout changes, edit `backend/src/templates/email/baseTemplate.ts`
 */
export function getVerificationEmailTemplate(verificationUrl: string, username: string): {
  subject: string;
  html: string;
} {
  // Customize the email subject line here
  const subject = 'Verify Your Email Address - BloxyTrades';
  
  // Customize the email content here
  const content = `
    <p>Hi <strong>${username}</strong>,</p>
    <p>Welcome to BloxyTrades! We're excited to have you on board.</p>
    <p>To complete your registration and start trading, please verify your email address by clicking the button below:</p>
    <p style="margin-top: 20px; color: #9ca3af; font-size: 14px;">
      <strong>Note:</strong> This verification link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
    </p>
  `;

  const html = baseEmailTemplate({
    title: 'Verify Your Email Address',
    content,
    buttonText: 'Verify Email Address',
    buttonUrl: verificationUrl,
    footerText: 'If you did not create an account with BloxyTrades, please ignore this email.',
  });

  return { subject, html };
}

