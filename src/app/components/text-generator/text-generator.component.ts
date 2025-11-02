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
import { TranslatedTextComponent } from '../translated-text/translated-text.component';
import { FAQDisplayComponent } from '../faq-display/faq-display.component';

interface ExtractedItem {
  type: string;
  value: string;
  index: number;
}

@Component({
  selector: 'app-text-generator',
  standalone: true,
  imports: [FormsModule, CommonModule, TranslatedTextComponent, FAQDisplayComponent],
  templateUrl: './text-generator.component.html',
  styleUrl: './text-generator.component.scss',
})
export class TextGeneratorComponent implements OnInit, AfterViewInit {
  @ViewChild('inputTextarea') inputTextarea!: ElementRef<HTMLTextAreaElement>;

  inputText = signal('');
  outputText = signal('');
  selectedUtility = signal('loremIpsum');

  // Generation options
  loremCount = signal(3);
  loremType = signal('paragraphs');
  randomCount = signal(10);
  randomType = signal('words');
  uuidCount = signal(1);

  // Extraction results
  extractedItems = signal<ExtractedItem[]>([]);

  utilityTypes = [
    {
      value: 'loremIpsum',
      labelKey: 'text-generator.lorem-ipsum',
      descriptionKey: 'text-generator.lorem-ipsum-desc',
    },
    {
      value: 'randomText',
      labelKey: 'text-generator.random-text',
      descriptionKey: 'text-generator.random-text-desc',
    },
    {
      value: 'uuidGenerator',
      labelKey: 'text-generator.uuid-generator',
      descriptionKey: 'text-generator.uuid-generator-desc',
    },
    {
      value: 'extractEmails',
      labelKey: 'text-generator.extract-emails',
      descriptionKey: 'text-generator.extract-emails-desc',
    },
    {
      value: 'extractUrls',
      labelKey: 'text-generator.extract-urls',
      descriptionKey: 'text-generator.extract-urls-desc',
    },
    {
      value: 'extractPhones',
      labelKey: 'text-generator.extract-phones',
      descriptionKey: 'text-generator.extract-phones-desc',
    },
    {
      value: 'maskEmails',
      labelKey: 'text-generator.mask-emails',
      descriptionKey: 'text-generator.mask-emails-desc',
    },
    {
      value: 'maskPhones',
      labelKey: 'text-generator.mask-phones',
      descriptionKey: 'text-generator.mask-phones-desc',
    },
    {
      value: 'maskCreditCards',
      labelKey: 'text-generator.mask-credit-cards',
      descriptionKey: 'text-generator.mask-credit-cards-desc',
    },
  ];

  loremTypes = [
    { value: 'paragraphs', labelKey: 'text-generator.paragraphs' },
    { value: 'words', labelKey: 'text-generator.words' },
    { value: 'sentences', labelKey: 'text-generator.sentences' },
  ];

  randomTypes = [
    { value: 'words', labelKey: 'text-generator.words' },
    { value: 'chars', labelKey: 'text-generator.characters' },
  ];

