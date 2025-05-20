// src/domain/usecases/product/GetAllProductsUseCase.ts

import { VegetableProduct } from "../../../domain/entities/Product";
import { IProductRepository } from "../../../infrastructure/database/repositories/interface/IProductRepository";

export class GetAllProductsUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(): Promise<VegetableProduct[]> {
    return this.productRepository.getAllProducts();
  }
}