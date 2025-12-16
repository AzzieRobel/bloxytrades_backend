import { disputeDataAccess } from '../data-access';

export class DisputeService {
  async createDispute(userId: string, payload: Record<string, unknown>) {
    return disputeDataAccess.create({ ...payload, openedBy: userId, status: 'open' });
  }

  async resolveDispute(id: string, resolution: 'refund_buyer' | 'release_seller', adminId: string) {
    return disputeDataAccess.updateById(
      id,
      {
        status: 'resolved',
        resolution: { decision: resolution, adminId, resolvedAt: new Date() },
      } as any,
      { new: true }
    );
  }
}

