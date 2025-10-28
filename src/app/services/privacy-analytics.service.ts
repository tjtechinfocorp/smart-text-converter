import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface AnalyticsEvent {
  event: string;
  data: any;
  timestamp: number;
  userAgent: string;
  url: string;
  referrer: string;
}

export interface WebVitalsData {
  lcp: number;
  fid: number;
  cls: number;
  fcp: number;
  ttfb: number;
  inp: number;
}

@Injectable({
  providedIn: 'root',
})
export class PrivacyAnalyticsService {
  private isBrowser: boolean;
  private readonly STORAGE_KEY = 'privacy_analytics_events';
  private readonly MAX_EVENTS = 100;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /**
   * Track an analytics event without third-party cookies
   */
  track(event: string, data: any = {}): void {
    if (!this.isBrowser) return;

    const analyticsData: AnalyticsEvent = {
      event,
      data,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      referrer: document.referrer,
    };

    // Store locally for privacy
    this.storeEvent(analyticsData);
  }

  /**
   * Track page view
   */
  trackPageView(page: string, title?: string): void {
    this.track('page_view', {
      page,
      title: title || document.title,
      url: window.location.href,
    });
  }

  /**
   * Track user interaction
   */
  trackInteraction(action: string, element: string, value?: any): void {
    this.track('interaction', {
      action,
      element,
      value,
      timestamp: Date.now(),
    });
  }

  /**
   * Track Core Web Vitals
   */
  trackWebVitals(vitals: WebVitalsData): void {
    this.track('web_vitals', vitals);
  }

  /**
   * Track performance metrics
   */
  trackPerformance(metrics: { [key: string]: number }): void {
    this.track('performance', metrics);
  }

  /**
   * Track error events
   */
  trackError(error: Error, context?: string): void {
    this.track('error', {
      message: error.message,
      stack: error.stack,
      context,
      url: window.location.href,
    });
  }

  /**
   * Track conversion events
   */
  trackConversion(conversionType: string, value?: number): void {
    this.track('conversion', {
      type: conversionType,
      value,
      timestamp: Date.now(),
    });
  }

  /**
   * Get stored analytics data
   */
  getAnalyticsData(): AnalyticsEvent[] {
    if (!this.isBrowser) return [];

    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading analytics data:', error);
      return [];
    }
  }

  /**
   * Export analytics data
   */
  exportAnalyticsData(): string {
    const data = this.getAnalyticsData();
    return JSON.stringify(
      {
        exportDate: new Date().toISOString(),
        totalEvents: data.length,
        events: data,
      },
      null,
      2
    );
  }

  /**
   * Clear analytics data
   */
  clearAnalyticsData(): void {
    if (!this.isBrowser) return;

    try {
      localStorage.removeItem(this.STORAGE_KEY);
      console.log('📊 Analytics data cleared');
    } catch (error) {
      console.error('Error clearing analytics data:', error);
    }
  }

  /**
   * Get analytics summary
   */
  getAnalyticsSummary(): {
    totalEvents: number;
    uniquePages: number;
    topEvents: { [key: string]: number };
    webVitals: WebVitalsData | null;
  } {
    const data = this.getAnalyticsData();
    const uniquePages = new Set(data.map(event => event.url)).size;

    const topEvents: { [key: string]: number } = {};
    data.forEach(event => {
      topEvents[event.event] = (topEvents[event.event] || 0) + 1;
    });

    const webVitalsEvent = data.find(event => event.event === 'web_vitals');
    const webVitals = webVitalsEvent ? webVitalsEvent.data : null;

    return {
      totalEvents: data.length,
      uniquePages,
      topEvents,
      webVitals,
    };
  }

  /**
   * Initialize Core Web Vitals tracking
   */
  initializeWebVitalsTracking(): void {
    if (!this.isBrowser) return;

    // Track LCP
    new PerformanceObserver(entryList => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        this.track('lcp', { value: lastEntry.startTime });
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true });

    // Track FID
    new PerformanceObserver(entryList => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        if (entry.entryType === 'first-input') {
          const fid = (entry as any).processingStart - entry.startTime;
          this.track('fid', { value: fid });
        }
      });
    }).observe({ type: 'first-input', buffered: true });

    // Track CLS
    let clsValue = 0;
    new PerformanceObserver(entryList => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
          this.track('cls', { value: clsValue });
        }
      });
    }).observe({ type: 'layout-shift', buffered: true });

    // Track FCP
    new PerformanceObserver(entryList => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        if (entry.name === 'first-contentful-paint') {
          this.track('fcp', { value: entry.startTime });
        }
      });
    }).observe({ type: 'paint', buffered: true });

    // Track TTFB
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;
      if (navigation) {
        const ttfb = navigation.responseStart - navigation.fetchStart;
        this.track('ttfb', { value: ttfb });
      }
    });
  }

  /**
   * Store analytics event locally
   */
  private storeEvent(event: AnalyticsEvent): void {
    try {
      const events = this.getAnalyticsData();
      events.push(event);

      // Keep only the last MAX_EVENTS events
      if (events.length > this.MAX_EVENTS) {
        events.splice(0, events.length - this.MAX_EVENTS);
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(events));
    } catch (error) {
      console.error('Error storing analytics event:', error);
    }
  }

  /**
   * Check if user has opted in to analytics
   */
  hasAnalyticsConsent(): boolean {
    if (!this.isBrowser) return false;

    // Check for consent cookie or localStorage
    const consent = localStorage.getItem('analytics_consent');
    return consent === 'true';
  }

  /**
   * Set analytics consent
   */
  setAnalyticsConsent(consent: boolean): void {
    if (!this.isBrowser) return;

    localStorage.setItem('analytics_consent', consent.toString());

    if (consent) {
      this.track('analytics_consent_given', { timestamp: Date.now() });
    } else {
      this.clearAnalyticsData();
      this.track('analytics_consent_denied', { timestamp: Date.now() });
    }
  }

  /**
   * Get privacy-compliant analytics report
   */
  getPrivacyReport(): {
    hasConsent: boolean;
    totalEvents: number;
    dataRetention: string;
    thirdPartyCookies: boolean;
    dataLocation: string;
  } {
    return {
      hasConsent: this.hasAnalyticsConsent(),
      totalEvents: this.getAnalyticsData().length,
      dataRetention: 'Local storage only',
      thirdPartyCookies: false,
      dataLocation: "User's device only",
    };
  }
}
