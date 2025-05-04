import { ChangeEvent, FormEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../../slice/userSlice';
import { IUserSignup } from '../../interfaces/customer/IUserSignup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Importing images
import loginImage from '../../../src/public/customer/login/Sign In.png';
import logicIcon from '../../../src/public/customer/login/4137516.webp';
import { loginUser, sendSignupOtp, sendLoginOtp, verifyOtp, sendPasswordResetEmail, verifyOtpForgetPass, resetPassword,  } from '../../api/userApi';

interface IUserLogin {
  email: string;
  password: string;
}

function CustomerAuth() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Auth state toggles
  const [isSignUp, setIsSignUp] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');
  
  // Form data
  const [signupData, setSignupData] = useState<IUserSignup>({
    name: '',
    email: '',
    password: '',
  });
  const [loginData, setLoginData] = useState<IUserLogin>({
    email: '',
    password: '',
  });
  
  // OTP verification states
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [pendingAuthData, setPendingAuthData] = useState<any>(null);
  
  // Forgot password states
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resetOtp, setResetOtp] = useState(['', '', '', '']);
  const [resetPasswordValue, setResetPasswordValue] = useState('');
  const [confirmResetPassword, setConfirmResetPassword] = useState('');
  const [resetPasswordStep, setResetPasswordStep] = useState(1);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
  const [resetPasswordError, setResetPasswordError] = useState('');
  console.log(resetEmailSent);
  
  // Resend OTP countdown timer
  const startResendCountdown = () => {
    setResendDisabled(true);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setResendDisabled(false);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  };

  // Form input handlers
  const handleSignupChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData(prev => ({ ...prev, [name]: value }));
    setFormError(''); 
  };
  

  const handleLoginChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
    setFormError(''); 
  };

  // Form submission handlers
  const handleSignupSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError('');
  
    try {
      if (signupData.name.trim() === '') {
        toast.error("Please enter a valid email");
        setIsLoading(false);
        return;
      }
      
      if (signupData.password.trim() === '') {
        toast.error("Please enter your password");
        setIsLoading(false);
        return;
      }
      
       await sendLoginOtp(signupData.email); 
      
      setOtpEmail(signupData.email);
      setPendingAuthData({
        action: 'signup',
        data: signupData
      });
      
      setShowOtpModal(true);
      startResendCountdown();
      
      toast.info(`Verification code sent to ${signupData.email}`, {
        position: "top-right",
        autoClose: 5000
      });
    } catch (error: any) {
      console.error("OTP request failed:", error);
      setFormError(error.response?.data?.message || "Failed to send verification code. Please try again.");
  
      toast.error(error.response?.data?.message || "Failed to send verification code", {
        position: "top-right",
        autoClose: 5000
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError('');
  
    try {
      if (loginData.email.trim() === '') {
        toast.error("Please enter a valid email");
        setIsLoading(false);
        return;
      }
      
      if (loginData.password.trim() === '') {
        toast.error("Please enter your password");
        setIsLoading(false);
        return;
      }
      
      const response = await loginUser(loginData);
      
      dispatch(setUser({
        email: response.email,
        role: response.role,
        name: response.name,
      }));
  
      toast.success("Login successful! Redirecting...", {
        position: "top-right",
        autoClose: 3000
      });
  
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } 
    catch (error: any) {
      console.error("Login failed:", error);
      setFormError(error.response?.data?.message || "Invalid email or password. Please try again.");
  
      toast.error(error.response?.data?.message || "Invalid email or password", {
        position: "top-right",
        autoClose: 5000
      });
    } 
    finally {
      setIsLoading(false);
    }
  };

  // OTP handling
  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d+$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setOtpLoading(true);
    setOtpError('');
    
    const otpValue = otp.join('');
    
    try {
      await verifyOtp(otpValue, pendingAuthData);
      setShowOtpModal(false);
      
      setSignupData({ name: '', email: '', password: '' });
      setPendingAuthData(null);
      
      setIsSignUp(false);
      
      toast.success("Account created successfully! Please login.", {
        position: "top-right",
        autoClose: 5000
      });
    } catch (error: any) {
      console.error("OTP verification failed:", error);
      setOtpError(error.response?.data?.message || 'Invalid OTP. Please try again.');
      
      toast.error(error.response?.data?.message || "Invalid verification code", {
        position: "top-right",
        autoClose: 5000
      });
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendDisabled) return;
    
    setResendDisabled(true);
    setOtpError('');
    setCountdown(30);
    
    try {
      await sendSignupOtp(otpEmail);
      
      startResendCountdown();
      
      toast.info("New verification code sent to your email!", {
        position: "top-right",
        autoClose: 5000
      });
    } catch (error: any) {
      console.error("Failed to resend OTP:", error);
      setOtpError("Failed to resend verification code. Please try again later.");
      
      toast.error("Failed to resend verification code", {
        position: "top-right",
        autoClose: 5000
      });
      
      setResendDisabled(false);
    }
  };

  const closeOtpModal = () => {
    setShowOtpModal(false);
    setOtp(['', '', '', '']);
    setOtpError('');
    setPendingAuthData(null);
  };

  // Forgot password handlers
  const openForgotPasswordModal = () => {
    setShowForgotPasswordModal(true);
    setResetPasswordStep(1);
    setResetEmail('');
    setResetEmailSent(false);
    setResetOtp(['', '', '', '']);
    setResetPasswordValue('');
    setConfirmResetPassword('');
    setResetPasswordError('');
  };

  const closeForgotPasswordModal = () => {
    setShowForgotPasswordModal(false);
  };

  const handleResetEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setResetEmail(e.target.value);
    setResetPasswordError('');
  };

  const handleResetOtpChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d+$/.test(value)) return;
    
    const newOtp = [...resetOtp];
    newOtp[index] = value;
    setResetOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`reset-otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleSendResetEmail = async (e: FormEvent) => {
    e.preventDefault();
    setResetPasswordLoading(true);
    setResetPasswordError('');
    
    try {

      await sendPasswordResetEmail(resetEmail);
      
      setResetEmailSent(true);
      setResetPasswordStep(2);
      startResendCountdown();
      
      toast.info(`Password reset code sent to ${resetEmail}`, {
        position: "top-right",
        autoClose: 5000
      });
    } catch (error: any) {
      console.error("Reset email failed:", error);
      setResetPasswordError(error.response?.data?.message || "Failed to send reset code. Please try again.");
      
      toast.error(error.response?.data?.message || "Failed to send reset code", {
        position: "top-right",
        autoClose: 5000
      });
    } finally {
      setResetPasswordLoading(false);
    }
  };

  const handleVerifyResetOtp = async (e: FormEvent) => {
    e.preventDefault();
    setResetPasswordLoading(true);
    setResetPasswordError('');
    
    const otpValue = resetOtp.join('');
    
    try {
      // Replace with actual API call
      await verifyOtpForgetPass(otpValue, resetEmail);
      
      setResetPasswordStep(3);
      
      toast.success("Code verified! Set your new password", {
        position: "top-right",
        autoClose: 5000
      });
    } catch (error: any) {
      console.error("OTP verification failed:", error);
      setResetPasswordError(error.response?.data?.message || 'Invalid code. Please try again.');
      
      toast.error(error.response?.data?.message || "Invalid verification code", {
        position: "top-right",
        autoClose: 5000
      });
    } finally {
      setResetPasswordLoading(false);
    }
  };

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    
    if (resetPasswordValue !== confirmResetPassword) {
      setResetPasswordError("Passwords don't match");
      return;
    }
    
    if (resetPasswordValue.length < 8) {
      setResetPasswordError("Password must be at least 8 characters");
      return;
    }
    
    setResetPasswordLoading(true);
    setResetPasswordError('');
    
    try {
      // Replace with actual API call
      await resetPassword(resetEmail, resetPasswordValue);
      
      closeForgotPasswordModal();
      
      toast.success("Password reset successful! Please login with your new password", {
        position: "top-right",
        autoClose: 5000
      });
    } catch (error: any) {
      console.error("Password reset failed:", error);
      setResetPasswordError(error.response?.data?.message || "Password reset failed. Please try again.");
      
      toast.error(error.response?.data?.message || "Password reset failed", {
        position: "top-right",
        autoClose: 5000
      });
    } finally {
      setResetPasswordLoading(false);
    }
  };

  const handleResendResetOtp = async () => {
    if (resendDisabled) return;
  
    setResendDisabled(true);
    setResetPasswordError('');
    setCountdown(30);
  
    try {
      await sendPasswordResetEmail(resetEmail);
      
      startResendCountdown();
  
      toast.info("New verification code sent to your email!", {
        position: "top-right",
        autoClose: 5000
      });
    } catch (error: any) {
      console.error("Failed to resend OTP:", error);
  
      const errorMessage = error.message || "Failed to resend verification code. Please try again later.";
      setResetPasswordError(errorMessage);
  
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000
      });
  
      setResendDisabled(false);
    }
  };
  

  const handleSocialAuth = (provider: string) => {
    toast.info(`${provider} authentication initiated...`, {
      position: "top-right",
      autoClose: 3000
    });
    try {
      if (provider === 'Google') {
        console.log("Google authentication initiated");
        
        window.location.href = 'http://localhost:3000/api/auth/google';
      }
    
    } catch (error: any) {
      console.error("Social authentication failed:", error);
      toast.error("Social authentication failed. Please try again.", {
        position: "top-right",
        autoClose: 5000
      });
      
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setFormError('');
  };
  
  // Primary brand color
  const brandColor = '#51C8BC';

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src={loginImage} 
          alt="Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      {/* Toast Container */}
      <ToastContainer position="top-right" />

      {/* Main card */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-auto flex flex-col md:flex-row overflow-hidden">
        {/* Left side - Branding */}
        <div 
          className="w-full md:w-2/5 p-6 flex flex-col justify-center items-center relative"
          style={{ backgroundColor: brandColor }}
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 font-sans">
              Fresh Veggies, Fast Delivery
            </h2>
            <p className="text-white text-sm md:text-base opacity-90">
              Quality produce delivered to your door
            </p>
          </div>
          
          <div className="w-full h-64 md:h-80 relative overflow-hidden flex justify-center">
            <img 
              src={logicIcon} 
              alt="Fresh Vegetables" 
              className="object-contain max-h-full"
            />
          </div>
          
          <div className="mt-6 w-full max-w-xs bg-white bg-opacity-20 p-4 rounded-lg hidden md:block">
            <p className="text-white text-center text-sm font-sans">
              "Our customers love our fresh produce and lightning-fast delivery service!"
            </p>
          </div>
        </div>
        
        {/* Right Section - Form */}
        <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col">
          {/* Auth Mode Toggle */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className={`px-6 py-2 text-sm font-medium rounded-l-lg transition-colors ${
                  isSignUp 
                    ? 'text-white' 
                    : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50'
                }`}
                style={{ backgroundColor: isSignUp ? brandColor : '' }}
              >
                Sign Up
              </button>
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className={`px-6 py-2 text-sm font-medium rounded-r-lg transition-colors ${
                  !isSignUp 
                    ? 'text-white' 
                    : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50'
                }`}
                style={{ backgroundColor: !isSignUp ? brandColor : '' }}
              >
                Sign In
              </button>
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6 font-sans">
            {isSignUp ? 'Create Your Account' : 'Welcome Back'}
          </h2>

          {/* Display error message */}
          {formError && (
            <div className="p-3 rounded-md mb-4 text-sm bg-red-50 text-red-500">
              {formError}
            </div>
          )}

          {isSignUp ? (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={signupData.name}
                    onChange={handleSignupChange}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors font-sans"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={signupData.email}
                    onChange={handleSignupChange}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors font-sans"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={signupData.password}
                    onChange={handleSignupChange}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors font-sans"
                    placeholder="Create a password"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 font-sans">Password must be at least 8 characters long</p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full text-white font-medium py-3 px-4 rounded-lg transition duration-300 flex justify-center items-center font-sans mt-6 shadow-md hover:shadow-lg"
                style={{ backgroundColor: brandColor }}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors font-sans"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors font-sans"
                    placeholder="Enter your password"
                  />
                </div>
                <div className="flex justify-end mt-1">
                  <button 
                    type="button"
                    onClick={openForgotPasswordModal}
                    className="text-xs hover:underline transition-colors font-sans"
                    style={{ color: brandColor }}
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full text-white font-medium py-3 px-4 rounded-lg transition duration-300 flex justify-center items-center font-sans mt-6 shadow-md hover:shadow-lg"
                style={{ backgroundColor: brandColor }}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing In...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="relative flex items-center justify-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-sm text-gray-500 font-sans">or continue with</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Social Login Buttons */}
          <div className="flex justify-center space-x-4 mb-6">
            <button 
              onClick={() => handleSocialAuth('Google')}
              className="flex items-center justify-center bg-white border border-gray-300 rounded-lg px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-50 transition duration-300 shadow-sm hover:shadow"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48" className="mr-2">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
              </svg>
              Google
            </button>
            
            <button 
              onClick={() => handleSocialAuth('Apple')}
              className="flex items-center justify-center bg-black text-white border border-black rounded-lg px-6 py-2.5 font-medium hover:bg-gray-900 transition duration-300 shadow-sm hover:shadow"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" className="mr-2" fill="white">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.33-3.14-2.57C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              Apple
            </button>
            
            <button 
              onClick={() => handleSocialAuth('Facebook')}
              className="flex items-center justify-center bg-blue-600 text-white rounded-lg px-6 py-2.5 font-medium hover:bg-blue-700 transition duration-300 shadow-sm hover:shadow"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" className="mr-2" fill="currentColor">
                <path d="M12.001 2.002c-5.522 0-9.999 4.477-9.999 9.999 0 4.99 3.656 9.126 8.437 9.879v-6.988h-2.54v-2.891h2.54V9.798c0-2.508 1.493-3.891 3.776-3.891 1.094 0 2.24.195 2.24.195v2.459h-1.264c-1.24 0-1.628.772-1.628 1.563v1.875h2.771l-.443 2.891h-2.328v6.988C18.344 21.129 22 16.992 22 12.001c0-5.522-4.477-9.999-9.999-9.999z"/>
              </svg>
              Facebook
            </button>
          </div>

          {/* Switch auth mode */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600 font-sans">
              {isSignUp ? 'Already have an account?' : "Don't have an account yet?"}{' '}
              <button
                type="button"
                onClick={toggleAuthMode}
                className="font-medium hover:underline transition-colors"
                style={{ color: brandColor }}
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md mx-auto p-6 shadow-xl">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full mb-4"
                style={{ backgroundColor: `${brandColor}25` }}> {/* 25 is hex for 15% opacity */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                     style={{ color: brandColor }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1 font-sans">Verify Your Email</h3>
              <p className="text-gray-600 font-sans">
                Enter the 4-digit code sent to <span className="font-medium">{otpEmail}</span>
              </p>
            </div>

            <form onSubmit={handleOtpSubmit}>
              <div className="flex justify-center space-x-3 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={`otp-${index}`}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="w-14 h-14 text-center text-xl font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 transition-colors"
                    style={{ 
                      boxShadow: digit ? `0 0 0 2px ${brandColor}20` : 'none'
                    }}
                    required
                  />
                ))}
              </div>
              {otpError && (
                <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4 text-sm">
                  {otpError}
                </div>
              )}

              <button
                type="submit"
                disabled={otpLoading || otp.some(digit => !digit)}
                className="w-full text-white font-medium py-3 px-4 rounded-lg transition duration-300 flex justify-center items-center font-sans disabled:opacity-60 shadow-md hover:shadow-lg"
                style={{ backgroundColor: brandColor }}
              >
                {otpLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  'Complete Signup'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-2 font-sans">
                Didn't receive the code?
              </p>
              <button
                onClick={handleResendOtp}
                disabled={resendDisabled}
                className="text-sm font-medium hover:underline transition-colors disabled:opacity-60 disabled:no-underline font-sans"
                style={{ color: resendDisabled ? 'gray' : brandColor }}
              >
                {resendDisabled ? `Resend in ${countdown}s` : 'Resend Code'}
              </button>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={closeOtpModal}
                className="text-gray-500 hover:text-gray-700 font-medium text-sm hover:underline transition-colors font-sans"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md mx-auto p-6 shadow-xl">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full mb-4"
                style={{ backgroundColor: `${brandColor}25` }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                     style={{ color: brandColor }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1 font-sans">Reset Your Password</h3>
              {resetPasswordStep === 1 && (
                <p className="text-gray-600 font-sans">
                  Enter your email address to receive a verification code
                </p>
              )}
              {resetPasswordStep === 2 && (
                <p className="text-gray-600 font-sans">
                  Enter the 4-digit code sent to <span className="font-medium">{resetEmail}</span>
                </p>
              )}
              {resetPasswordStep === 3 && (
                <p className="text-gray-600 font-sans">
                  Create a new password for your account
                </p>
              )}
            </div>

            {resetPasswordError && (
              <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4 text-sm">
                {resetPasswordError}
              </div>
            )}

            {/* Step 1: Enter Email */}
            {resetPasswordStep === 1 && (
              <form onSubmit={handleSendResetEmail}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={handleResetEmailChange}
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors font-sans"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={resetPasswordLoading}
                  className="w-full text-white font-medium py-3 px-4 rounded-lg transition duration-300 flex justify-center items-center font-sans shadow-md hover:shadow-lg mb-4"
                  style={{ backgroundColor: brandColor }}
                >
                  {resetPasswordLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    'Send Reset Code'
                  )}
                </button>
              </form>
            )}

            {/* Step 2: Enter OTP */}
            {resetPasswordStep === 2 && (
              <form onSubmit={handleVerifyResetOtp}>
                <div className="flex justify-center space-x-3 mb-6">
                  {resetOtp.map((digit, index) => (
                    <input
                      key={`reset-otp-${index}`}
                      id={`reset-otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleResetOtpChange(index, e.target.value)}
                      className="w-14 h-14 text-center text-xl font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 transition-colors"
                      style={{ 
                        boxShadow: digit ? `0 0 0 2px ${brandColor}20` : 'none'
                      }}
                      required
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={resetPasswordLoading || resetOtp.some(digit => !digit)}
                  className="w-full text-white font-medium py-3 px-4 rounded-lg transition duration-300 flex justify-center items-center font-sans disabled:opacity-60 shadow-md hover:shadow-lg mb-4"
                  style={{ backgroundColor: brandColor }}
                >
                  {resetPasswordLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </span>
                  ) : (
                    'Verify Code'
                  )}
                </button>

                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600 mb-2 font-sans">
                    Didn't receive the code?
                  </p>
                  <button
                    type="button"
                    onClick={handleResendResetOtp}
                    disabled={resendDisabled}
                    className="text-sm font-medium hover:underline transition-colors disabled:opacity-60 disabled:no-underline font-sans"
                    style={{ color: resendDisabled ? 'gray' : brandColor }}
                  >
                    {resendDisabled ? `Resend in ${countdown}s` : 'Resend Code'}
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Create New Password */}
            {resetPasswordStep === 3 && (
              <form onSubmit={handleResetPassword}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      type="password"
                      value={resetPasswordValue}
                      onChange={(e) => setResetPasswordValue(e.target.value)}
                      required
                      minLength={8}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors font-sans"
                      placeholder="Create a new password"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500 font-sans">Password must be at least 8 characters long</p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      type="password"
                      value={confirmResetPassword}
                      onChange={(e) => setConfirmResetPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors font-sans"
                      placeholder="Confirm new password"
                    />
                  </div>
                  {resetPasswordValue && confirmResetPassword && resetPasswordValue !== confirmResetPassword && (
                    <p className="mt-1 text-xs text-red-500 font-sans">Passwords don't match</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={
                    resetPasswordLoading || 
                    !resetPasswordValue || 
                    !confirmResetPassword || 
                    resetPasswordValue !== confirmResetPassword || 
                    resetPasswordValue.length < 8
                  }
                  className="w-full text-white font-medium py-3 px-4 rounded-lg transition duration-300 flex justify-center items-center font-sans disabled:opacity-60 shadow-md hover:shadow-lg"
                  style={{ backgroundColor: brandColor }}
                >
                  {resetPasswordLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Resetting...
                    </span>
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </form>
            )}

            <div className="mt-6 text-center">
              <button
                onClick={closeForgotPasswordModal}
                className="text-gray-500 hover:text-gray-700 font-medium text-sm hover:underline transition-colors font-sans"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerAuth;