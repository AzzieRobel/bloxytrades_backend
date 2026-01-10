import jwt, { SignOptions } from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcryptjs';

import { config } from '../config';
import { userDataAccess } from '../data-access';
import { generateReferralCode } from '../utils/referral';

const { googleConfig, serverConfig } = config;
const googleClient = new OAuth2Client(googleConfig.googleClientId || undefined);

export class AuthService {
  async register(username: string, email: string, password: string) {
    const existing = await userDataAccess.findOne({ email: email.toLowerCase() });
    if (existing) throw new Error('Email already in use');

    const passwordHash = await bcrypt.hash(password, 10);
    const referralCode = generateReferralCode();
    const user = await userDataAccess.create({
      id: uuid(),
      username,
      email: email.toLowerCase(),
      passwordHash,
      referralCode,
    });

    return this.buildAuthResponse(user);
  }

  async login(identifier: string, password: string) {
    const lowered = identifier.toLowerCase();
    let user = await userDataAccess.findOne({ email: lowered });
    if (!user) user = await userDataAccess.findOne({ username: lowered });
    if (!user) throw new Error('Invalid email/username.');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new Error('Invalid password.');
    if (user.isBanned) throw new Error('Your account has been banned. Please contact support.');
    return this.buildAuthResponse(user);
  }

  async loginWithGoogle(idToken: string) {
    if (!googleConfig.googleClientId) throw new Error('Google login is not configured');

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: googleConfig.googleClientId,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email)
      throw new Error('Invalid Google token');

    const email = payload.email.toLowerCase();
    const username = payload.name || email.split('@')[0];

    let user = await userDataAccess.findOne({ email });
    if (!user) {
      const referralCode = generateReferralCode();
      user = await userDataAccess.create({
        email,
        username,
        passwordHash: '',
        referralCode,
      });
    }

    if (user.isBanned)
      throw new Error('User is banned');

    return this.buildAuthResponse(user);
  }

  buildAuthResponse(user: any) {
    const signOptions: SignOptions = { expiresIn: serverConfig.jwtExpiresIn as SignOptions['expiresIn'] };
    const token = jwt.sign({ id: user.id }, serverConfig.jwtSecret as string, signOptions);
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
