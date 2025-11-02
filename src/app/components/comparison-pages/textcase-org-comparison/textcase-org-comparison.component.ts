import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { SEOService } from '../../../services/seo.service';

@Component({
  selector: 'app-textcase-org-comparison',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './textcase-org-comparison.component.html',
  styleUrl: '../comparison-pages.scss',
})
export class TextcaseOrgComparisonComponent implements OnInit {
  constructor(
    private seoService: SEOService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.setSEO();
    this.scrollToTop();
  }

  private setSEO(): void {
    this.seoService.updateSEO({
      title: 'SmartTextConverter vs TextCase.org: Complete Tool Comparison & Review 2024',
      description:
        'Compare SmartTextConverter vs TextCase.org. See which text case converter offers better features, performance, and user experience. Detailed analysis and review.',
      keywords:
        'textcase.org vs smarttextconverter, case converter comparison, textcase.org alternative, text case converter review, case converter features comparison, best case converter tool, case converter performance, text formatting tools comparison, case converter user experience, case converter tool review',
      url: 'https://smarttextconverter.com/comparison/textcase-org',
      type: 'article',
      image: '/main-logo-80x80.png',
      author: 'SmartTextConverter Team',
      publishedTime: '2024-12-15T00:00:00Z',
      modifiedTime: new Date().toISOString(),
      section: 'Comparisons',
      tags: ['case converter comparison', 'text case converter', 'tool comparison', 'textcase.org'],
      locale: 'en',
      canonicalUrl: 'https://smarttextconverter.com/comparison/textcase-org',
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

  private scrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
