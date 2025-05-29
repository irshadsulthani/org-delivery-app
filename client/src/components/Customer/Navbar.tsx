import { FormEvent, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, ShoppingCart, Menu, X, User, LogOut, ChevronDown, Heart, Bell, MapPin } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../app/store';
import { logoutUser, userData } from '../../api/userApi';
import { userLogout } from '../../slice/userSlice';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(3); // You can connect this to your cart state
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Your order has been shipped!", time: "2 hours ago", read: false },
    { id: 2, message: "New deals available in Electronics", time: "1 day ago", read: false },
    { id: 3, message: "Welcome to FreshMart!", time: "2 days ago", read: true }
  ]);
  
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
    setIsNotificationOpen(false); // Close notifications when opening profile
  };

  const toggleNotifications = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setIsProfileMenuOpen(false); // Close profile when opening notifications
  };
  
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // Implement your search functionality here
      // You might want to navigate to a search results page
      // navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(userLogout());
      localStorage.removeItem('email');
      window.location.href = '/';
    }
    catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const markNotificationAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const unreadNotificationCount = notifications.filter(n => !n.read).length;
  
  interface User {
    image?: string;
  }

  const [users, setUsers] = useState<User | null>(null);

  useEffect(() => {
    const email = localStorage.getItem('email');
    if (email) {
      userData({ email })
        .then((response) => {
          setUsers(response); 
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <nav className="bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main navbar container */}
        <div className="flex justify-between items-center h-20">
          {/* Logo and Brand */}
          <Link to="/" className="group flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 rounded-xl shadow-md transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg">
              <ShoppingBag className="h-7 w-7 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent transition-all duration-300 group-hover:from-emerald-600 group-hover:to-teal-700">
                FreshMart
              </span>
              <span className="text-xs text-gray-500 -mt-1">Fresh & Quality</span>
            </div>
          </Link>
          
          {/* Desktop Navigation Items */}
          <div className="hidden md:flex items-center justify-center flex-1 max-w-2xl mx-8">
            {/* Location Selector */}
            <div className="flex items-center mr-4 px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <MapPin size={16} className="text-emerald-500 mr-1" />
              <span className="text-sm text-gray-700">Deliver to</span>
              <ChevronDown size={14} className="ml-1 text-gray-500" />
            </div>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search fresh products, groceries..."
                  className="w-full py-3.5 pl-5 pr-12 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-all duration-200 shadow-sm hover:shadow-md"
                />
                <button 
                  type="submit" 
                  className="absolute right-1.5 top-1/2 transform -translate-y-1/2 h-9 w-9 flex items-center justify-center bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <Search size={16} />
                </button>
              </div>
            </form>
          </div>
          
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Only show Shop, Wishlist, and Cart if user is logged in */}
            {user && (
              <>
                <Link to="/shop" className="flex items-center px-3 py-2 text-gray-700 hover:text-emerald-500 font-medium transition-all duration-200 hover:bg-emerald-50 rounded-lg group">
                  <ShoppingBag size={18} className="mr-1.5 group-hover:scale-110 transition-transform" />
                  <span>Shop</span>
                </Link>
                
                <Link to="/wishlist" className="flex items-center px-3 py-2 text-gray-700 hover:text-emerald-500 font-medium transition-all duration-200 hover:bg-emerald-50 rounded-lg group">
                  <Heart size={18} className="mr-1.5 group-hover:scale-110 transition-transform" />
                  <span>Wishlist</span>
                </Link>
                
                <Link to="/cart" className="flex items-center px-3 py-2 text-gray-700 hover:text-emerald-500 font-medium relative transition-all duration-200 hover:bg-emerald-50 rounded-lg mr-2 group">
                  <div className="relative">
                    <ShoppingCart size={18} className="group-hover:scale-110 transition-transform" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-2.5 -right-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm animate-pulse">
                        {cartItemCount > 99 ? '99+' : cartItemCount}
                      </span>
                    )}
                  </div>
                  <span className="ml-1.5">Cart</span>
                </Link>

                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                  <button 
                    onClick={toggleNotifications}
                    className="flex items-center px-3 py-2 text-gray-700 hover:text-emerald-500 font-medium transition-all duration-200 hover:bg-emerald-50 rounded-lg relative"
                  >
                    <Bell size={18} />
                    {unreadNotificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                        {unreadNotificationCount}
                      </span>
                    )}
                  </button>
                  
                  {/* Notifications Dropdown */}
                  <div 
                    className={`absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl py-2 z-50 transition-all duration-300 ease-in-out transform origin-top-right ${
                      isNotificationOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                    }`}
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div 
                            key={notification.id}
                            className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                              !notification.read ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => markNotificationAsRead(notification.id)}
                          >
                            <p className="text-sm text-gray-900">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-6 text-center text-gray-500">
                          <Bell size={24} className="mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No notifications yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {/* User Profile with Dropdown */}
            {user ? (
              <div className="relative" ref={profileMenuRef}>
                <button 
                  onClick={toggleProfileMenu}
                  className="flex items-center text-gray-700 hover:text-emerald-500 font-medium transition-all duration-200 px-3 py-2 hover:bg-emerald-50 rounded-lg group"
                >
                  {users?.image ? (
                    <img 
                      src={users.image} 
                      alt={user.name} 
                      className="h-9 w-9 rounded-full object-cover border-2 border-emerald-400 shadow-sm group-hover:border-emerald-500 transition-colors"
                    />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                      <User size={18} className="text-white" />
                    </div>
                  )}
                  <span className="ml-2 mr-1 font-medium max-w-24 truncate">{user.name}</span>
                  <ChevronDown size={16} className={`transition-transform duration-300 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Profile Dropdown Menu */}
                <div 
                  className={`absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl py-1 z-50 transition-all duration-300 ease-in-out transform origin-top-right border border-gray-100 ${
                    isProfileMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                  }`}
                >
                  <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
                    <p className="text-sm text-gray-500">Signed in as</p>
                    <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                  </div>
                  
                  <div className="py-1">
                    <Link 
                      to="/profile" 
                      className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-500 transition-colors"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <User size={16} className="mr-3 text-gray-500" />
                      Your Profile
                    </Link>
                    
                    <Link 
                      to="/orders" 
                      className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-500 transition-colors"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <ShoppingBag size={16} className="mr-3 text-gray-500" />
                      Your Orders
                    </Link>
                    
                    <Link 
                      to="/settings" 
                      className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-500 transition-colors"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
                      </svg>
                      Settings
                    </Link>
                  </div>
                  
                  <div className="border-t border-gray-100">
                    <button 
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} className="mr-3" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-gray-700 hover:text-emerald-500 font-medium transition-colors rounded-lg hover:bg-emerald-50"
                >
                  Login
                </Link>
                <Link 
                  to="/sign-up" 
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-lg
                            transition-all duration-300 hover:from-emerald-600 hover:to-teal-700 hover:shadow-lg hover:scale-105
                            focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-50"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {user && (
              <Link to="/cart" className="relative p-2">
                <ShoppingCart size={20} className="text-gray-700" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </Link>
            )}
            <button 
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-emerald-500 hover:bg-gray-100 focus:outline-none transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-4 pt-4 pb-5 space-y-4 bg-white border-t border-gray-100">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full py-3.5 pl-5 pr-12 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm"
              />
              <button type="submit" className="absolute right-1.5 top-1/2 transform -translate-y-1/2 h-9 w-9 flex items-center justify-center bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full hover:from-emerald-600 hover:to-teal-700 transition-colors duration-200">
                <Search size={16} />
              </button>
            </div>
          </form>

          {/* Location Selector Mobile */}
          <div className="flex items-center justify-center py-2 px-4 bg-gray-50 rounded-lg">
            <MapPin size={16} className="text-emerald-500 mr-2" />
            <span className="text-sm text-gray-700">Deliver to your location</span>
            <ChevronDown size={14} className="ml-2 text-gray-500" />
          </div>
          
          {/* Mobile Navigation Links - Only show if user is logged in */}
          {user && (
            <div className="space-y-1">
              <Link 
                to="/shop" 
                className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-500 transition-colors"
                onClick={toggleMenu}
              >
                <ShoppingBag size={20} className="mr-3 text-emerald-500" />
                Shop
              </Link>
              
              <Link 
                to="/wishlist" 
                className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-500 transition-colors"
                onClick={toggleMenu}
              >
                <Heart size={20} className="mr-3 text-emerald-500" />
                Wishlist
              </Link>
              
              <div className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-700">
                <Bell size={20} className="mr-3 text-emerald-500" />
                <span>Notifications</span>
                {unreadNotificationCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadNotificationCount}
                  </span>
                )}
              </div>
            </div>
          )}
          
          {/* Mobile User Section */}
          {user ? (
            <div className="mt-6 pt-6 border-t border-gray-100">
              {/* User Profile Section */}
              <div className="flex items-center px-4 py-3 mb-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
                {users?.image ? (
                  <img 
                    src={users.image} 
                    alt={user.name} 
                    className="h-12 w-12 rounded-full object-cover border-2 border-emerald-400"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                    <User size={24} className="text-white" />
                  </div>
                )}
                <div className="ml-3 flex-1">
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
              
              {/* Account Links */}
              <div className="space-y-1">
                <Link 
                  to="/profile" 
                  className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-500 transition-colors"
                  onClick={toggleMenu}
                >
                  <User size={20} className="mr-3 text-gray-500" />
                  My Profile
                </Link>
                
                <Link 
                  to="/orders" 
                  className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-500 transition-colors"
                  onClick={toggleMenu}
                >
                  <ShoppingBag size={20} className="mr-3 text-gray-500" />
                  My Orders
                </Link>
                
                <Link 
                  to="/settings" 
                  className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-500 transition-colors"
                  onClick={toggleMenu}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
                  </svg>
                  Settings
                </Link>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 w-full text-left mt-4 transition-colors"
              >
                <LogOut size={20} className="mr-3" />
                Logout
              </button>
            </div>
          ) : (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="space-y-3">
                <Link 
                  to="/login" 
                  className="block w-full px-4 py-3 text-center border border-emerald-500 text-emerald-500 font-medium rounded-lg hover:bg-emerald-50 transition-colors"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
                <Link 
                  to="/sign-up" 
                  className="block w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-lg text-center
                          transition-all hover:from-emerald-600 hover:to-teal-700 hover:shadow-md"
                  onClick={toggleMenu}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;