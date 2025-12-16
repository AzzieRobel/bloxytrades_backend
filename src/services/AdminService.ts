import { userDataAccess, orderDataAccess, listingDataAccess } from '../data-access';

export class AdminService {
  async getStats() {
    const [users, orders, listings] = await Promise.all([
      userDataAccess.count(),
      orderDataAccess.count(),
      listingDataAccess.count(),
    ]);
    return { users, orders, listings };
  }

  async banUser(id: string) {
    return userDataAccess.updateById(id, { banned: true } as any, { new: true, select: '-passwordHash' as any });
  }
}

