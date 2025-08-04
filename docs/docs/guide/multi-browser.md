# Multi-browser Support

Build extensions that work on both Chrome and Firefox with a single codebase.

## Overview

`rsbuild-plugin-web-extension` automatically handles differences between Chrome and Firefox extension manifests, allowing you to write your extension once and deploy to both browsers.

## Browser Differences

### Manifest Structure

| Feature                 | Chrome (Manifest V3)                      | Firefox (Manifest V2/V3)  |
| ----------------------- | ----------------------------------------- | ------------------------- |
| Background Scripts      | `background.service_worker`               | `background.scripts`      |
| Options Page            | `options_ui.page`                         | `options_page`            |
| Content Security Policy | `content_security_policy.extension_pages` | `content_security_policy` |

### API Differences

| API     | Chrome           | Firefox           |
| ------- | ---------------- | ----------------- |
| Storage | `chrome.storage` | `browser.storage` |
| Runtime | `chrome.runtime` | `browser.runtime` |
| Tabs    | `chrome.tabs`    | `browser.tabs`    |

## Development Workflow

### Chrome Development

Default development mode targets Chrome:

```bash
npm run dev
```

Then load the extension in Chrome:

1. Open `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select your `dist` folder

### Firefox Development

Use the Firefox environment variable:

```bash
__FIREFOX__=true npm run dev
```

Or add a dedicated script to your `package.json`:

```json
{
  "scripts": {
    "dev": "rsbuild dev",
    "dev:firefox": "__FIREFOX__=true rsbuild dev",
    "build": "rsbuild build",
    "build:firefox": "__FIREFOX__=true rsbuild build"
  }
}
```

Then load in Firefox:

1. Open `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on..."
3. Select any file in your `dist` folder

## Automatic Manifest Conversion

When `__FIREFOX__=true` is set, the plugin automatically converts your Chrome manifest to Firefox-compatible format:

### Background Scripts

**Input (Chrome format):**

```typescript
const manifest = {
  background: {
    service_worker: "./src/background/index.ts",
    type: "module",
  },
};
```

**Output (Firefox format):**

```json
{
  "background": {
    "scripts": ["./src/background/index.ts"],
    "type": "module"
  }
}
```

### Options Page

**Input (Chrome format):**

```typescript
const manifest = {
  options_ui: {
    page: "./src/options/index.html",
  },
};
```

**Output (Firefox format):**

```json
{
  "options_page": "./src/options/index.html"
}
```

### Content Security Policy

**Chrome format:**

```typescript
const manifest = {
  content_security_policy: {
    extension_pages: "script-src 'self'; object-src 'self'",
  },
};
```

**Firefox format:**

```json
{
  "content_security_policy": "script-src 'self'; object-src 'self'"
}
```

## Cross-browser API Usage

### Using WebExtension Polyfill

Install the polyfill for consistent API usage:

```bash
npm install webextension-polyfill
npm install -D @types/webextension-polyfill
```

Then use it in your code:

```typescript
import browser from "webextension-polyfill";

// Works in both Chrome and Firefox
async function saveData(data: any) {
  await browser.storage.local.set({ data });
}

async function getCurrentTab() {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  return tab;
}
```

### Native API Detection

Alternatively, detect and use the appropriate API:

```typescript
// Detect available API
const api = typeof chrome !== "undefined" ? chrome : browser;

// Use the detected API
api.storage.local.set({ key: "value" });
```

## Build Configuration

### Single Build for Both Browsers

Build once and it works in both browsers (recommended for simple extensions):

```typescript
const manifest: chrome.runtime.ManifestV3 = {
  manifest_version: 3,
  name: "Universal Extension",
  version: "1.0.0",

  background: {
    service_worker: "./src/background/index.ts",
    type: "module",
  },

  // Use features supported by both browsers
  permissions: ["storage", "activeTab"],
};
```

### Browser-specific Builds

For extensions with browser-specific features:

```typescript
const isFirefox = process.env.__FIREFOX__;

const manifest: chrome.runtime.ManifestV3 = {
  manifest_version: 3,
  name: isFirefox ? "Extension (Firefox)" : "Extension (Chrome)",
  version: "1.0.0",

  background: {
    service_worker: "./src/background/index.ts",
    type: "module",
  },

  permissions: [
    "storage",
    "activeTab",
    // Firefox-specific permission
    ...(isFirefox ? ["tabs"] : []),
  ],

  // Chrome-specific features
  ...(isFirefox
    ? {}
    : {
        action: {
          default_popup: "./src/popup/index.html",
        },
      }),
};
```

## Testing Strategy

### Automated Testing

Test your extension in both browsers using CI:

```yaml
# .github/workflows/test.yml
name: Test Extension
on: [push, pull_request]

jobs:
  test-chrome:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build
      - run: npm run test:chrome

  test-firefox:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: __FIREFOX__=true npm run build
      - run: npm run test:firefox
```

### Manual Testing

Create a testing checklist:

- [ ] Extension loads in Chrome
- [ ] Extension loads in Firefox
- [ ] All features work in Chrome
- [ ] All features work in Firefox
- [ ] Popup displays correctly in both browsers
- [ ] Background script functions in both browsers
- [ ] Content scripts inject properly
- [ ] Storage APIs work consistently

## Common Issues

### Service Worker vs Background Scripts

**Problem**: Firefox doesn't fully support service workers yet.

**Solution**: Use the polyfill or feature detection:

```typescript
// background/index.ts
if (typeof importScripts === "function") {
  // Firefox: traditional background script
  console.log("Running in background script context");
} else {
  // Chrome: service worker
  console.log("Running in service worker context");
}
```

### API Availability

**Problem**: Some APIs are Chrome-only or Firefox-only.

**Solution**: Feature detection:

```typescript
// Check if API is available
if (chrome.action) {
  // Chrome
  chrome.action.setBadgeText({ text: "1" });
} else if (browser.browserAction) {
  // Firefox
  browser.browserAction.setBadgeText({ text: "1" });
}
```

### Manifest Validation

**Problem**: Firefox has stricter manifest validation.

**Solution**: Test your manifest in both browsers and use only supported features.

## Best Practices

1. **Use WebExtension Polyfill**: Provides consistent API across browsers
2. **Test Early and Often**: Test in both browsers during development
3. **Feature Detection**: Check for API availability before using
4. **Graceful Degradation**: Provide fallbacks for browser-specific features
5. **Separate Build Targets**: Use different builds for different browsers when needed

## Example: Universal Extension

Here's a complete example that works in both browsers:

```typescript
// manifest.ts
const manifest: chrome.runtime.ManifestV3 = {
  manifest_version: 3,
  name: "Universal Extension",
  version: "1.0.0",
  description: "Works in Chrome and Firefox",

  background: {
    service_worker: "./src/background/index.ts",
    type: "module",
  },

  action: {
    default_popup: "./src/popup/index.html",
  },

  permissions: ["storage", "activeTab"],
};

export default manifest;
```

```typescript
// src/background/index.ts
import browser from "webextension-polyfill";

browser.runtime.onInstalled.addListener(() => {
  console.log("Extension installed in both Chrome and Firefox!");
});
```

```typescript
// src/popup/popup.tsx
import React, { useState, useEffect } from "react";
import browser from "webextension-polyfill";

export function Popup() {
  const [data, setData] = useState("");

  useEffect(() => {
    // Works in both browsers
    browser.storage.local.get("data").then((result) => {
      setData(result.data || "");
    });
  }, []);

  return (
    <div>
      <h1>Universal Extension</h1>
      <p>Data: {data}</p>
    </div>
  );
}
```
