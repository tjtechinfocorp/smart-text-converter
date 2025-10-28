import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SEOService } from '../services/seo.service';
import { SEO_CONFIG } from '../config/seo.config';

@Injectable()
export class SEOInterceptor implements HttpInterceptor {
  constructor(private seoService: SEOService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap(event => {
        // Monitor performance metrics
        this.monitorPerformanceMetrics();

        // Track SEO-related API calls
        this.trackSEOAPICalls(request);
      })
    );
  }

  /**
   * Monitor Core Web Vitals and performance metrics
   */
  private monitorPerformanceMetrics(): void {
    if (typeof window !== 'undefined' && 'performance' in window) {
      // Monitor Largest Contentful Paint (LCP)
      this.monitorLCP();

      // Monitor First Input Delay (FID)
      this.monitorFID();

      // Monitor Cumulative Layout Shift (CLS)
      this.monitorCLS();
    }
  }

  /**
   * Monitor Largest Contentful Paint (LCP)
   */
  private monitorLCP(): void {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver(entryList => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];

          if (lastEntry) {
            const lcpValue = lastEntry.startTime;
            const target = SEO_CONFIG.performance.coreWebVitals.lcp.target;
            const good = SEO_CONFIG.performance.coreWebVitals.lcp.good;

            if (lcpValue > good) {
              console.warn(`LCP is poor: ${lcpValue}ms (target: ${target}ms, good: ${good}ms)`);
            } else if (lcpValue > target) {
              console.warn(`LCP needs improvement: ${lcpValue}ms (target: ${target}ms)`);
            } else {
              console.log(`LCP is good: ${lcpValue}ms`);
            }
          }
        });

        observer.observe({ type: 'largest-contentful-paint', buffered: true });
      } catch (error) {
        console.warn('LCP monitoring not supported:', error);
      }
    }
  }

  /**
   * Monitor First Input Delay (FID)
   */
  private monitorFID(): void {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver(entryList => {
          const entries = entryList.getEntries();

          entries.forEach(entry => {
            if (entry.entryType === 'first-input') {
              const fidValue = (entry as any).processingStart - entry.startTime;
              const target = SEO_CONFIG.performance.coreWebVitals.fid.target;
              const good = SEO_CONFIG.performance.coreWebVitals.fid.good;

              if (fidValue > good) {
                console.warn(`FID is poor: ${fidValue}ms (target: ${target}ms, good: ${good}ms)`);
              } else if (fidValue > target) {
                console.warn(`FID needs improvement: ${fidValue}ms (target: ${target}ms)`);
              } else {
                console.log(`FID is good: ${fidValue}ms`);
              }
            }
          });
        });

        observer.observe({ type: 'first-input', buffered: true });
      } catch (error) {
        console.warn('FID monitoring not supported:', error);
      }
    }
  }

  /**
   * Monitor Cumulative Layout Shift (CLS)
   */
  private monitorCLS(): void {
    if ('PerformanceObserver' in window) {
      try {
        let clsValue = 0;

        const observer = new PerformanceObserver(entryList => {
          const entries = entryList.getEntries();

          entries.forEach(entry => {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          });

          const target = SEO_CONFIG.performance.coreWebVitals.cls.target;
          const good = SEO_CONFIG.performance.coreWebVitals.cls.good;

          if (clsValue > good) {
            console.warn(`CLS is poor: ${clsValue} (target: ${target}, good: ${good})`);
          } else if (clsValue > target) {
            console.warn(`CLS needs improvement: ${clsValue} (target: ${target})`);
          } else {
            console.log(`CLS is good: ${clsValue}`);
          }
        });

        observer.observe({ type: 'layout-shift', buffered: true });
      } catch (error) {
        console.warn('CLS monitoring not supported:', error);
      }
    }
  }

  /**
   * Track SEO-related API calls
   */
  private trackSEOAPICalls(request: HttpRequest<any>): void {
    const url = request.url;

    // Track sitemap requests
    if (url.includes('sitemap')) {
      console.log('Sitemap requested:', url);
    }

    // Track robots.txt requests
    if (url.includes('robots.txt')) {
      console.log('Robots.txt requested:', url);
    }

    // Track search engine bot requests
    const userAgent = request.headers.get('User-Agent');
    if (userAgent && this.isSearchEngineBot(userAgent)) {
      console.log('Search engine bot detected:', userAgent);
    }
  }

  /**
   * Check if user agent is a search engine bot
   */
  private isSearchEngineBot(userAgent: string): boolean {
    const botPatterns = [
      /googlebot/i,
      /bingbot/i,
      /slurp/i,
      /duckduckbot/i,
      /baiduspider/i,
      /yandexbot/i,
      /facebookexternalhit/i,
      /twitterbot/i,
      /linkedinbot/i,
      /whatsapp/i,
      /telegrambot/i,
    ];

    return botPatterns.some(pattern => pattern.test(userAgent));
  }
}
