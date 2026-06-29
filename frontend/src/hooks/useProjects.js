import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const useProjects = ({ enabled = true } = {}) => {
  const [projects, setProjects] = useState([]);
  const [meta, setMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const fetchProjects = useCallback(async (pageNum = 1) => {
    await Promise.resolve();
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/projects', { params: { page: pageNum } });
      if (response.data.success) {
        setProjects(response.data.data);
        setMeta(response.data.meta);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      fetchProjects(page);
    } else {
      setIsLoading(false);
    }
  }, [fetchProjects, page, enabled]);

  const createProject = async (data) => {
    const response = await api.post('/projects', data);
    if (response.data.success) {
      await fetchProjects(page);
      return response.data;
    }
    throw new Error(response.data.message);
  };

  const updateProject = async (id, data) => {
    const response = await api.put(`/projects/${id}`, data);
    if (response.data.success) {
      setProjects(prev =>
        prev.map(p => p.id === id ? response.data.data : p)
      );
      return response.data;
    }
    throw new Error(response.data.message);
  };

  const deleteProject = async (id) => {
    const response = await api.delete(`/projects/${id}`);
    if (response.data.success) {
      await fetchProjects(page);
      return response.data;
    }
    throw new Error(response.data.message);
  };

  return {
    projects,
    meta,
    isLoading,
    error,
    page,
    setPage,
    createProject,
    updateProject,
    deleteProject,
    refetch: () => fetchProjects(page),
  };
};
