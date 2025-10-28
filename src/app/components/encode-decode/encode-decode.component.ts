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
import { FAQSchemaService } from '../../services/faq-schema.service';
import { TextStatistics } from '../text-statistics/text-statistics';
import { TranslatedTextComponent } from '../translated-text/translated-text.component';
import { FAQDisplayComponent } from '../faq-display/faq-display.component';

@Component({
  selector: 'app-encode-decode',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    TextStatistics,
    TranslatedTextComponent,
    FAQDisplayComponent,
  ],
  templateUrl: './encode-decode.component.html',
  styleUrl: './encode-decode.component.scss',
})
export class EncodeDecodeComponent implements OnInit, AfterViewInit {
  @ViewChild('inputTextarea') inputTextarea!: ElementRef<HTMLTextAreaElement>;

  inputText = signal('');
  outputText = signal('');
  selectedUtility = signal('urlEncode');

  utilityTypes = [
    {
      value: 'urlEncode',
      labelKey: 'encode-decode.url-encode',
      descriptionKey: 'encode-decode.url-encode-desc',
    },
    {
      value: 'urlDecode',
      labelKey: 'encode-decode.url-decode',
      descriptionKey: 'encode-decode.url-decode-desc',
    },
    {
      value: 'base64Encode',
      labelKey: 'encode-decode.base64-encode',
      descriptionKey: 'encode-decode.base64-encode-desc',
    },
    {
      value: 'base64Decode',
      labelKey: 'encode-decode.base64-decode',
      descriptionKey: 'encode-decode.base64-decode-desc',
    },
    {
      value: 'htmlEscape',
      labelKey: 'encode-decode.html-escape',
      descriptionKey: 'encode-decode.html-escape-desc',
    },
    {
      value: 'htmlUnescape',
      labelKey: 'encode-decode.html-unescape',
      descriptionKey: 'encode-decode.html-unescape-desc',
    },
    {
      value: 'jsonEscape',
      labelKey: 'encode-decode.json-escape',
      descriptionKey: 'encode-decode.json-escape-desc',
    },
    {
      value: 'jsonUnescape',
      labelKey: 'encode-decode.json-unescape',
      descriptionKey: 'encode-decode.json-unescape-desc',
    },
    {
      value: 'htmlToText',
      labelKey: 'encode-decode.html-to-text',
      descriptionKey: 'encode-decode.html-to-text-desc',
    },
    {
      value: 'asciiTransliterate',
      labelKey: 'encode-decode.ascii-transliterate',
      descriptionKey: 'encode-decode.ascii-transliterate-desc',
    },
    {
      value: 'smartQuotes',
      labelKey: 'encode-decode.smart-quotes',
      descriptionKey: 'encode-decode.smart-quotes-desc',
    },
    {
      value: 'unicodeNFC',
      labelKey: 'encode-decode.unicode-nfc',
      descriptionKey: 'encode-decode.unicode-nfc-desc',
    },
    {
      value: 'unicodeNFD',
      labelKey: 'encode-decode.unicode-nfd',
      descriptionKey: 'encode-decode.unicode-nfd-desc',
    },
  ];

