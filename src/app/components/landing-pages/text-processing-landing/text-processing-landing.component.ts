import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SEOService } from '../../../services/seo.service';

@Component({
  selector: 'app-text-processing-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './text-processing-landing.component.html',
  styleUrls: ['./text-processing-landing.component.scss'],
})
export class TextProcessingLandingComponent implements OnInit {
  constructor(private seoService: SEOService) {}

  ngOnInit(): void {
    this.seoService.updateSEO({
      title: 'Free Online Text Processing Tools — SmartTextConverter',
      description:
        'Comprehensive text processing tools for case conversion, text formatting, encoding/decoding, text analysis, and line manipulation. Free online tools for writers, developers, and content creators.',
      keywords:
        'text processing tools, text formatter, case converter, text analyzer, encode decode, line tools, text manipulation, online text tools, free text utilities, text statistics, word frequency',
      url: 'https://smarttextconverter.com/text-processing',
      type: 'website',
      image: '/main-logo-80x80.png',
      author: 'SmartTextConverter',
      locale: 'en',
      canonicalUrl: 'https://smarttextconverter.com/text-processing',
      structuredData: [
        {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Free Online Text Processing Tools',
          description: 'Comprehensive collection of text processing and manipulation tools',
          url: 'https://smarttextconverter.com/text-processing',
          numberOfItems: 6,
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Case Converter',
              description:
                'Convert text between uppercase, lowercase, title case, camelCase, snake_case, kebab-case',
              url: 'https://smarttextconverter.com/case-converter',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Text Formatter',
              description:
                'Format text by trimming whitespace, collapsing spaces, removing line breaks',
              url: 'https://smarttextconverter.com/text-formatter',
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: 'Line Tools',
              description:
                'Sort lines, remove duplicates, number lines, reverse order, shuffle lines',
              url: 'https://smarttextconverter.com/line-tools',
            },
            {
              '@type': 'ListItem',
              position: 4,
              name: 'Encode/Decode',
              description:
                'URL encode/decode, Base64 encode/decode, HTML escape/unescape, JSON encode',
              url: 'https://smarttextconverter.com/encode-decode',
            },
            {
              '@type': 'ListItem',
              position: 5,
              name: 'Text Analyzer',
              description: 'Analyze text, find and replace, word frequency, text statistics',
              url: 'https://smarttextconverter.com/text-analyzer',
            },
            {
              '@type': 'ListItem',
              position: 6,
              name: 'Text Generator',
              description: 'Generate Lorem Ipsum, random text, UUIDs, extract emails and URLs',
              url: 'https://smarttextconverter.com/text-generator',
            },
          ],
        },
        {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'SmartTextConverter Text Processing Tools',
          description:
            'Free online text processing and manipulation tools for writers and developers',
          url: 'https://smarttextconverter.com/text-processing',
          applicationCategory: 'UtilitiesApplication',
          operatingSystem: 'Web Browser',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.7',
            ratingCount: '1850',
            bestRating: '5',
            worstRating: '1',
          },
          featureList: [
            'Case Converter',
            'Text Formatter',
            'Line Tools',
            'Encode/Decode',
            'Text Analyzer',
            'Text Generator',
          ],
          audience: {
            '@type': 'Audience',
            audienceType: 'Writers, developers, and content creators',
          },
        },
      ],
    });
  }
}
