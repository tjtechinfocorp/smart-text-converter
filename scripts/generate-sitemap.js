#!/usr/bin/env node

/**
 * Sitemap Generator for SmartTextConverter
 * Generates a comprehensive sitemap.xml with all application routes and multi-language support
 */

const fs = require('fs');
const path = require('path');

// Supported languages configuration
const supportedLanguages = [
  'en',
  'es',
  'fr',
  'de',
  'it',
  'pt',
  'pt-br',
  'ru',
  'zh',
  'ja',
  'ar',
  'hi',
  'bn',
  'ur',
  'id',
  'tr',
  'nl',
  'pl',
  'sw',
  'fil',
];

// Application routes configuration
const routes = [
  {
    path: '/',
    title: 'Home — Multi-language Support',
    priority: '1.0',
    changefreq: 'weekly',
    lastmod: '2024-12-19', // Recent update for home page
  },
  {
    path: '/case-converter',
    title: 'Case Converter — Multi-language Support',
    priority: '0.9',
    changefreq: 'monthly',
    lastmod: '2024-12-19', // Recent SEO optimizations
  },
  {
    path: '/text-formatter',
    title: 'Text Formatter — Multi-language Support',
    priority: '0.9',
    changefreq: 'monthly',
    lastmod: '2024-12-19', // Recent SEO optimizations
  },
  {
    path: '/list-tools',
    title: 'List Tools — Multi-language Support',
    priority: '0.9',
    changefreq: 'monthly',
    lastmod: '2024-12-19', // Recent SEO optimizations
  },
  {
    path: '/encode-decode',
    title: 'Encode Decode — Multi-language Support',
    priority: '0.9',
    changefreq: 'monthly',
    lastmod: '2024-12-19', // Recent SEO optimizations
  },
  {
    path: '/text-analyzer',
    title: 'Text Analyzer — Multi-language Support',
    priority: '0.9',
    changefreq: 'monthly',
    lastmod: '2024-12-19', // Recent SEO optimizations
  },
  {
    path: '/text-generator',
    title: 'Text Generator — Multi-language Support',
    priority: '0.9',
    changefreq: 'monthly',
    lastmod: '2024-12-19', // Recent SEO optimizations
  },
  {
    path: '/json/formatter',
    title: 'JSON Formatter & Validator — Free Online JSON Tool',
    priority: '0.9',
    changefreq: 'monthly',
    lastmod: '2025-01-04', // Updated JSON formatter tool
  },
  {
    path: '/json/parser',
    title: 'JSON Parser & Analyzer — Free Online JSON Parsing Tool',
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: '2025-01-04', // New JSON parser tool
  },
  {
    path: '/js/formatter',
    title: 'JavaScript Formatter — Free Online JS Code Formatter',
    priority: '0.9',
    changefreq: 'monthly',
    lastmod: '2025-01-07', // New JavaScript formatter tool
  },
  {
    path: '/html/formatter',
    title: 'HTML Formatter — Free Online HTML Code Formatter',
    priority: '0.9',
    changefreq: 'monthly',
    lastmod: '2025-01-07', // New HTML formatter tool
  },
  {
    path: '/xml/formatter',
    title: 'XML Formatter — Free Online XML Code Formatter',
    priority: '0.9',
    changefreq: 'monthly',
    lastmod: '2025-01-07', // New XML formatter tool
  },
  {
    path: '/tools',
    title: 'Tools — Free Online Text Processing Tools',
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: '2025-01-07', // Tools landing page
  },
  {
    path: '/developer-tools',
    title: 'Developer Tools — Free Online Developer Utilities',
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: '2025-01-07', // Developer tools landing page
  },
  {
    path: '/text-processing',
    title: 'Text Processing — Free Online Text Processing Tools',
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: '2025-01-07', // Text processing landing page
  },
  {
    path: '/privacy',
    title: 'Privacy Policy — Smart Text Converter',
    priority: '0.6',
    changefreq: 'yearly',
    lastmod: '2024-12-15', // Recent privacy policy updates
  },
  {
    path: '/terms',
    title: 'Terms of Service — Smart Text Converter',
    priority: '0.6',
    changefreq: 'yearly',
    lastmod: '2024-12-15', // Recent terms updates
  },
  {
    path: '/contact',
    title: 'Contact Us — Smart Text Converter',
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: '2024-12-15', // Recent contact form updates
  },
  {
    path: '/blog',
    title: 'Blog — Text Conversion Tips & Best Practices',
    priority: '0.8',
    changefreq: 'weekly',
    lastmod: '2024-12-19', // Recent blog updates
  },
  {
    path: '/blog/seo-best-practices-title-case-vs-sentence-case',
    title: 'SEO Best Practices: Title Case vs Sentence Case for Headlines',
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: '2024-12-10', // Recent SEO content update
  },
  {
    path: '/blog/complete-guide-text-case-conversion',
    title: 'Complete Guide to Text Case Conversion: Uppercase, Lowercase, Title Case',
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: '2024-11-15', // Comprehensive guide publication
  },
  {
    path: '/blog/case-conversion-best-practices-when-how-use-different-case-styles',
    title: 'Text Case Conversion Best Practices for Professional Writing',
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: '2024-11-20', // Best practices guide
  },
  {
    path: '/blog/text-formatting-best-practices-inclusive-design',
    title: 'Accessibility in Text Formatting: Making Content Inclusive',
    priority: '0.6',
    changefreq: 'monthly',
    lastmod: '2024-11-25', // Accessibility content
  },
  {
    path: '/blog/programming-case-conventions-camelcase-vs-snake-case',
    title: 'Programming Conventions: Naming Conventions and Code Style',
    priority: '0.6',
    changefreq: 'monthly',
    lastmod: '2024-11-30', // Programming guide
  },
  {
    path: '/blog/social-media-case-conversion',
    title: 'Social Media Case Conversion: Best Practices for Online Content',
    priority: '0.6',
    changefreq: 'monthly',
    lastmod: '2024-12-05', // Social media content
  },
  {
    path: '/blog/ecommerce-case-conversion',
    title: 'E-commerce Case Conversion: Product Names and Descriptions',
    priority: '0.6',
    changefreq: 'monthly',
    lastmod: '2024-12-08', // E-commerce content
  },
  {
    path: '/blog/email-marketing-case-conversion',
    title: 'Email Marketing Case Conversion: Subject Lines, Headers & Deliverability Optimization',
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: '2024-12-12', // Email marketing content
  },
  {
    path: '/blog/technical-documentation-case-conversion',
    title: 'Technical Documentation Case Conversion: API Docs, User Manuals & Developer Resources',
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: '2024-12-14', // Technical documentation content
  },
  {
    path: '/blog/cms-case-conversion',
    title: 'CMS Case Conversion: WordPress, Drupal & Headless CMS Content Formatting',
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: '2024-12-16', // CMS content
  },
  {
    path: '/blog/text-analysis-beyond-case-conversion',
    title: 'Text Analysis: Beyond Case Conversion - Advanced Text Processing & Analytics',
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: '2024-12-18', // Advanced text analysis content
  },
  {
    path: '/blog/json-formatting-complete-guide',
    title: 'The Complete Guide to JSON Formatting: Best Practices for Developers in 2025',
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: '2025-01-04', // New JSON formatting guide
  },
  {
    path: '/blog/json-validation-developer-guide',
    title: "JSON Validation: The Developer's Guide to Error-Free Data Processing",
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: '2025-01-04', // New JSON validation guide
  },
  {
    path: '/blog/json-performance-optimization',
    title: 'JSON Performance Optimization: Speed Up Your Applications in 2025',
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: '2025-01-04', // New JSON performance guide
  },
  {
    path: '/blog/javascript-formatter-complete-guide',
    title: 'JavaScript Formatter Complete Guide: Format, Beautify, Minify JS Code',
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: '2025-01-07', // New JavaScript formatter guide
  },
  {
    path: '/blog/html-formatter-complete-guide',
    title: 'Complete HTML Formatter Guide: Format, Beautify, Minify HTML Code',
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: '2025-01-07', // New HTML formatter guide
  },
  {
    path: '/blog/xml-best-practices-guide',
    title: 'XML Best Practices Guide: Format, Validate, and Optimize XML',
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: '2025-01-07', // New XML best practices guide
  },
  {
    path: '/comparison/caseconverter-org',
    title: 'SmartTextConverter vs CaseConverter.org: Complete Comparison 2024 | Which is Better?',
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: '2024-12-17', // Recent comparison content
  },
  {
    path: '/comparison/convertcase-net',
    title: 'SmartTextConverter vs ConvertCase.net: Feature Comparison & Review 2024',
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: '2024-12-17', // Recent comparison content
  },
  {
    path: '/comparison/textcase-org',
    title: 'SmartTextConverter vs TextCase.org: Complete Tool Comparison & Review 2024',
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: '2024-12-17', // Recent comparison content
  },
  {
    path: '/comparison/best-case-converters-2024',
    title: 'Best Case Converter Tools 2024: Complete Comparison & Reviews | SmartTextConverter',
    priority: '0.9',
    changefreq: 'monthly',
    lastmod: '2024-12-17', // Recent comparison content
  },
];

