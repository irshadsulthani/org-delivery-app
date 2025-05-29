import { useState, useEffect } from 'react';
<<<<<<< HEAD
import {
=======
import { 
  Download,
>>>>>>> d387b79 (feat:- now doing the customer address adding)
  RefreshCw,
  Lock,
  Unlock,
  Eye,
<<<<<<< HEAD
  Phone,
  AlertCircle,
  ShoppingBag,
  ShieldX,
  ShieldCheck,
  Users,
  UserCheck,
  UserX,
  Calendar,
  Mail
=======
  User,
  Phone,
  Calendar,
  AlertCircle,
  Edit,
  ShoppingBag,
  ShieldCheck,
  ShieldX,
  Check,
  X,
  Users
>>>>>>> d387b79 (feat:- now doing the customer address adding)
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminHeader from '../../components/Admin/AdminHeader';
import { blockCustomer, getAllCustomers, unBlockCustomer } from '../../api/adminApi';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import { Table } from "../../components/Admin/Table";

// TypeScript interfaces
interface Customer {
  userId: any;
  _id: string;
  name: string;
  email: string;
  phone: string;
  isBlocked: boolean;
  isVerified: boolean;
  createdAt: string;
  orders: number;
  lastOrder: string;
  totalSpent: string;
  avatar?: string;
}

const ITEMS_PER_PAGE = 10;

const CustomerListing = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<Record<string, boolean>>({});
<<<<<<< HEAD

=======
  
  const dispatch = useDispatch();
>>>>>>> d387b79 (feat:- now doing the customer address adding)
  const navigate = useNavigate();

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
<<<<<<< HEAD

=======
      
>>>>>>> d387b79 (feat:- now doing the customer address adding)
      const response = await getAllCustomers({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: searchTerm,
        filters: filters,
        sortField: sortField,
        sortDirection: sortDirection,
      });

<<<<<<< HEAD
=======
      console.log('res res',response);
      
      
>>>>>>> d387b79 (feat:- now doing the customer address adding)
      if (response.success) {
        setCustomers(response.data);
        setTotalCustomers(response.total);
      } else {
        throw new Error(response.message || 'Failed to fetch customers');
      }
    } catch (error: any) {
      const errorMessage = error.message || "Failed to fetch customers";
      console.error("Error fetching customers:", errorMessage);
      setError(errorMessage);
      toast.error(errorMessage);
      setCustomers([]);
      setTotalCustomers(0);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchCustomers();
    toast.success('Customer data refreshed!');
  };

  const handleBlockCustomer = async (customerId: string) => {
    try {
      setIsUpdatingStatus(prev => ({ ...prev, [customerId]: true }));
<<<<<<< HEAD
      
      const response = await blockCustomer(customerId);
      console.log("Blocking customer:", customerId, response);
      if (response.message === "Customer blocked successfully") {
        setCustomers(prevCustomers => 
          prevCustomers.map(customer => 
            customer.userId._id === customerId || customer._id === customerId
              ? { ...customer, isBlocked: true }
              : customer
          )
        );
        console.log("Customer blocked successfully:", customerId);
        toast.success("Customer blocked successfully");
      } else {
        throw new Error(response.message || "Failed to block customer");
      }
    } catch (error: any) {
      console.error("Error blocking customer:", error);
      toast.error(error.message || "Failed to block customer");
=======
      await blockCustomer(customerId);
      toast.success("Customer blocked successfully");
      fetchCustomers();
    } catch (error) {
      console.error("Error blocking customer:", error);
      toast.error("Failed to block customer");
>>>>>>> d387b79 (feat:- now doing the customer address adding)
    } finally {
      setIsUpdatingStatus(prev => ({ ...prev, [customerId]: false }));
    }
  };

  const handleUnblockCustomer = async (customerId: string) => {
    try {
<<<<<<< HEAD
      console.log("Unblocking customer:", customerId);
      setIsUpdatingStatus(prev => ({ ...prev, [customerId]: true }));
      
      const response = await unBlockCustomer(customerId);
      
      if (response.success) {
        // Update the customer status locally for immediate UI feedback
        setCustomers(prevCustomers => 
          prevCustomers.map(customer => 
            customer.userId._id === customerId || customer._id === customerId
              ? { ...customer, isBlocked: false }
              : customer
          )
        );
        toast.success("Customer unblocked successfully");
      } else {
        throw new Error(response.message || "Failed to unblock customer");
      }
    } catch (error: any) {
      console.error("Error unblocking customer:", error);
      toast.error(error.message || "Failed to unblock customer");
=======
      setIsUpdatingStatus(prev => ({ ...prev, [customerId]: true }));
      await unBlockCustomer(customerId);
      toast.success("Customer unblocked successfully");
      fetchCustomers();
    } catch (error) {
      console.error("Error unblocking customer:", error);
      toast.error("Failed to unblock customer");
>>>>>>> d387b79 (feat:- now doing the customer address adding)
    } finally {
      setIsUpdatingStatus(prev => ({ ...prev, [customerId]: false }));
    }
  };

  const handleViewDetails = (customerId: string) => {
    navigate(`/admin/customers/${customerId}`);
  };

  const handleSearch = (searchQuery: string) => {
    setSearchTerm(searchQuery);
    setCurrentPage(1);
  };

  const handleFilter = (filterOptions: Record<string, any>) => {
    setFilters(filterOptions);
    setCurrentPage(1);
  };

  const handleSort = (field: string, direction: "asc" | "desc") => {
    setSortField(field);
    setSortDirection(direction);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchCustomers();
  }, [currentPage, searchTerm, filters, sortField, sortDirection]);

