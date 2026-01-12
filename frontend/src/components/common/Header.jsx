import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Properties', path: '/properties' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'Blog', path: '/blog' },
    { label: 'Careers', path: '/careers' },
    { label: 'Press', path: '/press' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Help', path: '/help' },
    { label: 'Relocation', path: '/relocation' },
    { label: 'Contact', path: '/contact' }
  ];

  return (
    <header style={{ backgroundColor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px' }}>
        
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', minWidth: 'fit-content', flexShrink: 0 }}>
          <img src="/logostayspot.png" alt="StaySpot" style={{ height: '50px', width: 'auto', objectFit: 'contain' }} />
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flex: 1, justifyContent: 'center', marginLeft: '3rem' }}>
            {menuItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                style={{ 
                  color: isActive(item.path) ? '#ea580c' : '#666', 
                  textDecoration: 'none', 
                  fontWeight: isActive(item.path) ? '600' : '500',
                  fontSize: '13px',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.3s'
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}

        {/* Auth Buttons - Desktop */}
        {!isMobile && (
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', minWidth: 'fit-content', marginLeft: 'auto' }}>
            <Link to="/pricing" style={{ color: '#ea580c', textDecoration: 'none', fontWeight: '500', padding: '0.5rem 1rem', fontSize: '13px', border: '2px solid #ea580c', borderRadius: '6px', transition: 'all 0.3s', cursor: 'pointer' }}>View Pricing</Link>
            <Link to="/auth/login" style={{ color: '#ea580c', textDecoration: 'none', fontWeight: '500', padding: '0.5rem 1rem', fontSize: '13px', border: '2px solid #ea580c', borderRadius: '6px', transition: 'all 0.3s', cursor: 'pointer' }}>Sign In</Link>
            <Link to="/auth/register" style={{ backgroundColor: '#ea580c', color: 'white', textDecoration: 'none', fontWeight: '600', padding: '0.5rem 1.25rem', borderRadius: '6px', fontSize: '13px', border: 'none', cursor: 'pointer', transition: 'all 0.3s' }}>Sign up</Link>
          </div>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#ea580c', padding: '0.5rem' }}
          >
            ☰
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobile && mobileMenuOpen && (
        <div style={{ backgroundColor: '#f9fafb', borderTop: '1px solid #e5e7eb', padding: '1rem 2rem' }}>
          {menuItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              style={{ display: 'block', padding: '0.75rem 0', color: isActive(item.path) ? '#ea580c' : '#666', textDecoration: 'none', fontSize: '13px', fontWeight: isActive(item.path) ? '600' : '500' }} 
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div style={{ borderTop: '1px solid #e5e7eb', marginTop: '1rem', paddingTop: '1rem' }}>
            <Link to="/auth/login" style={{ display: 'block', padding: '0.75rem 0', color: '#666', textDecoration: 'none', fontSize: '13px' }} onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
            <Link to="/auth/register" style={{ display: 'block', padding: '0.75rem 0', color: '#ea580c', textDecoration: 'none', fontWeight: '600', fontSize: '13px' }} onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
