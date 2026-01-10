import sgMail from '@sendgrid/mail';
import crypto from "crypto";
import bcrypt from "bcrypt";

import { config } from '../config';

const { emailConfig } = config;
const SECRET_KEY = emailConfig.secrete_key;
const DERIVED_KEY = crypto.createHash("sha256").update(SECRET_KEY).digest(); // 32-byte key for AES-256
const IV_LENGTH = 16;
const saltRounds = 12;

sgMail.setApiKey(emailConfig.resendApiKey);

export async function sendOtpEmail(to: string, code: string) {

  // Clean email template without logo

  const msg: any = {
    to: [{ email: to }],
    from: { email: emailConfig.resendFromEmail }, // must be verified sender
    subject: '🔐 BloxyTrades Verification Code',
    text: `Hi there,
  
  We received a request to verify your email address.
  
  Your One-Time Password (OTP) is: ${code}
  
  Please enter this code in the app to continue. This code will expire in 10 minutes.
  
  If you did not request this, you can safely ignore this email.
  
  Thank you,
  The BloxyTrades Team
  `,
    html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification - BloxyTrades</title>
        </head>
        <body style="margin: 0; padding: 20px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); overflow: hidden;">
            
            <!-- Header -->
            <div style="background: #3b82f6; padding: 24px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 1.5rem; font-weight: 600;">BloxyTrades</h1>
            </div>
            
            <!-- Content -->
            <div style="padding: 32px 24px;">
              <h2 style="color: #1f2937; margin: 0 0 16px 0; font-size: 1.25rem; text-align: center;">🔐 Verify Your Email</h2>
              <p style="color: #6b7280; margin-bottom: 24px; line-height: 1.5; text-align: center;">
                We received a request to verify your email address.<br>
                Please use the following One-Time Password (OTP) to continue:
              </p>
              
              <!-- OTP Code Display -->
              <div style="background: #f3f4f6; border: 1px solid #d1d5db; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 24px;">
                <div style="font-size: 2rem; letter-spacing: 4px; font-weight: bold; color: #1f2937; font-family: 'Courier New', monospace;">
                  ${code}
                </div>
              </div>
              
              <!-- Footer -->
              <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 0.9rem; margin: 0;">
                  Thank you,<br>
                  <strong style="color: #1f2937;">The BloxyTrades Team</strong>
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
  }

  try {
    console.log("Sending email to:", to)
    const response = await sgMail.send(msg)
    console.log("Email sent successfully:", response[0].statusCode)
    return response
  } catch (error: any) {
    console.error("SendGrid error:", error.response?.body || error.message)
    throw error
  }
}

export async function sendEmailToChangePassword(to: string, resetPasswordLink: string) {

  // Clean email template without logo

  const msg: any = {
    to: [{ email: to }],
    from: { email: emailConfig.resendFromEmail }, // must be verified sender
    subject: '🔐 BloxyTrades Password Reset',
    text: `Hi there,
  
  We received a request to reset your password.
  
  Click the link below to reset your password:
  ${resetPasswordLink}
  
  This link will expire in 10 minutes.
  
  If you did not request this, you can safely ignore this email.
  
  Thank you,
  The BloxyTrades Team
  `,
    html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset - BloxyTrades</title>
        </head>
        <body style="margin: 0; padding: 20px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); overflow: hidden;">
            
            <!-- Header -->
            <div style="background: #3b82f6; padding: 24px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 1.5rem; font-weight: 600;">BloxyTrades</h1>
            </div>
            
            <!-- Content -->
            <div style="padding: 32px 24px;">
              <h2 style="color: #1f2937; margin: 0 0 16px 0; font-size: 1.25rem; text-align: center;">🔐 Reset Your Password</h2>
              <p style="color: #6b7280; margin-bottom: 24px; line-height: 1.5; text-align: center;">
                We received a request to reset your password.<br>
                Click the button below to reset your password:
              </p>
              
              <!-- Reset Password Button -->
              <div style="text-align: center; margin-bottom: 24px;">
                <a href="${resetPasswordLink}" style="display: inline-block; background: #3b82f6; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; font-size: 1rem; transition: background-color 0.2s;">
                  Reset Your Password
                </a>
              </div>
              
              <p style="color: #6b7280; font-size: 0.9rem; text-align: center; margin-bottom: 24px;">
                This link will expire in 10 minutes.
              </p>
              
              <!-- Footer -->
              <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 0.9rem; margin: 0;">
                  Thank you,<br>
                  <strong style="color: #1f2937;">The BloxyTrades Team</strong>
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
  }

  try {
    console.log("Sending email to:", to)
    const response = await sgMail.send(msg)
    console.log("Email sent successfully:", response[0].statusCode)
    return response
  } catch (error: any) {
    console.error("SendGrid error:", error.response?.body || error.message)
    throw error
  }
}

export const createEmailToken = (email: string, userId: string, expiryDate: number): string => {
  const payload = JSON.stringify({
    iss: "bloxytrades_email_verify",
    email,
    userId,
    expiryDate,
  });

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", DERIVED_KEY, iv);

  const encrypted = Buffer.concat([cipher.update(payload, "utf8"), cipher.final()]);

  // token = iv + encrypted, both base64
  return iv.toString("base64") + ":" + encrypted.toString("base64");
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, saltRounds);
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export function hashTokenToChangePassword(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}
export function generateTokenToChangePassword(): string {
  return crypto.randomBytes(32).toString("hex"); // 64 hex chars
}