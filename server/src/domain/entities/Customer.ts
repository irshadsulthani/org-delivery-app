import { Types } from "mongoose";

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
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
