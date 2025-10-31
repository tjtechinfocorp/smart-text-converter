import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslatedTextComponent } from '../translated-text/translated-text.component';
import { SEOService } from '../../services/seo.service';

interface SqlFormatOptions {
  indentSize: number;
  indentType: 'spaces' | 'tabs';
  keywordCase: 'upper' | 'lower' | 'capitalize';
  functionCase: 'upper' | 'lower' | 'capitalize';
  dataTypeCase: 'upper' | 'lower' | 'capitalize';
  preserveComments: boolean;
  alignColumns: boolean;
  maxLineLength: number;
  addSemicolon: boolean;
  removeExtraSpaces: boolean;
}

@Component({
  selector: 'app-sql-formatter',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslatedTextComponent],
  templateUrl: './sql-formatter.component.html',
  styleUrls: ['./sql-formatter.component.scss'],
})
export class SqlFormatterComponent implements OnInit {
  inputText: string = '';
  outputText: string = '';
  isProcessing: boolean = false;
  sqlError: string = '';
  errors: string[] = [];
  warnings: string[] = [];
  currentView: 'formatted' | 'minified' | 'validate' | 'optimize' | 'convert' | 'lint' =
    'formatted';

  formatOptions: SqlFormatOptions = {
    indentSize: 2,
    indentType: 'spaces',
    keywordCase: 'upper',
    functionCase: 'upper',
    dataTypeCase: 'upper',
    preserveComments: true,
    alignColumns: true,
    maxLineLength: 80,
    addSemicolon: true,
    removeExtraSpaces: true,
  };

  statistics = {
    originalLength: 0,
    formattedLength: 0,
    lines: 0,
    statements: 0,
    tables: 0,
    columns: 0,
    joins: 0,
    functions: 0,
    comments: 0,
    compression: 0,
    errors: 0,
    warnings: 0,
  };

  constructor(
    private seoService: SEOService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.setSEO();
    this.addStructuredData();
  }

  private setSEO(): void {
    this.seoService.setTitle(
      'SQL Formatter — Free Online SQL Beautifier & Minifier | SmartTextConverter'
    );
    this.seoService.setMetaDescription(
      'Professional SQL formatter, beautifier, minifier, and validator. Format SQL queries with syntax highlighting and error detection. Free online SQL formatter.'
    );
    this.seoService.setMetaKeywords(
      'sql formatter, sql beautifier, sql minifier, sql validator, sql optimizer, sql linter, sql prettifier, sql code formatter, sql beautify, sql minify, sql validate, sql tools, sql development, sql editor, sql syntax, sql formatting, sql optimization, sql compression, sql tools online, free sql formatter, sql code editor, sql development tools'
    );
    this.seoService.setCanonicalURL('https://smarttextconverter.com/sql/formatter');

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
  }

  private addStructuredData(): void {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'SQL Formatter - Free Online SQL Beautifier & Minifier',
      description:
        'Professional SQL formatter, beautifier, minifier, and validator. Format SQL queries with syntax highlighting, error detection, and optimization tools.',
      url: 'https://smarttextconverter.com/sql/formatter',
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
        'SQL Query Formatting',
        'SQL Beautification',
        'SQL Minification',
        'SQL Validation',
        'SQL Optimization',
        'SQL Linting',
        'Syntax Highlighting',
        'Error Detection',
        'Multi-language Support',
        'Free Online Tool',
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.7',
        ratingCount: '580',
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
    this.currentView = view as
      | 'formatted'
      | 'minified'
      | 'validate'
      | 'optimize'
      | 'convert'
      | 'lint';
    if (this.inputText.trim()) {
      this.processSQL();
    }
  }

