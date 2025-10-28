import { Component, Input, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ContentFreshnessService, ContentMetadata } from '../../services/content-freshness.service';

@Component({
  selector: 'app-content-freshness',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="content-freshness-container">
      <!-- Content Metadata Display -->
      <div class="content-metadata">
        <div class="flex items-center justify-between mb-4">
          <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Content Information</h4>
          <div class="flex items-center space-x-2">
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full mr-2" [class]="getFreshnessColorClass()"></div>
              <span class="text-sm font-medium" [class]="getFreshnessTextClass()">
                {{ getFreshnessLabel() }}
              </span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Last Updated:</span>
              <span class="text-gray-900 dark:text-white font-medium">
                {{ formatDate(contentMetadata?.lastUpdated) }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Version:</span>
              <span class="text-gray-900 dark:text-white font-medium">
                {{ contentMetadata?.version }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Author:</span>
              <span class="text-gray-900 dark:text-white font-medium">
                {{ contentMetadata?.author }}
              </span>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Read Time:</span>
              <span class="text-gray-900 dark:text-white font-medium">
                {{ contentMetadata?.readTime }} min
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Word Count:</span>
              <span class="text-gray-900 dark:text-white font-medium">
                {{ contentMetadata?.wordCount?.toLocaleString() }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Freshness Score:</span>
              <span class="text-gray-900 dark:text-white font-medium">
                {{ contentMetadata?.freshnessScore }}/100
              </span>
            </div>
          </div>
        </div>

        <!-- Tags -->
        <div *ngIf="hasTags()" class="mt-4">
          <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags:</h5>
          <div class="flex flex-wrap gap-2">
            <span
              *ngFor="let tag of contentMetadata?.tags || []"
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>

      <!-- Recent Updates Section -->
      <div *ngIf="recentUpdates.length > 0" class="mt-6">
        <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Updates</h4>
        <div class="space-y-3">
          <div
            *ngFor="let update of recentUpdates.slice(0, 3)"
            class="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-2 mb-1">
                  <span
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                    [class]="getUpdateTypeClass(update.updateType)"
                  >
                    {{ update.updateType }}
                  </span>
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    {{ formatDate(update.timestamp) }}
                  </span>
                </div>
                <p class="text-sm text-gray-700 dark:text-gray-300">
                  {{ update.description }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">by {{ update.author }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Quality Indicators -->
      <div class="mt-6">
        <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Content Quality</h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 text-center"
          >
            <div class="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
              {{ contentMetadata?.freshnessScore || 0 }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Freshness Score</div>
          </div>
          <div
            class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 text-center"
          >
            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              {{ contentMetadata?.wordCount || 0 }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Word Count</div>
          </div>
          <div
            class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 text-center"
          >
            <div class="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
              {{ contentMetadata?.readTime || 0 }}m
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Read Time</div>
          </div>
        </div>
      </div>

      <!-- SEO Indicators -->
      <div class="mt-6">
        <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">SEO Indicators</h4>
        <div class="space-y-3">
          <div
            class="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700"
          >
            <div class="flex items-center">
              <svg
                class="w-5 h-5 text-green-600 dark:text-green-400 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="text-sm font-medium text-green-800 dark:text-green-300">
                Content is up-to-date
              </span>
            </div>
            <span class="text-xs text-green-600 dark:text-green-400">
              {{ getDaysSinceUpdate() }} days ago
            </span>
          </div>

          <div
            class="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700"
          >
            <div class="flex items-center">
              <svg
                class="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="text-sm font-medium text-blue-800 dark:text-blue-300">
                Comprehensive content
              </span>
            </div>
            <span class="text-xs text-blue-600 dark:text-blue-400">
              {{ getContentLengthRating() }}
            </span>
          </div>

          <div
            class="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700"
          >
            <div class="flex items-center">
              <svg
                class="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="text-sm font-medium text-purple-800 dark:text-purple-300">
                Well-structured content
              </span>
            </div>
            <span class="text-xs text-purple-600 dark:text-purple-400">
              {{ contentMetadata?.tags?.length || 0 }} tags
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .content-freshness-container {
        @apply bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg;
      }
    `,
  ],
})
export class ContentFreshnessComponent implements OnInit {
  @Input() contentId: string = '';
  @Input() showRecentUpdates: boolean = true;
  @Input() showQualityIndicators: boolean = true;
  @Input() showSEOIndicators: boolean = true;

  contentMetadata: ContentMetadata | undefined;
  recentUpdates: any[] = [];

  constructor(
    private contentFreshnessService: ContentFreshnessService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (this.contentId) {
      this.loadContentMetadata();
      if (this.showRecentUpdates) {
        this.loadRecentUpdates();
      }
    }
  }

  private loadContentMetadata(): void {
    this.contentMetadata = this.contentFreshnessService.getContentMetadata(this.contentId);
  }

  private loadRecentUpdates(): void {
    this.recentUpdates = this.contentFreshnessService.getContentUpdates(this.contentId);
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'Unknown';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  getFreshnessColorClass(): string {
    const score = this.contentMetadata?.freshnessScore || 0;
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  }

  getFreshnessTextClass(): string {
    const score = this.contentMetadata?.freshnessScore || 0;
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    if (score >= 40) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  }

  getFreshnessLabel(): string {
    const score = this.contentMetadata?.freshnessScore || 0;
    if (score >= 80) return 'Very Fresh';
    if (score >= 60) return 'Fresh';
    if (score >= 40) return 'Moderate';
    if (score >= 20) return 'Stale';
    return 'Very Stale';
  }

  getUpdateTypeClass(updateType: string): string {
    switch (updateType) {
      case 'critical':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'major':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300';
      case 'minor':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  }

  getDaysSinceUpdate(): number {
    if (!this.contentMetadata?.lastUpdated) return 0;
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - this.contentMetadata.lastUpdated.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getContentLengthRating(): string {
    const wordCount = this.contentMetadata?.wordCount || 0;
    if (wordCount >= 2000) return 'Excellent';
    if (wordCount >= 1000) return 'Good';
    if (wordCount >= 500) return 'Fair';
    return 'Short';
  }

  hasTags(): boolean {
    return !!(this.contentMetadata?.tags && this.contentMetadata.tags.length > 0);
  }
}
