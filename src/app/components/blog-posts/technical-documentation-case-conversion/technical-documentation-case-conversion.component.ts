import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { SEOService } from '../../../services/seo.service';
import { SocialSharingComponent } from '../../social-sharing/social-sharing.component';

@Component({
  selector: 'app-technical-documentation-case-conversion',
  standalone: true,
  imports: [CommonModule, SocialSharingComponent],
  templateUrl: './technical-documentation-case-conversion.component.html',
  styleUrl: '../blog-posts.scss',
})
export class TechnicalDocumentationCaseConversionComponent implements OnInit {
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
        'Technical Documentation Case Conversion: API Docs, User Manuals & Developer Resources | SmartTextConverter Blog',
      description:
        'Master case conversion for technical documentation including API endpoints, code examples, user manuals, and developer resources. Learn best practices for technical writing and documentation formatting.',
      keywords: [
        'technical documentation case conversion',
        'API documentation formatting',
        'technical writing best practices',
        'API endpoint naming conventions',
        'code example formatting',
        'user manual formatting',
        'developer resource optimization',
        'technical documentation style guide',
        'API documentation case conversion',
        'technical writing case styles',
        'documentation formatting standards',
        'API parameter naming conventions',
        'code documentation formatting',
        'technical manual formatting',
        'developer documentation best practices',
        'API documentation guidelines',
        'technical content formatting',
        'software documentation standards',
        'programming documentation formatting',
        'technical communication case conversion',
      ],
      url: 'https://smarttextconverter.com/blog/technical-documentation-case-conversion',
      publishedDate: '2025-10-03T00:00:00Z',
      modifiedDate: '2025-10-03T00:00:00Z',
      author: 'SmartTextConverter Team',
      category: 'Technical Documentation',
      wordCount: 2000,
      tags: [
        'Technical Documentation',
        'API Documentation',
        'Technical Writing',
        'Developer Resources',
        'Code Formatting',
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
