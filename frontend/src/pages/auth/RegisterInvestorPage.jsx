import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mockAuthService } from '../../services/mockAuth';

const RegisterInvestorPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    businessType: '',
    yearsExperience: '',
    propertyCount: '',
    services: []
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        services: checked 
          ? [...prev.services, value]
          : prev.services.filter(s => s !== value)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
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
    setError('');
    setStep(step + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await mockAuthService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phone,
        password: formData.password,
        userType: 'investor'
      });
      
      if (result.success) {
        setLoading(false);
        navigate('/auth/login', { state: { message: 'Registration successful! Please log in.' } });
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
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
        .register-card {
          animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>

      <div className="register-card" style={{ 
        width: '100%', 
        maxWidth: '420px', 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 8px 32px rgba(30, 64, 175, 0.15)', 
        padding: '24px',
        border: '1px solid rgba(30, 64, 175, 0.1)'
      }}>
        <Link to="/" style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '16px' }}>
          <div style={{ width: '20px', height: '20px', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '9px' }}>
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
                backgroundColor: s <= step ? '#1e293b' : '#e2e8f0', 
                borderRadius: '2px',
                transition: 'all 0.3s'
              }} />
            ))}
          </div>
          <p style={{ color: '#64748b', fontSize: '11px' }}>Step {step} of 4</p>
        </div>

        <h1 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '2px', color: '#0f172a' }}>
          {step === 1 && 'Personal Information'}
          {step === 2 && 'Contact Details'}
          {step === 3 && 'Create Password'}
          {step === 4 && 'Business Information'}
        </h1>
        <p style={{ color: '#64748b', fontSize: '11px', marginBottom: '12px' }}>
          {step === 1 && 'Tell us about yourself'}
          {step === 2 && 'How can we reach you?'}
          {step === 3 && 'Secure your account'}
          {step === 4 && 'Tell us about your business'}
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
                <label style={{ display: 'block', marginBottom: '3px', fontWeight: '500', color: '#0f172a', fontSize: '11px' }}>First Name</label>
                <input 
                  type="text" 
                  name="firstName" 
                  value={formData.firstName}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '7px 9px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12px', boxSizing: 'border-box' }}
                  placeholder="John"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '3px', fontWeight: '500', color: '#0f172a', fontSize: '11px' }}>Last Name</label>
                <input 
                  type="text" 
                  name="lastName" 
                  value={formData.lastName}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '7px 9px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12px', boxSizing: 'border-box' }}
                  placeholder="Doe"
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label style={{ display: 'block', marginBottom: '3px', fontWeight: '500', color: '#0f172a', fontSize: '11px' }}>Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '7px 9px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12px', boxSizing: 'border-box' }}
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '3px', fontWeight: '500', color: '#0f172a', fontSize: '11px' }}>Phone</label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '7px 9px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12px', boxSizing: 'border-box' }}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div>
                <label style={{ display: 'block', marginBottom: '3px', fontWeight: '500', color: '#0f172a', fontSize: '11px' }}>Password</label>
                <input 
                  type="password" 
                  name="password" 
                  value={formData.password}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '7px 9px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12px', boxSizing: 'border-box' }}
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '3px', fontWeight: '500', color: '#0f172a', fontSize: '11px' }}>Confirm Password</label>
                <input 
                  type="password" 
                  name="confirmPassword" 
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '7px 9px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12px', boxSizing: 'border-box' }}
                  placeholder="••••••••"
                />
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <div>
                <label style={{ display: 'block', marginBottom: '3px', fontWeight: '500', color: '#0f172a', fontSize: '11px' }}>Company Name</label>
                <input 
                  type="text" 
                  name="companyName" 
                  value={formData.companyName}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '7px 9px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12px', boxSizing: 'border-box' }}
                  placeholder="Your Company"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '3px', fontWeight: '500', color: '#0f172a', fontSize: '11px' }}>Business Type</label>
                <select 
                  name="businessType" 
                  value={formData.businessType}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '7px 9px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12px', boxSizing: 'border-box' }}
                >
                  <option value="">Select type</option>
                  <option value="individual">Individual Investor</option>
                  <option value="company">Property Management Company</option>
                  <option value="agency">Real Estate Agency</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '3px', fontWeight: '500', color: '#0f172a', fontSize: '11px' }}>Years of Experience</label>
                <input 
                  type="number" 
                  name="yearsExperience" 
                  value={formData.yearsExperience}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '7px 9px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12px', boxSizing: 'border-box' }}
                  placeholder="5"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '3px', fontWeight: '500', color: '#0f172a', fontSize: '11px' }}>Properties Currently Listed</label>
                <input 
                  type="number" 
                  name="propertyCount" 
                  value={formData.propertyCount}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '7px 9px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12px', boxSizing: 'border-box' }}
                  placeholder="10"
                />
              </div>
              <div style={{ marginTop: '8px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#0f172a', fontSize: '11px' }}>Services Offered</label>
                {['Property Management', 'Maintenance', 'Cleaning', 'Tenant Screening'].map(service => (
                  <label key={service} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '11px', color: '#475569', marginBottom: '4px' }}>
                    <input 
                      type="checkbox" 
                      value={service}
                      checked={formData.services.includes(service)}
                      onChange={handleChange}
                      style={{ cursor: 'pointer', width: '14px', height: '14px' }}
                    />
                    <span>{service}</span>
                  </label>
                ))}
              </div>
            </>
          )}

          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            {step > 1 && (
              <button 
                type="button"
                onClick={() => setStep(step - 1)}
                style={{ flex: 1, padding: '7px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: 'white', fontWeight: '600', cursor: 'pointer', fontSize: '12px' }}
              >
                Back
              </button>
            )}
            {step < 4 ? (
              <button 
                type="button"
                onClick={handleNext}
                style={{ flex: 1, padding: '7px', borderRadius: '6px', border: 'none', backgroundColor: '#1e293b', color: 'white', fontWeight: '600', cursor: 'pointer', fontSize: '12px' }}
              >
                Next
              </button>
            ) : (
              <button 
                type="submit"
                disabled={loading}
                style={{ flex: 1, padding: '7px', borderRadius: '6px', border: 'none', backgroundColor: '#1e293b', color: 'white', fontWeight: '600', cursor: 'pointer', fontSize: '12px', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Creating...' : 'Create Account'}
              </button>
            )}
          </div>
        </form>

        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
          <p style={{ color: '#64748b', fontSize: '11px', marginBottom: '3px' }}>Already have an account?</p>
          <Link to="/auth/login" style={{ color: '#1e293b', textDecoration: 'none', fontWeight: '600', fontSize: '11px' }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterInvestorPage;
