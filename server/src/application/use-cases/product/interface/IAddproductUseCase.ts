// src/application/interfaces/IProductUseCase.ts

import { VegetableProduct } from "../../../../domain/entities/Product";


export interface IProductUseCase {
  addProduct(productData: Omit<VegetableProduct, '_id' | 'createdAt' | 'updatedAt'>, images: File[]): Promise<VegetableProduct>;
}