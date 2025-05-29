import { BarChart3, CreditCard, LogOut, ShoppingBag, Truck, User, X } from "lucide-react";
import { useLocation } from "react-router-dom";

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const DashboardSidebar = ({ isOpen, onClose }: DashboardSidebarProps) => {
  const location = useLocation();
  
  const navItems = [
    { icon: BarChart3, label: 'Dashboard', path: '/dashboard' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: ShoppingBag, label: 'Orders', path: '/orders' },
    { icon: CreditCard, label: 'Wallet', path: '/wallet' },
    { icon: Truck, label: 'Addresses', path: '/addresses' },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static
        left-0 top-0 
        h-screen lg:h-auto
        w-80 
        bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 
        transform transition-transform duration-300 ease-in-out 
        z-50 lg:z-auto
        flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="flex-shrink-0 p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">FreshMart</h2>
              <p className="text-slate-400 text-sm">Customer Portal</p>
            </div>
            <button 
              onClick={onClose}
              className="lg:hidden text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <a
                key={index}
                href={item.path}
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Icon size={20} className={`mr-3 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'}`} />
                <span className="font-medium">{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Logout - Fixed at bottom */}
        <div className="flex-shrink-0 p-4 border-t border-slate-700">
          <button className="w-full flex items-center px-4 py-3 text-slate-300 hover:bg-red-600 hover:text-white rounded-xl transition-all duration-200 group">
            <LogOut size={20} className="mr-3 text-slate-400 group-hover:text-white" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default DashboardSidebar;