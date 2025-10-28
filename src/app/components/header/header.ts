import { Component, signal, computed, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
import { TranslatedTextComponent } from '../translated-text/translated-text.component';
import { TranslationService } from '../../services/translation.service';
import { ThemeService } from '../../services/theme.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    CommonModule,
    LanguageSwitcherComponent,
    TranslatedTextComponent,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  isMobileMenuOpen = signal(false);
  currentRoute = signal('');
  isTextTransformationDropdownOpen = signal(false);
  isAnalysisUtilitiesDropdownOpen = signal(false);
  isJsonDropdownOpen = signal(false);
  isScrolled = signal(false);

  constructor(
    private router: Router,
    public translationService: TranslationService,
    public themeService: ThemeService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Track current route
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute.set(event.url);
        // Close mobile menu when navigation occurs
        this.closeMobileMenu();
      });
  }

  // Computed signal to determine if Text Transformation menu should be active
  isTextTransformationActive = computed(() => {
    const route = this.currentRoute();
    return (
      route.includes('/case-converter') ||
      route.includes('/text-formatter') ||
      route.includes('/encode-decode')
    );
  });

  // Computed signal to determine if Analysis & Utilities menu should be active
  isAnalysisUtilitiesActive = computed(() => {
    const route = this.currentRoute();
    return (
      route.includes('/text-analyzer') ||
      route.includes('/line-tools') ||
      route.includes('/text-generator')
    );
  });

  // Computed signal to determine if JSON menu should be active
  isJsonActive = computed(() => {
    const route = this.currentRoute();
    return route.includes('/json/formatter') || route.includes('/json/parser');
  });

  // Computed signal to determine if Blog menu should be active
  isBlogActive = computed(() => {
    const route = this.currentRoute();
    return route.includes('/blog/') || route === '/blog';
  });

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.set(!this.isMobileMenuOpen());
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  closeDesktopDropdowns(): void {
    this.isTextTransformationDropdownOpen.set(false);
    this.isAnalysisUtilitiesDropdownOpen.set(false);
    this.isJsonDropdownOpen.set(false);
  }

  toggleTextTransformationDropdown(): void {
    this.isTextTransformationDropdownOpen.set(!this.isTextTransformationDropdownOpen());
    // Close other dropdown when opening this one
    if (this.isTextTransformationDropdownOpen()) {
      this.isAnalysisUtilitiesDropdownOpen.set(false);
      this.isJsonDropdownOpen.set(false);
    }
  }

  toggleAnalysisUtilitiesDropdown(): void {
    this.isAnalysisUtilitiesDropdownOpen.set(!this.isAnalysisUtilitiesDropdownOpen());
    // Close other dropdown when opening this one
    if (this.isAnalysisUtilitiesDropdownOpen()) {
      this.isTextTransformationDropdownOpen.set(false);
      this.isJsonDropdownOpen.set(false);
    }
  }

  toggleJsonDropdown(): void {
    this.isJsonDropdownOpen.set(!this.isJsonDropdownOpen());
    // Close other dropdown when opening this one
    if (this.isJsonDropdownOpen()) {
      this.isTextTransformationDropdownOpen.set(false);
      this.isAnalysisUtilitiesDropdownOpen.set(false);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    // Close dropdowns if clicking outside the header
    if (!target.closest('header')) {
      this.closeDesktopDropdowns();
    }
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    this.isScrolled.set(scrollTop > 50);
  }
}
