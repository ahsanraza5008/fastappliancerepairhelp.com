// Runtime extras only. Phone links are server-rendered from business.json.
const SITE = {
  phone: "(877) 401-0234",
  nav: ["Home", "Services", "Service Areas", "About", "Contact"],
  year: new Date().getFullYear()
};

document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = SITE.year; });

// Mark the current nav item.
const here = location.pathname;
document.querySelectorAll(".site-nav a").forEach((a) => {
  const href = a.getAttribute("href");
  if (href === here || (href !== "/" && here.startsWith(href))) a.setAttribute("aria-current", "page");
});

// Mobile call bar: hidden while the hero's call button is on screen, shown after.
const bar = document.querySelector(".callbar");
const trigger = document.querySelector("[data-callbar-trigger]");
if (bar && trigger && "IntersectionObserver" in window) {
  new IntersectionObserver(([entry]) => {
    bar.classList.toggle("is-hidden", entry.isIntersecting || entry.boundingClientRect.top > 0);
  }).observe(trigger);
}
