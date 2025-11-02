import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SEOService } from '../../../services/seo.service';

@Component({
  selector: 'app-developer-tools-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './developer-tools-landing.component.html',
  styleUrls: ['./developer-tools-landing.component.scss'],
})
export class DeveloperToolsLandingComponent implements OnInit {
  constructor(private seoService: SEOService) {}

  ngOnInit(): void {
    this.seoService.updateSEO({
      title: 'Free Online Developer Tools — SmartTextConverter',
      description:
        'Professional developer tools for JSON formatting, XML processing, JavaScript beautification, and code validation. Free online tools for developers, no registration required.',
      keywords:
        'developer tools, JSON formatter, XML formatter, JavaScript formatter, code beautifier, code validator, online developer tools, free coding tools, JSON parser, XML validator, JS minifier',
      url: 'https://smarttextconverter.com/developer-tools',
      type: 'website',
      image: '/main-logo-80x80.png',
      author: 'SmartTextConverter Team',
      publishedTime: '2025-09-24T00:00:00Z',
      modifiedTime: new Date().toISOString(),
      section: 'Developer Tools',
      tags: ['developer tools', 'json formatter', 'xml formatter', 'code beautifier'],
      locale: 'en',
      canonicalUrl: 'https://smarttextconverter.com/developer-tools',
      structuredData: [
        {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Free Online Developer Tools',
          description: 'Professional developer tools for JSON, XML, and JavaScript processing',
          url: 'https://smarttextconverter.com/developer-tools',
          numberOfItems: 4,
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'JSON Formatter & Parser',
              description:
                'Format, validate, and parse JSON data with syntax highlighting and error detection',
              url: 'https://smarttextconverter.com/json/formatter',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'XML Formatter',
              description: 'Format, validate, and beautify XML documents with proper indentation',
              url: 'https://smarttextconverter.com/xml/formatter',
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: 'JavaScript Formatter',
              description:
                'Format, beautify, minify, and validate JavaScript code with ES6 conversion',
              url: 'https://smarttextconverter.com/js/formatter',
            },
            {
              '@type': 'ListItem',
              position: 4,
              name: 'Text Processing Tools',
              description: 'Encode/decode, case conversion, and text analysis tools for developers',
              url: 'https://smarttextconverter.com/tools',
            },
          ],
        },
        {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'SmartTextConverter Developer Tools',
          description: 'Free online developer tools for JSON, XML, and JavaScript processing',
          url: 'https://smarttextconverter.com/developer-tools',
          applicationCategory: 'DeveloperApplication',
          operatingSystem: 'Web Browser',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.7',
            ratingCount: '2150',
            bestRating: '5',
            worstRating: '1',
          },
          featureList: [
            'JSON Formatter',
            'JSON Parser',
            'XML Formatter',
            'JavaScript Formatter',
            'Code Beautification',
            'Syntax Validation',
            'Error Detection',
            'ES6 Conversion',
          ],
          audience: {
            '@type': 'Audience',
            audienceType: 'Software developers and programmers',
          },
        },
      ],
    });
  }
}
