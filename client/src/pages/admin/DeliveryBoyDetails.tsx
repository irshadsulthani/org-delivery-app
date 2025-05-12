import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  User, 
  Phone, 
  Mail, 
  Truck, 
  FileText, 
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Calendar as CalendarIcon,
  Star,
  CheckCircle2,
  BanIcon,
  ClipboardCheck,
  Edit,
  Package,
  Shield,
  MessageCircle,
  FileImage,
  File,
  AlertCircle
} from "lucide-react";
import { getDeliveryBoyById, approveDeliveryBoy, rejectDeliveryBoy } from "../../api/adminApi";
import AdminHeader from "../../components/AdminComponents/AdminHeader";
import AdminSidebar from "../../components/AdminComponents/AdminSidebar";
import { toast } from "react-toastify";

// Add skeleton loading component for better UX
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

function DeliveryBoyDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  interface DeliveryBoy {
    userId: {
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
    dob?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    vehicleNumber?: string;
    dlNumber?: string;
    verificationImageUrl?: string;
    dlImageUrl?: string;
    vehicleRegistrationImageUrl?: string;
    reviews?: { rating: number; comment: string }[];
  }

  const [deliveryBoy, setDeliveryBoy] = useState<DeliveryBoy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingAction, setProcessingAction] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  useEffect(() => {
    const fetchDeliveryBoyDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await getDeliveryBoyById(id);
        setDeliveryBoy(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching delivery boy details:", err);
        setError("Failed to load delivery boy details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryBoyDetails();
  }, [id]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleApprove = async () => {
    if (!id) return;
    
    try {
      setProcessingAction(true);
      await approveDeliveryBoy(id);
      
      // Refresh data after approval
      const data = await getDeliveryBoyById(id);
      setDeliveryBoy(data);
      
      toast.success("Delivery boy approved successfully");
    } catch (err) {
      console.error("Error approving delivery boy:", err);
      toast.error("Failed to approve delivery boy");
    } finally {
      setProcessingAction(false);
    }
  };

  const handleReject = async () => {
    if (!id) return;
    
    try {
      setProcessingAction(true);
      await rejectDeliveryBoy(id);
      
      // Refresh data after rejection
      const data = await getDeliveryBoyById(id);
      setDeliveryBoy(data);
      
      toast.success("Delivery boy rejected");
    } catch (err) {
      console.error("Error rejecting delivery boy:", err);
      toast.error("Failed to reject delivery boy");
    } finally {
      setProcessingAction(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="flex items-center text-green-700 bg-green-100 px-3 py-1 rounded-full text-sm font-medium">
            <CheckCircle size={16} className="mr-1" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center text-red-700 bg-red-100 px-3 py-1 rounded-full text-sm font-medium">
            <XCircle size={16} className="mr-1" />
            Rejected
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="flex items-center text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full text-sm font-medium">
            <Clock size={16} className="mr-1" />
            Pending
          </span>
        );
    }
  };

  const formatDate = (dateString: string | number | Date | undefined) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Error state component
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <div className="hidden md:block">
          <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        </div>
        <div className="flex-1">
          <AdminHeader toggleMobileSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
          <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <XCircle size={48} className="mx-auto text-red-500 mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {error}
              </h2>
              <p className="text-gray-600 mb-6">
                We couldn't find the delivery boy details you're looking for.
              </p>
              <button
                onClick={() => navigate('/admin/delivery-boys')}
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <div className="hidden md:block">
          <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        </div>
        <div className="flex-1">
          <AdminHeader toggleMobileSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
          <SkeletonLoader />
        </div>
      </div>
    );
  }

  // If no delivery boy data after loading
  if (!deliveryBoy) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <div className="hidden md:block">
          <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        </div>
        <div className="flex-1">
          <AdminHeader toggleMobileSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
          <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <XCircle size={48} className="mx-auto text-red-500 mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Delivery boy not found
              </h2>
              <p className="text-gray-600 mb-6">
                We couldn't find the delivery boy details you're looking for.
              </p>
              <button
                onClick={() => navigate('/admin/delivery-boys')}
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
        <AdminHeader toggleMobileSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        
        {/* Mobile sidebar */}
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
          {/* Back button and action buttons */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <button
              onClick={() => navigate('/admin/delivery-boys')}
              className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors font-medium"
            >
              <ArrowLeft size={18} className="mr-1" />
              Back to Delivery Boys
            </button>
            
            {deliveryBoy.verificationStatus === 'pending' && (
              <div className="flex space-x-3">
                <button
                  onClick={handleApprove}
                  disabled={processingAction}
                  className={`bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md shadow-sm transition-colors flex items-center justify-center min-w-28 ${
                    processingAction ? 'opacity-70 cursor-not-allowed' : ''
                  } focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
                >
                  {processingAction ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  ) : (
                    <CheckCircle size={18} className="mr-2" />
                  )}
                  Approve
                </button>
                <button
                  onClick={handleReject}
                  disabled={processingAction}
                  className={`bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow-sm transition-colors flex items-center justify-center min-w-28 ${
                    processingAction ? 'opacity-70 cursor-not-allowed' : ''
                  } focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2`}
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
          </div>

          {/* Main profile card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            {/* Hero section with profile info */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                  {deliveryBoy.profileImageUrl ? (
                    <img
                      src={deliveryBoy.profileImageUrl}
                      alt={deliveryBoy.userId.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100';
                      }}
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center border-4 border-white shadow-lg">
                      <User size={36} className="text-indigo-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                    <h1 className="text-2xl font-bold text-white">{deliveryBoy.userId.name}</h1>
                    {getStatusBadge(deliveryBoy.verificationStatus)}
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-indigo-100">
                    <div className="flex items-center">
                      <Phone size={16} className="mr-1" />
                      <span>{deliveryBoy.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail size={16} className="mr-1" />
                      <span>{deliveryBoy.userId.email}</span>
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon size={16} className="mr-1" />
                      <span>Joined {formatDate(deliveryBoy.createdAt)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      deliveryBoy.currentlyAvailable 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {deliveryBoy.currentlyAvailable ? 'Available Now' : 'Unavailable'}
                    </span>
                    
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-indigo-800">
                      <Truck className="mr-1" size={12} />
                      {deliveryBoy.vehicleType}
                    </span>
                    
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-blue-800">
                      <ClipboardCheck className="mr-1" size={12} />
                      {deliveryBoy.totalDeliveredOrders} Deliveries
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 border-b border-gray-200 bg-white">
              <div className="p-5 border-r border-gray-200 flex flex-col items-center justify-center">
                <div className="flex items-center justify-center mb-2 h-10 w-10 rounded-full bg-indigo-100">
                  <Package size={20} className="text-indigo-600" />
                </div>
                <p className="text-sm text-gray-500 text-center">Deliveries</p>
                <p className="text-2xl font-bold text-gray-800">
                  {deliveryBoy.totalDeliveredOrders}
                </p>
              </div>
              <div className="p-5 border-r border-gray-200 flex flex-col items-center justify-center">
                <div className="flex items-center justify-center mb-2 h-10 w-10 rounded-full bg-indigo-100">
                  <Shield size={20} className={deliveryBoy.userId.isBlocked ? "text-red-600" : "text-green-600"} />
                </div>
                <p className="text-sm text-gray-500 text-center">Status</p>
                <p className={`text-xl font-bold ${deliveryBoy.userId.isBlocked ? "text-red-600" : "text-green-600"}`}>
                  {deliveryBoy.userId.isBlocked ? "Blocked" : "Active"}
                </p>
              </div>
              <div className="p-5 flex flex-col items-center justify-center">
                <div className="flex items-center justify-center mb-2 h-10 w-10 rounded-full bg-indigo-100">
                  <Star size={20} className="text-yellow-500" />
                </div>
                <p className="text-sm text-gray-500 text-center">Rating</p>
                <div className="flex items-center">
                  {deliveryBoy.reviews && deliveryBoy.reviews.length > 0 ? (
                    <>
                      <p className="text-2xl font-bold text-gray-800">4.2</p>
                      <Star size={18} className="ml-1 text-yellow-500 fill-yellow-500" />
                      <span className="ml-1 text-sm font-normal text-gray-500">
                        ({deliveryBoy.reviews.length})
                      </span>
                    </>
                  ) : (
                    <p className="text-gray-500">No reviews</p>
                  )}
                </div>
              </div>
            </div>

            {/* Tab navigation */}
            <div className="px-6 pt-4 border-b border-gray-200">
              <div className="flex overflow-x-auto space-x-4 scrollbar-hide">
                <button
                  onClick={() => setActiveTab("personal")}
                  className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${
                    activeTab === "personal" 
                      ? "border-indigo-600 text-indigo-600" 
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Personal Information
                </button>
                <button
                  onClick={() => setActiveTab("vehicle")}
                  className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${
                    activeTab === "vehicle" 
                      ? "border-indigo-600 text-indigo-600" 
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Vehicle Details
                </button>
                <button
                  onClick={() => setActiveTab("documents")}
                  className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${
                    activeTab === "documents" 
                      ? "border-indigo-600 text-indigo-600" 
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Documents
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${
                    activeTab === "reviews" 
                      ? "border-indigo-600 text-indigo-600" 
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Reviews
                </button>
              </div>
            </div>

            {/* Tab content */}
            <div className="p-6">
              {activeTab === "personal" && (
                <div className="bg-white rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <User size={20} className="mr-3 text-indigo-600 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Full Name</p>
                          <p className="font-medium text-gray-900">{deliveryBoy.userId.name}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Mail size={20} className="mr-3 text-indigo-600 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Email Address</p>
                          <p className="font-medium text-gray-900">{deliveryBoy.userId.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Phone size={20} className="mr-3 text-indigo-600 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Phone Number</p>
                          <p className="font-medium text-gray-900">{deliveryBoy.phone}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <CalendarIcon size={20} className="mr-3 text-indigo-600 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                          <p className="font-medium text-gray-900">{formatDate(deliveryBoy.dob)}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <FileText size={20} className="mr-3 text-indigo-600 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Address</p>
                          <p className="font-medium text-gray-900">
                            {deliveryBoy.address}, {deliveryBoy.city}, {deliveryBoy.state} - {deliveryBoy.zipCode}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <CalendarIcon size={20} className="mr-3 text-indigo-600 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Account Created</p>
                          <p className="font-medium text-gray-900">{formatDate(deliveryBoy.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "vehicle" && (
                <div className="bg-white rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <Truck size={20} className="mr-3 text-indigo-600 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Vehicle Type</p>
                          <p className="font-medium text-gray-900 capitalize">{deliveryBoy.vehicleType || "Not provided"}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <FileText size={20} className="mr-3 text-indigo-600 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Vehicle Number</p>
                          <p className="font-medium text-gray-900">{deliveryBoy.vehicleNumber || "Not provided"}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <Shield size={20} className="mr-3 text-indigo-600 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Driving License Number</p>
                          <p className="font-medium text-gray-900">{deliveryBoy.dlNumber || "Not provided"}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle2 size={20} className="mr-3 text-indigo-600 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Currently Available</p>
                          <p className={`font-medium ${deliveryBoy.currentlyAvailable ? "text-green-600" : "text-gray-900"}`}>
                            {deliveryBoy.currentlyAvailable ? "Yes" : "No"}
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
                    {/* Profile Image */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <h3 className="font-medium text-gray-700 flex items-center">
                          <User size={18} className="mr-2 text-indigo-600" />
                          Profile Image
                        </h3>
                      </div>
                      <div className="p-4">
                        {deliveryBoy.profileImageUrl ? (
                          <div className="flex flex-col items-center">
                            <div className="w-full h-64 bg-gray-100 rounded-md overflow-hidden mb-3">
                              <img 
                                src={deliveryBoy.profileImageUrl} 
                                alt="Profile" 
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400';
                                }}
                              />
                            </div>
                            <a 
                              href={deliveryBoy.profileImageUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                            >
                              <FileImage size={16} className="mr-1" />
                              View Full Image
                            </a>
                          </div>
                        ) : (
                          <div className="w-full h-64 bg-gray-100 rounded-md flex flex-col items-center justify-center">
                            <AlertCircle size={32} className="text-gray-400 mb-2" />
                            <p className="text-gray-500 text-sm">No profile image provided</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Verification Document */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <h3 className="font-medium text-gray-700 flex items-center">
                          <File size={18} className="mr-2 text-indigo-600" />
                          Verification Document
                        </h3>
                      </div>
                      <div className="p-4">
                        {deliveryBoy.verificationImageUrl ? (
                          <div className="flex flex-col items-center">
                            <div className="w-full h-64 bg-gray-100 rounded-md overflow-hidden mb-3">
                              <img 
                                src={deliveryBoy.verificationImageUrl} 
                                alt="Verification Document" 
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400';
                                }}
                              />
                            </div>
                            <a 
                              href={deliveryBoy.verificationImageUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                            >
                              <File size={16} className="mr-1" />
                              View Full Document
                            </a>
                          </div>
                        ) : (
                          <div className="w-full h-64 bg-gray-100 rounded-md flex flex-col items-center justify-center">
                            <AlertCircle size={32} className="text-gray-400 mb-2" />
                            <p className="text-gray-500 text-sm">No verification document provided</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="bg-white rounded-lg">
                  {deliveryBoy.reviews && deliveryBoy.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {/* This would be replaced with actual reviews data */}
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center mb-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                size={16} 
                                className={star <= 5 ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-600">
                            2 weeks ago
                          </span>
                        </div>
                        <p className="text-gray-800">
                          Great delivery service. Always on time and very professional.
                        </p>
                      </div>
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center mb-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                size={16} 
                                className={star <= 4 ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-600">
                            1 month ago
                          </span>
                        </div>
                        <p className="text-gray-800">
                          Delivered my order safely. Would recommend.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MessageCircle size={32} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-500">No reviews available for this delivery boy yet.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Admin Actions Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Shield size={20} className="mr-2 text-indigo-600" />
              Admin Actions
            </h2>
            <div className="flex flex-wrap gap-3">
              <button 
                className={`px-4 py-2 rounded-md transition-colors flex items-center shadow-sm focus:outline-none focus:ring-2 ${
                  deliveryBoy.userId.isBlocked 
                    ? "bg-green-500 hover:bg-green-600 text-white focus:ring-green-500" 
                    : "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500"
                } focus:ring-offset-2`}
              >
                <BanIcon size={16} className="mr-2" />
                {deliveryBoy.userId.isBlocked ? "Unblock Account" : "Block Account"}
              </button>
              
              <button 
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors flex items-center shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                onClick={() => navigate(`/admin/delivery-boy/${id}/orders`)}
              >
                <Package size={16} className="mr-2" />
                View Deliveries
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeliveryBoyDetailsPage;