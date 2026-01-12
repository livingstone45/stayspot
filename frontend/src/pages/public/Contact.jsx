import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Clock, Globe, MessageSquare, Users } from 'lucide-react';
import Footer from '../../components/common/Footer';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const offices = [
    {
      region: 'Africa',
      city: 'Nakuru, Kenya',
      address: 'Nakuru, Kenya',
      phone: '+254 748 041 595',
      email: 'info@stayspot.co.ke',
      hours: 'Mon-Fri, 9 AM - 6 PM EAT',
      map: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.788...&z=15'
    },
    {
      region: 'Sales Team',
      city: 'Nakuru, Kenya',
      address: 'Nakuru, Kenya',
      phone: '+254 715 601 225',
      email: 'contact@stayspot.co.ke',
      hours: 'Mon-Fri, 9 AM - 6 PM EAT',
      map: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.788...&z=15'
    },
    {
      region: 'Support Team',
      city: 'Nakuru, Kenya',
      address: 'Nakuru, Kenya',
      phone: '+254 748 041 595',
      email: 'support@stayspot.co.ke',
      hours: 'Mon-Fri, 9 AM - 6 PM EAT',
      map: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.788...&z=15'
    }
  ];

  const contactMethods = [
    { icon: <Mail size={40} />, title: 'General Inquiries', description: 'Send us your questions', contact: 'info@stayspot.co.ke' },
    { icon: <Mail size={40} />, title: 'Sales', description: 'Learn about our plans', contact: 'contact@stayspot.co.ke' },
    { icon: <Phone size={40} />, title: 'Phone Support', description: 'Speak with our team directly', contact: '+254 748 041 595' },
    { icon: <Phone size={40} />, title: 'Alternative Line', description: 'Another support number', contact: '+254 715 601 225' }
  ];

  const supportTeam = [
    { name: 'General Support', description: 'info@stayspot.co.ke', response: 'info@stayspot.co.ke' },
    { name: 'Sales Inquiries', description: 'contact@stayspot.co.ke', response: 'contact@stayspot.co.ke' },
    { name: 'Technical Support', description: '+254 748 041 595', response: '+254 748 041 595' },
    { name: 'Alternative Support', description: '+254 715 601 225', response: '+254 715 601 225' }
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
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Get In <span className="text-orange-400">Touch</span></h1>
          <p className="text-xl md:text-2xl opacity-90 mb-4">Based in Nakuru, Kenya • Serving the World</p>
          <p className="text-lg opacity-80">We're here to help. Reach out to our team anytime.</p>
        </motion.div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">How to Reach Us</h2>
            <p className="text-xl text-slate-600">Choose the method that works best for you</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-50 p-8 rounded-2xl text-center hover:shadow-lg transition"
              >
                <div className="inline-flex p-3 bg-slate-100 text-slate-700 rounded-lg mb-4">
                  {method.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{method.title}</h3>
                <p className="text-slate-600 mb-3">{method.description}</p>
                <p className="text-sm font-semibold text-slate-900">{method.contact}</p>
              </motion.div>
            ))}
          </div>

          {/* Live Chat & Sales Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-orange-50 to-blue-50 rounded-2xl p-12 border-2 border-orange-200"
          >
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-4xl mb-3">💬</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Live Chat</h3>
                <p className="text-slate-600 mb-4">Chat with our sales or support team instantly</p>
                <button className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition">
                  Start Live Chat
                </button>
              </div>
              <div>
                <div className="text-4xl mb-3">📅</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Book a Demo</h3>
                <p className="text-slate-600 mb-4">Schedule a personalized 30-min demo with our team</p>
                <button className="w-full bg-blue-500 text-white py-3 rounded-lg font-bold hover:bg-blue-600 transition">
                  Schedule Demo
                </button>
              </div>
              <div>
                <div className="text-4xl mb-3">🚀</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Enterprise Sales</h3>
                <p className="text-slate-600 mb-4">Speak with our sales team for custom solutions</p>
                <button className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition">
                  Talk to Sales
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Form and Map Side by Side */}
      <section className="py-20 bg-slate-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-12 rounded-2xl shadow-lg"
            >
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Send us a Message</h2>
              
              {submitted && (
                <div className="mb-6 p-4 bg-emerald-100 border border-emerald-400 text-emerald-700 rounded-lg">
                  ✓ Thank you! We've received your message and will get back to you soon.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-slate-900 font-semibold mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900 transition"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-900 font-semibold mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900 transition"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-900 font-semibold mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900 transition"
                    placeholder="What is this about?"
                  />
                </div>

                <div>
                  <label className="block text-slate-900 font-semibold mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900 transition resize-none"
                    placeholder="Tell us more..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition flex items-center justify-center gap-2 shadow-lg"
                >
                  <Send size={20} />
                  Send Message
                </button>
              </form>
            </motion.div>

            {/* Quick Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="inline-flex p-3 bg-slate-100 text-slate-700 rounded-lg flex-shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Main Office</h3>
                    <p className="text-slate-600">123 Property St</p>
                    <p className="text-slate-600">San Francisco, CA 94105</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="inline-flex p-3 bg-slate-100 text-slate-700 rounded-lg flex-shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Phone Support</h3>
                    <p className="text-slate-600">+1 (555) 123-4567</p>
                    <p className="text-sm text-slate-500 mt-1">Available Mon-Fri, 9 AM - 6 PM PST</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="inline-flex p-3 bg-slate-100 text-slate-700 rounded-lg flex-shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Email Support</h3>
                    <p className="text-slate-600">support@stayspot.com</p>
                    <p className="text-sm text-slate-500 mt-1">Average response: 2-4 hours</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="inline-flex p-3 bg-slate-100 text-slate-700 rounded-lg flex-shrink-0">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Business Hours</h3>
                    <p className="text-slate-600">Monday - Friday</p>
                    <p className="text-slate-600">9:00 AM - 6:00 PM PST</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Support Team */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Support Teams</h2>
            <p className="text-xl text-slate-600">Specialized support for different needs</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportTeam.map((team, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-2xl border border-slate-200 hover:border-slate-400 transition"
              >
                <div className="inline-flex p-2 bg-slate-700 text-white rounded-lg mb-4">
                  <Mail size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{team.name}</h3>
                <p className="text-slate-600 text-sm mb-4">{team.description}</p>
                <p className="text-sm font-semibold text-slate-700">📧 {team.response}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Headquarters - Redesigned */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center justify-center gap-2 bg-slate-100 px-4 py-2 rounded-full mb-6">
              <MapPin size={16} className="text-slate-700" />
              <span className="text-sm font-semibold text-slate-700">Our Locations</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">Our Headquarters</h2>
            <p className="text-xl md:text-2xl text-slate-600 mb-4">Based in Nakuru, Kenya • Serving Property Managers Worldwide</p>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">We're strategically located in the heart of Kenya, serving property managers and landlords across East Africa and beyond</p>
          </motion.div>

          {/* Headquarters Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
            {offices.map((office, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
                
                <div className="relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition duration-500 overflow-hidden border border-slate-100">
                  {/* Card Header with Gradient Background */}
                  <div className="h-32 bg-gradient-to-r from-slate-800 to-slate-900 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                      <MapPin size={100} className="absolute -top-8 -right-8 text-white" />
                    </div>
                    <div className="relative h-full flex flex-col justify-end p-6">
                      <h3 className="text-3xl font-bold text-white">{office.region}</h3>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-8">
                    <div className="mb-2 flex items-center gap-2">
                      <Globe size={18} className="text-slate-700" />
                      <p className="text-lg font-semibold text-slate-900">{office.city}</p>
                    </div>
                    <p className="text-sm text-slate-500 mb-8 border-b border-slate-100 pb-6">Eastern Africa</p>

                    {/* Contact Details */}
                    <div className="space-y-6">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-slate-100 text-slate-700">
                            <MapPin size={20} />
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Location</p>
                          <p className="text-slate-900 font-semibold mt-1">{office.address}</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-100 text-blue-700">
                            <Phone size={20} />
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Phone</p>
                          <a href={`tel:${office.phone}`} className="text-blue-600 font-semibold mt-1 hover:text-blue-700 transition">
                            {office.phone}
                          </a>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-emerald-100 text-emerald-700">
                            <Mail size={20} />
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</p>
                          <a href={`mailto:${office.email}`} className="text-emerald-600 font-semibold mt-1 hover:text-emerald-700 transition">
                            {office.email}
                          </a>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-orange-100 text-orange-700">
                            <Clock size={20} />
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Business Hours</p>
                          <p className="text-slate-900 font-semibold mt-1">{office.hours}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button className="w-full mt-8 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition duration-300 flex items-center justify-center gap-2 group/btn hover:from-orange-600 hover:to-orange-700">
                      <MapPin size={18} />
                      <span>Get Directions</span>
                      <span className="opacity-0 group-hover/btn:opacity-100 transition">→</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Key Information Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-12 text-white"
          >
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <p className="text-orange-100">Online Support Available</p>
            </div>
            <div className="text-center border-l border-r border-orange-400">
              <div className="text-4xl font-bold mb-2">2-4hrs</div>
              <p className="text-orange-100">Average Response Time</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">5000+</div>
              <p className="text-orange-100">Happy Property Managers</p>
            </div>
          </motion.div>

          {/* Quick Access Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-slate-50 rounded-3xl p-12 text-center"
          >
            <h3 className="text-3xl font-bold text-slate-900 mb-4">Can't Find What You Need?</h3>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">Browse our comprehensive resources, FAQs, and support guides to find answers instantly</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <a href="/faq" className="group p-6 bg-white rounded-2xl border border-slate-200 hover:border-orange-400 hover:shadow-lg transition duration-300">
                <MessageSquare size={32} className="text-orange-500 mx-auto mb-3 group-hover:scale-110 transition" />
                <h4 className="font-bold text-slate-900 mb-2">Visit FAQ</h4>
                <p className="text-sm text-slate-600 mb-4">Browse 50+ common questions</p>
                <span className="text-slate-900 font-semibold flex items-center justify-center gap-2">View FAQs <span className="group-hover:translate-x-1 transition">→</span></span>
              </a>

              <a href="/help" className="group p-6 bg-white rounded-2xl border border-slate-200 hover:border-orange-400 hover:shadow-lg transition duration-300">
                <Users size={32} className="text-orange-500 mx-auto mb-3 group-hover:scale-110 transition" />
                <h4 className="font-bold text-slate-900 mb-2">Get Help</h4>
                <p className="text-sm text-slate-600 mb-4">Access tutorials and guides</p>
                <span className="text-slate-900 font-semibold flex items-center justify-center gap-2">Get Started <span className="group-hover:translate-x-1 transition">→</span></span>
              </a>

              <a href="#contact-form" className="group p-6 bg-white rounded-2xl border border-slate-200 hover:border-orange-400 hover:shadow-lg transition duration-300">
                <Mail size={32} className="text-orange-500 mx-auto mb-3 group-hover:scale-110 transition" />
                <h4 className="font-bold text-slate-900 mb-2">Contact Us</h4>
                <p className="text-sm text-slate-600 mb-4">Send a direct message</p>
                <span className="text-slate-900 font-semibold flex items-center justify-center gap-2">Send Message <span className="group-hover:translate-x-1 transition">→</span></span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Quick Links */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Can't find what you need?</h2>
            <p className="text-xl text-slate-600 mb-8">Check out our resources</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/faq" className="inline-flex items-center justify-center bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition">
                Visit FAQ →
              </a>
              <a href="/help" className="inline-flex items-center justify-center border-2 border-slate-900 text-slate-900 px-8 py-4 rounded-xl font-bold hover:bg-slate-50 transition">
                Get Help →
              </a>
            </div>
          </motion.div>
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">Ready to get started?</h2>
            <p className="text-xl mb-12 text-slate-600">Join thousands of property managers using StaySpot</p>
            <a href="/auth/signup" className="inline-flex items-center justify-center bg-orange-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-600 transition">
              Start Free Trial →
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
