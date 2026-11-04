// Merges the approved Variant 1 strings (data/citySpintax.json) with the extra variants
// written in batches (data/city-variants/*.json -> { key: [variant2, variant3, ...] }).
// Keys already written as "{a|b|...}" in citySpintax.json (metaTitle, h1, metaDescription) are kept as-is.
import base from "../data/citySpintax.json";

const parts = import.meta.glob("../data/city-variants/*.json", { eager: true, import: "default" });
const extra = {};
for (const part of Object.values(parts)) {
  for (const [key, list] of Object.entries(part)) {
    extra[key] = [...(extra[key] || []), ...list];
  }
}

const merged = {};
for (const [key, v1] of Object.entries(base)) {
  if (v1.startsWith("{") && v1.endsWith("}")) { merged[key] = v1; continue; }
  const all = [v1, ...(extra[key] || [])];
  merged[key] = all.length > 1 ? `{${all.join("|")}}` : v1;
}

export default merged;
