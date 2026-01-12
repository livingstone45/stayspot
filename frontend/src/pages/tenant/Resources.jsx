import React, { useState, useEffect } from 'react';
import { useThemeMode } from '../../hooks/useThemeMode';
import { BookOpen, FileText, Video, Globe, AlertCircle, ChevronRight } from 'lucide-react';

const Resources = () => {
  const { isDark, getClassNames } = useThemeMode();
  const [resources, setResources] = useState([]);
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setLoading(true);
    try {
      // Fetch tenant-related resources and guides
      const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=8');
      const data = await response.json();
      
      const resourcesList = data.map((item, idx) => ({
        id: item.id,
        title: item.title,
        description: item.body.substring(0, 100) + '...',
        category: ['Maintenance', 'Payment', 'Legal', 'Moving'][idx % 4],
        icon: ['🔧', '💳', '⚖️', '📦'][idx % 4],
        link: '#'
      }));

      setResources(resourcesList);

      // Create guides
      const guidesList = [
        {
          id: 1,
          title: 'Tenant Rights & Responsibilities',
          description: 'Learn about your rights as a tenant and what responsibilities you have',
          category: 'Legal',
          icon: '⚖️',
          readTime: '8 min'
        },
        {
          id: 2,
          title: 'Maintenance Request Process',
          description: 'How to submit and track maintenance requests',
          category: 'Maintenance',
          icon: '🔧',
          readTime: '5 min'
        },
        {
          id: 3,
          title: 'Payment Methods & Billing',
          description: 'Understanding your bill and available payment options',
          category: 'Payment',
          icon: '💳',
          readTime: '6 min'
        },
        {
          id: 4,
          title: 'Move-Out Checklist',
          description: 'Complete guide for a smooth move-out process',
          category: 'Moving',
          icon: '📦',
          readTime: '7 min'
        }
      ];

      setGuides(guidesList);
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
    setLoading(false);
  };

  const containerClasses = `${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6`;
  const cardClasses = `${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6 hover:shadow-lg transition`;
  const titleClasses = `${isDark ? 'text-white' : 'text-gray-900'} text-2xl font-bold mb-6`;
  const textClasses = `${isDark ? 'text-gray-400' : 'text-gray-600'}`;

  if (loading) {
    return (
      <div className={containerClasses}>
        <div className="text-center py-12">
          <p className={titleClasses}>Loading resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      {/* Header */}
      <div className="mb-8">
        <h1 className={titleClasses}>📚 Tenant Resources</h1>
        <p className={textClasses}>
          Comprehensive guides and resources to help you navigate your tenancy
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: '⚖️', title: 'Legal Rights', desc: 'Know your rights' },
          { icon: '🔧', title: 'Maintenance', desc: 'Report issues' },
          { icon: '💳', title: 'Payments', desc: 'Billing info' },
          { icon: '🏠', title: 'Housing', desc: 'Home tips' }
        ].map((item, idx) => (
          <div key={idx} className={`${cardClasses} text-center cursor-pointer hover:scale-105 transform transition`}>
            <div className="text-4xl mb-3">{item.icon}</div>
            <h3 className={`${isDark ? 'text-white' : 'text-gray-900'} font-semibold mb-1`}>{item.title}</h3>
            <p className={`text-xs ${textClasses}`}>{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Guides Section */}
      <div className="mb-8">
        <h2 className={`${isDark ? 'text-white' : 'text-gray-900'} text-xl font-bold mb-4`}>
          📖 Essential Guides
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {guides.map((guide) => (
            <div key={guide.id} className={cardClasses}>
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">{guide.icon}</div>
                <span className={`text-xs px-3 py-1 rounded-full ${isDark ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
                  {guide.category}
                </span>
              </div>
              <h3 className={`${isDark ? 'text-white' : 'text-gray-900'} font-semibold mb-2`}>{guide.title}</h3>
              <p className={`text-sm ${textClasses} mb-4`}>{guide.description}</p>
              <div className="flex items-center justify-between">
                <span className={`text-xs ${textClasses}`}>⏱️ {guide.readTime} read</span>
                <button className={`flex items-center gap-1 px-3 py-1 rounded ${isDark ? 'bg-blue-900 text-blue-300 hover:bg-blue-800' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'} transition text-sm font-medium`}>
                  Read <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resource Articles */}
      <div>
        <h2 className={`${isDark ? 'text-white' : 'text-gray-900'} text-xl font-bold mb-4`}>
          📰 Latest Resources
        </h2>
        <div className="space-y-3">
          {resources.map((resource) => (
            <div key={resource.id} className={`${cardClasses} cursor-pointer hover:translate-x-1 transition`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{resource.icon}</span>
                    <span className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      {resource.category}
                    </span>
                  </div>
                  <h3 className={`${isDark ? 'text-white' : 'text-gray-900'} font-semibold mb-1`}>{resource.title}</h3>
                  <p className={`text-sm ${textClasses}`}>{resource.description}</p>
                </div>
                <ChevronRight className={`flex-shrink-0 ml-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Help Section */}
      <div className={`mt-8 p-6 rounded-lg ${isDark ? 'bg-amber-900 bg-opacity-30 border border-amber-700' : 'bg-amber-50 border border-amber-200'}`}>
        <div className="flex items-start gap-3">
          <AlertCircle className={isDark ? 'text-amber-400' : 'text-amber-600'} />
          <div>
            <h3 className={`${isDark ? 'text-amber-300' : 'text-amber-900'} font-semibold mb-1`}>Need More Help?</h3>
            <p className={isDark ? 'text-amber-200 text-sm' : 'text-amber-800 text-sm'}>
              Contact our support team at support@stayspot.com or call 1-800-STAY-SPOT for immediate assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;
