import { DeliveryBoy } from '../../../domain/entities/DeliveryBoy';
import { uploadToCloudinary } from '../../../infrastructure/cloudinary/cloudinary';
import { DeliveryBoyRepository } from '../../../infrastructure/database/repositories/DeliveryBoyRepository';
import { uploadToS3 } from '../../../infrastructure/s3/s3Service';
import { RegisterDeliveryBoyInput } from './../../../domain/dtos/RegisterDeliveryBoyInput';
import { Types } from 'mongoose'



export const registerDeliveryBoy = async (
    input: RegisterDeliveryBoyInput,
    repository: DeliveryBoyRepository
  ): Promise<DeliveryBoy> => {
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
  
    return await repository.create(deliveryBoy);
};