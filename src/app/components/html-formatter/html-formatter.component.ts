import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SEOService } from '../../services/seo.service';
import { TranslatedTextComponent } from '../translated-text/translated-text.component';

interface HtmlFormatOptions {
  indentSize: number;
  useTabs: boolean;
  preserveComments: boolean;
  compact: boolean;
  sortAttributes: boolean;
  removeEmptyAttributes: boolean;
  fixIndentation: boolean;
  addMissingTags: boolean;
  removeUnusedTags: boolean;
  minify: boolean;
  validateHtml: boolean;
  convertToXhtml: boolean;
}

interface HtmlStats {
  lines: number;
  characters: number;
  words: number;
  tags: number;
  attributes: number;
  comments: number;
  links: number;
  images: number;
  forms: number;
  size: string;
}

@Component({
  selector: 'app-html-formatter',
  templateUrl: './html-formatter.component.html',
  styleUrls: ['./html-formatter.component.scss'],
  imports: [CommonModule, FormsModule, RouterModule, TranslatedTextComponent],
  standalone: true,
})
export class HtmlFormatterComponent implements OnInit, OnDestroy {
  htmlInput: string = '';
  htmlOutput: string = '';
  isProcessing: boolean = false;
  currentView: 'formatted' | 'minified' | 'stats' | 'validate' | 'convert' = 'formatted';
  isValidHtml: boolean = true;
  htmlError: string = '';

  formatOptions: HtmlFormatOptions = {
    indentSize: 2,
    useTabs: false,
    preserveComments: true,
    compact: false,
    sortAttributes: false,
    removeEmptyAttributes: false,
    fixIndentation: true,
    addMissingTags: false,
    removeUnusedTags: false,
    minify: false,
    validateHtml: true,
    convertToXhtml: false,
  };

  htmlStats: HtmlStats = {
    lines: 0,
    characters: 0,
    words: 0,
    tags: 0,
    attributes: 0,
    comments: 0,
    links: 0,
    images: 0,
    forms: 0,
    size: '0 B',
  };

