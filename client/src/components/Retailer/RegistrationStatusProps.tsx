import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { AlertCircle, CheckCircle, X, XCircle, Clock } from 'lucide-react';
import { getRegistrationStatus } from '../../api/reatilerApi';

interface RegistrationStatusProps {
  onDismiss?: () => void;
  onActionClick?: () => void;
}

interface StatusData {
  registrationCompleted: boolean;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
}

const RegistrationStatus: React.FC<RegistrationStatusProps> = ({ onDismiss, onActionClick }) => {
  const [statusData, setStatusData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const userEmail = useSelector((state: RootState) => state.retailer.retailer?.email);

  useEffect(() => {
    const fetchRegistrationStatus = async () => {
      if (!userEmail) return;
      
      try {
        setLoading(true);
        const response = await getRegistrationStatus(userEmail);
        console.log('response',response,'response');
        
        setStatusData(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch registration status:', err);
        setError('Failed to fetch registration status');
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrationStatus();
  }, [userEmail]);

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-6 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading registration status...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg shadow-sm p-4 mb-6 flex items-center">
        <AlertCircle className="text-red-500 mr-3" size={20} />
        <div className="text-red-700 flex-1">
          {error}
        </div>
        {onDismiss && (
          <button 
            onClick={onDismiss}
            className="p-1 text-gray-500 hover:text-gray-700"
          >
            <X size={16} />
          </button>
        )}
      </div>
    );
  }

  if (!statusData) return null;

  if (!statusData.registrationCompleted) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center">
          <AlertCircle className="text-yellow-500 mr-3" size={20} />
          <div className="flex-1">
            <h3 className="font-medium text-yellow-800">Registration Incomplete</h3>
            <p className="text-yellow-700 text-sm mt-1">
              Your shop registration is incomplete. Please complete your registration to start selling on our platform.
            </p>
          </div>
          {onDismiss && (
            <button 
              onClick={onDismiss}
              className="p-1 text-gray-500 hover:text-gray-700"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <div className="mt-3">
          <button 
            className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-md text-sm font-medium hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-sm"
            onClick={onActionClick}
          >
            Complete Registration
          </button>
        </div>
      </div>
    );
  }

  if (statusData.verificationStatus === 'pending') {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center">
          <Clock className="text-blue-500 mr-3" size={20} />
          <div className="flex-1">
            <h3 className="font-medium text-blue-800">Verification Pending</h3>
            <p className="text-blue-700 text-sm mt-1">
              Your shop registration is complete. Our team is reviewing your information. 
              You'll be notified once verification is complete.
            </p>
          </div>
          {onDismiss && (
            <button 
              onClick={onDismiss}
              className="p-1 text-gray-500 hover:text-gray-700"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
    );
  }

  if (statusData.verificationStatus === 'rejected') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center">
          <XCircle className="text-red-500 mr-3" size={20} />
          <div className="flex-1">
            <h3 className="font-medium text-red-800">Registration Rejected</h3>
            <p className="text-red-700 text-sm mt-1">
              {statusData.rejectionReason || 'Your shop registration has been rejected. Please update your information and submit again.'}
            </p>
          </div>
          {onDismiss && (
            <button 
              onClick={onDismiss}
              className="p-1 text-gray-500 hover:text-gray-700"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <div className="mt-3">
          <button 
            className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-md text-sm font-medium hover:from-red-600 hover:to-red-700 transition-all shadow-sm"
            onClick={onActionClick}
          >
            Update Registration
          </button>
        </div>
      </div>
    );
  }

  if (statusData.verificationStatus === 'approved') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center">
          <CheckCircle className="text-green-500 mr-3" size={20} />
          <div className="flex-1">
            <h3 className="font-medium text-green-800">Registration Approved</h3>
            <p className="text-green-700 text-sm mt-1">
              Your shop registration has been approved. You can now start selling on our platform.
            </p>
          </div>
          {onDismiss && (
            <button 
              onClick={onDismiss}
              className="p-1 text-gray-500 hover:text-gray-700"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default RegistrationStatus;