import { Types } from "mongoose";

export interface DeliveryBoy {
    _id?: string;
    userId: Types.ObjectId | string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    dob: Date;
    profileImageUrl: string;
    verificationImageUrl: string;
    isVerified: boolean;
    verificationStatus: 'pending' | 'approved' | 'rejected';
    totalDeliveredOrders: number;
    currentlyAvailable: boolean;
    vehicleType: 'bike' | 'scooter' | 'car' | 'van';
    vehicleNumber?: string;
    dlNumber: string;
    reviews: {
        customerId: Types.ObjectId | string;
        rating: number;
        comment: string;
        date: Date;
    }[];
    createdAt: Date;
    updatedAt: Date;
}
