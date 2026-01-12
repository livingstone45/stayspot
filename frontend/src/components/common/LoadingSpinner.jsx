import React from 'react';

export default function LoadingSpinner(props) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
      <div className="text-center">
        <div className="inline-block">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-600"></div>
        </div>
        <p className="mt-6 text-lg font-semibold text-slate-900">Loading Dashboard...</p>
        <p className="mt-2 text-sm text-slate-600">Fetching data from server</p>
      </div>
    </div>
  );
}

