import { useState, useEffect } from "react";
import {
  RefreshCw,
  Lock,
  Unlock,
  Eye,
  MapPin,
  Store,
  Package,
  Star,
  ShieldCheck,
  ShieldX,
  FileText,
  Check,
  X,
  AlertCircle,
  User,
  Phone,
  Calendar,
  DollarSign,
  Mail
} from "lucide-react";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import AdminHeader from "../../components/Admin/AdminHeader";
import { toast } from "react-toastify";
import { blockRetailer, getAllRetailers, unblockRetailer } from "../../api/adminApi";
import { useNavigate } from "react-router-dom";
import { Table } from "../../components/Admin/Table";

// TypeScript interfaces
interface Review {
  customerId: string;
  rating: number;
  comment?: string;
  date: Date;
}

interface Address {
  street: string;
  area: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface Retailer {
  _id: string;
  userId: string;
  shopName: string;
  name: string;
  email: string;
  phone: string;
  description?: string;
  shopImageUrl: string;
  shopLicenseUrl: string;
  address: Address;
  rating: number;
  reviews: Review[];
  isVerified: boolean;
  createdAt: string | Date;
  updatedAt?: string | Date;
  status: "Active" | "Inactive" | "Pending" | "Blocked";
  lastOrderDate?: Date;
  orderCount: number;
  totalRevenue?: number;
  balance?: number;
}

const ITEMS_PER_PAGE = 10;

const RetailerListing = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [totalRetailers, setTotalRetailers] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  const fetchRetailers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getAllRetailers({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: searchTerm,
        filters: filters,
        sortField: sortField,
        sortDirection: sortDirection,
      });
      
      if (response.success) {
        setRetailers(response.data);
        setTotalRetailers(response.total);
      } else {
        throw new Error(response.message || 'Failed to fetch retailers');
      }
    } catch (error: any) {
      const errorMessage = error.message || "Failed to fetch retailers";
      console.error("Error fetching retailers:", errorMessage);
      setError(errorMessage);
      toast.error(errorMessage);
      setRetailers([]);
      setTotalRetailers(0);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchRetailers();
    toast.success("Retailer data refreshed!");
  };

const handleBlockRetailer = async (retailerId: string) => {
  try {
    setIsUpdatingStatus(prev => ({ ...prev, [retailerId]: true }));
    
    // Call API to block retailer
    await blockRetailer(retailerId);
    
    // Update local state instead of refetching all data
    setRetailers(prevRetailers => 
      prevRetailers.map(retailer => 
        retailer._id === retailerId 
          ? { ...retailer, status: "Blocked" as const }
          : retailer
      )
    );
    
    toast.success("Retailer blocked successfully");
  } catch (error) {
    console.error("Error blocking retailer:", error);
    toast.error("Failed to block retailer");
  } finally {
    setIsUpdatingStatus(prev => ({ ...prev, [retailerId]: false }));
  }
};

