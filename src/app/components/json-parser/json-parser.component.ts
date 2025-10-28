import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SEOService } from '../../services/seo.service';
import { FAQSchemaService } from '../../services/faq-schema.service';
import { TranslatedTextComponent } from '../translated-text/translated-text.component';
import { FAQDisplayComponent } from '../faq-display/faq-display.component';
import { createJSONEditor, Mode } from 'vanilla-jsoneditor';

@Component({
  selector: 'app-json-parser',
  templateUrl: './json-parser.component.html',
  styleUrls: ['./json-parser.component.scss'],
  imports: [CommonModule, FormsModule, RouterModule, TranslatedTextComponent, FAQDisplayComponent],
  standalone: true,
})
export class JsonParserComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('jsonEditor', { static: false }) jsonInputEditorRef!: ElementRef;
  @ViewChild('outputEditor', { static: false }) jsonOutputEditorRef!: ElementRef;

  private jsonInputEditor: any;
  private jsonOutputEditor: any;
  private retryCount: number = 0;

  jsonInput: string = '';
  jsonOutput: string = '';
  parseError: string = '';
  isProcessing: boolean = false;
  currentView: 'parsed' | 'minified' | 'stats' = 'parsed';

  sampleJson = `{
    "name": "Alice",
    "age": 30,
    "isStudent": false,
    "courses": [
      {"title": "Math", "credits": 3},
      {"title": "Science", "credits": 4}
    ],
    "address": {
      "street": "123 Main St",
      "city": "Anytown",
      "zip": "12345"
    },
    "grades": null,
    "metadata": {
      "lastUpdated": "2025-09-16T12:00:00Z",
      "version": 1.5
    }
  }`;

  constructor(
    private seoService: SEOService,
    private faqSchemaService: FAQSchemaService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.setSEO();
    this.addStructuredData();

    // Add FAQ schema markup
    this.faqSchemaService.addFAQSchemaToPage('json-parser');

    this.loadSampleJson();
    this.addKeyboardShortcuts();
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.initializeEditors();
      }, 100);
    }
  }

  ngOnDestroy(): void {
    if (this.jsonInputEditor) {
      this.jsonInputEditor.destroy();
    }
    if (this.jsonOutputEditor) {
      this.jsonOutputEditor.destroy();
    }
  }

  private initializeEditors(): void {
    if (!this.jsonInputEditorRef?.nativeElement || !this.jsonOutputEditorRef?.nativeElement) {
      console.warn('Editor elements not ready, retrying...');
      // Add a maximum retry limit to prevent infinite loops
      if (this.retryCount < 10) {
        this.retryCount++;
        setTimeout(() => this.initializeEditors(), 100);
      } else {
        console.error('Failed to initialize editors after 10 retries');
      }
      return;
    }

    try {
      this.jsonInputEditor = createJSONEditor({
        target: this.jsonInputEditorRef.nativeElement,
        props: {
          content: { text: this.jsonInput },
          mode: Mode.text,
          onChange: (content: any) => {
            this.jsonInput = content.text;
            this.parseJson();
          },
        },
      });

      this.jsonOutputEditor = createJSONEditor({
        target: this.jsonOutputEditorRef.nativeElement,
        props: {
          content: { text: this.jsonOutput },
          mode: Mode.text,
          readOnly: true,
        },
      });

      this.parseJson(); // Initial parse
    } catch (error) {
      console.error('Error initializing JSON editors:', error);
    }
  }

  parseJson(): void {
    this.isProcessing = true;
    this.parseError = '';
    try {
      const parsed = JSON.parse(this.jsonInput);

      if (this.currentView === 'parsed') {
        this.jsonOutput = JSON.stringify(parsed, null, 2);
      } else if (this.currentView === 'minified') {
        this.jsonOutput = JSON.stringify(parsed);
      } else if (this.currentView === 'stats') {
        const stats = this.generateJsonStats(parsed);
        this.jsonOutput = JSON.stringify(stats, null, 2);
      }
    } catch (error) {
      this.parseError = (error as Error).message;
      this.jsonOutput = '';
    } finally {
      this.updateOutputEditor();
      this.isProcessing = false;
    }
  }

  switchView(view: 'parsed' | 'minified' | 'stats'): void {
    this.currentView = view;
    this.parseJson();
  }

  loadSampleJson(): void {
    this.jsonInput = this.sampleJson;
    if (this.jsonInputEditor) {
      this.jsonInputEditor.updateProps({ content: { text: this.jsonInput } });
    }
    this.parseJson();
  }

  clearAll(): void {
    this.jsonInput = '';
    this.jsonOutput = '';
    this.parseError = '';

    if (this.jsonInputEditor) {
      this.jsonInputEditor.updateProps({
        content: { text: '' },
      });
    }

    this.updateOutputEditor();
  }

  async copyOutput(): Promise<void> {
    if (this.jsonOutput) {
      try {
        await navigator.clipboard.writeText(this.jsonOutput);
        console.log('Output copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    }
  }

  downloadJson(): void {
    if (!isPlatformBrowser(this.platformId) || !this.jsonOutput) {
      return;
    }

    const blob = new Blob([this.jsonOutput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `json-parser-output-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  private updateOutputEditor(): void {
    if (this.jsonOutputEditor) {
      this.jsonOutputEditor.updateProps({ content: { text: this.jsonOutput } });
    }
  }

  private generateJsonStats(obj: any): any {
    const stats = {
      // Basic Information
      type: this.getType(obj),
      size: JSON.stringify(obj).length,
      depth: this.getDepth(obj),

      // Data Type Analysis
      dataTypes: this.getDataTypeAnalysis(obj),

      // Key Analysis
      keyAnalysis: this.getKeyAnalysis(obj),

      // Value Distribution
      valueDistribution: this.getValueDistribution(obj),

      // Structure Analysis
      structureAnalysis: this.getStructureAnalysis(obj),

      // Performance Metrics
      performance: this.getPerformanceMetrics(obj),
    };

    return stats;
  }

  private getType(obj: any): string {
    if (obj === null) return 'null';
    if (Array.isArray(obj)) return 'array';
    return typeof obj;
  }

  private getDepth(obj: any, currentDepth = 0): number {
    if (obj === null || typeof obj !== 'object') return currentDepth;

    let maxDepth = currentDepth;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const depth = this.getDepth(obj[key], currentDepth + 1);
        maxDepth = Math.max(maxDepth, depth);
      }
    }
    return maxDepth;
  }

  private getDataTypeAnalysis(obj: any): any {
    const analysis = {
      strings: { count: 0, totalLength: 0, averageLength: 0, maxLength: 0, minLength: Infinity },
      numbers: {
        count: 0,
        total: 0,
        average: 0,
        max: -Infinity,
        min: Infinity,
        integers: 0,
        decimals: 0,
      },
      booleans: { count: 0, true: 0, false: 0 },
      nulls: { count: 0 },
      arrays: { count: 0, totalElements: 0, averageLength: 0, maxLength: 0, minLength: Infinity },
      objects: { count: 0, totalKeys: 0, averageKeys: 0, maxKeys: 0, minKeys: Infinity },
    };

    this.analyzeDataTypes(obj, analysis);

    // Calculate averages
    if (analysis.strings.count > 0) {
      analysis.strings.averageLength = analysis.strings.totalLength / analysis.strings.count;
      analysis.strings.minLength =
        analysis.strings.minLength === Infinity ? 0 : analysis.strings.minLength;
    }

    if (analysis.numbers.count > 0) {
      analysis.numbers.average = analysis.numbers.total / analysis.numbers.count;
      analysis.numbers.max = analysis.numbers.max === -Infinity ? 0 : analysis.numbers.max;
      analysis.numbers.min = analysis.numbers.min === Infinity ? 0 : analysis.numbers.min;
    }

    if (analysis.arrays.count > 0) {
      analysis.arrays.averageLength = analysis.arrays.totalElements / analysis.arrays.count;
      analysis.arrays.minLength =
        analysis.arrays.minLength === Infinity ? 0 : analysis.arrays.minLength;
    }

    if (analysis.objects.count > 0) {
      analysis.objects.averageKeys = analysis.objects.totalKeys / analysis.objects.count;
      analysis.objects.minKeys =
        analysis.objects.minKeys === Infinity ? 0 : analysis.objects.minKeys;
    }

    return analysis;
  }

  private analyzeDataTypes(obj: any, analysis: any): void {
    if (obj === null) {
      analysis.nulls.count++;
    } else if (Array.isArray(obj)) {
      analysis.arrays.count++;
      analysis.arrays.totalElements += obj.length;
      analysis.arrays.maxLength = Math.max(analysis.arrays.maxLength, obj.length);
      analysis.arrays.minLength = Math.min(analysis.arrays.minLength, obj.length);

      obj.forEach(item => this.analyzeDataTypes(item, analysis));
    } else if (typeof obj === 'object') {
      analysis.objects.count++;
      const keys = Object.keys(obj);
      analysis.objects.totalKeys += keys.length;
      analysis.objects.maxKeys = Math.max(analysis.objects.maxKeys, keys.length);
      analysis.objects.minKeys = Math.min(analysis.objects.minKeys, keys.length);

      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          this.analyzeDataTypes(obj[key], analysis);
        }
      }
    } else if (typeof obj === 'string') {
      analysis.strings.count++;
      analysis.strings.totalLength += obj.length;
      analysis.strings.maxLength = Math.max(analysis.strings.maxLength, obj.length);
      analysis.strings.minLength = Math.min(analysis.strings.minLength, obj.length);
    } else if (typeof obj === 'number') {
      analysis.numbers.count++;
      analysis.numbers.total += obj;
      analysis.numbers.max = Math.max(analysis.numbers.max, obj);
      analysis.numbers.min = Math.min(analysis.numbers.min, obj);

      if (Number.isInteger(obj)) {
        analysis.numbers.integers++;
      } else {
        analysis.numbers.decimals++;
      }
    } else if (typeof obj === 'boolean') {
      analysis.booleans.count++;
      if (obj) {
        analysis.booleans.true++;
      } else {
        analysis.booleans.false++;
      }
    }
  }

  private getKeyAnalysis(obj: any): any {
    const keyStats = {
      totalKeys: 0,
      uniqueKeys: new Set<string>(),
      keyPatterns: {
        camelCase: 0,
        snake_case: 0,
        kebabCase: 0,
        PascalCase: 0,
        UPPER_CASE: 0,
        lowercase: 0,
        mixed: 0,
      },
      keyLengths: {
        total: 0,
        average: 0,
        max: 0,
        min: Infinity,
      },
    };

    this.analyzeKeys(obj, keyStats, '');

    // Calculate derived statistics
    keyStats.totalKeys = keyStats.uniqueKeys.size;
    keyStats.keyLengths.average = keyStats.keyLengths.total / keyStats.uniqueKeys.size;
    keyStats.keyLengths.min = keyStats.keyLengths.min === Infinity ? 0 : keyStats.keyLengths.min;

    return {
      ...keyStats,
      uniqueKeys: Array.from(keyStats.uniqueKeys),
    };
  }

  private analyzeKeys(obj: any, keyStats: any, path: string): void {
    if (obj === null || typeof obj !== 'object') return;

    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        this.analyzeKeys(item, keyStats, `${path}[${index}]`);
      });
    } else {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const fullPath = path ? `${path}.${key}` : key;
          keyStats.uniqueKeys.add(fullPath);

          // Analyze key patterns
          this.analyzeKeyPattern(key, keyStats.keyPatterns);

          // Analyze key length
          const length = key.length;
          keyStats.keyLengths.total += length;
          keyStats.keyLengths.max = Math.max(keyStats.keyLengths.max, length);
          keyStats.keyLengths.min = Math.min(keyStats.keyLengths.min, length);

          // Analyze value types
          const value = obj[key];
          if (typeof value === 'object' && value !== null) {
            this.analyzeKeys(value, keyStats, fullPath);
          }
        }
      }
    }
  }

  private analyzeKeyPattern(key: string, patterns: any): void {
    if (/^[a-z][a-zA-Z0-9]*$/.test(key)) {
      patterns.camelCase++;
    } else if (/^[a-z]+(_[a-z]+)*$/.test(key)) {
      patterns.snake_case++;
    } else if (/^[a-z]+(-[a-z]+)*$/.test(key)) {
      patterns.kebabCase++;
    } else if (/^[A-Z][a-zA-Z0-9]*$/.test(key)) {
      patterns.PascalCase++;
    } else if (/^[A-Z_]+$/.test(key)) {
      patterns.UPPER_CASE++;
    } else if (/^[a-z]+$/.test(key)) {
      patterns.lowercase++;
    } else {
      patterns.mixed++;
    }
  }

  private getValueDistribution(obj: any): any {
    const distribution = {
      byType: {
        strings: [],
        numbers: [],
        booleans: [],
        nulls: [],
        arrays: [],
        objects: [],
      },
      byValue: new Map<string, number>(),
      patterns: {
        empty: 0,
        whitespace: 0,
        numeric: 0,
        alphanumeric: 0,
        special: 0,
      },
    };

    this.analyzeValueDistribution(obj, distribution);

    return {
      byType: {
        strings: distribution.byType.strings.slice(0, 10), // Top 10
        numbers: distribution.byType.numbers.slice(0, 10),
        booleans: distribution.byType.booleans,
        nulls: distribution.byType.nulls,
        arrays: distribution.byType.arrays.slice(0, 10),
        objects: distribution.byType.objects.slice(0, 10),
      },
      byValue: Object.fromEntries(distribution.byValue),
      patterns: distribution.patterns,
    };
  }

  private analyzeValueDistribution(obj: any, distribution: any): void {
    if (obj === null) {
      distribution.byType.nulls.push(null);
      distribution.byValue.set('null', (distribution.byValue.get('null') || 0) + 1);
    } else if (Array.isArray(obj)) {
      distribution.byType.arrays.push(obj.length);
      distribution.byValue.set(
        `array[${obj.length}]`,
        (distribution.byValue.get(`array[${obj.length}]`) || 0) + 1
      );

      obj.forEach(item => this.analyzeValueDistribution(item, distribution));
    } else if (typeof obj === 'object') {
      distribution.byType.objects.push(Object.keys(obj).length);
      distribution.byValue.set(
        `object[${Object.keys(obj).length}]`,
        (distribution.byValue.get(`object[${Object.keys(obj).length}]`) || 0) + 1
      );

      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          this.analyzeValueDistribution(obj[key], distribution);
        }
      }
    } else if (typeof obj === 'string') {
      distribution.byType.strings.push(obj);
      distribution.byValue.set(obj, (distribution.byValue.get(obj) || 0) + 1);

      // Analyze string patterns
      if (obj.trim() === '') {
        distribution.patterns.empty++;
      } else if (/^\s+$/.test(obj)) {
        distribution.patterns.whitespace++;
      } else if (/^\d+$/.test(obj)) {
        distribution.patterns.numeric++;
      } else if (/^[a-zA-Z0-9]+$/.test(obj)) {
        distribution.patterns.alphanumeric++;
      } else {
        distribution.patterns.special++;
      }
    } else if (typeof obj === 'number') {
      distribution.byType.numbers.push(obj);
      distribution.byValue.set(obj.toString(), (distribution.byValue.get(obj.toString()) || 0) + 1);
    } else if (typeof obj === 'boolean') {
      distribution.byType.booleans.push(obj);
      distribution.byValue.set(obj.toString(), (distribution.byValue.get(obj.toString()) || 0) + 1);
    }
  }

  private getStructureAnalysis(obj: any): any {
    return {
      hierarchy: this.buildHierarchy(obj),
      complexity: this.calculateComplexity(obj),
      nesting: this.analyzeNesting(obj),
    };
  }

  private buildHierarchy(obj: any, path: string = '', depth: number = 0): any {
    if (obj === null || typeof obj !== 'object') {
      return { path, type: typeof obj, value: obj, depth };
    }

    if (Array.isArray(obj)) {
      return {
        path,
        type: 'array',
        length: obj.length,
        depth,
        children: obj.map((item, index) =>
          this.buildHierarchy(item, `${path}[${index}]`, depth + 1)
        ),
      };
    }

    const hierarchy: any = {
      path,
      type: 'object',
      keys: Object.keys(obj),
      keyCount: Object.keys(obj).length,
      depth,
      children: {},
    };

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        hierarchy.children[key] = this.buildHierarchy(obj[key], `${path}.${key}`, depth + 1);
      }
    }

    return hierarchy;
  }

  private calculateComplexity(obj: any): any {
    const complexity = {
      cyclomaticComplexity: 0,
      cognitiveComplexity: 0,
      structuralComplexity: 0,
      dataComplexity: 0,
    };

    this.analyzeComplexity(obj, complexity, 0);

    return complexity;
  }

  private analyzeComplexity(obj: any, complexity: any, depth: number): void {
    if (obj === null || typeof obj !== 'object') return;

    complexity.structuralComplexity += depth;
    complexity.dataComplexity += 1;

    if (Array.isArray(obj)) {
      complexity.cyclomaticComplexity += obj.length;
      complexity.cognitiveComplexity += Math.log2(obj.length + 1);

      obj.forEach(item => this.analyzeComplexity(item, complexity, depth + 1));
    } else {
      const keys = Object.keys(obj);
      complexity.cyclomaticComplexity += keys.length;
      complexity.cognitiveComplexity += Math.log2(keys.length + 1);

      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          this.analyzeComplexity(obj[key], complexity, depth + 1);
        }
      }
    }
  }

  private analyzeNesting(obj: any): any {
    const nesting = {
      maxDepth: 0,
      averageDepth: 0,
      depthDistribution: new Map<number, number>(),
    };

    this.analyzeNestingRecursive(obj, nesting, 0);

    // Calculate average depth
    let totalDepth = 0;
    let count = 0;
    for (const [depth, frequency] of nesting.depthDistribution) {
      totalDepth += depth * frequency;
      count += frequency;
    }
    nesting.averageDepth = count > 0 ? totalDepth / count : 0;

    return {
      ...nesting,
      depthDistribution: Object.fromEntries(nesting.depthDistribution),
    };
  }

  private analyzeNestingRecursive(obj: any, nesting: any, depth: number): void {
    if (obj === null || typeof obj !== 'object') return;

    nesting.maxDepth = Math.max(nesting.maxDepth, depth);
    const count = nesting.depthDistribution.get(depth) || 0;
    nesting.depthDistribution.set(depth, count + 1);

    if (Array.isArray(obj)) {
      obj.forEach(item => this.analyzeNestingRecursive(item, nesting, depth + 1));
    } else {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          this.analyzeNestingRecursive(obj[key], nesting, depth + 1);
        }
      }
    }
  }

  private getPerformanceMetrics(obj: any): any {
    const startTime = performance.now();
    const jsonString = JSON.stringify(obj);
    const endTime = performance.now();

    return {
      serializationTime: endTime - startTime,
      size: {
        bytes: new Blob([jsonString]).size,
        characters: jsonString.length,
        compressed: Math.round(jsonString.length * 0.3),
      },
      complexity: {
        operations: this.countOperations(obj),
        memory: new Blob([jsonString]).size,
      },
    };
  }

  private countOperations(obj: any): number {
    let count = 0;
    if (obj === null || typeof obj !== 'object') return 1;

    if (Array.isArray(obj)) {
      count += obj.length;
      obj.forEach(item => (count += this.countOperations(item)));
    } else {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          count += 1;
          count += this.countOperations(obj[key]);
        }
      }
    }
    return count;
  }

  private addKeyboardShortcuts(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    document.addEventListener('keydown', event => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'Enter':
            event.preventDefault();
            this.parseJson();
            break;
          case 's':
            event.preventDefault();
            this.downloadJson();
            break;
          case 'c':
            if (event.shiftKey) {
              event.preventDefault();
              this.copyOutput();
            }
            break;
        }
      }
    });
  }

  private setSEO(): void {
    this.seoService.setTitle('JSON Parser - Free Online JSON Parsing Tool | SmartTextConverter');
    this.seoService.setMetaDescription(
      'Free online JSON parser and analyzer. Parse, analyze, and understand JSON data structure instantly. Get detailed statistics and insights about your JSON data.'
    );
    this.seoService.setMetaKeywords(
      'JSON parser, JSON analyzer, JSON statistics, JSON structure, JSON viewer, JSON editor, online JSON tool, JSON data analysis'
    );
    this.seoService.setCanonicalURL('https://smarttextconverter.com/json/parser');

    this.seoService.setOpenGraphTags({
      title: 'JSON Parser - Free Online JSON Parsing Tool',
      description:
        'Parse, analyze, and understand JSON data structure instantly. Professional JSON parsing tool for developers.',
      type: 'website',
      url: 'https://smarttextconverter.com/json/parser',
      image: '/main-logo-80x80.png',
    });

    this.seoService.setTwitterCardTags({
      title: 'JSON Parser - Free Online JSON Parsing Tool',
      description:
        'Parse, analyze, and understand JSON data structure instantly. Professional JSON parsing tool for developers.',
      image: '/main-logo-80x80.png',
      card: 'summary_large_image',
    });
  }

  private addStructuredData(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'JSON Parser',
      description: 'Free online JSON parsing and analysis tools',
      url: 'https://smarttextconverter.com/json/parser',
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
        ratingCount: '1200',
        bestRating: '5',
        worstRating: '1',
      },
      publisher: {
        '@type': 'Organization',
        name: 'SmartTextConverter',
        url: 'https://smarttextconverter.com',
      },
      audience: {
        '@type': 'Audience',
        audienceType: 'Developers and data analysts',
      },
      keywords:
        'JSON parser, JSON analyzer, JSON statistics, JSON structure, JSON viewer, JSON editor, online JSON tool, JSON data analysis',
      screenshot: '/main-logo-80x80.png',
      softwareVersion: '2.0',
      datePublished: '2025-09-16',
      dateModified: '2025-01-04',
    };

    if (isPlatformBrowser(this.platformId)) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }
  }
}
