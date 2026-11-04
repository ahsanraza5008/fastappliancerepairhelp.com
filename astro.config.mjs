import { defineConfig } from "astro/config";
import business from "./src/data/business.json" with { type: "json" };

export default defineConfig({
  site: `https://${business.domain}`,
  output: "static",
  outDir: "./_site", // Cloudflare Workers assets.directory in wrangler.jsonc
  devToolbar: { enabled: false },
  trailingSlash: "always",
  build: {
    format: "directory",
    concurrency: 4
  }
});
