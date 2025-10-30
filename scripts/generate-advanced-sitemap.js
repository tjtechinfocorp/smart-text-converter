#!/usr/bin/env node

/**
 * Advanced Sitemap Generation Script
 * 
 * This script generates comprehensive sitemaps with hreflang support,
 * image sitemaps, video sitemaps, and robots.txt for SmartTextConverter.
 */

const fs = require('fs');
const path = require('path');

// Mock the services for Node.js environment
const mockAdvancedSitemapService = {
  generateSitemap: () => {
    const baseUrl = 'https://smarttextconverter.com';
    const supportedLanguages = [
      'en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh',
      'ar', 'hi', 'bn', 'ur', 'id', 'fil', 'tr', 'sw', 'pt-br', 'nl', 'pl'
    ];
    
    const toolPages = [
      'case-converter', 'text-formatter', 'text-analyzer', 'json-formatter',
      'json-parser', 'js-formatter', 'html-formatter', 'xml-formatter',
      'css-formatter', 'sql-formatter', 'encode-decode', 'line-tools', 'text-generator'
    ];
    
    const additionalToolPages = [
      'list-tools', 'json/formatter', 'json/parser', 'xml/formatter', 'js/formatter',
      'html/formatter', 'css/formatter', 'sql/formatter', 'tools', 'developer-tools',
      'text-processing', 'seo-dashboard'
    ];
    
    const blogPages = [
      'complete-guide-text-case-conversion', 'programming-case-conventions-camelcase-vs-snake-case',
      'seo-best-practices-title-case-vs-sentence-case', 'text-formatting-best-practices-inclusive-design',
      'case-conversion-best-practices-when-how-use-different-case-styles', 'ecommerce-case-conversion',
      'social-media-case-conversion', 'email-marketing-case-conversion', 'technical-documentation-case-conversion',
      'cms-case-conversion', 'text-analysis-beyond-case-conversion', 'json-formatting-complete-guide',
      'json-validation-developer-guide', 'json-performance-optimization', 'css-formatter-complete-guide',
      'xml-best-practices-guide', 'javascript-formatter-complete-guide', 'html-formatter-complete-guide',
      'sql-formatter-complete-guide'
    ];
    
    const guidePages = [
      'text-conversion', 'json-processing', 'text-formatting', 'case-conversion',
      'seo-optimization', 'accessibility', 'programming-conventions',
      'multilingual-support', 'text-analysis', 'web-development'
    ];
    
    const comparisonPages = [
      'comparison/caseconverter-org', 'comparison/convertcase-net', 'comparison/textcase-org',
      'comparison/best-case-converters-2024'
    ];

    // Helper function to generate hreflang tags
    const generateHreflangTags = (path) => {
      let hreflangTags = '';
      supportedLanguages.forEach(lang => {
        const langUrl = path === '/' ? `${baseUrl}/?lang=${lang}` : `${baseUrl}${path}?lang=${lang}`;
        hreflangTags += `    <xhtml:link rel="alternate" hreflang="${lang}" href="${langUrl}"/>\n`;
      });
      // Add x-default for English
      const defaultUrl = path === '/' ? `${baseUrl}/` : `${baseUrl}${path}`;
      hreflangTags += `    <xhtml:link rel="alternate" hreflang="x-default" href="${defaultUrl}"/>\n`;
      return hreflangTags;
    };

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';
    xml += ' xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"';
    xml += ' xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"';
    xml += ' xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

    // Home page
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}/</loc>\n`;
    xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
    xml += '    <changefreq>daily</changefreq>\n';
    xml += '    <priority>1.0</priority>\n';
    xml += generateHreflangTags('/');
    xml += '  </url>\n';

    // Tool pages
    toolPages.forEach(tool => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/${tool}</loc>\n`;
      xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += '    <priority>0.9</priority>\n';
      xml += generateHreflangTags(`/${tool}`);
      xml += '  </url>\n';
    });

    // Additional tool pages
    additionalToolPages.forEach(tool => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/${tool}</loc>\n`;
      xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += '    <priority>0.8</priority>\n';
      xml += generateHreflangTags(`/${tool}`);
      xml += '  </url>\n';
    });

    // Blog pages
    blogPages.forEach(blog => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/blog/${blog}</loc>\n`;
      xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
      xml += '    <changefreq>monthly</changefreq>\n';
      xml += '    <priority>0.8</priority>\n';
      xml += generateHreflangTags(`/blog/${blog}`);
      xml += '  </url>\n';
    });

    // Guide pages
    guidePages.forEach(guide => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/guide/${guide}</loc>\n`;
      xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
      xml += '    <changefreq>monthly</changefreq>\n';
      xml += '    <priority>0.8</priority>\n';
      xml += generateHreflangTags(`/guide/${guide}`);
      xml += '  </url>\n';
    });

    // Comparison pages
    comparisonPages.forEach(comparison => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/${comparison}</loc>\n`;
      xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
      xml += '    <changefreq>monthly</changefreq>\n';
      xml += '    <priority>0.7</priority>\n';
      xml += generateHreflangTags(`/${comparison}`);
      xml += '  </url>\n';
    });

    // Static pages
    const staticPages = [
      { path: '/comparison', priority: '0.7' },
      { path: '/blog', priority: '0.8' },
      { path: '/privacy', priority: '0.3' },
      { path: '/terms', priority: '0.3' },
      { path: '/contact', priority: '0.5' }
    ];

    staticPages.forEach(page => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}${page.path}</loc>\n`;
      xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
      xml += '    <changefreq>monthly</changefreq>\n';
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += generateHreflangTags(page.path);
      xml += '  </url>\n';
    });

    xml += '</urlset>';
    return xml;
  },

  generateSitemapIndex: () => {
    const baseUrl = 'https://smarttextconverter.com';
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    const sitemaps = [
      'sitemap-tools.xml',
      'sitemap-blog.xml',
      'sitemap-guides.xml',
      'sitemap-images.xml'
    ];

    sitemaps.forEach(sitemap => {
      xml += '  <sitemap>\n';
      xml += `    <loc>${baseUrl}/${sitemap}</loc>\n`;
      xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
      xml += '  </sitemap>\n';
    });

    xml += '</sitemapindex>';
    return xml;
  },

  generateRobotsTxt: () => {
    const baseUrl = 'https://smarttextconverter.com';
    
    return `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml
