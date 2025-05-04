// Common types for the vegetable delivery app

// User roles
export type UserRole = 'admin' | 'customer' | 'retailer' | 'delivery';

// Product related types
export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  unit: string; // kg, g, piece, bunch, etc.
  stockQuantity: number;
  image: string;
  retailerId: string;
  organic: boolean;
  discount?: number;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

// Order related types
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  retailerId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  deliveryAddress: Address;
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  deliveryFee: number;
  deliveryPersonId?: string;
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  specialInstructions?: string;
}

// User related types
export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  landmark?: string;
}

export interface UserBase {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  profileImage?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface Customer extends UserBase {
  role: 'customer';
  addresses: Address[];
  defaultAddressId?: string;
  orderHistory: string[]; // Order IDs
  favoriteRetailers: string[]; // Retailer IDs
}

export interface Retailer extends UserBase {
  role: 'retailer';
  storeName: string;
  storeDescription?: string;
  storeImage?: string;
  address: Address;
  businessHours: {
    open: string;
    close: string;
    daysOpen: string[]; // e.g., ['Monday', 'Tuesday', ...]
  };
  products: string[]; // Product IDs
  ratings: number; // Average rating
  totalOrders: number;
  isOpen: boolean;
}

export interface DeliveryPerson extends UserBase {
  role: 'delivery';
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
  isAvailable: boolean;
  currentOrderId?: string;
  completedDeliveries: number;
  vehicleType: string;
  vehicleNumber?: string;
  ratings: number; // Average rating
}

export interface Admin extends UserBase {
  role: 'admin';
  permissions: string[];
}

// Dashboard data types
export interface RetailerDashboardData {
  retailerName: string;
  storeName: string;
  todaySales: number;
  orders: number;
  pendingDeliveries: number;
  productCount: number;
  salesTrend: number;
  ordersTrend: number;
  lowStockItems: LowStockItem[];
  recentOrders: RecentOrderSummary[];
}

export interface LowStockItem {
  name: string;
  category: string;
  quantity: number;
  status: 'critical' | 'low';
}

export interface RecentOrderSummary {
  id: string;
  customer: string;
  items: number;
  total: number;
  status: 'pending' | 'preparing' | 'delivered';
  date: string;
}