import { defineConfig } from "astro/config";
import business from "./src/data/business.json" with { type: "json" };

export default defineConfig({
  site: `https://${business.domain}`,
  output: "static",
  devToolbar: { enabled: false },
  trailingSlash: "always",
  build: {
    format: "directory",
    concurrency: 4
  }
});
