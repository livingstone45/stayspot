import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { getRoleDashboardPath } from '../../utils/auth/roleRedirection';
import { mockAuthService } from '../../services/mockAuth';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await mockAuthService.login(formData.email, formData.password);
      
      if (result.success) {
        localStorage.setItem('authToken', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        setLoading(false);
        
        const dashboardPath = getRoleDashboardPath(result.user);
        navigate(dashboardPath);
      }
    } catch (err) {
      setError(err.message || 'Login failed');
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth';
  };

  const handleGithubLogin = () => {
    window.location.href = 'https://github.com/login/oauth/authorize';
  };

  const handleAppleLogin = () => {
    window.location.href = 'https://appleid.apple.com/auth';
  };

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#f5f5f5',
      padding: '16px', 
      height: '100vh',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      <style>{`
        @keyframes popIn {
          0% { transform: scale(0.8) translateY(20px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        .login-card {
          animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
      
      <div className="login-card" style={{ 
        width: '100%', 
        maxWidth: '360px', 
        backgroundColor: 'white', 
        borderRadius: '16px', 
        boxShadow: '0 20px 60px rgba(249, 115, 22, 0.3)', 
        padding: '24px',
        border: '1px solid rgba(249, 115, 22, 0.2)'
      }}>
        <Link to="/" style={{ fontSize: '16px', fontWeight: '600', color: '#f97316', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px' }}>
          <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '12px' }}>
            SS
          </div>
          <span>StaySpot</span>
        </Link>

        <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px', color: '#1f2937', background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Welcome Back</h1>
        <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '12px' }}>Sign in to your StaySpot account</p>

        {error && (
          <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '12px', fontWeight: '500' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#1f2937', fontSize: '12px' }}>Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px 12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'all 0.2s' }}
              placeholder="you@example.com"
              onFocus={(e) => e.target.style.borderColor = '#f97316'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#1f2937', fontSize: '12px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"}
                name="password" 
                value={formData.password}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '10px 12px', paddingRight: '36px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'all 0.2s' }}
                placeholder="••••••••"
                onFocus={(e) => e.target.style.borderColor = '#f97316'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', padding: '4px' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '12px', color: '#4b5563' }}>
            <input 
              type="checkbox" 
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: '#f97316' }} 
            />
            <span>Keep me signed in</span>
          </label>

          <button 
            type="submit"
            disabled={loading}
            style={{ backgroundColor: '#f97316', color: 'white', padding: '10px', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer', fontSize: '13px', opacity: loading ? 0.7 : 1, transition: 'all 0.2s' }}
            onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#ea580c')}
            onMouseOut={(e) => e.target.style.backgroundColor = '#f97316'}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <Link to="/auth/forgot-password" style={{ textAlign: 'center', color: '#f97316', textDecoration: 'none', fontSize: '12px', fontWeight: '500', marginTop: '4px' }}>Forgot Password?</Link>
        </form>

        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e5e7eb' }}>
          <p style={{ color: '#6b7280', fontSize: '11px', textAlign: 'center', marginBottom: '10px' }}>Or continue with</p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button type="button" onClick={handleGoogleLogin} style={{ width: '40px', height: '40px', borderRadius: '8px', border: '2px solid #e5e7eb', backgroundColor: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseOver={(e) => { e.target.style.borderColor = '#f97316'; e.target.style.backgroundColor = '#fff7ed'; }} onMouseOut={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.backgroundColor = 'white'; }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            </button>
            <button type="button" onClick={handleGithubLogin} style={{ width: '40px', height: '40px', borderRadius: '8px', border: '2px solid #e5e7eb', backgroundColor: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseOver={(e) => { e.target.style.borderColor = '#f97316'; e.target.style.backgroundColor = '#fff7ed'; }} onMouseOut={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.backgroundColor = 'white'; }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#333" xmlns="http://www.w3.org/2000/svg"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </button>
            <button type="button" onClick={handleAppleLogin} style={{ width: '40px', height: '40px', borderRadius: '8px', border: '2px solid #e5e7eb', backgroundColor: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseOver={(e) => { e.target.style.borderColor = '#f97316'; e.target.style.backgroundColor = '#fff7ed'; }} onMouseOut={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.backgroundColor = 'white'; }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#000" xmlns="http://www.w3.org/2000/svg"><path d="M17.05 13.5c-.91 2.18-2.87 3.76-5.25 3.76-3.07 0-5.56-2.49-5.56-5.56 0-3.07 2.49-5.56 5.56-5.56 2.38 0 4.34 1.58 5.25 3.76h2.42c-.91-3.26-3.95-5.68-7.67-5.68-4.36 0-7.9 3.54-7.9 7.9s3.54 7.9 7.9 7.9c3.72 0 6.76-2.42 7.67-5.68h-2.42z"/></svg>
            </button>
          </div>
        </div>

        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
          <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '6px' }}>Don't have an account?</p>
          <Link to="/auth/register" style={{ color: '#f97316', textDecoration: 'none', fontWeight: '600', fontSize: '12px' }}>Sign up →</Link>
        </div>

        <button onClick={() => navigate('/')} style={{ display: 'block', marginTop: '12px', padding: '10px', backgroundColor: '#fff7ed', color: '#f97316', fontWeight: '600', fontSize: '13px', borderRadius: '8px', textAlign: 'center', border: '2px solid #fed7aa', transition: 'all 0.2s', cursor: 'pointer', width: '100%' }} onMouseOver={(e) => { e.target.style.backgroundColor = '#fed7aa'; e.target.style.borderColor = '#f97316'; }} onMouseOut={(e) => { e.target.style.backgroundColor = '#fff7ed'; e.target.style.borderColor = '#fed7aa'; }}>
          ← Back to Homepage
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
