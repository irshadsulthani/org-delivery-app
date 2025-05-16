import React, { useState, useEffect, SetStateAction } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { 
  TrendingUp, 
  Package, 
  Truck, 
  DollarSign, 
  AlertCircle,
  Calendar,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Menu,
  X,
  Store
} from 'lucide-react';
import RetailerSidebar from '../../components/reatilerComponents/ReatilerSidebar';
import { getRegistrationStatus } from '../../api/reatilerApi';
import RegistrationStatus from '../../components/reatilerComponents/RegistrationStatusProps';

// Dashboard Card Component
interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: number; positive: boolean };
  color: string;
  bgColor: string;
  textColor: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, trend, color, bgColor, textColor }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 transition-all duration-300 hover:shadow-md hover:translate-y-[-2px] ${bgColor}`}>
      <div className="flex justify-between items-center mb-4">
        <div className={`p-2 md:p-3 rounded-full ${color}`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center text-xs md:text-sm font-medium rounded-full px-2 py-1 ${
            trend.positive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
          }`}>
            {trend.positive ? 
              <ArrowUpRight size={14} className="mr-1" /> : 
              <ArrowDownRight size={14} className="mr-1" />
            }
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      <div>
        <h3 className="text-gray-500 text-xs md:text-sm font-medium">{title}</h3>
        <p className={`text-lg md:text-2xl font-bold mt-1 ${textColor}`}>{value}</p>
      </div>
    </div>
  );
};

// Low Stock Item Component
interface LowStockItemProps {
  name: string;
  category: string;
  quantity: number;
  status: 'critical' | 'low';
}

const LowStockItem: React.FC<LowStockItemProps> = ({ name, category, quantity, status }) => {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 px-2 rounded-md transition-colors">
      <div className="flex items-center">
        <div className={`w-2 h-2 rounded-full mr-3 ${
          status === 'critical' ? 'bg-red-500' : 'bg-yellow-500'
        }`}></div>
        <div>
          <h4 className="font-medium text-gray-800 text-sm md:text-base">{name}</h4>
          <p className="text-xs md:text-sm text-gray-500">{category}</p>
        </div>
      </div>
      <div className="flex items-center">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          status === 'critical' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {quantity} left
        </span>
      </div>
    </div>
  );
};

// Recent Order Component
interface RecentOrderProps {
  id: string;
  customer: string;
  items: number;
  total: number;
  status: 'pending' | 'preparing' | 'delivered';
  date: string;
}

