import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  MoreHorizontal,
  ChevronDown,
  Trash2,
  Edit,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowUpDown,
  Eye,
  MapPin,
  Store,
  Clock,
  Briefcase,
  Package,
  DollarSign,
  Star,
  Tag
} from 'lucide-react';
import AdminSidebar from '../../components/AdminComponents/AdminSidebar';
import AdminHeader from '../../components/AdminComponents/AdminHeader';
import { toast } from 'react-toastify';
import { getAllReatilers } from '../../api/adminApi';

// TypeScript interfaces
interface Retailer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive' | 'Pending' | 'Suspended';
  joinDate: string;
  createdAt: string | number | Date;
  orders: number;
  rating: number;
  lastOrder: string;
  location: string;
  category: string;
  storeType: 'Grocery' | 'Restaurant' | 'Pharmacy' | 'Electronics' | 'Other';
  logo?: string;
  balance: number;
}

const RetailerListing = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedRetailers, setSelectedRetailers] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [retailers, setRetailers] = useState<Retailer[]>();
  const [error, setError] = useState<string | null>(null);

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  const fetchRetailers = async () => {
    try {
      setLoading(true);
      setError(null);

      const mockRetailers = [
        {
          _id: '1',
          name: 'Fresh Grocery Store',
          email: 'contact@freshgrocery.com',
          phone: '+1 (555) 123-4567',
          status: 'Active' as 'Active',
          joinDate: '2023-01-15',
          createdAt: '2023-01-15T08:30:00Z',
          orders: 428,
          rating: 4.8,
          lastOrder: '2023-05-01',
          location: 'Downtown',
          category: 'Grocery',
          storeType: 'Grocery',
          balance: 4850.75
        },
        {
          _id: '2',
          name: 'Quick Bites Restaurant',
          email: 'manager@quickbites.com',
          phone: '+1 (555) 234-5678',
          status: 'Active',
          joinDate: '2023-02-22',
          createdAt: '2023-02-22T10:15:00Z',
          orders: 1254,
          rating: 4.5,
          lastOrder: '2023-05-02',
          location: 'Midtown',
          category: 'Fast Food',
          storeType: 'Restaurant',
          balance: 8920.30
        },
        {
          _id: '3',
          name: 'City Pharmacy',
          email: 'info@citypharmacy.com',
          phone: '+1 (555) 345-6789',
          status: 'Active',
          joinDate: '2023-03-10',
          createdAt: '2023-03-10T09:45:00Z',
          orders: 312,
          rating: 4.7,
          lastOrder: '2023-05-01',
          location: 'Eastside',
          category: 'Healthcare',
          storeType: 'Pharmacy',
          balance: 3250.40
        },
        {
          _id: '4',
          name: 'TechZone Electronics',
          email: 'sales@techzone.com',
          phone: '+1 (555) 456-7890',
          status: 'Inactive' as 'Inactive',
          joinDate: '2023-01-05',
          createdAt: '2023-01-05T11:20:00Z',
          orders: 187,
          rating: 4.2,
          lastOrder: '2023-04-15',
          location: 'Westside',
          category: 'Electronics',
          storeType: 'Electronics',
          balance: 2180.60
        },
        {
          _id: '5',
          name: 'Healthy Eats',
          email: 'hello@healthyeats.com',
          phone: '+1 (555) 567-8901',
          status: 'Pending' as 'Pending',
          joinDate: '2023-04-18',
          createdAt: '2023-04-18T14:10:00Z',
          orders: 0,
          rating: 0,
          lastOrder: '',
          location: 'Northside',
          category: 'Organic Food',
          storeType: 'Grocery',
          balance: 0.00
        },
        {
          _id: '6',
          name: 'Gourmet Delights',
          email: 'chef@gourmetdelights.com',
          phone: '+1 (555) 678-9012',
          status: 'Suspended' as 'Suspended',
          joinDate: '2023-02-08',
          createdAt: '2023-02-08T12:30:00Z',
          orders: 98,
          rating: 3.9,
          lastOrder: '2023-03-28',
          location: 'Downtown',
          category: 'Fine Dining',
          storeType: 'Restaurant',
          balance: 1450.25
        },
        {
          _id: '7',
          name: 'QuickMeds Pharmacy',
          email: 'support@quickmeds.com',
          phone: '+1 (555) 789-0123',
          status: 'Active',
          joinDate: '2023-03-22',
          createdAt: '2023-03-22T09:00:00Z',
          orders: 276,
          rating: 4.6,
          lastOrder: '2023-05-02',
          location: 'Southside',
          category: 'Healthcare',
          storeType: 'Pharmacy',
          balance: 5620.80
        },
        {
          _id: '8',
          name: 'Gadget Haven',
          email: 'info@gadgethaven.com',
          phone: '+1 (555) 890-1234',
          status: 'Active',
          joinDate: '2023-02-15',
          createdAt: '2023-02-15T10:45:00Z',
          orders: 324,
          rating: 4.4,
          lastOrder: '2023-05-01',
          location: 'Midtown',
          category: 'Electronics',
          storeType: 'Electronics',
          balance: 7840.15
        }
      ];

      const response = await getAllReatilers();
      console.log("Fetched retailers:", response);
      
      setTimeout(() => {
        setRetailers(response);
        setLoading(false);
      }, 800);
    } catch (error: any) {
      const errorMessage = error.message || "Failed to fetch retailers";
      console.log("Error fetching retailers:", errorMessage);
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchRetailers();
    toast.success('Retailer data refreshed!');
  };

  useEffect(() => {
    fetchRetailers();
  }, []);

  // Sort functionality
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter retailers based on search, status, and category filters
  const filteredRetailers = (retailers || []).filter(retailer => {
    const matchesSearch = 
      retailer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      retailer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      retailer.phone.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || retailer.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || retailer.category === categoryFilter || retailer.storeType === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Sort retailers
  const sortedRetailers = [...filteredRetailers].sort((a, b) => {
    let comparison = 0;
    
    if (sortField === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === 'joinDate') {
      comparison = new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime();
    } else if (sortField === 'orders') {
      comparison = a.orders - b.orders;
    } else if (sortField === 'rating') {
      comparison = a.rating - b.rating;
    } else if (sortField === 'balance') {
      comparison = a.balance - b.balance;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Get all unique categories for the filter
  const categories = ['All', ...Array.from(new Set((retailers ?? [])
    .map(retailer => retailer.category)
    .filter(category => category !== '')
  ))];

  // Store types for the filter
  const storeTypes = ['All', 'Grocery', 'Restaurant', 'Pharmacy', 'Electronics', 'Other'];

  // Status badge component
  const StatusBadge = ({ status }: { status: 'Active' | 'Inactive' | 'Pending' | 'Suspended' }) => {
    let colorClasses = '';
    let Icon = CheckCircle;
    
    switch (status) {
      case 'Active':
        colorClasses = 'bg-emerald-100 text-emerald-800 border border-emerald-200';
        Icon = CheckCircle;
        break;
      case 'Inactive':
        colorClasses = 'bg-red-100 text-red-800 border border-red-200';
        Icon = XCircle;
        break;
      case 'Pending':
        colorClasses = 'bg-yellow-100 text-yellow-800 border border-yellow-200';
        Icon = Clock;
        break;
      case 'Suspended':
        colorClasses = 'bg-gray-100 text-gray-800 border border-gray-200';
        Icon = AlertCircle;
        break;
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses}`}>
        <Icon size={12} className="mr-1" />
        {status}
      </span>
    );
  };

  // Store Type badge component
  const StoreTypeBadge = ({ type }: { type: 'Grocery' | 'Restaurant' | 'Pharmacy' | 'Electronics' | 'Other' }) => {
    let colorClasses = '';
    let Icon = Store;
    
    switch (type) {
      case 'Grocery':
        colorClasses = 'bg-green-100 text-green-800 border border-green-200';
        Icon = Package;
        break;
      case 'Restaurant':
        colorClasses = 'bg-blue-100 text-blue-800 border border-blue-200';
        Icon = Briefcase;
        break;
      case 'Pharmacy':
        colorClasses = 'bg-purple-100 text-purple-800 border border-purple-200';
        Icon = Briefcase;
        break;
      case 'Electronics':
        colorClasses = 'bg-amber-100 text-amber-800 border border-amber-200';
        Icon = Briefcase;
        break;
      case 'Other':
        colorClasses = 'bg-gray-100 text-gray-800 border border-gray-200';
        Icon = Tag;
        break;
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses}`}>
        <Icon size={12} className="mr-1" />
        {type}
      </span>
    );
  };

  // Generate avatar placeholder
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Retailer avatar component
  const RetailerAvatar = ({ retailer }: { retailer: Retailer }) => {
    const initials = getInitials(retailer.name);
    
    // Generate a consistent color based on the id
    const colorIndex = parseInt(retailer._id.replace(/\D/g, '')) % 5;
    const bgColors = [
      'from-blue-500 to-blue-600',
      'from-purple-500 to-purple-600',
      'from-emerald-500 to-emerald-600',
      'from-amber-500 to-amber-600',
      'from-indigo-500 to-indigo-700'
    ];
    
    return (
      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${bgColors[colorIndex]} flex items-center justify-center text-white font-medium shadow-sm`}>
        {initials}
      </div>
    );
  };

  // Rating component
  const RatingDisplay = ({ rating }: { rating: number | undefined }) => {
    if (!rating) return <span>N/A</span>;
    
    const displayRating = typeof rating === 'number' ? rating.toFixed(1) : 'N/A';
    return (
      <div className="flex items-center">
        <Star size={14} className="text-amber-500 mr-1" />
        <span>{displayRating}</span>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={toggleMobileSidebar}>
          <div className="absolute top-0 left-0 w-72 h-full" onClick={(e) => e.stopPropagation()}>
            <AdminSidebar collapsed={false} setCollapsed={setCollapsed} isMobile={true} onCloseMobile={toggleMobileSidebar} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <AdminHeader />
        
        {/* Retailer Listing Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Retailers</h2>
              <p className="text-gray-500 text-sm mt-1">Manage all your partner stores and retailers</p>
            </div>
            {/* <button 
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => toast.info('Add Retailer form would open here')}
            >
              <Store size={16} className="mr-2" />
              Add Retailer
            </button> */}
          </div>

          {/* Filters and Actions */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                <div className="relative w-full sm:w-72">
                  <input
                    type="text"
                    placeholder="Search retailers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full py-2 pl-10 pr-4 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
                
                <div className="relative w-full sm:w-44">
                  <select 
                    className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg py-2 pl-4 pr-10 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="All">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <ChevronDown size={16} className="text-gray-500" />
                  </div>
                </div>

                <div className="relative w-full sm:w-44">
                  <select 
                    className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg py-2 pl-4 pr-10 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    {storeTypes.map(type => (
                      <option key={type} value={type}>{type === 'All' ? 'All Types' : type}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <ChevronDown size={16} className="text-gray-500" />
                  </div>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <button className="inline-flex items-center px-1 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <Filter size={16} className="mr-2" />
                    More Filters
                  </button>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center space-x-2">
                  <button 
                    className={`p-2 rounded ${viewMode === 'table' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}
                    onClick={() => setViewMode('table')}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 6H21M8 12H21M8 18H21M3 6H3.01M3 12H3.01M3 18H3.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button 
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 5C4 4.44772 4.44772 4 5 4H9C9.55228 4 10 4.44772 10 5V9C10 9.55228 9.55228 10 9 10H5C4.44772 10 4 9.55228 4 9V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M14 5C14 4.44772 14.4477 4 15 4H19C19.5523 4 20 4.44772 20 5V9C20 9.55228 19.5523 10 19 10H15C14.4477 10 14 9.55228 14 9V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M4 15C4 14.4477 4.44772 14 5 14H9C9.55228 14 10 14.4477 10 15V19C10 19.5523 9.55228 20 9 20H5C4.44772 20 4 19.5523 4 19V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M14 15C14 14.4477 14.4477 14 15 14H19C19.5523 14 20 14.4477 20 15V19C20 19.5523 19.5523 20 19 20H15C14.4477 20 14 19.5523 14 19V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
                
                <button 
                  className={`inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-80' : ''}`}
                  onClick={refreshData}
                  disabled={loading}
                >
                  <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
                
                <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <Download size={16} className="mr-2" />
                  Export
                </button>
              </div>
            </div>
            
            {/* Selected actions (show when items are selected) */}
            {selectedRetailers.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">{selectedRetailers.length} retailers</span> selected
                  </div>
                  <div className="flex items-center space-x-3">
                    <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      <Phone size={14} className="mr-1.5" />
                      Contact
                    </button>
                    <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      <Edit size={14} className="mr-1.5" />
                      Edit
                    </button>
                    <button className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-sm font-medium rounded-lg text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                      <Trash2 size={14} className="mr-1.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error loading retailers</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={fetchRetailers}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Table View */}
          {!loading && !error && viewMode === 'table' && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Retailer</th>
                      <th 
                        className="px-6 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('joinDate')}
                      >
                        <div className="flex items-center">
                          <span>Join Date</span>
                          <ArrowUpDown size={14} className="ml-1" />
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('orders')}
                      >
                        <div className="flex items-center">
                          <span>Orders</span>
                          <ArrowUpDown size={14} className="ml-1" />
                        </div>
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
                      <th 
                        className="px-6 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('rating')}
                      >
                        <div className="flex items-center">
                          <span>Rating</span>
                          <ArrowUpDown size={14} className="ml-1" />                        </div>
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Store Type</th>
                      <th 
                        className="px-6 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('balance')}
                      >
                        <div className="flex items-center">
                          <span>Balance</span>
                          <ArrowUpDown size={14} className="ml-1" />
                        </div>
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 bg-gray-50 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedRetailers.length > 0 ? (
                      sortedRetailers.map((retailer) => (
                        <tr key={retailer._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <RetailerAvatar retailer={retailer} />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{retailer.name}</div>
                                <div className="text-sm text-gray-500">{retailer.email}</div>
                                <div className="text-xs text-gray-400 mt-1 flex items-center">
                                  <Phone size={12} className="mr-1" />
                                  {retailer.phone}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                            {new Date(retailer.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(retailer.createdAt).toLocaleTimeString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{retailer.orders}</div>
                            <div className="text-xs text-gray-500">
                              {retailer.lastOrder ? `Last: ${new Date(retailer.lastOrder).toLocaleDateString()}` : 'No orders'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <MapPin size={14} className="text-gray-400 mr-1" />
                              <span className="text-sm text-gray-900">{retailer.location}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <RatingDisplay rating={retailer.rating} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StoreTypeBadge type={retailer.storeType} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 flex items-center">
                              <DollarSign size={14} className="text-gray-500 mr-1" />
                              {(retailer.balance || 0).toFixed(2)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={retailer.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button 
                                className="text-indigo-600 hover:text-indigo-900"
                                onClick={() => toast.info(`View details for ${retailer.name}`)}
                              >
                                <Eye size={16} />
                              </button>
                              <button 
                                className="text-gray-600 hover:text-gray-900"
                                onClick={() => toast.info(`Edit ${retailer.name}`)}
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                className="text-gray-600 hover:text-gray-900"
                                onClick={() => toast.info(`More options for ${retailer.name}`)}
                              >
                                <MoreHorizontal size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={9} className="px-6 py-4 text-center text-sm text-gray-500">
                          No retailers found matching your criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Grid View */}
          {!loading && !error && viewMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedRetailers.length > 0 ? (
                sortedRetailers.map((retailer) => (
                  <div key={retailer._id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-200">
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <RetailerAvatar retailer={retailer} />
                          <div>
                            <h3 className="font-medium text-gray-900">{retailer.name}</h3>
                            <div className="text-xs text-gray-500 flex items-center">
                              <MapPin size={12} className="mr-1" />
                              {retailer.location}
                            </div>
                          </div>
                        </div>
                        <StatusBadge status={retailer.status} />
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center">
                          <Phone size={14} className="text-gray-400 mr-2" />
                          <span className="text-gray-700">{retailer.phone}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar size={14} className="text-gray-400 mr-2" />
                          <span className="text-gray-700">
                            {new Date(retailer.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Package size={14} className="text-gray-400 mr-2" />
                          <span className="text-gray-700">
                            {retailer.orders} orders
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Star size={14} className="text-amber-500 mr-2" />
                          <span className="text-gray-700">
                            {retailer.rating ? retailer.rating.toFixed(1) : 'N/A'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <StoreTypeBadge type={retailer.storeType} />
                        <div className="text-sm font-medium text-gray-900 flex items-center">
                          <DollarSign size={14} className="text-gray-500 mr-1" />
                          {(retailer.balance || 0).toFixed(2)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                      <button 
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
                        onClick={() => toast.info(`View details for ${retailer.name}`)}
                      >
                        View details
                      </button>
                      <div className="flex items-center space-x-3">
                        <button 
                          className="text-gray-500 hover:text-gray-700"
                          onClick={() => toast.info(`Contact ${retailer.name}`)}
                        >
                          <Phone size={16} />
                        </button>
                        <button 
                          className="text-gray-500 hover:text-gray-700"
                          onClick={() => toast.info(`Edit ${retailer.name}`)}
                        >
                          <Edit size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-500">No retailers found matching your criteria</div>
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {sortedRetailers.length > 0 && (
            <div className="mt-6 flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">8</span> of{' '}
                    <span className="font-medium">{sortedRetailers.length}</span> retailers
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      disabled
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronDown size={16} className="transform rotate-90" />
                    </button>
                    <button
                      aria-current="page"
                      className="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                    >
                      1
                    </button>
                    <button
                      className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                    >
                      2
                    </button>
                    <button
                      className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                    >
                      3
                    </button>
                    <button
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronDown size={16} className="transform -rotate-90" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default RetailerListing;