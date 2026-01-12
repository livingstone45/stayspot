/**
 * Performance monitoring and optimization utilities
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = new Map();
    this.isEnabled = process.env.NODE_ENV === 'development';
  }

  // Measure function execution time
  measureFunction(name, fn) {
    if (!this.isEnabled) return fn;
    
    return (...args) => {
      const start = performance.now();
      const result = fn(...args);
      const end = performance.now();
      
      this.recordMetric(name, end - start);
      
      if (result instanceof Promise) {
        return result.finally(() => {
          const asyncEnd = performance.now();
          this.recordMetric(`${name}_async`, asyncEnd - start);
        });
      }
      
      return result;
    };
  }

  // Measure component render time
  measureRender(componentName, renderFn) {
    if (!this.isEnabled) return renderFn;
    
    return (...args) => {
      const start = performance.now();
      const result = renderFn(...args);
      const end = performance.now();
      
      this.recordMetric(`render_${componentName}`, end - start);
      return result;
    };
  }

  // Record performance metric
  recordMetric(name, value) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    const values = this.metrics.get(name);
    values.push({
      value,
      timestamp: Date.now()
    });
    
    // Keep only last 100 measurements
    if (values.length > 100) {
      values.shift();
    }
    
    // Log slow operations
    if (value > 100) {
      console.warn(`Slow operation detected: ${name} took ${value.toFixed(2)}ms`);
    }
  }

  // Get metric statistics
  getMetricStats(name) {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) return null;
    
    const nums = values.map(v => v.value);
    const sum = nums.reduce((a, b) => a + b, 0);
    const avg = sum / nums.length;
    const min = Math.min(...nums);
    const max = Math.max(...nums);
    
    return { avg, min, max, count: nums.length };
  }

  // Monitor Core Web Vitals
  observeWebVitals() {
    if (!this.isEnabled || typeof window === 'undefined') return;
    
    // Largest Contentful Paint
    this.observeMetric('largest-contentful-paint', (entry) => {
      this.recordMetric('LCP', entry.startTime);
    });
    
    // First Input Delay
    this.observeMetric('first-input', (entry) => {
      this.recordMetric('FID', entry.processingStart - entry.startTime);
    });
    
    // Cumulative Layout Shift
    this.observeMetric('layout-shift', (entry) => {
      if (!entry.hadRecentInput) {
        this.recordMetric('CLS', entry.value);
      }
    });
  }

  observeMetric(type, callback) {
    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach(callback);
      });
      
      observer.observe({ type, buffered: true });
      this.observers.set(type, observer);
    } catch (error) {
      console.warn(`Failed to observe ${type}:`, error);
    }
  }

  // Memory usage monitoring
  getMemoryUsage() {
    if (typeof performance === 'undefined' || !performance.memory) {
      return null;
    }
    
    return {
      used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
      total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
      limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
    };
  }

  // Network information
  getNetworkInfo() {
    if (typeof navigator === 'undefined' || !navigator.connection) {
      return null;
    }
    
    const connection = navigator.connection;
    return {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData
    };
  }

  // Generate performance report
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      metrics: {},
      memory: this.getMemoryUsage(),
      network: this.getNetworkInfo()
    };
    
    for (const [name] of this.metrics) {
      report.metrics[name] = this.getMetricStats(name);
    }
    
    return report;
  }

  // Clear all metrics
  clear() {
    this.metrics.clear();
  }

  // Cleanup observers
  disconnect() {
    for (const observer of this.observers.values()) {
      observer.disconnect();
    }
    this.observers.clear();
  }
}

// Singleton instance
const performanceMonitor = new PerformanceMonitor();

// Utility functions
export const measureAsync = async (name, asyncFn) => {
  const start = performance.now();
  try {
    const result = await asyncFn();
    const end = performance.now();
    performanceMonitor.recordMetric(name, end - start);
    return result;
  } catch (error) {
    const end = performance.now();
    performanceMonitor.recordMetric(`${name}_error`, end - start);
    throw error;
  }
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const memoize = (fn, getKey = (...args) => JSON.stringify(args)) => {
  const cache = new Map();
  
  return (...args) => {
    const key = getKey(...args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    
    // Limit cache size
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    
    return result;
  };
};

export default performanceMonitor;