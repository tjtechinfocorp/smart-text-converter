import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface ComparisonProduct {
  name: string;
  url: string;
  description: string;
  features: string[];
  pros: string[];
  cons: string[];
  rating?: number;
  price?: string;
}

export interface ComparisonData {
  title: string;
  description: string;
  url: string;
  products: ComparisonProduct[];
  verdict: string;
  winner: string;
  datePublished: string;
  dateModified: string;
  author: string;
}

@Injectable({
  providedIn: 'root',
})
export class ComparisonSchemaService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  generateComparisonSchema(data: ComparisonData): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'ProductComparison',
      name: data.title,
      description: data.description,
      url: data.url,
      datePublished: data.datePublished,
      dateModified: data.dateModified,
      author: {
        '@type': 'Person',
        name: data.author,
      },
      mainEntity: {
        '@type': 'ItemList',
        name: `${data.products[0]?.name} vs ${data.products[1]?.name} Comparison`,
        itemListElement: data.products.map((product, index) => ({
          '@type': 'Product',
          position: index + 1,
          name: product.name,
          url: product.url,
          description: product.description,
          ...(product.rating && {
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: product.rating,
              bestRating: 5,
              worstRating: 1,
            },
          }),
          ...(product.price && {
            offers: {
              '@type': 'Offer',
              price: product.price,
              priceCurrency: 'USD',
              availability: 'https://schema.org/InStock',
            },
          }),
        })),
      },
      // Add review schema for the comparison verdict
      review: {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: data.winner === data.products[0]?.name ? 5 : 4,
          bestRating: 5,
          worstRating: 1,
        },
        author: {
          '@type': 'Person',
          name: data.author,
        },
        reviewBody: data.verdict,
        datePublished: data.datePublished,
      },
    };
  }

  /**
   * Generate separate FAQ schema for comparison pages
   */
  generateComparisonFAQSchema(data: ComparisonData): any {
    if (!data.products || data.products.length < 2) {
      return null;
    }

    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: `Which is better: ${data.products[0]?.name} or ${data.products[1]?.name}?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: data.verdict,
          },
        },
        {
          '@type': 'Question',
          name: `What are the main differences between ${data.products[0]?.name} and ${data.products[1]?.name}?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: this.generateDifferencesText(data.products),
          },
        },
        {
          '@type': 'Question',
          name: `Which tool offers better features: ${data.products[0]?.name} or ${data.products[1]?.name}?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: this.generateFeaturesComparisonText(data.products),
          },
        },
      ],
    };
  }

  private generateDifferencesText(products: ComparisonProduct[]): string {
    if (products.length < 2) return '';

    const product1 = products[0];
    const product2 = products[1];

    return `The main differences between ${product1.name} and ${product2.name} include: ${product1.name} offers ${product1.features.slice(0, 3).join(', ')}, while ${product2.name} provides ${product2.features.slice(0, 3).join(', ')}. ${product1.name} has advantages in ${product1.pros.slice(0, 2).join(' and ')}, whereas ${product2.name} excels in ${product2.pros.slice(0, 2).join(' and ')}.`;
  }

  private generateFeaturesComparisonText(products: ComparisonProduct[]): string {
    if (products.length < 2) return '';

    const product1 = products[0];
    const product2 = products[1];

    return `${product1.name} offers ${product1.features.length} key features including ${product1.features.slice(0, 3).join(', ')}. ${product2.name} provides ${product2.features.length} features including ${product2.features.slice(0, 3).join(', ')}. The feature comparison shows that ${product1.features.length > product2.features.length ? product1.name : product2.name} offers more comprehensive functionality.`;
  }

  addComparisonSchemaToPage(data: ComparisonData): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const schema = this.generateComparisonSchema(data);

    // Remove existing comparison schema
    const existingScript = document.querySelector('script[data-comparison-schema]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new comparison schema
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-comparison-schema', 'true');
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  // Generate breadcrumb schema for comparison pages
  generateBreadcrumbSchema(currentPage: string, currentTitle: string): any {
    return {
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
          name: 'Comparisons',
          item: 'https://smarttextconverter.com/blog#comparison',
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: currentTitle,
          item: `https://smarttextconverter.com${currentPage}`,
        },
      ],
    };
  }

  addBreadcrumbSchemaToPage(currentPage: string, currentTitle: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const schema = this.generateBreadcrumbSchema(currentPage, currentTitle);

    // Remove existing breadcrumb schema
    const existingScript = document.querySelector('script[data-breadcrumb-schema]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new breadcrumb schema
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-breadcrumb-schema', 'true');
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
  }
}
