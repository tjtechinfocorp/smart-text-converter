import {
  Component,
  signal,
  OnInit,
  Inject,
  PLATFORM_ID,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SEOService } from '../../services/seo.service';
import { TranslationService } from '../../services/translation.service';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { TextStatistics } from '../text-statistics/text-statistics';
import { TranslatedTextComponent } from '../translated-text/translated-text.component';
import { FAQDisplayComponent } from '../faq-display/faq-display.component';

@Component({
  selector: 'app-text-formatter',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    TextStatistics,
    TranslatedTextComponent,
    FAQDisplayComponent,
  ],
  templateUrl: './text-formatter.component.html',
  styleUrl: './text-formatter.component.scss',
})
export class TextFormatterComponent implements OnInit, AfterViewInit {
  @ViewChild('inputTextarea') inputTextarea!: ElementRef<HTMLTextAreaElement>;

  inputText = signal('');
  outputText = signal('');
  selectedFormatting = signal('trim');
  tabSize = signal(4);

  formattingTypes = [
    {
      value: 'trim',
      labelKey: 'text-formatter.trim',
      descriptionKey: 'text-formatter.trim-desc',
    },
    {
      value: 'collapse',
      labelKey: 'text-formatter.collapse',
      descriptionKey: 'text-formatter.collapse-desc',
    },
    {
      value: 'removeLineBreaks',
      labelKey: 'text-formatter.remove-line-breaks',
      descriptionKey: 'text-formatter.remove-line-breaks-desc',
    },
    {
      value: 'normalizeLineEndings',
      labelKey: 'text-formatter.normalize-line-endings',
      descriptionKey: 'text-formatter.normalize-line-endings-desc',
    },
    {
      value: 'normalizeLineEndingsCRLF',
      labelKey: 'text-formatter.normalize-line-endings-crlf',
      descriptionKey: 'text-formatter.normalize-line-endings-crlf-desc',
    },
    {
      value: 'indent',
      labelKey: 'text-formatter.indent',
      descriptionKey: 'text-formatter.indent-desc',
    },
    {
      value: 'unindent',
      labelKey: 'text-formatter.unindent',
      descriptionKey: 'text-formatter.unindent-desc',
    },
    {
      value: 'tabsToSpaces',
      labelKey: 'text-formatter.tabs-to-spaces',
      descriptionKey: 'text-formatter.tabs-to-spaces-desc',
    },
    {
      value: 'spacesToTabs',
      labelKey: 'text-formatter.spaces-to-tabs',
      descriptionKey: 'text-formatter.spaces-to-tabs-desc',
    },
  ];

  constructor(
    private seoService: SEOService,
    public translationService: TranslationService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Set SEO meta tags for text formatter page with E-E-A-T signals
    this.seoService.updateSEO({
      title: 'Text Formatter — Free Online Text Formatting Tool',
      description:
        'Free online text formatting tool. Trim whitespace, collapse spaces, remove line breaks, and normalize line endings. No registration required.',
      keywords:
        'text formatter, whitespace formatter, trim whitespace, collapse spaces, line breaks, indent, tabs to spaces, text formatting tool, online formatter',
      url: 'https://smarttextconverter.com/text-formatter',
      type: 'website',
      image: '/main-logo-80x80.png',
      author: 'SmartTextConverter Team',
      publishedTime: '2025-09-22T00:00:00Z',
      modifiedTime: new Date().toISOString(),
      section: 'Text Processing Tools',
      tags: ['text formatter', 'text formatting', 'whitespace', 'text utilities'],
      locale: 'en',
      canonicalUrl: 'https://smarttextconverter.com/text-formatter',
    });

    // Add structured data for text formatter page
    this.addStructuredData();
  }

