import React, { useState } from 'react';
import { Search, BookOpen, Eye, Plus, X, ArrowRight } from 'lucide-react';
import Alert from '../../components/common/UI/Alert';
import { useTheme } from '../../contexts/ThemeContext';

const SupportKB = () => {
  const { isDarkMode } = useTheme();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showNewArticle, setShowNewArticle] = useState(false);
  const [newArticle, setNewArticle] = useState({ title: '', category: '', content: '' });

  const mockArticles = [
    { id: 1, title: 'How to Reset Your Password', category: 'Account', description: 'Step-by-step guide to reset your password', content: 'To reset your password: 1. Click on Forgot Password 2. Enter your email 3. Check your email for reset link 4. Follow the link and create new password', views: 1250, updatedAt: new Date(Date.now() - 2*24*60*60*1000) },
    { id: 2, title: 'Getting Started with the Platform', category: 'Getting Started', description: 'Learn the basics of using our platform', content: 'Welcome to our platform! Here are the basic steps to get started...', views: 2340, updatedAt: new Date(Date.now() - 5*24*60*60*1000) },
    { id: 3, title: 'Payment Methods Explained', category: 'Payments', description: 'Understanding different payment options', content: 'We support multiple payment methods including credit cards, bank transfers, and digital wallets...', views: 1890, updatedAt: new Date(Date.now() - 1*24*60*60*1000) },
    { id: 4, title: 'Troubleshooting Login Issues', category: 'Support', description: 'Common login problems and solutions', content: 'If you cannot login, try these solutions...', views: 3120, updatedAt: new Date(Date.now() - 3*24*60*60*1000) },
    { id: 5, title: 'Profile Settings Guide', category: 'Account', description: 'Manage your profile and preferences', content: 'Access your profile settings to update personal information...', views: 980, updatedAt: new Date(Date.now() - 7*24*60*60*1000) },
    { id: 6, title: 'Security Best Practices', category: 'Security', description: 'Keep your account secure', content: 'Follow these security tips to protect your account...', views: 2150, updatedAt: new Date(Date.now() - 10*24*60*60*1000) }
  ];

  const categories = ['Account', 'Getting Started', 'Payments', 'Support', 'Security'];

  const filteredArticles = mockArticles.filter(article =>
    (!search || article.title.toLowerCase().includes(search.toLowerCase())) &&
    (!category || article.category === category)
  );

  const handleNewArticle = () => {
    if (newArticle.title && newArticle.category && newArticle.content) {
      setShowNewArticle(false);
      setNewArticle({ title: '', category: '', content: '' });
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950' : 'bg-gradient-to-br from-slate-50 to-slate-100'}`}>
      {/* Header */}
      <div className={`border-b ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white/40'} backdrop-blur-xl sticky top-0 z-10`}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Knowledge Base</h1>
              <p className={`text-sm mt-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Help articles and documentation</p>
            </div>
            <button
              onClick={() => setShowNewArticle(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" /> New Article
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filter */}
        <div className={`${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white/80 border-slate-200'} border rounded-xl shadow-lg p-6 mb-8 backdrop-blur-xl`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Search Articles</label>
              <div className="relative">
                <Search className={`absolute left-3 top-3 w-5 h-5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'}`}
                />
              </div>
            </div>
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {filteredArticles.length} articles found
              </div>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className={`${isDarkMode ? 'bg-slate-900/50 border-slate-800 hover:border-blue-700/50' : 'bg-white/80 border-slate-200 hover:border-blue-300'} border rounded-xl shadow-lg hover:shadow-xl transition-all p-6 backdrop-blur-xl group`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                    {article.category}
                  </span>
                </div>
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-2 group-hover:text-blue-600 transition`}>{article.title}</h3>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} mb-4 line-clamp-2`}>{article.description}</p>
                <div className="flex items-center justify-between pt-4 border-t" style={{borderColor: isDarkMode ? '#334155' : '#e2e8f0'}}>
                  <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>{article.views.toLocaleString()} views</span>
                  <button
                    onClick={() => { setSelectedArticle(article); setShowDetail(true); }}
                    className={`p-2 rounded-lg transition ${isDarkMode ? 'hover:bg-slate-800 text-blue-400' : 'hover:bg-slate-100 text-blue-600'}`}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white/80 border-slate-200'} border rounded-xl shadow-lg p-12 text-center backdrop-blur-xl`}>
            <BookOpen className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`} />
            <p className={`text-lg font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>No articles found</p>
            <p className={`text-sm mt-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-600'}`}>Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Article Detail Modal */}
      {showDetail && selectedArticle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${isDarkMode ? 'bg-slate-900' : 'bg-white'} rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
            <div className={`border-b ${isDarkMode ? 'border-slate-800 bg-slate-800/50' : 'border-slate-200 bg-slate-50'} p-6 flex items-center justify-between sticky top-0`}>
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedArticle.title}</h2>
              <button onClick={() => setShowDetail(false)} className={`p-2 rounded-lg transition ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Category</p>
                <p className={`mt-1 px-3 py-1 rounded-full inline-block text-sm font-semibold ${isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-700'}`}>{selectedArticle.category}</p>
              </div>
              <div>
                <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Content</p>
                <p className={`mt-2 p-4 rounded-lg ${isDarkMode ? 'bg-slate-800 text-slate-200' : 'bg-slate-50 text-slate-900'}`}>
                  {selectedArticle.content}
                </p>
              </div>
              <div className="flex justify-between text-sm pt-4 border-t" style={{borderColor: isDarkMode ? '#334155' : '#e2e8f0'}}>
                <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>{selectedArticle.views.toLocaleString()} views</span>
                <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Updated: {new Date(selectedArticle.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Article Modal */}
      {showNewArticle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${isDarkMode ? 'bg-slate-900' : 'bg-white'} rounded-2xl shadow-2xl max-w-2xl w-full`}>
            <div className={`border-b ${isDarkMode ? 'border-slate-800 bg-gradient-to-r from-blue-900/20 to-slate-900' : 'border-slate-200 bg-gradient-to-r from-blue-50 to-white'} p-6 flex items-center justify-between`}>
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Create New Article</h2>
              <button onClick={() => setShowNewArticle(false)} className={`p-2 rounded-lg transition ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Title</label>
                <input
                  type="text"
                  value={newArticle.title}
                  onChange={(e) => setNewArticle({...newArticle, title: e.target.value})}
                  placeholder="Article title..."
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Category</label>
                <select
                  value={newArticle.category}
                  onChange={(e) => setNewArticle({...newArticle, category: e.target.value})}
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}
                >
                  <option value="">Select category...</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Content</label>
                <textarea
                  value={newArticle.content}
                  onChange={(e) => setNewArticle({...newArticle, content: e.target.value})}
                  placeholder="Article content..."
                  rows="6"
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'}`}
                />
              </div>
              <div className="flex gap-3 justify-end pt-4 border-t" style={{borderColor: isDarkMode ? '#334155' : '#e2e8f0'}}>
                <button
                  onClick={() => setShowNewArticle(false)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${isDarkMode ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-200 text-slate-900 hover:bg-slate-300'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleNewArticle}
                  disabled={!newArticle.title || !newArticle.category || !newArticle.content}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50"
                >
                  Create Article
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportKB;
