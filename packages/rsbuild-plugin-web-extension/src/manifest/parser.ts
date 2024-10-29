type Manifest = chrome.runtime.ManifestV3;

const getOutputFile = (file: string): string => {
  return file
    .replace(/\.(scss|stylus|sass)/g, ".css")
    .replace(/\.(jsx|ts|tsx)/g, ".js");
};

class ManifestParser {
  private constructor() {}

  static convertManifestToString(_manifest: Manifest): string {
    let manifest = { ..._manifest };
    if (process.env.__FIREFOX__) {
      manifest = ManifestParser.convertToFirefoxCompatibleManifest(manifest);
    }

    return getOutputFile(JSON.stringify(manifest, null, 2));
  }

  static convertToFirefoxCompatibleManifest(manifest: Manifest) {
    const manifestCopy = {
      ...manifest,
    } as { [key: string]: unknown };

    manifestCopy.background = {
      scripts: [manifest.background?.service_worker],
      type: "module",
    };
    if (manifest.options_page) {
      manifestCopy.options_ui = {
        page: manifest.options_page,
      };
    }
    manifestCopy.content_security_policy = {
      extension_pages: "script-src 'self'; object-src 'self'",
    };

    manifestCopy.options_page = undefined;

    return manifestCopy as Manifest;
  }
}

export default ManifestParser;
