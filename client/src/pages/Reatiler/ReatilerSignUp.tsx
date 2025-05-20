import { useState, useEffect, FormEvent } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import {
  loginReatiler,
  sendSignupOtp,
  verifySignupOtp,
} from "../../api/reatilerApi";
import {
  resetPassword,
  sendPasswordResetEmail,
  verifyOtpForgetPass,
} from "../../api/userApi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setReatiler } from "../../slice/reatilerSlice";
import { toast } from "react-toastify";

type AuthMode =
  | "login"
  | "signup"
  | "forgotPassword"
  | "resetPassword"
  | "verifyOtp"
  | "verifyForgotPassword";

const RetailerAuth = () => {
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Form states
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    newPassword: "",
    confirmPassword: "",
  });

  // OTP states
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  useEffect(() => {
    let interval: number | undefined;
    if (isTimerRunning && timer > 0) {
      interval = window.setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timer]);

  // Effect to show login screen after successful verification
  useEffect(() => {
    if (verificationSuccess && authMode === "verifyOtp") {
      const timeout = setTimeout(() => {
        setAuthMode("login");
        setVerificationSuccess(false);
        // Reset the form data except email for easier login
        setFormData((prev) => ({
          ...prev,
          password: "",
          name: "",
        }));
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [verificationSuccess, authMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { email, password, newPassword, confirmPassword } = formData;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!email || !emailRegex.test(email)) {
        toast.error("Please enter a valid email address");
        setIsLoading(false);
        return;
      }

      if (authMode === "login") {
        if (!password || password.length < 6 || password.trim() === "") {
          toast.error("Password must be at least 6 characters");
          setIsLoading(false);
          return;
        }

        const response = await loginReatiler({ email, password });
        
        // Check if user is blocked
        if (response.userData?.isBlocked) {
          toast.error("Your account has been blocked. Please contact support.");
          navigate("/retailer/sign-up");
          return;
        }

        dispatch(
          setReatiler({
            email: response.userData.email,
            role: response.userData.role,
            name: response.userData.name,
          })
        );
        
        toast.success("Login successful! Redirecting to dashboard...");
        navigate("/retailer/dashboard");
      } else if (authMode === "signup") {
        if (!formData.name || formData.name.length < 3 || formData.name.trim() === "") {
          toast.error("Name must be at least 3 characters");
          setIsLoading(false);
          return;
        }

        if (!password || password.trim() === "") {
          toast.error("Password is required");
          setIsLoading(false);
          return;
        }

        const trimmedPassword = password.trim();
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

        if (!strongPasswordRegex.test(trimmedPassword)) {
          toast.error(
            "Password must contain:\n- 8+ characters\n- Uppercase letter\n- Lowercase letter\n- Number\n- Special character"
          );
          setIsLoading(false);
          return;
        }

        await handleSendOtp("signup");
        toast.success("OTP sent successfully! Please verify your email");
      } else if (authMode === "forgotPassword") {
        await handleSendOtp("forgotPassword");
        toast.success("Password reset OTP sent to your email");
      } else if (authMode === "resetPassword") {
        if (!newPassword || !confirmPassword) {
          toast.error("Both password fields are required");
          setIsLoading(false);
          return;
        }

        if (newPassword.length < 6) {
          toast.error("Password must be at least 6 characters");
          setIsLoading(false);
          return;
        }

        if (newPassword !== confirmPassword) {
          toast.error("Passwords don't match");
          setIsLoading(false);
          return;
        }

        const response = await resetPassword(email, newPassword);
        if (response.success) {
          toast.success("Password reset successfully! You can now login");
          setAuthMode("login");
          setFormData((prev) => ({
            ...prev,
            password: "",
            newPassword: "",
            confirmPassword: "",
          }));
        }
      }
    } catch (error: any) {
      console.log(error);
      
      if (error.status === 401) {
        toast.error("Your account has been blocked. Please contact support.");
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred. Please try again later.");
      }
      console.error("Auth error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP send
  const handleSendOtp = async (purpose: "signup" | "forgotPassword") => {
    try {
      if (purpose === "signup") {
        await sendSignupOtp(formData.email);
        setAuthMode("verifyOtp");
      } else {
        await sendPasswordResetEmail(formData.email);
        setAuthMode("verifyForgotPassword");
      }

      setTimer(30);
      setIsTimerRunning(true);
      setOtp(["", "", "", ""]);

      toast.success(`OTP sent to ${formData.email}`);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to send OTP. Please try again."
      );
      console.error(error);
    }
  };

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.charAt(0);
    }

    if (isNaN(Number(value))) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus to next input
    if (value !== "" && index < 3) {
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
      const enteredOtp = otp.join("");

      if (enteredOtp.length !== 4) {
        toast.error("Please enter a complete OTP");
        setIsLoading(false);
        return;
      }

      if (authMode === "verifyOtp") {
        const response = await verifySignupOtp(enteredOtp, formData);

        if (response.success) {
          localStorage.setItem("formData", JSON.stringify(formData));
          toast.success(
            "Account created successfully! Please complete your retailer profile."
          );
          navigate("/retailer/register-retailer"); // Fixed path (added leading slash)
          setVerificationSuccess(true);

          // Clear OTP fields after successful verification
          setOtp(["", "", "", ""]);
        } else {
          toast.error(response.message || "Invalid OTP. Please try again.");
        }
      } else if (authMode === "verifyForgotPassword") {
        const response = await verifyOtpForgetPass(enteredOtp, formData.email);

        if (response.success) {
          toast.success("OTP verified successfully");
          setAuthMode("resetPassword");

          // Clear OTP fields after successful verification
          setOtp(["", "", "", ""]);
        } else {
          toast.error(response.message || "Invalid OTP. Please try again.");
        }
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Verification failed. Please try again."
      );
      console.error("OTP verification error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = () => {
    if (!isTimerRunning) {
      if (authMode === "verifyOtp" || authMode === "verifyForgotPassword") {
        const purpose = authMode === "verifyOtp" ? "signup" : "forgotPassword";
        handleSendOtp(purpose);
      }
    }
  };

  const getTitle = () => {
    switch (authMode) {
      case "login":
        return "Welcome Back";
      case "signup":
        return "Join Us";
      case "forgotPassword":
        return "Reset Password";
      case "resetPassword":
        return "Set New Password";
      case "verifyOtp":
        return "Verify OTP";
      case "verifyForgotPassword":
        return "Verify OTP";
      default:
        return "";
    }
  };

  const getSubtitle = () => {
    switch (authMode) {
      case "login":
        return "Log in to your retailer account";
      case "signup":
        return "Create your retailer account today";
      case "forgotPassword":
        return "Enter your email to receive a reset link";
      case "resetPassword":
        return "Create a new password for your account";
      case "verifyOtp":
      case "verifyForgotPassword":
        return `We've sent a verification code to ${formData.email}`;
      default:
        return "";
    }
  };

  const getFormContent = () => {
    switch (authMode) {
      case "login":
      case "signup":
        return (
          <>
            {authMode === "signup" && (
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-1 ml-1 group-focus-within:text-blue-600 transition-colors">
                  Name
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
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  className="w-full py-3 pl-10 pr-10 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
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

            {authMode === "login" && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  onClick={() => setAuthMode("forgotPassword")}
                >
                  Forgot password?
                </button>
              </div>
            )}
          </>
        );

      case "forgotPassword":
        return (
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
        );

      case "resetPassword":
        return (
          <>
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1 group-focus-within:text-blue-600 transition-colors">
                New Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                  <Lock size={18} />
                </span>
                <input
                  type={passwordVisible ? "text" : "password"}
                  name="newPassword"
                  className="w-full py-3 pl-10 pr-10 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="••••••••"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  minLength={6}
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

            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1 group-focus-within:text-blue-600 transition-colors">
                Confirm New Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                  <Lock size={18} />
                </span>
                <input
                  type={passwordVisible ? "text" : "password"}
                  name="confirmPassword"
                  className="w-full py-3 pl-10 pr-10 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </div>
            </div>
          </>
        );

      case "verifyOtp":
      case "verifyForgotPassword":
        return (
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
                      if (e.key === "Backspace" && !otp[index] && index > 0) {
                        const previousInput = document.getElementById(
                          `otp-${index - 1}`
                        );
                        if (previousInput) {
                          previousInput.focus();
                        }
                      }
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Didn't receive the code?
              </p>
              <button
                type="button"
                className={`text-sm font-medium transition-colors ${
                  isTimerRunning
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-blue-600 hover:text-blue-800"
                }`}
                onClick={handleResendOtp}
                disabled={isTimerRunning}
              >
                {isTimerRunning ? `Resend OTP in ${timer}s` : "Resend OTP"}
              </button>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const getButtonText = () => {
    switch (authMode) {
      case "login":
        return "Log In";
      case "signup":
        return "Create Account";
      case "forgotPassword":
        return "Send Reset Link";
      case "resetPassword":
        return "Reset Password";
      case "verifyOtp":
      case "verifyForgotPassword":
        return "Verify OTP";
      default:
        return "";
    }
  };

  const getFooterContent = () => {
    if (authMode === "verifyOtp" || authMode === "verifyForgotPassword") {
      return null;
    }

    if (authMode === "forgotPassword" || authMode === "resetPassword") {
      return (
        <button
          type="button"
          className="text-sm text-gray-600 hover:text-gray-800 transition-colors flex items-center justify-center mx-auto"
          onClick={() => setAuthMode("login")}
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to login
        </button>
      );
    }

    return (
      <p className="text-sm text-gray-600">
        {authMode === "login"
          ? "Don't have an account? "
          : "Already have an account? "}
        <button
          type="button"
          className="text-blue-600 font-medium hover:text-blue-800 transition-colors"
          onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}
        >
          {authMode === "login" ? "Sign up" : "Log in"}
        </button>
      </p>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 transform transition-all duration-300 hover:shadow-xl">
          <div className="p-8">
            <div className="text-center mb-8">
              <div
                className={`h-16 w-16 ${
                  authMode === "verifyOtp" ||
                  authMode === "verifyForgotPassword" ||
                  authMode === "forgotPassword"
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600"
                    : "bg-blue-600"
                } rounded-full mx-auto flex items-center justify-center mb-4`}
              >
                {authMode === "verifyOtp" ||
                authMode === "verifyForgotPassword" ||
                authMode === "forgotPassword" ? (
                  <Mail size={28} className="text-white" />
                ) : (
                  <User size={32} className="text-white" />
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {getTitle()}
              </h1>
              <p className="text-gray-500 mt-2">{getSubtitle()}</p>
            </div>

            {verificationSuccess && authMode === "verifyOtp" ? (
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle size={32} className="text-green-600" />
                  </div>
                  <div className="absolute animate-ping h-16 w-16 rounded-full bg-green-200 opacity-75"></div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {getFormContent()}

                {authMode !== "verifyOtp" &&
                  authMode !== "verifyForgotPassword" && (
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:translate-y-[-1px] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        <>
                          <span>{getButtonText()}</span>
                          <ArrowRight size={18} className="ml-2" />
                        </>
                      )}
                    </button>
                  )}

                {(authMode === "verifyOtp" ||
                  authMode === "verifyForgotPassword") && (
                  <button
                    type="button"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center mb-6 transition-all duration-300 transform hover:translate-y-[-1px] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                    onClick={handleVerifyOtp}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
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
                )}
              </form>
            )}
          </div>

          <div className="py-4 bg-gray-50 text-center border-t border-gray-100">
            {getFooterContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetailerAuth;
