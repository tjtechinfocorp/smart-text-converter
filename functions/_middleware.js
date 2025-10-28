// Cloudflare Pages Functions middleware for Angular Universal SSR
export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);

  // Skip middleware for static assets
  if (url.pathname.startsWith('/assets/') ||
      url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|eot)$/)) {
    return next();
  }

  // Skip middleware for API routes (if any)
  if (url.pathname.startsWith('/api/')) {
    return next();
  }

  // Add security headers
  const response = await next();

  // Clone the response to modify headers
  const newResponse = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  });

  // Add security headers
  newResponse.headers.set('X-Frame-Options', 'DENY');
  newResponse.headers.set('X-Content-Type-Options', 'nosniff');
  newResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  newResponse.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  newResponse.headers.set('X-XSS-Protection', '1; mode=block');
  newResponse.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  // Set appropriate cache headers
  if (url.pathname.startsWith('/assets/') || url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|webp)$/)) {
    newResponse.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (url.pathname.match(/\.html$/)) {
    newResponse.headers.set('Cache-Control', 'public, max-age=3600');
  } else {
    newResponse.headers.set('Cache-Control', 'public, max-age=300');
  }

  return newResponse;
}
