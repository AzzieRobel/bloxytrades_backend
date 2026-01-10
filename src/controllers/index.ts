import { UserController } from './userController';
import { AuthController } from './authController';
import { ListingController } from './listingController';
import { DisputeController } from './disputeController';
import { AdminController } from './adminController';
import { SellerController } from './sellerController';
import { BuyerController } from './buyerController';
import { OrderController } from './orderController';
import { RobloxAssetsController } from './robloxAssetsController';

const userController = new UserController();
const authController = new AuthController();
const listingController = new ListingController();
const disputeController = new DisputeController();
const adminController = new AdminController();
const sellerController = new SellerController();
const buyerController = new BuyerController();
const orderController = new OrderController();
const robloxAssetsController = new RobloxAssetsController();

export {
  userController,
  authController,
  listingController,
  disputeController,
  adminController,
  sellerController,
  buyerController,
  orderController,
  robloxAssetsController,
};