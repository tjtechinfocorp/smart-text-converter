import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SEOService } from '../../services/seo.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="not-found-container">
      <div class="not-found-content">
        <h1 class="error-code">404</h1>
        <h2 class="error-title">Page Not Found</h2>
        <p class="error-description">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div class="actions">
          <a routerLink="/" class="btn-primary">Go to Homepage</a>
          <a routerLink="/blog" class="btn-secondary">Visit Blog</a>
        </div>
        <div class="popular-links">
          <h3>Popular Tools</h3>
          <ul>
            <li><a routerLink="/case-converter">Case Converter</a></li>
            <li><a routerLink="/text-formatter">Text Formatter</a></li>
            <li><a routerLink="/json/formatter">JSON Formatter</a></li>
            <li><a routerLink="/html/formatter">HTML Formatter</a></li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .not-found-container {
      min-height: 60vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }

    .not-found-content {
      text-align: center;
      max-width: 600px;
      background: white;
      padding: 3rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .error-code {
      font-size: 6rem;
      font-weight: bold;
      color: #3b82f6;
      margin: 0;
      line-height: 1;
    }

    .error-title {
      font-size: 2rem;
      margin: 1rem 0;
      color: #1f2937;
    }

    .error-description {
      color: #6b7280;
      font-size: 1.125rem;
      margin-bottom: 2rem;
    }

    .actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .btn-primary, .btn-secondary {
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.2s;
      display: inline-block;
    }

    .btn-primary {
      background-color: #3b82f6;
      color: white;
    }

    .btn-primary:hover {
      background-color: #2563eb;
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);
    }

    .btn-secondary {
      background-color: #f3f4f6;
      color: #1f2937;
      border: 1px solid #e5e7eb;
    }

    .btn-secondary:hover {
      background-color: #e5e7eb;
      transform: translateY(-2px);
    }

    .popular-links {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #e5e7eb;
    }

    .popular-links h3 {
      font-size: 1.25rem;
      margin-bottom: 1rem;
      color: #1f2937;
    }

    .popular-links ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      justify-content: center;
    }

    .popular-links li a {
      color: #3b82f6;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border: 1px solid #3b82f6;
      border-radius: 6px;
      transition: all 0.2s;
    }

    .popular-links li a:hover {
      background-color: #3b82f6;
      color: white;
    }

    @media (max-width: 640px) {
      .not-found-content {
        padding: 2rem 1.5rem;
      }

      .error-code {
        font-size: 4rem;
      }

      .error-title {
        font-size: 1.5rem;
      }

      .actions {
        flex-direction: column;
      }

      .btn-primary, .btn-secondary {
        width: 100%;
      }
    }
  `],
})
export class NotFoundComponent implements OnInit {
  constructor(
    private seoService: SEOService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Note: HTTP 404 status code is set server-side in server.ts
    // by detecting NotFoundComponent in the rendered HTML

    // Set SEO with noindex to prevent indexing of 404 pages
    this.seoService.updateSEO({
      title: '404 - Page Not Found | Smart Text Converter',
      description:
        'The page you are looking for does not exist. Return to Smart Text Converter homepage to access our free online text processing tools.',
      keywords: '404, page not found, smart text converter',
      url: 'https://smarttextconverter.com/404',
      canonicalUrl: 'https://smarttextconverter.com/404',
      robots: 'noindex, nofollow',
    });
  }
}

