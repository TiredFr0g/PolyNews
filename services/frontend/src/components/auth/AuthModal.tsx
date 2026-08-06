import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AuthModal.css';

export const AuthModal: React.FC = () => {
  const { login, register, user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-modal">
        <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <p className="auth-subtitle">
          {isLogin ? 'Log in to access your knowledge feed.' : 'Sign up to curate your knowledge feed.'}
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
          {error && <div className="error-msg">{error}</div>}
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-toggle">
          {isLogin ? (
            <p>Don't have an account? <button onClick={() => setIsLogin(false)}>Sign up</button></p>
          ) : (
            <p>Already have an account? <button onClick={() => setIsLogin(true)}>Sign in</button></p>
          )}
        </div>
      </div>
    </div>
  );
};
