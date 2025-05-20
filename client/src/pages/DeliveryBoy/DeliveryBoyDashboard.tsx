// pages/delivery-boy/dashboard.tsx
import React, { useState, useEffect } from 'react';
import { 
  Package, 
  TrendingUp, 
  Check, 
  Clock,
  MapPin,
  Star,
  Calendar,
  ArrowRight,
  Navigation,
  DollarSign,
  BarChart,
  AlertCircle,
  Truck
} from 'lucide-react';
import DeliveryBoySideBar from '../../components/DeliveryBoy/DeliveryBoySideBar';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';

interface OrderStats {
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  earnings: number;
  rating: number;
  todayEarnings: number;
  todayDistance: number;
  todayDeliveries: number;
}

interface PendingOrder {
  id: string;
  customerName: string;
  address: string;
  items: number;
  price: number;
  distance: string;
  estimatedTime: string;
  orderTime: string;
}

const DeliveryBoyDashboard: React.FC = () => {
  const [stats, setStats] = useState<OrderStats>({
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    earnings: 0,
    rating: 0,
    todayEarnings: 0,
    todayDistance: 0,
    todayDeliveries: 0
  });
  
  const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const selector = useSelector((state: RootState) => state.deliveryBoy.deliveryBoy)

  useEffect(() => {
    // This would normally be an API call
    const fetchDashboardData = async () => {
      try {
        // Simulate API call with setTimeout
        setTimeout(() => {
          // Mock data
          setStats({
            totalOrders: 258,
            completedOrders: 245,
            pendingOrders: 2,
            earnings: 5840,
            rating: 4.8,
            todayEarnings: 45,
            todayDistance: 12.5,
            todayDeliveries: 5
          });
          
          setPendingOrders([
            {
              id: 'ORD-7845',
              customerName: 'John Doe',
              address: '123 Main St, Apartment 4B, New York',
              items: 6,
              price: 45.80,
              distance: '2.4 km',
              estimatedTime: '15 min',
              orderTime: '10 min ago'
            },
            {
              id: 'ORD-7846',
              customerName: 'Sarah Johnson',
              address: '456 Park Ave, Suite 302, New York',
              items: 3,
              price: 23.50,
              distance: '3.1 km',
              estimatedTime: '20 min',
              orderTime: '2 min ago'
            }
          ]);
          
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleAcceptOrder = (orderId: string) => {
    console.log(`Accepted order: ${orderId}`);
    // This would normally update the server
    setPendingOrders(pendingOrders.filter(order => order.id !== orderId));
  };

  const handleDeclineOrder = (orderId: string) => {
    console.log(`Declined order: ${orderId}`);
    // This would normally update the server
    setPendingOrders(pendingOrders.filter(order => order.id !== orderId));
  };

  const handleSidebarCollapse = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <DeliveryBoySideBar userName={selector?.name || ''} onCollapseChange={handleSidebarCollapse} />
      
      <div className={`transition-all duration-300 ${isCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        <div className="p-6">
          {/* Header section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Welcome Back, {selector?.name || ''}  </h1>
              <p className="text-gray-500 mt-1">Here's what's happening with your deliveries today</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-2">
              <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                Active
              </div>
              <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Today: {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              <p className="ml-3 text-gray-600">Loading your dashboard...</p>
            </div>
          ) : (
            <>
              {/* Today's overview */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Today's Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                    <div className="flex items-center">
                      <div className="bg-blue-500 p-4 flex items-center justify-center">
                        <Truck className="h-6 w-6 text-white" />
                      </div>
                      <div className="p-4 flex-1">
                        <p className="text-sm font-medium text-gray-500">Deliveries</p>
                        <div className="flex items-center justify-between">
                          <p className="text-2xl font-bold text-gray-800">{stats.todayDeliveries}</p>
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Today</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                    <div className="flex items-center">
                      <div className="bg-green-500 p-4 flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-white" />
                      </div>
                      <div className="p-4 flex-1">
                        <p className="text-sm font-medium text-gray-500">Earnings</p>
                        <div className="flex items-center justify-between">
                          <p className="text-2xl font-bold text-gray-800">${stats.todayEarnings}</p>
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Today</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                    <div className="flex items-center">
                      <div className="bg-purple-500 p-4 flex items-center justify-center">
                        <Navigation className="h-6 w-6 text-white" />
                      </div>
                      <div className="p-4 flex-1">
                        <p className="text-sm font-medium text-gray-500">Distance</p>
                        <div className="flex items-center justify-between">
                          <p className="text-2xl font-bold text-gray-800">{stats.todayDistance} km</p>
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Today</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Performance Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 transition-all duration-200 hover:shadow-lg">
                    <div className="flex items-center mb-4">
                      <div className="p-3 rounded-lg bg-gradient-to-r from-indigo-400 to-indigo-600 mr-4">
                        <Package className="h-6 w-6 text-white" />
                      </div>
                      <p className="text-lg font-semibold text-gray-800">Total Orders</p>
                    </div>
                    <div className="flex items-end justify-between">
                      <p className="text-3xl font-bold text-gray-800">{stats.totalOrders}</p>
                      <div className="flex items-center text-green-500 text-sm">
                        <span className="font-medium">+12%</span>
                        <TrendingUp className="h-4 w-4 ml-1" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 transition-all duration-200 hover:shadow-lg">
                    <div className="flex items-center mb-4">
                      <div className="p-3 rounded-lg bg-gradient-to-r from-green-400 to-green-600 mr-4">
                        <Check className="h-6 w-6 text-white" />
                      </div>
                      <p className="text-lg font-semibold text-gray-800">Completed</p>
                    </div>
                    <div className="flex items-end justify-between">
                      <p className="text-3xl font-bold text-gray-800">{stats.completedOrders}</p>
                      <div className="flex items-center text-green-500 text-sm">
                        <span className="font-medium">95%</span>
                        <BarChart className="h-4 w-4 ml-1" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 transition-all duration-200 hover:shadow-lg">
                    <div className="flex items-center mb-4">
                      <div className="p-3 rounded-lg bg-gradient-to-r from-amber-400 to-amber-600 mr-4">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                      <p className="text-lg font-semibold text-gray-800">Earnings</p>
                    </div>
                    <div className="flex items-end justify-between">
                      <p className="text-3xl font-bold text-gray-800">${stats.earnings.toFixed(0)}</p>
                      <div className="flex items-center text-green-500 text-sm">
                        <span className="font-medium">+8%</span>
                        <TrendingUp className="h-4 w-4 ml-1" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 transition-all duration-200 hover:shadow-lg">
                    <div className="flex items-center mb-4">
                      <div className="p-3 rounded-lg bg-gradient-to-r from-pink-400 to-pink-600 mr-4">
                        <Star className="h-6 w-6 text-white" />
                      </div>
                      <p className="text-lg font-semibold text-gray-800">Rating</p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-3xl font-bold text-gray-800">{stats.rating}</p>
                      <div className="mt-2 flex items-center">
                        {[...Array(5)].map((_, index) => (
                          <Star
                            key={index}
                            className={`h-5 w-5 ${
                              index < Math.floor(stats.rating)
                                ? 'text-yellow-400 fill-current'
                                : index < stats.rating
                                ? 'text-yellow-400 fill-current opacity-60'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-500">Based on 142 reviews</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pending Orders */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">New Orders</h2>
                  <div className="flex items-center">
                    <AlertCircle className="w-4 h-4 text-amber-500 mr-1" />
                    <span className="text-sm text-gray-600">Requires action</span>
                  </div>
                </div>
                
                {pendingOrders.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-md p-8 text-center border border-gray-100">
                    <div className="inline-flex items-center justify-center p-4 bg-green-50 rounded-full mb-4">
                      <Check className="h-8 w-8 text-green-500" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-800 mb-2">All caught up!</h3>
                    <p className="text-gray-500 max-w-md mx-auto">No pending orders right now. Take a break or check back later for new deliveries.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {pendingOrders.map((order) => (
                      <div key={order.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-200 hover:shadow-lg">
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <div className="rounded-lg bg-amber-100 p-2">
                                <Package className="h-5 w-5 text-amber-600" />
                              </div>
                              <div className="ml-3">
                                <h3 className="text-lg font-semibold text-gray-800">Order #{order.id}</h3>
                                <p className="text-sm text-gray-500">{order.orderTime}</p>
                              </div>
                            </div>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                              <Clock className="h-3 w-3 mr-1" />
                              New Order
                            </span>
                          </div>
                          
                          <div className="mb-6">
                            <div className="flex items-center mb-2">
                              <span className="text-sm font-medium text-gray-700 w-24">Customer:</span>
                              <span className="text-sm text-gray-600">{order.customerName}</span>
                            </div>
                            <div className="flex items-start mb-2">
                              <span className="text-sm font-medium text-gray-700 w-24">Address:</span>
                              <span className="text-sm text-gray-600">{order.address}</span>
                            </div>
                            <div className="flex items-center mb-2">
                              <span className="text-sm font-medium text-gray-700 w-24">Items:</span>
                              <span className="text-sm text-gray-600">{order.items} items</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-gray-700 w-24">Price:</span>
                              <span className="text-sm font-semibold text-green-600">${order.price.toFixed(2)}</span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-xs text-gray-500 mb-1">Distance</p>
                              <div className="flex items-center">
                                <Navigation className="h-4 w-4 text-green-600 mr-1" />
                                <p className="text-sm font-medium">{order.distance}</p>
                              </div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-xs text-gray-500 mb-1">Est. Time</p>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 text-green-600 mr-1" />
                                <p className="text-sm font-medium">{order.estimatedTime}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleAcceptOrder(order.id)}
                              className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              Accept Order
                            </button>
                            <button
                              onClick={() => handleDeclineOrder(order.id)}
                              className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              Decline
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Activity Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
                  <button className="text-sm text-green-600 hover:text-green-800 font-medium flex items-center">
                    View All <ArrowRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
                
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                  <div className="divide-y divide-gray-100">
                    <div className="p-5 hover:bg-gray-50 transition-colors duration-150">
                      <div className="flex items-start">
                        <div className="rounded-full bg-blue-100 p-2 mr-4 mt-1">
                          <Check className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                            <div>
                              <h3 className="text-base font-medium text-gray-800">Order #ORD-7844 Delivered</h3>
                              <p className="text-sm text-gray-500 mt-1">Customer: Michael Brown • $32.80</p>
                            </div>
                            <div className="mt-2 sm:mt-0 flex items-center">
                              <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                              <p className="text-sm text-gray-500">Today, 2:34 PM</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-5 hover:bg-gray-50 transition-colors duration-150">
                      <div className="flex items-start">
                        <div className="rounded-full bg-green-100 p-2 mr-4 mt-1">
                          <Star className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                            <div>
                              <h3 className="text-base font-medium text-gray-800">You received a 5-star rating</h3>
                              <div className="flex items-center mt-1">
                                <p className="text-sm text-gray-500 mr-2">Customer: Emily Wilson</p>
                                <div className="flex">
                                  {[...Array(5)].map((_, index) => (
                                    <Star key={index} className="h-3 w-3 text-yellow-400 fill-current" />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="mt-2 sm:mt-0 flex items-center">
                              <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                              <p className="text-sm text-gray-500">Today, 12:15 PM</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-5 hover:bg-gray-50 transition-colors duration-150">
                      <div className="flex items-start">
                        <div className="rounded-full bg-blue-100 p-2 mr-4 mt-1">
                          <Check className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                            <div>
                              <h3 className="text-base font-medium text-gray-800">Order #ORD-7843 Delivered</h3>
                              <p className="text-sm text-gray-500 mt-1">Customer: Emily Wilson • $45.50</p>
                            </div>
                            <div className="mt-2 sm:mt-0 flex items-center">
                              <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                              <p className="text-sm text-gray-500">Today, 11:52 AM</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryBoyDashboard;