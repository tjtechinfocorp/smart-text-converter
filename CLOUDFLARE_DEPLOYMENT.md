# Cloudflare Deployment Guide for Angular Universal SSR

This guide explains how to deploy the Smart Text Converter Angular Universal SSR application to Cloudflare Pages.

## Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **Wrangler CLI**: Install Cloudflare's command-line tool
3. **Git Repository**: Your code should be in a Git repository

## Installation

```bash
# Install Wrangler CLI globally
npm install -g wrangler

# Install project dependencies
npm install
```

## Deployment Options

### Option 1: Cloudflare Pages (Recommended)

#### Automatic Deployment via Git

1. **Connect Repository**:
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Navigate to Pages → Create a project
   - Connect your Git repository
   - Select the repository containing this project

2. **Build Settings**:
   ```
   Build command: npm run build:cloudflare
   Build output directory: dist/cloudflare
   Root directory: (leave empty)
   ```

3. **Environment Variables** (if needed):
   ```
   NODE_ENV=production
   ```

4. **Deploy**: Cloudflare will automatically build and deploy your app

#### Manual Deployment

```bash
# Build for Cloudflare
npm run build:cloudflare

# Deploy to Cloudflare Pages
npm run deploy:cloudflare
```

### Option 2: Cloudflare Workers

#### Using Wrangler

```bash
# Login to Cloudflare
wrangler login

# Deploy to Workers
wrangler deploy
```

#### Configuration

The `wrangler.toml` file is already configured for:
- **Runtime**: Node.js 18.x
- **Memory**: 256MB
- **Timeout**: 30 seconds
- **Security Headers**: Enabled
- **Caching**: Optimized for static assets

## Configuration Files

### 1. `_headers` - Security and Caching Headers
- **Static Assets**: 1-year cache with immutable flag
- **HTML Files**: 1-hour cache for SEO updates
- **Security Headers**: CSP, HSTS, XSS Protection
- **CORS**: Configured for API calls

### 2. `_redirects` - SPA Routing
- **Tool Routes**: `/case-converter`, `/json-formatter`, etc.
- **Blog Routes**: SEO-friendly blog post URLs
- **API Routes**: JSON and formatter endpoints
- **Fallback**: All routes redirect to `index.html`

### 3. `wrangler.toml` - Workers Configuration
- **Build Settings**: Optimized for Angular Universal
- **Runtime**: Node.js 18.x with 256MB memory
- **Security**: HSTS and security headers enabled
- **Performance**: Minification and Brotli compression

### 4. `functions/_middleware.js` - Edge Functions
- **Security Headers**: Applied to all responses
- **Cache Control**: Optimized caching strategy
- **Static Assets**: Proper handling of assets

## Performance Optimizations

### 1. Caching Strategy
```javascript
// Static assets (1 year)
/assets/* → Cache-Control: public, max-age=31536000, immutable

// HTML files (1 hour)
/*.html → Cache-Control: public, max-age=3600

// API responses (5 minutes)
/api/* → Cache-Control: public, max-age=300
```

### 2. Security Headers
- **CSP**: Content Security Policy for XSS protection
- **HSTS**: HTTP Strict Transport Security
- **X-Frame-Options**: Clickjacking protection
- **X-Content-Type-Options**: MIME type sniffing protection

### 3. Compression
- **Brotli**: Enabled for better compression
- **Gzip**: Fallback compression
- **Minification**: JavaScript and CSS minification

## Monitoring and Analytics

### 1. Cloudflare Analytics
- **Web Analytics**: Built-in traffic analysis
- **Performance**: Core Web Vitals monitoring
- **Security**: Threat detection and blocking

### 2. Custom Analytics
```javascript
// Add to your Angular app
// Google Analytics, Plausible, or other analytics
```

## Troubleshooting

### Common Issues

1. **Build Failures**:
   ```bash
   # Check Node.js version (18.x required)
   node --version
   
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **SSR Errors**:
   ```bash
   # Test locally first
   npm run serve:ssr:smarttext-ssr
   
   # Check server logs in Cloudflare dashboard
   ```

3. **Routing Issues**:
   - Verify `_redirects` file is in the root directory
   - Check that all routes are properly configured
   - Test with `npm run preview:cloudflare`

### Debug Commands

```bash
# Test build locally
npm run build:cloudflare

# Preview deployment
npm run preview:cloudflare

# Check Wrangler configuration
wrangler whoami
wrangler pages project list
```

## Environment Variables

Set these in Cloudflare Dashboard → Pages → Settings → Environment Variables:

```bash
NODE_ENV=production
NODE_OPTIONS=--max-old-space-size=512
```

## Custom Domain Setup

1. **Add Custom Domain**:
   - Go to Pages → Custom domains
   - Add your domain
   - Update DNS records as instructed

2. **SSL Certificate**:
   - Automatically provisioned by Cloudflare
   - Force HTTPS enabled by default

## Performance Monitoring

### Core Web Vitals
- **LCP**: Largest Contentful Paint
- **FID**: First Input Delay  
- **CLS**: Cumulative Layout Shift

### Cloudflare Metrics
- **Cache Hit Ratio**: Monitor caching effectiveness
- **Bandwidth**: Track data usage
- **Requests**: Monitor traffic patterns

## Security Best Practices

1. **DDoS Protection**: Enabled by default
2. **WAF**: Web Application Firewall
3. **Bot Management**: Automated bot detection
4. **Rate Limiting**: API protection
5. **SSL/TLS**: Automatic certificate management

## Support

- **Cloudflare Documentation**: [developers.cloudflare.com](https://developers.cloudflare.com)
- **Angular Universal**: [angular.io/guide/universal](https://angular.io/guide/universal)
- **Wrangler CLI**: [developers.cloudflare.com/workers/wrangler](https://developers.cloudflare.com/workers/wrangler)

## Deployment Checklist

- [ ] Repository connected to Cloudflare Pages
- [ ] Build settings configured correctly
- [ ] Environment variables set
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Analytics configured
- [ ] Performance monitoring enabled
- [ ] Security headers verified
- [ ] Cache settings optimized
- [ ] Error pages configured

Your Angular Universal SSR application is now ready for Cloudflare deployment! 🚀
