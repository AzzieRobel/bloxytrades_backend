import { AdminService } from "./AdminService";
import { AuthService } from "./AuthService";
import { UserService } from "./UserService";
import { DisputeService } from "./DisputeService";
import { SellerService } from "./SellerService";
import { ListingService } from "./ListingService";
import { EmailService } from './emailService'
import { GoogleAuthService } from "./googleAuthService";
import { RobloxOpenCloudService } from "./RobloxOpenCloudService";
import { RobloxVerificationService } from "./RobloxVerificationService";

const adminService = new AdminService();
const authService = new AuthService();
const userService = new UserService();
const sellerService = new SellerService();
const listingService = new ListingService();
const disputeService = new DisputeService();
const emailService = new EmailService();
const googleAuthService = new GoogleAuthService();
const robloxOpenCloudService = new RobloxOpenCloudService();
const robloxVerificationService = new RobloxVerificationService();

export { adminService, authService, userService, sellerService, listingService, disputeService, emailService, googleAuthService, robloxOpenCloudService, robloxVerificationService };