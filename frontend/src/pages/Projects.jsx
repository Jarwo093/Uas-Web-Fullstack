import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Plus, Folder } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({ name: '', description: '', status: 'active' });
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/projects');
      if (response.data.success) {
        setProjects(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch projects', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    try {
      const response = await api.post('/projects', formData);
      if (response.data.success) {
        setProjects(prev => [response.data.data, ...prev]);
        setShowForm(false);
        setFormData({ name: '', description: '', status: 'active' });
      }
    } catch (error) {
      setFormError(error.response?.data?.message || 'Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header mb-xl">
        <div>
          <h1 className="text-heading-lg">Projects</h1>
          <p className="text-body-md">Manage all company projects.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-xs">
          <Plus size={18} />
          {showForm ? 'Cancel' : 'New Project'}
        </Button>
      </div>

      {showForm && (
        <div className="card-product-feature mb-xl">
          <h2 className="text-heading-sm mb-md">Create New Project</h2>
          <form onSubmit={handleCreateProject}>
            <div className="grid-cards">
              <Input
                label="Project Name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <div className="form-group">
                <label className="form-label">Status</label>
                <select 
                  className="text-input"
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="text-input"
                style={{ height: '100px', resize: 'vertical' }}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            
            {formError && <div className="input-error-message mb-md">{formError}</div>}
            
            <div className="flex justify-end">
              <Button type="submit" variant="buy-cta" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Project'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="text-body-md">Loading projects...</div>
      ) : (
        <div className="grid-cards">
          {projects.map(project => (
            <div key={project.id} className="why-buy-tile flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-sm">
                  <div className="flex items-center gap-sm">
                    <Folder size={20} color="var(--primary)" />
                    <h3 className="text-subtitle-lg">{project.name}</h3>
                  </div>
                  <Badge variant={project.status === 'active' ? 'success' : 'neutral'}>
                    {project.status}
                  </Badge>
                </div>
                <p className="text-body-sm mt-md">
                  {project.description || 'No description provided.'}
                </p>
              </div>
              <div className="mt-xl pt-md text-caption-bold" style={{ borderTop: '1px solid var(--hairline-soft)' }}>
                {project.tasks_count} Tasks
              </div>
            </div>
          ))}
          {projects.length === 0 && !showForm && (
            <div className="text-body-md col-span-full">No projects found.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Projects;
