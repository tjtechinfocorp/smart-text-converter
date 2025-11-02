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

interface MatchResult {
  match: string;
  index: number;
  context: string;
  lineNumber: number;
}

interface FrequencyResult {
  item: string;
  count: number;
  percentage: number;
}

@Component({
  selector: 'app-text-analyzer',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    TextStatistics,
    TranslatedTextComponent,
    FAQDisplayComponent,
  ],
  templateUrl: './text-analyzer.component.html',
  styleUrl: './text-analyzer.component.scss',
})
export class TextAnalyzerComponent implements OnInit, AfterViewInit {
  @ViewChild('inputTextarea') inputTextarea!: ElementRef<HTMLTextAreaElement>;

  inputText = signal('');
  outputText = signal('');
  selectedUtility = signal('replace');

  // Replace functionality
  findText = signal('');
  replaceText = signal('');
  useRegex = signal(false);
  regexFlags = signal('g');
  caseSensitive = signal(false);
  globalReplace = signal(true);
  multiline = signal(false);

  // Analysis results
  matchResults = signal<MatchResult[]>([]);
  wordFrequency = signal<FrequencyResult[]>([]);
  charFrequency = signal<FrequencyResult[]>([]);
  topN = signal(10);

  utilityTypes = [
    {
      value: 'replace',
      labelKey: 'text-analyzer.feature.find-replace',
      descriptionKey: 'text-analyzer.feature.find-replace-desc',
    },
    {
      value: 'findMatches',
      labelKey: 'text-analyzer.feature.find-matches',
      descriptionKey: 'text-analyzer.feature.find-matches-desc',
    },
    {
      value: 'removePunctuation',
      labelKey: 'text-analyzer.feature.remove-punctuation',
      descriptionKey: 'text-analyzer.feature.remove-punctuation-desc',
    },
    {
      value: 'removeNumbers',
      labelKey: 'text-analyzer.feature.remove-numbers',
      descriptionKey: 'text-analyzer.feature.remove-numbers-desc',
    },
    {
      value: 'keepNumbersOnly',
      labelKey: 'text-analyzer.feature.keep-numbers-only',
      descriptionKey: 'text-analyzer.feature.keep-numbers-only-desc',
    },
    {
      value: 'removeDuplicateWords',
      labelKey: 'text-analyzer.feature.remove-duplicate-words',
      descriptionKey: 'text-analyzer.feature.remove-duplicate-words-desc',
    },
    {
      value: 'wordFrequency',
      labelKey: 'text-analyzer.feature.word-frequency',
      descriptionKey: 'text-analyzer.feature.word-frequency-desc',
    },
    {
      value: 'charFrequency',
      labelKey: 'text-analyzer.feature.char-frequency',
      descriptionKey: 'text-analyzer.feature.char-frequency-desc',
    },
  ];

  constructor(
    private seoService: SEOService,
    public translationService: TranslationService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Set SEO meta tags for text analyzer page
    this.seoService.updateSEO({
      title: 'Text Analyzer — Free Online Text Analysis Tools',
      description:
        'Free online text analysis tools. Find and replace with regex, analyze word frequency, character count, and advanced text processing features.',
      keywords:
        'text analyzer, text analysis, find replace, regex, word frequency, character frequency, remove punctuation, remove numbers, text manipulation tools',
      url: 'https://smarttextconverter.com/text-analyzer',
      type: 'website',
      image: '/main-logo-80x80.png',
      author: 'SmartTextConverter Team',
      publishedTime: '2025-09-24T00:00:00Z',
      modifiedTime: new Date().toISOString(),
      section: 'Text Processing Tools',
      tags: ['text analyzer', 'text analysis', 'find replace', 'regex', 'text utilities'],
      locale: 'en',
      canonicalUrl: 'https://smarttextconverter.com/text-analyzer',
    });

    // Add structured data for text analyzer page
    this.addStructuredData();

  }

  private addStructuredData() {
    if (isPlatformBrowser(this.platformId)) {
      const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Text Analyzer',
        description:
          'Free online text analysis tools. Find and replace with regex, remove punctuation, analyze word frequency, character frequency, and more advanced text manipulation features.',
        url: 'https://smarttextconverter.com/text-analyzer',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web Browser',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        softwareVersion: '1.0',
        datePublished: '2025-09-28',
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
          'Find and replace with regular expressions',
          'Remove punctuation from text',
          'Remove numbers from text',
          'Analyze word frequency',
          'Analyze character frequency',
          'Text statistics and metrics',
          'Advanced text manipulation',
          'Pattern matching and extraction',
          'Text cleaning and normalization',
          'Content analysis and insights',
        ],
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.7',
          ratingCount: '567',
          bestRating: '5',
          worstRating: '1',
        },
        audience: {
          '@type': 'Audience',
          audienceType: 'Content creators, researchers, and data analysts',
        },
        keywords:
          'text analyzer, text analysis, find replace, regex, word frequency, character frequency, remove punctuation, remove numbers, text manipulation tools',
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

  onFindTextChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.findText.set(target.value);
    this.processText();
  }

  onReplaceTextChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.replaceText.set(target.value);
    this.processText();
  }

  onRegexToggle(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.useRegex.set(target.checked);
    this.processText();
  }

  onRegexFlagsChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.regexFlags.set(target.value);
    this.processText();
  }

  onCaseSensitiveChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.caseSensitive.set(target.checked);
    this.processText();
  }

  onGlobalReplaceChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.globalReplace.set(target.checked);
    this.processText();
  }

  onMultilineChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.multiline.set(target.checked);
    this.processText();
  }

  onTopNChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.topN.set(parseInt(target.value) || 10);
    this.processText();
  }

  processText(): void {
    const text = this.inputText();
    const utility = this.selectedUtility();

    if (!text) {
      this.outputText.set('');
      this.matchResults.set([]);
      this.wordFrequency.set([]);
      this.charFrequency.set([]);
      return;
    }

    let result = '';

    try {
      switch (utility) {
        case 'replace':
          result = this.findAndReplace(text);
          break;
        case 'findMatches':
          this.findAllMatches(text);
          result = `Found ${this.matchResults().length} matches. See results below.`;
          break;
        case 'removePunctuation':
          result = this.removePunctuation(text);
          break;
        case 'removeNumbers':
          result = this.removeNumbers(text);
          break;
        case 'keepNumbersOnly':
          result = this.keepNumbersOnly(text);
          break;
        case 'removeDuplicateWords':
          result = this.removeDuplicateWords(text);
          break;
        case 'wordFrequency':
          this.analyzeWordFrequency(text);
          result = `Word frequency analysis complete. See results below.`;
          break;
        case 'charFrequency':
          this.analyzeCharFrequency(text);
          result = `Character frequency analysis complete. See results below.`;
          break;
        default:
          result = text;
      }
    } catch (error) {
      result = `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`;
    }

    this.outputText.set(result);
  }

  // Helper methods for text modification
  private findAndReplace(text: string): string {
    const find = this.findText();
    const replace = this.replaceText();

    if (!find) return text;

    try {
      if (this.useRegex()) {
        let flags = this.regexFlags();
        if (!this.globalReplace()) {
          flags = flags.replace('g', '');
        }
        const regex = new RegExp(find, flags);
        return text.replace(regex, replace);
      } else {
        const searchText = this.caseSensitive()
          ? find
          : new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        if (this.caseSensitive()) {
          return this.globalReplace()
            ? text.replaceAll(find, replace)
            : text.replace(find, replace);
        } else {
          return text.replace(searchText, replace);
        }
      }
    } catch (error) {
      throw new Error('Invalid regex pattern');
    }
  }

  private findAllMatches(text: string): void {
    const find = this.findText();
    if (!find) {
      this.matchResults.set([]);
      return;
    }

    const results: MatchResult[] = [];
    const lines = text.split('\n');

    try {
      let regex: RegExp;
      if (this.useRegex()) {
        let flags = this.regexFlags();
        if (!this.globalReplace()) {
          flags = flags.replace('g', '');
        }
        regex = new RegExp(find, flags);
      } else {
        const escaped = find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        regex = new RegExp(escaped, this.caseSensitive() ? 'g' : 'gi');
      }

      lines.forEach((line, lineIndex) => {
        let match;
        while ((match = regex.exec(line)) !== null) {
          const start = Math.max(0, match.index - 20);
          const end = Math.min(line.length, match.index + match[0].length + 20);
          const context = line.substring(start, end);

          results.push({
            match: match[0],
            index: match.index,
            context: context,
            lineNumber: lineIndex + 1,
          });

          if (!this.globalReplace()) break;
        }
      });
    } catch (error) {
      // Handle regex errors gracefully
    }

    this.matchResults.set(results);
  }

  private removePunctuation(text: string): string {
    return text.replace(/[^\w\s]/g, '');
  }

  private removeNumbers(text: string): string {
    return text.replace(/\d/g, '');
  }

  private keepNumbersOnly(text: string): string {
    return text.replace(/\D/g, '');
  }

  private removeDuplicateWords(text: string): string {
    return text
      .split('\n')
      .map(line => {
        const words = line.split(/\s+/);
        const uniqueWords = [...new Set(words)];
        return uniqueWords.join(' ');
      })
      .join('\n');
  }

  private analyzeWordFrequency(text: string): void {
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 0);

    const frequency: { [key: string]: number } = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    const total = words.length;
    const results: FrequencyResult[] = Object.entries(frequency)
      .map(([word, count]) => ({
        item: word,
        count,
        percentage: (count / total) * 100,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, this.topN());

    this.wordFrequency.set(results);
  }

  private analyzeCharFrequency(text: string): void {
    const chars = text.split('');
    const frequency: { [key: string]: number } = {};

    chars.forEach(char => {
      if (char.trim()) {
        // Skip whitespace
        frequency[char] = (frequency[char] || 0) + 1;
      }
    });

    const total = chars.filter(char => char.trim()).length;
    const results: FrequencyResult[] = Object.entries(frequency)
      .map(([char, count]) => ({
        item: char,
        count,
        percentage: (count / total) * 100,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, this.topN());

    this.charFrequency.set(results);
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
          this.fallbackCopyToClipboard(this.outputText());
        });
    } else {
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
    this.matchResults.set([]);
    this.wordFrequency.set([]);
    this.charFrequency.set([]);
  }

  getCurrentDescription(): string {
    const current = this.utilityTypes.find(t => t.value === this.selectedUtility());
    return current?.descriptionKey ? this.translationService.translate(current.descriptionKey) : '';
  }
}
