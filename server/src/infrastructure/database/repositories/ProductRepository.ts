// src/infrastructure/repositories/ProductRepository.ts

import { Types } from "mongoose";
import { IProductRepository } from "./interface/IProductRepository";
import { VegetableProduct } from "../../../domain/entities/Product";
import { ProductModel } from "../schemas/productModel";

export class ProductRepository implements IProductRepository {
  async createProduct(product: VegetableProduct): Promise<VegetableProduct> {
    const newProduct = await ProductModel.create(product);
    return newProduct.toObject();
  }
async getProductDetails(id: string): Promise<VegetableProduct | null> {
  return ProductModel.findById(id)
    .populate({
      path: 'retailerId',
      select: 'shopName description phone address',
      model: 'RetailerShop'
    })
    .lean();
}


  async updateProduct(
    id: string,
    product: Partial<VegetableProduct>
  ): Promise<VegetableProduct | null> {
    return ProductModel.findByIdAndUpdate(id, product, { new: true }).lean();
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await ProductModel.findByIdAndDelete(id);
    return !!result;
  }

  async findProductsByRetailer(
    retailerId: string
  ): Promise<VegetableProduct[]> {
    return ProductModel.find({ retailerId }).lean();
  }
//   listing all products in customer side
  async getAllProducts(): Promise<VegetableProduct[]> {
    return ProductModel.find({ status: 'active' })
      .populate({
        path: 'retailerId',
        select: 'shopName description phone address',
        model: 'RetailerShop'
      })
      .lean();
  }
}