  loadSample(): void {
    this.inputText = `-- Complex SQL Query with Multiple Joins and Subqueries
SELECT
    u.id,
    u.username,
    u.email,
    u.created_at,
    COUNT(p.id) as post_count,
    AVG(p.rating) as avg_rating,
    MAX(p.created_at) as last_post_date,
    c.name as category_name,
    CASE
        WHEN COUNT(p.id) > 10 THEN 'Power User'
        WHEN COUNT(p.id) > 5 THEN 'Active User'
        ELSE 'Regular User'
    END as user_type
FROM users u
    INNER JOIN posts p ON u.id = p.user_id
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN (
        SELECT
            user_id,
            COUNT(*) as comment_count
        FROM comments
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY user_id
    ) comment_stats ON u.id = comment_stats.user_id
WHERE
    u.active = 1
    AND u.email_verified = 1
    AND p.published = 1
    AND p.created_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR)
    AND (c.name IS NOT NULL OR p.category_id IS NULL)
GROUP BY
    u.id, u.username, u.email, u.created_at, c.name
HAVING
    COUNT(p.id) > 0
    AND AVG(p.rating) >= 3.0
ORDER BY
    post_count DESC,
    avg_rating DESC,
    last_post_date DESC
LIMIT 50
OFFSET 0;`;
    this.processSQL();
  }

  clearInput(): void {
    this.inputText = '';
    this.outputText = '';
    this.sqlError = '';
    this.errors = [];
    this.warnings = [];
    this.updateStatistics();
  }

  clearOutput(): void {
    this.outputText = '';
  }

  updateFormatOptions(): void {
    if (this.inputText.trim()) {
      this.processSQL();
    }
  }

  processSQL(): void {
    if (!this.inputText.trim()) {
      this.outputText = '';
      this.updateStatistics();
      return;
    }

    this.isProcessing = true;
    this.errors = [];
    this.warnings = [];

    try {
      switch (this.currentView) {
        case 'formatted':
          this.outputText = this.formatSQL(this.inputText);
          break;
        case 'minified':
          this.outputText = this.minifySQL(this.inputText);
          break;
        case 'validate':
          this.outputText = this.validateSQL(this.inputText);
          break;
        case 'optimize':
          this.outputText = this.optimizeSQL(this.inputText);
          break;
        case 'convert':
          this.outputText = this.convertSQL(this.inputText);
          break;
        case 'lint':
          this.outputText = this.lintSQL(this.inputText);
          break;
      }
    } catch (error) {
      this.sqlError = 'Error processing SQL: ' + (error as Error).message;
      this.errors.push(this.sqlError);
    } finally {
      this.isProcessing = false;
      this.updateStatistics();
    }
  }

  formatSQL(sql: string): string {
    if (!sql.trim()) return '';

    // First, normalize the input
    let formatted = sql.trim();

    // Remove extra whitespace but preserve intentional line breaks
    if (this.formatOptions.removeExtraSpaces) {
      formatted = formatted.replace(/[ \t]+/g, ' ').replace(/\n\s*\n/g, '\n');
    }

    // Apply case formatting to keywords, functions, and data types
    formatted = this.applyCaseFormatting(formatted);

    // Now apply professional formatting with proper structure
    return this.applyProfessionalFormatting(formatted);
  }

