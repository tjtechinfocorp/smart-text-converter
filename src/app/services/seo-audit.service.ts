import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class SEOAuditService {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private meta: Meta,
    private title: Title
  ) {}

  /**
   * Run comprehensive SEO audit
   */
  runSEOAudit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Check for critical SEO issues
    this.checkTitleTag();
    this.checkMetaDescription();
    this.checkCanonicalURL();
    this.checkStructuredData();
    this.checkImageAltTags();
    this.checkInternalLinks();
    this.checkPageSpeed();
    this.checkMobileFriendliness();
    this.checkHTTPS();
    this.checkRobotsMeta();
  }

  private checkTitleTag(): void {
    const title = this.title.getTitle();
    if (!title || title.length < 30 || title.length > 60) {
      console.warn('⚠️ SEO Issue: Title tag should be 30-60 characters. Current:', title.length);
    }
  }

  private checkMetaDescription(): void {
    const description = this.meta.getTag('name="description"')?.content;
    if (!description || description.length < 120 || description.length > 160) {
      console.warn(
        '⚠️ SEO Issue: Meta description should be 120-160 characters. Current:',
        description?.length || 0
      );
    }
  }

  private checkCanonicalURL(): void {
    const canonical = this.meta.getTag('rel="canonical"')?.content;
    // Skip warning for localhost/development
    const isLocalhost = location.hostname === 'localhost' || location.hostname === '127.0.0.1';

    if (!canonical && !isLocalhost) {
      console.warn('⚠️ SEO Issue: Missing canonical URL');
    }
  }

  private checkStructuredData(): void {
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    if (scripts.length === 0) {
      console.warn('⚠️ SEO Issue: No structured data found');
    }
  }

  private checkImageAltTags(): void {
    const images = document.querySelectorAll('img');
    const imagesWithoutAlt = Array.from(images).filter(img => !img.alt);
    if (imagesWithoutAlt.length > 0) {
      console.warn('⚠️ SEO Issue: Images without alt text:', imagesWithoutAlt.length);
    }
  }

  private checkInternalLinks(): void {
    const links = document.querySelectorAll('a[href]');
    const internalLinks = Array.from(links).filter(link => {
      const href = link.getAttribute('href');
      return href && (href.startsWith('/') || href.includes('smarttextconverter.com'));
    });
    if (internalLinks.length === 0) {
      console.warn('⚠️ SEO Issue: No internal links found');
    }
  }

  private checkPageSpeed(): void {
    if ('performance' in window) {
      const navigation = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;
      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
        if (loadTime > 3000) {
          console.warn('⚠️ SEO Issue: Page load time is slow:', loadTime, 'ms');
        }
      }
    }
  }

  private checkMobileFriendliness(): void {
    const viewport = this.meta.getTag('name="viewport"');
    if (!viewport) {
      console.warn('⚠️ SEO Issue: Missing viewport meta tag');
    }
  }

  private checkHTTPS(): void {
    // Skip HTTPS check for localhost/development
    const isLocalhost = location.hostname === 'localhost' || location.hostname === '127.0.0.1';

    if (location.protocol !== 'https:' && !isLocalhost) {
      console.warn('⚠️ SEO Issue: Site is not using HTTPS');
    }
  }

  private checkRobotsMeta(): void {
    const robots = this.meta.getTag('name="robots"');
    if (!robots) {
      console.warn('⚠️ SEO Issue: Missing robots meta tag');
    }
  }

  /**
   * Generate SEO report for Google Search Console
   */
  generateSEOReport(): any {
    const report = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      title: this.title.getTitle(),
      metaDescription: this.meta.getTag('name="description"')?.content,
      canonical: this.meta.getTag('rel="canonical"')?.content,
      robots: this.meta.getTag('name="robots"')?.content,
      viewport: this.meta.getTag('name="viewport"')?.content,
      structuredData: document.querySelectorAll('script[type="application/ld+json"]').length,
      images: document.querySelectorAll('img').length,
      imagesWithoutAlt: Array.from(document.querySelectorAll('img')).filter(img => !img.alt).length,
      internalLinks: Array.from(document.querySelectorAll('a[href]')).filter(link => {
        const href = link.getAttribute('href');
        return href && (href.startsWith('/') || href.includes('smarttextconverter.com'));
      }).length,
      isHTTPS: location.protocol === 'https:',
      userAgent: navigator.userAgent,
    };
    return report;
  }
}
