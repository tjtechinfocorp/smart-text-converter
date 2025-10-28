import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ComparisonFeature {
  name: string;
  smartTextConverter: string | boolean;
  competitor: string | boolean;
  smartTextConverterBetter?: boolean;
}

@Component({
  selector: 'app-comparison-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overflow-x-auto">
      <table class="w-full border-collapse border border-gray-300 dark:border-gray-600 mb-8">
        <thead>
          <tr class="bg-gray-50 dark:bg-gray-800">
            <th
              class="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left font-semibold text-gray-900 dark:text-white"
            >
              Feature
            </th>
            <th
              class="border border-gray-300 dark:border-gray-600 px-4 py-3 text-center font-semibold text-blue-600 dark:text-blue-400"
            >
              SmartTextConverter
            </th>
            <th
              class="border border-gray-300 dark:border-gray-600 px-4 py-3 text-center font-semibold text-gray-600 dark:text-gray-400"
            >
              {{ competitorName }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            *ngFor="let feature of features; let i = index"
            [class]="i % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'"
          >
            <td
              class="border border-gray-300 dark:border-gray-600 px-4 py-3 font-medium text-gray-900 dark:text-white"
            >
              {{ feature.name }}
            </td>
            <td class="border border-gray-300 dark:border-gray-600 px-4 py-3 text-center">
              <span
                *ngIf="typeof feature.smartTextConverter === 'boolean'"
                [class]="
                  feature.smartTextConverter
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                "
              >
                {{ feature.smartTextConverter ? '✅ Yes' : '❌ No' }}
              </span>
              <span
                *ngIf="typeof feature.smartTextConverter === 'string'"
                [class]="
                  feature.smartTextConverterBetter
                    ? 'text-green-600 dark:text-green-400 font-semibold'
                    : 'text-gray-600 dark:text-gray-400'
                "
              >
                {{ feature.smartTextConverter }}
              </span>
            </td>
            <td class="border border-gray-300 dark:border-gray-600 px-4 py-3 text-center">
              <span
                *ngIf="typeof feature.competitor === 'boolean'"
                [class]="
                  feature.competitor
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                "
              >
                {{ feature.competitor ? '✅ Yes' : '❌ No' }}
              </span>
              <span
                *ngIf="typeof feature.competitor === 'string'"
                class="text-gray-600 dark:text-gray-400"
              >
                {{ feature.competitor }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile-optimized comparison cards -->
    <div class="md:hidden space-y-4">
      <div
        *ngFor="let feature of features"
        class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
      >
        <h3 class="font-semibold text-gray-900 dark:text-white mb-3">{{ feature.name }}</h3>
        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <span class="text-sm text-blue-600 dark:text-blue-400 font-medium"
              >SmartTextConverter</span
            >
            <span
              *ngIf="typeof feature.smartTextConverter === 'boolean'"
              [class]="
                feature.smartTextConverter
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              "
            >
              {{ feature.smartTextConverter ? '✅ Yes' : '❌ No' }}
            </span>
            <span
              *ngIf="typeof feature.smartTextConverter === 'string'"
              [class]="
                feature.smartTextConverterBetter
                  ? 'text-green-600 dark:text-green-400 font-semibold'
                  : 'text-gray-600 dark:text-gray-400'
              "
            >
              {{ feature.smartTextConverter }}
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600 dark:text-gray-400 font-medium">{{
              competitorName
            }}</span>
            <span
              *ngIf="typeof feature.competitor === 'boolean'"
              [class]="
                feature.competitor
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              "
            >
              {{ feature.competitor ? '✅ Yes' : '❌ No' }}
            </span>
            <span
              *ngIf="typeof feature.competitor === 'string'"
              class="text-gray-600 dark:text-gray-400"
            >
              {{ feature.competitor }}
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      @media (max-width: 768px) {
        .overflow-x-auto {
          display: none;
        }
      }

      @media (min-width: 769px) {
        .md\\:hidden {
          display: none;
        }
      }
    `,
  ],
})
export class ComparisonTableComponent {
  @Input() features: ComparisonFeature[] = [];
  @Input() competitorName: string = 'Competitor';
}
