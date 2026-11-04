// Resolves a city's spintax, meta and FAQs ONCE. The route uses it for <head> + schema,
// CityPage uses the same object for the body, so FAQ schema text = visible FAQ text.
import citySpintax from "./citySpintax.js";
import stateContexts from "../data/states-context.json";
import { spin, pickIndex } from "./spin.js";
import faqMaps from "../data/faqMaps.json";
import rawCities from "../data/cities.json";

// Same-name towns in one state (max 3) get different H1 and title variants so none are duplicated.
const nameRank = new Map();
{
  const groups = new Map();
  for (const c of rawCities) {
    const k = `${c.stateCode}|${c.city}`;
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(c.slug);
  }
  for (const slugs of groups.values()) {
    if (slugs.length > 1) slugs.sort().forEach((slug, i) => nameRank.set(slug, i));
  }
}

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
    sep: "|", // lets meta titles contain " | " without clashing with the spintax separator
  };
  const fill = (str) => String(str || "").replace(/\[(\w+)\]/g, (m, k) => (k in tokens ? tokens[k] : m));
  // Seed = city slug + state + key: deterministic per city, independent per element.
  const seed = `${city.stateCode}-${city.slug}`;
  const sp = (key) => fill(spin(citySpintax[key], `${seed}:${key}`));

  // FAQ question and answer are picked TOGETHER so the wording always matches the answer.
  const choices = (key) => {
    const v = citySpintax[key] || "";
    return v.startsWith("{") && v.endsWith("}") ? v.slice(1, -1).split("|") : [v];
  };
  const faqs = [1, 2, 3, 4, 5, 6].map((n) => {
    const answers = choices(`faq_${n}_answer`);
    const questions = choices(`faq_${n}_question`);
    const ai = pickIndex(`${seed}:faq_${n}`, answers.length);
    const map = faqMaps[String(n)];
    const qi = map ? map[ai] ?? 0 : ai % questions.length;
    return { q: fill(questions[qi]), a: fill(answers[ai]) };
  });

  // H1 + meta title: 4 user-approved patterns each. Same-name towns are offset so they never match.
  const rank = nameRank.get(city.slug) ?? 0;
  const pickOffset = (key) => {
    const list = choices(key);
    // Same-name towns share a base pick (seeded by state + name) and step through the list by rank.
    const baseSeed = nameRank.has(city.slug) ? `${city.stateCode}|${city.city}` : seed;
    return fill(list[(pickIndex(`${baseSeed}:${key}`, list.length) + rank) % list.length]);
  };
  const h1 = pickOffset("h1");
  // Hard 60-char limit on titles: fall back to a shorter ending, then none.
  let metaTitle = pickOffset("metaTitle");
  if (metaTitle.length > 60) {
    const head = `Appliance Repair ${city.city}, ${city.stateCode}`;
    metaTitle = [`${head} | Call Now`, `${head} | Same Day`, head].find((t) => t.length <= 60) ?? head;
  }

  // Meta description: keep the picked variant unless a long city/county name pushes it past 160
  // characters; then use the next variant that fits (or the shortest one).
  const descs = choices("metaDescription").map(fill);
  const di = pickIndex(`${seed}:metaDescription`, descs.length);
  const ordered = [...descs.slice(di), ...descs.slice(0, di)];
  const shortCounty = (d) => d.replace(tokens.county, "the area");
  const metaDescription =
    ordered.find((d) => d.length <= 160) ??
    ordered.map(shortCounty).find((d) => d.length <= 160) ??
    ordered.map(shortCounty).reduce((a, b) => (b.length < a.length ? b : a));

  return { stateCtx, sp, faqs, h1, metaTitle, metaDescription, tokens };
}
