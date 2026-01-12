import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Newspaper, DollarSign, Percent } from 'lucide-react';

const MarketDataWidget = () => {
  const [marketData, setMarketData] = useState({
    interestRate: 6.5,
    inflationRate: 3.2,
    avgRentalGrowth: 4.8,
    propertyPriceIndex: 2.3,
    news: [],
    loading: true
  });

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        // Fetch real estate news from NewsAPI
        const newsResponse = await fetch(
          'https://newsapi.org/v2/everything?q=real+estate+market&sortBy=publishedAt&language=en&pageSize=3',
          { headers: { 'X-API-Key': 'demo' } }
        ).catch(() => null);

        let news = [];
        if (newsResponse?.ok) {
          const newsData = await newsResponse.json();
          news = newsData.articles?.slice(0, 3) || [];
        }

        // Mock data for economic indicators (in production, use real APIs)
        const mockData = {
          interestRate: 6.5,
          inflationRate: 3.2,
          avgRentalGrowth: 4.8,
          propertyPriceIndex: 2.3,
          news: news.length > 0 ? news : [
            { title: 'Real Estate Market Shows Strong Growth', source: { name: 'Market News' }, publishedAt: new Date().toISOString() },
            { title: 'Interest Rates Impact Property Values', source: { name: 'Finance Daily' }, publishedAt: new Date().toISOString() },
            { title: 'Rental Market Trends for 2024', source: { name: 'Property Insights' }, publishedAt: new Date().toISOString() }
          ]
        };

        setMarketData({ ...mockData, loading: false });
      } catch (error) {
        console.error('Error fetching market data:', error);
        setMarketData(prev => ({ ...prev, loading: false }));
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 3600000); // Update every hour
    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ icon: Icon, label, value, unit, trend }) => (
    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="flex items-center justify-between mb-1">
        <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <span className={`text-xs font-semibold ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-400">{label}</p>
      <p className="text-lg font-bold text-gray-900 dark:text-white">{value}{unit}</p>
    </div>
  );

  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
      <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
        📊 Market Insights
      </h3>

      {/* Economic Indicators */}
      <div className="px-3 space-y-2 mb-6">
        <StatCard 
          icon={Percent} 
          label="Interest Rate" 
          value={marketData.interestRate} 
          unit="%" 
          trend={-0.5}
        />
        <StatCard 
          icon={TrendingUp} 
          label="Inflation Rate" 
          value={marketData.inflationRate} 
          unit="%" 
          trend={0.2}
        />
        <StatCard 
          icon={DollarSign} 
          label="Rental Growth" 
          value={marketData.avgRentalGrowth} 
          unit="%" 
          trend={1.2}
        />
        <StatCard 
          icon={TrendingUp} 
          label="Property Price Index" 
          value={marketData.propertyPriceIndex} 
          unit="%" 
          trend={0.8}
        />
      </div>

      {/* News Feed */}
      <div className="px-3">
        <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
          <Newspaper className="h-4 w-4" />
          Real Estate News
        </h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {marketData.news.map((article, idx) => (
            <a
              key={idx}
              href={article.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <p className="text-xs font-medium text-gray-900 dark:text-white line-clamp-2">
                {article.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {article.source?.name || 'Market News'}
              </p>
            </a>
          ))}
        </div>
      </div>

      {/* Market Tips */}
      <div className="px-3 mt-6 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-xs font-semibold text-blue-900 dark:text-blue-300 mb-2">💡 Market Tip</p>
        <p className="text-xs text-blue-800 dark:text-blue-200">
          Current interest rates favor refinancing. Consider locking in rates for long-term investments.
        </p>
      </div>
    </div>
  );
};

export default MarketDataWidget;