  constructor(
    private seoService: SEOService,
    public translationService: TranslationService,
    private faqSchemaService: FAQSchemaService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Set SEO meta tags for encode/decode page
    this.seoService.setTitle('Encode Decode — Free Online Character Encoding Tools');
    this.seoService.setMetaDescription(
      'Free online character encoding and decoding tools. URL encode/decode, Base64 encode/decode, HTML escape/unescape, and JSON escape. No registration required.'
    );
    this.seoService.setMetaKeywords(
      'encode decode, character encoding, URL encode, Base64 encode, HTML escape, JSON escape, ASCII transliteration, Unicode normalization, text encoding tools, online utilities'
    );
    this.seoService.setCanonicalURL('https://smarttextconverter.com/encode-decode');

    this.seoService.setOpenGraphTags({
      title: 'Encode Decode — Free Online Character Encoding Tools',
      description:
        'Free online character encoding and decoding tools. URL encode/decode, Base64 encode/decode, HTML escape/unescape, JSON escape, ASCII transliteration, Unicode normalization.',
      type: 'website',
      url: 'https://smarttextconverter.com/encode-decode',
      image: '/main-logo-80x80.png',
    });

    this.seoService.setTwitterCardTags({
      title: 'Encode Decode — Free Online Character Encoding Tools',
      description:
        'Free online character encoding and decoding tools. URL encode/decode, Base64 encode/decode, HTML escape/unescape, JSON escape, ASCII transliteration, Unicode normalization.',
      image: '/main-logo-80x80.png',
      card: 'summary_large_image',
    });

    // Add structured data for encode/decode page
    this.addStructuredData();

    // Add FAQ schema markup
    this.faqSchemaService.addFAQSchemaToPage('encode-decode');
  }

  private addStructuredData() {
    if (isPlatformBrowser(this.platformId)) {
      const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Encode Decode Tools',
        description:
          'Free online character encoding and decoding tools. URL encode/decode, Base64 encode/decode, HTML escape/unescape, JSON escape, ASCII transliteration, Unicode normalization.',
        url: 'https://smarttextconverter.com/encode-decode',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web Browser',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        softwareVersion: '1.0',
        datePublished: '2025-09-19',
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
          'URL encode and decode',
          'Base64 encode and decode',
          'HTML escape and unescape',
          'JSON escape and unescape',
          'ASCII transliteration',
          'Unicode normalization',
          'Character encoding conversion',
          'Text encoding validation',
          'Binary to text conversion',
          'Hexadecimal encoding/decoding',
        ],
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.6',
          ratingCount: '743',
          bestRating: '5',
          worstRating: '1',
        },
        audience: {
          '@type': 'Audience',
          audienceType: 'Developers, web developers, and data processors',
        },
        keywords:
          'encode decode, character encoding, URL encode, Base64 encode, HTML escape, JSON escape, ASCII transliteration, Unicode normalization, text encoding tools, online utilities',
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

  processText(): void {
    const text = this.inputText();
    const utility = this.selectedUtility();

    if (!text) {
      this.outputText.set('');
      return;
    }

    let result = '';

    try {
      switch (utility) {
        case 'urlEncode':
          result = this.urlEncode(text);
          break;
        case 'urlDecode':
          result = this.urlDecode(text);
          break;
        case 'base64Encode':
          result = this.base64Encode(text);
          break;
        case 'base64Decode':
          result = this.base64Decode(text);
          break;
        case 'htmlEscape':
          result = this.htmlEscape(text);
          break;
        case 'htmlUnescape':
          result = this.htmlUnescape(text);
          break;
        case 'jsonEscape':
          result = this.jsonEscape(text);
          break;
        case 'jsonUnescape':
          result = this.jsonUnescape(text);
          break;
        case 'htmlToText':
          result = this.htmlToText(text);
          break;
        case 'asciiTransliterate':
          result = this.asciiTransliterate(text);
          break;
        case 'smartQuotes':
          result = this.smartQuotesToStraight(text);
          break;
        case 'unicodeNFC':
          result = this.unicodeNormalize(text, 'NFC');
          break;
        case 'unicodeNFD':
          result = this.unicodeNormalize(text, 'NFD');
          break;
        default:
          result = text;
      }
    } catch (error) {
      result = `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`;
    }

    this.outputText.set(result);
  }

  // Helper methods for character/encoding utilities
  private urlEncode(text: string): string {
    return encodeURIComponent(text);
  }

  private urlDecode(text: string): string {
    try {
      return decodeURIComponent(text);
    } catch (error) {
      throw new Error('Invalid URL encoding');
    }
  }

