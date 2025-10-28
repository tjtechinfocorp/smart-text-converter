import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslatedTextComponent } from '../translated-text/translated-text.component';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterModule, TranslatedTextComponent],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

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
