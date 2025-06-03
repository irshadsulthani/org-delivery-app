import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, Phone, Mail, Truck, CheckCircle, XCircle, Clock, Ban, AlertCircle,
  RefreshCw, Lock, Unlock, Eye, MapPin, Star, ShieldCheck, ShieldX,
  Calendar, Package, DollarSign
} from "lucide-react";
import { getAllDeliveryBoys, blockDeliveryBoy, unblockDeliveryBoy } from "../../api/adminApi";
import { toast } from "react-toastify";
import { Table } from "../../components/Admin/Table";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import AdminHeader from "../../components/Admin/AdminHeader";

interface DeliveryBoy {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    isBlocked: boolean;
  };
  phone: string;
  profileImageUrl?: string;
  verificationStatus: string;
  currentlyAvailable: boolean;
  vehicleType: string;
  totalDeliveredOrders: number;
  createdAt: string;
  address?: {
    street: string;
    area: string;
    city: string;
    state: string;
    zipCode: string;
  };
  rating?: number;
  totalEarnings?: number;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const ITEMS_PER_PAGE = 5;

export const DeliveryBoyListing = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [deliveryBoys, setDeliveryBoys] = useState<DeliveryBoy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: ITEMS_PER_PAGE,
    total: 0,
    totalPages: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sortConfig, setSortConfig] = useState({
    field: "createdAt",
    direction: "desc" as "asc" | "desc",
  });
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<Record<string, boolean>>({});

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  const fetchDeliveryBoys = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const backendFilters: Record<string, any> = {};
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          switch (key) {
            case 'verificationStatus':
              backendFilters.verificationStatus = value;
              break;
            case 'vehicleType':
              backendFilters.vehicleType = value;
              break;
            case 'userId.isBlocked':
              backendFilters.isBlocked = value === 'true' || value === true;
              break;
            case 'currentlyAvailable':
              backendFilters.currentlyAvailable = value === 'true' || value === true;
              break;
            default:
              backendFilters[key] = value;
          }
        }
      });

      const response = await getAllDeliveryBoys({
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        filters: backendFilters,
        sortField: sortConfig.field,
        sortDirection: sortConfig.direction,
      });

      if (response.success) {
        setDeliveryBoys(response.data || []);
        setPagination({
          page: response.page || pagination.page,
          limit: response.limit || pagination.limit,
          total: response.total || 0,
          totalPages: response.totalPages || Math.ceil(response.total / response.limit),
        });
      } else {
        throw new Error(response.message || 'Failed to fetch delivery boys');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to fetch delivery boys');
      toast.error(error.message || "Failed to fetch delivery boys");
      setDeliveryBoys([]);
      setPagination(prev => ({ ...prev, total: 0, totalPages: 0 }));
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, searchTerm, filters, sortConfig]);

  useEffect(() => {
    fetchDeliveryBoys();
  }, [fetchDeliveryBoys]);

  const refreshData = () => {
    fetchDeliveryBoys();
    toast.success("Delivery boys data refreshed!");
  };

const handleBlockDeliveryBoy = async (deliveryBoyId: string) => {
  try {
    setIsUpdatingStatus(prev => ({ ...prev, [deliveryBoyId]: true }));

    // Call API to block delivery boy
    await blockDeliveryBoy(deliveryBoyId);

    // Update local state correctly
    setDeliveryBoys(prevDeliveryBoys =>
      prevDeliveryBoys.map(deliveryBoy =>
        deliveryBoy.userId._id === deliveryBoyId
          ? {
              ...deliveryBoy,
              userId: {
                ...deliveryBoy.userId,
                isBlocked: true
              }
            }
          : deliveryBoy
      )
    );

    toast.success("Delivery boy blocked successfully");
  } catch (error) {
    console.error("Error blocking delivery boy:", error);
    toast.error("Failed to block delivery boy");
  } finally {
    setIsUpdatingStatus(prev => ({ ...prev, [deliveryBoyId]: false }));
  }
};

