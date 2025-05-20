import { uploadProductImageToCloudinary, deleteImageFromCloudinary } from "../../../infrastructure/cloudinary/cloudinaryProductUpload";
import { IProductRepository } from "../../../infrastructure/database/repositories/interface/IProductRepository";
import { VegetableProduct, ProductUnit } from "../../../domain/entities/Product";
import { UpdateProductDto } from "../../../domain/dtos/UpdateProductDto";

export class UpdateProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(dto: UpdateProductDto): Promise<VegetableProduct> {
    const existingProduct = await this.productRepository.getProductDetails(dto.productId);
    if (!existingProduct) {
      throw new Error('Product not found');
    }

    // 1. Handle existing images to keep
    let imagesToKeep: { url: string; publicId: string }[] = [];
    if (dto.existingImages && dto.existingImages.length > 0) {
      imagesToKeep = existingProduct.images.filter(img => 
        dto.existingImages!.some(existingId => existingId === img.publicId)
      );
    }

    // 2. Handle new image uploads
    let newUploadedImages: { url: string; publicId: string }[] = [];
    if (dto.newImages && dto.newImages.length > 0) {
      try {
        newUploadedImages = await Promise.all(
          dto.newImages.map(file => {
            return uploadProductImageToCloudinary(file);
          })
        );
      } catch (uploadError) {
        console.error('Error uploading new images:', uploadError);
        throw new Error('Failed to upload new images');
      }
    }
    const updatedImages = [...imagesToKeep, ...newUploadedImages];
    const imagesToDelete = existingProduct.images.filter(img => {
      return !dto.existingImages?.includes(img.publicId);
    });

    if (imagesToDelete.length > 0) {
      try {
        await Promise.all(
          imagesToDelete.map(img => deleteImageFromCloudinary(img.publicId))
        );
      } catch (deleteError) {
        console.error('Error deleting images:', deleteError);
        // Continue with update even if deletion fails
      }
    }

    // Prepare update data
    const updateData: Partial<VegetableProduct> = {
      name: dto.name,
      category: dto.category,
      price: dto.price,
      quantity: dto.quantity,
      description: dto.description,
      ...(dto.unit && { unit: dto.unit as ProductUnit }),
      images: updatedImages,
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof VegetableProduct] === undefined) {
        delete updateData[key as keyof VegetableProduct];
      }
    });
    const updatedProduct = await this.productRepository.updateProduct(dto.productId, updateData);
    if (!updatedProduct) {
      throw new Error('Failed to update product');
    }
    return updatedProduct;
  }
}