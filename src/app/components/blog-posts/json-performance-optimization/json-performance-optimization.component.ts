import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SEOService } from '../../../services/seo.service';

@Component({
  selector: 'app-json-performance-optimization',
  templateUrl: './json-performance-optimization.component.html',
  styleUrl: './json-performance-optimization.component.scss',
  imports: [RouterModule],
  standalone: true,
})
export class JsonPerformanceOptimizationComponent implements OnInit {
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

  scrollToSection(sectionId: string, event: Event): void {
    event.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    }
  }

  private setSEO(): void {
    this.seoService.setTitle('JSON Performance Optimization: Speed Up Your Applications in 2025');
    this.seoService.setMetaDescription(
      'Optimize your JSON processing for maximum performance. Learn size optimization, parsing performance, memory management, and advanced techniques for high-performance applications.'
    );
    this.seoService.setMetaKeywords(
      'JSON performance, optimization, web performance, API optimization, programming, data processing, memory management, speed optimization, web development, performance tuning'
    );
    this.seoService.setCanonicalURL(
      'https://smarttextconverter.com/blog/json-performance-optimization'
    );

    this.seoService.setOpenGraphTags({
      title: 'JSON Performance Optimization: Speed Up Your Applications in 2025',
      description:
        'Optimize your JSON processing for maximum performance. Learn size optimization, parsing performance, memory management, and advanced techniques for high-performance applications.',
      type: 'article',
      url: 'https://smarttextconverter.com/blog/json-performance-optimization',
      image: 'https://smarttextconverter.com/blog-images/json-performance-optimization.png',
    });

    this.seoService.setTwitterCardTags({
      title: 'JSON Performance Optimization: Speed Up Your Applications in 2025',
      description:
        'Optimize your JSON processing for maximum performance. Learn size optimization, parsing performance, memory management, and advanced techniques for high-performance applications.',
      image: 'https://smarttextconverter.com/blog-images/json-performance-optimization.png',
      card: 'summary_large_image',
    });
  }

  private addStructuredData(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: 'JSON Performance Optimization: Speed Up Your Applications in 2025',
      description:
        'Optimize your JSON processing for maximum performance. Learn size optimization, parsing performance, memory management, and advanced techniques for high-performance applications.',
      url: 'https://smarttextconverter.com/blog/json-performance-optimization',
      datePublished: '2025-10-05',
      dateModified: '2025-10-05',
      author: {
        '@type': 'Organization',
        name: 'SmartTextConverter Team',
        url: 'https://smarttextconverter.com',
      },
      publisher: {
        '@type': 'Organization',
        name: 'SmartTextConverter',
        url: 'https://smarttextconverter.com',
        logo: {
          '@type': 'ImageObject',
          url: '/main-logo-80x80.png',
        },
      },
      image: 'https://smarttextconverter.com/blog-images/json-performance-optimization.png',
      keywords: [
        'JSON performance',
        'optimization',
        'web performance',
        'API optimization',
        'programming',
        'data processing',
        'memory management',
        'speed optimization',
        'web development',
        'performance tuning',
      ],
      articleSection: 'Programming',
      wordCount: 2200,
      timeRequired: 'PT7M',
    };

    // Add breadcrumb structured data
    const breadcrumbData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://smarttextconverter.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Blog',
          item: 'https://smarttextconverter.com/blog',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'JSON Performance Optimization',
          item: 'https://smarttextconverter.com/blog/json-performance-optimization',
        },
      ],
    };

    // Add main structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Add breadcrumb structured data
    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.text = JSON.stringify(breadcrumbData);
    document.head.appendChild(breadcrumbScript);
  }

  goBackToBlog(): void {
    this.router.navigate(['/blog']);
  }

  private scrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
