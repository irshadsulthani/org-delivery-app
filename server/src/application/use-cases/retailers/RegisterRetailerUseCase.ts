// src/application/usecases/retailer/RegisterRetailerShopUseCase.ts

import { Types } from 'mongoose';
import { RegisterRetailerInput } from '../../../domain/dtos/RegisterRetailerInput';
import { uploadToCloudinary } from '../../../infrastructure/cloudinary/cloudinary';
import { uploadToS3 } from '../../../infrastructure/s3/s3Service';
import { IRetailersRepository } from '../../../infrastructure/database/repositories/interface/IRetailersRepository';
import { RetailerShop } from '../../../domain/entities/RetailerShop';
import { IRegisterRetailerUseCase } from './interface/IRegisterRetailerUseCase';

export class RegisterRetailerShopUseCase implements IRegisterRetailerUseCase {
  constructor(private readonly _retailerRepo: IRetailersRepository) {}

  async execute(input: RegisterRetailerInput): Promise<RetailerShop> {
    const shopImageUrl = await uploadToCloudinary(input.shopImage.buffer, input.shopImage.originalname);
    const shopLicenseUrl = await uploadToS3(input.shopLicense.buffer, input.shopLicense.originalname);

    const shop = await this._retailerRepo.register({
      userId: new Types.ObjectId(input.userId),
      shopName: input.shopName,
      description: input.description,
      phone: input.phone,
      shopImageUrl,
      shopLicenseUrl,

      address: {
        street: input.street,
        area: input.area,
        city: input.city,
        state: input.state,
        zipCode: input.zipCode,
        country: input.country,
      },

      rating: 0,
      reviews: [],
      registrationCompleted: false,
      isVerified: false,
      verificationStatus: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return shop;
  }
}
