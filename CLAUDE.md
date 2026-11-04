# Nation-Astra Project Context

## Framework
- Astro (static output). Dev: `npm run dev` (port 4321). Build: `npm run build` → `dist/`. Preview build: `npm run preview`.
- All state/city URLs come from `src/lib/paths.js` only.

## Business
- Name: Appliance Repair Experts
- Phone: (877) 401-0234 (tel:+18774010234)
- Domain: fastappliancerepairhelp.com
- Niche: Appliance Repair
- Primary Keyword: appliance repair (in every meta title, H1 and meta description)
- Secondary Keywords: refrigerator repair, washer and dryer repair, same day appliance repair, emergency appliance repair, appliance repair cost
- USPs: 24/7 Help, Same Day Service, Clean Work, Upfront Pricing
- Services: Refrigerator Repair, Freezer & Ice Maker Repair, Washer Repair, Dryer Repair, Dishwasher Repair, Oven & Range Repair, Microwave Repair, Garbage Disposal Repair
- URL Structure: D (custom) — state `/florida/`, city `/florida/naples/`

## Build Settings
- State Spintax Variants: 5
- City Spintax Variants: 28
- citySpintax.json must be written in batches (user request) so the write never breaks.

## Build Status
- [x] Design approved
- [x] Part 1 complete
- [x] State template approved
- [x] City template approved (brands section added)
- [x] All cities built (31,032 pages + 404; sitemap 31,032 URLs)

## Notes
- No licensing/certification claims. No invented prices on main pages (factors only); city pricing = ranges only.
- Lead-gen model: never imply local offices. "Upfront Pricing" = price confirmed before work starts.
- Design v2 (v1 rejected as too similar to the user's other sites): bright laundry-room daylight. White + cool mist surfaces, cobalt primary (all call buttons), "ready" green for checks. Bricolage Grotesque headings, Instrument Sans body. Rounded appliance tiles, symptom table, dashed call-outs, floating mobile call bar.
- Write as the repair company ("we", "our technicians"). Lead-gen "we connect you with local technicians / independent network" wording is ONLY allowed on the Service Areas page, nowhere else.
- Content style must differ from the user's other builds: not the same copy, not the same section styling; basic section order stays.
- Windows local dev: if Astro fails with "Cannot find native binding" (satteri), run `npm.cmd install @bruits/satteri-wasm32-wasi@0.10.5 --force --no-save`.
- Never say "nationwide" / "all 50 states" / "anywhere in the US" in copy, titles or meta. Use "near you" / "in your city" (or the actual city/state on location pages).
- Sitemap: `INCLUDE_CITIES` in src/pages/sitemap.xml.js stays false until Part 2 builds city pages, then flip to true.
- FAQ data contract: `{ q, a }` where `a` is one string; paragraphs separated by "\n\n". Render with components/Faq.astro, schema with lib/schema.js faqSchema() (same text).
- cities.json generated from the skill dataset: 30,976 cities, 128 same-name collisions disambiguated with -county suffix, nearbyCities = 4 nearest in state (pre-computed).
- Spin seeds are salted per key (`${state.code}:${key}`, city: `${stateCode}-${slug}:${key}`) so each element picks its variant independently.
- City variants: Variant 1 lives in src/data/citySpintax.json; Variants 2..N live in src/data/city-variants/b01..b10 *.json (merged by src/lib/citySpintax.js). Paragraphs/FAQ answers = 28, short headings/CTA lines = 10–12. metaTitle/h1/metaDescription = 4 user-written patterns ([sep] token renders "|").
- FAQ questions are paired to answers via src/data/faqMaps.json (answer index -> question index). Keep maps in sync if variants are added/removed.
- Same-name towns in a state get offset H1/title variants (lib/cityContent.js nameRank) so no H1/title is duplicated.
- Audit after builds: page count 31,032; 0 leftover [tokens]; 0 duplicate H1/titles; FAQ schema = visible text.
- Brand cards (src/data/brands.json): 8 "seen" variants per brand, picked per city, and card order shuffled per city (CityPage.astro).
- Stop for user approval at every checkpoint.
