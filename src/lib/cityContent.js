// Resolves a city's spintax, meta and FAQs ONCE. The route uses it for <head> + schema,
// CityPage uses the same object for the body, so FAQ schema text = visible FAQ text.
import citySpintax from "../data/citySpintax.json";
import stateContexts from "../data/states-context.json";
import { spin } from "./spin.js";

const ctxByState = new Map(stateContexts.map((c) => [c.stateCode, c]));

export function countyLabel(city) {
  const c = city?.county ?? "";
  if (!c) return city?.stateName ?? "";
  if (city.stateCode === "DC") return "Washington, D.C.";
  if (city.stateCode === "LA") return `${c} Parish`;
  if (city.stateCode === "AK") return `the ${c} area`;
  if (city.stateCode === "VA" && c === city.city) return `the City of ${c}`;
  return `${c} County`;
}

const TITLE_SUFFIXES = ["Same Day Service", "24/7 Help", "Same Day"];

export function cityContent(city) {
  const stateCtx = ctxByState.get(city.stateCode) || {};
  const nearby = city.nearbyCities || [];
  const tokens = {
    city: city.city,
    county: countyLabel(city),
    stateCode: city.stateCode,
    stateName: city.stateName,
    nearby1: nearby[0]?.city ?? city.stateName,
    nearby2: nearby[1]?.city ?? nearby[0]?.city ?? city.stateName,
    climate: stateCtx.climate ?? "",
    soil: stateCtx.soil ?? "",
    housingStock: stateCtx.housingStock ?? "",
    infrastructure: stateCtx.infrastructure ?? "",
    seasonalRisk: stateCtx.seasonalRisk ?? "",
    waterQuality: stateCtx.waterQuality ?? "",
    nicheContext: stateCtx.nicheContext ?? "",
    regionalNotes: stateCtx.regionalNotes ?? "",
  };
  const fill = (str) => String(str || "").replace(/\[(\w+)\]/g, (m, k) => (k in tokens ? tokens[k] : m));
  // Seed = city slug + state + key: deterministic per city, independent per element.
  const seed = `${city.stateCode}-${city.slug}`;
  const sp = (key) => fill(spin(citySpintax[key], `${seed}:${key}`));

  const faqs = [1, 2, 3, 4, 5, 6].map((n) => ({ q: sp(`faq_${n}_question`), a: sp(`faq_${n}_answer`) }));

  // Meta title: "Appliance Repair Naples FL | Same Day Service" — hard 60-char limit, no comma.
  const head = `Appliance Repair ${city.city} ${city.stateCode}`;
  const preferred = sp("metaTitleSuffix");
  const suffix = [preferred, ...TITLE_SUFFIXES].find((s) => `${head} | ${s}`.length <= 60);
  const metaTitle = suffix ? `${head} | ${suffix}` : head.slice(0, 60);

  return { stateCtx, sp, faqs, metaTitle, metaDescription: sp("metaDescription"), tokens };
}
