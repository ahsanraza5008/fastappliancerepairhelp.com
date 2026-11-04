import raw from "../data/cities.json";
import states from "../data/states.json";
import { cityPath } from "./paths.js";

// O(n) derived fields only. nearbyCities is pre-computed offline in cities.json.
const stateByCode = new Map(states.map((s) => [s.code, s]));

export const cities = raw.map((city) => {
  const st = stateByCode.get(city.stateCode) || {};
  const enriched = {
    ...city,
    stateSlug: st.slug || city.stateCode.toLowerCase(),
    stateName: st.name || city.stateCode,
  };
  enriched.url = cityPath(enriched);
  return enriched;
});