  private processingTimeout: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private seoService: SEOService
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.setupSEO();
      this.loadSampleHtml();
    }
  }

  ngOnDestroy(): void {
    if (this.processingTimeout) {
      clearTimeout(this.processingTimeout);
    }
  }

  private setupSEO(): void {
    this.seoService.updateSEO({
      title: 'HTML Formatter — Free Online HTML Beautifier & Minifier',
      description:
        'Format, beautify, minify, and validate HTML code online. Free HTML formatter with syntax highlighting, error detection, and XHTML conversion.',
      keywords:
        'html formatter, html beautifier, html minifier, html validator, code formatter, html prettifier',
      url: 'https://smarttextconverter.com/html/formatter',
      type: 'website',
      image: '/main-logo-80x80.png',
      author: 'SmartTextConverter',
      locale: 'en',
      canonicalUrl: 'https://smarttextconverter.com/html/formatter',
      structuredData: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'HTML Formatter',
          description: 'Free online HTML formatter, beautifier, minifier, and validator',
          url: '/html/formatter',
          applicationCategory: 'DeveloperApplication',
          operatingSystem: 'Any',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
          featureList: [
            'HTML Formatting',
            'Code Beautification',
            'Code Minification',
            'Syntax Validation',
            'XHTML Conversion',
            'Error Detection',
          ],
        },
      ],
    });
  }

  setView(view: string): void {
    this.currentView = view as 'formatted' | 'minified' | 'stats' | 'validate' | 'convert';
    if (view !== 'stats') {
      this.processHtml();
    }
  }

  updateFormatOptions(): void {
    if (this.currentView === 'formatted') {
      this.processHtml();
    }
  }

  processHtml(): void {
    this.isProcessing = true;
    this.isValidHtml = true;
    this.htmlError = '';

    try {
      let processedHtml = this.htmlInput;

      // Basic validation
      if (!processedHtml.trim().startsWith('<')) {
        this.isValidHtml = false;
        this.htmlError = 'Invalid HTML: Must start with an HTML tag.';
        this.htmlOutput = '';
        this.isProcessing = false;
        return;
      }

      // Process based on current view
      if (this.currentView === 'formatted') {
        processedHtml = this.beautifyHtml(processedHtml);
      } else if (this.currentView === 'minified') {
        processedHtml = this.minifyHtml(processedHtml);
      } else if (this.currentView === 'convert') {
        processedHtml = this.convertToXhtml(processedHtml);
      }

      this.htmlOutput = processedHtml;
      this.calculateStats();
    } catch (e: any) {
      this.isValidHtml = false;
      this.htmlError = e.message || 'An unknown error occurred during HTML processing.';
      this.htmlOutput = '';
    } finally {
      this.isProcessing = false;
    }
  }

  copyToClipboard(text: string): void {
    if (isPlatformBrowser(this.platformId)) {
      navigator.clipboard.writeText(text).then(() => {
        // Optionally show a toast notification
      });
    }
  }

  loadSampleHtml(): void {
    this.htmlInput = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sample HTML Document</title>
</head>
<body>
    <header>
        <h1>Welcome to Our Website</h1>
        <nav>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>
    <main>
        <section id="home">
            <h2>Home Section</h2>
            <p>This is a sample HTML document for formatting.</p>
            <img src="image.jpg" alt="Sample Image">
        </section>
    </main>
    <footer>
        <p>&copy; 2025 Sample Website. All rights reserved.</p>
    </footer>
</body>
</html>`;
    this.processHtml();
  }

  onInputChange(): void {
    if (this.processingTimeout) {
      clearTimeout(this.processingTimeout);
    }

    this.processingTimeout = setTimeout(() => {
      this.processHtml();
    }, 300);
  }

  onOptionsChange(): void {
    this.processHtml();
  }

  private beautifyHtml(html: string): string {
    return this.formatHtml(html);
  }

  private formatHtml(html: string): string {
    let formatted = html;

    // Remove extra whitespace and normalize line breaks
    formatted = formatted.replace(/\s+/g, ' ').trim();

    // Add line breaks after major tags
    formatted = formatted.replace(
      /(<\/?(?:html|head|body|header|main|footer|section|article|nav|div|ul|ol|li|h[1-6]|p|form|table|tr|td|th)>)/gi,
      '\n$1\n'
    );

    // Add indentation
    if (this.formatOptions.fixIndentation) {
      formatted = this.addIndentation(formatted);
    }

    // Sort attributes if requested
    if (this.formatOptions.sortAttributes) {
      formatted = this.sortAttributes(formatted);
    }

    // Remove empty attributes if requested
    if (this.formatOptions.removeEmptyAttributes) {
      formatted = formatted.replace(/\s+\w+=""/g, '');
    }

    // Add missing closing tags if requested
    if (this.formatOptions.addMissingTags) {
      formatted = this.addMissingTags(formatted);
    }

    return formatted.trim();
  }

  private minifyHtml(html: string): string {
    return html
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      .replace(/\s+>/g, '>')
      .replace(/<\s+/g, '<')
      .replace(/\s+=\s+/g, '=')
      .replace(/\s+"/g, '"')
      .replace(/"\s+/g, '"')
      .trim();
  }

  private addIndentation(html: string): string {
    const lines = html.split('\n');
    const indentSize = this.formatOptions.useTabs
      ? '\t'
      : ' '.repeat(this.formatOptions.indentSize);
    let indentLevel = 0;
    const result: string[] = [];

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) {
        result.push('');
        continue;
      }

      // Decrease indent for closing tags
      if (trimmedLine.startsWith('</')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }

      result.push(indentSize.repeat(indentLevel) + trimmedLine);

      // Increase indent for opening tags (but not self-closing)
      if (
        trimmedLine.startsWith('<') &&
        !trimmedLine.startsWith('</') &&
        !trimmedLine.endsWith('/>')
      ) {
        indentLevel++;
      }
    }

    return result.join('\n');
  }

  private sortAttributes(html: string): string {
    return html.replace(/<(\w+)([^>]*)>/g, (match, tagName, attributes) => {
      if (!attributes.trim()) return match;

      const attrArray = attributes.match(/\w+="[^"]*"/g) || [];
      attrArray.sort();
      return `<${tagName} ${attrArray.join(' ')}>`;
    });
  }

  private addMissingTags(html: string): string {
    // Simple implementation - in a real app, you'd use a proper HTML parser
    const openTags: string[] = [];
    const selfClosingTags = [
      'img',
      'br',
      'hr',
      'input',
      'meta',
      'link',
      'area',
      'base',
      'col',
      'embed',
      'source',
      'track',
      'wbr',
    ];

    return html.replace(/<(\/?)(\w+)([^>]*)>/g, (match, closing, tagName, attributes) => {
      if (closing) {
        // Closing tag
        const lastOpen = openTags.lastIndexOf(tagName);
        if (lastOpen !== -1) {
          openTags.splice(lastOpen, 1);
        }
        return match;
      } else if (!selfClosingTags.includes(tagName.toLowerCase()) && !match.endsWith('/>')) {
        // Opening tag
        openTags.push(tagName);
        return match;
      }
      return match;
    });
  }

  private convertToXhtml(html: string): string {
    return html
      .replace(/<(\w+)([^>]*?)(?<!\s)\s*>/g, '<$1$2 />') // Self-close tags
      .replace(/<(\w+)([^>]*?)\s*>/g, '<$1$2>') // Ensure proper closing
      .replace(/&(?![a-zA-Z0-9#]+;)/g, '&amp;') // Escape ampersands
      .replace(/<script([^>]*)>/gi, '<script$1 type="text/javascript">') // Add script type
      .replace(/<style([^>]*)>/gi, '<style$1 type="text/css">'); // Add style type
  }

  private validateHtml(html: string): void {
    this.isValidHtml = true;
    this.htmlError = '';

    try {
      // Basic HTML validation
      const openTags: string[] = [];
      const selfClosingTags = [
        'img',
        'br',
        'hr',
        'input',
        'meta',
        'link',
        'area',
        'base',
        'col',
        'embed',
        'source',
        'track',
        'wbr',
      ];

      const tagRegex = /<(\/?)(\w+)([^>]*)>/g;
      let match;

      while ((match = tagRegex.exec(html)) !== null) {
        const [, closing, tagName, attributes] = match;
        const lowerTagName = tagName.toLowerCase();

        if (closing) {
          // Closing tag
          const lastOpen = openTags.lastIndexOf(lowerTagName);
          if (lastOpen === -1) {
            this.isValidHtml = false;
            this.htmlError = `Unexpected closing tag: </${tagName}>`;
            return;
          }
          openTags.splice(lastOpen, 1);
        } else if (!selfClosingTags.includes(lowerTagName) && !match[0].endsWith('/>')) {
          // Opening tag
          openTags.push(lowerTagName);
        }
      }

      // Check for unclosed tags
      if (openTags.length > 0) {
        this.isValidHtml = false;
        this.htmlError = `Unclosed tag(s): ${openTags.join(', ')}`;
      }
    } catch (error) {
      this.isValidHtml = false;
      this.htmlError = 'HTML validation failed';
    }
  }

  private calculateStats(): void {
    const html = this.htmlInput;

    this.htmlStats = {
      lines: html.split('\n').length,
      characters: html.length,
      words: html
        .replace(/<[^>]*>/g, '')
        .split(/\s+/)
        .filter(word => word.length > 0).length,
      tags: (html.match(/<\/?[a-zA-Z][^>]*>/g) || []).length,
      attributes: (html.match(/\w+="[^"]*"/g) || []).length,
      comments: (html.match(/<!--[\s\S]*?-->/g) || []).length,
      links: (html.match(/<a[^>]*>/gi) || []).length,
      images: (html.match(/<img[^>]*>/gi) || []).length,
      forms: (html.match(/<form[^>]*>/gi) || []).length,
      size: this.formatFileSize(html.length),
    };
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private resetStats(): void {
    this.htmlStats = {
      lines: 0,
      characters: 0,
      words: 0,
      tags: 0,
      attributes: 0,
      comments: 0,
      links: 0,
      images: 0,
      forms: 0,
      size: '0 B',
    };
  }

  clearInput(): void {
    this.htmlInput = '';
    this.htmlOutput = '';
    this.resetStats();
    this.htmlError = '';
    this.isValidHtml = true;
  }

  downloadHtml(): void {
    if (isPlatformBrowser(this.platformId) && this.htmlOutput) {
      const blob = new Blob([this.htmlOutput], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'formatted.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }
}
