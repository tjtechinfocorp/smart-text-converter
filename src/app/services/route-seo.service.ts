import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { PageSEOService } from './page-seo.service';

@Injectable({
  providedIn: 'root',
})
export class RouteSEOService implements OnInit, OnDestroy {
  private subscription: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private pageSEOService: PageSEOService
  ) {}

  ngOnInit(): void {
    this.setupRouteChangeListener();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * Setup listener for route changes to apply SEO data
   */
  private setupRouteChangeListener(): void {
    this.subscription = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map(route => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter(route => route.outlet === 'primary'),
        mergeMap(route => route.url)
      )
      .subscribe(() => {
        this.applySEOForCurrentRoute();
      });
  }

  /**
   * Apply SEO data for the current route
   */
  private applySEOForCurrentRoute(): void {
    const currentUrl = this.router.url;
    const route = currentUrl.startsWith('/') ? currentUrl.substring(1) : currentUrl;

    // Handle root route
    const routeKey = route === '' ? '' : route;

    this.pageSEOService.applySEOForRoute(routeKey);
  }

  /**
   * Manually apply SEO for a specific route
   */
  applySEOForRoute(route: string): void {
    this.pageSEOService.applySEOForRoute(route);
  }

  /**
   * Get current route
   */
  getCurrentRoute(): string {
    const currentUrl = this.router.url;
    return currentUrl.startsWith('/') ? currentUrl.substring(1) : currentUrl;
  }
}
