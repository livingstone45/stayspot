import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  CreditCard, DollarSign, Calendar, User,
  Building, FileText, Banknote, Wallet,
  CheckCircle, AlertCircle, Clock, Upload,
  ChevronDown, X, Search, Smartphone, Wrench
} from 'lucide-react';

const paymentSchema = yup.object({
  tenantId: yup.string().required('Tenant is required'),
  propertyId: yup.string().required('Property is required'),
  unitId: yup.string().required('Unit is required'),
  paymentType: yup.string().required('Payment type is required'),
  paymentMethod: yup.string().required('Payment method is required'),
  amount: yup.number().positive('Amount must be positive').required('Amount is required'),
  paymentDate: yup.date().required('Payment date is required'),
  referenceNumber: yup.string(),
  description: yup.string(),
  applyTo: yup.string(),
  bankAccountId: yup.string().when('paymentMethod', {
    is: (val) => ['bank_transfer', 'ach'].includes(val),
    then: yup.string().required('Bank account is required'),
    otherwise: yup.string()
  }),
  creditCardId: yup.string().when('paymentMethod', {
    is: 'credit_card',
    then: yup.string().required('Credit card is required'),
    otherwise: yup.string()
  }),
  applyLateFee: yup.boolean(),
  lateFeeAmount: yup.number().when('applyLateFee', {
    is: true,
    then: yup.number().positive('Late fee must be positive'),
    otherwise: yup.number()
  }),
  sendReceipt: yup.boolean()
});

