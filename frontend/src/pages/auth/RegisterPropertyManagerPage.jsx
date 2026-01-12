import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getRoleDashboardPath } from '../../utils/auth/roleRedirection';

const RegisterPropertyManagerPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    license: '',
    yearsExperience: '',
    propertiesManaged: '',
    acceptTerms: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const COLOR = '#8b5cf6';
  const BG_COLOR = '#faf5ff';
  const BORDER_COLOR = '#e9d5ff';

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNext = () => {
    if (step === 1 && (!formData.firstName || !formData.lastName)) {
      setError('Please fill in all fields');
      return;
    }
    if (step === 2 && (!formData.email || !formData.phone)) {
      setError('Please fill in all fields');
      return;
    }
    if (step === 3 && (!formData.password || !formData.confirmPassword)) {
      setError('Please fill in all fields');
      return;
    }
    if (step === 3 && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (step === 3 && formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setError('');
    setStep(step + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (!formData.acceptTerms) {
      setError('You must accept the terms and conditions');
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          role: 'property_manager',
          companyName: formData.companyName,
          license: formData.license,
          yearsExperience: formData.yearsExperience,
          propertiesManaged: formData.propertiesManaged,
          acceptTerms: formData.acceptTerms
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.data?.tokens?.accessToken || data.token);
        localStorage.setItem('user', JSON.stringify(data.data?.user || { role: 'property_manager' }));
        setLoading(false);
        const dashboardPath = getRoleDashboardPath(data.data?.user || { role: 'property_manager' });
        navigate(dashboardPath);
      } else {
        setError(data.error || data.message || 'Registration failed');
        setLoading(false);
      }
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        setError('Request timeout. Please try again.');
      } else {
        setError('Network error. Make sure backend is running.');
      }
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
        maxWidth: '420px', 
        backgroundColor: 'white', 
        borderRadius: '16px', 
        boxShadow: `0 20px 60px ${COLOR}33`, 
        padding: '24px',
        border: `1px solid ${BORDER_COLOR}`
      }}>
        <Link to="/" style={{ fontSize: '14px', fontWeight: '600', color: COLOR, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '16px' }}>
          <div style={{ width: '20px', height: '20px', background: `linear-gradient(135deg, ${COLOR} 0%, #7c3aed 100%)`, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '9px' }}>
            SS
          </div>
          <span>StaySpot</span>
        </Link>

        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            {[1, 2, 3, 4].map(s => (
              <div key={s} style={{ 
                flex: 1, 
                height: '4px', 
                backgroundColor: s <= step ? COLOR : '#e5e7eb', 
                borderRadius: '2px',
                transition: 'all 0.3s'
              }} />
            ))}
          </div>
          <p style={{ color: '#6b7280', fontSize: '11px' }}>Step {step} of 4</p>
        </div>

        <h1 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '2px', color: COLOR }}>
          {step === 1 && 'Personal Information'}
          {step === 2 && 'Contact Details'}
          {step === 3 && 'Create Password'}
          {step === 4 && 'Professional Information'}
        </h1>
        <p style={{ color: '#6b7280', fontSize: '11px', marginBottom: '12px' }}>
          {step === 1 && 'Tell us about yourself'}
          {step === 2 && 'How can we reach you?'}
          {step === 3 && 'Secure your account'}
          {step === 4 && 'Tell us about your experience'}
        </p>

        {error && (
          <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fecaca', color: '#991b1b', padding: '8px', borderRadius: '6px', marginBottom: '10px', fontSize: '11px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {step === 1 && (
            <>
              <div>
                <label style={{ display: 'block', marginBottom: '3px', fontWeight: '500', color: '#1f2937', fontSize: '11px' }}>First Name</label>
                <input 
                  type="text" 
                  name="firstName" 
                  value={formData.firstName}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '7px 9px', border: `1px solid ${BORDER_COLOR}`, borderRadius: '6px', fontSize: '12px', boxSizing: 'border-box' }}
                  placeholder="John"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '3px', fontWeight: '500', color: '#1f2937', fontSize: '11px' }}>Last Name</label>
                <input 
                  type="text" 
                  name="lastName" 
                  value={formData.lastName}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '7px 9px', border: `1px solid ${BORDER_COLOR}`, borderRadius: '6px', fontSize: '12px', boxSizing: 'border-box' }}
                  placeholder="Doe"
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label style={{ display: 'block', marginBottom: '3px', fontWeight: '500', color: '#1f2937', fontSize: '11px' }}>Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '7px 9px', border: `1px solid ${BORDER_COLOR}`, borderRadius: '6px', fontSize: '12px', boxSizing: 'border-box' }}
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '3px', fontWeight: '500', color: '#1f2937', fontSize: '11px' }}>Phone</label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '7px 9px', border: `1px solid ${BORDER_COLOR}`, borderRadius: '6px', fontSize: '12px', boxSizing: 'border-box' }}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div>
                <label style={{ display: 'block', marginBottom: '3px', fontWeight: '500', color: '#1f2937', fontSize: '11px' }}>Password</label>
                <input 
                  type="password" 
                  name="password" 
                  value={formData.password}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '7px 9px', border: `1px solid ${BORDER_COLOR}`, borderRadius: '6px', fontSize: '12px', boxSizing: 'border-box' }}
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '3px', fontWeight: '500', color: '#1f2937', fontSize: '11px' }}>Confirm Password</label>
                <input 
                  type="password" 
                  name="confirmPassword" 
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '7px 9px', border: `1px solid ${BORDER_COLOR}`, borderRadius: '6px', fontSize: '12px', boxSizing: 'border-box' }}
                  placeholder="••••••••"
                />
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <div>
                <label style={{ display: 'block', marginBottom: '3px', fontWeight: '500', color: '#1f2937', fontSize: '11px' }}>Company Name</label>
                <input 
                  type="text" 
                  name="companyName" 
                  value={formData.companyName}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '7px 9px', border: `1px solid ${BORDER_COLOR}`, borderRadius: '6px', fontSize: '12px', boxSizing: 'border-box' }}
                  placeholder="Your Company"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '3px', fontWeight: '500', color: '#1f2937', fontSize: '11px' }}>Property Management License (Optional)</label>
                <input 
                  type="text" 
                  name="license" 
                  value={formData.license}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '7px 9px', border: `1px solid ${BORDER_COLOR}`, borderRadius: '6px', fontSize: '12px', boxSizing: 'border-box' }}
                  placeholder="License number"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '3px', fontWeight: '500', color: '#1f2937', fontSize: '11px' }}>Years of Professional Experience</label>
                <input 
                  type="number" 
                  name="yearsExperience" 
                  value={formData.yearsExperience}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '7px 9px', border: `1px solid ${BORDER_COLOR}`, borderRadius: '6px', fontSize: '12px', boxSizing: 'border-box' }}
                  placeholder="5"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '3px', fontWeight: '500', color: '#1f2937', fontSize: '11px' }}>Properties Currently Managed</label>
                <input 
                  type="number" 
                  name="propertiesManaged" 
                  value={formData.propertiesManaged}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '7px 9px', border: `1px solid ${BORDER_COLOR}`, borderRadius: '6px', fontSize: '12px', boxSizing: 'border-box' }}
                  placeholder="10"
                />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '11px', color: '#475569', marginTop: '8px' }}>
                <input 
                  type="checkbox" 
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  style={{ cursor: 'pointer', width: '14px', height: '14px', accentColor: COLOR }}
                />
                <span>I agree to the <Link to="/terms" style={{ color: COLOR, textDecoration: 'underline' }}>Terms and Conditions</Link></span>
              </label>
            </>
          )}

          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            {step > 1 && (
              <button 
                type="button"
                onClick={() => setStep(step - 1)}
                style={{ flex: 1, padding: '7px', borderRadius: '6px', border: `1px solid ${BORDER_COLOR}`, backgroundColor: 'white', fontWeight: '600', cursor: 'pointer', fontSize: '12px', color: COLOR }}
              >
                Back
              </button>
            )}
            {step < 4 ? (
              <button 
                type="button"
                onClick={handleNext}
                style={{ flex: 1, padding: '7px', borderRadius: '6px', border: 'none', backgroundColor: COLOR, color: 'white', fontWeight: '600', cursor: 'pointer', fontSize: '12px' }}
              >
                Next
              </button>
            ) : (
              <button 
                type="submit"
                disabled={loading}
                style={{ flex: 1, padding: '7px', borderRadius: '6px', border: 'none', backgroundColor: COLOR, color: 'white', fontWeight: '600', cursor: 'pointer', fontSize: '12px', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Creating...' : 'Create Account'}
              </button>
            )}
          </div>
        </form>

        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
          <p style={{ color: '#6b7280', fontSize: '11px', marginBottom: '3px' }}>Already have an account?</p>
          <Link to="/auth/login" style={{ color: COLOR, textDecoration: 'none', fontWeight: '600', fontSize: '11px' }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPropertyManagerPage;
