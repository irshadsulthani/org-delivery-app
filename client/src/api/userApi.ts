import privateApi from "./intreceptors/privateApi";
import api, { publicApi } from "./intreceptors/publicApi";

export const sendLoginOtp = (email: string) => {
    return publicApi('post', '/auth/send-otp', { email, action: 'login' });
};

export const loginUser = async (loginData: { email: string; password: string }) => {
    const response = await publicApi('post', '/auth/login', loginData);
    return response
};

export const verifyOtp = (otpValue: string, pendingAuthData: any) => {
    return api('post', '/auth/verify-otp', { 
      ...pendingAuthData.data, 
      otp: otpValue,
      role:'customer'
    });
};

export const sendSignupOtp = (otpEmail:string) => {
    return api('post', '/auth/send-otp',{
        email:otpEmail,
        action:'signup'
    })
}

export const sendPasswordResetEmail = (email: string) => {
    return publicApi('post', '/auth/send-otp-forgetpass', { email, action: 'reset-password' });
}

export const verifyOtpForgetPass = (otpValue: string, resetEmail: string ) => { 
    return publicApi('post', '/auth/verify-otp-forgetpass', { 
        email: resetEmail,
        otp: otpValue,
        action: 'reset-password'
    });
}

export const resetPassword = async(email: string, password: string) => {     
    const response = await publicApi('post', '/auth/reset-password', { 
        email,
        password
    });
    return response
}

export const userData = async ({ email }: { email: string }) => {
    const response = await privateApi('get', `/user/google-login-user/${email}`);
    return await response;
};

export const logoutUser = async () => { 
    const response = await publicApi('post', '/auth/customer-logout');
    return response;
}

  