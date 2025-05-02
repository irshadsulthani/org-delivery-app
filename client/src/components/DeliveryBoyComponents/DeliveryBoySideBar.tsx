// components/Sidebar.tsx
import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Package, 
  Calendar, 
  CreditCard, 
  Settings, 
  User, 
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logoutDeliveryBoy } from '../../api/deliveryBoyApi';
import { useDispatch, useSelector } from 'react-redux';
import { logoutDeliveryboy } from '../../slice/deliveryBoySlice';
import { toast } from 'react-toastify';

interface SidebarProps {
  userName: string;
  userAvatar?: string;
  onCollapseChange?: (collapsed: boolean) => void;
}

const DeliveryBoySideBar: React.FC<SidebarProps> = ({ userName, userAvatar, onCollapseChange }) => {
  const location = useLocation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selector = useSelector((state: any) => state.deliveryBoy.deliveryBoy);
  console.log(selector);
  
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const toggleSidebar = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    if (onCollapseChange) {
      onCollapseChange(newCollapsed);
    }
  };

  const navItems = [
    { name: 'Dashboard', href: '/delivery-boy/dashboard', icon: Home },
    { name: 'Active Orders', href: '/delivery-boy/active-orders', icon: Package },
    { name: 'Delivery History', href: '/delivery-boy/delivery-history', icon: Calendar },
    { name: 'Earnings', href: '/delivery-boy/earnings', icon: CreditCard },
    { name: 'Profile', href: '/delivery-boy/profile', icon: User },
    { name: 'Settings', href: '/delivery-boy/settings', icon: Settings },
  ];

  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    await logoutDeliveryBoy();
    dispatch(logoutDeliveryboy());
    toast.success('Logged out successfully');
    navigate('/delivery/sign-up');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleMobileSidebar}
          className="p-2 rounded-full bg-green-600 text-white shadow-lg hover:bg-green-700 transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile sidebar backdrop */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden backdrop-blur-sm"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 bg-white shadow-xl transform transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isCollapsed ? 'lg:w-20' : 'lg:w-64'} w-64`}
      >
        <div className="h-full flex flex-col bg-gradient-to-b from-green-50 to-white">
          {/* Logo and Brand */}
          <div className="p-4 border-b border-green-100">
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
              <div className="rounded-full bg-green-100 p-2 shadow-sm">
                <Package size={24} className="text-green-600" />
              </div>
              {!isCollapsed && (
                <h1 className="ml-2 text-xl font-bold text-gray-800">VeggieGo</h1>
              )}
              
              {/* Collapse button (desktop only) */}
              <button 
                onClick={toggleSidebar}
                className="hidden lg:flex ml-auto p-1 rounded-full hover:bg-green-100 text-green-600"
                aria-label="Toggle sidebar"
              >
                <ChevronRight size={20} className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* User info */}
          <div className={`p-4 border-b border-green-100 ${isCollapsed ? 'flex justify-center' : ''}`}>
            {!isCollapsed ? (
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt={userName}
                      className="h-10 w-10 rounded-full border-2 border-green-200 shadow-sm"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center shadow-sm">
                      <span className="text-white font-medium">
                        {userName?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-800">{userName}</p>
                  <div className="flex items-center">
                    <span className="h-2 w-2 bg-green-500 rounded-full mr-1"></span>
                    <p className="text-xs font-medium text-green-600">Online</p>
                  </div>
                </div>
                <div className="ml-auto">
                  <div className="relative">
                    <Bell size={18} className="text-gray-500 hover:text-green-600 cursor-pointer" />
                    <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center bg-red-500 text-white text-xs rounded-full">3</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt={userName}
                    className="h-10 w-10 rounded-full border-2 border-green-200 shadow-sm"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center shadow-sm">
                    <span className="text-white font-medium">
                      {userName?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="relative mt-2">
                  <Bell size={16} className="text-gray-500" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                </div>
              </div>
            )}
          </div>

          {/* Time display */}
          {!isCollapsed && (
            <div className="px-4 py-2 bg-green-50">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">{currentTime.toLocaleDateString()}</p>
                <p className="text-xs font-medium text-green-600">{formatTime(currentTime)}</p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className={`space-y-1 ${isCollapsed ? 'px-1' : 'px-3'}`}>
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center ${isCollapsed ? 'justify-center' : ''} px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      active
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-green-50'
                    }`}
                    onClick={() => {
                      if (isMobileSidebarOpen) {
                        setIsMobileSidebarOpen(false);
                      }
                    }}
                  >
                    <Icon
                      size={20}
                      className={active ? 'text-white' : 'text-gray-500'}
                    />
                    {!isCollapsed && (
                      <span className="ml-3">{item.name}</span>
                    )}
                    {!isCollapsed && active && (
                      <span className="ml-auto bg-white bg-opacity-20 rounded-full h-5 w-5 flex items-center justify-center">
                        <ChevronRight size={14} className="text-white" />
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Stats summary (not visible when collapsed) */}
          {!isCollapsed && (
            <div className="p-4 bg-green-50 border-t border-green-100">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <p className="text-xs text-gray-500">Today's Deliveries</p>
                  <p className="text-xl font-bold text-green-600">12</p>
                </div>
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <p className="text-xs text-gray-500">Total Earnings</p>
                  <p className="text-xl font-bold text-green-600">$45</p>
                </div>
              </div>
            </div>
          )}

          {/* Logout button */}
          <div className={`p-4 border-t border-green-100 ${isCollapsed ? 'flex justify-center' : ''}`}>
            <button
              onClick={handleLogout}
              className={`flex items-center ${isCollapsed ? 'justify-center w-10 h-10' : 'px-4 py-2 w-full'} text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors`}
              aria-label="Logout"
            >
              <LogOut size={20} className={isCollapsed ? '' : 'mr-2'} />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main content padding to prevent overlap with sidebar */}
      <div className={`transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        {/* Your main content goes here */}
      </div>
    </>
  );
};

export default DeliveryBoySideBar;