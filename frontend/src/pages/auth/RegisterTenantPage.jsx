import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { mockAuthService } from '../../services/mockAuth';

const RegisterTenantPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    moveInDate: '',
    budget: '',
    preferences: []
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const COLOR = '#f97316';
  const BG_COLOR = '#4c1d95';
  const BORDER_COLOR = '#a855f7';

  const validatePassword = (pwd) => {
    return {
      minLength: pwd.length >= 8,
      hasUpper: /[A-Z]/.test(pwd),
      hasLower: /[a-z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      hasSpecial: /[!@#$%^&*]/.test(pwd)
    };
  };

  const passwordValidation = validatePassword(formData.password);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        preferences: checked 
          ? [...prev.preferences, value]
          : prev.preferences.filter(p => p !== value)
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
    if (step === 3) {
      if (!formData.password || !formData.confirmPassword) {
        setError('Please fill in all fields');
        return;
      }
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters long');
        return;
      }
      if (!/[A-Z]/.test(formData.password)) {
        setError('Password must contain at least one uppercase letter');
        return;
      }
      if (!/[a-z]/.test(formData.password)) {
        setError('Password must contain at least one lowercase letter');
        return;
      }
      if (!/[0-9]/.test(formData.password)) {
        setError('Password must contain at least one number');
        return;
      }
      if (!/[!@#$%^&*]/.test(formData.password)) {
        setError('Password must contain at least one special character (!@#$%^&*)');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
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
        userType: 'tenant'
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
          <div style={{ width: '20px', height: '20px', background: `linear-gradient(135deg, ${COLOR} 0%, #1e40af 100%)`, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '9px' }}>
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
          {step === 4 && 'Preferences'}
        </h1>
        <p style={{ color: '#6b7280', fontSize: '11px', marginBottom: '12px' }}>
          {step === 1 && 'Tell us about yourself'}
          {step === 2 && 'How can we reach you?'}
          {step === 3 && 'Secure your account'}
          {step === 4 && 'Help us find your perfect home'}
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
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassword ? "text" : "password"}
                    name="password" 
                    value={formData.password}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '7px 9px', paddingRight: '32px', border: `1px solid ${BORDER_COLOR}`, borderRadius: '6px', fontSize: '12px', boxSizing: 'border-box' }}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', padding: '4px' }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '3px', fontWeight: '500', color: '#1f2937', fontSize: '11px' }}>Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword" 
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '7px 9px', paddingRight: '32px', border: `1px solid ${BORDER_COLOR}`, borderRadius: '6px', fontSize: '12px', boxSizing: 'border-box' }}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', padding: '4px' }}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <div>
                <label style={{ display: 'block', marginBottom: '3px', fontWeight: '500', color: '#1f2937', fontSize: '11px' }}>Move-in Date</label>
                <input 
                  type="date" 
                  name="moveInDate" 
                  value={formData.moveInDate}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '7px 9px', border: `1px solid ${BORDER_COLOR}`, borderRadius: '6px', fontSize: '12px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '3px', fontWeight: '500', color: '#1f2937', fontSize: '11px' }}>Budget (Monthly)</label>
                <input 
                  type="number" 
                  name="budget" 
                  value={formData.budget}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '7px 9px', border: `1px solid ${BORDER_COLOR}`, borderRadius: '6px', fontSize: '12px', boxSizing: 'border-box' }}
                  placeholder="1000"
                />
              </div>
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

export default RegisterTenantPage;
