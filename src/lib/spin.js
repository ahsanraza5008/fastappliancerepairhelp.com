// Seeded spintax resolver. Seed = city.slug (city pages) or state.code (state pages).
// Same seed always resolves the same variants across rebuilds.
export function spin(str, seed) {
  if (!str) return "";
  let hash = 0;
  const s = String(seed || "default");
  for (let i = 0; i < s.length; i++) {
    hash = ((hash << 5) - hash) + s.charCodeAt(i);
    hash |= 0;
  }
  return String(str).replace(/\{([^{}]+)\}/g, (match, options) => {
    const choices = options.split("|");
    hash = ((hash << 5) - hash) + 1;
    hash |= 0;
    return choices[Math.abs(hash) % choices.length];
  });
}

// Deterministic index in [0, n) for a seed — same hashing as spin() uses for one {a|b|c} group.
export function pickIndex(seed, n) {
  if (!n) return 0;
  let hash = 0;
  const s = String(seed || "default");
  for (let i = 0; i < s.length; i++) {
    hash = ((hash << 5) - hash) + s.charCodeAt(i);
    hash |= 0;
  }
  hash = ((hash << 5) - hash) + 1;
  hash |= 0;
  return Math.abs(hash) % n;
}