<<<<<<< HEAD
  // Enhanced Status badge component with better styling
  const StatusBadge = ({ isBlocked }: { isBlocked: boolean }) => {
    if (isBlocked) {
      return (
        <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm">
          <UserX size={12} className="mr-1.5" />
          Blocked
        </div>
      );
    }
    
    return (
      <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-sm">
        <UserCheck size={12} className="mr-1.5" />
        Active
      </div>
    );
  };

  // Enhanced Verification badge component
  const VerificationBadge = ({ verified }: { verified: boolean }) => {
    if (verified) {
      return (
        <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm">
          <ShieldCheck size={12} className="mr-1.5" />
          Verified
        </div>
      );
    }
    
    return (
      <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm">
        <ShieldX size={12} className="mr-1.5" />
        Pending
      </div>
    );
  };

  // Enhanced Customer avatar component
  const CustomerAvatar = ({ customer }: { customer: Customer }) => {
    if (customer.avatar) {
      return (
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden border-2 border-white shadow-lg">
=======
  // Status badge component for block/unblock
  const BlockStatusBadge = ({ status }: { status: "Active" | "Blocked" }) => {
    let colorClasses = "";
    let Icon = Check;

    switch (status) {
      case "Active":
        colorClasses = "bg-emerald-100 text-emerald-800 border border-emerald-200";
        Icon = Check;
        break;
      case "Blocked":
        colorClasses = "bg-red-100 text-red-800 border border-red-200";
        Icon = X;
        break;
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses}`}>
        <Icon size={12} className="mr-1" />
        {status}
      </span>
    );
  };

  // Verification badge component
  const VerificationBadge = ({ verified }: { verified: boolean }) => {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          verified
            ? "bg-blue-100 text-blue-800 border border-blue-200"
            : "bg-yellow-100 text-yellow-800 border border-yellow-200"
        }`}
      >
        {verified ? <ShieldCheck size={12} className="mr-1" /> : <ShieldX size={12} className="mr-1" />}
        {verified ? "Verified" : "Unverified"}
      </span>
    );
  };

  // Customer avatar component
  const CustomerAvatar = ({ customer }: { customer: Customer }) => {
    if (customer.avatar) {
      return (
        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
>>>>>>> d387b79 (feat:- now doing the customer address adding)
          <img
            src={customer.avatar}
            alt={customer.name}
            className="w-full h-full object-cover"
          />
        </div>
      );
    }

<<<<<<< HEAD
    const fullName = customer?.userId?.name || customer.name;
    const initials =
      typeof fullName === "string" && fullName.trim()
        ? fullName
=======
    const initials = customer?.name
      ? customer.name
>>>>>>> d387b79 (feat:- now doing the customer address adding)
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .substring(0, 2)
<<<<<<< HEAD
        : "NA";
    const colorIndex = customer._id
      ? parseInt(customer._id.replace(/\D/g, "")) % 5
      : 0;

    const gradients = [
      "bg-gradient-to-br from-blue-500 to-blue-600",
      "bg-gradient-to-br from-purple-500 to-purple-600",
      "bg-gradient-to-br from-emerald-500 to-emerald-600",
      "bg-gradient-to-br from-amber-500 to-orange-500",
      "bg-gradient-to-br from-indigo-500 to-indigo-600",
=======
      : "NA";

    const colorIndex = parseInt(customer._id.replace(/\D/g, "")) % 5;
    const bgColors = [
      "bg-blue-500",
      "bg-purple-500",
      "bg-emerald-500",
      "bg-amber-500",
      "bg-indigo-500",
>>>>>>> d387b79 (feat:- now doing the customer address adding)
    ];

    return (
      <div
<<<<<<< HEAD
        className={`w-12 h-12 rounded-full ${gradients[colorIndex]} flex items-center justify-center text-white font-bold shadow-lg border-2 border-white`}
=======
        className={`w-10 h-10 rounded-full ${bgColors[colorIndex]} flex items-center justify-center text-white font-medium shadow-sm`}
>>>>>>> d387b79 (feat:- now doing the customer address adding)
      >
        {initials}
      </div>
    );
  };

<<<<<<< HEAD
  // Enhanced Action Buttons
  const ActionButton = ({ 
    onClick, 
    disabled, 
    isLoading, 
    variant, 
    icon: Icon, 
    title 
  }: {
    onClick: () => void;
    disabled?: boolean;
    isLoading?: boolean;
    variant: 'view' | 'block' | 'unblock';
    icon: any;
    title: string;
  }) => {
    const variants = {
      view: "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white",
      block: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white",
      unblock: "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
    };

    return (
      <button
        className={`inline-flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-sm ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={onClick}
        disabled={disabled}
        title={title}
      >
        {isLoading ? (
          <RefreshCw size={14} className="animate-spin" />
        ) : (
          <Icon size={14} />
        )}
      </button>
    );
  };
=======
  // Table columns configuration
  const columns = [
    {
      header: "Customer Details",
      accessor: "name",
      sortable: true,
      render: (customer: Customer) => (
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <CustomerAvatar customer={customer} />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {customer.name}
            </div>
            <div className="text-sm text-gray-500">{customer.email}</div>
            <div className="text-xs text-gray-400 mt-1">ID: {customer._id}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Contact",
      accessor: "phone",
      render: (customer: Customer) => (
        <div>
          <div className="flex items-center">
            <Phone size={14} className="text-gray-400 mr-1" />
            <span className="text-sm text-gray-900">
              {customer.phone || 'N/A'}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Join Date",
      accessor: "createdAt",
      sortable: true,
      render: (customer: Customer) => (
        <div>
          <div className="text-sm text-gray-900">
            {new Date(customer.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
          <div className="text-xs text-gray-500">
            {new Date(customer.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      ),
    },
    {
      header: "Orders",
      accessor: "orders",
      sortable: true,
      render: (customer: Customer) => (
        <div>
          <div className="flex items-center">
            <ShoppingBag size={14} className="text-gray-400 mr-1" />
            <span className="text-sm text-gray-900">
              {customer.orders || 0}
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {customer.totalSpent || '$0.00'}
          </div>
        </div>
      ),
    },
    {
      header: "Last Order",
      accessor: "lastOrder",
      render: (customer: Customer) => (
        <div>
          <div className="text-sm text-gray-900">
            {customer.lastOrder ? new Date(customer.lastOrder).toLocaleDateString() : 'No orders yet'}
          </div>
        </div>
      ),
    },
    {
      header: "Verification",
      accessor: "isVerified",
      filterable: true,
      filterOptions: [
        { label: "All Verification", value: "" },
        { label: "Verified", value: "true" },
        { label: "Unverified", value: "false" },
      ],
      render: (customer: Customer) => (
        <VerificationBadge verified={customer.isVerified} />
      ),
    },
    {
      header: "Status",
      accessor: "isBlocked",
      filterable: true,
      filterOptions: [
        { label: "All Status", value: "" },
        { label: "Active", value: "false" },
        { label: "Blocked", value: "true" },
      ],
      render: (customer: Customer) => (
        <BlockStatusBadge status={customer.isBlocked ? "Blocked" : "Active"} />
      ),
    },
    {
      header: "Actions",
      accessor: "actions",
      render: (customer: Customer) => (
        <div className="flex items-center justify-end space-x-3">
          <button
            className="text-indigo-600 hover:text-indigo-900"
            onClick={() => handleViewDetails(customer._id)}
            title="View details"
          >
            <Eye size={16} />
          </button>
          <button
            className="text-gray-600 hover:text-gray-900"
            onClick={() => navigate(`/admin/customers/${customer._id}/edit`)}
            title="Edit customer"
          >
            <Edit size={16} />
          </button>
          {!customer.isBlocked ? (
            <button
              className="text-red-600 hover:text-red-900"
              onClick={() => handleBlockCustomer(customer._id)}
              disabled={isUpdatingStatus[customer._id]}
              title="Block customer"
            >
              {isUpdatingStatus[customer._id] ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <Lock size={16} />
              )}
            </button>
          ) : (
            <button
              className="text-emerald-600 hover:text-emerald-900"
              onClick={() => handleUnblockCustomer(customer._id)}
              disabled={isUpdatingStatus[customer._id]}
              title="Unblock customer"
            >
              {isUpdatingStatus[customer._id] ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <Unlock size={16} />
              )}
            </button>
          )}
        </div>
      ),
    },
  ];

  const emptyState = (
    <div className="text-center py-12">
      <Users className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">No customers found</h3>
      <p className="mt-1 text-sm text-gray-500">
        Try adjusting your search or filter criteria
      </p>
    </div>
  );
>>>>>>> d387b79 (feat:- now doing the customer address adding)

  // Table columns configuration
  const columns = [
    {
      header: "Customer Details",
      accessor: "name",
      sortable: true,
      render: (customer: Customer) => (
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <CustomerAvatar customer={customer} />
          </div>
          <div className="ml-4">
            <div className="text-sm font-semibold text-gray-900">
              {customer?.userId?.name || customer.name}
            </div>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Mail size={12} className="mr-1" />
              {customer?.userId?.email || customer.email}
            </div>
            <div className="text-xs text-gray-400 mt-1 font-mono">
              ID: {customer?.userId?._id || customer._id}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Contact",
      accessor: "phone",
      render: (customer: Customer) => (
        <div className="flex items-center">
          <div className="p-2 bg-gray-100 rounded-lg mr-2">
            <Phone size={14} className="text-gray-600" />
          </div>
          <span className="text-sm text-gray-900 font-medium">
            {customer.phone || 'Not provided'}
          </span>
        </div>
      ),
    },
    {
      header: "Join Date",
      accessor: "createdAt",
      sortable: true,
      render: (customer: Customer) => (
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg mr-2">
            <Calendar size={14} className="text-blue-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">
              {new Date(customer.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
            <div className="text-xs text-gray-500">
              {new Date(customer.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Orders & Spent",
      accessor: "orders",
      sortable: true,
      render: (customer: Customer) => (
        <div className="flex items-center">
          <div className="p-2 bg-purple-100 rounded-lg mr-2">
            <ShoppingBag size={14} className="text-purple-600" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">
              {customer.orders || 0} orders
            </div>
            <div className="text-xs text-green-600 font-medium">
              {customer.totalSpent || '$0.00'}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Last Order",
      accessor: "lastOrder",
      render: (customer: Customer) => (
        <div className="text-sm text-gray-900 font-medium">
          {customer.lastOrder 
            ? new Date(customer.lastOrder).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
              })
            : 'No orders yet'
          }
        </div>
      ),
    },
    {
      header: "Verification",
      accessor: "isVerified",
      filterable: true,
      filterOptions: [
        { label: "All Verification", value: "" },
        { label: "Verified", value: "true" },
        { label: "Unverified", value: "false" },
      ],
      render: (customer: Customer) => (
        <VerificationBadge verified={customer.isVerified} />
      ),
    },
    {
      header: "Account Status",
      accessor: "isBlocked",
      filterable: true,
      filterOptions: [
        { label: "All Status", value: "" },
        { label: "Active", value: "false" },
        { label: "Blocked", value: "true" },
      ],
      render: (customer: Customer) => (
        <StatusBadge isBlocked={customer.isBlocked} />
      ),
    },
    {
      header: "Actions",
      accessor: "actions",
      render: (customer: Customer) => {
        const customerId = customer?.userId?._id || customer._id;
        return (
          <div className="flex items-center justify-end space-x-2">
            <ActionButton
              onClick={() => handleViewDetails(customer._id)}
              variant="view"
              icon={Eye}
              title="View customer details"
            />
            {!customer.isBlocked ? (
              <ActionButton
                onClick={() => handleBlockCustomer(customerId)}
                disabled={isUpdatingStatus[customerId]}
                isLoading={isUpdatingStatus[customerId]}
                variant="block"
                icon={Lock}
                title="Block customer"
              />
            ) : (
              <ActionButton
                onClick={() => handleUnblockCustomer(customerId)}
                disabled={isUpdatingStatus[customerId]}
                isLoading={isUpdatingStatus[customerId]}
                variant="unblock"
                icon={Unlock}
                title="Unblock customer"
              />
            )}
          </div>
        );
      },
    },
  ];

  const emptyState = (
    <div className="text-center py-16">
      <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
        <Users className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No customers found</h3>
      <p className="text-sm text-gray-500 max-w-sm mx-auto">
        Try adjusting your search or filter criteria to find what you're looking for
      </p>
    </div>
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
<<<<<<< HEAD
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden backdrop-blur-sm"
=======
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
>>>>>>> d387b79 (feat:- now doing the customer address adding)
          onClick={toggleMobileSidebar}
        >
          <div
            className="absolute top-0 left-0 w-72 h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <AdminSidebar
              collapsed={false}
              setCollapsed={setCollapsed}
              isMobile={true}
              onCloseMobile={toggleMobileSidebar}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <AdminHeader />

        {/* Customer Listing Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Enhanced Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-4 sm:space-y-0">
            <div>
<<<<<<< HEAD
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Customer Management
              </h2>
              <p className="text-gray-500 text-sm mt-2">
                Manage and monitor all registered customers with advanced controls
=======
              <h2 className="text-2xl font-bold text-gray-800">
                Customer Management
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Manage all registered customers
>>>>>>> d387b79 (feat:- now doing the customer address adding)
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
<<<<<<< HEAD
                className={`inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-200 hover:scale-105 ${
=======
                className={`inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
>>>>>>> d387b79 (feat:- now doing the customer address adding)
                  loading ? "opacity-80" : ""
                }`}
                onClick={refreshData}
                disabled={loading}
              >
                <RefreshCw
                  size={16}
                  className={`mr-2 ${loading ? "animate-spin" : ""}`}
                />
<<<<<<< HEAD
                Refresh Data
=======
                Refresh
              </button>

              <button
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() =>
                  toast.info("Export functionality would be implemented here")
                }
              >
                <Download size={16} className="mr-2" />
                Export
              </button>

              <button
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => navigate("/admin/customers/add")}
              >
                <Users size={16} className="mr-2" />
                Add Customer
>>>>>>> d387b79 (feat:- now doing the customer address adding)
              </button>
            </div>
          </div>

<<<<<<< HEAD
          {/* Enhanced Error State */}
=======
          {/* Error State */}
>>>>>>> d387b79 (feat:- now doing the customer address adding)
          {error && !loading && (
            <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-6 mb-6 shadow-sm">
              <div className="flex">
<<<<<<< HEAD
                <div className="p-2 bg-red-200 rounded-lg mr-4">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-red-800 mb-2">
                    Error Loading Customers
                  </h3>
                  <p className="text-sm text-red-700 mb-4">{error}</p>
                  <button
                    type="button"
                    onClick={fetchCustomers}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                  >
                    <RefreshCw size={14} className="mr-2" />
                    Try Again
                  </button>
=======
                <AlertCircle
                  className="h-5 w-5 text-red-500"
                  aria-hidden="true"
                />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error loading customers
                  </h3>
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
>>>>>>> d387b79 (feat:- now doing the customer address adding)
                </div>
              </div>
            </div>
          )}

<<<<<<< HEAD
          {/* Enhanced Table Component */}
          {!error && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <Table
                columns={columns}
                data={customers}
                totalItems={totalCustomers}
                itemsPerPage={ITEMS_PER_PAGE}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onSortChange={handleSort}
                onSearch={handleSearch}
                onFilter={handleFilter}
                loading={loading}
                emptyState={emptyState}
              />
            </div>
=======
          {/* Table Component */}
          {!error && (
            <Table
              columns={columns}
              data={customers}
              totalItems={totalCustomers}
              itemsPerPage={ITEMS_PER_PAGE}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              onSortChange={handleSort}
              onSearch={handleSearch}
              onFilter={handleFilter}
              loading={loading}
              emptyState={emptyState}
            />
>>>>>>> d387b79 (feat:- now doing the customer address adding)
          )}
        </main>
      </div>
    </div>
  );
};
export default CustomerListing;