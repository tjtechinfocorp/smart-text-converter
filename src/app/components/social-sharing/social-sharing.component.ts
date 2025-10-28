import { Component, Input, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

export interface SocialShareData {
  title: string;
  description: string;
  url: string;
  image?: string;
  hashtags?: string[];
}

@Component({
  selector: 'app-social-sharing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="social-sharing-container">
      <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Share this content</h4>
      <div class="flex flex-wrap gap-3">
        <!-- Twitter Share -->
        <button
          (click)="shareOnTwitter()"
          class="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          aria-label="Share on Twitter"
        >
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
            />
          </svg>
          Twitter
        </button>

        <!-- LinkedIn Share -->
        <button
          (click)="shareOnLinkedIn()"
          class="flex items-center px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          aria-label="Share on LinkedIn"
        >
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
            />
          </svg>
          LinkedIn
        </button>

        <!-- Facebook Share -->
        <button
          (click)="shareOnFacebook()"
          class="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          aria-label="Share on Facebook"
        >
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
            />
          </svg>
          Facebook
        </button>

        <!-- Reddit Share -->
        <button
          (click)="shareOnReddit()"
          class="flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          aria-label="Share on Reddit"
        >
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"
            />
          </svg>
          Reddit
        </button>

        <!-- Copy Link -->
        <button
          (click)="copyToClipboard()"
          class="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          aria-label="Copy link to clipboard"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          Copy Link
        </button>
      </div>

      <!-- Share Count Display -->
      <div *ngIf="shareCounts.total > 0" class="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Share Statistics</h5>
        <div class="flex flex-wrap gap-4 text-sm">
          <span class="text-blue-600 dark:text-blue-400">
            <strong>{{ shareCounts.twitter }}</strong> Twitter shares
          </span>
          <span class="text-blue-700 dark:text-blue-500">
            <strong>{{ shareCounts.linkedin }}</strong> LinkedIn shares
          </span>
          <span class="text-blue-600 dark:text-blue-400">
            <strong>{{ shareCounts.facebook }}</strong> Facebook shares
          </span>
          <span class="text-orange-500 dark:text-orange-400">
            <strong>{{ shareCounts.reddit }}</strong> Reddit shares
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .social-sharing-container {
        @apply bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg;
      }

      .social-sharing-container button {
        @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800;
      }

      .social-sharing-container button:active {
        @apply transform scale-95;
      }
    `,
  ],
})
export class SocialSharingComponent {
  @Input() shareData: SocialShareData = {
    title: '',
    description: '',
    url: '',
    image: '',
    hashtags: [],
  };

  shareCounts = {
    twitter: 0,
    linkedin: 0,
    facebook: 0,
    reddit: 0,
    total: 0,
  };

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  private addUTMParameters(url: string, source: string, medium: string = 'social'): string {
    const urlObj = new URL(url);
    urlObj.searchParams.set('utm_source', source);
    urlObj.searchParams.set('utm_medium', medium);
    urlObj.searchParams.set('utm_campaign', 'social_sharing');
    return urlObj.toString();
  }

  shareOnTwitter(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const hashtags = this.shareData.hashtags?.join(',') || 'textconverter,caseconverter';
    const text = `${this.shareData.title} - ${this.shareData.description}`;
    const urlWithUTM = this.addUTMParameters(this.shareData.url, 'twitter');
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(urlWithUTM)}&hashtags=${hashtags}`;

    this.openShareWindow(url, 'twitter');
    this.trackShare('twitter');
  }

  shareOnLinkedIn(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const urlWithUTM = this.addUTMParameters(this.shareData.url, 'linkedin');
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      urlWithUTM
    )}`;

    this.openShareWindow(url, 'linkedin');
    this.trackShare('linkedin');
  }

  shareOnFacebook(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const urlWithUTM = this.addUTMParameters(this.shareData.url, 'facebook');
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlWithUTM)}`;

    this.openShareWindow(url, 'facebook');
    this.trackShare('facebook');
  }

  shareOnReddit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const title = encodeURIComponent(this.shareData.title);
    const urlWithUTM = this.addUTMParameters(this.shareData.url, 'reddit');
    const url = encodeURIComponent(urlWithUTM);
    const redditUrl = `https://reddit.com/submit?title=${title}&url=${url}`;

    this.openShareWindow(redditUrl, 'reddit');
    this.trackShare('reddit');
  }

  copyToClipboard(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(this.shareData.url).then(() => {
        this.showCopyFeedback();
      });
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = this.shareData.url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      this.showCopyFeedback();
    }

    this.trackShare('copy');
  }

  private openShareWindow(url: string, platform: string): void {
    const width = 600;
    const height = 400;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    const shareWindow = window.open(
      url,
      `${platform}-share`,
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    );

    if (shareWindow) {
      shareWindow.focus();
    }
  }

  private trackShare(platform: string): void {
    // Track share event in privacy-compliant analytics
    // Note: Analytics tracking would be handled by PrivacyAnalyticsService if injected
    console.log('📊 Share tracked:', platform, this.shareData.url);

    // Update share counts (in real app, this would come from API)
    this.shareCounts[platform as keyof typeof this.shareCounts]++;
    this.shareCounts.total++;
  }

  private showCopyFeedback(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Show temporary feedback that link was copied
    const button = document.querySelector(
      '[aria-label="Copy link to clipboard"]'
    ) as HTMLButtonElement;
    if (button) {
      const originalText = button.textContent;
      button.textContent = 'Copied!';
      button.classList.add('bg-green-700', 'hover:bg-green-800');
      button.classList.remove('bg-gray-600', 'hover:bg-gray-700');

      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('bg-green-700', 'hover:bg-green-800');
        button.classList.add('bg-gray-600', 'hover:bg-gray-700');
      }, 2000);
    }
  }
}
