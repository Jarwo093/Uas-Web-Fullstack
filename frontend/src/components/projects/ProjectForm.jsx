import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const ProjectForm = ({ project, onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: project?.name || '',
    description: project?.description || '',
    status: project?.status || 'active',
  });
  const [formError, setFormError] = useState(null);

  const isEditing = !!project;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name.trim()) {
      setFormError('Project name is required');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Project Name"
        value={formData.name}
        onChange={handleChange('name')}
        placeholder="Enter project name"
        required
      />

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          className="form-textarea"
          placeholder="Describe this project (optional)"
          value={formData.description}
          onChange={handleChange('description')}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Status</label>
        <select
          className="form-select"
          value={formData.status}
          onChange={handleChange('status')}
        >
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {formError && <div className="form-error mb-4">{formError}</div>}

      <div className="flex justify-end gap-3">
        <Button variant="secondary" type="button" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? (isEditing ? 'Saving...' : 'Creating...')
            : (isEditing ? 'Save Changes' : 'Create Project')}
        </Button>
      </div>
    </form>
  );
};
