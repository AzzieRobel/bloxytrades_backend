import axios from 'axios';

export class RobloxVerificationService {
  /**
   * Verify that username matches the provided User ID
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

