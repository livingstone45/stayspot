import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ServerError = () => {
  const navigate = useNavigate();
  const [reportSent, setReportSent] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [systemStatus, setSystemStatus] = useState('checking');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [errorLogs, setErrorLogs] = useState([]);
  const errorId = Math.random().toString(36).substr(2, 9).toUpperCase();
  const errorTime = new Date().toLocaleString();

  useEffect(() => {
    // Simulate checking system status
    const timer = setTimeout(() => {
      setSystemStatus(Math.random() > 0.5 ? 'recovering' : 'degraded');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleReportError = () => {
    const newLog = {
      time: new Date().toLocaleTimeString(),
      action: 'Error Report Submitted',
      status: 'Pending Review'
    };
    setErrorLogs([newLog, ...errorLogs]);
    setReportSent(true);
    setTimeout(() => setReportSent(false), 4000);
  };

  const handleRetry = () => {
    setRetryCount(retryCount + 1);
    const newLog = {
      time: new Date().toLocaleTimeString(),
      action: `Retry Attempt #${retryCount + 1}`,
      status: 'In Progress'
    };
    setErrorLogs([newLog, ...errorLogs]);
    window.location.reload();
  };

  const possibleCauses = [
    {
      icon: '🔌',
      title: 'Database Connection Loss',
      description: 'Our database may be temporarily unavailable or overloaded with requests.'
    },
    {
      icon: '🌐',
      title: 'Network Issue',
      description: 'There might be a connectivity problem between our servers.'
    },
    {
      icon: '💾',
      title: 'Service Overload',
      description: 'Too many requests are being processed. We\'re scaling up capacity.'
    },
    {
      icon: '🔒',
      title: 'Authentication Service Down',
      description: 'Our authentication service is experiencing issues. Please try again shortly.'
    },
    {
      icon: '⚡',
      title: 'Third-Party Service Failure',
      description: 'One of our integrated services (payment, email, etc.) is down.'
    },
    {
      icon: '🛠️',
      title: 'Maintenance Mode',
      description: 'We may be performing scheduled maintenance. Check our status page.'
    }
  ];

  const troubleshootingSteps = [
    'Wait 30-60 seconds and try refreshing the page',
    'Clear your browser cache and cookies',
    'Try using a different browser (Chrome, Firefox, Safari)',
    'Check your internet connection stability',
    'Disable browser extensions and reload',
    'Try accessing from a different network/device',
    'Check our status page for system updates'
  ];

  const affectedServices = [
    { name: 'Property Management', status: 'degraded' },
    { name: 'Tenant Portal', status: 'offline' },
    { name: 'Payment Processing', status: 'checking' },
    { name: 'Email Notifications', status: 'degraded' }
  ];

  const faqs = [
    {
      q: 'What does HTTP 500 mean?',
      a: 'It means the server encountered an unexpected condition that prevented it from completing your request. Our team is working to fix it.'
    },
    {
      q: 'How long will this take to fix?',
      a: 'Most server issues are resolved within 15-30 minutes. Critical issues may take 1-2 hours. Check our status page for real-time updates.'
    },
    {
      q: 'Will I lose my data?',
      a: 'No. Server errors do not affect stored data. All your information is safely backed up and will be intact when service resumes.'
    },
    {
      q: 'Can I do anything while the server is down?',
      a: 'You can review documentation, contact support, or try using our mobile app if available. Some features may have limited functionality.'
    },
    {
      q: 'How do I know when it\'s fixed?',
      a: 'We send email notifications to users when services are restored. You can also check our status page or subscribe to updates.'
    },
    {
      q: 'What if the error persists after 1 hour?',
      a: 'Contact our support team immediately. There may be a different issue affecting your account specifically.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-9xl font-bold text-purple-300 opacity-50 mb-4">500</div>
          <h1 className="text-5xl font-bold text-gray-900 mb-2">Server Error</h1>
          <p className="text-xl text-gray-600">
            Something went wrong on our end.
          </p>
          <div className="text-8xl mt-6 mb-6 animate-pulse">⚙️</div>
        </div>

        {/* Status Banner */}
        <div className={`rounded-lg shadow-md p-4 mb-8 text-center text-white font-medium ${
          systemStatus === 'checking' ? 'bg-yellow-500' :
          systemStatus === 'recovering' ? 'bg-blue-500' : 'bg-red-500'
        }`}>
          {systemStatus === 'checking' && '🔍 Checking system status...'}
          {systemStatus === 'recovering' && '🔄 We\'re recovering. Service should resume shortly.'}
          {systemStatus === 'degraded' && '⚠️ System is degraded. We\'re working on it.'}
        </div>

        {/* Error ID Info */}
        <div className="bg-white border border-purple-200 rounded-lg p-4 mb-8 text-center">
          <p className="text-sm text-gray-700">
            <strong>Error ID:</strong> {errorId} | <strong>Time:</strong> {errorTime}
          </p>
          <p className="text-xs text-gray-500 mt-2">Reference this ID when contacting support</p>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-blue-200 rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">⚡ Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2"
            >
              🔄 Try Again
            </button>
            <button
              onClick={() => window.location.href = '/status'}
              className="px-6 py-3 bg-blue-100 text-blue-900 rounded-lg hover:bg-blue-200 transition font-medium flex items-center justify-center gap-2"
            >
              📊 Check Status Page
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium flex items-center justify-center gap-2"
            >
              🏠 Go Home
            </button>
          </div>
          {retryCount > 0 && (
            <p className="text-center text-sm text-gray-600 mt-3">Retry attempts: {retryCount}</p>
          )}
        </div>

        {/* What Might Be Wrong */}
        <div className="bg-white border border-orange-200 rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-orange-900 mb-4">🔍 Possible Causes</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {possibleCauses.map((cause, idx) => (
              <div key={idx} className="p-4 bg-orange-50 rounded border border-orange-100">
                <div className="text-3xl mb-2">{cause.icon}</div>
                <p className="font-medium text-orange-900">{cause.title}</p>
                <p className="text-sm text-orange-700 mt-2">{cause.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="bg-white border border-green-200 rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-green-900 mb-4">🔧 Troubleshooting Steps</h2>
          <ol className="space-y-3">
            {troubleshootingSteps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3 p-3 bg-green-50 rounded border border-green-100">
                <span className="font-bold text-green-600 text-lg min-w-8">{idx + 1}</span>
                <span className="text-green-900">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Affected Services */}
        <div className="bg-white border border-red-200 rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-red-900 mb-4">📡 Affected Services</h2>
          <div className="space-y-3">
            {affectedServices.map((service, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-red-50 rounded border border-red-100">
                <span className="font-medium text-red-900">{service.name}</span>
                <span className={`text-sm px-3 py-1 rounded font-medium ${
                  service.status === 'degraded' ? 'bg-yellow-200 text-yellow-900' :
                  service.status === 'offline' ? 'bg-red-200 text-red-900' : 'bg-gray-200 text-gray-900'
                }`}>
                  {service.status === 'degraded' && '⚠️ Degraded'}
                  {service.status === 'offline' && '❌ Offline'}
                  {service.status === 'checking' && '🔄 Checking'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Error Logs */}
        {errorLogs.length > 0 && (
          <div className="bg-white border border-indigo-200 rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-indigo-900 mb-4">📋 Error Log</h2>
            <div className="space-y-2 text-sm">
              {errorLogs.map((log, idx) => (
                <div key={idx} className="p-3 bg-indigo-50 rounded border border-indigo-100">
                  <p className="text-indigo-900">
                    <strong>{log.time}</strong> - {log.action}
                    <span className={`ml-2 font-medium ${log.status === 'Pending Review' ? 'text-blue-600' : 'text-green-600'}`}>
                      ({log.status})
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ */}
        <div className="bg-white border border-cyan-200 rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-cyan-900 mb-4">❓ Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="border border-cyan-200 rounded p-4 bg-cyan-50 cursor-pointer hover:bg-cyan-100 transition"
                open={expandedFaq === idx}
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
              >
                <summary className="font-medium text-cyan-900 cursor-pointer select-none">
                  {faq.q}
                </summary>
                <p className="text-cyan-700 mt-2 text-sm">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Report Error */}
        <div className="bg-white border border-pink-200 rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-pink-900 mb-4">📧 Report This Issue</h2>
          <p className="text-gray-700 mb-4">
            Help us fix this faster by reporting the error. We'll prioritize your case.
          </p>
          {reportSent ? (
            <div className="p-4 bg-green-100 text-green-900 rounded-lg font-medium text-center">
              ✓ Thank you! We've received your report (ID: {errorId})
            </div>
          ) : (
            <button
              onClick={handleReportError}
              className="w-full px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition font-medium flex items-center justify-center gap-2"
            >
              📧 Report Error
            </button>
          )}
        </div>

        {/* Support Options */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">🆘 Need Immediate Help?</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <a
              href="mailto:support@stayspot.com"
              className="p-4 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition text-center font-medium"
            >
              📧 Email Support<br/>
              <span className="text-sm">support@stayspot.com</span>
            </a>
            <a
              href="tel:1-800-STAYSPOT"
              className="p-4 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition text-center font-medium"
            >
              📞 Call Us<br/>
              <span className="text-sm">1-800-STAYSPOT</span>
            </a>
            <button
              onClick={() => navigate('/contact')}
              className="p-4 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition text-center font-medium"
            >
              💬 Live Chat<br/>
              <span className="text-sm">24/7 Support Available</span>
            </button>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
            <h3 className="font-bold text-lg text-gray-900 mb-2">📚 Knowledge Base</h3>
            <p className="text-gray-600 text-sm mb-4">Browse our help documentation while waiting for service recovery.</p>
            <button
              onClick={() => navigate('/help')}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Visit Knowledge Base →
            </button>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
            <h3 className="font-bold text-lg text-gray-900 mb-2">📰 Status Updates</h3>
            <p className="text-gray-600 text-sm mb-4">Get real-time status updates and incident reports.</p>
            <button
              onClick={() => window.location.href = 'https://status.stayspot.com'}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              View Status Page →
            </button>
          </div>
        </div>

        {/* Incident History */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">📅 Recent Incidents</h2>
          <div className="space-y-3">
            <div className="p-4 bg-slate-50 rounded border border-slate-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-slate-900">Database Maintenance</p>
                  <p className="text-sm text-slate-600">Scheduled maintenance on primary database</p>
                </div>
                <span className="text-xs bg-green-200 text-green-900 px-2 py-1 rounded">Resolved</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">Resolved 2 hours ago • Duration: 45 minutes</p>
            </div>
            <div className="p-4 bg-slate-50 rounded border border-slate-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-slate-900">API Rate Limiting</p>
                  <p className="text-sm text-slate-600">Temporary rate limiting due to high traffic</p>
                </div>
                <span className="text-xs bg-green-200 text-green-900 px-2 py-1 rounded">Resolved</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">Resolved 5 hours ago • Duration: 30 minutes</p>
            </div>
          </div>
        </div>

        {/* Workarounds */}
        <div className="bg-white border border-emerald-200 rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-emerald-900 mb-4">⚡ Possible Workarounds</h2>
          <div className="space-y-3">
            <div className="p-4 bg-emerald-50 rounded border border-emerald-200">
              <p className="font-medium text-emerald-900 mb-2">📱 Use Mobile App</p>
              <p className="text-sm text-emerald-700">The mobile app may have separate infrastructure and could be working normally.</p>
              <button className="mt-2 text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                Download App →
              </button>
            </div>
            <div className="p-4 bg-emerald-50 rounded border border-emerald-200">
              <p className="font-medium text-emerald-900 mb-2">🔄 Try Later</p>
              <p className="text-sm text-emerald-700">Most server issues resolve within 30 minutes. Come back and try again shortly.</p>
            </div>
            <div className="p-4 bg-emerald-50 rounded border border-emerald-200">
              <p className="font-medium text-emerald-900 mb-2">💾 Offline Mode</p>
              <p className="text-sm text-emerald-700">Some data may be available in offline mode if you've accessed it before.</p>
            </div>
          </div>
        </div>

        {/* API Status Details */}
        <div className="bg-white border border-lime-200 rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-lime-900 mb-4">🔌 API Endpoints Status</h2>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="p-3 bg-lime-50 rounded border border-lime-200">
              <p className="text-sm font-medium text-lime-900">/api/properties</p>
              <span className="text-xs bg-red-200 text-red-900 px-2 py-1 rounded inline-block mt-1">Offline</span>
            </div>
            <div className="p-3 bg-lime-50 rounded border border-lime-200">
              <p className="text-sm font-medium text-lime-900">/api/users</p>
              <span className="text-xs bg-red-200 text-red-900 px-2 py-1 rounded inline-block mt-1">Offline</span>
            </div>
            <div className="p-3 bg-lime-50 rounded border border-lime-200">
              <p className="text-sm font-medium text-lime-900">/api/payments</p>
              <span className="text-xs bg-yellow-200 text-yellow-900 px-2 py-1 rounded inline-block mt-1">Degraded</span>
            </div>
            <div className="p-3 bg-lime-50 rounded border border-lime-200">
              <p className="text-sm font-medium text-lime-900">/api/auth</p>
              <span className="text-xs bg-red-200 text-red-900 px-2 py-1 rounded inline-block mt-1">Offline</span>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white border border-violet-200 rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-violet-900 mb-4">📊 System Metrics</h2>
          <div className="space-y-3">
            <div className="p-4 bg-violet-50 rounded border border-violet-200">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-violet-900">Server CPU Usage</span>
                <span className="text-violet-700 font-bold">87%</span>
              </div>
              <div className="w-full bg-violet-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{width: '87%'}}></div>
              </div>
            </div>
            <div className="p-4 bg-violet-50 rounded border border-violet-200">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-violet-900">Memory Usage</span>
                <span className="text-violet-700 font-bold">72%</span>
              </div>
              <div className="w-full bg-violet-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{width: '72%'}}></div>
              </div>
            </div>
            <div className="p-4 bg-violet-50 rounded border border-violet-200">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-violet-900">Disk Space</span>
                <span className="text-violet-700 font-bold">45%</span>
              </div>
              <div className="w-full bg-violet-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{width: '45%'}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recovery Timeline */}
        <div className="bg-white border border-blue-200 rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">⏱️ Estimated Recovery</h2>
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 rounded border border-blue-200">
              <p className="text-sm text-blue-900"><strong>Current Time:</strong> {new Date().toLocaleTimeString()}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded border border-blue-200">
              <p className="text-sm text-blue-900"><strong>Estimated Recovery:</strong> {new Date(Date.now() + 30 * 60000).toLocaleTimeString()}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded border border-blue-200">
              <p className="text-sm text-blue-900"><strong>Maximum Expected Downtime:</strong> 60 minutes</p>
            </div>
          </div>
        </div>

        {/* Services Depending on Fix */}
        <div className="bg-white border border-fuchsia-200 rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-fuchsia-900 mb-4">🔄 Services Depending on Recovery</h2>
          <ul className="space-y-2 text-sm text-fuchsia-700">
            <li className="flex items-start gap-2">
              <span className="text-lg">✓</span>
              <span>Tenant dashboards will show your rental status</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-lg">✓</span>
              <span>Landlord portals can access property information</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-lg">✓</span>
              <span>Payment processing will resume normally</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-lg">✓</span>
              <span>Email notifications will be delivered</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-lg">✓</span>
              <span>Support tickets can be created again</span>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-600 text-sm border-t border-gray-300 pt-8 mb-8">
          <p>Error Code: 500 | Status: Server Error</p>
          <p className="mt-2">
            We're sorry for the inconvenience. Our engineers are on it.
          </p>
          <p className="mt-4 text-xs text-gray-500">
            Last updated: {new Date().toLocaleString()} | Next update in 5 minutes
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServerError;