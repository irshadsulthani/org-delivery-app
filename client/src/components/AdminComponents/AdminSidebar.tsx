import { 
  Home,
  Users,
  ShoppingBag,
  Truck,
  BarChart2,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Package,
  Bell
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { adminLogout } from '../../slice/adminSlice';
import { logoutAdmin } from '../../api/adminApi';
import { RootState } from '../../app/store';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

interface MenuItem {
  icon: React.ReactNode;
  title: string;
  path: string;
  badge?: number;
}

const AdminSidebar: React.FC<SidebarProps> = ({ 
  collapsed, 
  setCollapsed, 
  isMobile = false,
  onCloseMobile
}) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const selector = useSelector((state : RootState) => state.admin.admin)


  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Auto-collapse sidebar on small screens
      if (window.innerWidth < 768 && !isMobile && !collapsed) {
        setCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setCollapsed, isMobile, collapsed]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const menuItems: MenuItem[] = [
    { icon: <Home size={20} />, title: 'Dashboard', path: '/admin/dashboard' },
    { icon: <Users size={20} />, title: 'Customers', path: '/admin/customers' },
    { icon: <ShoppingBag size={20} />, title: 'Retailers', path: '/admin/retailers' },
    { icon: <Truck size={20} />, title: 'Delivery Boys', path: '/admin/delivery-boy' },
    { icon: <Package size={20} />, title: 'Orders', path: '/admin/orders', badge: 3 },
    { icon: <BarChart2 size={20} />, title: 'Analytics', path: '/admin/analytics' },
    { icon: <Settings size={20} />, title: 'Settings', path: '/admin/settings' },
  ];

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      dispatch(adminLogout());
      toast.success('Logged out successfully');
      navigate('/admin/login');
    } catch (error: any) {
      toast.error('Logout failed: ' + (error.message || 'Unknown error'));
    }
  };

  return (
    <div 
      className={`flex flex-col bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 text-white h-full 
      ${isMobile ? 'w-72' : collapsed ? 'w-20' : 'w-72'} 
      transition-all duration-300 shadow-2xl relative overflow-hidden`}
    >
      {/* Improved Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        <div className="absolute top-1/2 left-0 w-32 h-32 bg-blue-300 rounded-full blur-3xl -translate-x-1/2"></div>
      </div>

      {/* Header with Logo */}
      <div className="p-5 flex items-center justify-between border-b border-indigo-700/50 relative z-10">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-800 font-bold text-xl shadow-lg">
            <span className="bg-gradient-to-br from-indigo-800 to-indigo-600 bg-clip-text text-transparent">DE</span>
          </div>
          {!collapsed && (
            <span className="ml-3 font-bold text-xl tracking-tight transition-all duration-300 ease-in-out">DeliverEase</span>
          )}
        </div>

        {isMobile ? (
          <button 
            onClick={onCloseMobile} 
            className="p-2 rounded-full hover:bg-indigo-700/70 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/30"
            aria-label="Close sidebar"
          >
            <ChevronLeft size={20} />
          </button>
        ) : (
          <button 
            onClick={toggleSidebar} 
            className="p-2 rounded-full hover:bg-indigo-700/70 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/30"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        )}
      </div>

      {/* User Profile Summary - Enhanced */}
      {(!collapsed || isMobile) && (
        <div className="mt-6 px-5 flex items-center relative z-10">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-medium shadow-md">
            JD
          </div>
          <div className="ml-3">
            <p className="font-medium text-sm">{selector?.name}</p>
            <p className="text-xs text-white/70">Admin</p>
          </div>
          {/* Status indicator */}
          <div className="ml-auto">
            <div className="w-2.5 h-2.5 bg-green-400 rounded-full relative">
              <span className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Menu - Improved */}
      <div className="mt-6 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-700 scrollbar-track-transparent relative z-10 px-3">
        <nav>
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <a
                key={index}
                href={item.path}
                onMouseEnter={() => setHoveredItem(item.path)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`flex items-center rounded-xl py-3 px-4 mb-2.5 group relative
                  ${isActive 
                    ? 'bg-white/90 text-indigo-800 font-medium shadow-lg' 
                    : 'text-white/80 hover:bg-indigo-700/60 hover:text-white'
                  } transition-all duration-200 ${
                    collapsed && !isMobile ? 'justify-center' : ''
                  }`}
              >
                <span className={`flex-shrink-0 transition-transform duration-200 ${
                  (hoveredItem === item.path && !isActive) ? 'transform scale-110' : ''
                }`}>
                  {item.icon}
                </span>
                
                {(!collapsed || isMobile) && (
                  <span className="ml-3 font-medium whitespace-nowrap transition-opacity duration-200">{item.title}</span>
                )}
                
                {/* Badge for notifications - Enhanced */}
                {item.badge && (
                  <div className={`flex items-center justify-center ${
                    collapsed && !isMobile ? 'absolute -top-1 -right-1' : 'ml-auto'
                  }`}>
                    <span className="bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                      {item.badge}
                    </span>
                  </div>
                )}

                {/* Tooltip for collapsed mode - Enhanced */}
                {(collapsed && !isMobile && hoveredItem === item.path) && (
                  <div className="absolute left-16 bg-indigo-900 text-white px-3 py-1.5 rounded-md text-sm whitespace-nowrap z-20 shadow-xl before:content-[''] before:absolute before:top-1/2 before:-left-1 before:w-2 before:h-2 before:bg-indigo-900 before:transform before:rotate-45 before:-translate-y-1/2">
                    {item.title}
                  </div>
                )}
              </a>
            );
          })}
        </nav>
      </div>

      {/* Divider */}
      <div className="border-t border-indigo-700/30 my-2 mx-4"></div>

      {/* Logout Button - Enhanced */}
      <div className="p-4 border-t border-indigo-700/50 relative z-10">
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
            <div className="absolute left-16 bg-indigo-900 text-white px-3 py-1.5 rounded-md text-sm whitespace-nowrap z-20 shadow-xl before:content-[''] before:absolute before:top-1/2 before:-left-1 before:w-2 before:h-2 before:bg-indigo-900 before:transform before:rotate-45 before:-translate-y-1/2">
              Logout
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;