import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ComparisonMetric {
  name: string;
  smartTextConverter: number;
  competitor: number;
  maxValue: number;
  unit?: string;
}

@Component({
  selector: 'app-comparison-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg"
    >
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
        Interactive Comparison: {{ title }}
      </h3>

      <div class="space-y-6">
        <div *ngFor="let metric of metrics" class="space-y-2">
          <div class="flex justify-between items-center">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{
              metric.name
            }}</span>
            <div class="flex gap-4 text-sm">
              <span class="text-blue-600 dark:text-blue-400 font-semibold">
                SmartTextConverter: {{ metric.smartTextConverter }}{{ metric.unit || '' }}
              </span>
              <span class="text-gray-600 dark:text-gray-400">
                {{ competitorName }}: {{ metric.competitor }}{{ metric.unit || '' }}
              </span>
            </div>
          </div>

          <!-- Progress bars -->
          <div class="space-y-1">
            <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>SmartTextConverter</span>
              <span>{{ competitorName }}</span>
            </div>
            <div class="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <!-- SmartTextConverter bar -->
              <div
                class="absolute left-0 top-0 h-full bg-blue-500 rounded-l-full transition-all duration-1000 ease-out"
                [style.width.%]="(metric.smartTextConverter / metric.maxValue) * 50"
              ></div>
              <!-- Competitor bar -->
              <div
                class="absolute right-0 top-0 h-full bg-gray-400 rounded-r-full transition-all duration-1000 ease-out"
                [style.width.%]="(metric.competitor / metric.maxValue) * 50"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Winner indicator -->
      <div
        class="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg border border-blue-200 dark:border-blue-700"
      >
        <div class="flex items-center justify-center">
          <div class="text-center">
            <div class="text-2xl mb-2">🏆</div>
            <h4 class="text-lg font-semibold text-blue-800 dark:text-blue-300">
              SmartTextConverter Wins!
            </h4>
            <p class="text-sm text-blue-600 dark:text-blue-400">
              Superior performance across all metrics
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .transition-all {
        transition: all 1s ease-out;
      }
    `,
  ],
})
export class ComparisonWidgetComponent {
  @Input() title: string = 'Performance Metrics';
  @Input() metrics: ComparisonMetric[] = [];
  @Input() competitorName: string = 'Competitor';
}
