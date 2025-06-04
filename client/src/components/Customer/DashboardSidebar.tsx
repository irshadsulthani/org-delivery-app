import { BarChart3, CreditCard, LogOut, ShoppingBag, Truck, User, X, Heart, Star } from "lucide-react";
import { useSelector } from "react-redux";
import { useLocation, Link } from "react-router-dom";
import { RootState } from "../../app/store";

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const DashboardSidebar = ({ isOpen, onClose }: DashboardSidebarProps) => {
  const location = useLocation();
  const customer = useSelector((state:RootState) => state.auth.user);
  console.log(customer);
  
  const navItems = [
    { icon: BarChart3, label: 'Dashboard', path: '/dashboard' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: ShoppingBag, label: 'Orders', path: '/orders' },
    { icon: CreditCard, label: 'Wallet', path: '/wallet' },
    { icon: Truck, label: 'Addresses', path: '/addresses' },
  ];

  const handleLogout = () => {
    // Add your logout logic here
    console.log('Logout clicked');
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static
        left-0 top-0 
        h-screen lg:h-auto
        w-80 
        bg-gradient-to-br from-white via-slate-50/50 to-white
        border-r border-slate-200/60
        transform transition-all duration-500 ease-out
        z-50 lg:z-auto
        flex flex-col
        shadow-xl shadow-slate-200/40 lg:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 via-transparent to-rose-50/30 pointer-events-none" />
        
        {/* Header */}
        <div className="flex-shrink-0 p-6 border-b border-slate-200/40 bg-gradient-to-r from-white/80 to-slate-50/80 backdrop-blur-sm relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-500/25 rotate-3 hover:rotate-0 transition-transform duration-300">
                  <Heart size={22} className="text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full animate-pulse" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 bg-clip-text text-transparent">
                  FreshMart
                </h2>
                <p className="text-slate-500 text-sm font-medium flex items-center">
                  <Star size={12} className="text-yellow-500 mr-1" />
                  Customer Portal
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="lg:hidden text-slate-400 hover:text-slate-600 p-2 rounded-2xl hover:bg-slate-100/80 transition-all duration-300"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 p-6 space-y-3 overflow-y-auto">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={index}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && onClose()}
                className={`flex items-center px-5 py-4 rounded-3xl transition-all duration-300 group relative overflow-hidden ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-50 via-emerald-100/70 to-teal-50 text-emerald-700 shadow-lg shadow-emerald-500/20 border border-emerald-200/50'
                    : 'text-slate-600 hover:bg-gradient-to-r hover:from-slate-50 hover:via-white hover:to-slate-50 hover:text-slate-700 hover:shadow-md hover:shadow-slate-200/50'
                }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-full shadow-sm shadow-emerald-400/50" />
                )}
                
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mr-4 transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/30' 
                    : 'bg-gradient-to-br from-slate-100 to-slate-200/80 text-slate-500 group-hover:from-emerald-100 group-hover:to-teal-100 group-hover:text-emerald-600 group-hover:shadow-sm'
                }`}>
                  <Icon size={20} />
                </div>
                
                <div className="flex-1">
                  <span className="font-semibold text-base">{item.label}</span>
                  {isActive && (
                    <div className="w-full h-0.5 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full mt-1" />
                  )}
                </div>
                
                {/* Subtle hover accent */}
                {!isActive && (
                  <div className="absolute right-4 w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Info Section */}
        <div className="flex-shrink-0 p-6 border-t border-slate-200/40 bg-gradient-to-r from-slate-50/50 to-white/50 backdrop-blur-sm">
          <div className="flex items-center mb-5 p-4 rounded-3xl bg-gradient-to-r from-white to-slate-50 border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-500 rounded-3xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                <User size={24} className="text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-md shadow-emerald-400/30">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-lg font-bold text-slate-700">{customer?.name}</p>
              <div className="flex items-center space-x-1">
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                <span className="text-sm text-emerald-600 font-medium ml-2">Premium</span>
              </div>
            </div>
          </div>
          
          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center px-5 py-4 text-slate-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 hover:text-red-600 rounded-3xl transition-all duration-300 group border border-slate-200/50 hover:border-red-200/60 hover:shadow-sm"
          >
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center mr-4 bg-gradient-to-br from-slate-100 to-slate-200/80 group-hover:from-red-100 group-hover:to-rose-100 transition-all duration-300">
              <LogOut size={20} className="text-slate-500 group-hover:text-red-500 transition-colors duration-300" />
            </div>
            <span className="font-semibold text-base">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default DashboardSidebar;