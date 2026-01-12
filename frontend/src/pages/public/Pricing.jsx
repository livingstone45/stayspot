import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Zap, Shield, Users, BarChart3, Headphones, Rocket } from 'lucide-react';
import Footer from '../../components/common/Footer';

const PricingPage = () => {
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      name: 'Starter',
      monthlyPrice: 450,
      yearlyPrice: 4500,
      monthlyPriceUSD: 4,
      description: 'Perfect for individuals managing a few properties',
      icon: <Zap size={32} />,
      features: [
        { text: 'Up to 5 properties', included: true },
        { text: 'Basic tenant management', included: true },
        { text: 'Payment processing', included: true },
        { text: 'Email support', included: true },
        { text: 'Mobile app access', included: true },
        { text: 'Basic reports', included: true },
        { text: 'Advanced analytics', included: false },
        { text: 'API access', included: false },
        { text: 'Priority support', included: false }
      ],
      cta: 'Get Started',
      highlighted: false
    },
    {
      name: 'Professional',
      monthlyPrice: 1670,
      yearlyPrice: 16700,
      monthlyPriceUSD: 17,
      description: 'Ideal for growing property management businesses',
      icon: <Rocket size={32} />,
      features: [
        { text: 'Up to 50 properties', included: true },
        { text: 'Advanced tenant management', included: true },
        { text: 'Automated rent collection', included: true },
        { text: 'Priority email & chat support', included: true },
        { text: 'Full mobile app access', included: true },
        { text: 'Advanced analytics & reports', included: true },
        { text: 'Custom workflows', included: true },
        { text: 'Maintenance tracking', included: true },
        { text: 'API access', included: false }
      ],
      cta: 'Start Free Trial',
      highlighted: true
    },
    {
      name: 'Enterprise',
      monthlyPrice: 4970,
      yearlyPrice: 49700,
      monthlyPriceUSD: 50,
      description: 'For large-scale operations and teams',
      icon: <Shield size={32} />,
      features: [
        { text: 'Unlimited properties', included: true },
        { text: 'Full team collaboration', included: true },
        { text: 'Priority 24/7 support', included: true },
        { text: 'API access', included: true },
        { text: 'Custom integrations', included: true },
        { text: 'Advanced security features', included: true },
        { text: 'Dedicated account manager', included: true },
        { text: 'Training & onboarding', included: true },
        { text: 'White-label solution', included: true }
      ],
      cta: 'Contact Sales',
      highlighted: false
    }
  ];

  const comparisonFeatures = [
    { name: 'Properties', category: 'Core' },
    { name: 'Tenant Management', category: 'Core' },
    { name: 'Payment Processing', category: 'Core' },
    { name: 'Mobile App', category: 'Access' },
    { name: 'Support', category: 'Support' },
    { name: 'API Access', category: 'Integration' },
    { name: 'Custom Integrations', category: 'Integration' },
    { name: 'Dedicated Manager', category: 'Support' }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-orange-900 text-white py-32 px-4">
        <div className="absolute top-20 right-0 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 left-0 w-80 h-80 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto text-center relative z-10"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Simple, Transparent <span className="text-orange-400">Pricing</span>
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8">Choose the perfect plan for your property management needs</p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white/10 rounded-full p-1 backdrop-blur-sm border border-white/20">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-8 py-3 rounded-full font-semibold transition ${
                billingPeriod === 'monthly'
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'text-white hover:text-slate-100'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-8 py-3 rounded-full font-semibold transition flex items-center gap-2 ${
                billingPeriod === 'yearly'
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'text-white hover:text-slate-100'
              }`}
            >
              Yearly Billing
              <span className="text-sm bg-emerald-500 px-2 py-1 rounded-full">Save 20%</span>
            </button>
          </div>
        </motion.div>
      </section>

      {/* Key Stats */}
      <section className="py-16 px-4 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { stat: '14', label: 'Day Free Trial' },
              { stat: 'KSH 450', label: 'Starting from/month' },
              { stat: '100%', label: 'Money-back guarantee' },
              { stat: '24/7', label: 'Expert Support' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <h3 className="text-3xl font-bold text-slate-900 mb-2">{item.stat}</h3>
                <p className="text-slate-600 font-semibold">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Trust Section */}
      <section className="py-16 px-4 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl font-bold text-slate-900 mb-4">Trusted & Secure</h3>
            <p className="text-lg text-slate-600">Your data is protected with enterprise-grade security</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🔒', title: '256-bit SSL', desc: 'Military-grade encryption' },
              { icon: '✅', title: '30-Day Guarantee', desc: 'Money-back guarantee' },
              { icon: '🛡️', title: 'GDPR Compliant', desc: 'Data protection certified' },
              { icon: '⭐', title: '4.9/5 Rating', desc: '2,500+ verified reviews' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg p-6 border border-slate-200 text-center"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 bg-gradient-to-r from-orange-50 to-blue-50 rounded-xl p-8 border-2 border-orange-200"
          >
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-bold text-slate-900 mb-4">Payment Methods</h4>
                <ul className="space-y-2 text-slate-700">
                  <li>✓ M-Pesa (instant)</li>
                  <li>✓ Airtel Money</li>
                  <li>✓ Bank Transfer</li>
                  <li>✓ Stripe (international)</li>
                </ul>
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900 mb-4">Why Our Users Trust Us</h4>
                <ul className="space-y-2 text-slate-700">
                  <li>✓ 99.8% uptime guarantee</li>
                  <li>✓ Daily automatic backups</li>
                  <li>✓ 24/7 Kenya-based support</li>
                  <li>✓ Zero hidden fees</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onHoverStart={() => setSelectedPlan(index)}
                onHoverEnd={() => setSelectedPlan(null)}
                className={`rounded-2xl transition-all duration-300 ${
                  plan.highlighted
                    ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-2xl ring-2 ring-orange-500'
                    : 'bg-white border-2 border-slate-200 text-slate-900 hover:border-orange-300'
                } p-8 ${selectedPlan === index ? 'scale-105' : 'md:scale-100'}`}
              >
                {plan.highlighted && (
                  <div className="mb-4 inline-block bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                    Most Popular
                  </div>
                )}

                <div className={`mb-6 p-3 inline-block rounded-lg ${
                  plan.highlighted ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-600'
                }`}>
                  {plan.icon}
                </div>

                <h3 className={`text-2xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-slate-900'}`}>
                  {plan.name}
                </h3>
                <p className={`mb-6 text-sm ${plan.highlighted ? 'text-slate-300' : 'text-slate-600'}`}>
                  {plan.description}
                </p>

                <div className="mb-8 pb-8 border-b border-slate-700/50">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className={`text-5xl font-bold ${plan.highlighted ? 'text-white' : 'text-slate-900'}`}>
                      KSH {(billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice).toLocaleString()}
                    </span>
                    <span className={plan.highlighted ? 'text-slate-300' : 'text-slate-600'}>
                      /{billingPeriod === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>
                  <p className="text-xs opacity-70">
                    ~ ${billingPeriod === 'monthly' ? plan.monthlyPriceUSD : Math.round(plan.monthlyPriceUSD * 12 / 12)}/month
                  </p>
                  {billingPeriod === 'yearly' && (
                    <p className={`text-sm mt-2 ${plan.highlighted ? 'text-emerald-300' : 'text-emerald-600'}`}>
                      ✓ 20% savings compared to monthly
                    </p>
                  )}
                </div>

                <button
                  className={`w-full font-bold py-3 rounded-lg mb-4 transition ${
                    plan.highlighted
                      ? 'bg-white text-orange-600 hover:bg-slate-100 shadow-lg'
                      : 'bg-orange-500 text-white hover:bg-orange-600'
                  }`}
                >
                  {plan.cta}
                </button>

                {/* Risk Reversal - Money-Back Guarantee */}
                <div className={`p-3 rounded-lg mb-6 text-sm text-center ${
                  plan.highlighted
                    ? 'bg-emerald-500/20 text-emerald-100'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  <p className="font-bold">✓ 30-Day Money-Back Guarantee</p>
                  <p className="text-xs opacity-90 mt-1">Not satisfied? Full refund, no questions asked</p>
                </div>

                <div className="space-y-4">
                  <p className={`text-sm font-bold mb-4 ${plan.highlighted ? 'text-slate-300' : 'text-slate-600'}`}>
                    What's included:
                  </p>
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check size={20} className={plan.highlighted ? 'text-emerald-400' : 'text-emerald-600'} />
                      ) : (
                        <X size={20} className={plan.highlighted ? 'text-slate-500' : 'text-slate-300'} />
                      )}
                      <span className={`text-sm ${
                        feature.included
                          ? plan.highlighted ? 'text-slate-200' : 'text-slate-700'
                          : plan.highlighted ? 'text-slate-400' : 'text-slate-400'
                      }`}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Success Metrics */}
      <section className="py-16 px-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { metric: '8.5K+', label: 'Active Users', desc: 'Growing daily' },
              { metric: '4.9/5', label: 'Average Rating', desc: '2,500+ reviews' },
              { metric: '99.8%', label: 'System Uptime', desc: 'Enterprise grade' },
              { metric: '5 min', label: 'Setup Time', desc: 'Fastest in market' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <h3 className="text-4xl font-bold text-orange-400 mb-2">{item.metric}</h3>
                <p className="font-semibold mb-1">{item.label}</p>
                <p className="text-sm text-slate-300">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Detailed Plan Comparison</h2>
            <p className="text-slate-600 text-lg">See what's included in each plan</p>
          </motion.div>

          <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
                    <th className="px-6 py-4 text-left font-bold">Features</th>
                    <th className="px-6 py-4 text-center font-bold">Starter</th>
                    <th className="px-6 py-4 text-center font-bold bg-orange-500">Professional</th>
                    <th className="px-6 py-4 text-center font-bold">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: 'Properties', starter: '5', pro: '50', enterprise: 'Unlimited' },
                    { feature: 'Tenant Management', starter: 'Basic', pro: 'Advanced', enterprise: 'Advanced' },
                    { feature: 'Payment Processing', starter: 'Yes', pro: 'Yes', enterprise: 'Yes' },
                    { feature: 'Mobile App', starter: 'Yes', pro: 'Yes', enterprise: 'Yes' },
                    { feature: 'Support', starter: 'Email', pro: '24/7 Chat', enterprise: 'Dedicated' },
                    { feature: 'API Access', starter: 'No', pro: 'No', enterprise: 'Yes' },
                    { feature: 'Custom Integrations', starter: 'No', pro: 'No', enterprise: 'Yes' },
                    { feature: 'Account Manager', starter: 'No', pro: 'No', enterprise: 'Yes' },
                    { feature: 'SLA Guarantee', starter: '99%', pro: '99.5%', enterprise: '99.9%' }
                  ].map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="px-6 py-4 font-semibold text-slate-900">{row.feature}</td>
                      <td className="px-6 py-4 text-center text-slate-600">{row.starter}</td>
                      <td className="px-6 py-4 text-center text-slate-600 bg-orange-50">{row.pro}</td>
                      <td className="px-6 py-4 text-center text-slate-600">{row.enterprise}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose StaySpot */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Why Choose StaySpot?</h2>
            <p className="text-slate-600 text-lg">Built for Kenya's property market</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <BarChart3 size={40} />,
                title: 'Powerful Analytics',
                description: 'Track income, expenses, and profitability with advanced reporting tools'
              },
              {
                icon: <Users size={40} />,
                title: 'Tenant Portal',
                description: 'Reduce support tickets with a self-service portal for tenants'
              },
              {
                icon: <Headphones size={40} />,
                title: 'Local Support',
                description: 'Get support in Swahili and English from our Kenya-based team'
              },
              {
                icon: <Shield size={40} />,
                title: 'Bank-level Security',
                description: 'Your data is protected with 256-bit encryption and regular backups'
              },
              {
                icon: <Zap size={40} />,
                title: 'Lightning Fast',
                description: 'Optimized for low bandwidth and offline functionality'
              },
              {
                icon: <Rocket size={40} />,
                title: 'Always Updated',
                description: 'New features added monthly without any additional cost'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 bg-gradient-to-br from-slate-50 to-orange-50 rounded-xl border border-slate-200 hover:border-orange-400 transition text-center"
              >
                <div className="text-orange-600 mb-4 flex justify-center">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing & Billing Questions Preview */}
      <section className="py-20 bg-slate-50 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Pricing & Billing Questions</h2>
            <p className="text-slate-600 text-lg">Common questions about our plans and pricing. For more Q&A's, visit our comprehensive FAQ page.</p>
          </motion.div>

          <div className="space-y-4 mb-12">
            {[
              { q: 'Can I change my plan anytime?', a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect at the next billing cycle. No penalties or hidden fees.' },
              { q: 'Do you offer a free trial?', a: 'Absolutely! All plans come with a 14-day free trial with full access to features. No credit card required to start.' },
              { q: 'What payment methods do you accept?', a: 'We accept M-Pesa, bank transfers, credit cards (Visa, Mastercard, Amex), and Airtel Money. We also offer monthly invoicing for Enterprise plans.' },
              { q: 'Is there a contract or setup fee?', a: 'No long-term contracts and no setup fees! You can cancel anytime with no cancellation charges. Your data will be available for export.' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg border-l-4 border-orange-500 hover:shadow-lg transition"
              >
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.q}</h3>
                <p className="text-slate-600">{item.a}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center bg-gradient-to-r from-orange-50 to-blue-50 p-8 rounded-lg border-2 border-dashed border-orange-300 mt-12"
          >
            <h3 className="text-xl font-bold text-slate-900 mb-2">Need more answers?</h3>
            <p className="text-slate-600 mb-6">Check out our comprehensive FAQ page with detailed answers to 40+ questions about support, billing, security, features, and more.</p>
            <a
              href="/faq?category=Support & Billing"
              className="inline-flex items-center justify-center bg-orange-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-600 transition hover:scale-105"
            >
              View Full FAQ - Support & Billing Section →
            </a>
          </motion.div>
        </div>
      </section>

      {/* Why Choose StaySpot - Trust & Security */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-50 to-orange-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Why Choose StaySpot?</h2>
            <p className="text-xl text-slate-600">Everything you need to succeed, backed by trust and security</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { icon: '🔒', title: 'Bank-Level Security', desc: '256-bit SSL encryption protects all transactions' },
              { icon: '✅', title: '30-Day Money Back', desc: 'Try risk-free. Full refund if not satisfied' },
              { icon: '⭐', title: '4.9/5 Rating', desc: 'Trusted by 2,500+ verified customers' },
              { icon: '🚀', title: 'Instant Setup', desc: 'Start managing in just 5 minutes' },
              { icon: '📱', title: 'Mobile App', desc: 'Manage on-the-go with iOS and Android apps' },
              { icon: '🌍', title: 'Multi-Currency', desc: 'Support for KSH, USD, and 50+ currencies' },
              { icon: '💬', title: '24/7 Support', desc: 'Local support team in English & Swahili' },
              { icon: '📊', title: 'Real-Time Analytics', desc: 'Make data-driven decisions instantly' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white p-6 rounded-lg border border-slate-200 text-center hover:shadow-lg transition-all"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h4 className="font-bold text-slate-900 mb-2">{item.title}</h4>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-l-4 border-emerald-500 p-6 rounded-lg text-center"
          >
            <p className="text-slate-900 font-semibold text-lg">✓ 30-Day Money-Back Guarantee: Not happy? Get 100% refund. No questions asked.</p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-white text-slate-900 py-24 px-4">
        <div className="absolute top-10 right-0 w-80 h-80 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to simplify property management?</h2>
            <p className="text-xl mb-3 opacity-90">Start your free 14-day trial today.</p>
            <p className="text-sm mb-12 opacity-75">✓ No credit card required • ✓ Cancel anytime • ✓ 30-day money-back guarantee</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="/auth/signup" className="inline-flex items-center justify-center bg-orange-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-600 transition shadow-lg hover:scale-105">
                Start Free Trial (14 Days)
              </a>
              <a href="/contact" className="inline-flex items-center justify-center bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition hover:scale-105">
                Talk to Sales Team
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PricingPage;
