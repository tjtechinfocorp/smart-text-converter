#!/usr/bin/env node

/**
 * Script to fix all constructors in tool components
 */

const fs = require('fs');
const path = require('path');

// Tool components that need constructor fixes
const toolComponents = [
  'json-formatter',
  'line-tools',
  'text-analyzer',
  'text-generator'
];

function fixConstructor(componentName) {
  const componentPath = `src/app/components/${componentName}/${componentName}.component.ts`;
  
  if (!fs.existsSync(componentPath)) {
    console.log(`❌ Component not found: ${componentPath}`);
    return;
  }

  let content = fs.readFileSync(componentPath, 'utf8');
  
  // Fix various constructor patterns
  const patterns = [
    // Pattern 1: constructor(private seoService: SEOService, @Inject(PLATFORM_ID) private platformId: Object) {}
    {
      regex: /constructor\(\s*private seoService: SEOService,\s*@Inject\(PLATFORM_ID\) private platformId: Object\s*\)\s*\{\}/,
      replacement: `constructor(
    private seoService: SEOService,
    private toolSchemaService: ToolSchemaService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}`
    },
    // Pattern 2: constructor(@Inject(PLATFORM_ID) private platformId: Object, private seoService: SEOService) {}
    {
      regex: /constructor\(\s*@Inject\(PLATFORM_ID\) private platformId: Object,\s*private seoService: SEOService\s*\)\s*\{\}/,
      replacement: `constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private seoService: SEOService,
    private toolSchemaService: ToolSchemaService
  ) {}`
    },
    // Pattern 3: Multi-line constructor
    {
      regex: /constructor\(\s*private seoService: SEOService,\s*@Inject\(PLATFORM_ID\) private platformId: Object\s*\)\s*\{\}/,
      replacement: `constructor(
    private seoService: SEOService,
    private toolSchemaService: ToolSchemaService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}`
    }
  ];

  let fixed = false;
  for (const pattern of patterns) {
    if (pattern.regex.test(content)) {
      content = content.replace(pattern.regex, pattern.replacement);
      fixed = true;
      break;
    }
  }

  if (!fixed) {
    console.log(`⚠️  No matching constructor pattern found for ${componentName}`);
    return;
  }

  // Write updated content
  fs.writeFileSync(componentPath, content);
  console.log(`✅ Fixed constructor: ${componentName}`);
}

// Fix all tool components
console.log('🚀 Fixing remaining constructors in tool components...\n');

toolComponents.forEach(componentName => {
  try {
    fixConstructor(componentName);
  } catch (error) {
    console.log(`❌ Error fixing ${componentName}:`, error.message);
  }
});

console.log('\n🎉 Constructor fixes completed!');
