import React, { useState, useEffect } from 'react';
import { 
  Store, 
  Package, 
  ShoppingCart, 
  BarChart2, 
  Settings, 
  Users, 
  MessageSquare, 
  LogOut,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Bell,
  HelpCircle
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { RootState } from '../../app/store';
import { logoutReatiler } from '../../api/reatilerApi';
import { reatilerLogout } from '../../slice/reatilerSlice';
import { toast } from 'react-toastify';

interface RetailerSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  isMobile?: boolean;
  onCloseMobile?: () => void;
  retailerName?: string;
  storeName?: string;
}

interface MenuItem {
  icon: React.ReactNode;
  title: string;
  path: string;
  badge?: number;
  subItems?: { title: string; path: string; badge?: number }[];
}

const RetailerSidebar: React.FC<RetailerSidebarProps> = ({ 
  collapsed, 
  setCollapsed, 
  isMobile = false,
  onCloseMobile,
  retailerName,
  storeName
}) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [expandedMenu, setExpandedMenu] = useState<string | null>("inventory");
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  const retailerState = useSelector((state: RootState) => state.retailer.retailer);

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Auto-collapse sidebar on small screens
      if (window.innerWidth < 768 && !isMobile && !collapsed) {
        setCollapsed(true);
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
  }, [setCollapsed, isMobile, collapsed]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleSubMenu = (menuName: string) => {
    setExpandedMenu(expandedMenu === menuName ? null : menuName);
  };

  const menuItems: MenuItem[] = [
    { 
      icon: <BarChart2 size={20} />, 
      title: 'Dashboard', 
      path: '/retailer/dashboard' 
    },
    { 
      icon: <Package size={20} />, 
      title: 'Inventory', 
      path: '/retailer/inventory',
      subItems: [
        { title: 'Products', path: '/retailer/products' },
        { title: 'Add Products', path: '/retailer/add-product' },
        { title: 'Categories', path: '/retailer/categories' }
      ]
    },
    { 
      icon: <ShoppingCart size={20} />, 
      title: 'Orders', 
      path: '/retailer/orders',
      badge: 5,
      subItems: [
        { title: 'New Orders', path: '/retailer/new-orders', badge: 3 },
        { title: 'Processing', path: '/retailer/processing-orders', badge: 2 },
        { title: 'Completed', path: '/retailer/completed-orders' }
      ]
    },
    { 
      icon: <Users size={20} />, 
      title: 'Customers', 
      path: '/retailer/customers' 
    },
    { 
      icon: <MessageSquare size={20} />, 
      title: 'Messages', 
      path: '/retailer/messages',
      badge: 2
    },
    { 
      icon: <Bell size={20} />, 
      title: 'Notifications', 
      path: '/retailer/notifications',
      badge: 4
    },
    { 
      icon: <Settings size={20} />, 
      title: 'Settings', 
      path: '/retailer/settings' 
    },
    { 
      icon: <HelpCircle size={20} />, 
      title: 'Help Center', 
      path: '/retailer/help' 
    }
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile && onCloseMobile) {
      onCloseMobile();
    }
  };

  const handleLogout = async () => {
    try {
      await logoutReatiler();
      dispatch(reatilerLogout());
      toast.success('Logged out successfully');
      navigate('/retailer/sign-up');
    } catch (error: any) {
      toast.error('Logout failed: ' + (error.message || 'Unknown error'));
    }
  };

  // Check if the current path is active (exact match or parent route)
  const isPathActive = (path: string) => {
    if (location.pathname === path) return true;
    if (path !== '/retailer/dashboard' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div 
      className={`flex flex-col bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 text-white h-full 
      ${isMobile ? 'w-72' : collapsed ? 'w-20' : 'w-72'} 
      transition-all duration-300 shadow-2xl relative overflow-hidden`}
    >
      {/* Improved Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        <div className="absolute top-1/2 left-0 w-32 h-32 bg-green-300 rounded-full blur-3xl -translate-x-1/2"></div>
      </div>

      {/* Header with Logo */}
      <div className="p-5 flex items-center justify-between border-b border-emerald-700/50 relative z-10">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-800 font-bold text-xl shadow-lg">
            <Store size={24} className="text-emerald-600" />
          </div>
          {!collapsed && (
            <span className="ml-3 font-bold text-xl tracking-tight transition-all duration-300 ease-in-out">GreenGrocer</span>
          )}
        </div>

        {isMobile ? (
          <button 
            onClick={onCloseMobile} 
            className="p-2 rounded-full hover:bg-emerald-700/70 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/30"
            aria-label="Close sidebar"
          >
            <ChevronLeft size={20} />
          </button>
        ) : (
          <button 
            onClick={toggleSidebar} 
            className="p-2 rounded-full hover:bg-emerald-700/70 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/30"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        )}
      </div>

      {/* User Profile Summary */}
      {(!collapsed || isMobile) && (
        <div className="mt-6 px-5 flex items-center relative z-10">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-medium shadow-md">
            {retailerState?.name?.charAt(0) || retailerName?.charAt(0) || 'R'}
          </div>
          <div className="ml-3">
            <p className="font-medium text-sm">{retailerState?.name || retailerName || 'Retailer'}</p>
            <p className="text-xs text-white/70">{storeName || 'Store Manager'}</p>
          </div>
          {/* Status indicator */}
          <div className="ml-auto">
            <div className="w-2.5 h-2.5 bg-green-400 rounded-full relative">
              <span className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <div className="mt-6 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-700 scrollbar-track-transparent relative z-10 px-3">
        <nav>
          {menuItems.map((item, index) => {
            const isActive = isPathActive(item.path);
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isExpanded = expandedMenu === item.title.toLowerCase();
            
            return (
              <div key={index}>
                <div
                  onMouseEnter={() => setHoveredItem(item.path)}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={() => {
                    if (hasSubItems) {
                      toggleSubMenu(item.title.toLowerCase());
                    } else {
                      handleNavigate(item.path);
                    }
                  }}
                  className={`flex items-center justify-between rounded-xl py-3 px-4 mb-2.5 group relative cursor-pointer
                    ${(isActive || isExpanded)
                      ? 'bg-white/90 text-emerald-800 font-medium shadow-lg' 
                      : 'text-white/80 hover:bg-emerald-700/60 hover:text-white'
                    } transition-all duration-200 ${
                      collapsed && !isMobile ? 'justify-center' : ''
                    }`}
                >
                  <div className="flex items-center">
                    <span className={`flex-shrink-0 transition-transform duration-200 ${
                      (hoveredItem === item.path && !isActive && !isExpanded) ? 'transform scale-110' : ''
                    }`}>
                      {item.icon}
                    </span>
                    
                    {(!collapsed || isMobile) && (
                      <span className="ml-3 font-medium whitespace-nowrap transition-opacity duration-200">{item.title}</span>
                    )}
                  </div>
                  
                  {/* Badge for notifications */}
                  {item.badge && (
                    <div className={`flex items-center justify-center ${
                      collapsed && !isMobile ? 'absolute -top-1 -right-1' : 'ml-auto mr-2'
                    }`}>
                      <span className="bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                        {item.badge}
                      </span>
                    </div>
                  )}

                  {/* Submenu indicator */}
                  {hasSubItems && !collapsed && (
                    <div className="ml-auto">
                      {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </div>
                  )}

                  {/* Tooltip for collapsed mode */}
                  {(collapsed && !isMobile && hoveredItem === item.path) && (
                    <div className="absolute left-16 bg-emerald-900 text-white px-3 py-1.5 rounded-md text-sm whitespace-nowrap z-20 shadow-xl before:content-[''] before:absolute before:top-1/2 before:-left-1 before:w-2 before:h-2 before:bg-emerald-900 before:transform before:rotate-45 before:-translate-y-1/2">
                      {item.title}
                      {item.badge && (
                        <span className="ml-2 bg-red-500 text-white text-xs font-medium px-1.5 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Submenu Items */}
                {hasSubItems && isExpanded && !collapsed && (
                  <div className="ml-4 mb-2">
                    {item.subItems?.map((subItem, subIndex) => {
                      const isSubActive = location.pathname === subItem.path;
                      return (
                        <div
                          key={subIndex}
                          onClick={() => handleNavigate(subItem.path)}
                          className={`flex items-center justify-between px-4 py-2 rounded-lg cursor-pointer mb-1 group
                            ${isSubActive 
                              ? 'bg-emerald-100 text-emerald-800 font-medium' 
                              : 'text-white/70 hover:bg-emerald-700/40 hover:text-white'
                            } transition-all duration-200`}
                        >
                          <span className="text-sm">{subItem.title}</span>
                          
                          {/* Badge for submenu item */}
                          {subItem.badge && (
                            <span className="bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-full shadow-sm">
                              {subItem.badge}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Divider */}
      <div className="border-t border-emerald-700/30 my-2 mx-4"></div>

      {/* Logout Button */}
      <div className="p-4 border-t border-emerald-700/50 relative z-10">
        <button 
          className={`flex w-full items-center py-2.5 px-4 text-white/80 hover:bg-red-500/20 hover:text-red-300 rounded-xl transition-colors duration-200 ${
            collapsed && !isMobile ? "justify-center" : ""
          }`} 
          onClick={handleLogout}
          onMouseEnter={() => setHoveredItem('logout')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <LogOut size={20} />
          {(!collapsed || isMobile) && <span className="ml-3 font-medium">Logout</span>}
          
          {/* Tooltip for collapsed mode */}
          {(collapsed && !isMobile && hoveredItem === 'logout') && (
            <div className="absolute left-16 bg-emerald-900 text-white px-3 py-1.5 rounded-md text-sm whitespace-nowrap z-20 shadow-xl before:content-[''] before:absolute before:top-1/2 before:-left-1 before:w-2 before:h-2 before:bg-emerald-900 before:transform before:rotate-45 before:-translate-y-1/2">
              Logout
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default RetailerSidebar;