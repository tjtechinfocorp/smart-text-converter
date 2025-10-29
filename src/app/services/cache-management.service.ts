import { Injectable, Inject, PLATFORM_ID, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CacheManagementService {
  private isBrowser: boolean;
  private readonly CACHE_VERSION_KEY = 'app_cache_version';
  private readonly CURRENT_VERSION = '2.0.1761764652531'; // Update this with each deployment

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private ngZone: NgZone) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.initializeCacheManagement();
    }
  }

  private initializeCacheManagement(): void {
    // Check if this is a new version
    this.checkForNewVersion();

    // Set up cache invalidation strategies
    this.setupCacheInvalidation();

    // Add version to page title for debugging
    this.addVersionToTitle();
  }

  private checkForNewVersion(): void {
    const storedVersion = localStorage.getItem(this.CACHE_VERSION_KEY);

    if (storedVersion !== this.CURRENT_VERSION) {
      console.log(`🔄 New version detected: ${storedVersion} → ${this.CURRENT_VERSION}`);

      // Clear all caches for new version
      this.clearAllCaches();

      // Store new version
      localStorage.setItem(this.CACHE_VERSION_KEY, this.CURRENT_VERSION);

      // Show update notification
      this.showUpdateNotification();
    }
  }

  private clearAllCaches(): void {
    try {
      // Clear localStorage (except important data)
      this.clearSelectiveLocalStorage();

      // Clear sessionStorage
      sessionStorage.clear();

      // Clear IndexedDB if used
      this.clearIndexedDB();

      // Clear service worker caches
      this.clearServiceWorkerCaches();

      console.log('🧹 All caches cleared for new version');
    } catch (error) {
      console.error('Error clearing caches:', error);
    }
  }

  private clearSelectiveLocalStorage(): void {
    const keysToKeep = ['theme_preference', 'language_preference', 'user_settings'];

    const allKeys = Object.keys(localStorage);
    const keysToRemove = allKeys.filter(key => !keysToKeep.includes(key));

    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
  }

  private clearIndexedDB(): void {
    if ('indexedDB' in window) {
      // Clear any IndexedDB databases if you use them
      // This is a placeholder for future IndexedDB usage
    }
  }

  private clearServiceWorkerCaches(): void {
    if ('serviceWorker' in navigator && 'caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          caches.delete(cacheName);
        });
      });
    }
  }

  private setupCacheInvalidation(): void {
    // Add cache-busting headers to fetch requests
    this.interceptFetchRequests();

    // Set up periodic cache checks
    this.setupPeriodicCacheCheck();
  }

  private interceptFetchRequests(): void {
    if (typeof window !== 'undefined' && window.fetch) {
      const originalFetch = window.fetch;

      window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
        const url = typeof input === 'string' ? input : input.toString();

        // Add cache-busting parameter to API requests
        if (url.includes('/api/') || url.includes('json')) {
          const separator = url.includes('?') ? '&' : '?';
          const cacheBuster = `${separator}_cb=${Date.now()}`;
          input = url + cacheBuster;
        }

        return originalFetch(input, init);
      };
    }
  }

  private setupPeriodicCacheCheck(): void {
    // Check for updates every 30 minutes
    // Run outside Angular zone to avoid blocking hydration
    this.ngZone.runOutsideAngular(() => {
      setInterval(() => {
        // Run the update check back inside Angular zone
        this.ngZone.run(() => {
          this.checkForUpdates();
        });
      }, 30 * 60 * 1000);
    });
  }

  private checkForUpdates(): void {
    // Check if there's a new version available
    fetch(`/version.json?t=${Date.now()}`)
      .then(response => response.json())
      .then(data => {
        if (data.version !== this.CURRENT_VERSION) {
          this.showUpdateAvailableNotification();
        }
      })
      .catch(error => {
        // Silently fail - version check is not critical
        console.debug('Version check failed:', error);
      });
  }

  private showUpdateNotification(): void {
    // Show a subtle notification that the app has been updated
    if (!environment.production) {
      console.log('🎉 App updated to version', this.CURRENT_VERSION);
    }
  }

  private showUpdateAvailableNotification(): void {
    // Show notification that an update is available
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: #3b82f6;
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
        <div style="margin-bottom: 8px;">A new version is available. Refresh to get the latest features.</div>
        <button onclick="window.location.reload()" style="
          background: white;
          color: #3b82f6;
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

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 10000);
  }

  private addVersionToTitle(): void {
    if (!environment.production) {
      const originalTitle = document.title;
      document.title = `${originalTitle} (v${this.CURRENT_VERSION})`;
    }
  }

  // Public methods
  forceRefresh(): void {
    if (this.isBrowser) {
      // Clear caches and reload
      this.clearAllCaches();
      window.location.reload();
    }
  }

  getCurrentVersion(): string {
    return this.CURRENT_VERSION;
  }

  isNewVersion(): boolean {
    const storedVersion = localStorage.getItem(this.CACHE_VERSION_KEY);
    return storedVersion !== this.CURRENT_VERSION;
  }

  // Method to be called when you deploy a new version
  updateVersion(newVersion: string): void {
    localStorage.setItem(this.CACHE_VERSION_KEY, newVersion);
    this.clearAllCaches();
  }
}
