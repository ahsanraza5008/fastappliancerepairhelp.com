// Resolves a city's spintax, meta and FAQs ONCE. The route uses it for <head> + schema,
// CityPage uses the same object for the body, so FAQ schema text = visible FAQ text.
import citySpintax from "./citySpintax.js";
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

  // Meta title: 4 user-approved patterns. Hard 60-char limit: fall back to a shorter ending, then none.
  let metaTitle = sp("metaTitle");
  if (metaTitle.length > 60) {
    const head = `Appliance Repair ${city.city}, ${city.stateCode}`;
    metaTitle = [`${head} | Call Now`, `${head} | Same Day`, head].find((t) => t.length <= 60) ?? head;
  }

  return { stateCtx, sp, faqs, metaTitle, metaDescription: sp("metaDescription"), tokens };
}
