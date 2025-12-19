import { listingDataAccess, orderDataAccess } from '../data-access';

export class OrderService {
  async createOrder(buyerId: string, payload: Record<string, unknown>) {
    const { listingId } = payload as { listingId: string };
    const listing = await listingDataAccess.findById(listingId);
    if (!listing) {
      throw new Error('Listing not found');
    }

    // Extract price - handle both object and number formats
    const priceValue = typeof listing.price === 'number' 
      ? listing.price 
      : (listing.price as any)?.usd || (listing.price as any)?.amount || 0;
    const price = Number(priceValue);
    const fee = Math.round(price * 0.1 * 100) / 100; // 10% fee

    return orderDataAccess.create({
      buyerId,
      sellerId: listing.sellerId,
      listingId,
      price,
      fee,
      status: 'pending',
    } as any);
  }

  async updateStatus(id: string, status: string) {
    return orderDataAccess.updateById(id, { status } as any, { new: true });
  }

  async getById(id: string) {
    return orderDataAccess.findById(id);
  }

  async listBySeller(sellerId: string) {
    return orderDataAccess.find({ sellerId } as any, null, { sort: { createdAt: -1 } });
  }
}

