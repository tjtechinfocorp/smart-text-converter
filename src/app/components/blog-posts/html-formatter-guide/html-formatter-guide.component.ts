import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SEOService } from '../../../services/seo.service';

@Component({
  selector: 'app-html-formatter-guide',
  templateUrl: './html-formatter-guide.component.html',
  styleUrl: './html-formatter-guide.component.scss',
  imports: [RouterModule],
  standalone: true,
})
export class HtmlFormatterGuideComponent implements OnInit {
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
      'The Complete Guide to HTML Formatting: Best Practices for Web Developers in 2025'
    );
    this.seoService.setMetaDescription(
      'Master HTML formatting with our comprehensive guide covering best practices, validation, minification, and modern web standards. Learn essential techniques for creating clean, maintainable HTML code.'
    );
    this.seoService.setMetaKeywords(
      'HTML formatting, HTML best practices, web development, HTML validation, HTML minification, XHTML conversion, code quality, developer tools, HTML standards, web standards'
    );
    this.seoService.setCanonicalURL(
      'https://smarttextconverter.com/blog/html-formatter-complete-guide'
    );

    this.seoService.setOpenGraphTags({
      title: 'The Complete Guide to HTML Formatting: Best Practices for Web Developers in 2025',
      description:
        'Master HTML formatting with our comprehensive guide covering best practices, validation, minification, and modern web standards. Learn essential techniques for creating clean, maintainable HTML code.',
      type: 'article',
      url: 'https://smarttextconverter.com/blog/html-formatter-complete-guide',
      image: 'https://smarttextconverter.com/blog-images/html-formatter-complete-guide.jpg',
    });

    this.seoService.setTwitterCardTags({
      title: 'The Complete Guide to HTML Formatting: Best Practices for Web Developers in 2025',
      description:
        'Master HTML formatting with our comprehensive guide covering best practices, validation, minification, and modern web standards. Learn essential techniques for creating clean, maintainable HTML code.',
      image: 'https://smarttextconverter.com/blog-images/html-formatter-complete-guide.jpg',
      card: 'summary_large_image',
    });
  }

  private addStructuredData(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: 'The Complete Guide to HTML Formatting: Best Practices for Web Developers in 2025',
      description:
        'Master HTML formatting with our comprehensive guide covering best practices, validation, minification, and modern web standards. Learn essential techniques for creating clean, maintainable HTML code.',
      url: 'https://smarttextconverter.com/blog/html-formatter-complete-guide',
      datePublished: '2025-10-07',
      dateModified: '2025-10-07',
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
      image: 'https://smarttextconverter.com/blog-images/html-formatter-complete-guide.jpg',
      keywords: [
        'HTML formatting',
        'HTML best practices',
        'web development',
        'HTML validation',
        'HTML minification',
        'XHTML conversion',
        'code quality',
        'developer tools',
        'HTML standards',
        'web standards',
      ],
      articleSection: 'Web Development',
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
          name: 'HTML Formatting Guide',
          item: 'https://smarttextconverter.com/blog/html-formatter-complete-guide',
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