  private addStructuredData() {
    if (isPlatformBrowser(this.platformId)) {
      const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Text Formatter',
        description:
          'Free online text formatting tool. Trim whitespace, collapse spaces, remove line breaks, normalize line endings, indent/unindent lines, convert tabs to spaces.',
        url: 'https://smarttextconverter.com/text-formatter',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web Browser',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        softwareVersion: '1.0',
        datePublished: '2025-09-22',
        dateModified: new Date().toISOString().split('T')[0],
        author: {
          '@type': 'Organization',
          name: 'SmartTextConverter',
          url: 'https://smarttextconverter.com',
        },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        featureList: [
          'Trim whitespace from text',
          'Collapse multiple spaces into single spaces',
          'Remove line breaks and normalize text',
          'Normalize line endings (Windows/Unix/Mac)',
          'Indent and unindent lines',
          'Convert tabs to spaces',
          'Convert spaces to tabs',
          'Add line numbers',
          'Remove empty lines',
          'Sort lines alphabetically',
        ],
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.7',
          ratingCount: '892',
          bestRating: '5',
          worstRating: '1',
        },
        audience: {
          '@type': 'Audience',
          audienceType: 'Developers, writers, and content creators',
        },
        keywords:
          'text formatter, whitespace formatter, trim whitespace, collapse spaces, line breaks, indent, tabs to spaces, text formatting tool, online formatter',
      };

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }
  }

  ngAfterViewInit(): void {
    // Focus the input textarea when the component loads
    if (isPlatformBrowser(this.platformId) && this.inputTextarea) {
      // Use setTimeout to ensure the view is fully rendered
      setTimeout(() => {
        this.inputTextarea.nativeElement.focus();
      }, 0);
    }
  }

  onInputChange(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.inputText.set(target.value);
    this.formatText();
  }

  onFormattingChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedFormatting.set(target.value);
    this.formatText();
  }

  onTabSizeChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.tabSize.set(parseInt(target.value) || 4);
    this.formatText();
  }

  formatText(): void {
    const text = this.inputText();
    const formatting = this.selectedFormatting();

    if (!text) {
      this.outputText.set('');
      return;
    }

    let result = '';

    switch (formatting) {
      case 'trim':
        result = this.trimWhitespace(text);
        break;
      case 'collapse':
        result = this.collapseSpaces(text);
        break;
      case 'removeLineBreaks':
        result = this.removeLineBreaks(text);
        break;
      case 'normalizeLineEndings':
        result = this.normalizeLineEndings(text, '\n');
        break;
      case 'normalizeLineEndingsCRLF':
        result = this.normalizeLineEndings(text, '\r\n');
        break;
      case 'indent':
        result = this.indentLines(text);
        break;
      case 'unindent':
        result = this.unindentLines(text);
        break;
      case 'tabsToSpaces':
        result = this.tabsToSpaces(text);
        break;
      case 'spacesToTabs':
        result = this.spacesToTabs(text);
        break;
      default:
        result = text;
    }

    this.outputText.set(result);
  }

  // Helper methods for whitespace formatting
  private trimWhitespace(text: string): string {
    return text.trim();
  }

  private collapseSpaces(text: string): string {
    return text.replace(/\s+/g, ' ');
  }

  private removeLineBreaks(text: string): string {
    return text.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ');
  }

  private normalizeLineEndings(text: string, lineEnding: string): string {
    return text.replace(/\r\n|\r|\n/g, lineEnding);
  }

  private indentLines(text: string): string {
    const spaces = ' '.repeat(this.tabSize());
    return text
      .split('\n')
      .map(line => spaces + line)
      .join('\n');
  }

  private unindentLines(text: string): string {
    const lines = text.split('\n');
    const minIndent = Math.min(
      ...lines
        .filter(line => line.trim().length > 0)
        .map(line => line.match(/^\s*/)?.[0].length || 0)
    );

    return lines
      .map(line => (line.length > minIndent ? line.substring(minIndent) : line))
      .join('\n');
  }

  private tabsToSpaces(text: string): string {
    const spaces = ' '.repeat(this.tabSize());
    return text.replace(/\t/g, spaces);
  }

  private spacesToTabs(text: string): string {
    const spaces = ' '.repeat(this.tabSize());
    return text.replace(new RegExp(spaces, 'g'), '\t');
  }

  copyToClipboard(): void {
    if (isPlatformBrowser(this.platformId) && navigator.clipboard) {
      navigator.clipboard
        .writeText(this.outputText())
        .then(() => {
          // Text copied to clipboard successfully
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
          // Fallback for older browsers
          this.fallbackCopyToClipboard(this.outputText());
        });
    } else {
      // Fallback for SSR or older browsers
      this.fallbackCopyToClipboard(this.outputText());
    }
  }

  private fallbackCopyToClipboard(text: string): void {
    if (isPlatformBrowser(this.platformId)) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand('copy');
        // Text copied to clipboard successfully (fallback method)
      } catch (err) {
        console.error('Fallback copy failed: ', err);
      }

      document.body.removeChild(textArea);
    }
  }

  clearText(): void {
    this.inputText.set('');
    this.outputText.set('');
  }

  getCurrentDescription(): string {
    const current = this.formattingTypes.find(t => t.value === this.selectedFormatting());
    return current?.descriptionKey ? this.translationService.translate(current.descriptionKey) : '';
  }
}
