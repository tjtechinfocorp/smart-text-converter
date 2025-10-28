import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';
import { CacheManagementService } from './cache-management.service';

@Injectable({
  providedIn: 'root',
})
export class SwRegistrationService {
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cacheManagementService: CacheManagementService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /**
   * Register service worker for better performance and caching
   */
  async registerServiceWorker(): Promise<void> {
    if (!this.isBrowser) return;

    // Only register service worker in production
    if (!environment.production) {
      console.log('🔧 Service Worker registration skipped in development mode');
      // Unregister any existing service workers in development
      await this.unregisterServiceWorker();
      return;
    }

    if ('serviceWorker' in navigator) {
      try {
        // Check if service worker file exists
        const response = await fetch('/sw.js', { method: 'HEAD' });
        if (response.ok) {
          const registration = await navigator.serviceWorker.register('/sw.js');

          console.log('✅ Service Worker registered successfully (Production)');

          // Handle updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content is available, prompt user to refresh
                  this.promptUserToRefresh();
                }
              });
            }
          });

          // Listen for messages from service worker
          navigator.serviceWorker.addEventListener('message', event => {
            if (event.data.type === 'NEW_VERSION_AVAILABLE') {
              this.showUpdateNotification(event.data.version);
            }
          });
        } else {
          if (environment.production) {
            console.warn('⚠️ Service Worker file not found in production');
          } else {
            console.log('🔧 Service Worker file not found, skipping registration (Development)');
          }
        }
      } catch (error) {
        if (environment.production) {
          console.warn('❌ Service Worker registration failed:', error);
        } else {
          console.log(
            '🔧 Service Worker registration skipped (Development):',
            error instanceof Error ? error.message : 'Unknown error'
          );
        }
      }
    }
  }

  /**
   * Show update notification when new version is available
   */
  private showUpdateNotification(version: string): void {
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-family: system-ui, sans-serif;
        font-size: 14px;
        max-width: 300px;
      ">
        <div style="font-weight: 600; margin-bottom: 4px;">🔄 Update Available</div>
        <div style="margin-bottom: 8px;">Version ${version} is available. Refresh to get the latest features.</div>
        <button onclick="window.location.reload()" style="
          background: white;
          color: #10b981;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          font-weight: 600;
          cursor: pointer;
          margin-right: 8px;
        ">Refresh Now</button>
        <button onclick="this.parentElement.parentElement.remove()" style="
          background: transparent;
          color: white;
          border: 1px solid white;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
        ">Later</button>
      </div>
    `;

    document.body.appendChild(notification);

    // Auto-remove after 15 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 15000);
  }

  /**
   * Prompt user to refresh when new content is available
   */
  private promptUserToRefresh(): void {
    if (confirm('New version available! Refresh to update?')) {
      window.location.reload();
    }
  }

  /**
   * Unregister service worker
   */
  async unregisterServiceWorker(): Promise<void> {
    if (!this.isBrowser) return;

    if ('serviceWorker' in navigator) {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        if (registrations.length > 0) {
          await Promise.all(registrations.map(registration => registration.unregister()));
          if (!environment.production) {
            console.log('🔧 Service Worker unregistered in development mode');
          }
        } else {
          if (!environment.production) {
            console.log('🔧 No Service Workers to unregister');
          }
        }
      } catch (error) {
        if (!environment.production) {
          console.warn('Failed to unregister Service Worker:', error);
        }
      }
    }
  }

  /**
   * Check if service worker is supported
   */
  isServiceWorkerSupported(): boolean {
    return this.isBrowser && 'serviceWorker' in navigator;
  }
}
