// src/hooks/usePendingDeliveryBoys.ts
import { useState, useEffect } from 'react';
import { getPendingDeliveryBoys, approveDeliveryBoy, rejectDeliveryBoy } from '../api/adminApi';

interface VerificationNotification {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  profileImageUrl?: string;
  verificationImageUrl?: string;
}

export const usePendingDeliveryBoys = () => {
  const [pendingDeliveryBoys, setPendingDeliveryBoys] = useState<VerificationNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);

  const refetch = () => {
    setRefreshCount(prev => prev + 1);
  };

  const handleApprove = async (id: string) => {
    try {
      await approveDeliveryBoy(id);
      refetch();
    } catch (err) {
      setError('Failed to approve delivery boy');
      console.error('Error approving delivery boy:', err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectDeliveryBoy(id);
      refetch();
    } catch (err) {
      setError('Failed to reject delivery boy');
      console.error('Error rejecting delivery boy:', err);
    }
  };

  useEffect(() => {
    const fetchPendingDeliveryBoys = async () => {
      try {
        setLoading(true);
        const data = await getPendingDeliveryBoys();
        setPendingDeliveryBoys(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch pending delivery boys');
        console.error('Error fetching pending delivery boys:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingDeliveryBoys();
  }, [refreshCount]);

  return { 
    pendingDeliveryBoys, 
    loading, 
    error, 
    refetch,
    handleApprove,
    handleReject
  };
};