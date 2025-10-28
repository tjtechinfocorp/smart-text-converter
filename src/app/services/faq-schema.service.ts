import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';
import { GoogleAnalyticsService } from './google-analytics.service';

export interface FAQItem {
  question: string;
  answer: string;
  internalLinks?: Array<{
    text: string;
    url: string;
    tooltip?: string;
  }>;
}

export interface FAQSchemaData {
  '@context': string;
  '@type': string;
  mainEntity: Array<{
    '@type': string;
    name: string;
    acceptedAnswer: {
      '@type': string;
      text: string;
      dateCreated?: string;
      author?: {
        '@type': string;
        name: string;
      };
    };
  }>;
}

@Injectable({
  providedIn: 'root',
})
export class FAQSchemaService {
  private faqData: { [key: string]: FAQItem[] } = {};

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private googleAnalytics: GoogleAnalyticsService
  ) {
    this.loadFAQData();
  }

  private loadFAQData(): void {
    // Case Converter FAQ
    this.faqData['case-converter'] = [
      {
        question: 'What is the difference between camelCase and PascalCase?',
        answer:
          'camelCase starts with a lowercase letter (e.g., "myVariable"), while PascalCase starts with an uppercase letter (e.g., "MyVariable"). Both capitalize the first letter of subsequent words. Learn more about <a href="/text-formatter" title="Text formatting tools">text formatting</a> and <a href="/text-analyzer" title="Text analysis tools">text analysis</a> tools.',
        internalLinks: [
          { text: 'text formatting', url: '/text-formatter', tooltip: 'Text formatting tools' },
          { text: 'text analysis', url: '/text-analyzer', tooltip: 'Text analysis tools' },
        ],
      },
      {
        question: 'How do I convert text to title case online?',
        answer:
          'To convert text to title case online, use our free Case Converter tool. Simply paste your text, select "Title Case", and get instant results. Title case capitalizes the first letter of each major word like "Hello World". Perfect for headings, titles, and proper formatting. No registration required.',
        internalLinks: [
          { text: 'Case Converter', url: '/case-converter', tooltip: 'Free online case converter' },
        ],
      },
      {
        question: 'Can I convert multiple lines of text at once?',
        answer:
          'Yes! Our Case Converter supports multi-line text conversion. Simply paste your text and all lines will be converted according to your selected case format. Perfect for processing documents, code, or lists. Try our <a href="/text-formatter" title="Text formatter tool">text formatter</a> for additional formatting options.',
        internalLinks: [
          { text: 'text formatter', url: '/text-formatter', tooltip: 'Text formatter tool' },
        ],
      },
      {
        question: 'What is snake_case and when should I use it?',
        answer:
          'snake_case uses underscores to separate words (e.g., "my_variable_name"). It\'s commonly used in Python programming, database naming conventions, and file naming. Our tool supports snake_case conversion along with other programming case styles. Essential for Python developers and database administrators.',
        internalLinks: [
          {
            text: 'programming case styles',
            url: '/case-converter',
            tooltip: 'Programming case conversion',
          },
        ],
      },
      {
        question: 'What is kebab-case and when should I use it?',
        answer:
          'kebab-case uses hyphens to separate words (e.g., "my-variable-name"). It\'s commonly used in URLs, CSS classes, HTML attributes, and command-line tools. Our converter handles kebab-case along with <a href="/text-formatter" title="Text formatting">text formatting</a> options.',
        internalLinks: [
          { text: 'text formatting', url: '/text-formatter', tooltip: 'Text formatting' },
        ],
      },
      {
        question: 'How does alternating case work?',
        answer:
          'Alternating case switches between uppercase and lowercase letters (e.g., "AlTeRnAtInG cAsE"). It\'s useful for creating unique text effects, testing case sensitivity, and social media formatting. Our tool provides instant alternating case conversion.',
        internalLinks: [
          { text: 'case conversion', url: '/case-converter', tooltip: 'Case conversion tools' },
        ],
      },
      {
        question: 'Can I convert text to inverse case?',
        answer:
          'Yes! Inverse case flips the case of each letter - uppercase becomes lowercase and vice versa. This is useful for testing case sensitivity in applications, creating text effects, and data processing. Our <a href="/text-analyzer" title="Text analyzer">text analyzer</a> can help analyze the results.',
        internalLinks: [{ text: 'text analyzer', url: '/text-analyzer', tooltip: 'Text analyzer' }],
      },
      {
        question: 'Is the case converter free to use?',
        answer:
          'Yes! Our Case Converter is completely free to use with no registration required. All text processing happens locally in your browser for maximum privacy and security. No data is stored or transmitted to our servers.',
        internalLinks: [
          { text: 'Case Converter', url: '/case-converter', tooltip: 'Free case converter tool' },
        ],
      },
    ];

    // Text Formatter FAQ
    this.faqData['text-formatter'] = [
      {
        question: 'How do I remove extra spaces from text online?',
        answer:
          'To remove extra spaces from text online, use our free Text Formatter tool. Select "Collapse Spaces" to remove multiple spaces and replace them with single spaces. Perfect for cleaning up copied text, documents, and code. Works instantly in your browser.',
        internalLinks: [
          { text: 'Text Formatter', url: '/text-formatter', tooltip: 'Free text formatting tool' },
        ],
      },
      {
        question: 'What is text normalization and why do I need it?',
        answer:
          'Text normalization standardizes text formatting by removing extra whitespace, normalizing line endings, and cleaning up formatting inconsistencies. It\'s essential for data processing, code formatting, and document preparation. Our <a href="/text-analyzer" title="Text analyzer">text analyzer</a> can help analyze the results.',
        internalLinks: [{ text: 'text analyzer', url: '/text-analyzer', tooltip: 'Text analyzer' }],
      },
      {
        question: 'Can I format text for different programming languages?',
        answer:
          'Yes! Our Text Formatter includes options for different programming languages and handles various indentation styles. Convert between tabs and spaces, normalize line endings, and format code for Python, JavaScript, Java, and more. Try our <a href="/case-converter" title="Case converter">case converter</a> for variable naming.',
        internalLinks: [
          { text: 'case converter', url: '/case-converter', tooltip: 'Case converter' },
        ],
      },
      {
        question: 'How do I fix inconsistent line breaks in text?',
        answer:
          'Use our Text Formatter to normalize line breaks instantly. Choose between Windows (CRLF), Unix (LF), or Mac (CR) line break styles, or remove all line breaks. Essential for cross-platform compatibility and code formatting.',
        internalLinks: [
          { text: 'Text Formatter', url: '/text-formatter', tooltip: 'Text formatting tool' },
        ],
      },
      {
        question: 'What is the difference between tabs and spaces in programming?',
        answer:
          'Tabs are single characters representing multiple spaces, while spaces are individual characters. Our tool converts between tabs and spaces while maintaining consistent indentation. Critical for code readability and team collaboration in programming projects.',
        internalLinks: [
          {
            text: 'programming projects',
            url: '/text-formatter',
            tooltip: 'Programming text formatting',
          },
        ],
      },
      {
        question: 'How do I trim whitespace from text?',
        answer:
          'Our Text Formatter removes leading and trailing whitespace instantly. Perfect for cleaning up copied text from websites, documents, and spreadsheets. Also try our <a href="/line-tools" title="Line tools">line tools</a> for processing line-by-line data.',
        internalLinks: [{ text: 'line tools', url: '/line-tools', tooltip: 'Line tools' }],
      },
      {
        question: 'How do I format text for better readability?',
        answer:
          'Our Text Formatter improves readability by adding proper spacing, normalizing punctuation, and formatting text for optimal display across devices. Essential for content creation, document preparation, and data presentation.',
        internalLinks: [
          {
            text: 'Text Formatter',
            url: '/text-formatter',
            tooltip: 'Text formatting for readability',
          },
        ],
      },
    ];

    // Encode/Decode FAQ
    this.faqData['encode-decode'] = [
      {
        question: 'What is URL encoding and why do I need it?',
        answer:
          'URL encoding converts special characters into percent-encoded format (like %20 for space) for safe transmission in URLs. Essential for web development, API communication, and handling user input. Our tool provides instant URL encoding and decoding.',
        internalLinks: [
          { text: 'URL encoding', url: '/encode-decode', tooltip: 'URL encoding tool' },
        ],
      },
      {
        question: 'What is Base64 encoding used for?',
        answer:
          'Base64 encoding converts binary data into ASCII text using 64 characters. Commonly used for email attachments, data transmission, API authentication, and storing binary data in text formats. Our <a href="/text-analyzer" title="Text analyzer">text analyzer</a> can help analyze encoded content.',
        internalLinks: [{ text: 'text analyzer', url: '/text-analyzer', tooltip: 'Text analyzer' }],
      },
      {
        question: 'How do I decode Base64 text online?',
        answer:
          'To decode Base64 text online, use our free Encode/Decode tool. Select "Base64 Decode", paste your encoded text, and get instant results. Perfect for decoding API responses, email attachments, and data files. No registration required.',
        internalLinks: [
          {
            text: 'Encode/Decode tool',
            url: '/encode-decode',
            tooltip: 'Free encoding/decoding tool',
          },
        ],
      },
      {
        question: 'What is HTML encoding and why is it important?',
        answer:
          'HTML encoding converts special characters into HTML entities (like &lt; for <) to prevent them from being interpreted as HTML tags. Essential for web security, preventing XSS attacks, and displaying special characters safely in web content.',
        internalLinks: [
          { text: 'HTML encoding', url: '/encode-decode', tooltip: 'HTML encoding tool' },
        ],
      },
      {
        question: 'Can I encode text in multiple formats at once?',
        answer:
          'Yes! Our tool supports multiple encoding formats including URL, Base64, HTML, and JSON. Convert text between different encoding methods instantly. Perfect for developers working with APIs, web applications, and data processing. Try our <a href="/text-formatter" title="Text formatter">text formatter</a> for additional processing.',
        internalLinks: [
          { text: 'text formatter', url: '/text-formatter', tooltip: 'Text formatter' },
        ],
      },
      {
        question: 'What is Unicode normalization and when do I use it?',
        answer:
          'Unicode normalization standardizes text by converting different Unicode representations of the same character into a consistent form. Essential for text comparison, search functionality, and data consistency across different systems and platforms.',
        internalLinks: [
          {
            text: 'Unicode normalization',
            url: '/encode-decode',
            tooltip: 'Unicode normalization tool',
          },
        ],
      },
      {
        question: 'How do I escape JSON strings properly?',
        answer:
          'Use our JSON escape feature to properly escape special characters in JSON strings, ensuring valid JSON format. Converts quotes, backslashes, and control characters to their escaped equivalents. Essential for API development and data serialization.',
        internalLinks: [
          { text: 'JSON escape', url: '/encode-decode', tooltip: 'JSON string escaping' },
        ],
      },
    ];

    // Text Analyzer FAQ
    this.faqData['text-analyzer'] = [
      {
        question: 'How accurate is the text analysis tool?',
        answer:
          'Our text analyzer provides highly accurate analysis including word count, character count, sentence count, and advanced statistics. Perfect for content creators, researchers, and data analysts. Get instant insights into your text with detailed metrics and frequency analysis.',
        internalLinks: [
          { text: 'text analyzer', url: '/text-analyzer', tooltip: 'Free text analysis tool' },
        ],
      },
      {
        question: 'Can I find and replace text using regular expressions?',
        answer:
          'Yes! Our Text Analyzer supports powerful regex find and replace functionality for advanced text manipulation. Use complex patterns to find, replace, or extract specific text patterns. Essential for data processing, content editing, and text transformation. Try our <a href="/text-formatter" title="Text formatter">text formatter</a> for additional formatting.',
        internalLinks: [
          { text: 'text formatter', url: '/text-formatter', tooltip: 'Text formatter' },
        ],
      },
      {
        question: 'How do I analyze word frequency in my text?',
        answer:
          'Our tool automatically analyzes word frequency and displays the most common words with counts. Perfect for SEO analysis, content optimization, and understanding text patterns. Get insights into keyword density, content structure, and writing style.',
        internalLinks: [
          { text: 'word frequency', url: '/text-analyzer', tooltip: 'Word frequency analysis' },
        ],
      },
      {
        question: 'How do I remove punctuation or numbers from text?',
        answer:
          'Use our Text Analyzer to remove punctuation, numbers, or both from your text instantly. Perfect for data cleaning, text preprocessing, and content analysis. Essential for preparing text for further processing or analysis.',
        internalLinks: [
          { text: 'Text Analyzer', url: '/text-analyzer', tooltip: 'Text cleaning tool' },
        ],
      },
      {
        question: 'What text statistics are provided by the analyzer?',
        answer:
          'We provide comprehensive statistics including word count, character count, sentence count, paragraph count, reading time, and keyword density analysis. Get detailed insights into your content structure, readability, and composition. Perfect for content optimization and analysis.',
        internalLinks: [
          { text: 'text statistics', url: '/text-analyzer', tooltip: 'Text statistics analysis' },
        ],
      },
      {
        question: 'How do I extract specific patterns from text?',
        answer:
          'Use our regex functionality to extract emails, URLs, phone numbers, or any custom patterns from your text. Perfect for data extraction, content analysis, and information gathering. Combine with our <a href="/text-generator" title="Text generator">text generator</a> for data processing workflows.',
        internalLinks: [
          { text: 'text generator', url: '/text-generator', tooltip: 'Text generator' },
        ],
      },
    ];

    // Text Generator FAQ
    this.faqData['text-generator'] = [
      {
        question: 'How do I generate Lorem Ipsum text online?',
        answer:
          'To generate Lorem Ipsum text online, use our free Text Generator tool. Select "Lorem Ipsum", specify the length, and get instant placeholder text. Perfect for design mockups, development testing, and content layout. No registration required.',
        internalLinks: [
          { text: 'Text Generator', url: '/text-generator', tooltip: 'Free text generation tool' },
        ],
      },
      {
        question: 'Can I generate random text for testing applications?',
        answer:
          'Yes! Our tool generates random text, sentences, and paragraphs for testing applications and content layouts. Perfect for developers, designers, and content creators. Generate realistic test data for forms, databases, and user interfaces.',
        internalLinks: [
          { text: 'random text', url: '/text-generator', tooltip: 'Random text generator' },
        ],
      },
      {
        question: 'How do I generate UUIDs for my application?',
        answer:
          'Use our Text Generator to create unique identifiers in various formats (UUID v1, v4) for database records and API endpoints. Essential for developers working with distributed systems, databases, and unique ID generation.',
        internalLinks: [
          { text: 'UUID generation', url: '/text-generator', tooltip: 'UUID generator' },
        ],
      },
      {
        question: 'How do I extract emails and URLs from text?',
        answer:
          'Our tool automatically extracts email addresses, URLs, and phone numbers from any text content. Perfect for data analysis, contact extraction, and content processing. Combine with our <a href="/text-analyzer" title="Text analyzer">text analyzer</a> for comprehensive text processing.',
        internalLinks: [{ text: 'text analyzer', url: '/text-analyzer', tooltip: 'Text analyzer' }],
      },
      {
        question: 'How do I mask sensitive information in text?',
        answer:
          'Use our masking feature to hide sensitive data like credit card numbers, SSNs, or personal information while preserving text structure. Essential for data privacy, testing, and content anonymization. Perfect for developers and data analysts.',
        internalLinks: [
          { text: 'data masking', url: '/text-generator', tooltip: 'Data masking tool' },
        ],
      },
      {
        question: 'Can I generate test data for development?',
        answer:
          'Yes! Our Text Generator creates realistic test data including names, addresses, and other information for application testing. Perfect for developers, QA teams, and database administrators. Generate consistent test data for development and testing environments.',
        internalLinks: [
          { text: 'test data', url: '/text-generator', tooltip: 'Test data generator' },
        ],
      },
    ];

    // Line Tools FAQ
    this.faqData['line-tools'] = [
      {
        question: 'How do I sort lines alphabetically online?',
        answer:
          'To sort lines alphabetically online, use our free Line Tools. Select "Sort Lines" to arrange your text lines in alphabetical order (ascending or descending). Perfect for organizing lists, data, and text content. Works instantly in your browser.',
        internalLinks: [
          { text: 'Line Tools', url: '/line-tools', tooltip: 'Free line processing tools' },
        ],
      },
      {
        question: 'How do I remove duplicate lines from text?',
        answer:
          'Use our "Remove Duplicates" feature to eliminate duplicate lines while preserving the original order of unique lines. Essential for data cleaning, list processing, and content deduplication. Perfect for processing large datasets, text files, and email lists. Works instantly with any text content.',
        internalLinks: [
          { text: 'Remove Duplicates', url: '/line-tools', tooltip: 'Duplicate line removal' },
        ],
      },
      {
        question: 'How do I number lines in my text?',
        answer:
          'Select "Number Lines" to add sequential numbers to each line instantly. Perfect for code listings, document formatting, and creating numbered lists. Essential for developers, writers, and data processors. Supports various numbering formats and styles. Try our <a href="/text-formatter" title="Text formatter">text formatter</a> for additional formatting.',
        internalLinks: [
          { text: 'text formatter', url: '/text-formatter', tooltip: 'Text formatter' },
        ],
      },
      {
        question: 'How do I reverse the order of lines?',
        answer:
          'Use "Reverse Lines" to flip the order of your text lines instantly. Perfect for processing data in reverse chronological order, creating reverse lists, and data manipulation. Essential for data analysis, content processing, and list organization. Works with any text content.',
        internalLinks: [
          { text: 'Reverse Lines', url: '/line-tools', tooltip: 'Line order reversal' },
        ],
      },
      {
        question: 'How do I shuffle lines randomly?',
        answer:
          'Use "Shuffle Lines" to randomize the order of your text lines instantly. Perfect for creating random lists, data sets, and content randomization. Essential for testing, data analysis, and content generation. Great for creating randomized test data and content. Combine with our <a href="/text-generator" title="Text generator">text generator</a> for comprehensive text processing.',
        internalLinks: [
          { text: 'text generator', url: '/text-generator', tooltip: 'Text generator' },
        ],
      },
      {
        question: 'Can I filter lines based on specific criteria?',
        answer:
          'Yes! Our Line Tools can filter lines containing specific text, matching patterns, or meeting certain criteria. Perfect for data filtering, content analysis, and text processing. Essential for data scientists, developers, and content managers.',
        internalLinks: [
          { text: 'Line Tools', url: '/line-tools', tooltip: 'Line filtering tools' },
        ],
      },
    ];

    // JSON Formatter FAQ
    this.faqData['json-formatter'] = [
      {
        question: 'Why use a JSON Formatter?',
        answer:
          'JSON Formatter helps you validate, format, and beautify JSON data instantly. It provides error detection, syntax highlighting, and makes JSON data more readable. Essential for debugging APIs, validating data, and ensuring proper JSON structure.',
        internalLinks: [],
      },
      {
        question: 'How do I format a JSON file?',
        answer:
          'Simply paste your JSON data into the input field, click "Format/Beautify", and the tool will automatically format it with proper indentation and structure. You can also upload JSON files directly using the upload button.',
        internalLinks: [],
      },
      {
        question: 'Is my JSON data secure?',
        answer:
          'Yes, all processing is done locally in your browser. Your JSON data is never sent to our servers, ensuring complete privacy and security. The tool works entirely client-side for maximum data protection.',
        internalLinks: [],
      },
      {
        question: 'What if my JSON has errors?',
        answer:
          'Our JSON validator will highlight syntax errors with detailed error messages and line numbers. The tool can often suggest fixes for common issues like missing commas, quotes, or brackets.',
        internalLinks: [],
      },
      {
        question: 'Can I use this tool offline?',
        answer:
          'Yes, once the page is loaded, you can use the JSON formatter offline. All processing happens locally in your browser, so no internet connection is required after the initial page load.',
        internalLinks: [],
      },
    ];

    // JSON Parser FAQ
    this.faqData['json-parser'] = [
      {
        question: 'What is the difference between a JSON parser and formatter?',
        answer:
          'A JSON formatter focuses on beautifying and formatting JSON data, while a JSON parser analyzes the structure, validates syntax, and provides detailed insights about the data.',
        internalLinks: [],
      },
      {
        question: 'Can I parse large JSON files?',
        answer:
          'Yes, our JSON parser can handle large JSON files efficiently. It provides real-time analysis and detailed statistics about your data structure.',
        internalLinks: [],
      },
      {
        question: 'What kind of analysis does the parser provide?',
        answer:
          'The parser provides comprehensive analysis including data types, structure depth, key statistics, value distribution, and detailed insights about your JSON data.',
        internalLinks: [],
      },
      {
        question: 'Is the JSON parser secure?',
        answer:
          'Yes, all processing is done client-side in your browser. Your data never leaves your device, ensuring complete privacy and security.',
        internalLinks: [],
      },
      {
        question: 'Can I use the parser for API development?',
        answer:
          'Absolutely! The JSON parser is perfect for API development, debugging responses, analyzing data structures, and understanding complex JSON payloads.',
        internalLinks: [],
      },
    ];
  }

  getFAQData(toolName: string): FAQItem[] {
    return this.faqData[toolName] || [];
  }

  generateFAQSchema(toolName: string): FAQSchemaData | null {
    const faqItems = this.getFAQData(toolName);

    if (faqItems.length === 0) {
      return null;
    }

    const currentDate = new Date().toISOString().split('T')[0];

    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map(item => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
          dateCreated: currentDate,
          author: {
            '@type': 'Organization',
            name: 'SmartTextConverter',
          },
        },
      })),
    };
  }

  addFAQSchemaToPage(toolName: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const faqSchema = this.generateFAQSchema(toolName);

    if (!faqSchema) {
      return;
    }

    // Remove existing FAQ schema
    const existingScript = document.querySelector('script[data-faq-schema]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new FAQ schema
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-faq-schema', 'true');
    script.text = JSON.stringify(faqSchema);
    document.head.appendChild(script);
  }

  getAllToolNames(): string[] {
    return Object.keys(this.faqData);
  }

  getTotalFAQCount(): number {
    return Object.values(this.faqData).reduce((total, faqs) => total + faqs.length, 0);
  }

  // Analytics tracking for FAQ engagement
  trackFAQClick(question: string, toolName: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Google Analytics tracking
    this.googleAnalytics.trackEvent('faq_click', {
      category: 'FAQ',
      label: `${toolName}: ${question.substring(0, 50)}...`,
      question: question,
      tool: toolName,
      page_location: window.location.href,
    });

    // Console logging for development
    if (!environment.production) {
      // FAQ interaction tracked
    }
  }

  trackFAQExpansion(question: string, toolName: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Google Analytics tracking
    this.googleAnalytics.trackEvent('faq_expand', {
      category: 'FAQ',
      label: `${toolName}: ${question.substring(0, 50)}...`,
      question: question,
      tool: toolName,
      page_location: window.location.href,
    });
  }
}
