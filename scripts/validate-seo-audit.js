#!/usr/bin/env node

/**
 * Comprehensive SEO Audit Script
 * 
 * Validates:
 * 1. Image Alt Text
 * 2. Heading Structure
 * 3. E-E-A-T Signals
 * 
 * Usage: node scripts/validate-seo-audit.js [path]
 */

const fs = require('fs');
const path = require('path');

// Simple glob-like function using fs
function findFiles(dir, pattern, ignorePatterns = []) {
  const results = [];
  
  function shouldIgnore(filePath) {
    return ignorePatterns.some(ignore => filePath.includes(ignore));
  }
  
  function walkDir(currentDir) {
    try {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        
        if (shouldIgnore(fullPath)) {
          continue;
        }
        
        if (entry.isDirectory()) {
          walkDir(fullPath);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name);
          if (pattern.test(entry.name) || pattern.test(ext)) {
            results.push(fullPath);
          }
        }
      }
    } catch (err) {
      // Ignore permission errors
    }
  }
  
  if (fs.existsSync(dir)) {
    walkDir(dir);
  }
  
  return results;
}

// Configuration
const CONFIG = {
  requiredAltText: true,
  maxHeadingLevels: 6,
  requireH1: true,
  minH1Length: 10,
  maxH1Length: 100,
};

// Results storage
const results = {
  images: {
    total: 0,
    withAlt: 0,
    withoutAlt: 0,
    issues: [],
  },
  headings: {
    total: 0,
    h1Count: 0,
    hierarchyIssues: [],
    issues: [],
  },
  eeat: {
    authorTags: 0,
    dateTags: 0,
    schemaMarkup: 0,
    issues: [],
  },
};

/**
 * Find all HTML and TypeScript template files
 */
function findTemplateFiles(rootPath = 'src') {
  const htmlFiles = findFiles(rootPath, /\.html$/, ['node_modules', '.git', 'dist']);
  const tsFiles = findFiles(rootPath, /\.component\.ts$/, ['node_modules', '.git', 'dist']);
  return [...htmlFiles, ...tsFiles];
}

/**
 * Extract images from HTML content
 */
