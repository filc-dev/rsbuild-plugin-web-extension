# rsbuild-plugin-web-extension

> rsbuild plugin for chrome/web extension

## Get started

install the plugin

```bash
npm i -D rsbuild-plugin-web-extension
```

```bash
pnpm i -D rsbuild-plugin-web-extension
```

```bash
yarn add -D rsbuild-plugin-web-extension
```

add the plugin to your rsbuild.config.js

```ts
import { pluginWebExtension } from "rsbuild-plugin-web-extension";
import manifest from "./manifest";

export default defineConfig({
  plugins: [
    pluginWebExtension({
      manifest,
    }),
  ],
});
```

## Examples

- [rsbuild-chrome-extension-boilerplate-react](https://github.com/filc-dev/rsbuild-chrome-extension-boilerplate-react)
