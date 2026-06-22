import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const Login = () => {
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return;
    }

    const result = await login(formData.email, formData.password);
    if (!result.success) {
      setError(result.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <div className="flex flex-col items-center mb-lg">
          <div className="text-display-lg" style={{ color: 'var(--primary)' }}>Lohya</div>
          <div className="text-subtitle-md mt-sm">Task Management System</div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="name@kopikuy.test"
            disabled={isLoading}
          />
          
          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            disabled={isLoading}
          />
          
          {error && (
            <div className="text-caption-bold mb-md" style={{ color: 'var(--critical-strong)' }}>
              {error}
            </div>
          )}
          
          <Button 
            variant="primary" 
            type="submit" 
            className="w-full mt-md"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
