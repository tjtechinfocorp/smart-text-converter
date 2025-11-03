#!/usr/bin/env node

/**
 * Complete Sitemap Generation Script
 * 
 * Generates comprehensive sitemaps including ALL pages from app.routes.ts
 * with current dates and proper SEO metadata.
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://smarttextconverter.com';
const TODAY = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

// Supported languages (20 languages)
const SUPPORTED_LANGS = [
  'en', 'es', 'fr', 'de', 'it', 'pt', 'pt-br', 'ru', 'ja', 'zh',
  'ar', 'hi', 'bn', 'ur', 'id', 'fil', 'tr', 'sw', 'nl', 'pl'
];

// ALL ROUTES FROM app.routes.ts
const routes = {
  // Home page
  home: { path: '/', priority: '1.0', changefreq: 'daily' },
  
  // Main tool pages (high priority)
  tools: [
    { path: '/case-converter', priority: '0.9', changefreq: 'weekly' },
    { path: '/text-formatter', priority: '0.9', changefreq: 'weekly' },
    { path: '/encode-decode', priority: '0.9', changefreq: 'weekly' },
    { path: '/text-analyzer', priority: '0.9', changefreq: 'weekly' },
    { path: '/text-generator', priority: '0.9', changefreq: 'weekly' },
    { path: '/line-tools', priority: '0.9', changefreq: 'weekly' },
  ],
  
  // JSON tools
  jsonTools: [
    { path: '/json/formatter', priority: '0.9', changefreq: 'weekly' },
    { path: '/json/parser', priority: '0.9', changefreq: 'weekly' },
  ],
  
  // Code formatters
  formatters: [
    { path: '/js/formatter', priority: '0.9', changefreq: 'weekly' },
    { path: '/html/formatter', priority: '0.9', changefreq: 'weekly' },
    { path: '/css/formatter', priority: '0.9', changefreq: 'weekly' },
    { path: '/sql/formatter', priority: '0.9', changefreq: 'weekly' },
    { path: '/xml/formatter', priority: '0.9', changefreq: 'weekly' },
  ],
  
  // Blog main page
  blog: { path: '/blog', priority: '0.8', changefreq: 'weekly' },
  
  // All blog posts (19 posts)
  blogPosts: [
    { path: '/blog/complete-guide-text-case-conversion', priority: '0.8', changefreq: 'monthly' },
    { path: '/blog/case-conversion-best-practices-when-how-use-different-case-styles', priority: '0.8', changefreq: 'monthly' },
    { path: '/blog/programming-case-conventions-camelcase-vs-snake-case', priority: '0.8', changefreq: 'monthly' },
    { path: '/blog/seo-best-practices-title-case-vs-sentence-case', priority: '0.8', changefreq: 'monthly' },
    { path: '/blog/text-formatting-best-practices-inclusive-design', priority: '0.8', changefreq: 'monthly' },
    { path: '/blog/ecommerce-case-conversion', priority: '0.8', changefreq: 'monthly' },
    { path: '/blog/social-media-case-conversion', priority: '0.8', changefreq: 'monthly' },
    { path: '/blog/email-marketing-case-conversion', priority: '0.8', changefreq: 'monthly' },
    { path: '/blog/technical-documentation-case-conversion', priority: '0.8', changefreq: 'monthly' },
    { path: '/blog/cms-case-conversion', priority: '0.8', changefreq: 'monthly' },
    { path: '/blog/text-analysis-beyond-case-conversion', priority: '0.8', changefreq: 'monthly' },
    { path: '/blog/json-formatting-complete-guide', priority: '0.8', changefreq: 'monthly' },
    { path: '/blog/json-validation-developer-guide', priority: '0.8', changefreq: 'monthly' },
    { path: '/blog/json-performance-optimization', priority: '0.8', changefreq: 'monthly' },
    { path: '/blog/css-formatter-complete-guide', priority: '0.8', changefreq: 'monthly' },
    { path: '/blog/xml-best-practices-guide', priority: '0.8', changefreq: 'monthly' },
    { path: '/blog/javascript-formatter-complete-guide', priority: '0.8', changefreq: 'monthly' },
    { path: '/blog/html-formatter-complete-guide', priority: '0.8', changefreq: 'monthly' },
    { path: '/blog/sql-formatter-guide', priority: '0.8', changefreq: 'monthly' },
    { path: '/blog/accessibility-best-practices', priority: '0.8', changefreq: 'monthly' },
  ],
  
  // Comparison pages
  comparisons: [
    { path: '/comparison/best-case-converters-2024', priority: '0.7', changefreq: 'monthly' },
    { path: '/comparison/convertcase-net', priority: '0.7', changefreq: 'monthly' },
    { path: '/comparison/caseconverter-org', priority: '0.7', changefreq: 'monthly' },
    { path: '/comparison/textcase-org', priority: '0.7', changefreq: 'monthly' },
  ],
  
  // Landing pages
  landing: [
    { path: '/landing/text-processing', priority: '0.8', changefreq: 'monthly' },
    { path: '/landing/developer-tools', priority: '0.8', changefreq: 'monthly' },
    { path: '/landing/tools', priority: '0.8', changefreq: 'monthly' },
  ],
  
  // Legal & info pages
  static: [
    { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
    { path: '/terms', priority: '0.3', changefreq: 'yearly' },
    { path: '/contact', priority: '0.5', changefreq: 'monthly' },
  ],
};

/**
 * Generate hreflang tags for a URL path
 */
