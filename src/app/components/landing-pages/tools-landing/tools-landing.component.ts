import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SEOService } from '../../../services/seo.service';

@Component({
  selector: 'app-tools-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tools-landing.component.html',
  styleUrls: ['./tools-landing.component.scss'],
})
export class ToolsLandingComponent implements OnInit {
  constructor(private seoService: SEOService) {}

  ngOnInit(): void {
    this.seoService.updateSEO({
      title: 'Free Online Text Converter Tools — SmartTextConverter',
      description:
        'Discover our comprehensive collection of free online text converter tools. Case converter, text formatter, JSON/XML formatter, JavaScript formatter, and more. No registration required.',
      keywords:
        'text converter tools, online text tools, free text utilities, case converter, text formatter, JSON formatter, XML formatter, JavaScript formatter, text analyzer, encode decode',
      url: 'https://smarttextconverter.com/tools',
      type: 'website',
      image: '/main-logo-80x80.png',
      author: 'SmartTextConverter',
      locale: 'en',
      canonicalUrl: 'https://smarttextconverter.com/tools',
      structuredData: [
        {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Free Online Text Converter Tools',
          description:
            'Comprehensive collection of free online text processing and conversion tools',
          url: 'https://smarttextconverter.com/tools',
          numberOfItems: 10,
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
            {
              '@type': 'ListItem',
              position: 7,
              name: 'JSON Formatter',
              description: 'Format, validate, and beautify JSON data with syntax highlighting',
              url: 'https://smarttextconverter.com/json/formatter',
            },
            {
              '@type': 'ListItem',
              position: 8,
              name: 'JSON Parser',
              description:
                'Parse, analyze, and understand JSON data structure with detailed statistics',
              url: 'https://smarttextconverter.com/json/parser',
            },
            {
              '@type': 'ListItem',
              position: 9,
              name: 'XML Formatter',
              description: 'Format, validate, and beautify XML documents',
              url: 'https://smarttextconverter.com/xml/formatter',
            },
            {
              '@type': 'ListItem',
              position: 10,
              name: 'JavaScript Formatter',
              description: 'Format, beautify, minify, and validate JavaScript code',
              url: 'https://smarttextconverter.com/js/formatter',
            },
          ],
        },
        {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'SmartTextConverter Tools',
          description: 'Free online text converter and formatter tools collection',
          url: 'https://smarttextconverter.com/tools',
          applicationCategory: 'UtilitiesApplication',
          operatingSystem: 'Web Browser',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
          featureList: [
            'Case Converter',
            'Text Formatter',
            'Line Tools',
            'Encode/Decode',
            'Text Analyzer',
            'Text Generator',
            'JSON Formatter',
            'JSON Parser',
            'XML Formatter',
            'JavaScript Formatter',
          ],
        },
      ],
    });
  }
}
