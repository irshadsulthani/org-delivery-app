// application/usecases/deliveryBoy/RegisterDeliveryBoyUseCase.ts

import { DeliveryBoy } from '../../../domain/entities/DeliveryBoy';
import { RegisterDeliveryBoyInput } from '../../../domain/dtos/RegisterDeliveryBoyInput';
import { DeliveryBoyRepository } from '../../../infrastructure/database/repositories/DeliveryBoyRepository';
import { uploadToCloudinary } from '../../../infrastructure/cloudinary/cloudinary';
import { uploadToS3 } from '../../../infrastructure/s3/s3Service';
import { Types } from 'mongoose';
import { IRegisterDeliveryBoy } from './interface/IRegisterDeliveryBoy';

export class RegisterDeliveryBoyUseCase implements IRegisterDeliveryBoy {
  constructor(private repository: DeliveryBoyRepository) {}

  async register(input: RegisterDeliveryBoyInput): Promise<DeliveryBoy> {
    const profileImageUrl = await uploadToCloudinary(input.profileImage.buffer, `profile_${input.userId}`);
    const verificationImageUrl = await uploadToS3(input.verificationImage.buffer, `verification_${input.userId}`);

    const deliveryBoy: DeliveryBoy = {
      userId: new Types.ObjectId(input.userId),
      phone: input.phone,
      address: input.address,
      city: input.city,
      state: input.state,
      zipCode: input.zipCode,
      dob: input.dob,
      profileImageUrl,
      verificationImageUrl,
      isVerified: false,
      verificationStatus: 'pending',
      totalDeliveredOrders: 0,
      currentlyAvailable: true,
      vehicleType: input.vehicleType,
      vehicleNumber: input.vehicleNumber,
      dlNumber: input.dlNumber,
      reviews: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return await this.repository.create(deliveryBoy);
  }
}
