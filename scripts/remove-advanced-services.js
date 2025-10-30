#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// List of advanced services to remove
const advancedServices = [
  'AdvancedSchemaService',
  'ToolSchemaService', 
  'AdvancedInternalLinkingService',
  'AdvancedSitemapService',
  'AdvancedPerformanceOptimizerService'
];

// Components that need to be cleaned
const components = [
  'src/app/components/case-converter/case-converter.component.ts',
  'src/app/components/contact/contact.component.ts',
  'src/app/components/terms/terms.component.ts',
  'src/app/components/privacy/privacy.component.ts',
  'src/app/components/text-generator/text-generator.component.ts',
  'src/app/components/line-tools/line-tools.component.ts',
  'src/app/components/encode-decode/encode-decode.component.ts',
  'src/app/components/sql-formatter/sql-formatter.component.ts',
  'src/app/components/xml-formatter/xml-formatter.component.ts',
  'src/app/components/css-formatter/css-formatter.component.ts',
  'src/app/components/html-formatter/html-formatter.component.ts',
  'src/app/components/js-formatter/js-formatter.component.ts',
  'src/app/components/json-formatter/json-formatter.component.ts',
  'src/app/components/json-parser/json-parser.component.ts',
  'src/app/components/text-analyzer/text-analyzer.component.ts',
  'src/app/components/text-formatter/text-formatter.component.ts'
];

function removeAdvancedServices(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Remove imports
  advancedServices.forEach(service => {
    const importRegex = new RegExp(`import\\s*{[^}]*\\b${service}\\b[^}]*}\\s*from\\s*['"][^'"]*['"];?\\s*`, 'g');
    if (content.match(importRegex)) {
      content = content.replace(importRegex, '');
      modified = true;
    }
  });

  // Remove from constructor parameters
  advancedServices.forEach(service => {
    const constructorRegex = new RegExp(`\\s*private\\s+${service.toLowerCase().replace(/service$/, 'Service')}:\\s*${service},?\\s*`, 'g');
    if (content.match(constructorRegex)) {
      content = content.replace(constructorRegex, '');
      modified = true;
    }
  });

  // Remove method calls
  const methodCalls = [
    'addAdvancedSchemas',
    'addToolSchemas',
    'initializeInternalLinking',
    'generateSitemap',
    'initializePerformanceMonitoring'
  ];

  methodCalls.forEach(method => {
    const methodRegex = new RegExp(`\\s*this\\.[a-zA-Z]*Service\\.${method}\\([^)]*\\);?\\s*`, 'g');
    if (content.match(methodRegex)) {
      content = content.replace(methodRegex, '');
      modified = true;
    }
  });

  // Clean up extra commas in constructor
  content = content.replace(/,\s*,/g, ',');
  content = content.replace(/,\s*\)/g, ')');

  // Clean up extra newlines
  content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Cleaned: ${filePath}`);
  } else {
    console.log(`ℹ️  No changes needed: ${filePath}`);
  }
}

// Process all components
console.log('🧹 Removing advanced service references from components...\n');

components.forEach(component => {
  removeAdvancedServices(component);
});

console.log('\n✅ Advanced service cleanup completed!');
