import React, { useState } from 'react';
import { Briefcase, MapPin, DollarSign, Users, Heart, Zap, TrendingUp, Award, ArrowRight, Send, X, Star, CheckCircle, Play } from 'lucide-react';
import Footer from '../../components/common/Footer';

const Careers = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [filterDept, setFilterDept] = useState('all');

  const jobs = [
    { id: 1, title: 'Senior Full Stack Developer', dept: 'engineering', location: 'San Francisco, CA', salary: '150k-200k KES', level: 'Senior', team: 'Platform', desc: 'Lead our platform development with cutting-edge tech stack', match: 95, fullDesc: 'We\'re looking for an experienced Full Stack Developer to lead our platform architecture. You\'ll work with React, Node.js, and cloud technologies to build scalable solutions. Responsibilities include code reviews, mentoring junior developers, and driving technical decisions. You should have 8+ years of experience and a passion for clean code.' },
    { id: 2, title: 'Product Manager', dept: 'product', location: 'Remote', salary: '120k-160k KES', level: 'Mid', team: 'Product', desc: 'Shape the future of property management', match: 88, fullDesc: 'Join our product team to define the future of property management. You\'ll conduct user research, analyze market trends, and prioritize features that drive impact. This role requires strong communication skills, data-driven decision making, and 5+ years of product management experience. You\'ll work closely with engineering and design teams.' },
    { id: 3, title: 'UX/UI Designer', dept: 'design', location: 'New York, NY', salary: '100k-140k KES', level: 'Mid', team: 'Design', desc: 'Create beautiful experiences for millions', match: 92, fullDesc: 'Design intuitive interfaces that delight our users. You\'ll conduct user testing, create wireframes and prototypes, and collaborate with developers to bring designs to life. We\'re looking for someone with 5+ years of design experience, proficiency in Figma, and a portfolio showcasing your best work. Your designs will impact thousands of property managers.' },
    { id: 4, title: 'DevOps Engineer', dept: 'engineering', location: 'Remote', salary: '130k-180k KES', level: 'Senior', team: 'Infrastructure', desc: 'Build scalable infrastructure for growth', match: 90, fullDesc: 'Build and maintain our cloud infrastructure on AWS. You\'ll design CI/CD pipelines, manage Kubernetes clusters, and ensure 99.9% uptime. We need someone with 7+ years of DevOps experience, strong knowledge of containerization, and experience with infrastructure-as-code. You\'ll be responsible for our platform\'s reliability and performance.' },
    { id: 5, title: 'Marketing Manager', dept: 'marketing', location: 'Austin, TX', salary: '80k-120k KES', level: 'Mid', team: 'Growth', desc: 'Drive growth and brand awareness', match: 85, fullDesc: 'Lead our marketing initiatives to drive customer acquisition and retention. You\'ll develop marketing strategies, manage campaigns, and analyze performance metrics. We\'re looking for someone with 5+ years of marketing experience, strong analytical skills, and experience with marketing automation tools. Your work will directly impact our growth trajectory.' },
    { id: 6, title: 'Data Analyst', dept: 'analytics', location: 'Remote', salary: '50k-90k KES', level: 'Junior', team: 'Analytics', desc: 'Unlock insights from our data', match: 87, fullDesc: 'Transform raw data into actionable insights. You\'ll work with SQL, Python, and BI tools to analyze user behavior and business metrics. This is a great opportunity for someone with 2-3 years of analytics experience or a strong analytical background. You\'ll support decision-making across the organization and help us understand our customers better.' }
  ];

  const benefits = [
    { icon: Heart, title: 'Health & Wellness', items: ['Medical, dental, vision', 'Mental health support', 'Gym membership', 'Wellness stipend'] },
    { icon: Zap, title: 'Work Flexibility', items: ['Remote-first culture', 'Flexible hours', '4-week PTO', 'Sabbatical program'] },
    { icon: TrendingUp, title: 'Growth', items: ['Learning budget $5k/yr', 'Career development', 'Mentorship program', 'Conference attendance'] },
    { icon: Award, title: 'Equity & Bonus', items: ['Stock options', 'Performance bonus', 'Referral rewards', 'Signing bonus'] }
  ];

  const testimonials = [
    { name: 'Alex Chen', role: 'Senior Engineer', quote: 'Best decision I made. The team is incredible and the impact is real.' },
    { name: 'Maria Garcia', role: 'Product Manager', quote: 'Autonomy, support, and a mission that matters. What more could you ask for?' },
    { name: 'James Wilson', role: 'Designer', quote: 'The culture here is unmatched. Everyone genuinely cares about each other.' }
  ];

  const filteredJobs = jobs.filter(j => filterDept === 'all' || j.dept === filterDept);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Hero with Video */}
      <section style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #ea580c 100%)', color: 'white', padding: '6rem 2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1 }}>
          <div style={{ position: 'absolute', top: '10%', right: '10%', width: '300px', height: '300px', background: 'radial-gradient(circle, white, transparent)', borderRadius: '50%' }} />
        </div>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1024px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{ fontSize: '4rem', fontWeight: '900', marginBottom: '1.5rem', lineHeight: '1.1' }}>Build the Future of Property Management</h1>
            <p style={{ fontSize: '1.3rem', opacity: 0.95, marginBottom: '2rem', lineHeight: '1.6' }}>Join 500+ talented people transforming how the world manages properties. We're hiring across all departments.</p>
            <button style={{ padding: '1rem 2.5rem', backgroundColor: 'white', color: '#ea580c', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}><Play style={{ width: '20px', height: '20px' }} />Watch Our Story</button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ maxWidth: '1024px', margin: '-2rem auto 0', padding: '0 2rem', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
          {[{ num: '500+', label: 'Team Members', icon: '👥' }, { num: '50+', label: 'Countries', icon: '🌍' }, { num: '$100M+', label: 'Funding', icon: '💰' }, { num: '98%', label: 'Satisfaction', icon: '⭐' }].map((stat, i) => (
            <div key={i} style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '1px solid #f0f0f0' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#ea580c', marginBottom: '0.5rem' }}>{stat.num}</div>
              <div style={{ color: '#666', fontWeight: '600' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Join */}
      <section style={{ maxWidth: '1024px', margin: '4rem auto', padding: '0 2rem' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1rem', color: '#1e293b' }}>Why Join StaySpot?</h2>
        <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '3rem', maxWidth: '600px' }}>We invest in our people because we believe great products come from great teams.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <div key={idx} style={{ backgroundColor: '#f9fafb', padding: '2.5rem', borderRadius: '12px', border: '1px solid #e5e7eb', transition: 'all 0.3s', cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <Icon style={{ width: '40px', height: '40px', color: '#ea580c', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem', color: '#1e293b' }}>{benefit.title}</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {benefit.items.map((item, i) => (
                    <li key={i} style={{ color: '#666', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle style={{ width: '16px', height: '16px', color: '#ea580c', flexShrink: 0 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* Jobs */}
      <section style={{ maxWidth: '1024px', margin: '4rem auto', padding: '0 2rem' }}>
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '0.5rem', color: '#1e293b' }}>Open Positions</h2>
          <p style={{ fontSize: '1.1rem', color: '#666' }}>Join our growing team and make an impact</p>
        </div>
        <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {['all', 'engineering', 'product', 'design', 'marketing', 'analytics'].map(dept => (
            <button key={dept} onClick={() => setFilterDept(dept)} style={{ padding: '0.75rem 1.5rem', backgroundColor: filterDept === dept ? '#ea580c' : '#f0f0f0', color: filterDept === dept ? 'white' : '#1e293b', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s' }}>
              {dept.charAt(0).toUpperCase() + dept.slice(1)}
            </button>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {filteredJobs.map(job => (
            <div key={job.id} onClick={() => setSelectedJob(job)} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e5e7eb', cursor: 'pointer', transition: 'all 0.3s', display: 'flex', flexDirection: 'column' }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-4px)'; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <span style={{ backgroundColor: '#ea580c', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700' }}>{job.level}</span>
                <span style={{ backgroundColor: '#f0f0f0', color: '#666', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' }}>{job.match}% match</span>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.75rem' }}>{job.title}</h3>
              <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem', flex: 1 }}>{job.desc}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb', fontSize: '0.85rem', color: '#999' }}>
                <span>📍 {job.location}</span>
                <span>💰 {job.salary}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ backgroundColor: '#f9fafb', padding: '4rem 2rem', marginTop: '4rem' }}>
        <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '3rem', color: '#1e293b', textAlign: 'center' }}>What Our Team Says</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
                  {[...Array(5)].map((_, j) => <Star key={j} style={{ width: '18px', height: '18px', color: '#ea580c', fill: '#ea580c' }} />)}
                </div>
                <p style={{ color: '#666', marginBottom: '1.5rem', lineHeight: '1.6', fontStyle: 'italic' }}>"{t.quote}"</p>
                <div>
                  <p style={{ fontWeight: '700', color: '#1e293b' }}>{t.name}</p>
                  <p style={{ color: '#999', fontSize: '0.9rem' }}>{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Modal */}
      {selectedJob && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', maxWidth: '600px', width: '100%', padding: '3rem', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
            <button onClick={() => setSelectedJob(null)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}><X style={{ width: '24px', height: '24px', color: '#999' }} /></button>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '1rem', color: '#1e293b' }}>{selectedJob.title}</h2>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <span style={{ backgroundColor: '#f0f0f0', padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: '600', color: '#1e293b' }}>{selectedJob.dept}</span>
              <span style={{ backgroundColor: '#f0f0f0', padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: '600', color: '#1e293b' }}>{selectedJob.level}</span>
              <span style={{ backgroundColor: '#f0f0f0', padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: '600', color: '#1e293b' }}>{selectedJob.salary}</span>
            </div>
            <p style={{ color: '#666', marginBottom: '2rem', lineHeight: '1.8', fontSize: '1.05rem' }}>{selectedJob.fullDesc}</p>
            <div style={{ backgroundColor: '#f9fafb', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
              <h4 style={{ fontWeight: '700', color: '#1e293b', marginBottom: '1rem' }}>Position Details</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', fontSize: '0.9rem' }}>
                <div><span style={{ color: '#999' }}>Team:</span> <span style={{ fontWeight: '600', color: '#1e293b' }}>{selectedJob.team}</span></div>
                <div><span style={{ color: '#999' }}>Level:</span> <span style={{ fontWeight: '600', color: '#1e293b' }}>{selectedJob.level}</span></div>
                <div><span style={{ color: '#999' }}>Location:</span> <span style={{ fontWeight: '600', color: '#1e293b' }}>{selectedJob.location}</span></div>
                <div><span style={{ color: '#999' }}>Salary:</span> <span style={{ fontWeight: '600', color: '#1e293b' }}>{selectedJob.salary}</span></div>
              </div>
            </div>
            <button style={{ width: '100%', padding: '1rem', backgroundColor: '#ea580c', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}><Send style={{ width: '18px', height: '18px' }} />Apply Now</button>
          </div>
        </div>
      )}

      {/* CTA */}
      <section style={{ padding: '4rem 2rem', textAlign: 'center', marginTop: '4rem' }}>
        <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '1rem', color: '#1e293b' }}>Don't see your role?</h2>
          <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2rem' }}>We're always looking for talented people. Send us your resume and let's talk.</p>
          <button style={{ padding: '0.75rem 2rem', backgroundColor: '#ea580c', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>Send Your Resume</button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Careers;
