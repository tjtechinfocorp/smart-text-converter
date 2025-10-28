import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SEOService } from '../../../services/seo.service';

@Component({
  selector: 'app-javascript-formatter-guide',
  templateUrl: './javascript-formatter-guide.component.html',
  styleUrl: './javascript-formatter-guide.component.scss',
  imports: [RouterModule],
  standalone: true,
})
export class JavascriptFormatterGuideComponent implements OnInit {
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
      'JavaScript Formatter Guide: Best Practices for Code Formatting and Beautification in 2025'
    );
    this.seoService.setMetaDescription(
      'Master JavaScript formatting with our comprehensive guide covering best practices, tools, and techniques. Learn how to format, beautify, minify, and validate JavaScript code effectively.'
    );
    this.seoService.setMetaKeywords(
      'JavaScript formatter, JS beautifier, code formatting, JavaScript minifier, code validation, ES6 conversion, programming best practices, developer tools, JavaScript tools, code quality'
    );
    this.seoService.setCanonicalURL(
      'https://smarttextconverter.com/blog/javascript-formatter-complete-guide'
    );

    this.seoService.setOpenGraphTags({
      title:
        'JavaScript Formatter Guide: Best Practices for Code Formatting and Beautification in 2025',
      description:
        'Master JavaScript formatting with our comprehensive guide covering best practices, tools, and techniques. Learn how to format, beautify, minify, and validate JavaScript code effectively.',
      type: 'article',
      url: 'https://smarttextconverter.com/blog/javascript-formatter-complete-guide',
      image: 'https://smarttextconverter.com/blog-images/javascript-formatter-complete-guide.png',
    });

    this.seoService.setTwitterCardTags({
      title:
        'JavaScript Formatter Guide: Best Practices for Code Formatting and Beautification in 2025',
      description:
        'Master JavaScript formatting with our comprehensive guide covering best practices, tools, and techniques. Learn how to format, beautify, minify, and validate JavaScript code effectively.',
      image: 'https://smarttextconverter.com/blog-images/javascript-formatter-complete-guide.png',
      card: 'summary_large_image',
    });
  }

  private addStructuredData(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline:
        'JavaScript Formatter Guide: Best Practices for Code Formatting and Beautification in 2025',
      description:
        'Master JavaScript formatting with our comprehensive guide covering best practices, tools, and techniques. Learn how to format, beautify, minify, and validate JavaScript code effectively.',
      url: 'https://smarttextconverter.com/blog/javascript-formatter-complete-guide',
      datePublished: '2025-10-02',
      dateModified: '2025-10-02',
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
      image: 'https://smarttextconverter.com/blog-images/javascript-formatter-complete-guide.png',
      keywords: [
        'JavaScript formatter',
        'JS beautifier',
        'code formatting',
        'JavaScript minifier',
        'code validation',
        'ES6 conversion',
        'programming best practices',
        'developer tools',
        'JavaScript tools',
        'code quality',
      ],
      articleSection: 'Programming',
      wordCount: 2800,
      timeRequired: 'PT10M',
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
          name: 'JavaScript Formatter Guide',
          item: 'https://smarttextconverter.com/blog/javascript-formatter-complete-guide',
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

  goToJSFormatter(): void {
    this.router.navigate(['/js/formatter']);
  }

  private scrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
