import { userDataAccess } from '../data-access';

export class UserService {
  async getProfile(userId: string) {
    // projection excludes passwordHash
    return userDataAccess.findById(userId, '-passwordHash');
  }

  async updateProfile(userId: string, payload: Record<string, unknown>) {
    const allowed = ['email'];
    const updates: Record<string, unknown> = {};
    for (const key of allowed) {
      if (payload[key] !== undefined) {
        updates[key] = payload[key];
      }
    }
    // use options to request latest document; projection still excludes passwordHash
    return userDataAccess.updateById(userId, updates, { new: true, select: '-passwordHash' as any });
  }
}

