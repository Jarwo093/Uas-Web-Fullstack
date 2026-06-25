import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useTasks } from '../hooks/useTasks';
import { useProjects } from '../hooks/useProjects';
import { useUsers } from '../hooks/useUsers';
import { Button } from '../components/ui/Button';
import { Pagination } from '../components/ui/Pagination';
import { EmptyState } from '../components/ui/EmptyState';
import { SkeletonRow } from '../components/ui/Skeleton';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskForm } from '../components/tasks/TaskForm';
import { TaskDetailModal } from '../components/tasks/TaskDetailModal';
import { TaskFilters } from '../components/tasks/TaskFilters';
import { Plus, CheckSquare } from 'lucide-react';

const Tasks = () => {
  const { isAdmin, user: authUser } = useAuth();
  const toast = useToast();
  const {
    tasks, meta, isLoading, error,
    filters, updateFilter, resetFilters,
    createTask, updateTask, deleteTask, updateTaskStatus,
  } = useTasks();

  // Call hooks unconditionally, using the enabled flag
  const { projects } = useProjects({ enabled: isAdmin });
  const { users } = useUsers({ enabled: isAdmin });

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleCreateTask = async (formData) => {
    setIsSubmitting(true);
    try {
      await createTask(formData);
      toast.success('Task created', 'The task has been assigned successfully.');
      setShowForm(false);
    } catch (err) {
      toast.error('Failed to create task', err.response?.data?.message || 'An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTask = async (formData) => {
    setIsSubmitting(true);
    try {
      await updateTask(editingTask.id, formData);
      toast.success('Task updated', 'The task has been updated successfully.');
      setEditingTask(null);
    } catch (err) {
      toast.error('Failed to update task', err.response?.data?.message || 'An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
        toast.success('Task deleted', 'The task has been deleted successfully.');
        setSelectedTask(null);
      } catch (err) {
        toast.error('Failed to delete task', err.response?.data?.message || 'An error occurred.');
      }
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      toast.success('Status updated', `Task status changed to ${newStatus.replace('_', ' ')}.`);
    } catch (err) {
      toast.error('Update failed', err.response?.data?.message || 'Could not update task status.');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Tasks</h1>
          <p className="page-subtitle">
            {isAdmin ? 'Manage all tasks across the organization.' : 'Manage your assigned tasks.'}
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus size={16} />
            {showForm ? 'Cancel' : 'New Task'}
          </Button>
        )}
      </div>

      {/* Create Task Form (Admin only) */}
      {showForm && isAdmin && (
        <TaskForm
          projects={projects}
          users={users}
          onSubmit={handleCreateTask}
          onCancel={() => setShowForm(false)}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Edit Task Form (Admin only) */}
      {editingTask && isAdmin && (
        <TaskForm
          projects={projects}
          users={users}
          onSubmit={handleUpdateTask}
          onCancel={() => setEditingTask(null)}
          isSubmitting={isSubmitting}
          initialData={editingTask}
        />
      )}

      {/* Filters */}
      <TaskFilters
        filters={filters}
        onFilterChange={updateFilter}
        projects={isAdmin ? projects : []}
        onReset={resetFilters}
      />

      {/* Error State */}
      {error && (
        <div className="card-flat text-center mb-5" style={{ padding: 'var(--space-6)', color: 'var(--danger)' }}>
          {error}
        </div>
      )}

      {/* Task List */}
      {isLoading ? (
        <SkeletonRow count={5} />
      ) : tasks.length > 0 ? (
        <div className="list-stack">
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={setSelectedTask}
              onStatusChange={handleStatusChange}
              canEdit={isAdmin || task.user_id === authUser?.id}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={CheckSquare}
          title="No tasks found"
          description={
            filters.search || filters.status || filters.priority || filters.project_id
              ? "No tasks match your current filters. Try adjusting or clearing them."
              : isAdmin
                ? "No tasks have been created yet. Click 'New Task' to assign one."
                : "You're all caught up! No tasks are assigned to you."
          }
          action={
            (filters.search || filters.status || filters.priority || filters.project_id) ? (
              <Button variant="secondary" onClick={resetFilters}>Clear Filters</Button>
            ) : null
          }
        />
      )}

      {/* Pagination */}
      <Pagination meta={meta} onPageChange={(p) => updateFilter('page', p)} />

      {/* Task Detail Modal */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        canEdit={isAdmin}
        onEdit={(task) => {
          setSelectedTask(null);
          setEditingTask(task);
          setShowForm(false);
        }}
        onDelete={handleDeleteTask}
      />
    </div>
  );
};

export default Tasks;
