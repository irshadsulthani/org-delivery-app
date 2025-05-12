// src/hooks/usePendingDeliveryBoys.ts
import { useState, useEffect } from 'react';
import { getPendingDeliveryBoys } from '../api/adminApi';

interface VerificationNotification {
  id: string;
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

  useEffect(() => {
    const fetchPendingDeliveryBoys = async () => {
      try {
        setLoading(true);
        const response = await getPendingDeliveryBoys();
        setPendingDeliveryBoys(response.data);
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

  return { pendingDeliveryBoys, loading, error, refetch };
};