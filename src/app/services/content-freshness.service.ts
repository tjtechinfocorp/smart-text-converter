import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface ContentMetadata {
  id: string;
  title: string;
  type: 'blog' | 'tool' | 'comparison' | 'faq';
  lastUpdated: Date;
  version: string;
  author: string;
  tags: string[];
  readTime: number;
  wordCount: number;
  freshnessScore: number;
}

export interface ContentUpdate {
  contentId: string;
  updateType: 'minor' | 'major' | 'critical';
  description: string;
  timestamp: Date;
  author: string;
}

@Injectable({
  providedIn: 'root',
})
export class ContentFreshnessService {
  private contentMetadata: Map<string, ContentMetadata> = new Map();
  private contentUpdates: ContentUpdate[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeContentTracking();
    }
  }

  private initializeContentTracking(): void {
    // Initialize content metadata for all pages
    this.initializeBlogContent();
    this.initializeToolContent();
    this.initializeComparisonContent();
    this.initializeFAQContent();
  }

  private initializeBlogContent(): void {
    const blogPosts = [
      {
        id: 'seo-best-practices',
        title: 'SEO Best Practices: Title Case vs Sentence Case for Headlines',
        type: 'blog' as const,
        lastUpdated: new Date('2024-12-19'),
        version: '1.2',
        author: 'SmartTextConverter Team',
        tags: ['SEO', 'title case', 'headlines', 'best practices'],
        readTime: 7,
        wordCount: 2500,
      },
      {
        id: 'case-conversion-guide',
        title: 'Complete Guide to Text Case Conversion: Types, Uses & Best Practices',
        type: 'blog' as const,
        lastUpdated: new Date('2024-12-18'),
        version: '1.1',
        author: 'SmartTextConverter Team',
        tags: ['case conversion', 'text formatting', 'guide'],
        readTime: 8,
        wordCount: 3000,
      },
      {
        id: 'programming-conventions',
        title: 'Programming Naming Conventions: camelCase vs snake_case vs kebab-case',
        type: 'blog' as const,
        lastUpdated: new Date('2024-12-17'),
        version: '1.0',
        author: 'SmartTextConverter Team',
        tags: ['programming', 'naming conventions', 'coding standards'],
        readTime: 6,
        wordCount: 2200,
      },
      {
        id: 'accessibility-blog',
        title: 'Accessibility in Text Formatting: Making Content Inclusive for Everyone',
        type: 'blog' as const,
        lastUpdated: new Date('2024-12-16'),
        version: '1.1',
        author: 'SmartTextConverter Team',
        tags: ['accessibility', 'inclusive design', 'WCAG'],
        readTime: 9,
        wordCount: 3200,
      },
      {
        id: 'case-conversion-best-practices',
        title: 'Case Conversion Best Practices: When and How to Use Different Text Cases',
        type: 'blog' as const,
        lastUpdated: new Date('2024-12-15'),
        version: '1.0',
        author: 'SmartTextConverter Team',
        tags: ['best practices', 'case conversion', 'text formatting'],
        readTime: 7,
        wordCount: 2600,
      },
      {
        id: 'e-commerce-case-conversion',
        title: 'E-commerce Case Conversion: Product Names, Descriptions & SEO Optimization',
        type: 'blog' as const,
        lastUpdated: new Date('2024-12-14'),
        version: '1.0',
        author: 'SmartTextConverter Team',
        tags: ['e-commerce', 'product names', 'SEO'],
        readTime: 8,
        wordCount: 2800,
      },
      {
        id: 'social-media-case-conversion',
        title: 'Social Media Case Conversion: Platform-Specific Formatting for Maximum Engagement',
        type: 'blog' as const,
        lastUpdated: new Date('2024-12-13'),
        version: '1.1',
        author: 'SmartTextConverter Team',
        tags: ['social media', 'platform formatting', 'engagement'],
        readTime: 6,
        wordCount: 2400,
      },
      {
        id: 'email-marketing-case-conversion',
        title: 'Email Marketing Case Conversion: Subject Lines, Headers & Deliverability',
        type: 'blog' as const,
        lastUpdated: new Date('2024-12-12'),
        version: '1.0',
        author: 'SmartTextConverter Team',
        tags: ['email marketing', 'subject lines', 'deliverability'],
        readTime: 7,
        wordCount: 2500,
      },
      {
        id: 'technical-documentation-case-conversion',
        title:
          'Technical Documentation Case Conversion: API Docs, User Manuals & Developer Resources',
        type: 'blog' as const,
        lastUpdated: new Date('2024-12-11'),
        version: '1.0',
        author: 'SmartTextConverter Team',
        tags: ['technical documentation', 'API docs', 'developer resources'],
        readTime: 8,
        wordCount: 2900,
      },
      {
        id: 'cms-case-conversion',
        title: 'CMS Case Conversion: WordPress, Drupal & Headless CMS Content Formatting',
        type: 'blog' as const,
        lastUpdated: new Date('2024-12-10'),
        version: '1.0',
        author: 'SmartTextConverter Team',
        tags: ['CMS', 'WordPress', 'Drupal', 'content management'],
        readTime: 7,
        wordCount: 2700,
      },
      {
        id: 'text-analysis-beyond-case-conversion',
        title: 'Text Analysis: Beyond Case Conversion - Advanced Text Processing & Analytics',
        type: 'blog' as const,
        lastUpdated: new Date('2024-12-09'),
        version: '1.0',
        author: 'SmartTextConverter Team',
        tags: ['text analysis', 'advanced processing', 'analytics'],
        readTime: 9,
        wordCount: 3100,
      },
    ];

    blogPosts.forEach(post => {
      const metadata: ContentMetadata = {
        ...post,
        freshnessScore: this.calculateFreshnessScore(post.lastUpdated),
      };
      this.contentMetadata.set(post.id, metadata);
    });
  }

  private initializeToolContent(): void {
    const tools = [
      {
        id: 'case-converter',
        title: 'Case Converter - Convert Text Between Different Cases',
        type: 'tool' as const,
        lastUpdated: new Date('2024-12-19'),
        version: '2.1',
        author: 'SmartTextConverter Team',
        tags: ['case converter', 'text transformation', 'uppercase', 'lowercase'],
        readTime: 1,
        wordCount: 500,
      },
      {
        id: 'text-formatter',
        title: 'Text Formatter - Format and Clean Your Text',
        type: 'tool' as const,
        lastUpdated: new Date('2024-12-18'),
        version: '1.8',
        author: 'SmartTextConverter Team',
        tags: ['text formatter', 'text cleaning', 'formatting'],
        readTime: 1,
        wordCount: 400,
      },
      {
        id: 'encode-decode',
        title: 'Encode/Decode - URL, Base64, HTML Encoding Tools',
        type: 'tool' as const,
        lastUpdated: new Date('2024-12-17'),
        version: '1.5',
        author: 'SmartTextConverter Team',
        tags: ['encoding', 'decoding', 'URL', 'Base64'],
        readTime: 1,
        wordCount: 450,
      },
      {
        id: 'text-analyzer',
        title: 'Text Analyzer - Analyze Text Statistics and Properties',
        type: 'tool' as const,
        lastUpdated: new Date('2024-12-16'),
        version: '1.3',
        author: 'SmartTextConverter Team',
        tags: ['text analysis', 'statistics', 'word count'],
        readTime: 1,
        wordCount: 350,
      },
      {
        id: 'text-generator',
        title: 'Text Generator - Generate Lorem Ipsum and Sample Text',
        type: 'tool' as const,
        lastUpdated: new Date('2024-12-15'),
        version: '1.2',
        author: 'SmartTextConverter Team',
        tags: ['text generator', 'lorem ipsum', 'sample text'],
        readTime: 1,
        wordCount: 300,
      },
      {
        id: 'line-tools',
        title: 'Line Tools - Line-by-Line Text Processing',
        type: 'tool' as const,
        lastUpdated: new Date('2024-12-14'),
        version: '1.1',
        author: 'SmartTextConverter Team',
        tags: ['line tools', 'text processing', 'line by line'],
        readTime: 1,
        wordCount: 400,
      },
    ];

    tools.forEach(tool => {
      const metadata: ContentMetadata = {
        ...tool,
        freshnessScore: this.calculateFreshnessScore(tool.lastUpdated),
      };
      this.contentMetadata.set(tool.id, metadata);
    });
  }

  private initializeComparisonContent(): void {
    const comparisons = [
      {
        id: 'caseconverter-org-comparison',
        title: 'SmartTextConverter vs CaseConverter.org: Complete Comparison 2024',
        type: 'comparison' as const,
        lastUpdated: new Date('2024-12-19'),
        version: '1.0',
        author: 'SmartTextConverter Team',
        tags: ['comparison', 'caseconverter.org', 'review'],
        readTime: 7,
        wordCount: 2500,
      },
      {
        id: 'convertcase-net-comparison',
        title: 'SmartTextConverter vs ConvertCase.net: Feature Comparison & Review 2024',
        type: 'comparison' as const,
        lastUpdated: new Date('2024-12-18'),
        version: '1.0',
        author: 'SmartTextConverter Team',
        tags: ['comparison', 'convertcase.net', 'review'],
        readTime: 6,
        wordCount: 2200,
      },
      {
        id: 'textcase-org-comparison',
        title: 'SmartTextConverter vs TextCase.org: Complete Tool Comparison & Review 2024',
        type: 'comparison' as const,
        lastUpdated: new Date('2024-12-17'),
        version: '1.0',
        author: 'SmartTextConverter Team',
        tags: ['comparison', 'textcase.org', 'review'],
        readTime: 6,
        wordCount: 2300,
      },
      {
        id: 'best-case-converters-2024',
        title: 'Best Case Converter Tools 2024: Complete Comparison & Reviews',
        type: 'comparison' as const,
        lastUpdated: new Date('2024-12-16'),
        version: '1.0',
        author: 'SmartTextConverter Team',
        tags: ['comparison', 'best tools', '2024 review'],
        readTime: 8,
        wordCount: 3000,
      },
    ];

    comparisons.forEach(comparison => {
      const metadata: ContentMetadata = {
        ...comparison,
        freshnessScore: this.calculateFreshnessScore(comparison.lastUpdated),
      };
      this.contentMetadata.set(comparison.id, metadata);
    });
  }

  private initializeFAQContent(): void {
    const faqs = [
      {
        id: 'case-converter-faq',
        title: 'Case Converter FAQ - Frequently Asked Questions',
        type: 'faq' as const,
        lastUpdated: new Date('2024-12-19'),
        version: '1.3',
        author: 'SmartTextConverter Team',
        tags: ['FAQ', 'case converter', 'questions'],
        readTime: 3,
        wordCount: 800,
      },
      {
        id: 'text-formatter-faq',
        title: 'Text Formatter FAQ - Common Questions and Answers',
        type: 'faq' as const,
        lastUpdated: new Date('2024-12-18'),
        version: '1.2',
        author: 'SmartTextConverter Team',
        tags: ['FAQ', 'text formatter', 'questions'],
        readTime: 3,
        wordCount: 750,
      },
      {
        id: 'encode-decode-faq',
        title: 'Encode/Decode FAQ - Encoding and Decoding Questions',
        type: 'faq' as const,
        lastUpdated: new Date('2024-12-17'),
        version: '1.1',
        author: 'SmartTextConverter Team',
        tags: ['FAQ', 'encoding', 'decoding'],
        readTime: 3,
        wordCount: 700,
      },
      {
        id: 'word-counter-faq',
        title: 'Word Counter FAQ - Text Analysis Questions',
        type: 'faq' as const,
        lastUpdated: new Date('2024-12-16'),
        version: '1.0',
        author: 'SmartTextConverter Team',
        tags: ['FAQ', 'word counter', 'text analysis'],
        readTime: 3,
        wordCount: 650,
      },
    ];

    faqs.forEach(faq => {
      const metadata: ContentMetadata = {
        ...faq,
        freshnessScore: this.calculateFreshnessScore(faq.lastUpdated),
      };
      this.contentMetadata.set(faq.id, metadata);
    });
  }

  // Public Methods
  getContentMetadata(contentId: string): ContentMetadata | undefined {
    return this.contentMetadata.get(contentId);
  }

  getAllContentMetadata(): ContentMetadata[] {
    return Array.from(this.contentMetadata.values());
  }

  getContentByType(type: 'blog' | 'tool' | 'comparison' | 'faq'): ContentMetadata[] {
    return this.getAllContentMetadata().filter(content => content.type === type);
  }

  getRecentUpdates(days: number = 30): ContentMetadata[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return this.getAllContentMetadata()
      .filter(content => content.lastUpdated >= cutoffDate)
      .sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime());
  }

  getStaleContent(days: number = 90): ContentMetadata[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return this.getAllContentMetadata()
      .filter(content => content.lastUpdated < cutoffDate)
      .sort((a, b) => a.lastUpdated.getTime() - b.lastUpdated.getTime());
  }

  updateContent(
    contentId: string,
    updateType: 'minor' | 'major' | 'critical',
    description: string,
    author: string = 'SmartTextConverter Team'
  ): void {
    const content = this.contentMetadata.get(contentId);
    if (!content) return;

    // Update content metadata
    content.lastUpdated = new Date();
    content.version = this.incrementVersion(content.version);
    content.freshnessScore = this.calculateFreshnessScore(content.lastUpdated);

    // Record the update
    const update: ContentUpdate = {
      contentId,
      updateType,
      description,
      timestamp: new Date(),
      author,
    };
    this.contentUpdates.push(update);

    // Keep only last 100 updates
    if (this.contentUpdates.length > 100) {
      this.contentUpdates.splice(0, this.contentUpdates.length - 100);
    }

    // Update localStorage
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('content_updates', JSON.stringify(this.contentUpdates));
    }
  }

  getContentUpdates(contentId?: string): ContentUpdate[] {
    if (contentId) {
      return this.contentUpdates.filter(update => update.contentId === contentId);
    }
    return this.contentUpdates;
  }

  getFreshnessScore(contentId: string): number {
    const content = this.contentMetadata.get(contentId);
    return content ? content.freshnessScore : 0;
  }

  getOverallFreshnessScore(): number {
    const allContent = this.getAllContentMetadata();
    if (allContent.length === 0) return 0;

    const totalScore = allContent.reduce((sum, content) => sum + content.freshnessScore, 0);
    return Math.round(totalScore / allContent.length);
  }

  // Private Methods
  private calculateFreshnessScore(lastUpdated: Date): number {
    const now = new Date();
    const daysSinceUpdate = Math.floor(
      (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Calculate freshness score (100 = very fresh, 0 = very stale)
    if (daysSinceUpdate <= 7) return 100;
    if (daysSinceUpdate <= 30) return 90;
    if (daysSinceUpdate <= 60) return 75;
    if (daysSinceUpdate <= 90) return 60;
    if (daysSinceUpdate <= 180) return 40;
    if (daysSinceUpdate <= 365) return 20;
    return 10;
  }

  private incrementVersion(currentVersion: string): string {
    const parts = currentVersion.split('.');
    const major = parseInt(parts[0]) || 1;
    const minor = parseInt(parts[1]) || 0;
    return `${major}.${minor + 1}`;
  }
}
