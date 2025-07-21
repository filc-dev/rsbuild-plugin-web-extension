import * as fs from "node:fs";
import path from "node:path";
import { type RsbuildPlugin, rspack } from "@rsbuild/core";
import { createJiti } from "jiti";
import ManifestParser from "./manifest/parser.js";

interface Options {
  manifestPath: string;
}

const pluginName = "rsbuild:plugin-web-extension";

export const pluginWebExtension = ({
  manifestPath,
}: Options): RsbuildPlugin => ({
  name: pluginName,
  setup: async (api) => {
    const jiti = createJiti(api.context.rootPath, { moduleCache: false });

    const manifestSourcePath = path.resolve(api.context.rootPath, manifestPath);
    if (!fs.existsSync(manifestSourcePath)) {
      throw new Error(`${pluginName}: Failed to read ${manifestSourcePath}`);
    }

    const manifestModule = jiti(manifestSourcePath);
    const manifest = manifestModule.default || manifestModule.manifest;

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
        output: {
          hotUpdateChunkFilename: "hot/[id].[fullhash].hot-update.js",
          hotUpdateMainFilename: "hot/[runtime].[fullhash].hot-update.json",
        },
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
            stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
          },
          () => {
            compilation.fileDependencies.add(manifestSourcePath);

            const updatedManifestModule = jiti(manifestPath);
            const manifest =
              updatedManifestModule.default || updatedManifestModule.manifest;
            const content = ManifestParser.convertManifestToString(manifest);

            const { RawSource } = compiler.webpack.sources;

            const source = new RawSource(content);
            const outputFilename = "manifest.json";

            compilation.emitAsset(outputFilename, source);
          }
        );
      });
    });
  },
});
