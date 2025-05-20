// src/application/usecases/product/AddProductUseCase.ts

// src/domain/usecases/product/AddProductUseCase.ts

import { Types } from "mongoose";
import { uploadProductImageToCloudinary } from "../../../infrastructure/cloudinary/cloudinaryProductUpload";
import { IProductRepository } from "../../../infrastructure/database/repositories/interface/IProductRepository";
import { VegetableProduct } from "../../../domain/entities/Product";
import { AddProductDto } from "../../../domain/dtos/AddProductDto";

export class AddProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(dto: AddProductDto): Promise<VegetableProduct> {
    // Upload images to Cloudinary
    const imageUploads = dto.images.map(file => uploadProductImageToCloudinary(file));
    const uploadedImages = await Promise.all(imageUploads);

    const product: VegetableProduct = {
      retailerId: new Types.ObjectId(dto.retailerId),
      name: dto.name,
      category: dto.category,
      price: dto.price,
      quantity: dto.quantity,
      description: dto.description || "",
      unit: dto.unit,
      images: uploadedImages,
      status: "active",
    };

    return this.productRepository.createProduct(product);
  }
}