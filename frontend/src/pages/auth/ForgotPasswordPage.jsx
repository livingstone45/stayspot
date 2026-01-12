import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authAPI from '@/utils/api/auth.api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const result = await authAPI.forgotPassword(email);
      if (result) {
        setMessage('Check your email for password reset link');
        setTimeout(() => navigate('/auth/login'), 2000);
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(err.message || 'Failed to send reset link');
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#f8fafc', 
      padding: '16px', 
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      <style>{`
        @keyframes popIn {
          0% { transform: scale(0.8) translateY(20px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        .forgot-card {
          animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
      
      <div className="forgot-card" style={{ 
        width: '100%', 
        maxWidth: '360px', 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 8px 32px rgba(30, 64, 175, 0.15)', 
        padding: '24px',
        border: '1px solid rgba(30, 64, 175, 0.1)'
      }}>
        <Link to="/" style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
          <div style={{ width: '24px', height: '24px', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '11px' }}>
            SS
          </div>
          <span>StaySpot</span>
        </Link>

        <h1 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '2px', color: '#0f172a' }}>Reset Password</h1>
        <p style={{ color: '#64748b', fontSize: '12px', marginBottom: '14px' }}>Enter your email to receive reset link</p>

        {error && (
          <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fecaca', color: '#991b1b', padding: '8px', borderRadius: '6px', marginBottom: '10px', fontSize: '11px' }}>
            ⚠️ {error}
          </div>
        )}

        {message && (
          <div style={{ backgroundColor: '#d1fae5', border: '1px solid #6ee7b7', color: '#065f46', padding: '8px', borderRadius: '6px', marginBottom: '10px', fontSize: '11px' }}>
            ✓ {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '3px', fontWeight: '500', color: '#0f172a', fontSize: '11px' }}>Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '7px 9px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12px', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'all 0.2s' }}
              placeholder="you@example.com"
              onFocus={(e) => e.target.style.borderColor = '#1e293b'}
              onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            style={{ backgroundColor: '#1e293b', color: 'white', padding: '7px', borderRadius: '6px', border: 'none', fontWeight: '600', cursor: 'pointer', fontSize: '12px', opacity: loading ? 0.7 : 1, transition: 'all 0.2s' }}
            onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#0f172a')}
            onMouseOut={(e) => e.target.style.backgroundColor = '#1e293b'}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
          <p style={{ color: '#64748b', fontSize: '11px', marginBottom: '3px' }}>Remember your password?</p>
          <Link to="/auth/login" style={{ color: '#1e293b', textDecoration: 'none', fontWeight: '600', fontSize: '11px' }}>Sign in →</Link>
        </div>

        <button onClick={() => window.location.href = '/'} style={{ display: 'block', marginTop: '12px', padding: '7px', backgroundColor: '#f0f4f8', color: '#1e293b', textDecoration: 'none', fontWeight: '600', fontSize: '12px', borderRadius: '6px', textAlign: 'center', border: '1px solid #cbd5e1', transition: 'all 0.2s', width: '100%', cursor: 'pointer' }} onMouseOver={(e) => e.target.style.backgroundColor = '#e0e7ff'} onMouseOut={(e) => e.target.style.backgroundColor = '#f0f4f8'}>
          ← Back to Homepage
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
