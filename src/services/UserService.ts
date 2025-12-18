import bcrypt from 'bcryptjs';

import { userDataAccess } from '../data-access';

export class UserService {
  async getProfile(userId: string) {
    return await userDataAccess.findById(userId, '-passwordHash');
  }

  async updateProfile(data: { newEmail?: string, newUsername?: string, id: string }) {
    const { newEmail, newUsername, id } = data;

    const updateField: any = newEmail ? { email: newEmail } : { username: newUsername };
    await userDataAccess.updateById(id, updateField);
    return await userDataAccess.findById(id);
  }

  async changePassword(data: { id: string, currentPassword: string, newPassword: string }) {
    const { id, currentPassword, newPassword } = data;
    const user = await userDataAccess.findById(id);
    if (!user) throw new Error('User not found');
    const ok = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!ok) {
      throw new Error('Invalid current password');
    }
    const passwordHash = await bcrypt.hash(newPassword, 10);
    return await userDataAccess.updateById(id, { passwordHash }, { new: true });
  }
}
