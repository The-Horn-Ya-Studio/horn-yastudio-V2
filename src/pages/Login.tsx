import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import darkTheme from '../theme/darkTheme';
import Logo from '../components/Logo';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { state, login } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect to admin panel
  if (state.isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(username, password);
      
      if (success) {
        navigate('/admin');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <div style={logoContainerStyle}>
            <Logo size="medium" />
          </div>
          <p style={subtitleStyle}>Access the admin panel</p>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          {error && <div style={errorStyle}>{error}</div>}
          
          <div style={inputGroupStyle}>
            <label htmlFor="username" style={labelStyle}>Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={inputStyle}
              required
            />
          </div>
          
          <div style={inputGroupStyle}>
            <label htmlFor="password" style={labelStyle}>Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              required
            />
          </div>
          
          <button 
            type="submit" 
            style={submitButtonStyle}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '70vh',
};

const cardStyle: React.CSSProperties = {
  background: darkTheme.gradients.darkGlass,
  borderRadius: darkTheme.borderRadius.md,
  boxShadow: darkTheme.shadows.lg,
  padding: darkTheme.spacing.xl,
  width: '100%',
  maxWidth: '450px',
  border: `1px solid ${darkTheme.colors.border}`,
};

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: darkTheme.spacing.lg,
};

const logoContainerStyle: React.CSSProperties = {
  display: 'flex', 
  justifyContent: 'center',
  marginBottom: darkTheme.spacing.xs
};

const titleStyle: React.CSSProperties = {
  background: darkTheme.gradients.primary,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontSize: '2rem',
  fontWeight: 700,
  marginBottom: darkTheme.spacing.xs,
};

const subtitleStyle: React.CSSProperties = {
  color: darkTheme.colors.text.secondary,
  fontSize: '1rem',
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
};

const errorStyle: React.CSSProperties = {
  backgroundColor: 'rgba(207, 102, 121, 0.1)',
  border: `1px solid ${darkTheme.colors.error}`,
  color: darkTheme.colors.error,
  padding: darkTheme.spacing.sm,
  borderRadius: darkTheme.borderRadius.sm,
  marginBottom: darkTheme.spacing.md,
  textAlign: 'center',
};

const inputGroupStyle: React.CSSProperties = {
  marginBottom: darkTheme.spacing.md,
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: darkTheme.spacing.xs,
  color: darkTheme.colors.text.primary,
  fontSize: '0.9rem',
  fontWeight: 600,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem',
  backgroundColor: 'rgba(26, 26, 26, 0.8)',
  border: `1px solid ${darkTheme.colors.border}`,
  borderRadius: darkTheme.borderRadius.sm,
  color: darkTheme.colors.text.primary,
  fontSize: '1rem',
  transition: darkTheme.transitions.default,
};

const submitButtonStyle: React.CSSProperties = {
  background: darkTheme.gradients.primary,
  color: 'white',
  border: 'none',
  borderRadius: darkTheme.borderRadius.sm,
  padding: '0.75rem 1rem',
  fontSize: '1rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: darkTheme.transitions.default,
  marginTop: darkTheme.spacing.sm,
};

const hintStyle: React.CSSProperties = {
  marginTop: darkTheme.spacing.lg,
  padding: darkTheme.spacing.md,
  backgroundColor: 'rgba(10, 10, 10, 0.5)',
  borderRadius: darkTheme.borderRadius.sm,
  color: darkTheme.colors.text.secondary,
  fontSize: '0.8rem',
  textAlign: 'center',
};

export default Login;