  private applyCaseFormatting(sql: string): string {
    let formatted = sql;

    // SQL Keywords
    const keywords = [
      'SELECT',
      'FROM',
      'WHERE',
      'JOIN',
      'INNER JOIN',
      'LEFT JOIN',
      'RIGHT JOIN',
      'FULL JOIN',
      'CROSS JOIN',
      'OUTER JOIN',
      'ORDER BY',
      'GROUP BY',
      'HAVING',
      'LIMIT',
      'OFFSET',
      'INSERT',
      'UPDATE',
      'DELETE',
      'CREATE',
      'ALTER',
      'DROP',
      'TRUNCATE',
      'REPLACE',
      'UNION',
      'UNION ALL',
      'INTERSECT',
      'EXCEPT',
      'WITH',
      'AS',
      'ON',
      'USING',
      'AND',
      'OR',
      'NOT',
      'IN',
      'EXISTS',
      'BETWEEN',
      'LIKE',
      'ILIKE',
      'IS',
      'IS NOT',
      'NULL',
      'TRUE',
      'FALSE',
      'CASE',
      'WHEN',
      'THEN',
      'ELSE',
      'END',
      'IF',
      'ELSEIF',
      'BEGIN',
      'LOOP',
      'WHILE',
      'FOR',
      'FOREACH',
      'DECLARE',
      'SET',
      'CALL',
      'EXEC',
      'EXECUTE',
      'PROCEDURE',
      'FUNCTION',
      'TRIGGER',
      'INDEX',
      'VIEW',
      'TABLE',
      'DATABASE',
      'SCHEMA',
      'CONSTRAINT',
      'PRIMARY KEY',
      'FOREIGN KEY',
      'UNIQUE',
      'CHECK',
      'DEFAULT',
      'NOT NULL',
      'AUTO_INCREMENT',
      'SERIAL',
      'IDENTITY',
      'COMMIT',
      'ROLLBACK',
      'TRANSACTION',
      'SAVEPOINT',
      'GRANT',
      'REVOKE',
      'DENY',
    ];

    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      if (this.formatOptions.keywordCase === 'upper') {
        formatted = formatted.replace(regex, keyword.toUpperCase());
      } else if (this.formatOptions.keywordCase === 'lower') {
        formatted = formatted.replace(regex, keyword.toLowerCase());
      } else if (this.formatOptions.keywordCase === 'capitalize') {
        formatted = formatted.replace(
          regex,
          keyword.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
        );
      }
    });

    // SQL Functions
    const functions = [
      'COUNT',
      'SUM',
      'AVG',
      'MIN',
      'MAX',
      'DISTINCT',
      'COALESCE',
      'NULLIF',
      'CAST',
      'CONVERT',
      'SUBSTRING',
      'LEFT',
      'RIGHT',
      'LENGTH',
      'UPPER',
      'LOWER',
      'TRIM',
      'LTRIM',
      'RTRIM',
      'REPLACE',
      'CONCAT',
      'CONCAT_WS',
      'SPLIT_PART',
      'POSITION',
      'CHAR_LENGTH',
      'OCTET_LENGTH',
      'ASCII',
      'CHR',
      'REPEAT',
      'REVERSE',
      'TRANSLATE',
      'REGEXP_REPLACE',
      'REGEXP_MATCH',
      'REGEXP_SPLIT',
      'TO_CHAR',
      'TO_DATE',
      'TO_NUMBER',
      'EXTRACT',
      'DATE_PART',
      'DATE_TRUNC',
      'NOW',
      'CURRENT_DATE',
      'CURRENT_TIME',
      'CURRENT_TIMESTAMP',
      'LOCALTIME',
      'LOCALTIMESTAMP',
      'ROUND',
      'FLOOR',
      'CEIL',
      'CEILING',
      'ABS',
      'SIGN',
      'MOD',
      'POWER',
      'SQRT',
      'EXP',
      'LN',
      'LOG',
      'LOG10',
      'SIN',
      'COS',
      'TAN',
      'ASIN',
      'ACOS',
      'ATAN',
      'ATAN2',
      'DEGREES',
      'RADIANS',
      'RANDOM',
      'RAND',
      'PI',
      'E',
      'ROW_NUMBER',
      'RANK',
      'DENSE_RANK',
      'LAG',
      'LEAD',
      'FIRST_VALUE',
      'LAST_VALUE',
      'NTH_VALUE',
      'PERCENT_RANK',
      'CUME_DIST',
      'NTILE',
    ];

    functions.forEach(func => {
      const regex = new RegExp(`\\b${func}\\b`, 'gi');
      if (this.formatOptions.functionCase === 'upper') {
        formatted = formatted.replace(regex, func.toUpperCase());
      } else if (this.formatOptions.functionCase === 'lower') {
        formatted = formatted.replace(regex, func.toLowerCase());
      } else if (this.formatOptions.functionCase === 'capitalize') {
        formatted = formatted.replace(
          regex,
          func.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
        );
      }
    });

    // Data Types
    const dataTypes = [
      'INT',
      'INTEGER',
      'BIGINT',
      'SMALLINT',
      'TINYINT',
      'DECIMAL',
      'NUMERIC',
      'FLOAT',
      'DOUBLE',
      'REAL',
      'CHAR',
      'VARCHAR',
      'TEXT',
      'CLOB',
      'BLOB',
      'BINARY',
      'VARBINARY',
      'DATE',
      'TIME',
      'TIMESTAMP',
      'DATETIME',
      'YEAR',
      'BOOLEAN',
      'BIT',
      'JSON',
      'XML',
      'UUID',
      'ARRAY',
      'RECORD',
      'ROW',
      'INTERVAL',
      'ENUM',
      'SET',
      'GEOMETRY',
      'POINT',
      'LINESTRING',
      'POLYGON',
      'MULTIPOINT',
      'MULTILINESTRING',
      'MULTIPOLYGON',
    ];

    dataTypes.forEach(type => {
      const regex = new RegExp(`\\b${type}\\b`, 'gi');
      if (this.formatOptions.dataTypeCase === 'upper') {
        formatted = formatted.replace(regex, type.toUpperCase());
      } else if (this.formatOptions.dataTypeCase === 'lower') {
        formatted = formatted.replace(regex, type.toLowerCase());
      } else if (this.formatOptions.dataTypeCase === 'capitalize') {
        formatted = formatted.replace(
          regex,
          type.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
        );
      }
    });

    return formatted;
  }

  private applyProfessionalFormatting(sql: string): string {
    const indent =
      this.formatOptions.indentType === 'tabs' ? '\t' : ' '.repeat(this.formatOptions.indentSize);
    const maxLineLength = this.formatOptions.maxLineLength;

    // Handle comment preservation
    if (!this.formatOptions.preserveComments) {
      sql = this.removeComments(sql);
    }

    // Split into tokens for better parsing
    const tokens = this.tokenizeSQL(sql);
    const formattedLines: string[] = [];
    let currentLine = '';
    let indentLevel = 0;
    let inSelectList = false;
    let inFromClause = false;
    let inWhereClause = false;
    let inJoinClause = false;
    let inGroupByClause = false;
    let inOrderByClause = false;
    let inHavingClause = false;
    let inCaseStatement = false;
    let inSubquery = false;
    let subqueryLevel = 0;
    let selectColumns: string[] = [];
    let maxColumnLength = 0;

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      const upperToken = token.toUpperCase();

      // Handle comments
      if (token.startsWith('--') || token.startsWith('/*')) {
        if (currentLine.trim()) {
          formattedLines.push(currentLine.trim());
          currentLine = '';
        }
        formattedLines.push(token);
        continue;
      }

      // Handle major SQL clauses
      if (upperToken === 'SELECT') {
        if (currentLine.trim()) {
          formattedLines.push(currentLine.trim());
        }
        currentLine = token;
        inSelectList = true;
        inFromClause = false;
        inWhereClause = false;
        inJoinClause = false;
        inGroupByClause = false;
        inOrderByClause = false;
        inHavingClause = false;
        continue;
      }

      if (upperToken === 'FROM') {
        // Handle end of SELECT list with column alignment
        if (inSelectList && selectColumns.length > 0) {
          const lastColumn = currentLine.trim();
          if (lastColumn) {
            selectColumns.push(lastColumn);
          }

          if (this.formatOptions.alignColumns && selectColumns.length > 1) {
            const alignedColumns = this.alignColumns(selectColumns, indent);
            formattedLines.push(alignedColumns.join(',\n' + indent + '  '));
          } else {
            formattedLines.push(currentLine.trim());
          }
          selectColumns = [];
        } else if (currentLine.trim()) {
          formattedLines.push(currentLine.trim());
        }

        currentLine = indent + token;
        inSelectList = false;
        inFromClause = true;
        inWhereClause = false;
        inJoinClause = false;
        continue;
      }

      if (upperToken.match(/^(INNER|LEFT|RIGHT|FULL|CROSS|OUTER)\s+JOIN$/)) {
        if (currentLine.trim()) {
          formattedLines.push(currentLine.trim());
        }
        currentLine = indent + token;
        inJoinClause = true;
        inFromClause = false;
        inWhereClause = false;
        continue;
      }

      if (upperToken === 'WHERE') {
        if (currentLine.trim()) {
          formattedLines.push(currentLine.trim());
        }
        currentLine = indent + token;
        inWhereClause = true;
        inFromClause = false;
        inJoinClause = false;
        inGroupByClause = false;
        inOrderByClause = false;
        inHavingClause = false;
        continue;
      }

      if (upperToken === 'GROUP BY') {
        if (currentLine.trim()) {
          formattedLines.push(currentLine.trim());
        }
        currentLine = indent + token;
        inGroupByClause = true;
        inWhereClause = false;
        inJoinClause = false;
        inOrderByClause = false;
        inHavingClause = false;
        continue;
      }

      if (upperToken === 'HAVING') {
        if (currentLine.trim()) {
          formattedLines.push(currentLine.trim());
        }
        currentLine = indent + token;
        inHavingClause = true;
        inGroupByClause = false;
        inOrderByClause = false;
        continue;
      }

      if (upperToken === 'ORDER BY') {
        if (currentLine.trim()) {
          formattedLines.push(currentLine.trim());
        }
        currentLine = indent + token;
        inOrderByClause = true;
        inGroupByClause = false;
        inHavingClause = false;
        continue;
      }

      if (upperToken === 'LIMIT' || upperToken === 'OFFSET') {
        if (currentLine.trim()) {
          formattedLines.push(currentLine.trim());
        }
        currentLine = indent + token;
        inOrderByClause = false;
        continue;
      }

      // Handle AND/OR in WHERE clause
      if ((upperToken === 'AND' || upperToken === 'OR') && (inWhereClause || inHavingClause)) {
        if (currentLine.trim()) {
          formattedLines.push(currentLine.trim());
        }
        currentLine = indent + token;
        continue;
      }

      // Handle ON clause in JOINs
      if (upperToken === 'ON' && inJoinClause) {
        if (currentLine.trim()) {
          formattedLines.push(currentLine.trim());
        }
        currentLine = indent + indent + token;
        continue;
      }

      // Handle CASE statements
      if (upperToken === 'CASE') {
        inCaseStatement = true;
        currentLine += (currentLine ? ' ' : '') + token;
        continue;
      }

      if (upperToken === 'WHEN' && inCaseStatement) {
        if (currentLine.trim()) {
          formattedLines.push(currentLine.trim());
        }
        currentLine = indent + indent + token;
        continue;
      }

      if (upperToken === 'THEN' && inCaseStatement) {
        currentLine += ' ' + token;
        continue;
      }

      if (upperToken === 'ELSE' && inCaseStatement) {
        if (currentLine.trim()) {
          formattedLines.push(currentLine.trim());
        }
        currentLine = indent + indent + token;
        continue;
      }

      if (upperToken === 'END' && inCaseStatement) {
        currentLine += ' ' + token;
        inCaseStatement = false;
        continue;
      }

      // Handle subqueries
      if (token === '(') {
        subqueryLevel++;
        inSubquery = subqueryLevel > 0;
        currentLine += token;
        continue;
      }

      if (token === ')') {
        subqueryLevel--;
        inSubquery = subqueryLevel > 0;
        currentLine += token;
        continue;
      }

      // Handle commas in SELECT list
      if (token === ',' && inSelectList) {
        // Collect column for alignment
        const column = currentLine.trim();
        if (column) {
          selectColumns.push(column);
        }

        currentLine += token;
        if (currentLine.length > maxLineLength) {
          formattedLines.push(currentLine.trim());
          currentLine = indent + '  ';
        } else {
          currentLine += ' ';
        }
        continue;
      }

      // Handle commas in other contexts
      if (token === ',') {
        currentLine += token;
        if (currentLine.length > maxLineLength) {
          formattedLines.push(currentLine.trim());
          currentLine = indent + '  ';
        } else {
          currentLine += ' ';
        }
        continue;
      }

      // Add token to current line
      currentLine += (currentLine ? ' ' : '') + token;

      // Check if line is too long
      if (currentLine.length > maxLineLength && !inSubquery) {
        // Try to break at logical points
        const breakPoints = [',', ' AND ', ' OR ', ' ON ', ' WHERE ', ' GROUP BY ', ' ORDER BY '];
        let breakPoint = -1;

        for (const bp of breakPoints) {
          const index = currentLine.lastIndexOf(bp, maxLineLength);
          if (index > 0) {
            breakPoint = index;
            break;
          }
        }

        if (breakPoint > 0) {
          const firstPart = currentLine.substring(0, breakPoint).trim();
          const secondPart = currentLine.substring(breakPoint).trim();
          formattedLines.push(firstPart);
          currentLine = indent + '  ' + secondPart;
        }
      }
    }

    // Add the last line
    if (currentLine.trim()) {
      formattedLines.push(currentLine.trim());
    }

    // Add semicolon if needed
    if (
      this.formatOptions.addSemicolon &&
      !formattedLines[formattedLines.length - 1].endsWith(';')
    ) {
      formattedLines[formattedLines.length - 1] += ';';
    }

    return formattedLines.join('\n');
  }

  private tokenizeSQL(sql: string): string[] {
    const tokens: string[] = [];
    let currentToken = '';
    let inString = false;
    let stringChar = '';
    let inComment = false;
    let commentType = '';

    for (let i = 0; i < sql.length; i++) {
      const char = sql[i];
      const nextChar = sql[i + 1];

      // Handle comments
      if (!inString && !inComment) {
        if (char === '-' && nextChar === '-') {
          if (currentToken.trim()) {
            tokens.push(currentToken.trim());
            currentToken = '';
          }
          tokens.push(sql.substring(i));
          return tokens;
        }
        if (char === '/' && nextChar === '*') {
          if (currentToken.trim()) {
            tokens.push(currentToken.trim());
            currentToken = '';
          }
          inComment = true;
          commentType = '/*';
          continue;
        }
      }

      if (inComment) {
        if (commentType === '/*' && char === '*' && nextChar === '/') {
          tokens.push(sql.substring(sql.lastIndexOf('/*', i), i + 2));
          inComment = false;
          commentType = '';
          i++; // Skip the '/'
          continue;
        }
        continue;
      }

      // Handle strings
      if (!inString && (char === "'" || char === '"')) {
        inString = true;
        stringChar = char;
        currentToken += char;
        continue;
      }

      if (inString) {
        currentToken += char;
        if (char === stringChar && sql[i - 1] !== '\\') {
          inString = false;
          stringChar = '';
        }
        continue;
      }

      // Handle whitespace and special characters
      if (char === ' ' || char === '\t' || char === '\n' || char === '\r') {
        if (currentToken.trim()) {
          tokens.push(currentToken.trim());
          currentToken = '';
        }
        continue;
      }

      // Handle special characters that should be separate tokens
      if (['(', ')', ',', ';', '=', '<', '>', '!', '+', '-', '*', '/', '%'].includes(char)) {
        if (currentToken.trim()) {
          tokens.push(currentToken.trim());
          currentToken = '';
        }
        tokens.push(char);
        continue;
      }

      currentToken += char;
    }

    if (currentToken.trim()) {
      tokens.push(currentToken.trim());
    }

    return tokens;
  }

  private removeComments(sql: string): string {
    // Remove single-line comments (-- comment)
    sql = sql.replace(/--.*$/gm, '');

    // Remove multi-line comments (/* comment */)
    sql = sql.replace(/\/\*[\s\S]*?\*\//g, '');

    return sql;
  }

  private alignColumns(columns: string[], indent: string): string[] {
    if (!this.formatOptions.alignColumns || columns.length === 0) {
      return columns;
    }

    // Find the maximum length for alignment
    const maxLength = Math.max(...columns.map(col => col.length));

    return columns.map((column, index) => {
      if (index === columns.length - 1) {
        // Last column doesn't need trailing spaces
        return column;
      }
      return column + ' '.repeat(maxLength - column.length);
    });
  }

  private splitLongLine(line: string, maxLength: number, indent: string): string[] {
    const result: string[] = [];
    let currentLine = line;
    let indentLevel = 0;

    while (currentLine.length > maxLength) {
      // Find a good break point (comma, AND, OR, etc.)
      let breakPoint = -1;
      const breakChars = [',', ' AND ', ' OR ', ' AND\n', ' OR\n'];

      for (const char of breakChars) {
        const index = currentLine.lastIndexOf(char, maxLength);
        if (index > 0) {
          breakPoint = index + (char === ',' ? 1 : char.length);
          break;
        }
      }

      if (breakPoint === -1) {
        // Force break at maxLength
        breakPoint = maxLength;
      }

      result.push(indent.repeat(indentLevel) + currentLine.substring(0, breakPoint).trim());
      currentLine = currentLine.substring(breakPoint).trim();
      indentLevel = 1; // Indent continuation lines
    }

    if (currentLine.trim()) {
      result.push(indent.repeat(indentLevel) + currentLine.trim());
    }

    return result;
  }

  minifySQL(sql: string): string {
    if (!sql.trim()) return '';

    let minified = sql.trim();

    // Remove comments if preserveComments is false
    if (!this.formatOptions.preserveComments) {
      minified = minified.replace(/--.*$/gm, ''); // Single-line comments
      minified = minified.replace(/\/\*[\s\S]*?\*\//g, ''); // Multi-line comments
    }

    // Remove extra whitespace
    minified = minified.replace(/\s+/g, ' ');

    // Remove spaces around operators
    minified = minified.replace(/\s*([=<>!]+)\s*/g, '$1');
    minified = minified.replace(/\s*([+\-*/%])\s*/g, '$1');
    minified = minified.replace(/\s*([&|^])\s*/g, '$1');

    // Remove spaces around parentheses
    minified = minified.replace(/\s*\(\s*/g, '(');
    minified = minified.replace(/\s*\)\s*/g, ')');

    // Remove spaces around commas
    minified = minified.replace(/\s*,\s*/g, ',');

    // Remove spaces around semicolons
    minified = minified.replace(/\s*;\s*/g, ';');

    // Remove spaces around dots (for table.column references)
    minified = minified.replace(/\s*\.\s*/g, '.');

    // Remove leading/trailing whitespace
    minified = minified.trim();

    return minified;
  }

  validateSQL(sql: string): string {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Basic validation
    if (!sql.trim()) {
      errors.push('SQL query is empty');
    }

    // Check for common SQL syntax issues
    const openParens = (sql.match(/\(/g) || []).length;
    const closeParens = (sql.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      errors.push('Mismatched parentheses');
    }

    // Check for SELECT without FROM (basic check)
    if (sql.toUpperCase().includes('SELECT') && !sql.toUpperCase().includes('FROM')) {
      warnings.push('SELECT statement without FROM clause');
    }

    // Check for missing semicolon
    if (!sql.trim().endsWith(';')) {
      warnings.push('Missing semicolon at end of statement');
    }

    this.errors = errors;
    this.warnings = warnings;

    if (errors.length === 0 && warnings.length === 0) {
      return '✅ SQL syntax appears to be valid';
    } else {
      let result = '';
      if (errors.length > 0) {
        result += '❌ Errors:\n' + errors.map(e => `• ${e}`).join('\n') + '\n\n';
      }
      if (warnings.length > 0) {
        result += '⚠️ Warnings:\n' + warnings.map(w => `• ${w}`).join('\n');
      }
      return result;
    }
  }

  optimizeSQL(sql: string): string {
    // Basic optimization suggestions
    const suggestions: string[] = [];

    // Check for SELECT *
    if (sql.toUpperCase().includes('SELECT *')) {
      suggestions.push('Consider specifying column names instead of SELECT *');
    }

    // Check for missing indexes hints
    if (sql.toUpperCase().includes('WHERE') && !sql.toUpperCase().includes('INDEX')) {
      suggestions.push('Consider adding appropriate indexes for WHERE conditions');
    }

    // Check for ORDER BY without LIMIT
    if (sql.toUpperCase().includes('ORDER BY') && !sql.toUpperCase().includes('LIMIT')) {
      suggestions.push('Consider adding LIMIT clause with ORDER BY');
    }

    if (suggestions.length === 0) {
      return '✅ No obvious optimization opportunities found';
    } else {
      return '💡 Optimization Suggestions:\n' + suggestions.map(s => `• ${s}`).join('\n');
    }
  }

  convertSQL(sql: string): string {
    // Basic SQL dialect conversion (simplified)
    let converted = sql;

    // Convert MySQL to PostgreSQL (example)
    converted = converted.replace(/LIMIT\s+(\d+)/gi, 'LIMIT $1');
    converted = converted.replace(/AUTO_INCREMENT/gi, 'SERIAL');
    converted = converted.replace(/DATETIME/gi, 'TIMESTAMP');

    return converted;
  }

  lintSQL(sql: string): string {
    const issues: string[] = [];

    // Check for inconsistent case
    const hasUpper = /[A-Z]/.test(sql);
    const hasLower = /[a-z]/.test(sql);
    if (hasUpper && hasLower) {
      issues.push('Inconsistent case usage in keywords');
    }

    // Check for long lines
    const lines = sql.split('\n');
    lines.forEach((line, index) => {
      if (line.length > this.formatOptions.maxLineLength) {
        issues.push(
          `Line ${index + 1} exceeds maximum line length (${line.length} > ${
            this.formatOptions.maxLineLength
          })`
        );
      }
    });

    if (issues.length === 0) {
      return '✅ No linting issues found';
    } else {
      return '🔍 Linting Issues:\n' + issues.map(i => `• ${i}`).join('\n');
    }
  }

  copyOutput(): void {
    if (this.outputText) {
      navigator.clipboard.writeText(this.outputText).then(() => {
        // Could add a toast notification here
      });
    }
  }

  downloadOutput(): void {
    if (!isPlatformBrowser(this.platformId) || !this.outputText) {
      return;
    }

    const blob = new Blob([this.outputText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formatted_sql_${Date.now()}.sql`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  updateStatistics(): void {
    this.statistics.originalLength = this.inputText.length;
    this.statistics.formattedLength = this.outputText.length;
    this.statistics.lines = this.inputText.split('\n').length;
    this.statistics.statements = this.countSQLStatements(this.inputText);
    this.statistics.tables = this.countTables(this.inputText);
    this.statistics.columns = this.countColumns(this.inputText);
    this.statistics.joins = this.countJoins(this.inputText);
    this.statistics.functions = this.countFunctions(this.inputText);
    this.statistics.comments = this.countComments(this.inputText);
    this.statistics.compression = this.getCompression();
    this.statistics.errors = this.errors.length;
    this.statistics.warnings = this.warnings.length;
  }

  countSQLStatements(sql: string): number {
    return (sql.match(/;$/gm) || []).length;
  }

  countTables(sql: string): number {
    const fromMatches = sql.match(/FROM\s+(\w+)/gi) || [];
    const joinMatches = sql.match(/JOIN\s+(\w+)/gi) || [];
    return fromMatches.length + joinMatches.length;
  }

  countColumns(sql: string): number {
    const selectMatch = sql.match(/SELECT\s+(.*?)\s+FROM/gi);
    if (!selectMatch) return 0;
    return (selectMatch[0].match(/,/g) || []).length + 1;
  }

  countJoins(sql: string): number {
    return (sql.match(/JOIN/gi) || []).length;
  }

  countFunctions(sql: string): number {
    return (sql.match(/\w+\(/g) || []).length;
  }

  countComments(sql: string): number {
    return (sql.match(/--/g) || []).length + (sql.match(/\/\*/g) || []).length;
  }

  getCompression(): number {
    if (this.statistics.originalLength === 0) return 0;
    return Math.round(
      ((this.statistics.originalLength - this.statistics.formattedLength) /
        this.statistics.originalLength) *
        100
    );
  }

  getActionLabel(): string {
    switch (this.currentView) {
      case 'formatted':
        return 'format-sql';
      case 'minified':
        return 'minify-sql';
      case 'validate':
        return 'validate-sql';
      case 'optimize':
        return 'optimize-sql';
      case 'convert':
        return 'convert-sql';
      case 'lint':
        return 'lint-sql';
      default:
        return 'format-sql';
    }
  }
}
