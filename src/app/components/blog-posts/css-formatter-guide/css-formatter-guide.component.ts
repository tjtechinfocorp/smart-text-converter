import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SEOService } from '../../../services/seo.service';

@Component({
  selector: 'app-css-formatter-guide',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './css-formatter-guide.component.html',
  styleUrls: ['./css-formatter-guide.component.scss'],
})
export class CssFormatterGuideComponent implements OnInit {
  constructor(
    private seoService: SEOService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.setSEO();
    this.scrollToTop();
    this.addStructuredData();
  }

  private setSEO(): void {
    this.seoService.setTitle(
      'CSS Formatter Guide: Best Practices for Code Formatting and Beautification in 2025'
    );
    this.seoService.setMetaDescription(
      'Master CSS formatting with our comprehensive guide covering best practices, tools, and techniques. Learn how to format, beautify, minify, and validate CSS code effectively.'
    );
    this.seoService.setMetaKeywords(
      'css formatter, css beautifier, css minifier, css validator, css best practices, css formatting guide, css tools, css optimization, css performance, css development, css code editor, css syntax, css formatting, css compression, css tools online, free css formatter, css code editor, css development tools, css tutorial, css guide, css tips, css tricks'
    );
    this.seoService.setCanonicalURL(
      'https://smarttextconverter.com/blog/css-formatter-complete-guide'
    );

    // Add additional meta tags for better SEO
    this.seoService['meta'].updateTag({
      name: 'robots',
      content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    });
    this.seoService['meta'].updateTag({
      name: 'googlebot',
      content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    });
    this.seoService['meta'].updateTag({
      name: 'bingbot',
      content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    });
    this.seoService['meta'].updateTag({ name: 'language', content: 'en' });
    this.seoService['meta'].updateTag({ name: 'revisit-after', content: '7 days' });
    this.seoService['meta'].updateTag({ name: 'rating', content: 'general' });
    this.seoService['meta'].updateTag({ name: 'distribution', content: 'global' });
    this.seoService['meta'].updateTag({ name: 'geo.region', content: 'US' });
    this.seoService['meta'].updateTag({ name: 'geo.placename', content: 'United States' });
    this.seoService['meta'].updateTag({ name: 'geo.position', content: '39.8283;-98.5795' });
    this.seoService['meta'].updateTag({ name: 'ICBM', content: '39.8283, -98.5795' });
    this.seoService['meta'].updateTag({ name: 'article:author', content: 'SmartTextConverter' });
    this.seoService['meta'].updateTag({ name: 'article:section', content: 'Web Development' });
    this.seoService['meta'].updateTag({ name: 'article:tag', content: 'CSS' });
    this.seoService['meta'].updateTag({ name: 'article:tag', content: 'Web Development' });
    this.seoService['meta'].updateTag({ name: 'article:tag', content: 'Code Formatting' });
  }

  scrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
  }

  private addStructuredData(): void {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline:
        'CSS Formatter Guide: Best Practices for Code Formatting and Beautification in 2025',
      description:
        'Master CSS formatting with our comprehensive guide covering best practices, tools, and techniques. Learn how to format, beautify, minify, and validate CSS code effectively.',
      url: 'https://smarttextconverter.com/blog/css-formatter-complete-guide',
      datePublished: '2025-10-08T00:00:00Z',
      dateModified: '2025-10-08T00:00:00Z',
      author: {
        '@type': 'Organization',
        name: 'Smart Text Converter',
        url: 'https://smarttextconverter.com',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Smart Text Converter',
        logo: {
          '@type': 'ImageObject',
          url: 'https://smarttextconverter.com/main-logo-80x80.png',
        },
      },
      image: {
        '@type': 'ImageObject',
        url: 'https://smarttextconverter.com/blog-images/css-formatter-complete-guide.jpg',
        width: 1200,
        height: 630,
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://smarttextconverter.com/blog/css-formatter-complete-guide',
      },
    };

    this.seoService.addStructuredData(structuredData);
  }

  goBackToBlog(): void {
    this.router.navigate(['/blog']);
  }

  goToCssFormatter(): void {
    this.router.navigate(['/css/formatter']);
  }

  scrollToSection(sectionId: string, event: Event): void {
    event.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }
}
