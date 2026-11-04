// JSON-LD builders. Every page emits ONE <script type="application/ld+json"> with an @graph
// (assembled in layouts/Base.astro). Entities are linked by @id so Google sees one business,
// one website, and page-specific WebPage / Service / BreadcrumbList / FAQPage nodes.
//
// Rules:
// - Every URL is absolute and uses the site's trailing-slash format (https://domain/path/).
// - No reviews, ratings, prices, opening hours for a storefront, street address or geo:
//   the business has no public storefront, so nothing is invented.
import business from "../data/business.json";
import services from "../data/services.json";

export const SITE = `https://${business.domain}`;
export const ids = {
  business: `${SITE}/#business`,
  website: `${SITE}/#website`,
};

// "/florida/naples/" -> "https://domain/florida/naples/" (always with trailing slash)
export function absUrl(path = "/") {
  let p = String(path || "/");
  const [base, hash] = p.split("#");
  let clean = base.startsWith("/") ? base : `/${base}`;
  if (!clean.endsWith("/")) clean += "/";
  return `${SITE}${clean}${hash ? `#${hash}` : ""}`;
}

const phoneE164 = business.phoneHref; // "+18774010234"

// ---------- Places ----------
export function statePlace(stateName) {
  return { "@type": "State", name: stateName, containedInPlace: { "@type": "Country", name: "United States" } };
}

export function cityPlace(city, countyName) {
  return {
    "@type": "City",
    name: city.city,
    containedInPlace: countyName
      ? { "@type": "AdministrativeArea", name: countyName, containedInPlace: statePlace(city.stateName) }
      : statePlace(city.stateName),
  };
}

const COUNTRY = { "@type": "Country", name: "United States" };

// ---------- Site-wide entities ----------
// The business. areaServed is narrowed on state/city pages to the place the page is about.
export function businessNode(areaServed = COUNTRY) {
  return {
    "@type": "HomeAndConstructionBusiness", // schema.org LocalBusiness subtype for in-home trades
    "@id": ids.business,
    name: business.name,
    url: absUrl("/"),
    telephone: phoneE164,
    description: "Same day in-home appliance repair for refrigerators, washers, dryers, dishwashers, ovens, microwaves and garbage disposals, with upfront pricing and 24/7 phone help.",
    areaServed,
    knowsAbout: business.services,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: phoneE164,
      contactType: "customer service",
      areaServed: "US",
      availableLanguage: "English",
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "00:00",
        closes: "23:59",
      },
    },
  };
}

export function websiteNode() {
  return {
    "@type": "WebSite",
    "@id": ids.website,
    url: absUrl("/"),
    name: business.name,
    publisher: { "@id": ids.business },
    inLanguage: "en-US",
  };
}

// ---------- Page-level entities ----------
export function webPageNode({ path, name, description, type = "WebPage", hasBreadcrumb = true, aboutId }) {
  const url = absUrl(path);
  return {
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    isPartOf: { "@id": ids.website },
    about: { "@id": aboutId || ids.business },
    ...(hasBreadcrumb ? { breadcrumb: { "@id": `${url}#breadcrumb` } } : {}),
    inLanguage: "en-US",
  };
}

// Appliance repair Service for a page, with the 8 repair services as an OfferCatalog.
export function serviceNode({ path, name, areaServed = COUNTRY }) {
  const url = absUrl(path);
  return {
    "@type": "Service",
    "@id": `${url}#service`,
    name,
    serviceType: "Appliance repair",
    url,
    provider: { "@id": ids.business },
    areaServed,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Appliance repair services",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.name,
          description: s.line,
          url: absUrl(`/services/#${s.slug}`),
        },
      })),
    },
  };
}

// items: [{ name, url }] — the same array the visible Breadcrumb component renders.
export function breadcrumbNode(items, path) {
  const url = absUrl(path ?? items[items.length - 1]?.url ?? "/");
  return {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absUrl(item.url),
    })),
  };
}

// faqs: [{ q, a }]. Paragraph breaks ("\n\n") become a single space, so the schema text is the
// visible text exactly as rendered (paragraphs read in order).
export function faqNode(faqs, path) {
  const url = absUrl(path);
  return {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    isPartOf: { "@id": `${url}#webpage` },
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: String(f.a).replace(/\n\n/g, " ") },
    })),
  };
}

// Wraps page nodes into one graph. The business and website nodes are always included.
export function graph(pageNodes = [], { areaServed } = {}) {
  return {
    "@context": "https://schema.org",
    "@graph": [businessNode(areaServed), websiteNode(), ...pageNodes],
  };
}
