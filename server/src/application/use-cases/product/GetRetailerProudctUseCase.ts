// src/domain/usecases/product/GetRetailerProducts.ts
import { VegetableProduct } from "../../../domain/entities/Product";
import { IProductRepository } from "../../../infrastructure/database/repositories/interface/IProductRepository";

export class GetRetailerProudctUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(retailerId: string): Promise<VegetableProduct[]> {
    if (!retailerId) {
      throw new Error("Retailer ID is required");
    }

    return this.productRepository.findProductsByRetailer(retailerId);
  }
}
