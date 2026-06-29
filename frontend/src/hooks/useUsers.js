import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const useUsers = ({ enabled = true } = {}) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    await Promise.resolve();
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/users');
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      fetchUsers();
    } else {
      setIsLoading(false);
    }
  }, [fetchUsers, enabled]);

  return { users, isLoading, error };
};
