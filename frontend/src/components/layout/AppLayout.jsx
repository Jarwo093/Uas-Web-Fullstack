import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, FolderKanban, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const AppLayout = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="app-layout">
      {/* Mobile Menu Button */}
      <button
        className="mobile-menu-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Overlay (mobile) */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">L</div>
          <span className="brand-name">Lohya</span>
        </div>

        <div className="sidebar-user">
          <div className="user-name">{user?.name}</div>
          <div className="user-role">{user?.role}</div>
        </div>

        <div className="sidebar-label">Menu</div>

        <nav className="sidebar-nav">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            <LayoutDashboard size={20} className="link-icon" />
            Dashboard
          </NavLink>

          <NavLink
            to="/tasks"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            <CheckSquare size={20} className="link-icon" />
            Tasks
          </NavLink>

          {isAdmin && (
            <NavLink
              to="/projects"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              <FolderKanban size={20} className="link-icon" />
              Projects
            </NavLink>
          )}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="sidebar-link">
            <LogOut size={20} className="link-icon" />
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
