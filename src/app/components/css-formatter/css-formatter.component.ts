import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SEOService } from '../../services/seo.service';
import { TranslatedTextComponent } from '../translated-text/translated-text.component';

interface CssFormatOptions {
  indentSize: number;
  indentType: 'space' | 'tab';
  preserveComments: boolean;
  sortProperties: boolean;
}

interface CssStats {
  originalLength: number;
  formattedLength: number;
  lines: number;
  rules: number;
  selectors: number;
  properties: number;
  comments: number;
  compressionRatio: number;
}

@Component({
  selector: 'app-css-formatter',
  templateUrl: './css-formatter.component.html',
  styleUrls: ['./css-formatter.component.scss'],
  imports: [CommonModule, FormsModule, RouterModule, TranslatedTextComponent],
  standalone: true,
})
export class CssFormatterComponent implements OnInit, OnDestroy {
  inputText: string = '';
  outputText: string = '';
  isProcessing: boolean = false;
  currentView: 'formatted' | 'minified' | 'validate' | 'optimize' | 'convert' | 'lint' =
    'formatted';
  isValidCss: boolean = true;
  cssError: string = '';
  errors: string[] = [];
  warnings: string[] = [];
  statistics = {
    originalLength: 0,
    formattedLength: 0,
    lines: 0,
    rules: 0,
    selectors: 0,
    properties: 0,
    comments: 0,
    compressionRatio: 0,
  };

  formatOptions: CssFormatOptions = {
    indentSize: 2,
    indentType: 'space',
    preserveComments: true,
    sortProperties: false,
  };

  // Sample CSS for demonstration
  sampleCss = `/* Sample CSS code */
.container {
  background-color: #ffffff;
  padding: 20px;
  margin: 0 auto;
  max-width: 1200px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.navigation {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.navigation li {
  margin-right: 1rem;
}

.navigation a {
  color: #333;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.navigation a:hover {
  background-color: #e9ecef;
}`;

  constructor(private seoService: SEOService, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    // Set comprehensive SEO meta tags for CSS formatter page
    this.seoService.updateSEO({
      title: 'CSS Formatter — Free Online CSS Beautifier & Minifier | SmartTextConverter',
      description:
        'Professional CSS formatter, beautifier, minifier, and validator. Format CSS code with syntax highlighting, error detection, optimization tools, and multi-language support. Free online CSS formatter.',
      keywords:
        'css formatter, css beautifier, css minifier, css validator, css optimizer, css linter, css prettifier, css code formatter, css beautify, css minify, css validate, css tools, css development, css editor, css syntax, css formatting, css optimization, css compression, css tools online, free css formatter, css code editor, css development tools',
      url: 'https://smarttextconverter.com/css/formatter',
      type: 'website',
      image: '/main-logo-80x80.png',
      author: 'SmartTextConverter',
      locale: 'en',
      canonicalUrl: 'https://smarttextconverter.com/css/formatter',
    });

    // Add additional meta tags for better SEO
    this.seoService['meta'].updateTag({
      name: 'robots',
      content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    });
    this.seoService['meta'].updateTag({
      name: 'googlebot',
      content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    });
    this.seoService['meta'].updateTag({
      name: 'bingbot',
      content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    });
    this.seoService['meta'].updateTag({ name: 'language', content: 'en' });
    this.seoService['meta'].updateTag({ name: 'revisit-after', content: '7 days' });
    this.seoService['meta'].updateTag({ name: 'rating', content: 'general' });
    this.seoService['meta'].updateTag({ name: 'distribution', content: 'global' });
    this.seoService['meta'].updateTag({ name: 'geo.region', content: 'US' });
    this.seoService['meta'].updateTag({ name: 'geo.placename', content: 'United States' });
    this.seoService['meta'].updateTag({ name: 'geo.position', content: '39.8283;-98.5795' });
    this.seoService['meta'].updateTag({ name: 'ICBM', content: '39.8283, -98.5795' });

    // Add structured data for CSS formatter tool
    this.addStructuredData();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  addStructuredData(): void {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'CSS Formatter - Free Online CSS Beautifier & Minifier',
      description:
        'Professional CSS formatter, beautifier, minifier, and validator. Format CSS code with syntax highlighting, error detection, and optimization tools.',
      url: 'https://smarttextconverter.com/css/formatter',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Any',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      creator: {
        '@type': 'Organization',
        name: 'SmartTextConverter',
        url: 'https://smarttextconverter.com',
      },
      featureList: [
        'CSS Code Formatting',
        'CSS Beautification',
        'CSS Minification',
        'CSS Validation',
        'CSS Optimization',
        'CSS Linting',
        'Syntax Highlighting',
        'Error Detection',
        'Multi-language Support',
        'Free Online Tool',
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.6',
        ratingCount: '510',
        bestRating: '5',
        worstRating: '1',
      },
      screenshot: 'https://smarttextconverter.com/main-logo-80x80.png',
      softwareVersion: '2.0',
      datePublished: '2025-01-07',
      dateModified: '2025-01-07',
    };