const PaymentForm = ({ 
  tenants = [],
  properties = [],
  bankAccounts = [],
  creditCards = [],
  onSubmit,
  onCancel,
  initialData = {}
}) => {
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [filteredUnits, setFilteredUnits] = useState([]);
  const [filteredTenants, setFilteredTenants] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(initialData.paymentMethod || 'bank_transfer');

  const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm({
    resolver: yupResolver(paymentSchema),
    defaultValues: {
      tenantId: initialData.tenantId || '',
      propertyId: initialData.propertyId || '',
      unitId: initialData.unitId || '',
      paymentType: initialData.paymentType || 'rent',
      paymentMethod: initialData.paymentMethod || 'bank_transfer',
      amount: initialData.amount || 0,
      paymentDate: initialData.paymentDate || new Date().toISOString().split('T')[0],
      referenceNumber: initialData.referenceNumber || '',
      description: initialData.description || '',
      applyTo: initialData.applyTo || 'rent',
      bankAccountId: initialData.bankAccountId || '',
      creditCardId: initialData.creditCardId || '',
      applyLateFee: initialData.applyLateFee || false,
      lateFeeAmount: initialData.lateFeeAmount || 0,
      sendReceipt: initialData.sendReceipt !== undefined ? initialData.sendReceipt : true
    }
  });

  const paymentTypes = [
    { value: 'rent', label: 'Rent Payment', icon: Building },
    { value: 'late_fee', label: 'Late Fee', icon: AlertCircle },
    { value: 'security_deposit', label: 'Security Deposit', icon: Wallet },
    { value: 'maintenance', label: 'Maintenance Fee', icon: Wrench },
    { value: 'utility', label: 'Utility Payment', icon: FileText },
    { value: 'other', label: 'Other Payment', icon: DollarSign }
  ];

  const paymentMethods = [
    { value: 'bank_transfer', label: 'Bank Transfer', icon: Banknote },
    { value: 'ach', label: 'ACH', icon: Banknote },
    { value: 'credit_card', label: 'Credit Card', icon: CreditCard },
    { value: 'debit_card', label: 'Debit Card', icon: CreditCard },
    { value: 'check', label: 'Check', icon: FileText },
    { value: 'cash', label: 'Cash', icon: DollarSign },
    { value: 'mobile_payment', label: 'Mobile Payment', icon: Smartphone },
    { value: 'other', label: 'Other', icon: Wallet }
  ];

  const applyToOptions = [
    { value: 'rent', label: 'Current Rent' },
    { value: 'past_due', label: 'Past Due Balance' },
    { value: 'late_fee', label: 'Late Fees' },
    { value: 'security_deposit', label: 'Security Deposit' },
    { value: 'other_charges', label: 'Other Charges' },
    { value: 'split', label: 'Split Payment' }
  ];

  // Filter units and tenants based on selected property
  useEffect(() => {
    if (selectedProperty) {
      const property = properties.find(p => p.id === selectedProperty);
      if (property) {
        setFilteredUnits(property.units || []);
        setFilteredTenants(tenants.filter(t => t.propertyId === selectedProperty));
      }
    } else {
      setFilteredUnits([]);
      setFilteredTenants([]);
    }
  }, [selectedProperty, properties, tenants]);

  // Update selected tenant when tenantId changes
  useEffect(() => {
    const tenantId = watch('tenantId');
    if (tenantId) {
      const tenant = tenants.find(t => t.id === tenantId);
      setSelectedTenant(tenant);
    } else {
      setSelectedTenant(null);
    }
  }, [watch('tenantId'), tenants]);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setDocuments(prev => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    const amount = watch('amount') || 0;
    const lateFee = watch('applyLateFee') ? (watch('lateFeeAmount') || 0) : 0;
    return parseFloat(amount) + parseFloat(lateFee);
  };

  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      // Append form data
      Object.keys(data).forEach(key => {
        if (data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      });

      // Append documents
      documents.forEach(doc => {
        formData.append('documents', doc);
      });

      // Add metadata
      formData.append('processedBy', 'current-user-id'); // Replace with actual user ID
      formData.append('processedAt', new Date().toISOString());
      formData.append('status', 'pending');
      formData.append('totalAmount', calculateTotal());

      await onSubmit(formData);
      reset();
      setDocuments([]);
      setSelectedTenant(null);
      setSelectedProperty(null);
    } catch (error) {
      console.error('Payment submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
          <DollarSign className="w-6 h-6" />
          <span>{initialData.id ? 'Edit Payment' : 'Record New Payment'}</span>
        </h2>
        <p className="text-gray-600 mt-2">
          Record a payment received from a tenant or make a payment to a vendor
        </p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
        {/* Tenant & Property Selection */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Tenant & Property</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building className="inline w-4 h-4 mr-1" />
                Property *
              </label>
              <div className="relative">
                <select
                  {...register('propertyId')}
                  onChange={(e) => {
                    setSelectedProperty(e.target.value);
                    setValue('propertyId', e.target.value);
                    setValue('unitId', '');
                    setValue('tenantId', '');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="">Select property</option>
                  {properties.map(property => (
                    <option key={property.id} value={property.id}>
                      {property.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              {errors.propertyId && (
                <p className="mt-1 text-sm text-red-600">{errors.propertyId.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit *
              </label>
              <div className="relative">
                <select
                  {...register('unitId')}
                  disabled={!selectedProperty}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 appearance-none"
                >
                  <option value="">Select unit</option>
                  {filteredUnits.map(unit => (
                    <option key={unit.id} value={unit.id}>
                      {unit.number} - {unit.type}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              {errors.unitId && (
                <p className="mt-1 text-sm text-red-600">{errors.unitId.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline w-4 h-4 mr-1" />
                Tenant *
              </label>
              <div className="relative">
                <select
                  {...register('tenantId')}
                  disabled={!selectedProperty}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 appearance-none"
                >
                  <option value="">Select tenant</option>
                  {filteredTenants.map(tenant => (
                    <option key={tenant.id} value={tenant.id}>
                      {tenant.name} - {tenant.phone}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              {errors.tenantId && (
                <p className="mt-1 text-sm text-red-600">{errors.tenantId.message}</p>
              )}
            </div>
          </div>

          {/* Tenant Balance Summary */}
          {selectedTenant && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-blue-700">Current Balance</p>
                  <p className="text-xl font-bold text-blue-900">${selectedTenant.currentBalance || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-700">Rent Due</p>
                  <p className="text-xl font-bold text-blue-900">${selectedTenant.rentDue || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-700">Late Fees</p>
                  <p className="text-xl font-bold text-blue-900">${selectedTenant.lateFees || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-700">Last Payment</p>
                  <p className="text-xl font-bold text-blue-900">${selectedTenant.lastPayment || 0}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Payment Details */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Payment Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Type *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {paymentTypes.map(type => {
                  const Icon = type.icon;
                  return (
                    <label
                      key={type.value}
                      className={`relative p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        watch('paymentType') === type.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        value={type.value}
                        {...register('paymentType')}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <Icon className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                        <span className="text-xs font-medium text-gray-900">{type.label}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
              {errors.paymentType && (
                <p className="mt-1 text-sm text-red-600">{errors.paymentType.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Apply Payment To *
              </label>
              <div className="relative">
                <select
                  {...register('applyTo')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  {applyToOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              {errors.applyTo && (
                <p className="mt-1 text-sm text-red-600">{errors.applyTo.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                Payment Date *
              </label>
              <input
                type="date"
                {...register('paymentDate')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.paymentDate && (
                <p className="mt-1 text-sm text-red-600">{errors.paymentDate.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="inline w-4 h-4 mr-1" />
                Amount *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  {...register('amount')}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reference Number
              </label>
              <input
                type="text"
                {...register('referenceNumber')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Check #1234, Transaction ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                {...register('description')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Rent for March 2024"
              />
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Payment Method *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {paymentMethods.map(method => {
                const Icon = method.icon;
                return (
                  <label
                    key={method.value}
                    className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      watch('paymentMethod') === method.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setPaymentMethod(method.value)}
                  >
                    <input
                      type="radio"
                      value={method.value}
                      {...register('paymentMethod')}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <Icon className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">{method.label}</span>
                    </div>
                  </label>
                );
              })}
            </div>
            {errors.paymentMethod && (
              <p className="mt-1 text-sm text-red-600">{errors.paymentMethod.message}</p>
            )}
          </div>

          {/* Bank Account Selection */}
          {(paymentMethod === 'bank_transfer' || paymentMethod === 'ach') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Banknote className="inline w-4 h-4 mr-1" />
                Select Bank Account *
              </label>
              <div className="relative">
                <select
                  {...register('bankAccountId')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="">Select bank account</option>
                  {bankAccounts.map(account => (
                    <option key={account.id} value={account.id}>
                      {account.bankName} - {account.accountNumber} ({account.accountType})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              {errors.bankAccountId && (
                <p className="mt-1 text-sm text-red-600">{errors.bankAccountId.message}</p>
              )}
            </div>
          )}

          {/* Credit Card Selection */}
          {paymentMethod === 'credit_card' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CreditCard className="inline w-4 h-4 mr-1" />
                Select Credit Card *
              </label>
              <div className="relative">
                <select
                  {...register('creditCardId')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="">Select credit card</option>
                  {creditCards.map(card => (
                    <option key={card.id} value={card.id}>
                      {card.cardType} - ****{card.lastFour} (Exp: {card.expiryDate})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              {errors.creditCardId && (
                <p className="mt-1 text-sm text-red-600">{errors.creditCardId.message}</p>
              )}
            </div>
          )}
        </div>

        {/* Late Fee */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Late Fee</h3>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register('applyLateFee')}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Apply Late Fee</span>
            </label>
          </div>
          
          {watch('applyLateFee') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <AlertCircle className="inline w-4 h-4 mr-1" />
                  Late Fee Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    {...register('lateFeeAmount')}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
                {errors.lateFeeAmount && (
                  <p className="mt-1 text-sm text-red-600">{errors.lateFeeAmount.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Late Fee Reason
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Payment 5 days late"
                />
              </div>
            </div>
          )}
        </div>

        {/* Document Upload */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Supporting Documents</h3>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <label className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Upload Supporting Documents
                </span>
                <span className="mt-1 block text-sm text-gray-500">
                  Check images, receipts, or other payment proof
                </span>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <button
                  type="button"
                  onClick={() => document.querySelector('input[type="file"]').click()}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Select Files
                </button>
              </label>
            </div>
          </div>
          
          {documents.length > 0 && (
            <div className="mt-6 space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Uploaded Documents</h4>
              {documents.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notification Settings */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          
          <label className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <input
              type="checkbox"
              {...register('sendReceipt')}
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div>
              <span className="font-medium text-gray-900">Send Receipt to Tenant</span>
              <p className="text-sm text-gray-600 mt-1">
                Email a payment receipt to the tenant after processing
              </p>
            </div>
          </label>
        </div>

        {/* Total Summary */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Amount</span>
              <span className="font-medium">${(watch('amount') || 0).toFixed(2)}</span>
            </div>
            {watch('applyLateFee') && (
              <div className="flex justify-between">
                <span className="text-gray-600">Late Fee</span>
                <span className="font-medium text-red-600">${(watch('lateFeeAmount') || 0).toFixed(2)}</span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between">
                <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                <span className="text-xl font-bold text-green-600">${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <Clock className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Record Payment</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;