#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Components that need to be cleaned
const components = [
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

function cleanupComponent(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Remove ToolSchemaService from constructor parameters
  const toolSchemaRegex = /,\s*private\s+toolSchemaService:\s*ToolSchemaService,?\s*/g;
  if (content.match(toolSchemaRegex)) {
    content = content.replace(toolSchemaRegex, '');
    modified = true;
  }

  // Remove ToolSchemaService import
  const toolSchemaImportRegex = /import\s*{[^}]*ToolSchemaService[^}]*}\s*from\s*['"][^'"]*['"];?\s*/g;
  if (content.match(toolSchemaImportRegex)) {
    content = content.replace(toolSchemaImportRegex, '');
    modified = true;
  }

  // Remove any method calls to advanced services
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
console.log('🧹 Cleaning up advanced service references from tool components...\n');

components.forEach(component => {
  cleanupComponent(component);
});

console.log('\n✅ Advanced service cleanup completed!');
