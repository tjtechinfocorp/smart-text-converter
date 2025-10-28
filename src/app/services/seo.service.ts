import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

export interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  url?: string;
  type?: string;
  image?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  locale?: string;
  alternateLocales?: { [key: string]: string };
  canonicalUrl?: string;
  noindex?: boolean;
  nofollow?: boolean;
  structuredData?: any[];
  card?: string;
}

export interface MultilangSEOData {
  [locale: string]: SEOData;
}

@Injectable({
  providedIn: 'root',
})
export class SEOService {
  private baseUrl = 'https://smarttextconverter.com';
  private supportedLanguages = [
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
  ];

  constructor(
    private meta: Meta,
    private title: Title,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {}

  /**
   * Update SEO data for current page
   */
  updateSEO(data: SEOData): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Set title
    this.title.setTitle(data.title);

    // Set meta description
    this.meta.updateTag({ name: 'description', content: data.description });

    // Set meta keywords
    if (data.keywords) {
      this.meta.updateTag({ name: 'keywords', content: data.keywords });
    }

    // Set canonical URL
    if (data.canonicalUrl) {
      this.setCanonicalURL(data.canonicalUrl);
    }

    // Set Open Graph tags
    this.setOpenGraphTags(data);

    // Set Twitter Card tags
    this.setTwitterCardTags(data);

    // Set language tags
    this.setLanguageTags(data);

    // Set robots meta tag
    this.setRobotsMetaTag(data.noindex, data.nofollow);

    // Add structured data
    if (data.structuredData) {
      data.structuredData.forEach(schema => this.addStructuredData(schema));
    }
  }

  /**
   * Set canonical URL
   */
  setCanonicalURL(url: string): void {
    // Remove existing canonical link
    const existingCanonical = this.document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.remove();
    }

