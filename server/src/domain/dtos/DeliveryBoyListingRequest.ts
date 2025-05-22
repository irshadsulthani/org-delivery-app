// src/domain/dtos/DeliveryBoyListingRequest.ts
export interface DeliveryBoyListingRequest {
  page?: number;
  limit?: number;
  search?: string;
  filters?: {
    verificationStatus?: string;
    isBlocked?: boolean;
    vehicleType?: string;
    currentlyAvailable?: boolean;
  };
  sort?: {
    field: string;
    direction: 'asc' | 'desc';
  };
}