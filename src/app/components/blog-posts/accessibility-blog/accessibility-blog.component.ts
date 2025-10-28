import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { SEOService } from '../../../services/seo.service';
import { SocialSharingComponent } from '../../social-sharing/social-sharing.component';

@Component({
  selector: 'app-accessibility-blog',
  standalone: true,
  imports: [CommonModule, SocialSharingComponent],
  templateUrl: './accessibility-blog.component.html',
  styleUrl: '../blog-posts.scss',
})
export class AccessibilityBlogComponent implements OnInit {
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
        'Accessibility in Text Formatting: Making Content Inclusive for All Users | SmartTextConverter Blog',
      description:
        'Learn how to make your text formatting accessible to all users. Discover best practices for inclusive design, screen reader compatibility, and accessible content creation.',
      keywords: [
        'accessibility',
        'text formatting',
        'inclusive design',
        'screen reader',
        'accessible content',
        'web accessibility',
        'WCAG',
        'inclusive writing',
        'text accessibility',
        'content accessibility',
        'accessible design',
      ],
      url: 'https://smarttextconverter.com/blog/accessibility-blog',
      publishedDate: '2025-10-06T00:00:00Z',
      modifiedDate: '2025-10-06T00:00:00Z',
      author: 'SmartTextConverter Team',
      category: 'Accessibility',
      wordCount: 1400,
      tags: ['Accessibility', 'Inclusive Design', 'Web Accessibility', 'Content Creation'],
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
