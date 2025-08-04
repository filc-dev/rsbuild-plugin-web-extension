# Manifest Reference

Complete guide to configuring your Chrome Extension Manifest V3 with TypeScript.

## Basic Structure

```typescript
const manifest: chrome.runtime.ManifestV3 = {
  manifest_version: 3,
  name: "Extension Name",
  version: "1.0.0",
  description: "Extension description",

  // Your extension configuration...
};

export default manifest;
```

## Required Fields

### manifest_version

- **Type**: `3`
- **Required**: `true`

Must be `3` for Manifest V3 extensions.

```typescript
const manifest = {
  manifest_version: 3,
  // ...
};
```

### name

- **Type**: `string`
- **Required**: `true`

The extension name displayed to users.

```typescript
const manifest = {
  name: "My Awesome Extension",
  // ...
};
```

### version

- **Type**: `string`
- **Required**: `true`

Extension version in semver format.

```typescript
const manifest = {
  version: "1.2.3",
  // ...
};
```

## Optional Fields

### description

- **Type**: `string`
- **Required**: `false`

Short description of your extension.

```typescript
const manifest = {
  description: "This extension helps you be more productive",
  // ...
};
```

### icons

- **Type**: `Record<string, string>`
- **Required**: `false`

Extension icons for different sizes.

```typescript
const manifest = {
  icons: {
    "16": "icons/icon16.png",
    "32": "icons/icon32.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png",
  },
  // ...
};
```

## Extension Pages

### action (Popup)

Configure the extension's popup that appears when clicking the extension icon.

```typescript
const manifest = {
  action: {
    default_popup: "./src/popup/index.html",
    default_title: "Extension Popup",
    default_icon: {
      "16": "icons/icon16.png",
      "32": "icons/icon32.png",
    },
  },
  // ...
};
```

### background (Service Worker)

Configure the background service worker.

```typescript
const manifest = {
  background: {
    service_worker: "./src/background/index.ts",
    type: "module", // Enable ES modules
  },
  // ...
};
```

### options_ui (Options Page)

Configure the extension's options page.

```typescript
const manifest = {
  options_ui: {
    page: "./src/options/index.html",
    open_in_tab: true, // Open in new tab vs popup
  },
  // ...
};
```

### devtools_page (DevTools)

Add a panel to Chrome DevTools.

```typescript
const manifest = {
  devtools_page: "./src/devtools/index.html",
  // ...
};
```

### chrome_url_overrides

Override browser pages like new tab.

```typescript
const manifest = {
  chrome_url_overrides: {
    newtab: "./src/newtab/index.html",
  },
  // ...
};
```

## Permissions

### permissions

Standard extension permissions.

```typescript
const manifest = {
  permissions: [
    "storage", // Access to chrome.storage API
    "activeTab", // Access to current tab
    "scripting", // Execute scripts in pages
    "tabs", // Access to tabs API
    "notifications", // Show notifications
    "alarms", // Create alarms
    "contextMenus", // Add context menu items
    "cookies", // Access cookies
    "history", // Access browsing history
    "bookmarks", // Access bookmarks
    "downloads", // Manage downloads
  ],
  // ...
};
```

### host_permissions

Access to specific websites.

```typescript
const manifest = {
  host_permissions: [
    "https://example.com/*",
    "https://*.google.com/*",
    "<all_urls>", // Access to all websites (use carefully)
  ],
  // ...
};
```

### optional_permissions

Permissions requested at runtime.

```typescript
const manifest = {
  optional_permissions: ["history", "bookmarks"],
  optional_host_permissions: ["https://example.com/*"],
  // ...
};
```

## Content Scripts

Inject scripts into web pages.

```typescript
const manifest = {
  content_scripts: [
    {
      matches: ["https://example.com/*"],
      js: ["src/content/index.js"],
      css: ["src/content/styles.css"],
      run_at: "document_idle", // or "document_start", "document_end"
      all_frames: false, // Run in all frames vs main frame only
    },
  ],
  // ...
};
```

## Web Accessible Resources

Make extension resources available to web pages.

```typescript
const manifest = {
  web_accessible_resources: [
    {
      resources: ["images/*", "styles/*"],
      matches: ["https://example.com/*"],
    },
  ],
  // ...
};
```

## Content Security Policy

Configure CSP for extension pages.

```typescript
const manifest = {
  content_security_policy: {
    extension_pages: "script-src 'self'; object-src 'self'",
  },
  // ...
};
```

## Complete Example

Here's a comprehensive manifest example:

```typescript
import { readFileSync } from "fs";

const packageJson = JSON.parse(readFileSync("./package.json", "utf8"));

const manifest: chrome.runtime.ManifestV3 = {
  manifest_version: 3,
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description || "",

  icons: {
    "16": "icons/icon16.png",
    "32": "icons/icon32.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png",
  },

  action: {
    default_popup: "./src/popup/index.html",
    default_title: "Open Extension",
    default_icon: {
      "16": "icons/icon16.png",
      "32": "icons/icon32.png",
    },
  },

  background: {
    service_worker: "./src/background/index.ts",
    type: "module",
  },

  options_ui: {
    page: "./src/options/index.html",
    open_in_tab: true,
  },

  devtools_page: "./src/devtools/index.html",

  permissions: ["storage", "activeTab", "scripting", "contextMenus"],

  host_permissions: ["https://github.com/*", "https://gitlab.com/*"],

  content_scripts: [
    {
      matches: ["https://github.com/*"],
      js: ["src/content/github.js"],
      run_at: "document_idle",
    },
  ],

  web_accessible_resources: [
    {
      resources: ["icons/*", "images/*"],
      matches: ["<all_urls>"],
    },
  ],
};

export default manifest;
```

## TypeScript Support

The plugin provides full TypeScript support for manifest configuration:

```typescript
// Get autocomplete and type checking
const manifest: chrome.runtime.ManifestV3 = {
  // TypeScript will validate all properties
  manifest_version: 3, // ✅ Correct
  // manifest_version: 2, // ❌ TypeScript error

  permissions: [
    "storage", // ✅ Valid permission
    // "invalid", // ❌ TypeScript error
  ],
};
```

## Dynamic Configuration

Load configuration from package.json or environment variables:

```typescript
import { readFileSync } from "fs";

const packageJson = JSON.parse(readFileSync("./package.json", "utf8"));
const isDev = process.env.NODE_ENV === "development";

const manifest: chrome.runtime.ManifestV3 = {
  manifest_version: 3,
  name: isDev ? `${packageJson.name} (Dev)` : packageJson.name,
  version: packageJson.version,
  description: packageJson.description,

  // Add development permissions
  permissions: ["storage", "activeTab", ...(isDev ? ["tabs"] : [])],
};

export default manifest;
```
