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
  HelpCircle,
  X
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { logoutReatiler } from '../../api/reatilerApi';
import { reatilerLogout } from '../../slice/reatilerSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// Sidebar Link Component
interface SidebarLinkProps {
  icon: React.ReactNode;
  title: string;
  active?: boolean;
  hasSubMenu?: boolean;
  onClick: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ icon, title, active = false, hasSubMenu = false, onClick }) => {
  return (
    <div 
      className={`flex items-center justify-between px-3 md:px-4 py-2 md:py-3 cursor-pointer rounded-lg mb-1 transition-all ${
        active 
          ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-md' 
          : 'hover:bg-emerald-50 text-gray-600 hover:text-emerald-700'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className={`mr-2 md:mr-3 ${active ? 'text-white' : 'text-emerald-600'}`}>
          {icon}
        </div>
        {title && <span className={`font-medium text-sm md:text-base ${active ? 'text-white' : ''}`}>{title}</span>}
      </div>
      {hasSubMenu && (
        <div>
          {active ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </div>
      )}
    </div>
  );
};

// Sub Menu Item Component
interface SubMenuItemProps {
  title: string;
  active?: boolean;
  onClick: () => void;
}

const SubMenuItem: React.FC<SubMenuItemProps> = ({ title, active = false, onClick }) => {
  return (
    <div 
      className={`flex items-center px-4 py-2 pl-10 md:pl-12 cursor-pointer rounded-lg mb-1 transition-all ${
        active 
          ? 'bg-emerald-100 text-emerald-700 font-medium' 
          : 'hover:bg-emerald-50 text-gray-500'
      }`}
      onClick={onClick}
    >
      <span className="text-xs md:text-sm">{title}</span>
    </div>
  );
};

// Main Sidebar Component
interface RetailerSidebarProps {
  retailerName: string;
  storeName: string;
  onNavigate: (page: string) => void;
  activePage: string;
}

const RetailerSidebar: React.FC<RetailerSidebarProps> = ({ retailerName, storeName, onNavigate, activePage }) => {
  const [expandedMenu, setExpandedMenu] = useState<string | null>("inventory");
  const [collapsed, setCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  const retailerState = useSelector((state: RootState) => state.retailer.retailer);
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth < 768) {
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
  }, []);

  const toggleSubMenu = (menuName: string | null) => {
    setExpandedMenu(expandedMenu === menuName ? null : menuName);
  };

  const logoutRetailer = async ()=>{
    try {
      await logoutReatiler()
      dispatch(reatilerLogout())
      toast.success('Logged Out Success')
      navigate('/retailer/sign-up')
    } catch (error:any) {
      toast.error('Logout Failed')
    }
  }

  const showCollapseButton = windowWidth >= 768;
  const isMobile = windowWidth < 768;

  return (
    <div className={`bg-white h-full shadow-xl flex flex-col transition-all duration-300 border-r border-gray-100 ${
      collapsed ? 'w-16 md:w-20' : 'w-64 md:w-72'
    }`}>
      {/* Logo and Store */}
      <div className="px-3 md:px-4 py-4 md:py-6 border-b border-gray-100">
        <div className="flex items-center justify-center mb-4 md:mb-6">
          <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white p-2 md:p-3 rounded-lg md:rounded-xl shadow-md">
            <Store size={collapsed ? 20 : 24} />
          </div>
          {!collapsed && (
            <h1 className="ml-2 md:ml-3 text-lg md:text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
              GreenGrocer
            </h1>
          )}
        </div>
        {!collapsed && (
          <div className="text-center">
            <h2 className="font-semibold text-gray-800 text-sm md:text-base">{storeName}</h2>
            <p className="text-xs md:text-sm text-gray-500">Retailer: {retailerState?.name || retailerName}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 px-2 md:px-3 py-4 md:py-6 overflow-y-auto">
        <SidebarLink 
          icon={<BarChart2 size={collapsed ? 18 : 20} />} 
          title={collapsed ? "" : "Dashboard"} 
          active={activePage === "dashboard"}
          onClick={() => onNavigate("dashboard")}
        />
        
        <SidebarLink 
          icon={<Package size={collapsed ? 18 : 20} />} 
          title={collapsed ? "" : "Inventory"} 
          active={expandedMenu === "inventory"}
          hasSubMenu={!collapsed}
          onClick={() => toggleSubMenu("inventory")}
        />
        {expandedMenu === "inventory" && !collapsed && (
          <div className="ml-2">
            <SubMenuItem 
              title="Manage Stock" 
              active={activePage === "manage-stock"}
              onClick={() => onNavigate("manage-stock")}
            />
            <SubMenuItem 
              title="Add Products" 
              active={activePage === "add-products"}
              onClick={() => onNavigate("add-products")}
            />
            <SubMenuItem 
              title="Categories" 
              active={activePage === "categories"}
              onClick={() => onNavigate("categories")}
            />
          </div>
        )}
        
        <SidebarLink 
          icon={<ShoppingCart size={collapsed ? 18 : 20} />} 
          title={collapsed ? "" : "Orders"} 
          active={expandedMenu === "orders"}
          hasSubMenu={!collapsed}
          onClick={() => toggleSubMenu("orders")}
        />
        {expandedMenu === "orders" && !collapsed && (
          <div className="ml-2">
            <SubMenuItem 
              title="New Orders" 
              active={activePage === "new-orders"}
              onClick={() => onNavigate("new-orders")}
            />
            <SubMenuItem 
              title="Processing" 
              active={activePage === "processing-orders"}
              onClick={() => onNavigate("processing-orders")}
            />
            <SubMenuItem 
              title="Completed" 
              active={activePage === "completed-orders"}
              onClick={() => onNavigate("completed-orders")}
            />
          </div>
        )}
        
        <SidebarLink 
          icon={<Users size={collapsed ? 18 : 20} />} 
          title={collapsed ? "" : "Customers"} 
          active={activePage === "customers"}
          onClick={() => onNavigate("customers")}
        />
        
        <SidebarLink 
          icon={<MessageSquare size={collapsed ? 18 : 20} />} 
          title={collapsed ? "" : "Messages"} 
          active={activePage === "messages"}
          onClick={() => onNavigate("messages")}
        />

        <SidebarLink 
          icon={<Bell size={collapsed ? 18 : 20} />} 
          title={collapsed ? "" : "Notifications"} 
          active={activePage === "notifications"}
          onClick={() => onNavigate("notifications")}
        />
        
        <SidebarLink 
          icon={<Settings size={collapsed ? 18 : 20} />} 
          title={collapsed ? "" : "Settings"} 
          active={activePage === "settings"}
          onClick={() => onNavigate("settings")}
        />

        <SidebarLink 
          icon={<HelpCircle size={collapsed ? 18 : 20} />} 
          title={collapsed ? "" : "Help Center"} 
          active={activePage === "help"}
          onClick={() => onNavigate("help")}
        />
      </div>

      {/* User options */}
      <div className="border-t border-gray-100 px-3 md:px-4 py-3 md:py-4">
        {!collapsed ? (
          <div className="flex items-center mb-3 md:mb-4">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-emerald-500 to-green-400 flex items-center justify-center text-white font-semibold">
              {retailerState?.name?.charAt(0) || retailerName?.charAt(0) || 'U'}
            </div>
            <div className="ml-2 md:ml-3">
              <h4 className="text-sm md:text-base font-medium text-gray-800">{retailerState?.name || retailerName || 'User'}</h4>
              <p className="text-xs text-gray-500">Store Manager</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-emerald-500 to-green-400 flex items-center justify-center text-white font-semibold">
              {retailerState?.name?.charAt(0) || retailerName?.charAt(0) || 'U'}
            </div>
          </div>
        )}
        
        <div 
  className="flex items-center justify-between px-3 md:px-4 py-2 md:py-3 cursor-pointer rounded-lg text-red-500 hover:bg-red-50 transition-all"
  onClick={async () => {
    try {
      await logoutRetailer(); // Make API call
      onNavigate("logout"); // Navigate after successful logout
    } catch (error) {
      // Optional: show error notification
      console.error("Logout error:", error);
    }
  }}
>
  <div className="flex items-center">
    <LogOut size={collapsed ? 18 : 20} className="mr-2 md:mr-3" />
    {!collapsed && <span className="text-sm md:text-base font-medium">Log Out</span>}
  </div>
</div>

      </div>
      
      {/* Collapse button */}
      {showCollapseButton && (
        <div className="px-2 md:px-3 pb-3 md:pb-4">
          <button 
            className="w-full flex items-center justify-center py-2 px-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 transition-all"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <ChevronRight size={16} />
            ) : (
              <ChevronLeft size={16} />
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default RetailerSidebar;