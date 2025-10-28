import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { SEOService } from '../../../services/seo.service';
import { SocialSharingComponent } from '../../social-sharing/social-sharing.component';

@Component({
  selector: 'app-cms-case-conversion',
  standalone: true,
  imports: [CommonModule, SocialSharingComponent],
  templateUrl: './cms-case-conversion.component.html',
  styleUrl: '../blog-posts.scss',
})
export class CmsCaseConversionComponent implements OnInit {
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
        'CMS Case Conversion: WordPress, Drupal & Headless CMS Content Formatting | SmartTextConverter Blog',
      description:
        'Master case conversion for Content Management Systems including WordPress, Drupal, and headless CMS platforms. Learn post title optimization, content formatting, and SEO plugin configurations.',
      keywords: [
        'CMS case conversion',
        'WordPress case conversion',
        'Drupal content formatting',
        'headless CMS formatting',
        'WordPress title case conversion',
        'Drupal content type formatting',
        'CMS content optimization',
        'WordPress SEO formatting',
        'Drupal SEO best practices',
        'headless CMS SEO',
        'content management system formatting',
        'WordPress post title optimization',
        'Drupal node formatting',
        'CMS content migration',
        'WordPress plugin case conversion',
        'Drupal module formatting',
        'headless CMS content strategy',
        'CMS content consistency',
        'WordPress theme formatting',
        'Drupal theme case conversion',
      ],
      url: 'https://smarttextconverter.com/blog/cms-case-conversion',
      publishedDate: '2025-10-03T00:00:00Z',
      modifiedDate: '2025-10-03T00:00:00Z',
      author: 'SmartTextConverter Team',
      category: 'Content Management',
      wordCount: 2200,
      tags: [
        'Content Management Systems',
        'WordPress',
        'Drupal',
        'Headless CMS',
        'Content Formatting',
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
