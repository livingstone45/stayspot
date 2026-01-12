import React, { useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { HomeIcon, BuildingOfficeIcon, ShieldCheckIcon, CheckCircleIcon, ArrowRightIcon, LockClosedIcon, UserCircleIcon, EnvelopeIcon, KeyIcon } from '@heroicons/react/24/outline';

const AuthLayout = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If user is already authenticated, redirect to appropriate dashboard
    if (isAuthenticated) {
      const userRole = localStorage.getItem('userRole');
      switch (userRole) {
        case 'system_admin':
          navigate('/system-admin/dashboard');
          break;
        case 'company_admin':
          navigate('/company/dashboard');
          break;
        case 'property_manager':
        case 'portfolio_manager':
          navigate('/management/dashboard');
          break;
        case 'landlord':
          navigate('/landlord/dashboard');
          break;
        case 'tenant':
          navigate('/tenant/dashboard');
          break;
        default:
          navigate('/');
      }
    }
  }, [isAuthenticated, navigate]);

  const features = [
    {
      name: 'Multi-Portal Access',
      description: 'Different dashboards for admins, companies, managers, landlords, and tenants',
      icon: BuildingOfficeIcon,
    },
    {
      name: 'Secure Authentication',
      description: 'Enterprise-grade security with role-based access control',
      icon: LockClosedIcon,
    },
    {
      name: 'Real-time Updates',
      description: 'Property updates instantly reflected across all portals',
      icon: ArrowRightIcon,
    },
    {
      name: 'Professional Management',
      description: 'Tools for team collaboration and task assignment',
      icon: UserCircleIcon,
    },
  ];

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/login')) return 'Sign in to your account';
    if (path.includes('/register')) return 'Create your account';
    if (path.includes('/forgot-password')) return 'Reset your password';
    if (path.includes('/reset-password')) return 'Set new password';
    if (path.includes('/verify-email')) return 'Verify your email';
    return 'Authentication';
  };

  const getPageDescription = () => {
    const path = location.pathname;
    if (path.includes('/login')) return 'Enter your credentials to access your dashboard';
    if (path.includes('/register')) return 'Join StaySpot to manage your properties efficiently';
    if (path.includes('/forgot-password')) return 'We\'ll send you instructions to reset your password';
    if (path.includes('/reset-password')) return 'Choose a strong password for your account';
    if (path.includes('/verify-email')) return 'Check your email for the verification link';
    return 'Secure authentication portal';
  };

  const getFormIcon = () => {
    const path = location.pathname;
    if (path.includes('/login')) return LockClosedIcon;
    if (path.includes('/register')) return UserCircleIcon;
    if (path.includes('/forgot-password')) return EnvelopeIcon;
    if (path.includes('/reset-password')) return KeyIcon;
    return LockClosedIcon;
  };

  const FormIcon = getFormIcon();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="flex min-h-screen">
        {/* Left side - Form */}
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div className="flex items-center mb-8">
              <Link to="/" className="flex items-center">
                <HomeIcon className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-2xl font-bold text-gray-900">StaySpot</span>
              </Link>
            </div>

            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                  <FormIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {getPageTitle()}
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    {getPageDescription()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white py-8 px-4 shadow-sm border border-gray-200 rounded-xl sm:px-10">
              <Outlet />
            </div>

            {/* Auth links */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-gray-50 px-2 text-gray-500">Quick links</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {!location.pathname.includes('/login') && (
                  <Link
                    to="/login"
                    className="flex w-full items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
                  >
                    Sign in
                  </Link>
                )}
                {!location.pathname.includes('/register') && (
                  <Link
                    to="/register"
                    className="flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    Create account
                  </Link>
                )}
              </div>

              {location.pathname.includes('/login') && (
                <div className="mt-6 text-center">
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    Forgot your password?
                  </Link>
                </div>
              )}
            </div>

            {/* Footer links */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex justify-center space-x-6 text-sm">
                <Link to="/privacy" className="text-gray-500 hover:text-gray-900">
                  Privacy
                </Link>
                <Link to="/terms" className="text-gray-500 hover:text-gray-900">
                  Terms
                </Link>
                <Link to="/contact" className="text-gray-500 hover:text-gray-900">
                  Contact
                </Link>
              </div>
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  &copy; {new Date().getFullYear()} StaySpot. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Features/Info */}
        <div className="relative hidden w-0 flex-1 lg:block">
          <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-blue-600 to-blue-800" />
          <div className="relative h-full px-12 py-24 flex flex-col justify-between">
            <div>
              <div className="flex items-center mb-8">
                <HomeIcon className="h-12 w-12 text-white" />
                <span className="ml-3 text-3xl font-bold text-white">StaySpot</span>
              </div>
              
              <div className="mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">
                  Professional Property Management Platform
                </h2>
                <p className="text-xl text-blue-100">
                  Everything you need to manage rentals, teams, and properties in one place
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8">
                {features.map((feature) => (
                  <div key={feature.name} className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-lg bg-blue-500 bg-opacity-20 flex items-center justify-center">
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-white">
                        {feature.name}
                      </h3>
                      <p className="mt-1 text-blue-100">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials or stats */}
            <div className="mt-12">
              <div className="grid grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">500+</div>
                  <div className="text-sm text-blue-200">Properties Managed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">99.9%</div>
                  <div className="text-sm text-blue-200">System Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">24/7</div>
                  <div className="text-sm text-blue-200">Support Available</div>
                </div>
              </div>
            </div>

            {/* Portal access info */}
            <div className="mt-12 bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Multiple Portal Access</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-blue-100">System Admin Portal</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-blue-100">Company/Commercial Dashboard</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-blue-100">Management Properties Dashboard</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-blue-100">Landlord/Owner Dashboard</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-blue-100">Tenant Portal</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile features panel */}
        <div className="lg:hidden bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
          <div className="max-w-md mx-auto">
            <div className="flex items-center mb-6">
              <HomeIcon className="h-8 w-8 text-white" />
              <span className="ml-2 text-2xl font-bold text-white">StaySpot</span>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-4">
              Professional Property Management
            </h3>
            
            <div className="space-y-4">
              {features.slice(0, 2).map((feature) => (
                <div key={feature.name} className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-lg bg-blue-500 bg-opacity-20 flex items-center justify-center">
                      <feature.icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-semibold text-white">
                      {feature.name}
                    </h4>
                    <p className="text-xs text-blue-100">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-blue-500">
              <div className="flex justify-between">
                <div className="text-center">
                  <div className="text-xl font-bold text-white">500+</div>
                  <div className="text-xs text-blue-200">Properties</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white">99.9%</div>
                  <div className="text-xs text-blue-200">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white">24/7</div>
                  <div className="text-xs text-blue-200">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;