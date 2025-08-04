# Configuration

Learn about all configuration options available in `rsbuild-plugin-web-extension`.

## Plugin Options

The plugin accepts a configuration object with the following options:

```typescript
interface Options {
  manifest: chrome.runtime.ManifestV3;
}
```

### manifest

- **Type**: `chrome.runtime.ManifestV3`
- **Required**: `true`

The Chrome Extension Manifest V3 configuration object. This will be processed and written to `dist/manifest.json` during build.

```typescript
import { pluginWebExtension } from "rsbuild-plugin-web-extension";

export default defineConfig({
  plugins: [
    pluginWebExtension({
      manifest: {
        manifest_version: 3,
        name: "My Extension",
        version: "1.0.0",
        // ... other manifest properties
      },
    }),
  ],
});
```

## Automatic Configurations

The plugin automatically configures several Rsbuild settings to optimize web extension development:

### Entry Points

Entry points are automatically derived from your manifest configuration:

- **popup**: From `manifest.action.default_popup`
- **devtools**: From `manifest.devtools_page`
- **newtab**: From `manifest.chrome_url_overrides.newtab`
- **options**: From `manifest.options_ui.page`
- **background**: From `manifest.background.service_worker`

### Output Configuration

```typescript
{
  output: {
    filenameHash: false,        // Disable hashing for extension compatibility
    filename: {
      js: "index.js",           // Consistent filename
    },
    distPath: {
      js: "src/[name]",         // Organize by entry name
    },
  }
}
```

### Development Server

```typescript
{
  server: {
    port: 3130,                 // Default development port
  },
  dev: {
    client: {
      port: 3130,
      host: "localhost",
    },
    writeToDisk: true,          // Required for extension loading
  },
}
```

### Hot Module Replacement

```typescript
{
  output: {
    // HMR files location
    hotUpdateChunkFilename: "hot/[id].[fullhash].hot-update.js",
    hotUpdateMainFilename: "hot/[runtime].[fullhash].hot-update.json",
  }
}
```

## Environment Variables

### PORT

Change the development server port:

```bash
PORT=8080 npm run dev
```

### **FIREFOX**

Enable Firefox-specific manifest transformations:

```bash
__FIREFOX__=true npm run build
```

This will:

- Convert `background.service_worker` to `background.scripts`
- Add Firefox-compatible `content_security_policy`
- Handle `options_page` vs `options_ui` differences

## File Processing

### Automatic Extension Transformation

The plugin automatically transforms file extensions in the manifest:

- `.tsx`, `.jsx`, `.ts` → `.js`
- `.scss`, `.sass`, `.stylus` → `.css`

```typescript
// In manifest.ts
const manifest = {
  action: {
    default_popup: "./src/popup/index.html", // References popup.tsx
  },
  background: {
    service_worker: "./src/background/index.ts", // Will become index.js
  },
};
```

### HTML Entry Processing

For each HTML file in your manifest, the plugin:

1. Creates an Rsbuild entry point
2. Configures HTMLPlugin to process the template
3. Converts `.html` references to their corresponding `.tsx`/`.jsx` files

## Integration with Other Plugins

### React

```typescript
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginWebExtension } from "rsbuild-plugin-web-extension";

export default defineConfig({
  plugins: [pluginReact(), pluginWebExtension({ manifest })],
});
```

### Vue

```typescript
import { pluginVue } from "@rsbuild/plugin-vue";
import { pluginWebExtension } from "rsbuild-plugin-web-extension";

export default defineConfig({
  plugins: [pluginVue(), pluginWebExtension({ manifest })],
});
```

### TypeScript

TypeScript support is enabled by default. Make sure to install Chrome types:

```bash
npm install -D @types/chrome
```

## Custom Rsbuild Configuration

You can still customize Rsbuild configuration alongside the plugin:

```typescript
export default defineConfig({
  plugins: [pluginWebExtension({ manifest })],
  // Additional Rsbuild configuration
  source: {
    alias: {
      "@": "./src",
    },
  },
  tools: {
    postcss: {
      plugins: [
        // Your PostCSS plugins
      ],
    },
  },
});
```

## Troubleshooting

### Common Issues

**HMR not working in extension pages**

Make sure `dev.writeToDisk` is `true` (this is set automatically by the plugin).

**Extension not loading after changes**

1. Check the browser's extension management page for errors
2. Reload the extension manually
3. Verify the `dist/manifest.json` is being generated correctly

**TypeScript errors with Chrome APIs**

Install Chrome types:

```bash
npm install -D @types/chrome
```

Add to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["chrome"]
  }
}
```
