import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TranslatedTextComponent } from '../translated-text/translated-text.component';
import { InternalLinkingService, InternalLinkItem } from '../../services/internal-linking.service';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterModule, TranslatedTextComponent],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  relatedLinks: InternalLinkItem[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private internalLinking: InternalLinkingService
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.computeRelatedLinks();
      this.router.events.subscribe(() => this.computeRelatedLinks());
    }
  }

  private computeRelatedLinks(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const path = window.location.pathname;
    this.relatedLinks = this.internalLinking.getRelatedLinks(path, 5);
  }

  /**
   * Smoothly scroll to the top of the page
   */
  scrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }
  }
}