const RecentOrder: React.FC<RecentOrderProps> = ({ id, customer, items, total, status, date }) => {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    preparing: 'bg-blue-100 text-blue-800 border-blue-200',
    delivered: 'bg-green-100 text-green-800 border-green-200'
  };

  const statusIcons = {
    pending: <Clock size={14} className="mr-1" />,
    preparing: <Package size={14} className="mr-1" />,
    delivered: <Truck size={14} className="mr-1" />
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 px-2 rounded-md transition-colors gap-2">
      <div className="flex items-center space-x-3">
        <div className="bg-indigo-100 text-indigo-600 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-medium text-xs md:text-sm">
          {id.slice(-2)}
        </div>
        <div>
          <h4 className="font-medium text-gray-800 text-sm md:text-base">#{id}</h4>
          <p className="text-xs md:text-sm text-gray-500">{customer}</p>
        </div>
      </div>
      <div className="text-xs md:text-sm text-gray-500 font-medium ml-11 md:ml-0">
        {items} items • ₹{total}
      </div>
      <div className="flex items-center ml-11 md:ml-0 mt-1 md:mt-0">
        <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center ${statusColors[status]}`}>
          {statusIcons[status]}
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
        <span className="ml-3 text-xs text-gray-500 flex items-center">
          <Clock size={12} className="mr-1 opacity-70" /> {date}
        </span>
      </div>
    </div>
  );
};

// Main Dashboard Component
const RetailerDashboard = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  const [statusDismissed, setStatusDismissed] = useState(false);
  const [registrationStatusData, setRegistrationStatusData] = useState<{
    registrationCompleted: boolean;
    verificationStatus: 'pending' | 'approved' | 'rejected';
    rejectionReason?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  
  const retailerState = useSelector((state: RootState) => state.retailer.retailer);
  const retailerEmail = retailerState?.email;
  
  // Check if retailer is verified
  console.log('registrationStatusData',registrationStatusData);
  
  const retailerVerified = registrationStatusData?.verificationStatus === 'approved';
  console.log('retailerVerified','retailerVerified',retailerVerified);
  
  const registrationIncomplete = !registrationStatusData?.registrationCompleted;
  console.log('registrationIncomplete',registrationIncomplete);
  
  const registrationRejected = registrationStatusData?.verificationStatus === 'rejected';

  // Fetch registration status
  useEffect(() => {
    const fetchRegistrationStatus = async () => {
      if (!retailerEmail) return;
      
      try {
        setLoading(true);
        const response = await getRegistrationStatus(retailerEmail);
        console.log('response',response,'response response response');
        
        setRegistrationStatusData(response);
      } catch (err) {
        console.error('Failed to fetch registration status:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrationStatus();
  }, [retailerEmail]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      handleResize(); // Initial call
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  // Check if status was previously dismissed
  useEffect(() => {
    const isDismissed = localStorage.getItem('statusDismissed') === 'true';
    setStatusDismissed(isDismissed);
  }, []);

  // Handler for dismissing the status
  const handleDismiss = () => {
    setStatusDismissed(true);
    localStorage.setItem('statusDismissed', 'true');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNavigate = (page: SetStateAction<string>) => {
    setActivePage(page);
    // On mobile, close the sidebar after navigation
    if (windowWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleRegistrationAction = () => {
    if (registrationIncomplete) {
      window.location.href = '/retailer/complete-registration';
    } else if (registrationRejected) {
      window.location.href = '/retailer/update-registration';
    }
  };

  // Mock data - in a real app this would come from API/state
  const dashboardData = {
    storeName: "Green Basket Vegetables",
    todaySales: 14250,
    orders: 17,
    pendingDeliveries: 8,
    productCount: 45,
    salesTrend: 12.5,
    ordersTrend: 8.3,
    lowStockItems: [
      { name: "Organic Tomatoes", category: "Vegetables", quantity: 2, status: 'critical' as 'critical' },
      { name: "Green Capsicum", category: "Vegetables", quantity: 5, status: 'low' as 'low' },
      { name: "Baby Spinach", category: "Leafy Greens", quantity: 3, status: 'critical' as 'critical' },
      { name: "Red Onions", category: "Vegetables", quantity: 8, status: 'low' as 'low' }
    ],
    recentOrders: [
      { id: "ORD7891", customer: "Rahul Mehta", items: 7, total: 460, status: 'pending' as 'pending', date: "Today, 10:45 AM" },
      { id: "ORD7890", customer: "Anjali Patel", items: 5, total: 350, status: 'preparing' as 'preparing', date: "Today, 09:30 AM" },
      { id: "ORD7889", customer: "Vikram Singh", items: 12, total: 820, status: 'delivered' as 'delivered', date: "Yesterday, 04:15 PM" },
      { id: "ORD7888", customer: "Neha Kumar", items: 8, total: 550, status: 'delivered' as 'delivered', date: "Yesterday, 01:20 PM" }
    ] as RecentOrderProps[]
  };

  const renderRestrictedDashboard = () => {
    return (
      <div className="p-4 md:p-6">
        <div className="mb-6 md:mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Retailer Dashboard</h1>
            <p className="text-sm md:text-base text-gray-500 mt-1">Welcome, {retailerState?.name}!</p>
          </div>
        </div>
        
        {!loading && !statusDismissed && registrationStatusData && (
          <RegistrationStatus 
            onDismiss={handleDismiss}
            onActionClick={handleRegistrationAction}
          />
        )}
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
          <div className="max-w-md mx-auto">
            <AlertCircle className="mx-auto text-yellow-500 mb-4" size={48} />
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {registrationIncomplete ? 'Complete Your Registration' : 'Registration Under Review'}
            </h2>
            <p className="text-gray-600 mb-6">
              {registrationIncomplete 
                ? 'You need to complete your registration process to access all dashboard features.' 
                : 'Your registration is being reviewed. You will have full access once approved.'}
            </p>
            <button 
              onClick={handleRegistrationAction}
              className={`px-6 py-3 rounded-lg text-white font-medium ${
                registrationIncomplete 
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
              }`}
            >
              {registrationIncomplete ? 'Complete Registration' : 'View Status'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderFullDashboard = () => {
    return (
      <div className="p-4 md:p-6">
        {/* Header Section with Welcome and Date */}
        <div className="mb-6 md:mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 bg-gradient-to-r from-green-600 to-teal-500 bg-clip-text text-transparent">Retailer Dashboard</h1>
            <p className="text-sm md:text-base text-gray-500 mt-1">Welcome back, {retailerState?.name}! Here's your store overview.</p>
          </div>
          <div className="mt-4 md:mt-0 bg-white shadow-sm rounded-lg px-3 py-1 md:px-4 md:py-2 border border-gray-100 flex items-center text-sm">
            <Calendar size={16} className="text-gray-400 mr-2" />
            <span className="text-gray-700 font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
        
        {/* Registration Status */}
        {!loading && !statusDismissed && registrationStatusData && (
          <RegistrationStatus 
            onDismiss={handleDismiss}
            onActionClick={handleRegistrationAction}
          />
        )}
        
        {/* Dashboard Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <DashboardCard 
            title="Today's Sales" 
            value={`₹${dashboardData.todaySales.toLocaleString()}`} 
            icon={<DollarSign size={18} className="text-green-600" />} 
            trend={{ value: dashboardData.salesTrend, positive: true }}
            color="bg-green-100"
            bgColor="bg-gradient-to-br from-white to-green-50"
            textColor="text-green-700"
          />
          <DashboardCard 
            title="Orders" 
            value={dashboardData.orders} 
            icon={<Package size={18} className="text-blue-600" />} 
            trend={{ value: dashboardData.ordersTrend, positive: true }}
            color="bg-blue-100"
            bgColor="bg-gradient-to-br from-white to-blue-50"
            textColor="text-blue-700"
          />
          <DashboardCard 
            title="Pending" 
            value={dashboardData.pendingDeliveries} 
            icon={<Truck size={18} className="text-yellow-600" />} 
            color="bg-yellow-100"
            bgColor="bg-gradient-to-br from-white to-yellow-50"
            textColor="text-yellow-700"
          />
          <DashboardCard 
            title="Products" 
            value={dashboardData.productCount} 
            icon={<TrendingUp size={18} className="text-purple-600" />} 
            color="bg-purple-100"
            bgColor="bg-gradient-to-br from-white to-purple-50"
            textColor="text-purple-700"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Low Stock Alert */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div className="flex items-center">
                <div className="p-1.5 md:p-2 rounded-full bg-red-100 mr-2 md:mr-3">
                  <AlertCircle size={18} className="text-red-600" />
                </div>
                <h2 className="text-base md:text-lg font-semibold text-gray-800">Low Stock Alerts</h2>
              </div>
              <span className="bg-red-50 text-red-600 text-xs font-medium px-2 py-1 rounded-full">
                {dashboardData.lowStockItems.filter(item => item.status === 'critical').length} critical
              </span>
            </div>
            <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
              {dashboardData.lowStockItems.map((item, index) => (
                <LowStockItem 
                  key={index}
                  name={item.name}
                  category={item.category}
                  quantity={item.quantity}
                  status={item.status}
                />
              ))}
            </div>
            <button className="mt-4 md:mt-6 w-full py-2 md:py-2.5 bg-gradient-to-r from-green-500 to-teal-500 text-white text-sm md:text-base font-medium rounded-lg hover:shadow-md hover:from-green-600 hover:to-teal-600 transition-all flex items-center justify-center">
              View All Inventory
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
          
          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div className="flex items-center">
                <div className="p-1.5 md:p-2 rounded-full bg-blue-100 mr-2 md:mr-3">
                  <Calendar size={18} className="text-blue-600" />
                </div>
                <h2 className="text-base md:text-lg font-semibold text-gray-800">Recent Orders</h2>
              </div>
              <span className="bg-blue-50 text-blue-600 text-xs font-medium px-2 py-1 rounded-full">
                Today: {dashboardData.recentOrders.filter(order => order.date.includes('Today')).length}
              </span>
            </div>
            <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
              {dashboardData.recentOrders.map((order, index) => (
                <RecentOrder 
                  key={index}
                  id={order.id}
                  customer={order.customer}
                  items={order.items}
                  total={order.total}
                  status={order.status}
                  date={order.date}
                />
              ))}
            </div>
            <button className="mt-4 md:mt-6 w-full py-2 md:py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm md:text-base font-medium rounded-lg hover:shadow-md hover:from-blue-600 hover:to-indigo-600 transition-all flex items-center justify-center">
              View All Orders
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
        
        {/* Quick Actions Section */}
        <div className="mt-4 md:mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 transition-all duration-300 hover:shadow-md">
          <div className="flex items-center mb-3 md:mb-4">
            <h2 className="text-base md:text-lg font-semibold text-gray-800">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            <button className="flex flex-col items-center justify-center p-3 md:p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <Package size={20} className="text-blue-600 mb-1 md:mb-2" />
              <span className="text-xs md:text-sm font-medium text-gray-800">Add Products</span>
            </button>
            <button className="flex flex-col items-center justify-center p-3 md:p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <TrendingUp size={20} className="text-green-600 mb-1 md:mb-2" />
              <span className="text-xs md:text-sm font-medium text-gray-800">View Sales</span>
            </button>
            <button className="flex flex-col items-center justify-center p-3 md:p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <Truck size={20} className="text-purple-600 mb-1 md:mb-2" />
              <span className="text-xs md:text-sm font-medium text-gray-800">Manage Shipping</span>
            </button>
            <button className="flex flex-col items-center justify-center p-3 md:p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
              <DollarSign size={20} className="text-yellow-600 mb-1 md:mb-2" />
              <span className="text-xs md:text-sm font-medium text-gray-800">Manage Payments</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 relative overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && windowWidth < 1024 && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-sm z-10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white p-2 rounded-lg shadow-sm">
            <Store size={20} />
          </div>
          <h1 className="ml-2 text-lg font-bold bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
            GreenGrocer
          </h1>
        </div>
        <button 
          onClick={toggleSidebar}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Sidebar - Conditionally rendered or positioned */}
      <div className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} 
        fixed lg:relative z-30 transition-transform duration-300 h-full
      `}>
        <RetailerSidebar 
          retailerName={retailerState?.name ?? ""}
          storeName={dashboardData.storeName}
          onNavigate={handleNavigate}
          activePage={activePage}
        />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100 pt-16 lg:pt-0">
        {activePage === 'dashboard' && (
          retailerVerified ? renderFullDashboard() : renderRestrictedDashboard()
        )}
      </div>
    </div>
  );
};

export default RetailerDashboard;