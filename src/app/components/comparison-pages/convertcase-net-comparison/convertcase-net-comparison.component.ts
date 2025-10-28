import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { SEOService } from '../../../services/seo.service';

@Component({
  selector: 'app-convertcase-net-comparison',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './convertcase-net-comparison.component.html',
  styleUrl: '../comparison-pages.scss',
})
export class ConvertcaseNetComparisonComponent implements OnInit {
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
    this.seoService.setTitle(
      'SmartTextConverter vs ConvertCase.net: Feature Comparison & Review 2024'
    );
    this.seoService.setMetaDescription(
      'Compare SmartTextConverter vs ConvertCase.net. See which text case converter offers better features, performance, and user experience. Detailed analysis and review.'
    );
    this.seoService.setMetaKeywords(
      'convertcase.net vs smarttextconverter, case converter comparison, convertcase.net alternative, text case converter review, case converter features comparison, best case converter tool, case converter performance, text formatting tools comparison, case converter user experience, case converter tool review'
    );
    this.seoService.setCanonicalURL('https://smarttextconverter.com/comparison/convertcase-net');

    this.seoService.setOpenGraphTags({
      title: 'SmartTextConverter vs ConvertCase.net: Feature Comparison & Review 2024',
      description:
        'Compare SmartTextConverter vs ConvertCase.net. See which text case converter offers better features, performance, and user experience. Detailed analysis and review.',
      type: 'article',
      url: 'https://smarttextconverter.com/comparison/convertcase-net',
      image: '/main-logo-80x80.png',
    });

    this.seoService.setTwitterCardTags({
      title: 'SmartTextConverter vs ConvertCase.net: Feature Comparison & Review 2024',
      description:
        'Compare SmartTextConverter vs ConvertCase.net. See which text case converter offers better features, performance, and user experience. Detailed analysis and review.',
      image: '/main-logo-80x80.png',
      card: 'summary_large_image',
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
