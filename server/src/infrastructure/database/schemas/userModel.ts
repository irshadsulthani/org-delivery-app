// src/infrastructure/database/schemas/userModel.ts
import mongoose, { Document, Schema, Types } from 'mongoose';
import { User } from '../../../domain/entities/User';

interface UserDoc extends Omit<User, '_id'>, Document {
  _id: Types.ObjectId;
}

const userSchema = new Schema<UserDoc>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: String,
    image: { type: String, default: null },
    role: {
      type: String,
      enum: ['admin', 'customer', 'retailer', 'deliveryBoy'],
      required: true,
    },
    isBlocked: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isGoogleUser: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<UserDoc>('User', userSchema);
