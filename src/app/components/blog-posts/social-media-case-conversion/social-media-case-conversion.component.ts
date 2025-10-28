import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { SEOService } from '../../../services/seo.service';
import { SocialSharingComponent } from '../../social-sharing/social-sharing.component';

@Component({
  selector: 'app-social-media-case-conversion',
  standalone: true,
  imports: [CommonModule, SocialSharingComponent],
  templateUrl: './social-media-case-conversion.component.html',
  styleUrl: '../blog-posts.scss',
})
export class SocialMediaCaseConversionComponent implements OnInit {
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
        'Social Media Case Conversion: Platform-Specific Formatting for Maximum Engagement | SmartTextConverter Blog',
      description:
        'Optimize your social media content with proper case conversion. Learn platform-specific formatting rules for Twitter, Instagram, LinkedIn, and other social networks.',
      keywords: [
        'social media formatting',
        'case conversion',
        'social media best practices',
        'Twitter formatting',
        'Instagram formatting',
        'LinkedIn formatting',
        'social media content',
        'platform-specific formatting',
        'social media optimization',
      ],
      url: 'https://smarttextconverter.com/blog/social-media-case-conversion',
      publishedDate: '2025-10-02T00:00:00Z',
      modifiedDate: '2025-10-02T00:00:00Z',
      author: 'SmartTextConverter Team',
      category: 'Social Media',
      wordCount: 1200,
      tags: ['Social Media', 'Content Marketing', 'Platform Optimization', 'Case Conversion'],
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
