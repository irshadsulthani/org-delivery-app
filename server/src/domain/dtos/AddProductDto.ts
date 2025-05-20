// src/application/dto/AddProductDto.ts
import { ProductUnit } from "../../domain/entities/Product";

export interface AddProductDto {
  retailerId: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  description?: string;
  unit: ProductUnit;
  images: Express.Multer.File[];
}