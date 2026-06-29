import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const TaskForm = ({ projects, users, onSubmit, onCancel, isSubmitting, initialData }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    project_id: initialData?.project_id || projects[0]?.id || '',
    user_id: initialData?.user_id || users[0]?.id || '',
    priority: initialData?.priority || 'medium',
    due_date: initialData?.due_date || '',
    status: initialData?.status || 'todo',
  });
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.title.trim()) {
      setFormError('Task title is required');
      return;
    }
    if (!formData.project_id) {
      setFormError('Please select a project');
      return;
    }
    if (!formData.user_id) {
      setFormError('Please select an assignee');
      return;
    }

    try {
      await onSubmit(formData);
      if (!initialData) {
        setFormData({
          title: '', description: '', project_id: projects[0]?.id || '',
          user_id: users[0]?.id || '', priority: 'medium', due_date: '', status: 'todo',
        });
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save task');
    }
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="card mb-6">
      <h2 className="text-heading-sm mb-5">{initialData ? 'Edit Task' : 'Assign New Task'}</h2>
      <form onSubmit={handleSubmit}>
        <Input
          label="Task Title"
          value={formData.title}
          onChange={handleChange('title')}
          placeholder="Enter task title"
          required
        />

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            className="form-textarea"
            placeholder="Add a description (optional)"
            value={formData.description}
            onChange={handleChange('description')}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Project</label>
            <select
              className="form-select"
              value={formData.project_id}
              onChange={handleChange('project_id')}
              required
            >
              <option value="" disabled>Select Project</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Assign To</label>
            <select
              className="form-select"
              value={formData.user_id}
              onChange={handleChange('user_id')}
              required
            >
              <option value="" disabled>Select User</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Priority</label>
            <select
              className="form-select"
              value={formData.priority}
              onChange={handleChange('priority')}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Due Date</label>
            <input
              type="date"
              className="form-input"
              value={formData.due_date}
              onChange={handleChange('due_date')}
            />
          </div>
        </div>

        {initialData && (
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={handleChange('status')}
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>
        )}

        {formError && <div className="form-error mb-4">{formError}</div>}

        <div className="flex justify-end gap-3">
          <Button variant="secondary" type="button" onClick={onCancel}>Cancel</Button>
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (initialData ? 'Saving...' : 'Creating...') : (initialData ? 'Save Changes' : 'Create Task')}
          </Button>
        </div>
      </form>
    </div>
  );
};
