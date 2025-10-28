import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class WebPOptimizationService {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /**
   * Initialize WebP optimization
   */
  initialize(): void {
    if (!this.isBrowser) return;

    // Skip WebP optimization in development mode
    if (this.isDevelopmentMode()) {
      console.log('🔄 Development mode: Skipping WebP optimization');
      return;
    }

    // Check for WebP support
    this.checkWebPSupport().then(supportsWebP => {
      if (supportsWebP) {
        this.optimizeImagesForWebP();
      }
    });
  }

  /**
   * Check if running in development mode
   */
  private isDevelopmentMode(): boolean {
    return (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.port === '4200'
    );
  }

  /**
   * Check if browser supports WebP
   */
  private checkWebPSupport(): Promise<boolean> {
    return new Promise(resolve => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        resolve(webP.height === 2);
      };
      webP.src =
        'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }

  /**
   * Optimize images for WebP format
   */
  private optimizeImagesForWebP(): void {
    const images = document.querySelectorAll(
      'img[src*=".png"], img[src*=".jpg"], img[src*=".jpeg"]'
    );

    images.forEach(element => {
      const img = element as HTMLImageElement;
      const originalSrc = img.src;
      const webpSrc = this.convertToWebP(originalSrc);

      // Test if WebP version exists
      this.testWebPImage(webpSrc).then(exists => {
        if (exists) {
          img.src = webpSrc;
          img.classList.add('webp-optimized');
        }
      });
    });
  }

  /**
   * Convert image URL to WebP format
   */
  private convertToWebP(src: string): string {
    // Simple conversion - in production, you'd have actual WebP versions
    return src.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  }

  /**
   * Test if WebP image exists
   */
  private testWebPImage(src: string): Promise<boolean> {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = src;
    });
  }

  /**
   * Generate responsive image sources
   */
  generateResponsiveSources(baseSrc: string, sizes: number[] = [320, 640, 1024, 1920]): string {
    const sources = sizes.map(size => {
      const webpSrc = this.convertToWebP(baseSrc);
      return `${webpSrc}?w=${size} ${size}w`;
    });

    return sources.join(', ');
  }

  /**
   * Add WebP support to existing images
   */
  addWebPSupport(): void {
    if (!this.isBrowser) return;

    const images = document.querySelectorAll('img');
    images.forEach(element => {
      const img = element as HTMLImageElement;
      if (!img.hasAttribute('data-webp-processed')) {
        img.setAttribute('data-webp-processed', 'true');

        // Add loading="lazy" for non-critical images
        if (!img.hasAttribute('loading')) {
          img.setAttribute('loading', 'lazy');
        }

        // Add width and height if missing
        if (!img.width && !img.height && img.naturalWidth && img.naturalHeight) {
          img.width = img.naturalWidth;
          img.height = img.naturalHeight;
        }
      }
    });
  }
}
