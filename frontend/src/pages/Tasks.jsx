import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Plus, CheckCircle, Clock, Circle } from 'lucide-react';

const Tasks = () => {
  const { isAdmin, user: authUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]); // Real app would have a GET /api/users endpoint
  const [isLoading, setIsLoading] = useState(true);
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ project_id: '', user_id: '', title: '', status: 'todo' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/tasks');
      if (response.data.success) {
        setTasks(response.data.data);
      }
      
      // If admin, fetch projects to populate dropdowns
      // Note: A real app would need a user list endpoint to populate 'user_id', 
      // but we will mock a few or use hardcoded IDs for the sake of the boilerplate if no endpoint exists.
      // Assuming GET /api/projects exists
      if (isAdmin) {
        const projRes = await api.get('/projects');
        if (projRes.data.success) {
          setProjects(projRes.data.data);
          if (projRes.data.data.length > 0) {
             setFormData(prev => ({...prev, project_id: projRes.data.data[0].id}));
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [isAdmin]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const response = await api.put(`/tasks/${taskId}/status`, { status: newStatus });
      if (response.data.success) {
        setTasks(prev => prev.map(t => t.id === taskId ? response.data.data : t));
      }
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Hardcoding user_id to 2 (Alice) as a fallback if no select is used
      const payload = { ...formData, user_id: formData.user_id || 2 };
      const response = await api.post('/tasks', payload);
      if (response.data.success) {
        setTasks(prev => [response.data.data, ...prev]);
        setShowForm(false);
        setFormData(prev => ({ ...prev, title: '', status: 'todo' }));
      }
    } catch (error) {
      console.error('Failed to create task', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'done': return <CheckCircle size={18} color="var(--success)" />;
      case 'in_progress': return <Clock size={18} color="var(--attention)" />;
      default: return <Circle size={18} color="var(--stone)" />;
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'done': return <Badge variant="success">Done</Badge>;
      case 'in_progress': return <Badge variant="attention">In Progress</Badge>;
      default: return <Badge variant="neutral">To Do</Badge>;
    }
  };

  return (
    <div>
      <div className="page-header mb-xl">
        <div>
          <h1 className="text-heading-lg">Tasks</h1>
          <p className="text-body-md">
            {isAdmin ? 'Manage all tasks across the organization.' : 'Manage your assigned tasks.'}
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-xs">
            <Plus size={18} />
            {showForm ? 'Cancel' : 'New Task'}
          </Button>
        )}
      </div>

      {showForm && isAdmin && (
        <div className="card-checkout-summary mb-xl">
          <h2 className="text-heading-sm mb-md">Assign New Task</h2>
          <form onSubmit={handleCreateTask}>
            <div className="grid-cards">
              <Input
                label="Task Title"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <div className="form-group">
                <label className="form-label">Project</label>
                <select 
                  className="text-input"
                  value={formData.project_id}
                  onChange={e => setFormData({ ...formData, project_id: e.target.value })}
                  required
                >
                  <option value="" disabled>Select Project</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end mt-md">
              <Button type="submit" variant="buy-cta" disabled={isSubmitting}>
                {isSubmitting ? 'Assigning...' : 'Assign Task'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="text-body-md">Loading tasks...</div>
      ) : (
        <div className="flex flex-col gap-md">
          {tasks.map(task => (
            <div key={task.id} className="card-icon-feature flex items-center justify-between">
              <div className="flex items-center gap-lg">
                {getStatusIcon(task.status)}
                <div>
                  <h3 className="text-subtitle-lg">{task.title}</h3>
                  <div className="text-body-sm flex gap-sm mt-xs">
                    <span style={{color: 'var(--primary)'}}>{task.project?.name}</span>
                    <span>•</span>
                    <span>Assigned to: {task.user?.name}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-md">
                {getStatusBadge(task.status)}
                
                {/* Status Toggle Dropdown (only if owner or admin) */}
                {(isAdmin || task.user_id === authUser.id) && (
                  <select 
                    className="button-pill-tab"
                    style={{ outline: 'none', cursor: 'pointer' }}
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                )}
              </div>
            </div>
          ))}
          
          {tasks.length === 0 && (
            <div className="card-product-feature text-center">
              <CheckCircle size={48} color="var(--hairline)" className="mx-auto mb-md" />
              <h3 className="text-heading-sm">No tasks found</h3>
              <p className="text-body-md mt-sm">You're all caught up!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Tasks;
