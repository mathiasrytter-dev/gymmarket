/* ============================================================
   GymMarket – konfiguration
   ============================================================ */
window.GM_CONFIG = {
  site: { name: "GymMarket", domain: "gymmarket.dk", email: "kontakt@gymmarket.dk" },

  // ---- FØR LANCERING: udfyld virksomhedsoplysninger ----
  // Vises i footer, vilkår og privatlivspolitik. Tomme felter skjules i footeren.
  company: {
    legalName: "",          // fx "GymMarket" eller "GymMarket ApS"
    cvr: "",                // fx " "
    address: "",            // fx "8200 Aarhus N, Danmark"
    email: "kontakt@gymmarket.dk"
  },

  // ---- Backend ----
  // "local"    = prototype (brugere og annoncer kun i denne browser)
  // "supabase" = drift. "test" bruges automatisk på localhost eller med ?env=test
  backend: {
    type: "supabase", supabaseUrl: "https://ayipmkmtuobavyyntdhc.supabase.co/rest/v1/", supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5aXBta210dW9iYXZ5eW50ZGhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ5MTU2ODIsImV4cCI6MjExMDQ5MTY4Mn0.4mutojIVomwezrdQTkLUbY61dhBf-IE9oR_ypNlRa_o",
    test: { supabaseUrl: "", supabaseAnonKey: "" }
  },

  // ---- Eksempelannoncer ----
  // true = altid · false = aldrig · "auto" = skjules automatisk, når der er
  // mindst demoUntilRealListings rigtige annoncer
  showDemoListings: "auto",
  demoUntilRealListings: 10,

  showPricing: false,
  languages: ["da", "en", "de", "sv", "nb", "fi", "nl", "fr", "es", "it", "pl"],
  defaultLanguage: "en",
  langDefaults: {
    da: ["DK", "DKK"], en: ["", "EUR"], de: ["DE", "EUR"], sv: ["SE", "SEK"], nb: ["NO", "NOK"],
    fi: ["FI", "EUR"], nl: ["NL", "EUR"], fr: ["FR", "EUR"], es: ["ES", "EUR"], it: ["IT", "EUR"], pl: ["PL", "PLN"]
  },
  countries: {
    AT: "EUR", BE: "EUR", BG: "EUR", HR: "EUR", CY: "EUR", CZ: "CZK", DK: "DKK", EE: "EUR", FI: "EUR",
    FR: "EUR", DE: "EUR", GR: "EUR", HU: "HUF", IE: "EUR", IT: "EUR", LV: "EUR", LT: "EUR", LU: "EUR",
    MT: "EUR", NL: "EUR", PL: "PLN", PT: "EUR", RO: "RON", SK: "EUR", SI: "EUR", ES: "EUR", SE: "SEK",
    NO: "NOK", IS: "ISK", CH: "CHF", GB: "GBP"
  },
  currencies: ["EUR", "DKK", "SEK", "NOK", "PLN", "CZK", "HUF", "RON", "CHF", "GBP", "ISK"],
  fxToEUR: { EUR: 1, DKK: 0.134, SEK: 0.092, NOK: 0.085, PLN: 0.235, CZK: 0.040, HUF: 0.0025, RON: 0.20, CHF: 1.07, GBP: 1.17, ISK: 0.0072 },
  listingDays: 60,
  wantedDays: 90,
  // ---- Til senere brug (vises ikke) ----
  paymentsEnabled: false,
  markets: {},
  tierTable: [
    ["DKK", 1999, 20000, 29, 79, 149], ["EUR", 269, 2699, 4, 11, 20], ["SEK", 2999, 29999, 45, 119, 219],
    ["NOK", 2999, 29999, 45, 119, 219], ["PLN", 1199, 11999, 19, 49, 89], ["CZK", 6999, 69999, 99, 279, 499],
    ["HUF", 99999, 999999, 1590, 4290, 7990], ["RON", 1299, 12999, 19, 55, 99], ["CHF", 249, 2499, 4, 10, 19],
    ["GBP", 229, 2299, 4, 9, 17], ["ISK", 39999, 399999, 590, 1590, 2990]
  ]
};
window.GM_CONFIG.tierPrices = window.GM_CONFIG.tierTable.flatMap(([c, a, b, p1, p2, p3]) => [
  { tier: "small", currency: c, min_price: 0, max_price: a, amount: p1 },
  { tier: "medium", currency: c, min_price: a + 1, max_price: b, amount: p2 },
  { tier: "large", currency: c, min_price: b + 1, max_price: null, amount: p3 }
]);
