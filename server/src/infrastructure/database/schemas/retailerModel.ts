// src/infrastructure/database/schemas/retailerShopModel.ts

import mongoose, { Schema, Document, Types } from 'mongoose';
import { RetailerShop } from '../../../domain/entities/RetailerShop';

interface RetailerShopDoc extends Document, Omit<RetailerShop, '_id'> {
  _id: Types.ObjectId;
}

const retailerShopSchema = new Schema<RetailerShopDoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    shopName: { type: String, required: true },
    description: { type: String },
    phone:String,

    shopImageUrl: { type: String, required: true }, 
    shopLicenseUrl: { type: String, required: true }, 

    address: {
      street: String,
      area: String,
      city: String,
      state: String,
      zipCode: {type:String, required:true},
      country: String,
    },

    rating: { type: Number, default: 0 },
    reviews: [
      {
        customerId: { type: Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number },
        comment: { type: String },
        date: { type: Date, default: Date.now },
      },
    ],

    isVerified: { type: Boolean, default: false },
    verificationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export const RetailerShopModel = mongoose.model<RetailerShopDoc>('RetailerShop', retailerShopSchema);