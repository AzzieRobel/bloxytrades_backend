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

      const data = await this.listingService.listAll({
        sort: typeof sort === 'string' ? (sort as 'newest') : 'newest',
        limit: parsedLimit,
        cursorCreatedAt: typeof cursorCreatedAt === 'string' ? cursorCreatedAt : undefined,
        cursorId: typeof cursorId === 'string' ? cursorId : undefined,
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

