import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/common';

export interface ValidationResult {
  isValid: boolean;
  score: number;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  recommendations: ValidationIssue[];
}

export interface ValidationIssue {
  type: 'image' | 'heading' | 'eeat' | 'accessibility';
  severity: 'error' | 'warning' | 'recommendation';
  message: string;
  element?: HTMLElement;
  file?: string;
  line?: number;
}

@Injectable({
  providedIn: 'root',
})
export class SEOValidationService {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {}

  /**
   * Run comprehensive SEO validation
   */
  validate(): ValidationResult {
    if (!isPlatformBrowser(this.platformId)) {
      return {
        isValid: true,
        score: 100,
        errors: [],
        warnings: [],
        recommendations: [],
      };
    }

    const errors: ValidationIssue[] = [];
    const warnings: ValidationIssue[] = [];
    const recommendations: ValidationIssue[] = [];

    // Validate images
    this.validateImages(errors, warnings, recommendations);

    // Validate headings
    this.validateHeadings(errors, warnings, recommendations);

    // Validate E-E-A-T signals
    this.validateEEAT(errors, warnings, recommendations);

    // Calculate score
    const totalIssues = errors.length + warnings.length + recommendations.length;
    const errorWeight = errors.length * 10;
    const warningWeight = warnings.length * 5;
    const recommendationWeight = recommendations.length * 2;
    const totalPenalty = errorWeight + warningWeight + recommendationWeight;
    const score = Math.max(0, 100 - totalPenalty);

    return {
      isValid: errors.length === 0,
      score: Math.round(score),
      errors,
      warnings,
      recommendations,
    };
  }

  /**
   * Validate image alt text
   */
  private validateImages(
    errors: ValidationIssue[],
    warnings: ValidationIssue[],
    recommendations: ValidationIssue[]
  ): void {
    const images = this.document.querySelectorAll<HTMLImageElement>('img');

    if (images.length === 0) {
      recommendations.push({
        type: 'image',
        severity: 'recommendation',
        message: 'Consider adding relevant images to improve user engagement',
      });
      return;
    }

    let imagesWithoutAlt = 0;
    let imagesWithEmptyAlt = 0;
    let imagesWithShortAlt = 0;

    images.forEach((img, index) => {
      const alt = img.getAttribute('alt');

      if (alt === null) {
        imagesWithoutAlt++;
        errors.push({
          type: 'image',
          severity: 'error',
          message: `Image missing alt attribute (required for accessibility and SEO)`,
          element: img,
        });
      } else if (alt.trim() === '') {
        imagesWithEmptyAlt++;
        warnings.push({
          type: 'image',
          severity: 'warning',
          message: `Image has empty alt attribute. Use alt="" for decorative images only`,
          element: img,
        });
      } else if (alt.length < 5) {
        imagesWithShortAlt++;
        warnings.push({
          type: 'image',
          severity: 'warning',
          message: `Image alt text too short (${alt.length} chars). Recommended minimum: 5 characters`,
          element: img,
        });
      }

      // Check for lazy loading
      if (!img.loading && img.src && !img.src.includes('data:')) {
        recommendations.push({
          type: 'image',
          severity: 'recommendation',
          message: `Consider adding loading="lazy" to images below the fold`,
          element: img,
        });
      }
    });

    // Summary recommendations
    if (imagesWithoutAlt === 0 && imagesWithEmptyAlt === 0 && imagesWithShortAlt === 0) {
      recommendations.push({
        type: 'image',
        severity: 'recommendation',
        message: `All ${images.length} images have proper alt text - excellent!`,
      });
    }
  }

