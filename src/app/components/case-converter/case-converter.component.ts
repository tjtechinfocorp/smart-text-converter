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
import { ThemeService } from '../../services/theme.service';
import { TextStatistics } from '../text-statistics/text-statistics';
import { TranslatedTextComponent } from '../translated-text/translated-text.component';
import { FAQDisplayComponent } from '../faq-display/faq-display.component';

@Component({
  selector: 'app-case-converter',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    TextStatistics,
    TranslatedTextComponent,
    FAQDisplayComponent,
  ],
  templateUrl: './case-converter.component.html',
  styleUrl: './case-converter.component.scss',
})
export class CaseConverterComponent implements OnInit, AfterViewInit {
  @ViewChild('inputTextarea') inputTextarea!: ElementRef<HTMLTextAreaElement>;

  inputText = signal('');
  outputText = signal('');
  selectedConversion = signal('uppercase');

  conversionTypes = [
    // BASIC CASE CONVERSIONS (Most commonly used)
    {
      value: 'uppercase',
      labelKey: 'case-converter.uppercase',
      descriptionKey: 'case-converter.uppercase-desc',
    },
    {
      value: 'lowercase',
      labelKey: 'case-converter.lowercase',
      descriptionKey: 'case-converter.lowercase-desc',
    },
    {
      value: 'titlecase',
      labelKey: 'case-converter.titlecase',
      descriptionKey: 'case-converter.titlecase-desc',
    },
    {
      value: 'sentencecase',
      labelKey: 'case-converter.sentencecase',
      descriptionKey: 'case-converter.sentencecase-desc',
    },

    // PROGRAMMING NAMING CONVENTIONS (Developer-focused)
    {
      value: 'camelcase',
      labelKey: 'case-converter.camelcase',
      descriptionKey: 'case-converter.camelcase-desc',
    },
    {
      value: 'pascalcase',
      labelKey: 'case-converter.pascalcase',
      descriptionKey: 'case-converter.pascalcase-desc',
    },
    {
      value: 'snakecase',
      labelKey: 'case-converter.snakecase',
      descriptionKey: 'case-converter.snakecase-desc',
    },
    {
      value: 'kebabcase',
      labelKey: 'case-converter.kebabcase',
      descriptionKey: 'case-converter.kebabcase-desc',
    },
    {
      value: 'dotcase',
      labelKey: 'case-converter.dotcase',
      descriptionKey: 'case-converter.dotcase-desc',
    },
    {
      value: 'pathcase',
      labelKey: 'case-converter.pathcase',
      descriptionKey: 'case-converter.pathcase-desc',
    },

    // SPECIALIZED TITLE CASES (Academic/Professional)
    {
      value: 'headlinetitlecase',
      labelKey: 'case-converter.headlinetitlecase',
      descriptionKey: 'case-converter.headlinetitlecase-desc',
    },
    {
      value: 'sentencetitlecase',
      labelKey: 'case-converter.sentencetitlecase',
      descriptionKey: 'case-converter.sentencetitlecase-desc',
    },
    {
      value: 'apatitlecase',
      labelKey: 'case-converter.apatitlecase',
      descriptionKey: 'case-converter.apatitlecase-desc',
    },

    // UTILITY CONVERSIONS (Specialized use cases)
    {
      value: 'humanize',
      labelKey: 'case-converter.humanize',
      descriptionKey: 'case-converter.humanize-desc',
    },
    {
      value: 'slugify',
      labelKey: 'case-converter.slugify',
      descriptionKey: 'case-converter.slugify-desc',
    },
    {
      value: 'lowercasefirst',
      labelKey: 'case-converter.lowercasefirst',
      descriptionKey: 'case-converter.lowercasefirst-desc',
    },
    {
      value: 'acronymuppercase',
      labelKey: 'case-converter.acronymuppercase',
      descriptionKey: 'case-converter.acronymuppercase-desc',
    },

    // FUN/STYLISTIC CONVERSIONS (Less common, decorative)
    {
      value: 'invertcase',
      labelKey: 'case-converter.invertcase',
      descriptionKey: 'case-converter.invertcase-desc',
    },
    {
      value: 'alternatingcase',
      labelKey: 'case-converter.alternatingcase',
      descriptionKey: 'case-converter.alternatingcase-desc',
    },
    {
      value: 'alternatingcaselower',
      labelKey: 'case-converter.alternatingcaselower',
      descriptionKey: 'case-converter.alternatingcaselower-desc',
    },
  ];

