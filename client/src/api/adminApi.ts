import privateApi from "./intreceptors/privateApi";
import { publicApi } from "./intreceptors/publicApi";

// Admin login
export const adminLogin = async (email: string, password: string) => {
  const response = await publicApi("post", "/auth/adminlogin", {
    email,
    password,
  });
  return response;
};

// Admin logout
export const logoutAdmin = async () => {
  const response = await publicApi("post", "/auth/adminLogout");
  return response;
};

// Refresh token
export const refreshToken = async () => {
  const response = await publicApi("post", "/auth/refresh-token");
  return response;
};

// Get all users
export const getAllUsers = async () => {
  const response = await privateApi("get", "/admin/getallusers");
  return response;
};

export const getAllCustomers = async (params: {
  page: number;
  limit: number;
  search?: string;
  filters?: Record<string, any>;
  sortField?: string;
  sortDirection?: "asc" | "desc";
}) => {
  try {
    const queryParams = new URLSearchParams();

    // Add pagination params
    queryParams.append("page", params.page.toString());
    queryParams.append("limit", params.limit.toString());

    // Add search param
    if (params.search && params.search.trim() !== "") {
      queryParams.append("search", params.search.trim());
    }

    // Add filter params - flatten nested filters
    if (params.filters && Object.keys(params.filters).length > 0) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          // Convert boolean values to strings
          const stringValue =
            typeof value === "boolean" ? value.toString() : value;
          queryParams.append(key, stringValue);
        }
      });
    }

    // Add sorting params
    if (params.sortField) {
      queryParams.append("sortField", params.sortField);
    }

    if (params.sortDirection) {
      queryParams.append("sortDirection", params.sortDirection);
    }
    const response = await privateApi(
      "get",
      `/admin/getallcustomers?${queryParams.toString()}`
    );
    return {
      success: response.success ?? true,
      data: response.data || [],
      total: response.total || 0,
      page: response.page || params.page,
      limit: response.limit || params.limit,
      totalPages:
        response.totalPages || Math.ceil((response.total || 0) / params.limit),
      message: response.message || null,
    };
  } catch (error: any) {
    console.error("API Error:", error);

    // Return a consistent error structure
    return {
      success: false,
      data: [],
      total: 0,
      page: params.page,
      limit: params.limit,
      totalPages: 0,
      message: error.message || "Failed to fetch customers",
    };
  }
};


export const getAllRetailers = async (params: {
  page: number;
  limit: number;
  search?: string;
  filters?: Record<string, any>;
  sortField?: string;
  sortDirection?: "asc" | "desc";
}) => {
  try {
    const queryParams = new URLSearchParams();

    // Add pagination params
    queryParams.append("page", params.page.toString());
    queryParams.append("limit", params.limit.toString());

    // Add search param
    if (params.search && params.search.trim() !== "") {
      queryParams.append("search", params.search.trim());
    }

    // Add filter params - flatten nested filters
    if (params.filters && Object.keys(params.filters).length > 0) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          // Convert boolean values to strings
          const stringValue =
            typeof value === "boolean" ? value.toString() : value;
          queryParams.append(key, stringValue);
        }
      });
    }

    // Add sorting params
    if (params.sortField) {
      queryParams.append("sortField", params.sortField);
    }

    if (params.sortDirection) {
      queryParams.append("sortDirection", params.sortDirection);
    }
    const response = await privateApi(
      "get",
      `/admin/get-allReatilers?${queryParams.toString()}`
    );

    if (!response || typeof response !== "object") {
      throw new Error("Invalid response format");
    }

    // Normalize response structure
    return {
      success: response.success ?? true,
      data: response.data || [],
      total: response.total || 0,
      page: response.page || params.page,
      limit: response.limit || params.limit,
      totalPages:
        response.totalPages || Math.ceil((response.total || 0) / params.limit),
      message: response.message || null,
    };
  } catch (error: any) {
    console.error("API Error:", error);

    // Return a consistent error structure
    return {
      success: false,
      data: [],
      total: 0,
      page: params.page,
      limit: params.limit,
      totalPages: 0,
      message: error.message || "Failed to fetch retailers",
    };
  }
};

