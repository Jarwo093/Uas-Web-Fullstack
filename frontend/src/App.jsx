import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute, AdminRoute, PublicRoute } from './routes/RouteGuards';
import { AppLayout } from './components/layout/AppLayout';

// Placeholder Pages (will be implemented next)
import Login from './pages/Login';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Protected Routes inside Layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Navigate to="/tasks" replace />} />
              <Route path="/tasks" element={<Tasks />} />
              
              {/* Admin Only Routes */}
              <Route element={<AdminRoute />}>
                <Route path="/projects" element={<Projects />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
