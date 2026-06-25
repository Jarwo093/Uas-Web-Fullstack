import { useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import { useProjects } from '../hooks/useProjects';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Pagination } from '../components/ui/Pagination';
import { EmptyState } from '../components/ui/EmptyState';
import { ProjectCard } from '../components/projects/ProjectCard';
import { ProjectForm } from '../components/projects/ProjectForm';
import { Plus, FolderKanban } from 'lucide-react';

const Projects = () => {
  const toast = useToast();
  const {
    projects, meta, isLoading, error,
    setPage,
    createProject, updateProject, deleteProject,
  } = useProjects();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deletingProject, setDeletingProject] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (data) => {
    setIsSubmitting(true);
    try {
      await createProject(data);
      toast.success('Project created', `"${data.name}" has been created successfully.`);
      setShowCreateForm(false);
    } catch (err) {
      toast.error('Failed to create project', err.response?.data?.message || 'An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data) => {
    setIsSubmitting(true);
    try {
      await updateProject(editingProject.id, data);
      toast.success('Project updated', `"${data.name}" has been updated.`);
      setEditingProject(null);
    } catch (err) {
      toast.error('Failed to update project', err.response?.data?.message || 'An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteProject(deletingProject.id);
      toast.success('Project deleted', `"${deletingProject.name}" has been removed.`);
      setDeletingProject(null);
    } catch (err) {
      toast.error('Failed to delete project', err.response?.data?.message || 'An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">Manage all company projects.</p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          <Plus size={16} />
          {showCreateForm ? 'Cancel' : 'New Project'}
        </Button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="card mb-6">
          <h2 className="text-heading-sm mb-5">Create New Project</h2>
          <ProjectForm
            onSubmit={handleCreate}
            onCancel={() => setShowCreateForm(false)}
            isSubmitting={isSubmitting}
          />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="card-flat text-center mb-5" style={{ padding: 'var(--space-6)', color: 'var(--danger)' }}>
          {error}
        </div>
      )}

      {/* Project Grid */}
      {isLoading ? (
        <div className="grid-cards">
          {[1,2,3].map(i => <div key={i} className="skeleton skeleton-card" style={{ height: '180px' }} />)}
        </div>
      ) : projects.length > 0 ? (
        <div className="grid-cards">
          {projects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={setEditingProject}
              onDelete={setDeletingProject}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Create your first project to start organizing tasks."
          action={
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus size={16} />
              Create Project
            </Button>
          }
        />
      )}

      {/* Pagination */}
      <Pagination meta={meta} onPageChange={setPage} />

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingProject}
        onClose={() => setEditingProject(null)}
        title="Edit Project"
      >
        {editingProject && (
          <ProjectForm
            project={editingProject}
            onSubmit={handleUpdate}
            onCancel={() => setEditingProject(null)}
            isSubmitting={isSubmitting}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingProject}
        onClose={() => setDeletingProject(null)}
        title="Delete Project"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeletingProject(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} disabled={isSubmitting}>
              {isSubmitting ? 'Deleting...' : 'Delete Project'}
            </Button>
          </>
        }
      >
        <p className="text-body">
          Are you sure you want to delete <strong>"{deletingProject?.name}"</strong>?
          This will also delete all tasks associated with this project. This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default Projects;
