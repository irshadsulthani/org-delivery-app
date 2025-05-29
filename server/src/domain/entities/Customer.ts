// src/domain/entities/Customer.ts
import { Types } from "mongoose";

export interface Address {
  _id?: Types.ObjectId;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Customer {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  phone?: string;
  addresses: Address[];
  profileImageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
  totalOrders?: number;
  walletBalance?: number;
}