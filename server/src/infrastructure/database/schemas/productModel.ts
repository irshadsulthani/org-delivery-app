// src/infrastructure/database/schemas/productmodel.ts
import { Schema, model } from 'mongoose';
import { VegetableProduct, ProductUnit, ProductStatus } from '../../../domain/entities/Product';

const ProductImageSchema = new Schema({
  url: { type: String, required: true },
  publicId: { type: String, required: true }
});

const ProductSchema = new Schema<VegetableProduct>({
  retailerId: { type: Schema.Types.ObjectId, ref: 'RetailerShop', required: true },
  name: { type: String, required: true, trim: true, maxlength: 100 },
  category: { type: String, required: true, trim: true, maxlength: 50 },
  price: { type: Number, required: true, min: 0, max: 10000 },
  quantity: { type: Number, required: true, min: 0, max: 1000 },
  description: { type: String, required: false, default: '', maxlength: 1000 },
  unit: { 
    type: String, 
    required: true, 
    enum: ['kg', 'g', 'lb', 'piece', 'bunch'] as ProductUnit[] 
  },
  images: { type: [ProductImageSchema], required: true, validate: {
    validator: (v: any[]) => v.length > 0 && v.length <= 3,
    message: 'Products must have between 1 and 3 images'
  }},
  status: { 
    type: String, 
    enum: ['active', 'out_of_stock', 'discontinued'] as ProductStatus[], 
    default: 'active' 
  }
}, {
  timestamps: true,
  versionKey: false
});

export const ProductModel = model<VegetableProduct>('Product', ProductSchema);