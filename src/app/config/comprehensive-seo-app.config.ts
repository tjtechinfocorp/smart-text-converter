import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
// import { provideAnimations } from '@angular/platform-browser/animations';
// import { provideServiceWorker } from '@angular/service-worker';

import { routes } from '../app.routes';
import { SEOService, TechnicalSEOService } from '../services/seo.service';
import { SEOInterceptor } from '../interceptors/seo.interceptor';
import { SEOGuard } from '../guards/seo.guard';

export const comprehensiveSEOAppConfig: ApplicationConfig = {
  providers: [
    // Zone change detection
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Router with preloading
    provideRouter(routes, withPreloading(PreloadAllModules)),

    // HTTP client (SEO interceptor commented out for now)
    provideHttpClient(),

    // Animations (commented out for now)
    // provideAnimations(),

    // Service worker for PWA features (commented out for now)
    // provideServiceWorker('ngsw-worker.js', {
    //   enabled: true,
    //   registrationStrategy: 'registerWhenStable:30000'
    // }),

    // SEO services
    SEOService,
    TechnicalSEOService,
    SEOGuard,

    // Global SEO configuration
    {
      provide: 'SEO_CONFIG',
      useValue: {
        baseUrl: 'https://smarttextconverter.com',
        defaultLanguage: 'en',
        supportedLanguages: [
          'en',
          'es',
          'fr',
          'de',
          'it',
          'pt',
          'ru',
          'ja',
          'ko',
          'zh',
          'ar',
          'hi',
          'bn',
          'ur',
        ],
        enableMonitoring: true,
        enableValidation: true,
        enablePerformanceTracking: true,
      },
    },

    // SEO monitoring in development
    {
      provide: 'SEO_MONITORING',
      useFactory: () => {
        return {
          enabled:
            window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
          showConsoleLogs: true,
          trackUserInteractions: true,
          trackPerformanceMetrics: true,
        };
      },
    },
  ],
};
