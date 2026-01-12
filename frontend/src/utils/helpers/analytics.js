/**
 * Analytics utilities for tracking user interactions
 */

class Analytics {
  constructor() {
    this.isEnabled = process.env.VITE_ENABLE_ANALYTICS === 'true';
    this.userId = null;
    this.sessionId = this.generateSessionId();
  }

  init(userId = null) {
    this.userId = userId;
    
    if (this.isEnabled && typeof gtag !== 'undefined') {
      gtag('config', process.env.VITE_GA_MEASUREMENT_ID, {
        user_id: userId,
        session_id: this.sessionId
      });
    }
  }

  track(event, properties = {}) {
    if (!this.isEnabled) return;

    const eventData = {
      event_category: properties.category || 'general',
      event_label: properties.label,
      value: properties.value,
      user_id: this.userId,
      session_id: this.sessionId,
      timestamp: new Date().toISOString(),
      ...properties
    };

    // Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', event, eventData);
    }

    // Custom analytics endpoint
    this.sendToCustomAnalytics(event, eventData);

    // Console log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', event, eventData);
    }
  }

  page(pageName, properties = {}) {
    if (!this.isEnabled) return;

    const pageData = {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname,
      user_id: this.userId,
      session_id: this.sessionId,
      ...properties
    };

    if (typeof gtag !== 'undefined') {
      gtag('config', process.env.VITE_GA_MEASUREMENT_ID, pageData);
    }

    this.sendToCustomAnalytics('page_view', pageData);
  }

  identify(userId, traits = {}) {
    this.userId = userId;
    
    if (!this.isEnabled) return;

    const userData = {
      user_id: userId,
      session_id: this.sessionId,
      ...traits
    };

    if (typeof gtag !== 'undefined') {
      gtag('config', process.env.VITE_GA_MEASUREMENT_ID, {
        user_id: userId
      });
    }

    this.sendToCustomAnalytics('identify', userData);
  }

  // Property management specific events
  trackPropertyView(propertyId, propertyData = {}) {
    this.track('property_viewed', {
      category: 'property',
      property_id: propertyId,
      ...propertyData
    });
  }

  trackPropertySearch(searchTerm, filters = {}) {
    this.track('property_searched', {
      category: 'search',
      search_term: searchTerm,
      filters: JSON.stringify(filters)
    });
  }

  trackApplicationSubmit(propertyId, applicationData = {}) {
    this.track('application_submitted', {
      category: 'application',
      property_id: propertyId,
      ...applicationData
    });
  }

  trackPaymentMade(amount, paymentMethod = '') {
    this.track('payment_made', {
      category: 'payment',
      value: amount,
      payment_method: paymentMethod
    });
  }

  trackMaintenanceRequest(propertyId, category = '') {
    this.track('maintenance_requested', {
      category: 'maintenance',
      property_id: propertyId,
      maintenance_category: category
    });
  }

  trackUserRegistration(method = 'email') {
    this.track('user_registered', {
      category: 'auth',
      registration_method: method
    });
  }

  trackUserLogin(method = 'email') {
    this.track('user_logged_in', {
      category: 'auth',
      login_method: method
    });
  }

  // Error tracking
  trackError(error, context = {}) {
    this.track('error_occurred', {
      category: 'error',
      error_message: error.message,
      error_stack: error.stack,
      ...context
    });
  }

  // Performance tracking
  trackPerformance(metric, value, context = {}) {
    this.track('performance_metric', {
      category: 'performance',
      metric_name: metric,
      value: value,
      ...context
    });
  }

  async sendToCustomAnalytics(event, data) {
    try {
      // Send to custom analytics endpoint if configured
      if (process.env.VITE_ANALYTICS_ENDPOINT) {
        await fetch(process.env.VITE_ANALYTICS_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            event,
            data,
            timestamp: new Date().toISOString()
          })
        });
      }
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Utility methods
  getSessionId() {
    return this.sessionId;
  }

  getUserId() {
    return this.userId;
  }

  isAnalyticsEnabled() {
    return this.isEnabled;
  }
}

// Create singleton instance
const analytics = new Analytics();

export default analytics;