const handleUnblockDeliveryBoy = async (deliveryBoyId: string) => {
  try {
    setIsUpdatingStatus(prev => ({ ...prev, [deliveryBoyId]: true }));

    // Call API to unblock delivery boy
    await unblockDeliveryBoy(deliveryBoyId);

    // Update local state correctly
    setDeliveryBoys(prevDeliveryBoys =>
      prevDeliveryBoys.map(deliveryBoy =>
        deliveryBoy.userId._id === deliveryBoyId
          ? {
              ...deliveryBoy,
              userId: {
                ...deliveryBoy.userId,
                isBlocked: false
              }
            }
          : deliveryBoy
      )
    );

    toast.success("Delivery boy unblocked successfully");
  } catch (error) {
    console.error("Error unblocking delivery boy:", error);
    toast.error("Failed to unblock delivery boy");
  } finally {
    setIsUpdatingStatus(prev => ({ ...prev, [deliveryBoyId]: false }));
  }
};


  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
    window.scrollTo(0, 0);
  };

  const handleSearch = (term: string) => {
    if (term !== searchTerm) {
      setSearchTerm(term);
      setPagination(prev => ({ ...prev, page: 1 }));
    }
  };

  const handleFilter = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSort = (field: string, direction: "asc" | "desc") => {
    setSortConfig({ field, direction });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Enhanced Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const statusConfig = {
      approved: {
        gradient: "bg-gradient-to-r from-emerald-500 to-emerald-600",
        icon: CheckCircle,
        text: "Approved"
      },
      rejected: {
        gradient: "bg-gradient-to-r from-red-500 to-red-600",
        icon: XCircle,
        text: "Rejected"
      },
      pending: {
        gradient: "bg-gradient-to-r from-amber-500 to-orange-500",
        icon: Clock,
        text: "Pending"
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-sm ${config.gradient}`}>
        <Icon size={12} className="mr-1.5" />
        {config.text}
      </div>
    );
  };

  // Enhanced Block Status badge component
  const BlockStatusBadge = ({ isBlocked }: { isBlocked: boolean }) => {
    if (isBlocked) {
      return (
        <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm">
          <Ban size={12} className="mr-1.5" />
          Blocked
        </div>
      );
    }
    
    return (
      <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-sm">
        <CheckCircle size={12} className="mr-1.5" />
        Active
      </div>
    );
  };

  // Enhanced DeliveryBoy avatar component
  const DeliveryBoyAvatar = ({ deliveryBoy }: { deliveryBoy: DeliveryBoy }) => {
    if (deliveryBoy.profileImageUrl) {
      return (
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden border-2 border-white shadow-lg">
          <img
            src={deliveryBoy.profileImageUrl}
            alt={deliveryBoy.userId.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://via.placeholder.com/48x48/e5e7eb/6b7280?text=" + 
                deliveryBoy.userId.name.charAt(0).toUpperCase();
            }}
          />
        </div>
      );
    }

    const initials = deliveryBoy?.userId.name
      ? deliveryBoy.userId.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .substring(0, 2)
      : "NA";

    const colorIndex = parseInt(deliveryBoy._id.replace(/\D/g, "")) % 5;
    const gradients = [
      "bg-gradient-to-br from-blue-500 to-blue-600",
      "bg-gradient-to-br from-purple-500 to-purple-600",
      "bg-gradient-to-br from-emerald-500 to-emerald-600",
      "bg-gradient-to-br from-amber-500 to-orange-500",
      "bg-gradient-to-br from-indigo-500 to-indigo-600",
    ];

    return (
      <div
        className={`w-12 h-12 rounded-full ${gradients[colorIndex]} flex items-center justify-center text-white font-bold shadow-lg border-2 border-white`}
      >
        {initials}
      </div>
    );
  };

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

  // Enhanced Rating component
  const RatingDisplay = ({ rating }: { rating: number | undefined }) => {
    if (!rating) {
      return (
        <div className="flex items-center">
          <div className="p-2 bg-gray-100 rounded-lg mr-2">
            <Star size={14} className="text-gray-400" />
          </div>
          <div>
            <span className="text-sm text-gray-400 font-medium">No Rating</span>
          </div>
        </div>
      );
    }

    const displayRating = typeof rating === "number" ? rating.toFixed(1) : "N/A";
    return (
      <div className="flex items-center">
        <div className="p-2 bg-amber-100 rounded-lg mr-2">
          <Star size={14} className="text-amber-600" />
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-900">{displayRating}</div>
        </div>
      </div>
    );
  };

  // Enhanced Availability indicator
  const AvailabilityIndicator = ({ available }: { available: boolean }) => {
    return (
      <div className="flex items-center">
        <div className={`h-3 w-3 rounded-full mr-2 ${
          available ? 'bg-green-500' : 'bg-red-500'
        }`} />
        <span className={`text-xs font-medium ${
          available ? 'text-green-700' : 'text-red-700'
        }`}>
          {available ? 'Available' : 'Unavailable'}
        </span>
      </div>
    );
  };

  const columns = [
    {
      header: "Delivery Boy Details",
      accessor: "userId.name",
      sortable: true,
      render: (data: DeliveryBoy) => (
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <DeliveryBoyAvatar deliveryBoy={data} />
          </div>
          <div className="ml-4">
            <div 
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-900 cursor-pointer transition-colors"
              onClick={() => navigate(`/admin/delivery-boy/${data._id}`)}
            >
              {data.userId.name}
            </div>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Mail size={12} className="mr-1" />
              <span className="truncate max-w-40">{data.userId.email}</span>
            </div>
            <div className="flex items-center text-xs text-gray-400 mt-1">
              <Phone size={10} className="mr-1" />
              {data.phone || 'N/A'}
            </div>
          </div>
        </div>
      ),
      filterable: true,
    },
    {
      header: "Joined Date",
      accessor: "createdAt",
      sortable: true,
      render: (data: DeliveryBoy) => (
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg mr-2">
            <Calendar size={14} className="text-blue-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">
              {new Date(data.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
            <div className="text-xs text-gray-500">
              {new Date(data.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Vehicle & Availability",
      accessor: "vehicleType",
      sortable: true,
      filterable: true,
      filterOptions: [
        { label: 'All Vehicles', value: '' },
        { label: 'Bike', value: 'bike' },
        { label: 'Car', value: 'car' },
        { label: 'Truck', value: 'truck' },
      ],
      render: (data: DeliveryBoy) => (
        <div className="flex items-center">
          <div className="p-2 bg-purple-100 rounded-lg mr-2">
            <Truck size={14} className="text-purple-600" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900 capitalize">
              {data.vehicleType}
            </div>
            <div className="mt-1">
              <AvailabilityIndicator available={data.currentlyAvailable} />
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Performance",
      accessor: "totalDeliveredOrders",
      sortable: true,
      render: (data: DeliveryBoy) => (
        <div className="flex items-center">
          <div className="p-2 bg-green-100 rounded-lg mr-2">
            <Package size={14} className="text-green-600" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">
              {data.totalDeliveredOrders || 0} orders
            </div>
            {data.totalEarnings && (
              <div className="text-xs text-green-600 font-medium flex items-center mt-1">
                <DollarSign size={10} className="mr-1" />
                ₹{data.totalEarnings.toLocaleString("en-IN")}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      header: "Verification Status",
      accessor: "verificationStatus",
      sortable: true,
      filterable: true,
      filterOptions: [
        { label: 'All Status', value: '' },
        { label: 'Approved', value: 'approved' },
        { label: 'Pending', value: 'pending' },
        { label: 'Rejected', value: 'rejected' },
      ],
      render: (data: DeliveryBoy) => <StatusBadge status={data.verificationStatus} />,
    },
    {
      header: "Account Status",
      accessor: "userId.isBlocked",
      filterable: true,
      filterOptions: [
        { label: 'All Accounts', value: '' },
        { label: 'Active', value: 'false' },
        { label: 'Blocked', value: 'true' },
      ],
      render: (data: DeliveryBoy) => <BlockStatusBadge isBlocked={data.userId.isBlocked} />,
    },
    {
      header: "Actions",
      accessor: "actions",
      render: (data: DeliveryBoy) => (
        <div className="flex items-center justify-end space-x-2">
          <ActionButton
            onClick={() => navigate(`/admin/delivery-boy/${data._id}`)}
            variant="view"
            icon={Eye}
            title="View delivery boy details"
          />
          {!data.userId.isBlocked ? (
            <ActionButton
              onClick={() => handleBlockDeliveryBoy(data.userId._id)}
              disabled={isUpdatingStatus[data.userId._id]}
              isLoading={isUpdatingStatus[data.userId._id]}
              variant="block"
              icon={Lock}
              title="Block delivery boy"
            />
          ) : (
            <ActionButton
              onClick={() => handleUnblockDeliveryBoy(data.userId._id)}
              disabled={isUpdatingStatus[data.userId._id]}
              isLoading={isUpdatingStatus[data.userId._id]}
              variant="unblock"
              icon={Unlock}
              title="Unblock delivery boy"
            />
          )}
        </div>
      ),
    },
  ];

  const emptyState = (
    <div className="text-center py-16">
      <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
        <Truck className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No delivery boys found</h3>
      <p className="text-sm text-gray-500 max-w-sm mx-auto mb-4">
        {searchTerm || Object.keys(filters).length > 0
          ? "No delivery boys match your current search and filter criteria."
          : "Get started by adding your first delivery boy."}
      </p>
      {searchTerm || Object.keys(filters).length > 0 ? (
        <button
          onClick={() => {
            setSearchTerm("");
            setFilters({});
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-indigo-600 bg-indigo-100 hover:bg-indigo-200 transition-colors"
        >
          Clear search and filters
        </button>
      ) : (
        <button
          onClick={() => navigate("/admin/delivery-boys/new")}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200"
        >
          Add First Delivery Boy
        </button>
      )}
    </div>
  );

  // Statistics calculation
  const stats = {
    active: deliveryBoys.filter(db => !db.userId.isBlocked).length,
    pending: deliveryBoys.filter(db => db.verificationStatus === 'pending').length,
    blocked: deliveryBoys.filter(db => db.userId.isBlocked).length,
    available: deliveryBoys.filter(db => db.currentlyAvailable).length,
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden backdrop-blur-sm"
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

        {/* Delivery Boy Listing Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Enhanced Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Delivery Boys Management
              </h2>
              <p className="text-gray-500 text-sm mt-2">
                Manage and monitor all registered delivery personnel with advanced controls
              </p>
              {/* Enhanced Statistics */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-green-100 to-green-200 p-3 rounded-lg">
                  <div className="flex items-center">
                    <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium text-green-800">Active: {stats.active}</span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-3 rounded-lg">
                  <div className="flex items-center">
                    <div className="h-3 w-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium text-blue-800">Available: {stats.available}</span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 p-3 rounded-lg">
                  <div className="flex items-center">
                    <div className="h-3 w-3 bg-yellow-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium text-yellow-800">Pending: {stats.pending}</span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-red-100 to-red-200 p-3 rounded-lg">
                  <div className="flex items-center">
                    <div className="h-3 w-3 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium text-red-800">Blocked: {stats.blocked}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                className={`inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-200 hover:scale-105 ${
                  loading ? "opacity-80" : ""
                }`}
                onClick={refreshData}
                disabled={loading}
              >
                <RefreshCw
                  size={16}
                  className={`mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Refresh Data
              </button>
            </div>
          </div>

          {/* Enhanced Error State */}
          {error && !loading && (
            <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-6 mb-6 shadow-sm">
              <div className="flex">
                <div className="p-2 bg-red-200 rounded-lg mr-4">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-red-800 mb-2">
                    Error Loading Delivery Boys
                  </h3>
                  <p className="text-sm text-red-700 mb-4">{error}</p>
                  <button
                    type="button"
                    onClick={fetchDeliveryBoys}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                  >
                    <RefreshCw size={14} className="mr-2" />
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Table Component */}
          {!error && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <Table
                columns={columns}
                data={deliveryBoys}
                totalItems={pagination.total}
                itemsPerPage={pagination.limit}
                currentPage={pagination.page}
                onPageChange={handlePageChange}
                onSearch={handleSearch}
                onFilter={handleFilter}
                loading={loading}
                emptyState={emptyState}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
export default DeliveryBoyListing;