// Resolves every state-page string ONCE so the route (meta, schema) and the page body share it.
import business from "../data/business.json";
import stateSpintax from "../data/stateSpintax.json";
import stateContexts from "../data/states-context.json";
import { cities } from "./cities.js";
import { spin } from "./spin.js";

const ctxByState = new Map(stateContexts.map((c) => [c.stateCode, c]));
const citiesByState = new Map();
for (const c of cities) {
  if (!citiesByState.has(c.stateCode)) citiesByState.set(c.stateCode, []);
  citiesByState.get(c.stateCode).push(c);
}

export function stateContent(state) {
  const ctx = ctxByState.get(state.code) || {};
  const list = citiesByState.get(state.code) || []; // dataset order = largest cities first
  const top = list.slice(0, 3).map((c) => c.city);
  const tokens = {
    stateName: state.name,
    stateCode: state.code,
    cityCount: list.length.toLocaleString("en-US"),
    topCity1: top[0] ?? state.name,
    topCity2: top[1] ?? top[0] ?? state.name,
    topCity3: top[2] ?? top[0] ?? state.name,
    climate: ctx.climate ?? "",
    soil: ctx.soil ?? "",
    housingStock: ctx.housingStock ?? "",
    infrastructure: ctx.infrastructure ?? "",
    seasonalRisk: ctx.seasonalRisk ?? "",
    waterQuality: ctx.waterQuality ?? "",
    nicheContext: ctx.nicheContext ?? "",
    regionalNotes: ctx.regionalNotes ?? "",
  };
  const fill = (str) => String(str || "").replace(/\[(\w+)\]/g, (m, k) => (k in tokens ? tokens[k] : m));
  const sp = (key) => fill(spin(stateSpintax[key], state.code));

  const faqs = [1, 2, 3, 4, 5].map((n) => ({ q: sp(`faq_${n}_q`), a: sp(`faq_${n}_a`) }));
  const cityLinks = [...list].sort((a, b) => a.city.localeCompare(b.city));

  return {
    sp,
    faqs,
    cityLinks,
    metaTitle: `Appliance Repair in ${state.name} | ${sp("metaTitleSuffix")}`,
    metaDescription: sp("metaDescription"),
  };
}
