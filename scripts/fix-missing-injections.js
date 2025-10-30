#!/usr/bin/env node

/**
 * Script to fix missing service injections in tool components
 */

const fs = require('fs');
const path = require('path');

// Tool components that need ToolSchemaService injection
const toolComponents = [
  'css-formatter',
  'encode-decode',
  'html-formatter',
  'js-formatter',
  'json-formatter',
  'json-parser',
  'line-tools',
  'sql-formatter',
  'text-analyzer',
  'text-generator',
  'xml-formatter'
];

function fixToolComponent(componentName) {
  const componentPath = `src/app/components/${componentName}/${componentName}.component.ts`;
  
  if (!fs.existsSync(componentPath)) {
    console.log(`❌ Component not found: ${componentPath}`);
    return;
  }

  let content = fs.readFileSync(componentPath, 'utf8');
  
  // Add ToolSchemaService import if not present
  if (!content.includes('ToolSchemaService')) {
    content = content.replace(
      /import { SEOService } from '\.\.\/\.\.\/services\/seo\.service';/,
      `import { SEOService } from '../../services/seo.service';
import { ToolSchemaService } from '../../services/tool-schema.service';`
    );
  }

  // Add ToolSchemaService to constructor if not present
  if (!content.includes('private toolSchemaService: ToolSchemaService')) {
    // Find constructor pattern
    const constructorMatch = content.match(/constructor\(\s*([^)]*)\s*\)\s*{/);
    if (constructorMatch) {
      const params = constructorMatch[1];
      if (!params.includes('ToolSchemaService')) {
        content = content.replace(
          constructorMatch[0],
          `constructor(
    ${params.trim()},
    private toolSchemaService: ToolSchemaService
  ) {`
        );
      }
    }
  }

  // Write updated content
  fs.writeFileSync(componentPath, content);
  console.log(`✅ Fixed: ${componentName}`);
}

// Fix all tool components
console.log('🚀 Fixing missing service injections in tool components...\n');

toolComponents.forEach(componentName => {
  try {
    fixToolComponent(componentName);
  } catch (error) {
    console.log(`❌ Error fixing ${componentName}:`, error.message);
  }
});

console.log('\n🎉 Service injection fixes completed!');
