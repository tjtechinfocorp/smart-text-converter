import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SEOService } from '../../services/seo.service';
import { JsonUtilityService, JsonFormatOptions } from '../../services/json-utility.service';
import { FAQSchemaService } from '../../services/faq-schema.service';
import { TranslatedTextComponent } from '../translated-text/translated-text.component';
import { FAQDisplayComponent } from '../faq-display/faq-display.component';
import { createJSONEditor, Mode } from 'vanilla-jsoneditor';

@Component({
  selector: 'app-json-formatter',
  templateUrl: './json-formatter.component.html',
  styleUrls: ['./json-formatter.component.scss'],
  imports: [CommonModule, FormsModule, RouterModule, TranslatedTextComponent, FAQDisplayComponent],
  standalone: true,
})
export class JsonFormatterComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('jsonEditor', { static: false }) jsonEditorRef!: ElementRef;
  @ViewChild('outputEditor', { static: false }) outputEditorRef!: ElementRef;

  private jsonEditor: any;
  private outputEditor: any;

  jsonInput: string = '';
  jsonOutput: string = '';
  isProcessing: boolean = false;
  currentView: 'formatted' | 'minified' | 'stats' = 'formatted';

  formatOptions: JsonFormatOptions = {
    indentSize: 4, // Default to 4 spaces to match the UI
    sortKeys: false,
    removeComments: false,
    compact: false,
  };

  // Sample JSON for demonstration
  sampleJson = `{
    "name": "John Doe",
    "age": 30,
    "email": "john&#64;example.com",
    "address": {
        "street": "123 Main St",
        "city": "New York",
        "zipCode": "10001"
    },
    "hobbies": ["reading", "coding", "traveling"],
    "isActive": true
}`;

  constructor(
    private seoService: SEOService,
    private jsonUtilityService: JsonUtilityService,
    private faqSchemaService: FAQSchemaService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  private isBrowser: boolean;

  ngOnInit(): void {
    this.setSEO();
    this.addStructuredData();

    // Add FAQ schema markup
    this.faqSchemaService.addFAQSchemaToPage('json-formatter');

    // Load sample JSON on first visit
    if (!this.jsonInput) {
      this.loadSampleJson();
    }

    // Add keyboard shortcuts
    this.addKeyboardShortcuts();
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      // Use setTimeout to ensure the DOM is fully rendered
      setTimeout(() => {
        this.initializeEditors();
      }, 100);
    }
  }

  /**
   * Initialize JSON editors
   */
  private initializeEditors(): void {
    if (!this.jsonEditorRef?.nativeElement || !this.outputEditorRef?.nativeElement) {
      console.warn('Editor elements not ready, retrying...');
      setTimeout(() => this.initializeEditors(), 100);
      return;
    }

    try {
      // Initialize input editor
      this.jsonEditor = createJSONEditor({
        target: this.jsonEditorRef.nativeElement,
        props: {
          mode: Mode.text,
          content: { text: this.jsonInput },
          onChange: (content: any) => {
            if (content.text !== undefined) {
              this.jsonInput = content.text;
              this.onJsonInputChange();
            }
          },
          readOnly: false,
          mainMenuBar: true,
          statusBar: true,
          navigationBar: true,
          askToFormat: true,
          escapeControlCharacters: false,
          escapeUnicodeCharacters: false,
          flattenColumns: true,
          // Enable all toolbar options
          onMenuAction: (action: string) => {
            this.handleMenuAction(action, 'input');
          },
          onRenderMenu: (items: any) => {
            // Keep all default menu items and ensure they're visible
            return items;
          },
        },
      });

      // Initialize output editor
      this.outputEditor = createJSONEditor({
        target: this.outputEditorRef.nativeElement,
        props: {
          mode: Mode.text,
          content: { text: this.jsonOutput },
          readOnly: false,
          mainMenuBar: true,
          statusBar: true,
          navigationBar: true,
          askToFormat: true,
          escapeControlCharacters: false,
          escapeUnicodeCharacters: false,
          flattenColumns: true,
          // Enable all toolbar options
          onMenuAction: (action: string) => {
            this.handleMenuAction(action, 'output');
          },
          onRenderMenu: (items: any) => {
            // Keep all default menu items and ensure they're visible
            return items;
          },
        },
      });
    } catch (error) {
      console.error('Failed to initialize JSON editors:', error);
      // Retry after a delay
      setTimeout(() => this.initializeEditors(), 500);
    }
  }

  ngOnDestroy(): void {
    if (this.jsonEditor) {
      this.jsonEditor.destroy();
    }
    if (this.outputEditor) {
      this.outputEditor.destroy();
    }
  }

  /**
   * Handle JSON input changes
   */
  onJsonInputChange(): void {
    if (!this.jsonInput.trim()) {
      this.clearOutput();
      return;
    }

    this.processJson();
  }

  /**
   * Process JSON input
   */
  processJson(): void {
    if (!this.jsonInput.trim()) {
      return;
    }

    this.isProcessing = true;

    try {
      // Try to parse JSON - if it fails, the editor will show the error
      JSON.parse(this.jsonInput);

      // If parsing succeeds, format JSON based on current view
      this.formatJson();
    } catch (error) {
      // Clear output on error - editor will show the error details
      this.jsonOutput = '';
      this.updateOutputEditor();
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Format JSON based on current view
   */
  formatJson(): void {
    try {
      // Ensure indentSize is a number
      const options = {
        ...this.formatOptions,
        indentSize: Number(this.formatOptions.indentSize),
      };

      switch (this.currentView) {
        case 'formatted':
          this.jsonOutput = this.jsonUtilityService.formatJson(this.jsonInput, options);
          break;
        case 'minified':
          this.jsonOutput = this.jsonUtilityService.minifyJson(this.jsonInput);
          break;
        case 'stats':
          const stats = this.jsonUtilityService.getJsonStats(this.jsonInput);
          this.jsonOutput = JSON.stringify(stats, null, 2);
          break;
      }

      // Update output editor
      this.updateOutputEditor();
    } catch (error) {
      this.jsonOutput = 'Error formatting JSON: ' + (error as Error).message;
      this.updateOutputEditor();
    }
  }

  /**
   * Update output editor content
   */
  private updateOutputEditor(): void {
    if (this.outputEditor) {
      try {
        this.outputEditor.set({ text: this.jsonOutput });
      } catch (error) {
        console.error('Failed to update output editor:', error);
      }
    }
  }

  /**
   * Handle menu actions from the JSON editor toolbar
   */
  private handleMenuAction(action: string, editor: 'input' | 'output'): void {
    switch (action) {
      case 'new':
        if (editor === 'input') {
          this.jsonInput = '';
          this.clearOutput();
        } else {
          this.jsonOutput = '';
          this.updateOutputEditor();
        }
        break;

      case 'open':
        // Trigger file input for the respective editor
        if (editor === 'input') {
          this.triggerFileInput('input');
        } else {
          this.triggerFileInput('output');
        }
        break;

      case 'save':
        if (editor === 'input' && this.jsonInput) {
          this.downloadJson('input');
        } else if (editor === 'output' && this.jsonOutput) {
          this.downloadJson('output');
        }
        break;

      case 'copy':
        if (editor === 'input' && this.jsonInput) {
          this.copyToClipboard(this.jsonInput);
        } else if (editor === 'output' && this.jsonOutput) {
          this.copyToClipboard(this.jsonOutput);
        }
        break;

      case 'fullscreen':
        this.toggleFullscreen(editor);
        break;
    }
  }

  /**
   * Trigger file input for a specific editor
   */
  private triggerFileInput(editor: 'input' | 'output'): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.txt';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        this.handleFileUpload(file, editor);
      }
    };
    input.click();
  }

  /**
   * Handle file upload for a specific editor
   */
  private handleFileUpload(file: File, editor: 'input' | 'output'): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const content = e.target.result;
      if (editor === 'input') {
        this.jsonInput = content;
        this.onJsonInputChange();
      } else {
        this.jsonOutput = content;
        this.updateOutputEditor();
      }
    };
    reader.readAsText(file);
  }

  /**
   * Download JSON content
   */
  downloadJson(editor?: 'input' | 'output'): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const targetEditor = editor || 'output';
    const content = targetEditor === 'input' ? this.jsonInput : this.jsonOutput;
    if (!content) return;

    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `json-${targetEditor}-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Copy content to clipboard
   */
  copyToClipboard(content?: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const textToCopy = content || this.jsonOutput;
    if (!textToCopy) return;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        console.log('Content copied to clipboard');
      });
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  }

  /**
   * Toggle fullscreen mode for an editor
   */
  private toggleFullscreen(editor: 'input' | 'output'): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const element =
      editor === 'input' ? this.jsonEditorRef?.nativeElement : this.outputEditorRef?.nativeElement;
    if (!element) return;

    if (!document.fullscreenElement) {
      element.requestFullscreen().catch((err: any) => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen();
    }
  }

  /**
   * Switch view mode
   */
  switchView(view: 'formatted' | 'minified' | 'stats'): void {
    this.currentView = view;
    this.formatJson();
  }

  /**
   * Handle indent size change
   */
  onIndentSizeChange(): void {
    // Convert string to number and update format options
    this.formatOptions.indentSize = Number(this.formatOptions.indentSize);
    this.formatJson();
  }

  /**
   * Handle sort keys change
   */
  onSortKeysChange(): void {
    this.formatJson();
  }

  /**
   * Clear all inputs and outputs
   */
  clearAll(): void {
    this.jsonInput = '';
    if (this.jsonEditor) {
      this.jsonEditor.set({ text: '' });
    }
    this.clearOutput();
  }

  /**
   * Clear output
   */
  clearOutput(): void {
    this.jsonOutput = '';
    if (this.outputEditor) {
      this.outputEditor.set({ text: '' });
    }
  }

  /**
   * Load sample JSON
   */
  loadSampleJson(): void {
    this.jsonInput = this.sampleJson;
    if (this.jsonEditor) {
      this.jsonEditor.set({ text: this.jsonInput });
    }
    this.processJson();
  }

  /**
   * Handle file upload
   */
  onFileUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      alert('File too large. Maximum size is 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = e => {
      const content = e.target?.result as string;
      this.jsonInput = content;
      if (this.jsonEditor) {
        this.jsonEditor.set({ text: this.jsonInput });
      }
      this.processJson();
    };
    reader.readAsText(file);
  }

  /**
   * Get current JSON size info
   */
  getJsonSizeInfo(): { size: number; sizeFormatted: string; lines: number } {
    const size = this.jsonInput.length;
    const lines = this.jsonInput.split('\n').length;

    let sizeFormatted = '';
    if (size < 1024) {
      sizeFormatted = `${size} bytes`;
    } else if (size < 1024 * 1024) {
      sizeFormatted = `${(size / 1024).toFixed(1)} KB`;
    } else {
      sizeFormatted = `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }

    return { size, sizeFormatted, lines };
  }

  /**
   * Add keyboard shortcuts
   */
  private addKeyboardShortcuts(): void {
    if (!this.isBrowser) {
      return;
    }

    document.addEventListener('keydown', event => {
      // Only handle shortcuts when not in input fields
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Ctrl/Cmd + Enter: Process JSON
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        this.processJson();
      }

      // Ctrl/Cmd + K: Clear all
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        this.clearAll();
      }

      // Ctrl/Cmd + C: Copy output (if available)
      if ((event.ctrlKey || event.metaKey) && event.key === 'c' && this.jsonOutput) {
        event.preventDefault();
        this.copyToClipboard();
      }

      // Ctrl/Cmd + S: Download JSON
      if ((event.ctrlKey || event.metaKey) && event.key === 's' && this.jsonOutput) {
        event.preventDefault();
        this.downloadJson();
      }
    });
  }

  /**
   * Set SEO meta tags
   */
  private setSEO(): void {
    this.seoService.setTitle(
      'JSON Formatter & Validator - Free Online JSON Tool | SmartTextConverter'
    );
    this.seoService.setMetaDescription(
      'Free online JSON formatter, validator, and beautifier. Format, validate, minify, and analyze JSON data instantly. No registration required.'
    );
    this.seoService.setMetaKeywords(
      'JSON formatter, JSON validator, JSON beautifier, JSON minifier, JSON parser, JSON viewer, JSON editor, online JSON tool, JSON converter, JSON analyzer'
    );
    this.seoService.setCanonicalURL('https://smarttextconverter.com/json/formatter');

    this.seoService.setOpenGraphTags({
      title: 'JSON Formatter & Validator - Free Online JSON Tool',
      description:
        'Format, validate, and beautify JSON data instantly. Professional JSON tool for developers.',
      type: 'website',
      url: 'https://smarttextconverter.com/json/formatter',
      image: '/main-logo-80x80.png',
    });

    this.seoService.setTwitterCardTags({
      title: 'JSON Formatter & Validator - Free Online JSON Tool',
      description:
        'Format, validate, and beautify JSON data instantly. Professional JSON tool for developers.',
      image: '/main-logo-80x80.png',
      card: 'summary_large_image',
    });
  }

  /**
   * Add structured data for JSON utility
   */
  private addStructuredData(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'JSON Formatter & Validator',
      description:
        'Free online JSON formatter, validator, and beautifier tool for developers and data analysts.',
      url: 'https://smarttextconverter.com/json-utility',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Any',
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
        'JSON Formatting',
        'JSON Validation',
        'JSON Minification',
        'JSON Beautification',
        'JSON Statistics',
        'Error Detection',
        'File Upload',
        'Copy to Clipboard',
      ],
    };

    if (isPlatformBrowser(this.platformId)) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }
  }
}
