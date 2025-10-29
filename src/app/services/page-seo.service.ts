import { Injectable } from '@angular/core';
import { SEOService, SEOData } from './seo.service';

export interface PageSEOData {
  title: string;
  description: string;
  keywords: string;
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class PageSEOService {
  private baseUrl = 'https://smarttextconverter.com';

  private pageSEOData: { [key: string]: PageSEOData } = {
    // Home pages
    '': {
      title: 'Text Converter | Free Online Case Converter & Formatter',
      description:
        'Free online text converter and formatter. Convert case, format text, encode/decode, analyze text. Supports 20 languages. No registration required.',
      keywords: 'text converter, case converter, text formatter, online tools, free',
      url: this.baseUrl,
    },
    home: {
      title: 'Text Converter | Free Online Case Converter & Formatter',
      description:
        'Free online text converter and formatter. Convert case, format text, encode/decode, analyze text. Supports 20 languages. No registration required.',
      keywords: 'text converter, case converter, text formatter, online tools, free',
      url: this.baseUrl + '/home',
    },

    // Text Transformation Tools
    'case-converter': {
      title: 'Case Converter | Free Online Text Case Tool',
      description:
        'Convert text between uppercase, lowercase, title case, camelCase, snake_case and more. Free online case converter with instant results.',
      keywords: 'case converter, text case, uppercase, lowercase, title case, camelCase',
      url: this.baseUrl + '/case-converter',
    },
    'text-formatter': {
      title: 'Text Formatter | Free Online Text Formatting Tool',
      description:
        'Format and beautify your text online. Remove extra spaces, fix line breaks, format paragraphs and clean up text formatting.',
      keywords: 'text formatter, text formatting, beautify text, clean text, format text',
      url: this.baseUrl + '/text-formatter',
    },
    'encode-decode': {
      title: 'Encode Decode | Free Online Text Encoding Tool',
      description:
        'Encode and decode text using Base64, URL encoding, HTML entities and more. Free online encoding and decoding tools.',
      keywords: 'encode decode, base64, url encoding, html entities, text encoding',
      url: this.baseUrl + '/encode-decode',
    },

    // Analysis & Utilities
    'text-analyzer': {
      title: 'Text Analyzer | Free Online Text Analysis Tool',
      description:
        'Analyze your text with detailed statistics. Count words, characters, sentences, paragraphs and get readability scores.',
      keywords: 'text analyzer, word counter, character counter, text statistics, readability',
      url: this.baseUrl + '/text-analyzer',
    },
    'text-generator': {
      title: 'Text Generator | Free Lorem Ipsum Generator',
      description:
        'Generate Lorem Ipsum text, random text, placeholder text and more. Free online text generator for testing and design.',
      keywords: 'text generator, lorem ipsum, random text, placeholder text, text generator',
      url: this.baseUrl + '/text-generator',
    },
    'line-tools': {
      title: 'Line Tools | Free Online Line Processing Utilities',
      description:
        'Process text line by line. Sort lines, remove duplicates, add line numbers, reverse lines and more line processing tools.',
      keywords: 'line tools, sort lines, remove duplicates, line numbers, text processing',
      url: this.baseUrl + '/line-tools',
    },

    // JSON Tools
    'json/formatter': {
      title: 'JSON Formatter | Free Online JSON Beautifier',
      description:
        'Format, validate and beautify JSON data. Pretty print JSON with syntax highlighting and error detection.',
      keywords: 'json formatter, json beautifier, json validator, pretty print json',
      url: this.baseUrl + '/json/formatter',
    },
    'json/parser': {
      title: 'JSON Parser | Free Online JSON Validator Tool',
      description:
        'Parse and validate JSON data online. Check JSON syntax, format JSON and get detailed error messages.',
      keywords: 'json parser, json validator, json syntax checker, json formatter',
      url: this.baseUrl + '/json/parser',
    },

    // Code Formatters
    'js/formatter': {
      title: 'JavaScript Formatter | Free Online JS Beautifier',
      description:
        'Format and beautify JavaScript code online. Fix indentation, add semicolons and improve code readability.',
      keywords: 'javascript formatter, js beautifier, code formatter, javascript beautify',
      url: this.baseUrl + '/js/formatter',
    },
    'html/formatter': {
      title: 'HTML Formatter | Free Online HTML Beautifier',
      description:
        'Format and beautify HTML code online. Fix indentation, validate HTML and improve code structure.',
      keywords: 'html formatter, html beautifier, html validator, html prettify',
      url: this.baseUrl + '/html/formatter',
    },
    'css/formatter': {
      title: 'CSS Formatter | Free Online CSS Beautifier',
      description:
        'Format and beautify CSS code online. Fix indentation, organize properties and improve CSS readability.',
      keywords: 'css formatter, css beautifier, css validator, css prettify',
      url: this.baseUrl + '/css/formatter',
    },
    'sql/formatter': {
      title: 'SQL Formatter | Free Online SQL Beautifier',
      description:
        'Format and beautify SQL queries online. Fix indentation, organize clauses and improve SQL readability.',
      keywords: 'sql formatter, sql beautifier, sql validator, sql prettify',
      url: this.baseUrl + '/sql/formatter',
    },
    'xml/formatter': {
      title: 'XML Formatter | Free Online XML Beautifier',
      description:
        'Format and beautify XML code online. Fix indentation, validate XML and improve code structure.',
      keywords: 'xml formatter, xml beautifier, xml validator, xml prettify',
      url: this.baseUrl + '/xml/formatter',
    },

    // Blog
    blog: {
      title: 'Text Converter Blog | Tips & Guides',
      description:
        'Learn text processing tips, case conversion best practices, and developer guides. Expert insights on text formatting and analysis.',
      keywords:
        'text converter blog, case conversion tips, text formatting guides, developer tutorials',
      url: this.baseUrl + '/blog',
    },

    // Blog Posts
    'blog/complete-guide-text-case-conversion': {
      title: 'Case Conversion Guide | Complete Tutorial',
      description:
        'Complete guide to text case conversion. Learn uppercase, lowercase, title case, camelCase, snake_case and more with examples.',
      keywords:
        'case conversion guide, text case tutorial, uppercase lowercase, camelCase snake_case',
      url: this.baseUrl + '/blog/complete-guide-text-case-conversion',
    },
    'blog/case-conversion-best-practices-when-how-use-different-case-styles': {
      title: 'Case Conversion Best Practices | Guide',
      description:
        'Best practices for case conversion in programming, writing, and design. When and how to use different case styles effectively.',
      keywords: 'case conversion best practices, programming conventions, text case guidelines',
      url: this.baseUrl + '/blog/case-conversion-best-practices-when-how-use-different-case-styles',
    },
    'blog/json-formatting-complete-guide': {
      title: 'JSON Formatting Guide | Complete Tutorial',
      description:
        'Complete guide to JSON formatting and validation. Learn best practices for formatting JSON data and handling errors.',
      keywords: 'json formatting guide, json tutorial, json best practices, json validation',
      url: this.baseUrl + '/blog/json-formatting-complete-guide',
    },
    'blog/json-validation-developer-guide': {
      title: 'JSON Validation Guide | Developer Tutorial',
      description:
        'Developer guide to JSON validation. Learn how to validate JSON data, handle errors, and implement robust JSON processing.',
      keywords:
        'json validation guide, json developer tutorial, json error handling, json processing',
      url: this.baseUrl + '/blog/json-validation-developer-guide',
    },
    'blog/json-performance-optimization': {
      title: 'JSON Performance Optimization | Guide',
      description:
        'Optimize JSON performance in your applications. Learn techniques for faster JSON parsing, compression, and processing.',
      keywords:
        'json performance optimization, json parsing speed, json compression, json best practices',
      url: this.baseUrl + '/blog/json-performance-optimization',
    },
    'blog/javascript-formatter-complete-guide': {
      title: 'JavaScript Formatter Guide | Complete Tutorial',
      description:
        'Complete guide to JavaScript formatting and beautification. Learn best practices for clean, readable JavaScript code.',
      keywords:
        'javascript formatter guide, js formatting tutorial, javascript best practices, code formatting',
      url: this.baseUrl + '/blog/javascript-formatter-complete-guide',
    },
    'blog/html-formatter-complete-guide': {
      title: 'HTML Formatter Guide | Complete Tutorial',
      description:
        'Complete guide to HTML formatting and validation. Learn best practices for clean, semantic HTML code structure.',
      keywords:
        'html formatter guide, html formatting tutorial, html best practices, html validation',
      url: this.baseUrl + '/blog/html-formatter-complete-guide',
    },
    'blog/xml-best-practices-guide': {
      title: 'XML Best Practices Guide | Tutorial',
      description:
        'XML best practices and formatting guidelines. Learn how to create well-formed, valid XML documents.',
      keywords: 'xml best practices, xml formatting guide, xml tutorial, xml validation',
      url: this.baseUrl + '/blog/xml-best-practices-guide',
    },
    'blog/css-formatter-complete-guide': {
      title: 'CSS Formatter Guide | Complete Tutorial',
      description:
        'Complete guide to CSS formatting and organization. Learn best practices for clean, maintainable CSS code.',
      keywords:
        'css formatter guide, css formatting tutorial, css best practices, css organization',
      url: this.baseUrl + '/blog/css-formatter-complete-guide',
    },
    'blog/sql-formatter-guide': {
      title: 'SQL Formatter Guide | Complete Tutorial',
      description:
        'Complete guide to SQL formatting and best practices. Learn how to write clean, readable SQL queries.',
      keywords: 'sql formatter guide, sql formatting tutorial, sql best practices, sql readability',
      url: this.baseUrl + '/blog/sql-formatter-guide',
    },
    'blog/programming-case-conventions-camelcase-vs-snake-case': {
      title: 'Programming Conventions | Case Styles Guide',
      description:
        'Programming case conventions guide. Learn when to use camelCase, snake_case, PascalCase and other naming conventions.',
      keywords: 'programming conventions, case styles, camelCase snake_case, naming conventions',
      url: this.baseUrl + '/blog/programming-case-conventions-camelcase-vs-snake-case',
    },
    'blog/text-analysis-beyond-case-conversion': {
      title: 'Text Analysis Guide | Beyond Case Conversion',
      description:
        'Advanced text analysis techniques beyond case conversion. Learn about text processing, analysis, and manipulation.',
      keywords: 'text analysis guide, text processing, text manipulation, advanced text tools',
      url: this.baseUrl + '/blog/text-analysis-beyond-case-conversion',
    },
    'blog/technical-documentation-case-conversion': {
      title: 'Technical Documentation | Case Conversion',
      description:
        'Case conversion best practices for technical documentation. Learn how to maintain consistent formatting in docs.',
      keywords:
        'technical documentation, case conversion, documentation formatting, technical writing',
      url: this.baseUrl + '/blog/technical-documentation-case-conversion',
    },
    'blog/social-media-case-conversion': {
      title: 'Social Media | Case Conversion Guide',
      description:
        'Case conversion strategies for social media content. Learn how to optimize text formatting for different platforms.',
      keywords: 'social media case conversion, social media formatting, content optimization',
      url: this.baseUrl + '/blog/social-media-case-conversion',
    },
    'blog/email-marketing-case-conversion': {
      title: 'Email Marketing | Case Conversion Guide',
      description:
        'Case conversion best practices for email marketing. Learn how to optimize subject lines and content formatting.',
      keywords: 'email marketing case conversion, email formatting, subject line optimization',
      url: this.baseUrl + '/blog/email-marketing-case-conversion',
    },
    'blog/ecommerce-case-conversion': {
      title: 'E-commerce | Case Conversion Guide',
      description:
        'Case conversion strategies for e-commerce content. Learn how to optimize product descriptions and category names.',
      keywords: 'ecommerce case conversion, product descriptions, category optimization',
      url: this.baseUrl + '/blog/ecommerce-case-conversion',
    },
    'blog/cms-case-conversion': {
      title: 'CMS | Case Conversion Guide',
      description:
        'Case conversion best practices for CMS content. Learn how to maintain consistent formatting across your website.',
      keywords: 'cms case conversion, content management, website formatting, cms best practices',
      url: this.baseUrl + '/blog/cms-case-conversion',
    },
    'blog/seo-best-practices-title-case-vs-sentence-case': {
      title: 'SEO Best Practices | Title Case vs Sentence',
      description:
        'SEO best practices for title case vs sentence case. Learn how case formatting affects search engine optimization.',
      keywords: 'seo best practices, title case sentence case, seo formatting, search optimization',
      url: this.baseUrl + '/blog/seo-best-practices-title-case-vs-sentence-case',
    },
    'blog/accessibility-best-practices': {
      title: 'Accessibility Best Practices | Guide',
      description:
        'Accessibility best practices for text formatting and content. Learn how to make your content accessible to all users.',
      keywords: 'accessibility best practices, accessible content, text formatting accessibility',
      url: this.baseUrl + '/blog/accessibility-best-practices',
    },

    // Comparison Pages
    'comparison/best-case-converters-2024': {
      title: 'Best Case Converters 2024 | Comparison',
      description:
        'Compare the best case converter tools of 2024. Find the perfect text case conversion tool for your needs.',
      keywords: 'best case converters 2024, case converter comparison, text case tools',
      url: this.baseUrl + '/comparison/best-case-converters-2024',
    },
    'comparison/convertcase-net': {
      title: 'ConvertCase.net vs SmartTextConverter',
      description:
        'Compare ConvertCase.net vs SmartTextConverter. See features, performance, and user experience differences.',
      keywords: 'convertcase.net vs smarttextconverter, case converter comparison, text tools',
      url: this.baseUrl + '/comparison/convertcase-net',
    },
    'comparison/caseconverter-org': {
      title: 'CaseConverter.org vs SmartTextConverter',
      description:
        'Compare CaseConverter.org vs SmartTextConverter. See features, performance, and user experience differences.',
      keywords: 'caseconverter.org vs smarttextconverter, case converter comparison, text tools',
      url: this.baseUrl + '/comparison/caseconverter-org',
    },
    'comparison/textcase-org': {
      title: 'TextCase.org vs SmartTextConverter',
      description:
        'Compare TextCase.org vs SmartTextConverter. See features, performance, and user experience differences.',
      keywords: 'textcase.org vs smarttextconverter, case converter comparison, text tools',
      url: this.baseUrl + '/comparison/textcase-org',
    },

    // Landing Pages
    'landing/text-processing': {
      title: 'Text Processing Tools | SmartTextConverter',
      description:
        'Comprehensive text processing tools for all your needs. Convert case, format text, analyze content and more.',
      keywords: 'text processing tools, text analysis, text formatting, online text tools',
      url: this.baseUrl + '/landing/text-processing',
    },
    'landing/developer-tools': {
      title: 'Developer Tools | SmartTextConverter',
      description:
        'Essential developer tools for text processing. JSON formatter, code beautifier, and text analysis tools.',
      keywords: 'developer tools, json formatter, code beautifier, text processing tools',
      url: this.baseUrl + '/landing/developer-tools',
    },
    'landing/tools': {
      title: 'Free Online Text Tools | SmartTextConverter',
      description:
        'Free online text tools for all your needs. No registration required. Convert, format, analyze and process text instantly.',
      keywords: 'free online text tools, text converter, text formatter, online tools',
      url: this.baseUrl + '/landing/tools',
    },

    // Legal & Info Pages
    privacy: {
      title: 'Privacy Policy | SmartTextConverter',
      description:
        'Privacy policy for SmartTextConverter. Learn how we protect your data and respect your privacy.',
      keywords: 'privacy policy, data protection, privacy, smarttextconverter',
      url: this.baseUrl + '/privacy',
    },
    terms: {
      title: 'Terms of Service | SmartTextConverter',
      description:
        'Terms of service for SmartTextConverter. Learn about our terms and conditions for using our services.',
      keywords: 'terms of service, terms and conditions, smarttextconverter terms',
      url: this.baseUrl + '/terms',
    },
    contact: {
      title: 'Contact Us | SmartTextConverter',
      description:
        'Contact SmartTextConverter for support, feedback, or questions. We are here to help with your text processing needs.',
      keywords: 'contact us, support, feedback, smarttextconverter contact',
      url: this.baseUrl + '/contact',
    },

    // 404 Page
    '404': {
      title: 'Page Not Found | SmartTextConverter',
      description:
        'Page not found. Return to SmartTextConverter homepage to access our free online text processing tools.',
      keywords: 'page not found, 404, smarttextconverter',
      url: this.baseUrl + '/404',
    },
  };

  constructor(private seoService: SEOService) {}

  /**
   * Get SEO data for a specific route
   */
  getSEOData(route: string): PageSEOData | null {
    return this.pageSEOData[route] || null;
  }

  /**
   * Apply SEO data for a specific route
   */
  applySEOForRoute(route: string): void {
    const seoData = this.getSEOData(route);
    if (seoData) {
      const fullSEOData: SEOData = {
        title: seoData.title,
        description: seoData.description,
        keywords: seoData.keywords,
        url: seoData.url,
        type: 'website',
        image: this.baseUrl + '/og-image.png',
        locale: 'en_US',
        canonicalUrl: seoData.url,
      };

      this.seoService.updateSEO(fullSEOData);
    }
  }

  /**
   * Get all available routes
   */
  getAllRoutes(): string[] {
    return Object.keys(this.pageSEOData);
  }

  /**
   * Check if a route has SEO data
   */
  hasSEOData(route: string): boolean {
    return this.pageSEOData.hasOwnProperty(route);
  }
}
