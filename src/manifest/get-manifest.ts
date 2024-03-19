import { type RsbuildPluginAPI } from "@rsbuild/core";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

export const getManifest = async (
  api: RsbuildPluginAPI
): Promise<{
  default: chrome.runtime.ManifestV3;
}> => {
  const allowManifestExtensions = ["ts", "js", "json"];

  const mainifestExtension = allowManifestExtensions.find((ext) => {
    return existsSync(resolve(api.context.rootPath, `manifest.${ext}`));
  });

  if (!mainifestExtension) {
    throw new Error("Can't find manifest file.");
  }

  const manifestPath = resolve(
    api.context.rootPath,
    `manifest.${mainifestExtension}`
  );

  return await import(manifestPath);
};
