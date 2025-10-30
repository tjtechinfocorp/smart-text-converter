#!/usr/bin/env node

/**
 * Script to apply AdvancedSchemaService integration to static pages
 */

const fs = require('fs');
const path = require('path');

// Static pages to update
const staticPages = [
  'terms',
  'contact'
];

// Page configurations
const pageConfigs = {
  'terms': {
    displayName: 'Terms of Service',
    description: 'Terms of service and usage guidelines for SmartTextConverter platform',
    authorTitle: 'Legal & Compliance Specialists',
    authorDescription: 'Legal experts specializing in terms of service, user agreements, and web application compliance.',
    authorCredentials: ['Legal Writing', 'Terms of Service', 'User Agreements', 'Web Compliance']
  },
  'contact': {
    displayName: 'Contact Us',
    description: 'Contact information and support for SmartTextConverter platform',
    authorTitle: 'Customer Support Specialists',
    authorDescription: 'Customer support experts specializing in user assistance and platform support.',
    authorCredentials: ['Customer Support', 'User Assistance', 'Technical Support', 'Communication']
  }
};

function updateStaticPage(pageName) {
  const componentPath = `src/app/components/${pageName}/${pageName}.component.ts`;
  
  if (!fs.existsSync(componentPath)) {
    console.log(`❌ Component not found: ${componentPath}`);
    return;
  }

  let content = fs.readFileSync(componentPath, 'utf8');
  const config = pageConfigs[pageName];
  
  // Add AdvancedSchemaService import if not present
  if (!content.includes('AdvancedSchemaService')) {
    content = content.replace(
      /import { SEOService } from '\.\.\/\.\.\/services\/seo\.service';/,
      `import { SEOService } from '../../services/seo.service';
import { AdvancedSchemaService } from '../../services/advanced-schema.service';`
    );
  }

  // Add AdvancedSchemaService to constructor/inject if not present
  if (!content.includes('AdvancedSchemaService')) {
    // Handle both constructor and inject patterns
    if (content.includes('inject(')) {
      // Inject pattern
      content = content.replace(
        /private platformId = inject\(PLATFORM_ID\);/,
        `private platformId = inject(PLATFORM_ID);
  private advancedSchemaService = inject(AdvancedSchemaService);`
      );
    } else {
      // Constructor pattern
      content = content.replace(
        /constructor\(\s*([^)]*)\s*\)\s*{/,
        (match, params) => {
          if (params.includes('AdvancedSchemaService')) {
            return match;
          }
          return `constructor(
    ${params.trim()},
    private advancedSchemaService: AdvancedSchemaService
  ) {`;
        }
      );
    }
  }

  // Add schema generation call in ngOnInit if not present
  if (!content.includes('addAdvancedSchemas()')) {
    // Find the end of ngOnInit method
    const ngOnInitMatch = content.match(/ngOnInit\(\)[^{]*{([\s\S]*?)(?=\n\s*[a-zA-Z]|\n\s*}\s*$)/);
    if (ngOnInitMatch) {
      const ngOnInitContent = ngOnInitMatch[1];
      if (!ngOnInitContent.includes('addAdvancedSchemas()')) {
        content = content.replace(
          ngOnInitMatch[0],
          ngOnInitMatch[0] + '\n      // Add advanced schemas for enhanced SEO\n      this.addAdvancedSchemas();'
        );
      }
    }
  }

  // Add addAdvancedSchemas method if not present
  if (!content.includes('private addAdvancedSchemas()')) {
    const methodContent = `
  private addAdvancedSchemas() {
    if (isPlatformBrowser(this.platformId)) {
      // Add Organization schema for ${config.displayName}
      const organizationSchema = this.advancedSchemaService.generateOrganizationSchema();
      this.advancedSchemaService.addSchemaToPage(organizationSchema);

      // Add Person schema for ${config.displayName} team
      const personSchema = this.advancedSchemaService.generatePersonSchema(
        'SmartTextConverter ${config.authorTitle}',
        '${config.authorTitle}',
        '${config.authorDescription}',
        ${JSON.stringify(config.authorCredentials)},
        ['https://smarttextconverter.com']
      );
      this.advancedSchemaService.addSchemaToPage(personSchema);
    }
  }`;

    // Add method before the last closing brace
    content = content.replace(/(\n\s*}\s*$)/, methodContent + '\n$1');
  }

  // Write updated content
  fs.writeFileSync(componentPath, content);
  console.log(`✅ Updated: ${pageName}`);
}

// Update all static pages
console.log('🚀 Applying AdvancedSchemaService integration to static pages...\n');

staticPages.forEach(pageName => {
  try {
    updateStaticPage(pageName);
  } catch (error) {
    console.log(`❌ Error updating ${pageName}:`, error.message);
  }
});

console.log('\n🎉 Static page schema integration completed!');
