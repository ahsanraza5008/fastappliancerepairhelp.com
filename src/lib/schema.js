// JSON-LD builders. Every builder takes the same data the page renders visibly.

export function breadcrumbSchema(items, domain) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `https://${domain}${item.url}`,
    })),
  };
}

// faqs: [{ q, a }] where a may contain paragraph breaks ("\n\n").
// The answer text is passed through unchanged so schema = visible text.
export function faqSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
