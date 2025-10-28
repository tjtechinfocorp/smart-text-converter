const fs = require('fs');
const path = require('path');

// Read and parse a translation file
function readTranslationFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Extract all keys using regex
  const keyRegex = /['"]([^'"]+)['"]\s*:/g;
  const keys = new Set();
  let match;
  
  while ((match = keyRegex.exec(content)) !== null) {
    keys.add(match[1]);
  }
  
  return keys;
}

// Get all translation files
const translationsDir = 'src/app/translations';
const files = fs.readdirSync(translationsDir)
  .filter(f => f.endsWith('.ts') && f !== 'index.ts')
  .sort();

// Read English keys as baseline
const enKeys = readTranslationFile(path.join(translationsDir, 'en.ts'));
console.log(`\n📊 English translation has ${enKeys.size} keys\n`);

// Compare each language
const results = [];

files.forEach(file => {
  if (file === 'en.ts') return;
  
  const langCode = file.replace('.ts', '');
  const langKeys = readTranslationFile(path.join(translationsDir, file));
  
  const missingKeys = [...enKeys].filter(key => !langKeys.has(key));
  const extraKeys = [...langKeys].filter(key => !enKeys.has(key));
  
  results.push({
    lang: langCode,
    file: file,
    total: langKeys.size,
    missing: missingKeys,
    extra: extraKeys,
    complete: missingKeys.length === 0 && extraKeys.length === 0
  });
});

// Sort by number of issues
results.sort((a, b) => {
  const aIssues = a.missing.length + a.extra.length;
  const bIssues = b.missing.length + b.extra.length;
  return bIssues - aIssues;
});

// Print summary table
console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║           TRANSLATION COMPLETENESS REPORT                      ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

console.log('┌─────────┬───────────┬──────────┬────────────┬────────────┐');
console.log('│ Language│ Total Keys│  Missing │   Extra    │   Status   │');
console.log('├─────────┼───────────┼──────────┼────────────┼────────────┤');

results.forEach(r => {
  const status = r.complete ? '✅ Complete' : '⚠️  Issues';
  const lang = r.lang.padEnd(7);
  const total = r.total.toString().padStart(9);
  const missing = r.missing.length.toString().padStart(8);
  const extra = r.extra.length.toString().padStart(10);
  console.log(`│ ${lang} │${total}  │${missing}  │${extra}  │ ${status}  │`);
});

console.log('└─────────┴───────────┴──────────┴────────────┴────────────┘\n');

// Print detailed issues
const problematic = results.filter(r => !r.complete);

if (problematic.length > 0) {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║                    DETAILED ISSUES                             ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  problematic.forEach(r => {
    console.log(`\n📁 ${r.file.toUpperCase()} (${r.lang})`);
    console.log('─'.repeat(70));
    
    if (r.missing.length > 0) {
      console.log(`\n❌ Missing ${r.missing.length} keys:`);
      r.missing.slice(0, 20).forEach(key => console.log(`   • ${key}`));
      if (r.missing.length > 20) {
        console.log(`   ... and ${r.missing.length - 20} more`);
      }
    }
    
    if (r.extra.length > 0) {
      console.log(`\n➕ Extra ${r.extra.length} keys (not in English):`);
      r.extra.slice(0, 20).forEach(key => console.log(`   • ${key}`));
      if (r.extra.length > 20) {
        console.log(`   ... and ${r.extra.length - 20} more`);
      }
    }
  });
} else {
  console.log('\n🎉 All translation files are complete and match English!\n');
}

// Print summary statistics
console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║                    SUMMARY STATISTICS                          ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

const totalLanguages = results.length;
const completeLanguages = results.filter(r => r.complete).length;
const percentComplete = ((completeLanguages / totalLanguages) * 100).toFixed(1);

console.log(`  Total Languages:     ${totalLanguages}`);
console.log(`  Complete:            ${completeLanguages} (${percentComplete}%)`);
console.log(`  With Issues:         ${totalLanguages - completeLanguages}`);
console.log(`  English Keys:        ${enKeys.size}`);
console.log('');

