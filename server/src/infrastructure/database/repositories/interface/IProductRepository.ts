// src/domain/repositories/interface/IProductRepository.ts
import { VegetableProduct } from "../../../../domain/entities/Product";

export interface IProductRepository {
  createProduct(product: VegetableProduct): Promise<VegetableProduct>;
  getProductDetails(id: string): Promise<VegetableProduct | null>;
  updateProduct(id: string, product: Partial<VegetableProduct>): Promise<VegetableProduct | null>;
  deleteProduct(id: string): Promise<boolean>;
  findProductsByRetailer(retailerId: string): Promise<VegetableProduct[]>;
  getAllProducts(): Promise<VegetableProduct[]>;
}