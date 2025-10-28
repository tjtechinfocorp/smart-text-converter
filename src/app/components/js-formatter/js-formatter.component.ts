import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SEOService } from '../../services/seo.service';
import { TranslatedTextComponent } from '../translated-text/translated-text.component';

interface JsFormatOptions {
  indentSize: number;
  useTabs: boolean;
  preserveComments: boolean;
  compact: boolean;
  sortKeys: boolean;
  removeUnused: boolean;
  fixIndentation: boolean;
  addSemicolons: boolean;
  removeSemicolons: boolean;
  convertToES6: boolean;
  minify: boolean;
}

interface JsStats {
  lines: number;
  characters: number;
  words: number;
  functions: number;
  variables: number;
  classes: number;
  comments: number;
  complexity: number;
  size: string;
}

@Component({
  selector: 'app-js-formatter',
  templateUrl: './js-formatter.component.html',
  styleUrls: ['./js-formatter.component.scss'],
  imports: [CommonModule, FormsModule, RouterModule, TranslatedTextComponent],
  standalone: true,
})
export class JsFormatterComponent implements OnInit, OnDestroy {
  jsInput: string = '';
  jsOutput: string = '';
  isProcessing: boolean = false;
  currentView: 'formatted' | 'minified' | 'stats' | 'validate' | 'convert' = 'formatted';
  isValidJs: boolean = true;
  jsError: string = '';

  formatOptions: JsFormatOptions = {
    indentSize: 2,
    useTabs: false,
    preserveComments: true,
    compact: false,
    sortKeys: false,
    removeUnused: false,
    fixIndentation: true,
    addSemicolons: true,
    removeSemicolons: false,
    convertToES6: false,
    minify: false,
  };

  // Sample JavaScript for demonstration
  sampleJs = `// Sample JavaScript code
function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price * items[i].quantity;
  }
  return total;
}

const products = [
  { name: "Laptop", price: 999.99, quantity: 2 },
  { name: "Mouse", price: 29.99, quantity: 1 },
  { name: "Keyboard", price: 79.99, quantity: 1 }
];

const grandTotal = calculateTotal(products);
console.log("Total:", grandTotal);`;

