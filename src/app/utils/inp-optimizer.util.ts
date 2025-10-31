/**
 * INP (Interaction to Next Paint) Optimization Utilities
 * Helps reduce interaction delays by optimizing event handlers
 */

/**
 * Debounce function to limit how often a function can fire
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };

    const callNow = immediate && !timeout;

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) func(...args);
  };
}

/**
 * Throttle function to ensure a function is only called once per interval
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Schedule non-urgent work during idle time
 * Helps prevent blocking interactions
 */
export function scheduleIdleTask(callback: () => void, timeout = 2000): void {
  if (typeof window === 'undefined') {
    callback();
    return;
  }

  if ('requestIdleCallback' in window) {
    requestIdleCallback(callback, { timeout });
  } else {
    setTimeout(callback, 1);
  }
}

/**
 * Batch DOM updates to reduce reflows
 */
export class DOMBatcher {
  private pendingUpdates: (() => void)[] = [];
  private scheduled = false;

  add(update: () => void): void {
    this.pendingUpdates.push(update);
    this.scheduleFlush();
  }

  private scheduleFlush(): void {
    if (this.scheduled) return;

    this.scheduled = true;
    if (typeof window !== 'undefined' && 'requestAnimationFrame' in window) {
      requestAnimationFrame(() => {
        this.flush();
      });
    } else {
      setTimeout(() => this.flush(), 0);
    }
  }

  private flush(): void {
    const updates = this.pendingUpdates;
    this.pendingUpdates = [];
    this.scheduled = false;

    updates.forEach(update => update());
  }
}
