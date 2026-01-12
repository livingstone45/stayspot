const Joi = require('joi');
const { PaymentStatus, TransactionType, InvoiceStatus } = require('../constants/status');

const paymentSchema = Joi.object({
  amount: Joi.number().positive().required()
    .messages({
      'number.positive': 'Amount must be a positive number'
    }),
  
  currency: Joi.string().default('USD'),
  
  description: Joi.string().required().min(3).max(500)
    .messages({
      'string.empty': 'Payment description is required',
      'string.min': 'Description must be at least 3 characters',
      'string.max': 'Description cannot exceed 500 characters'
    }),
  
  propertyId: Joi.number().integer().min(1).required(),
  
  unitId: Joi.number().integer().min(1),
  
  tenantId: Joi.number().integer().min(1),
  
  type: Joi.string().valid(...Object.values(TransactionType)).required()
    .messages({
      'any.only': `Payment type must be one of: ${Object.values(TransactionType).join(', ')}`
    }),
  
  status: Joi.string().valid(...Object.values(PaymentStatus)).default(PaymentStatus.PENDING)
    .messages({
      'any.only': `Status must be one of: ${Object.values(PaymentStatus).join(', ')}`
    }),
  
  dueDate: Joi.date().required(),
  
  paidDate: Joi.date(),
  
  paymentMethod: Joi.string().valid('credit_card', 'bank_transfer', 'cash', 'check', 'digital_wallet'),
  
  referenceNumber: Joi.string(),
  
  metadata: Joi.object({
    invoiceNumber: Joi.string(),
    receiptNumber: Joi.string(),
    taxAmount: Joi.number().min(0),
    lateFee: Joi.number().min(0)
  })
});

const transactionSchema = Joi.object({
  amount: Joi.number().required(),
  currency: Joi.string().default('USD'),
  type: Joi.string().valid('income', 'expense', 'transfer').required(),
  category: Joi.string().required(),
  subcategory: Joi.string(),
  description: Joi.string().required().min(3).max(500),
  date: Joi.date().required(),
  propertyId: Joi.number().integer().min(1),
  vendorId: Joi.number().integer().min(1),
  paymentMethod: Joi.string(),
  reference: Joi.string(),
  metadata: Joi.object()
});

const invoiceSchema = Joi.object({
  invoiceNumber: Joi.string().required(),
  amount: Joi.number().positive().required(),
  currency: Joi.string().default('USD'),
  status: Joi.string().valid(...Object.values(InvoiceStatus)).default(InvoiceStatus.PENDING),
  dueDate: Joi.date().required(),
  issueDate: Joi.date().default(Date.now),
  tenantId: Joi.number().integer().min(1),
  propertyId: Joi.number().integer().min(1),
  items: Joi.array().items(Joi.object({
    description: Joi.string().required(),
    quantity: Joi.number().positive().required(),
    unitPrice: Joi.number().positive().required(),
    total: Joi.number().positive().required()
  })).min(1),
  notes: Joi.string().max(1000),
  metadata: Joi.object()
});

const validatePayment = (data) => {
  return paymentSchema.validate(data, { abortEarly: false });
};

const validateTransaction = (data) => {
  return transactionSchema.validate(data, { abortEarly: false });
};

const validateInvoice = (data) => {
  return invoiceSchema.validate(data, { abortEarly: false });
};

module.exports = {
  validatePayment,
  validateTransaction,
  validateInvoice,
  paymentSchema,
  transactionSchema,
  invoiceSchema
};