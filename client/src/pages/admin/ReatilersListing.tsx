import { useState, useEffect } from "react";
import {
  Download,
  RefreshCw,
  Lock,
  Unlock,
  Eye,
  MapPin,
  Store,
  Package,
  Star,
  ShieldCheck,
  FileText,
  Check,
  X,
  AlertCircle,
  User,
  Phone,
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
      await blockRetailer(retailerId);
      toast.success("Retailer blocked successfully");
      fetchRetailers();
    } catch (error) {
      console.error("Error blocking retailer:", error);
      toast.error("Failed to block retailer");
    } finally {
      setIsUpdatingStatus(prev => ({ ...prev, [retailerId]: false }));
    }
  };

  const handleUnblockRetailer = async (retailerId: string) => {
    try {
      setIsUpdatingStatus(prev => ({ ...prev, [retailerId]: true }));
      await unblockRetailer(retailerId);
      toast.success("Retailer unblocked successfully");
      fetchRetailers();
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

  // Apply filters and search - now handled by API
  const handleSearch = (searchQuery: string) => {
    setSearchTerm(searchQuery);
    setCurrentPage(1); // Reset to first page
  };

  const handleFilter = (filterOptions: Record<string, any>) => {
    setFilters(filterOptions);
    setCurrentPage(1); // Reset to first page
  };

  const handleSort = (field: string, direction: "asc" | "desc") => {
    setSortField(field);
    setSortDirection(direction);
    setCurrentPage(1); // Reset to first page
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Fetch data when dependencies change
  useEffect(() => {
    fetchRetailers();
  }, [currentPage, searchTerm, filters, sortField, sortDirection]);

  // Status badge component
  const StatusBadge = ({ status }: { status: "Active" | "Inactive" | "Pending" | "Blocked" }) => {
    let colorClasses = "";
    let Icon = Check;

    switch (status) {
      case "Active":
        colorClasses = "bg-emerald-100 text-emerald-800 border border-emerald-200";
        Icon = Check;
        break;
      case "Inactive":
        colorClasses = "bg-red-100 text-red-800 border border-red-200";
        Icon = X;
        break;
      case "Pending":
        colorClasses = "bg-yellow-100 text-yellow-800 border border-yellow-200";
        Icon = AlertCircle;
        break;
      case "Blocked":
        colorClasses = "bg-gray-100 text-gray-800 border border-gray-200";
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

  // Verification badge component
  const VerificationBadge = ({ verified }: { verified: boolean }) => {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          verified
            ? "bg-blue-100 text-blue-800 border border-blue-200"
            : "bg-gray-100 text-gray-800 border border-gray-200"
        }`}
      >
        <ShieldCheck size={12} className="mr-1" />
        {verified ? "Verified" : "Unverified"}
      </span>
    );
  };

  // Generate avatar placeholder or use shop image
  const RetailerAvatar = ({ retailer }: { retailer: Retailer }) => {
    if (retailer.shopImageUrl) {
      return (
        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
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
    const bgColors = [
      "bg-blue-500",
      "bg-purple-500",
      "bg-emerald-500",
      "bg-amber-500",
      "bg-indigo-500",
    ];

    return (
      <div
        className={`w-10 h-10 rounded-full ${bgColors[colorIndex]} flex items-center justify-center text-white font-medium shadow-sm`}
      >
        {initials}
      </div>
    );
  };

  // Rating component
  const RatingDisplay = ({ rating }: { rating: number | undefined }) => {
    if (!rating) return <span className="text-gray-400">N/A</span>;

    const displayRating = typeof rating === "number" ? rating.toFixed(1) : "N/A";
    return (
      <div className="flex items-center">
        <Star size={14} className="text-amber-500 mr-1" />
        <span>{displayRating}</span>
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
            <div className="text-sm font-medium text-gray-900">
              {retailer.shopName}
            </div>
            <div className="text-xs text-gray-500 flex items-center mt-1">
              <User size={12} className="mr-1" />
              {retailer.name}
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
        <div>
          <div className="text-sm text-gray-900">
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
      ),
    },
    {
      header: "Orders",
      accessor: "orderCount",
      sortable: true,
      render: (retailer: Retailer) => (
        <div>
          <div className="flex items-center">
            <Package size={14} className="text-gray-400 mr-1" />
            <span className="text-sm text-gray-900">
              {retailer.orderCount || 0}
            </span>
          </div>
          {retailer.totalRevenue && (
            <div className="text-xs text-gray-500 mt-1">
              ₹{retailer.totalRevenue.toLocaleString("en-IN")}
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Location",
      accessor: "city",
      filterable: true,
      render: (retailer: Retailer) => (
        <div>
          <div className="flex items-center">
            <MapPin size={14} className="text-gray-400 mr-1" />
            <span className="text-sm text-gray-900">
              {formatAddress(retailer.address)}
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-1 flex items-center">
            <Phone size={12} className="mr-1" />
            {retailer.phone}
          </div>
        </div>
      ),
    },
    {
      header: "Rating",
      accessor: "rating",
      sortable: true,
      render: (retailer: Retailer) => (
        <div>
          <RatingDisplay rating={retailer.rating} />
          <div className="text-xs text-gray-500 mt-1">
            {retailer.reviews?.length || 0} reviews
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
        { label: "active", value: "Active" },
        { label: "Pending", value: "Pending" },
        { label: "Blocked", value: "Blocked" },
      ],
      render: (retailer: Retailer) => <StatusBadge status={retailer.status} />,
    },
    {
      header: "Actions",
      accessor: "actions",
      render: (retailer: Retailer) => (
        <div className="flex items-center justify-end space-x-3">
          <button
            className="text-indigo-600 hover:text-indigo-900"
            onClick={() => handleViewDetails(retailer._id)}
            title="View details"
          >
            <Eye size={16} />
          </button>
          <button
            className="text-gray-600 hover:text-gray-900"
            onClick={() =>
              toast.info(`View license for ${retailer.shopName}`)
            }
            title="View license"
          >
            <FileText size={16} />
          </button>
          {retailer.status === "Active" ? (
            <button
              className="text-red-600 hover:text-red-900"
              onClick={() => handleBlockRetailer(retailer._id)}
              disabled={isUpdatingStatus[retailer._id]}
              title="Block retailer"
            >
              {isUpdatingStatus[retailer._id] ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <Lock size={16} />
              )}
            </button>
          ) : (
            <button
              className="text-emerald-600 hover:text-emerald-900"
              onClick={() => handleUnblockRetailer(retailer._id)}
              disabled={isUpdatingStatus[retailer._id]}
              title="Unblock retailer"
            >
              {isUpdatingStatus[retailer._id] ? (
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
      <Store className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">No retailers found</h3>
      <p className="mt-1 text-sm text-gray-500">
        Try adjusting your search or filter criteria
      </p>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
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
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Retailer Management
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Manage all registered retailer shops
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                className={`inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  loading ? "opacity-80" : ""
                }`}
                onClick={refreshData}
                disabled={loading}
              >
                <RefreshCw
                  size={16}
                  className={`mr-2 ${loading ? "animate-spin" : ""}`}
                />
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
                onClick={() => navigate("/admin/retailers/add")}
              >
                <Store size={16} className="mr-2" />
                Add Retailer
              </button>
            </div>
          </div>

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <AlertCircle
                  className="h-5 w-5 text-red-500"
                  aria-hidden="true"
                />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error loading retailers
                  </h3>
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

          {/* Table Component */}
          {!error && (
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
          )}
        </main>
      </div>
    </div>
  );
};


export default RetailerListing;