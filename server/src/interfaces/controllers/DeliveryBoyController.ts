import { Request, Response } from 'express';
import { DeliveryBoyRepository } from '../../infrastructure/database/repositories/DeliveryBoyRepository';
import { UserRepository } from '../../infrastructure/database/repositories/UserRepository';
import { StatusCode } from '../../utils/statusCode';
import { uploadToCloudinary } from '../../infrastructure/cloudinary/cloudinary';
import { uploadToS3 } from '../../infrastructure/s3/s3Service';

const deliveryBoyRepository = new DeliveryBoyRepository();
const userRepository = new UserRepository();

export class DeliveryBoyController {
    static register = async (req: Request, res: Response): Promise<void> => {
      try {
        const { email, phone, address, city, state, zipCode, vehicleType, vehicleNumber,drivingLicense, dateOfBirth } = req.body;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
        

        if (!files || !files['profileImage'] || !files['verificationImage']) {
          res.status(StatusCode.BAD_REQUEST).json({ 
            message: 'Profile and verification images are required.' 
          });
          return;
        }
  
        const profileImage = files['profileImage'][0];
        const verificationImage = files['verificationImage'][0];
  
        const user = await userRepository.findByEmail(email);
        if (!user) {
          res.status(StatusCode.NOT_FOUND).json({ 
            message: 'User not found with the provided email' 
          });
          return;
        }
  
        // Upload images and get URLs
        const [profileImageUrl, verificationImageUrl] = await Promise.all([
          uploadToCloudinary(profileImage.buffer, profileImage.originalname),
          uploadToS3(verificationImage.buffer, verificationImage.originalname)
        ]);
  
        const deliveryBoy = await deliveryBoyRepository.create({
          userId: user._id as string,
          phone,
          address,
          city,
          state,
          zipCode,
          dob:dateOfBirth,
          vehicleType,
          vehicleNumber,
          profileImageUrl,  
          verificationImageUrl, 
          verificationStatus: 'pending',
          isVerified: false,
          totalDeliveredOrders: 0,
          currentlyAvailable: true,
          dlNumber:drivingLicense,
          reviews: [],
          createdAt: new Date(),
          updatedAt: new Date()
        });
  
        res.status(StatusCode.CREATED).json(deliveryBoy);
      } catch (error: any) {
        console.error('Registration error:', error);
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ 
          message: 'Internal server error', 
          error: error.message 
        });
      }
    };
  }