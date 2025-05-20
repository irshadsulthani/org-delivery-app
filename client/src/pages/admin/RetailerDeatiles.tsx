import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  Mail,
  Building,
  FileText,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  CheckCircle2,
  ClipboardCheck,
  Store,  
  ShieldCheck,
  MessageCircle,
  FileImage,
  File,
  AlertCircle,
  MapPin,
  Calendar,
  ShoppingCart,
  Lock,
  Unlock,
} from "lucide-react";
import {
  getRetailerById,
  blockRetailer,
  unblockRetailer,
  approveRetailer,
  rejectRetailer,
} from "../../api/adminApi";
import AdminHeader from "../../components/Admin/AdminHeader";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import { toast } from "react-toastify";

// Skeleton loader component
const SkeletonLoader = () => (
  <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 animate-pulse">
    <div className="h-10 bg-gray-200 rounded-md mb-6 w-36"></div>
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <div className="bg-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center">
          <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
            <div className="w-24 h-24 rounded-full bg-gray-300"></div>
          </div>
          <div className="flex-1">
            <div className="h-7 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <div className="h-5 bg-gray-300 rounded w-1/4"></div>
              <div className="h-5 bg-gray-300 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 border-t border-b border-gray-200">
        {[1, 2, 3].map((idx) => (
          <div key={idx} className="p-4 border-r border-gray-200">
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
            <div className="h-6 bg-gray-300 rounded w-1/3"></div>
          </div>
        ))}
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((idx) => (
            <div key={idx} className="h-64 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

function RetailerDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  interface RetailerShop {
    verificationStatus: string;
    _id: string;
    userId: {
      _id: string;
      name: string;
      email: string;
      isBlocked: boolean;
    };
    shopName: string;
    description: string;
    phone: string;
    shopImageUrl: string;
    shopLicenseUrl: string;
    address: {
      street: string;
      area: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    rating: number;
    reviews: {
      customerId: string;
      rating: number;
      comment: string;
      date: string;
    }[];
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
    status: "Active" | "Inactive" | "pending" | "Suspended";
  }

  const [retailer, setRetailer] = useState<RetailerShop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingAction, setProcessingAction] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("shop");
  const [licenseImageError, setLicenseImageError] = useState(false);

  const fetchRetailerData = async () => {
    if (!id) return;
    try {
      const data = await getRetailerById(id);
      console.log(data._id);
      
      setRetailer(data);
    } catch (err) {
      console.error("Error fetching retailer:", err);
      toast.error("Failed to fetch retailer data");
    }
  };

  const handleApprove = async (_id: string) => {
    if (!_id) return;
    try {
      setProcessingAction(true);
      await approveRetailer(_id);
      await fetchRetailerData();
      toast.success("Retailer approved successfully");
    } catch (error) {
      console.error("Error approving retailer:", error);
      toast.error("Failed to approve retailer");
    } finally {
      setProcessingAction(false);
    }
  };

  const handleReject = async (_id:string) => {
    if (!_id) return;
    try {
      setProcessingAction(true);
      await rejectRetailer(_id);
      await fetchRetailerData();
      toast.success("Retailer rejected successfully");
    } catch (error) {
      console.error("Error rejecting retailer:", error);
      toast.error("Failed to reject retailer");
    } finally {
      setProcessingAction(false);
    }
  };

  const handleBlockRetailer = async (_id: string) => {
    if (!_id) return;
    console.log('id hered ',_id);
    
    try {
      setProcessingAction(true);
      await blockRetailer(_id);
      await fetchRetailerData();
      toast.success("Retailer blocked successfully");
    } catch (err) {
      console.error("Error blocking retailer:", err);
      toast.error("Failed to block retailer");
    } finally {
      setProcessingAction(false);
    }
  };

  const handleUnblockRetailer = async (_id: string) => {
    if (!_id) return;
    console.log('its here in unblock', id);
    
    try {
      setProcessingAction(true);
      await unblockRetailer(_id);
      await fetchRetailerData();
      toast.success("Retailer unblocked successfully");
    } catch (err) {
      console.error("Error unblocking retailer:", err);
      toast.error("Failed to unblock retailer");
    } finally {
      setProcessingAction(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        await fetchRetailerData();
        setError(null);
      } catch (err) {
        console.error("Error fetching retailer details:", err);
        setError("Failed to load retailer details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const getStatusBadge = () => {
    if (!retailer) return null;
    
    if (retailer.isVerified) {
      return (
        <span className="flex items-center text-green-700 bg-green-100 px-3 py-1 rounded-full text-sm font-medium">
          <CheckCircle size={16} className="mr-1" />
          Verified
        </span>
      );
    } else if (retailer.verificationStatus === "pending") {
      return (
        <span className="flex items-center text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full text-sm font-medium">
          <Clock size={16} className="mr-1" />
          Pending Approval
        </span>
      );
    } else if (retailer.userId.isBlocked) {
      return (
        <span className="flex items-center text-red-700 bg-red-100 px-3 py-1 rounded-full text-sm font-medium">
          <XCircle size={16} className="mr-1" />
          Blocked
        </span>
      );
    }
    return null;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTotalReviews = () => {
    return retailer?.reviews?.length || 0;
  };

  const getAverageRating = () => {
    if (!retailer?.reviews || retailer.reviews.length === 0) return "0.0";
    const totalRating = retailer.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    return (totalRating / retailer.reviews.length).toFixed(1);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <div className="hidden md:block">
          <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        </div>
        <div className="flex-1">
          <AdminHeader
            toggleMobileSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
          />
          <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <XCircle size={48} className="mx-auto text-red-500 mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {error}
              </h2>
              <p className="text-gray-600 mb-6">
                We couldn't find the retailer details you're looking for.
              </p>
              <button
                onClick={() => navigate("/admin/retailers")}
                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Go Back to List
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <div className="hidden md:block">
          <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        </div>
        <div className="flex-1">
          <AdminHeader
            toggleMobileSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
          />
          <SkeletonLoader />
        </div>
      </div>
    );
  }

  if (!retailer) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <div className="hidden md:block">
          <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        </div>
        <div className="flex-1">
          <AdminHeader
            toggleMobileSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
          />
          <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <XCircle size={48} className="mx-auto text-red-500 mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Retailer not found
              </h2>
              <p className="text-gray-600 mb-6">
                We couldn't find the retailer details you're looking for.
              </p>
              <button
                onClick={() => navigate("/admin/retailers")}
                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Go Back to List
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="hidden md:block">
        <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>
      <div className="flex-1">
        <AdminHeader
          toggleMobileSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />

        {isSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50">
            <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl transition-transform">
              <AdminSidebar collapsed={false} setCollapsed={() => {}} />
              <button
                onClick={toggleSidebar}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <XCircle size={24} />
              </button>
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <button
              onClick={() => navigate("/admin/retailers")}
              className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors font-medium"
            >
              <ArrowLeft size={18} className="mr-1" />
              Back to Retailers
            </button>

            {/* Admin Actions Section */}
            <div className="flex flex-wrap gap-3">
              {/* Verification Actions - Only show for pending retailers */}
              {!retailer.isVerified && retailer.verificationStatus === "pending" && (
                <div className="flex gap-3">
                  <button
                    onClick={()=>handleApprove(retailer._id)}
                    disabled={processingAction}
                    className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm transition-colors flex items-center justify-center min-w-28 ${
                      processingAction ? "opacity-70 cursor-not-allowed" : ""
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                  >
                    {processingAction ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    ) : (
                      <CheckCircle size={18} className="mr-2" />
                    )}
                    Approve
                  </button>
                  <button
                    onClick={()=> handleReject(retailer._id) }
                    disabled={processingAction}
                    className={`bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md shadow-sm transition-colors flex items-center justify-center min-w-28 ${
                      processingAction ? "opacity-70 cursor-not-allowed" : ""
                    } focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2`}
                  >
                    {processingAction ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    ) : (
                      <XCircle size={18} className="mr-2" />
                    )}
                    Reject
                  </button>
                </div>
              )}

              {/* Block/Unblock Actions - Only show for verified retailers */}
              {retailer.isVerified && (
                <div className="flex gap-3">
                  {retailer.userId.isBlocked ? (
                    <button
                      onClick={()=>handleUnblockRetailer(retailer.userId._id)}
                      disabled={processingAction}
                      className={`bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md shadow-sm transition-colors flex items-center justify-center min-w-28 ${
                        processingAction ? "opacity-70 cursor-not-allowed" : ""
                      } focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
                    >
                      {processingAction ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      ) : (
                        <Unlock size={18} className="mr-2" />
                      )}
                      Unblock
                    </button>
                  ) : (
                    <button
                      onClick={()=> handleBlockRetailer(retailer.userId._id)}
                      disabled={processingAction}
                      className={`bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow-sm transition-colors flex items-center justify-center min-w-28 ${
                        processingAction ? "opacity-70 cursor-not-allowed" : ""
                      } focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2`}
                    >
                      {processingAction ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      ) : (
                        <Lock size={18} className="mr-2" />
                      )}
                      Block
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Main profile card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 border border-gray-200">
            {/* Hero section with profile info */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                  {retailer.shopImageUrl ? (
                    <img
                      src={retailer.shopImageUrl}
                      alt={retailer.shopName}
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/100";
                      }}
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center border-4 border-white shadow-lg">
                      <Store size={36} className="text-blue-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                    <h1 className="text-2xl font-bold text-white">
                      {retailer.shopName}
                    </h1>
                    {getStatusBadge()}
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-blue-100">
                    <div className="flex items-center">
                      <User size={16} className="mr-1" />
                      <span>{retailer.userId.name}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone size={16} className="mr-1" />
                      <span>{retailer.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail size={16} className="mr-1" />
                      <span>{retailer.userId.email}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        retailer.isVerified
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {retailer.isVerified
                        ? "Verified Shop"
                        : "Pending Verification"}
                    </span>

                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-blue-800">
                      <MapPin className="mr-1" size={12} />
                      {retailer.address.city}, {retailer.address.state}
                    </span>

                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-blue-800">
                      <Calendar className="mr-1" size={12} />
                      Joined {formatDate(retailer.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 border-b border-gray-200 bg-white">
              <div className="p-5 border-r border-gray-200 flex flex-col items-center justify-center">
                <div className="flex items-center justify-center mb-2 h-10 w-10 rounded-full bg-blue-100">
                  <Star size={20} className="text-yellow-500" />
                </div>
                <p className="text-sm text-gray-500 text-center">Rating</p>
                <div className="flex items-center">
                  <p className="text-2xl font-bold text-gray-800">
                    {getAverageRating()}
                  </p>
                  <span className="ml-1 text-sm font-normal text-gray-500">
                    ({getTotalReviews()})
                  </span>
                </div>
              </div>
              <div className="p-5 border-r border-gray-200 flex flex-col items-center justify-center">
                <div className="flex items-center justify-center mb-2 h-10 w-10 rounded-full bg-blue-100">
                  <ShieldCheck
                    size={20}
                    className={
                      retailer.userId.isBlocked
                        ? "text-red-600"
                        : "text-green-600"
                    }
                  />
                </div>
                <p className="text-sm text-gray-500 text-center">Status</p>
                <p
                  className={`text-xl font-bold ${
                    retailer.userId.isBlocked
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {retailer.userId.isBlocked ? "Blocked" : "Active"}
                </p>
              </div>
              <div className="p-5 flex flex-col items-center justify-center">
                <div className="flex items-center justify-center mb-2 h-10 w-10 rounded-full bg-blue-100">
                  <ShoppingCart size={20} className="text-blue-600" />
                </div>
                <p className="text-sm text-gray-500 text-center">Products</p>
                <p className="text-2xl font-bold text-gray-800">
                  {/* Placeholder for product count */}
                  24
                </p>
              </div>
            </div>

            {/* Tab navigation */}
            <div className="px-6 pt-4 border-b border-gray-200">
              <div className="flex overflow-x-auto space-x-4 scrollbar-hide">
                <button
                  onClick={() => setActiveTab("shop")}
                  className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${
                    activeTab === "shop"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Shop Details
                </button>
                <button
                  onClick={() => setActiveTab("address")}
                  className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${
                    activeTab === "address"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Address
                </button>
                <button
                  onClick={() => setActiveTab("documents")}
                  className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${
                    activeTab === "documents"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Documents
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${
                    activeTab === "reviews"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Reviews
                </button>
              </div>
            </div>

            {/* Tab content */}
            <div className="p-6">
              {activeTab === "shop" && (
                <div className="bg-white rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <Store size={20} className="mr-3 text-blue-600 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Shop Name
                          </p>
                          <p className="font-medium text-gray-900">
                            {retailer.shopName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <User size={20} className="mr-3 text-blue-600 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Owner Name
                          </p>
                          <p className="font-medium text-gray-900">
                            {retailer.userId.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Phone size={20} className="mr-3 text-blue-600 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Contact Number
                          </p>
                          <p className="font-medium text-gray-900">
                            {retailer.phone}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <Mail size={20} className="mr-3 text-blue-600 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Email Address
                          </p>
                          <p className="font-medium text-gray-900">
                            {retailer.userId.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Calendar
                          size={20}
                          className="mr-3 text-blue-600 mt-1"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Account Created
                          </p>
                          <p className="font-medium text-gray-900">
                            {formatDate(retailer.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle2
                          size={20}
                          className="mr-3 text-blue-600 mt-1"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Verification Status
                          </p>
                          <p
                            className={`font-medium ${
                              retailer.verificationStatus === "verified"
                                ? "text-green-600"
                                : retailer.verificationStatus === "approved"
                                ? "text-blue-600"
                                : retailer.verificationStatus === "rejected"
                                ? "text-red-600"
                                : "text-yellow-600"
                            }`}
                          >
                            {retailer.verificationStatus === "pending"
                              ? "Pending Verification"
                              : retailer.verificationStatus === "approved"
                              ? "Approved"
                              : retailer.verificationStatus === "rejected"
                              ? "Rejected"
                              : "Verified"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shop description */}
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Shop Description
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-gray-700">
                        {retailer.description || "No description provided"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "address" && (
                <div className="bg-white rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <Building
                          size={20}
                          className="mr-3 text-blue-600 mt-1"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Street
                          </p>
                          <p className="font-medium text-gray-900">
                            {retailer.address.street || "Not provided"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <MapPin size={20} className="mr-3 text-blue-600 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Area
                          </p>
                          <p className="font-medium text-gray-900">
                            {retailer.address.area || "Not provided"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <MapPin size={20} className="mr-3 text-blue-600 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            City
                          </p>
                          <p className="font-medium text-gray-900">
                            {retailer.address.city || "Not provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <MapPin size={20} className="mr-3 text-blue-600 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            State
                          </p>
                          <p className="font-medium text-gray-900">
                            {retailer.address.state || "Not provided"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <FileText
                          size={20}
                          className="mr-3 text-blue-600 mt-1"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Zip Code
                          </p>
                          <p className="font-medium text-gray-900">
                            {retailer.address.zipCode || "Not provided"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <MapPin size={20} className="mr-3 text-blue-600 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Country
                          </p>
                          <p className="font-medium text-gray-900">
                            {retailer.address.country || "Not provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "documents" && (
                <div className="bg-white rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Shop Image */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <h3 className="font-medium text-gray-700 flex items-center">
                          <Store size={18} className="mr-2 text-blue-600" />
                          Shop Image
                        </h3>
                      </div>
                      <div className="p-4">
                        {retailer.shopImageUrl ? (
                          <div className="flex flex-col items-center">
                            <div className="w-full h-64 bg-gray-100 rounded-md overflow-hidden mb-3">
                              <img
                                src={retailer.shopImageUrl}
                                alt="Shop"
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    "https://via.placeholder.com/400";
                                }}
                              />
                            </div>
                            <a
                              href={retailer.shopImageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                            >
                              <FileImage size={16} className="mr-1" />
                              View Full Image
                            </a>
                          </div>
                        ) : (
                          <div className="text-center py-8 bg-gray-50 rounded-md">
                            <FileImage
                              size={24}
                              className="mx-auto text-gray-400 mb-2"
                            />
                            <p className="text-gray-500">
                              No shop image uploaded
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Shop License */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <h3 className="font-medium text-gray-700 flex items-center">
                          <ClipboardCheck
                            size={18}
                            className="mr-2 text-blue-600"
                          />
                          Shop License
                        </h3>
                      </div>
                      <div className="p-4">
                        {retailer.shopLicenseUrl ? (
                          <div className="flex flex-col items-center">
                            <div className="w-full h-64 bg-gray-100 rounded-md overflow-hidden mb-3 flex items-center justify-center">
                              {licenseImageError ? (
                                <div className="text-center p-4">
                                  <AlertCircle
                                    size={24}
                                    className="mx-auto text-yellow-500 mb-2"
                                  />
                                  <p className="text-gray-500">
                                    Could not display license document
                                  </p>
                                  <a
                                    href={retailer.shopLicenseUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2 inline-block"
                                  >
                                    View Document
                                  </a>
                                </div>
                              ) : (
                                <img
                                  src={retailer.shopLicenseUrl}
                                  alt="Shop License"
                                  className="w-full h-full object-contain"
                                  onError={() => setLicenseImageError(true)}
                                />
                              )}
                            </div>
                            <a
                              href={retailer.shopLicenseUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                            >
                              <File size={16} className="mr-1" />
                              View License Document
                            </a>
                          </div>
                        ) : (
                          <div className="text-center py-8 bg-gray-50 rounded-md">
                            <AlertCircle
                              size={24}
                              className="mx-auto text-yellow-500 mb-2"
                            />
                            <p className="text-gray-500">
                              No license document uploaded
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="bg-white rounded-lg">
                  {retailer.reviews && retailer.reviews.length > 0 ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">
                          Customer Reviews ({retailer.reviews.length})
                        </h3>
                        <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                          <Star size={16} className="text-yellow-500 mr-1" />
                          <span className="font-medium text-gray-800">
                            {getAverageRating()} out of 5
                          </span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {retailer.reviews.map((review, index) => (
                          <div
                            key={index}
                            className="border-b border-gray-200 pb-4 last:border-0 last:pb-0"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                                  <User size={20} className="text-gray-500" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    Customer {review.customerId.substring(0, 6)}
                                    ...
                                  </p>
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        size={16}
                                        className={`${
                                          i < review.rating
                                            ? "text-yellow-500 fill-yellow-500"
                                            : "text-gray-300"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <span className="text-sm text-gray-500">
                                {formatDate(review.date)}
                              </span>
                            </div>
                            {review.comment && (
                              <p className="text-gray-700 ml-13 pl-2">
                                {review.comment}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <MessageCircle
                        size={48}
                        className="mx-auto text-gray-400 mb-4"
                      />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        No Reviews Yet
                      </h3>
                      <p className="text-gray-500">
                        This shop hasn't received any reviews yet.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RetailerDetailsPage;