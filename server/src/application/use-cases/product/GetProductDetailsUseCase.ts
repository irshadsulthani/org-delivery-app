// src/application/use-cases/product/GetProductDetailsUseCase.ts
import { VegetableProduct } from "../../../domain/entities/Product";
import { IProductRepository } from "../../../infrastructure/database/repositories/interface/IProductRepository";

export class GetProductDetailsUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(productId: string): Promise<VegetableProduct | null> {
    if (!productId) {
      throw new Error("Product ID is required");
    }
    return this.productRepository.getProductDetails(productId);
  }
}