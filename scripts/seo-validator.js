#!/usr/bin/env node

/**
 * SEO Validator Script
 *
 * This script validates SEO titles and descriptions to ensure they meet
 * Google's recommended character limits:
 * - Title: 30-60 characters (optimal: 50-60)
 * - Description: 120-160 characters (optimal: 150-160)
 */

const fs = require('fs');
const path = require('path');

// SEO Guidelines
const SEO_GUIDELINES = {
  title: { min: 30, max: 60, optimal: 50 },
  description: { min: 120, max: 160, optimal: 150 },
};

function validateSEO() {
  console.log('🔍 SEO Validation Report\n');

  let hasErrors = false;

  // Check index.html
  console.log('📄 Checking index.html...');
  const htmlPath = path.join(__dirname, '../src/index.html');
  const html = fs.readFileSync(htmlPath, 'utf8');

  const titleMatch = html.match(/<title>(.*?)<\/title>/);
  const descMatch = html.match(/<meta name="description"[^>]*content="([^"]*)"/);

  if (titleMatch) {
    const title = titleMatch[1];
    const titleLength = title.length;
    const titleStatus = getStatus(titleLength, SEO_GUIDELINES.title);
    console.log(`  Title (${titleLength} chars): ${titleStatus} ${title}`);
    if (titleStatus === '❌') hasErrors = true;
  }

  if (descMatch) {
    const desc = descMatch[1];
    const descLength = desc.length;
    const descStatus = getStatus(descLength, SEO_GUIDELINES.description);
    console.log(`  Description (${descLength} chars): ${descStatus} ${desc.substring(0, 50)}...`);
    if (descStatus === '❌') hasErrors = true;
  }

  // Check seo-data.json
  console.log('\n📄 Checking seo-data.json...');
  const seoDataPath = path.join(__dirname, '../src/assets/seo-data.json');
  const seoData = JSON.parse(fs.readFileSync(seoDataPath, 'utf8'));

  Object.entries(seoData.metaTags).forEach(([key, value]) => {
    const titleLength = value.title.length;
    const descLength = value.description.length;
    const titleStatus = getStatus(titleLength, SEO_GUIDELINES.title);
    const descStatus = getStatus(descLength, SEO_GUIDELINES.description);

    if (titleStatus === '❌' || descStatus === '❌') {
      console.log(`  ${key}:`);
      console.log(`    Title (${titleLength} chars): ${titleStatus} ${value.title}`);
      console.log(
        `    Description (${descLength} chars): ${descStatus} ${value.description.substring(
          0,
          50
        )}...`
      );
      hasErrors = true;
    }
  });

  // Summary
  console.log('\n📊 Summary:');
  if (hasErrors) {
    console.log('❌ SEO issues found. Please fix the above issues.');
    process.exit(1);
  } else {
    console.log('✅ All SEO elements are within recommended limits!');
  }
}

function getStatus(length, guidelines) {
  if (length < guidelines.min) return '⚠️  Too short';
  if (length > guidelines.max) return '❌ Too long';
  if (length >= guidelines.optimal) return '✅ Optimal';
  return '✅ Good';
}

// Run validation
validateSEO();
