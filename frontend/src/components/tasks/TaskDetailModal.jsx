import React from 'react';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Calendar, User, FolderKanban, Clock } from 'lucide-react';

export const TaskDetailModal = ({ task, isOpen, onClose, canEdit, onEdit, onDelete }) => {
  if (!task) return null;

  const statusConfig = {
    todo:        { variant: 'neutral',  label: 'To Do' },
    in_progress: { variant: 'info',     label: 'In Progress' },
    done:        { variant: 'success',  label: 'Done' },
  };

  const priorityConfig = {
    high:   { variant: 'danger',  label: 'High Priority' },
    medium: { variant: 'warning', label: 'Medium Priority' },
    low:    { variant: 'neutral', label: 'Low Priority' },
  };

  const status = statusConfig[task.status] || statusConfig.todo;
  const priority = priorityConfig[task.priority] || priorityConfig.medium;
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Task Details" size="md">
      <div className="flex flex-col gap-6">
        {/* Title & Badges */}
        <div>
          <h3 className="text-heading-md mb-3">{task.title}</h3>
          <div className="flex gap-2 flex-wrap">
            <Badge variant={status.variant}>{status.label}</Badge>
            <Badge variant={priority.variant}>{priority.label}</Badge>
            {isOverdue && <Badge variant="danger">Overdue</Badge>}
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <div>
            <div className="text-overline mb-2">Description</div>
            <p className="text-body" style={{ whiteSpace: 'pre-wrap' }}>{task.description}</p>
          </div>
        )}

        {/* Meta Info */}
        <div className="flex flex-col gap-3" style={{ borderTop: '1px solid var(--divider)', paddingTop: 'var(--space-5)' }}>
          {task.project && (
            <div className="flex items-center gap-3">
              <FolderKanban size={16} style={{ color: 'var(--text-tertiary)' }} />
              <span className="text-small">Project:</span>
              <span className="text-body-bold">{task.project.name}</span>
            </div>
          )}
          {task.user && (
            <div className="flex items-center gap-3">
              <User size={16} style={{ color: 'var(--text-tertiary)' }} />
              <span className="text-small">Assigned to:</span>
              <span className="text-body-bold">{task.user.name}</span>
            </div>
          )}
          {task.due_date && (
            <div className="flex items-center gap-3">
              <Calendar size={16} style={{ color: isOverdue ? 'var(--danger)' : 'var(--text-tertiary)' }} />
              <span className="text-small">Due date:</span>
              <span className="text-body-bold" style={isOverdue ? { color: 'var(--danger)' } : {}}>
                {new Date(task.due_date).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          )}
          {task.created_at && (
            <div className="flex items-center gap-3">
              <Clock size={16} style={{ color: 'var(--text-tertiary)' }} />
              <span className="text-small">Created:</span>
              <span className="text-body-bold">
                {new Date(task.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          )}
        </div>

        {canEdit && (
          <div className="flex justify-end gap-3" style={{ borderTop: '1px solid var(--divider)', paddingTop: 'var(--space-4)' }}>
            <Button variant="secondary" onClick={() => onEdit(task)}>Edit Task</Button>
            <Button variant="danger" onClick={() => onDelete(task.id)}>Delete Task</Button>
          </div>
        )}
      </div>
    </Modal>
  );
};
