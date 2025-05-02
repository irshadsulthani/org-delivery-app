import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(''); // Clear error on email change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Reset error before submission

    try {
      // Replace with your password reset API call
      // await sendPasswordResetLink(email);

      // Simulate success response (you can remove this when implementing real API)
      toast.success("Password reset link sent to your email!", {
        position: "top-right",
        autoClose: 5000
      });

      onClose(); // Close modal after successful request
    } catch (error: any) {
      console.error("Password reset failed:", error);
      const errorMessage = error.response?.data?.message || "Failed to send password reset link. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000
      });
    } finally {
      setLoading(false); // Set loading to false after request
    }
  };

  if (!isOpen) return null; // Don't render modal if not open

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md mx-auto p-6 shadow-xl">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Forgot Password</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
              placeholder="Enter your email"
            />
          </div>
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full text-white font-medium py-3 px-4 rounded-lg transition duration-300 flex justify-center items-center"
            style={{ backgroundColor: '#51C8BC' }}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </span>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 font-medium text-sm hover:underline"
          >
            Cancel
          </button>
        </div>
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
};

export default ForgotPasswordModal;
