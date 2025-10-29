# Version Management System

This project includes an automated version management system that updates version information across all relevant files during deployment to ensure proper cache busting and user experience.

## How It Works

### Automatic Version Updates

The version update script (`scripts/update-version.js`) is automatically integrated into all build processes:

- **`npm run build`** - Updates version and builds for production
- **`npm run build:cloudflare`** - Updates version and builds for Cloudflare
- **`npm run build:cloudflare-ssr`** - Updates version and builds for Cloudflare SSR

### Manual Version Updates

You can also update the version manually:

```bash
# Update with automatic timestamp version
npm run update-version

# Update with custom version
npm run update-version:custom 2.1.0
```

## Files Updated

The script automatically updates the following files:

### 1. `public/version.json`

```json
{
  "version": "2.0.1761754939604",
  "buildDate": "2025-10-29T16:22:19.604Z",
  "buildNumber": "20251029.1222",
  "environment": "production"
}
```

### 2. `src/app/services/cache-management.service.ts`

Updates the `CURRENT_VERSION` constant:

```typescript
private readonly CURRENT_VERSION = '2.0.1761754939604';
```

### 3. `public/sw.js`

Updates the `CACHE_VERSION` constant:

```javascript
const CACHE_VERSION = '2.0.1761754939604';
```

### 4. `package.json`

Updates the version field:

```json
{
  "version": "2.0.1761754939604"
}
```

## Version Format

- **Automatic**: `2.0.{timestamp}` (e.g., `2.0.1761754939604`)
- **Custom**: Any version you specify (e.g., `2.1.0`, `3.0.0-beta`)

## Benefits

### 1. Cache Busting

- Service worker cache names include version numbers
- Users automatically get fresh content after deployment
- No manual cache clearing required

### 2. User Experience

- App detects version changes and shows update notifications
- Graceful handling of breaking changes
- Automatic cache invalidation

### 3. Development Workflow

- Version updates happen automatically during build
- No manual version management required
- Consistent versioning across all files

## Integration with Cloudflare Pages

When you deploy to Cloudflare Pages:

1. **Build Process**: Version is automatically updated
2. **Deployment**: New version is deployed with updated cache names
3. **User Experience**: Users get fresh content automatically

## Monitoring

The system provides console logs during version updates:

```
🔄 Updating version to 2.0.1761754939604
✅ Updated public/version.json
✅ Updated cache-management.service.ts
✅ Updated public/sw.js
✅ Updated package.json
🎉 Version update complete! New version: 2.0.1761754939604
📅 Build date: 2025-10-29T16:22:19.604Z
🔢 Build number: 20251029.1222
```

## Troubleshooting

### Version Not Updating

- Check that `scripts/update-version.js` is executable
- Verify file paths in the script are correct
- Check console output for error messages

### Cache Issues

- Clear browser cache manually if needed
- Check service worker registration
- Verify version numbers match across files

### Custom Versions

- Use semantic versioning (e.g., `2.1.0`)
- Avoid special characters that might break URLs
- Test version updates before deployment
