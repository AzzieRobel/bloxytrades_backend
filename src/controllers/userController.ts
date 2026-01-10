import { NextFunction, Request, Response } from 'express';
import { userService, emailService, googleAuthService } from '../services';

export class UserController {
  public getProfile = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const user = await userService.getProfile(req.user!.id);
      res.json({ user });
    } catch (error) {
      console.error('UserController.getProfile error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public updateProfile = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const data = { newEmail: req.body.newEmail, newUsername: req.body.newUsername };
      const user = await userService.updateProfile(req.user!.id, data);
      res.status(200).json({ user });
    } catch (error) {
      console.error('UserController.updateProfile error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public changePassword = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const data = { currentPassword: req.body.currentPassword, newPassword: req.body.newPassword };
      await userService.changePassword(req.user!.id, data);
      res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
      console.error('UserController.changePassword error:', error);
      res.status(500).json({ message: 'Failed to change password' });
    }
  };

  async googleAuth(req: Request, res: Response) {
    try {
      console.log("googleAuth");
      const url = await googleAuthService.googleAuth();
      res.json(url);
    } catch (error) {
      res.status(500).json({ message: 'Error getting google auth url', error });
    }
  }

  async googleLogin(req: Request, res: Response) {
    try {
      const code = req.body;
      console.log("code", code);
      const user = await googleAuthService.googleLogin(code);
      console.log("user", user)
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error logging in with google', error });
    }
  }

  async emailSignup(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;
      const user = await emailService.emailSignup(email, password, name);
      res.json(user);
    } catch (error: any) {
      console.log("Email Error")
      res.status(500).json({ message: error.message, error });
    }
  }

  async emailVerify(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;
      const user = await emailService.emailVerify(email, otp);
      res.json(user);
    } catch (error: any) {
      console.log("Email Error")
      res.status(500).json({ message: error.message, error });
    }
  }

  async resendVerificationCode(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const user = await emailService.resendVerificationCode(email);
      res.json(user);
    } catch (error: any) {
      console.log("Email Error")
      res.status(500).json({ message: error.message, error });
    }
  }

  async emailLogin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await emailService.emailLogin(email, password);
      res.json(user);
    } catch (error: any) {
      console.log("Email Error")
      res.status(500).json({ message: error.message, error });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const result = await emailService.forgotPassword(email);
      res.json(result);
    } catch (error: any) {
      console.log("forgot password Error");
      res.status(500).json({ message: error.message, error })
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { password, token } = req.body;
      if (!password || !token) {
        return res.status(401).json({ message: 'UserId, password or token not found' });
      }
      const result = await emailService.resetPassword(password, token);
      res.json(result);
    } catch (error: any) {
      console.log("reset password Error");
      res.status(500).json({ message: error.message, error })
    }
  }

  public connectRoblox = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const { robloxUserId, robloxUsername } = req.body;
      if (!robloxUserId || !robloxUsername) {
        return res.status(400).json({ message: 'Roblox User ID and Username are required' });
      }
      const user = await userService.updateProfile(req.user!.id, {
        robloxUserId,
        robloxUsername,
        robloxVerifiedAt: new Date(),
      });
      res.status(200).json({ user });
    } catch (error) {
      console.error('UserController.connectRoblox error:', error);
      res.status(500).json({ message: 'Failed to connect Roblox account' });
    }
  };
}
