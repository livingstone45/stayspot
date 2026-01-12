import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight } from 'lucide-react';
import Footer from '../../components/common/Footer';

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const posts = [
    {
      id: 1,
      title: '5 Tips for Effective Property Management in 2024',
      excerpt: 'Learn the best practices that successful property managers are using to streamline their operations...',
      author: 'Sarah Johnson',
      date: 'Dec 15, 2024',
      category: 'Tips',
      image: '📊'
    },
    {
      id: 2,
      title: 'How to Handle Difficult Tenants Professionally',
      excerpt: 'A comprehensive guide to addressing tenant issues with empathy and professionalism...',
      author: 'Mike Chen',
      date: 'Dec 10, 2024',
      category: 'Management',
      image: '👥'
    },
    {
      id: 3,
      title: 'The Future of Digital Property Management',
      excerpt: 'Explore how technology is transforming the property management industry...',
      author: 'John Smith',
      date: 'Dec 5, 2024',
      category: 'Industry',
      image: '🚀'
    },
    {
      id: 4,
      title: 'Maximizing Rental Income: Complete Guide',
      excerpt: 'Strategic approaches to increase your property\'s rental potential and profitability...',
      author: 'Emma Davis',
      date: 'Nov 28, 2024',
      category: 'Finance',
      image: '💰'
    },
    {
      id: 5,
      title: 'Tenant Retention Strategies That Work',
      excerpt: 'Keep your best tenants happy and reduce vacancy rates with these proven tactics...',
      author: 'Sarah Johnson',
      date: 'Nov 20, 2024',
      category: 'Tenants',
      image: '🏠'
    },
    {
      id: 6,
      title: 'Understanding Fair Housing Laws',
      excerpt: 'Essential legal knowledge every property manager needs to know...',
      author: 'Mike Chen',
      date: 'Nov 15, 2024',
      category: 'Legal',
      image: '⚖️'
    },
    {
      id: 7,
      title: 'Preventive Maintenance: Save Money Long-Term',
      excerpt: 'Discover how regular maintenance prevents costly repairs and extends property lifespan...',
      author: 'John Smith',
      date: 'Nov 10, 2024',
      category: 'Management',
      image: '🔧'
    },
    {
      id: 8,
      title: 'Tax Deductions Every Property Manager Should Know',
      excerpt: 'Maximize your tax benefits with these often-overlooked deductions for property owners...',
      author: 'Emma Davis',
      date: 'Nov 5, 2024',
      category: 'Finance',
      image: '📋'
    },
    {
      id: 9,
      title: 'Creating a Winning Property Marketing Strategy',
      excerpt: 'Attract quality tenants faster with these proven marketing and advertising techniques...',
      author: 'Sarah Johnson',
      date: 'Oct 28, 2024',
      category: 'Tips',
      image: '📢'
    },
    {
      id: 10,
      title: 'AI and Automation in Modern Property Management',
      excerpt: 'How artificial intelligence is revolutionizing tenant screening and building operations...',
      author: 'Mike Chen',
      date: 'Oct 22, 2024',
      category: 'Industry',
      image: '🤖'
    },
    {
      id: 11,
      title: 'Lease Agreement Best Practices',
      excerpt: 'Protect your interests with comprehensive lease agreements that cover all scenarios...',
      author: 'John Smith',
      date: 'Oct 15, 2024',
      category: 'Legal',
      image: '📄'
    },
    {
      id: 12,
      title: 'Building Strong Tenant-Landlord Relationships',
      excerpt: 'Foster positive relationships that lead to longer tenancies and fewer disputes...',
      author: 'Emma Davis',
      date: 'Oct 8, 2024',
      category: 'Tenants',
      image: '🤝'
    },
    {
      id: 13,
      title: 'Smart Pricing Strategies for Rental Properties',
      excerpt: 'Competitive analysis and market research to set optimal rental rates...',
      author: 'Sarah Johnson',
      date: 'Sep 30, 2024',
      category: 'Finance',
      image: '💵'
    },
    {
      id: 14,
      title: 'Emergency Preparedness for Property Managers',
      excerpt: 'Create disaster plans and emergency protocols to protect your properties...',
      author: 'Mike Chen',
      date: 'Sep 22, 2024',
      category: 'Management',
      image: '🚨'
    },
    {
      id: 15,
      title: 'Eviction Laws and Tenant Rights: A State-by-State Guide',
      excerpt: 'Navigate complex eviction procedures while protecting tenant rights...',
      author: 'John Smith',
      date: 'Sep 15, 2024',
      category: 'Legal',
      image: '⚡'
    },
    {
      id: 16,
      title: 'Sustainability in Property Management',
      excerpt: 'Green initiatives that reduce costs and attract environmentally-conscious tenants...',
      author: 'Emma Davis',
      date: 'Sep 8, 2024',
      category: 'Industry',
      image: '♻️'
    },
    {
      id: 17,
      title: 'Mobile Apps That Transform Property Management',
      excerpt: 'Top applications and software solutions for streamlined property operations...',
      author: 'Sarah Johnson',
      date: 'Aug 28, 2024',
      category: 'Tips',
      image: '📱'
    },
    {
      id: 18,
      title: 'Screening Tenants: Best Practices and Red Flags',
      excerpt: 'Comprehensive tenant screening process to minimize risks and problems...',
      author: 'Mike Chen',
      date: 'Aug 20, 2024',
      category: 'Tenants',
      image: '🔍'
    },
    {
      id: 19,
      title: 'Multi-Property Portfolio Management Tips',
      excerpt: 'Strategies for efficiently managing multiple properties simultaneously...',
      author: 'John Smith',
      date: 'Aug 12, 2024',
      category: 'Management',
      image: '🏘️'
    },
    {
      id: 20,
      title: 'Understanding Property Insurance Requirements',
      excerpt: 'Comprehensive guide to insurance coverage and liability protection...',
      author: 'Emma Davis',
      date: 'Jul 30, 2024',
      category: 'Legal',
      image: '🛡️'
    },
    {
      id: 21,
      title: 'Seasonal Maintenance Checklist for Property Owners',
      excerpt: 'Year-round maintenance guide to keep properties in excellent condition...',
      author: 'Sarah Johnson',
      date: 'Jul 18, 2024',
      category: 'Tips',
      image: '📅'
    },
    {
      id: 22,
      title: 'Investment Property ROI Calculator Guide',
      excerpt: 'Calculate and maximize your return on investment with data-driven decisions...',
      author: 'Mike Chen',
      date: 'Jul 8, 2024',
      category: 'Finance',
      image: '📈'
    },
    {
      id: 23,
      title: 'Remote Property Management: Is It Right for You?',
      excerpt: 'Explore the benefits and challenges of managing properties remotely...',
      author: 'John Smith',
      date: 'Jun 28, 2024',
      category: 'Industry',
      image: '💻'
    },
    {
      id: 24,
      title: 'Conflict Resolution in Property Management',
      excerpt: 'Effective communication and mediation techniques for disputes...',
      author: 'Emma Davis',
      date: 'Jun 15, 2024',
      category: 'Management',
      image: '💬'
    },
    {
      id: 25,
      title: 'First-Time Rental Property Investors Guide',
      excerpt: 'Everything beginners need to know before purchasing their first rental...',
      author: 'Sarah Johnson',
      date: 'Jun 5, 2024',
      category: 'Tips',
      image: '🎯'
    },
    {
      id: 26,
      title: 'Accessibility Compliance for Rental Properties',
      excerpt: 'Ensure your properties meet ADA and fair housing accessibility requirements...',
      author: 'Mike Chen',
      date: 'May 25, 2024',
      category: 'Legal',
      image: '♿'
    },
    {
      id: 27,
      title: 'Building Community in Your Properties',
      excerpt: 'Create vibrant communities that improve tenant satisfaction and retention...',
      author: 'John Smith',
      date: 'May 10, 2024',
      category: 'Tenants',
      image: '🏘️'
    }
  ];

  const categories = ['All', 'Tips', 'Management', 'Industry', 'Finance', 'Tenants', 'Legal'];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-orange-900 text-white py-32 px-4">
        <div className="absolute top-20 right-0 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">StaySpot Blog</h1>
          <p className="text-xl md:text-2xl opacity-90">Insights and tips for property management success</p>
        </motion.div>
      </section>

      {/* Categories */}
      <section className="py-12 px-4 border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((cat, index) => (
              <button
                key={index}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full font-semibold transition ${
                  activeCategory === cat
                    ? 'bg-orange-500 text-white'
                    : 'bg-slate-100 text-slate-900 hover:bg-orange-100 hover:text-orange-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts
              .filter((post) => activeCategory === 'All' || post.category === activeCategory)
              .slice(0, activeCategory === 'All' ? 6 : posts.length)
              .map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="h-40 bg-slate-100 flex items-center justify-center text-6xl overflow-hidden">
                  <span className="group-hover:scale-110 transition-transform duration-300">{post.image}</span>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full">
                      {post.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-slate-600 transition">
                    {post.title}
                  </h3>

                  <p className="text-slate-600 mb-4">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-xs text-slate-600">
                        <User size={14} />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-600">
                        <Calendar size={14} />
                        {post.date}
                      </div>
                    </div>
                    <button className="text-slate-900 hover:text-slate-600 transition">
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-slate-50 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-slate-600 mb-8">Get the latest property management tips delivered to your inbox</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900"
              />
              <button className="bg-slate-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-800 transition">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPage;
