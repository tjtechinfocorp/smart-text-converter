import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { SEOService } from '../../../services/seo.service';
import {
  ComparisonSchemaService,
  ComparisonData,
} from '../../../services/comparison-schema.service';
import { PerformanceService } from '../../../services/performance.service';
import {
  ComparisonTableComponent,
  ComparisonFeature,
} from '../../comparison-table/comparison-table.component';
import {
  ComparisonWidgetComponent,
  ComparisonMetric,
} from '../../comparison-widget/comparison-widget.component';

@Component({
  selector: 'app-caseconverter-org-comparison',
  standalone: true,
  imports: [CommonModule, ComparisonTableComponent, ComparisonWidgetComponent],
  templateUrl: './caseconverter-org-comparison.component.html',
  styleUrl: '../comparison-pages.scss',
})
export class CaseconverterOrgComparisonComponent implements OnInit {
  comparisonFeatures: ComparisonFeature[] = [
    {
      name: 'Case Conversion Types',
      smartTextConverter: '8+ Types',
      competitor: '5 Types',
      smartTextConverterBetter: true,
    },
    {
      name: 'Multi-language Support',
      smartTextConverter: true,
      competitor: false,
      smartTextConverterBetter: true,
    },
    {
      name: 'Additional Tools',
      smartTextConverter: '6 Tools',
      competitor: '1 Tool',
      smartTextConverterBetter: true,
    },
    {
      name: 'Dark Mode',
      smartTextConverter: true,
      competitor: false,
      smartTextConverterBetter: true,
    },
    {
      name: 'Mobile Optimization',
      smartTextConverter: 'Excellent',
      competitor: 'Basic',
      smartTextConverterBetter: true,
    },
    {
      name: 'Performance',
      smartTextConverter: 'Fast',
      competitor: 'Average',
      smartTextConverterBetter: true,
    },
    {
      name: 'User Interface',
      smartTextConverter: 'Modern',
      competitor: 'Outdated',
      smartTextConverterBetter: true,
    },
    {
      name: 'SEO Optimization',
      smartTextConverter: 'Advanced',
      competitor: 'Basic',
      smartTextConverterBetter: true,
    },
  ];

  comparisonMetrics: ComparisonMetric[] = [
    { name: 'Features Score', smartTextConverter: 9, competitor: 6, maxValue: 10 },
    { name: 'Performance Score', smartTextConverter: 9, competitor: 7, maxValue: 10 },
    { name: 'User Experience', smartTextConverter: 9, competitor: 6, maxValue: 10 },
    {
      name: 'Language Support',
      smartTextConverter: 20,
      competitor: 1,
      maxValue: 20,
      unit: ' languages',
    },
    { name: 'Additional Tools', smartTextConverter: 6, competitor: 1, maxValue: 6, unit: ' tools' },
  ];

  constructor(
    private seoService: SEOService,
    private comparisonSchemaService: ComparisonSchemaService,
    private performanceService: PerformanceService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.setSEO();
    this.setComparisonSchema();
    this.optimizeImages();
    this.scrollToTop();
  }

  private setSEO(): void {
    this.seoService.updateSEO({
      title: 'SmartTextConverter vs CaseConverter.org: Complete Comparison 2024 | Which is Better?',
      description:
        'Detailed comparison of SmartTextConverter vs CaseConverter.org. Compare features, performance, languages, and user experience. See why SmartTextConverter is the better choice.',
      keywords:
        'caseconverter.org vs smarttextconverter, case converter comparison, best case converter tool, caseconverter.org alternative, text case converter comparison, case converter features, case converter performance, multi language case converter, case converter review, case converter tool comparison',
      url: 'https://smarttextconverter.com/comparison/caseconverter-org',
      type: 'article',
      image: '/main-logo-80x80.png',
      author: 'SmartTextConverter Team',
      publishedTime: '2024-12-15T00:00:00Z',
      modifiedTime: new Date().toISOString(),
      section: 'Comparisons',
      tags: ['case converter comparison', 'text case converter', 'tool comparison', 'caseconverter.org'],
      locale: 'en',
      canonicalUrl: 'https://smarttextconverter.com/comparison/caseconverter-org',
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  goBackToBlog(): void {
    this.router.navigate(['/blog']);
  }

  private setComparisonSchema(): void {
    const comparisonData: ComparisonData = {
      title: 'SmartTextConverter vs CaseConverter.org: Complete Comparison 2024',
      description:
        'Detailed comparison of SmartTextConverter vs CaseConverter.org. Compare features, performance, languages, and user experience.',
      url: 'https://smarttextconverter.com/comparison/caseconverter-org',
      products: [
        {
          name: 'SmartTextConverter',
          url: 'https://smarttextconverter.com',
          description:
            'Advanced text case converter with 20+ languages, dark mode, and 6 additional tools',
          features: [
            '8+ case conversion types',
            '20+ language support',
            'Dark mode interface',
            '6 additional text tools',
            'Mobile optimized',
            'Fast performance',
            'Modern UI design',
            'SEO optimized',
          ],
          pros: [
            'Comprehensive feature set',
            'Multi-language support',
            'Modern user interface',
            'Additional text tools',
            'Mobile-friendly design',
          ],
          cons: ['Newer platform', 'Less brand recognition'],
          rating: 5,
          price: 'Free',
        },
        {
          name: 'CaseConverter.org',
          url: 'https://caseconverter.org',
          description: 'Basic text case converter with limited features and English-only support',
          features: [
            '5 case conversion types',
            'English only',
            'Basic interface',
            'Single tool focus',
            'Limited mobile optimization',
          ],
          pros: ['Simple to use', 'Established platform', 'Fast loading'],
          cons: [
            'Limited features',
            'No multi-language support',
            'Outdated interface',
            'No additional tools',
            'Basic mobile experience',
          ],
          rating: 3,
          price: 'Free',
        },
      ],
      verdict:
        'SmartTextConverter is the clear winner, offering superior features, multi-language support, modern interface, and comprehensive text processing capabilities compared to CaseConverter.org.',
      winner: 'SmartTextConverter',
      datePublished: '2025-09-15',
      dateModified: '2025-09-15',
      author: 'SmartTextConverter Team',
    };

    this.comparisonSchemaService.addComparisonSchemaToPage(comparisonData);
    this.comparisonSchemaService.addBreadcrumbSchemaToPage(
      '/comparison/caseconverter-org',
      'SmartTextConverter vs CaseConverter.org'
    );
  }

  private optimizeImages(): void {
    // Initialize image optimization after a short delay to ensure DOM is ready
    setTimeout(() => {
      // Performance optimizations are handled by the consolidated PerformanceBudgetService
      // No need for separate comparison image optimization service
    }, 100);
  }

  private scrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
