import React from 'react';
import { Badge } from '../ui/Badge';
import { Folder, Edit3, Trash2 } from 'lucide-react';

export const ProjectCard = ({ project, onEdit, onDelete }) => {
  return (
    <div className="card-interactive">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div style={{
            width: 36, height: 36, borderRadius: 'var(--radius-md)',
            background: 'var(--primary-surface)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', color: 'var(--primary)'
          }}>
            <Folder size={18} />
          </div>
          <h3 className="text-subtitle">{project.name}</h3>
        </div>
        <Badge variant={project.status === 'active' ? 'success' : 'neutral'}>
          {project.status}
        </Badge>
      </div>

      <p className="text-body mb-5" style={{ minHeight: '40px' }}>
        {project.description || 'No description provided.'}
      </p>

      <div className="flex items-center justify-between" style={{ borderTop: '1px solid var(--divider)', paddingTop: 'var(--space-4)' }}>
        <span className="text-caption">{project.tasks_count ?? 0} Tasks</span>
        <div className="flex gap-1">
          <button className="btn-icon" onClick={() => onEdit(project)} aria-label="Edit project">
            <Edit3 size={16} />
          </button>
          <button className="btn-icon" onClick={() => onDelete(project)} aria-label="Delete project"
                  style={{ color: 'var(--danger)' }}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
