import { useState, useEffect, FormEvent } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle, ArrowLeft, LogIn } from 'lucide-react';
import { toast } from 'react-toastify';
import { loginReatiler, sendSignupOtp, verifySignupOtp } from '../../api/reatilerApi';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setReatiler } from '../../slice/reatilerSlice';

const RetailerSignUp = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showOtp, setShowOtp] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch()
  
  // Form states
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  
  useEffect(() => {
    let interval: any;  
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
    }
    
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  // Effect to show login screen after successful verification
  useEffect(() => {
    if (verificationSuccess) {
      const timeout = setTimeout(() => {
        setShowOtp(false);
        setIsLogin(true);
        setVerificationSuccess(false);
        // Reset the form data except email for easier login
        setFormData(prev => ({
          ...prev,
          password: '',
          name: ''
        }));
      }, 2000);
      
      return () => clearTimeout(timeout);
    }
  }, [verificationSuccess]);
  
  const handleChange = (e: FormEvent) => {
    e.preventDefault();
    const { name, value } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Create FormData object
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, value);
      });
      
      // In a real app, you would send this form data to your API
      if (isLogin) {
        const email = formData.email;
        const password = formData.password;
        const response = await loginReatiler({ email, password });
        console.log(response.data);
        
        dispatch(setReatiler({
          email : response.userData.email,
          role : response.userData.role,
          name : response.userData.name
        }))
        toast.success('Login successful!');
        navigate('/retailer/dashboard');
      } else {
        await handleSendOtp();
      }
      
    } catch (error:any) {
      toast.error(error.response?.data?.message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle OTP send
  const handleSendOtp = async () => {
    try {
      await sendSignupOtp(formData.email);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowOtp(true);
      setTimer(30);
      setIsTimerRunning(true);
      setOtp(['', '', '', '']);
      
      toast.success(`OTP sent to ${formData.email}`);
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.');
      console.error(error);
    }
  };
  
  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.charAt(0);
    }
    
    if (isNaN(Number(value)) && value !== '') {
      return;
    }
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto focus to next input
    if (value !== '' && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };
  
  // Handle OTP verification
  const handleVerifyOtp = async () => {
    setIsLoading(true);
    
    try {
      const enteredOtp = otp.join('');
      
      if (enteredOtp.length !== 4) {
        toast.error('Please enter a complete OTP');
        setIsLoading(false);
        return;
      }
      
      const response = await verifySignupOtp(enteredOtp, formData);
      
      if (response.success) {
        toast.success('Account created successfully! Redirecting to login...');
        setVerificationSuccess(true);
      } else {
        toast.error(response.message || 'Invalid OTP. Please try again.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Verification failed. Please try again.');
      console.error('OTP verification error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResendOtp = () => {
    if (!isTimerRunning) {
      handleSendOtp();
    }
  };
  
  // Toggle between login and signup
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setShowOtp(false);
    setFormData({
      email: '',
      password: '',
      name: '',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {!showOtp ? (
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 transform transition-all duration-300 hover:shadow-xl">
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="h-16 w-16 bg-blue-600 rounded-full mx-auto flex items-center justify-center mb-4">
                  <User size={32} className="text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {isLogin ? 'Welcome Back' : 'Join Us'}
                </h1>
                <p className="text-gray-500 mt-2">
                  {isLogin 
                    ? 'Log in to your retailer account' 
                    : 'Create your retailer account today'}
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-1 ml-1 group-focus-within:text-blue-600 transition-colors">
                      Business Name
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                        <User size={18} />
                      </span>
                      <input
                        type="text"
                        name="name"
                        className="w-full py-3 pl-10 pr-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Acme Retail"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                )}
                
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1 group-focus-within:text-blue-600 transition-colors">
                    Email
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                      <Mail size={18} />
                    </span>
                    <input
                      type="email"
                      name="email"
                      className="w-full py-3 pl-10 pr-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1 group-focus-within:text-blue-600 transition-colors">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                      <Lock size={18} />
                    </span>
                    <input
                      type={passwordVisible ? 'text' : 'password'}
                      name="password"
                      className="w-full py-3 pl-10 pr-10 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                    >
                      {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                {isLogin && (
                  <div className="flex justify-end">
                    <button 
                      type="button"
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:translate-y-[-1px] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
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
                    <>
                      <span>{isLogin ? 'Log In' : 'Create Account'}</span>
                      <ArrowRight size={18} className="ml-2" />
                    </>
                  )}
                </button>
              </form>
            </div>
            
            <div className="py-4 bg-gray-50 text-center border-t border-gray-100">
              <p className="text-sm text-gray-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  type="button"
                  className="text-blue-600 font-medium hover:text-blue-800 transition-colors"
                  onClick={toggleAuthMode}
                >
                  {isLogin ? 'Sign up' : 'Log in'}
                </button>
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 transform transition-all duration-300 hover:shadow-xl">
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="h-16 w-16 bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-full mx-auto flex items-center justify-center mb-4">
                  <Mail size={28} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {verificationSuccess ? 'Verification Complete!' : 'OTP Verification'}
                </h1>
                <p className="text-gray-500 mt-2">
                  {verificationSuccess 
                    ? 'Account created successfully! Redirecting to login...'
                    : <>We've sent a verification code to<br /><span className="font-medium text-gray-800">{formData.email}</span></>
                  }
                </p>
              </div>
              
              {verificationSuccess ? (
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle size={32} className="text-green-600" />
                    </div>
                    <div className="absolute animate-ping h-16 w-16 rounded-full bg-green-200 opacity-75"></div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <div className="flex justify-center space-x-3">
                      {[0, 1, 2, 3].map((index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          maxLength={1}
                          className="w-14 h-14 text-center text-xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white shadow-sm"
                          value={otp[index]}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Backspace' && !otp[index] && index > 0) {
                              const previousInput = document.getElementById(`otp-${index - 1}`);
                              if (previousInput) {
                                previousInput.focus();
                              }
                            }
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center mb-6 transition-all duration-300 transform hover:translate-y-[-1px] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                    onClick={handleVerifyOtp}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verifying...
                      </span>
                    ) : (
                      <>
                        <CheckCircle size={18} className="mr-2" />
                        Verify OTP
                      </>
                    )}
                  </button>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">
                      Didn't receive the code?
                    </p>
                    <button
                      type="button"
                      className={`text-sm font-medium transition-colors ${
                        isTimerRunning
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-blue-600 hover:text-blue-800'
                      }`}
                      onClick={handleResendOtp}
                      disabled={isTimerRunning}
                    >
                      {isTimerRunning
                        ? `Resend OTP in ${timer}s`
                        : 'Resend OTP'}
                    </button>
                  </div>
                </>
              )}
            </div>
            
            <div className="py-4 bg-gray-50 text-center border-t border-gray-100">
              <button
                type="button"
                className="text-sm text-gray-600 hover:text-gray-800 transition-colors flex items-center justify-center mx-auto"
                onClick={() => setShowOtp(false)}
                disabled={verificationSuccess}
              >
                <ArrowLeft size={16} className="mr-1" />
                Go back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RetailerSignUp;