import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, LogOut, FolderKanban } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const AppLayout = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="flex items-center gap-sm mb-lg">
          <div className="text-heading-sm" style={{ color: 'var(--primary)' }}>Lohya</div>
        </div>
        
        <div className="text-body-sm mb-lg">
          Logged in as <strong>{user?.name}</strong>
          <br/>
          <span className="text-caption">{user?.role}</span>
        </div>

        <nav className="sidebar-nav">
          <NavLink 
            to="/tasks" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <CheckSquare size={20} />
            Tasks
          </NavLink>

          {isAdmin && (
            <NavLink 
              to="/projects" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <FolderKanban size={20} />
              Projects
            </NavLink>
          )}
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <button 
            onClick={handleLogout}
            className="sidebar-link w-full"
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};
