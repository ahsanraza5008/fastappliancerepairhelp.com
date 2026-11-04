// The ONLY place state and city URLs are built.
// Option D (custom): state /{stateSlug}/  city /{stateSlug}/{citySlug}/
export function statePath(state) {
  return `/${state.slug}/`;
}

export function cityPath(city) {
  return `/${city.stateSlug}/${city.slug}/`;
}

// "/florida/naples/" -> "florida/naples" (value for the [...path] rest param)
export const toParam = (p) => p.replace(/^\/|\/$/g, "");