  constructor(
    private seoService: SEOService,
    public translationService: TranslationService,
    public themeService: ThemeService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Set SEO meta tags for case converter page using comprehensive SEO service
    this.seoService.updateSEO({
      title: 'Case Converter — Free Online Text Case Converter',
      description:
        'Free online case converter tool. Convert text to uppercase, lowercase, title case, camelCase, PascalCase, snake_case, kebab-case, and SEO-friendly slugs. No registration required.',
      keywords:
        'case converter, text converter, uppercase, lowercase, title case, camelCase, PascalCase, snake case, kebab case, slugify, text formatter, online converter',
      url: 'https://smarttextconverter.com/case-converter',
      type: 'website',
      image: '/main-logo-80x80.png',
      author: 'SmartTextConverter',
      locale: 'en',
      canonicalUrl: 'https://smarttextconverter.com/case-converter',
      structuredData: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Case Converter',
          description: 'Free online case converter tool for text transformation',
          url: 'https://smarttextconverter.com/case-converter',
          applicationCategory: 'UtilitiesApplication',
          operatingSystem: 'Web Browser',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            ratingCount: '1250',
            bestRating: '5',
            worstRating: '1',
          },
        },
      ],
    });

    // Add structured data for the case converter tool
    this.addStructuredData();
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
    this.convertText();
  }

  onConversionChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedConversion.set(target.value);
    this.convertText();
  }

  convertText(): void {
    const text = this.inputText();
    const conversion = this.selectedConversion();

    if (!text) {
      this.outputText.set('');
      return;
    }

    let result = '';

    switch (conversion) {
      case 'uppercase':
        result = text.toUpperCase();
        break;
      case 'lowercase':
        result = text.toLowerCase();
        break;
      case 'sentencecase':
        result = this.toSentenceCase(text);
        break;
      case 'titlecase':
        result = text.replace(
          /\w\S*/g,
          txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
        break;
      case 'lowercasefirst':
        result = text.replace(/\b\w/g, char => char.toLowerCase());
        break;
      case 'invertcase':
        result = this.invertCase(text);
        break;
      case 'alternatingcase':
        result = this.alternatingCase(text, true);
        break;
      case 'alternatingcaselower':
        result = this.alternatingCase(text, false);
        break;
      case 'camelcase':
        result = text
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
            index === 0 ? word.toLowerCase() : word.toUpperCase()
          )
          .replace(/\s+/g, '');
        break;
      case 'pascalcase':
        result = text
          .replace(/(?:^\w|[A-Z]|\b\w)/g, word => word.toUpperCase())
          .replace(/\s+/g, '');
        break;
      case 'snakecase':
        result = text
          .replace(/\W+/g, ' ')
          .split(/ |\B(?=[A-Z])/)
          .map(word => word.toLowerCase())
          .join('_');
        break;
      case 'kebabcase':
        result = text
          .replace(/\W+/g, ' ')
          .split(/ |\B(?=[A-Z])/)
          .map(word => word.toLowerCase())
          .join('-');
        break;
      case 'slugify':
        result = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');
        break;
      case 'headlinetitlecase':
        result = this.toHeadlineTitleCase(text);
        break;
      case 'sentencetitlecase':
        result = this.toSentenceTitleCase(text);
        break;
      case 'apatitlecase':
        result = this.toAPATitleCase(text);
        break;
      case 'acronymuppercase':
        result = this.toAcronymUppercase(text);
        break;
      case 'dotcase':
        result = this.toDotCase(text);
        break;
      case 'pathcase':
        result = this.toPathCase(text);
        break;
      case 'humanize':
        result = this.humanizeText(text);
        break;
      default:
        result = text;
    }

    this.outputText.set(result);
  }

  // Helper methods for case transformations
  private toSentenceCase(text: string): string {
    return (
      text
        .toLowerCase()
        .split(/[.!?]+/)
        .map(sentence => sentence.trim())
        .filter(sentence => sentence.length > 0)
        .map(sentence => sentence.charAt(0).toUpperCase() + sentence.slice(1))
        .join('. ') + (text.endsWith('.') ? '' : '.')
    );
  }

  private invertCase(text: string): string {
    return text
      .split('')
      .map(char => {
        if (char === char.toUpperCase() && char !== char.toLowerCase()) {
          return char.toLowerCase();
        } else if (char === char.toLowerCase() && char !== char.toUpperCase()) {
          return char.toUpperCase();
        }
        return char;
      })
      .join('');
  }

  private alternatingCase(text: string, startUppercase: boolean): string {
    let isUppercase = startUppercase;
    return text
      .split('')
      .map(char => {
        if (char.match(/[a-zA-Z]/)) {
          const result = isUppercase ? char.toUpperCase() : char.toLowerCase();
          isUppercase = !isUppercase;
          return result;
        }
        return char;
      })
      .join('');
  }

  private capitalizeWord(word: string): string {
    if (!word) return word;

    // Handle apostrophes (e.g., "don't" -> "Don't")
    const apostropheIndex = word.indexOf("'");
    if (apostropheIndex > 0) {
      return (
        word.charAt(0).toUpperCase() +
        word.slice(1, apostropheIndex + 1) +
        word.slice(apostropheIndex + 1)
      );
    }

    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  // New case conversion methods
  private toHeadlineTitleCase(text: string): string {
    const smallWords = [
      'a',
      'an',
      'and',
      'as',
      'at',
      'but',
      'by',
      'for',
      'if',
      'in',
      'of',
      'on',
      'or',
      'the',
      'to',
      'up',
      'yet',
      'nor',
      'so',
      'with',
      'from',
      'into',
      'onto',
      'upon',
      'over',
      'under',
      'through',
      'during',
      'before',
      'after',
      'above',
      'below',
      'between',
      'among',
      'against',
      'within',
      'without',
      'beyond',
      'beneath',
    ];

    return text
      .toLowerCase()
      .split(' ')
      .map((word, index, array) => {
        // Always capitalize first and last word
        if (index === 0 || index === array.length - 1) {
          return this.capitalizeWord(word);
        }

        // Don't capitalize small words unless they're the first word
        if (smallWords.includes(word)) {
          return word;
        }

        return this.capitalizeWord(word);
      })
      .join(' ');
  }

  private toSentenceTitleCase(text: string): string {
    return text
      .toLowerCase()
      .split(' ')
      .map((word, index) => {
        // Capitalize first word
        if (index === 0) {
          return this.capitalizeWord(word);
        }

        // Capitalize proper nouns (words that start with capital letter in original)
        const originalWords = text.split(' ');
        if (
          originalWords[index] &&
          originalWords[index][0] === originalWords[index][0].toUpperCase()
        ) {
          return this.capitalizeWord(word);
        }

        return word;
      })
      .join(' ');
  }

  private toAPATitleCase(text: string): string {
    const smallWords = [
      'a',
      'an',
      'and',
      'as',
      'at',
      'but',
      'by',
      'for',
      'if',
      'in',
      'of',
      'on',
      'or',
      'the',
      'to',
      'up',
      'yet',
      'nor',
      'so',
      'with',
      'from',
      'into',
      'onto',
      'upon',
      'over',
      'under',
      'through',
      'during',
      'before',
      'after',
      'above',
      'below',
      'between',
      'among',
      'against',
      'within',
      'without',
      'beyond',
      'beneath',
    ];

    return text
      .toLowerCase()
      .split(' ')
      .map((word, index, array) => {
        // Always capitalize first and last word
        if (index === 0 || index === array.length - 1) {
          return this.capitalizeWord(word);
        }

        // Capitalize words that are 4+ letters (APA rule)
        if (word.length >= 4) {
          return this.capitalizeWord(word);
        }

        // Don't capitalize small words unless they're the first word
        if (smallWords.includes(word)) {
          return word;
        }

        return this.capitalizeWord(word);
      })
      .join(' ');
  }

  private toAcronymUppercase(text: string): string {
    const commonAcronyms = [
      'ai',
      'api',
      'aws',
      'css',
      'dns',
      'ftp',
      'gps',
      'html',
      'http',
      'https',
      'id',
      'ip',
      'json',
      'pdf',
      'php',
      'ram',
      'rom',
      'rss',
      'sdk',
      'seo',
      'sql',
      'ssl',
      'tls',
      'ui',
      'url',
      'usb',
      'ux',
      'xml',
      'yaml',
      'zip',
      'cpu',
      'gpu',
      'ssd',
      'hdd',
      'wifi',
      'bluetooth',
      'nfc',
      'rfid',
      'barcode',
      'qr',
      'ar',
      'vr',
      'mr',
      'xr',
      'iot',
      'ml',
      'dl',
      'nlp',
      'cv',
      'rest',
      'graphql',
      'soap',
      'jwt',
      'oauth',
      'saml',
      'ldap',
      'sso',
      'mfa',
      '2fa',
      'otp',
      'totp',
      'hotp',
      'sms',
      'email',
      'imap',
      'pop3',
      'smtp',
      'ftp',
      'sftp',
      'ssh',
      'telnet',
      'rdp',
      'vnc',
      'vpn',
      'lan',
      'wan',
      'man',
      'pan',
      'wlan',
      'wwan',
      'gsm',
      'cdma',
      'lte',
      '5g',
      '4g',
      '3g',
      'glonass',
      'galileo',
      'beidou',
      'qzs',
      'irnss',
    ];

    return text
      .split(/\b/)
      .map(word => {
        const lowerWord = word.toLowerCase();
        if (commonAcronyms.includes(lowerWord)) {
          return word.toUpperCase();
        }
        return word;
      })
      .join('');
  }

  private addStructuredData() {
    if (isPlatformBrowser(this.platformId)) {
      const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Case Converter',
        description:
          'Free online text case converter tool. Convert between uppercase, lowercase, title case, camelCase, snake_case, and more case formats instantly.',
        url: 'https://smarttextconverter.com/case-converter',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Web Browser',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        softwareVersion: '1.0',
        datePublished: '2025-09-29',
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
          'Uppercase conversion',
          'Lowercase conversion',
          'Title case conversion',
          'CamelCase conversion',
          'Snake_case conversion',
          'Kebab-case conversion',
          'PascalCase conversion',
          'Sentence case conversion',
          'Alternating case conversion',
          'Inverse case conversion',
        ],
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          ratingCount: '1250',
          bestRating: '5',
          worstRating: '1',
        },
      };

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(structuredData);
      document.head.appendChild(script);

      // Add advanced schemas for enhanced SEO
    }
  }

  private toDotCase(text: string): string {
    return text
      .replace(/([A-Z])/g, '.$1')
      .toLowerCase()
      .replace(/^\./, '')
      .replace(/[^a-z0-9.]/g, '.')
      .replace(/\.+/g, '.')
      .replace(/^\.|\.$/g, '');
  }

  private toPathCase(text: string): string {
    return text
      .replace(/([A-Z])/g, '/$1')
      .toLowerCase()
      .replace(/^\//, '')
      .replace(/[^a-z0-9/]/g, '/')
      .replace(/\/+/g, '/')
      .replace(/^\/|\/$/g, '');
  }

  private humanizeText(text: string): string {
    return (
      text
        // Handle snake_case and kebab-case
        .replace(/[_-]/g, ' ')
        // Handle camelCase and PascalCase - add spaces before capital letters
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        // Handle dot.case and path/case
        .replace(/[./]/g, ' ')
        // Handle numbers followed by letters or vice versa
        .replace(/([a-zA-Z])(\d)/g, '$1 $2')
        .replace(/(\d)([a-zA-Z])/g, '$1 $2')
        // Normalize multiple spaces
        .replace(/\s+/g, ' ')
        .trim()
        // Convert to title case
        .split(' ')
        .map(word => {
          if (!word) return word;
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(' ')
    );
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
}
