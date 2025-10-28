import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatedTextComponent } from '../translated-text/translated-text.component';

export interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  readingTime: number;
  speakingTime: number;
  averageWordLength: number;
  averageSentenceLength: number;
  detectedLanguage: string;
}

@Component({
  selector: 'app-text-statistics',
  standalone: true,
  imports: [CommonModule, TranslatedTextComponent],
  templateUrl: './text-statistics.html',
  styleUrl: './text-statistics.scss',
})
export class TextStatistics {
  text = input('');

  // Computed statistics based on input text
  textStats = computed(() => {
    const text = this.text();
    const wordCount = this.countWords(text);
    const sentenceCount = this.countSentences(text);
    return {
      characters: text.length,
      charactersNoSpaces: text.replace(/\s/g, '').length,
      words: wordCount,
      sentences: sentenceCount,
      paragraphs: this.countParagraphs(text),
      lines: this.countLines(text),
      readingTime: this.calculateReadingTime(text),
      speakingTime: this.calculateSpeakingTime(text),
      averageWordLength: this.calculateAverageWordLength(text),
      averageSentenceLength: this.calculateAverageSentenceLength(text),
      detectedLanguage: this.detectLanguage(text),
    };
  });

  private countWords(text: string): number {
    if (!text.trim()) return 0;
    return text
      .trim()
      .split(/\s+/)
      .filter(word => word.length > 0).length;
  }

  private countSentences(text: string): number {
    if (!text.trim()) return 0;
    // Split by sentence-ending punctuation, filter out empty strings
    return text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length;
  }

  private countParagraphs(text: string): number {
    if (!text.trim()) return 0;
    return text.split(/\n\s*\n/).filter(paragraph => paragraph.trim().length > 0).length;
  }

  private countLines(text: string): number {
    if (!text.trim()) return 0;
    return text.split('\n').length;
  }

  private calculateReadingTime(text: string): number {
    const wordsPerMinute = 200; // Average reading speed
    const wordCount = this.countWords(text);
    return Math.ceil(wordCount / wordsPerMinute);
  }

  private calculateSpeakingTime(text: string): number {
    const wordsPerMinute = 150; // Average speaking speed
    const wordCount = this.countWords(text);
    return Math.ceil(wordCount / wordsPerMinute);
  }

  private calculateAverageWordLength(text: string): number {
    if (!text.trim()) return 0;
    const words = text
      .trim()
      .split(/\s+/)
      .filter(word => word.length > 0);
    if (words.length === 0) return 0;

    const totalLength = words.reduce((sum, word) => sum + word.length, 0);
    return Math.round((totalLength / words.length) * 10) / 10; // Round to 1 decimal place
  }

  private calculateAverageSentenceLength(text: string): number {
    if (!text.trim()) return 0;
    const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
    if (sentences.length === 0) return 0;

    const totalWords = sentences.reduce((sum, sentence) => {
      const words = sentence
        .trim()
        .split(/\s+/)
        .filter(word => word.length > 0);
      return sum + words.length;
    }, 0);

    return Math.round((totalWords / sentences.length) * 10) / 10; // Round to 1 decimal place
  }

  private detectLanguage(text: string): string {
    if (!text.trim()) return 'Unknown';

    // Basic language detection using character set heuristics
    const cleanText = text.replace(/[^\w\s]/g, '').toLowerCase();

    // Check for common language patterns
    const patterns = {
      English: /[a-z]/,
      Spanish: /[ñáéíóúü]/,
      French: /[àâäéèêëïîôöùûüÿç]/,
      German: /[äöüß]/,
      Italian: /[àèéìíîòóù]/,
      Portuguese: /[ãõç]/,
      Russian: /[а-яё]/,
      Chinese: /[\u4e00-\u9fff]/,
      Japanese: /[\u3040-\u309f\u30a0-\u30ff]/,
      Korean: /[\uac00-\ud7af]/,
      Arabic: /[\u0600-\u06ff]/,
      Hebrew: /[\u0590-\u05ff]/,
      Hindi: /[\u0900-\u097f]/,
      Thai: /[\u0e00-\u0e7f]/,
      Greek: /[\u0370-\u03ff]/,
      Cyrillic: /[\u0400-\u04ff]/,
    };

    // Count matches for each language
    const scores: { [key: string]: number } = {};

    for (const [language, pattern] of Object.entries(patterns)) {
      const matches = (cleanText.match(pattern) || []).length;
      scores[language] = matches;
    }

    // Find the language with the highest score
    const detectedLanguage = Object.entries(scores).reduce((a, b) =>
      scores[a[0]] > scores[b[0]] ? a : b
    );

    // If no specific language patterns found, default to English for Latin script
    if (detectedLanguage[1] === 0) {
      return /[a-z]/.test(cleanText) ? 'English (likely)' : 'Unknown';
    }

    return detectedLanguage[0];
  }
}
