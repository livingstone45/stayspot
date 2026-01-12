import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  User, Mail, Phone, Briefcase, DollarSign, 
  FileText, Calendar, Home, Upload, Check
} from 'lucide-react';

const applicationSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().matches(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').required('Phone is required'),
  employmentStatus: yup.string().required('Employment status is required'),
  monthlyIncome: yup.number().positive().required('Monthly income is required'),
  employerName: yup.string(),
  employerPhone: yup.string(),
  position: yup.string(),
  yearsEmployed: yup.number().min(0),
  emergencyContactName: yup.string().required('Emergency contact name is required'),
  emergencyContactPhone: yup.string().required('Emergency contact phone is required'),
  relationship: yup.string().required('Relationship is required'),
  hasPets: yup.boolean(),
  petType: yup.string().when('hasPets', {
    is: true,
    then: yup.string().required('Pet type is required when you have pets'),
    otherwise: yup.string()
  }),
  numberOfOccupants: yup.number().min(1).required('Number of occupants is required'),
  moveInDate: yup.date().min(new Date(), 'Move-in date must be in the future').required('Move-in date is required'),
  leaseTerm: yup.number().min(1).max(24).required('Lease term is required'),
  references: yup.array().of(
    yup.object({
      name: yup.string(),
      phone: yup.string(),
      relationship: yup.string(),
      yearsKnown: yup.number()
    })
  ),
  agreeToTerms: yup.boolean().oneOf([true], 'You must agree to the terms'),
  agreeToBackgroundCheck: yup.boolean().oneOf([true], 'You must agree to background check'),
  agreeToCreditCheck: yup.boolean().oneOf([true], 'You must agree to credit check')
});

const ApplicationForm = ({ propertyId, unitId, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [documents, setDocuments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    resolver: yupResolver(applicationSchema),
    defaultValues: {
      hasPets: false,
      numberOfOccupants: 1,
      leaseTerm: 12,
      references: [{}, {}, {}],
      agreeToTerms: false,
      agreeToBackgroundCheck: false,
      agreeToCreditCheck: false
    }
  });

  const steps = [
    { id: 1, title: 'Personal Information', icon: User },
    { id: 2, title: 'Employment & Income', icon: Briefcase },
    { id: 3, title: 'References & Pets', icon: FileText },
    { id: 4, title: 'Documents', icon: Upload },
    { id: 5, title: 'Review & Submit', icon: Check }
  ];

  const hasPets = watch('hasPets');

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setDocuments(prev => [...prev, ...files]);
  };

  const removeDocument = (index) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      // Append form data
      Object.keys(data).forEach(key => {
        if (key === 'references') {
          formData.append(key, JSON.stringify(data[key]));
        } else if (key === 'moveInDate') {
          formData.append(key, data[key].toISOString());
        } else {
          formData.append(key, data[key]);
        }
      });

      // Append documents
      documents.forEach(file => {
        formData.append('documents', file);
      });

      // Append property/unit info
      formData.append('propertyId', propertyId);
      formData.append('unitId', unitId);
      formData.append('applicationDate', new Date().toISOString());
      formData.append('status', 'pending');

      await onSubmit(formData);
    } catch (error) {
      console.error('Application submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline w-4 h-4 mr-1" />
                  First Name
                </label>
                <input
                  {...register('firstName')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  {...register('lastName')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="inline w-4 h-4 mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="inline w-4 h-4 mr-1" />
                  Phone Number
                </label>
                <input
                  {...register('phone')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+1234567890"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Employment & Income</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employment Status
                </label>
                <select
                  {...register('employmentStatus')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select status</option>
                  <option value="employed">Employed</option>
                  <option value="self-employed">Self-Employed</option>
                  <option value="student">Student</option>
                  <option value="retired">Retired</option>
                  <option value="unemployed">Unemployed</option>
                </select>
                {errors.employmentStatus && (
                  <p className="mt-1 text-sm text-red-600">{errors.employmentStatus.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="inline w-4 h-4 mr-1" />
                  Monthly Income (USD)
                </label>
                <input
                  type="number"
                  {...register('monthlyIncome')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="3000"
                />
                {errors.monthlyIncome && (
                  <p className="mt-1 text-sm text-red-600">{errors.monthlyIncome.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employer Name
                </label>
                <input
                  {...register('employerName')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ABC Corporation"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position
                </label>
                <input
                  {...register('position')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Software Developer"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">References & Pets</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register('hasPets')}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Do you have pets?</span>
                </label>
              </div>
              {hasPets && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pet Type
                  </label>
                  <input
                    {...register('petType')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Dog, Cat, etc."
                  />
                  {errors.petType && (
                    <p className="mt-1 text-sm text-red-600">{errors.petType.message}</p>
                  )}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Occupants
                </label>
                <input
                  type="number"
                  {...register('numberOfOccupants')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max="10"
                />
                {errors.numberOfOccupants && (
                  <p className="mt-1 text-sm text-red-600">{errors.numberOfOccupants.message}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Required Documents</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-gray-900">
                    Upload Documents
                  </span>
                  <span className="mt-1 block text-sm text-gray-500">
                    Upload ID, proof of income, and other required documents
                  </span>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                  <button
                    type="button"
                    onClick={() => document.querySelector('input[type="file"]').click()}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Select Files
                  </button>
                </label>
              </div>
            </div>
            {documents.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Uploaded Documents</h4>
                <ul className="space-y-2">
                  {documents.map((file, index) => (
                    <li key={index} className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-md">
                      <span className="text-sm text-gray-600">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeDocument(index)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Review & Submit</h3>
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('agreeToTerms')}
                  id="agreeToTerms"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="agreeToTerms" className="text-sm text-gray-700">
                  I agree to the Terms and Conditions
                </label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-sm text-red-600">{errors.agreeToTerms.message}</p>
              )}

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('agreeToBackgroundCheck')}
                  id="agreeToBackgroundCheck"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="agreeToBackgroundCheck" className="text-sm text-gray-700">
                  I authorize a background check (fee may apply)
                </label>
              </div>
              {errors.agreeToBackgroundCheck && (
                <p className="text-sm text-red-600">{errors.agreeToBackgroundCheck.message}</p>
              )}

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('agreeToCreditCheck')}
                  id="agreeToCreditCheck"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="agreeToCreditCheck" className="text-sm text-gray-700">
                  I authorize a credit check (fee may apply)
                </label>
              </div>
              {errors.agreeToCreditCheck && (
                <p className="text-sm text-red-600">{errors.agreeToCreditCheck.message}</p>
              )}

              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Application fee: $50 (non-refundable)
                </p>
                <p className="text-sm text-gray-500">
                  You will be redirected to payment after submission
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Rental Application</h2>
        <p className="text-gray-600 mt-2">Complete all steps to submit your application</p>
      </div>

      {/* Stepper */}
      <div className="mb-8">
        <nav className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= step.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="ml-3">
                  <div className={`text-xs font-semibold ${currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'}`}>
                    STEP {step.id}
                  </div>
                  <div className={`text-sm font-medium ${currentStep >= step.id ? 'text-gray-900' : 'text-gray-400'}`}>
                    {step.title}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'}`} />
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="mb-8">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className={`px-6 py-2 rounded-md ${currentStep === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Previous
          </button>
          {currentStep < steps.length ? (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => Math.min(steps.length, prev + 1))}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm;