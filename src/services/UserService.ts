import bcrypt from 'bcryptjs';

import { userDataAccess } from '../data-access';

export class UserService {
  async getProfile(userId: string) {
    return await userDataAccess.findById(userId, '-passwordHash');
  }

  async updateProfile(userId: string, data: { newEmail?: string, newUsername?: string, robloxUserId?: string, robloxUsername?: string, robloxVerifiedAt?: Date }) {
    const { newEmail, newUsername, robloxUserId, robloxUsername, robloxVerifiedAt } = data;

    const updateField: any = {};
    if (newEmail) updateField.email = newEmail;
    if (newUsername) updateField.username = newUsername;
    if (robloxUserId) updateField.robloxUserId = robloxUserId;
    if (robloxUsername) updateField.robloxUsername = robloxUsername;
    if (robloxVerifiedAt) updateField.robloxVerifiedAt = robloxVerifiedAt;

    if (Object.keys(updateField).length === 0) {
      throw new Error('No valid fields to update');
    }

    await userDataAccess.updateById(userId, updateField);
    return await userDataAccess.findById(userId);
  }

  async changePassword(userId: string, data: { currentPassword: string, newPassword: string }) {
    const { currentPassword, newPassword } = data;
    const user = await userDataAccess.findById(userId);
    if (!user) throw new Error('User not found');
    const ok = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!ok) {
      throw new Error('Invalid current password');
    }
    const passwordHash = await bcrypt.hash(newPassword, 10);
    return await userDataAccess.updateById(userId, { passwordHash }, { new: true });
  }
}
