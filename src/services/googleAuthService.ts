import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { v4 as uuidv4 } from 'uuid';

import { config } from '../config';
import { userDataAccess } from '../data-access';
import { generateReferralCode } from '../utils/referral';
import { AuthService } from './AuthService';

const { googleConfig, serverConfig } = config;

export class GoogleAuthService {
    private oauth2Client: OAuth2Client; // Using google-auth-library OAuth2Client for token verification
    private googleOAuth2Client: any; // Using googleapis OAuth2Client for authorization flow
    private authService: AuthService;

    private scopes = [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
        'openid'
    ];

    constructor() {
        if (!googleConfig.googleClientId || !googleConfig.googleClientSecret || !googleConfig.googleRedirectUri) {
            throw new Error('Google OAuth configuration is missing');
        }

        // OAuth2Client from google-auth-library for token verification
        this.oauth2Client = new OAuth2Client(googleConfig.googleClientId);

        // OAuth2Client from googleapis for authorization flow
        this.googleOAuth2Client = new google.auth.OAuth2(
            googleConfig.googleClientId,
            googleConfig.googleClientSecret,
            googleConfig.googleRedirectUri
        );
        this.authService = new AuthService();
    }

    async googleAuth(): Promise<string> {
        const url = this.googleOAuth2Client.generateAuthUrl({
            access_type: 'offline',
            prompt: 'consent',
            scope: this.scopes
        });
        return url;
    }

    async googleLogin(code: string) {
        try {
            // Exchange authorization code for tokens
            const { tokens } = await this.googleOAuth2Client.getToken(code);

            if (!tokens.id_token) {
                throw new Error('Missing Google id_token');
            }

            // Verify and decode the ID token
            const userInfo = await this.getGoogleUserInfo(tokens.id_token);

            if (!userInfo || !userInfo.email) {
                throw new Error('Invalid Google token - missing email');
            }

            const email = userInfo.email.toLowerCase();
            const googleId = userInfo.sub; // Google user ID
            const username = userInfo.name || email.split('@')[0];

            // Calculate token expiry
            const tokenExpiry = tokens.expiry_date
                ? new Date(tokens.expiry_date)
                : null;

            // Check if user exists by googleId first (most specific) - prevents duplicates
            let user: any = await userDataAccess.findOne({ googleId });

            // If not found by googleId, check by email
            if (!user) {
                user = await userDataAccess.findOne({ email });
                
                // If user exists by email but has different googleId, check for conflict
                if (user && user.googleId && user.googleId !== googleId) {
                    throw new Error('This email is already linked to a different Google account');
                }
            }

            if (user) {
                // Check if this email is already linked to a different Google account
                if (user.googleId && user.googleId !== googleId) {
                    throw new Error('This email is already linked to a different Google account');
                }

                // Update existing user with Google OAuth info
                const updateData: any = {
                    googleId: googleId,
                    googleAccessToken: tokens.access_token,
                    googleRefreshToken: tokens.refresh_token || user.googleRefreshToken,
                    googleTokenExpiry: tokenExpiry,
                    emailVerified: userInfo.email_verified !== false ? true : user.emailVerified,
                    lastLoginAt: new Date(),
                };

                // If user doesn't have a password hash and this is a Google OAuth account, ensure it's set
                if (!user.passwordHash) {
                    updateData.passwordHash = '';
                }

                const updatedUser = await userDataAccess.findOneAndUpdate(
                    { id: user.id },
                    updateData,
                    { new: true }
                );

                if (!updatedUser) {
                    throw new Error('Failed to update user');
                }

                // Use AuthService to build proper auth response
                return this.authService.buildAuthResponse(updatedUser);
            } else {
                // Double-check email doesn't exist (race condition protection)
                // This prevents duplicate creation if multiple requests come in simultaneously
                const existingUser = await userDataAccess.findOne({ email });
                if (existingUser) {
                    // User was created between checks, update instead of creating new
                    const updateData: any = {
                        googleId: googleId,
                        googleAccessToken: tokens.access_token,
                        googleRefreshToken: tokens.refresh_token || existingUser.googleRefreshToken,
                        googleTokenExpiry: tokenExpiry,
                        emailVerified: userInfo.email_verified !== false ? true : existingUser.emailVerified,
                        lastLoginAt: new Date(),
                    };

                    if (!existingUser.passwordHash) {
                        updateData.passwordHash = '';
                    }

                    const updatedUser = await userDataAccess.findOneAndUpdate(
                        { id: existingUser.id },
                        updateData,
                        { new: true }
                    );

                    if (!updatedUser) {
                        throw new Error('Failed to update user');
                    }

                    return this.authService.buildAuthResponse(updatedUser);
                }

                // Create new user only if they truly don't exist
                const uniqueUsername = await this.generateUniqueUsername(username, email);
                const newUser = await userDataAccess.create({
                    id: uuidv4(),
                    username: uniqueUsername,
                    email: email,
                    passwordHash: '', // No password for Google OAuth users
                    googleId: googleId,
                    googleAccessToken: tokens.access_token,
                    googleRefreshToken: tokens.refresh_token,
                    googleTokenExpiry: tokenExpiry,
                    emailVerified: userInfo.email_verified || false,
                    referralCode: generateReferralCode(),
                    isBanned: false,
                    isVerifiedSeller: false,
                    lastLoginAt: new Date(),
                } as any);

                // Use AuthService to build proper auth response
                return this.authService.buildAuthResponse(newUser);
            }
        } catch (error: any) {
            console.error('GoogleAuthService.googleLogin error:', error);

            // Provide more specific error messages
            if (error.message?.includes('already linked')) {
                throw new Error('This email is already linked to a different Google account');
            }
            if (error.message?.includes('token')) {
                throw new Error('Invalid Google authentication token. Please try again.');
            }
            if (error.message?.includes('email')) {
                throw new Error('Google account email is required but not provided');
            }

            throw new Error(error.message || 'Google authentication failed. Please try again.');
        }
    }

    private async generateUniqueUsername(baseUsername: string, email: string): Promise<string> {
        let username = baseUsername.replace(/[^a-zA-Z0-9_]/g, '').substring(0, 20);
        if (username.length < 3) {
            username = email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '').substring(0, 20);
        }
        if (username.length < 3) {
            username = 'user';
        }

        let finalUsername = username;
        let counter = 1;

        while (await userDataAccess.findOne({ username: finalUsername })) {
            const suffix = counter.toString();
            const maxLength = 20 - suffix.length;
            finalUsername = `${username.substring(0, maxLength)}${suffix}`;
            counter++;
            if (counter > 1000) {
                // Fallback to UUID-based username
                finalUsername = `user_${uuidv4().substring(0, 8)}`;
                break;
            }
        }

        return finalUsername;
    }

    private async getGoogleUserInfo(idToken: string) {
        try {
            // Use OAuth2Client from google-auth-library to verify the token
            const ticket = await this.oauth2Client.verifyIdToken({
                idToken,
                audience: googleConfig.googleClientId,
            });

            const payload = ticket.getPayload();
            if (!payload) {
                throw new Error('Invalid token payload');
            }
            return payload;
        } catch (error: any) {
            console.error('GoogleAuthService.getGoogleUserInfo error:', error);
            throw new Error('Failed to verify Google token: ' + (error.message || 'Unknown error'));
        }
    }
}
