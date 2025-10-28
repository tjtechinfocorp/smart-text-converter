import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';
import { GoogleAnalyticsService } from './google-analytics.service';
import { PrivacyAnalyticsService } from './privacy-analytics.service';

// Core Web Vitals types
interface WebVitalMetric {
  name: string;
  value: number;
  delta: number;
  id: string;
  navigationType: string;
}

interface PerformanceEntry {
  name: string;
  entryType: string;
  startTime: number;
  duration: number;
}

// Performance Budget interfaces
export interface PerformanceBudget {
  lcp: number; // Largest Contentful Paint (ms)
  fid: number; // First Input Delay (ms)
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint (ms)
  ttfb: number; // Time to First Byte (ms)
  inp: number; // Interaction to Next Paint (ms)
}

interface ResourceTiming {
  name: string;
  duration: number;
  size: number;
  type: string;
  startTime: number;
}

interface PaintTiming {
  name: string;
  startTime: number;
  duration: number;
}

interface NetworkInfo {
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
}

interface PerformanceMetrics {
  resourceTimings: ResourceTiming[];
  paintTimings: PaintTiming[];
  networkInfo: NetworkInfo | null;
  navigationTiming: any;
  userTiming: any[];
}

@Injectable({
  providedIn: 'root',
})
export class PerformanceService {
  private isBrowser: boolean;
  private slowResourceThreshold = 1000; // 1 second
  private metrics: PerformanceMetrics = {
    resourceTimings: [],
    paintTimings: [],
    networkInfo: null,
    navigationTiming: null,
    userTiming: [],
  };

  private readonly BUDGETS: PerformanceBudget = {
    lcp: 2500, // 2.5 seconds
    fid: 100, // 100ms
    cls: 0.1, // 0.1
    fcp: 1800, // 1.8 seconds
    ttfb: 800, // 800ms
    inp: 200, // 200ms
  };

  private readonly WARNING_THRESHOLDS: PerformanceBudget = {
    lcp: 4000, // 4 seconds
    fid: 300, // 300ms
    cls: 0.25, // 0.25
    fcp: 3000, // 3 seconds
    ttfb: 1200, // 1.2 seconds
    inp: 500, // 500ms
  };

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private privacyAnalyticsService: PrivacyAnalyticsService,
    private googleAnalytics: GoogleAnalyticsService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /**
   * Initialize comprehensive performance monitoring
   */
  initialize(): void {
    if (!this.isBrowser) return;

    // Skip performance optimizations in development mode
    if (this.isDevelopmentMode()) {
      console.log('🔄 Development mode: Skipping performance optimizations');
      return;
    }

    // Wait for page load to collect comprehensive metrics
    if (document.readyState === 'complete') {
      this.collectMetrics();
    } else {
      window.addEventListener('load', () => {
        setTimeout(() => this.collectMetrics(), 100);
      });
    }

    // Initialize all monitoring
    this.initializeCoreWebVitals();
    this.monitorResourceTiming();
    this.monitorWebVitals();
    this.monitorNetworkConditions();
    this.monitorUserInteractions();
    this.optimizeSlowResources();
  }

  /**
   * Initialize Core Web Vitals monitoring
   */
  initializeCoreWebVitals(): void {
    if (!this.isBrowser) return;

    // Load web-vitals library dynamically to avoid blocking initial load
    this.loadWebVitalsLibrary().then(() => {
      this.setupCoreWebVitalsTracking();
    });

    // Track page load performance
    this.trackPageLoadPerformance();
  }

