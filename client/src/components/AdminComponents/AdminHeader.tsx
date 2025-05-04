import { Bell, Menu, Search, X, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

interface AdminHeaderProps {
  toggleMobileSidebar?: () => void;
  isSidebarOpen?: boolean;
}

function AdminHeader({ toggleMobileSidebar, isSidebarOpen = false }: AdminHeaderProps) {
  const location = window.location.pathname;
  const pageName = location.split("/").filter(Boolean).pop() || "dashboard";
  const formattedPageName = pageName.charAt(0).toUpperCase() + pageName.slice(1).replace(/-/g, " ");
  const selector = useSelector((state : RootState) => state.admin.admin)

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

  // Sample notifications data
  const notifications = [
    { id: 1, title: "New order received", time: "5 minutes ago", read: false },
    { id: 2, title: "Delivery #35782 completed", time: "1 hour ago", read: false },
    { id: 3, title: "Customer feedback received", time: "3 hours ago", read: true },
  ];

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
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
            >
              <Bell size={20} />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
              )}
            </button>
            
            {/* Notification dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-30">
                <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-medium text-gray-700">Notifications</h3>
                  <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-medium">
                    {notifications.filter(n => !n.read).length} new
                  </span>
                </div>
                
                <div className="max-h-72 overflow-y-auto">
                  {notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors duration-150 flex items-start ${
                        !notification.read ? "bg-indigo-50/40" : ""
                      }`}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        <div className={`w-2 h-2 rounded-full ${!notification.read ? "bg-indigo-500" : "bg-gray-300"}`}></div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-800">{notification.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="px-4 py-2 border-t border-gray-100">
                  <button className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* User profile */}
          <div className="flex items-center cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors duration-200">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-800 text-white flex items-center justify-center font-medium shadow-md ring-2 ring-indigo-100">
              JD
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