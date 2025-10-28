import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { GoogleAnalyticsService } from './google-analytics.service';

export interface UserEngagementMetrics {
  pageViews: number;
  sessionDuration: number;
  bounceRate: number;
  scrollDepth: number;
  clickThroughRate: number;
  timeOnPage: number;
  exitRate: number;
  returnVisitorRate: number;
}

export interface UserBehaviorEvent {
  type:
    | 'page_view'
    | 'scroll'
    | 'click'
    | 'hover'
    | 'focus'
    | 'blur'
    | 'form_interaction'
    | 'tool_usage'
    | 'exit_intent'
    | 'page_hidden'
    | 'page_visible'
    | 'mouse_movement';
  timestamp: Date;
  element?: string;
  data?: any;
  sessionId: string;
  userId: string;
}

export interface HeatmapData {
  element: string;
  x: number;
  y: number;
  clicks: number;
  hovers: number;
  viewport: { width: number; height: number };
}

@Injectable({
  providedIn: 'root',
})
export class UserExperienceSignalsService {
  private engagementMetrics: UserEngagementMetrics = {
    pageViews: 0,
    sessionDuration: 0,
    bounceRate: 0,
    scrollDepth: 0,
    clickThroughRate: 0,
    timeOnPage: 0,
    exitRate: 0,
    returnVisitorRate: 0,
  };

