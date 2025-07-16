import type { RsbuildPlugin } from "@rsbuild/core";
import { makeManifest } from "./manifest/make-manifest.js";

interface Options {
  manifest: chrome.runtime.ManifestV3;
}
export const pluginWebExtension = ({ manifest }: Options): RsbuildPlugin => ({
  name: "rsbuild:plugin-web-extension",
  setup: async (api) => {
    const htmlEntryPoints = Object.entries({
      popup: manifest.action?.default_popup,
      devtools: manifest.devtools_page,
      newtab: manifest.chrome_url_overrides?.newtab,
      options: manifest.options_ui?.page,
    }).filter(([, value]) => value);

    /**
     * @todo refactor with html-bundler-webpack-plugin
     * @issue https://github.com/web-infra-dev/rspack/issues/5971
     * @ref https://github.com/webdiscus/html-bundler-webpack-plugin
     */
    const entry = htmlEntryPoints.reduce((acc, [name, entry]) => {
      acc[name] = entry?.replace(/\.html$/, ".tsx");
      return acc;
    }, {} as Record<string, string | undefined>);

    api.modifyRspackConfig((config, { mergeConfig, HtmlPlugin }) => {
      return mergeConfig(config, {
        plugins: htmlEntryPoints.map(([name, template]) => {
          return new HtmlPlugin({
            chunks: [name],
            template: template,
            filename: template,
          });
        }),
      });
    });

    api.modifyRsbuildConfig((config, { mergeRsbuildConfig }) => {
      return mergeRsbuildConfig(config, {
        tools: {
          htmlPlugin: false,
        },
        source: {
          entry: {
            ...entry,
            background: manifest.background?.service_worker || "",
          },
        },
        output: {
          filenameHash: false,
          filename: {
            js: "index.js",
          },
          distPath: {
            js: "src/[name]",
          },
        },
        dev: {
          writeToDisk: true
        }
      });
    });

    api.onAfterBuild(() => {
      makeManifest(manifest, api.context.distPath);
    });
  },
});
