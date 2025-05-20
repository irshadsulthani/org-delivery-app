import { useState, useEffect } from 'react';
import { 
  Search,  
  Filter, 
  Download, 
  RefreshCw,
  MoreHorizontal,
  ChevronDown,
  Users,
  Edit,
  Phone,
  Calendar,
  AlertCircle,
  ArrowUpDown,
  Eye,
  ShoppingBag,
  Lock,
  Unlock,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ShieldX
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminHeader from '../../components/Admin/AdminHeader';
import { getAllCustomers } from '../../api/adminApi';
import { useDispatch } from 'react-redux';
import AdminSidebar from '../../components/Admin/AdminSidebar';

// TypeScript interfaces
interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  isBlocked: boolean;
  isVerified: boolean; // Added isVerified field
  createdAt: string;
  orders: number;
  lastOrder: string;
  totalSpent: string;
  avatar?: string;
}

const CustomerListing = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [verificationFilter, setVerificationFilter] = useState('All'); // Added filter for verification status
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllCustomers();
      setCustomers(response || []);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch customers";
  
      console.log("Error fetching customers:", errorMessage);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchCustomers();
    toast.success('Customer data refreshed!');
  };

  useEffect(() => {
    fetchCustomers();
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

  // Update customer block status
  const handleBlockStatusChange = async (customerId: string, isBlocked: boolean) => {
    try {
      setUpdatingStatus(customerId);
      
      // Call the API to update the customer status
      // await updateCustomerBlockStatus(customerId, isBlocked);
      
      // Update the local state with the new status
      setCustomers(prevCustomers => 
        prevCustomers.map(customer => 
          customer._id === customerId 
            ? { ...customer, isBlocked } 
            : customer
        )
      );
      
      toast.success(`Customer ${isBlocked ? 'blocked' : 'unblocked'} successfully`);
    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.message || "Failed to update customer status";
      toast.error(errorMessage);
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Update customer verification status
  const handleVerificationStatusChange = async (customerId: string, isVerified: boolean) => {
    try {
      setUpdatingStatus(customerId);
      
      // Call the API to update the customer verification status
      // await updateCustomerVerificationStatus(customerId, isVerified);
      
      // Update the local state with the new status
      setCustomers(prevCustomers => 
        prevCustomers.map(customer => 
          customer._id === customerId 
            ? { ...customer, isVerified } 
            : customer
        )
      );
      
      toast.success(`Customer ${isVerified ? 'verified' : 'unverified'} successfully`);
    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.message || "Failed to update verification status";
      toast.error(errorMessage);
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Filter customers based on search, block status, and verification status
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer._id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBlockStatus = 
      statusFilter === 'All' || 
      (statusFilter === 'Blocked' && customer.isBlocked) ||
      (statusFilter === 'Active' && !customer.isBlocked);
    
    const matchesVerificationStatus =
      verificationFilter === 'All' ||
      (verificationFilter === 'Verified' && customer.isVerified) ||
      (verificationFilter === 'Unverified' && !customer.isVerified);
    
    return matchesSearch && matchesBlockStatus && matchesVerificationStatus;
  });

  // Sort customers
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    let comparison = 0;
    
    if (sortField === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === 'createdAt') {
      comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sortField === 'orders') {
      comparison = a.orders - b.orders;
    } else if (sortField === 'totalSpent') {
      const aValue = parseFloat(a.totalSpent.replace('$', '').replace(',', ''));
      const bValue = parseFloat(b.totalSpent.replace('$', '').replace(',', ''));
      comparison = aValue - bValue;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Pagination calculation
  useEffect(() => {
    setTotalPages(Math.ceil(sortedCustomers.length / itemsPerPage));
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [sortedCustomers.length, itemsPerPage]);

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedCustomers.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  // Status badge component for block/unblock
  const BlockStatusBadge = ({ customer }: { customer: Customer }) => {
    const isBlocked = customer.isBlocked;
    
    const colorClasses = isBlocked
      ? 'bg-red-100 text-red-800 border border-red-200'
      : 'bg-emerald-100 text-emerald-800 border border-emerald-200';
    
    const Icon = isBlocked ? Lock : Unlock;
    
    return (
      <div className="relative">
        <button 
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses} cursor-pointer`}
          onClick={() => handleBlockStatusChange(customer._id, !isBlocked)}
          disabled={updatingStatus === customer._id}
        >
          <Icon size={12} className="mr-1" />
          {isBlocked ? 'Blocked' : 'Active'}
        </button>
      </div>
    );
  };

  // Verification badge component
  const VerificationBadge = ({ customer }: { customer: Customer }) => {
    const isVerified = customer.isVerified;
    
    const colorClasses = isVerified
      ? 'bg-blue-100 text-blue-800 border border-blue-200'
      : 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    
    const Icon = isVerified ? ShieldCheck : ShieldX;
    
    return (
      <div className="relative">
        <button 
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses} cursor-pointer`}
          onClick={() => handleVerificationStatusChange(customer._id, !isVerified)}
          disabled={updatingStatus === customer._id}
        >
          <Icon size={12} className="mr-1" />
          {isVerified ? 'Verified' : 'Unverified'}
        </button>
      </div>
    );
  };

  // Generate avatar placeholder for a customer
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Customer avatar component
  const CustomerAvatar = ({ customer }: { customer: Customer }) => {
    const initials = getInitials(customer.name);
    
    // Generate a consistent color based on the customer id
    const colorIndex = parseInt(customer._id.replace(/\D/g, '')) % 5;
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

  // Pagination component
  const Pagination = () => {
    return (
      <div className="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${currentPage === 1 ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            Previous
          </button>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${currentPage === totalPages ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(indexOfLastItem, sortedCustomers.length)}
              </span>{' '}
              of <span className="font-medium">{sortedCustomers.length}</span> results
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${currentPage === 1 ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-50'} ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0`}
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              
              {/* Page numbers */}
              {[...Array(totalPages).keys()].map((number) => {
                // Show first page, last page, and pages around current page
                const pageNumber = number + 1;
                const isVisible = 
                  pageNumber === 1 || 
                  pageNumber === totalPages || 
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1);
                
                if (!isVisible && pageNumber === currentPage - 2) {
                  return (
                    <span
                      key="ellipsis-prev"
                      className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300"
                    >
                      ...
                    </span>
                  );
                }
                
                if (!isVisible && pageNumber === currentPage + 2) {
                  return (
                    <span
                      key="ellipsis-next"
                      className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300"
                    >
                      ...
                    </span>
                  );
                }
                
                if (isVisible) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => paginate(pageNumber)}
                      aria-current={currentPage === pageNumber ? 'page' : undefined}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === pageNumber
                        ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                }
                
                return null;
              })}
              
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center rounded-r-md px-2 py-2 ${currentPage === totalPages ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-50'} ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0`}
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
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
        {/* Customer Listing Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Customers</h2>
              <p className="text-gray-500 text-sm mt-1">Manage all your registered customers</p>
            </div>
          </div>

          {/* Filters and Actions */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                <div className="relative w-full sm:w-72">
                  <input
                    type="text"
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full py-2 pl-10 pr-4 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
                
                {/* Block Status Filter */}
                <div className="relative w-full sm:w-44">
                  <select 
                    className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg py-2 pl-4 pr-10 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="All">All Block Status</option>
                    <option value="Active">Active</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <ChevronDown size={16} className="text-gray-500" />
                  </div>
                </div>

                {/* Verification Status Filter */}
                <div className="relative w-full sm:w-44">
                  <select 
                    className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg py-2 pl-4 pr-10 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer"
                    value={verificationFilter}
                    onChange={(e) => setVerificationFilter(e.target.value)}
                  >
                    <option value="All">All Verification</option>
                    <option value="Verified">Verified</option>
                    <option value="Unverified">Unverified</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <ChevronDown size={16} className="text-gray-500" />
                  </div>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
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
                
                {/* Items per page selector */}
                <div className="relative w-24">
                  <select
                    className="w-full appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-3 pr-8 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer"
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <ChevronDown size={16} className="text-gray-500" />
                  </div>
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
                  <h3 className="text-sm font-medium text-red-800">Error loading customers</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={fetchCustomers}
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
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                      <th 
                        className="px-6 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('createdAt')}
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
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Last Order</th>
                      <th 
                        className="px-6 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('totalSpent')}
                      >
                        <div className="flex items-center">
                          <span>Total Spent</span>
                          <ArrowUpDown size={14} className="ml-1" />
                        </div>
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Verification</th>
                      <th className="px-6 py-3 bg-gray-50 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.length > 0 ? (
                      currentItems.map((customer) => (
                        <tr key={customer._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <CustomerAvatar customer={customer} />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                                <div className="text-sm text-gray-500">{customer.email}</div>
                                <div className="text-xs text-gray-400 mt-1">ID: {customer._id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(customer.createdAt).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(customer.createdAt).toLocaleTimeString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{customer.orders}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {customer.lastOrder || 'No orders yet'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {customer.totalSpent || '$0.00'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <BlockStatusBadge customer={customer} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <VerificationBadge customer={customer} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end items-center space-x-2">
                              <button
                                onClick={() => navigate(`/admin/customers/${customer._id}`)}
                                className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                                title="View Details"
                              >
                                <Eye size={18} />
                              </button>
                              <button
                                onClick={() => navigate(`/admin/customers/${customer._id}/edit`)}
                                className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50"
                                title="Edit"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => handleBlockStatusChange(customer._id, !customer.isBlocked)}
                                className={customer.isBlocked ? "text-emerald-600 hover:text-emerald-900 p-1 rounded hover:bg-emerald-50" : "text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"}
                                title={customer.isBlocked ? "Unblock" : "Block"}
                                disabled={updatingStatus === customer._id}
                              >
                                {customer.isBlocked ? <Unlock size={18} /> : <Lock size={18} />}
                              </button>
                              <div className="relative inline-block text-left">
                                <button
                                  type="button"
                                  className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-50"
                                  id="options-menu"
                                  aria-haspopup="true"
                                  aria-expanded="true"
                                >
                                  <MoreHorizontal size={18} />
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                          No customers found matching your criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <Pagination />
            </div>
          )}

          {/* Grid View */}
          {!loading && !error && viewMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentItems.length > 0 ? (
                currentItems.map((customer) => (
                  <div key={customer._id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200">
                    <div className="p-4">
                      <div className="flex items-center space-x-4">
                        <CustomerAvatar customer={customer} />
                        <div>
                          <h3 className="font-medium text-gray-900">{customer.name}</h3>
                          <p className="text-sm text-gray-500 truncate">{customer.email}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center text-gray-500">
                          <Phone size={14} className="mr-2" />
                          <span>{customer.phone || 'N/A'}</span>
                        </div>
                        <div className="flex items-center text-gray-500">
                          <ShoppingBag size={14} className="mr-2" />
                          <span>{customer.orders} orders</span>
                        </div>
                        <div className="flex items-center text-gray-500">
                          <Calendar size={14} className="mr-2" />
                          <span>{new Date(customer.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center font-medium text-gray-900">
                          <span>{customer.totalSpent || '$0.00'}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <BlockStatusBadge customer={customer} />
                        <VerificationBadge customer={customer} />
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-t border-gray-200">
                      <button
                        onClick={() => navigate(`/admin/customers/${customer._id}`)}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
                      >
                        View Details
                      </button>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/admin/customers/${customer._id}/edit`)}
                          className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleBlockStatusChange(customer._id, !customer.isBlocked)}
                          className={customer.isBlocked ? "text-emerald-500 hover:text-emerald-700 p-1 rounded hover:bg-emerald-100" : "text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-100"}
                          title={customer.isBlocked ? "Unblock" : "Block"}
                          disabled={updatingStatus === customer._id}
                        >
                          {customer.isBlocked ? <Unlock size={16} /> : <Lock size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Users size={48} className="mx-auto text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No customers found</h3>
                  <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>
          )}

          {/* Pagination for Grid View */}
          {!loading && !error && viewMode === 'grid' && currentItems.length > 0 && (
            <div className="mt-6">
              <Pagination />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CustomerListing;