function extractImages(content, filePath) {
  // Skip if this is a TypeScript file with regex patterns (not actual HTML)
  if (filePath.endsWith('.ts') && content.includes('html.match(/<img')) {
    return;
  }
  
  const imgRegex = /<img([^>]*?)>/gi;
  const matches = [...content.matchAll(imgRegex)];
  
  matches.forEach(match => {
    const imgAttrs = match[1];
    
    // Skip if this appears to be in a string/regex (not actual HTML tag)
    const beforeMatch = content.substring(0, match.index);
    const afterMatch = content.substring(match.index);
    
    // Check if we're inside a string literal
    const quotesBefore = (beforeMatch.match(/"/g) || []).length;
    const quotesAfter = (afterMatch.match(/"/g) || []).length;
    const isInString = quotesBefore % 2 === 1;
    
    // Skip Angular bindings like [alt] or {{alt}} as they're dynamic
    const hasBinding = /\[alt\]|{{.*alt|alt.*}}/i.test(imgAttrs);
    
    if (isInString && !imgAttrs.includes('alt=')) {
      return; // Skip regex patterns in strings
    }
    
    results.images.total++;
    
    // Check for alt attribute (including Angular bindings)
    const hasStaticAlt = /alt\s*=\s*["']([^"']*)["']/i.test(imgAttrs);
    const altMatch = imgAttrs.match(/alt\s*=\s*["']([^"']*)["']/i);
    const altText = altMatch ? altMatch[1].trim() : '';
    
    // Angular bindings like [alt]="variable" are considered valid
    if (hasBinding && (hasStaticAlt || altText || imgAttrs.includes('[alt]'))) {
      results.images.withAlt++;
      return;
    }
    
    if (!hasStaticAlt || altText === '') {
      results.images.withoutAlt++;
      results.images.issues.push({
        file: filePath,
        line: content.substring(0, match.index).split('\n').length,
        issue: 'Missing or empty alt text',
        snippet: match[0],
      });
    } else {
      results.images.withAlt++;
      
      // Check alt text quality
      if (altText.length < 5) {
        results.images.issues.push({
          file: filePath,
          line: content.substring(0, match.index).split('\n').length,
          issue: 'Alt text too short (minimum 5 characters recommended)',
          snippet: match[0],
          altText,
        });
      }
    }
  });
}

/**
 * Extract headings from HTML content
 */
function extractHeadings(content, filePath) {
  // Skip component templates that don't need H1 (they're partial templates)
  const isComponentTemplate = filePath.includes('.component.html') || 
                              filePath.includes('/app.component.html') ||
                              filePath.includes('/blog.html') ||
                              filePath.includes('/header.html') ||
                              filePath.includes('/footer.html');
  
  // Skip if this is a TypeScript file with escaped HTML (template strings)
  if (filePath.endsWith('.ts') && content.includes('&lt;h')) {
    return; // Skip escaped HTML in template strings
  }
  
  const headingRegex = /<h([1-6])([^>]*?)>(.*?)<\/h\1>/gi;
  const matches = [...content.matchAll(headingRegex)];
  const headings = [];
  
  matches.forEach(match => {
    const beforeMatch = content.substring(0, match.index);
    
    // Skip if this is in a TypeScript template string (backtick strings)
    const backtickCount = (beforeMatch.match(/`/g) || []).length;
    if (backtickCount % 2 === 1 && filePath.endsWith('.ts')) {
      return; // Inside a template string in TypeScript file
    }
    
    // Skip if inside escaped HTML
    if (beforeMatch.includes('&lt;h') && filePath.endsWith('.ts')) {
      return;
    }
    
    // Skip if inside single/double quoted strings in TS
    if (filePath.endsWith('.ts')) {
      const singleQuotesBefore = (beforeMatch.match(/'/g) || []).length;
      const doubleQuotesBefore = (beforeMatch.match(/"/g) || []).length;
      const isInString = (singleQuotesBefore % 2 === 1) || (doubleQuotesBefore % 2 === 1);
      if (isInString && !beforeMatch.includes('return `') && !beforeMatch.includes('template: `')) {
        return; // Inside a regular string, not a template
      }
    }
    
    const level = parseInt(match[1]);
    const text = match[3].replace(/<[^>]*>/g, '').trim();
    const line = content.substring(0, match.index).split('\n').length;
    
    headings.push({ level, text, line });
    results.headings.total++;
    
    if (level === 1) {
      results.headings.h1Count++;
      
      // Validate H1
      if (text.length < CONFIG.minH1Length) {
        results.headings.issues.push({
          file: filePath,
          line,
          issue: `H1 too short (${text.length} chars, minimum ${CONFIG.minH1Length} recommended)`,
          text,
        });
      }
      
      if (text.length > CONFIG.maxH1Length) {
        results.headings.issues.push({
          file: filePath,
          line,
          issue: `H1 too long (${text.length} chars, maximum ${CONFIG.maxH1Length} recommended)`,
          text,
        });
      }
    }
  });
  
  // Check heading hierarchy
  if (headings.length > 0) {
    let previousLevel = 0;
    headings.forEach((heading, index) => {
      if (index > 0 && heading.level > previousLevel + 1) {
        results.headings.hierarchyIssues.push({
          file: filePath,
          line: heading.line,
          issue: `Heading hierarchy jump: H${heading.level} follows H${previousLevel} (should not skip levels)`,
          text: heading.text,
        });
      }
      previousLevel = heading.level;
    });
  }
  
  // Check for missing H1 (only for actual page components, not partial templates)
  if (CONFIG.requireH1 && 
      results.headings.h1Count === 0 && 
      !isComponentTemplate && 
      !filePath.includes('app.component.html') &&
      !filePath.includes('blog.html') &&
      content.includes('<html') === false) {
    // Only check for H1 in actual page components
    if (filePath.includes('.component.html') && !filePath.includes('/blog/') && !filePath.includes('/header') && !filePath.includes('/footer')) {
      results.headings.issues.push({
        file: filePath,
        line: 1,
        issue: 'No H1 heading found (required for SEO)',
      });
    }
  }
}

/**
 * Check for E-E-A-T signals
 */
function checkEEATSignals(content, filePath) {
  // Skip TypeScript component files (they don't have meta tags in HTML)
  if (filePath.endsWith('.component.ts') && !filePath.includes('blog-posts')) {
    return;
  }
  
  // Skip partial templates
  if (filePath.includes('app.component.html') || 
      filePath.includes('header.html') || 
      filePath.includes('footer.html')) {
    return;
  }
  
  let hasAuthor = false;
  let hasDate = false;
  let hasSchema = false;
  
  // Check for author meta tags (various formats)
  if (/meta\s+name\s*=\s*["']author["']/i.test(content) ||
      /meta\s+property\s*=\s*["']article:author["']/i.test(content) ||
      /author:\s*['"][^'"]+['"]/i.test(content)) {
    hasAuthor = true;
    results.eeat.authorTags++;
  }
  
  // Check for date published (various formats)
  if (/meta\s+name\s*=\s*["']date["']/i.test(content) ||
      /meta\s+property\s*=\s*["']article:published_time["']/i.test(content) ||
      /datePublished|publishedTime|datePublished/i.test(content)) {
    hasDate = true;
    results.eeat.dateTags++;
  }
  
  // Check for structured data (schema.org) - improved detection
  // Look for JSON-LD scripts or TypeScript schema definitions
  const hasJsonLdScript = /script\s+type\s*=\s*["']application\/ld\+json["']/i.test(content);
  const hasSchemaType = /@type\s*["':]\s*["']?(Person|Organization|Article|BlogPosting|WebApplication|SoftwareApplication|BreadcrumbList|FAQPage|ItemList)/i.test(content) ||
                       /"@type"\s*:\s*"(Person|Organization|Article|BlogPosting|WebApplication|SoftwareApplication|BreadcrumbList|FAQPage|ItemList)"/i.test(content) ||
                       /'@type'\s*:\s*'(Person|Organization|Article|BlogPosting|WebApplication|SoftwareApplication|BreadcrumbList|FAQPage|ItemList)'/i.test(content) ||
                       /@type.*WebApplication|@type.*SoftwareApplication|@type.*Article|@type.*Organization|@type.*BlogPosting|@type.*Person/i.test(content) ||
                       /'@context'\s*:\s*['"]https?:\/\/schema\.org/i.test(content) ||
                       /"@context"\s*:\s*["']https?:\/\/schema\.org/i.test(content);
  
  if (hasJsonLdScript || hasSchemaType) {
    hasSchema = true;
    results.eeat.schemaMarkup++;
  }
  
  // Only report missing signals for actual page components
  if (!hasAuthor && (filePath.includes('.component.html') || filePath.includes('index.html'))) {
    results.eeat.issues.push({
      file: filePath,
      issue: 'Missing author meta tag',
    });
  }
  
  if (!hasDate && (filePath.includes('.component.html') || filePath.includes('index.html'))) {
    results.eeat.issues.push({
      file: filePath,
      issue: 'Missing date published information',
    });
  }
}

/**
 * Process a single file
 */
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    extractImages(content, filePath);
    extractHeadings(content, filePath);
    checkEEATSignals(content, filePath);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

/**
 * Generate report
 */
function generateReport() {
  console.log('\n' + '='.repeat(80));
  console.log('SEO AUDIT REPORT');
  console.log('='.repeat(80) + '\n');
  
  // Image Alt Text Report
  console.log('📸 IMAGE ALT TEXT VALIDATION');
  console.log('-'.repeat(80));
  console.log(`Total Images: ${results.images.total}`);
  console.log(`With Alt Text: ${results.images.withAlt} (${((results.images.withAlt / results.images.total) * 100).toFixed(1)}%)`);
  console.log(`Without Alt Text: ${results.images.withoutAlt} (${((results.images.withoutAlt / results.images.total) * 100).toFixed(1)}%)`);
  
  if (results.images.issues.length > 0) {
    console.log(`\n⚠️  Issues Found: ${results.images.issues.length}`);
    results.images.issues.slice(0, 10).forEach(issue => {
      console.log(`  - ${issue.file}:${issue.line} - ${issue.issue}`);
      if (issue.altText) {
        console.log(`    Alt text: "${issue.altText}"`);
      }
    });
    if (results.images.issues.length > 10) {
      console.log(`  ... and ${results.images.issues.length - 10} more issues`);
    }
  } else {
    console.log('✅ All images have proper alt text!');
  }
  
  // Heading Structure Report
  console.log('\n📝 HEADING STRUCTURE VALIDATION');
  console.log('-'.repeat(80));
  console.log(`Total Headings: ${results.headings.total}`);
  console.log(`H1 Count: ${results.headings.h1Count}`);
  
  if (results.headings.hierarchyIssues.length > 0) {
    console.log(`\n⚠️  Hierarchy Issues: ${results.headings.hierarchyIssues.length}`);
    results.headings.hierarchyIssues.slice(0, 10).forEach(issue => {
      console.log(`  - ${issue.file}:${issue.line} - ${issue.issue}`);
    });
    if (results.headings.hierarchyIssues.length > 10) {
      console.log(`  ... and ${results.headings.hierarchyIssues.length - 10} more issues`);
    }
  }
  
  if (results.headings.issues.length > 0) {
    console.log(`\n⚠️  Other Issues: ${results.headings.issues.length}`);
    results.headings.issues.slice(0, 10).forEach(issue => {
      console.log(`  - ${issue.file}:${issue.line} - ${issue.issue}`);
      if (issue.text) {
        console.log(`    Text: "${issue.text.substring(0, 60)}${issue.text.length > 60 ? '...' : ''}"`);
      }
    });
    if (results.headings.issues.length > 10) {
      console.log(`  ... and ${results.headings.issues.length - 10} more issues`);
    }
  } else if (results.headings.hierarchyIssues.length === 0) {
    console.log('✅ Heading structure is valid!');
  }
  
  // E-E-A-T Report
  console.log('\n⭐ E-E-A-T SIGNALS VALIDATION');
  console.log('-'.repeat(80));
  console.log(`Files with Author Tags: ${results.eeat.authorTags}`);
  console.log(`Files with Date Tags: ${results.eeat.dateTags}`);
  console.log(`Files with Schema Markup: ${results.eeat.schemaMarkup}`);
  
  if (results.eeat.issues.length > 0) {
    console.log(`\n⚠️  Missing E-E-A-T Signals: ${results.eeat.issues.length}`);
    const uniqueIssues = {};
    results.eeat.issues.forEach(issue => {
      if (!uniqueIssues[issue.issue]) {
        uniqueIssues[issue.issue] = [];
      }
      uniqueIssues[issue.issue].push(issue.file);
    });
    Object.entries(uniqueIssues).forEach(([issue, files]) => {
      console.log(`  - ${issue} (${files.length} files)`);
    });
  }
  
  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('SUMMARY');
  console.log('='.repeat(80));
  
  const imageScore = results.images.total > 0 
    ? ((results.images.withAlt / results.images.total) * 100).toFixed(1)
    : 100;
  const headingScore = results.headings.hierarchyIssues.length === 0 && 
                      results.headings.issues.length === 0 && 
                      results.headings.h1Count > 0 
    ? 100 
    : 75;
  const eeatScore = results.eeat.authorTags > 0 && 
                    results.eeat.dateTags > 0 && 
                    results.eeat.schemaMarkup > 0 
    ? 100 
    : 60;
  
  const overallScore = ((parseFloat(imageScore) + parseFloat(headingScore) + parseFloat(eeatScore)) / 3).toFixed(1);
  
  console.log(`Overall SEO Score: ${overallScore}%`);
  console.log(`  - Image Alt Text: ${imageScore}%`);
  console.log(`  - Heading Structure: ${headingScore}%`);
  console.log(`  - E-E-A-T Signals: ${eeatScore}%`);
  
  console.log('\n' + '='.repeat(80) + '\n');
  
  return {
    imageScore: parseFloat(imageScore),
    headingScore: parseFloat(headingScore),
    eeatScore: parseFloat(eeatScore),
    overallScore: parseFloat(overallScore),
    issues: {
      images: results.images.issues.length,
      headings: results.headings.issues.length + results.headings.hierarchyIssues.length,
      eeat: results.eeat.issues.length,
    },
  };
}

/**
 * Main function
 */
function main() {
  const rootPath = process.argv[2] || 'src';
  console.log(`\n🔍 Starting SEO Audit on: ${rootPath}\n`);
  
  try {
    const files = findTemplateFiles(rootPath);
    console.log(`Found ${files.length} template files to analyze...\n`);
    
    if (files.length === 0) {
      console.log('⚠️  No template files found. Make sure the path is correct.\n');
      process.exit(1);
    }
    
    files.forEach(processFile);
    
    const report = generateReport();
    
    // Exit with error code if issues found
    const totalIssues = report.issues.images + report.issues.headings + report.issues.eeat;
    process.exit(totalIssues > 0 ? 1 : 0);
  } catch (error) {
    console.error('Fatal error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run audit
main();

