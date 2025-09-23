import { useEffect } from 'react';

const PerformanceMonitor = () => {
  useEffect(() => {
    // Core Web Vitals monitoring
    const reportWebVital = (metric) => {
      // Send to analytics
      if (window.gtag) {
        window.gtag('event', metric.name, {
          event_category: 'Web Vitals',
          event_label: metric.id,
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          non_interaction: true
        });
      }
      
      // Log for debugging (only in development)
      if (process.env.NODE_ENV === 'development') {
        console.log('Web Vital:', metric);
      }
    };

    // Lazy load web-vitals library
    const loadWebVitals = async () => {
      try {
        const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import('web-vitals');
        
        // Measure all Core Web Vitals
        getCLS(reportWebVital);
        getFID(reportWebVital);
        getFCP(reportWebVital);
        getLCP(reportWebVital);
        getTTFB(reportWebVital);
      } catch (error) {
        console.warn('Web Vitals library not available:', error);
      }
    };

    // Page load performance
    const measurePageLoad = () => {
      if ('performance' in window && 'measure' in window.performance) {
        window.addEventListener('load', () => {
          setTimeout(() => {
            const navigation = performance.getEntriesByType('navigation')[0];
            if (navigation) {
              const loadTime = navigation.loadEventEnd - navigation.fetchStart;
              const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
              
              // Report to analytics
              if (window.gtag) {
                window.gtag('event', 'page_load_time', {
                  event_category: 'Performance',
                  value: Math.round(loadTime),
                  metric_name: 'load_time'
                });
                
                window.gtag('event', 'dom_content_loaded', {
                  event_category: 'Performance',
                  value: Math.round(domContentLoaded),
                  metric_name: 'dom_ready'
                });
              }
              
              // Log performance metrics
              if (process.env.NODE_ENV === 'development') {
                console.log('Performance Metrics:', {
                  loadTime: `${Math.round(loadTime)}ms`,
                  domContentLoaded: `${Math.round(domContentLoaded)}ms`,
                  dns: `${Math.round(navigation.domainLookupEnd - navigation.domainLookupStart)}ms`,
                  tcp: `${Math.round(navigation.connectEnd - navigation.connectStart)}ms`,
                  request: `${Math.round(navigation.responseEnd - navigation.requestStart)}ms`,
                  response: `${Math.round(navigation.responseEnd - navigation.responseStart)}ms`,
                  domProcessing: `${Math.round(navigation.domComplete - navigation.domLoading)}ms`
                });
              }
            }
          }, 0);
        });
      }
    };

    // Image performance monitoring
    const monitorImageLoading = () => {
      const images = document.querySelectorAll('img');
      images.forEach((img, index) => {
        if (!img.complete) {
          const startTime = performance.now();
          
          img.addEventListener('load', () => {
            const loadTime = performance.now() - startTime;
            
            if (window.gtag && loadTime > 2000) { // Report slow image loads
              window.gtag('event', 'slow_image_load', {
                event_category: 'Performance',
                event_label: img.src.split('/').pop(),
                value: Math.round(loadTime)
              });
            }
          });
          
          img.addEventListener('error', () => {
            if (window.gtag) {
              window.gtag('event', 'image_load_error', {
                event_category: 'Performance',
                event_label: img.src.split('/').pop()
              });
            }
          });
        }
      });
    };

    // Resource timing
    const monitorResourceTiming = () => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            // Monitor slow resources
            if (entry.duration > 3000) { // 3 seconds threshold
              if (window.gtag) {
                window.gtag('event', 'slow_resource', {
                  event_category: 'Performance',
                  event_label: entry.name.split('/').pop(),
                  value: Math.round(entry.duration)
                });
              }
            }
            
            // Monitor failed resources
            if (entry.transferSize === 0 && entry.decodedBodySize === 0) {
              if (window.gtag) {
                window.gtag('event', 'resource_error', {
                  event_category: 'Performance',
                  event_label: entry.name.split('/').pop()
                });
              }
            }
          });
        });
        
        observer.observe({ entryTypes: ['resource'] });
      }
    };

    // Memory usage (Chrome only)
    const monitorMemoryUsage = () => {
      if ('memory' in performance) {
        const reportMemory = () => {
          const memory = performance.memory;
          
          if (window.gtag) {
            window.gtag('event', 'memory_usage', {
              event_category: 'Performance',
              value: Math.round(memory.usedJSHeapSize / 1048576), // Convert to MB
              custom_parameter_1: Math.round(memory.totalJSHeapSize / 1048576),
              custom_parameter_2: Math.round(memory.jsHeapSizeLimit / 1048576)
            });
          }
        };
        
        // Report memory usage every 30 seconds
        setInterval(reportMemory, 30000);
      }
    };

    // User engagement metrics
    const trackEngagement = () => {
      let startTime = Date.now();
      let isVisible = !document.hidden;
      let engagedTime = 0;
      
      const updateEngagement = () => {
        if (isVisible) {
          engagedTime += Date.now() - startTime;
        }
        startTime = Date.now();
      };
      
      document.addEventListener('visibilitychange', () => {
        updateEngagement();
        isVisible = !document.hidden;
      });
      
      window.addEventListener('beforeunload', () => {
        updateEngagement();
        
        if (window.gtag && engagedTime > 1000) {
          window.gtag('event', 'engaged_time', {
            event_category: 'Engagement',
            value: Math.round(engagedTime / 1000), // Convert to seconds
            non_interaction: true
          });
        }
      });
    };

    // Initialize all monitoring
    loadWebVitals();
    measurePageLoad();
    monitorImageLoading();
    monitorResourceTiming();
    monitorMemoryUsage();
    trackEngagement();

    // Cleanup
    return () => {
      // Performance observers are automatically cleaned up
    };
  }, []);

  return null;
};

export default PerformanceMonitor;
