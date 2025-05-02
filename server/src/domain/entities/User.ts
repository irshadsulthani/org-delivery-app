export interface User {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  image:string;
  password: string;
  role: 'admin' | 'customer' | 'retailer' | 'deliveryBoy';
  isBlocked: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  isGoogleUser: boolean;
}
