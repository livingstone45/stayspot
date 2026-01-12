import React, { useState, useEffect } from 'react';
import { useThemeMode } from '../../hooks/useThemeMode';
import { TrendingUp, TrendingDown, DollarSign, Home, BarChart3 } from 'lucide-react';

const MarketInfo = () => {
  const { isDark, getClassNames } = useThemeMode();
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarketData();
  }, []);

  const fetchMarketData = async () => {
    setLoading(true);
    try {
      // Fetch crypto and market data
      const cryptoResponse = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_market_cap=true&include_24hr_change=true&include_market_cap_change_24h=true'
      );
      const cryptoData = await cryptoResponse.json();

      // Fetch exchange rates
      const exchangeResponse = await fetch(
        'https://api.exchangerate-api.com/v4/latest/USD'
      );
      const exchangeData = await exchangeResponse.json();

      setMarketData({
        crypto: cryptoData,
        rates: exchangeData.rates
      });
    } catch (error) {
      console.error('Error fetching market data:', error);
    }
    setLoading(false);
  };

  const containerClasses = `${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6`;
  const cardClasses = `${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`;
  const titleClasses = `${isDark ? 'text-white' : 'text-gray-900'} text-2xl font-bold mb-6`;
  const textClasses = `${isDark ? 'text-gray-400' : 'text-gray-600'}`;

  if (loading) {
    return (
      <div className={containerClasses}>
        <div className="text-center py-12">
          <p className={titleClasses}>Loading market data...</p>
        </div>
      </div>
    );
  }

  const renderTrend = (change) => {
    const isPositive = change > 0;
    return (
      <div className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
        <span className="font-semibold">{Math.abs(change).toFixed(2)}%</span>
      </div>
    );
  };

  return (
    <div className={containerClasses}>
      {/* Header */}
      <div className="mb-8">
        <h1 className={titleClasses}>📈 Market Information</h1>
        <p className={textClasses}>
          Real-time market data and investment insights for tenants
        </p>
      </div>

      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { icon: '🏠', title: 'Real Estate Trends', value: '+2.3%', desc: 'Market growth' },
          { icon: '📊', title: 'Avg Rent Growth', value: '4.8%', desc: 'Year-over-year' },
          { icon: '💰', title: 'Affordability Index', value: '68', desc: 'Moderate' }
        ].map((item, idx) => (
          <div key={idx} className={cardClasses}>
            <div className="flex items-start justify-between mb-3">
              <span className="text-3xl">{item.icon}</span>
            </div>
            <h3 className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm font-medium mb-2`}>{item.title}</h3>
            <p className={`${isDark ? 'text-white' : 'text-gray-900'} text-2xl font-bold mb-1`}>{item.value}</p>
            <p className={`text-xs ${textClasses}`}>{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Cryptocurrency Section */}
      {marketData?.crypto && (
        <div className="mb-8">
          <h2 className={`${isDark ? 'text-white' : 'text-gray-900'} text-xl font-bold mb-4`}>
            💻 Cryptocurrency Markets
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bitcoin */}
            <div className={cardClasses}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-3xl mb-2">₿</div>
                  <h3 className={`${isDark ? 'text-white' : 'text-gray-900'} font-bold text-lg`}>Bitcoin</h3>
                </div>
                {marketData.crypto.bitcoin.usd_24h_change >= 0 ? (
                  <TrendingUp size={24} className="text-green-600" />
                ) : (
                  <TrendingDown size={24} className="text-red-600" />
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <p className={`${textClasses} text-sm mb-1`}>Current Price</p>
                  <p className={`${isDark ? 'text-white' : 'text-gray-900'} text-2xl font-bold`}>
                    ${marketData.crypto.bitcoin.usd?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className={`${textClasses} text-sm mb-1`}>24h Change</p>
                  {renderTrend(marketData.crypto.bitcoin.usd_24h_change)}
                </div>
                <div>
                  <p className={`${textClasses} text-sm mb-1`}>Market Cap</p>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} font-semibold`}>
                    ${(marketData.crypto.bitcoin.usd_market_cap / 1e9).toFixed(1)}B
                  </p>
                </div>
              </div>
            </div>

            {/* Ethereum */}
            <div className={cardClasses}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-3xl mb-2">Ξ</div>
                  <h3 className={`${isDark ? 'text-white' : 'text-gray-900'} font-bold text-lg`}>Ethereum</h3>
                </div>
                {marketData.crypto.ethereum.usd_24h_change >= 0 ? (
                  <TrendingUp size={24} className="text-green-600" />
                ) : (
                  <TrendingDown size={24} className="text-red-600" />
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <p className={`${textClasses} text-sm mb-1`}>Current Price</p>
                  <p className={`${isDark ? 'text-white' : 'text-gray-900'} text-2xl font-bold`}>
                    ${marketData.crypto.ethereum.usd?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className={`${textClasses} text-sm mb-1`}>24h Change</p>
                  {renderTrend(marketData.crypto.ethereum.usd_24h_change)}
                </div>
                <div>
                  <p className={`${textClasses} text-sm mb-1`}>Market Cap</p>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} font-semibold`}>
                    ${(marketData.crypto.ethereum.usd_market_cap / 1e9).toFixed(1)}B
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Currency Exchange Section */}
      {marketData?.rates && (
        <div>
          <h2 className={`${isDark ? 'text-white' : 'text-gray-900'} text-xl font-bold mb-4`}>
            💱 Currency Exchange Rates (1 USD)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { code: 'EUR', symbol: '€' },
              { code: 'GBP', symbol: '£' },
              { code: 'JPY', symbol: '¥' },
              { code: 'AUD', symbol: 'A$' },
              { code: 'CAD', symbol: 'C$' },
              { code: 'CHF', symbol: 'CHF' },
              { code: 'CNY', symbol: '¥' },
              { code: 'INR', symbol: '₹' }
            ].map((currency) => (
              <div key={currency.code} className={cardClasses}>
                <div className="flex items-center justify-between mb-2">
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm font-medium`}>
                    {currency.code}
                  </p>
                  <span className="text-lg">{currency.symbol}</span>
                </div>
                <p className={`${isDark ? 'text-white' : 'text-gray-900'} text-lg font-bold`}>
                  {marketData.rates[currency.code]?.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <div className="mt-8 text-center">
        <button
          onClick={fetchMarketData}
          className={`px-6 py-2 rounded-lg font-semibold transition ${isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
        >
          🔄 Refresh Data
        </button>
      </div>
    </div>
  );
};

export default MarketInfo;
