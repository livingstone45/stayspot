import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Search, HelpCircle, MessageSquare, Lock, CreditCard, Play, Users, Zap, BookOpen, X } from 'lucide-react';
import Footer from '../../components/common/Footer';

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [playingVideoIndex, setPlayingVideoIndex] = useState(null);

  const faqs = [
    {
      category: 'Getting Started',
      icon: <HelpCircle size={24} />,
      color: 'orange',
      items: [
        {
          q: 'How do I sign up for StaySpot?',
          a: 'Simply click on "Sign Up" and choose your role (landlord, property manager, or tenant). Fill in your details and you\'ll be set up in minutes!'
        },
        {
          q: 'Is there a free trial available?',
          a: 'Yes! All new accounts get a 14-day free trial with full access to features. No credit card required to start.'
        },
        {
          q: 'What happens after my trial ends?',
          a: 'After your trial, you can choose a plan that suits your needs. If you don\'t choose a plan, your account will be paused but not deleted.'
        },
        {
          q: 'Can I invite team members?',
          a: 'Yes, you can invite team members to collaborate on property management tasks. Each team member can have specific roles and permissions.'
        }
      ]
    },
    {
      category: 'Features & Usage',
      icon: <MessageSquare size={24} />,
      color: 'blue',
      items: [
        {
          q: 'Can I manage multiple properties?',
          a: 'Absolutely! Our plans support multiple properties. The Starter plan supports up to 5 properties, Professional up to 50, and Enterprise is unlimited.'
        },
        {
          q: 'How do I add tenants to my properties?',
          a: 'Go to your property dashboard and click "Add Tenant". You can invite tenants via email, and they\'ll receive an invitation to set up their account.'
        },
        {
          q: 'Can tenants pay rent through StaySpot?',
          a: 'Yes! Tenants can make rent payments directly through the platform with multiple payment methods including credit cards and bank transfers.'
        },
        {
          q: 'Is the mobile app available on all platforms?',
          a: 'Our mobile app is available on iOS and Android. You can download it from the App Store or Google Play.'
        },
        {
          q: 'How do I generate financial reports?',
          a: 'Navigate to the Reports section and select your desired date range. You can generate income statements, expense reports, and tax summaries.'
        }
      ]
    },
    {
      category: 'Security & Privacy',
      icon: <Lock size={24} />,
      color: 'green',
      items: [
        {
          q: 'Is my data secure?',
          a: 'Yes! We use enterprise-grade encryption and follow industry best practices for data security. All data is encrypted both in transit and at rest.'
        },
        {
          q: 'Who can access my property information?',
          a: 'Only people you authorize can access your property information. You control all permissions and access levels for your team and tenants.'
        },
        {
          q: 'How do you comply with privacy laws?',
          a: 'We comply with all relevant privacy laws including GDPR and CCPA. Your data is your own, and we never sell or share it with third parties.'
        },
        {
          q: 'How often do you backup data?',
          a: 'We perform automatic backups every 6 hours and maintain redundant copies across multiple secure data centers.'
        }
      ]
    },
    {
      category: 'Support & Billing',
      icon: <CreditCard size={24} />,
      color: 'purple',
      items: [
        {
          q: 'What support options are available?',
          a: 'We offer email support for all plans, with phone and chat support available for Professional and Enterprise plans. Response times vary by plan.'
        },
        {
          q: 'Can I change my plan anytime?',
          a: 'Yes! You can upgrade, downgrade, or cancel your plan at any time. Changes take effect at your next billing cycle. No penalties or hidden fees.'
        },
        {
          q: 'What payment methods do you accept?',
          a: 'We accept M-Pesa, bank transfers, credit cards (Visa, Mastercard, Amex), and Airtel Money. We also offer monthly invoicing for Enterprise plans.'
        },
        {
          q: 'Is there a contract or setup fee?',
          a: 'No long-term contracts and no setup fees! You can cancel anytime with no cancellation charges. Your data will be available for export.'
        },
        {
          q: 'What if I exceed my property limit?',
          a: 'You can easily upgrade to a higher plan to add more properties. If you go over temporarily, we\'ll notify you so you can upgrade.'
        },
        {
          q: 'Do you offer discounts for non-profits?',
          a: 'Yes! We offer 30% discount for registered non-profit organizations. Contact our sales team for more information.'
        },
        {
          q: 'What is your refund policy?',
          a: 'We offer a 30-day money-back guarantee if you\'re not satisfied with StaySpot for any reason.'
        },
        {
          q: 'Do I need a credit card for the free trial?',
          a: 'No credit card required for the 14-day free trial. We\'ll only charge you after the trial ends if you choose to continue.'
        },
        {
          q: 'Do you offer annual discounts?',
          a: 'Yes! Save 20% with yearly billing. That\'s KSH 3,600 saved on Professional plan annually, and much more on larger plans.'
        },
        {
          q: 'Can I cancel anytime?',
          a: 'Absolutely. Cancel your subscription anytime from your account settings. No penalties. No long-term contracts. No questions asked.'
        },
        {
          q: 'Is there a setup fee?',
          a: 'No setup fees. No hidden charges. Just simple, transparent pricing. Your first month starts right away after signup.'
        },
        {
          q: 'Can I upgrade or downgrade my plan?',
          a: 'Yes! You can change plans anytime. Upgrades take effect immediately. Downgrades apply at your next billing cycle. No penalties.'
        }
      ]
    }
  ];

  const filteredFaqs = searchQuery.trim() === '' 
    ? faqs 
    : faqs.map(cat => ({
        ...cat,
        items: cat.items.filter(item => 
          item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(cat => cat.items.length > 0);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-orange-900 text-white py-32 px-4">
        <div className="absolute top-20 right-0 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto text-center relative z-10"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Frequently Asked <span className="text-orange-400">Questions</span></h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8">Find answers to common questions about StaySpot</p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search size={20} className="absolute left-4 top-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-3 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            />
          </div>
        </motion.div>
      </section>

      {/* Category Navigation */}
      <section className="py-8 px-4 border-b border-slate-200 bg-white sticky top-16 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {faqs.map((cat, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveCategory(index);
                  setSearchQuery('');
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
                  activeCategory === index && searchQuery === ''
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                }`}
              >
                <span className="text-lg">{cat.icon}</span>
                <span className="hidden sm:inline">{cat.category}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          {(searchQuery.trim() !== '' ? filteredFaqs : [faqs[activeCategory]]).map((category, catIndex) => (
            <motion.div
              key={catIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIndex * 0.1 }}
              className="mb-16"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className={`p-3 rounded-lg ${
                  category.color === 'orange' ? 'bg-orange-100 text-orange-600' :
                  category.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                  category.color === 'green' ? 'bg-green-100 text-green-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  {category.icon}
                </div>
                <h2 className="text-3xl font-bold text-slate-900">{category.category}</h2>
                <span className="ml-auto text-sm text-slate-500 font-semibold">{category.items.length} questions</span>
              </div>
              
              <div className="space-y-4">
                {category.items.map((item, itemIndex) => {
                  const itemId = `${catIndex}-${itemIndex}`;
                  return (
                    <motion.div
                      key={itemIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: itemIndex * 0.05 }}
                      className="border-2 border-slate-200 rounded-xl overflow-hidden hover:border-orange-400 hover:shadow-lg transition duration-300 bg-white"
                    >
                      <button
                        onClick={() => setOpenIndex(openIndex === itemId ? null : itemId)}
                        className="w-full flex items-center justify-between p-6 hover:bg-orange-50 transition"
                      >
                        <h3 className="text-lg font-bold text-slate-900 text-left pr-4">
                          {item.q}
                        </h3>
                        <ChevronDown
                          size={24}
                          className={`flex-shrink-0 text-orange-500 transition-transform duration-300 ${
                            openIndex === itemId ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {openIndex === itemId && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t-2 border-slate-200 px-6 py-5 bg-gradient-to-r from-slate-50 to-orange-50"
                        >
                          <p className="text-slate-700 leading-relaxed text-lg">
                            {item.a}
                          </p>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}

          {searchQuery.trim() !== '' && filteredFaqs.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <Search size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No results found</h3>
              <p className="text-slate-600">Try searching with different keywords</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="py-16 px-4 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Quick Facts</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { stat: '14', label: 'Day Free Trial', icon: <Zap size={32} /> },
              { stat: '100K+', label: 'Happy Users', icon: <Users size={32} /> },
              { stat: '99.9%', label: 'Uptime Guarantee', icon: <BookOpen size={32} /> },
              { stat: '24/7', label: 'Expert Support', icon: <MessageSquare size={32} /> }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl text-center border-2 border-slate-200 hover:border-orange-400 hover:shadow-lg transition"
              >
                <div className="flex justify-center mb-4 text-orange-500">
                  {item.icon}
                </div>
                <h3 className="text-4xl font-bold text-slate-900 mb-2">{item.stat}</h3>
                <p className="text-slate-600 font-semibold">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Tutorials Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">Video Tutorials</h2>
          <p className="text-center text-slate-600 mb-12 text-lg">Learn how to use StaySpot features with our helpful video guides</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Getting Started with StaySpot',
                description: 'Learn the basics of StaySpot in 5 minutes',
                duration: '5:30',
                level: 'Beginner',
                videoId: 'dQw4w9WgXcQ'
              },
              {
                title: 'Property Management 101',
                description: 'Master property setup and tenant management',
                duration: '12:15',
                level: 'Intermediate',
                videoId: 'jNQXAC9IVRw'
              },
              {
                title: 'Financial Tools & Reports',
                description: 'Track income, expenses, and generate reports',
                duration: '8:45',
                level: 'Intermediate',
                videoId: 'zIqVzf0ZDI0'
              },
              {
                title: 'Tenant Communication Made Easy',
                description: 'Use messaging and task management effectively',
                duration: '6:20',
                level: 'Beginner',
                videoId: '9bZkp7q19f0'
              },
              {
                title: 'Mobile App Complete Guide',
                description: 'Navigate the mobile app and key features',
                duration: '7:10',
                level: 'Beginner',
                videoId: 'FIxMKcJ9Nbc'
              },
              {
                title: 'Advanced Analytics & Reports',
                description: 'Create custom reports and data analysis',
                duration: '14:50',
                level: 'Advanced',
                videoId: 'YQHsXMglC9A'
              }
            ].map((video, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group bg-white rounded-xl overflow-hidden border-2 border-slate-200 hover:border-orange-400 hover:shadow-xl transition"
              >
                {playingVideoIndex === index ? (
                  <div className="relative pt-[56.25%] bg-black">
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&modestbranding=1`}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                    <button
                      onClick={() => setPlayingVideoIndex(null)}
                      className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition z-10"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <div 
                    className="relative h-48 bg-gradient-to-br from-slate-900 to-orange-900 flex items-center justify-center overflow-hidden cursor-pointer"
                    onClick={() => setPlayingVideoIndex(index)}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="absolute inset-0 bg-gradient-to-br from-slate-900 to-orange-900 flex items-center justify-center"
                    >
                      <Play size={48} className="text-orange-400 group-hover:text-white transition" fill="currentColor" />
                    </motion.div>
                    <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded text-sm font-bold">
                      {video.duration}
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="font-bold text-lg text-slate-900 mb-2">{video.title}</h3>
                  <p className="text-slate-600 text-sm mb-4">{video.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      video.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                      video.level === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {video.level}
                    </span>
                    <button 
                      className="text-orange-500 hover:text-orange-600 font-semibold transition flex items-center gap-1"
                      onClick={() => setPlayingVideoIndex(index)}
                    >
                      <Play size={16} fill="currentColor" /> {playingVideoIndex === index ? 'Close' : 'Watch'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Resources Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-slate-50 to-orange-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Additional Resources</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <BookOpen size={32} />,
                title: 'Documentation',
                description: 'Comprehensive API and feature documentation',
                link: '#'
              },
              {
                icon: <Users size={32} />,
                title: 'Community Forum',
                description: 'Connect with other StaySpot users',
                link: '#'
              },
              {
                icon: <MessageSquare size={32} />,
                title: 'Blog',
                description: 'Tips, updates, and property management insights',
                link: '#'
              },
              {
                icon: <Zap size={32} />,
                title: 'Webinars',
                description: 'Live sessions with StaySpot experts',
                link: '#'
              }
            ].map((resource, index) => (
              <motion.a
                key={index}
                href={resource.link}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl border-2 border-slate-200 hover:border-orange-400 hover:shadow-lg transition group cursor-pointer"
              >
                <div className="text-orange-500 mb-4 group-hover:text-orange-600 transition">
                  {resource.icon}
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">{resource.title}</h3>
                <p className="text-slate-600 text-sm">{resource.description}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="py-16 px-4 bg-white border-t border-slate-200">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Was this helpful?</h2>
            <p className="text-slate-600 mb-6">Help us improve by sharing your feedback</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button className="px-6 py-3 bg-green-100 text-green-700 font-bold rounded-lg hover:bg-green-200 transition">
                👍 Yes, Very Helpful
              </button>
              <button className="px-6 py-3 bg-red-100 text-red-700 font-bold rounded-lg hover:bg-red-200 transition">
                👎 Not Helpful
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-20 bg-white text-slate-900 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4 text-slate-900">Still have questions?</h2>
            <p className="text-lg text-slate-600 mb-8">Can't find the answer you're looking for? Our support team is here to help.</p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center bg-orange-500 text-white px-8 py-4 rounded-lg font-bold hover:bg-orange-600 transition shadow-lg"
            >
              Contact Support →
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQPage;
