import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

export default {
  async fetch(request, env, ctx) {
    try {
      // Try to serve static assets first
      return await getAssetFromKV(
        {
          request,
          waitUntil: ctx.waitUntil,
        },
        {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          ASSET_MANIFEST: env.__STATIC_CONTENT_MANIFEST,
        }
      );
    } catch (e) {
      // If static asset not found, serve the CSR version
      // This will allow the Angular app to handle routing client-side
      try {
        const url = new URL(request.url);
        const pathname = url.pathname;

        // For all routes, serve the CSR index.html
        // The Angular router will handle client-side routing
        const indexHtml = await env.__STATIC_CONTENT.get('index.csr.html', { type: 'text' });

        if (!indexHtml) {
          throw new Error('index.csr.html not found');
        }

        return new Response(indexHtml, {
          headers: { 'Content-Type': 'text/html' },
        });
      } catch (error) {
        console.error('Error serving CSR:', error);
        return new Response('Internal Server Error', { status: 500 });
      }
    }
  },
};
