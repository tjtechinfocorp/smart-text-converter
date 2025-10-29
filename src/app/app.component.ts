import {
  Component,
  signal,
  OnInit,
  AfterViewInit,
  Inject,
  PLATFORM_ID,
  Optional,
} from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { filter } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { SEOService } from './services/seo.service';
import { ThemeService } from './services/theme.service';
import { PerformanceService } from './services/performance.service';
import { ResourcePreloadingService } from './services/resource-preloading.service';
import { SwRegistrationService } from './services/sw-registration.service';
import { WebPOptimizationService } from './services/webp-optimization.service';
import { PrivacyAnalyticsService } from './services/privacy-analytics.service';
import { CacheManagementService } from './services/cache-management.service';
import { ContentFreshnessService } from './services/content-freshness.service';
import { TechnicalSEOService } from './services/seo.service';
import { UserExperienceSignalsService } from './services/user-experience-signals.service';
import { GoogleAnalyticsService } from './services/google-analytics.service';
import { SEOAuditService } from './services/seo-audit.service';
import { TranslationService } from './services/translation.service';
import { RouteSEOService } from './services/route-seo.service';
import { PerformanceMonitorComponent } from './components/performance-monitor/performance-monitor.component';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
// import { SEOMonitorComponent } from './components/seo-monitor/seo-monitor.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PerformanceMonitorComponent, Header, Footer],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, AfterViewInit {
  protected readonly title = signal('Text Converter — Free Online Text Case Converter & Formatter');
  protected readonly isDevelopment = signal(environment.production === false);

  constructor(
    @Optional() private seoService: SEOService,
    @Optional() private themeService: ThemeService,
    @Optional() private performanceService: PerformanceService,
    @Optional() private resourcePreloadingService: ResourcePreloadingService,
    @Optional() private swRegistrationService: SwRegistrationService,
    @Optional() private webpOptimizationService: WebPOptimizationService,
    @Optional() private privacyAnalyticsService: PrivacyAnalyticsService,
    @Optional() private cacheManagementService: CacheManagementService,
    @Optional() private contentFreshnessService: ContentFreshnessService,
    @Optional() private technicalSEOService: TechnicalSEOService,
    @Optional() private userExperienceSignalsService: UserExperienceSignalsService,
    @Optional() private googleAnalytics: GoogleAnalyticsService,
    @Optional() private seoAuditService: SEOAuditService,
    @Optional() private translationService: TranslationService,
    @Optional() private routeSEOService: RouteSEOService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() @Inject('LANGUAGE_PARAM') private serverLanguageParam: string | null
  ) {
    // Check if we're in development mode
    if (isPlatformBrowser(platformId)) {
      this.isDevelopment.set(!environment.production);
    }
  }

  ngOnInit(): void {
    // Set default SEO with comprehensive data (only if service is available)
    // This is critical for SSR and should happen immediately
    if (this.seoService) {
      this.seoService.updateSEO({
        title: 'SmartTextConverter - Free Online Text Tools',
        description:
          'Convert, format, and analyze text with our free online tools. Case converter, text formatter, and more utilities for developers and writers.',
        keywords: 'text converter, case converter, online tools, free utilities, text formatter',
        url: 'https://smarttextconverter.com',
        type: 'website',
        image: '/main-logo-80x80.png',
        author: 'SmartTextConverter',
        locale: 'en',
        canonicalUrl: 'https://smarttextconverter.com',
        structuredData: [
          {
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'SmartTextConverter',
            description: 'Free online text conversion and formatting tools',
            url: 'https://smarttextconverter.com',
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'Web Browser',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
          },
        ],
      });
    }

    // Only run browser-specific services on the client
    if (isPlatformBrowser(this.platformId)) {
      // Initialize route-based SEO service
      if (this.routeSEOService) {
        this.routeSEOService.ngOnInit();
      }

      // Defer heavy initializations to improve TTFB and initial render
      this.initializeCriticalServices();
      this.deferNonCriticalServices();

      // Analytics: try Vercel Insights; fallback to Cloudflare Web Analytics if token provided
      const loadScript = (src: string, attrs: Record<string, string> = {}) => {
        const s = document.createElement('script');
        s.src = src;
        s.defer = true;
        Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v));
        document.head.appendChild(s);
        return s;
      };

      const vercel = loadScript('/_vercel/insights/script.js');
      vercel.onerror = () => {
        if (environment.cloudflareAnalyticsToken) {
          loadScript('https://static.cloudflareinsights.com/beacon.min.js', {
            'data-cf-beacon': JSON.stringify({ token: environment.cloudflareAnalyticsToken }),
          });
        }
      };
      // Also load Cloudflare when token is provided (covers non-Vercel hosts without waiting for error)
      if (environment.cloudflareAnalyticsToken) {
        loadScript('https://static.cloudflareinsights.com/beacon.min.js', {
          'data-cf-beacon': JSON.stringify({ token: environment.cloudflareAnalyticsToken }),
        });
      }
    }

    // Handle language parameter after initial render (non-blocking)
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.handleLanguageParameter(), 0);
    }
  }

  /**
   * Initialize critical services immediately (impacts initial render)
   */
  private initializeCriticalServices(): void {
    // Initialize Core Web Vitals monitoring (lightweight, important)
    if (this.performanceService) {
      this.performanceService.initializeCoreWebVitals();
    }

    // Initialize Google Analytics for immediate tracking
    if (this.googleAnalytics) {
      this.googleAnalytics.trackPageView('/', 'SmartTextConverter - Home');

      // Track router navigation for Google Analytics
      this.router.events
        .pipe(filter((event: any) => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
          this.googleAnalytics.trackPageView(event.urlAfterRedirects, document.title);
        });
    }
  }

  /**
   * Defer non-critical services to improve initial load performance
   */
  private deferNonCriticalServices(): void {
    // Use requestIdleCallback for non-critical tasks, or setTimeout as fallback
    const scheduleTask = (callback: () => void) => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(callback, { timeout: 2000 });
      } else {
        setTimeout(callback, 1000);
      }
    };

    // Defer performance monitoring (not critical for initial render)
    scheduleTask(() => {
      if (this.performanceService) {
        this.performanceService.monitorLongTasks();
        this.performanceService.monitorMemoryUsage();
        this.performanceService.initialize();
      }
    });

    // Defer resource preloading (happens after initial content)
    scheduleTask(() => {
      if (this.resourcePreloadingService) {
        this.resourcePreloadingService.initialize();
      }
    });

    // Defer WebP optimization (visual enhancement, not blocking)
    scheduleTask(() => {
      if (this.webpOptimizationService) {
        this.webpOptimizationService.initialize();
      }
    });

    // Defer analytics initialization (tracking, not critical)
    scheduleTask(() => {
      if (this.privacyAnalyticsService) {
        this.privacyAnalyticsService.initializeWebVitalsTracking();
        this.privacyAnalyticsService.trackPageView('/', 'Home');
      }
    });

    // Defer SEO audits (analysis, not needed immediately)
    scheduleTask(() => {
      if (this.contentFreshnessService) {
        this.contentFreshnessService.getOverallFreshnessScore();
      }

      if (this.technicalSEOService) {
        this.technicalSEOService.runSEOAudit();
      }

      if (this.seoAuditService) {
        this.seoAuditService.runSEOAudit();
      }

      if (this.userExperienceSignalsService) {
        this.userExperienceSignalsService.calculateEngagementMetrics();
      }
    });

    // Register service worker (can happen later)
    setTimeout(() => {
      if (this.swRegistrationService) {
        this.swRegistrationService.registerServiceWorker();
      }
    }, 2000);
  }

  ngAfterViewInit(): void {
    // Only run browser-specific services on the client
    if (isPlatformBrowser(this.platformId)) {
      // Initialize lazy loading after view initialization
      if (this.resourcePreloadingService) {
        this.resourcePreloadingService.initializeLazyLoading();
      }

      // Send page view after view initialization
      if (this.performanceService) {
        setTimeout(() => {
          this.performanceService.sendPageView();
        }, 100);
      }
    }
  }

  /**
   * Handle language query parameter from URL
   * This allows URLs like /case-converter?lang=pl to work properly
   */
  private async handleLanguageParameter(): Promise<void> {
    // Check if we have a language parameter from server-side rendering
    if (this.serverLanguageParam && this.isValidLanguage(this.serverLanguageParam)) {
      try {
        // Set the language from the server parameter
        if (this.translationService) {
          await this.translationService.setLanguage(this.serverLanguageParam);
        }

        // Update SEO tags for the language
        if (this.seoService) {
          this.seoService.setLanguageTags({
            title: '',
            description: '',
            locale: this.serverLanguageParam,
          });
        }

        // On server-side, we don't need to clean up the URL
        // The server will render the page with the correct language
        return;
      } catch (error) {
        console.warn('Failed to load language from server:', this.serverLanguageParam, error);
      }
    }

    // Handle client-side language query parameters
    if (isPlatformBrowser(this.platformId)) {
      this.route.queryParams.subscribe(async (params: any) => {
        const langParam = params['lang'];

        if (langParam && this.isValidLanguage(langParam)) {
          try {
            // Set the language from the query parameter
            if (this.translationService) {
              await this.translationService.setLanguage(langParam);
            }

            // Update SEO tags for the language
            if (this.seoService) {
              this.seoService.setLanguageTags({
                title: '',
                description: '',
                locale: langParam,
              });
            }

            // Clean up the URL by removing the lang parameter
            // This prevents the parameter from staying in the URL after language switch
            // Preserve the current route by using the current URL without query parameters
            const currentUrl = this.router.url.split('?')[0]; // Remove query parameters
            const urlTree = this.router.createUrlTree([currentUrl], {
              queryParams: { lang: null },
              queryParamsHandling: 'merge',
            });

            // Navigate to the clean URL without the lang parameter
            this.router.navigateByUrl(urlTree, { replaceUrl: true });
          } catch (error) {
            console.warn('Failed to load language:', langParam, error);
          }
        }
      });
    }
  }

  /**
   * Check if the language code is valid
   */
  private isValidLanguage(lang: string): boolean {
    if (!this.translationService) {
      return false;
    }
    const supportedLanguages = this.translationService.getSupportedLanguages();
    return supportedLanguages.some(language => language.code === lang);
  }
}
