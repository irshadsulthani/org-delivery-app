import { Types } from "mongoose";

// src/domain/entities/Payment.ts
export interface Payment {
  id: string;
  userId: Types.ObjectId;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  paymentIntentId?: string;
  createdAt: Date;
  updatedAt: Date;
}
