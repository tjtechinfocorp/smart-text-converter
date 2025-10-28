import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SEOService } from '../../../services/seo.service';

@Component({
  selector: 'app-json-formatting-guide',
  templateUrl: './json-formatting-guide.component.html',
  styleUrl: './json-formatting-guide.component.scss',
  imports: [RouterModule],
  standalone: true,
})
export class JsonFormattingGuideComponent implements OnInit {
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
    this.seoService.setTitle(
      'The Complete Guide to JSON Formatting: Best Practices for Developers in 2025'
    );
    this.seoService.setMetaDescription(
      'Master JSON formatting with our comprehensive guide covering best practices, common mistakes, and industry standards. Learn essential techniques for creating clean, maintainable JSON data structures.'
    );
    this.seoService.setMetaKeywords(
      'JSON formatting, JSON best practices, programming, data structures, web development, API development, JSON tools, code quality, developer tools, JSON standards'
    );
    this.seoService.setCanonicalURL(
      'https://smarttextconverter.com/blog/json-formatting-complete-guide'
    );

    this.seoService.setOpenGraphTags({
      title: 'The Complete Guide to JSON Formatting: Best Practices for Developers in 2025',
      description:
        'Master JSON formatting with our comprehensive guide covering best practices, common mistakes, and industry standards. Learn essential techniques for creating clean, maintainable JSON data structures.',
      type: 'article',
      url: 'https://smarttextconverter.com/blog/json-formatting-complete-guide',
      image: 'https://smarttextconverter.com/blog-images/json-formatting-complete-guide.png',
    });

    this.seoService.setTwitterCardTags({
      title: 'The Complete Guide to JSON Formatting: Best Practices for Developers in 2025',
      description:
        'Master JSON formatting with our comprehensive guide covering best practices, common mistakes, and industry standards. Learn essential techniques for creating clean, maintainable JSON data structures.',
      image: 'https://smarttextconverter.com/blog-images/json-formatting-complete-guide.png',
      card: 'summary_large_image',
    });
  }

  private addStructuredData(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: 'The Complete Guide to JSON Formatting: Best Practices for Developers in 2025',
      description:
        'Master JSON formatting with our comprehensive guide covering best practices, common mistakes, and industry standards. Learn essential techniques for creating clean, maintainable JSON data structures.',
      url: 'https://smarttextconverter.com/blog/json-formatting-complete-guide',
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
      image: 'https://smarttextconverter.com/blog-images/json-formatting-complete-guide.png',
      keywords: [
        'JSON formatting',
        'JSON best practices',
        'programming',
        'data structures',
        'web development',
        'API development',
        'JSON tools',
        'code quality',
        'developer tools',
        'JSON standards',
      ],
      articleSection: 'Programming',
      wordCount: 2500,
      timeRequired: 'PT8M',
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
          name: 'JSON Formatting Guide',
          item: 'https://smarttextconverter.com/blog/json-formatting-complete-guide',
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
