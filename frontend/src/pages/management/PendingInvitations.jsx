import React, { useState, useEffect } from 'react';
import { Clock, Mail, Trash2, Send } from 'lucide-react';
import { useThemeMode } from '../../hooks/useThemeMode';

const PendingInvitations = () => {
  const { isDarkMode } = useThemeMode();
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      const response = await fetch('/api/management/invitations?status=pending');
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

  const handleResend = async (id) => {
    try {
      await fetch(`/api/management/invitations/${id}/resend`, { method: 'POST' });
      fetchInvitations();
    } catch (error) {
      console.error('Failed to resend invitation:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this invitation?')) {
      try {
        await fetch(`/api/management/invitations/${id}`, { method: 'DELETE' });
        fetchInvitations();
      } catch (error) {
        console.error('Failed to delete invitation:', error);
      }
    }
  };

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 to-slate-100'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className={`text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Pending Invitations</h1>
          <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Manage pending team member invitations</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : invitations.length === 0 ? (
          <div className={`rounded-xl p-12 text-center ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'}`}>
            <Clock className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
            <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>No pending invitations</p>
          </div>
        ) : (
          <div className="space-y-4">
            {invitations.map(invitation => (
              <div key={invitation.id} className={`rounded-lg p-6 flex items-center justify-between ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'}`}>
                <div className="flex items-center gap-4 flex-1">
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                    <Mail className={isDarkMode ? 'text-slate-400' : 'text-slate-600'} />
                  </div>
                  <div>
                    <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {invitation.firstName} {invitation.lastName}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{invitation.email}</p>
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                      Sent {new Date(invitation.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleResend(invitation.id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 rounded transition"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(invitation.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-slate-700 rounded transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingInvitations;
