import * as path from "node:path";
import { defineConfig } from "rspress/config";

export default defineConfig({
  root: path.join(__dirname, "docs"),
  title: "rsbuild-plugin-web-extension",
  description: "rbsuild plugin for chrome/web extension",
  logo: {
    light: "/logo-black.png",
    dark: "/logo-white.png",
  },
  themeConfig: {
    socialLinks: [
      {
        icon: "github",
        mode: "link",
        content: "https://github.com/filc-dev/rsbuild-plugin-web-extension",
      },
    ],
  },
});
