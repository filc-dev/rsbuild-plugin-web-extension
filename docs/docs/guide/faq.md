# FAQ

Frequently asked questions about `rsbuild-plugin-web-extension`.

## Installation & Setup

### Q: What versions of Node.js are supported?

**A:** The plugin requires Node.js 16 or higher. We recommend using the latest LTS version for the best experience.

### Q: Can I use this with existing Rsbuild projects?

**A:** Yes! Simply install the plugin and add it to your `rsbuild.config.ts`. The plugin will automatically configure everything needed for web extension development.

### Q: Do I need to configure webpack manually?

**A:** No, the plugin handles all webpack/Rspack configuration automatically. It configures entry points, HTML generation, and output settings optimized for web extensions.

## Development

### Q: Why isn't Hot Module Replacement (HMR) working in my extension?

**A:** Make sure:

1. You're loading the extension from the `dist` folder, not the `src` folder
2. The development server is running (`npm run dev`)
3. You've reloaded the extension after making changes

The plugin automatically sets `writeToDisk: true` to ensure files are written for extension loading.

### Q: How do I debug my extension during development?

**A:**

1. **Chrome DevTools**: Right-click on your extension popup → "Inspect"
2. **Background Script**: Go to `chrome://extensions`, find your extension, click "background page" or "service worker"
3. **Content Scripts**: Use regular Chrome DevTools on the page where your content script runs
4. **Console Logs**: Check the browser console and extension console for errors

### Q: Can I use CSS-in-JS libraries like styled-components?

**A:** Yes! The plugin works with any CSS solution supported by Rsbuild, including:

- CSS Modules
- Sass/SCSS
- PostCSS
- styled-components
- Emotion
- Tailwind CSS

### Q: How do I handle environment variables?

**A:** Use Rsbuild's built-in environment variable support:

```typescript
// rsbuild.config.ts
export default defineConfig({
  plugins: [pluginWebExtension({ manifest })],
  source: {
    define: {
      "process.env.API_URL": JSON.stringify(process.env.API_URL),
    },
  },
});
```

## Manifest & Configuration

### Q: Can I use dynamic values in my manifest?

**A:** Yes! Your manifest is a TypeScript file, so you can use any JavaScript:

```typescript
import { readFileSync } from "fs";

const packageJson = JSON.parse(readFileSync("./package.json", "utf8"));
const isDev = process.env.NODE_ENV === "development";

const manifest = {
  name: isDev ? `${packageJson.name} (Dev)` : packageJson.name,
  version: packageJson.version,
  // ... other properties
};
```

### Q: How do I add content scripts?

**A:** Add them to your manifest configuration:

```typescript
const manifest = {
  content_scripts: [
    {
      matches: ["https://example.com/*"],
      js: ["src/content/index.js"],
      css: ["src/content/styles.css"],
    },
  ],
};
```

Then create the files in your `src/content/` directory. The plugin will handle bundling automatically.

### Q: What about web accessible resources?

**A:** Include them in your manifest:

```typescript
const manifest = {
  web_accessible_resources: [
    {
      resources: ["images/*", "fonts/*"],
      matches: ["<all_urls>"],
    },
  ],
};
```

Place the files in your `src/` directory and they'll be copied to the output.

## Multi-browser Support

### Q: How do I test my extension in Firefox?

**A:** Use the Firefox environment flag:

```bash
__FIREFOX__=true npm run dev
```

The plugin automatically converts your Chrome manifest to Firefox format.

### Q: What are the main differences between Chrome and Firefox?

**A:** The plugin handles these differences automatically:

- Background scripts vs service workers
- `options_ui` vs `options_page`
- Different Content Security Policy formats
- API namespaces (`chrome.*` vs `browser.*`)

### Q: Should I use webextension-polyfill?

**A:** We recommend it for consistent API usage across browsers:

```bash
npm install webextension-polyfill
npm install -D @types/webextension-polyfill
```

```typescript
import browser from "webextension-polyfill";

// Works in both Chrome and Firefox
await browser.storage.local.set({ key: "value" });
```

## Build & Deployment

