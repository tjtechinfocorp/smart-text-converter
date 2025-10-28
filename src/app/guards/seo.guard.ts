import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { SEOService } from '../services/seo.service';
import { SEO_CONFIG } from '../config/seo.config';

@Injectable({
  providedIn: 'root',
})
export class SEOGuard implements CanActivate {
  constructor(
    private seoService: SEOService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Apply SEO optimizations based on route
    this.applyRouteBasedSEO(route, state);

    // Validate SEO implementation
    this.validateSEOImplementation(route, state);

    // Apply content quality optimizations
    this.applyContentQualityOptimizations(route, state);

    // Apply technical SEO optimizations
    this.applyTechnicalSEOOptimizations(route, state);

    return true;
  }

  /**
   * Apply route-based SEO optimizations
   */
  private applyRouteBasedSEO(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): void {
    const routePath = route.routeConfig?.path || '';
    const language = this.detectLanguage(state.url);

    // Get SEO data for the route
    const seoData = this.getSEODataForRoute(routePath, language);

    if (seoData) {
      this.seoService.updateSEO(seoData);
    }
  }

  /**
   * Detect language from URL
   */
  private detectLanguage(url: string): string {
    const supportedLanguages = Object.keys(SEO_CONFIG.supportedLanguages);
    const urlSegments = url.split('/').filter(segment => segment);

    if (urlSegments.length > 0 && supportedLanguages.includes(urlSegments[0])) {
      return urlSegments[0];
    }

    return 'en'; // Default language
  }

  /**
   * Get SEO data for specific route
   */
  private getSEODataForRoute(routePath: string, language: string): any {
    const pageSEO = SEO_CONFIG.pageSEO;
    const multilangSEO = SEO_CONFIG.multilangSEO;

    // Get base SEO data for the language
    const baseSEO = multilangSEO[language as keyof typeof multilangSEO] || multilangSEO.en;

    // Get page-specific SEO data
    let pageSpecificSEO = null;

    switch (routePath) {
      case '':
        pageSpecificSEO = pageSEO.home[language as keyof typeof pageSEO.home] || pageSEO.home.en;
        break;
      case 'case-converter':
        pageSpecificSEO =
          pageSEO.caseConverter[language as keyof typeof pageSEO.caseConverter] ||
          pageSEO.caseConverter.en;
        break;
      case 'text-formatter':
        pageSpecificSEO =
          pageSEO.textFormatter[language as keyof typeof pageSEO.textFormatter] ||
          pageSEO.textFormatter.en;
        break;
      case 'text-analyzer':
        pageSpecificSEO =
          pageSEO.textAnalyzer[language as keyof typeof pageSEO.textAnalyzer] ||
          pageSEO.textAnalyzer.en;
        break;
      case 'json/formatter':
        pageSpecificSEO =
          pageSEO.jsonUtility[language as keyof typeof pageSEO.jsonUtility] ||
          pageSEO.jsonUtility.en;
        break;
      case 'blog':
        pageSpecificSEO = pageSEO.blog[language as keyof typeof pageSEO.blog] || pageSEO.blog.en;
        break;
    }

    // Merge base and page-specific SEO data
    const seoData = {
      ...baseSEO,
      ...pageSpecificSEO,
      url: `https://smarttextconverter.com${language !== 'en' ? `/${language}` : ''}${routePath ? `/${routePath}` : ''}`,
      canonicalUrl: `https://smarttextconverter.com${routePath ? `/${routePath}` : ''}`,
      alternateLocales: this.generateAlternateLocales(routePath),
      locale: language,
    };

    return seoData;
  }

  /**
   * Generate alternate locales for hreflang
   */
  private generateAlternateLocales(routePath: string): { [key: string]: string } {
    const alternateLocales: { [key: string]: string } = {};
    const supportedLanguages = Object.keys(SEO_CONFIG.supportedLanguages);

    supportedLanguages.forEach(lang => {
      if (lang !== 'en') {
        alternateLocales[lang] =
          `https://smarttextconverter.com/${lang}${routePath ? `/${routePath}` : ''}`;
      } else {
        alternateLocales[lang] =
          `https://smarttextconverter.com${routePath ? `/${routePath}` : ''}`;
      }
    });

    return alternateLocales;
  }

  /**
   * Validate SEO implementation
   */
  private validateSEOImplementation(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): void {
    const validation = this.seoService.validateSEO();

    if (!validation.isValid) {
      console.error('SEO validation failed:', validation.errors);
    }

    if (validation.warnings.length > 0) {
      console.warn('SEO validation warnings:', validation.warnings);
    }

    if (validation.recommendations.length > 0) {
      console.info('SEO recommendations:', validation.recommendations);
    }
  }

  /**
   * Apply content quality optimizations
   */
  private applyContentQualityOptimizations(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): void {
    // Ensure proper heading structure
    this.ensureProperHeadingStructure();

    // Optimize images
    this.optimizeImages();

    // Ensure internal linking
    this.ensureInternalLinking();

    // Apply E-E-A-T principles
    this.applyEATPrinciples();
  }

