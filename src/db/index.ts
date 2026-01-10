import Mongoose from "mongoose";
import { config } from "../config";
import { Listing } from "../models/Listing";

const { serverConfig } = config;

export const dbConnect = async () => {
    try {
        await Mongoose.connect(serverConfig.mongodbUri);
        console.log('Connected to MongoDB successfully');

        // Ensure important indexes exist (id + createdAt based pagination)
        try {
            await Listing.collection.createIndex({ isActive: 1, createdAt: -1, id: -1 });
            await Listing.collection.createIndex({ sellerId: 1, isActive: 1, createdAt: -1, id: -1 });
        } catch (indexErr: any) {
            console.error("Error ensuring Listing indexes:", indexErr.message || indexErr);
        }

        return true;
    } catch (err: any) {
        console.error("Error connecting to MongoDB:", err.message);
        return false;
    }
}