import privateApi from "./intreceptors/privateApi"
import { publicApi } from "./intreceptors/publicApi"

// Admin login
export const adminLogin = async (email: string, password: string) => {
    const response = await publicApi('post', '/auth/adminlogin', { email, password });
    return response;
};

// Admin logout
export const logoutAdmin = async () => {
    const response = await publicApi('post', '/auth/adminLogout');
    return response;
};

// Refresh token
export const refreshToken = async () => {
    const response = await publicApi('post', '/auth/refresh-token');
    return response;
};

// Get all users
export const getAllUsers = async () => {
    const response = await privateApi('get', '/admin/getallusers');
    return response;
};

export const getAllCustomers = async () => {
    const response = await privateApi('get', '/admin/getallcustomers');
    return response;
};

export const getAllDeliveryBoys = async () => {
    const response = await privateApi('get', '/admin/getalldeliveryboys');
    return response;
};

export const getAllRetailers = async () => {
    const response = await privateApi('get', '/admin/get-allReatilers');
    return response;
};

export const blockDeliveryBoy = async (id: string) => {
    const response = await privateApi('patch', `/admin/deliveryboy/${id}/block`);
    return response;
};

export const unblockDeliveryBoy = async (id: string) => {
    const response = await privateApi('patch', `/admin/deliveryboy/${id}/unblock`);
    return response;
};

export const getPendingDeliveryBoys = async () => {
    const response = await privateApi('get', '/admin/deliveryboy/pending');
    return response;
};


export const approveDeliveryBoy = async (id: string): Promise<void> => {
  try {
    await privateApi('put',`/admin/deliveryboy/${id}/approve`);
  } catch (error) {
    console.error('Error approving delivery boy:', error);
    throw error;
  }
};

export const rejectDeliveryBoy = async (id: string): Promise<void> => {
  try {
    await privateApi('put',`/admin/deliveryboy/${id}/reject`);
  } catch (error) {
    console.error('Error rejecting delivery boy:', error);
    throw error;
  }
};

export const getDeliveryBoyById = async (id: string) => {
  try {
    const response = await privateApi('get', `/admin/deliveryboy/${id}`);
    return response;
  } catch (error) {
    console.error('Error fetching delivery boy details:', error);
    throw error; // Re-throw to allow the calling function to handle it
  }
};

export const getPendingRetailers = async () => {
    const response = await privateApi('get', '/admin/retailer/pending');
    return response;
};

export const approveRetailer = async (id: string) => {
  const response = await privateApi('put', `/admin/retailer/approve/${id}`);
  return response;
};

export const rejectRetailer = async (id: string) => {
  const response = await privateApi('put', `/admin/retailer/reject/${id}`);
  return response;
};

export const getRetailerById = async (id: string) => {
  const response = await privateApi('get', `/admin/retailer/${id}`)
  return response
}

export const updateRetailerStatus = async (retailerId: string, newStatus: string) => {

}

export const blockRetailer = async (id: string) => {

}

export const unblockRetailer = async (id: string) => {

}