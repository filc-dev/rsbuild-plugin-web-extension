# Examples

Explore complete example projects using `rsbuild-plugin-web-extension`.

## Available Examples

### React Example

A complete Chrome extension built with React, TypeScript, and modern development tools.

- **Location**: [`examples/with-react`](https://github.com/filc-dev/rsbuild-plugin-web-extension/tree/main/examples/with-react)
- **Features**:
  - React 19 with TypeScript
  - Popup with interactive UI
  - Background service worker
  - DevTools panel
  - Hot Module Replacement
  - Multi-browser support

#### Running the Example

```bash
cd examples/with-react
pnpm install
pnpm dev
```

#### Project Structure

```
with-react/
├── src/
│   ├── background/
│   │   └── index.ts           # Background service worker
│   ├── devtools/
│   │   ├── devtools.tsx       # DevTools panel component
│   │   ├── index.html         # DevTools HTML template
│   │   └── index.tsx          # DevTools entry point
│   ├── popup/
│   │   ├── index.html         # Popup HTML template
│   │   ├── index.tsx          # Popup entry point
│   │   └── popup.tsx          # Popup component
│   └── env.d.ts               # TypeScript environment types
├── manifest.ts                # Extension manifest
├── rsbuild.config.ts          # Rsbuild configuration
└── package.json
```

## Creating Custom Examples

### Basic Popup Extension

Here's how to create a simple popup extension from scratch:

#### 1. Setup

```bash
mkdir my-extension
cd my-extension
npm init -y
npm install -D rsbuild-plugin-web-extension @rsbuild/core @rsbuild/plugin-react
npm install react react-dom
npm install -D @types/react @types/react-dom @types/chrome typescript
```

#### 2. Manifest Configuration

```typescript title="manifest.ts"
const manifest: chrome.runtime.ManifestV3 = {
  manifest_version: 3,
  name: "My Simple Extension",
  version: "1.0.0",
  description: "A simple example extension",

  action: {
    default_popup: "./src/popup/index.html",
  },

  permissions: ["activeTab"],
};

export default manifest;
```

#### 3. Rsbuild Configuration

```typescript title="rsbuild.config.ts"
import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginWebExtension } from "rsbuild-plugin-web-extension";
import manifest from "./manifest";

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginWebExtension({
      manifest,
    }),
  ],
});
```

#### 4. Popup Implementation

```html title="src/popup/index.html"
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>My Extension</title>
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
import React, { useState, useEffect } from "react";

export function Popup() {
  const [currentUrl, setCurrentUrl] = useState<string>("");

  useEffect(() => {
    // Get current tab URL
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.url) {
        setCurrentUrl(tabs[0].url);
      }
    });
  }, []);

  return (
    <div style={{ width: 300, padding: 20 }}>
      <h1>My Extension</h1>
      <p>Current URL:</p>
      <code
        style={{
          display: "block",
          background: "#f5f5f5",
          padding: 10,
          borderRadius: 4,
          fontSize: 12,
        }}
      >
        {currentUrl || "Loading..."}
      </code>
    </div>
  );
}
```

#### 5. Package Scripts

```json title="package.json"
{
  "scripts": {
    "dev": "rsbuild dev",
    "build": "rsbuild build",
    "dev:firefox": "__FIREFOX__=true rsbuild dev",
    "build:firefox": "__FIREFOX__=true rsbuild build"
  }
}
```

### Background Script Example

Add background functionality to your extension:

#### Manifest Update

```typescript title="manifest.ts"
const manifest: chrome.runtime.ManifestV3 = {
  // ... previous config

  background: {
    service_worker: "./src/background/index.ts",
    type: "module",
  },

  permissions: ["activeTab", "storage", "notifications"],
};
```

#### Background Implementation

```typescript title="src/background/index.ts"
// Installation handler
chrome.runtime.onInstalled.addListener((details) => {
  console.log("Extension installed:", details);

  // Set default storage values
  chrome.storage.local.set({
    installDate: new Date().toISOString(),
    useCount: 0,
  });
});

// Message handling
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received:", message);

  switch (message.type) {
    case "GET_INSTALL_DATE":
      chrome.storage.local.get("installDate", (result) => {
        sendResponse({ installDate: result.installDate });
      });
      return true; // Keep message channel open

    case "INCREMENT_USE_COUNT":
      chrome.storage.local.get("useCount", (result) => {
        const newCount = (result.useCount || 0) + 1;
        chrome.storage.local.set({ useCount: newCount }, () => {
          sendResponse({ useCount: newCount });
        });
      });
      return true;

    default:
      sendResponse({ error: "Unknown message type" });
  }
});

// Tab update handler
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    console.log("Tab updated:", tab.url);
  }
});
```

#### Updated Popup with Background Communication

```tsx title="src/popup/popup.tsx"
import React, { useState, useEffect } from "react";

export function Popup() {
  const [installDate, setInstallDate] = useState<string>("");
  const [useCount, setUseCount] = useState<number>(0);

  useEffect(() => {
    // Get install date
    chrome.runtime.sendMessage({ type: "GET_INSTALL_DATE" }, (response) => {
      if (response.installDate) {
        setInstallDate(new Date(response.installDate).toLocaleDateString());
      }
    });
  }, []);

  const handleClick = () => {
    chrome.runtime.sendMessage({ type: "INCREMENT_USE_COUNT" }, (response) => {
      if (response.useCount) {
        setUseCount(response.useCount);
      }
    });
  };

  return (
    <div style={{ width: 300, padding: 20 }}>
      <h1>My Extension</h1>

      <div style={{ marginBottom: 20 }}>
        <p>
          <strong>Installed:</strong> {installDate}
        </p>
        <p>
          <strong>Used:</strong> {useCount} times
        </p>
      </div>

      <button
        onClick={handleClick}
        style={{
          padding: "10px 20px",
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: 4,
        }}
      >
        Click Me!
      </button>
    </div>
  );
}
```

### Content Script Example

Add content script functionality:

#### Manifest Update

```typescript title="manifest.ts"
const manifest: chrome.runtime.ManifestV3 = {
  // ... previous config

  content_scripts: [
    {
      matches: ["https://github.com/*"],
      js: ["src/content/github.js"],
      run_at: "document_idle",
    },
  ],

  web_accessible_resources: [
    {
      resources: ["src/content/injected.js"],
      matches: ["https://github.com/*"],
    },
  ],
};
```

#### Content Script Implementation

```typescript title="src/content/github.ts"
// Content script for GitHub pages
console.log("GitHub content script loaded");

// Add a button to GitHub pages
function addButton() {
  const button = document.createElement("button");
  button.textContent = "My Extension Button";
  button.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    padding: 10px;
    background: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  `;

  button.addEventListener("click", () => {
    // Send message to background
    chrome.runtime.sendMessage({
      type: "CONTENT_SCRIPT_ACTION",
      url: window.location.href,
    });

    alert("Button clicked from content script!");
  });

  document.body.appendChild(button);
}