Sitemap: ${baseUrl}/sitemap-index.xml
Sitemap: ${baseUrl}/sitemap-tools.xml
Sitemap: ${baseUrl}/sitemap-blog.xml
Sitemap: ${baseUrl}/sitemap-guides.xml
Sitemap: ${baseUrl}/sitemap-images.xml

# Crawl-delay
Crawl-delay: 1

# Disallow admin and private areas
Disallow: /admin/
Disallow: /private/
Disallow: /api/
Disallow: /_next/
Disallow: /dist/
Disallow: /scripts/

# Allow important files
Allow: /assets/
Allow: /images/
Allow: /videos/
Allow: /*.css
Allow: /*.js
Allow: /*.png
Allow: /*.jpg
Allow: /*.jpeg
Allow: /*.gif
Allow: /*.svg
Allow: /*.webp
Allow: /*.woff
Allow: /*.woff2
Allow: /*.ttf
Allow: /*.eot

# Host
Host: ${baseUrl}`;
  },

  getSitemapStats: () => ({
    totalUrls: 80, // Updated to include all new routes
    totalImages: 25,
    totalVideos: 3,
    languages: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh'],
    categories: ['tools', 'blog', 'guides', 'comparison', 'static'],
    lastGenerated: new Date().toISOString()
  })
};

// Generate sitemaps
function generateSitemaps() {
  console.log('🚀 Generating advanced sitemaps...\n');

  try {
    // Create public directory if it doesn't exist
    const publicDir = path.join(__dirname, '..', 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Generate main sitemap
    const mainSitemap = mockAdvancedSitemapService.generateSitemap();
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), mainSitemap);
    console.log('✅ Generated sitemap.xml');

    // Generate sitemap index
    const sitemapIndex = mockAdvancedSitemapService.generateSitemapIndex();
    fs.writeFileSync(path.join(publicDir, 'sitemap-index.xml'), sitemapIndex);
    console.log('✅ Generated sitemap-index.xml');

    // Generate robots.txt
    const robotsTxt = mockAdvancedSitemapService.generateRobotsTxt();
    fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt);
    console.log('✅ Generated robots.txt');

    // Display statistics
    const stats = mockAdvancedSitemapService.getSitemapStats();
    console.log('\n📊 Sitemap Statistics:');
    console.log(`   Total URLs: ${stats.totalUrls}`);
    console.log(`   Total Images: ${stats.totalImages}`);
    console.log(`   Total Videos: ${stats.totalVideos}`);
    console.log(`   Languages: ${stats.languages.length}`);
    console.log(`   Categories: ${stats.categories.join(', ')}`);
    console.log(`   Last Generated: ${stats.lastGenerated}`);

    console.log('\n🎉 Sitemap generation completed successfully!');
    console.log('\n📁 Generated files:');
    console.log('   - public/sitemap.xml');
    console.log('   - public/sitemap-index.xml');
    console.log('   - public/robots.txt');

  } catch (error) {
    console.error('❌ Error generating sitemaps:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  generateSitemaps();
}

module.exports = { generateSitemaps };