  /**
   * Dynamically load web-vitals library with performance optimization
   */
  private async loadWebVitalsLibrary(): Promise<void> {
    try {
      // Use dynamic import with performance optimization
      const webVitalsModule = await import('web-vitals');
      const { onCLS, onFCP, onLCP, onTTFB, onINP } = webVitalsModule;

      // Store functions globally for use
      (window as any).onCLS = onCLS;
      (window as any).onFCP = onFCP;
      (window as any).onLCP = onLCP;
      (window as any).onTTFB = onTTFB;
      (window as any).onINP = onINP; // Interaction to Next Paint (replaces FID)

      // Preload web-vitals for faster subsequent loads
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          // Preload web-vitals in idle time
          import('web-vitals');
        });
      }
    } catch (error) {
      if (!environment.production) {
        console.warn('Failed to load web-vitals library:', error);
      }
    }
  }

  /**
   * Setup Core Web Vitals tracking
   */
  private setupCoreWebVitalsTracking(): void {
    if (!this.isBrowser) return;

    const onCLS = (window as any).onCLS;
    const onFCP = (window as any).onFCP;
    const onLCP = (window as any).onLCP;
    const onTTFB = (window as any).onTTFB;
    const onINP = (window as any).onINP; // Interaction to Next Paint (replaces FID)

    if (!onCLS || !onFCP || !onLCP || !onTTFB) return;

    // Track Largest Contentful Paint (LCP)
    onLCP((metric: WebVitalMetric) => {
      this.reportWebVital('LCP', metric);
    });

    // Track Cumulative Layout Shift (CLS)
    onCLS((metric: WebVitalMetric) => {
      this.reportWebVital('CLS', metric);
    });

    // Track First Contentful Paint (FCP)
    onFCP((metric: WebVitalMetric) => {
      this.reportWebVital('FCP', metric);
    });

    // Track Time to First Byte (TTFB)
    onTTFB((metric: WebVitalMetric) => {
      this.reportWebVital('TTFB', metric);
    });

    // Track Interaction to Next Paint (INP) - Core Web Vitals metric (replaces FID)
    if (onINP) {
      onINP((metric: WebVitalMetric) => {
        this.reportWebVital('INP', metric);
      });
    }
  }

  /**
   * Report Web Vital metric to Google Analytics
   */
  private reportWebVital(name: string, metric: WebVitalMetric): void {
    if (!this.isBrowser) return;

    // Check performance budget
    const budgetCheck = this.checkBudget(name.toLowerCase() as any, metric.value);
    if (!budgetCheck.withinBudget) {
      // Skip TTFB warnings in development mode (dev server is always slower)
      if (name === 'TTFB' && this.isDevelopmentMode()) {
        return; // Development TTFB is expected to be higher
      }
      console.warn(`Performance budget exceeded for ${name}:`, budgetCheck.message);
    }

    // Send to privacy-compliant analytics
    this.privacyAnalyticsService.track('web_vital', {
      metric: name,
      value: metric.value,
      id: metric.id,
      delta: metric.delta,
      timestamp: Date.now(),
    });

    // Send to Google Analytics
    this.googleAnalytics.trackPerformance(name, metric.value, {
      metric_name: name,
      metric_value: metric.value,
      metric_delta: metric.delta,
      metric_id: metric.id,
    });

    // Performance metrics tracked for optimization

    // Store in localStorage for analysis
    this.storeWebVitalMetric(name, metric);
  }

  /**
   * Store Web Vital metric in localStorage
   */
  private storeWebVitalMetric(name: string, metric: WebVitalMetric): void {
    if (!this.isBrowser) return;

    try {
      const key = `web_vital_${name.toLowerCase()}`;
      const data = {
        value: metric.value,
        delta: metric.delta,
        id: metric.id,
        navigationType: metric.navigationType,
        timestamp: Date.now(),
        url: window.location.href,
      };

      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      if (!environment.production) {
        console.warn('Failed to store Web Vital metric:', error);
      }
    }
  }

  /**
   * Track page load performance
   */
  private trackPageLoadPerformance(): void {
    if (!this.isBrowser) return;

    window.addEventListener('load', () => {
      // Wait for all resources to load
      setTimeout(() => {
        this.measurePageLoadMetrics();
      }, 0);
    });
  }

  /**
   * Measure page load metrics
   */
  private measurePageLoadMetrics(): void {
    if (!this.isBrowser) return;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

    if (navigation) {
      const metrics = {
        // DNS lookup time
        dns: navigation.domainLookupEnd - navigation.domainLookupStart,
        // TCP connection time
        tcp: navigation.connectEnd - navigation.connectStart,
        // Request time
        request: navigation.responseStart - navigation.requestStart,
        // Response time
        response: navigation.responseEnd - navigation.responseStart,
        // DOM processing time
        domProcessing: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        // Total page load time
        loadTime: navigation.loadEventEnd - navigation.fetchStart,
      };

      // Send to privacy-compliant analytics
      this.privacyAnalyticsService.track('page_load_performance', {
        loadTime: metrics.loadTime,
        timestamp: Date.now(),
      });

      // Page load performance metrics tracked
    }
  }

  /**
   * Get vital status based on value
   */
  private getVitalStatus(name: string, value: number): string {
    switch (name) {
      case 'LCP':
        return value <= 2500 ? 'good' : value <= 4000 ? 'needs_improvement' : 'poor';
      case 'FID':
        return value <= 100 ? 'good' : value <= 300 ? 'needs_improvement' : 'poor';
      case 'CLS':
        return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs_improvement' : 'poor';
      case 'FCP':
        return value <= 1800 ? 'good' : value <= 3000 ? 'needs_improvement' : 'poor';
      case 'TTFB':
        return value <= 800 ? 'good' : value <= 1800 ? 'needs_improvement' : 'poor';
      case 'INP':
        return value <= 200 ? 'good' : value <= 500 ? 'needs_improvement' : 'poor';
      default:
        return 'unknown';
    }
  }

  /**
   * Get stored Web Vital metrics
   */
  getStoredWebVitals(): { [key: string]: any } {
    if (!this.isBrowser) return {};

    const vitals = ['lcp', 'fid', 'cls', 'fcp', 'ttfb', 'inp']; // Added INP
    const storedVitals: { [key: string]: any } = {};

    vitals.forEach(vital => {
      try {
        const data = localStorage.getItem(`web_vital_${vital}`);
        if (data) {
          storedVitals[vital] = JSON.parse(data);
        }
      } catch (error) {
        if (!environment.production) {
          console.warn(`Failed to retrieve ${vital} metric:`, error);
        }
      }
    });

    return storedVitals;
  }

  /**
   * Clear stored Web Vital metrics
   */
  clearStoredWebVitals(): void {
    if (!this.isBrowser) return;

    const vitals = ['lcp', 'fid', 'cls', 'fcp', 'ttfb'];
    vitals.forEach(vital => {
      localStorage.removeItem(`web_vital_${vital}`);
    });
  }

  /**
   * Check if Core Web Vitals are within good thresholds
   */
  checkCoreWebVitalsThresholds(): { [key: string]: { value: number; status: string } } {
    const storedVitals = this.getStoredWebVitals();
    const thresholds = {
      lcp: { good: 2500, poor: 4000 },
      fid: { good: 100, poor: 300 },
      cls: { good: 0.1, poor: 0.25 },
    };

    const results: { [key: string]: { value: number; status: string } } = {};

    Object.keys(thresholds).forEach(metric => {
      const data = storedVitals[metric];
      if (data) {
        const value = data.value;
        const threshold = thresholds[metric as keyof typeof thresholds];

        let status = 'good';
        if (value > threshold.poor) {
          status = 'poor';
        } else if (value > threshold.good) {
          status = 'needs_improvement';
        }

        results[metric] = { value, status };
      }
    });

    return results;
  }

  /**
   * Send page view to privacy-compliant analytics
   */
  sendPageView(): void {
    if (!this.isBrowser) return;

    this.privacyAnalyticsService.trackPageView(window.location.pathname, document.title);
  }

  /**
   * Monitor long tasks that can affect FID
   */
  monitorLongTasks(): void {
    if (!this.isBrowser || !('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            // Tasks longer than 50ms
            if (!environment.production) {
              console.warn(`Long task detected: ${entry.duration}ms`);
            }

            // Track long task in privacy-compliant analytics
            this.privacyAnalyticsService.track('long_task', {
              duration: entry.duration,
              startTime: entry.startTime,
              timestamp: Date.now(),
            });
          }
        }
      });

      observer.observe({ entryTypes: ['longtask'] });
    } catch (error) {
      if (!environment.production) {
        console.warn('Long task monitoring not supported:', error);
      }
    }
  }

  /**
   * Monitor memory usage
   */
  monitorMemoryUsage(): void {
    if (!this.isBrowser || !('memory' in performance)) return;

    const memory = (performance as any).memory;
    if (memory) {
      const memoryInfo = {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
        usage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
      };

      // Memory usage tracked for optimization

      // Alert if memory usage is high
      if (memoryInfo.usage > 80) {
        if (!environment.production) {
          console.warn('High memory usage detected:', memoryInfo.usage + '%');
        }

        // Track high memory usage in privacy-compliant analytics
        this.privacyAnalyticsService.track('high_memory_usage', {
          used: memoryInfo.used,
          total: memoryInfo.total,
          limit: memoryInfo.limit,
          usage: memoryInfo.usage,
          timestamp: Date.now(),
        });
      }
    }
  }

  /**
   * Get budget summary
   */
  private getBudgetSummary(): any {
    const webVitals = this.getStoredWebVitals();
    const metrics: any = {};

    Object.keys(webVitals).forEach(key => {
      if (webVitals[key] && webVitals[key].value !== undefined) {
        metrics[key.toLowerCase()] = webVitals[key].value;
      }
    });

    return this.calculateScore(metrics);
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary(): {
    webVitals: any;
    budgets: any;
    memory?: any;
  } {
    const summary: any = {
      webVitals: this.getStoredWebVitals(),
      budgets: this.getBudgetSummary(),
    };

    // Add memory info if available
    if (this.isBrowser && 'memory' in performance) {
      const memory = (performance as any).memory;
      summary.memory = {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
        usage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
      };
    }

    return summary;
  }

  // ===== PERFORMANCE BUDGET SERVICE METHODS =====

  /**
   * Check if running in development mode
   */
  private isDevelopmentMode(): boolean {
    return (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.port === '4200'
    );
  }

  /**
   * Monitor resource loading times
   */
  private monitorResourceTiming(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver(list => {
        list.getEntries().forEach(entry => {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming;
            const loadTime = resourceEntry.responseEnd - resourceEntry.startTime;

            if (loadTime > this.slowResourceThreshold) {
              this.reportSlowResource(resourceEntry, loadTime);
            }
          }
        });
      });

      observer.observe({ entryTypes: ['resource'] });
    }
  }

  /**
   * Monitor Core Web Vitals
   */
  private monitorWebVitals(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver(list => {
        list.getEntries().forEach(entry => {
          if (entry.entryType === 'paint') {
            const paintEntry = entry as PerformancePaintTiming;

            if (paintEntry.name === 'first-contentful-paint') {
              const fcp = paintEntry.startTime;
              const budgetCheck = this.checkBudget('fcp', fcp);

              if (!budgetCheck.withinBudget) {
                console.warn(
                  `Performance budget exceeded for FCP: ${fcp.toFixed(0)}ms (budget: ${
                    this.BUDGETS.fcp
                  }ms)`
                );
              }
            }
          }
        });
      });

      observer.observe({ entryTypes: ['paint'] });
    }
  }

  /**
   * Report slow resource
   */
  private reportSlowResource(entry: PerformanceResourceTiming, loadTime: number): void {
    const size = entry.transferSize || 0;
    const url = entry.name;

    // Skip reporting for external analytics services (not actionable)
    if (this.isExternalAnalyticsService(url)) {
      return;
    }

    console.warn(`Slow resource detected: ${url} (${loadTime.toFixed(1)}ms, ${size} bytes)`);

    // Send to analytics if needed
    this.sendToAnalytics('slow_resource', {
      url,
      loadTime,
      size,
      type: this.getResourceType(url),
    });
  }

  /**
   * Check if URL is an external analytics service that we can't optimize
   */
  private isExternalAnalyticsService(url: string): boolean {
    const externalAnalyticsDomains = [
      'googletagmanager.com',
      'google-analytics.com',
      'google.com/analytics',
      'google.com/gtag',
      'googletagmanager.com/gtm.js',
      'googletagmanager.com/gtag/js',
      'google-analytics.com/analytics.js',
      'google-analytics.com/gtag/js',
      'facebook.com/tr',
      'facebook.net',
      'doubleclick.net',
      'googlesyndication.com',
      'googleadservices.com',
    ];

    return externalAnalyticsDomains.some(domain => url.includes(domain));
  }

  /**
   * Get resource type from URL
   */
  private getResourceType(url: string): string {
    if (url.includes('.js')) return 'javascript';
    if (url.includes('.css')) return 'stylesheet';
    if (
      url.includes('.png') ||
      url.includes('.jpg') ||
      url.includes('.jpeg') ||
      url.includes('.webp')
    )
      return 'image';
    if (url.includes('.woff') || url.includes('.woff2')) return 'font';
    return 'other';
  }

  /**
   * Optimize slow resources
   */
  private optimizeSlowResources(): void {
    // Note: Critical resource preloading is now handled by ResourcePreloadingService
    // This method focuses on optimizing slow resources, not preloading

    // Optimize external images
    this.optimizeExternalImages();

    // Defer non-critical resources
    this.deferNonCriticalResources();
  }

  /**
   * Optimize external images
   */
  private optimizeExternalImages(): void {
    const externalImages = document.querySelectorAll(
      'img[src*="unsplash.com"], img[src*="devopsschool.com"], img[src*="crio.do"]'
    );

    externalImages.forEach(img => {
      const imgElement = img as HTMLImageElement;

      // Add loading="lazy" for external images (works in both dev and prod)
      img.setAttribute('loading', 'lazy');

      // Add error handling
      img.addEventListener('error', () => {
        console.warn(`Failed to load external image: ${imgElement.src}`);
      });
    });
  }

  /**
   * Defer non-critical resources
   */
  private deferNonCriticalResources(): void {
    // Defer non-critical JavaScript
    const nonCriticalScripts = document.querySelectorAll('script[src*="chunk-"]');
    nonCriticalScripts.forEach(script => {
      if (!script.hasAttribute('defer')) {
        script.setAttribute('defer', '');
      }
    });
  }

  /**
   * Send performance data to privacy-compliant analytics
   */
  private sendToAnalytics(event: string, data: any): void {
    this.privacyAnalyticsService.track(event, data);
  }

  /**
   * Monitor network conditions
   */
  private monitorNetworkConditions(): void {
    if (!this.isBrowser || !('connection' in navigator)) return;

    const connection = (navigator as any).connection;
    if (connection) {
      this.metrics.networkInfo = {
        effectiveType: connection.effectiveType || 'unknown',
        downlink: connection.downlink || 0,
        rtt: connection.rtt || 0,
        saveData: connection.saveData || false,
      };

      // Monitor connection changes
      connection.addEventListener('change', () => {
        this.metrics.networkInfo = {
          effectiveType: connection.effectiveType || 'unknown',
          downlink: connection.downlink || 0,
          rtt: connection.rtt || 0,
          saveData: connection.saveData || false,
        };
      });
    }
  }

  /**
   * Monitor user interactions
   */
  private monitorUserInteractions(): void {
    if (!this.isBrowser) return;

    let interactionCount = 0;
    const interactionTypes = ['click', 'keydown', 'scroll', 'touchstart'];

    interactionTypes.forEach(type => {
      document.addEventListener(
        type,
        () => {
          interactionCount++;

          // Track interaction frequency
          if (interactionCount % 10 === 0) {
            this.reportUserEngagement(interactionCount);
          }
        },
        { passive: true }
      );
    });
  }

  /**
   * Collect comprehensive performance metrics
   */
  private collectMetrics(): void {
    this.collectResourceTimings();
    this.collectPaintTimings();
    this.collectNavigationTiming();
    this.collectUserTiming();

    // Send metrics to analytics
    this.sendAdvancedMetrics();
  }

  /**
   * Collect resource timings
   */
  private collectResourceTimings(): void {
    if (!this.isBrowser || !('performance' in window)) return;

    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    this.metrics.resourceTimings = resources.map(resource => ({
      name: resource.name,
      duration: resource.duration,
      size: resource.transferSize || 0,
      type: this.getResourceType(resource.name),
      startTime: resource.startTime,
    }));
  }

  /**
   * Collect paint timings
   */
  private collectPaintTimings(): void {
    if (!this.isBrowser || !('performance' in window)) return;

    const paints = performance.getEntriesByType('paint') as PerformancePaintTiming[];
    this.metrics.paintTimings = paints.map(paint => ({
      name: paint.name,
      startTime: paint.startTime,
      duration: paint.duration || 0,
    }));
  }

  /**
   * Collect navigation timing
   */
  private collectNavigationTiming(): void {
    if (!this.isBrowser || !('performance' in window)) return;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      this.metrics.navigationTiming = {
        domContentLoaded:
          navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        domInteractive: navigation.domInteractive - navigation.fetchStart,
        firstByte: navigation.responseStart - navigation.requestStart,
        dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcpConnect: navigation.connectEnd - navigation.connectStart,
        sslNegotiation: navigation.secureConnectionStart
          ? navigation.connectEnd - navigation.secureConnectionStart
          : 0,
      };
    }
  }

  /**
   * Collect user timing marks
   */
  private collectUserTiming(): void {
    if (!this.isBrowser || !('performance' in window)) return;

    const userTimings = performance.getEntriesByType('measure');
    this.metrics.userTiming = userTimings.map(timing => ({
      name: timing.name,
      startTime: timing.startTime,
      duration: timing.duration,
    }));
  }

  /**
   * Report user engagement
   */
  private reportUserEngagement(interactionCount: number): void {
    this.privacyAnalyticsService.track('user_engagement', {
      interactionCount,
      timestamp: Date.now(),
    });
  }

  /**
   * Send advanced metrics to analytics
   */
  private sendAdvancedMetrics(): void {
    // Send resource timing summary
    const totalResources = this.metrics.resourceTimings.length;
    const totalSize = this.metrics.resourceTimings.reduce((sum, r) => sum + r.size, 0);
    const avgLoadTime =
      this.metrics.resourceTimings.reduce((sum, r) => sum + r.duration, 0) / totalResources;

    this.privacyAnalyticsService.track('performance_metrics', {
      totalResources,
      totalSize,
      avgLoadTime,
      timestamp: Date.now(),
    });

    // Send network info
    if (this.metrics.networkInfo) {
      this.privacyAnalyticsService.track('network_info', {
        effectiveType: this.metrics.networkInfo.effectiveType,
        downlink: this.metrics.networkInfo.downlink,
        rtt: this.metrics.networkInfo.rtt,
        saveData: this.metrics.networkInfo.saveData,
        timestamp: Date.now(),
      });
    }

    if (!environment.production) {
      console.log('📊 Advanced performance metrics collected');
    }
  }

  /**
   * Check if performance metrics are within budget
   */
  checkBudget(
    metric: keyof PerformanceBudget,
    value: number
  ): {
    withinBudget: boolean;
    isWarning: boolean;
    severity: 'good' | 'needs-improvement' | 'poor';
    message: string;
  } {
    const budget = this.BUDGETS[metric];
    const warning = this.WARNING_THRESHOLDS[metric];

    let severity: 'good' | 'needs-improvement' | 'poor';
    let message: string;

    if (value <= budget) {
      severity = 'good';
      message = `${metric.toUpperCase()} is excellent: ${value}ms`;
    } else if (value <= warning) {
      severity = 'needs-improvement';
      message = `${metric.toUpperCase()} needs improvement: ${value}ms (budget: ${budget}ms)`;
    } else {
      severity = 'poor';
      message = `${metric.toUpperCase()} is poor: ${value}ms (budget: ${budget}ms)`;
    }

    return {
      withinBudget: value <= budget,
      isWarning: value > budget,
      severity,
      message,
    };
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(): any {
    if (!this.isBrowser) return null;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');

    return {
      fcp: paint.find(p => p.name === 'first-contentful-paint')?.startTime,
      lcp: this.getLCP(),
      cls: this.getCLS(),
      ttfb: navigation.responseStart - navigation.requestStart,
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
    };
  }

  /**
   * Get Largest Contentful Paint
   */
  private getLCP(): number | null {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver(list => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        return lastEntry.startTime;
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
    return null;
  }

  /**
   * Get Cumulative Layout Shift
   */
  private getCLS(): number {
    let clsValue = 0;

    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver(list => {
        list.getEntries().forEach(entry => {
          if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        });
      });

      observer.observe({ entryTypes: ['layout-shift'] });
    }

    return clsValue;
  }

  /**
   * Calculate performance score
   */
  private calculateScore(metrics: any): number {
    let score = 100;

    // Deduct points for poor performance
    if (metrics.lcp > this.BUDGETS.lcp) score -= 20;
    if (metrics.fid > this.BUDGETS.fid) score -= 20;
    if (metrics.cls > this.BUDGETS.cls) score -= 20;
    if (metrics.fcp > this.BUDGETS.fcp) score -= 20;
    if (metrics.ttfb > this.BUDGETS.ttfb) score -= 20;

    return Math.max(0, score);
  }
}
