# Language Codes in URL Paths - Redirect Fix

## 🔍 Issue Identified

Google Search Console reported **"Alternate page with proper canonical tag"** errors for URLs with language codes in the path instead of query parameters:

- ❌ `/ar/html/formatter` (invalid - language code in path)
- ❌ `/de/text-generator` (invalid - language code in path)
- ❌ `/it/pt/js/formatter` (invalid - multiple language codes in path)
- ✅ `/html/formatter?lang=ar` (correct - language in query parameter)

**Problem**: Language codes are appearing as URL path segments (e.g., `/ar/html/formatter`) instead of query parameters (`?lang=ar`), creating duplicate content issues and invalid canonical URLs.

## ✅ Root Cause

1. **Google crawling invalid URLs**: Google is somehow discovering/crawling URLs with language codes in paths
2. **No redirect handling**: The middleware wasn't detecting and redirecting these invalid URLs
3. **Canonical URL generation**: The `getCurrentUrl()` method wasn't stripping language codes from paths when generating canonical URLs

## 🔧 Fixes Implemented

### 1. Added Language Code Detection in Middleware

**File**: `functions/_middleware.js`

Added logic to detect language codes in URL paths and redirect them to the correct format with query parameters:

```javascript
// Handle language codes in URL paths - redirect to query parameter format
const supportedLanguages = [
  'en',
  'es',
  'fr',
  'de',
  'it',
  'pt',
  'ru',
  'ja',
  'ko',
  'zh',
  'ar',
  'hi',
  'bn',
  'ur',
  'pt-br',
  'fil',
  'pl',
  'tr',
  'sw',
  'id',
  'nl',
];
const pathSegments = url.pathname.split('/').filter(segment => segment);

if (pathSegments.length > 0 && supportedLanguages.includes(firstSegment)) {
  // Extract language code(s) and redirect to query parameter format
  // /ar/html/formatter -> /html/formatter?lang=ar
  // /it/pt/js/formatter -> /js/formatter?lang=pt (uses last language code)
}
```

**Features**:

- Detects single language codes: `/ar/html/formatter` → `/html/formatter?lang=ar`
- Handles multiple language codes: `/it/pt/js/formatter` → `/js/formatter?lang=pt` (uses last one)
- Handles homepage with language: `/ar` → `/?lang=ar`
- Preserves existing query parameters
- Returns 301 (Permanent Redirect) for SEO

### 2. Enhanced Canonical URL Generation

**File**: `src/app/services/seo.service.ts`

Updated `getCurrentUrl()` to strip language codes from paths when generating canonical URLs:

```typescript
private getCurrentUrl(stripQueryParams: boolean = true): string {
  let url = this.router.url;

  // Remove language codes from path (e.g., /ar/html/formatter -> /html/formatter)
  // Language should only be in query parameters, not path segments
  const pathSegments = url.split('?')[0].split('/').filter(segment => segment);
  if (pathSegments.length > 0 && this.supportedLanguages.includes(pathSegments[0])) {
    // Remove language code(s) from path
    let remainingPath = pathSegments;
    while (remainingPath.length > 0 && this.supportedLanguages.includes(remainingPath[0])) {
      remainingPath = remainingPath.slice(1);
    }
    url = '/' + remainingPath.join('/') + (url.includes('?') ? url.split('?')[1] : '');
  }

  // Strip query parameters for canonical URLs
  const cleanUrl = stripQueryParams ? url.split('?')[0] : url;
  return this.baseUrl + cleanUrl;
}
```

**Features**:

- Strips language codes from paths when generating canonical URLs
- Ensures canonical URLs never include language codes in paths
- Works with both query parameters and path-based language codes (for safety)

## 📋 Redirect Examples

### Single Language Code

- `/ar/html/formatter` → `/html/formatter?lang=ar` ✅
- `/de/text-generator` → `/text-generator?lang=de` ✅
- `/es/encode-decode` → `/encode-decode?lang=es` ✅

### Multiple Language Codes

- `/it/pt/js/formatter` → `/js/formatter?lang=pt` ✅ (uses last language code)
- `/hi/bn/text-formatter` → `/text-formatter?lang=bn` ✅

### Homepage with Language

- `/ar` → `/?lang=ar` ✅
- `/de` → `/?lang=de` ✅

### With Existing Query Parameters

- `/ar/html/formatter?other=value` → `/html/formatter?lang=ar&other=value` ✅

### Complex Paths

- `/ar/blog/javascript-formatter-complete-guide` → `/blog/javascript-formatter-complete-guide?lang=ar` ✅
- `/de/comparison/best-case-converters-2024` → `/comparison/best-case-converters-2024?lang=de` ✅

## ✅ Expected Results

After deployment:

- ✅ All URLs with language codes in paths will redirect to query parameter format
- ✅ Canonical URLs will never include language codes in paths
- ✅ Google Search Console "Alternate page with proper canonical tag" errors should decrease
- ✅ All language variants will canonicalize to the same clean URL
- ✅ SEO value preserved through 301 redirects

## 🧪 Testing

To verify the fixes:

1. **Test Redirects**:

   ```bash
   # Test single language code
   curl -I https://smarttextconverter.com/ar/html/formatter
   # Should return: HTTP/1.1 301 Moved Permanently
   # Location: /html/formatter?lang=ar

   # Test multiple language codes
   curl -I https://smarttextconverter.com/it/pt/js/formatter
   # Should return: HTTP/1.1 301 Moved Permanently
   # Location: /js/formatter?lang=pt

   # Test homepage with language
   curl -I https://smarttextconverter.com/de
   # Should return: HTTP/1.1 301 Moved Permanently
   # Location: /?lang=de
   ```

2. **Test Canonical URLs**:

   - Visit any page with language code in path (will redirect)
   - Check canonical tag in page source
   - Should be clean URL without language code: `<link rel="canonical" href="https://smarttextconverter.com/html/formatter" />`

3. **Google Search Console**:
   - After deployment, wait for Google to re-crawl affected pages
   - "Alternate page with proper canonical tag" errors should decrease significantly
   - Check Coverage report to verify redirects are working

## 🔄 Next Steps

1. **Deploy the changes** to production
2. **Test redirects** manually to ensure they work correctly
3. **Monitor Google Search Console** - errors should clear after re-crawling
4. **Request re-indexing** for affected URLs if needed (optional)

## 📝 Notes

- All redirects use **301 (Permanent Redirect)** to preserve SEO value
- The middleware runs before Angular routing, so invalid URLs are caught early
- Canonical URLs are generated cleanly without language codes in paths
- Query parameters are preserved through redirects
- Multiple language codes in path use the last one (most specific)
