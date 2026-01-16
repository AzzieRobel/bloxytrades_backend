import { NextFunction, Request, Response } from 'express';
import { userService, emailService, googleAuthService, robloxVerificationService, robloxOpenCloudService } from '../services';

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

  /**
   * Legacy endpoint - kept for backward compatibility
   * @deprecated Use profile verification endpoints instead
   */
  public connectRoblox = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const { robloxUserId, robloxUsername } = req.body;
      if (!robloxUserId || !robloxUsername) {
        return res.status(400).json({ message: 'Roblox User ID and Username are required' });
      }

      // Verify account
      const verification = await robloxVerificationService.verifyAccount(
        robloxUserId,
        robloxUsername
      );

      if (!verification.isValid) {
        return res.status(400).json({ 
          message: verification.error || 'Failed to verify Roblox account' 
        });
      }

      // Update user with verified account
      const user = await userService.updateProfile(req.user!.id, {
        robloxUserId,
        robloxUsername: verification.verifiedUsername || robloxUsername,
        robloxVerifiedAt: new Date(),
      });

      res.status(200).json({ user });
    } catch (error) {
      console.error('UserController.connectRoblox error:', error);
      res.status(500).json({ message: 'Failed to connect Roblox account' });
    }
  };

  /**
   * Initialize Roblox profile verification
   * POST /users/roblox/verify/initiate
   */
  public initiateRobloxVerification = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const { robloxUsername } = req.body;
      
      if (!robloxUsername || !robloxUsername.trim()) {
        return res.status(400).json({ 
          message: 'Roblox username is required' 
        });
      }

      const result = await robloxVerificationService.initiateVerification(
        req.user!.id,
        robloxUsername.trim()
      );

      res.json({
        verificationId: result.verificationId,
        verificationCode: result.verificationCode,
        robloxUserId: result.robloxUserId,
        expiresAt: result.expiresAt,
        instructions: `Please copy the code "${result.verificationCode}" and paste it into your Roblox profile "About" section, then click Verify.`
      });
    } catch (error: any) {
      console.error('Initiate verification error:', error);
      res.status(400).json({ 
        message: error.message || 'Failed to initiate verification' 
      });
    }
  };

  /**
   * Verify the code in Roblox profile
   * POST /users/roblox/verify/check
   */
  public verifyRobloxCode = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const { verificationId } = req.body;
      
      if (!verificationId) {
        return res.status(400).json({ 
          message: 'Verification ID is required' 
        });
      }

      const result = await robloxVerificationService.verifyCode(
        verificationId,
        req.user!.id
      );

      if (!result.success) {
        return res.status(400).json({ 
          message: result.error || 'Verification failed' 
        });
      }

      // Link the Roblox account to user
      const user = await userService.updateProfile(req.user!.id, {
        robloxUserId: result.robloxUserId!,
        robloxUsername: result.robloxUsername!,
        robloxVerifiedAt: new Date(),
      });

      res.json({ 
        success: true,
        message: 'Roblox account verified and connected successfully!',
        user 
      });
    } catch (error: any) {
      console.error('Verify code error:', error);
      res.status(500).json({ 
        message: error.message || 'Failed to verify code' 
      });
    }
  };

  /**
   * Get pending verification for current user
   * GET /users/roblox/verify/pending
   */
  public getPendingRobloxVerification = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const pending = await robloxVerificationService.getPendingVerification(req.user!.id);
      
      if (!pending) {
        return res.json({ pending: null });
      }

      res.json({ pending });
    } catch (error) {
      console.error('Get pending verification error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  /**
   * Cancel pending verification
   * POST /users/roblox/verify/cancel
   */
  public cancelRobloxVerification = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const { verificationId } = req.body;
      
      if (!verificationId) {
        return res.status(400).json({ message: 'Verification ID is required' });
      }

      await robloxVerificationService.cancelVerification(
        verificationId,
        req.user!.id
      );

      res.json({ message: 'Verification cancelled' });
    } catch (error) {
      console.error('Cancel verification error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public getMyRobloxAssets = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const user = await userService.getProfile(req.user!.id);
      
      if (!user.robloxUserId || !user.robloxVerifiedAt) {
        return res.status(400).json({ 
          message: 'Roblox account not connected or verified. Please connect your Roblox account first.' 
        });
      }

      const limit = Number(req.query.limit) || 50;
      const cursor = req.query.cursor as string | undefined;
      const assetTypeId = Number(req.query.assetTypeId) || 1; // Default to Image assets (Limiteds)

      console.log(`Fetching inventory for user ${user.robloxUserId}, assetTypeId: ${assetTypeId}`);

      const inventory = await robloxOpenCloudService.getUserInventory(
        user.robloxUserId,
        assetTypeId,
        limit,
        cursor
      );

      console.log(`Found ${inventory.assets.length} assets`);

      res.json({
        assets: inventory.assets,
        nextCursor: inventory.nextCursor
      });
    } catch (error: any) {
      console.error('Error fetching Roblox assets:', error);
      const statusCode = error.message?.includes('private') ? 403 
        : error.message?.includes('not found') ? 404 
        : 500;
      
      res.status(statusCode).json({ 
        message: error.message || 'Failed to fetch Roblox assets' 
      });
    }
  };
}
