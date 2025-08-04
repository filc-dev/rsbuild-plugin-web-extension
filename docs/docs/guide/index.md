# Getting Started

Learn how to build modern web extensions with `rsbuild-plugin-web-extension`.

## Installation

Install the plugin using your preferred package manager:

::: code-group

```bash [npm]
npm install -D rsbuild-plugin-web-extension
```

```bash [pnpm]
pnpm add -D rsbuild-plugin-web-extension
```

```bash [yarn]
yarn add -D rsbuild-plugin-web-extension
```

:::

## Quick Start

### 1. Create your manifest

Create a `manifest.ts` file in your project root:

```typescript title="manifest.ts"
import { readFileSync } from "fs";

const packageJson = JSON.parse(readFileSync("./package.json", "utf8"));

const manifest: chrome.runtime.ManifestV3 = {
  manifest_version: 3,
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description || "",

  // Define your extension's popup
  action: {
    default_popup: "./src/popup/index.html",
  },

  // Background script (service worker)
  background: {
    service_worker: "./src/background/index.ts",
    type: "module",
  },

  // Optional: devtools page
  devtools_page: "./src/devtools/index.html",

  // Optional: options page
  options_ui: {
    page: "./src/options/index.html",
  },

  // Permissions your extension needs
  permissions: ["storage", "activeTab"],
};

export default manifest;
```

### 2. Configure Rsbuild

Create or update your `rsbuild.config.ts`:

```typescript title="rsbuild.config.ts"
import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginWebExtension } from "rsbuild-plugin-web-extension";
import manifest from "./manifest";

export default defineConfig({
  plugins: [
    pluginReact(), // or pluginVue, pluginSvelte, etc.
    pluginWebExtension({
      manifest,
    }),
  ],
});
```

### 3. Create your extension pages

Create the HTML files and their corresponding entry points:

```html title="src/popup/index.html"
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Extension Popup</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./index.tsx"></script>
  </body>
</html>
```

```tsx title="src/popup/index.tsx"
import React from "react";
import { createRoot } from "react-dom/client";
import { Popup } from "./popup";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<Popup />);
```

```tsx title="src/popup/popup.tsx"
import React, { useState } from "react";

export function Popup() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ width: 300, padding: 20 }}>
      <h1>My Extension</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### 4. Background script

```typescript title="src/background/index.ts"
// Background service worker
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed!");
});

// Example: handle messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_DATA") {
    // Handle the message
    sendResponse({ data: "Hello from background!" });
  }
});
```

### 5. Development

Start the development server:

```bash
npm run dev
```

This will:

- Start Rsbuild dev server with hot reload
- Generate the manifest.json automatically
- Watch for changes and rebuild

### 6. Load in browser

#### Chrome

1. Open `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select your `dist` folder

#### Firefox

For Firefox development, use:

```bash
npm run dev:firefox
```

Then:

1. Open `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on..."
3. Select any file in your `dist` folder

## Project Structure

Here's a typical project structure:

```
my-extension/
├── src/
│   ├── popup/
│   │   ├── index.html
│   │   ├── index.tsx
│   │   └── popup.tsx
│   ├── background/
│   │   └── index.ts
│   ├── devtools/
│   │   ├── index.html
│   │   └── index.tsx
│   └── options/
│       ├── index.html
│       └── index.tsx
├── manifest.ts
├── rsbuild.config.ts
└── package.json
```

## Next Steps

- [Configuration](/guide/configuration) - Learn about all available options
- [Manifest Reference](/guide/manifest) - Detailed manifest configuration
- [Multi-browser Support](/guide/multi-browser) - Chrome and Firefox differences
- [Examples](/guide/examples) - See complete examples

## Need Help?

- Check our [FAQ](/guide/faq)
- Browse [Examples](https://github.com/filc-dev/rsbuild-plugin-web-extension/tree/main/examples)
- Open an [issue](https://github.com/filc-dev/rsbuild-plugin-web-extension/issues)
