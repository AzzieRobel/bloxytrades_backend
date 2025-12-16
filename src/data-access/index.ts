import { BasicDataAccess } from "./basic";
import { Users } from "../models/User";
import { Buyers } from "../models/Buyer";
import { Sellers } from "../models/Seller";
import { Listings } from "../models/Listing";
import { Orders } from "../models/Order";
import { Disputes } from "../models/Disputes";

const userDataAccess = new BasicDataAccess(Users);
const buyerDataAccess = new BasicDataAccess(Buyers);
const sellerDataAccess = new BasicDataAccess(Sellers);
const listingDataAccess = new BasicDataAccess(Listings);
const orderDataAccess = new BasicDataAccess(Orders);
const disputeDataAccess = new BasicDataAccess(Disputes);

export {
  userDataAccess,
  buyerDataAccess,
  sellerDataAccess,
  listingDataAccess,
  orderDataAccess,
  disputeDataAccess,
}