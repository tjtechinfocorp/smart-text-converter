#!/usr/bin/env node

/**
 * Script to apply AdvancedSchemaService integration to all tool components
 */

const fs = require('fs');
const path = require('path');

// Tool components to update
const toolComponents = [
  'text-analyzer',
  'json-formatter',
  'json-parser',
  'js-formatter',
  'html-formatter',
  'css-formatter',
  'xml-formatter',
  'sql-formatter',
  'encode-decode',
  'line-tools',
  'text-generator'
];

// Tool configurations
const toolConfigs = {
  'text-analyzer': {
    displayName: 'Text Analyzer',
    description: 'Free online text analysis tool for counting characters, words, sentences, and analyzing text content',
    features: [
      'Character count',
      'Word count',
      'Sentence count',
      'Paragraph count',
      'Reading time estimation',
      'Speaking time estimation',
      'Average word length',
      'Average sentence length',
      'Text statistics',
      'Content analysis'
    ]
  },
  'json-formatter': {
    displayName: 'JSON Formatter',
    description: 'Free online JSON formatter and validator for beautifying, minifying, and validating JSON data',
    features: [
      'JSON beautify',
      'JSON minify',
      'JSON validate',
      'JSON syntax highlighting',
      'Error detection',
      'Format conversion',
      'Tree view',
      'Copy to clipboard',
      'Download JSON',
      'JSON compression'
    ]
  },
  'json-parser': {
    displayName: 'JSON Parser',
    description: 'Free online JSON parser for parsing, analyzing, and extracting data from JSON documents',
    features: [
      'JSON parsing',
      'Data extraction',
      'Path navigation',
      'Value filtering',
      'Type detection',
      'Error reporting',
      'Schema validation',
      'Data transformation',
      'Export options',
      'Search functionality'
    ]
  },
  'js-formatter': {
    displayName: 'JavaScript Formatter',
    description: 'Free online JavaScript formatter for beautifying, minifying, and formatting JavaScript code',
    features: [
      'JavaScript beautify',
      'JavaScript minify',
      'Syntax highlighting',
      'Error detection',
      'Code compression',
      'Format conversion',
      'ES6+ support',
      'Copy to clipboard',
      'Download JS',
      'Code validation'
    ]
  },
  'html-formatter': {
    displayName: 'HTML Formatter',
    description: 'Free online HTML formatter for beautifying, minifying, and formatting HTML markup',
    features: [
      'HTML beautify',
      'HTML minify',
      'Syntax highlighting',
      'Tag validation',
      'Indentation control',
      'Attribute sorting',
      'Comment preservation',
      'Copy to clipboard',
      'Download HTML',
      'Code compression'
    ]
  },
  'css-formatter': {
    displayName: 'CSS Formatter',
    description: 'Free online CSS formatter for beautifying, minifying, and formatting CSS stylesheets',
    features: [
      'CSS beautify',
      'CSS minify',
      'Syntax highlighting',
      'Property sorting',
      'Indentation control',
      'Vendor prefix handling',
      'Media query formatting',
      'Copy to clipboard',
      'Download CSS',
      'Code compression'
    ]
  },
  'xml-formatter': {
    displayName: 'XML Formatter',
    description: 'Free online XML formatter for beautifying, minifying, and formatting XML documents',
    features: [
      'XML beautify',
      'XML minify',
      'Syntax highlighting',
      'Validation',
      'Indentation control',
      'Attribute sorting',
      'Namespace handling',
      'Copy to clipboard',
      'Download XML',
      'Code compression'
    ]
  },
  'sql-formatter': {
    displayName: 'SQL Formatter',
    description: 'Free online SQL formatter for beautifying, minifying, and formatting SQL queries',
    features: [
      'SQL beautify',
      'SQL minify',
      'Syntax highlighting',
      'Query validation',
      'Keyword capitalization',
      'Indentation control',
      'Multi-dialect support',
      'Copy to clipboard',
      'Download SQL',
      'Code compression'
    ]
  },
  'encode-decode': {
    displayName: 'Encode Decode',
    description: 'Free online encoding and decoding tool for URL, Base64, HTML entities, and more formats',
    features: [
      'URL encoding/decoding',
      'Base64 encoding/decoding',
      'HTML entity encoding/decoding',
      'Unicode encoding/decoding',
      'Hex encoding/decoding',
      'Binary encoding/decoding',
      'UTF-8 support',
      'Copy to clipboard',
      'Batch processing',
      'Format validation'
    ]
  },
  'line-tools': {
    displayName: 'Line Tools',
    description: 'Free online line manipulation tools for sorting, deduplicating, and processing text lines',
    features: [
      'Sort lines',
      'Remove duplicates',
      'Reverse lines',
      'Shuffle lines',
      'Filter lines',
      'Count lines',
      'Add line numbers',
      'Remove empty lines',
      'Copy to clipboard',
      'Batch processing'
    ]
  },
  'text-generator': {
    displayName: 'Text Generator',
    description: 'Free online text generator for creating Lorem Ipsum, random text, UUIDs, and more content',
    features: [
      'Lorem Ipsum generator',
      'Random text generator',
      'UUID generator',
      'Password generator',
      'Lorem words generator',
      'Lorem sentences generator',
      'Lorem paragraphs generator',
      'Custom text patterns',
      'Copy to clipboard',
      'Export options'
    ]
  }
};

