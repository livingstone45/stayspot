import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './useAuth';
import { usePermissions } from './usePermissions';

export const useFinancials = () => {
  const { apiCall, user } = useAuth();
  const { hasPermission, canView } = usePermissions();
  
  const [transactions, setTransactions] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [reports, setReports] = useState([]);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    category: 'all',
    property: 'all',
    dateRange: 'month',
    search: ''
  });

  const fetchTransactions = useCallback(async (params = {}) => {
    if (!hasPermission('financials.view')) {
      setError('Access denied to view transactions');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        ...filters,
        ...params
      }).toString();

      const data = await apiCall(`/financials/transactions?${queryParams}`);
      setTransactions(data.transactions || []);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, hasPermission, filters]);

  const fetchTransaction = useCallback(async (transactionId) => {
    if (!hasPermission('financials.view')) {
      setError('Access denied to view transaction');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiCall(`/financials/transactions/${transactionId}`);
      setCurrentTransaction(data.transaction);
      return data.transaction;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, hasPermission]);

  const createTransaction = useCallback(async (transactionData) => {
    if (!hasPermission('financials.manage')) {
      setError('Access denied to create transactions');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiCall('/financials/transactions', {
        method: 'POST',
        body: JSON.stringify({
          ...transactionData,
          createdBy: user.id,
          companyId: user.companyId
        })
      });

      setTransactions(prev => [data.transaction, ...prev]);
      return data.transaction;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, hasPermission, user]);

  const updateTransaction = useCallback(async (transactionId, updates) => {
    if (!hasPermission('financials.manage')) {
      setError('Access denied to update transactions');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiCall(`/financials/transactions/${transactionId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });

      setTransactions(prev => 
        prev.map(transaction => 
          transaction.id === transactionId ? data.transaction : transaction
        )
      );

      if (currentTransaction?.id === transactionId) {
        setCurrentTransaction(data.transaction);
      }

      return data.transaction;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, hasPermission, currentTransaction]);

  const deleteTransaction = useCallback(async (transactionId) => {
    if (!hasPermission('financials.manage')) {
      setError('Access denied to delete transactions');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await apiCall(`/financials/transactions/${transactionId}`, {
        method: 'DELETE'
      });

      setTransactions(prev => prev.filter(transaction => transaction.id !== transactionId));
      
      if (currentTransaction?.id === transactionId) {
        setCurrentTransaction(null);
      }

      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, hasPermission, currentTransaction]);

  const fetchInvoices = useCallback(async (params = {}) => {
    if (!hasPermission('financials.view')) {
      setError('Access denied to view invoices');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams(params).toString();
      const data = await apiCall(`/financials/invoices?${queryParams}`);
      setInvoices(data.invoices || []);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, hasPermission]);

  const createInvoice = useCallback(async (invoiceData) => {
    if (!hasPermission('invoices.manage')) {
      setError('Access denied to create invoices');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiCall('/financials/invoices', {
        method: 'POST',
        body: JSON.stringify({
          ...invoiceData,
          createdBy: user.id
        })
      });

      setInvoices(prev => [data.invoice, ...prev]);
      return data.invoice;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, hasPermission, user]);

  const sendInvoice = useCallback(async (invoiceId, sendOptions = {}) => {
    if (!hasPermission('invoices.manage')) {
      setError('Access denied to send invoices');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiCall(`/financials/invoices/${invoiceId}/send`, {
        method: 'POST',
        body: JSON.stringify(sendOptions)
      });

      setInvoices(prev => 
        prev.map(invoice => 
          invoice.id === invoiceId ? data.invoice : invoice
        )
      );

      return data.invoice;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, hasPermission]);

  const fetchPayments = useCallback(async (params = {}) => {
    if (!hasPermission('payments.view')) {
      setError('Access denied to view payments');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams(params).toString();
      const data = await apiCall(`/financials/payments?${queryParams}`);
      setPayments(data.payments || []);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, hasPermission]);

  const processPayment = useCallback(async (paymentData) => {
    if (!hasPermission('payments.manage')) {
      setError('Access denied to process payments');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiCall('/financials/payments/process', {
        method: 'POST',
        body: JSON.stringify({
          ...paymentData,
          processedBy: user.id
        })
      });

      setPayments(prev => [data.payment, ...prev]);
      return data.payment;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, hasPermission, user]);

  const refundPayment = useCallback(async (paymentId, refundData) => {
    if (!hasPermission('payments.manage')) {
      setError('Access denied to process refunds');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiCall(`/financials/payments/${paymentId}/refund`, {
        method: 'POST',
        body: JSON.stringify({
          ...refundData,
          processedBy: user.id
        })
      });

      setPayments(prev => 
        prev.map(payment => 
          payment.id === paymentId ? data.payment : payment
        )
      );

      return data.payment;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, hasPermission, user]);

  const fetchExpenses = useCallback(async (params = {}) => {
    if (!hasPermission('financials.view')) {
      setError('Access denied to view expenses');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams(params).toString();
      const data = await apiCall(`/financials/expenses?${queryParams}`);
      setExpenses(data.expenses || []);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, hasPermission]);

  const createExpense = useCallback(async (expenseData) => {
    if (!hasPermission('financials.manage')) {
      setError('Access denied to create expenses');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiCall('/financials/expenses', {
        method: 'POST',
        body: JSON.stringify({
          ...expenseData,
          createdBy: user.id
        })
      });

      setExpenses(prev => [data.expense, ...prev]);
      return data.expense;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, hasPermission, user]);

  const approveExpense = useCallback(async (expenseId, approvalData = {}) => {
    if (!hasPermission('financials.manage')) {
      setError('Access denied to approve expenses');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiCall(`/financials/expenses/${expenseId}/approve`, {
        method: 'POST',
        body: JSON.stringify({
          ...approvalData,
          approvedBy: user.id
        })
      });

      setExpenses(prev => 
        prev.map(expense => 
          expense.id === expenseId ? data.expense : expense
        )
      );

      return data.expense;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, hasPermission, user]);

  const fetchBudgets = useCallback(async (params = {}) => {
    if (!hasPermission('budgets.view')) {
      setError('Access denied to view budgets');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams(params).toString();
      const data = await apiCall(`/financials/budgets?${queryParams}`);
      setBudgets(data.budgets || []);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, hasPermission]);

  const createBudget = useCallback(async (budgetData) => {
    if (!hasPermission('budgets.manage')) {
      setError('Access denied to create budgets');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiCall('/financials/budgets', {
        method: 'POST',
        body: JSON.stringify({
          ...budgetData,
          createdBy: user.id
        })
      });

      setBudgets(prev => [data.budget, ...prev]);
      return data.budget;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, hasPermission, user]);

  const generateReport = useCallback(async (reportType, reportParams = {}) => {
    if (!hasPermission('reports.view')) {
      setError('Access denied to generate reports');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiCall(`/financials/reports/${reportType}`, {
        method: 'POST',
        body: JSON.stringify(reportParams)
      });

      setReports(prev => [data.report, ...prev]);
      return data.report;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, hasPermission]);

  const exportData = useCallback(async (exportType, exportParams = {}) => {
    if (!hasPermission('reports.view')) {
      setError('Access denied to export data');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiCall(`/financials/export/${exportType}`, {
        method: 'POST',
        body: JSON.stringify(exportParams)
      });

      return data.exportUrl;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, hasPermission]);

  const getFinancialSummary = useCallback(async (period = 'month', propertyId = null) => {
    if (!hasPermission('financials.view')) {
      setError('Access denied to view financial summary');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ period });
      if (propertyId) params.append('propertyId', propertyId);

      const data = await apiCall(`/financials/summary?${params.toString()}`);
      return data.summary;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, hasPermission]);

  const getCashFlow = useCallback(async (period = 'month', propertyId = null) => {
    if (!hasPermission('financials.view')) {
      setError('Access denied to view cash flow');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ period });
      if (propertyId) params.append('propertyId', propertyId);

      const data = await apiCall(`/financials/cashflow?${params.toString()}`);
      return data.cashflow;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, hasPermission]);

  const reconcileAccount = useCallback(async (accountId, reconciliationData) => {
    if (!hasPermission('accounting.manage')) {
      setError('Access denied to reconcile accounts');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiCall(`/financials/accounts/${accountId}/reconcile`, {
        method: 'POST',
        body: JSON.stringify({
          ...reconciliationData,
          reconciledBy: user.id
        })
      });

      return data.reconciliation;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, hasPermission, user]);

  // Computed values
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const matchesType = filters.type === 'all' || transaction.type === filters.type;
      const matchesStatus = filters.status === 'all' || transaction.status === filters.status;
      const matchesCategory = filters.category === 'all' || transaction.category === filters.category;
      const matchesProperty = filters.property === 'all' || transaction.propertyId === filters.property;
      const matchesSearch = !filters.search || 
        transaction.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
        transaction.reference?.toLowerCase().includes(filters.search.toLowerCase());

      return matchesType && matchesStatus && matchesCategory && matchesProperty && matchesSearch;
    });
  }, [transactions, filters]);

  const financialStats = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const pending = transactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0);
    const overdue = invoices.filter(i => new Date(i.dueDate) < new Date() && i.status !== 'paid').length;

    return {
      totalIncome: income,
      totalExpenses: expenses,
      netIncome: income - expenses,
      pendingAmount: pending,
      overdueInvoices: overdue,
      totalTransactions: transactions.length,
      totalInvoices: invoices.length,
      totalPayments: payments.length,
      averageTransaction: transactions.length > 0 ? (income + expenses) / transactions.length : 0
    };
  }, [transactions, invoices, payments]);

  const monthlyTrends = useMemo(() => {
    const last12Months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return {
        month: date.toISOString().slice(0, 7),
        income: 0,
        expenses: 0
      };
    }).reverse();

    transactions.forEach(transaction => {
      const transactionMonth = transaction.date.slice(0, 7);
      const monthData = last12Months.find(m => m.month === transactionMonth);
      
      if (monthData) {
        if (transaction.type === 'income') {
          monthData.income += transaction.amount;
        } else {
          monthData.expenses += transaction.amount;
        }
      }
    });

    return last12Months;
  }, [transactions]);

  // Initialize data
  useEffect(() => {
    if (hasPermission('financials.view')) {
      fetchTransactions();
      fetchInvoices();
      fetchPayments();
      fetchExpenses();
      fetchBudgets();
    }
  }, [hasPermission]);

  return {
    // State
    transactions: filteredTransactions,
    allTransactions: transactions,
    invoices,
    payments,
    expenses,
    budgets,
    reports,
    currentTransaction,
    loading,
    error,
    filters,
    financialStats,
    monthlyTrends,

    // Actions
    fetchTransactions,
    fetchTransaction,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    fetchInvoices,
    createInvoice,
    sendInvoice,
    fetchPayments,
    processPayment,
    refundPayment,
    fetchExpenses,
    createExpense,
    approveExpense,
    fetchBudgets,
    createBudget,
    generateReport,
    exportData,
    getFinancialSummary,
    getCashFlow,
    reconcileAccount,
    setFilters,
    setError,
    setCurrentTransaction
  };
};

export default useFinancials;