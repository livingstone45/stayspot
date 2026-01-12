import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../common/UI/Input';
import Button from '../common/UI/Button';
import { useAuth } from '../../hooks/useAuth';
import { UserIcon, PhoneIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'tenant',
    companyName: '',
    companyCode: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const userTypes = [
    { value: 'tenant', label: 'Tenant/Resident' },
    { value: 'landlord', label: 'Property Owner' },
    { value: 'property_manager', label: 'Property Manager' },
    { value: 'company', label: 'Company Administrator' },
  ];

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.userType) newErrors.userType = 'Please select user type';
    
    if (formData.userType === 'company') {
      if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
      if (!formData.companyCode.trim()) newErrors.companyCode = 'Company code is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;
    
    setLoading(true);
    
    try {
      const registrationData = {
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`,
      };
      delete registrationData.confirmPassword;
      
      await register(registrationData);
      
      // Redirect based on user type
      switch(formData.userType) {
        case 'company':
          navigate('/company/onboarding');
          break;
        case 'landlord':
          navigate('/landlord/onboarding');
          break;
        case 'property_manager':
          navigate('/management/onboarding');
          break;
        default:
          navigate('/tenant/onboarding');
      }
    } catch (err) {
      setErrors({ submit: err.message || 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your StaySpot account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join our property management platform
          </p>
        </div>

        {/* Progress steps */}
        <div className="flex items-center justify-between mb-8">
          <div className={`flex-1 ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="ml-2">Personal Details</span>
            </div>
          </div>
          <div className="flex-1 h-1 mx-4 bg-gray-200">
            <div className={`h-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          </div>
          <div className={`flex-1 ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="ml-2">Security</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {errors.submit && (
            <div className="rounded-md bg-red-50 p-4 mb-6">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{errors.submit}</h3>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={errors.firstName}
                  required
                  icon={UserIcon}
                />
                <Input
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={errors.lastName}
                  required
                />
              </div>

              <Input
                id="email"
                name="email"
                type="email"
                label="Email Address"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
              />

              <Input
                id="phone"
                name="phone"
                type="tel"
                label="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                required
                icon={PhoneIcon}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  I want to join as a
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {userTypes.map(type => (
                    <div
                      key={type.value}
                      className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all ${
                        formData.userType === type.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleChange({ target: { name: 'userType', value: type.value } })}
                    >
                      <div className="flex items-center">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                          formData.userType === type.value
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {formData.userType === type.value && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        <span className="text-sm font-medium">{type.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.userType && (
                  <p className="mt-1 text-sm text-red-600">{errors.userType}</p>
                )}
              </div>

              {formData.userType === 'company' && (
                <div className="space-y-4">
                  <Input
                    id="companyName"
                    name="companyName"
                    label="Company Name"
                    value={formData.companyName}
                    onChange={handleChange}
                    error={errors.companyName}
                    required
                  />
                  <Input
                    id="companyCode"
                    name="companyCode"
                    label="Company Registration Code"
                    value={formData.companyCode}
                    onChange={handleChange}
                    error={errors.companyCode}
                    required
                    placeholder="Enter your company registration number"
                  />
                </div>
              )}

              <div className="flex justify-between">
                <div></div>
                <Button type="button" onClick={handleNext}>
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <Input
                id="password"
                name="password"
                type="password"
                label="Password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
                helpText="Must be at least 8 characters"
              />

              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                label="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                required
              />

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Account Terms</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-blue-200 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-xs">✓</span>
                    </div>
                    <span>By creating an account, you agree to our Terms of Service</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-blue-200 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-xs">✓</span>
                    </div>
                    <span>You acknowledge our Privacy Policy regarding data handling</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-blue-200 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-xs">✓</span>
                    </div>
                    <span>You consent to receive important notifications about your account</span>
                  </li>
                </ul>
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button type="submit" loading={loading} disabled={loading}>
                  Create Account
                </Button>
              </div>
            </div>
          )}
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;