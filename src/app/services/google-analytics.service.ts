import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

/**
 * Google Analytics Service
 *
 * This service handles Google Analytics tracking and is automatically disabled in development mode.
 * In development:
 * - No Google Analytics script is loaded
 * - All tracking methods are skipped with console logs
 * - No data is sent to Google Analytics
 *
 * In production:
 * - Full Google Analytics functionality is enabled
 * - All tracking methods work normally
 */
@Injectable({
  providedIn: 'root',
})
export class GoogleAnalyticsService {
  private isInitialized = false;

  constructor() {
    this.initializeGoogleAnalytics();
  }

  private initializeGoogleAnalytics(): void {
    // Skip initialization in development mode
    if (!environment.production) {
      return;
    }

    if (typeof window !== 'undefined' && environment.googleAnalyticsId) {
      // Check if gtag is already loaded
      if (typeof window.gtag === 'function') {
        this.isInitialized = true;
        return;
      }

      // Wait for gtag to be available
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds max wait
      const checkGtag = () => {
        attempts++;
        if (typeof window.gtag === 'function') {
          this.isInitialized = true;
        } else if (attempts < maxAttempts) {
          setTimeout(checkGtag, 100);
        } else {
          console.warn('Google Analytics: gtag failed to load after', maxAttempts, 'attempts');
        }
      };
      checkGtag();
    } else {
      console.warn('Google Analytics: Not initialized - window or GA ID not available');
    }
  }

  /**
   * Track page views
   */
  trackPageView(pagePath: string, pageTitle?: string): void {
    // Skip tracking in development mode
    if (!environment.production) {
      return;
    }

    if (this.isInitialized && typeof window.gtag === 'function') {
      window.gtag('config', environment.googleAnalyticsId, {
        page_path: pagePath,
        page_title: pageTitle,
      });
    } else {
      console.warn(
        'Google Analytics: Cannot track page view - not initialized or gtag not available'
      );
    }
  }

  /**
   * Track custom events
   */
  trackEvent(eventName: string, parameters?: { [key: string]: any }): void {
    // Skip tracking in development mode
    if (!environment.production) {
      return;
    }

    if (this.isInitialized && typeof window.gtag === 'function') {
      window.gtag('event', eventName, {
        event_category: parameters?.['category'] || 'general',
        event_label: parameters?.['label'],
        value: parameters?.['value'],
        ...parameters,
      });
    }
  }

  /**
   * Track tool usage
   */
  trackToolUsage(toolName: string, action: string, parameters?: { [key: string]: any }): void {
    this.trackEvent('tool_usage', {
      category: 'tools',
      label: toolName,
      action: action,
      tool_name: toolName,
      ...parameters,
    });
  }

  /**
   * Track conversion events
   */
  trackConversion(conversionType: string, parameters?: { [key: string]: any }): void {
    this.trackEvent('conversion', {
      category: 'conversion',
      label: conversionType,
      conversion_type: conversionType,
      ...parameters,
    });
  }

  /**
   * Track user engagement
   */
  trackEngagement(engagementType: string, parameters?: { [key: string]: any }): void {
    this.trackEvent('engagement', {
      category: 'user_engagement',
      label: engagementType,
      engagement_type: engagementType,
      ...parameters,
    });
  }

  /**
   * Track performance metrics
   */
  trackPerformance(metricName: string, value: number, parameters?: { [key: string]: any }): void {
    this.trackEvent('performance', {
      category: 'performance',
      label: metricName,
      value: value,
      metric_name: metricName,
      ...parameters,
    });
  }

  /**
   * Track errors
   */
  trackError(errorType: string, errorMessage: string, parameters?: { [key: string]: any }): void {
    this.trackEvent('error', {
      category: 'error',
      label: errorType,
      error_type: errorType,
      error_message: errorMessage,
      ...parameters,
    });
  }

  /**
   * Track language changes
   */
  trackLanguageChange(fromLanguage: string, toLanguage: string): void {
    this.trackEvent('language_change', {
      category: 'localization',
      label: toLanguage,
      from_language: fromLanguage,
      to_language: toLanguage,
    });
  }

  /**
   * Track theme changes
   */
  trackThemeChange(theme: 'light' | 'dark'): void {
    this.trackEvent('theme_change', {
      category: 'user_preferences',
      label: theme,
      theme: theme,
    });
  }

  /**
   * Track search queries
   */
  trackSearch(query: string, resultsCount?: number): void {
    this.trackEvent('search', {
      category: 'search',
      label: query,
      search_term: query,
      results_count: resultsCount,
    });
  }

  /**
   * Track file operations
   */
  trackFileOperation(operation: string, fileType: string, fileSize?: number): void {
    this.trackEvent('file_operation', {
      category: 'file_operations',
      label: operation,
      operation: operation,
      file_type: fileType,
      file_size: fileSize,
    });
  }
}
