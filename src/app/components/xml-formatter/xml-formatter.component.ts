import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SEOService } from '../../services/seo.service';
import { TranslatedTextComponent } from '../translated-text/translated-text.component';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-xml-formatter',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslatedTextComponent],
  templateUrl: './xml-formatter.component.html',
  styleUrl: './xml-formatter.component.scss',
})
export class XmlFormatterComponent implements OnInit {
  xmlInput = '';
  formattedXml = '';
  minifiedXml = '';
  convertedHtml = '';
  convertedJson = '';
  isValidXml = true;
  xmlError = '';
  indentSize = 2;
  preserveWhitespace = false;
  showLineNumbers = true;
  showAttributes = true;
  sortAttributes = false;
  removeComments = false;
  removeEmptyElements = false;
  convertToHtml = false;
  convertToJson = false;
  selectedFeature: string | null = null;
  currentView: string = 'formatted';
  statistics = {
    elements: 0,
    attributes: 0,
    comments: 0,
    textNodes: 0,
    depth: 0,
    size: 0,
  };

  constructor(
    private seoService: SEOService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Set SEO meta tags for XML formatter page
    this.seoService.updateSEO({
      title: 'XML Formatter — Free Online XML Beautifier & Validator',
      description:
        'Format, validate, minify, and beautify XML documents. Convert XML to HTML/JSON, analyze XML structure, and fix XML formatting issues.',
      keywords:
        'XML formatter, XML beautifier, XML validator, XML minifier, XML to HTML, XML to JSON, XML tools, online XML editor',
      url: 'https://smarttextconverter.com/xml-formatter',
      type: 'website',
      image: '/main-logo-80x80.png',
      author: 'SmartTextConverter',
      locale: 'en',
      canonicalUrl: 'https://smarttextconverter.com/xml-formatter',
      structuredData: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'XML Formatter',
          description: 'Free online XML formatter and beautifier tool',
          url: 'https://smarttextconverter.com/xml-formatter',
          applicationCategory: 'DeveloperApplication',
          operatingSystem: 'Any',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
          creator: {
            '@type': 'Organization',
            name: 'SmartTextConverter',
          },
        },
      ],
    });

    // Add structured data for XML formatter
    this.addStructuredData();
  }

  formatXml(): void {
    if (!this.xmlInput.trim()) {
      this.formattedXml = '';
      this.minifiedXml = '';
      this.isValidXml = true;
      this.xmlError = '';
      this.statistics = {
        elements: 0,
        attributes: 0,
        comments: 0,
        textNodes: 0,
        depth: 0,
        size: 0,
      };
      return;
    }

    try {
      // Parse XML
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(this.xmlInput, 'text/xml');

      // Check for parsing errors
      const parseError = xmlDoc.getElementsByTagName('parsererror')[0];
      if (parseError) {
        this.isValidXml = false;
        this.xmlError = parseError.textContent || 'Invalid XML format';
        this.formattedXml = '';
        this.minifiedXml = '';
        return;
      }

      this.isValidXml = true;
      this.xmlError = '';

      // Format XML
      this.formattedXml = this.prettyPrintXml(this.xmlInput, this.indentSize);

      // Minify XML
      this.minifiedXml = this.minifyXml(this.xmlInput);

      // Calculate statistics
      this.calculateStatistics(xmlDoc);
    } catch (error) {
      this.isValidXml = false;
      this.xmlError = 'Invalid XML format: ' + (error as Error).message;
      this.formattedXml = '';
      this.minifiedXml = '';
    }
  }

  private prettyPrintXml(xml: string, indent: number): string {
    let formatted = '';
    let indentLevel = 0;
    const indentStr = ' '.repeat(indent);

    // Remove existing formatting
    xml = xml.replace(/>\s*</g, '><');

    // Split by tags
    const tags = xml.split(/(<[^>]*>)/);

    for (let i = 0; i < tags.length; i++) {
      const tag = tags[i];

      if (tag.startsWith('</')) {
        // Closing tag
        indentLevel--;
        formatted += indentStr.repeat(indentLevel) + tag + '\n';
      } else if (tag.startsWith('<') && !tag.startsWith('</')) {
        // Opening tag
        formatted += indentStr.repeat(indentLevel) + tag + '\n';
        if (!tag.includes('/>')) {
          indentLevel++;
        }
      } else if (tag.trim()) {
        // Text content
        formatted += indentStr.repeat(indentLevel) + tag.trim() + '\n';
      }
    }

    return formatted.trim();
  }

  private minifyXml(xml: string): string {
    return xml
      .replace(/>\s+</g, '><') // Remove whitespace between tags
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/>\s+</g, '><') // Remove whitespace between tags again
      .trim();
  }

  private calculateStatistics(xmlDoc: Document): void {
    const elements = xmlDoc.getElementsByTagName('*');
    const comments = xmlDoc.querySelectorAll('*').length; // This is a simplified count
    const textNodes = this.countTextNodes(xmlDoc);
    const attributes = this.countAttributes(xmlDoc);
    const depth = this.calculateDepth(xmlDoc);

    this.statistics = {
      elements: elements.length,
      attributes: attributes,
      comments: comments,
      textNodes: textNodes,
      depth: depth,
      size: this.xmlInput.length,
    };
  }

  private countTextNodes(node: Node): number {
    let count = 0;
    for (let i = 0; i < node.childNodes.length; i++) {
      const child = node.childNodes[i];
      if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim()) {
        count++;
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        count += this.countTextNodes(child);
      }
    }
    return count;
  }

  private countAttributes(node: Node): number {
    let count = 0;
    if (node.nodeType === Node.ELEMENT_NODE) {
      count += (node as Element).attributes.length;
    }
    for (let i = 0; i < node.childNodes.length; i++) {
      count += this.countAttributes(node.childNodes[i]);
    }
    return count;
  }

  private calculateDepth(node: Node, currentDepth = 0): number {
    let maxDepth = currentDepth;
    for (let i = 0; i < node.childNodes.length; i++) {
      const child = node.childNodes[i];
      if (child.nodeType === Node.ELEMENT_NODE) {
        maxDepth = Math.max(maxDepth, this.calculateDepth(child, currentDepth + 1));
      }
    }
    return maxDepth;
  }

  convertToHtmlFormat(): void {
    if (!this.isValidXml || !this.xmlInput) {
      this.xmlError = 'Please enter valid XML first';
      return;
    }

    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(this.xmlInput, 'text/xml');

      // Check for parsing errors
      const parseError = xmlDoc.getElementsByTagName('parsererror')[0];
      if (parseError) {
        this.xmlError = 'Invalid XML format';
        this.convertedHtml = '';
        return;
      }

      // Convert XML to HTML-like format
      let html = this.xmlToHtml(xmlDoc.documentElement);
      this.convertedHtml = html;
      this.xmlError = '';
    } catch (error) {
      this.xmlError = 'Error converting to HTML: ' + (error as Error).message;
      this.convertedHtml = '';
    }
  }

  private xmlToHtml(element: Element): string {
    let html = `<div class="xml-element">`;
    html += `<span class="xml-tag">&lt;${element.tagName}</span>`;

    // Add attributes
    for (let i = 0; i < element.attributes.length; i++) {
      const attr = element.attributes[i];
      html += ` <span class="xml-attr">${attr.name}</span>=<span class="xml-value">"${attr.value}"</span>`;
    }

    html += `<span class="xml-tag">&gt;</span>`;

    // Add children
    for (let i = 0; i < element.childNodes.length; i++) {
      const child = element.childNodes[i];
      if (child.nodeType === Node.ELEMENT_NODE) {
        html += this.xmlToHtml(child as Element);
      } else if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim()) {
        html += `<span class="xml-text">${child.textContent}</span>`;
      }
    }

    html += `<span class="xml-tag">&lt;/${element.tagName}&gt;</span>`;
    html += `</div>`;

    return html;
  }

  convertToJsonFormat(): void {
    if (!this.isValidXml || !this.xmlInput) {
      this.xmlError = 'Please enter valid XML first';
      return;
    }

    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(this.xmlInput, 'text/xml');

      // Check for parsing errors
      const parseError = xmlDoc.getElementsByTagName('parsererror')[0];
      if (parseError) {
        this.xmlError = 'Invalid XML format';
        this.convertedJson = '';
        return;
      }

      // Convert XML to JSON
      const json = this.xmlToJson(xmlDoc.documentElement);
      this.convertedJson = JSON.stringify(json, null, this.indentSize);
      this.xmlError = '';
    } catch (error) {
      this.xmlError = 'Error converting to JSON: ' + (error as Error).message;
      this.convertedJson = '';
    }
  }

  private xmlToJson(element: Element): any {
    const result: any = {};

    // Add attributes
    if (element.attributes.length > 0) {
      result['@attributes'] = {};
      for (let i = 0; i < element.attributes.length; i++) {
        const attr = element.attributes[i];
        result['@attributes'][attr.name] = attr.value;
      }
    }

    // Add children
    const children = element.childNodes;
    const textContent = element.textContent?.trim();

    if (children.length === 0) {
      return textContent || '';
    }

    const childElements = Array.from(children).filter(
      child => child.nodeType === Node.ELEMENT_NODE
    );

    if (childElements.length === 0) {
      return textContent || '';
    }

    for (const child of childElements) {
      const childElement = child as Element;
      const childJson = this.xmlToJson(childElement);

      if (result[childElement.tagName]) {
        if (!Array.isArray(result[childElement.tagName])) {
          result[childElement.tagName] = [result[childElement.tagName]];
        }
        result[childElement.tagName].push(childJson);
      } else {
        result[childElement.tagName] = childJson;
      }
    }

    return result;
  }

  copyToClipboard(text: string): void {
    if (isPlatformBrowser(this.platformId)) {
      navigator.clipboard.writeText(text).then(() => {
        // Could add a toast notification here
      });
    }
  }

  clearAll(): void {
    this.xmlInput = '';
    this.formattedXml = '';
    this.minifiedXml = '';
    this.convertedHtml = '';
    this.convertedJson = '';
    this.isValidXml = true;
    this.xmlError = '';
    this.statistics = {
      elements: 0,
      attributes: 0,
      comments: 0,
      textNodes: 0,
      depth: 0,
      size: 0,
    };
  }

  selectFeature(feature: string): void {
    // Toggle selection - if clicking the same feature, deselect it
    if (this.selectedFeature === feature) {
      this.selectedFeature = null;
    } else {
      this.selectedFeature = feature;
    }
  }

  loadSampleXml(): void {
    this.xmlInput = `<?xml version="1.0" encoding="UTF-8"?>
<bookstore>
  <book id="1">
    <title>XML Guide</title>
    <author>John Doe</author>
    <price currency="USD">29.99</price>
    <description>Learn XML with this comprehensive guide</description>
  </book>
  <book id="2">
    <title>Web Development</title>
    <author>Jane Smith</author>
    <price currency="USD">39.99</price>
    <description>Master modern web development techniques</description>
  </book>
</bookstore>`;
    this.formatXml();
  }

  switchView(view: string): void {
    this.currentView = view;
    this.formatXml();
  }

  private addStructuredData(): void {
    if (isPlatformBrowser(this.platformId)) {
      const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'XML Formatter',
        description: 'Free online XML formatter, validator, and beautifier tool',
        url: 'https://smarttextconverter.com/xml-formatter',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Any',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        creator: {
          '@type': 'Organization',
          name: 'SmartTextConverter',
          url: 'https://smarttextconverter.com',
        },
        audience: {
          '@type': 'Audience',
          audienceType: 'Developers and data analysts',
        },
        keywords:
          'XML formatter, XML beautifier, XML validator, XML minifier, XML to HTML, XML to JSON, XML tools, online XML editor',
        screenshot: '/main-logo-80x80.png',
        softwareVersion: '2.0',
        datePublished: '2025-09-21',
        dateModified: '2025-01-04',
      };

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }
  }
}
