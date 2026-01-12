import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Export data to various formats
 */

/**
 * Export data to CSV
 */
export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || data.length === 0) {
    throw new Error('No data to export');
  }

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  downloadFile(csvContent, filename, 'text/csv');
};

/**
 * Export data to Excel
 */
export const exportToExcel = (data, filename = 'export.xlsx', sheetName = 'Sheet1') => {
  if (!data || data.length === 0) {
    throw new Error('No data to export');
  }

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, filename);
};

/**
 * Export multiple sheets to Excel
 */
export const exportMultipleToExcel = (sheets, filename = 'export.xlsx') => {
  const workbook = XLSX.utils.book_new();
  
  sheets.forEach(({ data, name }) => {
    if (data && data.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, name);
    }
  });
  
  XLSX.writeFile(workbook, filename);
};

/**
 * Export data to PDF table
 */
export const exportToPDF = (data, filename = 'export.pdf', options = {}) => {
  if (!data || data.length === 0) {
    throw new Error('No data to export');
  }

  const doc = new jsPDF(options.orientation || 'portrait');
  
  // Add title if provided
  if (options.title) {
    doc.setFontSize(16);
    doc.text(options.title, 20, 20);
  }

  const headers = Object.keys(data[0]);
  const rows = data.map(row => headers.map(header => row[header]));

  doc.autoTable({
    head: [headers],
    body: rows,
    startY: options.title ? 30 : 20,
    styles: {
      fontSize: 8,
      cellPadding: 2
    },
    headStyles: {
      fillColor: [66, 139, 202],
      textColor: 255
    },
    ...options.tableOptions
  });

  doc.save(filename);
};

/**
 * Export property report to PDF
 */
export const exportPropertyReportToPDF = (properties, filename = 'property-report.pdf') => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(18);
  doc.text('Property Report', 20, 20);
  
  doc.setFontSize(12);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 30);
  
  // Summary
  const totalProperties = properties.length;
  const occupiedUnits = properties.reduce((sum, p) => sum + (p.occupiedUnits || 0), 0);
  const totalUnits = properties.reduce((sum, p) => sum + (p.totalUnits || 0), 0);
  const occupancyRate = totalUnits > 0 ? ((occupiedUnits / totalUnits) * 100).toFixed(1) : 0;
  
  doc.text(`Total Properties: ${totalProperties}`, 20, 45);
  doc.text(`Total Units: ${totalUnits}`, 20, 55);
  doc.text(`Occupied Units: ${occupiedUnits}`, 20, 65);
  doc.text(`Occupancy Rate: ${occupancyRate}%`, 20, 75);
  
  // Properties table
  const tableData = properties.map(property => [
    property.name,
    property.address,
    property.totalUnits || 0,
    property.occupiedUnits || 0,
    `$${property.monthlyRent || 0}`
  ]);

  doc.autoTable({
    head: [['Property Name', 'Address', 'Total Units', 'Occupied', 'Monthly Rent']],
    body: tableData,
    startY: 85,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [66, 139, 202] }
  });

  doc.save(filename);
};

/**
 * Export financial report to PDF
 */
export const exportFinancialReportToPDF = (transactions, filename = 'financial-report.pdf') => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text('Financial Report', 20, 20);
  
  doc.setFontSize(12);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 30);
  
  // Summary calculations
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const netIncome = totalIncome - totalExpenses;
  
  doc.text(`Total Income: $${totalIncome.toFixed(2)}`, 20, 45);
  doc.text(`Total Expenses: $${totalExpenses.toFixed(2)}`, 20, 55);
  doc.text(`Net Income: $${netIncome.toFixed(2)}`, 20, 65);
  
  // Transactions table
  const tableData = transactions.map(transaction => [
    new Date(transaction.date).toLocaleDateString(),
    transaction.description,
    transaction.type,
    `$${transaction.amount.toFixed(2)}`
  ]);

  doc.autoTable({
    head: [['Date', 'Description', 'Type', 'Amount']],
    body: tableData,
    startY: 80,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [66, 139, 202] }
  });

  doc.save(filename);
};

/**
 * Download file helper
 */
const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

/**
 * Format data for export
 */
export const formatDataForExport = (data, fieldMappings = {}) => {
  return data.map(item => {
    const formatted = {};
    
    Object.keys(item).forEach(key => {
      const mappedKey = fieldMappings[key] || key;
      let value = item[key];
      
      // Format dates
      if (value instanceof Date) {
        value = value.toLocaleDateString();
      }
      
      // Format currency
      if (typeof value === 'number' && key.includes('amount') || key.includes('rent') || key.includes('price')) {
        value = `$${value.toFixed(2)}`;
      }
      
      formatted[mappedKey] = value;
    });
    
    return formatted;
  });
};