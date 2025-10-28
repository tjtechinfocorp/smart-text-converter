# Cloudflare Pages SSR Deployment Guide

This guide explains how to deploy your Angular SSR application to Cloudflare Pages with Framework Preset "None" for Server-Side Rendering.

## 🚀 Quick Start

### 1. Build Commands

The project includes the following build commands:

```bash
# Standard build
npm run build

# Cloudflare Pages build (static)
npm run build:cloudflare

# Cloudflare Pages SSR build (recommended)
npm run build:cloudflare-ssr

# Deploy to Cloudflare Pages
npm run deploy:cloudflare

# Preview locally
npm run preview:cloudflare
```

### 2. Cloudflare Pages Configuration

#### Build Settings:

- **Framework Preset**: `None`
- **Build Command**: `npm run build:cloudflare-ssr`
- **Build Output Directory**: `dist/cloudflare`
- **Root Directory**: `/` (leave empty)

#### Environment Variables:

- `NODE_VERSION`: `18` (or `20`)
- `NPM_VERSION`: `9` (or latest)

### 3. Project Structure

```
dist/cloudflare/
├── _worker.js          # Cloudflare Worker for SSR
├── _headers           # Security headers
├── _routes.json       # Routing configuration
├── server.mjs         # Angular SSR server
├── browser/           # Static assets
├── server/            # Server-side chunks
└── [static files]     # All other static files
```

## 📁 Key Files

### 1. `functions/_worker.js`

Cloudflare Worker that handles:

- Static asset serving
- SSR routing
- Security headers
- Error handling

### 2. `public/_headers`

Security headers for all routes:

- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Cache control for static assets

### 3. `public/_routes.json`

Routing configuration:

- Includes all routes (`/*`)
- Excludes API routes and worker files

### 4. `wrangler.toml`

Cloudflare Workers configuration:

- Build command
- Upload format
- Main entry point

## 🔧 Build Process

### 1. Angular Build

```bash
ng build --configuration=production --output-path=dist/cloudflare
```

### 2. Cloudflare Preparation

```bash
# Copy browser assets to root
cp -r dist/cloudflare/browser/* dist/cloudflare/

# Copy server files
cp dist/cloudflare/server/server.mjs dist/cloudflare/

# Copy worker file
cp functions/_worker.js dist/cloudflare/
```

## 🌐 Deployment Steps

### 1. Connect Repository

1. Go to Cloudflare Pages dashboard
2. Click "Create a project"
3. Connect your GitHub repository
4. Select the repository

### 2. Configure Build Settings

1. **Framework Preset**: Select "None"
2. **Build Command**: `npm run build:cloudflare-ssr`
3. **Build Output Directory**: `dist/cloudflare`
4. **Root Directory**: Leave empty

### 3. Environment Variables

Add these environment variables in Cloudflare Pages:

- `NODE_VERSION`: `18`
- `NPM_VERSION`: `9`

### 4. Deploy

1. Click "Save and Deploy"
2. Wait for build to complete
3. Your SSR app will be available at the provided URL

## 🛠️ Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Development Server

```bash
npm start
```

### 3. SSR Preview

```bash
npm run serve:ssr
```

### 4. Cloudflare Preview

```bash
npm run preview:cloudflare
```

## 📊 Performance Features

### 1. Caching

- Static assets: 1 year cache
- HTML pages: 5 minutes cache
- CDN: 10 minutes cache

### 2. Compression

- Gzip compression enabled
- Response time headers
- Critical CSS inlining

### 3. Security

- XSS protection
- Content type sniffing prevention
- Frame options
- Referrer policy

## 🔍 Troubleshooting

### Common Issues:

1. **Build Fails**: Check Node.js version (18+)
2. **SSR Not Working**: Verify `_worker.js` is in output directory
3. **Static Assets 404**: Check `_routes.json` configuration
4. **Headers Not Applied**: Verify `_headers` file is in root

### Debug Mode:

Set `DEBUG = true` in `_worker.js` for detailed error messages.

## 📈 Monitoring

### 1. Build Logs

Check Cloudflare Pages build logs for errors.

### 2. Worker Logs

Monitor Cloudflare Worker logs in the dashboard.

### 3. Performance

Use Cloudflare Analytics to monitor:

- Page load times
- Cache hit rates
- Error rates

## 🎯 Best Practices

1. **Use Production Build**: Always use `--configuration=production`
2. **Test Locally**: Use `npm run preview:cloudflare` before deploying
3. **Monitor Performance**: Check Cloudflare Analytics regularly
4. **Update Dependencies**: Keep Angular and Cloudflare packages updated
5. **Optimize Images**: Use WebP format and proper sizing

## 📚 Additional Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Angular SSR Guide](https://angular.dev/guide/ssr)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