function generateHreflangTags(urlPath) {
  let tags = '';
  SUPPORTED_LANGS.forEach(lang => {
    // For non-English, use query parameter for language
    // Since the site uses query params, not subdirectories
    const href = lang === 'en' 
      ? `${BASE_URL}${urlPath}` 
      : `${BASE_URL}${urlPath}?lang=${lang}`;
    tags += `    <xhtml:link rel="alternate" hreflang="${lang}" href="${href}"/>\n`;
  });
  // Add x-default
  tags += `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}${urlPath}"/>\n`;
  return tags;
}

/**
 * Generate a single URL entry
 */
function generateUrlEntry(route) {
  let xml = '  <url>\n';
  xml += `    <loc>${BASE_URL}${route.path}</loc>\n`;
  xml += `    <lastmod>${TODAY}</lastmod>\n`;
  xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
  xml += `    <priority>${route.priority}</priority>\n`;
  xml += generateHreflangTags(route.path);
  xml += '  </url>\n';
  return xml;
}

/**
 * Generate main sitemap.xml with all URLs
 */
function generateMainSitemap() {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';
  xml += ' xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

  // Home page
  xml += generateUrlEntry(routes.home);

  // Tool pages
  routes.tools.forEach(route => {
    xml += generateUrlEntry(route);
  });

  // JSON tools
  routes.jsonTools.forEach(route => {
    xml += generateUrlEntry(route);
  });

  // Code formatters
  routes.formatters.forEach(route => {
    xml += generateUrlEntry(route);
  });

  // Blog main page
  xml += generateUrlEntry(routes.blog);

  // Blog posts
  routes.blogPosts.forEach(route => {
    xml += generateUrlEntry(route);
  });

  // Comparison pages
  routes.comparisons.forEach(route => {
    xml += generateUrlEntry(route);
  });

  // Landing pages
  routes.landing.forEach(route => {
    xml += generateUrlEntry(route);
  });

  // Static pages
  routes.static.forEach(route => {
    xml += generateUrlEntry(route);
  });

  xml += '</urlset>';
  return xml;
}

/**
 * Generate sitemap-index.xml
 */
function generateSitemapIndex() {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  const sitemaps = [
    { file: 'sitemap.xml', desc: 'Main sitemap' },
    { file: 'sitemap-tools.xml', desc: 'Tools sitemap' },
    { file: 'sitemap-blog.xml', desc: 'Blog sitemap' },
    { file: 'sitemap-static.xml', desc: 'Static pages sitemap' },
  ];

  sitemaps.forEach(sitemap => {
    xml += '  <sitemap>\n';
    xml += `    <loc>${BASE_URL}/${sitemap.file}</loc>\n`;
    xml += `    <lastmod>${TODAY}</lastmod>\n`;
    xml += '  </sitemap>\n';
  });

  xml += '</sitemapindex>';
  return xml;
}

/**
 * Generate sitemap-tools.xml
 */