function updateComponent(componentName) {
  const componentPath = `src/app/components/${componentName}/${componentName}.component.ts`;
  
  if (!fs.existsSync(componentPath)) {
    console.log(`❌ Component not found: ${componentPath}`);
    return;
  }

  let content = fs.readFileSync(componentPath, 'utf8');
  const config = toolConfigs[componentName];
  
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
    content = content.replace(
      /constructor\(\s*([^)]*)\s*\)\s*{/,
      (match, params) => {
        if (params.includes('ToolSchemaService')) {
          return match;
        }
        return `constructor(
    ${params.trim()},
    private toolSchemaService: ToolSchemaService
  ) {`;
      }
    );
  }

  // Add schema generation call in ngOnInit if not present
  if (!content.includes('addAdvancedSchemas()')) {
    // Find the end of ngOnInit method
    const ngOnInitMatch = content.match(/ngOnInit\(\):\s*void\s*{([\s\S]*?)(?=\n\s*[a-zA-Z]|\n\s*}\s*$)/);
    if (ngOnInitMatch) {
      const ngOnInitContent = ngOnInitMatch[1];
      if (!ngOnInitContent.includes('addAdvancedSchemas()')) {
        content = content.replace(
          ngOnInitMatch[0],
          ngOnInitMatch[0] + '\n    // Add advanced schemas for enhanced SEO\n    this.addAdvancedSchemas();'
        );
      }
    }
  }

  // Add addAdvancedSchemas method if not present
  if (!content.includes('private addAdvancedSchemas()')) {
    const methodContent = `
  private addAdvancedSchemas() {
    this.toolSchemaService.addToolSchemas({
      toolName: '${componentName}',
      displayName: '${config.displayName}',
      description: '${config.description}',
      features: [
        ${config.features.map(feature => `'${feature}'`).join(',\n        ')}
      ],
      tutorialVideoTitle: 'How to Use ${config.displayName}',
      tutorialVideoDescription: 'Learn how to use ${config.displayName.toLowerCase()} with our free online tool.',
      tutorialVideoThumbnail: 'https://smarttextconverter.com/assets/tutorials/${componentName}-tutorial.jpg',
      authorName: 'SmartTextConverter Team',
      authorTitle: 'Text Processing Specialist',
      authorDescription: 'Expert in ${config.displayName.toLowerCase()} and web development tools.',
      authorCredentials: ['Text Processing', 'Web Development', 'SEO Optimization'],
      authorSocialProfiles: ['https://smarttextconverter.com', 'https://github.com/smarttextconverter']
    });
  }`;

    // Add method before the last closing brace
    content = content.replace(/(\n\s*}\s*$)/, methodContent + '\n$1');
  }

  // Write updated content
  fs.writeFileSync(componentPath, content);
  console.log(`✅ Updated: ${componentName}`);
}

// Update all tool components
console.log('🚀 Applying AdvancedSchemaService integration to tool components...\n');

toolComponents.forEach(componentName => {
  try {
    updateComponent(componentName);
  } catch (error) {
    console.log(`❌ Error updating ${componentName}:`, error.message);
  }
});

console.log('\n🎉 Schema integration completed!');
