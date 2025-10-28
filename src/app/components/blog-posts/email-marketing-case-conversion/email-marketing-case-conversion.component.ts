import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { SEOService } from '../../../services/seo.service';
import { SocialSharingComponent } from '../../social-sharing/social-sharing.component';

@Component({
  selector: 'app-email-marketing-case-conversion',
  standalone: true,
  imports: [CommonModule, SocialSharingComponent],
  templateUrl: './email-marketing-case-conversion.component.html',
  styleUrl: '../blog-posts.scss',
})
export class EmailMarketingCaseConversionComponent implements OnInit {
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
        'Email Marketing Case Conversion: Subject Lines, Headers & Deliverability Optimization | SmartTextConverter Blog',
      description:
        'Master email marketing case conversion for maximum deliverability and open rates. Learn subject line formatting, header optimization, and spam filter considerations for email campaigns.',
      keywords: [
        'email marketing case conversion',
        'email subject line formatting',
        'email deliverability optimization',
        'email header formatting',
        'newsletter title optimization',
        'email spam filter considerations',
        'email marketing best practices',
        'email case styles',
        'email subject line case conversion',
        'email header case formatting',
        'email marketing optimization',
        'email campaign formatting',
        'email content formatting',
        'email marketing tips',
        'email open rate optimization',
        'email click-through rate',
        'email marketing strategy',
        'email design best practices',
        'email personalization',
        'email automation formatting',
      ],
      url: 'https://smarttextconverter.com/blog/email-marketing-case-conversion',
      publishedDate: '2025-10-05T00:00:00Z',
      modifiedDate: '2025-10-05T00:00:00Z',
      author: 'SmartTextConverter Team',
      category: 'Email Marketing',
      wordCount: 1800,
      tags: [
        'Email Marketing',
        'Case Conversion',
        'Deliverability',
        'Subject Lines',
        'Email Optimization',
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
