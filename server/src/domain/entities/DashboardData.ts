export interface DashboardData {
    totalOrders: number;
    walletBalance: number;
    activeDeliveries: number;
    hasAddress: boolean;
    recentOrders: Array<{
        id: string;
        date: string;
        total: number;
        status: string;
    }>;
}