// Base URL configuration
const baseUrl = 'https://smarttextconverter.com';

// Generate current date in ISO format
const currentDate = new Date().toISOString().split('T')[0];

// Generate language-specific URL for a route
function generateLanguageUrl(route, lang) {
  // For the default language (en), use the base URL without language prefix
  if (lang === 'en') {
    return route.path === '/' ? `${baseUrl}/` : `${baseUrl}${route.path}`;
  }

  // For other languages, use query parameter approach for better SEO
  const separator = route.path === '/' ? '?' : '?';
  return `${baseUrl}${route.path}${separator}lang=${lang}`;
}

// Generate xhtml:link elements for all languages
function generateLanguageLinks(route) {
  let links = '';

  supportedLanguages.forEach(lang => {
    const langUrl = generateLanguageUrl(route, lang);
    links += `    <xhtml:link rel="alternate" hreflang="${lang}" href="${langUrl}"/>\n`;
  });

  // Add x-default link
  const defaultUrl = route.path === '/' ? `${baseUrl}/` : `${baseUrl}${route.path}`;
  links += `    <xhtml:link rel="alternate" hreflang="x-default" href="${defaultUrl}"/>\n`;

  return links;
}

// Generate sitemap XML
function generateSitemap() {
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`;

  routes.forEach(route => {
    // Always use the canonical URL without language parameters for the main entry
    const canonicalUrl = route.path === '/' ? `${baseUrl}/` : `${baseUrl}${route.path}`;
    const languageLinks = generateLanguageLinks(route);
    const lastmodDate = route.lastmod || currentDate; // Use specific lastmod or fallback to current date

    sitemap += `  <!-- ${route.title} -->
  <url>
    <loc>${canonicalUrl}</loc>
    <lastmod>${lastmodDate}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
${languageLinks}  </url>
`;
  });

  sitemap += `
</urlset>`;

  return sitemap;
}

// Write sitemap to file
function writeSitemap() {
  const sitemapContent = generateSitemap();
  const sitemapPath = path.join(__dirname, '..', 'src', 'assets', 'sitemap.xml');

  try {
    fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');
    console.log('✅ Multi-language sitemap generated successfully!');
    console.log(`📁 Location: ${sitemapPath}`);
    console.log(`🔗 URL: ${baseUrl}/sitemap.xml`);
    console.log(`📊 Total URLs: ${routes.length}`);
    console.log(
      `🌍 Supported Languages: ${supportedLanguages.length} (${supportedLanguages.join(', ')})`
    );
    console.log(`🔗 Total Language Variants: ${routes.length * (supportedLanguages.length + 1)}`);
  } catch (error) {
    console.error('❌ Error generating sitemap:', error.message);
    process.exit(1);
  }
}

// Run the generator
if (require.main === module) {
  writeSitemap();
}

module.exports = { generateSitemap, writeSitemap };
