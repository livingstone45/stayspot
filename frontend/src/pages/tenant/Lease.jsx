import React, { useState } from 'react';
import { Download, Eye, FileText, Calendar, DollarSign, AlertCircle } from 'lucide-react';
import { useThemeMode } from '../../hooks/useThemeMode';

const LeasePage = () => {
  const { isDark, getClassNames } = useThemeMode();
  
  const containerClasses = `${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6 min-h-screen`;
  const cardClasses = `${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`;
  const titleClasses = `${isDark ? 'text-white' : 'text-gray-900'} text-3xl font-bold mb-2`;
  const subtitleClasses = `${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mb-8`;
  const textClasses = `${isDark ? 'text-gray-400' : 'text-gray-600'}`;
  
  const [leaseData] = useState({
    leaseNumber: 'LEASE-2024-001',
    propertyName: 'Sunset Apartments',
    unitNumber: '402',
    address: '123 Main Street, Los Angeles, CA 90001',
    tenantName: 'John Doe',
    tenantEmail: 'john@example.com',
    tenantPhone: '+1 (555) 123-4567',
    landlordName: 'Jane Smith',
    landlordEmail: 'jane@example.com',
    landlordPhone: '+1 (555) 987-6543',
    startDate: '2024-01-01',
    endDate: '2025-12-31',
    monthlyRent: 1500,
    securityDeposit: 3000,
    petPolicy: 'Pets allowed with $500 pet deposit',
    utilities: 'Tenant responsible for electricity and gas. Landlord covers water and trash.',
    maintenancePolicy: 'Report maintenance issues within 24 hours. Emergency issues call landlord immediately.',
    moveOutConditions: 'Property must be returned in original condition. Professional cleaning required.',
    paymentTerms: 'Rent due on 1st of each month. Late fee of $150 if paid after 5th.',
    renewalTerms: 'Lease renews automatically unless 60-day notice is given.',
    violationPolicy: 'Violations may result in $100-500 fine or lease termination.',
    documents: [
      { id: 1, name: 'Lease Agreement', type: 'PDF', date: '2024-01-01', size: '2.4 MB' },
      { id: 2, name: 'Property Condition Report', type: 'PDF', date: '2024-01-02', size: '1.8 MB' },
      { id: 3, name: 'House Rules', type: 'PDF', date: '2024-01-01', size: '0.9 MB' },
      { id: 4, name: 'Emergency Contacts', type: 'PDF', date: '2024-01-01', size: '0.5 MB' },
    ],
  });

  const [activeTab, setActiveTab] = useState('overview');

  const handleDownload = (docName) => {
    alert(`Downloading ${docName}...`);
  };

  const handleView = (docName) => {
    alert(`Opening ${docName}...`);
  };

  return (
    <div className={containerClasses}>
      {/* Header */}
      <div className="mb-8">
        <h1 className={titleClasses}>Lease Agreement</h1>
        <p className={subtitleClasses}>Lease #{leaseData.leaseNumber}</p>
      </div>

      {/* Key Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className={cardClasses}>
          <p className={`${textClasses} text-sm font-medium`}>Lease Status</p>
          <p className="text-2xl font-bold text-green-600 mt-2">Active</p>
          <p className={`text-xs ${textClasses} mt-2`}>Expires Dec 31, 2025</p>
        </div>
        <div className={cardClasses}>
          <p className={`${textClasses} text-sm font-medium`}>Monthly Rent</p>
          <p className="text-2xl font-bold text-blue-600 mt-2">${leaseData.monthlyRent.toLocaleString()}</p>
          <p className={`text-xs ${textClasses} mt-2`}>Due on 1st of month</p>
        </div>
        <div className={cardClasses}>
          <p className={`${textClasses} text-sm font-medium`}>Security Deposit</p>
          <p className="text-2xl font-bold text-purple-600 mt-2">${leaseData.securityDeposit.toLocaleString()}</p>
          <p className={`text-xs ${textClasses} mt-2`}>Held by landlord</p>
        </div>
        <div className={cardClasses}>
          <p className={`${textClasses} text-sm font-medium`}>Remaining</p>
          <p className="text-2xl font-bold text-orange-600 mt-2">365 Days</p>
          <p className={`text-xs ${textClasses} mt-2`}>Until lease end</p>
        </div>
      </div>

      {/* Tabs */}
      <div className={cardClasses + ' mb-8'}>
        <div className={`flex border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-4 font-medium ${
                activeTab === 'overview'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText className="inline mr-2" size={18} />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('parties')}
              className={`px-6 py-4 font-medium ${
                activeTab === 'parties'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              👥 Parties
            </button>
            <button
              onClick={() => setActiveTab('terms')}
              className={`px-6 py-4 font-medium ${
                activeTab === 'terms'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📋 Terms
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`px-6 py-4 font-medium ${
                activeTab === 'documents'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📄 Documents
            </button>
          </div>

          <div className="p-8">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Property Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-gray-600 text-sm">Property Name</p>
                      <p className="text-lg font-semibold text-gray-900">{leaseData.propertyName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Unit Number</p>
                      <p className="text-lg font-semibold text-gray-900">{leaseData.unitNumber}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-gray-600 text-sm">Address</p>
                      <p className="text-lg font-semibold text-gray-900">{leaseData.address}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Lease Period</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-4">
                      <Calendar className="text-blue-600" size={24} />
                      <div>
                        <p className="text-gray-600 text-sm">Start Date</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {new Date(leaseData.startDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Calendar className="text-red-600" size={24} />
                      <div>
                        <p className="text-gray-600 text-sm">End Date</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {new Date(leaseData.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="text-yellow-600 flex-shrink-0" size={20} />
                    <div>
                      <p className="font-semibold text-yellow-800">Important Reminder</p>
                      <p className="text-yellow-700 text-sm mt-1">
                        Your lease expires on {new Date(leaseData.endDate).toLocaleDateString()}. If you wish to renew, please notify your landlord at least 60 days in advance.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'parties' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Tenant Information</h3>
                  <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                    <p className="text-gray-600 text-sm">Name</p>
                    <p className="text-lg font-semibold text-gray-900">{leaseData.tenantName}</p>
                    <div className="mt-4 space-y-3">
                      <div>
                        <p className="text-gray-600 text-sm">Email</p>
                        <p className="text-gray-900">{leaseData.tenantEmail}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Phone</p>
                        <p className="text-gray-900">{leaseData.tenantPhone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Landlord Information</h3>
                  <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                    <p className="text-gray-600 text-sm">Name</p>
                    <p className="text-lg font-semibold text-gray-900">{leaseData.landlordName}</p>
                    <div className="mt-4 space-y-3">
                      <div>
                        <p className="text-gray-600 text-sm">Email</p>
                        <p className="text-gray-900">{leaseData.landlordEmail}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Phone</p>
                        <p className="text-gray-900">{leaseData.landlordPhone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'terms' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <DollarSign size={20} className="text-blue-600" />
                    Payment Terms
                  </h3>
                  <p className="text-gray-700 mt-2 bg-blue-50 p-4 rounded-lg border border-blue-200">{leaseData.paymentTerms}</p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Droplet size={20} className="text-purple-600" />
                    Utilities
                  </h3>
                  <p className="text-gray-700 mt-2 bg-purple-50 p-4 rounded-lg border border-purple-200">{leaseData.utilities}</p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">🐾 Pet Policy</h3>
                  <p className="text-gray-700 mt-2 bg-pink-50 p-4 rounded-lg border border-pink-200">{leaseData.petPolicy}</p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">🔧 Maintenance Policy</h3>
                  <p className="text-gray-700 mt-2 bg-orange-50 p-4 rounded-lg border border-orange-200">{leaseData.maintenancePolicy}</p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">📤 Move-Out Conditions</h3>
                  <p className="text-gray-700 mt-2 bg-red-50 p-4 rounded-lg border border-red-200">{leaseData.moveOutConditions}</p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">♻️ Renewal Terms</h3>
                  <p className="text-gray-700 mt-2 bg-green-50 p-4 rounded-lg border border-green-200">{leaseData.renewalTerms}</p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">⚠️ Violation Policy</h3>
                  <p className="text-gray-700 mt-2 bg-yellow-50 p-4 rounded-lg border border-yellow-200">{leaseData.violationPolicy}</p>
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-6">Lease Documents</h3>
                <div className="space-y-4">
                  {leaseData.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border hover:border-blue-300 transition">
                      <div className="flex items-center gap-4">
                        <FileText className="text-red-600" size={24} />
                        <div>
                          <p className="font-semibold text-gray-900">{doc.name}</p>
                          <p className="text-sm text-gray-600">{doc.date} • {doc.size}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleView(doc.name)}
                          className="p-2 hover:bg-blue-100 rounded-lg transition"
                          title="View"
                        >
                          <Eye className="text-blue-600" size={20} />
                        </button>
                        <button
                          onClick={() => handleDownload(doc.name)}
                          className="p-2 hover:bg-green-100 rounded-lg transition"
                          title="Download"
                        >
                          <Download className="text-green-600" size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
    </div>
  );
};

export default LeasePage;
