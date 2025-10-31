#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://smarttextconverter.com';
const SUPPORTED_LANGS = ['en','es','fr','de','it','pt','ru','ja','ko','zh','ar','hi','bn','ur'];

const tools = [
  '/',
  '/case-converter',
  '/text-formatter',
  '/encode-decode',
  '/text-analyzer',
  '/json/formatter',
  '/json/parser',
  '/js/formatter',
  '/html/formatter',
  '/css/formatter',
  '/sql/formatter',
  '/xml/formatter',
];

const statics = ['/privacy', '/terms', '/contact'];
const blogs = ['/blog'];

function withHreflang(urlPath) {
  const links = SUPPORTED_LANGS.map(lang => {
    const href = lang === 'en' ? `${BASE_URL}${urlPath}` : `${BASE_URL}/${lang}${urlPath}`;
    return `    <xhtml:link rel="alternate" hreflang="${lang}" href="${href}"/>`;
  }).join('\n');
  const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}${urlPath}"/>`;
  return `${links}\n${xDefault}`;
}

function urlset(urls) {
  const today = new Date().toISOString().split('T')[0];
  const entries = urls.map(u => `  <url>
    <loc>${BASE_URL}${u}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${u === '/' ? '1.0' : '0.8'}</priority>
${withHreflang(u)}
  </url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries}
</urlset>
`;
}

function write(file, content) {
  fs.writeFileSync(file, content, 'utf8');
  console.log(`Wrote ${path.relative(process.cwd(), file)}`);
}

function main() {
  const publicDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  // Sectional sitemaps
  write(path.join(publicDir, 'sitemap-tools.xml'), urlset(tools));
  write(path.join(publicDir, 'sitemap-static.xml'), urlset(statics));
  write(path.join(publicDir, 'sitemap-blog.xml'), urlset(blogs));

  // Index
  const index = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${BASE_URL}/sitemap.xml</loc></sitemap>
  <sitemap><loc>${BASE_URL}/sitemap-tools.xml</loc></sitemap>
  <sitemap><loc>${BASE_URL}/sitemap-static.xml</loc></sitemap>
  <sitemap><loc>${BASE_URL}/sitemap-blog.xml</loc></sitemap>
</sitemapindex>
`;
  write(path.join(publicDir, 'sitemap-index.xml'), index);
}

main();


