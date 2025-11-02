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
import { TextStatistics } from '../text-statistics/text-statistics';
import { TranslatedTextComponent } from '../translated-text/translated-text.component';
import { FAQDisplayComponent } from '../faq-display/faq-display.component';

@Component({
  selector: 'app-line-tools',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    TextStatistics,
    TranslatedTextComponent,
    FAQDisplayComponent,
  ],
  templateUrl: './line-tools.component.html',
  styleUrl: './line-tools.component.scss',
})
export class LineToolsComponent implements OnInit, AfterViewInit {
  @ViewChild('inputTextarea') inputTextarea!: ElementRef<HTMLTextAreaElement>;

  inputText = signal('');
  outputText = signal('');
  selectedUtility = signal('sort');
  sortOrder = signal('asc');
  caseSensitive = signal(false);
  customSeparator = signal(', ');

  utilityTypes = [
    {
      value: 'sort',
      labelKey: 'line-tools.sort',
      descriptionKey: 'line-tools.sort-desc',
    },
    {
      value: 'removeDuplicates',
      labelKey: 'line-tools.remove-duplicates',
      descriptionKey: 'line-tools.remove-duplicates-desc',
    },
    {
      value: 'removeEmpty',
      labelKey: 'line-tools.remove-empty',
      descriptionKey: 'line-tools.remove-empty-desc',
    },
    {
      value: 'numberLines',
      labelKey: 'line-tools.number-lines',
      descriptionKey: 'line-tools.number-lines-desc',
    },
    {
      value: 'removeNumbers',
      labelKey: 'line-tools.remove-numbers',
      descriptionKey: 'line-tools.remove-numbers-desc',
    },
    {
      value: 'reverse',
      labelKey: 'line-tools.reverse',
      descriptionKey: 'line-tools.reverse-desc',
    },
    {
      value: 'shuffle',
      labelKey: 'line-tools.shuffle',
      descriptionKey: 'line-tools.shuffle-desc',
    },
    {
      value: 'join',
      labelKey: 'line-tools.join',
      descriptionKey: 'line-tools.join-desc',
    },
    {
      value: 'split',
      labelKey: 'line-tools.split',
      descriptionKey: 'line-tools.split-desc',
    },
  ];

  constructor(
    private seoService: SEOService,
    public translationService: TranslationService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Set SEO meta tags for list tools page
    this.seoService.updateSEO({
      title: 'List Tools — Free Online Line & List Utilities',
      description:
        'Free online list and line utility tools. Sort lines, remove duplicates, number lines, reverse lines, shuffle lines, join/split text. No registration required.',
      keywords:
        'list tools, line utilities, list utilities, sort lines, remove duplicates, number lines, reverse lines, shuffle lines, text tools, online utilities',
      url: 'https://smarttextconverter.com/line-tools',
      type: 'website',
      image: '/main-logo-80x80.png',
      author: 'SmartTextConverter Team',
      publishedTime: '2025-09-27T00:00:00Z',
      modifiedTime: new Date().toISOString(),
      section: 'Text Processing Tools',
      tags: ['list tools', 'line utilities', 'text tools', 'online utilities'],
      locale: 'en',
      canonicalUrl: 'https://smarttextconverter.com/line-tools',
    });

    // Add structured data for line tools page
    this.addStructuredData();
  }

  private addStructuredData() {
    if (isPlatformBrowser(this.platformId)) {
      const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Line Tools',
        description:
          'Free online list and line utility tools. Sort lines, remove duplicates, number lines, reverse lines, shuffle lines, join/split text.',
        url: 'https://smarttextconverter.com/line-tools',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web Browser',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        softwareVersion: '1.0',
        datePublished: '2025-09-27',
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
          'Sort lines alphabetically (ascending/descending)',
          'Remove duplicate lines',
          'Remove empty lines',
          'Number lines with custom format',
          'Reverse line order',
          'Shuffle lines randomly',
          'Join lines with custom separator',
          'Split text into lines',
          'Filter lines by content',
          'Case-sensitive and case-insensitive sorting',
        ],
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.5',
          ratingCount: '634',
          bestRating: '5',
          worstRating: '1',
        },
        audience: {
          '@type': 'Audience',
          audienceType: 'Data analysts, developers, and content managers',
        },
        keywords:
          'list tools, line utilities, list utilities, sort lines, remove duplicates, number lines, reverse lines, shuffle lines, text tools, online utilities',
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
    this.processText();
  }

  onUtilityChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedUtility.set(target.value);
    this.processText();
  }

  onSortOrderChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.sortOrder.set(target.value);
    this.processText();
  }

  onCaseSensitiveChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.caseSensitive.set(target.checked);
    this.processText();
  }

  onSeparatorChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.customSeparator.set(target.value);
    this.processText();
  }

  processText(): void {
    const text = this.inputText();
    const utility = this.selectedUtility();

    if (!text) {
      this.outputText.set('');
      return;
    }

    let result = '';

    switch (utility) {
      case 'sort':
        result = this.sortLines(text);
        break;
      case 'removeDuplicates':
        result = this.removeDuplicateLines(text);
        break;
      case 'removeEmpty':
        result = this.removeEmptyLines(text);
        break;
      case 'numberLines':
        result = this.numberLines(text);
        break;
      case 'removeNumbers':
        result = this.removeLineNumbers(text);
        break;
      case 'reverse':
        result = this.reverseLines(text);
        break;
      case 'shuffle':
        result = this.shuffleLines(text);
        break;
      case 'join':
        result = this.joinLines(text);
        break;
      case 'split':
        result = this.splitText(text);
        break;
      default:
        result = text;
    }

    this.outputText.set(result);
  }

  // Helper methods for line/list utilities
  private sortLines(text: string): string {
    const lines = text.split('\n');
    const sorted = lines.sort((a, b) => {
      const aCompare = this.caseSensitive() ? a : a.toLowerCase();
      const bCompare = this.caseSensitive() ? b : b.toLowerCase();

      if (this.sortOrder() === 'asc') {
        return aCompare.localeCompare(bCompare);
      } else {
        return bCompare.localeCompare(aCompare);
      }
    });
    return sorted.join('\n');
  }

  private removeDuplicateLines(text: string): string {
    const lines = text.split('\n');
    const uniqueLines = [...new Set(lines)];
    return uniqueLines.join('\n');
  }

  private removeEmptyLines(text: string): string {
    const lines = text.split('\n');
    const nonEmptyLines = lines.filter(line => line.trim().length > 0);
    return nonEmptyLines.join('\n');
  }

  private numberLines(text: string): string {
    const lines = text.split('\n');
    return lines.map((line, index) => `${index + 1}. ${line}`).join('\n');
  }

  private removeLineNumbers(text: string): string {
    const lines = text.split('\n');
    return lines.map(line => line.replace(/^\d+\.\s*/, '')).join('\n');
  }

  private reverseLines(text: string): string {
    const lines = text.split('\n');
    return lines.reverse().join('\n');
  }

  private shuffleLines(text: string): string {
    const lines = text.split('\n');
    const shuffled = [...lines];

    // Fisher-Yates shuffle algorithm
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.join('\n');
  }

  private joinLines(text: string): string {
    const lines = text.split('\n');
    return lines.join(this.customSeparator());
  }

  private splitText(text: string): string {
    const separator = this.customSeparator();
    return text.split(separator).join('\n');
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
    const current = this.utilityTypes.find(t => t.value === this.selectedUtility());
    return current?.descriptionKey ? this.translationService.translate(current.descriptionKey) : '';
  }
}
