// src/components/AdminHeader.tsx
import { Bell, Menu, Search, X, ChevronDown, Clock, Check, XCircle, Truck } from "lucide-react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { usePendingDeliveryBoys } from "../../customHooks/usePendingDeliveryBoys";


interface AdminHeaderProps {
  toggleMobileSidebar?: () => void;
  isSidebarOpen?: boolean;
}

function AdminHeader({ toggleMobileSidebar, isSidebarOpen = false }: AdminHeaderProps) {
  const location = window.location.pathname;
  const pageName = location.split("/").filter(Boolean).pop() || "dashboard";
  const formattedPageName = pageName.charAt(0).toUpperCase() + pageName.slice(1).replace(/-/g, " ");
  const selector = useSelector((state: RootState) => state.admin.admin);

  const { pendingDeliveryBoys, loading, refetch } = usePendingDeliveryBoys();
  
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 640);

  // Monitor scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Monitor screen size
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Format date to relative time (e.g., "2 hours ago")
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  // Get status icon and color
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { icon: <Clock size={14} className="text-yellow-500" />, color: 'bg-yellow-100 text-yellow-800' };
      case 'approved':
        return { icon: <Check size={14} className="text-green-500" />, color: 'bg-green-100 text-green-800' };
      case 'rejected':
        return { icon: <XCircle size={14} className="text-red-500" />, color: 'bg-red-100 text-red-800' };
      default:
        return { icon: <Clock size={14} className="text-gray-500" />, color: 'bg-gray-100 text-gray-800' };
    }
  };

  const handleApprove = async (id: string) => {
    try {
      // Call API to approve delivery boy
      console.log(`Approving delivery boy with id: ${id}`);
      // After successful approval, refetch the list
      refetch();
    } catch (error) {
      console.error('Error approving delivery boy:', error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      // Call API to reject delivery boy
      console.log(`Rejecting delivery boy with id: ${id}`);
      // After successful rejection, refetch the list
      refetch();
    } catch (error) {
      console.error('Error rejecting delivery boy:', error);
    }
  };

  return (
    <header 
      className={`bg-white z-20 sticky top-0 transition-all duration-300 ${
        isScrolled ? "shadow-md py-2" : "shadow-sm py-4"
      }`}
    >
      <div className="flex items-center justify-between px-4 md:px-6 max-w-screen-2xl mx-auto">
        <div className="flex items-center">
          <button 
            className="md:hidden mr-3 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={toggleMobileSidebar}
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <div className="flex flex-col">
            <h1 className="text-xl text-gray-800 font-bold flex items-center">
              {formattedPageName}
              <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full ml-2 font-normal">
                Admin
              </span>
            </h1>
            <p className="text-xs text-gray-500 hidden sm:block">
              Welcome back, manage your delivery operations
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 sm:space-x-4">
          {/* Search input with expanding animation */}
          <div className={`relative transition-all duration-300 ${
            isSmallScreen ? (isSearchFocused ? "w-full absolute right-0 top-0 bg-white z-30 p-4" : "hidden") : "block w-64"
          }`}>
            {isSmallScreen && isSearchFocused && (
              <button 
                className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setIsSearchFocused(false)}
              >
                <X size={18} />
              </button>
            )}
            
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              className={`py-2 ${isSmallScreen && isSearchFocused ? "pl-12" : "pl-10"} pr-4 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                isSmallScreen ? "w-full" : "w-64"
              } text-sm transition-all duration-300 ${
                isSearchFocused ? "bg-white border-indigo-300 shadow-sm" : ""
              }`}
            />
            
            {(!isSmallScreen || !isSearchFocused) && (
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            )}
            
            {searchQuery && (
              <button 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setSearchQuery("")}
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          {/* Search button for small screens */}
          {isSmallScreen && !isSearchFocused && (
            <button 
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
              onClick={() => setIsSearchFocused(true)}
              aria-label="Search"
            >
              <Search size={20} />
            </button>
          )}
          
          {/* Notification button and dropdown */}
          <div className="relative">
            <button 
              className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
              onClick={() => {
                setShowNotifications(!showNotifications);
                refetch(); // Refresh pending delivery boys when opening notifications
              }}
              aria-label="Notifications"
            >
              <Bell size={20} />
              {pendingDeliveryBoys && pendingDeliveryBoys.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
              )}
            </button>
            
            {/* Notification dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-30">
                <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-medium text-gray-700">Verification Requests</h3>
                  {pendingDeliveryBoys && pendingDeliveryBoys.length > 0 && (
                    <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-medium">
                      {pendingDeliveryBoys.length} pending
                    </span>
                  )}
                </div>
                
                <div className="max-h-72 overflow-y-auto">
                  {loading ? (
                    <div className="px-4 py-8 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                      <p className="text-sm text-gray-500 mt-2">Loading requests...</p>
                    </div>
                  ) : pendingDeliveryBoys && pendingDeliveryBoys.length > 0 ? (
                    pendingDeliveryBoys.map((deliveryBoy) => {
                      const statusInfo = getStatusInfo(deliveryBoy.status);
                      return (
                        <div 
                          key={deliveryBoy.id} 
                          className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors duration-150 ${
                            deliveryBoy.status === 'pending' ? "bg-blue-50/40" : ""
                          }`}
                        >
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mr-3">
                              {deliveryBoy.profileImageUrl ? (
                                <img 
                                  src={deliveryBoy.profileImageUrl} 
                                  alt={deliveryBoy.name}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                  <Truck className="text-indigo-600" size={18} />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <p className="text-sm font-medium text-gray-800 truncate">
                                  {deliveryBoy.name}
                                </p>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${statusInfo.color} flex items-center`}>
                                  {statusInfo.icon}
                                  <span className="ml-1">{deliveryBoy.status}</span>
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{deliveryBoy.phone}</p>
                              <p className="text-xs text-gray-400 mt-1 flex items-center">
                                <Clock className="mr-1" size={12} />
                                {formatRelativeTime(deliveryBoy.createdAt)}
                              </p>
                            </div>
                          </div>
                          {deliveryBoy.status === 'pending' && (
                            <div className="mt-2 flex space-x-2">
                              <button 
                                className="text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded transition-colors duration-200"
                                onClick={() => handleApprove(deliveryBoy.id)}
                              >
                                Approve
                              </button>
                              <button 
                                className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded transition-colors duration-200"
                                onClick={() => handleReject(deliveryBoy.id)}
                              >
                                Reject
                              </button>
                              <button 
                                className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded transition-colors duration-200"
                                onClick={() => {
                                  // Handle view details action
                                  console.log(`View details ${deliveryBoy.id}`);
                                }}
                              >
                                View
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="px-4 py-8 text-center">
                      <Truck className="mx-auto text-gray-300" size={24} />
                      <p className="text-sm text-gray-500 mt-2">No pending verification requests</p>
                    </div>
                  )}
                </div>
                
                <div className="px-4 py-2 border-t border-gray-100">
                  <a 
                    href="/admin/delivery-boy" 
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center justify-center"
                  >
                    View all delivery boys
                  </a>
                </div>
              </div>
            )}
          </div>
          
          {/* User profile */}
          <div className="flex items-center cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors duration-200">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-800 text-white flex items-center justify-center font-medium shadow-md ring-2 ring-indigo-100">
              {selector?.name?.split(' ').map(n => n[0]).join('') || 'A'}
            </div>
            <div className="ml-2 hidden sm:block">
              <p className="text-sm font-medium text-gray-800">{selector?.name}</p>
              <p className="text-xs text-gray-500">{selector?.email}</p>
            </div>
            <ChevronDown size={16} className="ml-1 text-gray-400 hidden sm:block" />
          </div>
        </div>
      </div>
      
      {/* Breadcrumbs - optional */}
      <div className="px-6 pb-2 pt-0 text-xs text-gray-500 hidden sm:block">
        <nav className="flex">
          <a href="/admin/dashboard" className="hover:text-indigo-600 transition-colors duration-200">Dashboard</a>
          {pageName !== "dashboard" && (
            <>
              <span className="mx-2">•</span>
              <span className="text-gray-700">{formattedPageName}</span>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default AdminHeader;