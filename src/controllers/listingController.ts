import { NextFunction, Request, Response } from 'express';
import { ListingService } from '../services/ListingService';

export class ListingController {
  private listingService: ListingService;

  constructor() {
    this.listingService = new ListingService();
  }

  getListings = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const { sort, limit, cursorCreatedAt, cursorId } = req.query;

      const parsedLimitRaw =
        typeof limit === 'string' ? parseInt(limit, 10) || 24 : 24;
      const parsedLimit = Math.min(Math.max(parsedLimitRaw, 1), 100);

      // Parse numeric price range
      const rawPriceMin = typeof req.query.priceMin === 'string' ? req.query.priceMin : undefined;
      const rawPriceMax = typeof req.query.priceMax === 'string' ? req.query.priceMax : undefined;

      const priceMin = rawPriceMin ? parseFloat(rawPriceMin) : undefined;
      const priceMax = rawPriceMax ? parseFloat(rawPriceMax) : undefined;

      // Parse payment method flags
      const parseBool = (val: unknown): boolean | undefined => {
        if (val === 'true' || val === '1') return true;
        if (val === 'false' || val === '0') return false;
        return undefined;
      };

      const paymentCrypto = parseBool(req.query.paymentCrypto);
      const paymentPaypal = parseBool(req.query.paymentPaypal);
      const paymentCard = parseBool(req.query.paymentCard);

      const data = await this.listingService.listAll({
        sort: typeof sort === 'string' ? (sort as 'newest' | 'price-high' | 'price-low') : 'newest',
        limit: parsedLimit,
        cursorCreatedAt: typeof cursorCreatedAt === 'string' ? cursorCreatedAt : undefined,
        cursorId: typeof cursorId === 'string' ? cursorId : undefined,
        priceMin: typeof priceMin === 'number' && !isNaN(priceMin) ? priceMin : undefined,
        priceMax: typeof priceMax === 'number' && !isNaN(priceMax) ? priceMax : undefined,
        paymentCrypto,
        paymentPaypal,
        paymentCard,
      });

      res.json(data);
    } catch (error) {
      console.error('ListingController.getListings error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  getMyListings = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const listings = await this.listingService.listBySeller(req.user!.id);
      res.json({ listings });
    } catch (error) {
      console.error('ListingController.getMyListings error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  createListing = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const payload = { ...req.body };
      const listing = await this.listingService.createListing(req.user!.id, payload);
      res.status(201).json({ listing });
    } catch (error) {
      console.error('ListingController.createListing error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  updateListing = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const { id } = req.params;
      const listing = await this.listingService.updateListing(id, req.body);
      res.json({ listing });
    } catch (error) {
      console.error('ListingController.updateListing error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  deleteListing = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.listingService.deleteListing(id);
      res.json({ message: 'Listing deleted successfully' });
    } catch (error) {
      console.error('ListingController.deleteListing error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
}

