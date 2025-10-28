const fs = require('fs');
const path = require('path');

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║         TRANSLATION SYNC SCRIPT V2 (Improved)                 ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

// Better parsing that handles multi-line strings and preserves formatting
function parseTranslationFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  const translations = new Map(); // key -> full line(s) including value
  const keyOrder = []; // preserve order
  
  let inExport = false;
  let currentKey = null;
  let currentLines = [];
  let bracketDepth = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Track when we're inside the export const object
    if (line.includes('export const') && line.includes('= {')) {
      inExport = true;
      bracketDepth = 1;
      continue;
    }
    
    if (!inExport) continue;
    
    // Track bracket depth
    const openBrackets = (line.match(/{/g) || []).length;
    const closeBrackets = (line.match(/}/g) || []).length;
    bracketDepth += openBrackets - closeBrackets;
    
    // If we've closed the main object, stop
    if (bracketDepth === 0) break;
    
    // Skip comment lines and empty lines when not in a value
    if (!currentKey && (line.trim().startsWith('//') || line.trim() === '')) {
      continue;
    }
    
    // Check if this line starts a new key-value pair
    const keyMatch = line.match(/^\s*['"]([^'"]+)['"]\s*:/);
    
    if (keyMatch && !currentKey) {
      // Start of a new key
      currentKey = keyMatch[1];
      currentLines = [line];
      
      // Check if it's a complete single-line value
      if (line.trim().endsWith(',')) {
        translations.set(currentKey, currentLines.join('\n'));
        keyOrder.push(currentKey);
        currentKey = null;
        currentLines = [];
      }
    } else if (currentKey) {
      // Continuation of multi-line value
      currentLines.push(line);
      
      // Check if this line completes the value
      if (line.trim().endsWith(',')) {
        translations.set(currentKey, currentLines.join('\n'));
        keyOrder.push(currentKey);
        currentKey = null;
        currentLines = [];
      }
    }
  }
  
  return { translations, keyOrder };
}

// Parse English file
const translationsDir = 'src/app/translations';
const enPath = path.join(translationsDir, 'en.ts');
const { translations: enTranslations, keyOrder: enKeyOrder } = parseTranslationFile(enPath);

console.log(`✅ Parsed English: ${enKeyOrder.length} keys\n`);

// Get all translation files
const files = fs.readdirSync(translationsDir)
  .filter(f => f.endsWith('.ts') && f !== 'index.ts' && f !== 'en.ts')
  .sort();

// Process each language file
let totalFixed = 0;
let totalAdded = 0;
let totalRemoved = 0;

files.forEach(file => {
  const langCode = file.replace('.ts', '');
  const filePath = path.join(translationsDir, file);
  
  console.log(`🔄 Processing ${file.toUpperCase()} (${langCode})...`);
  
  // Parse current translations
  const { translations: currentTranslations, keyOrder: currentKeyOrder } = parseTranslationFile(filePath);
  
  // Find missing and extra keys
  const missing = enKeyOrder.filter(key => !currentTranslations.has(key));
  const extra = currentKeyOrder.filter(key => !enTranslations.has(key));
  
  if (missing.length > 0 || extra.length > 0) {
    console.log(`  + Adding ${missing.length} missing keys`);
    console.log(`  - Removing ${extra.length} extra keys`);
    
    totalAdded += missing.length;
    totalRemoved += extra.length;
    totalFixed++;
    
    // Build new file content
    const exportName = langCode.replace('-', '_');
    let newContent = `export const ${exportName} = {\n`;
    
    enKeyOrder.forEach(key => {
      if (currentTranslations.has(key)) {
        // Use existing translation
        newContent += currentTranslations.get(key) + '\n';
      } else {
        // Use English value as fallback
        newContent += enTranslations.get(key) + '\n';
      }
    });
    
    newContent += '};\n';
    
    // Write updated file
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`  ✅ File updated\n`);
  } else {
    console.log(`  ✅ Already in sync\n`);
  }
});

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║                    SYNC COMPLETE!                              ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

console.log('📊 Summary:');
console.log(`  • Files processed: ${files.length}`);
console.log(`  • Files updated: ${totalFixed}`);
console.log(`  • English keys: ${enKeyOrder.length}`);
console.log(`  • Total keys added: ${totalAdded}`);
console.log(`  • Total keys removed: ${totalRemoved}`);
console.log('\n✅ All translation files are now in sync with English!\n');

