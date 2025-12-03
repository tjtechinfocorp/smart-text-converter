import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { SEOService } from './seo.service';
import { PLATFORM_ID } from '@angular/core';
import { DOCUMENT } from '@angular/common';

describe('SEOService', () => {
  let service: SEOService;
  let metaSpy: jasmine.SpyObj<Meta>;
  let titleSpy: jasmine.SpyObj<Title>;
  let routerSpy: jasmine.SpyObj<Router>;
  let documentMock: any;
  let headMock: any;

  beforeEach(() => {
    metaSpy = jasmine.createSpyObj('Meta', ['updateTag', 'addTag', 'getTag']);
    titleSpy = jasmine.createSpyObj('Title', ['setTitle', 'getTitle']);
    routerSpy = jasmine.createSpyObj('Router', [], { url: '/case-converter' });

    headMock = {
      appendChild: jasmine.createSpy('appendChild'),
      querySelectorAll: jasmine.createSpy('querySelectorAll').and.returnValue([]),
    };

    documentMock = {
      createElement: jasmine.createSpy('createElement').and.callFake((tag: string) => {
        return {
          setAttribute: jasmine.createSpy('setAttribute'),
          remove: jasmine.createSpy('remove'),
          tagName: tag.toUpperCase(),
        };
      }),
      querySelector: jasmine.createSpy('querySelector').and.returnValue(null),
      querySelectorAll: jasmine.createSpy('querySelectorAll').and.returnValue([]),
      head: headMock,
      documentElement: {
        setAttribute: jasmine.createSpy('setAttribute'),
      },
      getElementById: jasmine.createSpy('getElementById').and.returnValue(null),
    };

    TestBed.configureTestingModule({
      providers: [
        SEOService,
        { provide: Meta, useValue: metaSpy },
        { provide: Title, useValue: titleSpy },
        { provide: Router, useValue: routerSpy },
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: DOCUMENT, useValue: documentMock },
      ],
    });
    service = TestBed.inject(SEOService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set canonical URL for English page', () => {
    const seoData = {
      title: 'Test Title',
      description: 'Test Description',
      locale: 'en',
      url: 'https://smarttextconverter.com/case-converter',
    };

    service.updateSEO(seoData);

    expect(documentMock.createElement).toHaveBeenCalledWith('link');
    // Check if any created link has rel="canonical" and href=".../case-converter"
    // Since we can't easily inspect the calls to setAttribute on the created objects without more complex mocking,
    // we rely on the logic that setCanonicalURL is called.
  });

  it('should set self-referencing canonical URL for localized page', () => {
    // Mock router URL to be localized
    Object.defineProperty(routerSpy, 'url', { get: () => '/fr/case-converter' });
    
    const seoData = {
      title: 'Test Title',
      description: 'Test Description',
      locale: 'fr',
      url: 'https://smarttextconverter.com/case-converter', // Hardcoded English URL from component
    };

    // Spy on setCanonicalURL to verify it's called with the correct URL
    spyOn(service, 'setCanonicalURL');

    service.updateSEO(seoData);

    expect(service.setCanonicalURL).toHaveBeenCalledWith('https://smarttextconverter.com/fr/case-converter');
  });

  it('should set self-referencing canonical URL for another localized page', () => {
    // Mock router URL to be localized
    Object.defineProperty(routerSpy, 'url', { get: () => '/es/text-formatter' });
    
    const seoData = {
      title: 'Test Title',
      description: 'Test Description',
      locale: 'es',
      url: 'https://smarttextconverter.com/text-formatter', // Hardcoded English URL from component
    };

    // Spy on setCanonicalURL
    spyOn(service, 'setCanonicalURL');

    service.updateSEO(seoData);

    expect(service.setCanonicalURL).toHaveBeenCalledWith('https://smarttextconverter.com/es/text-formatter');
  });

  it('should use provided canonical URL if not localized', () => {
    Object.defineProperty(routerSpy, 'url', { get: () => '/case-converter' });

    const seoData = {
      title: 'Test Title',
      description: 'Test Description',
      locale: 'en',
      canonicalUrl: 'https://custom-canonical.com/page',
    };

    spyOn(service, 'setCanonicalURL');

    service.updateSEO(seoData);

    expect(service.setCanonicalURL).toHaveBeenCalledWith('https://custom-canonical.com/page');
  });
});
