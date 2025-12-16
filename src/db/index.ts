import Mongoose from "mongoose";
import { config } from "../config";

const { mongodbUri } = config;

export const dbConnect = async () => {
    try {
        await Mongoose.connect(mongodbUri);
        console.log('Connected to MongoDB successfully');
        return true;
    } catch (err: any) {
        console.error("Error connecting to MongoDB:", err.message);
        return false;
    }
}