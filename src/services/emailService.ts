import { Resend } from 'resend';
import { config } from '../config';
import { getVerificationEmailTemplate } from '../templates';
import type { SendEmailResult } from '../@types/emailVerification';

const resend = config.resendApiKey ? new Resend(config.resendApiKey) : null;

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

/**
 * Send email using Resend
 */
export const sendEmail = async ({ to, subject, html, from }: SendEmailOptions): Promise<SendEmailResult> => {
  if (!config.resendApiKey || !resend) {
    console.warn('Resend API key not configured. Email not sent.');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const result = await resend.emails.send({
      from: from || `${config.resendFromName} <${config.resendFromEmail}>`,
      to,
      subject,
      html,
    });

    return { success: true, id: result.data?.id };
  } catch (error: any) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message || 'Failed to send email' };
  }
};

/**
 * Send verification email to user
 */
export const sendVerificationEmail = async (
  email: string,
  username: string,
  verificationToken: string
): Promise<SendEmailResult> => {
  const verificationUrl = `${config.frontendUrl}/verify-email/${verificationToken}`;
  const { subject, html } = getVerificationEmailTemplate(verificationUrl, username);

  return await sendEmail({
    to: email,
    subject,
    html,
  });
};
