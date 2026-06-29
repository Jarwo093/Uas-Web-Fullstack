import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const useDashboard = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    await Promise.resolve();
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/dashboard');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return { stats, isLoading, error, refetch: fetchDashboard };
};