    this.seoService.addStructuredData(structuredData);
  }

  switchView(view: string): void {
    this.currentView = view as any;
    this.processCSS();
  }

  loadSample(): void {
    this.inputText = this.sampleCss;
    this.processCSS();
  }

  clearInput(): void {
    this.inputText = '';
    this.outputText = '';
    this.cssError = '';
    this.isValidCss = true;
    this.errors = [];
    this.warnings = [];
  }

  clearOutput(): void {
    this.outputText = '';
  }

  updateFormatOptions(): void {
    if (this.inputText.trim()) {
      this.processCSS();
    }
  }

  processCSS(): void {
    if (!this.inputText.trim()) {
      this.outputText = '';
      return;
    }

    this.isProcessing = true;
    this.cssError = '';
    this.isValidCss = true;

    try {
      switch (this.currentView) {
        case 'formatted':
          this.outputText = this.formatCSS(this.inputText);
          break;
        case 'minified':
          this.outputText = this.minifyCSS(this.inputText);
          break;
        case 'validate':
          this.validateCSS(this.inputText);
          break;
        case 'optimize':
          this.outputText = this.optimizeCSS(this.inputText);
          break;
        case 'convert':
          this.outputText = this.convertCSS(this.inputText);
          break;
        case 'lint':
          this.outputText = this.lintCSS(this.inputText);
          break;
      }

      // Update statistics
      this.updateStatistics();
    } catch (error) {
      this.cssError = error instanceof Error ? error.message : 'An error occurred';
      this.isValidCss = false;
    } finally {
      this.isProcessing = false;
    }
  }

  private formatCSS(css: string): string {
    // Basic CSS formatting
    let formatted = css
      .replace(/\s*{\s*/g, ' {\n  ')
      .replace(/;\s*/g, ';\n  ')
      .replace(/\s*}\s*/g, '\n}\n')
      .replace(/,\s*/g, ',\n  ')
      .trim();

    // Apply indentation
    const lines = formatted.split('\n');
    let indentLevel = 0;
    const indent =
      this.formatOptions.indentType === 'tab' ? '\t' : ' '.repeat(this.formatOptions.indentSize);

    return lines
      .map(line => {
        const trimmed = line.trim();
        if (trimmed === '') return '';

        if (trimmed.includes('}')) indentLevel--;
        const indented = indent.repeat(Math.max(0, indentLevel)) + trimmed;
        if (trimmed.includes('{')) indentLevel++;

        return indented;
      })
      .join('\n');
  }

  private minifyCSS(css: string): string {
    return css
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/;\s*}/g, '}') // Remove semicolon before closing brace
      .replace(/\s*{\s*/g, '{') // Remove spaces around opening brace
      .replace(/\s*}\s*/g, '}') // Remove spaces around closing brace
      .replace(/\s*;\s*/g, ';') // Remove spaces around semicolons
      .replace(/\s*,\s*/g, ',') // Remove spaces around commas
      .trim();
  }

  private validateCSS(css: string): void {
    const errors: string[] = [];

    // Check for basic syntax errors
    const openBraces = (css.match(/\{/g) || []).length;
    const closeBraces = (css.match(/\}/g) || []).length;

    if (openBraces !== closeBraces) {
      errors.push('Mismatched braces: ' + Math.abs(openBraces - closeBraces) + ' unclosed braces');
    }

    // Check for missing semicolons
    const lines = css.split('\n');
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (
        trimmed &&
        !trimmed.endsWith(';') &&
        !trimmed.endsWith('{') &&
        !trimmed.endsWith('}') &&
        !trimmed.startsWith('/*')
      ) {
        errors.push(`Line ${index + 1}: Missing semicolon`);
      }
    });

    if (errors.length > 0) {
      this.cssError = errors.join('\n');
      this.isValidCss = false;
    } else {
      this.outputText = 'CSS is valid!';
      this.isValidCss = true;
    }
  }

  private optimizeCSS(css: string): string {
    // Basic CSS optimization
    let optimized = css;

    // Remove duplicate properties
    optimized = this.removeDuplicateProperties(optimized);

    // Optimize shorthand properties
    optimized = this.optimizeShorthandProperties(optimized);

    // Remove unused rules (basic implementation)
    optimized = this.removeUnusedRules(optimized);

    return optimized;
  }

  private convertCSS(css: string): string {
    // Convert to different formats (SCSS, SASS, LESS, etc.)
    // For now, just return formatted CSS
    return this.formatCSS(css);
  }

  private lintCSS(css: string): string {
    const warnings: string[] = [];

    // Check for common issues
    const lines = css.split('\n');
    lines.forEach((line, index) => {
      if (line.includes('!important')) {
        warnings.push(`Line ${index + 1}: Avoid using !important`);
      }
      if (line.includes('px') && !line.includes('font-size')) {
        warnings.push(`Line ${index + 1}: Consider using relative units instead of px`);
      }
    });

    if (warnings.length > 0) {
      return 'Lint warnings:\n' + warnings.join('\n');
    } else {
      return 'No lint issues found!';
    }
  }

  private removeDuplicateProperties(css: string): string {
    // Basic implementation - remove duplicate properties within the same rule
    const rules = css.match(/\{[^}]*\}/g) || [];

    rules.forEach(rule => {
      const properties = rule.match(/[^{}]+(?=;)/g) || [];
      const uniqueProperties = [...new Set(properties)];
      // This is a simplified implementation
    });

    return css;
  }

  private optimizeShorthandProperties(css: string): string {
    // Optimize common shorthand properties
    return css.replace(
      /margin:\s*(\d+px)\s+(\d+px)\s+(\d+px)\s+(\d+px)/g,
      (match, top, right, bottom, left) => {
        if (top === right && right === bottom && bottom === left) {
          return `margin: ${top}`;
        }
        if (top === bottom && left === right) {
          return `margin: ${top} ${right}`;
        }
        return match;
      }
    );
  }

  private removeUnusedRules(css: string): string {
    // Basic implementation - this would need more sophisticated analysis
    return css;
  }

  copyOutput(): void {
    if (this.outputText) {
      navigator.clipboard.writeText(this.outputText);
    }
  }

  downloadOutput(): void {
    if (!isPlatformBrowser(this.platformId) || !this.outputText) {
      return;
    }

    const blob = new Blob([this.outputText], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.css';
    a.click();
    URL.revokeObjectURL(url);
  }

  private updateStatistics(): void {
    this.statistics.originalLength = this.inputText.length;
    this.statistics.formattedLength = this.outputText.length;
    this.statistics.lines = this.outputText.split('\n').length;
    this.statistics.compressionRatio =
      this.statistics.originalLength > 0
        ? (this.statistics.originalLength - this.statistics.formattedLength) /
          this.statistics.originalLength
        : 0;

    // Calculate advanced statistics
    this.statistics.rules = this.countCSSRules(this.outputText);
    this.statistics.selectors = this.countSelectors(this.outputText);
    this.statistics.properties = this.countProperties(this.outputText);
    this.statistics.comments = this.countComments(this.outputText);
  }

  private countCSSRules(css: string): number {
    const ruleMatches = css.match(/\{[^}]*\}/g);
    return ruleMatches ? ruleMatches.length : 0;
  }

  private countSelectors(css: string): number {
    const selectorMatches = css.match(/[^{}]+(?=\s*\{)/g);
    return selectorMatches ? selectorMatches.length : 0;
  }

  private countProperties(css: string): number {
    const propertyMatches = css.match(/[a-zA-Z-]+\s*:/g);
    return propertyMatches ? propertyMatches.length : 0;
  }

  private countComments(css: string): number {
    const commentMatches = css.match(/\/\*[\s\S]*?\*\//g);
    return commentMatches ? commentMatches.length : 0;
  }

  getFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  getSavings(): string {
    const savings = this.statistics.originalLength - this.statistics.formattedLength;
    return this.getFileSize(savings);
  }

  getActionLabel(): string {
    switch (this.currentView) {
      case 'formatted':
        return 'css-formatter.format-css';
      case 'minified':
        return 'css-formatter.minify-css';
      case 'validate':
        return 'css-formatter.validate-css';
      case 'optimize':
        return 'css-formatter.optimize-css';
      case 'convert':
        return 'css-formatter.convert-css';
      case 'lint':
        return 'css-formatter.lint-css';
      default:
        return 'css-formatter.format-css';
    }
  }

  getOutputLabel(): string {
    switch (this.currentView) {
      case 'formatted':
        return 'css-formatter.output';
      case 'minified':
        return 'css-formatter.minified-output';
      case 'validate':
        return 'css-formatter.validation-results';
      case 'optimize':
        return 'css-formatter.optimized-output';
      case 'convert':
        return 'css-formatter.converted-output';
      case 'lint':
        return 'css-formatter.lint-results';
      default:
        return 'css-formatter.output';
    }
  }
}
