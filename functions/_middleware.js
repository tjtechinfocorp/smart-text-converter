// Cloudflare Pages Functions middleware for Angular Universal SSR
export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);

  // Redirect HTTP to HTTPS for security
  if (url.protocol === 'http:') {
    url.protocol = 'https:';
    return Response.redirect(url.toString(), 301);
  }

  // Redirect www to non-www for SEO consistency
  // This ensures all traffic goes to smarttextconverter.com (non-www)
  if (url.hostname === 'www.smarttextconverter.com') {
    const nonWwwUrl = new URL(url);
    nonWwwUrl.hostname = 'smarttextconverter.com';
    return Response.redirect(nonWwwUrl.toString(), 301);
  }

  // Remove invalid search query parameters (from sitemaps or forms)
  if (url.searchParams.has('q') && url.searchParams.get('q') === '{search_term_string}') {
    url.searchParams.delete('q');
    return Response.redirect(url.toString(), 301);
  }

  // Skip middleware for static assets
  if (
    url.pathname.startsWith('/assets/') ||
    url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|eot)$/)
  ) {
    return next();
  }

  // Skip middleware for API routes (if any)
  if (url.pathname.startsWith('/api/')) {
    return next();
  }

  // Handle invalid routes that need redirects (check before language code handling)
  const routeRedirects = {
    '/list-tools': '/line-tools',
    '/js-formatter': '/js/formatter',
    '/html-formatter': '/html/formatter',
    '/xml-formatter': '/xml/formatter',
    '/css-formatter': '/css/formatter',
    '/sql-formatter': '/sql/formatter',
    '/json-formatter': '/json/formatter',
    '/json-parser': '/json/parser',
    '/comparison': '/blog',
    '/tools': '/landing/tools',
    '/developer-tools': '/landing/developer-tools',
    '/text-processing': '/landing/text-processing',
  };

  // Check for invalid routes and redirect (preserve query parameters)
  if (routeRedirects[url.pathname]) {
    const redirectUrl = new URL(routeRedirects[url.pathname], url.origin);
    // Preserve all query parameters
    url.searchParams.forEach((value, key) => {
      redirectUrl.searchParams.set(key, value);
    });
    return Response.redirect(redirectUrl.toString(), 301);
  }

  // Handle guide routes redirect
  if (url.pathname.startsWith('/guide/')) {
    const redirectUrl = new URL('/blog', url.origin);
    url.searchParams.forEach((value, key) => {
      redirectUrl.searchParams.set(key, value);
    });
    return Response.redirect(redirectUrl.toString(), 301);
  }

  // Handle invalid blog post routes
  const blogRedirects = {
    '/blog/sql-formatter-complete-guide': '/blog/sql-formatter-guide',
    '/blog/accessibility-blog': '/blog/accessibility-best-practices',
  };

  if (blogRedirects[url.pathname]) {
    const redirectUrl = new URL(blogRedirects[url.pathname], url.origin);
    url.searchParams.forEach((value, key) => {
      redirectUrl.searchParams.set(key, value);
    });
    return Response.redirect(redirectUrl.toString(), 301);
  }

  // Handle language codes in URL paths - redirect to query parameter format
  // Supported languages: en, es, fr, de, it, pt, ru, ja, ko, zh, ar, hi, bn, ur
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

  if (pathSegments.length > 0) {
    const firstSegment = pathSegments[0];

    // Check if first segment is a language code
    if (supportedLanguages.includes(firstSegment)) {
      // Extract language code(s) and remaining path
      let langCodes = [firstSegment];
      let remainingPath = pathSegments.slice(1);

      // Handle multiple language codes (e.g., /it/pt/js/formatter)
      // Keep only the last valid language code
      while (remainingPath.length > 0 && supportedLanguages.includes(remainingPath[0])) {
        langCodes.push(remainingPath[0]);
        remainingPath = remainingPath.slice(1);
      }

      // Use the last language code (most specific)
      const langCode = langCodes[langCodes.length - 1];

      // Reconstruct the correct path without language codes
      // If no remaining path, redirect to homepage
      let correctPath = remainingPath.length > 0 ? '/' + remainingPath.join('/') : '/';

      // Handle invalid routes that need redirects (apply redirects in middleware to avoid double redirects)
      // Check if the path needs a redirect
      if (routeRedirects[correctPath]) {
        correctPath = routeRedirects[correctPath];
      } else if (correctPath.startsWith('/guide/')) {
        correctPath = '/blog';
      } else if (correctPath === '/blog/sql-formatter-complete-guide') {
        correctPath = '/blog/sql-formatter-guide';
      }

      // Build redirect URL with language as query parameter
      const redirectUrl = new URL(correctPath, url.origin);
      redirectUrl.searchParams.set('lang', langCode);

      // Preserve any existing query parameters (except lang which we're setting)
      url.searchParams.forEach((value, key) => {
        if (key !== 'lang') {
          redirectUrl.searchParams.set(key, value);
        }
      });

      return Response.redirect(redirectUrl.toString(), 301);
    }
  }

  // Add security headers
  const response = await next();

  // Clone the response to modify headers
  const newResponse = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });

  // Add security headers
  newResponse.headers.set('X-Frame-Options', 'DENY');
  newResponse.headers.set('X-Content-Type-Options', 'nosniff');
  newResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  newResponse.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  newResponse.headers.set('X-XSS-Protection', '1; mode=block');
  newResponse.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  // Set appropriate cache headers
  if (
    url.pathname.startsWith('/assets/') ||
    url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|webp)$/)
  ) {
    newResponse.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (url.pathname.match(/\.html$/)) {
    newResponse.headers.set('Cache-Control', 'public, max-age=3600');
  } else {
    newResponse.headers.set('Cache-Control', 'public, max-age=300');
  }

  return newResponse;
}
