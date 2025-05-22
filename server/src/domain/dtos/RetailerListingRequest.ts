export interface RetailerListingRequest {
  page?: number;
  limit?: number;
  search?: string;
  filters?: {
    verificationStatus?: string;
    isBlocked?: boolean;
    status?: string;
  };
  sort?: {
    field: string;
    direction: 'asc' | 'desc';
  };
}