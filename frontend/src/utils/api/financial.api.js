import api, { apiUtils } from './axios';

/**
 * Financial API endpoints
 * Handles financial operations, payments, accounting, and financial reporting
 */
class FinancialAPI {
  constructor() {
    this.endpoints = {
      transactions: '/financial/transactions',
      payments: '/financial/payments',
      invoices: '/financial/invoices',
      receipts: '/financial/receipts',
      accounts: '/financial/accounts',
      budgets: '/financial/budgets',
      expenses: '/financial/expenses',
      revenue: '/financial/revenue',
      reports: '/financial/reports',
      analytics: '/financial/analytics',
      taxes: '/financial/taxes',
      insurance: '/financial/insurance',
      utilities: '/financial/utilities',
      deposits: '/financial/deposits',
      refunds: '/financial/refunds',
      late_fees: '/financial/late-fees',
      discounts: '/financial/discounts',
      reconciliation: '/financial/reconciliation',
      statements: '/financial/statements',
      forecasting: '/financial/forecasting'
    };
  }

  /**
   * Get transactions
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Transactions with pagination
   */
  async getTransactions(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.transactions}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get transactions error:', error);
      throw error;
    }
  }

  /**
   * Get transaction by ID
   * @param {string} transactionId - Transaction ID
   * @returns {Promise<Object>} Transaction details
   */
  async getTransaction(transactionId) {
    try {
      const response = await api.get(`${this.endpoints.transactions}/${transactionId}`);
      return response.data.data;
    } catch (error) {
      console.error('Get transaction error:', error);
      throw error;
    }
  }

  /**
   * Create transaction
   * @param {Object} transactionData - Transaction data
   * @param {Array} attachments - Transaction attachments
   * @returns {Promise<Object>} Created transaction
   */
  async createTransaction(transactionData, attachments = []) {
    try {
      const formData = apiUtils.createFormData(transactionData, { attachments });
      const response = await api.post(this.endpoints.transactions, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.data;
    } catch (error) {
      console.error('Create transaction error:', error);
      throw error;
    }
  }

  /**
   * Update transaction
   * @param {string} transactionId - Transaction ID
   * @param {Object} transactionData - Updated transaction data
   * @returns {Promise<Object>} Updated transaction
   */
  async updateTransaction(transactionId, transactionData) {
    try {
      const response = await api.put(`${this.endpoints.transactions}/${transactionId}`, transactionData);
      return response.data.data;
    } catch (error) {
      console.error('Update transaction error:', error);
      throw error;
    }
  }

  /**
   * Delete transaction
   * @param {string} transactionId - Transaction ID
   * @returns {Promise<Object>} Deletion result
   */
  async deleteTransaction(transactionId) {
    try {
      const response = await api.delete(`${this.endpoints.transactions}/${transactionId}`);
      return response.data.data;
    } catch (error) {
      console.error('Delete transaction error:', error);
      throw error;
    }
  }

  /**
   * Get payments
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Payments with pagination
   */
  async getPayments(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.payments}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get payments error:', error);
      throw error;
    }
  }

  /**
   * Process payment
   * @param {Object} paymentData - Payment data
   * @returns {Promise<Object>} Payment result
   */
  async processPayment(paymentData) {
    try {
      const response = await api.post(this.endpoints.payments, paymentData);
      return response.data.data;
    } catch (error) {
      console.error('Process payment error:', error);
      throw error;
    }
  }

  /**
   * Refund payment
   * @param {string} paymentId - Payment ID
   * @param {Object} refundData - Refund data
   * @returns {Promise<Object>} Refund result
   */
  async refundPayment(paymentId, refundData) {
    try {
      const response = await api.post(`${this.endpoints.payments}/${paymentId}/refund`, refundData);
      return response.data.data;
    } catch (error) {
      console.error('Refund payment error:', error);
      throw error;
    }
  }

  /**
   * Get payment methods
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Payment methods
   */
  async getPaymentMethods(userId) {
    try {
      const response = await api.get(`${this.endpoints.payments}/methods?userId=${userId}`);
      return response.data.data;
    } catch (error) {
      console.error('Get payment methods error:', error);
      throw error;
    }
  }

  /**
   * Add payment method
   * @param {Object} paymentMethodData - Payment method data
   * @returns {Promise<Object>} Added payment method
   */
  async addPaymentMethod(paymentMethodData) {
    try {
      const response = await api.post(`${this.endpoints.payments}/methods`, paymentMethodData);
      return response.data.data;
    } catch (error) {
      console.error('Add payment method error:', error);
      throw error;
    }
  }

  /**
   * Remove payment method
   * @param {string} paymentMethodId - Payment method ID
   * @returns {Promise<Object>} Removal result
   */
  async removePaymentMethod(paymentMethodId) {
    try {
      const response = await api.delete(`${this.endpoints.payments}/methods/${paymentMethodId}`);
      return response.data.data;
    } catch (error) {
      console.error('Remove payment method error:', error);
      throw error;
    }
  }

  /**
   * Get invoices
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Invoices with pagination
   */
  async getInvoices(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.invoices}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get invoices error:', error);
      throw error;
    }
  }

  /**
   * Get invoice by ID
   * @param {string} invoiceId - Invoice ID
   * @returns {Promise<Object>} Invoice details
   */
  async getInvoice(invoiceId) {
    try {
      const response = await api.get(`${this.endpoints.invoices}/${invoiceId}`);
      return response.data.data;
    } catch (error) {
      console.error('Get invoice error:', error);
      throw error;
    }
  }

  /**
   * Create invoice
   * @param {Object} invoiceData - Invoice data
   * @returns {Promise<Object>} Created invoice
   */
  async createInvoice(invoiceData) {
    try {
      const response = await api.post(this.endpoints.invoices, invoiceData);
      return response.data.data;
    } catch (error) {
      console.error('Create invoice error:', error);
      throw error;
    }
  }

  /**
   * Update invoice
   * @param {string} invoiceId - Invoice ID
   * @param {Object} invoiceData - Updated invoice data
   * @returns {Promise<Object>} Updated invoice
   */
  async updateInvoice(invoiceId, invoiceData) {
    try {
      const response = await api.put(`${this.endpoints.invoices}/${invoiceId}`, invoiceData);
      return response.data.data;
    } catch (error) {
      console.error('Update invoice error:', error);
      throw error;
    }
  }

  /**
   * Send invoice
   * @param {string} invoiceId - Invoice ID
   * @param {Object} sendOptions - Send options
   * @returns {Promise<Object>} Send result
   */
  async sendInvoice(invoiceId, sendOptions = {}) {
    try {
      const response = await api.post(`${this.endpoints.invoices}/${invoiceId}/send`, sendOptions);
      return response.data.data;
    } catch (error) {
      console.error('Send invoice error:', error);
      throw error;
    }
  }

  /**
   * Mark invoice as paid
   * @param {string} invoiceId - Invoice ID
   * @param {Object} paymentData - Payment data
   * @returns {Promise<Object>} Payment result
   */
  async markInvoicePaid(invoiceId, paymentData) {
    try {
      const response = await api.post(`${this.endpoints.invoices}/${invoiceId}/mark-paid`, paymentData);
      return response.data.data;
    } catch (error) {
      console.error('Mark invoice paid error:', error);
      throw error;
    }
  }

  /**
   * Get receipts
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Receipts with pagination
   */
  async getReceipts(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.receipts}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get receipts error:', error);
      throw error;
    }
  }

  /**
   * Generate receipt
   * @param {string} paymentId - Payment ID
   * @param {Object} receiptOptions - Receipt options
   * @returns {Promise<Object>} Generated receipt
   */
  async generateReceipt(paymentId, receiptOptions = {}) {
    try {
      const response = await api.post(`${this.endpoints.receipts}/generate`, {
        paymentId,
        ...receiptOptions
      });
      return response.data.data;
    } catch (error) {
      console.error('Generate receipt error:', error);
      throw error;
    }
  }

  /**
   * Get accounts
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Accounts with pagination
   */
  async getAccounts(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.accounts}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get accounts error:', error);
      throw error;
    }
  }

  /**
   * Create account
   * @param {Object} accountData - Account data
   * @returns {Promise<Object>} Created account
   */
  async createAccount(accountData) {
    try {
      const response = await api.post(this.endpoints.accounts, accountData);
      return response.data.data;
    } catch (error) {
      console.error('Create account error:', error);
      throw error;
    }
  }

  /**
   * Update account
   * @param {string} accountId - Account ID
   * @param {Object} accountData - Updated account data
   * @returns {Promise<Object>} Updated account
   */
  async updateAccount(accountId, accountData) {
    try {
      const response = await api.put(`${this.endpoints.accounts}/${accountId}`, accountData);
      return response.data.data;
    } catch (error) {
      console.error('Update account error:', error);
      throw error;
    }
  }

  /**
   * Get account balance
   * @param {string} accountId - Account ID
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Account balance
   */
  async getAccountBalance(accountId, params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.accounts}/${accountId}/balance?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get account balance error:', error);
      throw error;
    }
  }

  /**
   * Get budgets
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Budgets with pagination
   */
  async getBudgets(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.budgets}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get budgets error:', error);
      throw error;
    }
  }

  /**
   * Create budget
   * @param {Object} budgetData - Budget data
   * @returns {Promise<Object>} Created budget
   */
  async createBudget(budgetData) {
    try {
      const response = await api.post(this.endpoints.budgets, budgetData);
      return response.data.data;
    } catch (error) {
      console.error('Create budget error:', error);
      throw error;
    }
  }

  /**
   * Update budget
   * @param {string} budgetId - Budget ID
   * @param {Object} budgetData - Updated budget data
   * @returns {Promise<Object>} Updated budget
   */
  async updateBudget(budgetId, budgetData) {
    try {
      const response = await api.put(`${this.endpoints.budgets}/${budgetId}`, budgetData);
      return response.data.data;
    } catch (error) {
      console.error('Update budget error:', error);
      throw error;
    }
  }

  /**
   * Get budget performance
   * @param {string} budgetId - Budget ID
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Budget performance
   */
  async getBudgetPerformance(budgetId, params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.budgets}/${budgetId}/performance?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get budget performance error:', error);
      throw error;
    }
  }

  /**
   * Get expenses
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Expenses with pagination
   */
  async getExpenses(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.expenses}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get expenses error:', error);
      throw error;
    }
  }

  /**
   * Record expense
   * @param {Object} expenseData - Expense data
   * @param {Array} receipts - Receipt files
   * @returns {Promise<Object>} Recorded expense
   */
  async recordExpense(expenseData, receipts = []) {
    try {
      const formData = apiUtils.createFormData(expenseData, { receipts });
      const response = await api.post(this.endpoints.expenses, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.data;
    } catch (error) {
      console.error('Record expense error:', error);
      throw error;
    }
  }

  /**
   * Update expense
   * @param {string} expenseId - Expense ID
   * @param {Object} expenseData - Updated expense data
   * @returns {Promise<Object>} Updated expense
   */
  async updateExpense(expenseId, expenseData) {
    try {
      const response = await api.put(`${this.endpoints.expenses}/${expenseId}`, expenseData);
      return response.data.data;
    } catch (error) {
      console.error('Update expense error:', error);
      throw error;
    }
  }

  /**
   * Get revenue data
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Revenue data
   */
  async getRevenue(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.revenue}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get revenue error:', error);
      throw error;
    }
  }

  /**
   * Record revenue
   * @param {Object} revenueData - Revenue data
   * @returns {Promise<Object>} Recorded revenue
   */
  async recordRevenue(revenueData) {
    try {
      const response = await api.post(this.endpoints.revenue, revenueData);
      return response.data.data;
    } catch (error) {
      console.error('Record revenue error:', error);
      throw error;
    }
  }

  /**
   * Get financial reports
   * @param {Object} params - Report parameters
   * @returns {Promise<Object>} Financial reports
   */
  async getReports(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.reports}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get reports error:', error);
      throw error;
    }
  }

  /**
   * Generate financial report
   * @param {Object} reportConfig - Report configuration
   * @returns {Promise<Object>} Generated report
   */
  async generateReport(reportConfig) {
    try {
      const response = await api.post(`${this.endpoints.reports}/generate`, reportConfig);
      return response.data.data;
    } catch (error) {
      console.error('Generate report error:', error);
      throw error;
    }
  }

  /**
   * Get profit and loss statement
   * @param {Object} params - P&L parameters
   * @returns {Promise<Object>} P&L statement
   */
  async getProfitLoss(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.reports}/profit-loss?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get profit loss error:', error);
      throw error;
    }
  }

  /**
   * Get balance sheet
   * @param {Object} params - Balance sheet parameters
   * @returns {Promise<Object>} Balance sheet
   */
  async getBalanceSheet(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.reports}/balance-sheet?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get balance sheet error:', error);
      throw error;
    }
  }

  /**
   * Get cash flow statement
   * @param {Object} params - Cash flow parameters
   * @returns {Promise<Object>} Cash flow statement
   */
  async getCashFlow(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.reports}/cash-flow?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get cash flow error:', error);
      throw error;
    }
  }

  /**
   * Get financial analytics
   * @param {Object} params - Analytics parameters
   * @returns {Promise<Object>} Financial analytics
   */
  async getAnalytics(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.analytics}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get analytics error:', error);
      throw error;
    }
  }

  /**
   * Get tax information
   * @param {Object} params - Tax parameters
   * @returns {Promise<Object>} Tax information
   */
  async getTaxInfo(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.taxes}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get tax info error:', error);
      throw error;
    }
  }

  /**
   * Generate tax report
   * @param {Object} taxConfig - Tax report configuration
   * @returns {Promise<Object>} Generated tax report
   */
  async generateTaxReport(taxConfig) {
    try {
      const response = await api.post(`${this.endpoints.taxes}/report`, taxConfig);
      return response.data.data;
    } catch (error) {
      console.error('Generate tax report error:', error);
      throw error;
    }
  }

  /**
   * Get deposits
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Deposits
   */
  async getDeposits(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.deposits}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get deposits error:', error);
      throw error;
    }
  }

  /**
   * Record deposit
   * @param {Object} depositData - Deposit data
   * @returns {Promise<Object>} Recorded deposit
   */
  async recordDeposit(depositData) {
    try {
      const response = await api.post(this.endpoints.deposits, depositData);
      return response.data.data;
    } catch (error) {
      console.error('Record deposit error:', error);
      throw error;
    }
  }

  /**
   * Get late fees
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Late fees
   */
  async getLateFees(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.late_fees}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get late fees error:', error);
      throw error;
    }
  }

  /**
   * Apply late fee
   * @param {Object} lateFeeData - Late fee data
   * @returns {Promise<Object>} Applied late fee
   */
  async applyLateFee(lateFeeData) {
    try {
      const response = await api.post(this.endpoints.late_fees, lateFeeData);
      return response.data.data;
    } catch (error) {
      console.error('Apply late fee error:', error);
      throw error;
    }
  }

  /**
   * Get discounts
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Discounts
   */
  async getDiscounts(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.discounts}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get discounts error:', error);
      throw error;
    }
  }

  /**
   * Apply discount
   * @param {Object} discountData - Discount data
   * @returns {Promise<Object>} Applied discount
   */
  async applyDiscount(discountData) {
    try {
      const response = await api.post(this.endpoints.discounts, discountData);
      return response.data.data;
    } catch (error) {
      console.error('Apply discount error:', error);
      throw error;
    }
  }

  /**
   * Get reconciliation data
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Reconciliation data
   */
  async getReconciliation(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.reconciliation}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get reconciliation error:', error);
      throw error;
    }
  }

  /**
   * Perform reconciliation
   * @param {Object} reconciliationData - Reconciliation data
   * @returns {Promise<Object>} Reconciliation result
   */
  async performReconciliation(reconciliationData) {
    try {
      const response = await api.post(this.endpoints.reconciliation, reconciliationData);
      return response.data.data;
    } catch (error) {
      console.error('Perform reconciliation error:', error);
      throw error;
    }
  }

  /**
   * Get financial statements
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Financial statements
   */
  async getStatements(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.statements}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get statements error:', error);
      throw error;
    }
  }

  /**
   * Generate statement
   * @param {Object} statementConfig - Statement configuration
   * @returns {Promise<Object>} Generated statement
   */
  async generateStatement(statementConfig) {
    try {
      const response = await api.post(`${this.endpoints.statements}/generate`, statementConfig);
      return response.data.data;
    } catch (error) {
      console.error('Generate statement error:', error);
      throw error;
    }
  }

  /**
   * Get financial forecasting
   * @param {Object} params - Forecasting parameters
   * @returns {Promise<Object>} Financial forecasting
   */
  async getForecasting(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.forecasting}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Get forecasting error:', error);
      throw error;
    }
  }

  /**
   * Create forecast
   * @param {Object} forecastData - Forecast data
   * @returns {Promise<Object>} Created forecast
   */
  async createForecast(forecastData) {
    try {
      const response = await api.post(this.endpoints.forecasting, forecastData);
      return response.data.data;
    } catch (error) {
      console.error('Create forecast error:', error);
      throw error;
    }
  }

  /**
   * Export financial data
   * @param {Object} params - Export parameters
   * @returns {Promise<Blob>} Export file
   */
  async exportData(params = {}) {
    try {
      const queryString = apiUtils.buildQueryString(params);
      const response = await api.get(`${this.endpoints.reports}/export?${queryString}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Export financial data error:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
const financialAPI = new FinancialAPI();
export default financialAPI;