import { Directive, Input, OnInit, OnDestroy, ElementRef, Renderer2 } from '@angular/core';
import { SEOService, SEOData } from '../services/seo.service';

@Directive({
  selector: '[appSEO]',
  standalone: true,
})
export class SEODirective implements OnInit, OnDestroy {
  @Input('appSEO') seoData: SEOData = { title: '', description: '' };
  @Input() seoSchema: any[] = [];
  @Input() seoValidation: boolean = true;
  @Input() seoMonitoring: boolean = false;
  @Input() language: string = 'en';

  private performanceObserver?: PerformanceObserver;
  private mutationObserver?: MutationObserver;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private seoService: SEOService
  ) {}

  ngOnInit(): void {
    if (this.seoData) {
      this.applySEOData();
    }

    if (this.seoSchema && this.seoSchema.length > 0) {
      this.addStructuredData();
    }

    if (this.seoValidation) {
      this.validateSEO();
    }

    if (this.seoMonitoring) {
      this.startSEOMonitoring();
    }
  }

  ngOnDestroy(): void {
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }

    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
  }

  /**
   * Apply SEO data to the component
   */
  private applySEOData(): void {
    // Update meta tags
    this.seoService.updateSEO(this.seoData);

    // Apply component-specific optimizations
    this.optimizeComponentSEO();
  }

  /**
   * Add structured data
   */
  private addStructuredData(): void {
    this.seoSchema.forEach(schema => {
      this.seoService.addStructuredData(schema);
    });
  }

  /**
   * Validate SEO implementation
   */
  private validateSEO(): void {
    const validation = this.seoService.validateSEO();

    if (!validation.isValid) {
      console.error('SEO validation failed:', validation.errors);
    }

    if (validation.warnings.length > 0) {
      console.warn('SEO validation warnings:', validation.warnings);
    }
  }

  /**
   * Start SEO monitoring
   */
  private startSEOMonitoring(): void {
    // Monitor Core Web Vitals
    this.monitorCoreWebVitals();

    // Monitor content changes
    this.monitorContentChanges();

    // Monitor user interactions
    this.monitorUserInteractions();
  }

  /**
   * Monitor Core Web Vitals
   */
  private monitorCoreWebVitals(): void {
    if ('PerformanceObserver' in window) {
      try {
        // Monitor LCP
        this.performanceObserver = new PerformanceObserver(entryList => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];

          if (lastEntry) {
            this.trackSEOMetric('LCP', lastEntry.startTime);
          }
        });

        this.performanceObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      } catch (error) {
        console.warn('Performance monitoring not supported:', error);
      }
    }
  }

  /**
   * Monitor content changes
   */
  private monitorContentChanges(): void {
    if ('MutationObserver' in window) {
      this.mutationObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (mutation.type === 'childList') {
            this.handleContentChange();
          }
        });
      });

      this.mutationObserver.observe(this.elementRef.nativeElement, {
        childList: true,
        subtree: true,
      });
    }
  }

  /**
   * Monitor user interactions
   */
  private monitorUserInteractions(): void {
    const element = this.elementRef.nativeElement;

    // Track clicks
    element.addEventListener('click', (event: Event) => {
      this.trackUserInteraction('click', event.target);
    });

    // Track scroll depth
    let maxScrollDepth = 0;
    element.addEventListener('scroll', () => {
      const scrollDepth = this.calculateScrollDepth();
      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;
        this.trackSEOMetric('scroll_depth', scrollDepth);
      }
    });

    // Track time on page
    const startTime = Date.now();
    element.addEventListener('beforeunload', () => {
      const timeOnPage = Date.now() - startTime;
      this.trackSEOMetric('time_on_page', timeOnPage);
    });
  }

  /**
   * Handle content changes
   */
  private handleContentChange(): void {
    // Re-validate SEO after content changes
    if (this.seoValidation) {
      setTimeout(() => this.validateSEO(), 100);
    }

    // Update structured data if needed
    if (this.seoSchema && this.seoSchema.length > 0) {
      this.addStructuredData();
    }
  }

  /**
   * Track SEO metrics
   */
  private trackSEOMetric(metric: string, value: number): void {
    console.log(`SEO Metric - ${metric}:`, value);

    // Send to privacy-compliant analytics if available
    // Note: Analytics tracking would be handled by PrivacyAnalyticsService if injected
    console.log('📊 SEO metric tracked:', metric, value);
  }

  /**
   * Track user interactions
   */
  private trackUserInteraction(action: string, target: any): void {
    console.log(`User Interaction - ${action}:`, target);

    // Send to privacy-compliant analytics if available
    // Note: Analytics tracking would be handled by PrivacyAnalyticsService if injected
    console.log('📊 User interaction tracked:', action, target.tagName);
  }

  /**
   * Calculate scroll depth percentage
   */
  private calculateScrollDepth(): number {
    const element = this.elementRef.nativeElement;
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;

    return Math.round((scrollTop / (scrollHeight - clientHeight)) * 100);
  }

  /**
   * Optimize component SEO
   */
  private optimizeComponentSEO(): void {
    const element = this.elementRef.nativeElement;

    // Ensure proper heading structure
    this.ensureProperHeadingStructure(element);

    // Optimize images
    this.optimizeImages(element);

    // Ensure internal linking
    this.ensureInternalLinking(element);

    // Apply accessibility improvements
    this.applyAccessibilityImprovements(element);
  }

  /**
   * Ensure proper heading structure
   */
  private ensureProperHeadingStructure(element: HTMLElement): void {
    const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');

    if (headings.length === 0) {
      console.warn('No headings found in component - consider adding headings for better SEO');
      return;
    }

    // Check for H1
    const h1Count = element.querySelectorAll('h1').length;
    if (h1Count === 0) {
      console.warn('No H1 heading found in component - consider adding one');
    } else if (h1Count > 1) {
      console.warn(
        `Multiple H1 headings found (${h1Count}) in component - consider using only one`
      );
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
  private optimizeImages(element: HTMLElement): void {
    const images = element.querySelectorAll('img');

    images.forEach(img => {
      // Check for alt text
      if (!img.alt) {
        console.warn('Image missing alt text:', img.src);
        this.renderer.setAttribute(img, 'alt', this.generateAltText(img));
      }

      // Add lazy loading if not present
      if (!img.loading) {
        this.renderer.setAttribute(img, 'loading', 'lazy');
      }

      // Add width and height attributes for layout stability
      if (!img.width && !img.height) {
        img.onload = () => {
          this.renderer.setAttribute(img, 'width', img.naturalWidth.toString());
          this.renderer.setAttribute(img, 'height', img.naturalHeight.toString());
        };
      }
    });
  }

  /**
   * Generate alt text for images
   */
  private generateAltText(img: HTMLImageElement): string {
    const src = img.src;
    const filename = src.split('/').pop()?.split('.')[0] || '';
    return filename.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  /**
   * Ensure internal linking
   */
  private ensureInternalLinking(element: HTMLElement): void {
    const links = element.querySelectorAll('a[href]');

    links.forEach(link => {
      const href = link.getAttribute('href');

      if (href && (href.startsWith('/') || href.includes('smarttextconverter.com'))) {
        // Check for descriptive anchor text
        const anchorText = link.textContent?.trim();
        const genericTexts = ['click here', 'read more', 'here', 'more', 'link'];

        if (anchorText && genericTexts.includes(anchorText.toLowerCase())) {
          console.warn('Generic anchor text detected:', anchorText);
        }

        // Ensure proper link attributes
        if (!link.getAttribute('title')) {
          this.renderer.setAttribute(link, 'title', anchorText || '');
        }
      }
    });
  }

  /**
   * Apply accessibility improvements
   */
  private applyAccessibilityImprovements(element: HTMLElement): void {
    // Add ARIA labels to interactive elements
    const interactiveElements = element.querySelectorAll('button, input, select, textarea');

    interactiveElements.forEach(el => {
      if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby')) {
        const label = this.generateAriaLabel(el);
        if (label) {
          this.renderer.setAttribute(el, 'aria-label', label);
        }
      }
    });

    // Ensure proper focus management
    const focusableElements = element.querySelectorAll(
      'button, a, input, select, textarea, [tabindex]'
    );

    focusableElements.forEach(el => {
      if (
        !el.getAttribute('tabindex') &&
        el.tagName !== 'A' &&
        el.tagName !== 'BUTTON' &&
        el.tagName !== 'INPUT' &&
        el.tagName !== 'SELECT' &&
        el.tagName !== 'TEXTAREA'
      ) {
        this.renderer.setAttribute(el, 'tabindex', '0');
      }
    });
  }

  /**
   * Generate ARIA label for elements
   */
  private generateAriaLabel(element: Element): string | null {
    const tagName = element.tagName.toLowerCase();

    switch (tagName) {
      case 'button':
        return element.textContent?.trim() || 'Button';
      case 'input':
        const input = element as HTMLInputElement;
        return input.placeholder || input.name || 'Input field';
      case 'select':
        return 'Select option';
      case 'textarea':
        return 'Text area';
      default:
        return null;
    }
  }
}
