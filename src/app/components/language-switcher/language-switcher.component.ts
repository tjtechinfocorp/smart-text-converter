import { Component, signal, computed, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';
import { SEOService } from '../../services/seo.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.scss',
})
export class LanguageSwitcherComponent implements OnInit {
  isOpen = signal(false);

  constructor(
    public translationService: TranslationService,
    private seoService: SEOService
  ) {}

  ngOnInit(): void {}

  currentLanguageInfo = computed(() => {
    const currentLang = this.translationService.currentLanguageSignal();
    return this.translationService.getSupportedLanguages().find(lang => lang.code === currentLang);
  });

  supportedLanguages = computed(() => {
    return this.translationService.getSupportedLanguages();
  });

  currentLanguageCode = computed(() => {
    return this.translationService.currentLanguageSignal();
  });

  toggleDropdown(): void {
    this.isOpen.set(!this.isOpen());
  }

  async selectLanguage(language: any): Promise<void> {
    await this.translationService.setLanguage(language.code);
    // Update SEO tags for the new language
    this.seoService.setLanguageTags({
      title: '',
      description: '',
      locale: language.code,
    });
    // Also update HTML lang attribute directly
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', language.code);
    }
    this.isOpen.set(false);
  }

  closeDropdown(): void {
    this.isOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const dropdown = target.closest('.language-switcher-container');
    if (dropdown === null && this.isOpen()) {
      this.closeDropdown();
    }
  }
}