  /**
   * Validate heading structure
   */
  private validateHeadings(
    errors: ValidationIssue[],
    warnings: ValidationIssue[],
    recommendations: ValidationIssue[]
  ): void {
    const headings = Array.from(
      this.document.querySelectorAll<HTMLHeadingElement>('h1, h2, h3, h4, h5, h6')
    );

    if (headings.length === 0) {
      errors.push({
        type: 'heading',
        severity: 'error',
        message: 'No headings found on the page (required for SEO)',
      });
      return;
    }

    // Count H1 headings
    const h1Headings = headings.filter(h => h.tagName === 'H1');
    const h1Count = h1Headings.length;

    if (h1Count === 0) {
      errors.push({
        type: 'heading',
        severity: 'error',
        message: 'No H1 heading found (required for SEO)',
      });
    } else if (h1Count > 1) {
      warnings.push({
        type: 'heading',
        severity: 'warning',
        message: `Multiple H1 headings found (${h1Count}). Consider using only one H1 per page`,
      });
    }

    // Validate H1 content
    if (h1Count === 1) {
      const h1 = h1Headings[0];
      const h1Text = h1.textContent?.trim() || '';

      if (h1Text.length < 10) {
        warnings.push({
          type: 'heading',
          severity: 'warning',
          message: `H1 heading too short (${h1Text.length} chars). Recommended minimum: 10 characters`,
          element: h1,
        });
      }

      if (h1Text.length > 100) {
        warnings.push({
          type: 'heading',
          severity: 'warning',
          message: `H1 heading too long (${h1Text.length} chars). Recommended maximum: 100 characters`,
          element: h1,
        });
      }
    }

    // Check heading hierarchy
    let previousLevel = 0;
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));

      if (index === 0 && level !== 1) {
        warnings.push({
          type: 'heading',
          severity: 'warning',
          message: `First heading is ${heading.tagName} instead of H1`,
          element: heading,
        });
      }

      if (index > 0 && level > previousLevel + 1) {
        warnings.push({
          type: 'heading',
          severity: 'warning',
          message: `Heading hierarchy jump: ${heading.tagName} follows H${previousLevel} (should not skip levels)`,
          element: heading,
        });
      }

      previousLevel = level;
    });

    // Summary recommendation
    if (h1Count === 1 && headings.length > 0) {
      recommendations.push({
        type: 'heading',
        severity: 'recommendation',
        message: `Heading structure looks good: ${headings.length} headings with proper hierarchy`,
      });
    }
  }

  /**
   * Validate E-E-A-T signals
   */
  private validateEEAT(
    errors: ValidationIssue[],
    warnings: ValidationIssue[],
    recommendations: ValidationIssue[]
  ): void {
    // Check for author meta tag
    const authorMeta = this.document.querySelector('meta[name="author"]');
    if (!authorMeta) {
      warnings.push({
        type: 'eeat',
        severity: 'warning',
        message: 'Author meta tag missing (important for E-E-A-T - Expertise, Authoritativeness)',
      });
    }

    // Check for date information
    const dateMeta = this.document.querySelector(
      'meta[name="date"], meta[property="article:published_time"]'
    );
    if (!dateMeta) {
      warnings.push({
        type: 'eeat',
        severity: 'warning',
        message: 'Date published meta tag missing (important for E-E-A-T - Trustworthiness)',
      });
    }

    // Check for contact information
    const contactMeta = this.document.querySelector('meta[name="contact"]');
    const contactLinks = this.document.querySelectorAll(
      'a[href*="mailto:"], a[href*="tel:"], a[href*="/contact"]'
    );

    if (!contactMeta && contactLinks.length === 0) {
      warnings.push({
        type: 'eeat',
        severity: 'warning',
        message: 'Contact information not found (important for E-E-A-T - Trustworthiness)',
      });
    }

    // Check for privacy policy link
    const privacyLink = this.document.querySelector('a[href*="privacy"], a[href*="Privacy"]');
    if (!privacyLink) {
      warnings.push({
        type: 'eeat',
        severity: 'warning',
        message: 'Privacy policy link not found (important for E-E-A-T - Trustworthiness)',
      });
    }

    // Check for terms of service link
    const termsLink = this.document.querySelector('a[href*="terms"], a[href*="Terms"]');
    if (!termsLink) {
      warnings.push({
        type: 'eeat',
        severity: 'warning',
        message: 'Terms of service link not found (important for E-E-A-T - Trustworthiness)',
      });
    }

    // Check for structured data
    const structuredDataScripts = this.document.querySelectorAll(
      'script[type="application/ld+json"]'
    );
    if (structuredDataScripts.length === 0) {
      warnings.push({
        type: 'eeat',
        severity: 'warning',
        message: 'No structured data (JSON-LD) found (important for E-E-A-T and rich results)',
      });
    } else {
      let hasAuthorSchema = false;
      structuredDataScripts.forEach(script => {
        try {
          const data = JSON.parse(script.textContent || '');
          if (
            data.author ||
            data.publisher ||
            data['@type'] === 'Person' ||
            data['@type'] === 'Organization'
          ) {
            hasAuthorSchema = true;
          }
        } catch (e) {
          // Ignore parse errors
        }
      });

      if (!hasAuthorSchema) {
        recommendations.push({
          type: 'eeat',
          severity: 'recommendation',
          message: 'Consider adding author or publisher information to structured data',
        });
      }
    }

    // Summary
    const eeatIssues = warnings.filter(w => w.type === 'eeat').length;
    if (eeatIssues === 0) {
      recommendations.push({
        type: 'eeat',
        severity: 'recommendation',
        message: 'E-E-A-T signals are well implemented!',
      });
    }
  }

  /**
   * Get validation report as formatted string
   */
  getValidationReport(): string {
    const result = this.validate();

    let report = '\n=== SEO VALIDATION REPORT ===\n\n';
    report += `Overall Score: ${result.score}%\n`;
    report += `Status: ${result.isValid ? '✅ PASS' : '❌ FAIL'}\n\n`;

    if (result.errors.length > 0) {
      report += `ERRORS (${result.errors.length}):\n`;
      result.errors.forEach((error, index) => {
        report += `  ${index + 1}. [${error.type.toUpperCase()}] ${error.message}\n`;
      });
      report += '\n';
    }

    if (result.warnings.length > 0) {
      report += `WARNINGS (${result.warnings.length}):\n`;
      result.warnings.forEach((warning, index) => {
        report += `  ${index + 1}. [${warning.type.toUpperCase()}] ${warning.message}\n`;
      });
      report += '\n';
    }

    if (result.recommendations.length > 0) {
      report += `RECOMMENDATIONS (${result.recommendations.length}):\n`;
      result.recommendations.forEach((rec, index) => {
        report += `  ${index + 1}. [${rec.type.toUpperCase()}] ${rec.message}\n`;
      });
      report += '\n';
    }

    return report;
  }

  /**
   * Log validation report to console
   */
  logValidationReport(): void {
    if (isPlatformBrowser(this.platformId)) {
      console.log(this.getValidationReport());
    }
  }
}
