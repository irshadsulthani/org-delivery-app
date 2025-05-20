// src/interface/product/product.ts
export interface Product {
  isFavorite: any;
  discount: number;
  _id: string;
  name: string;
  price: number;
  category: string;
  quantity: number;
  description: string;
  unit: string;
  rating:string;
  images: { url: string; publicId: string }[];
  status?: string;
  retailerId: {
    _id: string;
    shopName: string;
    description?: string;
    phone?: string;
    address?: {
      street?: string;
      area?: string;
      city?: string;
      state?: string;
      zipCode: string;
      country?: string;
    };
  };
  createdAt?: string;
  updatedAt?: string;
}