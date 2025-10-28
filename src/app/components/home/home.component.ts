import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SEOService } from '../../services/seo.service';
import { TranslatedTextComponent } from '../translated-text/translated-text.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule, TranslatedTextComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  features = [
    {
      titleKey: 'feature.case-conversion.title',
      descriptionKey: 'feature.case-conversion.description',
      icon: '🔤',
    },
    {
      titleKey: 'feature.text-formatting.title',
      descriptionKey: 'feature.text-formatting.description',
      icon: '📝',
    },
    {
      titleKey: 'feature.encoding-tools.title',
      descriptionKey: 'feature.encoding-tools.description',
      icon: '🔐',
    },
    {
      titleKey: 'feature.seo-tools.title',
      descriptionKey: 'feature.seo-tools.description',
      icon: '🚀',
    },
  ];

  constructor(
    private seoService: SEOService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Set SEO meta tags for home page using comprehensive SEO service
    this.seoService.updateSEO({
      title: 'Text Converter — Free Online Text Case Converter & Formatter',
      description:
        'Text Converter lets you transform text: case, formatting, encoding, generators, pipelines, SEO-friendly output. Free online text converter tool.',
      keywords:
        'text converter, case converter, uppercase, lowercase, title case, slugify, SEO tools, text formatter, online converter',
      url: 'https://smarttextconverter.com/',
      type: 'website',
      image: '/main-logo-80x80.png',
      author: 'SmartTextConverter',
      locale: 'en',
      canonicalUrl: 'https://smarttextconverter.com/',
      structuredData: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Text Converter',
          description: 'Free online text case converter and formatter',
          url: 'https://smarttextconverter.com/',
          applicationCategory: 'UtilitiesApplication',
          operatingSystem: 'Web Browser',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
        },
      ],
    });

    // Add structured data for home page
    this.addStructuredData();
  }

  private addStructuredData() {
    if (isPlatformBrowser(this.platformId)) {
      const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'SmartTextConverter',
        description:
          'Free online text converter and formatter with multiple text processing tools supporting 20 languages',
        url: 'https://smarttextconverter.com',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web Browser',
        availableLanguage: [
          'en',
          'es',
          'fr',
          'de',
          'it',
          'pt',
          'pt-br',
          'ru',
          'zh',
          'ja',
          'ar',
          'hi',
          'bn',
          'ur',
          'id',
          'tr',
          'nl',
          'pl',
          'sw',
          'fil',
        ],
        inLanguage: 'en',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        featureList: [
          'Case Converter - Convert text between uppercase, lowercase, title case, camelCase, snake_case, kebab-case',
          'Text Formatter - Trim whitespace, collapse spaces, remove line breaks, normalize text',
          'Line Tools - Sort lines, remove duplicates, number lines, reverse order, shuffle lines',
          'Encode/Decode - URL encode/decode, Base64 encode/decode, HTML escape/unescape, JSON encode',
          'Text Analyzer - Analyze text, find and replace, word frequency, text statistics',
          'Text Generator - Generate Lorem Ipsum, random text, UUIDs, extract emails and URLs',
        ],
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          ratingCount: '2847',
          bestRating: '5',
          worstRating: '1',
        },
        author: {
          '@type': 'Organization',
          name: 'SmartTextConverter',
          url: 'https://smarttextconverter.com',
        },
        audience: {
          '@type': 'Audience',
          audienceType: 'Global users requiring text processing tools',
        },
        keywords:
          'text converter, case converter, text formatter, multi language, international, global, online tools, free utilities',
        screenshot: '/main-logo-80x80.png',
        softwareVersion: '2.0',
        datePublished: '2025-09-24',
        dateModified: new Date().toISOString().split('T')[0],
      };

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }
  }
}
