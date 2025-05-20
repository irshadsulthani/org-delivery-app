// src/domain/entities/Product.ts
import { Types } from "mongoose";

export interface ProductImage {
  url: string;
  publicId: string;
}

export type ProductUnit = 'kg' | 'g' | 'lb' | 'piece' | 'bunch';
export type ProductStatus = 'active' | 'out_of_stock' | 'discontinued';

export interface VegetableProduct {
  _id?: Types.ObjectId;
  retailerId: Types.ObjectId;
  name: string;
  category: string;
  price: number;
  quantity: number;
  description: string;
  unit: ProductUnit;
  images: ProductImage[];
  status?: ProductStatus;
  createdAt?: Date;
  updatedAt?: Date;
}