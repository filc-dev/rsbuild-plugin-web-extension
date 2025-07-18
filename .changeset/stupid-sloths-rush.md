---
"rsbuild-plugin-web-extension": major
---

### Breaking Change

The plugin options have been updated. The `manifest` option, which accepted the manifest object directly, has been replaced with `manifestPath`, which accepts a path to the manifest file.

### Features

- **Dynamic Manifests**: You can now use a `.ts` or `.js` file for your manifest. This allows for dynamic generation of the manifest content, using TypeScript types, and importing other modules.
- **Hot Module Replacement (HMR)**: Changes to the manifest file will now trigger a hot reload during development.
- **Developer Experience**: The `writeToDisk` option is now enabled by default in development mode, making it easier to load and test the extension in the browser.
