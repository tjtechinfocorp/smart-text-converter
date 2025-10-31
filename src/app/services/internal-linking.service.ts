import { Injectable } from '@angular/core';

export interface InternalLinkItem {
  title: string;
  url: string;
}

@Injectable({ providedIn: 'root' })
export class InternalLinkingService {
  private readonly relatedMap: Record<string, InternalLinkItem[]> = {
    '/': [
      { title: 'Case Converter', url: '/case-converter' },
      { title: 'Text Formatter', url: '/text-formatter' },
      { title: 'Text Analyzer', url: '/text-analyzer' },
      { title: 'Encode/Decode', url: '/encode-decode' },
      { title: 'Blog', url: '/blog' },
    ],
    '/case-converter': [
      { title: 'Text Formatter', url: '/text-formatter' },
      { title: 'JSON Formatter', url: '/json/formatter' },
      { title: 'Text Analyzer', url: '/text-analyzer' },
      { title: 'Developer Tools', url: '/js/formatter' },
      { title: 'Blog', url: '/blog' },
    ],
    '/text-formatter': [
      { title: 'Case Converter', url: '/case-converter' },
      { title: 'Line Tools', url: '/line-tools' },
      { title: 'JSON Formatter', url: '/json/formatter' },
      { title: 'HTML Formatter', url: '/html/formatter' },
      { title: 'CSS Formatter', url: '/css/formatter' },
    ],
    '/text-analyzer': [
      { title: 'Text Formatter', url: '/text-formatter' },
      { title: 'Encode/Decode', url: '/encode-decode' },
      { title: 'JSON Parser', url: '/json/parser' },
      { title: 'JSON Formatter', url: '/json/formatter' },
      { title: 'Blog', url: '/blog' },
    ],
    '/encode-decode': [
      { title: 'Text Formatter', url: '/text-formatter' },
      { title: 'JSON Formatter', url: '/json/formatter' },
      { title: 'JSON Parser', url: '/json/parser' },
      { title: 'Text Analyzer', url: '/text-analyzer' },
      { title: 'Case Converter', url: '/case-converter' },
    ],
    '/json/formatter': [
      { title: 'JSON Parser', url: '/json/parser' },
      { title: 'JavaScript Formatter', url: '/js/formatter' },
      { title: 'Text Formatter', url: '/text-formatter' },
      { title: 'Text Analyzer', url: '/text-analyzer' },
      { title: 'Blog: JSON Guides', url: '/blog/json-formatting-complete-guide' },
    ],
    '/json/parser': [
      { title: 'JSON Formatter', url: '/json/formatter' },
      { title: 'JavaScript Formatter', url: '/js/formatter' },
      { title: 'Text Analyzer', url: '/text-analyzer' },
      { title: 'Text Formatter', url: '/text-formatter' },
      { title: 'Blog: JSON Validation', url: '/blog/json-validation-developer-guide' },
    ],
    '/blog': [
      { title: 'Case Converter', url: '/case-converter' },
      { title: 'Text Formatter', url: '/text-formatter' },
      { title: 'JSON Formatter', url: '/json/formatter' },
      { title: 'Text Analyzer', url: '/text-analyzer' },
    ],
  };

  getRelatedLinks(currentPath: string, limit = 5): InternalLinkItem[] {
    const basePath = this.normalizePath(currentPath);
    const candidates = this.relatedMap[basePath] || this.relatedMap['/'] || [];
    const unique: InternalLinkItem[] = [];
    const seen = new Set<string>();
    for (const item of candidates) {
      if (item.url === basePath) continue;
      if (seen.has(item.url)) continue;
      seen.add(item.url);
      unique.push(item);
      if (unique.length >= limit) break;
    }
    return unique;
  }

  private normalizePath(path: string): string {
    if (!path) return '/';
    try {
      const url = new URL(path, 'https://smarttextconverter.com');
      return url.pathname.replace(/\/$/, '') || '/';
    } catch {
      return path.replace(/\?.*$/, '').replace(/\/$/, '') || '/';
    }
  }
}


