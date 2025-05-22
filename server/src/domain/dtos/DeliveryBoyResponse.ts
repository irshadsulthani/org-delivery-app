// src/domain/dtos/DeliveryBoyResponse.ts
export interface DeliveryBoyResponse {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    isBlocked: boolean;
  };
  phone: string;
  profileImageUrl?: string;
  verificationStatus: string;
  currentlyAvailable: boolean;
  vehicleType: string;
  totalDeliveredOrders: number;
  createdAt: string;
}