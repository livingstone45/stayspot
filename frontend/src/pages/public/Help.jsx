import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Book, MessageSquare, FileText } from 'lucide-react';
import Footer from '../../components/common/Footer';

const HelpPage = () => {
  const helpCategories = [
    {
      icon: <Book size={48} />,
      title: 'Documentation',
      description: 'Comprehensive guides and tutorials for every feature',
      link: '/docs'
    },
    {
      icon: <MessageSquare size={48} />,
      title: 'Contact Support',
      description: 'Get help from our support team via email or chat',
      link: '/contact'
    },
    {
      icon: <FileText size={48} />,
      title: 'Knowledge Base',
      description: 'Browse articles and solutions to common issues',
      link: '/knowledge-base'
    },
    {
      icon: <HelpCircle size={48} />,
      title: 'FAQ',
      description: 'Find answers to frequently asked questions',
      link: '/faq'
    }
  ];

  const tutorials = [
    {
      title: 'Getting Started with StaySpot',
      duration: '5 min',
      level: 'Beginner'
    },
    {
      title: 'Adding Your First Property',
      duration: '8 min',
      level: 'Beginner'
    },
    {
      title: 'Managing Tenants',
      duration: '12 min',
      level: 'Intermediate'
    },
    {
      title: 'Rent Collection & Payments',
      duration: '10 min',
      level: 'Intermediate'
    },
    {
      title: 'Advanced Reporting',
      duration: '15 min',
      level: 'Advanced'
    },
    {
      title: 'Team Collaboration Setup',
      duration: '10 min',
      level: 'Advanced'
    }
  ];

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
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Help & <span className="text-orange-400">Support</span></h1>
          <p className="text-xl md:text-2xl opacity-90">We're here to help you succeed with StaySpot</p>
        </motion.div>
      </section>

      {/* Quick Links */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {helpCategories.map((category, index) => (
              <motion.a
                key={index}
                href={category.link}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white p-8 rounded-2xl border border-slate-200 hover:border-orange-400 hover:shadow-lg transition cursor-pointer"
              >
                <div className="inline-flex p-3 bg-orange-100 text-orange-600 rounded-lg mb-4 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{category.title}</h3>
                <p className="text-slate-600">{category.description}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Video Tutorials */}
      <section className="py-20 bg-slate-50 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Video Tutorials</h2>
            <p className="text-xl text-slate-600">Learn at your own pace with our comprehensive video guides</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tutorials.map((tutorial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition group cursor-pointer"
              >
                <div className="h-48 bg-slate-700 flex items-center justify-center text-white text-4xl group-hover:bg-slate-800 transition">
                  ▶
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">{tutorial.title}</h3>
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>⏱ {tutorial.duration}</span>
                    <span className={`px-3 py-1 rounded-full font-semibold ${
                      tutorial.level === 'Beginner' ? 'bg-emerald-100 text-emerald-700' :
                      tutorial.level === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {tutorial.level}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Tips */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Pro Tips</h2>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                title: 'Keyboard Shortcuts',
                description: 'Use keyboard shortcuts to navigate faster. Press ? to see all available shortcuts.'
              },
              {
                title: 'Notifications',
                description: 'Customize your notification preferences in settings to stay informed without being overwhelmed.'
              },
              {
                title: 'Bulk Actions',
                description: 'Save time by using bulk actions to manage multiple properties or tenants at once.'
              },
              {
                title: 'Mobile App',
                description: 'Download our mobile app to manage your properties on the go with offline capabilities.'
              }
            ].map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-50 p-6 rounded-lg border border-slate-200 hover:border-slate-300 transition"
              >
                <h3 className="text-lg font-bold text-slate-900 mb-2">💡 {tip.title}</h3>
                <p className="text-slate-600">{tip.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-white text-slate-900 py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">Can't find what you're looking for?</h2>
            <p className="text-xl mb-12 text-slate-600">Our support team is ready to assist you 24/7</p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center bg-orange-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-600 transition"
            >
              Get Support →
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HelpPage;
