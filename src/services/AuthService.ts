import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { v4 as uuid } from 'uuid';

import { config } from '../config';
import { userDataAccess } from '../data-access';
import { generateReferralCode } from '../utils/referral';

const googleClient = new OAuth2Client(config.googleClientId || undefined);

export class AuthService {
  async register(username: string, email: string, password: string) {
    const existing = await userDataAccess.findOne({ email: email.toLowerCase() } as any);
    if (existing) {
      throw new Error('Email already in use');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const id = uuid();
    const referralCode = generateReferralCode();
    const user = await userDataAccess.create({
      id,
      username,
      email: email.toLowerCase(),
      passwordHash,
      referralCode,
    } as any);
    return this.buildAuthResponse(user);
  }

  async login(identifier: string, password: string) {
    const lowered = identifier.toLowerCase();
    let user = await userDataAccess.findOne({ email: lowered } as any);
    if (!user) user = await userDataAccess.findOne({ username: lowered } as any);
    if (!user) throw new Error('Invalid email/username.');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new Error('Invalid password.');
    if (user.isBanned) throw new Error('Your account has been banned. Please contact support.');
    return this.buildAuthResponse(user);
  }

  async loginWithGoogle(idToken: string) {
    if (!config.googleClientId) throw new Error('Google login is not configured');

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: config.googleClientId,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email)
      throw new Error('Invalid Google token');

    const email = payload.email.toLowerCase();
    const username = payload.name || email.split('@')[0];

    let user = await userDataAccess.findOne({ email } as any);
    if (!user) {
      const referralCode = generateReferralCode();
      user = await userDataAccess.create({
        email,
        username,
        passwordHash: '',
        referralCode,
      } as any);
    }

    if (user.isBanned)
      throw new Error('User is banned');

    return this.buildAuthResponse(user);
  }

  private buildAuthResponse(user: any) {
    const signOptions: SignOptions = { expiresIn: config.jwtExpiresIn as SignOptions['expiresIn'] };
    const token = jwt.sign({ id: user.id }, config.jwtSecret as string, signOptions);
    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isBanned: user.isBanned,
        createdAt: user.createdAt,
      },
    };
  }
}