// Optimized handleUnblockRetailer function
const handleUnblockRetailer = async (retailerId: string) => {
  try {
    setIsUpdatingStatus(prev => ({ ...prev, [retailerId]: true }));
    
    // Call API to unblock retailer
    await unblockRetailer(retailerId);
    
    // Update local state instead of refetching all data
    setRetailers(prevRetailers => 
      prevRetailers.map(retailer => 
        retailer._id === retailerId 
          ? { ...retailer, status: "Active" as const }
          : retailer
      )
    );
    
    toast.success("Retailer unblocked successfully");
  } catch (error) {
    console.error("Error unblocking retailer:", error);
    toast.error("Failed to unblock retailer");
  } finally {
    setIsUpdatingStatus(prev => ({ ...prev, [retailerId]: false }));
  }
};


  const handleViewDetails = (retailerId: string) => {
    navigate(`/admin/retailer/${retailerId}`);
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
    fetchRetailers();
  }, [currentPage, searchTerm, filters, sortField, sortDirection]);

  // Enhanced Status badge component
  const StatusBadge = ({ status }: { status: "Active" | "Inactive" | "Pending" | "Blocked" }) => {
    const statusConfig = {
      Active: {
        gradient: "bg-gradient-to-r from-emerald-500 to-emerald-600",
        icon: Check,
        text: "Active"
      },
      Inactive: {
        gradient: "bg-gradient-to-r from-red-500 to-red-600",
        icon: X,
        text: "Inactive"
      },
      Pending: {
        gradient: "bg-gradient-to-r from-amber-500 to-orange-500",
        icon: AlertCircle,
        text: "Pending"
      },
      Blocked: {
        gradient: "bg-gradient-to-r from-gray-500 to-gray-600",
        icon: AlertCircle,
        text: "Blocked"
      }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-sm ${config.gradient}`}>
        <Icon size={12} className="mr-1.5" />
        {config.text}
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
        Unverified
      </div>
    );
  };

  // Enhanced Retailer avatar component
  const RetailerAvatar = ({ retailer }: { retailer: Retailer }) => {
    if (retailer.shopImageUrl) {
      return (
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden border-2 border-white shadow-lg">
          <img
            src={retailer.shopImageUrl}
            alt={retailer.shopName}
            className="w-full h-full object-cover"
          />
        </div>
      );
    }

    const initials = retailer?.shopName
      ? retailer.shopName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .substring(0, 2)
      : "NA";

    const colorIndex = parseInt(retailer._id.replace(/\D/g, "")) % 5;
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
    variant: 'view' | 'license' | 'block' | 'unblock';
    icon: any;
    title: string;
  }) => {
    const variants = {
      view: "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white",
      license: "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white",
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
  const RatingDisplay = ({ rating, reviewCount }: { rating: number | undefined; reviewCount: number }) => {
    if (!rating) {
      return (
        <div className="flex items-center">
          <div className="p-2 bg-gray-100 rounded-lg mr-2">
            <Star size={14} className="text-gray-400" />
          </div>
          <div>
            <span className="text-sm text-gray-400 font-medium">No Rating</span>
            <div className="text-xs text-gray-400">No reviews</div>
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
          <div className="text-xs text-gray-500">{reviewCount} reviews</div>
        </div>
      </div>
    );
  };

  // Format address for display
  const formatAddress = (address: Address) => {
    return `${address.city}, ${address.state}`;
  };

  // Get paginated data - now handled by API
  const paginatedRetailers = retailers;

  // Table columns configuration
  const columns = [
    {
      header: "Shop Details",
      accessor: "shopName",
      sortable: true,
      render: (retailer: Retailer) => (
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <RetailerAvatar retailer={retailer} />
          </div>
          <div className="ml-4">
            <div className="text-sm font-semibold text-gray-900">
              {retailer.shopName}
            </div>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <User size={12} className="mr-1" />
              {retailer.name}
            </div>
            <div className="flex items-center text-xs text-gray-400 mt-1">
              <Mail size={10} className="mr-1" />
              {retailer.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Registered",
      accessor: "createdAt",
      sortable: true,
      render: (retailer: Retailer) => (
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg mr-2">
            <Calendar size={14} className="text-blue-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">
              {new Date(retailer.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
            <div className="text-xs text-gray-500">
              {new Date(retailer.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Orders & Revenue",
      accessor: "orderCount",
      sortable: true,
      render: (retailer: Retailer) => (
        <div className="flex items-center">
          <div className="p-2 bg-purple-100 rounded-lg mr-2">
            <Package size={14} className="text-purple-600" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">
              {retailer.orderCount || 0} orders
            </div>
            {retailer.totalRevenue && (
              <div className="text-xs text-green-600 font-medium flex items-center">
                <DollarSign size={10} className="mr-1" />
                ₹{retailer.totalRevenue.toLocaleString("en-IN")}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      header: "Location & Contact",
      accessor: "city",
      filterable: true,
      render: (retailer: Retailer) => (
        <div className="flex items-center">
          <div className="p-2 bg-green-100 rounded-lg mr-2">
            <MapPin size={14} className="text-green-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">
              {formatAddress(retailer.address)}
            </div>
            <div className="text-xs text-gray-500 flex items-center mt-1">
              <Phone size={10} className="mr-1" />
              {retailer.phone}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Rating & Reviews",
      accessor: "rating",
      sortable: true,
      render: (retailer: Retailer) => (
        <RatingDisplay rating={retailer.rating} reviewCount={retailer.reviews?.length || 0} />
      ),
    },
    {
      header: "Verification",
      accessor: "isVerified",
      filterable: true,
      filterOptions: [
        { label: "All Verification", value: "" },
        { label: "Verified", value: "Verified" },
        { label: "Unverified", value: "Unverified" },
      ],
      render: (retailer: Retailer) => (
        <VerificationBadge verified={retailer.isVerified} />
      ),
    },
    {
      header: "Status",
      accessor: "status",
      filterable: true,
      filterOptions: [
        { label: "All Status", value: "" },
        { label: "Active", value: "Active" },
        { label: "Pending", value: "Pending" },
        { label: "Blocked", value: "Blocked" },
      ],
      render: (retailer: Retailer) => <StatusBadge status={retailer.status} />,
    },
    {
      header: "Actions",
      accessor: "actions",
      render: (retailer: Retailer) => (
        <div className="flex items-center justify-end space-x-2">
          <ActionButton
            onClick={() => handleViewDetails(retailer._id)}
            variant="view"
            icon={Eye}
            title="View retailer details"
          />
          <ActionButton
            onClick={() => toast.info(`View license for ${retailer.shopName}`)}
            variant="license"
            icon={FileText}
            title="View license document"
          />
          {retailer.status === "Active" ? (
            <ActionButton
              onClick={() => handleBlockRetailer(retailer._id)}
              disabled={isUpdatingStatus[retailer._id]}
              isLoading={isUpdatingStatus[retailer._id]}
              variant="block"
              icon={Lock}
              title="Block retailer"
            />
          ) : (
            <ActionButton
              onClick={() => handleUnblockRetailer(retailer._id)}
              disabled={isUpdatingStatus[retailer._id]}
              isLoading={isUpdatingStatus[retailer._id]}
              variant="unblock"
              icon={Unlock}
              title="Unblock retailer"
            />
          )}
        </div>
      ),
    },
  ];

  const emptyState = (
    <div className="text-center py-16">
      <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
        <Store className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No retailers found</h3>
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

        {/* Retailer Listing Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Enhanced Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Retailer Management
              </h2>
              <p className="text-gray-500 text-sm mt-2">
                Manage and monitor all registered retailer shops with advanced controls
              </p>
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
                    Error Loading Retailers
                  </h3>
                  <p className="text-sm text-red-700 mb-4">{error}</p>
                  <button
                    type="button"
                    onClick={fetchRetailers}
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
                data={paginatedRetailers}
                totalItems={totalRetailers}
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
          )}
        </main>
      </div>
    </div>
  );
};

export default RetailerListing;