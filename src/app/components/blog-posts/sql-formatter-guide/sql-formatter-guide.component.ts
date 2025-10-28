import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SEOService } from '../../../services/seo.service';

@Component({
  selector: 'app-sql-formatter-guide',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sql-formatter-guide.component.html',
  styleUrls: ['./sql-formatter-guide.component.scss'],
})
export class SqlFormatterGuideComponent implements OnInit {
  constructor(private seoService: SEOService) {}

  ngOnInit(): void {
    this.setSEO();
    this.addStructuredData();
  }

  private setSEO(): void {
    this.seoService.setTitle(
      'SQL Formatter Guide: Best Practices for Query Formatting and Optimization in 2025'
    );
    this.seoService.setMetaDescription(
      'Master SQL formatting with our comprehensive guide covering best practices, tools, and techniques. Learn how to format, beautify, minify, and optimize SQL queries effectively.'
    );
    this.seoService.setMetaKeywords(
      'sql formatter, sql beautifier, sql minifier, sql validator, sql best practices, sql formatting guide, sql tools, sql optimization, sql performance, sql development, sql code editor, sql syntax, sql formatting, sql compression, sql tools online, free sql formatter, sql code editor, sql development tools, sql tutorial, sql guide, sql tips, sql tricks'
    );
    this.seoService.setCanonicalURL(
      'https://smarttextconverter.com/blog/sql-formatter-complete-guide'
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
    this.seoService['meta'].updateTag({ name: 'article:tag', content: 'SQL' });
    this.seoService['meta'].updateTag({ name: 'article:tag', content: 'Web Development' });
    this.seoService['meta'].updateTag({ name: 'article:tag', content: 'Database' });
  }

  private addStructuredData(): void {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: 'SQL Formatter Guide: Best Practices for Query Formatting and Optimization in 2025',
      description:
        'Master SQL formatting with our comprehensive guide covering best practices, tools, and techniques. Learn how to format, beautify, minify, and optimize SQL queries effectively.',
      url: 'https://smarttextconverter.com/blog/sql-formatter-complete-guide',
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
        url: 'https://smarttextconverter.com/blog-images/sql-formatter-complete-guide.jpg',
        width: 1200,
        height: 630,
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://smarttextconverter.com/blog/sql-formatter-complete-guide',
      },
    };

    this.seoService.addStructuredData(structuredData);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goBackToBlog(): void {
    window.history.back();
  }

  scrollToSection(sectionId: string, event: Event): void {
    event.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