  private userBehaviorEvents: UserBehaviorEvent[] = [];
  private heatmapData: HeatmapData[] = [];
  private sessionStartTime: Date = new Date();
  private pageStartTime: Date = new Date();
  private scrollDepth: number = 0;
  private maxScrollDepth: number = 0;
  private clickCount: number = 0;
  private hoverCount: number = 0;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private googleAnalytics: GoogleAnalyticsService
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeUserExperienceTracking();
    }
  }

  private initializeUserExperienceTracking(): void {
    this.setupScrollTracking();
    this.setupClickTracking();
    this.setupHoverTracking();
    this.setupFormInteractionTracking();
    this.setupToolUsageTracking();
    this.setupExitIntentTracking();
    this.setupPageVisibilityTracking();
    this.setupMouseMovementTracking();
  }

  // Scroll Depth Tracking
  private setupScrollTracking(): void {
    let scrollTimeout: any;

    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.trackScrollDepth();
      }, 100);
    });
  }

  private trackScrollDepth(): void {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = Math.round((scrollTop / documentHeight) * 100);

    this.scrollDepth = scrollPercentage;
    this.maxScrollDepth = Math.max(this.maxScrollDepth, scrollPercentage);

    // Track significant scroll milestones
    const milestones = [25, 50, 75, 90, 100];
    milestones.forEach(milestone => {
      if (scrollPercentage >= milestone && scrollPercentage < milestone + 5) {
        this.trackUserBehavior('scroll', `scroll_${milestone}%`, {
          scroll_percentage: scrollPercentage,
          scroll_depth: scrollTop,
          document_height: documentHeight,
        });
      }
    });
  }

  // Click Tracking
  private setupClickTracking(): void {
    document.addEventListener('click', event => {
      this.trackClick(event);
    });
  }

  private trackClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const element = this.getElementSelector(target);

    this.clickCount++;

    // Track heatmap data
    this.trackHeatmapData(element, event.clientX, event.clientY, 'click');

    // Track user behavior
    this.trackUserBehavior('click', element, {
      x: event.clientX,
      y: event.clientY,
      button: event.button,
      ctrlKey: event.ctrlKey,
      shiftKey: event.shiftKey,
      altKey: event.altKey,
    });

    // Track specific element types
    if (target.tagName === 'A') {
      this.trackLinkClick(target as HTMLAnchorElement);
    } else if (target.tagName === 'BUTTON') {
      this.trackButtonClick(target as HTMLButtonElement);
    }
  }

  private trackLinkClick(link: HTMLAnchorElement): void {
    const href = link.href;
    const text = link.textContent?.trim() || '';
    const isExternal = !href.includes(window.location.hostname);

    this.trackUserBehavior('click', 'link', {
      href: href,
      text: text,
      is_external: isExternal,
      target: link.target,
    });
  }

  private trackButtonClick(button: HTMLButtonElement): void {
    const text = button.textContent?.trim() || '';
    const type = button.type;
    const disabled = button.disabled;

    this.trackUserBehavior('click', 'button', {
      text: text,
      type: type,
      disabled: disabled,
      class: button.className,
    });
  }

  // Hover Tracking
  private setupHoverTracking(): void {
    document.addEventListener('mouseover', event => {
      this.trackHover(event);
    });
  }

  private trackHover(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const element = this.getElementSelector(target);

    this.hoverCount++;

    // Track heatmap data
    this.trackHeatmapData(element, event.clientX, event.clientY, 'hover');

    // Track user behavior
    this.trackUserBehavior('hover', element, {
      x: event.clientX,
      y: event.clientY,
    });
  }

  // Form Interaction Tracking
  private setupFormInteractionTracking(): void {
    document.addEventListener('focus', event => {
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT'
      ) {
        this.trackFormInteraction(target, 'focus');
      }
    });

    document.addEventListener('blur', event => {
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT'
      ) {
        this.trackFormInteraction(target, 'blur');
      }
    });

    document.addEventListener('submit', event => {
      const target = event.target as HTMLFormElement;
      this.trackFormInteraction(target, 'submit');
    });
  }

  private trackFormInteraction(element: HTMLElement, action: string): void {
    const elementType = element.tagName.toLowerCase();
    const name = (element as any).name || '';
    const id = element.id || '';

    this.trackUserBehavior('form_interaction', `${elementType}_${action}`, {
      element_type: elementType,
      name: name,
      id: id,
      action: action,
    });
  }

  // Tool Usage Tracking
  private setupToolUsageTracking(): void {
    // Track tool usage events
    const toolElements = document.querySelectorAll('[data-tool]');
    toolElements.forEach(element => {
      element.addEventListener('click', () => {
        const toolName = element.getAttribute('data-tool');
        this.trackUserBehavior('tool_usage', toolName || 'unknown', {
          tool_name: toolName,
        });
      });
    });
  }

  // Exit Intent Tracking
  private setupExitIntentTracking(): void {
    document.addEventListener('mouseleave', event => {
      if (event.clientY <= 0) {
        this.trackExitIntent();
      }
    });
  }

  private trackExitIntent(): void {
    this.trackUserBehavior('exit_intent', 'mouse_leave', {
      time_on_page: Date.now() - this.pageStartTime.getTime(),
      scroll_depth: this.maxScrollDepth,
      click_count: this.clickCount,
      hover_count: this.hoverCount,
    });
  }

  // Page Visibility Tracking
  private setupPageVisibilityTracking(): void {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.trackPageHidden();
      } else {
        this.trackPageVisible();
      }
    });
  }

  private trackPageHidden(): void {
    this.trackUserBehavior('page_hidden', 'visibility_change', {
      time_on_page: Date.now() - this.pageStartTime.getTime(),
    });
  }

  private trackPageVisible(): void {
    this.trackUserBehavior('page_visible', 'visibility_change', {
      time_on_page: Date.now() - this.pageStartTime.getTime(),
    });
  }

  // Mouse Movement Tracking
  private setupMouseMovementTracking(): void {
    let mouseMoveTimeout: any;

    document.addEventListener('mousemove', event => {
      clearTimeout(mouseMoveTimeout);
      mouseMoveTimeout = setTimeout(() => {
        this.trackMouseMovement(event);
      }, 1000); // Track every second
    });
  }

  private trackMouseMovement(event: MouseEvent): void {
    this.trackUserBehavior('mouse_movement', 'mousemove', {
      x: event.clientX,
      y: event.clientY,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    });
  }

  // Heatmap Data Collection
  private trackHeatmapData(element: string, x: number, y: number, type: 'click' | 'hover'): void {
    const existingData = this.heatmapData.find(data => data.element === element);

    if (existingData) {
      if (type === 'click') {
        existingData.clicks++;
      } else {
        existingData.hovers++;
      }
    } else {
      this.heatmapData.push({
        element,
        x,
        y,
        clicks: type === 'click' ? 1 : 0,
        hovers: type === 'hover' ? 1 : 0,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
      });
    }
  }

  // User Behavior Tracking
  private trackUserBehavior(type: UserBehaviorEvent['type'], element: string, data?: any): void {
    const event: UserBehaviorEvent = {
      type,
      timestamp: new Date(),
      element,
      data,
      sessionId: this.getSessionId(),
      userId: this.getUserId(),
    };

    this.userBehaviorEvents.push(event);

    // Keep only last 1000 events
    if (this.userBehaviorEvents.length > 1000) {
      this.userBehaviorEvents.splice(0, this.userBehaviorEvents.length - 1000);
    }

    // Send to analytics
    this.sendToAnalytics(event);
  }

  // Engagement Metrics Calculation
  calculateEngagementMetrics(): UserEngagementMetrics {
    const now = new Date();
    const sessionDuration = now.getTime() - this.sessionStartTime.getTime();

    this.engagementMetrics = {
      pageViews: this.engagementMetrics.pageViews + 1,
      sessionDuration: sessionDuration,
      bounceRate: this.calculateBounceRate(),
      scrollDepth: this.maxScrollDepth,
      clickThroughRate: this.calculateClickThroughRate(),
      timeOnPage: now.getTime() - this.pageStartTime.getTime(),
      exitRate: this.calculateExitRate(),
      returnVisitorRate: this.calculateReturnVisitorRate(),
    };

    return this.engagementMetrics;
  }

  // Public Methods
  getEngagementMetrics(): UserEngagementMetrics {
    return this.engagementMetrics;
  }

  getUserBehaviorEvents(): UserBehaviorEvent[] {
    return this.userBehaviorEvents;
  }

  getHeatmapData(): HeatmapData[] {
    return this.heatmapData;
  }

  getEngagementScore(): number {
    const metrics = this.calculateEngagementMetrics();

    // Calculate engagement score (0-100)
    let score = 0;

    // Scroll depth (30 points max)
    score += Math.min(metrics.scrollDepth * 0.3, 30);

    // Time on page (25 points max)
    const timeScore = Math.min((metrics.timeOnPage / 60000) * 5, 25); // 1 point per 12 seconds
    score += timeScore;

    // Click rate (25 points max)
    const clickScore = Math.min(metrics.clickThroughRate * 25, 25);
    score += clickScore;

    // Session duration (20 points max)
    const sessionScore = Math.min((metrics.sessionDuration / 60000) * 2, 20); // 1 point per 30 seconds
    score += sessionScore;

    return Math.round(Math.min(score, 100));
  }

  // Private Helper Methods
  private getElementSelector(element: HTMLElement): string {
    if (element.id) {
      return `#${element.id}`;
    }

    if (element.className) {
      // Handle both string and DOMTokenList cases safely
      let classNameStr: string = '';
      try {
        if (typeof element.className === 'string') {
          classNameStr = element.className;
        } else {
          // For DOMTokenList or other cases, convert to string
          classNameStr = String(element.className);
        }
      } catch (error) {
        // Fallback if className access fails
        classNameStr = '';
      }

      if (classNameStr) {
        const classes = classNameStr.split(' ').filter((c: string) => c.trim());
        if (classes.length > 0) {
          return `.${classes[0]}`;
        }
      }
    }

    return element.tagName.toLowerCase();
  }

  private getSessionId(): string {
    return sessionStorage.getItem('session_id') || 'unknown';
  }

  private getUserId(): string {
    return localStorage.getItem('user_id') || 'anonymous';
  }

  private sendToAnalytics(event: UserBehaviorEvent): void {
    this.googleAnalytics.trackEvent(event.type, {
      category: 'user_behavior',
      label: event.element,
      ...event.data,
    });
  }

  private calculateBounceRate(): number {
    // Simplified bounce rate calculation
    const singlePageSessions = this.userBehaviorEvents.filter(
      event => event.type === 'page_view'
    ).length;

    const totalSessions = 1; // Current session
    return totalSessions > 0 ? (singlePageSessions / totalSessions) * 100 : 0;
  }

  private calculateClickThroughRate(): number {
    const clicks = this.userBehaviorEvents.filter(event => event.type === 'click').length;
    const pageViews = this.userBehaviorEvents.filter(event => event.type === 'page_view').length;

    return pageViews > 0 ? (clicks / pageViews) * 100 : 0;
  }

  private calculateExitRate(): number {
    const exitIntents = this.userBehaviorEvents.filter(
      event => event.type === 'exit_intent'
    ).length;
    const pageViews = this.userBehaviorEvents.filter(event => event.type === 'page_view').length;

    return pageViews > 0 ? (exitIntents / pageViews) * 100 : 0;
  }

  private calculateReturnVisitorRate(): number {
    // This would typically be calculated over multiple sessions
    // For now, return 0 as we only have current session data
    return 0;
  }
}
