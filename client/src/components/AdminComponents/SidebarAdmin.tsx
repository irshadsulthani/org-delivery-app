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
  import { useState } from 'react';
  import { useDispatch } from 'react-redux';
  import { useNavigate, useLocation } from 'react-router-dom';
  import { toast } from 'react-toastify';
  import { adminLogout } from '../../slice/adminSlice';
  import { logoutAdmin } from '../../api/adminApi';
  
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
  
  const SidebarAdmin: React.FC<SidebarProps> = ({ 
    collapsed, 
    setCollapsed, 
    isMobile = false,
    onCloseMobile
  }) => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  
    const toggleSidebar = () => {
      setCollapsed(!collapsed);
    };
  
    const menuItems: MenuItem[] = [
      { icon: <Home size={20} />, title: 'Dashboard', path: '/admin/dashboard' },
      { icon: <Users size={20} />, title: 'Customers', path: '/admin/customers' },
      { icon: <ShoppingBag size={20} />, title: 'Retailers', path: '/admin/retailers' },
      { icon: <Truck size={20} />, title: 'Delivery Personnel', path: '/admin/delivery' },
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
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
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
            >
              <ChevronLeft size={20} />
            </button>
          ) : (
            <button 
              onClick={toggleSidebar} 
              className="p-2 rounded-full hover:bg-indigo-700/70 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          )}
        </div>
  
        {/* User Profile Summary */}
        {(!collapsed || isMobile) && (
          <div className="mt-6 px-5 flex items-center relative z-10">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-medium">
              JD
            </div>
            <div className="ml-3">
              <p className="font-medium text-sm">John Doe</p>
              <p className="text-xs text-white/70">Admin</p>
            </div>
          </div>
        )}
  
        {/* Navigation Menu */}
        <div className="mt-6 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-700 scrollbar-track-transparent relative z-10">
          <nav className="px-3">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <a
                  key={index}
                  href={item.path}
                  onMouseEnter={() => setHoveredItem(item.path)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`flex items-center rounded-xl py-3 px-4 mb-2 group relative
                    ${isActive 
                      ? 'bg-white text-indigo-800 font-medium shadow-md' 
                      : 'text-white/80 hover:bg-indigo-700/60'
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
                    <span className="ml-3 font-medium whitespace-nowrap">{item.title}</span>
                  )}
                  
                  {/* Badge for notifications */}
                  {item.badge && (
                    <div className={`flex items-center justify-center ${
                      collapsed && !isMobile ? 'absolute -top-1 -right-1' : 'ml-auto'
                    }`}>
                      <span className="bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    </div>
                  )}
  
                  {/* Tooltip for collapsed mode */}
                  {(collapsed && !isMobile && hoveredItem === item.path) && (
                    <div className="absolute left-16 bg-indigo-900 text-white px-3 py-1.5 rounded-md text-sm whitespace-nowrap z-20 shadow-xl">
                      {item.title}
                    </div>
                  )}
                </a>
              );
            })}
          </nav>
        </div>
  
        {/* Notification Bell */}
        <div className="px-4 py-3 border-t border-b border-indigo-700/50 flex items-center justify-center relative z-10">
          <button className={`flex items-center py-2 px-4 text-white/80 hover:bg-indigo-700/60 rounded-xl transition-colors duration-200 w-full ${
            collapsed && !isMobile ? "justify-center" : ""
          }`}>
            <Bell size={20} />
            {(!collapsed || isMobile) && (
              <>
                <span className="ml-3 font-medium">Notifications</span>
                <span className="ml-auto bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">2</span>
              </>
            )}
          </button>
        </div>
  
  
  
  
        {/* Logout Button */}
        <div className="p-4 border-t border-indigo-700/50 relative z-10">
          <button 
            className={`flex w-full items-center py-2 px-4 text-white/80 hover:bg-indigo-700/60 rounded-xl transition-colors duration-200 ${
              collapsed && !isMobile ? "justify-center" : ""
            }`} 
            onClick={handleLogout}
          >
            <LogOut size={20} />
            {(!collapsed || isMobile) && <span className="ml-3 font-medium">Logout</span>}
            
            {/* Tooltip for collapsed mode */}
            {(collapsed && !isMobile && hoveredItem === 'logout') && (
              <div className="absolute left-16 bg-indigo-900 text-white px-3 py-1.5 rounded-md text-sm whitespace-nowrap z-20 shadow-xl">
                Logout
              </div>
            )}
          </button>
        </div>
      </div>
    );
  };
  
  export default SidebarAdmin;