function generateToolsSitemap() {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';
  xml += ' xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

  // Home
  xml += generateUrlEntry(routes.home);
  
  // All tool pages
  [...routes.tools, ...routes.jsonTools, ...routes.formatters].forEach(route => {
    xml += generateUrlEntry(route);
  });

  xml += '</urlset>';
  return xml;
}

/**
 * Generate sitemap-blog.xml
 */
function generateBlogSitemap() {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';
  xml += ' xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

  // Blog main page
  xml += generateUrlEntry(routes.blog);
  
  // All blog posts
  routes.blogPosts.forEach(route => {
    xml += generateUrlEntry(route);
  });

  xml += '</urlset>';
  return xml;
}

/**
 * Generate sitemap-static.xml
 */
function generateStaticSitemap() {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';
  xml += ' xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

  // Comparison pages
  routes.comparisons.forEach(route => {
    xml += generateUrlEntry(route);
  });

  // Landing pages
  routes.landing.forEach(route => {
    xml += generateUrlEntry(route);
  });

  // Static/legal pages
  routes.static.forEach(route => {
    xml += generateUrlEntry(route);
  });

  xml += '</urlset>';
  return xml;
}

/**
 * Get statistics
 */
function getStats() {
  const totalUrls = 1 + // home
    routes.tools.length +
    routes.jsonTools.length +
    routes.formatters.length +
    1 + // blog main
    routes.blogPosts.length +
    routes.comparisons.length +
    routes.landing.length +
    routes.static.length;

  return {
    totalUrls,
    tools: routes.tools.length + routes.jsonTools.length + routes.formatters.length,
    blogPosts: routes.blogPosts.length,
    comparisons: routes.comparisons.length,
    landing: routes.landing.length,
    static: routes.static.length,
    languages: SUPPORTED_LANGS.length,
    date: TODAY,
  };
}

/**
 * Main function
 */
function generateSitemaps() {
  console.log('🚀 Generating complete sitemaps with ALL pages...\n');
  console.log(`📅 Date: ${TODAY}\n`);

  try {
    const publicDir = path.join(__dirname, '..', 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Generate main sitemap
    const mainSitemap = generateMainSitemap();
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), mainSitemap);
    console.log('✅ Generated sitemap.xml (all pages)');

    // Generate sitemap index
    const sitemapIndex = generateSitemapIndex();
    fs.writeFileSync(path.join(publicDir, 'sitemap-index.xml'), sitemapIndex);
    console.log('✅ Generated sitemap-index.xml');

    // Generate specialized sitemaps
    const toolsSitemap = generateToolsSitemap();
    fs.writeFileSync(path.join(publicDir, 'sitemap-tools.xml'), toolsSitemap);
    console.log('✅ Generated sitemap-tools.xml');

    const blogSitemap = generateBlogSitemap();
    fs.writeFileSync(path.join(publicDir, 'sitemap-blog.xml'), blogSitemap);
    console.log('✅ Generated sitemap-blog.xml');

    const staticSitemap = generateStaticSitemap();
    fs.writeFileSync(path.join(publicDir, 'sitemap-static.xml'), staticSitemap);
    console.log('✅ Generated sitemap-static.xml');

    // Display statistics
    const stats = getStats();
    console.log('\n📊 Sitemap Statistics:');
    console.log(`   Total URLs: ${stats.totalUrls}`);
    console.log(`   Tool Pages: ${stats.tools}`);
    console.log(`   Blog Posts: ${stats.blogPosts}`);
    console.log(`   Comparison Pages: ${stats.comparisons}`);
    console.log(`   Landing Pages: ${stats.landing}`);
    console.log(`   Static Pages: ${stats.static}`);
    console.log(`   Languages: ${stats.languages}`);
    console.log(`   Last Modified: ${stats.date}`);

    console.log('\n🎉 Sitemap generation completed successfully!');
    console.log('\n📁 Generated files:');
    console.log('   - public/sitemap.xml');
    console.log('   - public/sitemap-index.xml');
    console.log('   - public/sitemap-tools.xml');
    console.log('   - public/sitemap-blog.xml');
    console.log('   - public/sitemap-static.xml');

    return true;
  } catch (error) {
    console.error('❌ Error generating sitemaps:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  generateSitemaps();
}

module.exports = { generateSitemaps, getStats };

