import { BasicDataAccess } from "./basic";
import { Users } from "../models/Users";
import { Buyers } from "../models/Buyer";
import { SellerProfile } from "../models/SellerProfile";
import { Listing } from "../models/Listing";
import { Orders } from "../models/Order";
import { Disputes } from "../models/Disputes";

const userDataAccess = new BasicDataAccess(Users);
const buyerDataAccess = new BasicDataAccess(Buyers);
const sellerProfileDataAccess = new BasicDataAccess(SellerProfile);
const listingDataAccess = new BasicDataAccess(Listing);
const orderDataAccess = new BasicDataAccess(Orders);
const disputeDataAccess = new BasicDataAccess(Disputes);

export {
  userDataAccess,
  buyerDataAccess,
  sellerProfileDataAccess,
  listingDataAccess,
  orderDataAccess,
  disputeDataAccess,
}