import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { SEOService } from '../../../services/seo.service';
import { SocialSharingComponent } from '../../social-sharing/social-sharing.component';

@Component({
  selector: 'app-programming-conventions',
  standalone: true,
  imports: [CommonModule, SocialSharingComponent],
  templateUrl: './programming-conventions.component.html',
  styleUrl: '../blog-posts.scss',
})
export class ProgrammingConventionsComponent implements OnInit {
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
        'Programming Conventions: Naming Conventions and Code Style Best Practices | SmartTextConverter Blog',
      description:
        'Master programming naming conventions and code style. Learn camelCase, snake_case, kebab-case, and other conventions used in different programming languages.',
      keywords: [
        'programming conventions',
        'naming conventions',
        'camelCase',
        'snake_case',
        'kebab-case',
        'code style',
        'programming best practices',
        'coding standards',
        'variable naming',
        'function naming',
        'code formatting',
      ],
      url: 'https://smarttextconverter.com/blog/programming-conventions',
      publishedDate: '2025-10-08T00:00:00Z',
      modifiedDate: '2025-10-08T00:00:00Z',
      author: 'SmartTextConverter Team',
      category: 'Programming',
      wordCount: 1600,
      tags: ['Programming', 'Code Style', 'Naming Conventions', 'Best Practices'],
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
