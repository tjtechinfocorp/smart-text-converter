import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SEOService } from '../../services/seo.service';
import { TranslationService } from '../../services/translation.service';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss'],
})
export class PrivacyComponent implements OnInit {
  private seoService = inject(SEOService);
  private translationService = inject(TranslationService);
  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Set language to English by default
      this.translationService.setLanguage('en');

      // Scroll to top
      window.scrollTo(0, 0);

      // Set SEO meta tags
      this.seoService.setMetaTags({
        title: 'Privacy Policy - Smart Text Converter | Data Protection & Privacy',
        description:
          'Comprehensive privacy policy for Smart Text Converter. Learn how we protect your data, handle text processing, and maintain your privacy while using our text conversion tools.',
        keywords:
          'privacy policy, data protection, text converter privacy, GDPR compliance, user data security, text processing privacy',
        canonicalUrl: 'https://smarttextconverter.com/privacy',
        imageUrl: '/main-logo-80x80.png',
      });

      // Add structured data for Privacy Policy
      this.addStructuredData();
    }
  }

  private addStructuredData() {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Privacy Policy - Smart Text Converter',
      description:
        'Comprehensive privacy policy for Smart Text Converter covering data protection, text processing, and user privacy.',
      url: 'https://smarttextconverter.com/privacy',
      mainEntity: {
        '@type': 'Article',
        headline: 'Privacy Policy - Smart Text Converter',
        author: {
          '@type': 'Organization',
          name: 'Smart Text Converter',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Smart Text Converter',
          logo: {
            '@type': 'ImageObject',
            url: '/main-logo-80x80.png',
          },
        },
        datePublished: '2025-09-19',
        dateModified: new Date().toISOString().split('T')[0],
      },
    };

    this.seoService.addStructuredData(structuredData);
  }
}
