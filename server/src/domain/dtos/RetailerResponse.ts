export interface RetailerResponse {
  _id: string;
  userId: string;
  shopId: string;
  shopName: string;
  name: string;
  email: string;
  phone: string;
  description?: string;
  shopImageUrl: string;
  shopLicenseUrl: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode?: string;
    country?: string;
  };
  rating: number;
  reviews: Review[];
  isVerified: boolean;
  status: 'Active' | 'Blocked' | 'Pending';
  orderCount: number;
  totalRevenue?: number;
  createdAt: string;
  updatedAt?: string;
}

interface Review {
  customerId: string;
  rating: number;
  comment?: string;
  date: Date;
}