import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RegisterRolePage = () => {
  const navigate = useNavigate();

  const roles = [
    { path: '/auth/register/tenant', title: 'I\'m a Tenant', desc: 'Looking for a place to stay', color: '#3b82f6', bgColor: '#eff6ff' },
    { path: '/auth/register/landlord', title: 'I\'m a Landlord', desc: 'Own and manage rental properties', color: '#f97316', bgColor: '#fff7ed' },
    { path: '/auth/register/property-manager', title: 'I\'m a Property Manager', desc: 'Manage properties professionally', color: '#8b5cf6', bgColor: '#faf5ff' },
    { path: '/auth/register/investor', title: 'I\'m an Investor', desc: 'Looking to list properties', color: '#10b981', bgColor: '#f0fdf4' },
    { path: '/auth/register/company', title: 'I\'m a Company Admin', desc: 'Manage company and properties', color: '#ec4899', bgColor: '#fdf2f8' }
  ];

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
        .role-card {
          animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>

      <div className="role-card" style={{ 
        width: '100%', 
        maxWidth: '500px', 
        backgroundColor: 'white', 
        borderRadius: '16px', 
        boxShadow: '0 20px 60px rgba(249, 115, 22, 0.15)', 
        padding: '32px',
        border: '1px solid rgba(249, 115, 22, 0.2)'
      }}>
        <Link to="/" style={{ fontSize: '16px', fontWeight: '600', color: '#f97316', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px' }}>
          <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '12px' }}>
            SS
          </div>
          <span>StaySpot</span>
        </Link>

        <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px', color: '#1f2937', background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Join StaySpot</h1>
        <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '24px' }}>Choose your account type to get started</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {roles.map((role, index) => (
            <button 
              key={index}
              onClick={() => navigate(role.path)}
              style={{ 
                padding: '16px', 
                border: `2px solid ${role.color}`, 
                borderRadius: '8px', 
                backgroundColor: role.bgColor, 
                cursor: 'pointer', 
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = `0 8px 16px ${role.color}33`;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ fontWeight: '600', color: role.color, fontSize: '14px', marginBottom: '4px' }}>{role.title}</div>
              <div style={{ color: '#6b7280', fontSize: '12px' }}>{role.desc}</div>
            </button>
          ))}
        </div>

        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
          <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '6px' }}>Already have an account?</p>
          <Link to="/auth/login" style={{ color: '#f97316', textDecoration: 'none', fontWeight: '600', fontSize: '12px' }}>Sign in</Link>
        </div>

        <button onClick={() => navigate('/')} style={{ display: 'block', marginTop: '16px', padding: '10px', backgroundColor: '#fff7ed', color: '#f97316', fontWeight: '600', fontSize: '13px', borderRadius: '8px', textAlign: 'center', border: '2px solid #fed7aa', transition: 'all 0.2s', cursor: 'pointer', width: '100%' }} onMouseOver={(e) => { e.target.style.backgroundColor = '#fed7aa'; e.target.style.borderColor = '#f97316'; }} onMouseOut={(e) => { e.target.style.backgroundColor = '#fff7ed'; e.target.style.borderColor = '#fed7aa'; }}>
          ← Back to Homepage
        </button>
      </div>
    </div>
  );
};

export default RegisterRolePage;
