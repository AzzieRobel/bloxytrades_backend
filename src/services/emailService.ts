import { Resend } from 'resend';
import { v4 as uuidv4 } from 'uuid';

import { config } from '../config';
import { userDataAccess } from '../data-access';
import { comparePassword, generateTokenToChangePassword, hashPassword, hashTokenToChangePassword, sendEmailToChangePassword, sendOtpEmail } from '../utils/email';

const { emailConfig } = config;

export class EmailService {

  private resend: any

  constructor() {
    this.resend = emailConfig.resendApiKey ? new Resend(emailConfig.resendApiKey) : null;
  }

  async emailSignup(email: string, password: string, name: string) {
    try {

      const existingUser: any = await userDataAccess.findOne({ email });
      if (existingUser && existingUser.emailVerified) throw new Error("User already sign up!");
      if (existingUser && !existingUser.emailVerified) {
        await userDataAccess.deleteById(existingUser.id);
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString()
      const send_result = await sendOtpEmail(email, otp);

      if (send_result[0].statusCode == 202) {
        const hashedPassword = await hashPassword(password);
        const data = {
          userId: uuidv4(),
          email,
          emailOTP: otp,
          password: hashedPassword,
          name,
          googleExpiryDate: new Date(Date.now() + 10 * 60 * 1000)
        }
        await userDataAccess.create(data)
        return { success: true };
      }
      else throw new Error("Failed to send email")
    } catch (err: any) {
      console.error("Send-code error:", err.message);
      // return { error: err.message };
      throw new Error(err.message);
    }
  }

  async emailVerify(email: string, otp: string) {
    try {
      const existingUser: any = await userDataAccess.findOne({ email });
      if (!existingUser) {
        throw new Error("User not found!");
      }
      if (existingUser.emailOTP != otp) {
        throw new Error("Invalid OTP!");
      }
      if (existingUser.googleExpiryDate < new Date()) {
        throw new Error("Your code exceeded the delay time");
      }
      existingUser.emailVerified = true;
      existingUser.emailOTP = undefined;
      await existingUser.save();
      console.log("existingUser", existingUser)
      return existingUser;
    } catch (error: any) {
      console.error("Email verify error:", error.message);
      throw new Error(error.message);
    }
  }

  async resendVerificationCode(email: string) {
    try {
      const existingUser: any = await userDataAccess.findOne({ email });
      if (!existingUser) {
        throw new Error("User not found!");
      }
      if (existingUser.emailVerified) {
        throw new Error("Email is already verified!");
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const send_result = await sendOtpEmail(email, otp);

      if (send_result[0].statusCode === 202) {
        existingUser.emailOTP = otp;
        await existingUser.save();
        return { success: true };
      } else {
        throw new Error("Failed to send verification email");
      }
    } catch (err: any) {
      console.error("Resend verification code error:", err.message);
      //  return { error: err.message };
      throw new Error(err.message);
    }
  }

  async emailLogin(email: string, password: string) {
    try {
      const existingUser: any = await userDataAccess.findOne({ email });
      if (!existingUser) {
        throw new Error("User not found!");
      }
      if (!existingUser.emailVerified) {
        throw new Error("Email is not verified!");
      }
      const isPasswordValid = await comparePassword(password, existingUser.password);
      if (!isPasswordValid) {
        throw new Error("Invalid password!");
      }
      // Optionally, you can omit password and sensitive fields from the returned user
      return existingUser;
    } catch (err: any) {
      console.error("Email login error:", err.message);
      throw new Error(err.message);
    }
  }

  async forgotPassword(email: string) {
    try {
      const existingUser: any = await userDataAccess.findOne({ email });
      if (!existingUser) {
        throw new Error("User not found!");
      }
      const token = generateTokenToChangePassword();
      const tokenHash = hashTokenToChangePassword(token);
      existingUser.tokenHashToChangePassword = { tokenHash, expiryDate: new Date(Date.now() + 10 * 60 * 1000), used: false };
      await existingUser.save();
      const resetPasswordLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
      await sendEmailToChangePassword(email, resetPasswordLink);
      return { success: true };

    } catch (error: any) {
      console.error("Forgot password error:", error.message);
      throw new Error(error.message);
    }
  }

  async resetPassword(password: string, token: string) {
    try {
      const tokenHash = hashTokenToChangePassword(token);
      const existingUser: any = await userDataAccess.findOne({
        "tokenHashToChangePassword.tokenHash": tokenHash,
        "tokenHashToChangePassword.used": { $ne: true }
      });

      if (!existingUser) {
        throw new Error("Invalid or expired token!");
      }

      if (existingUser.tokenHashToChangePassword.expiryDate < new Date()) {
        throw new Error("Your code exceeded the delay time");
      }

      if (existingUser.tokenHashToChangePassword.used) {
        throw new Error("Token already used!");
      }

      const hashedPassword = await hashPassword(password);
      existingUser.password = hashedPassword;
      existingUser.tokenHashToChangePassword.used = true;
      await existingUser.save();
      return { success: true };
    } catch (error: any) {
      console.error("Change password error:", error.message);
      throw new Error(error.message);
    }
  }
}
