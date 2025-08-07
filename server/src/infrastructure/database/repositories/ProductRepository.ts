// src/infrastructure/repositories/ProductRepository.ts

import { Types } from "mongoose";
import { IProductRepository } from "./interface/IProductRepository";
import { VegetableProduct } from "../../../domain/entities/Product";
import { ProductModel } from "../schemas/productModel";
import { RetailerShopModel } from "../schemas/retailerModel";

export class ProductRepository implements IProductRepository {
  getAllProducts(): Promise<VegetableProduct[]> {
    throw new Error("Method not implemented.");
  }
  async createProduct(product: VegetableProduct): Promise<VegetableProduct> {
    const newProduct = await ProductModel.create(product);
    return newProduct.toObject();
  }
  async getProductDetails(id: string): Promise<VegetableProduct | null> {
    return ProductModel.findById(id)
      .populate({
        path: "retailerId",
        select: "shopName description phone address",
        model: "RetailerShop",
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
  async getAllProductsNearCustomer(customerLocation: [number, number], maxDistanceKm: number = 10): Promise<VegetableProduct[]> {
    // Find retailers within 10km of customer
    const nearbyRetailers = await RetailerShopModel.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: customerLocation
          },
          $maxDistance: maxDistanceKm * 1000 // Convert km to meters
        }
      }
    }).select('_id').lean();

    const retailerIds = nearbyRetailers.map(r => r._id);

    // Find products from those retailers
    return ProductModel.find({ 
      retailerId: { $in: retailerIds },
      status: "active"
    })
    .populate({
      path: "retailerId",
      select: "shopName description phone address location",
      model: "RetailerShop",
    })
    .lean();
  }

  async findByName(name: string): Promise<VegetableProduct | null> {
    return ProductModel.findOne({ name }).lean();
  }
}
