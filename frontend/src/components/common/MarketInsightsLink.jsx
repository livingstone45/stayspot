import React from 'react';
import { BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MarketInsightsLink = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 px-3">
      <button
        onClick={() => navigate('/landlord/market-insights')}
        className="w-full flex items-center gap-3 px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-600 dark:text-blue-300 rounded-lg hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 transition-colors border border-blue-200 dark:border-blue-800"
      >
        <BarChart3 className="h-5 w-5" />
        <span className="font-semibold">📊 Market Insights</span>
      </button>
    </div>
  );
};

export default MarketInsightsLink;
