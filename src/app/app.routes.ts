import { Routes } from '@angular/router';

export const routes: Routes = [
  // Home route alias (no redirect to avoid SEO issues)
  {
    path: 'home',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
    title: 'Text Converter | Free Online Case Converter & Formatter',
  },

  // Home route (default) - Using test home page
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
    title: 'Text Converter | Free Online Case Converter & Formatter',
  },

  // Text Transformation Tools
  {
    path: 'case-converter',
    loadComponent: () =>
      import('./components/case-converter/case-converter.component').then(
        m => m.CaseConverterComponent
      ),
    title: 'Case Converter | Free Online Text Case Tool',
  },
  {
    path: 'text-formatter',
    loadComponent: () =>
      import('./components/text-formatter/text-formatter.component').then(
        m => m.TextFormatterComponent
      ),
    title: 'Text Formatter | Free Online Text Formatting Tool',
  },
  {
    path: 'encode-decode',
    loadComponent: () =>
      import('./components/encode-decode/encode-decode.component').then(
        m => m.EncodeDecodeComponent
      ),
    title: 'Encode Decode | Free Online Text Encoding Tool',
  },

  // Analysis & Utilities
  {
    path: 'text-analyzer',
    loadComponent: () =>
      import('./components/text-analyzer/text-analyzer.component').then(
        m => m.TextAnalyzerComponent
      ),
    title: 'Text Analyzer | Free Online Text Analysis Tool',
  },
  {
    path: 'text-generator',
    loadComponent: () =>
      import('./components/text-generator/text-generator.component').then(
        m => m.TextGeneratorComponent
      ),
    title: 'Text Generator | Free Lorem Ipsum Generator',
  },
  {
    path: 'line-tools',
    loadComponent: () =>
      import('./components/line-tools/line-tools.component').then(m => m.LineToolsComponent),
    title: 'Line Tools | Free Online Line Processing Utilities',
  },

  // JSON Tools
  {
    path: 'json/formatter',
    loadComponent: () =>
      import('./components/json-formatter/json-formatter.component').then(
        m => m.JsonFormatterComponent
      ),
    title: 'JSON Formatter | Free Online JSON Beautifier',
  },
  {
    path: 'json/parser',
    loadComponent: () =>
      import('./components/json-parser/json-parser.component').then(m => m.JsonParserComponent),
    title: 'JSON Parser | Free Online JSON Validator Tool',
  },

  // Code Formatters
  {
    path: 'js/formatter',
    loadComponent: () =>
      import('./components/js-formatter/js-formatter.component').then(m => m.JsFormatterComponent),
    title: 'JavaScript Formatter | Free Online JS Beautifier',
  },
  {
    path: 'html/formatter',
    loadComponent: () =>
      import('./components/html-formatter/html-formatter.component').then(
        m => m.HtmlFormatterComponent
      ),
    title: 'HTML Formatter | Free Online HTML Beautifier',
  },
  {
    path: 'css/formatter',
    loadComponent: () =>
      import('./components/css-formatter/css-formatter.component').then(
        m => m.CssFormatterComponent
      ),
    title: 'CSS Formatter | Free Online CSS Beautifier',
  },
  {
    path: 'sql/formatter',
    loadComponent: () =>
      import('./components/sql-formatter/sql-formatter.component').then(
        m => m.SqlFormatterComponent
      ),
    title: 'SQL Formatter | Free Online SQL Beautifier',
  },
  {
    path: 'xml/formatter',
    loadComponent: () =>
      import('./components/xml-formatter/xml-formatter.component').then(
        m => m.XmlFormatterComponent
      ),
    title: 'XML Formatter | Free Online XML Beautifier',
  },

  // Blog
  {
    path: 'blog',
    loadComponent: () => import('./components/blog/blog').then(m => m.Blog),
    title: 'Text Converter Blog | Tips & Guides',
  },

  // Blog Posts
  {
    path: 'blog/complete-guide-text-case-conversion',
    loadComponent: () =>
      import('./components/blog-posts/case-conversion-guide/case-conversion-guide.component').then(
        m => m.CaseConversionGuideComponent
      ),
    title: 'Case Conversion Guide | Complete Tutorial',
  },
  {
    path: 'blog/case-conversion-best-practices-when-how-use-different-case-styles',
    loadComponent: () =>
      import(
        './components/blog-posts/case-conversion-best-practices/case-conversion-best-practices.component'
      ).then(m => m.CaseConversionBestPracticesComponent),
    title: 'Case Conversion Best Practices | Guide',
  },
  {
    path: 'blog/json-formatting-complete-guide',
    loadComponent: () =>
      import('./components/blog-posts/json-formatting-guide/json-formatting-guide.component').then(
        m => m.JsonFormattingGuideComponent
      ),
    title: 'JSON Formatting Guide | Complete Tutorial',
  },
  {
    path: 'blog/json-validation-developer-guide',
    loadComponent: () =>
      import('./components/blog-posts/json-validation-guide/json-validation-guide.component').then(
        m => m.JsonValidationGuideComponent
      ),
    title: 'JSON Validation Guide | Developer Tutorial',
  },
  {
    path: 'blog/json-performance-optimization',
    loadComponent: () =>
      import(
        './components/blog-posts/json-performance-optimization/json-performance-optimization.component'
      ).then(m => m.JsonPerformanceOptimizationComponent),
    title: 'JSON Performance Optimization | Guide',
  },
  {
    path: 'blog/javascript-formatter-complete-guide',
    loadComponent: () =>
      import(
        './components/blog-posts/javascript-formatter-guide/javascript-formatter-guide.component'
      ).then(m => m.JavascriptFormatterGuideComponent),
    title: 'JavaScript Formatter Guide | Complete Tutorial',
  },
  {
    path: 'blog/html-formatter-complete-guide',
    loadComponent: () =>
      import('./components/blog-posts/html-formatter-guide/html-formatter-guide.component').then(
        m => m.HtmlFormatterGuideComponent
      ),
    title: 'HTML Formatter Guide | Complete Tutorial',
  },
  {
    path: 'blog/xml-best-practices-guide',
    loadComponent: () =>
      import(
        './components/blog-posts/xml-best-practices-guide/xml-best-practices-guide.component'
      ).then(m => m.XmlBestPracticesGuideComponent),
    title: 'XML Best Practices Guide | Tutorial',
  },
  {
    path: 'blog/css-formatter-complete-guide',
    loadComponent: () =>
      import('./components/blog-posts/css-formatter-guide/css-formatter-guide.component').then(
        m => m.CssFormatterGuideComponent
      ),
    title: 'CSS Formatter Guide | Complete Tutorial',
  },
  {
    path: 'blog/sql-formatter-guide',
    loadComponent: () =>
      import('./components/blog-posts/sql-formatter-guide/sql-formatter-guide.component').then(
        m => m.SqlFormatterGuideComponent
      ),
    title: 'SQL Formatter Guide | Complete Tutorial',
  },
  {
    path: 'blog/programming-case-conventions-camelcase-vs-snake-case',
    loadComponent: () =>
      import(
        './components/blog-posts/programming-conventions/programming-conventions.component'
      ).then(m => m.ProgrammingConventionsComponent),
    title: 'Programming Conventions | Case Styles Guide',
  },
  {
    path: 'blog/text-analysis-beyond-case-conversion',
    loadComponent: () =>
      import(
        './components/blog-posts/text-analysis-beyond-case-conversion/text-analysis-beyond-case-conversion.component'
      ).then(m => m.TextAnalysisBeyondCaseConversionComponent),
    title: 'Text Analysis Guide | Beyond Case Conversion',
  },
  {
    path: 'blog/technical-documentation-case-conversion',
    loadComponent: () =>
      import(
        './components/blog-posts/technical-documentation-case-conversion/technical-documentation-case-conversion.component'
      ).then(m => m.TechnicalDocumentationCaseConversionComponent),
    title: 'Technical Documentation | Case Conversion',
  },
  {
    path: 'blog/social-media-case-conversion',
    loadComponent: () =>
      import(
        './components/blog-posts/social-media-case-conversion/social-media-case-conversion.component'
      ).then(m => m.SocialMediaCaseConversionComponent),
    title: 'Social Media | Case Conversion Guide',
  },
  {
    path: 'blog/email-marketing-case-conversion',
    loadComponent: () =>
      import(
        './components/blog-posts/email-marketing-case-conversion/email-marketing-case-conversion.component'
      ).then(m => m.EmailMarketingCaseConversionComponent),
    title: 'Email Marketing | Case Conversion Guide',
  },
  {
    path: 'blog/ecommerce-case-conversion',
    loadComponent: () =>
      import(
        './components/blog-posts/ecommerce-case-conversion/ecommerce-case-conversion.component'
      ).then(m => m.EcommerceCaseConversionComponent),
    title: 'E-commerce | Case Conversion Guide',
  },
  {
    path: 'blog/cms-case-conversion',
    loadComponent: () =>
      import('./components/blog-posts/cms-case-conversion/cms-case-conversion.component').then(
        m => m.CmsCaseConversionComponent
      ),
    title: 'CMS | Case Conversion Guide',
  },
  {
    path: 'blog/seo-best-practices-title-case-vs-sentence-case',
    loadComponent: () =>
      import('./components/blog-posts/seo-blog/seo-blog.component').then(m => m.SeoBlogComponent),
    title: 'SEO Best Practices | Title Case vs Sentence',
  },
  {
    path: 'blog/accessibility-best-practices',
    loadComponent: () =>
      import('./components/blog-posts/accessibility-blog/accessibility-blog.component').then(
        m => m.AccessibilityBlogComponent
      ),
    title: 'Accessibility Best Practices | Guide',
  },

  // Comparison Pages
  {
    path: 'comparison/best-case-converters-2024',
    loadComponent: () =>
      import(
        './components/comparison-pages/best-case-converters-2024/best-case-converters-2024.component'
      ).then(m => m.BestCaseConverters2024Component),
    title: 'Best Case Converters 2024 | Comparison',
  },
  {
    path: 'comparison/convertcase-net',
    loadComponent: () =>
      import(
        './components/comparison-pages/convertcase-net-comparison/convertcase-net-comparison.component'
      ).then(m => m.ConvertcaseNetComparisonComponent),
    title: 'ConvertCase.net vs SmartTextConverter',
  },
  {
    path: 'comparison/caseconverter-org',
    loadComponent: () =>
      import(
        './components/comparison-pages/caseconverter-org-comparison/caseconverter-org-comparison.component'
      ).then(m => m.CaseconverterOrgComparisonComponent),
    title: 'CaseConverter.org vs SmartTextConverter',
  },
  {
    path: 'comparison/textcase-org',
    loadComponent: () =>
      import(
        './components/comparison-pages/textcase-org-comparison/textcase-org-comparison.component'
      ).then(m => m.TextcaseOrgComparisonComponent),
    title: 'TextCase.org vs SmartTextConverter',
  },

  // Landing Pages
  {
    path: 'landing/text-processing',
    loadComponent: () =>
      import(
        './components/landing-pages/text-processing-landing/text-processing-landing.component'
      ).then(m => m.TextProcessingLandingComponent),
    title: 'Text Processing Tools | SmartTextConverter',
  },
  {
    path: 'landing/developer-tools',
    loadComponent: () =>
      import(
        './components/landing-pages/developer-tools-landing/developer-tools-landing.component'
      ).then(m => m.DeveloperToolsLandingComponent),
    title: 'Developer Tools | SmartTextConverter',
  },
  {
    path: 'landing/tools',
    loadComponent: () =>
      import('./components/landing-pages/tools-landing/tools-landing.component').then(
        m => m.ToolsLandingComponent
      ),
    title: 'Free Online Text Tools | SmartTextConverter',
  },

  // Legal & Info Pages
  {
    path: 'privacy',
    loadComponent: () =>
      import('./components/privacy/privacy.component').then(m => m.PrivacyComponent),
    title: 'Privacy Policy | SmartTextConverter',
  },
  {
    path: 'terms',
    loadComponent: () => import('./components/terms/terms.component').then(m => m.TermsComponent),
    title: 'Terms of Service | SmartTextConverter',
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./components/contact/contact.component').then(m => m.ContactComponent),
    title: 'Contact Us | SmartTextConverter',
  },
  {
    path: 'seo-dashboard',
    loadComponent: () =>
      import('./components/seo-dashboard/seo-dashboard.component').then(m => m.SEODashboardComponent),
    title: 'SEO Dashboard | SmartTextConverter',
  },

  // Wildcard route - 404 (proper 404 component with noindex)
  {
    path: '**',
    loadComponent: () => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: '404 - Page Not Found | Smart Text Converter',
  },
];
