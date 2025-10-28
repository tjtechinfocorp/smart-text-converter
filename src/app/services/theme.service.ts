import { Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME_KEY = 'smarttextconverter-theme';
  private readonly DARK_THEME = 'dark';
  private readonly LIGHT_THEME = 'light';

  // Signal for reactive theme state
  public isDarkMode = signal(false);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.initializeTheme();
  }

  /**
   * Initialize theme from localStorage or system preference
   */
  private initializeTheme(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const savedTheme = localStorage.getItem(this.THEME_KEY);

    if (savedTheme) {
      // Use saved preference
      this.setTheme(savedTheme === this.DARK_THEME);
    } else {
      // Default to light theme for new users
      this.setTheme(false);
    }

    // Ensure theme is applied immediately
    this.applyTheme(this.isDarkMode());
  }

  /**
   * Toggle between dark and light theme
   */
  public toggleTheme(): void {
    this.setTheme(!this.isDarkMode());
  }

  /**
   * Set theme explicitly
   */
  public setTheme(isDark: boolean): void {
    this.isDarkMode.set(isDark);
    this.applyTheme(isDark);
    this.saveTheme(isDark);
  }

  /**
   * Apply theme to document
   */
  private applyTheme(isDark: boolean): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const htmlElement = document.documentElement;

    if (isDark) {
      htmlElement.classList.add(this.DARK_THEME);
      htmlElement.classList.remove(this.LIGHT_THEME);
    } else {
      htmlElement.classList.add(this.LIGHT_THEME);
      htmlElement.classList.remove(this.DARK_THEME);
    }

    // Update meta theme-color for mobile browsers
    this.updateMetaThemeColor(isDark);
  }

  /**
   * Save theme preference to localStorage
   */
  private saveTheme(isDark: boolean): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const theme = isDark ? this.DARK_THEME : this.LIGHT_THEME;
    localStorage.setItem(this.THEME_KEY, theme);
  }

  /**
   * Update meta theme-color for mobile browsers
   */
  private updateMetaThemeColor(isDark: boolean): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    let metaThemeColor = document.querySelector('meta[name="theme-color"]');

    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }

    const color = isDark ? '#1f2937' : '#ffffff'; // gray-800 : white
    metaThemeColor.setAttribute('content', color);
  }

  /**
   * Get current theme name
   */
  public getCurrentTheme(): string {
    return this.isDarkMode() ? this.DARK_THEME : this.LIGHT_THEME;
  }

  /**
   * Check if dark mode is active
   */
  public isDark(): boolean {
    return this.isDarkMode();
  }

  /**
   * Check if light mode is active
   */
  public isLight(): boolean {
    return !this.isDarkMode();
  }

  /**
   * Get theme classes for components
   */
  public getThemeClasses(lightClass: string, darkClass: string): string {
    return this.isDarkMode() ? darkClass : lightClass;
  }

  /**
   * Get conditional theme classes
   */
  public getConditionalClasses(lightClass: string, darkClass: string): { [key: string]: boolean } {
    return {
      [lightClass]: this.isLight(),
      [darkClass]: this.isDark(),
    };
  }
}
