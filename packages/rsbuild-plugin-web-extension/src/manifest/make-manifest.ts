import * as fs from "node:fs";
import { resolve } from "node:path";
import ManifestParser from "./parser.js";
import { logger } from "@rsbuild/core";

export const makeManifest = async (
  manifest: chrome.runtime.ManifestV3,
  to: string
) => {
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to);
  }

  const toManifest = resolve(to, "manifest.json");

  fs.writeFileSync(
    toManifest,
    ManifestParser.convertManifestToString(manifest.default)
  );

  logger.log("Manifest file created");
};
