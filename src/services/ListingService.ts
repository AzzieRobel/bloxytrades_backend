import { listingDataAccess } from '../data-access';

interface ListAllOptions {
  sort?: 'newest';
  limit?: number;
  cursorCreatedAt?: string;
  cursorId?: string;
}

const ALLOWED_SORTS = ['newest'] as const;
type AllowedSort = (typeof ALLOWED_SORTS)[number];

export class ListingService {
  /**
   * List active listings for the public market view with cursor-based pagination.
   * Uses createdAt + id as the cursor (no Mongo _id usage).
   */
  async listAll(options: ListAllOptions = {}) {
    const {
      sort = 'newest',
      limit = 24,
      cursorCreatedAt,
      cursorId,
    } = options;

    // Validate sort
    const sortValue: AllowedSort = ALLOWED_SORTS.includes(sort as any)
      ? (sort as AllowedSort)
      : 'newest';

    // Clamp limit to sane bounds
    const safeLimit = Math.min(Math.max(limit, 1), 100);

    const baseFilter: any = { isActive: true };
    let filter: any = { ...baseFilter };
    let sortOption: any = {};

    if (sortValue === 'newest') {
      sortOption = { createdAt: -1, id: -1 };

      if (cursorCreatedAt && cursorId) {
        const cursorDate = new Date(cursorCreatedAt);
        // Fetch documents strictly older than the cursor in sort order
        filter = {
          ...baseFilter,
          $or: [
            { createdAt: { $lt: cursorDate } },
            { createdAt: cursorDate, id: { $lt: cursorId } },
          ],
        };
      }
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

