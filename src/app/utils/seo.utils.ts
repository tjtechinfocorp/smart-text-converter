import { SEO_CONFIG } from '../config/seo.config';

export class SEOUtils {
  /**
   * Validate SEO implementation
   */
  static validateSEO(): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    recommendations: string[];
    score: number;
  } {
    const errors: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];

    // Check title
    this.validateTitle(errors, warnings, recommendations);

    // Check meta description
    this.validateMetaDescription(errors, warnings, recommendations);

    // Check headings
    this.validateHeadings(errors, warnings, recommendations);

    // Check images
    this.validateImages(errors, warnings, recommendations);

    // Check internal linking
    this.validateInternalLinking(errors, warnings, recommendations);

    // Check structured data
    this.validateStructuredData(errors, warnings, recommendations);

    // Check mobile optimization
    this.validateMobileOptimization(errors, warnings, recommendations);

    // Check accessibility
    this.validateAccessibility(errors, warnings, recommendations);

    // Check performance
    this.validatePerformance(errors, warnings, recommendations);

    const score = this.calculateSEOScore(errors, warnings, recommendations);

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      recommendations,
      score,
    };
  }

  /**
   * Validate title tag
   */
  private static validateTitle(
    errors: string[],
    warnings: string[],
    recommendations: string[]
  ): void {
    const title = document.querySelector('title')?.textContent;

    if (!title) {
      errors.push('Title tag is missing');
      return;
    }

    const { min: minLength, max: maxLength, optimal } = SEO_CONFIG.technicalSEO.content.titleLength;

    if (title.length < minLength) {
      warnings.push(`Title is too short (${title.length} characters, recommended: ${minLength}+)`);
      recommendations.push('Add more descriptive words to your title');
    } else if (title.length > maxLength) {
      warnings.push(`Title is too long (${title.length} characters, recommended: ${maxLength}-)`);
      recommendations.push('Shorten your title to improve search result display');
    } else if (title.length < optimal) {
      recommendations.push('Consider adding more descriptive words to your title');
    }

    // Check for keyword optimization
    if (!this.containsPrimaryKeywords(title)) {
      recommendations.push('Consider including primary keywords in your title');
    }

    // Check for brand name
    if (!title.toLowerCase().includes('smarttextconverter')) {
      recommendations.push('Consider including your brand name in the title');
    }
  }

  /**
   * Validate meta description
   */
  private static validateMetaDescription(
    errors: string[],
    warnings: string[],
    recommendations: string[]
  ): void {
    const description = document.querySelector('meta[name="description"]')?.getAttribute('content');

    if (!description) {
      errors.push('Meta description is missing');
      return;
    }

    const {
      min: minLength,
      max: maxLength,
      optimal,
    } = SEO_CONFIG.technicalSEO.content.descriptionLength;

    if (description.length < minLength) {
      warnings.push(
        `Meta description is too short (${description.length} characters, recommended: ${minLength}+)`
      );
      recommendations.push('Add more compelling content to your meta description');
    } else if (description.length > maxLength) {
      warnings.push(
        `Meta description is too long (${description.length} characters, recommended: ${maxLength}-)`
      );
      recommendations.push('Shorten your meta description to improve search result display');
    } else if (description.length < optimal) {
      recommendations.push('Consider adding more compelling content to your meta description');
    }

    // Check for call-to-action
    if (!this.containsCallToAction(description)) {
      recommendations.push('Consider adding a call-to-action to your meta description');
    }

    // Check for keyword optimization
    if (!this.containsPrimaryKeywords(description)) {
      recommendations.push('Consider including primary keywords in your meta description');
    }
  }

  /**
   * Validate headings structure
   */
  private static validateHeadings(
    errors: string[],
    warnings: string[],
    recommendations: string[]
  ): void {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

    if (headings.length === 0) {
      errors.push('No headings found on the page');
      return;
    }

    // Check for H1
    const h1Count = document.querySelectorAll('h1').length;
    if (h1Count === 0) {
      errors.push('No H1 heading found - this is required for SEO');
    } else if (h1Count > 1) {
      warnings.push(
        `Multiple H1 headings found (${h1Count}) - consider using only one H1 per page`
      );
    }

    // Check heading hierarchy
    let previousLevel = 0;
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));

      if (index > 0 && level > previousLevel + 1) {
        warnings.push(
          `Heading hierarchy issue: ${heading.tagName} follows ${headings[index - 1].tagName}`
        );
      }

      previousLevel = level;
    });

    // Check for keyword optimization in headings
    const h1 = document.querySelector('h1');
    if (h1 && !this.containsPrimaryKeywords(h1.textContent || '')) {
      recommendations.push('Consider including primary keywords in your H1 heading');
    }
  }

  /**
   * Validate images
   */
  private static validateImages(
    errors: string[],
    warnings: string[],
    recommendations: string[]
  ): void {
    const images = document.querySelectorAll('img');

    if (images.length === 0) {
      recommendations.push('Consider adding relevant images to improve user engagement');
      return;
    }

    let imagesWithoutAlt = 0;
    let largeImages = 0;
    let imagesWithoutLazyLoading = 0;

    images.forEach(img => {
      // Check for alt text
      if (!img.alt) {
        imagesWithoutAlt++;
      }

      // Check image size
      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;

      if (width > 1200 || height > 630) {
        largeImages++;
      }

      // Check for lazy loading
      if (!img.loading) {
        imagesWithoutLazyLoading++;
      }
    });

    if (imagesWithoutAlt > 0) {
      errors.push(`${imagesWithoutAlt} images missing alt text`);
    }

    if (largeImages > 0) {
      warnings.push(
        `${largeImages} large images detected - consider optimizing for better performance`
      );
    }

    if (imagesWithoutLazyLoading > 0) {
      recommendations.push(
        `${imagesWithoutLazyLoading} images without lazy loading - consider adding lazy loading for better performance`
      );
    }
  }

  /**
   * Validate internal linking
   */
  private static validateInternalLinking(
    errors: string[],
    warnings: string[],
    recommendations: string[]
  ): void {
    const internalLinks = document.querySelectorAll(
      'a[href^="/"], a[href*="smarttextconverter.com"]'
    );
    const minInternalLinks = SEO_CONFIG.technicalSEO.internalLinking.minInternalLinks;

    if (internalLinks.length < minInternalLinks) {
      warnings.push(
        `Low internal link count (${internalLinks.length}) - recommended: ${minInternalLinks}+`
      );
    }

    // Check for generic anchor text
    let genericAnchorTexts = 0;
    internalLinks.forEach(link => {
      const anchorText = link.textContent?.trim().toLowerCase();
      const genericTexts = ['click here', 'read more', 'here', 'more', 'link'];

      if (anchorText && genericTexts.includes(anchorText)) {
        genericAnchorTexts++;
      }
    });

    if (genericAnchorTexts > 0) {
      warnings.push(`${genericAnchorTexts} links with generic anchor text detected`);
    }

    // Check for external links
    const externalLinks = document.querySelectorAll(
      'a[href^="http"]:not([href*="smarttextconverter.com"])'
    );
    if (externalLinks.length === 0) {
      recommendations.push('Consider adding external links to authoritative sources');
    }
  }

  /**
   * Validate structured data
   */
  private static validateStructuredData(
    errors: string[],
    warnings: string[],
    recommendations: string[]
  ): void {
    const structuredData = document.querySelectorAll('script[type="application/ld+json"]');

    if (structuredData.length === 0) {
      recommendations.push('Consider adding structured data to improve search result appearance');
      return;
    }

    let validStructuredData = 0;
    structuredData.forEach(script => {
      try {
        const schema = JSON.parse(script.textContent || '');

        // Validate schema structure
        if (!schema['@context'] || !schema['@type']) {
          warnings.push('Invalid structured data schema found');
        } else {
          validStructuredData++;
        }
      } catch (error) {
        warnings.push('Invalid JSON in structured data');
      }
    });

    if (validStructuredData === 0) {
      errors.push('No valid structured data found');
    }
  }

  /**
   * Validate mobile optimization
   */
  private static validateMobileOptimization(
    errors: string[],
    warnings: string[],
    recommendations: string[]
  ): void {
    // Check viewport meta tag
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      errors.push('Viewport meta tag is missing - required for mobile SEO');
    }

    // Check for responsive design
    const mediaQueries = this.getMediaQueries();
    if (mediaQueries.length === 0) {
      warnings.push('No media queries found - ensure responsive design');
    }

    // Check touch targets
    const touchTargets = document.querySelectorAll('button, a, input, select, textarea');
    let smallTouchTargets = 0;

    touchTargets.forEach(target => {
      const rect = target.getBoundingClientRect();
      if (rect.height < 44 || rect.width < 44) {
        smallTouchTargets++;
      }
    });

    if (smallTouchTargets > 0) {
      warnings.push(`${smallTouchTargets} touch targets smaller than 44px detected`);
    }
  }

  /**
   * Validate accessibility
   */
  private static validateAccessibility(
    errors: string[],
    warnings: string[],
    recommendations: string[]
  ): void {
    // Check for alt text on images
    const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
    if (imagesWithoutAlt.length > 0) {
      errors.push(`${imagesWithoutAlt.length} images missing alt text`);
    }

    // Check for proper heading structure
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    if (headings.length === 0) {
      warnings.push('No headings found - important for screen readers');
    }

    // Check for form labels
    const inputsWithoutLabels = document.querySelectorAll(
      'input:not([aria-label]):not([aria-labelledby])'
    );
    let inputsWithoutLabelsCount = 0;

    inputsWithoutLabels.forEach(input => {
      if (!input.getAttribute('placeholder') && !input.getAttribute('title')) {
        inputsWithoutLabelsCount++;
      }
    });

    if (inputsWithoutLabelsCount > 0) {
      warnings.push(`${inputsWithoutLabelsCount} form inputs without accessible labels`);
    }

    // Check for keyboard navigation
    const focusableElements = document.querySelectorAll(
      'button, a, input, select, textarea, [tabindex]'
    );
    if (focusableElements.length === 0) {
      recommendations.push('No focusable elements found - ensure keyboard navigation');
    }
  }

  /**
   * Validate performance
   */
  private static validatePerformance(
    errors: string[],
    warnings: string[],
    recommendations: string[]
  ): void {
    // Check for large images
    const images = document.querySelectorAll('img');
    let largeImages = 0;

    images.forEach(img => {
      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;

      if (width > 1200 || height > 630) {
        largeImages++;
      }
    });

    if (largeImages > 0) {
      warnings.push(
        `${largeImages} large images detected - consider optimizing for better performance`
      );
    }

    // Check for external scripts
    const externalScripts = document.querySelectorAll('script[src^="http"]');
    if (externalScripts.length > 5) {
      recommendations.push('Consider reducing external scripts for better performance');
    }

    // Check for CSS optimization
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    if (stylesheets.length > 3) {
      recommendations.push('Consider combining CSS files for better performance');
    }
  }

  /**
   * Check if text contains primary keywords
   */
  private static containsPrimaryKeywords(text: string): boolean {
    const primaryKeywords = ['text converter', 'case converter', 'text formatter', 'online tools'];
    const lowerText = text.toLowerCase();

    return primaryKeywords.some(keyword => lowerText.includes(keyword));
  }

  /**
   * Check if text contains call-to-action
   */
  private static containsCallToAction(text: string): boolean {
    const ctaWords = ['free', 'try', 'convert', 'format', 'analyze', 'get started', 'learn more'];
    const lowerText = text.toLowerCase();

    return ctaWords.some(word => lowerText.includes(word));
  }

  /**
   * Get media queries from CSS
   */
  private static getMediaQueries(): string[] {
    const mediaQueries: string[] = [];

    for (let i = 0; i < document.styleSheets.length; i++) {
      try {
        const styleSheet = document.styleSheets[i] as CSSStyleSheet;
        if (styleSheet.cssRules) {
          for (let j = 0; j < styleSheet.cssRules.length; j++) {
            const rule = styleSheet.cssRules[j];
            if (rule.type === CSSRule.MEDIA_RULE) {
              const mediaRule = rule as CSSMediaRule;
              mediaQueries.push(mediaRule.conditionText);
            }
          }
        }
      } catch (error) {
        // Cross-origin stylesheets may throw errors
        continue;
      }
    }

    return mediaQueries;
  }

  /**
   * Calculate SEO score
   */
  private static calculateSEOScore(
    errors: string[],
    warnings: string[],
    recommendations: string[]
  ): number {
    let score = 100;

    // Deduct points for errors
    score -= errors.length * 20;

    // Deduct points for warnings
    score -= warnings.length * 5;

    // Deduct points for recommendations
    score -= recommendations.length * 2;

    // Ensure score doesn't go below 0
    return Math.max(0, score);
  }

  /**
   * Generate sitemap XML
   */
  static generateSitemapXML(): string {
    const routes = [
      { url: '/', priority: 1.0, changefreq: 'daily' },
      { url: '/case-converter', priority: 0.9, changefreq: 'weekly' },
      { url: '/text-formatter', priority: 0.9, changefreq: 'weekly' },
      { url: '/text-analyzer', priority: 0.8, changefreq: 'weekly' },
      { url: '/json/formatter', priority: 0.8, changefreq: 'weekly' },
      { url: '/json/parser', priority: 0.8, changefreq: 'weekly' },
      { url: '/blog', priority: 0.7, changefreq: 'weekly' },
      { url: '/blog/json-formatting-complete-guide', priority: 0.8, changefreq: 'monthly' },
      { url: '/blog/json-validation-developer-guide', priority: 0.8, changefreq: 'monthly' },
      { url: '/blog/json-performance-optimization', priority: 0.8, changefreq: 'monthly' },
      { url: '/privacy', priority: 0.3, changefreq: 'monthly' },
      { url: '/terms', priority: 0.3, changefreq: 'monthly' },
    ];

    const supportedLanguages = Object.keys(SEO_CONFIG.supportedLanguages);
    const baseUrl = 'https://smarttextconverter.com';

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml +=
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

    routes.forEach(route => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}${route.url}</loc>\n`;
      xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
      xml += `    <priority>${route.priority}</priority>\n`;

      // Add hreflang alternatives
      supportedLanguages.forEach(lang => {
        const langUrl = lang === 'en' ? `${baseUrl}${route.url}` : `${baseUrl}/${lang}${route.url}`;
        xml += `    <xhtml:link rel="alternate" hreflang="${lang}" href="${langUrl}"/>\n`;
      });

      xml += '  </url>\n';
    });

    xml += '</urlset>';
    return xml;
  }

  /**
   * Generate robots.txt content
   */
  static generateRobotsTxt(): string {
    const baseUrl = 'https://smarttextconverter.com';

    return `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml

# Disallow admin areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /private/

# Allow important files
Allow: /assets/
Allow: /images/
Allow: /css/
Allow: /js/

# Crawl delay for better server performance
Crawl-delay: 1`;
  }

  /**
   * Monitor Core Web Vitals
   */
  static monitorCoreWebVitals(): void {
    if ('PerformanceObserver' in window) {
      // Monitor LCP
      new PerformanceObserver(entryList => {
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
      }).observe({ type: 'largest-contentful-paint', buffered: true });

      // Monitor FID
      new PerformanceObserver(entryList => {
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
      }).observe({ type: 'first-input', buffered: true });

      // Monitor CLS
      new PerformanceObserver(entryList => {
        let cls = 0;
        for (const entry of entryList.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            cls += (entry as any).value;
          }
        }

        const target = SEO_CONFIG.performance.coreWebVitals.cls.target;
        const good = SEO_CONFIG.performance.coreWebVitals.cls.good;

        if (cls > good) {
          console.warn(`CLS is poor: ${cls} (target: ${target}, good: ${good})`);
        } else if (cls > target) {
          console.warn(`CLS needs improvement: ${cls} (target: ${target})`);
        } else {
          console.log(`CLS is good: ${cls}`);
        }
      }).observe({ type: 'layout-shift', buffered: true });
    }
  }
}
