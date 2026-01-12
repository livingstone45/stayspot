import React from 'react';
import { motion } from 'framer-motion';
import { Target, Lightbulb, Shield, Zap, Globe, Headphones, Home, Truck, Building2, BarChart3, Lock, Smartphone, CheckCircle, ArrowRight, Star, Mail, Phone, MapPin, Clock, Users } from 'lucide-react';
import Footer from '../../components/common/Footer';

const AboutPage = () => {
  const features = [
    { icon: <Home size={40} />, title: 'Property Discovery', desc: 'Find homes, shops, and commercial spaces easily' },
    { icon: <Truck size={40} />, title: 'Relocation Support', desc: 'Connect with trusted transport providers' },
    { icon: <Building2 size={40} />, title: 'Management Tools', desc: 'Complete PMS for agencies and landlords' },
    { icon: <BarChart3 size={40} />, title: 'Analytics', desc: 'Data-driven insights for better decisions' },
    { icon: <Lock size={40} />, title: 'Verified Providers', desc: 'Trust and transparency guaranteed' },
    { icon: <Smartphone size={40} />, title: 'Mobile First', desc: 'Manage properties on the go' }
  ];

  const coreValues = [
    { title: 'Trust & Transparency', icon: '🤝' },
    { title: 'Reliability', icon: '✅' },
    { title: 'Efficiency', icon: '⚡' },
    { title: 'Customer First', icon: '❤️' },
    { title: 'Innovation', icon: '💡' },
    { title: 'Community', icon: '🌍' }
  ];

  const testimonials = [
    { name: 'John Kariuki', role: 'Property Manager', text: 'Stayspot transformed how I manage 50+ properties. Saved me 20 hours weekly!', avatar: '👨💼' },
    { name: 'Sarah Mwangi', role: 'Landlord', text: 'Best platform for finding reliable tenants. Transparent and secure!', avatar: '👩💼' },
    { name: 'Mike Ochieng', role: 'Transport Provider', text: 'Connected me with hundreds of relocation clients. Highly recommended!', avatar: '👨🔧' }
  ];

  const pricingTiers = [
    { title: 'Landlords', items: ['Free basic listing', 'Monthly subscription', 'Commission on sales'], emoji: '🏠' },
    { title: 'Agents', items: ['Registration fee', 'PMS subscription', 'Tiered pricing', 'Enterprise plans'], emoji: '🏢' },
    { title: 'Transporters', items: ['Registration fee', 'Monthly subscription', 'Relocation requests'], emoji: '🚚' },
    { title: 'Seekers', items: ['Free account', 'Pay per booking', 'Transparent pricing'], emoji: '👥' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="bg-white overflow-hidden">
      {/* Hero Section with Background Image */}
      <section className="relative bg-cover bg-center bg-no-repeat py-32 px-4" style={{
        backgroundImage: 'linear-gradient(135deg, rgba(15, 23, 42, 0.75) 0%, rgba(30, 41, 59, 0.75) 100%), url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=600&fit=crop")'
      }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-5xl mx-auto text-center text-white">
          <h1 className="text-6xl md:text-7xl font-bold mb-4">About Stayspot</h1>
          <p className="text-2xl md:text-3xl opacity-90">Connecting landlords, agents, transport providers, and space seekers in one unified ecosystem</p>
        </motion.div>
      </section>

      {/* Who We Are Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block mb-4 px-4 py-2 bg-orange-100 rounded-full">
                <span className="text-orange-600 text-sm font-bold">WHO WE ARE</span>
              </div>
              <h2 className="text-5xl font-bold text-slate-900 mb-6 leading-tight">
                Connecting the Property Ecosystem
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                Stayspot is an integrated digital platform that connects landlords, property agents, sellers, transport providers, and space seekers in one unified ecosystem.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                We go beyond listings—providing property discovery, relocation support, transport coordination, and management systems that make it easier for people to relocate, invest, and do business efficiently.
              </p>
              <motion.a href="/auth/signup" whileHover={{ scale: 1.05 }} className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition">
                Join Now <ArrowRight size={20} />
              </motion.a>
            </div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative">
              <div className="bg-gradient-to-br from-orange-100 to-pink-100 rounded-3xl p-12 border-2 border-orange-200 shadow-2xl">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { icon: '🏠', label: 'Landlords' },
                    { icon: '🏢', label: 'Agents' },
                    { icon: '🚚', label: 'Transporters' },
                    { icon: '👥', label: 'Seekers' }
                  ].map((item, i) => (
                    <motion.div key={i} whileHover={{ scale: 1.1, rotate: 5 }} className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition">
                      <div className="text-5xl mb-3">{item.icon}</div>
                      <p className="font-bold text-slate-700 text-lg">{item.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-5xl font-bold text-slate-900 mb-4">Our Purpose</h2>
            <p className="text-xl text-slate-600">Guiding every decision we make</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="p-12 rounded-3xl bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 hover:shadow-2xl transition">
              <div className="flex items-start gap-4 mb-6">
                <Target size={48} className="text-blue-600 flex-shrink-0" />
                <h3 className="text-3xl font-bold text-slate-900">Our Mission</h3>
              </div>
              <p className="text-lg text-slate-700 leading-relaxed">
                To simplify property access, relocation, and management by delivering a reliable, technology-driven platform that serves landlords, agents, businesses, and individuals.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="p-12 rounded-3xl bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 hover:shadow-2xl transition">
              <div className="flex items-start gap-4 mb-6">
                <Lightbulb size={48} className="text-purple-600 flex-shrink-0" />
                <h3 className="text-3xl font-bold text-slate-900">Our Vision</h3>
              </div>
              <p className="text-lg text-slate-700 leading-relaxed">
                To become the leading platform for property discovery, relocation services, and property management solutions in urban and emerging markets.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-5xl font-bold text-slate-900 mb-4">Core Values</h2>
            <p className="text-xl text-slate-600">What drives us every day</p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" variants={containerVariants} viewport={{ once: true }} className="grid md:grid-cols-3 gap-8">
            {coreValues.map((value, i) => (
              <motion.div key={i} variants={itemVariants} className="p-8 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-500 text-white font-bold text-xl text-center shadow-lg hover:shadow-2xl transition transform hover:scale-105 cursor-pointer">
                <div className="text-5xl mb-4">{value.icon}</div>
                {value.title}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-5xl font-bold text-slate-900 mb-4">What We Do</h2>
            <p className="text-xl text-slate-600">Everything you need to manage properties and relocations</p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" variants={containerVariants} viewport={{ once: true }} className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div key={i} variants={itemVariants} className="p-8 rounded-2xl bg-white border-2 border-slate-200 hover:border-orange-400 hover:shadow-2xl transition group">
                <div className="text-orange-600 mb-4 group-hover:scale-110 transition">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Stayspot Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-5xl font-bold text-slate-900 mb-4">Why Choose Stayspot?</h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" variants={containerVariants} viewport={{ once: true }} className="grid md:grid-cols-2 gap-8">
            {[
              { icon: <Shield size={40} />, title: 'Verified Providers', desc: 'All users and properties are verified for trust and security' },
              { icon: <Globe size={40} />, title: 'Unified Ecosystem', desc: 'Property + Transport + Management in one integrated platform' },
              { icon: <Zap size={40} />, title: 'Lightning Fast', desc: 'Optimized for speed and works in low bandwidth environments' },
              { icon: <Headphones size={40} />, title: '24/7 Support', desc: 'Local support team available in Swahili & English' }
            ].map((item, i) => (
              <motion.div key={i} variants={itemVariants} className="p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-pink-50 border-2 border-orange-200 hover:shadow-xl transition">
                <div className="text-orange-600 mb-4">{item.icon}</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-700">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-orange-50 to-pink-50">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-5xl font-bold text-slate-900 mb-4">What Our Users Say</h2>
            <p className="text-xl text-slate-600">Join thousands of satisfied customers</p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" variants={containerVariants} viewport={{ once: true }} className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <motion.div key={i} variants={itemVariants} className="p-8 rounded-2xl bg-white border-2 border-orange-200 shadow-lg hover:shadow-2xl transition">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-5xl">{testimonial.avatar}</div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">{testimonial.name}</h4>
                    <p className="text-sm text-slate-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} size={18} className="fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-slate-700 italic leading-relaxed">"{testimonial.text}"</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-5xl font-bold text-slate-900 mb-4">Fair & Transparent Pricing</h2>
            <p className="text-xl text-slate-600">Plans for every user type</p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" variants={containerVariants} viewport={{ once: true }} className="grid md:grid-cols-4 gap-6">
            {pricingTiers.map((tier, i) => (
              <motion.div key={i} variants={itemVariants} className="p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200 hover:border-orange-400 hover:shadow-2xl transition">
                <div className="text-5xl mb-4">{tier.emoji}</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">{tier.title}</h3>
                <ul className="space-y-3">
                  {tier.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-1" />
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 text-slate-900">Get in Touch</h2>
            <p className="text-xl text-slate-600">Our team is ready to help you succeed</p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" variants={containerVariants} viewport={{ once: true }} className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { icon: <Mail size={32} />, title: 'Email', value: 'info@stayspot.co.ke' },
              { icon: <Phone size={32} />, title: 'Phone', value: '+254748041595' },
              { icon: <MapPin size={32} />, title: 'Office', value: 'Nakuru, Kenya' }
            ].map((contact, i) => (
              <motion.div key={i} variants={itemVariants} className="p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200 text-center hover:shadow-lg transition">
                <div className="text-orange-600 mb-4 flex justify-center">{contact.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-slate-900">{contact.title}</h3>
                <p className="text-slate-600">{contact.value}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-white border-2 border-orange-200 text-center">
            <Clock size={32} className="text-orange-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4 text-slate-900">Support Hours</h3>
            <p className="text-slate-600 mb-2">Monday – Friday: 8:00 AM – 6:00 PM</p>
            <p className="text-slate-600">Saturday: 8:00 AM – 1:00 PM</p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
