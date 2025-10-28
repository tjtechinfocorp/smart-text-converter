import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SEOService } from '../../services/seo.service';
import { TranslatedTextComponent } from '../translated-text/translated-text.component';

interface BlogPostData {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
  readTime: string;
  featured: boolean;
  image?: {
    url: string;
    alt: string;
  };
}

interface CategoryData {
  id: string;
  name: string;
  description: string;
  slug: string;
}

@Component({
  selector: 'app-blog',
  templateUrl: './blog.html',
  styleUrl: './blog.scss',
  imports: [RouterModule, TranslatedTextComponent],
  standalone: true,
})
export class Blog implements OnInit {
  posts: BlogPostData[] = [];
  filteredPosts: BlogPostData[] = [];
  categories: CategoryData[] = [];
  selectedCategory: string = 'all';
  searchQuery: string = '';

  constructor(
    private seoService: SEOService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadBlogData();
    this.setSEO();
    this.addStructuredData();
  }

  private loadBlogData(): void {
    this.posts = [
      {
        id: 'complete-guide-text-case-conversion',
        title:
          'The Complete Professional Guide to Text Case Conversion: Advanced Techniques & Best Practices',
        slug: 'complete-guide-text-case-conversion',
        excerpt:
          'Master text case conversion with our comprehensive guide. Learn about uppercase, lowercase, title case, camelCase, snake_case, and more formatting options.',
        author: 'SmartTextConverter Team',
        date: '2025-09-23',
        category: 'Guides',
        tags: [
          'text conversion',
          'case conversion',
          'programming',
          'content creation',
          'best practices',
        ],
        readTime: '8 min read',
        featured: true,
        image: {
          url: 'blog-images/complete-guide-text-case-conversion.jpg',
          alt: 'Text case conversion guide showing different case styles and programming code',
        },
      },
      {
        id: 'programming-case-conventions-camelcase-vs-snake-case',
        title:
          'Programming Case Conventions: Master camelCase, snake_case & kebab-case for Clean Code',
        slug: 'programming-case-conventions-camelcase-vs-snake-case',
        excerpt:
          'Explore programming case conventions across different languages. Learn when to use camelCase, snake_case, and kebab-case in your code.',
        author: 'SmartTextConverter Team',
        date: '2025-09-23',
        category: 'Programming',
        tags: [
          'programming',
          'camelCase',
          'snake_case',
          'kebab-case',
          'coding conventions',
          'best practices',
        ],
        readTime: '6 min read',
        featured: false,
        image: {
          url: 'blog-images/programming-case-conventions-camelcase-vs-snake-case.jpg',
          alt: 'Programming code showing different case conventions and syntax highlighting',
        },
      },
      {
        id: 'seo-best-practices-title-case-vs-sentence-case',
        title:
          'SEO Case Conversion Strategy: Title Case vs Sentence Case for Maximum Click-Through Rates',
        slug: 'seo-best-practices-title-case-vs-sentence-case',
        excerpt:
          'Discover SEO best practices for headlines and titles. Learn when to use title case vs sentence case to improve your search engine rankings and click-through rates.',
        author: 'SmartTextConverter Team',
        date: '2025-09-23',
        category: 'SEO',
        tags: [
          'SEO',
          'title case',
          'sentence case',
          'headlines',
          'content marketing',
          'best practices',
        ],
        readTime: '5 min read',
        featured: false,
        image: {
          url: 'blog-images/seo-best-practices-title-case-vs-sentence-case.webp',
          alt: 'SEO analytics dashboard showing title case formatting and search rankings',
        },
      },
      {
        id: 'accessibility-best-practices',
        title: 'Accessible Text Formatting: WCAG-Compliant Case Conversion for Inclusive Design',
        slug: 'accessibility-best-practices',
        excerpt:
          'Learn how to format text for accessibility and inclusive design. Discover best practices for creating content that works for all users, including those with disabilities.',
        author: 'SmartTextConverter Team',
        date: '2025-09-23',
        category: 'Accessibility',
        tags: [
          'accessibility',
          'inclusive design',
          'text formatting',
          'screen readers',
          'WCAG',
          'web accessibility',
        ],
        readTime: '7 min read',
        featured: false,
        image: {
          url: 'blog-images/text-formatting-best-practices-inclusive-design.png',
          alt: 'Accessibility features showing text formatting for inclusive design and screen reader compatibility',
        },
      },
      {
        id: 'case-conversion-best-practices-when-how-use-different-case-styles',
        title:
          'Professional Case Conversion Standards: Industry-Specific Best Practices & Implementation Guide',
        slug: 'case-conversion-best-practices-when-how-use-different-case-styles',
        excerpt:
          'Master case conversion with our comprehensive guide. Learn best practices for using uppercase, lowercase, title case, and other formatting styles effectively.',
        author: 'SmartTextConverter Team',
        date: '2025-09-23',
        category: 'Best Practices',
        tags: [
          'case conversion',
          'text formatting',
          'best practices',
          'content creation',
          'programming',
          'text processing',
        ],
        readTime: '8 min read',
        featured: false,
        image: {
          url: 'blog-images/case-conversion-best-practices-when-how-use-different-case-styles.jpg',
          alt: 'Data analysis and text processing workflow showing best practices for case conversion and formatting',
        },
      },
      {
        id: 'ecommerce-case-conversion',
        title:
          'Text Case Conversion for E-commerce: Product Titles, Descriptions & SEO Optimization',
        slug: 'ecommerce-case-conversion',
        excerpt:
          'Master e-commerce case conversion for product titles, descriptions, and SEO optimization. Learn Amazon, eBay, Shopify formatting best practices for maximum conversion rates and search visibility.',
        author: 'SmartTextConverter Team',
        date: '2025-09-23',
        category: 'E-commerce',
        tags: [
          'e-commerce SEO',
          'product title optimization',
          'Amazon product titles',
          'eBay listing optimization',
          'Shopify product descriptions',
          'case conversion e-commerce',
          'product title case conversion',
          'e-commerce product descriptions',
          'marketplace optimization',
          'product listing SEO',
        ],
        readTime: '12 min read',
        featured: true,
        image: {
          url: 'blog-images/ecommerce-case-conversion.jpg',
          alt: 'E-commerce product listings showing optimized titles and descriptions with proper case conversion',
        },
      },
      {
        id: 'social-media-case-conversion',
        title:
          'Case Conversion for Social Media: Platform-Specific Formatting for Maximum Engagement',
        slug: 'social-media-case-conversion',
        excerpt:
          'Master social media case conversion with platform-specific formatting rules for Instagram, LinkedIn, Twitter, and TikTok. Optimize hashtags, bios, and posts for maximum engagement.',
        author: 'SmartTextConverter Team',
        date: '2025-09-23',
        category: 'Social Media',
        tags: [
          'social media formatting',
          'Instagram bio case conversion',
          'LinkedIn post formatting',
          'Twitter hashtag formatting',
          'TikTok caption formatting',
          'social media engagement',
          'platform-specific formatting',
          'social media optimization',
          'hashtag formatting',
          'brand consistency',
        ],
        readTime: '10 min read',
        featured: true,
        image: {
          url: 'blog-images/social-media-case-conversion.jpg',
          alt: 'Social media platforms showing different case formatting styles and engagement metrics',
        },
      },
      {
        id: 'email-marketing-case-conversion',
        title:
          'Email Marketing Case Conversion: Subject Lines, Headers & Deliverability Optimization',
        slug: 'email-marketing-case-conversion',
        excerpt:
          'Master email marketing case conversion for maximum deliverability and open rates. Learn subject line formatting, header optimization, and spam filter considerations for email campaigns.',
        author: 'SmartTextConverter Team',
        date: '2025-09-23',
        category: 'Email Marketing',
        tags: [
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
        readTime: '12 min read',
        featured: true,
        image: {
          url: 'blog-images/email-marketing-case-conversion.png',
          alt: 'Email marketing dashboard showing subject line optimization and deliverability metrics',
        },
      },
      {
        id: 'technical-documentation-case-conversion',
        title:
          'Technical Documentation Case Conversion: API Docs, User Manuals & Developer Resources',
        slug: 'technical-documentation-case-conversion',
        excerpt:
          'Master case conversion for technical documentation including API endpoints, code examples, user manuals, and developer resources. Learn best practices for technical writing and documentation formatting.',
        author: 'SmartTextConverter Team',
        date: '2025-09-23',
        category: 'Technical Documentation',
        tags: [
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
        readTime: '14 min read',
        featured: true,
        image: {
          url: 'blog-images/technical-documentation-case-conversion.png',
          alt: 'Technical documentation showing API endpoints, code examples, and developer resources with proper case conversion',
        },
      },
      {
        id: 'cms-case-conversion',
        title: 'CMS Case Conversion: WordPress, Drupal & Headless CMS Content Formatting',
        slug: 'cms-case-conversion',
        excerpt:
          'Optimize your Content Management System with proper case conversion strategies. Learn how to format content across WordPress, Drupal, and headless CMS platforms for maximum SEO impact and user engagement.',
        author: 'SmartTextConverter Team',
        date: '2025-09-23',
        category: 'Content Management',
        tags: [
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
        readTime: '16 min read',
        featured: true,
        image: {
          url: 'blog-images/cms-case-conversion.jpg',
          alt: 'Content Management System dashboard showing WordPress, Drupal, and headless CMS interfaces with proper content formatting',
        },
      },
      {
        id: 'text-analysis-beyond-case-conversion',
        title: 'Text Analysis: Beyond Case Conversion - Advanced Text Processing & Analytics',
        slug: 'text-analysis-beyond-case-conversion',
        excerpt:
          'Discover the power of comprehensive text analysis beyond simple case conversion. Learn advanced techniques for text mining, sentiment analysis, readability assessment, and content optimization that transform your text processing capabilities.',
        author: 'SmartTextConverter Team',
        date: '2025-09-23',
        category: 'Text Analysis',
        tags: [
          'text analysis',
          'text processing',
          'text mining',
          'sentiment analysis',
          'readability analysis',
          'text analytics',
          'content analysis',
          'text statistics',
          'word frequency analysis',
          'text complexity analysis',
          'natural language processing',
          'text optimization',
          'content optimization',
          'text metrics',
          'writing analysis',
          'text quality assessment',
          'linguistic analysis',
          'text pattern recognition',
          'content intelligence',
          'text data analysis',
        ],
        readTime: '18 min read',
        featured: true,
        image: {
          url: 'blog-images/text-analysis-beyond-case-conversion.webp',
          alt: 'Advanced text analysis dashboard showing data visualization, sentiment analysis, and text processing metrics',
        },
      },
      {
        id: 'caseconverter-org-comparison',
        title:
          'SmartTextConverter vs CaseConverter.org: Complete Comparison 2024 | Which is Better?',
        slug: 'caseconverter-org',
        excerpt:
          'Detailed comparison of SmartTextConverter vs CaseConverter.org. Compare features, performance, languages, and user experience. See why SmartTextConverter is the better choice.',
        author: 'SmartTextConverter Team',
        date: '2025-09-15',
        category: 'Comparison',
        tags: [
          'caseconverter.org vs smarttextconverter',
          'case converter comparison',
          'best case converter tool',
          'caseconverter.org alternative',
          'text case converter comparison',
          'case converter features',
          'case converter performance',
          'multi language case converter',
          'case converter review',
          'case converter tool comparison',
        ],
        readTime: '12 min read',
        featured: true,
        image: {
          url: 'blog-images/caseconverter-org-comparison.jpg',
          alt: 'SmartTextConverter vs CaseConverter.org comparison showing text case conversion tools and interface design',
        },
      },
      {
        id: 'convertcase-net-comparison',
        title: 'SmartTextConverter vs ConvertCase.net: Feature Comparison & Review 2024',
        slug: 'convertcase-net',
        excerpt:
          'Compare SmartTextConverter vs ConvertCase.net. See which text case converter offers better features, performance, and user experience. Detailed analysis and review.',
        author: 'SmartTextConverter Team',
        date: '2025-09-15',
        category: 'Comparison',
        tags: [
          'convertcase.net vs smarttextconverter',
          'case converter comparison',
          'convertcase.net alternative',
          'text case converter review',
          'case converter features comparison',
          'best case converter tool',
          'case converter performance',
          'text formatting tools comparison',
          'case converter user experience',
          'case converter tool review',
        ],
        readTime: '11 min read',
        featured: true,
        image: {
          url: 'blog-images/convertcase-net-comparison.jpg',
          alt: 'Feature comparison dashboard showing SmartTextConverter vs ConvertCase.net capabilities and performance metrics',
        },
      },
      {
        id: 'textcase-org-comparison',
        title: 'SmartTextConverter vs TextCase.org: Complete Tool Comparison & Review 2024',
        slug: 'textcase-org',
        excerpt:
          'Compare SmartTextConverter vs TextCase.org. See which text case converter offers better features, performance, and user experience. Detailed analysis and review.',
        author: 'SmartTextConverter Team',
        date: '2025-09-15',
        category: 'Comparison',
        tags: [
          'textcase.org vs smarttextconverter',
          'case converter comparison',
          'textcase.org alternative',
          'text case converter review',
          'case converter features comparison',
          'best case converter tool',
          'case converter performance',
          'text formatting tools comparison',
          'case converter user experience',
          'case converter tool review',
        ],
        readTime: '11 min read',
        featured: true,
        image: {
          url: 'blog-images/textcase-org-comparison.png',
          alt: 'Tool comparison dashboard showing SmartTextConverter vs TextCase.org features and performance metrics',
        },
      },
      {
        id: 'best-case-converters-2024',
        title: 'Best Case Converter Tools 2024: Complete Comparison & Reviews | SmartTextConverter',
        slug: 'best-case-converters-2024',
        excerpt:
          'Discover the best case converter tools in 2024. Compare SmartTextConverter, CaseConverter.org, ConvertCase.net, and TextCase.org. Find the perfect text case converter for your needs.',
        author: 'SmartTextConverter Team',
        date: '2025-09-15',
        category: 'Comparison',
        tags: [
          'best case converter tools 2024',
          'case converter comparison',
          'text case converter review',
          'case converter tools ranking',
          'best text formatting tools',
          'case converter features comparison',
          'text case converter performance',
          'case converter user experience',
          'case converter tool review',
          'text formatting tools 2024',
        ],
        readTime: '14 min read',
        featured: true,
        image: {
          url: 'blog-images/best-case-converters-2024.jpg',
          alt: 'Best case converter tools 2024 comparison dashboard showing top text case converter platforms and their features',
        },
      },
      {
        id: 'json-formatting-complete-guide',
        title: 'The Complete Guide to JSON Formatting: Best Practices for Developers in 2025',
        slug: 'json-formatting-complete-guide',
        excerpt:
          'Master JSON formatting with our comprehensive guide covering best practices, common mistakes, and industry standards. Learn essential techniques for creating clean, maintainable JSON data structures.',
        author: 'SmartTextConverter Team',
        date: '2025-10-03',
        category: 'Programming',
        tags: [
          'JSON formatting',
          'JSON best practices',
          'programming',
          'data structures',
          'web development',
          'API development',
          'JSON tools',
          'code quality',
          'developer tools',
          'JSON standards',
        ],
        readTime: '8 min read',
        featured: true,
        image: {
          url: 'blog-images/json-formatting-complete-guide.png',
          alt: 'JSON formatting guide showing code examples and best practices for developers',
        },
      },
      {
        id: 'json-validation-developer-guide',
        title: "JSON Validation: The Developer's Guide to Error-Free Data Processing",
        slug: 'json-validation-developer-guide',
        excerpt:
          'Ensure data integrity with comprehensive JSON validation techniques. Learn syntax validation, schema validation, security considerations, and performance optimization for robust applications.',
        author: 'SmartTextConverter Team',
        date: '2025-10-03',
        category: 'Programming',
        tags: [
          'JSON validation',
          'data integrity',
          'error handling',
          'security',
          'API development',
          'programming',
          'JSON schema',
          'data validation',
          'web development',
          'best practices',
        ],
        readTime: '6 min read',
        featured: false,
        image: {
          url: 'blog-images/json-validation-developer-guide.jpg',
          alt: 'JSON validation process showing error detection and data integrity checks',
        },
      },
      {
        id: 'json-performance-optimization',
        title: 'JSON Performance Optimization: Speed Up Your Applications in 2025',
        slug: 'json-performance-optimization',
        excerpt:
          'Optimize your JSON processing for maximum performance. Learn size optimization, parsing performance, memory management, and advanced techniques for high-performance applications.',
        author: 'SmartTextConverter Team',
        date: '2025-10-03',
        category: 'Programming',
        tags: [
          'JSON performance',
          'optimization',
          'web performance',
          'API optimization',
          'programming',
          'data processing',
          'memory management',
          'speed optimization',
          'web development',
          'performance tuning',
        ],
        readTime: '7 min read',
        featured: true,
        image: {
          url: 'blog-images/json-performance-optimization.png',
          alt: 'Performance optimization dashboard showing JSON processing speed and efficiency metrics',
        },
      },
      {
        id: 'javascript-formatter-complete-guide',
        title:
          'JavaScript Formatter Guide: Best Practices for Code Formatting and Beautification in 2025',
        slug: 'javascript-formatter-complete-guide',
        excerpt:
          'Master JavaScript formatting with our comprehensive guide covering best practices, tools, and techniques. Learn how to format, beautify, minify, and validate JavaScript code effectively.',
        author: 'SmartTextConverter Team',
        date: '2025-10-05',
        category: 'Programming',
        tags: [
          'JavaScript formatter',
          'JS beautifier',
          'code formatting',
          'JavaScript minifier',
          'code validation',
          'ES6 conversion',
          'programming best practices',
          'developer tools',
          'JavaScript tools',
          'code quality',
        ],
        readTime: '10 min read',
        featured: true,
        image: {
          url: 'blog-images/javascript-formatter-complete-guide.png',
          alt: 'JavaScript code formatting and beautification guide showing clean, well-structured code examples',
        },
      },
      {
        id: 'html-formatter-complete-guide',
        title: 'The Complete Guide to HTML Formatting: Best Practices for Web Developers in 2025',
        slug: 'html-formatter-complete-guide',
        excerpt:
          'Master HTML formatting with our comprehensive guide covering best practices, validation, minification, and modern web standards. Learn essential techniques for creating clean, maintainable HTML code.',
        author: 'SmartTextConverter Team',
        date: '2025-10-08',
        category: 'Programming',
        tags: [
          'HTML formatting',
          'HTML best practices',
          'web development',
          'HTML validation',
          'HTML minification',
          'XHTML conversion',
          'code quality',
          'developer tools',
          'HTML standards',
          'web standards',
        ],
        readTime: '10 min read',
        featured: true,
        image: {
          url: 'blog-images/html-formatter-complete-guide.jpg',
          alt: 'HTML formatting guide showing code examples and best practices for web developers',
        },
      },
      {
        id: 'css-formatter-complete-guide',
        title: 'CSS Formatter Guide: Best Practices for Code Formatting and Beautification in 2025',
        slug: 'css-formatter-complete-guide',
        excerpt:
          'Master CSS formatting with our comprehensive guide covering best practices, tools, and techniques. Learn how to format, beautify, minify, and validate CSS code effectively.',
        author: 'SmartTextConverter Team',
        date: '2025-10-08',
        category: 'Programming',
        tags: [
          'CSS formatting',
          'CSS beautifier',
          'code formatting',
          'CSS minifier',
          'CSS validation',
          'web development',
          'programming best practices',
          'developer tools',
          'CSS tools',
          'code quality',
        ],
        readTime: '12 min read',
        featured: true,
        image: {
          url: 'blog-images/css-formatter-complete-guide.jpg',
          alt: 'CSS code formatting and beautification guide showing clean, well-structured stylesheet examples',
        },
      },
      {
        id: 'xml-best-practices-guide',
        title: 'XML Best Practices Guide: Writing Clean, Efficient XML',
        slug: 'xml-best-practices-guide',
        excerpt:
          'Master the art of writing professional XML documents with our comprehensive guide covering formatting, validation, optimization, and industry best practices.',
        author: 'SmartTextConverter Team',
        date: '2025-10-05',
        category: 'Programming',
        tags: [
          'XML best practices',
          'XML formatting',
          'XML validation',
          'XML optimization',
          'XML security',
          'XML tools',
          'XML guide',
          'XML tutorial',
          'data format',
          'web development',
        ],
        readTime: '12 min read',
        featured: true,
        image: {
          url: 'blog-images/xml-best-practices-guide.webp',
          alt: 'XML best practices guide showing clean XML code structure and formatting techniques',
        },
      },
    ];

    this.filteredPosts = [...this.posts];
    this.categories = [
      { id: 'all', name: 'All Categories', description: 'All blog posts', slug: 'all' },
      {
        id: 'Guides',
        name: 'Guides',
        description: 'Comprehensive guides and tutorials',
        slug: 'guides',
      },
      {
        id: 'Programming',
        name: 'Programming',
        description: 'Programming tips and conventions',
        slug: 'programming',
      },
      { id: 'SEO', name: 'SEO', description: 'Search engine optimization tips', slug: 'seo' },
      {
        id: 'Accessibility',
        name: 'Accessibility',
        description: 'Web accessibility and inclusive design',
        slug: 'accessibility',
      },
      {
        id: 'Best Practices',
        name: 'Best Practices',
        description: 'Industry best practices and standards',
        slug: 'best-practices',
      },
      {
        id: 'E-commerce',
        name: 'E-commerce',
        description: 'E-commerce optimization and case conversion',
        slug: 'e-commerce',
      },
      {
        id: 'Social Media',
        name: 'Social Media',
        description: 'Social media formatting and engagement optimization',
        slug: 'social-media',
      },
      {
        id: 'Email Marketing',
        name: 'Email Marketing',
        description: 'Email marketing optimization and deliverability',
        slug: 'email-marketing',
      },
      {
        id: 'Technical Documentation',
        name: 'Technical Documentation',
        description: 'Technical writing and documentation best practices',
        slug: 'technical-documentation',
      },
      {
        id: 'Content Management',
        name: 'Content Management',
        description: 'CMS optimization and content formatting strategies',
        slug: 'content-management',
      },
      {
        id: 'Text Analysis',
        name: 'Text Analysis',
        description: 'Advanced text processing and analytics techniques',
        slug: 'text-analysis',
      },
      {
        id: 'Comparison',
        name: 'Comparison',
        description: 'Tool comparisons and reviews',
        slug: 'comparison',
      },
    ];
  }

  private setSEO(): void {
    this.seoService.setTitle('Blog — SmartTextConverter | Text Processing Tips & Guides');
    this.seoService.setMetaDescription(
      'Expert tips and guides on text processing, case conversion, programming conventions, SEO best practices, and accessibility guidelines.'
    );
    this.seoService.setMetaKeywords(
      'text processing, case conversion, programming, SEO, accessibility, guides, tips'
    );
    this.seoService.setCanonicalURL('https://smarttextconverter.com/blog');

    this.seoService.setOpenGraphTags({
      title: 'Blog — SmartTextConverter | Text Processing Tips & Guides',
      description:
        'Expert tips and guides on text processing, case conversion, programming conventions, SEO best practices, and accessibility guidelines.',
      type: 'website',
      url: 'https://smarttextconverter.com/blog',
      image: '/main-logo-80x80.png',
    });

    this.seoService.setTwitterCardTags({
      title: 'Blog — SmartTextConverter | Text Processing Tips & Guides',
      description:
        'Expert tips and guides on text processing, case conversion, programming conventions, SEO best practices, and accessibility guidelines.',
      image: '/main-logo-80x80.png',
      card: 'summary_large_image',
    });
  }

  private addStructuredData(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'SmartTextConverter Blog',
      description:
        'Expert tips and guides on text processing, case conversion, programming conventions, SEO best practices, and accessibility guidelines.',
      url: 'https://smarttextconverter.com/blog',
      publisher: {
        '@type': 'Organization',
        name: 'SmartTextConverter',
        url: 'https://smarttextconverter.com',
        logo: {
          '@type': 'ImageObject',
          url: '/main-logo-80x80.png',
        },
      },
      blogPost: this.posts.map(post => ({
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        url:
          post.category === 'Comparison'
            ? `https://smarttextconverter.com/comparison/${post.slug}`
            : `https://smarttextconverter.com/blog/${post.slug}`,
        datePublished: post.date,
        author: {
          '@type': 'Organization',
          name: post.author,
        },
        keywords: post.tags.join(', '),
        articleSection: post.category,
      })),
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }

  onCategoryChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedCategory = target.value;
    this.filterPosts();
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery = target.value;
    this.filterPosts();
  }

  private filterPosts(): void {
    this.filteredPosts = this.posts.filter(post => {
      const matchesCategory =
        this.selectedCategory === 'All' ||
        this.selectedCategory === 'all' ||
        post.category === this.selectedCategory;

      const matchesSearch =
        this.searchQuery === '' ||
        this.searchQuery.trim() === '' ||
        post.title.toLowerCase().includes(this.searchQuery.toLowerCase().trim()) ||
        post.excerpt.toLowerCase().includes(this.searchQuery.toLowerCase().trim()) ||
        post.tags.some(tag => tag.toLowerCase().includes(this.searchQuery.toLowerCase().trim()));

      return matchesCategory && matchesSearch;
    });
  }

  navigateToPost(post: BlogPostData): void {
    // Handle comparison pages routing
    if (post.category === 'Comparison') {
      this.router.navigate(['/comparison', post.slug]).then(() => {
        // Scroll to top after navigation
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    } else {
      this.router.navigate(['/blog', post.slug]).then(() => {
        // Scroll to top after navigation
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  formatExcerpt(excerpt: string): string {
    // Remove markdown formatting from excerpts for clean display
    return excerpt
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/`([^`]+)`/g, '$1') // Remove inline code
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
      .trim();
  }
}
