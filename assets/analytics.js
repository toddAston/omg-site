/* Off Meta Gaming — analytics + cookie consent (GA4 with Consent Mode v2).
   Privacy-first: no Google script loads and no cookies are set until the
   visitor clicks Accept. Choice is remembered in localStorage.

   TO ACTIVATE: replace the GA_ID placeholder below with your GA4
   Measurement ID (looks like "G-ABC123XYZ"). Until then this file does
   nothing — no banner, no tracking. */
(function () {
  "use strict";
  var GA_ID = "G-XXXXXXXXXX";            // <-- paste your GA4 Measurement ID here
  var STORE_KEY = "omg-consent";          // "granted" | "denied"

  // Dormant until a real ID is set, so it's safe to ship ahead of time.
  if (!GA_ID || GA_ID.indexOf("G-XXXX") === 0) return;

  // gtag stub + Consent Mode v2 defaults (must run before GA loads).
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied"
  });

  var choice = null;
  try { choice = localStorage.getItem(STORE_KEY); } catch (e) {}

  function loadGA() {
    gtag("js", new Date());
    gtag("config", GA_ID, { anonymize_ip: true });
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_ID);
    document.head.appendChild(s);
  }

  function remember(v) { try { localStorage.setItem(STORE_KEY, v); } catch (e) {} }

  function grant() {
    remember("granted");
    gtag("consent", "update", { analytics_storage: "granted" });
    loadGA();
    hideBanner();
  }

  function deny() {
    remember("denied");
    gtag("consent", "update", { analytics_storage: "denied" });
    hideBanner();
  }

  // Returning visitor who already chose.
  if (choice === "granted") {
    gtag("consent", "update", { analytics_storage: "granted" });
    loadGA();
    return;
  }
  if (choice === "denied") { return; }

  // First-time visitor: show the banner once the DOM is ready.
  var bannerEl = null;
  function hideBanner() { if (bannerEl && bannerEl.parentNode) bannerEl.parentNode.removeChild(bannerEl); }

  function buildBanner() {
    var b = document.createElement("div");
    b.className = "cc-banner";
    b.setAttribute("role", "dialog");
    b.setAttribute("aria-label", "Cookie consent");
    b.setAttribute("aria-live", "polite");

    var p = document.createElement("p");
    p.className = "cc-text";
    p.textContent = "We use Google Analytics to understand how the site is used. Cookies load only if you accept.";

    var actions = document.createElement("div");
    actions.className = "cc-actions";

    var decline = document.createElement("button");
    decline.type = "button";
    decline.className = "cc-btn cc-decline";
    decline.textContent = "Decline";
    decline.addEventListener("click", deny);

    var accept = document.createElement("button");
    accept.type = "button";
    accept.className = "cc-btn cc-accept";
    accept.textContent = "Accept";
    accept.addEventListener("click", grant);

    actions.appendChild(decline);
    actions.appendChild(accept);
    b.appendChild(p);
    b.appendChild(actions);
    return b;
  }

  function show() { bannerEl = buildBanner(); document.body.appendChild(bannerEl); }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", show);
  } else {
    show();
  }
})();
