import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { PerformanceService } from '../../services/performance.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-performance-monitor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="showMonitor && !isProduction"
      class="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 z-50 max-w-sm"
    >
      <div class="flex justify-between items-center mb-3">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Performance Monitor</h3>
        <button
          (click)="toggleMonitor()"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>

      <div class="space-y-2 text-xs">
        <div *ngFor="let metric of metrics" class="flex justify-between items-center">
          <span class="text-gray-600 dark:text-gray-400">{{ metric.name }}:</span>
          <span
            class="font-mono px-2 py-1 rounded text-xs"
            [ngClass]="{
              'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200':
                metric.status === 'good',
              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200':
                metric.status === 'needs_improvement',
              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': metric.status === 'poor',
            }"
          >
            {{ metric.value | number : '1.0-2' }}{{ metric.unit }}
          </span>
        </div>

        <div class="pt-2 border-t border-gray-200 dark:border-gray-700">
          <div class="flex justify-between items-center">
            <span class="text-gray-600 dark:text-gray-400">Load Time:</span>
            <span class="font-mono text-gray-900 dark:text-white">{{ loadTime }}ms</span>
          </div>
        </div>
      </div>

      <div class="mt-3 flex space-x-2">
        <button
          (click)="refreshMetrics()"
          class="text-xs px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded hover:bg-blue-200 dark:hover:bg-blue-800"
        >
          Refresh
        </button>
        <button
          (click)="clearMetrics()"
          class="text-xs px-2 py-1 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          Clear
        </button>
      </div>
    </div>

    <!-- Toggle button when monitor is hidden -->
    <button
      *ngIf="!showMonitor && !isProduction"
      (click)="toggleMonitor()"
      class="fixed bottom-4 right-4 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 z-50"
      title="Show Performance Monitor"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        ></path>
      </svg>
    </button>
  `,
  styles: [
    `
      .performance-monitor {
        font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New',
          monospace;
      }
    `,
  ],
})
export class PerformanceMonitorComponent implements OnInit, OnDestroy {
  showMonitor = false;
  isProduction = environment.production;
  metrics: Array<{ name: string; value: number; unit: string; status: string }> = [];
  loadTime = 0;
  private intervalId: any;

  constructor(
    private performanceService: PerformanceService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId) && !this.isProduction) {
      this.loadMetrics();
      this.startMonitoring();
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  toggleMonitor(): void {
    this.showMonitor = !this.showMonitor;
  }

  loadMetrics(): void {
    const webVitals = this.performanceService.checkCoreWebVitalsThresholds();
    this.metrics = [];

    // LCP (Largest Contentful Paint)
    if (webVitals['lcp']) {
      this.metrics.push({
        name: 'LCP',
        value: webVitals['lcp'].value,
        unit: 'ms',
        status: webVitals['lcp'].status,
      });
    }

    // FID (First Input Delay)
    if (webVitals['fid']) {
      this.metrics.push({
        name: 'FID',
        value: webVitals['fid'].value,
        unit: 'ms',
        status: webVitals['fid'].status,
      });
    }

    // CLS (Cumulative Layout Shift)
    if (webVitals['cls']) {
      this.metrics.push({
        name: 'CLS',
        value: webVitals['cls'].value,
        unit: '',
        status: webVitals['cls'].status,
      });
    }

    // Load time
    this.loadTime = this.getLoadTime();
  }

  refreshMetrics(): void {
    this.loadMetrics();
  }

  clearMetrics(): void {
    this.performanceService.clearStoredWebVitals();
    this.loadMetrics();
  }

  private startMonitoring(): void {
    // Update metrics every 5 seconds
    // Run outside Angular zone to avoid blocking hydration
    this.ngZone.runOutsideAngular(() => {
      this.intervalId = setInterval(() => {
        // Run the metrics update back inside Angular zone
        this.ngZone.run(() => {
          this.loadMetrics();
        });
      }, 5000);
    });
  }

  private getLoadTime(): number {
    if (typeof performance !== 'undefined' && performance.timing) {
      return performance.timing.loadEventEnd - performance.timing.fetchStart;
    }
    return 0;
  }

  private getNetworkScore(effectiveType: string): number {
    switch (effectiveType) {
      case '4g':
        return 100;
      case '3g':
        return 75;
      case '2g':
        return 50;
      case 'slow-2g':
        return 25;
      default:
        return 0;
    }
  }

  private getNetworkStatus(effectiveType: string): string {
    switch (effectiveType) {
      case '4g':
        return 'good';
      case '3g':
        return 'warning';
      case '2g':
      case 'slow-2g':
        return 'poor';
      default:
        return 'warning';
    }
  }
}
