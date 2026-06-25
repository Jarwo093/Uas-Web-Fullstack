import React from 'react';
import { SearchInput } from '../ui/SearchInput';
import { X } from 'lucide-react';

export const TaskFilters = ({ filters, onFilterChange, projects = [], onReset }) => {
  const hasActiveFilters = filters.search || filters.status || filters.project_id || filters.priority;

  return (
    <div className="filters-bar">
      <SearchInput
        value={filters.search}
        onChange={(val) => onFilterChange('search', val)}
        placeholder="Search tasks..."
      />

      <select
        className="form-select filter-select"
        value={filters.status}
        onChange={(e) => onFilterChange('status', e.target.value)}
        aria-label="Filter by status"
      >
        <option value="">All Status</option>
        <option value="todo">To Do</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>

      <select
        className="form-select filter-select"
        value={filters.priority}
        onChange={(e) => onFilterChange('priority', e.target.value)}
        aria-label="Filter by priority"
      >
        <option value="">All Priority</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      {projects.length > 0 && (
        <select
          className="form-select filter-select"
          value={filters.project_id}
          onChange={(e) => onFilterChange('project_id', e.target.value)}
          aria-label="Filter by project"
        >
          <option value="">All Projects</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      )}

      {hasActiveFilters && (
        <button className="btn btn-ghost btn-sm" onClick={onReset}>
          <X size={14} />
          Clear
        </button>
      )}
    </div>
  );
};
