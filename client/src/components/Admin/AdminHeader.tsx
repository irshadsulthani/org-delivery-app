// src/components/AdminHeader.tsx
import { Bell, Menu, Search, X, ChevronDown, Clock, Check, XCircle, Truck, Store } from "lucide-react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { usePendingDeliveryBoys } from "../../customHooks/usePendingDeliveryBoys";
import { usePendingRetailers } from "../../customHooks/usePendingRetailers";
import { useNavigate } from "react-router-dom";
import { getDeliveryBoyById, getRetailerById } from "../../api/adminApi";
import { toast } from "react-toastify"; // Add this import for toast notifications

interface AdminHeaderProps {
  toggleMobileSidebar?: () => void;
  isSidebarOpen?: boolean;
}

function AdminHeader({ toggleMobileSidebar, isSidebarOpen = false }: AdminHeaderProps) {
  const navigate = useNavigate();
  const routeNameMap: { [key: string]: string } = {
    "dashboard": "Dashboard",
    "users": "Users",
    "orders": "Orders",
    "products": "Products",
    "categories": "Categories",
    "brands": "Brands",
    "delivery-boy": "Delivery Boy Details",
    "retailer": "Retailer Details",
    "add-product": "Add Product",
    "edit-product": "Edit Product",
    "search": "Search Results",
  };

  const location = window.location.pathname;
  const pathSegments = location.split("/").filter(Boolean);
  const lastSegment = pathSegments.pop() || "dashboard";

  // Check if the last segment is an ID (e.g., for detail pages)
  const isId = /^[0-9a-fA-F]{24}$/.test(lastSegment); // MongoDB ObjectId pattern
  const secondLastSegment = pathSegments.pop();

  const pageKey = isId ? secondLastSegment || "dashboard" : lastSegment;
  const formattedPageName = routeNameMap[pageKey] || pageKey.charAt(0).toUpperCase() + pageKey.slice(1).replace(/-/g, " ");

  const selector = useSelector((state: RootState) => state.admin.admin);

  // Delivery Boys Hook
  const { 
    pendingDeliveryBoys, 
    loading: deliveryBoysLoading, 
    error: deliveryBoysError,
    refetch: refetchDeliveryBoys,
    handleApprove: approveDeliveryBoy,
    handleReject: rejectDeliveryBoy 
  } = usePendingDeliveryBoys();
  
  // Retailers Hook
  const {
    pendingRetailers,
    loading: retailersLoading,
    error: retailersError,
    refetch: refetchRetailers,
    handleApprove: approveRetailer,
    handleReject: rejectRetailer
  } = usePendingRetailers();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 640);
  const [activeTab, setActiveTab] = useState("delivery"); // "delivery" or "retailers"

  // Calculate total notifications
  const totalNotifications = 
    (pendingDeliveryBoys?.filter(boy => boy.status === 'pending')?.length || 0) +
    (pendingRetailers?.filter(retailer => !retailer.isVerified)?.length || 0);

  // Monitor scroll position and screen size
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    const handleResize = () => setIsSmallScreen(window.innerWidth < 640);

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const getStatusInfo = (status: string | boolean) => {
    if (typeof status === 'boolean') {
      // For retailers where status is represented by isVerified
      return status 
        ? { icon: <Check size={14} className="text-green-500" />, color: 'bg-green-100 text-green-800', label: 'Verified' }
        : { icon: <Clock size={14} className="text-yellow-500" />, color: 'bg-yellow-100 text-yellow-800', label: 'Pending' };
    } else {
      // For delivery boys where status is a string
      switch (status) {
        case 'pending':
          return { icon: <Clock size={14} className="text-yellow-500" />, color: 'bg-yellow-100 text-yellow-800', label: 'Pending' };
        case 'approved':
          return { icon: <Check size={14} className="text-green-500" />, color: 'bg-green-100 text-green-800', label: 'Approved' };
        case 'rejected':
          return { icon: <XCircle size={14} className="text-red-500" />, color: 'bg-red-100 text-red-800', label: 'Rejected' };
        default:
          return { icon: <Clock size={14} className="text-gray-500" />, color: 'bg-gray-100 text-gray-800', label: status };
      }
    }
  };

  const handleViewDeliveryBoyDetails = async (id: string) => {
    try {
      await getDeliveryBoyById(id);
      navigate(`/admin/delivery-boy/${id}`);
      setShowNotifications(false);
    } catch (error) {
      console.error("Error fetching delivery boy details:", error);
      toast.error("Could not load delivery boy details");
    }
  };

  const handleViewRetailerDetails = async (id: string) => {
    try {
      await getRetailerById(id);
      navigate(`/admin/retailer/${id}`);
      setShowNotifications(false);
    } catch (error) {
      console.error("Error fetching retailer details:", error);
      toast.error("Could not load retailer details");
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/admin/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsSearchFocused(false);
    }
  };

  const handleOpenNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      refetchDeliveryBoys();
      refetchRetailers();
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
              Welcome back, {selector?.name || 'Admin'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 sm:space-x-4">
          {/* Search input with expanding animation */}
          <form 
            onSubmit={handleSearchSubmit}
            className={`relative transition-all duration-300 ${
              isSmallScreen ? (isSearchFocused ? "w-full absolute right-0 top-0 bg-white z-30 p-4" : "hidden") : "block w-64"
            }`}
          >
            {isSmallScreen && isSearchFocused && (
              <button 
                type="button"
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
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setSearchQuery("")}
              >
                <X size={16} />
              </button>
            )}
          </form>
          
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
              onClick={handleOpenNotifications}
              aria-label="Notifications"
              aria-expanded={showNotifications}
            >
              <Bell size={20} />
              {totalNotifications > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center bg-red-500 text-white text-xs rounded-full w-4 h-4 font-bold">
                  {totalNotifications > 9 ? '9+' : totalNotifications}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-30">
                <div className="flex border-b border-gray-100">
                  <button 
                    className={`flex-1 text-center py-2 text-sm font-medium ${
                      activeTab === "delivery" 
                        ? "text-indigo-600 border-b-2 border-indigo-600" 
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("delivery")}
                  >
                    <div className="flex items-center justify-center">
                      <Truck size={16} className="mr-1" />
                      Delivery Boys
                      {pendingDeliveryBoys?.filter(boy => boy.status === 'pending')?.length > 0 && (
                        <span className="ml-1 w-5 h-5 bg-indigo-100 text-indigo-800 rounded-full text-xs flex items-center justify-center">
                          {pendingDeliveryBoys.filter(boy => boy.status === 'pending').length}
                        </span>
                      )}
                    </div>
                  </button>
                  <button 
                    className={`flex-1 text-center py-2 text-sm font-medium ${
                      activeTab === "retailers" 
                        ? "text-indigo-600 border-b-2 border-indigo-600" 
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("retailers")}
                  >
                    <div className="flex items-center justify-center">
                      <Store size={16} className="mr-1" />
                      Retailers
                      {pendingRetailers?.filter(retailer => !retailer.isVerified)?.length > 0 && (
                        <span className="ml-1 w-5 h-5 bg-indigo-100 text-indigo-800 rounded-full text-xs flex items-center justify-center">
                          {pendingRetailers.filter(retailer => !retailer.isVerified).length}
                        </span>
                      )}
                    </div>
                  </button>
                </div>
                
                {/* Delivery Boys Tab */}
                {activeTab === "delivery" && (
                  <div className="max-h-72 overflow-y-auto">
                    {deliveryBoysLoading ? (
                      <div className="px-4 py-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                        <p className="text-sm text-gray-500 mt-2">Loading requests...</p>
                      </div>
                    ) : deliveryBoysError ? (
                      <div className="px-4 py-8 text-center">
                        <XCircle className="mx-auto text-red-400" size={24} />
                        <p className="text-sm text-gray-500 mt-2">Failed to load requests</p>
                        <button 
                          onClick={refetchDeliveryBoys}
                          className="mt-2 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          Retry
                        </button>
                      </div>
                    ) : pendingDeliveryBoys?.length > 0 ? (
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
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40';
                                    }}
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
                                    <span className="ml-1 capitalize">{statusInfo.label}</span>
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
                                  onClick={() => approveDeliveryBoy(deliveryBoy.id)}
                                >
                                  Approve
                                </button>
                                <button 
                                  className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded transition-colors duration-200"
                                  onClick={() => rejectDeliveryBoy(deliveryBoy.id)}
                                >
                                  Reject
                                </button>
                                <button 
                                  className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded transition-colors duration-200"
                                  onClick={() => handleViewDeliveryBoyDetails(deliveryBoy.id)}
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
                )}
                
                {/* Retailers Tab */}
                {activeTab === "retailers" && (
                  <div className="max-h-72 overflow-y-auto">
                    {retailersLoading ? (
                      <div className="px-4 py-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                        <p className="text-sm text-gray-500 mt-2">Loading requests...</p>
                      </div>
                    ) : retailersError ? (
                      <div className="px-4 py-8 text-center">
                        <XCircle className="mx-auto text-red-400" size={24} />
                        <p className="text-sm text-gray-500 mt-2">Failed to load retailer requests</p>
                        <button 
                          onClick={refetchRetailers}
                          className="mt-2 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          Retry
                        </button>
                      </div>
                    ) : pendingRetailers?.length > 0 ? (
                      pendingRetailers.map((retailer) => {
                        const statusInfo = getStatusInfo(retailer.isVerified);
                        return (
                          <div 
                            key={retailer._id} 
                            className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors duration-150 ${
                              !retailer.isVerified ? "bg-blue-50/40" : ""
                            }`}
                          >
                            <div className="flex items-start">
                              <div className="flex-shrink-0 mr-3">
                                {retailer.shopImageUrl ? (
                                  <img 
                                    src={retailer.shopImageUrl} 
                                    alt={retailer.shopName}
                                    className="w-10 h-10 rounded-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40';
                                    }}
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                    <Store className="text-indigo-600" size={18} />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                  <p className="text-sm font-medium text-gray-800 truncate">
                                    {retailer.shopName}
                                  </p>
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusInfo.color} flex items-center`}>
                                    {statusInfo.icon}
                                    <span className="ml-1">{statusInfo.label}</span>
                                  </span>
                                </div>
                                {/* <p className="text-xs text-gray-500 mt-1">{retailer.address.city}, {retailer.address.state}</p> */}
                                <p className="text-xs text-gray-400 mt-1 flex items-center">
                                  <Clock className="mr-1" size={12} />
                                  {formatRelativeTime(retailer.createdAt)}
                                </p>
                              </div>
                            </div>
                            {!retailer.isVerified && (
                              <div className="mt-2 flex space-x-2">
                                <button 
                                  className="text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded transition-colors duration-200"
                                  onClick={() => approveRetailer(retailer._id)}
                                >
                                  Approve
                                </button>
                                <button 
                                  className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded transition-colors duration-200"
                                  onClick={() => rejectRetailer(retailer._id)}
                                >
                                  Reject
                                </button>
                                <button 
                                  className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded transition-colors duration-200"
                                  onClick={() => handleViewRetailerDetails(retailer.userId)}
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
                        <Store className="mx-auto text-gray-300" size={24} />
                        <p className="text-sm text-gray-500 mt-2">No pending retailer requests</p>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="px-4 py-2 border-t border-gray-100">
                  <button
                    onClick={() => {
                      navigate(activeTab === "delivery" ? '/admin/delivery-boys' : '/admin/retailers');
                      setShowNotifications(false);
                    }}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center justify-center w-full"
                  >
                    View all {activeTab === "delivery" ? "delivery boys" : "retailers"}
                  </button>
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
              <p className="text-xs text-gray-500 truncate max-w-[120px]">{selector?.email}</p>
            </div>
            <ChevronDown size={16} className="ml-1 text-gray-400 hidden sm:block" />
          </div>
        </div>
      </div>
      
      {/* Breadcrumbs */}
      <div className="px-6 pb-2 pt-0 text-xs text-gray-500 hidden sm:block">
        <nav className="flex">
          <a href="/admin/dashboard" className="hover:text-indigo-600 transition-colors duration-200">Dashboard</a>
          {pageKey !== "dashboard" && (
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