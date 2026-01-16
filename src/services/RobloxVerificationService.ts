import axios from 'axios';
import { RobloxVerification } from '../models/RobloxVerification';

export class RobloxVerificationService {
    /**
     * Generate a unique verification code
     */
    private generateVerificationCode(): string {
        // Format: RBX-XXXXX (5 random alphanumeric characters)
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude confusing chars (0, O, I, 1)
        const code = Array.from({ length: 5 }, () => 
            chars[Math.floor(Math.random() * chars.length)]
        ).join('');
        return `RBX-${code}`;
    }

    /**
     * Resolve Roblox username to User ID
     */
    async resolveUsernameToUserId(username: string): Promise<{
        userId: string;
        username: string;
        displayName?: string;
    }> {
        try {
            const response = await axios.post(
                'https://users.roblox.com/v1/usernames/users',
                { 
                    usernames: [username],
                    excludeBannedUsers: false 
                },
                { timeout: 10000 }
            );

            if (!response.data.data || response.data.data.length === 0) {
                throw new Error('Roblox username not found');
            }

            const user = response.data.data[0];
            return {
                userId: user.id.toString(),
                username: user.name,
                displayName: user.displayName,
            };
        } catch (error: any) {
            if (error.response?.status === 404 || error.message?.includes('not found')) {
                throw new Error('Roblox username not found. Please check the spelling.');
            }
            throw new Error('Failed to resolve Roblox username');
        }
    }

    /**
     * Get user profile including description
     */
    async getUserProfile(userId: string): Promise<{
        userId: string;
        username: string;
        displayName?: string;
        description: string;
    }> {
        try {
            const response = await axios.get(
                `https://users.roblox.com/v1/users/${userId}`,
                { timeout: 10000 }
            );

            return {
                userId: response.data.id.toString(),
                username: response.data.name,
                displayName: response.data.displayName,
                description: response.data.description || '',
            };
        } catch (error: any) {
            if (error.response?.status === 404) {
                throw new Error('Roblox user not found');
            }
            throw new Error('Failed to fetch Roblox profile');
        }
    }

    /**
     * Initialize verification - generate code and store attempt
     */
    async initiateVerification(
        userId: string,
        robloxUsername: string
    ): Promise<{
        verificationId: string;
        verificationCode: string;
        robloxUserId: string;
        expiresAt: Date;
    }> {
        // Resolve username to User ID first
        const robloxUser = await this.resolveUsernameToUserId(robloxUsername);

        // Generate unique verification code
        let verificationCode: string;
        let isUnique = false;
        let attempts = 0;
        
        while (!isUnique && attempts < 10) {
            verificationCode = this.generateVerificationCode();
            const existing = await RobloxVerification.findOne({ verificationCode });
            if (!existing) {
                isUnique = true;
            }
            attempts++;
        }

        if (!isUnique) {
            throw new Error('Failed to generate unique verification code. Please try again.');
        }

        // Set expiration (24 hours from now)
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        // Store verification attempt
        const verification = await RobloxVerification.create({
            userId,
            robloxUsername: robloxUser.username,
            robloxUserId: robloxUser.userId,
            verificationCode: verificationCode!,
            status: 'pending',
            expiresAt,
        });

        return {
            verificationId: verification._id.toString(),
            verificationCode: verification.verificationCode,
            robloxUserId: robloxUser.userId,
            expiresAt: verification.expiresAt,
        };
    }