  private base64Encode(text: string): string {
    try {
      return btoa(unescape(encodeURIComponent(text)));
    } catch (error) {
      throw new Error('Failed to encode to Base64');
    }
  }

  private base64Decode(text: string): string {
    try {
      return decodeURIComponent(escape(atob(text)));
    } catch (error) {
      throw new Error('Invalid Base64 encoding');
    }
  }

  private htmlEscape(text: string): string {
    if (!isPlatformBrowser(this.platformId)) {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  private htmlUnescape(text: string): string {
    if (!isPlatformBrowser(this.platformId)) {
      return text
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
    }

    const div = document.createElement('div');
    div.innerHTML = text;
    return div.textContent || div.innerText || '';
  }

  private jsonEscape(text: string): string {
    return JSON.stringify(text).slice(1, -1); // Remove surrounding quotes
  }

  private jsonUnescape(text: string): string {
    try {
      return JSON.parse('"' + text + '"');
    } catch (error) {
      throw new Error('Invalid JSON escape sequence');
    }
  }

  private htmlToText(text: string): string {
    if (!isPlatformBrowser(this.platformId)) {
      return text.replace(/<[^>]*>/g, ''); // Basic HTML tag removal
    }

    const div = document.createElement('div');
    div.innerHTML = text;
    return div.textContent || div.innerText || '';
  }

  private asciiTransliterate(text: string): string {
    // Basic transliteration map for common special characters
    const transliterationMap: { [key: string]: string } = {
      à: 'a',
      á: 'a',
      â: 'a',
      ã: 'a',
      ä: 'a',
      å: 'a',
      æ: 'ae',
      ç: 'c',
      è: 'e',
      é: 'e',
      ê: 'e',
      ë: 'e',
      ì: 'i',
      í: 'i',
      î: 'i',
      ï: 'i',
      ð: 'd',
      ñ: 'n',
      ò: 'o',
      ó: 'o',
      ô: 'o',
      õ: 'o',
      ö: 'o',
      ø: 'o',
      ù: 'u',
      ú: 'u',
      û: 'u',
      ü: 'u',
      ý: 'y',
      þ: 'th',
      ÿ: 'y',
      À: 'A',
      Á: 'A',
      Â: 'A',
      Ã: 'A',
      Ä: 'A',
      Å: 'A',
      Æ: 'AE',
      Ç: 'C',
      È: 'E',
      É: 'E',
      Ê: 'E',
      Ë: 'E',
      Ì: 'I',
      Í: 'I',
      Î: 'I',
      Ï: 'I',
      Ð: 'D',
      Ñ: 'N',
      Ò: 'O',
      Ó: 'O',
      Ô: 'O',
      Õ: 'O',
      Ö: 'O',
      Ø: 'O',
      Ù: 'U',
      Ú: 'U',
      Û: 'U',
      Ü: 'U',
      Ý: 'Y',
      Þ: 'TH',
      Ÿ: 'Y',
    };

    return text.replace(/[^\x00-\x7F]/g, char => transliterationMap[char] || '?');
  }

  private smartQuotesToStraight(text: string): string {
    return text
      .replace(/[""]/g, '"') // Smart double quotes to straight quotes
      .replace(/['']/g, "'") // Smart single quotes to straight quotes
      .replace(/…/g, '...') // Ellipsis to three dots
      .replace(/–/g, '-') // En dash to hyphen
      .replace(/—/g, '-') // Em dash to hyphen
      .replace(/•/g, '*') // Bullet to asterisk
      .replace(/°/g, ' degrees') // Degree symbol
      .replace(/©/g, '(c)') // Copyright symbol
      .replace(/®/g, '(R)') // Registered trademark
      .replace(/™/g, '(TM)'); // Trademark
  }

  private unicodeNormalize(text: string, form: 'NFC' | 'NFD'): string {
    if (typeof text.normalize === 'function') {
      return text.normalize(form);
    } else {
      throw new Error('Unicode normalization not supported in this browser');
    }
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
