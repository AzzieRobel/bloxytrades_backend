import { listingDataAccess } from '../data-access';

export class ListingService {
  async listAll() {
    return listingDataAccess.find();
  }

  async listBySeller(sellerId: string) {
    return listingDataAccess.find({ sellerId } as any);
  }

  async createListing(sellerId: string, payload: Record<string, unknown>) {
    return listingDataAccess.create({ ...payload, sellerId });
  }

  async updateListing(id: string, payload: Record<string, unknown>) {
    return listingDataAccess.updateById(id, payload, { new: true });
  }

  async deleteListing(id: string) {
    return listingDataAccess.deleteById(id);
  }
}

