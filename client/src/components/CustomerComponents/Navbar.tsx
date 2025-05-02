import { FormEvent, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, ShoppingCart, Menu, X, User, LogOut, ChevronDown, Heart } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../app/store';
import { logoutUser, userData } from '../../api/userApi';
import { userLogout } from '../../slice/userSlice';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const profileMenuRef = useRef<HTMLDivElement>(null);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };
  
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Implement your search functionality
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
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileMenuRef]);
  
  return (
    <nav className="bg-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main navbar container */}
        <div className="flex justify-between items-center h-20">
          {/* Logo and Brand */}
          <Link to="/" className="group flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-md transform transition-all duration-300 group-hover:scale-105">
              <ShoppingBag className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent transition-all duration-300 group-hover:from-emerald-600 group-hover:to-teal-700">FreshMart</span>
          </Link>
          
          {/* Desktop Navigation Items */}
          <div className="hidden md:flex items-center justify-center flex-1 max-w-xl mx-8">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search fresh products..."
                  className="w-full py-3 pl-5 pr-12 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow"
                />
                <button type="submit" className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 flex items-center justify-center bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-colors duration-200">
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
                <Link to="/shop" className="flex items-center px-3 py-2 text-gray-700 hover:text-emerald-500 font-medium transition-all duration-200 hover:bg-emerald-50 rounded-lg">
                  <ShoppingBag size={18} className="mr-1.5" />
                  <span>Shop</span>
                </Link>
                
                <Link to="/wishlist" className="flex items-center px-3 py-2 text-gray-700 hover:text-emerald-500 font-medium transition-all duration-200 hover:bg-emerald-50 rounded-lg">
                  <Heart size={18} className="mr-1.5" />
                  <span>Wishlist</span>
                </Link>
                
                <Link to="/cart" className="flex items-center px-3 py-2 text-gray-700 hover:text-emerald-500 font-medium relative transition-all duration-200 hover:bg-emerald-50 rounded-lg mr-2">
                  <div className="relative">
                    <ShoppingCart size={18} />
                    <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
                      3
                    </span>
                  </div>
                  <span className="ml-1.5">Cart</span>
                </Link>
              </>
            )}
            
            {/* User Profile with Dropdown */}
            {user ? (
              <div className="relative" ref={profileMenuRef}>
                <button 
                  onClick={toggleProfileMenu}
                  className="flex items-center text-gray-700 hover:text-emerald-500 font-medium transition-all duration-200 px-3 py-2 hover:bg-emerald-50 rounded-lg"
                >
                  {users?.image ? (
                    <img 
                      src={users.image} 
                      alt={user.name} 
                      className="h-9 w-9 rounded-full object-cover border-2 border-emerald-400 shadow-sm"
                    />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-sm">
                      <User size={18} className="text-white" />
                    </div>
                  )}
                  <span className="ml-2 mr-1 font-medium">{user.name}</span>
                  <ChevronDown size={16} className={`transition-transform duration-300 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Profile Dropdown Menu */}
                <div 
                  className={`absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl py-1 z-50 transition-all duration-300 ease-in-out transform origin-top-right ${
                    isProfileMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                  }`}
                >
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm text-gray-500">Signed in as</p>
                    <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                  </div>
                  
                  <div className="py-1">
                    <Link 
                      to="/profile" 
                      className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-500"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <User size={16} className="mr-3 text-gray-500" />
                      Your Profile
                    </Link>
                    
                    <Link 
                      to="/orders" 
                      className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-500"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <ShoppingBag size={16} className="mr-3 text-gray-500" />
                      Your Orders
                    </Link>
                    
                    <Link 
                      to="/settings" 
                      className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-500"
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
                      className="flex items-center w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
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
                  to="/sign-up" 
                  className="px-20 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-lg
                            transition-all duration-300 hover:from-emerald-600 hover:to-teal-700 hover:shadow-md 
                            focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-50"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
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
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} shadow-lg border-t border-gray-100`}>
        <div className="px-4 pt-4 pb-5 space-y-4 bg-white">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full py-3 pl-5 pr-12 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm"
              />
              <button type="submit" className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 flex items-center justify-center bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-colors duration-200">
                <Search size={16} />
              </button>
            </div>
          </form>
          
          {/* Mobile Navigation Links - Only show if user is logged in */}
          {user && (
            <div className="space-y-1">
              <Link 
                to="/shop" 
                className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-500"
                onClick={toggleMenu}
              >
                <ShoppingBag size={20} className="mr-3 text-emerald-500" />
                Shop
              </Link>
              
              <Link 
                to="/wishlist" 
                className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-500"
                onClick={toggleMenu}
              >
                <Heart size={20} className="mr-3 text-emerald-500" />
                Wishlist
              </Link>
              
              <Link 
                to="/cart" 
                className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-500"
                onClick={toggleMenu}
              >
                <div className="relative">
                  <ShoppingCart size={20} className="text-emerald-500" />
                  <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    3
                  </span>
                </div>
                <span className="ml-3">Cart</span>
              </Link>
            </div>
          )}
          
          {/* Mobile User Section */}
          {user ? (
            <div className="mt-6 pt-6 border-t border-gray-100">
              {/* User Profile Section */}
              <div className="flex items-center px-4 py-3 mb-4">
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
                <div className="ml-3">
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
              
              {/* Account Links */}
              <Link 
                to="/profile" 
                className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-500"
                onClick={toggleMenu}
              >
                <User size={20} className="mr-3 text-gray-500" />
                My Profile
              </Link>
              
              <Link 
                to="/orders" 
                className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-500"
                onClick={toggleMenu}
              >
                <ShoppingBag size={20} className="mr-3 text-gray-500" />
                My Orders
              </Link>
              
              <Link 
                to="/settings" 
                className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-500"
                onClick={toggleMenu}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
                </svg>
                Settings
              </Link>
              
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 w-full text-left mt-6"
              >
                <LogOut size={20} className="mr-3" />
                Logout
              </button>
            </div>
          ) : (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-3">
                <Link 
                  to="/sign-up" 
                  className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-lg text-center
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