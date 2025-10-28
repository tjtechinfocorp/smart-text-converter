import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class LazyJsonEditorService {
  private isBrowser: boolean;
  private jsonEditorPromise: Promise<any> | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /**
   * Lazy load the JSON editor only when needed
   */
  async loadJsonEditor(): Promise<any> {
    if (!this.isBrowser) {
      throw new Error('JSON Editor can only be loaded in browser');
    }

    if (this.jsonEditorPromise) {
      return this.jsonEditorPromise;
    }

    this.jsonEditorPromise = this.loadJsonEditorModule();
    return this.jsonEditorPromise;
  }

  /**
   * Load the JSON editor module dynamically
   */
  private async loadJsonEditorModule(): Promise<any> {
    try {
      // Load JSON editor CSS dynamically
      await this.loadJsonEditorCSS();

      // Dynamic import to lazy load the large JSON editor
      const { JsonEditor } = await import('vanilla-jsoneditor');
      return JsonEditor;
    } catch (error) {
      console.error('Failed to load JSON Editor:', error);
      throw error;
    }
  }

  /**
   * Load JSON editor CSS dynamically
   */
  private async loadJsonEditorCSS(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if CSS is already loaded
      if (document.querySelector('link[href*="jse-theme-dark"]')) {
        resolve();
        return;
      }

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href =
        'https://cdn.jsdelivr.net/npm/vanilla-jsoneditor@0.18.0/themes/jse-theme-dark.css';
      link.onload = () => resolve();
      link.onerror = () => reject(new Error('Failed to load JSON editor CSS'));
      document.head.appendChild(link);
    });
  }

  /**
   * Preload the JSON editor in the background only when needed
   */
  preloadJsonEditor(): void {
    if (!this.isBrowser) return;

    // Only preload if we're on a JSON-related route
    const currentPath = window.location.pathname;
    const isJsonRoute =
      currentPath.includes('/json/') ||
      currentPath.includes('json-formatter') ||
      currentPath.includes('json-parser');

    if (!isJsonRoute) return;

    // Use requestIdleCallback to preload when browser is idle
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => {
        this.loadJsonEditor().catch(() => {
          // Silently fail preloading
        });
      });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        this.loadJsonEditor().catch(() => {
          // Silently fail preloading
        });
      }, 1000);
    }
  }

  /**
   * Check if JSON editor is already loaded
   */
  isJsonEditorLoaded(): boolean {
    return this.jsonEditorPromise !== null;
  }

  /**
   * Create a JSON editor instance
   */
  async createJsonEditor(container: HTMLElement, options: any = {}): Promise<any> {
    const JsonEditor = await this.loadJsonEditor();

    const defaultOptions = {
      target: container,
      props: {
        readOnly: false,
        mainMenuBar: true,
        statusBar: true,
        ...options,
      },
    };

    return new JsonEditor(defaultOptions);
  }
}
