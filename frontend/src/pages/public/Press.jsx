import React, { useState } from 'react';
import { Calendar, User, Download, Share2, Search, TrendingUp, Award, Zap, ArrowRight, Mail, ExternalLink, Clock } from 'lucide-react';
import Footer from '../../components/common/Footer';

const Press = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRelease, setSelectedRelease] = useState(null);

  const featured = { title: 'StaySpot Raises $10M Series A to Transform Property Management', date: '2024-03-15', excerpt: 'Leading proptech platform secures funding to accelerate product development and market expansion', image: '📈', category: 'Funding' };

  const pressReleases = [
    { id: 1, title: 'StaySpot Named Best PropTech Startup 2024', date: '2024-03-10', author: 'Mike Chen', excerpt: 'Industry recognition for innovation and customer satisfaction', category: 'Award', image: '🏆', views: '2.5K', fullContent: 'StaySpot has been recognized as the Best PropTech Startup of 2024 by leading industry analysts. This award reflects our commitment to innovation, customer satisfaction, and transforming the property management landscape. Our platform has helped thousands of property managers streamline operations and increase profitability.' },
    { id: 2, title: 'AI-Powered Features Launch for Intelligent Property Management', date: '2024-03-05', author: 'Emily Davis', excerpt: 'New machine learning capabilities automate routine tasks', category: 'Product', image: '🤖', views: '1.8K', fullContent: 'We\'re excited to announce the launch of our AI-powered features that revolutionize property management. Our machine learning algorithms now automatically categorize maintenance requests, predict tenant issues, and optimize pricing strategies. These features save property managers an average of 15 hours per week.' },
    { id: 3, title: 'StaySpot Expands to 50 New Markets Across North America', date: '2024-02-28', author: 'John Smith', excerpt: 'Platform now serves property managers in major cities', category: 'Expansion', image: '🌍', views: '3.2K', fullContent: 'StaySpot is thrilled to announce our expansion into 50 new markets across North America. This expansion brings our total coverage to over 200 cities, making us the most accessible property management platform in the region. We\'re committed to supporting property managers in every market we serve.' },
    { id: 4, title: 'Strategic Partnership with Leading Real Estate Firms', date: '2024-02-20', author: 'Lisa Wong', excerpt: 'Collaboration to enhance service offerings', category: 'Partnership', image: '🤝', views: '1.5K', fullContent: 'We\'ve partnered with five leading real estate firms to enhance our service offerings. This collaboration enables seamless integration with their platforms and provides our users with access to exclusive resources and expertise. Together, we\'re creating a more comprehensive ecosystem for property management.' },
    { id: 5, title: 'Customer Success: 500% ROI in First Year', date: '2024-02-15', author: 'David Brown', excerpt: 'Property managers report significant efficiency gains', category: 'Success', image: '✨', views: '4.1K', fullContent: 'Our latest customer success report shows that property managers using StaySpot achieve an average 500% return on investment in their first year. Users report 40% reduction in operational costs, 60% faster tenant response times, and 35% increase in rental income through optimized pricing.' },
    { id: 6, title: 'StaySpot Launches Mobile App for On-the-Go Management', date: '2024-02-10', author: 'Sarah Lee', excerpt: 'New iOS and Android apps bring full platform to your pocket', category: 'Product', image: '📱', views: '2.9K', fullContent: 'Our new mobile app brings the full power of StaySpot to your pocket. Available on iOS and Android, the app provides real-time notifications, instant tenant communication, maintenance tracking, and financial reporting. Download today and manage your properties from anywhere.' },
    { id: 7, title: 'Security Audit: Enterprise-Grade Protection Confirmed', date: '2024-02-05', author: 'Mike Chen', excerpt: 'Third-party security audit validates our commitment to data protection', category: 'Security', image: '🔒', views: '1.2K', fullContent: 'An independent third-party security audit has confirmed that StaySpot maintains enterprise-grade security standards. Our platform uses 256-bit encryption, multi-factor authentication, and regular security updates. We\'re committed to protecting your data and maintaining the highest security standards.' },
    { id: 8, title: 'StaySpot Integrates with 50+ Property Management Tools', date: '2024-01-28', author: 'Emily Davis', excerpt: 'Seamless integrations expand platform capabilities', category: 'Integration', image: '🔗', views: '2.3K', fullContent: 'We\'ve expanded our integration ecosystem to include 50+ popular property management tools. From accounting software to tenant screening platforms, StaySpot now connects seamlessly with your existing tools. This eliminates data silos and streamlines your workflow.' },
    { id: 9, title: 'Q4 2023 Results: 150% Year-over-Year Growth', date: '2024-01-20', author: 'John Smith', excerpt: 'Strong financial performance drives expansion plans', category: 'Finance', image: '📈', views: '3.8K', fullContent: 'StaySpot achieved 150% year-over-year growth in Q4 2023, with revenue reaching $50M. This strong performance reflects growing demand for our platform and the trust our customers place in us. We\'re investing heavily in product development and customer support to maintain this momentum.' },
    { id: 10, title: 'New Training Academy Launches for Property Managers', date: '2024-01-15', author: 'Lisa Wong', excerpt: 'Free certification program helps users master the platform', category: 'Education', image: '🎓', views: '2.1K', fullContent: 'We\'ve launched the StaySpot Academy, a comprehensive training program for property managers. The free certification program covers all aspects of the platform, from basic setup to advanced features. Graduates receive a recognized certification that demonstrates their expertise.' },
    { id: 11, title: 'StaySpot Wins Customer Choice Award 2024', date: '2024-01-10', author: 'David Brown', excerpt: 'Users vote StaySpot as top property management solution', category: 'Award', image: '🏅', views: '3.5K', fullContent: 'Our users have voted StaySpot as the top property management solution for 2024. This customer choice award is a testament to our dedication to user satisfaction and continuous improvement. We\'re grateful for the support of our community and committed to delivering even better solutions.' },
    { id: 12, title: 'Sustainability Initiative: Carbon-Neutral Operations', date: '2024-01-05', author: 'Sarah Lee', excerpt: 'Commitment to environmental responsibility announced', category: 'Sustainability', image: '🌱', views: '1.9K', fullContent: 'StaySpot is committed to environmental responsibility and has achieved carbon-neutral operations. We\'ve implemented renewable energy, optimized our infrastructure, and offset our remaining emissions. We believe technology companies have a responsibility to protect the planet.' }
  ];

  const mediaKit = [
    { title: 'Brand Guidelines', desc: 'Complete brand identity standards', icon: '📋', size: '2.4 MB', downloads: '1.2K' },
    { title: 'Executive Bios', desc: 'Leadership team information', icon: '👥', size: '1.2 MB', downloads: '856' },
    { title: 'Product Screenshots', desc: 'High-resolution images', icon: '📸', size: '45 MB', downloads: '2.1K' },
    { title: 'Company Fact Sheet', desc: 'Key statistics and milestones', icon: '📊', size: '0.8 MB', downloads: '1.5K' }
  ];

  const filteredReleases = pressReleases.filter(r =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #ea580c 100%)', color: 'white', padding: '6rem 2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1 }}>
          <div style={{ position: 'absolute', bottom: '10%', left: '10%', width: '300px', height: '300px', background: 'radial-gradient(circle, white, transparent)', borderRadius: '50%' }} />
        </div>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1024px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: '4rem', fontWeight: '900', marginBottom: '1.5rem', lineHeight: '1.1' }}>Press & Media Center</h1>
          <p style={{ fontSize: '1.3rem', opacity: 0.95, marginBottom: '2rem' }}>Latest news, press releases, and media resources about StaySpot</p>
        </div>
      </section>

      {/* Featured Story */}
      <section style={{ maxWidth: '1024px', margin: '4rem auto', padding: '0 2rem' }}>
        <div style={{ backgroundColor: '#f9fafb', padding: '3rem', borderRadius: '16px', border: '2px solid #ea580c', display: 'flex', gap: '3rem', alignItems: 'center' }}>
          <div style={{ fontSize: '5rem', minWidth: '100px', textAlign: 'center' }}>{featured.image}</div>
          <div>
            <span style={{ backgroundColor: '#ea580c', color: 'white', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '700', display: 'inline-block', marginBottom: '1rem' }}>Featured</span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#1e293b', marginBottom: '1rem' }}>{featured.title}</h2>
            <p style={{ color: '#666', marginBottom: '1.5rem', lineHeight: '1.6' }}>{featured.excerpt}</p>
            <button style={{ padding: '0.75rem 1.5rem', backgroundColor: '#ea580c', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Read Full Story <ArrowRight style={{ width: '16px', height: '16px' }} /></button>
          </div>
        </div>
      </section>

      {/* Media Kit */}
      <section style={{ maxWidth: '1024px', margin: '4rem auto', padding: '0 2rem' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1rem', color: '#1e293b' }}>Media Kit</h2>
        <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '3rem' }}>Everything you need to cover StaySpot</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
          {mediaKit.map((item, idx) => (
            <div key={idx} style={{ backgroundColor: '#f9fafb', padding: '2rem', borderRadius: '12px', border: '1px solid #e5e7eb', transition: 'all 0.3s', cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{item.icon}</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem', color: '#1e293b' }}>{item.title}</h3>
              <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>{item.desc}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <span style={{ fontSize: '0.85rem', color: '#999' }}>{item.size} • {item.downloads} downloads</span>
                <button style={{ padding: '0.5rem 1rem', backgroundColor: '#ea580c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Download style={{ width: '16px', height: '16px' }} />Get</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Press Releases */}
      <section style={{ maxWidth: '1024px', margin: '4rem auto', padding: '0 2rem' }}>
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '0.5rem', color: '#1e293b' }}>Latest News</h2>
          <p style={{ fontSize: '1.1rem', color: '#666' }}>Stay updated with our latest announcements</p>
        </div>

        {/* Search */}
        <div style={{ marginBottom: '3rem', position: 'relative' }}>
          <Search style={{ position: 'absolute', left: '1rem', top: '1rem', width: '20px', height: '20px', color: '#999' }} />
          <input
            type="text"
            placeholder="Search press releases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '1rem 1rem 1rem 2.5rem', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '1rem', transition: 'all 0.3s' }}
            onFocus={(e) => e.target.style.borderColor = '#ea580c'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
        </div>

        {/* Releases Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
          {filteredReleases.map(release => (
            <div key={release.id} onClick={() => setSelectedRelease(release)} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e5e7eb', cursor: 'pointer', transition: 'all 0.3s', display: 'flex', flexDirection: 'column' }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-4px)'; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{release.image}</div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{ backgroundColor: '#ea580c', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700' }}>{release.category}</span>
                <span style={{ backgroundColor: '#f0f0f0', color: '#666', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' }}>{release.views} views</span>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.75rem', lineHeight: '1.4' }}>{release.title}</h3>
              <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem', flex: 1, lineHeight: '1.5' }}>{release.excerpt}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #e5e7eb', fontSize: '0.85rem', color: '#999' }}>
                <span>{release.date}</span>
                <span>{release.author}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Release Modal */}
      {selectedRelease && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', maxWidth: '700px', width: '100%', padding: '3rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '2rem' }}>
              <div>
                <span style={{ backgroundColor: '#ea580c', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700' }}>{selectedRelease.category}</span>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '900', marginTop: '1rem', color: '#1e293b' }}>{selectedRelease.title}</h2>
              </div>
              <button onClick={() => setSelectedRelease(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#999' }}>✕</button>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', color: '#666', fontSize: '0.9rem', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar style={{ width: '16px', height: '16px' }} />{selectedRelease.date}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><User style={{ width: '16px', height: '16px' }} />{selectedRelease.author}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><TrendingUp style={{ width: '16px', height: '16px' }} />{selectedRelease.views} views</span>
            </div>
            <p style={{ color: '#666', marginBottom: '2rem', lineHeight: '1.8', fontSize: '1.05rem' }}>{selectedRelease.fullContent}</p>
            <p style={{ color: '#666', marginBottom: '2rem', lineHeight: '1.8' }}>For more information about this announcement, please contact our press team or visit our website.</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button style={{ flex: 1, padding: '1rem', backgroundColor: '#ea580c', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}><Share2 style={{ width: '18px', height: '18px' }} />Share</button>
              <button style={{ flex: 1, padding: '1rem', backgroundColor: '#f0f0f0', color: '#1e293b', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}><Download style={{ width: '18px', height: '18px' }} />Download</button>
            </div>
          </div>
        </div>
      )}

      {/* Contact */}
      <section style={{ padding: '4rem 2rem', textAlign: 'center', marginTop: '4rem' }}>
        <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '1rem', color: '#1e293b' }}>Media Inquiries</h2>
          <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2rem' }}>Have a story idea or need more information? Get in touch with our press team.</p>
          <a href="mailto:press@stayspot.com" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2rem', backgroundColor: '#ea580c', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}><Mail style={{ width: '18px', height: '18px' }} />press@stayspot.com</a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Press;
