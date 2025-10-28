import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { SEOService } from '../../../services/seo.service';
import { SocialSharingComponent } from '../../social-sharing/social-sharing.component';

@Component({
  selector: 'app-case-conversion-guide',
  standalone: true,
  imports: [CommonModule, SocialSharingComponent],
  templateUrl: './case-conversion-guide.component.html',
  styleUrl: '../blog-posts.scss',
})
export class CaseConversionGuideComponent implements OnInit {
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
        'Complete Guide to Text Case Conversion: Uppercase, Lowercase, Title Case | SmartTextConverter Blog',
      description:
        'Master text case conversion with our comprehensive guide. Learn uppercase, lowercase, title case, sentence case, and more. Perfect for writers, developers, and content creators.',
      keywords: [
        'text case conversion',
        'uppercase',
        'lowercase',
        'title case',
        'sentence case',
        'case converter',
        'text formatting',
        'writing guide',
        'text transformation',
        'case styles',
        'text processing',
        'content creation',
      ],
      url: 'https://smarttextconverter.com/blog/case-conversion-guide',
      publishedDate: '2025-10-07T00:00:00Z',
      modifiedDate: '2025-10-07T00:00:00Z',
      author: 'SmartTextConverter Team',
      category: 'Text Processing',
      wordCount: 1500,
      tags: ['Case Conversion', 'Text Formatting', 'Writing Guide', 'Text Processing'],
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
