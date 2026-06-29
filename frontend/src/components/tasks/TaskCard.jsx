import React from 'react';
import { Badge } from '../ui/Badge';
import { Calendar, User } from 'lucide-react';

export const TaskCard = ({ task, onClick, onStatusChange, canEdit }) => {
  const handleStatusChange = (e) => {
    e.stopPropagation();
    onStatusChange(task.id, e.target.value);
  };

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done';

  const statusConfig = {
    todo:        { variant: 'neutral',  label: 'To Do' },
    in_progress: { variant: 'info',     label: 'In Progress' },
    done:        { variant: 'success',  label: 'Done' },
  };

  const priorityConfig = {
    high:   { variant: 'danger',  label: 'High' },
    medium: { variant: 'warning', label: 'Medium' },
    low:    { variant: 'neutral', label: 'Low' },
  };

  const status = statusConfig[task.status] || statusConfig.todo;
  const priority = priorityConfig[task.priority] || priorityConfig.medium;

  return (
    <div className="task-row" onClick={() => onClick?.(task)}>
      <div className={`task-status-dot ${task.status}`} />

      <div className="task-info">
        <div className="task-title">{task.title}</div>
        <div className="task-meta">
          {task.project && <span>{task.project.name}</span>}
          {task.user && (
            <>
              <span className="dot">·</span>
              <span className="flex items-center gap-1">
                <User size={12} />
                {task.user.name}
              </span>
            </>
          )}
          {task.due_date && (
            <>
              <span className="dot">·</span>
              <span className={`flex items-center gap-1 ${isOverdue ? 'text-danger' : ''}`}
                    style={isOverdue ? { color: 'var(--danger)' } : {}}>
                <Calendar size={12} />
                {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="task-actions">
        <Badge variant={priority.variant}>{priority.label}</Badge>
        <Badge variant={status.variant}>{status.label}</Badge>

        {canEdit && (
          <select
            className="form-select filter-select"
            style={{ minWidth: '120px' }}
            value={task.status}
            onChange={handleStatusChange}
            onClick={e => e.stopPropagation()}
            aria-label="Change task status"
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        )}
      </div>
    </div>
  );
};
