#!/usr/bin/env node

/**
 * Complete SEO & Structured Data Validation Script for SmartTextConverter
 * Validates sitemap, robots.txt, redirects, canonical URLs, and FAQ structured data
 */

const fs = require('fs');
const path = require('path');
const { DOMParser } = require('xmldom');

// Configuration
const BASE_URL = 'https://smarttextconverter.com';
const SITEMAP_PATH = './public/sitemap.xml';
const ROBOTS_PATH = './src/assets/robots.txt';

// Expected routes from app.routes.ts
const EXPECTED_ROUTES = [
  '',
  'case-converter',
  'text-formatter',
  'list-tools',
  'encode-decode',
  'text-analyzer',
  'text-generator',
  'json/formatter',
  'json/parser',
  'xml/formatter',
  'js/formatter',
  'html/formatter',
  'css/formatter',
  'sql/formatter',
  'privacy',
  'terms',
  'contact',
  'blog',
  'tools',
  'developer-tools',
  'text-processing',
  'seo-dashboard',
  'comparison/caseconverter-org',
  'comparison/convertcase-net',
  'comparison/textcase-org',
  'comparison/best-case-converters-2024',
];

// Blog post routes
const BLOG_ROUTES = [
  'blog/complete-guide-text-case-conversion',
  'blog/programming-case-conventions-camelcase-vs-snake-case',
  'blog/seo-best-practices-title-case-vs-sentence-case',
  'blog/text-formatting-best-practices-inclusive-design',
  'blog/case-conversion-best-practices-when-how-use-different-case-styles',
  'blog/ecommerce-case-conversion',
  'blog/social-media-case-conversion',
  'blog/email-marketing-case-conversion',
  'blog/technical-documentation-case-conversion',
  'blog/cms-case-conversion',
  'blog/text-analysis-beyond-case-conversion',
  'blog/json-formatting-complete-guide',
  'blog/json-validation-developer-guide',
  'blog/json-performance-optimization',
  'blog/css-formatter-complete-guide',
  'blog/xml-best-practices-guide',
  'blog/javascript-formatter-complete-guide',
  'blog/html-formatter-complete-guide',
  'blog/sql-formatter-complete-guide',
];

class CompleteSEOValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.success = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : '✅';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  // ===== SITEMAP VALIDATION =====
  validateSitemap() {
    this.log('Validating sitemap.xml...');

    if (!fs.existsSync(SITEMAP_PATH)) {
      this.errors.push('Sitemap not found at ' + SITEMAP_PATH);
      return;
    }

    try {
      const sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf8');
      const parser = new DOMParser();
      const doc = parser.parseFromString(sitemapContent, 'text/xml');

      // Check for parsing errors
      const parseErrors = doc.getElementsByTagName('parsererror');
      if (parseErrors.length > 0) {
        this.errors.push('Sitemap XML parsing error: ' + parseErrors[0].textContent);
        return;
      }

      // Extract URLs from sitemap
      const urlElements = doc.getElementsByTagName('url');
      const sitemapUrls = [];

      for (let i = 0; i < urlElements.length; i++) {
        const locElement = urlElements[i].getElementsByTagName('loc')[0];
        if (locElement) {
          const url = locElement.textContent;
          sitemapUrls.push(url.replace(BASE_URL, ''));
        }
      }

      this.log(`Found ${sitemapUrls.length} URLs in sitemap`);

      // Check for missing routes
      const allExpectedRoutes = [...EXPECTED_ROUTES, ...BLOG_ROUTES];
      const missingRoutes = allExpectedRoutes.filter(
        route => !sitemapUrls.some(url => url === '/' + route || url === route)
      );

      if (missingRoutes.length > 0) {
        this.warnings.push(`Missing routes in sitemap: ${missingRoutes.join(', ')}`);
      } else {
        this.success.push('All expected routes found in sitemap');
      }

      // Check for duplicate URLs
      const duplicates = sitemapUrls.filter((url, index) => sitemapUrls.indexOf(url) !== index);
      if (duplicates.length > 0) {
        this.errors.push(`Duplicate URLs in sitemap: ${duplicates.join(', ')}`);
      }

      // Check lastmod dates
      const today = new Date().toISOString().split('T')[0];
      const outdatedUrls = [];

      for (let i = 0; i < urlElements.length; i++) {
        const lastmodElement = urlElements[i].getElementsByTagName('lastmod')[0];
        if (lastmodElement) {
          const lastmod = lastmodElement.textContent;
          if (lastmod < '2024-12-01') {
            outdatedUrls.push(sitemapUrls[i]);
          }
        }
      }

      if (outdatedUrls.length > 0) {
        this.warnings.push(
          `Outdated lastmod dates for: ${outdatedUrls.slice(0, 5).join(', ')}${outdatedUrls.length > 5 ? '...' : ''}`
        );
      }
    } catch (error) {
      this.errors.push('Error reading sitemap: ' + error.message);
    }
  }

  // ===== ROBOTS.TXT VALIDATION =====
  validateRobotsTxt() {
    this.log('Validating robots.txt...');

    if (!fs.existsSync(ROBOTS_PATH)) {
      this.errors.push('robots.txt not found at ' + ROBOTS_PATH);
      return;
    }

    try {
      const robotsContent = fs.readFileSync(ROBOTS_PATH, 'utf8');

      // Check for sitemap declaration
      if (!robotsContent.includes('Sitemap:')) {
        this.errors.push('Sitemap declaration missing in robots.txt');
      } else {
        this.success.push('Sitemap declaration found in robots.txt');
      }

      // Check for overly restrictive rules
      const disallowRules = robotsContent.match(/Disallow:\s*(.+)/g) || [];
      const problematicRules = disallowRules.filter(
        rule => rule.includes('/*.json$') || rule.includes('/assets/') || rule.includes('/scripts/')
      );

      if (problematicRules.length > 0) {
        this.warnings.push(
          `Potentially problematic robots.txt rules: ${problematicRules.join(', ')}`
        );
      }

      // Check for crawl delay
      if (robotsContent.includes('Crawl-delay:')) {
        this.success.push('Crawl delay configured in robots.txt');
      }
    } catch (error) {
      this.errors.push('Error reading robots.txt: ' + error.message);
    }
  }

  // ===== REDIRECTS VALIDATION =====
  validateRedirects() {
    this.log('Validating redirects configuration...');

    const redirectsPath = './_redirects';
    if (!fs.existsSync(redirectsPath)) {
      this.warnings.push('_redirects file not found');
      return;
    }

    try {
      const redirectsContent = fs.readFileSync(redirectsPath, 'utf8');

      // Check for 301 redirects
      const redirectLines = redirectsContent
        .split('\n')
        .filter(line => line.trim() && !line.startsWith('#') && line.includes('301'));

      if (redirectLines.length > 0) {
        this.success.push(`Found ${redirectLines.length} 301 redirects configured`);
      }

      // Check for potential redirect chains
      const redirectSources = redirectLines.map(line => line.split(/\s+/)[0]);
      const redirectTargets = redirectLines.map(line => line.split(/\s+/)[1]);

      const potentialChains = redirectSources.filter(source => redirectTargets.includes(source));

      if (potentialChains.length > 0) {
        this.warnings.push(`Potential redirect chains detected: ${potentialChains.join(', ')}`);
      }
    } catch (error) {
      this.errors.push('Error reading _redirects: ' + error.message);
    }
  }

  // ===== CANONICAL URLS VALIDATION =====
  validateCanonicalUrls() {
    this.log('Validating canonical URL configuration...');

    const srcPath = './src/app/components';
    if (!fs.existsSync(srcPath)) {
      this.warnings.push('Components directory not found');
      return;
    }

    try {
      const componentFiles = this.findComponentFiles(srcPath);
      let relativeCanonicalCount = 0;
      let absoluteCanonicalCount = 0;

      componentFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        const canonicalMatches = content.match(/canonicalUrl:\s*['"`]([^'"`]+)['"`]/g);

        if (canonicalMatches) {
          canonicalMatches.forEach(match => {
            const url = match.match(/['"`]([^'"`]+)['"`]/)[1];
            if (url.startsWith('http')) {
              absoluteCanonicalCount++;
            } else if (url.startsWith('/')) {
              relativeCanonicalCount++;
            }
          });
        }
      });

      if (relativeCanonicalCount > 0) {
        this.warnings.push(
          `Found ${relativeCanonicalCount} relative canonical URLs (should be absolute)`
        );
      }

      if (absoluteCanonicalCount > 0) {
        this.success.push(`Found ${absoluteCanonicalCount} absolute canonical URLs`);
      }
    } catch (error) {
      this.errors.push('Error validating canonical URLs: ' + error.message);
    }
  }

  // ===== FAQ STRUCTURED DATA VALIDATION =====
  validateFAQSchemaService() {
    this.log('Validating FAQ Schema Service...');

    const faqServicePath = './src/app/services/faq-schema.service.ts';
    if (!fs.existsSync(faqServicePath)) {
      this.errors.push('FAQ Schema Service not found');
      return;
    }

    try {
      const content = fs.readFileSync(faqServicePath, 'utf8');

      // Check for proper FAQPage implementation
      if (content.includes("'@type': 'FAQPage'")) {
        this.success.push('FAQ Schema Service has proper FAQPage implementation');
      } else {
        this.errors.push('FAQ Schema Service missing FAQPage implementation');
      }

      // Check for duplicate prevention
      if (content.includes('existingScript') && content.includes('remove()')) {
        this.success.push('FAQ Schema Service has duplicate prevention logic');
      } else {
        this.warnings.push('FAQ Schema Service may not prevent duplicates properly');
      }

      // Check for data-faq-schema attribute
      if (content.includes('data-faq-schema')) {
        this.success.push('FAQ Schema Service uses data attribute for identification');
      } else {
        this.warnings.push('FAQ Schema Service should use data attribute for identification');
      }
    } catch (error) {
      this.errors.push('Error reading FAQ Schema Service: ' + error.message);
    }
  }

  validateComparisonSchemaService() {
    this.log('Validating Comparison Schema Service...');

    const comparisonServicePath = './src/app/services/comparison-schema.service.ts';
    if (!fs.existsSync(comparisonServicePath)) {
      this.errors.push('Comparison Schema Service not found');
      return;
    }

    try {
      const content = fs.readFileSync(comparisonServicePath, 'utf8');

      // Check that nested FAQPage was removed
      if (content.includes('mainEntityOfPage') && content.includes('FAQPage')) {
        this.errors.push('Comparison Schema Service still has nested FAQPage structure');
      } else {
        this.success.push('Comparison Schema Service no longer has nested FAQPage');
      }

      // Check for separate FAQ schema method
      if (content.includes('generateComparisonFAQSchema')) {
        this.success.push('Comparison Schema Service has separate FAQ schema method');
      } else {
        this.warnings.push('Comparison Schema Service should have separate FAQ schema method');
      }
    } catch (error) {
      this.errors.push('Error reading Comparison Schema Service: ' + error.message);
    }
  }

  validateSEOService() {
    this.log('Validating SEO Service structured data handling...');

    const seoServicePath = './src/app/services/seo.service.ts';
    if (!fs.existsSync(seoServicePath)) {
      this.errors.push('SEO Service not found');
      return;
    }

    try {
      const content = fs.readFileSync(seoServicePath, 'utf8');

      // Check for duplicate prevention in addStructuredData
      if (content.includes('existingScripts') && content.includes('remove()')) {
        this.success.push('SEO Service has duplicate prevention for structured data');
      } else {
        this.warnings.push('SEO Service may not prevent structured data duplicates');
      }

      // Check for proper schema type comparison
      if (content.includes("existingSchema['@type'] === schema['@type']")) {
        this.success.push('SEO Service compares schema types for duplicate prevention');
      } else {
        this.warnings.push('SEO Service should compare schema types for duplicate prevention');
      }
    } catch (error) {
      this.errors.push('Error reading SEO Service: ' + error.message);
    }
  }

  validateComponentUsage() {
    this.log('Validating component usage of FAQ schema...');

    const componentsPath = './src/app/components';
    if (!fs.existsSync(componentsPath)) {
      this.warnings.push('Components directory not found');
      return;
    }

    try {
      const componentFiles = this.findComponentFiles(componentsPath);
      let faqUsageCount = 0;
      let duplicateUsageCount = 0;

      componentFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');

        // Count FAQ schema usage
        const faqMatches = content.match(/addFAQSchemaToPage/g);
        if (faqMatches) {
          faqUsageCount += faqMatches.length;
        }

        // Check for potential duplicate calls
        const faqCalls = content.match(/addFAQSchemaToPage.*addFAQSchemaToPage/g);
        if (faqCalls) {
          duplicateUsageCount += faqCalls.length;
        }
      });

      if (faqUsageCount > 0) {
        this.success.push(`Found ${faqUsageCount} FAQ schema usages in components`);
      }

      if (duplicateUsageCount > 0) {
        this.warnings.push(`Found ${duplicateUsageCount} potential duplicate FAQ schema calls`);
      } else {
        this.success.push('No duplicate FAQ schema calls found');
      }
    } catch (error) {
      this.errors.push('Error validating component usage: ' + error.message);
    }
  }

  validateStructuredDataConsistency() {
    this.log('Validating structured data consistency...');

    const srcPath = './src';
    if (!fs.existsSync(srcPath)) {
      this.warnings.push('Source directory not found');
      return;
    }

    try {
      const allFiles = this.findAllTypeScriptFiles(srcPath);
      let faqPageCount = 0;
      let duplicatePatterns = [];

      allFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');

        // Count FAQPage references
        const faqPageMatches = content.match(/FAQPage/g);
        if (faqPageMatches) {
          faqPageCount += faqPageMatches.length;
        }

        // Look for potential duplicate patterns
        if (content.includes('@type.*FAQPage') && content.includes('FAQPage')) {
          duplicatePatterns.push(file);
        }
      });

      if (faqPageCount <= 2) {
        this.success.push(`Found ${faqPageCount} FAQPage references (should be 2 or less)`);
      } else {
        this.warnings.push(`Found ${faqPageCount} FAQPage references (may indicate duplicates)`);
      }

      if (duplicatePatterns.length > 0) {
        this.warnings.push(
          `Found potential duplicate patterns in: ${duplicatePatterns.slice(0, 3).join(', ')}`
        );
      }
    } catch (error) {
      this.errors.push('Error validating structured data consistency: ' + error.message);
    }
  }

  // ===== UTILITY METHODS =====
  findComponentFiles(dir) {
    const files = [];
    const items = fs.readdirSync(dir);

    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        files.push(...this.findComponentFiles(fullPath));
      } else if (item.endsWith('.component.ts')) {
        files.push(fullPath);
      }
    });

    return files;
  }

  findAllTypeScriptFiles(dir) {
    const files = [];
    const items = fs.readdirSync(dir);

    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory() && !item.includes('node_modules') && !item.includes('.git')) {
        files.push(...this.findAllTypeScriptFiles(fullPath));
      } else if (item.endsWith('.ts')) {
        files.push(fullPath);
      }
    });

    return files;
  }

  generateReport() {
    this.log('\n=== Complete SEO & Structured Data Validation Report ===');

    if (this.success.length > 0) {
      this.log('\n✅ Successes:');
      this.success.forEach(msg => this.log(`  ${msg}`));
    }

    if (this.warnings.length > 0) {
      this.log('\n⚠️ Warnings:');
      this.warnings.forEach(msg => this.log(`  ${msg}`));
    }

    if (this.errors.length > 0) {
      this.log('\n❌ Errors:');
      this.errors.forEach(msg => this.log(`  ${msg}`));
    }

    this.log(
      `\nSummary: ${this.success.length} successes, ${this.warnings.length} warnings, ${this.errors.length} errors`
    );

    if (this.errors.length > 0) {
      this.log('\n🔧 Recommended Actions:');
      this.log('1. Fix any errors found in the validation');
      this.log('2. Test the FAQ structured data in Google Rich Results Test');
      this.log('3. Submit updated sitemap to Google Search Console');
      this.log('4. Monitor Google Search Console for any remaining issues');
      this.log('5. Request indexing for key pages using URL Inspection tool');

      process.exit(1);
    } else {
      this.log('\n🎉 Complete SEO validation passed!');
      this.log('All SEO elements and structured data are properly configured.');
    }
  }

  async run() {
    this.log('Starting complete SEO and structured data validation...');

    // SEO validations
    this.validateSitemap();
    this.validateRobotsTxt();
    this.validateRedirects();
    this.validateCanonicalUrls();

    // Structured data validations
    this.validateFAQSchemaService();
    this.validateComparisonSchemaService();
    this.validateSEOService();
    this.validateComponentUsage();
    this.validateStructuredDataConsistency();

    this.generateReport();
  }
}

// Run validation
const validator = new CompleteSEOValidator();
validator.run().catch(error => {
  console.error('Validation failed:', error);
  process.exit(1);
});
