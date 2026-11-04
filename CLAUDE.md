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
- [ ] Part 1 complete
- [ ] State template approved
- [ ] City template approved
- [ ] All cities built

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
- Stop for user approval at every checkpoint.
