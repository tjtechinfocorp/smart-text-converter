import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SEOService } from './seo.service';

export interface BlogPostMetadata {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  authorUrl?: string;
  image?: string;
  keywords?: string[];
  articleSection?: string;
  wordCount?: number;
  timeRequired?: string;
  mainEntityOfPage?: string;
}

@Injectable({ providedIn: 'root' })
export class BlogPostSchemaService {
  constructor(
    private seoService: SEOService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  addBlogPostSchema(metadata: BlogPostMetadata): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: metadata.headline,
      description: metadata.description,
      url: metadata.url,
      datePublished: metadata.datePublished,
      dateModified: metadata.dateModified || metadata.datePublished,
      author: {
        '@type': metadata.authorUrl ? 'Person' : 'Organization',
        name: metadata.author || 'SmartTextConverter Team',
        ...(metadata.authorUrl && { url: metadata.authorUrl }),
      },
      publisher: {
        '@type': 'Organization',
        name: 'SmartTextConverter',
        url: 'https://smarttextconverter.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://smarttextconverter.com/main-logo-80x80.png',
        },
      },
      ...(metadata.image && { image: metadata.image }),
      ...(metadata.keywords && metadata.keywords.length > 0 && { keywords: metadata.keywords.join(', ') }),
      ...(metadata.articleSection && { articleSection: metadata.articleSection }),
      ...(metadata.wordCount && { wordCount: metadata.wordCount }),
      ...(metadata.timeRequired && { timeRequired: metadata.timeRequired }),
      ...(metadata.mainEntityOfPage && {
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': metadata.mainEntityOfPage,
        },
      }),
    };

    this.seoService.addStructuredData(schema);

    // Also add breadcrumb schema
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://smarttextconverter.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Blog',
          item: 'https://smarttextconverter.com/blog',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: metadata.headline,
          item: metadata.url,
        },
      ],
    };

    this.seoService.addStructuredData(breadcrumbSchema);
  }
}