// Run when page is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", addButton);
} else {
  addButton();
}
```

### DevTools Extension Example

Create a DevTools panel:

#### Manifest Update

```typescript title="manifest.ts"
const manifest: chrome.runtime.ManifestV3 = {
  // ... previous config

  devtools_page: "./src/devtools/index.html",

  permissions: ["activeTab", "debugger"],
};
```

#### DevTools Implementation

```html title="src/devtools/index.html"
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>DevTools Panel</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./index.tsx"></script>
  </body>
</html>
```

```tsx title="src/devtools/index.tsx"
import React from "react";
import { createRoot } from "react-dom/client";
import { DevTools } from "./devtools";

// Create DevTools panel
chrome.devtools.panels.create(
  "My Extension",
  "", // icon path
  "src/devtools/index.html",
  (panel) => {
    console.log("DevTools panel created");
  }
);

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<DevTools />);
```

```tsx title="src/devtools/devtools.tsx"
import React, { useState, useEffect } from "react";

export function DevTools() {
  const [networkEvents, setNetworkEvents] = useState<any[]>([]);

  useEffect(() => {
    // Listen for network events
    chrome.devtools.network.onRequestFinished.addListener((request) => {
      setNetworkEvents((prev) => [
        ...prev,
        {
          url: request.request.url,
          method: request.request.method,
          status: request.response.status,
          time: new Date().toLocaleTimeString(),
        },
      ]);
    });
  }, []);

  const clearEvents = () => {
    setNetworkEvents([]);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>My Extension DevTools</h1>

      <div style={{ marginBottom: 20 }}>
        <button onClick={clearEvents}>Clear Events</button>
      </div>

      <div>
        <h3>Network Events ({networkEvents.length})</h3>
        <div style={{ maxHeight: 400, overflow: "auto" }}>
          {networkEvents.map((event, index) => (
            <div
              key={index}
              style={{
                padding: 8,
                borderBottom: "1px solid #eee",
                fontSize: 12,
              }}
            >
              <div>
                <strong>{event.method}</strong> {event.url}
              </div>
              <div>
                Status: {event.status} | Time: {event.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

## More Examples

For more complete examples and advanced use cases:

- [Browse the examples directory](https://github.com/filc-dev/rsbuild-plugin-web-extension/tree/main/examples)
- [Clone and experiment with the React example](https://github.com/filc-dev/rsbuild-plugin-web-extension/tree/main/examples/with-react)
- Check the [Chrome Extension Samples](https://github.com/GoogleChrome/chrome-extensions-samples) for more inspiration

## Community Examples

Have you built something cool with `rsbuild-plugin-web-extension`? We'd love to feature it here! Please [open an issue](https://github.com/filc-dev/rsbuild-plugin-web-extension/issues) or submit a PR to add your example.
