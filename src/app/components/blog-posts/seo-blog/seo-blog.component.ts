import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { SEOService } from '../../../services/seo.service';
import { SocialSharingComponent } from '../../social-sharing/social-sharing.component';
import { Header } from '../../header/header';
import { Footer } from '../../footer/footer';

@Component({
  selector: 'app-seo-blog',
  standalone: true,
  imports: [CommonModule, SocialSharingComponent],
  templateUrl: './seo-blog.component.html',
  styleUrl: '../blog-posts.scss',
})
export class SeoBlogComponent implements OnInit {
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
        'SEO Best Practices: Title Case vs Sentence Case for Headlines | SmartTextConverter Blog',
      description:
        'Discover SEO best practices for headlines and titles. Learn when to use title case vs sentence case to improve your search engine rankings and click-through rates. Expert tips for content marketing success.',
      keywords: [
        'SEO best practices',
        'title case',
        'sentence case',
        'headlines',
        'search engine optimization',
        'click-through rates',
        'content marketing',
        'text formatting',
        'case conversion',
        'headline optimization',
        'SEO headlines',
        'content strategy',
      ],
      url: 'https://smarttextconverter.com/blog/seo-blog',
      publishedDate: '2025-10-02T00:00:00Z',
      modifiedDate: '2025-10-02T00:00:00Z',
      author: 'SmartTextConverter Team',
      category: 'SEO',
      wordCount: 1200,
      tags: ['SEO', 'Content Marketing', 'Headlines', 'Case Conversion', 'Best Practices'],
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
