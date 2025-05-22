import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { User, Phone, Mail, Truck, CheckCircle, XCircle, Clock, Ban, AlertCircle } from "lucide-react";
import { getAllDeliveryBoys } from "../../api/adminApi";
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
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const DeliveryBoyListing = () => {
  const navigate = useNavigate();
  const [deliveryBoys, setDeliveryBoys] = useState<DeliveryBoy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sortConfig, setSortConfig] = useState({
    field: "createdAt",
    direction: "desc" as "asc" | "desc",
  });

  const fetchDeliveryBoys = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Convert filters to the format expected by backend
      const backendFilters: Record<string, any> = {};
      
      // Handle specific filter mappings
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          // Handle nested object filters
          if (key === 'userId.name') {
            // This will be handled by search instead
            return;
          }
          
          // Map frontend filter keys to backend expected keys
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

      console.log('Fetching with params:', {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        filters: backendFilters,
        sortField: sortConfig.field,
        sortDirection: sortConfig.direction,
      });

      const response = await getAllDeliveryBoys({
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        filters: backendFilters,
        sortField: sortConfig.field,
        sortDirection: sortConfig.direction,
      });

      console.log('API Response:', response);

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

  const handlePageChange = (page: number) => {
    console.log('Page change requested:', page);
    setPagination(prev => ({ ...prev, page }));
    window.scrollTo(0, 0);
  };

  const handleSearch = (term: string) => {
    // Only log and update if the term actually changed
    if (term !== searchTerm) {
      console.log('Search term changed:', term);
      setSearchTerm(term);
      setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
    }
  };

  const handleFilter = (newFilters: Record<string, any>) => {
    console.log('New filters:', newFilters);
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handleSort = (field: string, direction: "asc" | "desc") => {
    console.log('Sort change:', field, direction);
    setSortConfig({ field, direction });
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </span>
        );
      case "pending":
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </span>
        );
    }
  };

  const columns = [
    {
      header: "Name",
      accessor: "userId.name",
      render: (data: DeliveryBoy) => (
        <div className="flex items-center">
          {data.profileImageUrl ? (
            <img
              src={data.profileImageUrl}
              alt={data.userId.name}
              className="h-10 w-10 rounded-full mr-3 object-cover border-2 border-gray-200"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/40x40/e5e7eb/6b7280?text=" + 
                  data.userId.name.charAt(0).toUpperCase();
              }}
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mr-3">
              <User className="h-5 w-5 text-white" />
            </div>
          )}
          <div>
            <span
              className="font-medium text-indigo-600 hover:text-indigo-900 cursor-pointer transition-colors"
              onClick={() => navigate(`/admin/delivery-boy/${data._id}`)}
            >
              {data.userId.name}
            </span>
            <div className="text-xs text-gray-500">ID: {data._id.slice(-6)}</div>
          </div>
        </div>
      ),
      sortable: true,
      filterable: true,
    },
    {
      header: "Contact",
      accessor: "contact",
      render: (data: DeliveryBoy) => (
        <div className="space-y-1">
          <div className="flex items-center text-sm text-gray-900">
            <Mail className="h-4 w-4 mr-2 text-gray-400" />
            <span className="truncate max-w-48">{data.userId.email}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="h-4 w-4 mr-2 text-gray-400" />
            {data.phone || 'N/A'}
          </div>
        </div>
      ),
      filterable: true,
    },
    {
      header: "Status",
      accessor: "verificationStatus",
      render: (data: DeliveryBoy) => (
        <div className="space-y-2">
          {getStatusBadge(data.verificationStatus)}
          <div className="flex items-center">
            {data.userId.isBlocked ? (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800">
                <Ban className="h-3 w-3 mr-1" />
                Blocked
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Active
              </span>
            )}
          </div>
        </div>
      ),
      sortable: true,
      filterable: true,
      filterOptions: [
        { label: 'All', value: '' },
        { label: 'Approved', value: 'approved' },
        { label: 'Pending', value: 'pending' },
        { label: 'Rejected', value: 'rejected' },
      ],
    },
    {
      header: "Vehicle & Availability",
      accessor: "vehicleType",
      render: (data: DeliveryBoy) => (
        <div className="space-y-2">
          <div className="flex items-center">
            <Truck className="h-4 w-4 mr-2 text-gray-400" />
            <span className="capitalize font-medium">{data.vehicleType}</span>
          </div>
          <div className="flex items-center">
            <div className={`h-2 w-2 rounded-full mr-2 ${
              data.currentlyAvailable ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className={`text-xs ${
              data.currentlyAvailable ? 'text-green-700' : 'text-red-700'
            }`}>
              {data.currentlyAvailable ? 'Available' : 'Unavailable'}
            </span>
          </div>
        </div>
      ),
      sortable: true,
      filterable: true,
      filterOptions: [
        { label: 'All Vehicles', value: '' },
        { label: 'Bike', value: 'bike' },
        { label: 'Car', value: 'car' },
        { label: 'Truck', value: 'truck' },
      ],
    },
    {
      header: "Performance",
      accessor: "totalDeliveredOrders",
      render: (data: DeliveryBoy) => (
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {data.totalDeliveredOrders || 0}
          </div>
          <div className="text-xs text-gray-500">Deliveries</div>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Joined Date",
      accessor: "createdAt",
      render: (data: DeliveryBoy) => (
        <div className="text-sm">
          <div className="text-gray-900 font-medium">
            {new Date(data.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
          <div className="text-gray-500 text-xs">
            {new Date(data.createdAt).toLocaleDateString('en-US', {
              weekday: 'short'
            })}
          </div>
        </div>
      ),
      sortable: true,
    },
  ];

  // Debug logging
  console.log('Render state:', {
    currentPage: pagination.page,
    itemsPerPage: pagination.limit,
    totalItems: pagination.total,
    totalPages: pagination.totalPages,
    dataLength: deliveryBoys.length,
    loading,
    error,
    searchTerm,
    filters,
    sortConfig,
  });

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar collapsed={false} setCollapsed={() => {}} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Delivery Boys</h1>
                  <p className="mt-2 text-sm text-gray-600">
                    Manage and monitor all registered delivery personnel
                  </p>
                  <div className="mt-4 flex items-center space-x-6 text-sm">
                    <div className="flex items-center">
                      <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-gray-600">
                        Active: {deliveryBoys.filter(db => !db.userId.isBlocked).length}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-3 w-3 bg-yellow-500 rounded-full mr-2"></div>
                      <span className="text-gray-600">
                        Pending: {deliveryBoys.filter(db => db.verificationStatus === 'pending').length}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-3 w-3 bg-red-500 rounded-full mr-2"></div>
                      <span className="text-gray-600">
                        Blocked: {deliveryBoys.filter(db => db.userId.isBlocked).length}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 sm:mt-0">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    onClick={() => navigate("/admin/delivery-boys/new")}
                  >
                    Add Delivery Boy
                  </button>
                </div>
              </div>
            </div>

            {/* Error State */}
            {error && !loading && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-3 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-red-800">Error loading delivery boys</h3>
                    <p className="text-sm text-red-600 mt-1">{error}</p>
                    <button
                      onClick={fetchDeliveryBoys}
                      className="mt-3 text-sm text-red-600 hover:text-red-500 underline"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Table */}
            <Table
              columns={columns}
              data={deliveryBoys}
              totalItems={pagination.total}
              itemsPerPage={pagination.limit}
              currentPage={pagination.page}
              onPageChange={handlePageChange}
              onSearch={handleSearch}
              onFilter={handleFilter}
              onSortChange={handleSort}
              loading={loading}
              emptyState={
                <div className="text-center py-12">
                  <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                    <Truck className="h-12 w-12" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No delivery boys found</h3>
                  <p className="text-gray-500 mb-4">
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
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 transition-colors"
                    >
                      Clear search and filters
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate("/admin/delivery-boys/new")}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                    >
                      Add First Delivery Boy
                    </button>
                  )}
                </div>
              }
            />
          </div>
        </main>
      </div>
    </div>
  );
};