// src/domain/dtos/UpdateProductDto.ts
import { Express } from 'express';

export interface UpdateProductDto {
  productId: string;
  retailerId: string;
  name?: string;
  category?: string;
  price?: number;
  quantity?: number;
  description?: string;
  unit?: string;
  newImages?: Express.Multer.File[];
  existingImages?: string[];
}