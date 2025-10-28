import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { SEOService } from '../../../services/seo.service';
import { SocialSharingComponent } from '../../social-sharing/social-sharing.component';

@Component({
  selector: 'app-text-analysis-beyond-case-conversion',
  standalone: true,
  imports: [CommonModule, SocialSharingComponent],
  templateUrl: './text-analysis-beyond-case-conversion.component.html',
  styleUrl: '../blog-posts.scss',
})
export class TextAnalysisBeyondCaseConversionComponent implements OnInit {
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
    this.seoService.setBlogPostSEO({
      title:
        'Text Analysis: Beyond Case Conversion - Advanced Text Processing & Analytics | SmartTextConverter Blog',
      description:
        'Explore advanced text analysis techniques beyond case conversion. Learn about text mining, sentiment analysis, readability metrics, and comprehensive text processing for content optimization.',
      keywords: [
        'text analysis',
        'text processing',
        'text mining',
        'sentiment analysis',
        'readability analysis',
        'text analytics',
        'content analysis',
        'text statistics',
        'word frequency analysis',
        'text complexity analysis',
        'natural language processing',
        'text optimization',
        'content optimization',
        'text metrics',
        'writing analysis',
        'text quality assessment',
        'linguistic analysis',
        'text pattern recognition',
        'content intelligence',
        'text data analysis',
      ],
      url: 'https://smarttextconverter.com/blog/text-analysis-beyond-case-conversion',
      publishedDate: '2025-10-08T00:00:00Z',
      modifiedDate: '2025-10-08T00:00:00Z',
      author: 'SmartTextConverter Team',
      category: 'Text Analysis',
      wordCount: 2400,
      tags: [
        'Text Analysis',
        'Text Processing',
        'Content Analytics',
        'Natural Language Processing',
        'Text Mining',
      ],
    });
  }

  private scrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  navigateToBlog(): void {
    this.router.navigate(['/blog']).then(() => {
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  scrollToSection(sectionId: string): void {
    if (isPlatformBrowser(this.platformId)) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest',
        });
      }
    }
  }
}
