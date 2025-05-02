import { publicApi } from "./intreceptors/publicApi";

export const sendSignupOtp = async (email: string) => {
    const response = await publicApi('post', '/auth/send-otp', {
        email,
        action: 'signup'
    });
    return response;
}

export const verifyOtpApi = async (otpValue: string, pendingAuthData: any) => {
    const response = await publicApi('post', '/auth/verify-otp', {
      ...pendingAuthData,
      otp: otpValue,
      role: 'deliveryBoy'
    });
    return response;
};

export const loginDeliveryBoy = async (loginData: { email: string; password: string }) => {
    const response = await publicApi('post', '/auth/deliveryBoy-login', loginData);
    return response;
}

export const logoutDeliveryBoy = async () => {
    const response = await publicApi('post', '/auth/deliveryBoy-logout');
    return response;
}
  
  