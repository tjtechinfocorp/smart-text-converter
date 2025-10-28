import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SEOService } from '../../services/seo.service';
import { TranslationService } from '../../services/translation.service';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss'],
})
export class TermsComponent implements OnInit {
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
        title: 'Terms of Service - Smart Text Converter | Legal Terms & Conditions',
        description:
          'Terms of Service for Smart Text Converter. Read our legal terms, conditions, and user agreements for using our text conversion tools and services.',
        keywords:
          'terms of service, legal terms, user agreement, text converter terms, conditions of use, legal compliance',
        canonicalUrl: 'https://smarttextconverter.com/terms',
        imageUrl: '/main-logo-80x80.png',
      });

      // Add structured data for Terms of Service
      this.addStructuredData();
    }
  }

  private addStructuredData() {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Terms of Service - Smart Text Converter',
      description:
        'Terms of Service for Smart Text Converter covering legal terms, conditions, and user agreements.',
      url: 'https://smarttextconverter.com/terms',
      mainEntity: {
        '@type': 'Article',
        headline: 'Terms of Service - Smart Text Converter',
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
