---
pageType: home

hero:
  text: rsbuild-plugin-web-extension
  tagline: 🚀 Modern web extension development with Rsbuild
  actions:
    - theme: brand
      text: Quick Start
      link: /guide/
    - theme: alt
      text: GitHub
      link: https://github.com/filc-dev/rsbuild-plugin-web-extension

features:
  - title: 🌐 Cross Browser Support
    details: Build once, run everywhere. Support for Chrome, Firefox, and other Chromium-based browsers with automatic manifest adaptation.
    icon: 🌐
  - title: ⚛️ Modern Framework Support
    details: Use React, Vue, Svelte, or any framework supported by Rsbuild. Hot reload and modern development experience included.
    icon: ⚛️
  - title: 📦 TypeScript First
    details: Full TypeScript support with type-safe manifest configuration and excellent IDE experience.
    icon: 📦
  - title: 🔥 Hot Module Replacement
    details: Fast development cycle with HMR support for all extension pages - popup, options, devtools, and more.
    icon: 🔥
  - title: 🎯 Manifest V3 Ready
    details: Built for the latest Chrome Extension Manifest V3 with service worker support and modern APIs.
    icon: 🎯
  - title: ⚡ Zero Config
    details: Just define your manifest and start building. Sensible defaults for all extension development needs.
    icon: ⚡
---

## Why rsbuild-plugin-web-extension?

Building modern web extensions shouldn't be complicated. This plugin combines the power of **Rsbuild** with web extension development best practices to give you:

- **Instant setup** - No complex webpack configurations
- **Modern tooling** - Latest JavaScript/TypeScript features
- **Multi-browser support** - Chrome and Firefox with one codebase
- **Fast rebuilds** - Leveraging Rsbuild's Rspack performance
- **Type safety** - Full TypeScript support throughout

## Quick Example

```typescript
// rsbuild.config.ts
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

```typescript
// manifest.ts
const manifest: chrome.runtime.ManifestV3 = {
  manifest_version: 3,
  name: "My Awesome Extension",
  version: "1.0.0",
  description: "Built with rsbuild-plugin-web-extension",
  action: {
    default_popup: "./src/popup/index.html",
  },
  background: {
    service_worker: "./src/background/index.ts",
    type: "module",
  },
};

export default manifest;
```

That's it! Run `npm run dev` and start building your extension with modern tooling.

## Community

- [GitHub Issues](https://github.com/filc-dev/rsbuild-plugin-web-extension/issues) - Bug reports and feature requests
- [GitHub Discussions](https://github.com/filc-dev/rsbuild-plugin-web-extension/discussions) - Questions and community support
