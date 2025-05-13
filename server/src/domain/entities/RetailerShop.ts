import { Types } from 'mongoose';

export interface Review {
  customerId: Types.ObjectId;
  rating: number;
  comment?: string;
  date: Date;
}

export interface Address {
  street: string;
  area: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface RetailerShop {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  shopName: string;
  phone: string;
  description?: string;

  shopImageUrl: string;       // Cloudinary
  shopLicenseUrl: string;     // AWS S3

  address: Address;

  rating: number;
  reviews: Review[];

  isVerified: boolean;
  verificationStatus: 'pending' | 'approved' | 'rejected';  // <-- added this

  createdAt?: Date;
  updatedAt?: Date;
}
