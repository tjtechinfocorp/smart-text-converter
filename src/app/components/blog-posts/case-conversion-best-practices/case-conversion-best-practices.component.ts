import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { SEOService } from '../../../services/seo.service';
import { SocialSharingComponent } from '../../social-sharing/social-sharing.component';
import { Header } from '../../header/header';
import { Footer } from '../../footer/footer';

@Component({
  selector: 'app-case-conversion-best-practices',
  standalone: true,
  imports: [CommonModule, SocialSharingComponent],
  templateUrl: './case-conversion-best-practices.component.html',
  styleUrl: '../blog-posts.scss',
})
export class CaseConversionBestPracticesComponent implements OnInit {
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
        'Text Case Conversion Best Practices: When and How to Use Different Case Styles | SmartTextConverter Blog',
      description:
        'Learn the best practices for text case conversion. Discover when to use different case styles for professional writing, programming, and content creation.',
      keywords: [
        'case conversion best practices',
        'text formatting',
        'professional writing',
        'case styles',
        'writing conventions',
        'text processing',
        'content creation',
        'case converter',
        'text transformation',
        'writing guidelines',
      ],
      url: 'https://smarttextconverter.com/blog/case-conversion-best-practices',
      publishedDate: '2025-10-02T00:00:00Z',
      modifiedDate: '2025-10-02T00:00:00Z',
      author: 'SmartTextConverter Team',
      category: 'Best Practices',
      wordCount: 1300,
      tags: ['Best Practices', 'Text Formatting', 'Professional Writing', 'Case Conversion'],
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
