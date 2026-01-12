import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../../components/common/Footer';
import { 
  Home, 
  Users, 
  DollarSign, 
  Wrench, 
  Clipboard, 
  BarChart3, 
  Bell,
  Check,
  Shield,
  Clock,
  Smartphone,
  ChevronRight,
  Star,
  Zap,
  TrendingUp,
  Globe,
  Headphones,
  Lock,
  Gauge,
  Target,
  Award,
  Play,
  ArrowRight,
  MessageSquare,
  Search,
  MapPin,
  Bed,
  Bath,
  Square
} from 'lucide-react';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('landlords');
  const [isVisible, setIsVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/properties');
      if (response.ok) {
        const data = await response.json();
        setAllProperties(data);
      } else {
        console.error('Failed to fetch properties');
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  // Featured properties with full details - 12 properties for 2 rows of 6
  const defaultProperties = [
    {
      id: 1,
      name: 'Luxury 3-Bedroom Apartment',
      location: 'Westlands, Nairobi',
      price: 85000,
      bedrooms: 3,
      bathrooms: 2,
      area: 150,
      type: 'apartment',
      status: 'Active',
      views: 30,
      enquiries: 4,
      gradient: 'from-blue-400 to-blue-600'
    },
    {
      id: 2,
      name: 'Modern Bedsitter Studio',
      location: 'Kilimani, Nairobi',
      price: 35000,
      bedrooms: 1,
      bathrooms: 1,
      area: 45,
      type: 'studio',
      status: 'Pending',
      views: 18,
      enquiries: 2,
      gradient: 'from-purple-400 to-purple-600'
    },
    {
      id: 3,
      name: 'Family Townhouse 4-Rooms',
      location: 'Runda, Nairobi',
      price: 120000,
      bedrooms: 4,
      bathrooms: 3,
      area: 200,
      type: 'townhouse',
      status: 'Just Listed',
      views: 45,
      enquiries: 6,
      gradient: 'from-emerald-400 to-emerald-600'
    },
    {
      id: 4,
      name: 'Cozy 2-Bedroom Flat',
      location: 'Karen, Nairobi',
      price: 65000,
      bedrooms: 2,
      bathrooms: 1,
      area: 95,
      type: 'apartment',
      status: 'Active',
      views: 22,
      enquiries: 3,
      gradient: 'from-pink-400 to-pink-600'
    },
    {
      id: 5,
      name: 'Commercial Office Space',
      location: 'Upper Hill, Nairobi',
      price: 150000,
      bedrooms: 0,
      bathrooms: 2,
      area: 250,
      type: 'office',
      status: 'Active',
      views: 58,
      enquiries: 8,
      gradient: 'from-orange-400 to-orange-600'
    },
    {
      id: 6,
      name: 'Luxury Villa with Garden',
      location: 'Muthaiga, Nairobi',
      price: 250000,
      bedrooms: 5,
      bathrooms: 4,
      area: 400,
      type: 'villa',
      status: 'Active',
      views: 72,
      enquiries: 12,
      gradient: 'from-indigo-400 to-indigo-600'
    },
    {
      id: 7,
      name: 'Modern 3-Bedroom Apartment',
      location: 'Lavington, Nairobi',
      price: 95000,
      bedrooms: 3,
      bathrooms: 2,
      area: 160,
      type: 'apartment',
      status: 'Active',
      views: 41,
      enquiries: 5,
      gradient: 'from-cyan-400 to-cyan-600'
    },
    {
      id: 8,
      name: 'Spacious 2-Bedroom Townhouse',
      location: 'Parklands, Nairobi',
      price: 75000,
      bedrooms: 2,
      bathrooms: 2,
      area: 110,
      type: 'townhouse',
      status: 'Active',
      views: 35,
      enquiries: 4,
      gradient: 'from-rose-400 to-rose-600'
    },
    {
      id: 9,
      name: 'Elegant 4-Bedroom Villa',
      location: 'Nyari, Nairobi',
      price: 180000,
      bedrooms: 4,
      bathrooms: 3,
      area: 280,
      type: 'villa',
      status: 'Active',
      views: 63,
      enquiries: 9,
      gradient: 'from-violet-400 to-violet-600'
    },
    {
      id: 10,
      name: 'Cozy Studio Apartment',
      location: 'Eastleigh, Nairobi',
      price: 28000,
      bedrooms: 1,
      bathrooms: 1,
      area: 35,
      type: 'studio',
      status: 'Active',
      views: 52,
      enquiries: 7,
      gradient: 'from-amber-400 to-amber-600'
    },
    {
      id: 11,
      name: 'Premium Office Suite',
      location: 'Westlands, Nairobi',
      price: 175000,
      bedrooms: 0,
      bathrooms: 3,
      area: 300,
      type: 'office',
      status: 'Active',
      views: 67,
      enquiries: 11,
      gradient: 'from-teal-400 to-teal-600'
    },
    {
      id: 12,
      name: 'Luxury 5-Bedroom Mansion',
      location: 'Muthaiga, Nairobi',
      price: 320000,
      bedrooms: 5,
      bathrooms: 4,
      area: 450,
      type: 'villa',
      status: 'Just Listed',
      views: 89,
      enquiries: 15,
      gradient: 'from-fuchsia-400 to-fuchsia-600'
    }
  ];

  const properties = allProperties.length > 0 ? allProperties : defaultProperties;

  // Filter properties based on search and filters
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || property.type === selectedType;
    const matchesLocation = selectedLocation === 'all' || property.location.includes(selectedLocation);
    return matchesSearch && matchesType && matchesLocation;
  });

  const features = [
    { icon: <Home size={40} />, title: 'Properties', description: 'Manage all your properties in one place. Track units, tenants, and maintenance with ease.' },
    { icon: <Users size={40} />, title: 'Tenants', description: 'Keep track of tenant information, lease details, and payment history automatically.' },
    { icon: <DollarSign size={40} />, title: 'Financial', description: 'Track income, expenses, and generate detailed reports for better insights.' }
  ];

  const advancedFeatures = [
    { icon: <Wrench size={32} />, title: 'Maintenance Tracking', description: 'Schedule and track maintenance requests efficiently' },
    { icon: <Clipboard size={32} />, title: 'Task Management', description: 'Assign and organize tasks for your team' },
    { icon: <BarChart3 size={32} />, title: 'Analytics', description: 'Get insights with detailed reports and analytics' },
    { icon: <Bell size={32} />, title: 'Notifications', description: 'Stay updated with real-time notifications' }
  ];

  const benefits = [
    { icon: <Check className="text-orange-500" size={28} />, title: 'Easy to Use', description: 'Intuitive interface designed for property managers of all experience levels.' },
    { icon: <Shield className="text-slate-700" size={28} />, title: 'Secure & Reliable', description: 'Enterprise-grade security to protect your data and your tenants\' information.' },
    { icon: <Clock className="text-slate-700" size={28} />, title: '24/7 Support', description: 'Our dedicated support team is always here to help you succeed.' },
    { icon: <Smartphone className="text-orange-500" size={28} />, title: 'Mobile Ready', description: 'Access your properties on the go with our responsive mobile app.' }
  ];

  const stats = [
    { value: '8.5K+', label: 'Active Users', usdValue: '$8,500', kshValue: 'KSH 1.1M', icon: <Users size={28} /> },
    { value: '3.2K+', label: 'Properties Managed', usdValue: '$15.2M', kshValue: 'KSH 1.98B', icon: <Home size={28} /> },
    { value: 'KSH 450M+', label: 'Rent Processed', usdValue: '$3.5M', kshValue: 'KSH 450M+', icon: <DollarSign size={28} /> },
    { value: '99.8%', label: 'System Uptime', usdValue: '15.2 mins/month', kshValue: 'Downtime', icon: <Gauge size={28} /> }
  ];

  const tabs = [
    { id: 'landlords', label: 'For Landlords' },
    { id: 'managers', label: 'For Managers' },
    { id: 'tenants', label: 'For Tenants' }
  ];

  const tabContents = {
    landlords: {
      title: 'Maximize Your Rental Income',
      description: 'Track multiple properties, automate rent collection, and get detailed financial insights to grow your portfolio.',
      features: [
        'Manage unlimited properties',
        'Automated rent reminders and collection',
        'Tax-ready financial reports',
        'Tenant verification system'
      ]
    },
    managers: {
      title: 'Streamline Your Operations',
      description: 'Coordinate maintenance, manage tenant relationships, and keep your properties running smoothly.',
      features: [
        'Work order management',
        'Vendor coordination',
        'Team collaboration tools',
        'Performance dashboards'
      ]
    },
    tenants: {
      title: 'Rent Payment Made Easy',
      description: 'Pay rent securely, submit maintenance requests, and communicate with your landlord seamlessly.',
      features: [
        'Secure online rent payment',
        'Maintenance request portal',
        'Lease documentation access',
        'Direct communication with management'
      ]
    }
  };

  const integrations = [
    { name: 'M-Pesa', icon: '📱' },
    { name: 'Bank Transfer', icon: '🏦' },
    { name: 'Stripe', icon: '💳' },
    { name: 'Google Drive', icon: '☁️' }
  ];

  const coreCapabilities = [
    {
      icon: <TrendingUp size={40} />,
      title: 'Smart Analytics',
      description: 'Real-time dashboards with actionable insights for better decision-making'
    },
    {
      icon: <Lock size={40} />,
      title: 'Bank-Level Security',
      description: '256-bit encryption, regular backups, and compliance with international standards'
    },
    {
      icon: <Zap size={40} />,
      title: 'Lightning Fast',
      description: 'Optimized for low bandwidth, works offline, syncs when online'
    },
    {
      icon: <Globe size={40} />,
      title: 'Global Platform',
      description: 'Multi-currency, multi-language support across 50+ countries'
    },
    {
      icon: <Headphones size={40} />,
      title: 'Local Support',
      description: 'Kenya-based team, support in Swahili and English, 24/7 availability'
    },
    {
      icon: <Award size={40} />,
      title: 'Industry Leading',
      description: '4.9/5 rating from 10K+ verified users, trusted by property professionals'
    }
  ];

  const testimonials = [
    {
      quote: 'StaySpot transformed how we manage our 50+ properties. The automation features alone saved us 20 hours per week!',
      author: 'Sarah Johnson',
      role: 'Property Manager'
    },
    {
      quote: 'The best investment we made for our rental business. Tenant communication and rent collection is seamless.',
      author: 'James Kipchoge',
      role: 'Landlord & Investor'
    },
    {
      quote: 'Paying rent has never been easier. The mobile app is intuitive and secure. Highly recommended!',
      author: 'Emily Ochieng',
      role: 'Tenant'
    }
  ];

  // Trust badges and guarantees
  const trustBadges = [
    { icon: '🔒', text: 'SSL Encrypted', subtext: 'Bank-level security' },
    { icon: '✅', text: '30-Day Money Back', subtext: 'No questions asked' },
    { icon: '⭐', text: '4.9/5 Rating', subtext: '2,500+ reviews' },
    { icon: '🛡️', text: 'GDPR Compliant', subtext: 'Data protection' }
  ];

  // ROI benefits
  const roiBenefits = [
    { metric: '20+ Hours', benefit: 'Saved Monthly', description: 'Automation of routine tasks' },
    { metric: '15%', benefit: 'Revenue Increase', description: 'Better occupancy & pricing' },
    { metric: '40%', benefit: 'Faster Collections', description: 'Automated reminders' },
    { metric: '60%', benefit: 'Less Disputes', description: 'Clear documentation' }
  ];

  // Comparison with traditional methods
  const comparison = [
    { feature: 'Time to Setup', stayspot: '5 minutes', traditional: '2-3 weeks' },
    { feature: 'Monthly Cost', stayspot: 'From KSH 450', traditional: 'KSH 2,000+' },
    { feature: 'Learning Curve', stayspot: 'Easy (1 hour)', traditional: 'Complex (days)' },
    { feature: 'Mobile Access', stayspot: '✓ Full featured', traditional: '✗ Limited' },
    { feature: 'Support Quality', stayspot: '24/7 Local', traditional: 'Business hours only' }
  ];

  // Customer success stories
  const caseStudies = [
    {
      company: 'Westlands Realty',
      metric: '+45% Revenue',
      story: 'Reduced vacancy from 8% to 2% using StaySpot analytics',
      image: '🏢'
    },
    {
      company: 'Nairobi Properties',
      metric: '30 hrs/week Saved',
      story: 'Automated 80% of their administrative tasks',
      image: '📊'
    },
    {
      company: 'Coast Homes',
      metric: '99.9% On-time',
      story: 'Never missed a deadline with automated workflows',
      image: '⏰'
    }
  ];

  const faqItems = [
    {
      q: 'Is my data safe?',
      a: 'Yes. We use 256-bit SSL encryption, GDPR compliance, and daily backups. Your data is protected like at a bank.'
    },
    {
      q: 'Can I cancel anytime?',
      a: 'Absolutely. No long-term contracts. Cancel anytime from your account settings. Plus 30-day money-back guarantee.'
    },
    {
      q: 'How long to get started?',
      a: 'Just 5 minutes! Sign up, add your properties, and start managing. Free onboarding support included.'
    },
    {
      q: 'What payment methods do you accept?',
      a: 'M-Pesa, Bank Transfer, Stripe, and more. We support all major payment methods in Kenya and globally.'
    },
    {
      q: 'Do you offer support in Swahili?',
      a: 'Yes! Our Kenya-based team supports both English and Swahili. Available 24/7 via chat, email, and phone.'
    },
    {
      q: 'Can I migrate from my current system?',
      a: 'Definitely. We offer free data migration assistance. Our team will help you import all your data safely.'
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-orange-900 text-white py-32 px-4 overflow-hidden">
        <div className="absolute top-20 right-0 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-8 left-0 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto relative z-10"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6 backdrop-blur-sm border border-white/20">
                  <Zap size={16} className="text-orange-400" />
                  <span className="text-sm font-semibold">Transform Your Property Management</span>
                </div>
              </motion.div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Property Management <span className="text-orange-400">Simplified</span>
              </h1>
              
              <p className="text-xl opacity-90 mb-8 leading-relaxed">
                StaySpot is the all-in-one platform trusted by 100K+ property managers to streamline operations, maximize returns, and delight tenants.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <Link 
                  to="/auth/signup"
                  className="group inline-flex items-center justify-center bg-orange-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-600 transition shadow-lg text-lg hover:scale-105"
                >
                  Start Free Trial
                  <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </Link>
                <button className="group inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition text-lg hover:scale-105">
                  <Play size={20} className="mr-2 fill-white" />
                  Watch Demo
                </button>
              </div>

              <p className="text-sm opacity-80">✓ No credit card required • ✓ 14-day free trial • ✓ Cancel anytime</p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="hidden md:block"
            >
              <div className="relative">
                {/* Animated Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-transparent to-blue-500/20 rounded-2xl blur-3xl" />
                
                {/* Main Content Card */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="relative bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-8 backdrop-blur-xl border border-white/20"
                >
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-sm font-semibold text-green-300">System Status: Optimal</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-300">Platform Uptime</span>
                        <span className="text-lg font-bold text-orange-400">99.9%</span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-2">
                        <div className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full" style={{ width: '99.9%' }} />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-300">Data Protection</span>
                        <span className="text-lg font-bold text-blue-400">256-bit</span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-2">
                        <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full w-full" />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                      <p className="text-xs text-slate-400">Trusted by property managers across Africa, Asia & beyond</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Quick Benefits Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              className="flex items-start gap-4 p-6 rounded-lg bg-white/5 border border-white/10 hover:border-orange-400/50 transition-all duration-300"
            >
              <div className="p-3 bg-orange-500/20 rounded-lg flex-shrink-0">
                <Zap className="text-orange-400" size={28} />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Save 20+ Hours Monthly</h3>
                <p className="text-slate-300 text-sm">Automate rent collection, maintenance tracking, and tenant communication</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex items-start gap-4 p-6 rounded-lg bg-white/5 border border-white/10 hover:border-orange-400/50 transition-all duration-300"
            >
              <div className="p-3 bg-green-500/20 rounded-lg flex-shrink-0">
                <TrendingUp className="text-green-400" size={28} />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Increase Revenue by 15%</h3>
                <p className="text-slate-300 text-sm">Smart pricing recommendations and occupancy optimization tools</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex items-start gap-4 p-6 rounded-lg bg-white/5 border border-white/10 hover:border-orange-400/50 transition-all duration-300"
            >
              <div className="p-3 bg-blue-500/20 rounded-lg flex-shrink-0">
                <Shield className="text-blue-400" size={28} />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Bank-Level Security</h3>
                <p className="text-slate-300 text-sm">Your data is protected with 256-bit encryption and daily backups</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Post Your Property Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full mb-6 border border-orange-200">
              <Home size={16} className="text-orange-600" />
              <span className="text-sm font-semibold text-orange-600">Featured Properties</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Discover Properties Ready to List
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Browse properties posted by landlords and managers. Find your perfect property or post yours to reach qualified tenants.
            </p>
          </motion.div>

          {/* Search & Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 space-y-4"
          >
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-4 top-4 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search properties by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition"
              />
            </div>

            {/* Filter Buttons */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Property Type Filter */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Property Type</label>
                <div className="flex flex-wrap gap-2">
                  {['all', 'apartment', 'studio', 'townhouse', 'office', 'villa'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        selectedType === type
                          ? 'bg-orange-500 text-white shadow-lg'
                          : 'bg-white border border-slate-300 text-slate-700 hover:border-orange-500'
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Location</label>
                <div className="flex flex-wrap gap-2">
                  {['all', 'Westlands', 'Kilimani', 'Karen', 'Runda', 'Upper Hill', 'Muthaiga'].map((location) => (
                    <button
                      key={location}
                      onClick={() => setSelectedLocation(location)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        selectedLocation === location
                          ? 'bg-orange-500 text-white shadow-lg'
                          : 'bg-white border border-slate-300 text-slate-700 hover:border-orange-500'
                      }`}
                    >
                      {location === 'all' ? 'All Locations' : location}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <span className="text-sm text-slate-600">
                Showing <strong>{filteredProperties.length}</strong> of <strong>{properties.length}</strong> properties
              </span>
              <Link to="/auth/signup" className="text-orange-600 font-semibold hover:text-orange-700 text-sm">
                Post Your Property →
              </Link>
            </div>
          </motion.div>

          {/* Properties Grid 6 columns (2 rows of 6) */}
          <div className="grid md:grid-cols-6 gap-6 mb-12">
            <AnimatePresence mode="wait">
              {filteredProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -12, scale: 1.02 }}
                  className="group"
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-100 h-full flex flex-col hover:border-orange-300">
                    {/* Image Header with Gradient & Badge */}
                    <div className="relative h-24 bg-gradient-to-br overflow-hidden" style={{ backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))` }}>
                      <div className={`absolute inset-0 bg-gradient-to-br ${property.gradient}`}></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Home size={40} className="text-white opacity-40 group-hover:scale-125 transition-transform" />
                      </div>
                      <div className={`absolute top-2 right-2 px-2 py-1 ${
                        property.status === 'Active' ? 'bg-green-500' : 
                        property.status === 'Pending' ? 'bg-yellow-500' : 
                        'bg-blue-500'
                      } text-white text-xs font-bold rounded-full shadow-lg`}>
                        {property.status}
                      </div>
                      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-orange-600 shadow-md">
                        ⭐ Featured
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-3 flex-1 flex flex-col">
                      <h3 className="font-bold text-slate-900 mb-1 text-sm group-hover:text-orange-600 transition line-clamp-2">
                        {property.name}
                      </h3>

                      {/* Location */}
                      <div className="flex items-center gap-1 text-slate-600 mb-2 text-xs">
                        <MapPin size={12} className="text-orange-500 flex-shrink-0" />
                        <span className="line-clamp-1">{property.location}</span>
                      </div>

                      {/* Price - Highlighted */}
                      <div className="mb-2 pb-2 border-b border-slate-200">
                        <p className="text-lg font-bold text-orange-600">
                          KSH {property.price.toLocaleString()}
                        </p>
                        <span className="text-xs text-slate-500">/month</span>
                      </div>

                      {/* Features Grid - Compact */}
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        {property.bedrooms > 0 && (
                          <div className="text-center p-2 bg-slate-50 rounded">
                            <Bed size={14} className="text-slate-600 mx-auto mb-0.5" />
                            <span className="text-xs font-bold text-slate-700">{property.bedrooms}</span>
                            <p className="text-xs text-slate-500">Beds</p>
                          </div>
                        )}
                        <div className="text-center p-2 bg-slate-50 rounded">
                          <Bath size={14} className="text-slate-600 mx-auto mb-0.5" />
                          <span className="text-xs font-bold text-slate-700">{property.bathrooms}</span>
                          <p className="text-xs text-slate-500">Baths</p>
                        </div>
                        <div className="text-center p-2 bg-slate-50 rounded">
                          <Square size={14} className="text-slate-600 mx-auto mb-0.5" />
                          <span className="text-xs font-bold text-slate-700">{property.area}</span>
                          <p className="text-xs text-slate-500">sqm</p>
                        </div>
                      </div>

                      {/* Stats - Compact */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-200 mt-auto mb-2">
                        <span className="text-xs font-semibold text-orange-600">
                          👁 {property.views} • 💬 {property.enquiries}
                        </span>
                      </div>
                    </div>

                    {/* CTA Button - Compact */}
                    <div className="px-3 pb-3">
                      <Link
                        to="/auth/signup"
                        className="w-full inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 rounded-lg font-bold hover:from-orange-600 hover:to-orange-700 transition-all group/btn text-sm shadow-md hover:shadow-lg"
                      >
                        Inquire
                        <ArrowRight size={14} className="ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* No Results Message */}
          {filteredProperties.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-slate-600 text-lg mb-4">No properties found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedType('all');
                  setSelectedLocation('all');
                }}
                className="px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
              >
                Reset Filters
              </button>
            </motion.div>
          )}

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12 pt-12 border-t border-slate-200"
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Want to List Your Properties?</h3>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              Join thousands of landlords and property managers who are filling vacancies faster on StaySpot
            </p>
            <Link
              to="/auth/signup"
              className="group inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-orange-600 text-white px-10 py-4 rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 transition-all hover:scale-105 shadow-lg"
            >
              <Home size={20} className="mr-2" />
              Post Your Property Now
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Core Capabilities Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Powerful Core Capabilities</h2>
            <p className="text-xl text-slate-600">Everything you need to succeed</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreCapabilities.map((capability, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="p-8 bg-gradient-to-br from-white to-slate-50 rounded-xl border border-slate-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="text-orange-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {capability.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{capability.title}</h3>
                <p className="text-slate-600">{capability.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 bg-slate-200 text-slate-700 rounded-full text-sm font-semibold mb-4">
              FEATURES
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900">Everything You Need</h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-orange-400"
              >
                <div className="inline-flex p-4 bg-orange-100 rounded-xl text-orange-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features Section */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Advanced Capabilities</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">Powerful tools to take your property management to the next level</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advancedFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-white to-slate-50 p-6 rounded-xl border border-slate-200 hover:border-slate-400 transition-all duration-300 text-center group"
              >
                <div className="inline-flex p-3 bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-lg mb-4 group-hover:rotate-12 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 text-slate-900">{feature.title}</h3>
                <p className="text-slate-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Built for Everyone</h2>
            <p className="text-xl text-slate-600">Tailored solutions for every role in property management</p>
          </motion.div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg scale-105'
                    : 'bg-white text-slate-700 border border-slate-300 hover:border-orange-400 hover:shadow-md'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-8 md:p-12 shadow-xl border border-slate-200"
            >
              <div className="max-w-3xl mx-auto text-center">
                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-slate-900">
                  {tabContents[activeTab].title}
                </h3>
                <p className="text-lg text-slate-600 mb-8">
                  {tabContents[activeTab].description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tabContents[activeTab].features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg">
                      <Check className="text-emerald-600 flex-shrink-0" />
                      <span className="text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Why Choose StaySpot?</h2>
            <p className="text-xl text-slate-600">Experience the difference with our platform</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-6 p-6 rounded-2xl hover:bg-gradient-to-r hover:from-white hover:to-slate-50 transition-all duration-300 group"
              >
                <div className="flex-shrink-0">
                  <div className="p-3 bg-gradient-to-br from-slate-50 to-white rounded-xl group-hover:scale-110 transition-transform duration-300">
                    {benefit.icon}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-slate-900">{benefit.title}</h3>
                  <p className="text-slate-600">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-br from-slate-100 to-slate-200 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Trusted by Thousands</h2>
            <p className="text-xl text-slate-600">Join our growing community of satisfied users</p>
          </motion.div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-8 rounded-2xl shadow-lg text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-800 mb-2">
                  {stat.value}
                </div>
                <p className="text-slate-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-slate-600">Join thousands of satisfied users worldwide</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-orange-400 text-orange-400 group-hover:scale-110 transition-transform" />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 italic leading-relaxed">{testimonial.quote}</p>
                <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex-shrink-0"></div>
                  <div>
                    <p className="font-bold text-slate-900">{testimonial.author}</p>
                    <p className="text-sm text-slate-600">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="py-12 px-4 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustBadges.map((badge, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-4"
              >
                <div className="text-4xl mb-2">{badge.icon}</div>
                <p className="font-bold text-slate-900 text-sm">{badge.text}</p>
                <p className="text-xs text-slate-500">{badge.subtext}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Benefits Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-slate-50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Proven ROI Benefits</h2>
            <p className="text-xl text-slate-600">Real results from property managers like you</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {roiBenefits.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-8 bg-white rounded-xl border border-slate-200 shadow-md hover:shadow-lg transition-all"
              >
                <div className="text-4xl font-bold text-orange-500 mb-2">{item.metric}</div>
                <div className="font-bold text-slate-900 mb-1">{item.benefit}</div>
                <p className="text-sm text-slate-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Customer Success Stories</h2>
            <p className="text-xl text-slate-600">See how businesses like yours are thriving</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {caseStudies.map((study, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl border border-slate-200 shadow-md hover:shadow-xl transition-all"
              >
                <div className="text-5xl mb-4">{study.image}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{study.company}</h3>
                <div className="text-2xl font-bold text-orange-500 mb-3">{study.metric}</div>
                <p className="text-slate-600">{study.story}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Getting Started Path */}
      <section className="py-20 px-4 bg-gradient-to-b from-orange-50 to-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Get Started in 3 Simple Steps</h2>
            <p className="text-xl text-slate-600">Join thousands of property managers already saving time and money</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              {
                step: '1',
                title: 'Sign Up Free',
                description: 'Create your account in under 5 minutes. No credit card required.',
                icon: '📝',
                cta: 'Create Account',
                link: '/auth/signup'
              },
              {
                step: '2',
                title: 'Add Your Properties',
                description: 'Import your existing properties or create new listings in minutes.',
                icon: '🏠',
                cta: 'Learn How',
                link: '/pricing'
              },
              {
                step: '3',
                title: 'Start Managing',
                description: 'Enjoy 14 days free. Then choose the perfect plan for your needs.',
                icon: '⚡',
                cta: 'View Plans',
                link: '/pricing'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-white p-8 rounded-xl border-2 border-orange-200 shadow-lg hover:shadow-xl transition-all h-full">
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <div className="inline-block px-4 py-2 bg-orange-100 text-orange-700 font-bold rounded-full mb-4">
                    Step {item.step}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-600 mb-6">{item.description}</p>
                  <Link
                    to={item.link}
                    className="inline-flex items-center justify-center bg-orange-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-orange-600 transition"
                  >
                    {item.cta}
                    <ChevronRight size={18} className="ml-2" />
                  </Link>
                </div>
                
                {/* Arrow to next step */}
                {index < 2 && (
                  <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
                    <div className="text-4xl text-orange-400">→</div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Pricing Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-xl border border-slate-200 shadow-lg"
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">Our Flexible Plans</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: 'Starter', price: 'KSH 450', features: ['5 properties', 'Basic management', 'Email support', 'Mobile app'] },
                { name: 'Professional', price: 'KSH 1,670', features: ['50 properties', 'Advanced features', 'Priority support', 'Analytics'], highlighted: true },
                { name: 'Enterprise', price: 'Custom', features: ['Unlimited properties', '24/7 support', 'API access', 'Dedicated manager'] }
              ].map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    plan.highlighted
                      ? 'border-orange-500 bg-orange-50 shadow-lg'
                      : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <h4 className="font-bold text-lg text-slate-900 mb-2">{plan.name}</h4>
                  <div className="text-3xl font-bold text-orange-600 mb-4">{plan.price}/mo</div>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="text-slate-600 text-sm flex items-center gap-2">
                        <Check size={16} className="text-green-500" /> {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/auth/signup"
                    className={`block text-center py-2 rounded-lg font-bold transition ${
                      plan.highlighted
                        ? 'bg-orange-500 text-white hover:bg-orange-600'
                        : 'border-2 border-slate-300 text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {plan.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-8">
              <p className="text-slate-600 mb-4">✓ 14-day free trial • ✓ No credit card required • ✓ 30-day money-back guarantee</p>
              <Link
                to="/pricing"
                className="inline-flex items-center text-orange-600 font-bold hover:text-orange-700"
              >
                View Detailed Pricing & Features
                <ChevronRight size={18} className="ml-2" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How to Get Started / Buying Journey Section */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Get Started in 4 Simple Steps</h2>
            <p className="text-xl text-slate-600">From sign-up to managing your first property in minutes</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {[
              {
                step: '1',
                title: 'Sign Up',
                description: 'Create your account in 2 minutes. No credit card required for the 14-day free trial.',
                cta: 'Get Started Free',
                icon: '👤'
              },
              {
                step: '2',
                title: 'Choose Your Plan',
                description: 'Select from Starter, Professional, or Enterprise based on your needs.',
                cta: 'View Plans',
                icon: '📋'
              },
              {
                step: '3',
                title: 'Add Your Properties',
                description: 'Import or add your properties to the system with just a few clicks.',
                cta: 'View Demo',
                icon: '🏠'
              },
              {
                step: '4',
                title: 'Start Managing',
                description: 'Automate rent collection, maintenance, and tenant communication instantly.',
                cta: 'Start Trial',
                icon: '✨'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Connecting Line */}
                {index < 3 && (
                  <div className="hidden md:block absolute top-16 -right-3 w-6 h-1 bg-gradient-to-r from-orange-500 to-transparent"></div>
                )}

                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-slate-200 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-5xl">{item.icon}</div>
                    <div className="w-10 h-10 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-lg">{item.step}</div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-600 mb-6 flex-grow">{item.description}</p>
                  <Link
                    to={index === 0 ? '/auth/signup' : index === 1 ? '/pricing' : '#'}
                    className="text-orange-600 font-bold hover:text-orange-700 flex items-center group"
                  >
                    {item.cta}
                    <ChevronRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Why Choose StaySpot Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-orange-50 to-blue-50 rounded-3xl p-12 border-2 border-orange-200"
          >
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-3xl font-bold text-slate-900 mb-6">Why Thousands Choose StaySpot</h3>
                <div className="space-y-4">
                  {[
                    { icon: '✅', text: '30-Day Money-Back Guarantee - Risk-free trial period' },
                    { icon: '🔒', text: '256-bit SSL Encryption - Bank-level security' },
                    { icon: '⚡', text: '5-Minute Setup - Start managing immediately' },
                    { icon: '💰', text: 'From KSH 450/month - Affordable for all sizes' },
                    { icon: '🎯', text: 'No Contract Required - Cancel anytime' },
                    { icon: '🌍', text: 'Multi-currency Support - Work globally' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="text-2xl flex-shrink-0">{item.icon}</span>
                      <p className="text-slate-700 font-medium">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-8 shadow-xl border border-slate-200"
              >
                <div className="mb-6">
                  <h4 className="text-2xl font-bold text-slate-900 mb-2">Limited Time Offer</h4>
                  <p className="text-slate-600">Get 50% off your first month when you sign up this week</p>
                </div>

                <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl p-6 mb-6">
                  <p className="text-sm text-slate-600 mb-2">First Month Special</p>
                  <div className="text-4xl font-bold text-orange-600 mb-1">KSH 225 <span className="text-lg text-slate-500 line-through">450</span></div>
                  <p className="text-sm text-slate-600">Starter Plan • Then KSH 450/month</p>
                </div>

                <Link
                  to="/auth/signup"
                  className="block w-full bg-orange-500 text-white py-4 rounded-xl font-bold hover:bg-orange-600 transition-all text-center mb-3 hover:scale-105 shadow-lg"
                >
                  Claim 50% Discount - Start Free Trial
                </Link>

                <p className="text-xs text-slate-500 text-center">✓ No credit card • ✓ Cancel anytime • ✓ 30-day guarantee</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-white text-slate-900 px-4 relative overflow-hidden">

        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <motion.h2 
            className="text-4xl md:text-6xl font-bold mb-6 text-slate-900"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Ready to Transform Your <span className="text-orange-600">Property Management?</span>
          </motion.h2>
          
          <motion.p 
            className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Join over 100,000 property managers and landlords who are already simplifying their operations with StaySpot.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link 
              to="/auth/signup" 
              className="group inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-orange-600 text-white px-10 py-5 rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg"
            >
              <Play className="mr-2 w-5 h-5" />
              Start Free Trial (14 Days)
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button 
              className="group inline-flex items-center justify-center border-2 border-orange-500 text-orange-600 px-10 py-5 rounded-xl font-bold hover:bg-orange-50 text-lg transition-all duration-300 hover:scale-105"
            >
              <MessageSquare className="mr-2 w-5 h-5" />
              Book a Demo
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          <motion.p 
            className="text-sm text-slate-600 mt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            No credit card required • 24/7 support • Cancel anytime
          </motion.p>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;