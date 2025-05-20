import { useState, useEffect } from "react";
import {
  Search,
  Download,
  RefreshCw,
  MoreHorizontal,
  ChevronDown,
  UserPlus,
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
  Bike,
  Clock,
  Briefcase,
  Users,
  Shield,
  ShieldOff,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import AdminHeader from "../../components/Admin/AdminHeader";
import { toast } from "react-toastify";
import {
  getAllDeliveryBoys,
  blockDeliveryBoy,
  unblockDeliveryBoy,
  getDeliveryBoyById,
} from "../../api/adminApi";
import { useNavigate } from "react-router-dom";

interface DeliveryPerson {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: "Active" | "Inactive" | "On Delivery" | "Off Duty";
  joinDate: string;
  deliveries: number;
  rating: number;
  lastDelivery: string;
  area: string;
  vehicleType: "Bike" | "Scooter" | "Car" | "Van";
  avatar?: string;
  isBlocked: boolean;
  isVerified: boolean;
  createdAt: string;
  userId: string;
}

const DeliveryBoyListing = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [areaFilter, setAreaFilter] = useState("All");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedPersonnel, setSelectedPersonnel] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [deliveryPersonnel, setDeliveryPersonnel] = useState<DeliveryPerson[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "verified" | "blocked">(
    "all"
  );
  const [verificationFilter, setVerificationFilter] = useState<
    "All" | "Verified" | "Unverified" | "Blocked"
  >("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const navigate = useNavigate();

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };  

  const fetchDeliveryPersonnel = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllDeliveryBoys();
      setDeliveryPersonnel(response);
      setLoading(false);
    } catch (error: any) {
      const errorMessage =
        error.message || "Failed to fetch delivery personnel";
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchDeliveryPersonnel();
    setCurrentPage(1);
    toast.success("Delivery personnel data refreshed!");
  };

  const handleBlock = async (id: string) => {
    try {
      await blockDeliveryBoy(id);
      toast.success("Delivery boy blocked successfully");
      fetchDeliveryPersonnel();
    } catch (error) {
      toast.error("Failed to block delivery boy");
    }
  };

  const handleUnblock = async (id: string) => {
    try {
      await unblockDeliveryBoy(id);
      toast.success("Delivery boy unblocked successfully");
      fetchDeliveryPersonnel();
    } catch (error) {
      toast.error("Failed to unblock delivery boy");
    }
  };

  useEffect(() => {
    fetchDeliveryPersonnel();
  }, []);

  const handleViewDetails = async (id: string) => {
    try {
      console.log('its here coming');
      
      await getDeliveryBoyById(id);
      navigate(`/admin/delivery-boy/${id}`);
    } catch (error) {
      console.error("Error fetching delivery boy details:", error);
      toast.error("Could not load delivery boy details");
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const filteredPersonnel = (deliveryPersonnel || []).filter((person) => {
    if (activeTab === "verified" && !person?.isVerified) return false;
    if (activeTab === "blocked" && !person?.isBlocked) return false;

    if (verificationFilter === "Verified" && !person?.isVerified) return false;
    if (verificationFilter === "Unverified" && person?.isVerified) return false;
    if (verificationFilter === "Blocked" && !person?.isBlocked) return false;

    const matchesSearch =
      person?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person?.phone?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || person?.status === statusFilter;
    const matchesArea = areaFilter === "All" || person?.area === areaFilter;

    return matchesSearch && matchesStatus && matchesArea;
  });

  const sortedPersonnel = [...filteredPersonnel].sort((a, b) => {
    let comparison = 0;

    if (sortField === "name") {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === "joinDate") {
      comparison =
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sortField === "deliveries") {
      comparison = a.deliveries - b.deliveries;
    } else if (sortField === "rating") {
      comparison = (a.rating || 0) - (b.rating || 0);
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });

  const areas = [
    "All",
    ...new Set(deliveryPersonnel.map((person) => person.area)),
  ];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedPersonnel.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedPersonnel.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const StatusBadge = ({
    status,
  }: {
    status: "Active" | "Inactive" | "On Delivery" | "Off Duty";
  }) => {
    let colorClasses = "";
    let Icon = CheckCircle;

    switch (status) {
      case "Active":
        colorClasses =
          "bg-emerald-100 text-emerald-800 border border-emerald-200";
        Icon = CheckCircle;
        break;
      case "Inactive":
        colorClasses = "bg-red-100 text-red-800 border border-red-200";
        Icon = XCircle;
        break;
      case "On Delivery":
        colorClasses = "bg-blue-100 text-blue-800 border border-blue-200";
        Icon = Bike;
        break;
      case "Off Duty":
        colorClasses = "bg-gray-100 text-gray-800 border border-gray-200";
        Icon = Clock;
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

  const VerificationBadge = ({ isVerified }: { isVerified: boolean }) => {
    return isVerified ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
        <ShieldCheck size={12} className="mr-1" />
        Verified
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
        <ShieldAlert size={12} className="mr-1" />
        Unverified
      </span>
    );
  };

  const BlockedBadge = ({ isBlocked }: { isBlocked: boolean }) => {
    return isBlocked ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
        <ShieldOff size={12} className="mr-1" />
        Blocked
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
        <Shield size={12} className="mr-1" />
        Active
      </span>
    );
  };

  const VehicleBadge = ({
    type,
  }: {
    type: "Bike" | "Scooter" | "Car" | "Van";
  }) => {
    let colorClasses = "";
    let Icon = Bike;

    switch (type) {
      case "Bike":
        colorClasses = "bg-indigo-100 text-indigo-800 border border-indigo-200";
        Icon = Bike;
        break;
      case "Scooter":
        colorClasses = "bg-purple-100 text-purple-800 border border-purple-200";
        Icon = Bike;
        break;
      case "Car":
        colorClasses = "bg-amber-100 text-amber-800 border border-amber-200";
        Icon = Briefcase;
        break;
      case "Van":
        colorClasses = "bg-blue-100 text-blue-800 border border-blue-200";
        Icon = Briefcase;
        break;
    }

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses}`}
      >
        <Icon size={12} className="mr-1" />
        {type}
      </span>
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const PersonnelAvatar = ({ person }: { person: DeliveryPerson }) => {
    const initials = getInitials(person.name);
    const colorIndex = parseInt(person._id.replace(/\D/g, "")) % 5;
    const bgColors = [
      "from-blue-500 to-blue-600",
      "from-purple-500 to-purple-600",
      "from-emerald-500 to-emerald-600",
      "from-amber-500 to-amber-600",
      "from-indigo-500 to-indigo-700",
    ];

    return (
      <div
        className={`w-10 h-10 rounded-full bg-gradient-to-br ${bgColors[colorIndex]} flex items-center justify-center text-white font-medium shadow-sm`}
      >
        {initials}
      </div>
    );
  };

  const RatingDisplay = ({ rating }: { rating: number | undefined }) => {
    const displayRating =
      typeof rating === "number" ? rating.toFixed(1) : "N/A";
    return <span>{displayRating}</span>;
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <div className="hidden md:block">
        <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

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

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Delivery Personnel
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Showing {currentItems.length} of {filteredPersonnel.length}{" "}
                personnel
                {activeTab !== "all" &&
                  ` (${activeTab === "verified" ? "Verified" : "Blocked"})`}
              </p>
            </div>
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => toast.info("Add Personnel form would open here")}
            >
              <UserPlus size={16} className="mr-2" />
              Add Personnel
            </button>
          </div>

          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => {
                  setActiveTab("all");
                  setCurrentPage(1);
                }}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "all"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  All Personnel
                  <span className="ml-2 bg-gray-100 text-gray-900 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {deliveryPersonnel.length}
                  </span>
                </div>
              </button>
              <button
                onClick={() => {
                  setActiveTab("verified");
                  setCurrentPage(1);
                }}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "verified"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center">
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Verified
                  <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {
                      deliveryPersonnel.filter(
                        (p) => p.isVerified && !p.isBlocked
                      ).length
                    }
                  </span>
                </div>
              </button>
              <button
                onClick={() => {
                  setActiveTab("blocked");
                  setCurrentPage(1);
                }}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "blocked"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center">
                  <ShieldOff className="mr-2 h-4 w-4" />
                  Blocked
                  <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {deliveryPersonnel.filter((p) => p.isBlocked).length}
                  </span>
                </div>
              </button>
            </nav>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                <div className="relative w-full sm:w-72">
                  <input
                    type="text"
                    placeholder="Search by name, email, phone..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
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
                    value={verificationFilter}
                    onChange={(e) => {
                      setVerificationFilter(
                        e.target.value as
                          | "All"
                          | "Verified"
                          | "Unverified"
                          | "Blocked"
                      );
                      setCurrentPage(1);
                    }}
                  >
                    <option value="All">All Verification</option>
                    <option value="Verified">Verified</option>
                    <option value="Unverified">Unverified</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <ChevronDown size={16} className="text-gray-500" />
                  </div>
                </div>

                <div className="relative w-full sm:w-44">
                  <select
                    className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg py-2 pl-4 pr-10 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer"
                    value={areaFilter}
                    onChange={(e) => {
                      setAreaFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    {areas.map((area) => (
                      <option key={area} value={area}>
                        {area === "All" ? "All Areas" : area}
                      </option>
                    ))}
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

                <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <Download size={16} className="mr-2" />
                  Export
                </button>
              </div>
            </div>

            {selectedPersonnel.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">
                      {selectedPersonnel.length} personnel
                    </span>{" "}
                    selected
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

          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          )}

          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <AlertCircle
                  className="h-5 w-5 text-red-500"
                  aria-hidden="true"
                />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error loading delivery personnel
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={fetchDeliveryPersonnel}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!loading && !error && viewMode === "table" && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Personnel
                      </th>
                      <th
                        className="px-6 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("joinDate")}
                      >
                        <div className="flex items-center">
                          <span>Join Date</span>
                          <ArrowUpDown size={14} className="ml-1" />
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("deliveries")}
                      >
                        <div className="flex items-center">
                          <span>Deliveries</span>
                          <ArrowUpDown size={14} className="ml-1" />
                        </div>
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Area
                      </th>
                      <th
                        className="px-6 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("rating")}
                      >
                        <div className="flex items-center">
                          <span>Rating</span>
                          <ArrowUpDown size={14} className="ml-1" />
                        </div>
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Vehicle
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Verification
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Account Status
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.map((person) => (
                      <tr
                        key={person._id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                        onMouseEnter={() => setHoveredRow(person._id)}
                        onMouseLeave={() => setHoveredRow(null)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <PersonnelAvatar person={person} />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {person.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {person.email}
                              </div>
                              <div className="text-xs text-gray-400 flex items-center mt-1">
                                <Phone size={12} className="mr-1" />
                                {person.phone}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 flex items-center">
                            <Calendar
                              size={14}
                              className="mr-2 text-gray-400"
                            />
                            {new Date(person.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 flex items-center">
                            <Bike size={14} className="mr-2 text-gray-400" />
                            {person.deliveries}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 flex items-center">
                            <MapPin size={14} className="mr-2 text-gray-400" />
                            {person.area}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <RatingDisplay rating={person.rating} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <VehicleBadge type={person.vehicleType} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={person.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <VerificationBadge isVerified={person.isVerified} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <BlockedBadge isBlocked={person.isBlocked} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="relative inline-block">
                            <button
                              className="text-gray-500 hover:text-gray-700 focus:outline-none rounded-lg p-1"
                              onClick={() => {
                                setSelectedPersonnel((prev) =>
                                  prev.includes(person._id)
                                    ? prev.filter((id) => id !== person._id)
                                    : [...prev, person._id]
                                );
                              }}
                            >
                              <MoreHorizontal size={16} />
                            </button>

                            {(hoveredRow === person._id ||
                              selectedPersonnel.includes(person._id)) && (
                              <div className="absolute right-0 z-10 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                                <div className="py-1">
                                  <button
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                                    onClick={() =>
                                      handleViewDetails(person.userId)
                                    }
                                  >
                                    <Eye size={16} className="mr-2" />
                                    View Details
                                  </button>
                                  {person.isBlocked ? (
                                    <button
                                      className="flex items-center px-4 py-2 text-sm text-green-700 hover:bg-green-100 w-full"
                                      onClick={() => handleUnblock(person._id)}
                                    >
                                      <Shield size={16} className="mr-2" />
                                      Unblock
                                    </button>
                                  ) : (
                                    <button
                                      className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-100 w-full"
                                      onClick={() => handleBlock(person._id)}
                                    >
                                      <ShieldOff size={16} className="mr-2" />
                                      Block
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {!loading && deliveryPersonnel.length === 0 && (
                <div className="text-center py-12">
                  <Users size={48} className="mx-auto text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    No Delivery Boys found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm ||
                    statusFilter !== "All" ||
                    areaFilter !== "All"
                      ? "Try adjusting your search or filter criteria"
                      : "No Delivery Boys available"}
                  </p>
                </div>
              )}

              {sortedPersonnel.length > itemsPerPage && (
                <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() =>
                        paginate(currentPage > 1 ? currentPage - 1 : 1)
                      }
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() =>
                        paginate(
                          currentPage < totalPages ? currentPage + 1 : totalPages
                        )
                      }
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                        <span className="font-medium">
                          {Math.min(indexOfLastItem, sortedPersonnel.length)}
                        </span>{" "}
                        of <span className="font-medium">{sortedPersonnel.length}</span> results
                      </p>
                    </div>
                    <div>
                      <nav
                        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                        aria-label="Pagination"
                      >
                        <button
                          onClick={() => paginate(1)}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">First</span>
                          <ChevronDown
                            size={16}
                            className="transform rotate-90"
                          />
                        </button>
                        <button
                          onClick={() =>
                            paginate(currentPage > 1 ? currentPage - 1 : 1)
                          }
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Previous</span>
                          <ChevronDown
                            size={16}
                            className="transform rotate-90"
                          />
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                          (page) => {
                            if (
                              page === 1 ||
                              page === totalPages ||
                              (page >= currentPage - 1 && page <= currentPage + 1)
                            ) {
                              return (
                                <button
                                  key={page}
                                  onClick={() => paginate(page)}
                                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                    currentPage === page
                                      ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                                      : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                  }`}
                                >
                                  {page}
                                </button>
                              );
                            } else if (
                              (page === currentPage - 2 && currentPage > 3) ||
                              (page === currentPage + 2 && currentPage < totalPages - 2)
                            ) {
                              return (
                                <span
                                  key={page}
                                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                                >
                                  ...
                                </span>
                              );
                            }
                            return null;
                          }
                        )}

                        <button
                          onClick={() =>
                            paginate(
                              currentPage < totalPages ? currentPage + 1 : totalPages
                            )
                          }
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Next</span>
                          <ChevronDown
                            size={16}
                            className="transform -rotate-90"
                          />
                        </button>
                        <button
                          onClick={() => paginate(totalPages)}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Last</span>
                          <ChevronDown
                            size={16}
                            className="transform -rotate-90"
                          />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {!loading && !error && viewMode === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentItems.map((person) => (
                <div
                  key={person._id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-5">
                    <div className="flex items-center">
                      <PersonnelAvatar person={person} />
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          {person.name}
                        </h3>
                        <p className="text-sm text-gray-500">{person.email}</p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone size={14} className="mr-2 text-gray-400" />
                        {person.phone}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin size={14} className="mr-2 text-gray-400" />
                        {person.area}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Bike size={14} className="mr-2 text-gray-400" />
                        {person.deliveries} deliveries
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar size={14} className="mr-2 text-gray-400" />
                        Joined{" "}
                        {new Date(person.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                        })}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <StatusBadge status={person.status} />
                      <VehicleBadge type={person.vehicleType} />
                      <VerificationBadge isVerified={person.isVerified} />
                      <BlockedBadge isBlocked={person.isBlocked} />
                    </div>
                  </div>

                  <div className="border-t border-gray-200 bg-gray-50 px-5 py-3 flex justify-between">
                    <button
                      onClick={() => handleViewDetails(person.userId)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Eye size={14} className="mr-1.5" />
                      View
                    </button>
                    {person.isBlocked ? (
                      <button
                        onClick={() => handleUnblock(person.userId)}
                        className="inline-flex items-center px-3 py-1.5 border border-green-300 shadow-sm text-sm font-medium rounded-lg text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <Shield size={14} className="mr-1.5" />
                        Unblock
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBlock(person._id)}
                        className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-sm font-medium rounded-lg text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <ShieldOff size={14} className="mr-1.5" />
                        Block
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading &&
            !error &&
            viewMode === "grid" &&
            deliveryPersonnel.length === 0 && (
              <div className="text-center py-12">
                <Users size={48} className="mx-auto text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  No Delivery Boys found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm ||
                  statusFilter !== "All" ||
                  areaFilter !== "All"
                    ? "Try adjusting your search or filter criteria"
                    : "No Delivery Boys available"}
                </p>
              </div>
            )}

          {!loading &&
            !error &&
            viewMode === "grid" &&
            sortedPersonnel.length > itemsPerPage && (
              <div className="mt-6 flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() =>
                      paginate(currentPage > 1 ? currentPage - 1 : 1)
                    }
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      paginate(
                        currentPage < totalPages ? currentPage + 1 : totalPages
                      )
                    }
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-center">
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => paginate(1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">First</span>
                      <ChevronDown size={16} className="transform rotate-90" />
                    </button>
                    <button
                      onClick={() =>
                        paginate(currentPage > 1 ? currentPage - 1 : 1)
                      }
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronDown size={16} className="transform rotate-90" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => {
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => paginate(page)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                currentPage === page
                                  ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                                  : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                              }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (
                          (page === currentPage - 2 && currentPage > 3) ||
                          (page === currentPage + 2 && currentPage < totalPages - 2)
                        ) {
                          return (
                            <span
                              key={page}
                              className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                            >
                              ...
                            </span>
                          );
                        }
                        return null;
                      }
                    )}

                    <button
                      onClick={() =>
                        paginate(
                          currentPage < totalPages ? currentPage + 1 : totalPages
                        )
                      }
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronDown size={16} className="transform -rotate-90" />
                    </button>
                    <button
                      onClick={() => paginate(totalPages)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Last</span>
                      <ChevronDown size={16} className="transform -rotate-90" />
                    </button>
                  </nav>
                </div>
              </div>
            )}
        </main>
      </div>
    </div>
  );
};

export default DeliveryBoyListing;