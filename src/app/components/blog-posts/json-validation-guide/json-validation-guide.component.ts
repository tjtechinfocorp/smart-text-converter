import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SEOService } from '../../../services/seo.service';

@Component({
  selector: 'app-json-validation-guide',
  templateUrl: './json-validation-guide.component.html',
  styleUrl: './json-validation-guide.component.scss',
  imports: [RouterModule],
  standalone: true,
})
export class JsonValidationGuideComponent implements OnInit {
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
      "JSON Validation: The Developer's Guide to Error-Free Data Processing"
    );
    this.seoService.setMetaDescription(
      'Ensure data integrity with comprehensive JSON validation techniques. Learn syntax validation, schema validation, security considerations, and performance optimization for robust applications.'
    );
    this.seoService.setMetaKeywords(
      'JSON validation, data integrity, error handling, security, API development, programming, JSON schema, data validation, web development, best practices'
    );
    this.seoService.setCanonicalURL(
      'https://smarttextconverter.com/blog/json-validation-developer-guide'
    );

    this.seoService.setOpenGraphTags({
      title: "JSON Validation: The Developer's Guide to Error-Free Data Processing",
      description:
        'Ensure data integrity with comprehensive JSON validation techniques. Learn syntax validation, schema validation, security considerations, and performance optimization for robust applications.',
      type: 'article',
      url: 'https://smarttextconverter.com/blog/json-validation-developer-guide',
      image: 'https://smarttextconverter.com/blog-images/json-validation-developer-guide.jpg',
    });

    this.seoService.setTwitterCardTags({
      title: "JSON Validation: The Developer's Guide to Error-Free Data Processing",
      description:
        'Ensure data integrity with comprehensive JSON validation techniques. Learn syntax validation, schema validation, security considerations, and performance optimization for robust applications.',
      image: 'https://smarttextconverter.com/blog-images/json-validation-developer-guide.jpg',
      card: 'summary_large_image',
    });
  }

  private addStructuredData(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: "JSON Validation: The Developer's Guide to Error-Free Data Processing",
      description:
        'Ensure data integrity with comprehensive JSON validation techniques. Learn syntax validation, schema validation, security considerations, and performance optimization for robust applications.',
      url: 'https://smarttextconverter.com/blog/json-validation-developer-guide',
      datePublished: '2025-10-08',
      dateModified: '2025-10-08',
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
      image: 'https://smarttextconverter.com/blog-images/json-validation-developer-guide.jpg',
      keywords: [
        'JSON validation',
        'data integrity',
        'error handling',
        'security',
        'API development',
        'programming',
        'JSON schema',
        'data validation',
        'web development',
        'best practices',
      ],
      articleSection: 'Programming',
      wordCount: 2000,
      timeRequired: 'PT6M',
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
          name: 'JSON Validation Guide',
          item: 'https://smarttextconverter.com/blog/json-validation-developer-guide',
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
