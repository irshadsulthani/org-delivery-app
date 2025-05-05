import { useState, useRef, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  ArrowRight, 
  Loader2, 
  Mail, 
  Lock, 
  User, 
  CheckCircle,
  Truck,
  ChevronLeft
} from 'lucide-react';
import { 
  loginDeliveryBoy, 
  sendSignupOtp, 
  verifyOtpApi,
} from '../../api/deliveryBoyApi';
import { useDispatch } from 'react-redux';
import { setDeliveryBoy } from '../../slice/deliveryBoySlice';
import { resetPassword, sendPasswordResetEmail, verifyOtpForgetPass } from '../../api/userApi';

const DeliveryBoyAuth = () => {
  // Auth mode states
  const [authMode, setAuthMode] = useState<'signup' | 'login' | 'forgotPassword' | 'resetPassword'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // OTP states
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [otpPurpose, setOtpPurpose] = useState<'signup' | 'resetPassword'>('signup');
  const otpInputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  
  // Success states
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.charAt(0);
    }
    
    // Only allow numbers
    if (value && !/^[0-9]$/.test(value)) {
      return;
    }
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto focus next input if current input is filled
    if (value && index < 3 && otpInputRefs[index + 1]?.current) {
      (otpInputRefs[index + 1].current as unknown as HTMLInputElement).focus();
    }
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
  
    try {
      setIsLoading(true);
      
      if (authMode === 'signup') {
        const response = await sendSignupOtp(formData.email);

        if (response.message === 'OTP sent successfully') {
          toast.success('OTP sent successfully. Please check your email.');
          setOtpPurpose('signup');
          setShowOtpVerification(true);
        } else {
          toast.error(response.message || 'Failed to send OTP');
        }
      } 
      
      else if (authMode === 'login') {
        const response = await loginDeliveryBoy(formData);
        console.log(response);
        dispatch(setDeliveryBoy({
          name: response.userData.name,
          email: response.userData.email,
          role: response.userData.role,
        }))
        if (response && response.success) {
          setShowSuccessMessage(true);

          let countdown = 3;
          setTimeLeft(countdown);

          const timer = setInterval(() => {
            countdown -= 1;
            setTimeLeft(countdown);

            if (countdown <= 0) {
              clearInterval(timer);
              setShowSuccessMessage(false);
              navigate('/delivery/dashboard')
            }
          }, 1000);
        } else {
          const errorMessage = response?.success || 'Sign in failed. Please try again.';
          toast.error(errorMessage);
        }
      }
      
      else if (authMode === 'forgotPassword') {
        const response = await sendPasswordResetEmail(formData.email);
        
        if (response.message === 'OTP sent successfully') {
          toast.success('OTP sent successfully. Please check your email.');
          setOtpPurpose('resetPassword');
          setShowOtpVerification(true);
        } else {
          toast.error(response.message || 'Failed to send OTP');
        }
      }
      
      else if (authMode === 'resetPassword') {
        if (formData.newPassword !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        
        const response = await resetPassword(formData.email, formData.newPassword);
        console.log('response response',response);
        
        if (response.success) {
          toast.success('Password reset successfully! Please login with your new password.');
          setAuthMode('login');
          setFormData({
            name: '',
            email: formData.email, // Keep email filled for login
            password: '',
            newPassword: '',
            confirmPassword: ''
          });
        } else {
          toast.error(response?.message || 'Failed to reset password');
        }
      }
  
    } catch (err: any) {
      console.error('Auth error:', err);
    
      // Extract backend message safely
      const message =
        err?.response?.data?.message ||
        'Something went wrong. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };
    
  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 4) {
      setError('Please enter all 4 digits of the OTP');
      return;
    }
    
    setIsLoading(true);
    try {
      if (otpPurpose === 'signup') {
        const response: { success: boolean; [key: string]: any } = await verifyOtpApi(otpString, formData);
        
        if (response?.success) {
          setShowOtpVerification(false);
          setShowSuccessMessage(true);
    
          let countdown = 3;
          setTimeLeft(countdown);
          const timer = setInterval(() => {
            countdown -= 1;
            setTimeLeft(countdown);
    
            if (countdown <= 0) {
              clearInterval(timer);
              setShowSuccessMessage(false);
              setAuthMode('login');
              setRegistrationComplete(true);
              toast.success("Sign up completed! Please log in with your credentials.");
            }
          }, 1000);
        }
      } 
      
      else if (otpPurpose === 'resetPassword') {
        const response = await verifyOtpForgetPass(otpString,formData.email);
        
        if (response?.success) {
          setShowOtpVerification(false);
          setAuthMode('resetPassword');
          toast.success("OTP verified. Please set your new password.");
        }
      }
    } catch (err: any) {
      console.error(err.response?.data?.message);
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResendOtp = async () => {
    setError('');
    setIsLoading(true);
    
    try {
      let response;
      if (otpPurpose === 'signup') {
        response = await sendSignupOtp(formData.email);
      } else {
        response = await sendPasswordResetEmail(formData.email);
      }
      
      if (response.message === 'OTP sent successfully') {
        toast.success('New OTP has been sent to your email.');
      } else {
        setError(response.message || 'Failed to resend OTP. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = (mode: 'signup' | 'login') => {
    setAuthMode(mode);
    setError('');
    setFormData({
      name: '',
      email: mode === 'login' && authMode === 'signup' ? formData.email : '', // Keep email if switching from signup to login
      password: '',
      newPassword: '',
      confirmPassword: ''
    });
    setShowOtpVerification(false);
    setOtp(['', '', '', '']);
  };

  const initiateForgotPassword = () => {
    setAuthMode('forgotPassword');
    setError('');
    setFormData(prev => ({
      ...prev,
      password: '',
      newPassword: '',
      confirmPassword: ''
    }));
  };

  const handleKeyPress = (index: number, e: React.KeyboardEvent) => {
    if (
      e.key === 'Backspace' &&
      !otp[index] &&
      index > 0 &&
      otpInputRefs[index - 1]?.current
    ) {
      (otpInputRefs[index - 1].current as unknown as HTMLInputElement).focus();
    }
  };
  
  const getTitle = () => {
    switch (authMode) {
      case 'signup': return 'Join Delivery Team';
      case 'login': return 'Welcome Back';
      case 'forgotPassword': return 'Reset Your Password';
      case 'resetPassword': return 'Set New Password';
      default: return 'Welcome';
    }
  };
  
  const getSubtitle = () => {
    switch (authMode) {
      case 'signup': return 'Create your account to start delivering';
      case 'login': return 'Sign in to your account';
      case 'forgotPassword': return 'Enter your email to receive a reset link';
      case 'resetPassword': return 'Create a new password for your account';
      default: return '';
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        {/* Header with back button when needed */}
        <div className="mb-6">
          {(authMode === 'forgotPassword' || authMode === 'resetPassword' || showOtpVerification) && (
            <button 
              onClick={() => {
                if (showOtpVerification) {
                  setShowOtpVerification(false);
                } else if (authMode === 'resetPassword') {
                  setAuthMode('forgotPassword');
                } else {
                  setAuthMode('login');
                }
              }}
              className="flex items-center text-sm text-blue-600 hover:text-blue-800 mb-4"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </button>
          )}
          
          <div className="text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-3">
              <Truck className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {getTitle()}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {getSubtitle()}
            </p>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        {/* Success message */}
        {showSuccessMessage && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center">
            <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0" />
            <div>
              {authMode === 'signup' ? 'Account created successfully!' : 'Login successful!'} 
              <span className="ml-1">Redirecting in {timeLeft}s...</span>
            </div>
          </div>
        )}
        
        {/* Registration complete message */}
        {authMode === 'login' && registrationComplete && !showSuccessMessage && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            Registration successful! Please login with your credentials.
          </div>
        )}

        {/* OTP Verification View */}
        {showOtpVerification ? (
          <div>
            <div className="text-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Verify Your Email</h3>
              <p className="text-gray-500 text-sm mt-1">
                We've sent a 4-digit code to {formData.email}
              </p>
            </div>
            
            <div className="flex justify-center gap-3 my-6">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  ref={otpInputRefs[index]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={otp[index]}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyPress(index, e)}
                  className="w-14 h-14 text-center text-2xl font-medium rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              ))}
            </div>
            
            <button
              onClick={handleVerifyOtp}
              disabled={isLoading || otp.join('').length !== 4}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center font-medium"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Verifying...
                </>
              ) : (
                'Verify OTP'
              )}
            </button>
            
            <div className="flex justify-between mt-4 text-sm">
              <button 
                onClick={() => setShowOtpVerification(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                Back
              </button>
              <button 
                onClick={handleResendOtp}
                disabled={isLoading}
                className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
              >
                Resend Code
              </button>
            </div>
          </div>
        ) : (
          /* Main Auth Form */
          <form onSubmit={handleSubmit}>
            {/* Name field - only for signup */}
            {authMode === 'signup' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="name">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            {/* Email field - shown in all modes except reset password */}
            {(authMode !== 'resetPassword') && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
            )}

            {/* Password field - for login and signup */}
            {(authMode === 'login' || authMode === 'signup') && (
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                    placeholder="••••••••"
                    minLength={6}
                  />
                </div>
              </div>
            )}

            {/* New password fields - for reset password */}
            {authMode === 'resetPassword' && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="newPassword">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={formData.newPassword}
                      onChange={handleChange}
                      required
                      className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                      placeholder="••••••••"
                      minLength={6}
                    />
                  </div>
                </div>
                
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="confirmPassword">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                      placeholder="••••••••"
                      minLength={6}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Forgot password link - only for login */}
            {authMode === 'login' && (
              <div className="flex items-center justify-end mb-5">
                <button 
                  type="button" 
                  onClick={initiateForgotPassword}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center shadow-md"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {authMode === 'signup' ? 'Creating Account...' : 
                   authMode === 'login' ? 'Signing In...' :
                   authMode === 'forgotPassword' ? 'Sending OTP...' :
                   'Resetting Password...'}
                </>
              ) : (
                <>
                  {authMode === 'signup' ? 'Create Account' : 
                   authMode === 'login' ? 'Sign In' :
                   authMode === 'forgotPassword' ? 'Send Reset Link' :
                   'Reset Password'}
                  <ArrowRight className="h-4 w-4 ml-1" />
                </>
              )}
            </button>

            {/* Social login options - only for login/signup */}
            {(authMode === 'login' || authMode === 'signup') && (
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="flex justify-center items-center py-2.5 px-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                      <path d="M1 1h22v22H1z" fill="none" />
                    </svg>
                    Google
                  </button>
                  <button
                    type="button"
                    className="flex justify-center items-center py-2.5 px-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <svg className="h-5 w-5 mr-2 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z" />
                    </svg>
                    Facebook
                  </button>
                </div>
              </div>
            )}

            {/* Toggle between signup and signin */}
            {(authMode === 'login' || authMode === 'signup') && (
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  {authMode === 'signup' ? 'Already have an account?' : 'Don\'t have an account?'}{' '}
                  <button
                    type="button"
                    onClick={() => toggleAuthMode(authMode === 'signup' ? 'login' : 'signup')}
                    className="font-medium text-blue-600 hover:text-blue-800"
                  >
                    {authMode === 'signup' ? 'Sign in' : 'Sign up'}
                  </button>
                </p>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default DeliveryBoyAuth;