import React, { useState, useEffect } from 'react';
import { CheckCircle, Mail, User } from 'lucide-react';
import { useThemeMode } from '../../hooks/useThemeMode';

const AcceptedInvitations = () => {
  const { isDarkMode } = useThemeMode();
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      const response = await fetch('/api/management/invitations?status=accepted');
      if (response.ok) {
        const data = await response.json();
        setInvitations(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch invitations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 to-slate-100'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className={`text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Accepted Invitations</h1>
          <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Team members who accepted invitations</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : invitations.length === 0 ? (
          <div className={`rounded-xl p-12 text-center ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'}`}>
            <CheckCircle className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
            <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>No accepted invitations yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {invitations.map(invitation => (
              <div key={invitation.id} className={`rounded-lg p-6 ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'}`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-green-900/20' : 'bg-green-100'}`}>
                    <User className={isDarkMode ? 'text-green-400' : 'text-green-600'} />
                  </div>
                  <div>
                    <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {invitation.firstName} {invitation.lastName}
                    </p>
                    <p className={`text-xs ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>Accepted</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className={`w-4 h-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{invitation.email}</p>
                  </div>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                    Accepted {new Date(invitation.acceptedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AcceptedInvitations;
