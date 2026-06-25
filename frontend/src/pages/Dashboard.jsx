import { useAuth } from '../contexts/AuthContext';
import { useDashboard } from '../hooks/useDashboard';
import { SkeletonStat } from '../components/ui/Skeleton';
import { Badge } from '../components/ui/Badge';
import { CheckSquare, Clock, Circle, CheckCircle, AlertTriangle, FolderKanban, Users, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { isAdmin } = useAuth();
  const { stats, isLoading, error } = useDashboard();

  if (error) {
    return (
      <div className="empty-state">
        <div className="empty-icon"><AlertTriangle size={28} /></div>
        <h3>Failed to load dashboard</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            {isAdmin ? 'Overview of all projects and tasks.' : 'Your task summary at a glance.'}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      {isLoading ? (
        <SkeletonStat count={isAdmin ? 4 : 3} />
      ) : (
        <div className="grid-stats">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--primary-surface)', color: 'var(--primary)' }}>
              <CheckSquare size={20} />
            </div>
            <div className="stat-value">{stats?.total_tasks ?? 0}</div>
            <div className="stat-label">Total Tasks</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--info-surface)', color: '#2E86DE' }}>
              <Clock size={20} />
            </div>
            <div className="stat-value">{stats?.progress_count ?? 0}</div>
            <div className="stat-label">In Progress</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--success-surface)', color: 'var(--success)' }}>
              <CheckCircle size={20} />
            </div>
            <div className="stat-value">{stats?.done_count ?? 0}</div>
            <div className="stat-label">Completed</div>
          </div>

          {stats?.overdue_count > 0 ? (
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'var(--danger-surface)', color: 'var(--danger)' }}>
                <AlertTriangle size={20} />
              </div>
              <div className="stat-value" style={{ color: 'var(--danger)' }}>{stats.overdue_count}</div>
              <div className="stat-label">Overdue</div>
            </div>
          ) : isAdmin ? (
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'var(--primary-surface)', color: 'var(--primary)' }}>
                <FolderKanban size={20} />
              </div>
              <div className="stat-value">{stats?.total_projects ?? 0}</div>
              <div className="stat-label">Projects</div>
            </div>
          ) : (
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'var(--warning-surface)', color: 'var(--warning-dark)' }}>
                <Circle size={20} />
              </div>
              <div className="stat-value">{stats?.todo_count ?? 0}</div>
              <div className="stat-label">To Do</div>
            </div>
          )}
        </div>
      )}

      {/* Admin Extra Stats */}
      {isAdmin && !isLoading && stats && (
        <div className="flex gap-5 mt-6" style={{ flexWrap: 'wrap' }}>
          <div className="card-flat flex items-center gap-3" style={{ flex: '1', minWidth: '150px' }}>
            <Users size={18} style={{ color: 'var(--text-tertiary)' }} />
            <div>
              <div className="text-body-bold">{stats.total_users ?? 0} Users</div>
              <div className="text-caption">Team members</div>
            </div>
          </div>
          <div className="card-flat flex items-center gap-3" style={{ flex: '1', minWidth: '150px' }}>
            <FolderKanban size={18} style={{ color: 'var(--text-tertiary)' }} />
            <div>
              <div className="text-body-bold">{stats.active_projects ?? 0} Active</div>
              <div className="text-caption">Projects in progress</div>
            </div>
          </div>
          <div className="card-flat flex items-center gap-3" style={{ flex: '1', minWidth: '150px' }}>
            <TrendingUp size={18} style={{ color: 'var(--success)' }} />
            <div>
              <div className="text-body-bold">
                {stats.total_tasks > 0
                  ? Math.round((stats.done_count / stats.total_tasks) * 100)
                  : 0}%
              </div>
              <div className="text-caption">Completion rate</div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Tasks */}
      <div className="mt-8">
        <h2 className="text-heading-sm mb-5">Recent Tasks</h2>

        {isLoading ? (
          <div className="list-stack">
            {[1,2,3].map(i => <div key={i} className="skeleton skeleton-row" />)}
          </div>
        ) : stats?.recent_tasks?.length > 0 ? (
          <div className="list-stack">
            {stats.recent_tasks.map(task => {
              const statusConfig = {
                todo:        { variant: 'neutral',  label: 'To Do' },
                in_progress: { variant: 'info',     label: 'In Progress' },
                done:        { variant: 'success',  label: 'Done' },
              };
              const st = statusConfig[task.status] || statusConfig.todo;

              return (
                <div key={task.id} className="task-row" style={{ cursor: 'default' }}>
                  <div className={`task-status-dot ${task.status}`} />
                  <div className="task-info">
                    <div className="task-title">{task.title}</div>
                    <div className="task-meta">
                      {task.project && <span>{task.project.name}</span>}
                      {task.user && (
                        <>
                          <span className="dot">·</span>
                          <span>{task.user.name}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Badge variant={st.variant}>{st.label}</Badge>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card-flat text-center" style={{ padding: 'var(--space-8)' }}>
            <p className="text-body">No tasks yet. Create your first task to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
