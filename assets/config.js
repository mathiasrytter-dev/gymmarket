/* ============================================================
   GymMarket – konfiguration (EU-version)
   LANCERING: alle markeder har payments_enabled = false.
   I Supabase-tilstand styres betaling pr. land, priser og
   annonceperiode fra databasen (markets, tier_prices, settings).
   ============================================================ */
window.GM_CONFIG = {
  version: "1.1.0",
  site: { name: "GymMarket", domain: "gymmarket.dk", email: "kontakt@gymmarket.dk" },

  // "local" = prototype (data kun i egen browser) · "supabase" = drift
  backend: { type: "local", supabaseUrl: "", supabaseAnonKey: "" },
  showDemoListings: true,

  // Sprog: tilføj et nyt sprog ved at lave assets/i18n/xx.js og skrive koden her
  languages: ["da", "en", "de", "sv", "nb", "fi", "nl", "fr", "es", "it", "pl"],
  defaultLanguage: "en",
  langDefaults: { // standardland og -valuta pr. sprog
    da: ["DK", "DKK"], en: ["", "EUR"], de: ["DE", "EUR"], sv: ["SE", "SEK"], nb: ["NO", "NOK"],
    fi: ["FI", "EUR"], nl: ["NL", "EUR"], fr: ["FR", "EUR"], es: ["ES", "EUR"], it: ["IT", "EUR"], pl: ["PL", "PLN"]
  },

  // EU-27 + EØS/Schweiz/UK. Landenavne oversættes automatisk af browseren.
  countries: {
    AT: "EUR", BE: "EUR", BG: "EUR", HR: "EUR", CY: "EUR", CZ: "CZK", DK: "DKK", EE: "EUR", FI: "EUR",
    FR: "EUR", DE: "EUR", GR: "EUR", HU: "HUF", IE: "EUR", IT: "EUR", LV: "EUR", LT: "EUR", LU: "EUR",
    MT: "EUR", NL: "EUR", PL: "PLN", PT: "EUR", RO: "RON", SK: "EUR", SI: "EUR", ES: "EUR", SE: "SEK",
    NO: "NOK", IS: "ISK", CH: "CHF", GB: "GBP"
  },
  currencies: ["EUR", "DKK", "SEK", "NOK", "PLN", "CZK", "HUF", "RON", "CHF", "GBP", "ISK"],

  // Vejledende kurser til EUR – kun til visning og filtrering. Opdatér jævnligt.
  fxToEUR: { EUR: 1, DKK: 0.134, SEK: 0.092, NOK: 0.085, PLN: 0.235, CZK: 0.040, HUF: 0.0025, RON: 0.20, CHF: 1.07, GBP: 1.17, ISK: 0.0072 },

  // --- Fallback-værdier (local-tilstand) ---
  paymentsEnabled: false,
  markets: { /* fx DK: { payments_enabled: true } */ },
  listingDays: 60,
  wantedDays: 90,
  founderFreeListings: 3,

  // [valuta, small_max, medium_max, pris_small, pris_medium, pris_large] – inkl. moms
  tierTable: [
    ["DKK", 1999, 20000, 29, 79, 149],
    ["EUR", 269, 2699, 4, 11, 20],
    ["SEK", 2999, 29999, 45, 119, 219],
    ["NOK", 2999, 29999, 45, 119, 219],
    ["PLN", 1199, 11999, 19, 49, 89],
    ["CZK", 6999, 69999, 99, 279, 499],
    ["HUF", 99999, 999999, 1590, 4290, 7990],
    ["RON", 1299, 12999, 19, 55, 99],
    ["CHF", 249, 2499, 4, 10, 19],
    ["GBP", 229, 2299, 4, 9, 17],
    ["ISK", 39999, 399999, 590, 1590, 2990]
  ],
  addonFeature: { DKK: 49, EUR: 7, SEK: 75, NOK: 75, PLN: 29, CZK: 179, HUF: 2690, RON: 35, CHF: 7, GBP: 6, ISK: 990 }
};

window.GM_CONFIG.tierPrices = window.GM_CONFIG.tierTable.flatMap(([c, a, b, p1, p2, p3]) => [
  { tier: "small", currency: c, min_price: 0, max_price: a, amount: p1 },
  { tier: "medium", currency: c, min_price: a + 1, max_price: b, amount: p2 },
  { tier: "large", currency: c, min_price: b + 1, max_price: null, amount: p3 }
]);
