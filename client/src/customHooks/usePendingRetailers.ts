// src/hooks/usePendingRetailers.ts
import { useState, useEffect } from 'react';
import { getPendingRetailers, approveRetailer, rejectRetailer } from '../api/adminApi';

interface RetailerShopNotification {
  _id: string;
  userId: string;
  shopName: string;
  description?: string;
  shopImageUrl: string;
  shopLicenseUrl: string;
  address: {
    street: string;
    area: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  rating: number;
  isVerified: boolean;
  createdAt: Date;
}

export const usePendingRetailers = () => {
  const [pendingRetailers, setPendingRetailers] = useState<RetailerShopNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);

  const refetch = () => {
    setRefreshCount(prev => prev + 1);
  };

  const handleApprove = async (id: string) => {
    try {
      await approveRetailer(id);
      refetch();
    } catch (err) {
      setError('Failed to approve retailer');
      console.error('Error approving retailer:', err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectRetailer(id);
      refetch();
    } catch (err) {
      setError('Failed to reject retailer');
      console.error('Error rejecting retailer:', err);
    }
  };

  useEffect(() => {
    const fetchPendingRetailers = async () => {
      try {
        setLoading(true);
        const data = await getPendingRetailers();
        setPendingRetailers(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch pending retailers');
        console.error('Error fetching pending retailers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingRetailers();
  }, [refreshCount]);

  return { 
    pendingRetailers, 
    loading, 
    error, 
    refetch,
    handleApprove,
    handleReject
  };
};