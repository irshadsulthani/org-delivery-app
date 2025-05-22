// src/domain/usecases/product/GetAllProductsUseCase.ts

import { VegetableProduct } from "../../../domain/entities/Product";
import { IProductRepository } from "../../../infrastructure/database/repositories/interface/IProductRepository";
import { IGetAllProductsUseCase } from "./interface/IGetAllProductsUseCase";

export class GetAllProductsUseCase implements IGetAllProductsUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(): Promise<VegetableProduct[]> {
    return this.productRepository.getAllProducts();
  }
}