    // Add new canonical link
    const link = this.document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', url);
    this.document.head.appendChild(link);
  }

  /**
   * Set Open Graph tags
   */
  setOpenGraphTags(data: SEOData): void {
    const ogTags = [
      { property: 'og:title', content: data.title },
      { property: 'og:description', content: data.description },
      { property: 'og:type', content: data.type || 'website' },
      { property: 'og:url', content: data.url || this.getCurrentUrl() },
      { property: 'og:site_name', content: 'SmartTextConverter' },
      { property: 'og:locale', content: data.locale || 'en_US' },
    ];

    if (data.image) {
      ogTags.push({ property: 'og:image', content: data.image });
      ogTags.push({ property: 'og:image:width', content: '1200' });
      ogTags.push({ property: 'og:image:height', content: '630' });
    }

    if (data.author) {
      ogTags.push({ property: 'og:author', content: data.author });
    }

    if (data.publishedTime) {
      ogTags.push({ property: 'article:published_time', content: data.publishedTime });
    }

    if (data.modifiedTime) {
      ogTags.push({ property: 'article:modified_time', content: data.modifiedTime });
    }

    if (data.section) {
      ogTags.push({ property: 'article:section', content: data.section });
    }

    if (data.tags && data.tags.length > 0) {
      data.tags.forEach(tag => {
        ogTags.push({ property: 'article:tag', content: tag });
      });
    }

    // Add alternate locales for multi-language support
    if (data.alternateLocales) {
      Object.entries(data.alternateLocales).forEach(([locale, url]) => {
        ogTags.push({ property: 'og:locale:alternate', content: locale });
      });
    }

    ogTags.forEach(tag => {
      this.meta.updateTag(tag);
    });
  }

  /**
   * Set Twitter Card tags
   */
  setTwitterCardTags(data: SEOData): void {
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: data.title },
      { name: 'twitter:description', content: data.description },
      { name: 'twitter:site', content: '@SmartTextConverter' },
      { name: 'twitter:creator', content: '@SmartTextConverter' },
    ];

    if (data.image) {
      twitterTags.push({ name: 'twitter:image', content: data.image });
    }

    twitterTags.forEach(tag => {
      this.meta.updateTag(tag);
    });
  }

  /**
   * Set language tags
   */
  setLanguageTags(data: SEOData): void {
    // Set HTML lang attribute
    this.document.documentElement.setAttribute('lang', data.locale || 'en');

    // Set hreflang tags for multi-language support
    if (data.alternateLocales) {
      Object.entries(data.alternateLocales).forEach(([locale, url]) => {
        const link = this.document.createElement('link');
        link.setAttribute('rel', 'alternate');
        link.setAttribute('hreflang', locale);
        link.setAttribute('href', url);
        this.document.head.appendChild(link);
      });
    }
  }

  /**
   * Set robots meta tag
   */
  setRobotsMetaTag(noindex?: boolean, nofollow?: boolean): void {
    const content = this.buildRobotsContent(noindex, nofollow);
    this.meta.updateTag({ name: 'robots', content });
  }

  /**
   * Build robots content string
   */
  private buildRobotsContent(noindex?: boolean, nofollow?: boolean): string {
    const directives = [];

    if (noindex) {
      directives.push('noindex');
    } else {
      directives.push('index');
    }

    if (nofollow) {
      directives.push('nofollow');
    } else {
      directives.push('follow');
    }

    return directives.join(', ');
  }

  /**
   * Add structured data
   */
  addStructuredData(schema: any): void {
    // Remove existing structured data of the same type to prevent duplicates
    const existingScripts = this.document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach(script => {
      try {
        const existingSchema = JSON.parse(script.textContent || '{}');
        if (existingSchema['@type'] === schema['@type']) {
          script.remove();
        }
      } catch (e) {
        // Ignore parsing errors
      }
    });

    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    this.document.head.appendChild(script);
  }

  /**
   * Get current URL
   */
  private getCurrentUrl(): string {
    return this.baseUrl + this.router.url;
  }

  /**
   * Generate sitemap data
   */
  generateSitemapData(): any {
    const routes = [
      { url: '/', priority: 1.0, changefreq: 'daily' },
      { url: '/case-converter', priority: 0.9, changefreq: 'weekly' },
      { url: '/text-formatter', priority: 0.9, changefreq: 'weekly' },
      { url: '/text-analyzer', priority: 0.8, changefreq: 'weekly' },
      { url: '/json/formatter', priority: 0.8, changefreq: 'weekly' },
      { url: '/blog', priority: 0.7, changefreq: 'weekly' },
      { url: '/privacy', priority: 0.3, changefreq: 'monthly' },
      { url: '/terms', priority: 0.3, changefreq: 'monthly' },
    ];

    return {
      urlset: {
        '@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
        '@xmlns:xhtml': 'http://www.w3.org/1999/xhtml',
        url: routes.map(route => ({
          loc: this.baseUrl + route.url,
          lastmod: new Date().toISOString().split('T')[0],
          changefreq: route.changefreq,
          priority: route.priority,
          'xhtml:link': this.supportedLanguages.map(lang => ({
            '@rel': 'alternate',
            '@hreflang': lang,
            '@href': `${this.baseUrl}/${lang}${route.url}`,
          })),
        })),
      },
    };
  }

  /**
   * Generate robots.txt content
   */
  generateRobotsTxt(): string {
    return `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${this.baseUrl}/sitemap.xml

# Disallow admin areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /private/

# Allow important files
Allow: /assets/
Allow: /images/
Allow: /css/
Allow: /js/`;
  }

  /**
   * Validate SEO implementation
   */
  validateSEO(): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    recommendations: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];

    // Check title
    const title = this.title.getTitle();
    if (!title) {
      errors.push('Page title is missing');
    } else if (title.length < 30) {
      warnings.push('Page title is too short (recommended: 30-60 characters)');
    } else if (title.length > 60) {
      warnings.push('Page title is too long (recommended: 30-60 characters)');
    }

    // Check meta description
    const description = this.meta.getTag('name=description')?.content;
    if (!description) {
      errors.push('Meta description is missing');
    } else if (description.length < 120) {
      warnings.push('Meta description is too short (recommended: 120-160 characters)');
    } else if (description.length > 160) {
      warnings.push('Meta description is too long (recommended: 120-160 characters)');
    }

    // Check canonical URL
    const canonical = this.document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      warnings.push('Canonical URL is missing');
    }

    // Check Open Graph tags
    const ogTitle = this.meta.getTag('property=og:title')?.content;
    if (!ogTitle) {
      warnings.push('Open Graph title is missing');
    }

    // Check structured data
    const structuredData = this.document.querySelectorAll('script[type="application/ld+json"]');
    if (structuredData.length === 0) {
      recommendations.push('Consider adding structured data for better search results');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      recommendations,
    };
  }

  /**
   * Get SEO score
   */
  getSEOScore(): number {
    const validation = this.validateSEO();
    let score = 100;

    // Deduct points for errors
    score -= validation.errors.length * 20;

    // Deduct points for warnings
    score -= validation.warnings.length * 5;

    // Ensure score doesn't go below 0
    return Math.max(0, score);
  }

  /**
   * Set page title
   */
  setTitle(title: string): void {
    this.title.setTitle(title);
  }

  /**
   * Set meta description
   */
  setMetaDescription(description: string): void {
    this.meta.updateTag({ name: 'description', content: description });
  }

  /**
   * Set meta keywords
   */
  setMetaKeywords(keywords: string): void {
    this.meta.updateTag({ name: 'keywords', content: keywords });
  }

  /**
   * Set meta tags (legacy method for compatibility)
   */
  setMetaTags(tags: any): void {
    if (tags.title) {
      this.setTitle(tags.title);
    }
    if (tags.description) {
      this.setMetaDescription(tags.description);
    }
    if (tags.keywords) {
      this.setMetaKeywords(tags.keywords);
    }
  }

  /**
   * Set blog post SEO (legacy method for compatibility)
   */
  setBlogPostSEO(data: any): void {
    this.updateSEO(data);
  }
}

// Additional exports for compatibility
export class TechnicalSEOService {
  runSEOAudit(): SEOAuditResult[] {
    return [
      {
        category: 'performance',
        score: 85,
        issues: ['Large images detected', 'Slow loading scripts'],
        recommendations: ['Optimize images', 'Minify JavaScript'],
      },
    ];
  }

  getOverallSEOScore(): number {
    return 85;
  }
}

export interface SEOAuditResult {
  category: string;
  score: number;
  issues: string[];
  recommendations: string[];
}
