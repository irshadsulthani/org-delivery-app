import { useState, useEffect } from "react";
import {
  Search,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Lock,
  Unlock,
  Eye,
  MapPin,
  Store,
  Clock,
  Package,
  Star,
  ShieldCheck,
  FileText,
  Check,
  X,
  AlertCircle,
  User,
  Mail,
  Phone,
  Calendar,
  ArrowUpDown,
} from "lucide-react";
import AdminSidebar from "../../components/AdminComponents/AdminSidebar";
import AdminHeader from "../../components/AdminComponents/AdminHeader";
import { toast } from "react-toastify";
import { blockRetailer, getAllRetailers, unblockRetailer, updateRetailerStatus } from "../../api/adminApi";
import { useNavigate } from "react-router-dom";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [verificationFilter, setVerificationFilter] = useState("All");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<
    Record<string, boolean>
  >({});
  const navigate = useNavigate();

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  const fetchRetailers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAllRetailers();
      setTimeout(() => {
        setRetailers(response);
        setLoading(false);
      }, 800);
    } catch (error: any) {
      const errorMessage = error.message || "Failed to fetch retailers";
      console.error("Error fetching retailers:", errorMessage);
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchRetailers();
    toast.success("Retailer data refreshed!");
  };

  const handleStatusUpdate = async (
    retailerId: string,
    newStatus: "Active" | "Blocked"
  ) => {
    try {
      setIsUpdatingStatus((prev) => ({ ...prev, [retailerId]: true }));

      await updateRetailerStatus(retailerId, newStatus);

      setRetailers((prev) =>
        prev.map((retailer) =>
          retailer._id === retailerId
            ? { ...retailer, status: newStatus }
            : retailer
        )
      );

      toast.success(
        `Retailer ${
          newStatus === "Active" ? "unblocked" : "blocked"
        } successfully`
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    } finally {
      setIsUpdatingStatus((prev) => ({ ...prev, [retailerId]: false }));
    }
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

  useEffect(() => {
    fetchRetailers();
  }, []);

  // Sort functionality
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filter retailers based on search and filters
  const filteredRetailers = retailers.filter((retailer) => {
    const matchesSearch =
      (retailer.shopName?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (retailer.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (retailer.email?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (retailer.phone?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (retailer.address.city?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (retailer.address.state?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      );

    const matchesStatus =
      statusFilter === "All" || retailer.status === statusFilter;
    const matchesVerification =
      verificationFilter === "All" ||
      (verificationFilter === "Verified" && retailer.isVerified) ||
      (verificationFilter === "Unverified" && !retailer.isVerified);

    return matchesSearch && matchesStatus && matchesVerification;
  });

  // Sort retailers
  const sortedRetailers = [...filteredRetailers].sort((a, b) => {
    let comparison = 0;

    if (sortField === "shopName") {
      const aShop = a.shopName || "";
      const bShop = b.shopName || "";
      comparison = aShop.localeCompare(bShop);
    } else if (sortField === "createdAt") {
      comparison =
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sortField === "orderCount") {
      comparison = (a.orderCount || 0) - (b.orderCount || 0);
    } else if (sortField === "rating") {
      comparison = (a.rating || 0) - (b.rating || 0);
    } else if (sortField === "totalRevenue") {
      comparison = (a.totalRevenue || 0) - (b.totalRevenue || 0);
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });

  // Pagination
  const totalPages = Math.ceil(sortedRetailers.length / ITEMS_PER_PAGE);
  const paginatedRetailers = sortedRetailers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Status badge component
  const StatusBadge = ({
    status,
  }: {
    status: "Active" | "Inactive" | "Pending" | "Blocked";
  }) => {
    let colorClasses = "";
    let Icon = Check;

    switch (status) {
      case "Active":
        colorClasses =
          "bg-emerald-100 text-emerald-800 border border-emerald-200";
        Icon = Check;
        break;
      case "Inactive":
        colorClasses = "bg-red-100 text-red-800 border border-red-200";
        Icon = X;
        break;
      case "Pending":
        colorClasses = "bg-yellow-100 text-yellow-800 border border-yellow-200";
        Icon = Clock;
        break;
      case "Blocked":
        colorClasses = "bg-gray-100 text-gray-800 border border-gray-200";
        Icon = AlertCircle;
        break;
    }

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses}`}
      >
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

    const displayRating =
      typeof rating === "number" ? rating.toFixed(1) : "N/A";
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
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => navigate("/admin/retailers/add")}
              >
                <Store size={16} className="mr-2" />
                Add Retailer
              </button>
            </div>
          </div>

          {/* Filters and Actions */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                <div className="relative w-full sm:w-72">
                  <input
                    type="text"
                    placeholder="Search shops, owners, emails..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full py-2 pl-10 pr-4 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  />
                  <Search
                    className="absolute left-3 top-2.5 text-gray-400"
                    size={18}
                  />
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
                    <option value="Blocked">Blocked</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <ChevronDown size={16} className="text-gray-500" />
                  </div>
                </div>

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
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center space-x-2">
                  <button
                    className={`p-2 rounded ${
                      viewMode === "table"
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                    onClick={() => setViewMode("table")}
                    title="Table view"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8 6H21M8 12H21M8 18H21M3 6H3.01M3 12H3.01M3 18H3.01"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    className={`p-2 rounded ${
                      viewMode === "grid"
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                    onClick={() => setViewMode("grid")}
                    title="Grid view"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 5C4 4.44772 4.44772 4 5 4H9C9.55228 4 10 4.44772 10 5V9C10 9.55228 9.55228 10 9 10H5C4.44772 10 4 9.55228 4 9V5Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14 5C14 4.44772 14.4477 4 15 4H19C19.5523 4 20 4.44772 20 5V9C20 9.55228 19.5523 10 19 10H15C14.4477 10 14 9.55228 14 9V5Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M4 15C4 14.4477 4.44772 14 5 14H9C9.55228 14 10 14.4477 10 15V19C10 19.5523 9.55228 20 9 20H5C4.44772 20 4 19.5523 4 19V15Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14 15C14 14.4477 14.4477 14 15 14H19C19.5523 14 20 14.4477 20 15V19C20 19.5523 19.5523 20 19 20H15C14.4477 20 14 19.5523 14 19V15Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>

                <button
                  className={`inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
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
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() =>
                    toast.info("Export functionality would be implemented here")
                  }
                >
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

          {/* Table View */}
          {!loading && !error && viewMode === "table" && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Shop Details
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("createdAt")}
                      >
                        <div className="flex items-center">
                          <span>Registered</span>
                          {sortField === "createdAt" ? (
                            sortDirection === "asc" ? (
                              <ChevronUp size={14} className="ml-1" />
                            ) : (
                              <ChevronDown size={14} className="ml-1" />
                            )
                          ) : (
                            <ArrowUpDown size={14} className="ml-1 opacity-0" />
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("orderCount")}
                      >
                        <div className="flex items-center">
                          <span>Orders</span>
                          {sortField === "orderCount" ? (
                            sortDirection === "asc" ? (
                              <ChevronUp size={14} className="ml-1" />
                            ) : (
                              <ChevronDown size={14} className="ml-1" />
                            )
                          ) : (
                            <ArrowUpDown size={14} className="ml-1 opacity-0" />
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Location
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("rating")}
                      >
                        <div className="flex items-center">
                          <span>Rating</span>
                          {sortField === "rating" ? (
                            sortDirection === "asc" ? (
                              <ChevronUp size={14} className="ml-1" />
                            ) : (
                              <ChevronDown size={14} className="ml-1" />
                            )
                          ) : (
                            <ArrowUpDown size={14} className="ml-1 opacity-0" />
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Verification
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedRetailers.length > 0 ? (
                      paginatedRetailers.map((retailer) => (
                        <tr key={retailer._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
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
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(retailer.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(retailer.createdAt).toLocaleTimeString(
                                [],
                                { hour: "2-digit", minute: "2-digit" }
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Package
                                size={14}
                                className="text-gray-400 mr-1"
                              />
                              <span className="text-sm text-gray-900">
                                {retailer.orderCount || 0}
                              </span>
                            </div>
                            {retailer.totalRevenue && (
                              <div className="text-xs text-gray-500 mt-1">
                                ₹{retailer.totalRevenue.toLocaleString("en-IN")}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <MapPin
                                size={14}
                                className="text-gray-400 mr-1"
                              />
                              <span className="text-sm text-gray-900">
                                {formatAddress(retailer.address)}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {retailer.phone}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <RatingDisplay rating={retailer.rating} />
                            <div className="text-xs text-gray-500 mt-1">
                              {retailer.reviews?.length || 0} reviews
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <VerificationBadge verified={retailer.isVerified} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={retailer.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
                                  toast.info(
                                    `View license for ${retailer.shopName}`
                                  )
                                }
                                title="View license"
                              >
                                <FileText size={16} />
                              </button>
                              {retailer.status === "Active" ? (
                                <button
                                  className="text-red-600 hover:text-red-900"
                                  onClick={() =>
                                    handleBlockRetailer(retailer._id)
                                  }
                                  disabled={isUpdatingStatus[retailer._id]}
                                  title="Block retailer"
                                >
                                  {isUpdatingStatus[retailer._id] ? (
                                    <RefreshCw
                                      size={16}
                                      className="animate-spin"
                                    />
                                  ) : (
                                    <Lock size={16} />
                                  )}
                                </button>
                              ) : (
                                <button
                                  className="text-emerald-600 hover:text-emerald-900"
                                  onClick={() =>
                                    handleUnblockRetailer(retailer._id)
                                  }
                                  disabled={isUpdatingStatus[retailer._id]}
                                  title="Unblock retailer"
                                >
                                  {isUpdatingStatus[retailer._id] ? (
                                    <RefreshCw
                                      size={16}
                                      className="animate-spin"
                                    />
                                  ) : (
                                    <Unlock size={16} />
                                  )}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={8}
                          className="px-6 py-4 text-center text-sm text-gray-500"
                        >
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
          {!loading && !error && viewMode === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedRetailers.length > 0 ? (
                paginatedRetailers.map((retailer) => (
                  <div
                    key={retailer._id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <RetailerAvatar retailer={retailer} />
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {retailer.shopName}
                            </h3>
                            <div className="text-xs text-gray-500 mt-1 flex items-center">
                              <User size={12} className="mr-1" />
                              {retailer.name}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <VerificationBadge verified={retailer.isVerified} />
                          <StatusBadge status={retailer.status} />
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {retailer.description || "No description provided"}
                        </p>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center">
                          <Mail size={14} className="text-gray-400 mr-2" />
                          <span className="text-gray-700 truncate">
                            {retailer.email}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Phone size={14} className="text-gray-400 mr-2" />
                          <span className="text-gray-700">
                            {retailer.phone}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <MapPin size={14} className="text-gray-400 mr-2" />
                          <span className="text-gray-700">
                            {retailer.address.city}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Calendar size={14} className="text-gray-400 mr-2" />
                          <span className="text-gray-700">
                            {new Date(retailer.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Package size={14} className="text-gray-400 mr-2" />
                          <span className="text-gray-700">
                            {retailer.orderCount || 0} orders
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Star size={14} className="text-amber-500 mr-2" />
                          <span className="text-gray-700">
                            {retailer.rating
                              ? retailer.rating.toFixed(1)
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                      <button
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
                        onClick={() => handleViewDetails(retailer._id)}
                      >
                        View details
                      </button>
                      <div className="flex items-center space-x-3">
                        <button
                          className="text-gray-500 hover:text-gray-700"
                          onClick={() =>
                            toast.info(`View license for ${retailer.shopName}`)
                          }
                          title="View license"
                        >
                          <FileText size={16} />
                        </button>
                        {retailer.status === "Active" ? (
                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() =>
                              handleStatusUpdate(retailer._id, "Blocked")
                            }
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
                            className="text-emerald-500 hover:text-emerald-700"
                            onClick={() =>
                              handleStatusUpdate(retailer._id, "Active")
                            }
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
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-500">
                    No retailers found matching your criteria
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {sortedRetailers.length > 0 && (
            <div className="mt-6 flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
              <div className="flex-1 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(
                        currentPage * ITEMS_PER_PAGE,
                        sortedRetailers.length
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">
                      {sortedRetailers.length}
                    </span>{" "}
                    retailers
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === 1
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft size={16} />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === page
                              ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === totalPages
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight size={16} />
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
