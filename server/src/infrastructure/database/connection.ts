import { config } from './../../config/index';
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

export const connectDB = async () => {
    try {
      if (!config.mongoUri) {
        throw new Error('MongoDB URI is not defined in the configuration');
      }
      await mongoose.connect(config.clusterUri as string);
      console.log('✅ Connected to MongoDB');
    } catch (err) {
      console.error('❌ MongoDB connection error:', err);
      process.exit(1); // optional: exit the app if DB fails
    }
  };