### Q: How do I build for production?

**A:** Use the build command:

```bash
npm run build
```

This creates an optimized build in the `dist` folder ready for publishing.

### Q: Why are there no file hashes in the output?

**A:** Extensions require consistent file names for the manifest references. The plugin automatically disables filename hashing to ensure compatibility.

### Q: How do I package my extension for the Chrome Web Store?

**A:** After building:

1. Zip the entire `dist` folder
2. Upload to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
3. Fill in the required metadata and submit for review

### Q: Can I automate the build process?

**A:** Yes! Here's an example GitHub Action:

```yaml
name: Build Extension
on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "18"
      - run: npm ci
      - run: npm run build
      - name: Archive build
        uses: actions/upload-artifact@v4
        with:
          name: extension-build
          path: dist/
```

## Troubleshooting

### Q: I'm getting "Invalid manifest" errors

**A:** Common causes:

1. **Missing required fields**: Ensure `manifest_version`, `name`, and `version` are present
2. **Invalid permissions**: Check the [Chrome extension permissions documentation](https://developer.chrome.com/docs/extensions/mv3/declare_permissions/)
3. **File paths**: Verify all referenced files exist in your `src` directory
4. **Manifest V3 compatibility**: Make sure you're using Manifest V3 syntax

### Q: My background script isn't working

**A:** Check:

1. **Service worker vs background script**: Make sure you're using `service_worker` for Manifest V3
2. **Module type**: Set `"type": "module"` in your background configuration
3. **Console errors**: Check the service worker console for errors
4. **Registration**: Verify the background script is registered in the manifest

### Q: Content scripts aren't injecting

**A:** Verify:

1. **Match patterns**: Ensure your `matches` array includes the target URLs
2. **Permissions**: Some sites require host permissions
3. **Timing**: Try different `run_at` values (`document_start`, `document_end`, `document_idle`)
4. **File paths**: Check that the content script files exist

### Q: Extension pages are blank

**A:** This usually indicates:

1. **Build errors**: Check the console for JavaScript errors
2. **Missing dependencies**: Ensure all imports are correct
3. **CSP violations**: Check for Content Security Policy issues
4. **File paths**: Verify the HTML files reference the correct entry points

### Q: How do I report a bug?

**A:** Please [open an issue](https://github.com/filc-dev/rsbuild-plugin-web-extension/issues) with:

1. Plugin version
2. Rsbuild version
3. Node.js version
4. Minimal reproduction case
5. Error messages or console output

## Performance

### Q: My extension bundle is too large

**A:** Try these optimizations:

1. **Tree shaking**: Ensure you're importing only what you need
2. **Code splitting**: Use dynamic imports for large dependencies
3. **Bundle analysis**: Use Rsbuild's bundle analyzer to identify large dependencies
4. **Minimize dependencies**: Avoid large libraries in content scripts

### Q: Build times are slow

**A:** Optimization tips:

1. **Use development mode**: Run `npm run dev` for faster builds during development
2. **Exclude unnecessary files**: Use `.gitignore` patterns to exclude files
3. **Update dependencies**: Ensure you're using the latest versions

## Integration

### Q: Can I use this with other build tools?

**A:** The plugin is designed specifically for Rsbuild/Rspack. For other build tools:

- **Webpack**: Use the raw webpack configuration as inspiration
- **Vite**: Consider [vite-plugin-web-extension](https://github.com/aklinker1/vite-plugin-web-extension)
- **Rollup**: Use manual configuration with appropriate plugins

### Q: How do I migrate from webpack?

**A:**

1. Install Rsbuild and this plugin
2. Convert your webpack config to Rsbuild format
3. Update your manifest to use TypeScript format
4. Update your build scripts
5. Test thoroughly in both browsers

The [Rsbuild migration guide](https://rsbuild.dev/guide/migration/webpack) provides detailed instructions.

---

**Don't see your question here?** [Open an issue](https://github.com/filc-dev/rsbuild-plugin-web-extension/issues) or [start a discussion](https://github.com/filc-dev/rsbuild-plugin-web-extension/discussions) on GitHub!
