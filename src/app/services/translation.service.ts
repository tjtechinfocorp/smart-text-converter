import { Injectable, signal, computed, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';
import { DOCUMENT } from '@angular/common';
import { en } from '../translations/en';

export interface Translation {
  [key: string]: string;
}

export interface Translations {
  [language: string]: Translation;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private readonly STORAGE_KEY = 'app_language';
  private readonly DEFAULT_LANGUAGE = 'en';

  private currentLanguage = signal<string>(this.DEFAULT_LANGUAGE);

  // Translation data - only English loaded initially, others loaded dynamically
  private translations: Translations = {
    en,
  };

  // Cache for loaded translations
  private translationCache = new Map<string, Translation>();

  // Available languages (ordered alphabetically by native name)
  private readonly languages: Language[] = [
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
    { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
    { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
    { code: 'fil', name: 'Filipino', nativeName: 'Filipino', flag: '🇵🇭' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
    { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
    { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
    { code: 'sw', name: 'Kiswahili', nativeName: 'Kiswahili', flag: '🇹🇿' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
    { code: 'pt-br', name: 'Portuguese (Brazil)', nativeName: 'Português (Brasil)', flag: '🇧🇷' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
    { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
    { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰' },
  ];

  // Computed properties
  currentLanguageSignal = computed(() => this.currentLanguage());
  currentTranslations = computed(
    () => this.translations[this.currentLanguage()] || this.translations[this.DEFAULT_LANGUAGE]
  );

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.initializeLanguage();
  }

  private async initializeLanguage(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      // Try to get saved language from localStorage (persistent across sessions)
      const savedLanguage = localStorage.getItem(this.STORAGE_KEY);
      if (savedLanguage && savedLanguage !== this.DEFAULT_LANGUAGE) {
        // Load the saved language translation
        await this.loadTranslation(savedLanguage);
        if (this.translations[savedLanguage]) {
          this.currentLanguage.set(savedLanguage);
          this.updateDocumentLanguage(savedLanguage);
          return;
        }
      }

      // For new users, always default to English (no browser language detection)
      // This ensures consistent experience for new users
      this.currentLanguage.set(this.DEFAULT_LANGUAGE);
      this.updateDocumentLanguage(this.DEFAULT_LANGUAGE);

      // Save the default language to localStorage for future visits
      localStorage.setItem(this.STORAGE_KEY, this.DEFAULT_LANGUAGE);
    }
  }

  private updateDocumentLanguage(language: string): void {
    if (isPlatformBrowser(this.platformId)) {
      this.document.documentElement.lang = language;
      this.document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }
  }

  // Public methods
  getSupportedLanguages(): Language[] {
    // Return languages with English first, then alphabetically ordered
    const englishLanguage = this.languages.find(lang => lang.code === 'en');
    const otherLanguages = this.languages.filter(lang => lang.code !== 'en');

    return englishLanguage ? [englishLanguage, ...otherLanguages] : this.languages;
  }

  getCurrentLanguage(): string {
    return this.currentLanguage();
  }

  async setLanguage(language: string): Promise<void> {
    // Load translation if not already loaded
    await this.loadTranslation(language);

    if (this.translations[language]) {
      this.currentLanguage.set(language);
      this.updateDocumentLanguage(language);

      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(this.STORAGE_KEY, language);
      }
    }
  }

  private async loadTranslation(language: string): Promise<void> {
    if (this.translations[language] || this.translationCache.has(language)) {
      return;
    }

    try {
      let translation: Translation;

      switch (language) {
        case 'zh':
          translation = (await import('../translations/zh')).zh;
          break;
        case 'hi':
          translation = (await import('../translations/hi')).hi;
          break;
        case 'es':
          translation = (await import('../translations/es')).es;
          break;
        case 'fr':
          translation = (await import('../translations/fr')).fr;
          break;
        case 'ar':
          translation = (await import('../translations/ar')).ar;
          break;
        case 'bn':
          translation = (await import('../translations/bn')).bn;
          break;
        case 'pt':
          translation = (await import('../translations/pt')).pt;
          break;
        case 'ru':
          translation = (await import('../translations/ru')).ru;
          break;
        case 'ur':
          translation = (await import('../translations/ur')).ur;
          break;
        case 'id':
          translation = (await import('../translations/id')).id;
          break;
        case 'de':
          translation = (await import('../translations/de')).de;
          break;
        case 'ja':
          translation = (await import('../translations/ja')).ja;
          break;
        case 'fil':
          translation = (await import('../translations/fil')).fil;
          break;
        case 'it':
          translation = (await import('../translations/it')).it;
          break;
        case 'tr':
          translation = (await import('../translations/tr')).tr;
          break;
        case 'sw':
          translation = (await import('../translations/sw')).sw;
          break;
        case 'pt-br':
          translation = (await import('../translations/pt-br')).pt_br;
          break;
        case 'nl':
          translation = (await import('../translations/nl')).nl;
          break;
        case 'pl':
          translation = (await import('../translations/pl')).pl;
          break;
        default:
          return;
      }

      this.translations[language] = translation;
      this.translationCache.set(language, translation);
    } catch (error) {
      if (!environment.production) {
        console.warn(`Failed to load translation for language: ${language}`, error);
      }
    }
  }

  // Method to reset language to default (useful for testing)
  resetLanguage(): void {
    this.setLanguage(this.DEFAULT_LANGUAGE);
  }

  // Method to clear saved language preference
  clearLanguagePreference(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.STORAGE_KEY);
      this.resetLanguage();
    }
  }

  translate(key: string, params?: { [key: string]: string | number }): string {
    const translation = this.currentTranslations()[key];

    if (!translation) {
      if (!environment.production) {
        console.warn(`Translation missing for key: ${key}`);
      }
      return key;
    }

    if (params) {
      return this.interpolate(translation, params);
    }

    return translation;
  }

  private interpolate(text: string, params: { [key: string]: string | number }): string {
    return text.replace(/\{(\w+)\}/g, (match, key) => {
      return params[key]?.toString() || match;
    });
  }

  // Method to add new language dynamically
  addLanguage(code: string, translations: Translation, languageInfo: Language): void {
    this.translations[code] = translations;
    this.languages.push(languageInfo);
  }

  // Method to check if a language is supported
  isLanguageSupported(code: string): boolean {
    return !!this.translations[code];
  }

  // Method to get all available translation keys
  getAllTranslationKeys(): string[] {
    const allKeys = new Set<string>();
    Object.values(this.translations).forEach(translation => {
      Object.keys(translation).forEach(key => allKeys.add(key));
    });
    return Array.from(allKeys).sort();
  }

  // Method to check for missing translations
  getMissingTranslations(language: string): string[] {
    const defaultKeys = Object.keys(this.translations[this.DEFAULT_LANGUAGE]);
    const languageKeys = Object.keys(this.translations[language] || {});
    return defaultKeys.filter(key => !languageKeys.includes(key));
  }
}
