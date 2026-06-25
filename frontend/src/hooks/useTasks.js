import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [meta, setMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const [filters, setFilters] = useState({
    page: 1,
    search: '',
    status: '',
    project_id: '',
    priority: '',
  });

  const fetchTasks = useCallback(async (filterOverrides = {}) => {
    await Promise.resolve();
    setIsLoading(true);
    setError(null);
    const params = { ...filters, ...filterOverrides };

    // Clean empty params
    const cleanParams = {};
    Object.entries(params).forEach(([key, val]) => {
      if (val !== '' && val !== null && val !== undefined) {
        cleanParams[key] = val;
      }
    });

    try {
      const response = await api.get('/tasks', { params: cleanParams });
      if (response.data.success) {
        setTasks(response.data.data);
        setMeta(response.data.meta);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: key === 'page' ? value : 1 }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ page: 1, search: '', status: '', project_id: '', priority: '' });
  }, []);

  const createTask = async (data) => {
    const response = await api.post('/tasks', data);
    if (response.data.success) {
      await fetchTasks();
      return response.data;
    }
    throw new Error(response.data.message);
  };

  const updateTask = async (taskId, data) => {
    const response = await api.put(`/tasks/${taskId}`, data);
    if (response.data.success) {
      setTasks(prev => prev.map(t => t.id === taskId ? response.data.data : t));
      return response.data;
    }
    throw new Error(response.data.message);
  };

  const deleteTask = async (taskId) => {
    const response = await api.delete(`/tasks/${taskId}`);
    if (response.data.success) {
      await fetchTasks();
      return response.data;
    }
    throw new Error(response.data.message);
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    const response = await api.put(`/tasks/${taskId}/status`, { status: newStatus });
    if (response.data.success) {
      setTasks(prev => prev.map(t => t.id === taskId ? response.data.data : t));
      return response.data;
    }
    throw new Error(response.data.message);
  };

  const getTaskDetail = async (taskId) => {
    const response = await api.get(`/tasks/${taskId}`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message);
  };

  return {
    tasks,
    meta,
    isLoading,
    error,
    filters,
    updateFilter,
    resetFilters,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    getTaskDetail,
    refetch: fetchTasks,
  };
};
