import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    
    try {
      setTimeout(() => {
        setLoading(false);
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      setError('Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#f5f5f5',
      padding: '16px', 
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      <style>{`
        @keyframes popIn {
          0% { transform: scale(0.8) translateY(20px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        .register-card {
          animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
      
      <div className="register-card" style={{ 
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

        <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px', color: '#1f2937', background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Create Account</h1>
        <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '20px' }}>Start your free trial today</p>

        {error && (
          <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '12px', fontWeight: '500' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#1f2937', fontSize: '12px' }}>Full Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px 12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'all 0.2s' }}
              placeholder="John Doe"
              onFocus={(e) => e.target.style.borderColor = '#f97316'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

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
            <input 
              type="password" 
              name="password" 
              value={formData.password}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px 12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'all 0.2s' }}
              placeholder="••••••••"
              onFocus={(e) => e.target.style.borderColor = '#f97316'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#1f2937', fontSize: '12px' }}>Confirm Password</label>
            <input 
              type="password" 
              name="confirmPassword" 
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px 12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'all 0.2s' }}
              placeholder="••••••••"
              onFocus={(e) => e.target.style.borderColor = '#f97316'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', cursor: 'pointer', fontSize: '11px', color: '#4b5563' }}>
            <input type="checkbox" required style={{ cursor: 'pointer', marginTop: '2px', accentColor: '#f97316' }} />
            <span>I agree to <Link to="/terms" style={{ color: '#f97316', textDecoration: 'none', fontWeight: '600' }}>Terms</Link> and <Link to="/privacy" style={{ color: '#f97316', textDecoration: 'none', fontWeight: '600' }}>Privacy</Link></span>
          </label>

          <button 
            type="submit"
            disabled={loading}
            style={{ backgroundColor: '#f97316', color: 'white', padding: '10px', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer', fontSize: '13px', opacity: loading ? 0.7 : 1, transition: 'all 0.2s' }}
            onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#ea580c')}
            onMouseOut={(e) => e.target.style.backgroundColor = '#f97316'}
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
          <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '6px' }}>Have an account?</p>
          <Link to="/auth/login" style={{ color: '#f97316', textDecoration: 'none', fontWeight: '600', fontSize: '12px' }}>Sign in →</Link>
        </div>

        <button onClick={() => window.location.href = '/'} style={{ display: 'block', marginTop: '16px', padding: '10px', backgroundColor: '#fff7ed', color: '#f97316', fontWeight: '600', fontSize: '13px', borderRadius: '8px', textAlign: 'center', border: '2px solid #fed7aa', transition: 'all 0.2s', cursor: 'pointer', width: '100%' }} onMouseOver={(e) => { e.target.style.backgroundColor = '#fed7aa'; e.target.style.borderColor = '#f97316'; }} onMouseOut={(e) => { e.target.style.backgroundColor = '#fff7ed'; e.target.style.borderColor = '#fed7aa'; }}>
          ← Back to Homepage
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;
