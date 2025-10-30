#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// List of tool components to clean up
const toolComponents = [
  'case-converter',
  'text-formatter', 
  'text-analyzer',
  'json-parser',
  'json-formatter',
  'js-formatter',
  'html-formatter',
  'css-formatter',
  'xml-formatter',
  'sql-formatter',
  'encode-decode',
  'line-tools',
  'text-generator'
];

// List of static components to clean up
const staticComponents = [
  'home',
  'blog',
  'privacy',
  'terms',
  'contact'
];

function removeAdvancedSchemaFromFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Remove AdvancedSchemaService imports
  if (content.includes('AdvancedSchemaService')) {
    content = content.replace(/import\s*{\s*AdvancedSchemaService\s*}\s*from\s*['"][^'"]*['"];?\s*\n?/g, '');
    modified = true;
  }

  // Remove ToolSchemaService imports
  if (content.includes('ToolSchemaService')) {
    content = content.replace(/import\s*{\s*ToolSchemaService\s*}\s*from\s*['"][^'"]*['"];?\s*\n?/g, '');
    modified = true;
  }

  // Remove AdvancedSchemaService from constructor
  if (content.includes('advancedSchemaService')) {
    content = content.replace(/,\s*@Optional\(\)\s*private\s+advancedSchemaService:\s*AdvancedSchemaService\s*/g, '');
    content = content.replace(/,\s*private\s+advancedSchemaService:\s*AdvancedSchemaService\s*/g, '');
    content = content.replace(/,\s*@Optional\(\)\s*private\s+toolSchemaService:\s*ToolSchemaService\s*/g, '');
    content = content.replace(/,\s*private\s+toolSchemaService:\s*ToolSchemaService\s*/g, '');
    modified = true;
  }

  // Remove addAdvancedSchemas calls
  if (content.includes('addAdvancedSchemas()')) {
    content = content.replace(/\s*this\.addAdvancedSchemas\(\);\s*\n?/g, '');
    modified = true;
  }

  // Remove addAdvancedSchemas method
  if (content.includes('addAdvancedSchemas()')) {
    content = content.replace(/\s*private\s+addAdvancedSchemas\(\)\s*{[^}]*}\s*\n?/gs, '');
    modified = true;
  }

  // Remove addToolSchemas calls
  if (content.includes('addToolSchemas(')) {
    content = content.replace(/\s*this\.addToolSchemas\([^)]*\);\s*\n?/g, '');
    modified = true;
  }

  // Remove addToolSchemas method
  if (content.includes('addToolSchemas(')) {
    content = content.replace(/\s*private\s+addToolSchemas\([^)]*\)\s*{[^}]*}\s*\n?/gs, '');
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Cleaned: ${filePath}`);
  } else {
    console.log(`ℹ️  No changes needed: ${filePath}`);
  }
}

// Clean up tool components
console.log('🧹 Cleaning tool components...');
toolComponents.forEach(component => {
  const filePath = `src/app/components/${component}/${component}.component.ts`;
  removeAdvancedSchemaFromFile(filePath);
});

// Clean up static components
console.log('🧹 Cleaning static components...');
staticComponents.forEach(component => {
  const filePath = `src/app/components/${component}/${component}.component.ts`;
  removeAdvancedSchemaFromFile(filePath);
});

// Clean up blog component (different naming)
removeAdvancedSchemaFromFile('src/app/components/blog/blog.ts');

console.log('✅ Advanced schema cleanup completed!');
