import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Centralized Resource Preloading Service
 *
 * This service coordinates all resource preloading across the application
 * to prevent duplication and ensure optimal performance.
 *
 * Features:
 * - Centralized preloading logic
 * - Development mode detection
 * - Critical resource prioritization
 * - Duplicate prevention
 * - Performance monitoring
 */
@Injectable({
  providedIn: 'root',
})
export class ResourcePreloadingService {
  private isBrowser: boolean;
  private preloadedResources: Set<string> = new Set();
  private isInitialized: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /**
   * Initialize resource preloading
   * This should be called once during app initialization
   */
  initialize(): void {
    if (!this.isBrowser || this.isInitialized) {
      return;
    }

    // Use requestIdleCallback for non-critical preloading to avoid blocking
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => {
        this.preloadCriticalResources();
      });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        this.preloadCriticalResources();
      }, 100);
    }

    this.isInitialized = true;
  }

  /**
   * Preload critical resources that are used immediately after page load
   */
  private preloadCriticalResources(): void {
    // Skip in development mode to prevent warnings
    if (this.isDevelopmentMode()) {
      console.log('🔄 Development mode: Skipping resource preloading');
      return;
    }

    // Only preload truly critical resources that are used immediately
    const criticalResources = this.getCriticalResources();

    criticalResources.forEach(resource => {
      this.preloadResource(resource);
    });
  }

  /**
   * Get list of critical resources that should be preloaded
   * These are resources used immediately after page load
   */
  private getCriticalResources(): ResourceConfig[] {
    return [
      // Note: Font preloading removed as it's causing unused preload warnings
      // Fonts are loaded via CSS @import which is more efficient
      // Note: Logo preloading removed as it's not used immediately after page load
      // The logo loads with the header component after Angular initializes
    ];
  }

  /**
   * Preload a single resource
   */
  private preloadResource(config: ResourceConfig): void {
    // Prevent duplicate preloading
    if (this.preloadedResources.has(config.href)) {
      console.warn(`⚠️ Resource already preloaded: ${config.href}`);
      return;
    }

    try {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = config.href;
      link.as = config.as;

      if (config.type) {
        link.type = config.type;
      }

      if (config.priority) {
        link.setAttribute('fetchpriority', config.priority);
      }

      // Add crossorigin for external resources
      if (this.isExternalResource(config.href)) {
        link.crossOrigin = 'anonymous';
      }

      document.head.appendChild(link);
      this.preloadedResources.add(config.href);

      console.log(`✅ Preloaded: ${config.href} (${config.reason})`);
    } catch (error) {
      console.error(`❌ Failed to preload ${config.href}:`, error);
    }
  }

  /**
   * Preload a resource on demand (for non-critical resources)
   */
  preloadOnDemand(href: string, as: string, type?: string, priority: 'high' | 'low' = 'low'): void {
    if (!this.isBrowser) {
      return;
    }

    const config: ResourceConfig = {
      href,
      as,
      type,
      priority,
      reason: 'On-demand preloading',
    };

    this.preloadResource(config);
  }

  /**
   * Check if a resource has been preloaded
   */
  isResourcePreloaded(href: string): boolean {
    return this.preloadedResources.has(href);
  }

  /**
   * Get list of preloaded resources (for debugging)
   */
  getPreloadedResources(): string[] {
    return Array.from(this.preloadedResources);
  }

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
   * Check if a resource is external
   */
  private isExternalResource(href: string): boolean {
    return href.startsWith('http://') || href.startsWith('https://');
  }

  /**
   * Preload critical images (for specific use cases)
   * Use sparingly - only for images that are truly critical for initial render
   */
  preloadCriticalImage(href: string, reason: string): void {
    if (!this.isBrowser) {
      return;
    }

    // Skip in development mode
    if (this.isDevelopmentMode()) {
      console.log(`🔄 Development mode: Skipping image preload for ${href}`);
      return;
    }

    const config: ResourceConfig = {
      href,
      as: 'image',
      priority: 'high',
      reason,
    };

    this.preloadResource(config);
  }

  /**
   * Preload critical JavaScript (for specific use cases)
   * Use sparingly - only for JS that is truly critical for initial render
   */
  preloadCriticalScript(href: string, reason: string): void {
    if (!this.isBrowser) {
      return;
    }

    // Skip in development mode
    if (this.isDevelopmentMode()) {
      console.log(`🔄 Development mode: Skipping script preload for ${href}`);
      return;
    }

    const config: ResourceConfig = {
      href,
      as: 'script',
      priority: 'high',
      reason,
    };

    this.preloadResource(config);
  }

  /**
   * Preload critical CSS (for specific use cases)
   * Use sparingly - only for CSS that is truly critical for initial render
   */
  preloadCriticalCSS(href: string, reason: string): void {
    if (!this.isBrowser) {
      return;
    }

    // Skip in development mode
    if (this.isDevelopmentMode()) {
      console.log(`🔄 Development mode: Skipping CSS preload for ${href}`);
      return;
    }

    const config: ResourceConfig = {
      href,
      as: 'style',
      type: 'text/css',
      priority: 'high',
      reason,
    };

    this.preloadResource(config);
  }

  /**
   * Initialize lazy loading for images and components
   * Consolidated from LazyLoadingService
   */
  initializeLazyLoading(): void {
    if (!this.isBrowser) {
      return;
    }

    // Lazy load images
    this.lazyLoadImages();

    // Lazy load components
    this.lazyLoadComponents();
  }

  /**
   * Lazy load images using Intersection Observer
   * Consolidated from LazyLoadingService
   */
  private lazyLoadImages(): void {
    if (!('IntersectionObserver' in window)) {
      // Fallback for browsers that don't support IntersectionObserver
      this.loadAllImages();
      return;
    }

    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            this.loadImage(img);
            observer.unobserve(img);
          }
        });
      },
      {
        rootMargin: '50px 0px', // Start loading 50px before the image comes into view
        threshold: 0.01,
      }
    );

    // Observe all images with data-src attribute
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
  }

  /**
   * Load a single image
   * Consolidated from LazyLoadingService
   */
  private loadImage(img: HTMLImageElement): void {
    const src = img.getAttribute('data-src');
    if (src) {
      img.src = src;
      img.removeAttribute('data-src');
      img.classList.add('loaded');
    }
  }

  /**
   * Fallback: load all images immediately
   * Consolidated from LazyLoadingService
   */
  private loadAllImages(): void {
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => this.loadImage(img as HTMLImageElement));
  }

  /**
   * Lazy load components based on user interaction
   * Consolidated from LazyLoadingService
   */
  private lazyLoadComponents(): void {
    // Lazy load FAQ components when they come into view
    this.lazyLoadFAQComponents();

    // Lazy load blog components when needed
    this.lazyLoadBlogComponents();
  }

  /**
   * Lazy load FAQ components
   * Consolidated from LazyLoadingService
   */
  private lazyLoadFAQComponents(): void {
    if (!('IntersectionObserver' in window)) return;

    const faqObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const faqElement = entry.target as HTMLElement;
            this.loadFAQContent(faqElement);
            faqObserver.unobserve(faqElement);
          }
        });
      },
      {
        rootMargin: '100px 0px',
        threshold: 0.1,
      }
    );

    const faqElements = document.querySelectorAll('[data-lazy-faq]');
    faqElements.forEach(element => faqObserver.observe(element));
  }

  /**
   * Load FAQ content
   * Consolidated from LazyLoadingService
   */
  private loadFAQContent(element: HTMLElement): void {
    // Add loading class
    element.classList.add('loading');

    // Simulate loading delay for better UX
    setTimeout(() => {
      element.classList.remove('loading');
      element.classList.add('loaded');
    }, 100);
  }

  /**
   * Lazy load blog components
   * Consolidated from LazyLoadingService
   */
  private lazyLoadBlogComponents(): void {
    if (!('IntersectionObserver' in window)) return;

    const blogObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const blogElement = entry.target as HTMLElement;
            this.loadBlogContent(blogElement);
            blogObserver.unobserve(blogElement);
          }
        });
      },
      {
        rootMargin: '200px 0px',
        threshold: 0.1,
      }
    );

    const blogElements = document.querySelectorAll('[data-lazy-blog]');
    blogElements.forEach(element => blogObserver.observe(element));
  }

  /**
   * Load blog content
   * Consolidated from LazyLoadingService
   */
  private loadBlogContent(element: HTMLElement): void {
    element.classList.add('loading');

    setTimeout(() => {
      element.classList.remove('loading');
      element.classList.add('loaded');
    }, 150);
  }
}

/**
 * Configuration interface for resource preloading
 */
interface ResourceConfig {
  href: string;
  as: string;
  type?: string;
  priority?: 'high' | 'low';
  reason: string;
}
