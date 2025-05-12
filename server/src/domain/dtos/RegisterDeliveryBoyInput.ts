// src/domain/dtos/RegisterDeliveryBoyInput.ts

export type VehicleType = 'bike' | 'scooter' | 'car' | 'van';

export interface AddressDetails {
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface FileInputs {
  profileImage: Express.Multer.File;
  verificationImage: Express.Multer.File;
}

export interface RegisterDeliveryBoyInput extends AddressDetails, FileInputs {
  userId?: string;
  phone: string;
  vehicleType: VehicleType;
  vehicleNumber?: string;
  dlNumber:string
  dob:Date
}
