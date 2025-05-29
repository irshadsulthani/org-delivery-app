export interface CustomerRequestDto {
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
    direction: "asc" | "desc";
  };
}