    /**
     * Verify the code exists in user's profile
     */
    async verifyCode(
        verificationId: string,
        userId: string
    ): Promise<{
        success: boolean;
        robloxUserId?: string;
        robloxUsername?: string;
        error?: string;
    }> {
        try {
            // Load verification attempt
            const verification = await RobloxVerification.findOne({
                _id: verificationId,
                userId, // Ensure user owns this verification
            });

            if (!verification) {
                return {
                    success: false,
                    error: 'Verification attempt not found or unauthorized',
                };
            }

            // Check if expired
            if (new Date() > verification.expiresAt) {
                await RobloxVerification.updateOne(
                    { _id: verificationId },
                    { status: 'expired' }
                );
                return {
                    success: false,
                    error: 'Verification code has expired. Please generate a new one.',
                };
            }

            // Check if already verified
            if (verification.status === 'verified') {
                return {
                    success: true,
                    robloxUserId: verification.robloxUserId!,
                    robloxUsername: verification.robloxUsername,
                };
            }

            // Fetch user profile
            const profile = await this.getUserProfile(verification.robloxUserId!);

            // Check if code exists in description (case-sensitive, exact match)
            // Escape special regex characters in the code
            const escapedCode = verification.verificationCode.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const codePattern = new RegExp(`\\b${escapedCode}\\b`);
            
            if (!codePattern.test(profile.description)) {
                // Code not found - allow retry
                return {
                    success: false,
                    error: 'Verification code not found in your Roblox profile description. Please make sure you pasted the code exactly as shown and saved your profile.',
                };
            }

            // Verification successful!
            await RobloxVerification.updateOne(
                { _id: verificationId },
                {
                    status: 'verified',
                    verifiedAt: new Date(),
                }
            );

            return {
                success: true,
                robloxUserId: verification.robloxUserId!,
                robloxUsername: verification.robloxUsername,
            };
        } catch (error: any) {
            console.error('Verification error:', error);
            
            // Mark as failed
            await RobloxVerification.updateOne(
                { _id: verificationId },
                {
                    status: 'failed',
                    failureReason: error.message,
                }
            );

            return {
                success: false,
                error: error.message || 'Failed to verify code. Please try again.',
            };
        }
    }

    /**
     * Get pending verification for user
     */
    async getPendingVerification(userId: string): Promise<{
        verificationId: string;
        verificationCode: string;
        robloxUsername: string;
        expiresAt: Date;
    } | null> {
        const verification = await RobloxVerification.findOne({
            userId,
            status: 'pending',
            expiresAt: { $gt: new Date() },
        }).sort({ createdAt: -1 });

        if (!verification) return null;

        return {
            verificationId: verification._id.toString(),
            verificationCode: verification.verificationCode,
            robloxUsername: verification.robloxUsername,
            expiresAt: verification.expiresAt,
        };
    }

    /**
     * Cancel pending verification
     */
    async cancelVerification(verificationId: string, userId: string): Promise<void> {
        await RobloxVerification.updateOne(
            { _id: verificationId, userId },
            { status: 'expired' }
        );
    }

    /**
     * Legacy method - kept for backward compatibility but deprecated
     * @deprecated Use profile verification method instead
     */
    async verifyAccount(robloxUserId: string, robloxUsername: string): Promise<{
        isValid: boolean;
        verifiedUsername?: string;
        error?: string;
    }> {
        try {
            // Validate input format
            if (!/^\d+$/.test(robloxUserId)) {
                return {
                    isValid: false,
                    error: 'Invalid Roblox User ID format'
                };
            }

            // Get user by ID
            const userByIdResponse = await axios.get(
                `https://users.roblox.com/v1/users/${robloxUserId}`,
                { timeout: 10000 }
            );
            
            const actualUsername = userByIdResponse.data.name;
            
            // Case-insensitive comparison (Roblox usernames are case-insensitive)
            if (actualUsername.toLowerCase() !== robloxUsername.toLowerCase()) {
                return {
                    isValid: false,
                    error: 'Username does not match User ID'
                };
            }

            // Verify user exists by username as well (double-check)
            const usernameResponse = await axios.post(
                'https://users.roblox.com/v1/usernames/users',
                { usernames: [robloxUsername], excludeBannedUsers: false },
                { timeout: 10000 }
            );

            if (usernameResponse.data.data.length === 0) {
                return {
                    isValid: false,
                    error: 'Username not found'
                };
            }

            const userByUsername = usernameResponse.data.data[0];
            if (userByUsername.id.toString() !== robloxUserId.toString()) {
                return {
                    isValid: false,
                    error: 'User ID mismatch'
                };
            }

            return {
                isValid: true,
                verifiedUsername: actualUsername
            };
        } catch (error: any) {
            console.error('Roblox verification error:', error);
            if (error.response?.status === 404) {
                return {
                    isValid: false,
                    error: 'Roblox account not found'
                };
            }
            if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
                return {
                    isValid: false,
                    error: 'Request timeout. Please try again.'
                };
            }
            return {
                isValid: false,
                error: 'Failed to verify Roblox account. Please try again.'
            };
        }
    }
}
