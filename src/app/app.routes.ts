import { Routes } from '@angular/router';

export const routes: Routes = [
  // Home route alias (no redirect to avoid SEO issues)
  {
    path: 'home',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
    title: 'Text Converter — Free Online Text Case Converter & Formatter',
  },

  // Home route (default) - Using test home page
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
    title: 'Text Converter — Free Online Text Case Converter & Formatter',
  },

  // Text Transformation Tools
  {
    path: 'case-converter',
    loadComponent: () =>
      import('./components/case-converter/case-converter.component').then(
        m => m.CaseConverterComponent
      ),
    title: 'Case Converter - Convert Text Case Online',
  },
  {
    path: 'text-formatter',
    loadComponent: () =>
      import('./components/text-formatter/text-formatter.component').then(
        m => m.TextFormatterComponent
      ),
    title: 'Text Formatter - Format Your Text Online',
  },
  {
    path: 'encode-decode',
    loadComponent: () =>
      import('./components/encode-decode/encode-decode.component').then(
        m => m.EncodeDecodeComponent
      ),
    title: 'Encode/Decode - Text Encoding & Decoding Tool',
  },

  // Analysis & Utilities
  {
    path: 'text-analyzer',
    loadComponent: () =>
      import('./components/text-analyzer/text-analyzer.component').then(
        m => m.TextAnalyzerComponent
      ),
    title: 'Text Analyzer - Analyze Your Text',
  },
  {
    path: 'text-generator',
    loadComponent: () =>
      import('./components/text-generator/text-generator.component').then(
        m => m.TextGeneratorComponent
      ),
    title: 'Text Generator - Generate Lorem Ipsum & More',
  },
  {
    path: 'line-tools',
    loadComponent: () =>
      import('./components/line-tools/line-tools.component').then(m => m.LineToolsComponent),
    title: 'Line Tools - List & Line Utilities',
  },

  // JSON Tools
  {
    path: 'json/formatter',
    loadComponent: () =>
      import('./components/json-formatter/json-formatter.component').then(
        m => m.JsonFormatterComponent
      ),
    title: 'JSON Formatter - Format & Beautify JSON',
  },
  {
    path: 'json/parser',
    loadComponent: () =>
      import('./components/json-parser/json-parser.component').then(m => m.JsonParserComponent),
    title: 'JSON Parser - Parse & Validate JSON',
  },

  // Code Formatters
  {
    path: 'js/formatter',
    loadComponent: () =>
      import('./components/js-formatter/js-formatter.component').then(m => m.JsFormatterComponent),
    title: 'JavaScript Formatter - Format JS Code',
  },
  {
    path: 'html/formatter',
    loadComponent: () =>
      import('./components/html-formatter/html-formatter.component').then(
        m => m.HtmlFormatterComponent
      ),
    title: 'HTML Formatter - Format & Beautify HTML',
  },
  {
    path: 'css/formatter',
    loadComponent: () =>
      import('./components/css-formatter/css-formatter.component').then(
        m => m.CssFormatterComponent
      ),
    title: 'CSS Formatter - Format & Beautify CSS',
  },
  {
    path: 'sql/formatter',
    loadComponent: () =>
      import('./components/sql-formatter/sql-formatter.component').then(
        m => m.SqlFormatterComponent
      ),
    title: 'SQL Formatter - Format SQL Queries',
  },
  {
    path: 'xml/formatter',
    loadComponent: () =>
      import('./components/xml-formatter/xml-formatter.component').then(
        m => m.XmlFormatterComponent
      ),
    title: 'XML Formatter - Format & Beautify XML',
  },

  // Blog
  {
    path: 'blog',
    loadComponent: () => import('./components/blog/blog').then(m => m.Blog),
    title: 'Blog - Text Converter Tips & Guides',
  },

  // Blog Posts
  {
    path: 'blog/complete-guide-text-case-conversion',
    loadComponent: () =>
      import('./components/blog-posts/case-conversion-guide/case-conversion-guide.component').then(
        m => m.CaseConversionGuideComponent
      ),
    title: 'Case Conversion Guide - Complete Tutorial',
  },
  {
    path: 'blog/case-conversion-best-practices-when-how-use-different-case-styles',
    loadComponent: () =>
      import(
        './components/blog-posts/case-conversion-best-practices/case-conversion-best-practices.component'
      ).then(m => m.CaseConversionBestPracticesComponent),
    title: 'Case Conversion Best Practices',
  },
  {
    path: 'blog/json-formatting-complete-guide',
    loadComponent: () =>
      import('./components/blog-posts/json-formatting-guide/json-formatting-guide.component').then(
        m => m.JsonFormattingGuideComponent
      ),
    title: 'JSON Formatting Guide',
  },
  {
    path: 'blog/json-validation-developer-guide',
    loadComponent: () =>
      import('./components/blog-posts/json-validation-guide/json-validation-guide.component').then(
        m => m.JsonValidationGuideComponent
      ),
    title: 'JSON Validation Guide',
  },
  {
    path: 'blog/json-performance-optimization',
    loadComponent: () =>
      import(
        './components/blog-posts/json-performance-optimization/json-performance-optimization.component'
      ).then(m => m.JsonPerformanceOptimizationComponent),
    title: 'JSON Performance Optimization',
  },
  {
    path: 'blog/javascript-formatter-complete-guide',
    loadComponent: () =>
      import(
        './components/blog-posts/javascript-formatter-guide/javascript-formatter-guide.component'
      ).then(m => m.JavascriptFormatterGuideComponent),
    title: 'JavaScript Formatter Guide',
  },
  {
    path: 'blog/html-formatter-complete-guide',
    loadComponent: () =>
      import('./components/blog-posts/html-formatter-guide/html-formatter-guide.component').then(
        m => m.HtmlFormatterGuideComponent
      ),
    title: 'HTML Formatter Guide',
  },
  {
    path: 'blog/xml-best-practices-guide',
    loadComponent: () =>
      import(
        './components/blog-posts/xml-best-practices-guide/xml-best-practices-guide.component'
      ).then(m => m.XmlBestPracticesGuideComponent),
    title: 'XML Best Practices Guide',
  },
  {
    path: 'blog/css-formatter-complete-guide',
    loadComponent: () =>
      import('./components/blog-posts/css-formatter-guide/css-formatter-guide.component').then(
        m => m.CssFormatterGuideComponent
      ),
    title: 'CSS Formatter Guide',
  },
  {
    path: 'blog/sql-formatter-guide',
    loadComponent: () =>
      import('./components/blog-posts/sql-formatter-guide/sql-formatter-guide.component').then(
        m => m.SqlFormatterGuideComponent
      ),
    title: 'SQL Formatter Guide',
  },
  {
    path: 'blog/programming-case-conventions-camelcase-vs-snake-case',
    loadComponent: () =>
      import(
        './components/blog-posts/programming-conventions/programming-conventions.component'
      ).then(m => m.ProgrammingConventionsComponent),
    title: 'Programming Conventions Guide',
  },
  {
    path: 'blog/text-analysis-beyond-case-conversion',
    loadComponent: () =>
      import(
        './components/blog-posts/text-analysis-beyond-case-conversion/text-analysis-beyond-case-conversion.component'
      ).then(m => m.TextAnalysisBeyondCaseConversionComponent),
    title: 'Text Analysis Beyond Case Conversion',
  },
  {
    path: 'blog/technical-documentation-case-conversion',
    loadComponent: () =>
      import(
        './components/blog-posts/technical-documentation-case-conversion/technical-documentation-case-conversion.component'
      ).then(m => m.TechnicalDocumentationCaseConversionComponent),
    title: 'Technical Documentation Case Conversion',
  },
  {
    path: 'blog/social-media-case-conversion',
    loadComponent: () =>
      import(
        './components/blog-posts/social-media-case-conversion/social-media-case-conversion.component'
      ).then(m => m.SocialMediaCaseConversionComponent),
    title: 'Social Media Case Conversion',
  },
  {
    path: 'blog/email-marketing-case-conversion',
    loadComponent: () =>
      import(
        './components/blog-posts/email-marketing-case-conversion/email-marketing-case-conversion.component'
      ).then(m => m.EmailMarketingCaseConversionComponent),
    title: 'Email Marketing Case Conversion',
  },
  {
    path: 'blog/ecommerce-case-conversion',
    loadComponent: () =>
      import(
        './components/blog-posts/ecommerce-case-conversion/ecommerce-case-conversion.component'
      ).then(m => m.EcommerceCaseConversionComponent),
    title: 'E-commerce Case Conversion',
  },
  {
    path: 'blog/cms-case-conversion',
    loadComponent: () =>
      import('./components/blog-posts/cms-case-conversion/cms-case-conversion.component').then(
        m => m.CmsCaseConversionComponent
      ),
    title: 'CMS Case Conversion',
  },
  {
    path: 'blog/seo-best-practices-title-case-vs-sentence-case',
    loadComponent: () =>
      import('./components/blog-posts/seo-blog/seo-blog.component').then(m => m.SeoBlogComponent),
    title: 'SEO Best Practices',
  },
  {
    path: 'blog/accessibility-best-practices',
    loadComponent: () =>
      import('./components/blog-posts/accessibility-blog/accessibility-blog.component').then(
        m => m.AccessibilityBlogComponent
      ),
    title: 'Accessibility Best Practices',
  },

  // Comparison Pages
  {
    path: 'comparison/best-case-converters-2024',
    loadComponent: () =>
      import(
        './components/comparison-pages/best-case-converters-2024/best-case-converters-2024.component'
      ).then(m => m.BestCaseConverters2024Component),
    title: 'Best Case Converters 2024 - Comparison',
  },
  {
    path: 'comparison/convertcase-net',
    loadComponent: () =>
      import(
        './components/comparison-pages/convertcase-net-comparison/convertcase-net-comparison.component'
      ).then(m => m.ConvertcaseNetComparisonComponent),
    title: 'ConvertCase.net vs Smart Text Converter',
  },
  {
    path: 'comparison/caseconverter-org',
    loadComponent: () =>
      import(
        './components/comparison-pages/caseconverter-org-comparison/caseconverter-org-comparison.component'
      ).then(m => m.CaseconverterOrgComparisonComponent),
    title: 'CaseConverter.org vs Smart Text Converter',
  },
  {
    path: 'comparison/textcase-org',
    loadComponent: () =>
      import(
        './components/comparison-pages/textcase-org-comparison/textcase-org-comparison.component'
      ).then(m => m.TextcaseOrgComparisonComponent),
    title: 'TextCase.org vs Smart Text Converter',
  },

  // Landing Pages
  {
    path: 'landing/text-processing',
    loadComponent: () =>
      import(
        './components/landing-pages/text-processing-landing/text-processing-landing.component'
      ).then(m => m.TextProcessingLandingComponent),
    title: 'Text Processing Tools - Smart Text Converter',
  },
  {
    path: 'landing/developer-tools',
    loadComponent: () =>
      import(
        './components/landing-pages/developer-tools-landing/developer-tools-landing.component'
      ).then(m => m.DeveloperToolsLandingComponent),
    title: 'Developer Tools - Smart Text Converter',
  },
  {
    path: 'landing/tools',
    loadComponent: () =>
      import('./components/landing-pages/tools-landing/tools-landing.component').then(
        m => m.ToolsLandingComponent
      ),
    title: 'Free Online Text Tools',
  },

  // Legal & Info Pages
  {
    path: 'privacy',
    loadComponent: () =>
      import('./components/privacy/privacy.component').then(m => m.PrivacyComponent),
    title: 'Privacy Policy - Smart Text Converter',
  },
  {
    path: 'terms',
    loadComponent: () => import('./components/terms/terms.component').then(m => m.TermsComponent),
    title: 'Terms of Service - Smart Text Converter',
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./components/contact/contact.component').then(m => m.ContactComponent),
    title: 'Contact Us - Smart Text Converter',
  },

  // Wildcard route - 404 (no redirect to avoid SEO issues)
  {
    path: '**',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
    title: 'Page Not Found - SmartTextConverter',
  },
];
