import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CompanyLayout from '../layouts/CompanyLayout';
import CompanyDashboard from '../pages/company/Dashboard';
import PaymentManagement from '../pages/company/PaymentManagement';
import PaymentHistory from '../pages/company/PaymentHistory';
import PaymentInvoices from '../pages/company/PaymentInvoices';
import PaymentRefunds from '../pages/company/PaymentRefunds';
import PaymentSettings from '../pages/company/PaymentSettings';
import PropertyVerification from '../pages/company/PropertyVerification';
import Properties from '../pages/company/Properties';
import BnBProperties from '../pages/company/BnBProperties';
import PendingProperties from '../pages/company/PendingProperties';
import PropertyDocuments from '../pages/company/PropertyDocuments';
import UserVerification from '../pages/company/UserVerification';
import TenantVerification from '../pages/company/TenantVerification';
import LandlordVerification from '../pages/company/LandlordVerification';
import ManagerVerification from '../pages/company/ManagerVerification';
import PendingVerification from '../pages/company/PendingVerification';
import VerificationReports from '../pages/company/VerificationReports';
import SupportTickets from '../pages/company/SupportTickets';
import SupportChat from '../pages/company/SupportChat';
import SupportKB from '../pages/company/SupportKB';
import SupportIssues from '../pages/company/SupportIssues';
import SupportReports from '../pages/company/SupportReports';
import ClientSupport from '../pages/company/ClientSupport';
import Drivers from '../pages/company/transportation/Drivers';
import Bookings from '../pages/company/transportation/Bookings';
import Tracking from '../pages/company/transportation/Tracking';
import Fleet from '../pages/company/transportation/Fleet';
import Earnings from '../pages/company/transportation/Earnings';
import Messages from '../pages/company/communication/Messages';
import Announcements from '../pages/company/communication/Announcements';
import Notifications from '../pages/company/communication/Notifications';
import Templates from '../pages/company/communication/Templates';
import Logs from '../pages/company/communication/Logs';
import Permissions from '../pages/company/security/Permissions';
import Audit from '../pages/company/security/Audit';
import Data from '../pages/company/security/Data';
import Compliance from '../pages/company/security/Compliance';
import Settings from '../pages/company/Settings';
import SystemCommunication from '../pages/company/SystemCommunication';
import SharingCollaboration from '../pages/company/SharingCollaboration';
import PayOthers from '../pages/company/PayOthers';

const CompanyRoutes = () => {
  return (
    <Routes>
      <Route element={<CompanyLayout><CompanyDashboard /></CompanyLayout>} path="/" />
      <Route element={<CompanyLayout><PaymentManagement /></CompanyLayout>} path="/payments" />
      <Route element={<CompanyLayout><PaymentHistory /></CompanyLayout>} path="/payments/history" />
      <Route element={<CompanyLayout><PaymentInvoices /></CompanyLayout>} path="/payments/invoices" />
      <Route element={<CompanyLayout><PaymentRefunds /></CompanyLayout>} path="/payments/refunds" />
      <Route element={<CompanyLayout><PaymentSettings /></CompanyLayout>} path="/payments/settings" />
      <Route element={<CompanyLayout><Properties /></CompanyLayout>} path="/properties" />
      <Route element={<CompanyLayout><PropertyVerification /></CompanyLayout>} path="/properties/verification" />
      <Route element={<CompanyLayout><BnBProperties /></CompanyLayout>} path="/properties/bnb" />
      <Route element={<CompanyLayout><PendingProperties /></CompanyLayout>} path="/properties/pending" />
      <Route element={<CompanyLayout><PropertyDocuments /></CompanyLayout>} path="/properties/documents" />
      <Route element={<CompanyLayout><TenantVerification /></CompanyLayout>} path="/verification/tenants" />
      <Route element={<CompanyLayout><LandlordVerification /></CompanyLayout>} path="/verification/landlords" />
      <Route element={<CompanyLayout><ManagerVerification /></CompanyLayout>} path="/verification/managers" />
      <Route element={<CompanyLayout><PendingVerification /></CompanyLayout>} path="/verification/pending" />
      <Route element={<CompanyLayout><VerificationReports /></CompanyLayout>} path="/verification/reports" />
      <Route element={<CompanyLayout><SupportTickets /></CompanyLayout>} path="/support/tickets" />
      <Route element={<CompanyLayout><SupportChat /></CompanyLayout>} path="/support/chat" />
      <Route element={<CompanyLayout><SupportKB /></CompanyLayout>} path="/support/kb" />
      <Route element={<CompanyLayout><SupportIssues /></CompanyLayout>} path="/support/issues" />
      <Route element={<CompanyLayout><SupportReports /></CompanyLayout>} path="/support/reports" />
      <Route element={<CompanyLayout><Drivers /></CompanyLayout>} path="/transportation/drivers" />
      <Route element={<CompanyLayout><Bookings /></CompanyLayout>} path="/transportation/bookings" />
      <Route element={<CompanyLayout><Tracking /></CompanyLayout>} path="/transportation/tracking" />
      <Route element={<CompanyLayout><Fleet /></CompanyLayout>} path="/transportation/fleet" />
      <Route element={<CompanyLayout><Earnings /></CompanyLayout>} path="/transportation/earnings" />
      <Route element={<CompanyLayout><Messages /></CompanyLayout>} path="/communication/messages" />
      <Route element={<CompanyLayout><Announcements /></CompanyLayout>} path="/communication/announcements" />
      <Route element={<CompanyLayout><Notifications /></CompanyLayout>} path="/communication/notifications" />
      <Route element={<CompanyLayout><Templates /></CompanyLayout>} path="/communication/templates" />
      <Route element={<CompanyLayout><Logs /></CompanyLayout>} path="/communication/logs" />
      <Route element={<CompanyLayout><Permissions /></CompanyLayout>} path="/security/permissions" />
      <Route element={<CompanyLayout><Audit /></CompanyLayout>} path="/security/audit" />
      <Route element={<CompanyLayout><Data /></CompanyLayout>} path="/security/data" />
      <Route element={<CompanyLayout><Compliance /></CompanyLayout>} path="/security/compliance" />
      <Route element={<CompanyLayout><Settings /></CompanyLayout>} path="/settings" />
      <Route element={<CompanyLayout><SharingCollaboration /></CompanyLayout>} path="/sharing" />
      <Route element={<CompanyLayout><PayOthers /></CompanyLayout>} path="/pay-others" />
      <Route path="*" element={<Navigate to="/company" replace />} />
    </Routes>
  );
};

export default CompanyRoutes;
