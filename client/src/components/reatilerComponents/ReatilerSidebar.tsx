import React, { useState } from 'react';
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

interface SidebarLinkProps {
  icon: React.ReactNode;
  title: string;
  active?: boolean;
  hasSubMenu?: boolean;
  onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ 
  icon, 
  title, 
  active = false, 
  hasSubMenu = false,
  onClick 
}) => {
  return (
    <div 
      className={`flex items-center justify-between px-4 py-3 cursor-pointer rounded-lg mb-1 transition-all ${
        active 
          ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-md' 
          : 'hover:bg-emerald-50 text-gray-600 hover:text-emerald-700'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className={`mr-3 ${active ? 'text-white' : 'text-emerald-600'}`}>
          {icon}
        </div>
        <span className={`font-medium ${active ? 'text-white' : ''}`}>{title}</span>
      </div>
      {hasSubMenu && (
        <div>
          {active ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </div>
      )}
    </div>
  );
};

interface SubMenuItemProps {
  title: string;
  active?: boolean;
  onClick?: () => void;
}

const SubMenuItem: React.FC<SubMenuItemProps> = ({ title, active = false, onClick }) => {
  return (
    <div 
      className={`flex items-center px-4 py-2 pl-12 cursor-pointer rounded-lg mb-1 transition-all ${
        active 
          ? 'bg-emerald-100 text-emerald-700 font-medium' 
          : 'hover:bg-emerald-50 text-gray-500'
      }`}
      onClick={onClick}
    >
      <span className="text-sm">{title}</span>
    </div>
  );
};

interface RetailerSidebarProps {
  retailerName: string;
  storeName: string;
  onNavigate: (page: string) => void;
  activePage: string;
}

const RetailerSidebar: React.FC<RetailerSidebarProps> = ({ 
  retailerName, 
  storeName, 
  onNavigate,
  activePage
}) => {
  const [expandedMenu, setExpandedMenu] = useState<string | null>("inventory");
  const [collapsed, setCollapsed] = useState(false);

  const toggleSubMenu = (menuName: string) => {
    setExpandedMenu(expandedMenu === menuName ? null : menuName);
  };

  return (
    <div className={`bg-white h-full shadow-xl flex flex-col transition-all duration-300 border-r border-gray-100 ${
      collapsed ? 'w-20' : 'w-72'
    }`}>
      {/* Logo and Store */}
      <div className="px-4 py-6 border-b border-gray-100">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white p-3 rounded-xl shadow-lg">
            <Store size={24} />
          </div>
          {!collapsed && (
            <h1 className="ml-3 text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
              GreenGrocer
            </h1>
          )}
        </div>
        {!collapsed && (
          <div className="text-center">
            <h2 className="font-semibold text-gray-800">{storeName}</h2>
            <p className="text-sm text-gray-500">Retailer: {retailerName}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-6 overflow-y-auto">
        <SidebarLink 
          icon={<BarChart2 size={20} />} 
          title={collapsed ? "" : "Dashboard"} 
          active={activePage === "dashboard"}
          onClick={() => onNavigate("dashboard")}
        />
        
        <SidebarLink 
          icon={<Package size={20} />} 
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
          icon={<ShoppingCart size={20} />} 
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
          icon={<Users size={20} />} 
          title={collapsed ? "" : "Customers"} 
          active={activePage === "customers"}
          onClick={() => onNavigate("customers")}
        />
        
        <SidebarLink 
          icon={<MessageSquare size={20} />} 
          title={collapsed ? "" : "Messages"} 
          active={activePage === "messages"}
          onClick={() => onNavigate("messages")}
        />

        <SidebarLink 
          icon={<Bell size={20} />} 
          title={collapsed ? "" : "Notifications"} 
          active={activePage === "notifications"}
          onClick={() => onNavigate("notifications")}
        />
        
        <SidebarLink 
          icon={<Settings size={20} />} 
          title={collapsed ? "" : "Settings"} 
          active={activePage === "settings"}
          onClick={() => onNavigate("settings")}
        />

        <SidebarLink 
          icon={<HelpCircle size={20} />} 
          title={collapsed ? "" : "Help Center"} 
          active={activePage === "help"}
          onClick={() => onNavigate("help")}
        />
      </div>

      {/* User options */}
      <div className="border-t border-gray-100 px-4 py-4">
        <div className="flex items-center mb-4">
          {!collapsed && (
            <>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-400 to-green-300 flex items-center justify-center text-white font-medium">
                {retailerName.split(' ').map(name => name[0]).join('')}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{retailerName}</p>
                <p className="text-xs text-gray-500">Store Owner</p>
              </div>
            </>
          )}
        </div>
        <SidebarLink 
          icon={<LogOut size={20} />} 
          title={collapsed ? "" : "Logout"} 
          onClick={() => onNavigate("logout")}
        />
      </div>
      
      {/* Collapse Button */}
      <div className="border-t border-gray-100 px-4 py-3">
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
        >
          {collapsed ? (
            <ChevronRight size={20} />
          ) : (
            <ChevronLeft size={20} />
          )}
        </button>
      </div>
    </div>
  );
};

export default RetailerSidebar;