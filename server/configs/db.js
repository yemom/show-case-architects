import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error("MONGODB_URI is not defined in environment variables");
        }
        console.log("Attempting to connect to MongoDB...");
        await mongoose.connect(mongoUri);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        console.error("Make sure your MONGODB_URI is correct and your IP is whitelisted in MongoDB Atlas");
        process.exit(1); // Exit the process with failure
    }
}

export default connectDB;