  constructor(private seoService: SEOService, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    // Set SEO meta tags for JS formatter page
    this.seoService.updateSEO({
      title: 'JavaScript Formatter — Free Online JS Beautifier & Minifier',
      description:
        'Format, beautify, minify, and validate JavaScript code online. Free JS formatter with syntax highlighting, error detection, and ES6 conversion.',
      keywords:
        'javascript formatter, js beautifier, js minifier, javascript validator, code formatter, js prettifier',
      url: 'https://smarttextconverter.com/js/formatter',
      type: 'website',
      image: '/main-logo-80x80.png',
      author: 'SmartTextConverter',
      locale: 'en',
      canonicalUrl: 'https://smarttextconverter.com/js/formatter',
      structuredData: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'JavaScript Formatter',
          description: 'Free online JavaScript formatter, beautifier, minifier, and validator',
          url: '/js/formatter',
          applicationCategory: 'DeveloperApplication',
          operatingSystem: 'Any',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
          featureList: [
            'JavaScript Formatting',
            'Code Beautification',
            'Code Minification',
            'Syntax Validation',
            'ES6 Conversion',
            'Error Detection',
          ],
        },
      ],
    });

    // Load sample data
    this.jsInput = this.sampleJs;
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  private async initializeEditors(): Promise<void> {
    // For now, we'll use simple textareas
    // Monaco editor can be added later as an optional enhancement
    console.log('Editors initialized with textareas');
  }

  /**
   * Process JavaScript based on current view
   */
  processJs(): void {
    if (!this.jsInput.trim()) {
      this.jsOutput = '';
      this.updateOutputEditor();
      return;
    }

    this.isProcessing = true;

    try {
      switch (this.currentView) {
        case 'formatted':
          this.jsOutput = this.formatJavaScript(this.jsInput);
          break;
        case 'minified':
          this.jsOutput = this.minifyJavaScript(this.jsInput);
          break;
        case 'stats':
          const stats = this.getJavaScriptStats(this.jsInput);
          this.jsOutput = JSON.stringify(stats, null, 2);
          break;
        case 'validate':
          this.validateJavaScript(this.jsInput);
          break;
        case 'convert':
          this.jsOutput = this.convertToES6(this.jsInput);
          break;
      }

      this.updateOutputEditor();
    } catch (error) {
      this.jsOutput = 'Error processing JavaScript: ' + (error as Error).message;
      this.updateOutputEditor();
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Format JavaScript with proper indentation and structure
   */
  private formatJavaScript(code: string): string {
    try {
      // Basic formatting logic
      let formatted = code;

      // Remove extra whitespace
      formatted = formatted.replace(/\s+/g, ' ');

      // Add proper line breaks
      formatted = formatted.replace(/;/g, ';\n');
      formatted = formatted.replace(/\{/g, ' {\n');
      formatted = formatted.replace(/\}/g, '\n}\n');
      formatted = formatted.replace(/,/g, ',\n');

      // Add indentation
      const lines = formatted.split('\n');
      let indentLevel = 0;
      const indent = this.formatOptions.useTabs ? '\t' : ' '.repeat(this.formatOptions.indentSize);

      const formattedLines = lines.map(line => {
        const trimmed = line.trim();
        if (!trimmed) return '';

        // Decrease indent for closing braces
        if (trimmed === '}' || trimmed.startsWith('}')) {
          indentLevel = Math.max(0, indentLevel - 1);
        }

        const indentedLine = indent.repeat(indentLevel) + trimmed;

        // Increase indent for opening braces
        if (trimmed.endsWith('{') || trimmed.endsWith('{')) {
          indentLevel++;
        }

        return indentedLine;
      });

      return formattedLines.join('\n').replace(/\n\s*\n\s*\n/g, '\n\n');
    } catch (error) {
      throw new Error('Failed to format JavaScript: ' + (error as Error).message);
    }
  }

  /**
   * Minify JavaScript by removing whitespace and comments
   */
  private minifyJavaScript(code: string): string {
    try {
      let minified = code;

      // Remove single-line comments
      minified = minified.replace(/\/\/.*$/gm, '');

      // Remove multi-line comments
      minified = minified.replace(/\/\*[\s\S]*?\*\//g, '');

      // Remove extra whitespace
      minified = minified.replace(/\s+/g, ' ');

      // Remove spaces around operators
      minified = minified.replace(/\s*([{}();,=+\-*/<>!&|])\s*/g, '$1');

      // Remove spaces around keywords
      minified = minified.replace(
        /\s*(if|else|for|while|function|var|let|const|return)\s*/g,
        ' $1 '
      );

      // Remove leading/trailing whitespace
      minified = minified.trim();

      return minified;
    } catch (error) {
      throw new Error('Failed to minify JavaScript: ' + (error as Error).message);
    }
  }

  /**
   * Get JavaScript code statistics
   */
  private getJavaScriptStats(code: string): JsStats {
    const lines = code.split('\n').length;
    const characters = code.length;
    const words = code.split(/\s+/).filter(word => word.length > 0).length;

    // Count functions
    const functionMatches = code.match(
      /function\s+\w+|const\s+\w+\s*=\s*\(|let\s+\w+\s*=\s*\(|var\s+\w+\s*=\s*\(/g
    );
    const functions = functionMatches ? functionMatches.length : 0;

    // Count variables
    const varMatches = code.match(/var\s+\w+|let\s+\w+|const\s+\w+/g);
    const variables = varMatches ? varMatches.length : 0;

    // Count classes
    const classMatches = code.match(/class\s+\w+/g);
    const classes = classMatches ? classMatches.length : 0;

    // Count comments
    const singleLineComments = (code.match(/\/\/.*$/gm) || []).length;
    const multiLineComments = (code.match(/\/\*[\s\S]*?\*\//g) || []).length;
    const comments = singleLineComments + multiLineComments;

    // Simple complexity calculation
    const complexity = (code.match(/if|else|for|while|switch|case|catch|try/g) || []).length;

    // Calculate size
    const sizeInBytes = new Blob([code]).size;
    const size =
      sizeInBytes < 1024
        ? `${sizeInBytes} B`
        : sizeInBytes < 1024 * 1024
        ? `${(sizeInBytes / 1024).toFixed(1)} KB`
        : `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;

    return {
      lines,
      characters,
      words,
      functions,
      variables,
      classes,
      comments,
      complexity,
      size,
    };
  }

  /**
   * Validate JavaScript syntax
   */
  private validateJavaScript(code: string): void {
    try {
      // Basic syntax validation
      new Function(code);
      this.isValidJs = true;
      this.jsError = '';
      this.jsOutput = '✅ JavaScript syntax is valid!';
    } catch (error) {
      this.isValidJs = false;
      this.jsError = (error as Error).message;
      this.jsOutput = `❌ JavaScript syntax error:\n${this.jsError}`;
    }
  }

  /**
   * Convert JavaScript to ES6+ syntax
   */
  private convertToES6(code: string): string {
    try {
      let converted = code;

      // Convert var to let/const
      converted = converted.replace(/var\s+(\w+)/g, 'let $1');

      // Convert function declarations to arrow functions where possible
      converted = converted.replace(/function\s+(\w+)\s*\(([^)]*)\)\s*\{/g, 'const $1 = ($2) => {');

      // Convert anonymous functions to arrow functions
      converted = converted.replace(/function\s*\(([^)]*)\)\s*\{/g, '($1) => {');

      // Add template literals for string concatenation
      converted = converted.replace(/"([^"]*)"\s*\+\s*([^+]+)\s*\+\s*"([^"]*)"/g, '`$1${$2}$3`');

      return converted;
    } catch (error) {
      throw new Error('Failed to convert to ES6: ' + (error as Error).message);
    }
  }

  /**
   * Update output editor content
   */
  private updateOutputEditor(): void {
    // Output is automatically updated via ngModel binding
  }

  /**
   * Copy text to clipboard
   */
  copyToClipboard(text: string): void {
    if (isPlatformBrowser(this.platformId)) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          // You could add a toast notification here
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    }
  }

  /**
   * Clear input
   */
  clearInput(): void {
    this.jsInput = '';
    this.jsOutput = '';
  }

  /**
   * Load sample data
   */
  loadSample(): void {
    this.jsInput = this.sampleJs;
  }

  /**
   * Switch view mode
   */
  switchView(view: string): void {
    if (['formatted', 'minified', 'stats', 'validate', 'convert'].includes(view)) {
      this.currentView = view as 'formatted' | 'minified' | 'stats' | 'validate' | 'convert';
      this.processJs();
    }
  }

  /**
   * Update format options
   */
  updateFormatOptions(): void {
    this.processJs();
  }
}
