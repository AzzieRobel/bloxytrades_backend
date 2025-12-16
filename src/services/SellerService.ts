import { orderDataAccess, sellerDataAccess } from '../data-access';

export class SellerService {
  async getProfile(userId: string) {
    return sellerDataAccess.findOne({ userId });
  }

  async upsertProfile(userId: string, payload: Record<string, unknown>) {
    return sellerDataAccess.findOneAndUpdate(
      { userId } as any,
      { userId, profile: payload } as any,
      { upsert: true, new: true }
    );
  }

  async getDashboard(userId: string) {
    const orders = await orderDataAccess.find({ sellerId: userId } as any, null, {
      sort: { createdAt: -1 },
    });

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const totalRevenue = orders.reduce((sum: number, o: any) => sum + (o.price || 0), 0);
    const totalTransactions = orders.length;

    const todaysOrders = orders.filter(
      (o: any) => new Date(o.createdAt) >= startOfDay
    );
    const todayRevenue = todaysOrders.reduce((sum: number, o: any) => sum + (o.price || 0), 0);
    const todayTransactions = todaysOrders.length;

    const recentOrders = orders.slice(0, 10).map((o: any) => ({
      id: o.id,
      listingId: o.listingId,
      price: o.price,
      fee: o.fee,
      status: o.status,
      createdAt: o.createdAt,
    }));

    return {
      stats: {
        todayTransactions,
        todayRevenue,
        totalTransactions,
        totalRevenue,
      },
      recentOrders,
    };
  }

  async getSalesHistory(userId: string) {
    return orderDataAccess.find({ sellerId: userId } as any, null, {
      sort: { createdAt: -1 },
    });
  }
}

