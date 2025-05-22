import { uploadProductImageToCloudinary, deleteImageFromCloudinary } from "../../../infrastructure/cloudinary/cloudinaryProductUpload";
import { IProductRepository } from "../../../infrastructure/database/repositories/interface/IProductRepository";
import { VegetableProduct, ProductUnit } from "../../../domain/entities/Product";
import { UpdateProductDto } from "../../../domain/dtos/UpdateProductDto";
import { IUpdateProductUseCase } from "./interface/IUpdateProductUseCase";

export class UpdateProductUseCase implements IUpdateProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(dto: UpdateProductDto): Promise<VegetableProduct> {
    // Validate DTO
    if (!dto.productId) {
      throw new Error('Product ID is required');
    }

    const existingProduct = await this.productRepository.getProductDetails(dto.productId);
    if (!existingProduct) {
      throw new Error('Product not found');
    }

    // Image handling
    const { imagesToKeep, imagesToDelete } = this.processImageUpdates(existingProduct, dto);
    const newUploadedImages = await this.handleNewImageUploads(dto);
    await this.handleImageDeletions(imagesToDelete);

    // Prepare and validate update data
    const updateData = this.prepareUpdateData(dto, [...imagesToKeep, ...newUploadedImages]);
    
    // Perform update
    const updatedProduct = await this.productRepository.updateProduct(dto.productId, updateData);
    if (!updatedProduct) {
      // Cleanup newly uploaded images if update fails
      await this.rollbackImageUploads(newUploadedImages);
      throw new Error('Failed to update product');
    }

    return updatedProduct;
  }

  private processImageUpdates(existingProduct: VegetableProduct, dto: UpdateProductDto) {
    const imagesToKeep = dto.existingImages?.length 
      ? existingProduct.images.filter(img => 
          dto.existingImages!.includes(img.publicId)
        )
      : [];

    const imagesToDelete = existingProduct.images.filter(img => 
      !dto.existingImages?.includes(img.publicId)
    );

    return { imagesToKeep, imagesToDelete };
  }

  private async handleNewImageUploads(dto: UpdateProductDto) {
    if (!dto.newImages?.length) return [];

    try {
      return await Promise.all(
        dto.newImages.map(file => uploadProductImageToCloudinary(file))
      );
    } catch (error) {
      console.error('Image upload failed:', error);
      throw new Error('Failed to upload new images');
    }
  }

  private async handleImageDeletions(imagesToDelete: { publicId: string }[]) {
    if (!imagesToDelete.length) return;

    try {
      await Promise.all(
        imagesToDelete.map(img => deleteImageFromCloudinary(img.publicId))
      );
    } catch (error) {
      console.error('Image deletion failed:', error);
      // Continue with update even if deletion fails
    }
  }

  private async rollbackImageUploads(images: { publicId: string }[]) {
    if (!images.length) return;

    try {
      await Promise.all(
        images.map(img => deleteImageFromCloudinary(img.publicId))
      );
    } catch (error) {
      console.error('Failed to cleanup uploaded images:', error);
    }
  }

  private prepareUpdateData(dto: UpdateProductDto, images: { url: string; publicId: string }[]): Partial<VegetableProduct> {
    const updateData: Partial<VegetableProduct> = {
      ...(dto.name && { name: dto.name }),
      ...(dto.category && { category: dto.category }),
      ...(dto.price && { price: dto.price }),
      ...(dto.quantity && { quantity: dto.quantity }),
      ...(dto.description && { description: dto.description }),
      ...(dto.unit && { unit: dto.unit as ProductUnit }),
      images
    };

    // Remove undefined values
    return Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined)
    ) as Partial<VegetableProduct>;
  }
}
