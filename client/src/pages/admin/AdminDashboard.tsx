// Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { 
  Box,
  Users,
  Truck,
  DollarSign,
  ArrowRight,
  ShoppingBag,
  RefreshCw,
  Calendar,
  Filter,
  Download,
  MoreHorizontal,
  MapPin,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { getAllUsers } from '../../api/adminApi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminHeader from '../../components/Admin/AdminHeader';
import AdminSidebar from '../../components/Admin/AdminSidebar';

// TypeScript interfaces
interface StatCard {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  trend: number[];
}

interface Order {
  id: string;
  customer: string;
  retailer: string;
  status: string;
  amount: string;
  time: string;
  statusColor: string;
}

interface DeliveryPerson {
  name: string;
  status: 'Active' | 'Inactive';
  orders: number;
  location: string;
  avatar?: string;
  rating?: number;
}

const Dashboard: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<string>('This Week');

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  // Dashboard data
  const stats: StatCard[] = [
    { 
      title: 'Total Orders', 
      value: '2,845', 
      change: '+12.5%', 
      positive: true,
      icon: <Box size={24} />,
      color: 'text-blue-600',
      bgColor: 'from-blue-500 to-blue-600',
      trend: [28, 45, 35, 50, 40, 60, 55]
    },
    { 
      title: 'Active Retailers', 
      value: '432', 
      change: '+4.3%', 
      positive: true,
      icon: <ShoppingBag size={24} />,
      color: 'text-purple-600',
      bgColor: 'from-purple-500 to-purple-600',
      trend: [20, 25, 30, 35, 25, 30, 35]
    },
    { 
      title: 'Delivery Personnel', 
      value: '158', 
      change: '-2.1%', 
      positive: false,
      icon: <Truck size={24} />,
      color: 'text-emerald-600',
      bgColor: 'from-emerald-500 to-emerald-600',
      trend: [15, 18, 16, 17, 15, 14, 13]
    },
    { 
      title: 'Revenue', 
      value: '$249,582', 
      change: '+18.2%', 
      positive: true,
      icon: <DollarSign size={24} />,
      color: 'text-amber-600',
      bgColor: 'from-amber-500 to-amber-600',
      trend: [180, 220, 210, 200, 230, 245, 260]
    },
  ];

  const recentOrders: Order[] = [
    { id: 'ORD-7895', customer: 'Alex Thompson', retailer: 'Grocery Mart', status: 'Delivered', amount: '$45.50', time: '2 hours ago', statusColor: 'bg-emerald-100 text-emerald-800 border border-emerald-200' },
    { id: 'ORD-7894', customer: 'Sarah Wilson', retailer: 'Quick Eats', status: 'In Transit', amount: '$32.25', time: '3 hours ago', statusColor: 'bg-blue-100 text-blue-800 border border-blue-200' },
    { id: 'ORD-7893', customer: 'Michael Chen', retailer: 'Fresh Foods', status: 'Processing', amount: '$78.00', time: '5 hours ago', statusColor: 'bg-amber-100 text-amber-800 border border-amber-200' },
    { id: 'ORD-7892', customer: 'Emily Davis', retailer: 'Mega Mart', status: 'Delivered', amount: '$54.75', time: '6 hours ago', statusColor: 'bg-emerald-100 text-emerald-800 border border-emerald-200' },
    { id: 'ORD-7891', customer: 'Joshua Kim', retailer: 'Health Foods', status: 'Cancelled', amount: '$23.50', time: '8 hours ago', statusColor: 'bg-red-100 text-red-800 border border-red-200' },
  ];

  const deliveryPersonnel: DeliveryPerson[] = [
    { name: 'John Smith', status: 'Active', orders: 3, location: 'Downtown', rating: 4.8 },
    { name: 'Lisa Johnson', status: 'Active', orders: 2, location: 'Westside', rating: 4.7 },
    { name: 'Robert Lee', status: 'Inactive', orders: 0, location: 'Northside', rating: 4.5 },
    { name: 'Maria Garcia', status: 'Active', orders: 4, location: 'Eastside', rating: 4.9 },
  ];

  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      await getAllUsers();
      setUsers(users);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      if (error.response?.status === 401) {
        toast.error('Unauthorized, redirecting to login...');
        navigate('/admin/login');
      } else {
        toast.error('Failed to fetch users');
      }
    }
  };

  const refreshData = () => {
    setLoading(true);
    fetchUsers();
    toast.success('Dashboard data refreshed!');
    setTimeout(() => setLoading(false), 800);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Function to generate mini chart SVG
  const generateMiniChart = (data: number[], positive: boolean) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    // Normalize data points to range 0-1
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 80; // Leave some margin at top and bottom
      return `${x},${y}`;
    }).join(' ');
    
    return (
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline
          points={points}
          fill="none"
          stroke={positive ? "currentColor" : "#f43f5e"}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-75"
        />
      </svg>
    );
  };

  // Function to render star rating
  const renderRating = (rating: number = 0) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg 
            key={i}
            className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-amber-400' : 'text-gray-300'}`}
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-xs text-gray-500">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={toggleMobileSidebar}>
          <div className="absolute top-0 left-0 w-72 h-full" onClick={(e) => e.stopPropagation()}>
            <AdminSidebar collapsed={false} setCollapsed={setCollapsed} isMobile={true} onCloseMobile={toggleMobileSidebar} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <AdminHeader />

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div>
            {/* Date & Actions Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                  <Calendar size={18} className="text-gray-600" />
                </div>
                <div className="relative">
                  <select 
                    className="appearance-none bg-white border border-gray-200 rounded-lg py-2 pl-4 pr-10 shadow-sm text-gray-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                  >
                    <option>Today</option>
                    <option>Yesterday</option>
                    <option>This Week</option>
                    <option>This Month</option>
                    <option>Last 30 Days</option>
                    <option>Custom Range</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <Filter size={16} className="mr-2" />
                  Filter
                </button>
                <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <Download size={16} className="mr-2" />
                  Export
                </button>
                <button 
                  className={`inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-80' : ''}`}
                  onClick={refreshData}
                  disabled={loading}
                >
                  <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.bgColor} flex items-center justify-center text-white shadow-sm group-hover:shadow-md transition-all duration-300`}>
                        {stat.icon}
                      </div>
                      <div className="flex items-center space-x-1">
                        {stat.positive ? (
                          <TrendingUp size={14} className="text-emerald-600" />
                        ) : (
                          <TrendingDown size={14} className="text-red-600" />
                        )}
                        <span className={`text-sm font-medium ${stat.positive ? 'text-emerald-600' : 'text-red-600'}`}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">{stat.title}</h3>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    
                    {/* Mini Chart */}
                    <div className="mt-4 h-12 w-full opacity-70">
                      <div className={`h-full w-full ${stat.color}`}>
                        {generateMiniChart(stat.trend, stat.positive)}
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <a href="#" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
                        View Details
                        <ArrowRight size={16} className="ml-1 transform group-hover:translate-x-1 transition-transform duration-200" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Orders Table */}
              <div className="bg-white rounded-xl shadow-sm lg:col-span-2 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-800">Recent Orders</h3>
                    <div className="flex items-center space-x-2">
                      <button className="text-gray-400 hover:text-gray-600 focus:outline-none">
                        <MoreHorizontal size={20} />
                      </button>
                      <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                        View All
                        <ArrowRight size={16} className="ml-1" />
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto -mx-6">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
                          <th className="px-6 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                          <th className="px-6 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Retailer</th>
                          <th className="px-6 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Time</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recentOrders.map((order, index) => (
                          <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                              <a href="#" className="hover:underline">{order.id}</a>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.retailer}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.statusColor}`}>
                                {order.status === 'Delivered' && <CheckCircle size={12} className="mr-1" />}
                                {order.status === 'Cancelled' && <XCircle size={12} className="mr-1" />}
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.amount}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.time}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 text-center pt-4 border-t border-gray-100">
                    <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                      Load More Orders
                    </button>
                  </div>
                </div>
              </div>

              {/* Delivery Personnel */}
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-800">Delivery Personnel</h3>
                    <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                      Manage
                      <ArrowRight size={16} className="ml-1" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {deliveryPersonnel.map((person, index) => (
                      <div key={index} className="flex items-center p-4 border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-sm transition-all duration-200 group">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center font-medium text-white shadow-md group-hover:shadow-lg transition-all duration-300">
                            {person.name.split(' ').map(name => name[0]).join('')}
                          </div>
                          <div className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                            person.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-400'
                          }`}></div>
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between">
                            <p className="text-sm font-bold text-gray-900">{person.name}</p>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              person.status === 'Active' 
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                                : 'bg-gray-100 text-gray-600 border border-gray-200'
                            }`}>
                              {person.status}
                            </span>
                          </div>
                          
                          {/* Rating stars */}
                          {person.rating && renderRating(person.rating)}
                          
                          <div className="flex items-center mt-1.5">
                            <span className="text-xs text-gray-500 flex items-center">
                              <Users size={12} className="mr-1" />
                              {person.orders} Orders
                            </span>
                            <span className="mx-2 text-gray-300">•</span>
                            <span className="text-xs text-gray-500 flex items-center">
                              <MapPin size={12} className="mr-1" />
                              {person.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <button className="w-full py-3 text-sm font-medium text-center text-indigo-600 hover:text-indigo-800 border border-dashed border-gray-300 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/30 transition-all duration-200 mt-4">
                      + Add New Personnel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;