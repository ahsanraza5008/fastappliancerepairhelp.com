import business from "../data/business.json";
import states from "../data/states.json";
import { cities } from "../lib/cities.js";
import { statePath } from "../lib/paths.js";

// Part 2 flips INCLUDE_CITIES to true once city pages exist, so the sitemap never lists 404s.
const INCLUDE_CITIES = true;

export function GET() {
  const base = `https://${business.domain}`;
  const urls = [
    "/", "/services/", "/service-areas/", "/about/", "/contact/",
    ...states.map(statePath),
    ...(INCLUDE_CITIES ? cities.map((c) => c.url) : []),
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${base}${u}</loc></url>`).join("\n")}
</urlset>`;
  return new Response(body, { headers: { "Content-Type": "application/xml" } });
}
