import { listingDataAccess } from '../data-access';

interface ListAllOptions {
  sort?: 'newest' | 'price-high' | 'price-low';
  limit?: number;
  cursorCreatedAt?: string;
  cursorId?: string;
  priceMin?: number;
  priceMax?: number;
  paymentCrypto?: boolean;
  paymentPaypal?: boolean;
  paymentCard?: boolean;
}

const ALLOWED_SORTS = ['newest', 'price-high', 'price-low'] as const;
type AllowedSort = (typeof ALLOWED_SORTS)[number];

export class ListingService {
  /**
   * List active listings for the public market view with cursor-based pagination
   * and optional price / payment filters.
   */
  async listAll(options: ListAllOptions = {}) {
    const {
      sort = 'newest',
      limit = 24,
      cursorCreatedAt,
      cursorId,
      priceMin,
      priceMax,
      paymentCrypto,
      paymentPaypal,
      paymentCard,
    } = options;

    const sortValue: AllowedSort = ALLOWED_SORTS.includes(sort as any)
      ? (sort as AllowedSort)
      : 'newest';

    const safeLimit = Math.min(Math.max(limit, 1), 100);

    const baseFilter: any = { isActive: true };

    // Price range filter on price.USD (seed data uses USD key)
    const priceFilter: any = {};
    if (typeof priceMin === 'number') priceFilter.$gte = priceMin;
    if (typeof priceMax === 'number') priceFilter.$lte = priceMax;
    if (Object.keys(priceFilter).length > 0) {
      baseFilter['price.USD'] = priceFilter;
    }

    // Payment method filters: if any are selected, require at least one to match
    const paymentClauses: any[] = [];
    if (paymentCrypto) {
      paymentClauses.push({ 'acceptedPayments.crypto': true });
    }
    if (paymentPaypal) {
      paymentClauses.push({ 'acceptedPayments.paypal': true });
    }
    if (paymentCard) {
      paymentClauses.push({
        $or: [
          { 'acceptedPayments.card': true },
          { 'acceptedPayments.stripe': true },
        ],
      });
    }

    let filter: any = { ...baseFilter };
    if (paymentClauses.length > 0) {
      filter = {
        ...baseFilter,
        $or: paymentClauses,
      };
    }

    let sortOption: any = {};

    if (sortValue === 'newest') {
      sortOption = { createdAt: -1, id: -1 };

      if (cursorCreatedAt && cursorId) {
        const cursorDate = new Date(cursorCreatedAt);
        filter = {
          ...filter,
          $or: [
            { createdAt: { $lt: cursorDate } },
            { createdAt: cursorDate, id: { $lt: cursorId } },
          ],
        };
      }
    } else if (sortValue === 'price-high') {
      sortOption = { 'price.USD': -1, createdAt: -1, id: -1 };
    } else if (sortValue === 'price-low') {
      sortOption = { 'price.USD': 1, createdAt: -1, id: -1 };
    }

    const limitPlusOne = safeLimit + 1;

    const results = await listingDataAccess.find(
      filter,
      null,
      {
        sort: sortOption,
        limit: limitPlusOne,
      }
    );

    const hasMore = results.length > safeLimit;
    const listings = hasMore ? results.slice(0, safeLimit) : results;

    let nextCursor: { createdAt: string; id: string } | null = null;
    if (hasMore && listings.length > 0) {
      const last = listings[listings.length - 1] as any;
      if (last?.createdAt && last?.id) {
        nextCursor = {
          createdAt: new Date(last.createdAt).toISOString(),
          id: last.id,
        };
      }
    }

    return {
      listings,
      nextCursor,
      hasMore,
    };
  }

  async listBySeller(sellerId: string) {
    // Only return active listings for public view
    return listingDataAccess.find({ sellerId, isActive: true } as any);
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

