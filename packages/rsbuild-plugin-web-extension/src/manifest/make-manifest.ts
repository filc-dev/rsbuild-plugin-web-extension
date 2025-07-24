import * as fs from "node:fs";
import { resolve } from "node:path";
import ManifestParser from "./parser.js";

export const makeManifest = (
  manifest: chrome.runtime.ManifestV3,
  to: string
) => {
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to);
  }

  const toManifest = resolve(to, "manifest.json");

  fs.writeFileSync(
    toManifest,
    ManifestParser.convertManifestToString(manifest)
  );

  console.log("Manifest file created");
};
