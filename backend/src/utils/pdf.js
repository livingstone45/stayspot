const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class PDFService {
  constructor() {
    this.defaultOptions = {
      size: 'A4',
      margin: 50,
      font: 'Helvetica'
    };
  }

  async generateLeaseAgreement(leaseData, outputPath) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument(this.defaultOptions);
        const stream = fs.createWriteStream(outputPath);
        doc.pipe(stream);

        // Header
        doc.fontSize(20).text('LEASE AGREEMENT', { align: 'center' });
        doc.moveDown(2);

        // Property Information
        doc.fontSize(14).text('PROPERTY INFORMATION', { underline: true });
        doc.fontSize(12)
           .text(`Property: ${leaseData.property.name}`)
           .text(`Address: ${leaseData.property.address}`)
           .text(`Unit: ${leaseData.unit?.number || 'N/A'}`)
           .moveDown();

        // Tenant Information
        doc.fontSize(14).text('TENANT INFORMATION', { underline: true });
        doc.fontSize(12)
           .text(`Name: ${leaseData.tenant.firstName} ${leaseData.tenant.lastName}`)
           .text(`Email: ${leaseData.tenant.email}`)
           .text(`Phone: ${leaseData.tenant.phone}`)
           .moveDown();

        // Lease Terms
        doc.fontSize(14).text('LEASE TERMS', { underline: true });
        doc.fontSize(12)
           .text(`Start Date: ${new Date(leaseData.startDate).toLocaleDateString()}`)
           .text(`End Date: ${new Date(leaseData.endDate).toLocaleDateString()}`)
           .text(`Monthly Rent: $${leaseData.monthlyRent}`)
           .text(`Security Deposit: $${leaseData.securityDeposit}`)
           .moveDown();

        // Terms and Conditions
        doc.fontSize(14).text('TERMS AND CONDITIONS', { underline: true });
        doc.fontSize(10)
           .text('1. Tenant agrees to pay rent on or before the 1st of each month.')
           .text('2. No pets allowed without written permission from landlord.')
           .text('3. Tenant is responsible for utilities unless otherwise specified.')
           .text('4. Property must be maintained in good condition.')
           .moveDown(2);

        // Signatures
        doc.fontSize(12)
           .text('Landlord Signature: _________________________    Date: _________')
           .moveDown()
           .text('Tenant Signature: ___________________________    Date: _________');

        doc.end();
        
        stream.on('finish', () => resolve(outputPath));
        stream.on('error', reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  async generateInvoice(invoiceData, outputPath) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument(this.defaultOptions);
        const stream = fs.createWriteStream(outputPath);
        doc.pipe(stream);

        // Header
        doc.fontSize(24).text('INVOICE', { align: 'right' });
        doc.fontSize(12).text(`Invoice #: ${invoiceData.number}`, { align: 'right' });
        doc.text(`Date: ${new Date(invoiceData.date).toLocaleDateString()}`, { align: 'right' });
        doc.moveDown(2);

        // Company Info
        doc.fontSize(14).text(invoiceData.company.name);
        doc.fontSize(10)
           .text(invoiceData.company.address)
           .text(`${invoiceData.company.city}, ${invoiceData.company.state} ${invoiceData.company.zipCode}`)
           .text(invoiceData.company.phone)
           .moveDown();

        // Bill To
        doc.fontSize(12).text('BILL TO:', { underline: true });
        doc.fontSize(10)
           .text(`${invoiceData.tenant.firstName} ${invoiceData.tenant.lastName}`)
           .text(invoiceData.property.address)
           .text(`Unit: ${invoiceData.unit?.number || 'N/A'}`)
           .moveDown(2);

        // Invoice Items
        const tableTop = doc.y;
        doc.fontSize(10)
           .text('Description', 50, tableTop)
           .text('Amount', 400, tableTop, { align: 'right' });

        doc.moveTo(50, tableTop + 15)
           .lineTo(550, tableTop + 15)
           .stroke();

        let itemY = tableTop + 25;
        let total = 0;

        invoiceData.items.forEach(item => {
          doc.text(item.description, 50, itemY)
             .text(`$${item.amount.toFixed(2)}`, 400, itemY, { align: 'right' });
          total += item.amount;
          itemY += 20;
        });

        // Total
        doc.moveTo(50, itemY + 5)
           .lineTo(550, itemY + 5)
           .stroke();

        doc.fontSize(12)
           .text('TOTAL:', 350, itemY + 15)
           .text(`$${total.toFixed(2)}`, 400, itemY + 15, { align: 'right' });

        doc.end();
        
        stream.on('finish', () => resolve(outputPath));
        stream.on('error', reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  async generatePropertyReport(reportData, outputPath) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument(this.defaultOptions);
        const stream = fs.createWriteStream(outputPath);
        doc.pipe(stream);

        // Header
        doc.fontSize(18).text('PROPERTY REPORT', { align: 'center' });
        doc.fontSize(12).text(`Generated: ${new Date().toLocaleDateString()}`, { align: 'center' });
        doc.moveDown(2);

        // Property Overview
        doc.fontSize(14).text('PROPERTY OVERVIEW', { underline: true });
        doc.fontSize(12)
           .text(`Total Properties: ${reportData.totalProperties}`)
           .text(`Occupied Units: ${reportData.occupiedUnits}`)
           .text(`Vacant Units: ${reportData.vacantUnits}`)
           .text(`Occupancy Rate: ${reportData.occupancyRate}%`)
           .text(`Monthly Revenue: $${reportData.monthlyRevenue}`)
           .moveDown();

        // Property List
        doc.fontSize(14).text('PROPERTY DETAILS', { underline: true });
        
        reportData.properties.forEach(property => {
          doc.fontSize(12)
             .text(`${property.name} - ${property.address}`)
             .fontSize(10)
             .text(`  Units: ${property.totalUnits} | Occupied: ${property.occupiedUnits}`)
             .text(`  Monthly Rent: $${property.monthlyRent}`)
             .moveDown(0.5);
        });

        doc.end();
        
        stream.on('finish', () => resolve(outputPath));
        stream.on('error', reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  async generateBuffer(generatorFunction, data) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument(this.defaultOptions);
        const buffers = [];
        
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(buffers);
          resolve(pdfBuffer);
        });

        generatorFunction(doc, data);
        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = new PDFService();