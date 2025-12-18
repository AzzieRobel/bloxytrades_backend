import { AdminService } from "./AdminService";
import { AuthService } from "./AuthService";
import { UserService } from "./UserService";
import { DisputeService } from "./DisputeService";
import { SellerService } from "./SellerService";
import { ListingService } from "./ListingService";

const adminService = new AdminService();
const authService = new AuthService();
const userService = new UserService();
const sellerService = new SellerService();
const listingService = new ListingService();
const disputeService = new DisputeService();

export { adminService, authService, userService, sellerService, listingService, disputeService };