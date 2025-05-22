// src/application/use-cases/product/GetProductDetailsUseCase.ts
import { VegetableProduct } from "../../../domain/entities/Product";
import { IProductRepository } from "../../../infrastructure/database/repositories/interface/IProductRepository";
import { IGetProductDetailsUseCase } from "./interface/IGetProductDetailsUseCase";

export class GetProductDetailsUseCase implements IGetProductDetailsUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(productId: string): Promise<VegetableProduct | null> {
    if (!productId) {
      throw new Error("Product ID is required");
    }
    return this.productRepository.getProductDetails(productId);
  }
}
