import { buyerDataAccess } from '../data-access';

export class BuyerService {
  async getProfile(userId: string) {
    return buyerDataAccess.findOne({ userId });
  }

  async upsertProfile(userId: string, payload: Record<string, unknown>) {
    return buyerDataAccess.findOneAndUpdate(
      { userId } as any,
      { userId, profile: payload } as any,
      { upsert: true, new: true }
    );
  }
}

