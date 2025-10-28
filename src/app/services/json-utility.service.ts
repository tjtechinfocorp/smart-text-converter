import { Injectable } from '@angular/core';

export interface JsonValidationResult {
  isValid: boolean;
  errors: JsonError[];
  warnings: JsonWarning[];
}

export interface JsonError {
  message: string;
  line?: number;
  column?: number;
  position?: number;
  severity: 'error' | 'warning';
}

export interface JsonWarning {
  message: string;
  line?: number;
  column?: number;
  position?: number;
  severity: 'warning';
}

export interface JsonFormatOptions {
  indentSize: number;
  sortKeys: boolean;
  removeComments: boolean;
  compact: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class JsonUtilityService {
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private readonly MAX_PREVIEW_SIZE = 1000; // 1000 characters for preview

  /**
   * Validate JSON string
   */
  validateJson(jsonString: string): JsonValidationResult {
    const result: JsonValidationResult = {
      isValid: false,
      errors: [],
      warnings: [],
    };

    if (!jsonString || jsonString.trim() === '') {
      result.errors.push({
        message: 'JSON input is empty',
        severity: 'error',
      });
      return result;
    }

    try {
      JSON.parse(jsonString);
      result.isValid = true;

      // Add warnings for common issues
      this.addWarnings(jsonString, result);
    } catch (error: any) {
      result.errors.push({
        message: error.message,
        line: this.extractLineNumber(error.message),
        column: this.extractColumnNumber(error.message),
        severity: 'error',
      });
    }

    return result;
  }

  /**
   * Format JSON with pretty print
   */
  formatJson(
    jsonString: string,
    options: JsonFormatOptions = {
      indentSize: 2,
      sortKeys: false,
      removeComments: false,
      compact: false,
    }
  ): string {
    try {
      const parsed = JSON.parse(jsonString);

      if (options.compact) {
        return JSON.stringify(parsed);
      }

      // Create a replacer function for sorting keys
      const replacer = options.sortKeys ? this.createKeySorter() : undefined;

      return JSON.stringify(parsed, replacer, options.indentSize);
    } catch (error) {
      throw new Error('Invalid JSON: ' + (error as Error).message);
    }
  }

  /**
   * Create a key sorter function for JSON.stringify
   */
  private createKeySorter(): (key: string, value: any) => any {
    return (key: string, value: any) => {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        // Sort object keys alphabetically
        const sortedKeys = Object.keys(value).sort();
        const sortedObject: any = {};
        for (const sortedKey of sortedKeys) {
          sortedObject[sortedKey] = value[sortedKey];
        }
        return sortedObject;
      }
      return value;
    };
  }

  /**
   * Minify JSON (remove whitespace)
   */
  minifyJson(jsonString: string): string {
    try {
      const parsed = JSON.parse(jsonString);
      return JSON.stringify(parsed);
    } catch (error) {
      throw new Error('Invalid JSON: ' + (error as Error).message);
    }
  }

  /**
   * Get JSON statistics
   */
  getJsonStats(jsonString: string): {
    size: number;
    lines: number;
    depth: number;
    keys: number;
    values: number;
  } {
    try {
      const parsed = JSON.parse(jsonString);
      const stats = {
        size: jsonString.length,
        lines: jsonString.split('\n').length,
        depth: this.calculateDepth(parsed),
        keys: this.countKeys(parsed),
        values: this.countValues(parsed),
      };
      return stats;
    } catch (error) {
      return {
        size: jsonString.length,
        lines: jsonString.split('\n').length,
        depth: 0,
        keys: 0,
        values: 0,
      };
    }
  }

  /**
   * Generate preview of large JSON
   */
  generatePreview(jsonString: string, maxLength: number = this.MAX_PREVIEW_SIZE): string {
    if (jsonString.length <= maxLength) {
      return jsonString;
    }

    try {
      const parsed = JSON.parse(jsonString);
      const preview = JSON.stringify(parsed, null, 2);

      if (preview.length <= maxLength) {
        return preview;
      }

      // Truncate and add ellipsis
      return preview.substring(0, maxLength - 3) + '...';
    } catch (error) {
      return jsonString.substring(0, maxLength - 3) + '...';
    }
  }

  /**
   * Check if JSON is too large for processing
   */
  isJsonTooLarge(jsonString: string): boolean {
    return jsonString.length > this.MAX_FILE_SIZE;
  }

  /**
   * Extract line number from error message
   */
  private extractLineNumber(message: string): number | undefined {
    const match = message.match(/line (\d+)/i);
    return match ? parseInt(match[1], 10) : undefined;
  }

  /**
   * Extract column number from error message
   */
  private extractColumnNumber(message: string): number | undefined {
    const match = message.match(/column (\d+)/i);
    return match ? parseInt(match[1], 10) : undefined;
  }

  /**
   * Add warnings for common JSON issues
   */
  private addWarnings(jsonString: string, result: JsonValidationResult): void {
    // Check for trailing commas
    if (jsonString.includes(',}') || jsonString.includes(',]')) {
      result.warnings.push({
        message: 'Trailing commas detected (not valid in JSON)',
        severity: 'warning',
      });
    }

    // Check for single quotes
    if (jsonString.includes("'")) {
      result.warnings.push({
        message: 'Single quotes detected (use double quotes in JSON)',
        severity: 'warning',
      });
    }

    // Check for comments
    if (jsonString.includes('//') || jsonString.includes('/*')) {
      result.warnings.push({
        message: 'Comments detected (not valid in JSON)',
        severity: 'warning',
      });
    }

    // Check for undefined values
    if (jsonString.includes('undefined')) {
      result.warnings.push({
        message: 'Undefined values detected (use null instead)',
        severity: 'warning',
      });
    }
  }

  /**
   * Calculate maximum depth of JSON object
   */
  private calculateDepth(obj: any, currentDepth: number = 0): number {
    if (typeof obj !== 'object' || obj === null) {
      return currentDepth;
    }

    let maxDepth = currentDepth;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const depth = this.calculateDepth(obj[key], currentDepth + 1);
        maxDepth = Math.max(maxDepth, depth);
      }
    }

    return maxDepth;
  }

  /**
   * Count total number of keys in JSON object
   */
  private countKeys(obj: any): number {
    if (typeof obj !== 'object' || obj === null) {
      return 0;
    }

    let count = 0;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        count++;
        count += this.countKeys(obj[key]);
      }
    }

    return count;
  }

  /**
   * Count total number of values in JSON object
   */
  private countValues(obj: any): number {
    if (typeof obj !== 'object' || obj === null) {
      return 1;
    }

    if (Array.isArray(obj)) {
      let count = 0;
      for (const item of obj) {
        count += this.countValues(item);
      }
      return count;
    }

    let count = 0;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        count += this.countValues(obj[key]);
      }
    }

    return count;
  }
}
