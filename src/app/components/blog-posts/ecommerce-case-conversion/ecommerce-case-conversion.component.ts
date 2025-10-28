import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { SEOService } from '../../../services/seo.service';
import { SocialSharingComponent } from '../../social-sharing/social-sharing.component';

@Component({
  selector: 'app-ecommerce-case-conversion',
  standalone: true,
  imports: [CommonModule, SocialSharingComponent],
  templateUrl: './ecommerce-case-conversion.component.html',
  styleUrl: '../blog-posts.scss',
})
export class EcommerceCaseConversionComponent implements OnInit {
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
        'E-commerce Case Conversion: Product Names, Descriptions & SEO Optimization | SmartTextConverter Blog',
      description:
        'Optimize your e-commerce product listings with proper case conversion. Learn how to format product names, descriptions, and titles for better SEO and sales.',
      keywords: [
        'e-commerce optimization',
        'product names',
        'product descriptions',
        'case conversion',
        'e-commerce SEO',
        'product listings',
        'online store optimization',
        'product titles',
        'e-commerce best practices',
        'product formatting',
        'online retail',
      ],
      url: 'https://smarttextconverter.com/blog/ecommerce-case-conversion',
      publishedDate: '2025-10-03T00:00:00Z',
      modifiedDate: '2025-10-03T00:00:00Z',
      author: 'SmartTextConverter Team',
      category: 'E-commerce',
      wordCount: 1300,
      tags: ['E-commerce', 'SEO', 'Product Optimization', 'Online Retail'],
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
