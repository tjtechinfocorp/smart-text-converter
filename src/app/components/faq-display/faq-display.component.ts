import { Component, Input, OnInit, OnDestroy, Inject, PLATFORM_ID, effect } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FAQSchemaService, FAQItem } from '../../services/faq-schema.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-faq-display',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './faq-display.component.html',
  styleUrl: './faq-display.component.scss',
})
export class FAQDisplayComponent implements OnInit {
  @Input() toolName: string = '';
  @Input() showTitle: boolean = true;
  @Input() maxItems: number = 0; // 0 means show all

  faqItems: FAQItem[] = [];
  expandedItems: Set<number> = new Set();

  constructor(
    private faqSchemaService: FAQSchemaService,
    private translationService: TranslationService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // React to language changes
    effect(() => {
      // Access the current language signal to trigger the effect
      this.translationService.getCurrentLanguage();
      // Reload FAQ items when language changes
      if (this.toolName) {
        this.loadFAQItems();
      }
    });
  }

  ngOnInit(): void {
    if (this.toolName) {
      this.loadFAQItems();
    }
  }

  private loadFAQItems(): void {
    const allItems = this.faqSchemaService.getFAQData(this.toolName);
    const itemsToDisplay = this.maxItems > 0 ? allItems.slice(0, this.maxItems) : allItems;

    // Translate FAQ items using translation keys
    this.faqItems = itemsToDisplay.map((item, index) => {
      const questionKey = `${this.toolName}.faq${index + 1}-question`;
      const answerKey = `${this.toolName}.faq${index + 1}-answer`;

      const translatedQuestion = this.translationService.translate(questionKey);
      const translatedAnswer = this.translationService.translate(answerKey);

      return {
        ...item,
        question: translatedQuestion !== questionKey ? translatedQuestion : item.question,
        answer: translatedAnswer !== answerKey ? translatedAnswer : item.answer,
      };
    });
  }

  toggleExpanded(index: number): void {
    if (this.expandedItems.has(index)) {
      this.expandedItems.delete(index);
    } else {
      this.expandedItems.add(index);
    }
  }

  isExpanded(index: number): boolean {
    return this.expandedItems.has(index);
  }

  getToolDisplayName(): string {
    const toolNameKey = `${this.toolName}.tool-name`;
    const translated = this.translationService.translate(toolNameKey);

    // Fallback to hardcoded names if translation key doesn't exist
    if (translated === toolNameKey) {
      const toolNames: { [key: string]: string } = {
        'case-converter': 'Case Converter',
        'text-formatter': 'Text Formatter',
        'encode-decode': 'Encode/Decode',
        'text-analyzer': 'Text Analyzer',
        'text-generator': 'Text Generator',
        'line-tools': 'Line Tools',
      };
      return toolNames[this.toolName] || this.toolName;
    }

    return translated;
  }

  getFAQTitle(): string {
    const titleKey = `${this.toolName}.faq-title`;
    const translated = this.translationService.translate(titleKey);
    return translated !== titleKey ? translated : 'Frequently Asked Questions';
  }

  getFAQSubtitle(): string {
    const subtitleKey = `${this.toolName}.faq-subtitle`;
    const translated = this.translationService.translate(subtitleKey);
    if (translated !== subtitleKey) {
      return translated;
    }
    const toolName = this.getToolDisplayName();
    return `Common questions about ${toolName}`;
  }

  getFAQSchemaJSON(): string {
    const schema = this.faqSchemaService.generateFAQSchema(this.toolName);
    return schema ? JSON.stringify(schema) : '';
  }

  // Analytics tracking methods
  onFAQClick(question: string): void {
    this.faqSchemaService.trackFAQClick(question, this.toolName);
  }

  onFAQExpand(question: string): void {
    this.faqSchemaService.trackFAQExpansion(question, this.toolName);
  }

  getFormattedAnswer(item: FAQItem): string {
    let formattedAnswer = item.answer;

    // Replace internal links with proper HTML links
    if (item.internalLinks && item.internalLinks.length > 0) {
      item.internalLinks.forEach(link => {
        // Get the translated tool name for the link
        const translatedToolName = this.getTranslatedToolName(link.url);
        const linkHtml = `<a href="${link.url}" title="${
          link.tooltip || ''
        }" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline transition-colors duration-200">${translatedToolName}</a>`;
        // Try to replace the translated tool name first
        if (formattedAnswer.includes(translatedToolName)) {
          formattedAnswer = formattedAnswer.replace(translatedToolName, linkHtml);
        } else {
          // Fallback: try to replace the original English text if translated text doesn't match
          formattedAnswer = formattedAnswer.replace(link.text, linkHtml);
        }
      });
    }

    return formattedAnswer;
  }

  private getTranslatedToolName(url: string): string {
    const toolNameMap: { [key: string]: string } = {
      '/text-formatter': this.translationService.translate('text-formatter.tool-name'),
      '/text-analyzer': this.translationService.translate('text-analyzer.tool-name'),
      '/case-converter': this.translationService.translate('case-converter.tool-name'),
      '/line-tools': this.translationService.translate('line-tools.tool-name'),
    };

    return toolNameMap[url] || url;
  }
}