  /**
   * Ensure proper heading structure
   */
  private ensureProperHeadingStructure(): void {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const h1Count = document.querySelectorAll('h1').length;

    if (h1Count === 0) {
      console.warn('No H1 heading found - this is required for SEO');
    } else if (h1Count > 1) {
      console.warn(`Multiple H1 headings found (${h1Count}) - consider using only one H1 per page`);
    }

    // Check heading hierarchy
    let previousLevel = 0;
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));

      if (index > 0 && level > previousLevel + 1) {
        console.warn(
          `Heading hierarchy issue: ${heading.tagName} follows ${headings[index - 1].tagName}`
        );
      }

      previousLevel = level;
    });
  }

  /**
   * Optimize images
   */
  private optimizeImages(): void {
    const images = document.querySelectorAll('img');

    images.forEach(img => {
      // Check for alt text
      if (!img.alt) {
        console.warn('Image missing alt text:', img.src);
      }

      // Check for lazy loading
      if (!img.loading) {
        img.loading = 'lazy';
      }

      // Check image dimensions
      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;

      if (width > 1200) {
        console.warn('Large image detected - consider optimizing:', img.src);
      }
    });
  }

  /**
   * Ensure internal linking
   */
  private ensureInternalLinking(): void {
    const internalLinks = document.querySelectorAll(
      'a[href^="/"], a[href*="smarttextconverter.com"]'
    );
    const minInternalLinks = SEO_CONFIG.technicalSEO.internalLinking.minInternalLinks;

    if (internalLinks.length < minInternalLinks) {
      console.warn(
        `Low internal link count (${internalLinks.length}) - recommended: ${minInternalLinks}+`
      );
    }

    // Check for generic anchor text
    internalLinks.forEach(link => {
      const anchorText = link.textContent?.trim().toLowerCase();
      const genericTexts = ['click here', 'read more', 'here', 'more', 'link'];

      if (anchorText && genericTexts.includes(anchorText)) {
        console.warn('Generic anchor text detected:', anchorText);
      }
    });
  }

  /**
   * Apply E-E-A-T principles
   */
  private applyEATPrinciples(): void {
    // Check for author information
    const authorMeta = document.querySelector('meta[name="author"]');
    if (!authorMeta) {
      console.warn('Author meta tag missing - important for E-E-A-T');
    }

    // Check for contact information
    const contactInfo = document.querySelector('[href*="mailto:"], [href*="tel:"]');
    if (!contactInfo) {
      console.warn('Contact information not found - important for trustworthiness');
    }

    // Check for privacy policy and terms
    const privacyLink = document.querySelector('a[href*="privacy"]');
    const termsLink = document.querySelector('a[href*="terms"]');

    if (!privacyLink) {
      console.warn('Privacy policy link not found - important for trustworthiness');
    }

    if (!termsLink) {
      console.warn('Terms of service link not found - important for trustworthiness');
    }
  }

  /**
   * Apply technical SEO optimizations
   */
  private applyTechnicalSEOOptimizations(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): void {
    // Ensure viewport meta tag
    this.ensureViewportMetaTag();

    // Ensure charset meta tag
    this.ensureCharsetMetaTag();

    // Optimize for mobile
    this.optimizeForMobile();

    // Ensure accessibility
    this.ensureAccessibility();
  }

  /**
   * Ensure viewport meta tag
   */
  private ensureViewportMetaTag(): void {
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
      console.warn('Viewport meta tag missing - required for mobile SEO');
    }
  }

  /**
   * Ensure charset meta tag
   */
  private ensureCharsetMetaTag(): void {
    const charsetMeta = document.querySelector('meta[charset]');
    if (!charsetMeta) {
      console.warn('Charset meta tag missing - required for proper text encoding');
    }
  }

  /**
   * Optimize for mobile
   */
  private optimizeForMobile(): void {
    // Check for touch-friendly elements
    const buttons = document.querySelectorAll('button, a');
    buttons.forEach(button => {
      const style = window.getComputedStyle(button);
      const minHeight = parseInt(style.minHeight) || button.clientHeight;

      if (minHeight < 44) {
        console.warn('Touch target too small - minimum 44px recommended:', button);
      }
    });
  }

  /**
   * Ensure accessibility
   */
  private ensureAccessibility(): void {
    // Check for proper color contrast
    this.checkColorContrast();

    // Check for keyboard navigation
    this.checkKeyboardNavigation();

    // Check for screen reader compatibility
    this.checkScreenReaderCompatibility();
  }

  /**
   * Check color contrast
   */
  private checkColorContrast(): void {
    // This would require a color contrast analysis library
    // For now, just log a reminder
    console.info('Consider checking color contrast ratios for accessibility');
  }

  /**
   * Check keyboard navigation
   */
  private checkKeyboardNavigation(): void {
    const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');

    interactiveElements.forEach(element => {
      if (!element.getAttribute('tabindex') && element.getAttribute('tabindex') !== '0') {
        // Check if element is focusable
        if (element.tagName === 'DIV' || element.tagName === 'SPAN') {
          console.warn('Non-focusable element used for interaction:', element);
        }
      }
    });
  }

  /**
   * Check screen reader compatibility
   */
  private checkScreenReaderCompatibility(): void {
    // Check for proper ARIA labels
    const elementsWithoutLabels = document.querySelectorAll(
      'input:not([aria-label]):not([aria-labelledby])'
    );
    elementsWithoutLabels.forEach(element => {
      if (!element.getAttribute('placeholder') && !element.getAttribute('title')) {
        console.warn('Form element without accessible label:', element);
      }
    });
  }
}
