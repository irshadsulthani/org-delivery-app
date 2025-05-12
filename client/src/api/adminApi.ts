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

// Get all customers
export const getAllCustomers = async () => {
    const response = await privateApi('get', '/admin/getallcustomers');
    return response;
};

// Get all delivery boys
export const getAllDeliveryBoys = async () => {
    const response = await privateApi('get', '/admin/getalldeliveryboys');
    return response;
};

// Get all retailers
export const getAllReatilers = async () => {
    const response = await privateApi('get', '/admin/get-allReatilers');
    return response;
};

// Block a delivery boy by ID
export const blockDeliveryBoy = async (id: string) => {
    const response = await privateApi('patch', `/admin/deliveryboy/${id}/block`);
    return response;
};

// Unblock a delivery boy by ID
export const unblockDeliveryBoy = async (id: string) => {
    const response = await privateApi('patch', `/admin/deliveryboy/${id}/unblock`);
    return response;
};

// Get pending delivery boys
export const getPendingDeliveryBoys = async () => {
    const response = await privateApi('get', '/admin/deliveryboy/pending');
    return response;
};
