import business from "../data/business.json";

export function GET() {
  return new Response(
    `User-agent: *\nAllow: /\nSitemap: https://${business.domain}/sitemap.xml\n`,
    { headers: { "Content-Type": "text/plain" } }
  );
}
