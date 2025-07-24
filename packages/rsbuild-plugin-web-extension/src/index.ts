import { type RsbuildPlugin, rspack } from "@rsbuild/core";
import ManifestParser from "./manifest/parser.js";

interface Options {
  manifest: chrome.runtime.ManifestV3;
}

const pluginName = "rsbuild:plugin-web-extension";

export const pluginWebExtension = ({ manifest }: Options): RsbuildPlugin => ({
  name: pluginName,
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
    const entry = Object.fromEntries(
      htmlEntryPoints.map(([name, entry]) => [
        name,
        entry?.replace(/\.html$/, ".tsx"),
      ])
    );

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
          writeToDisk: true,
        },
      });
    });

    api.onAfterCreateCompiler(({ compiler }) => {
      if (!(compiler instanceof rspack.Compiler)) {
        return;
      }

      compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
        compilation.hooks.processAssets.tap(
          {
            name: pluginName,
            stage: rspack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
          },
          () => {
            const content = ManifestParser.convertManifestToString(manifest);

            const { RawSource } = compiler.webpack.sources;

            const source = new RawSource(content);

            compilation.emitAsset("manifest.json", source);
          }
        );
      });
    });
  },
});
