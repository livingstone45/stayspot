import React, { useState } from 'react';
import { MapPin, Home, Users, FileText, Shield, Zap, ArrowRight, CheckCircle } from 'lucide-react';
import Footer from '../../components/common/Footer';

const Relocation = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const features = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: 'Find Your Perfect Home',
      description: 'Browse thousands of properties in your desired location with detailed information and virtual tours.'
    },
    {
      icon: <Home className="w-8 h-8" />,
      title: 'Property Listings',
      description: 'Access comprehensive property details, amenities, and neighborhood information.'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Connect with Landlords',
      description: 'Direct communication with property owners and managers for seamless relocation.'
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: 'Digital Documentation',
      description: 'Manage all your lease agreements and documents in one secure place.'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Secure Transactions',
      description: 'Protected payments and verified landlords ensure safe and secure relocation.'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Quick Process',
      description: 'Complete your relocation process in days, not weeks.'
    }
  ];

  const steps = [
    {
      number: '1',
      title: 'Search Properties',
      description: 'Browse available properties in your target location with filters for price, size, and amenities.'
    },
    {
      number: '2',
      title: 'Connect with Landlords',
      description: 'Message property owners directly to ask questions and schedule viewings.'
    },
    {
      number: '3',
      title: 'Review & Sign Lease',
      description: 'Review lease terms and sign documents digitally through our secure platform.'
    },
    {
      number: '4',
      title: 'Move In',
      description: 'Complete payment, receive keys, and start your new chapter.'
    }
  ];

  const benefits = [
    'Access to verified properties',
    'Direct landlord communication',
    'Digital lease management',
    'Secure payment processing',
    '24/7 customer support',
    'Neighborhood insights'
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1 }}>
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-800 dark:to-gray-900">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Relocate with Confidence
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Find your perfect home and manage your relocation seamlessly with StaySpot's comprehensive platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition flex items-center justify-center gap-2">
                  Start Searching <ArrowRight className="w-5 h-5" />
                </button>
                <button className="px-8 py-3 border-2 border-orange-600 text-orange-600 dark:text-orange-400 rounded-lg font-semibold hover:bg-orange-50 dark:hover:bg-gray-800 transition">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">
              Why Choose StaySpot for Relocation?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="p-6 bg-white dark:bg-gray-800 rounded-xl hover:shadow-lg transition border-l-4 border-orange-600">
                  <div className="text-orange-600 dark:text-orange-400 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                      {step.number}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-center text-sm">
                      {step.description}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 -right-4 w-8 h-1 bg-orange-600"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
                  Everything You Need for a Smooth Relocation
                </h2>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                      <span className="text-lg text-gray-700 dark:text-gray-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-100 to-orange-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-8 h-96 flex items-center justify-center">
                <div className="text-center">
                  <Home className="w-24 h-24 text-orange-600 dark:text-orange-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300">Your new home awaits</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to Start Your Relocation Journey?
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
              Join thousands of people who have successfully relocated with StaySpot.
            </p>
            <button className="px-8 py-4 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition">
              Browse Properties Now
            </button>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Relocation;
