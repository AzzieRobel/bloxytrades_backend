import { AdminService } from "./AdminService";
import { AuthService } from "./AuthService";
import { UserService } from "./UserService";
import { DisputeService } from "./DisputeService";

const adminService = new AdminService()
const authService = new AuthService()
const userService = new UserService()
const disputeService = new DisputeService()

export {
    adminService,
    authService,
    userService,
    disputeService
}