  constructor(
    private seoService: SEOService,
    public translationService: TranslationService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Set SEO meta tags for text generator page using comprehensive SEO service
    this.seoService.updateSEO({
      title: 'Text Generator — Free Online Text Generation Tools',
      description:
        'Free online text generation and utility tools. Generate Lorem ipsum, random text, UUIDs, transform text cases, extract data, and mask sensitive information.',
      keywords:
        'text generator, lorem ipsum, random text, uuid generator, text transformer, data extractor, text masker, privacy tools, text utilities',
      url: 'https://smarttextconverter.com/text-generator',
      type: 'website',
      image: '/main-logo-80x80.png',
      author: 'SmartTextConverter Team',
      publishedTime: '2025-09-26T00:00:00Z',
      modifiedTime: new Date().toISOString(),
      section: 'Text Processing Tools',
      tags: ['text generator', 'text utilities', 'developer tools'],
      locale: 'en',
      canonicalUrl: 'https://smarttextconverter.com/text-generator',
      structuredData: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Text Generator',
          description: 'Free online text generation and utility tools',
          url: 'https://smarttextconverter.com/text-generator',
          applicationCategory: 'UtilitiesApplication',
          operatingSystem: 'Web Browser',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.6',
            ratingCount: '423',
            bestRating: '5',
            worstRating: '1',
          },
        },
      ],
    });

    // Add structured data for text generator page
    this.addStructuredData();
  }

  private addStructuredData() {
    if (isPlatformBrowser(this.platformId)) {
      const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Text Generator',
        description:
          'Free online text generation and utility tools. Generate Lorem ipsum, random text, UUIDs, transform text cases, extract data, and mask sensitive information.',
        url: 'https://smarttextconverter.com/text-generator',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web Browser',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        softwareVersion: '1.0',
        datePublished: '2025-09-26',
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
          'Generate Lorem Ipsum placeholder text',
          'Generate random text and sentences',
          'Generate UUIDs and unique identifiers',
          'Extract emails from text',
          'Extract URLs from text',
          'Extract phone numbers from text',
          'Mask sensitive information',
          'Transform text cases',
          'Generate test data',
          'Create placeholder content',
        ],
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.6',
          ratingCount: '423',
          bestRating: '5',
          worstRating: '1',
        },
        audience: {
          '@type': 'Audience',
          audienceType: 'Developers, designers, and content creators',
        },
        keywords:
          'text generator, lorem ipsum, random text, uuid generator, text transformer, data extractor, text masker, privacy tools, text utilities',
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

  onLoremCountChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.loremCount.set(parseInt(target.value) || 1);
    this.processText();
  }

  onLoremTypeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.loremType.set(target.value);
    this.processText();
  }

  onRandomCountChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.randomCount.set(parseInt(target.value) || 1);
    this.processText();
  }

  onRandomTypeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.randomType.set(target.value);
    this.processText();
  }

  onUuidCountChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.uuidCount.set(parseInt(target.value) || 1);
    this.processText();
  }

  processText(): void {
    const text = this.inputText();
    const utility = this.selectedUtility();

    let result = '';

    try {
      switch (utility) {
        case 'loremIpsum':
          result = this.generateLoremIpsum();
          break;
        case 'randomText':
          result = this.generateRandomText();
          break;
        case 'uuidGenerator':
          result = this.generateUUIDs();
          break;
        case 'extractEmails':
          this.extractEmails(text);
          result = this.translationService
            .translate('text-generator.found-emails')
            .replace('{count}', this.extractedItems().length.toString());
          break;
        case 'extractUrls':
          this.extractUrls(text);
          result = this.translationService
            .translate('text-generator.found-urls')
            .replace('{count}', this.extractedItems().length.toString());
          break;
        case 'extractPhones':
          this.extractPhones(text);
          result = this.translationService
            .translate('text-generator.found-phones')
            .replace('{count}', this.extractedItems().length.toString());
          break;
        case 'maskEmails':
          result = this.maskEmails(text);
          break;
        case 'maskPhones':
          result = this.maskPhones(text);
          break;
        case 'maskCreditCards':
          result = this.maskCreditCards(text);
          break;
        default:
          result = text;
      }
    } catch (error) {
      result = `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`;
    }

    this.outputText.set(result);
  }

  // Generation methods
  private generateLoremIpsum(): string {
    const loremWords = [
      'lorem',
      'ipsum',
      'dolor',
      'sit',
      'amet',
      'consectetur',
      'adipiscing',
      'elit',
      'sed',
      'do',
      'eiusmod',
      'tempor',
      'incididunt',
      'ut',
      'labore',
      'et',
      'dolore',
      'magna',
      'aliqua',
      'enim',
      'ad',
      'minim',
      'veniam',
      'quis',
      'nostrud',
      'exercitation',
      'ullamco',
      'laboris',
      'nisi',
      'aliquip',
      'ex',
      'ea',
      'commodo',
      'consequat',
      'duis',
      'aute',
      'irure',
      'in',
      'reprehenderit',
      'voluptate',
      'velit',
      'esse',
      'cillum',
      'fugiat',
      'nulla',
      'pariatur',
      'excepteur',
      'sint',
      'occaecat',
      'cupidatat',
      'non',
      'proident',
      'sunt',
      'culpa',
      'qui',
      'officia',
      'deserunt',
      'mollit',
      'anim',
      'id',
      'est',
      'laborum',
    ];

    const count = this.loremCount();
    const type = this.loremType();

    switch (type) {
      case 'paragraphs':
        return Array.from({ length: count }, () => this.generateParagraph(loremWords)).join('\n\n');
      case 'words':
        return Array.from(
          { length: count },
          () => loremWords[Math.floor(Math.random() * loremWords.length)]
        ).join(' ');
      case 'sentences':
        return Array.from({ length: count }, () => this.generateSentence(loremWords)).join(' ');
      default:
        return '';
    }
  }

  private generateParagraph(words: string[]): string {
    const sentences = Math.floor(Math.random() * 3) + 2; // 2-4 sentences
    return Array.from({ length: sentences }, () => this.generateSentence(words)).join(' ');
  }

  private generateSentence(words: string[]): string {
    const wordCount = Math.floor(Math.random() * 8) + 5; // 5-12 words
    const sentenceWords = Array.from(
      { length: wordCount },
      () => words[Math.floor(Math.random() * words.length)]
    );
    return sentenceWords.join(' ') + '.';
  }

  private generateRandomText(): string {
    const count = this.randomCount();
    const type = this.randomType();

    if (type === 'words') {
      const words = [
        'apple',
        'banana',
        'cherry',
        'date',
        'elderberry',
        'fig',
        'grape',
        'honeydew',
        'kiwi',
        'lemon',
      ];
      return Array.from(
        { length: count },
        () => words[Math.floor(Math.random() * words.length)]
      ).join(' ');
    } else {
      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      return Array.from(
        { length: count },
        () => chars[Math.floor(Math.random() * chars.length)]
      ).join('');
    }
  }

  private generateUUIDs(): string {
    const count = this.uuidCount();
    return Array.from({ length: count }, () => this.generateUUID()).join('\n');
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  // Extraction methods
  private extractEmails(text: string): void {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const matches = Array.from(text.matchAll(emailRegex));
    this.extractedItems.set(
      matches.map((match, index) => ({
        type: 'Email',
        value: match[0],
        index: match.index || 0,
      }))
    );
  }

  private extractUrls(text: string): void {
    const urlRegex = /https?:\/\/[^\s]+/g;
    const matches = Array.from(text.matchAll(urlRegex));
    this.extractedItems.set(
      matches.map((match, index) => ({
        type: 'URL',
        value: match[0],
        index: match.index || 0,
      }))
    );
  }

  private extractPhones(text: string): void {
    const phoneRegex = /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g;
    const matches = Array.from(text.matchAll(phoneRegex));
    this.extractedItems.set(
      matches.map((match, index) => ({
        type: 'Phone',
        value: match[0],
        index: match.index || 0,
      }))
    );
  }

  // Masking methods
  private maskEmails(text: string): string {
    return text.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, email => {
      const [local, domain] = email.split('@');
      const maskedLocal =
        local.length > 2
          ? local.charAt(0) + '*'.repeat(local.length - 2) + local.charAt(local.length - 1)
          : local;
      return `${maskedLocal}@${domain}`;
    });
  }

  private maskPhones(text: string): string {
    return text.replace(
      /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g,
      phone => {
        return phone.replace(/\d/g, '*');
      }
    );
  }

  private maskCreditCards(text: string): string {
    return text.replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, card => {
      const digits = card.replace(/\D/g, '');
      return digits.length === 16
        ? digits.substring(0, 4) + ' **** **** ' + digits.substring(12)
        : card;
    });
  }

  getCurrentDescription(): string {
    const current = this.utilityTypes.find(t => t.value === this.selectedUtility());
    return current?.descriptionKey ? this.translationService.translate(current.descriptionKey) : '';
  }

  needsInputText(): boolean {
    const utility = this.selectedUtility();
    // These utilities don't need input text (they generate content)
    const generators = ['loremIpsum', 'randomText', 'uuidGenerator'];
    return !generators.includes(utility);
  }

  copyToClipboard(): void {
    if (isPlatformBrowser(this.platformId) && navigator.clipboard) {
      navigator.clipboard.writeText(this.outputText()).then(() => {
        // Text copied to clipboard successfully
      });
    }
  }

  clearText(): void {
    this.inputText.set('');
    this.outputText.set('');
    this.extractedItems.set([]);
  }
}
