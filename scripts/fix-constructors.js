#!/usr/bin/env node

/**
 * Script to fix constructors in tool components
 */

const fs = require('fs');
const path = require('path');

// Tool components that need constructor fixes
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

function fixConstructor(componentName) {
  const componentPath = `src/app/components/${componentName}/${componentName}.component.ts`;
  
  if (!fs.existsSync(componentPath)) {
    console.log(`❌ Component not found: ${componentPath}`);
    return;
  }

  let content = fs.readFileSync(componentPath, 'utf8');
  
  // Fix constructor pattern - look for single line constructor
  const singleLineConstructorMatch = content.match(/constructor\(private seoService: SEOService, @Inject\(PLATFORM_ID\) private platformId: Object\) \{\}/);
  if (singleLineConstructorMatch) {
    content = content.replace(
      singleLineConstructorMatch[0],
      `constructor(
    private seoService: SEOService,
    private toolSchemaService: ToolSchemaService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}`
    );
  }

  // Fix multi-line constructor pattern
  const multiLineConstructorMatch = content.match(/constructor\(\s*private seoService: SEOService,\s*@Inject\(PLATFORM_ID\) private platformId: Object\s*\)\s*\{\}/);
  if (multiLineConstructorMatch) {
    content = content.replace(
      multiLineConstructorMatch[0],
      `constructor(
    private seoService: SEOService,
    private toolSchemaService: ToolSchemaService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}`
    );
  }

  // Write updated content
  fs.writeFileSync(componentPath, content);
  console.log(`✅ Fixed constructor: ${componentName}`);
}

// Fix all tool components
console.log('🚀 Fixing constructors in tool components...\n');

toolComponents.forEach(componentName => {
  try {
    fixConstructor(componentName);
  } catch (error) {
    console.log(`❌ Error fixing ${componentName}:`, error.message);
  }
});

console.log('\n🎉 Constructor fixes completed!');
