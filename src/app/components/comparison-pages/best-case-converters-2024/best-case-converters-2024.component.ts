import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { SEOService } from '../../../services/seo.service';

@Component({
  selector: 'app-best-case-converters-2024',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './best-case-converters-2024.component.html',
  styleUrl: '../comparison-pages.scss',
})
export class BestCaseConverters2024Component implements OnInit {
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
      title: 'Best Case Converter Tools 2024: Complete Comparison & Reviews | SmartTextConverter',
      description:
        'Discover the best case converter tools in 2024. Compare SmartTextConverter, CaseConverter.org, ConvertCase.net, and TextCase.org. Find the perfect text case converter for your needs.',
      keywords:
        'best case converter tools 2024, case converter comparison, text case converter review, case converter tools ranking, best text formatting tools, case converter features comparison, text case converter performance, case converter user experience, case converter tool review, text formatting tools 2024',
      url: 'https://smarttextconverter.com/comparison/best-case-converters-2024',
      type: 'article',
      image: '/main-logo-80x80.png',
      author: 'SmartTextConverter Team',
      publishedTime: '2024-12-15T00:00:00Z',
      modifiedTime: new Date().toISOString(),
      section: 'Comparisons',
      tags: ['case converter comparison', 'best case converter', 'tool comparison', 'text case converter'],
      locale: 'en',
      canonicalUrl: 'https://smarttextconverter.com/comparison/best-case-converters-2024',
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
