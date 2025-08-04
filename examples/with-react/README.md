# Chrome Extension with React + Rsbuild + TypeScript

A complete example of building a modern Chrome extension using React, TypeScript, and the `rsbuild-plugin-web-extension`.

## ✨ Features

- **React 19** with TypeScript for modern UI development
- **Manifest V3** for the latest Chrome extension standards
- **Hot Module Replacement** for fast development
- **Multi-browser Support** (Chrome & Firefox)
- **Service Worker** background script
- **DevTools Panel** integration
- **Modern Build System** powered by Rsbuild and Rspack

## 🚀 Quick Start

### Prerequisites

- Node.js 16 or higher
- pnpm (recommended) or npm

### Installation & Development

1. **Clone and navigate to the example:**

   ```bash
   cd examples/with-react
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Start development server:**

   ```bash
   pnpm dev
   ```

4. **Load extension in Chrome:**
   - Open `chrome://extensions`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

### Firefox Development

For Firefox development:

```bash
pnpm dev:firefox
```

Then load in Firefox:

- Open `about:debugging#/runtime/this-firefox`
- Click "Load Temporary Add-on..."
- Select any file in the `dist` folder

## 📁 Project Structure

```
with-react/
├── src/
│   ├── background/
│   │   └── index.ts           # Background service worker
│   ├── devtools/
│   │   ├── devtools.tsx       # DevTools panel component
│   │   ├── index.html         # DevTools HTML entry
│   │   └── index.tsx          # DevTools React root
│   ├── popup/
│   │   ├── index.html         # Popup HTML entry
│   │   ├── index.tsx          # Popup React root
│   │   └── popup.tsx          # Main popup component
│   └── env.d.ts               # TypeScript environment types
├── manifest.ts                # Extension manifest configuration
├── rsbuild.config.ts          # Rsbuild configuration
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Available Scripts

| Command              | Description                          |
| -------------------- | ------------------------------------ |
| `pnpm dev`           | Start development server for Chrome  |
| `pnpm dev:firefox`   | Start development server for Firefox |
| `pnpm build`         | Build for production (Chrome)        |
| `pnpm build:firefox` | Build for production (Firefox)       |
| `pnpm preview`       | Preview production build             |

## 🎯 Extension Features

### Popup Interface

- **Location**: Click the extension icon in the toolbar
- **Features**: Interactive React UI with state management
- **File**: `src/popup/popup.tsx`

### Background Service Worker

- **Purpose**: Handles extension lifecycle and background tasks
- **Features**: Event listeners, message handling, storage management
- **File**: `src/background/index.ts`

### DevTools Panel

- **Location**: Browser DevTools → "Extension Panel" tab
- **Features**: Custom debugging interface for web developers
- **Files**: `src/devtools/`

## 🛠️ Development

### Hot Module Replacement

The development server supports HMR for all extension pages:

- **Popup**: Changes reflect immediately when popup is open
- **DevTools**: Auto-refresh when DevTools panel is active
- **Background**: Automatically reloads service worker

### Debugging

#### Popup Debugging

```bash
# Right-click extension icon → "Inspect popup"
# Or open popup and press F12
```

#### Background Script Debugging

```bash
# Go to chrome://extensions
# Find your extension → "background page" or "service worker"
```

#### DevTools Panel Debugging

```bash
# Open any website's DevTools
# Navigate to "Extension Panel" tab
# Right-click in panel → "Inspect"
```

### TypeScript Support

Full TypeScript support with Chrome extension types:

```typescript
// Automatic type checking for Chrome APIs
chrome.tabs.query({ active: true }, (tabs) => {
  // TypeScript knows the shape of 'tabs'
});

// Manifest configuration is fully typed
const manifest: chrome.runtime.ManifestV3 = {
  // IDE autocompletion and validation
};
```

## 📦 Building for Production

### Chrome Web Store

1. **Build the extension:**

   ```bash
   pnpm build
   ```

2. **Package for upload:**

   ```bash
   cd dist
   zip -r ../extension.zip .
   ```

3. **Upload to Chrome Web Store:**
   - Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
   - Upload `extension.zip`
   - Fill in store listing details

### Firefox Add-ons

1. **Build for Firefox:**

   ```bash
   pnpm build:firefox
   ```

2. **Package and submit:**
   - Follow [Firefox extension submission guide](https://extensionworkshop.com/documentation/publish/)

## 🔄 Customization

### Adding New Extension Pages

1. **Create HTML template:**

   ```html
   <!-- src/options/index.html -->
   <!DOCTYPE html>
   <html>
     <head>
       <meta charset="utf-8" />
       <title>Options</title>
     </head>
     <body>
       <div id="root"></div>
       <script type="module" src="./index.tsx"></script>
     </body>
   </html>
   ```

2. **Create React component:**

   ```tsx
   // src/options/index.tsx
   import React from "react";
   import { createRoot } from "react-dom/client";
   import { Options } from "./options";

   const container = document.getElementById("root");
   const root = createRoot(container!);
   root.render(<Options />);
   ```

3. **Update manifest:**
   ```typescript
   // manifest.ts
   const manifest = {
     // ... existing config
     options_ui: {
       page: "./src/options/index.html",
       open_in_tab: true,
     },
   };
   ```

### Adding Content Scripts

1. **Create content script:**

   ```typescript
   // src/content/main.ts
   console.log("Content script loaded");

   // Your content script logic here
   ```

2. **Update manifest:**
   ```typescript
   // manifest.ts
   const manifest = {
     // ... existing config
     content_scripts: [
       {
         matches: ["https://example.com/*"],
         js: ["src/content/main.js"],
         run_at: "document_idle",
       },
     ],
   };
   ```

### Styling Options

The project supports various styling approaches:

- **CSS Modules**: `.module.css` files
- **Sass/SCSS**: `.scss` files
- **PostCSS**: Configured automatically
- **CSS-in-JS**: styled-components, emotion, etc.
- **Tailwind**: Add Tailwind CSS plugin

## 🐛 Troubleshooting

### Common Issues

**Extension not loading:**

- Ensure you're loading from the `dist` folder, not `src`
- Check browser console for errors
- Verify manifest.json is generated correctly

**HMR not working:**

- Make sure development server is running
- Reload the extension after significant changes
- Check that `writeToDisk: true` is enabled (automatic)

**TypeScript errors:**

- Install `@types/chrome`: `pnpm add -D @types/chrome`
- Check `tsconfig.json` includes correct types

### Getting Help

- [Plugin Documentation](https://github.com/filc-dev/rsbuild-plugin-web-extension)
- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [Rsbuild Documentation](https://rsbuild.dev/)

## 📄 License

This example is part of the `rsbuild-plugin-web-extension` project and is licensed under the MIT License.

## 🤝 Contributing

Found an issue or want to improve this example? Please open an issue or submit a PR to the main repository!
