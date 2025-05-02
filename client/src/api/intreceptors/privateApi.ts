import axios from "axios";
import { config } from "../../config";
import { toast } from "react-toastify";
import { refreshToken } from "../adminApi";
import { navigateToRoleLogin } from "../../utils/navigation";

const BASE_URL = config.BACK_URL;

const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const { response } = error;
      const originalRequest = response?.config;
  
      if (response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          await refreshToken();
          return axios(originalRequest); // retry request
        } catch (err) {
          // Clear auth state and redirect
          navigateToRoleLogin(); // 👇 centralized logic
          toast.error("Session expired. Please sign in again.");
        }
      }
  
      return Promise.reject(error);
    }
  );
  

export const privateApi = async (
  method: "get" | "post" | "put" | "patch" | "delete",
  url: string,
  data?: any,
  config?: any
) => {
  const res = await instance.request({
    method,
    url,
    data,
    ...config,
  });
  return res.data;
};

export default privateApi;
