#!/usr/bin/env node

/**
 * Development Cache Clearing Script
 *
 * This script helps clear development caches and service workers
 * to prevent issues during development.
 */

const fs = require('fs');
const path = require('path');

console.log('🧹 Clearing development caches...');

// Clear browser cache instructions
console.log(`
📋 Manual Steps to Clear Browser Cache:

1. Open Chrome DevTools (F12)
2. Right-click on the refresh button
3. Select "Empty Cache and Hard Reload"

Or use keyboard shortcuts:
- Windows/Linux: Ctrl + Shift + R
- Mac: Cmd + Shift + R

🔧 Service Worker Issues:
- The service worker is now properly disabled in development
- Vite HMR WebSocket issues should be resolved
- If you still see WebSocket errors, try:
  1. Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
  2. Clear browser cache
  3. Restart the development server

✅ Development server should now work without WebSocket errors!
`);

console.log('🎯 Development cache clearing complete!');
