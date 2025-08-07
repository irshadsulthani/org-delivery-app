// src/infrastructure/database/schemas/retailerShopModel.ts
import mongoose, { Document, Schema, Types } from 'mongoose';
import { Review } from '../../../domain/entities/RetailerShop';

interface Location {
  type: string;
  coordinates: [number, number]; // [longitude, latitude]
}

interface RetailerShopDoc extends Document {
  userId: Types.ObjectId;
  shopName: string;
  description: string;
  phone: string;
  address: string;
  location: Location;
  openingTime: string;
  closingTime: string;
  isActive: boolean;
  shopImageUrl?: string;
  shopLicenseUrl?: string;
  rating?: number;
  reviews?: Review[] // You can create a `Review` interface for better typing
  verificationStatus?: 'pending' | 'approved' | 'rejected';
  isVerified?: boolean;
}


const retailerShopSchema = new Schema<RetailerShopDoc>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  shopName: { type: String, required: true },
  description: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  openingTime: { type: String, required: true },
  closingTime: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  shopImageUrl: { type: String },
  shopLicenseUrl: { type: String },
  rating: { type: Number, default: 0 },
  reviews: [{ type: Schema.Types.Mixed }],
  verificationStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

// Create 2dsphere index for geospatial queries
retailerShopSchema.index({ location: '2dsphere' });

export const RetailerShopModel = mongoose.model<RetailerShopDoc>('RetailerShop', retailerShopSchema);