export const getAllDeliveryBoys = async (params: {
  page: number;
  limit: number;
  search?: string;
  filters?: Record<string, any>;
  sortField?: string;
  sortDirection?: "asc" | "desc";
}) => {
  try {
    const queryParams = new URLSearchParams();

    // Add pagination params
    queryParams.append("page", params.page.toString());
    queryParams.append("limit", params.limit.toString());

    // Add search param
    if (params.search && params.search.trim() !== "") {
      queryParams.append("search", params.search.trim());
    }

    // Add filter params - flatten nested filters
    if (params.filters && Object.keys(params.filters).length > 0) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          // Convert boolean values to strings
          const stringValue =
            typeof value === "boolean" ? value.toString() : value;
          queryParams.append(key, stringValue);
        }
      });
    }

    // Add sorting params
    if (params.sortField) {
      queryParams.append("sortField", params.sortField);
    }

    if (params.sortDirection) {
      queryParams.append("sortDirection", params.sortDirection);
    }
    const response = await privateApi(
      "get",
      `/admin/delivery-boys?${queryParams.toString()}`
    );

    if (!response || typeof response !== "object") {
      throw new Error("Invalid response format");
    }

    // Normalize response structure
    return {
      success: response.success ?? true,
      data: response.data || [],
      total: response.total || 0,
      page: response.page || params.page,
      limit: response.limit || params.limit,
      totalPages:
        response.totalPages || Math.ceil((response.total || 0) / params.limit),
      message: response.message || null,
    };
  } catch (error: any) {
    console.error("API Error:", error);

    // Return a consistent error structure
    return {
      success: false,
      data: [],
      total: 0,
      page: params.page,
      limit: params.limit,
      totalPages: 0,
      message: error.message || "Failed to fetch delivery boys",
    };
  }
};

export const getAllRetailersLegacy = async () => {
  const response = await privateApi("get", "/admin/get-allReatilers");
  return response;
};

export const blockDeliveryBoy = async (deliveryBoyId: string) => {
  const response = await privateApi(
    "patch",
    `/admin/deliveryboy/${deliveryBoyId}/block`
  );
  return response;
};

export const unblockDeliveryBoy = async (deliveryBoyId: string) => {
  const response = await privateApi(
    "patch",
    `/admin/deliveryboy/${deliveryBoyId}/unblock`
  );
  return response;
};

export const getPendingDeliveryBoys = async () => {
  const response = await privateApi("get", "/admin/deliveryboy/pending");
  return response;
};

export const approveDeliveryBoy = async (
  deliveryBoyId: string
): Promise<void> => {
  try {
    await privateApi("put", `/admin/deliveryboy/${deliveryBoyId}/approve`);
  } catch (error) {
    console.error("Error approving delivery boy:", error);
    throw error;
  }
};

export const rejectDeliveryBoy = async (id: string): Promise<void> => {
  try {
    await privateApi("put", `/admin/deliveryboy/${id}/reject`);
  } catch (error) {
    console.error("Error rejecting delivery boy:", error);
    throw error;
  }
};

export const getDeliveryBoyById = async (deliveryBoyId: string) => {
  try {
    const response = await privateApi(
      "get",
      `/admin/deliveryboy/${deliveryBoyId}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching delivery boy details:", error);
    throw error; // Re-throw to allow the calling function to handle it
  }
};

export const getPendingRetailers = async () => {
  const response = await privateApi("get", "/admin/retailer/pending");
  return response;
};

export const approveRetailer = async (retailerId: string) => {
  const response = await privateApi(
    "put",
    `/admin/retailer/approve/${retailerId}`
  );
  return response;
};

export const rejectRetailer = async (retailerId: string) => {
  const response = await privateApi(
    "put",
    `/admin/retailer/reject/${retailerId}`
  );
  return response;
};

export const getRetailerById = async (retailerId: string) => {
  const response = await privateApi("get", `/admin/retailer/${retailerId}`);
  return response;
};

export const updateRetailerStatus = async (
  retailerId: string,
  newStatus: string
) => {
  const response = await privateApi(
    "get",
    `/admin/retailer/${retailerId}/${newStatus}`
  );
  return response;
};

export const blockRetailer = async (retailerId: string) => {
  const response = await privateApi(
    "patch",
    `/admin/retailer/${retailerId}/block`
  );
  return response;
};

export const unblockRetailer = async (retailerId: string) => {
  const response = await privateApi(
    "patch",
    `/admin/retailer/${retailerId}/unblock`
  );
  return response;
};

export const blockCustomer = async (customerId: string) => {
  const response = await privateApi("patch", `/admin/user/${customerId}/block`);
  return response;
};

export const unBlockCustomer = async (customerId: string) => {
  const response = await privateApi(
    "patch",
    `/admin/user/${customerId}/unblock`
  );
  return response;
};