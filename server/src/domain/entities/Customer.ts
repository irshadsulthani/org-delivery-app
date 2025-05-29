<<<<<<< HEAD
// src/domain/entities/Customer.ts
import { Types } from "mongoose";

export interface Address {
  _id?: Types.ObjectId;
=======
import { Types } from "mongoose";

export interface Address {
>>>>>>> d387b79 (feat:- now doing the customer address adding)
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
<<<<<<< HEAD
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
=======
}

export interface Customer {
  _id?: string;
  userId: Types.ObjectId;
  phone: string;
  addresses: Address[];
  profileImageUrl: string;
  createdAt: Date;
  updatedAt: Date;
  totalOrders?: number;
  walletBalance?: number;
}
>>>>>>> d387b79 (feat:- now doing the customer address adding)
