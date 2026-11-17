/* ============================================================
   GymMarket – konfiguration (produktion)
   Udfyld de tre felter markeret ⚠️ før siden lægges online.
   Betaling, priser og annonceperiode styres fra databasen
   (tabellerne settings, markets og tier_prices).
   ============================================================ */
window.GM_CONFIG = {
  version: "1.2.0",

  site: {
    name: "GymMarket",
    domain: "gymmarket.dk",
    email: "hello@gymmarket.dk",
    // ⚠️ Virksomhedsoplysninger – vises i footer og privatlivspolitik, når de er udfyldt
    company: {
      name: "",      // fx "GymMarket v/ Mathias Rytter"
      cvr: "",       // fx "12345678"
      address: ""    // fx "Gade 1, 8000 Aarhus C"
    }
  },

  // ⚠️ Supabase: Project Settings → API → Project URL og anon public key
  backend: {
    supabaseUrl: "",
    supabaseAnonKey: ""
  },

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

  // Vejledende kurser til EUR – kun til visning og filtrering. Opdatér jævnligt.
  fxToEUR: { EUR: 1, DKK: 0.134, SEK: 0.092, NOK: 0.085, PLN: 0.235, CZK: 0.040, HUF: 0.0025, RON: 0.20, CHF: 1.07, GBP: 1.17, ISK: 0.0072 },

  // Visning af "Fremhævning" i pristabellen (normalpris inkl. moms)
  addonFeature: { DKK: 49, EUR: 7, SEK: 75, NOK: 75, PLN: 29, CZK: 179, HUF: 2690, RON: 35, CHF: 7, GBP: 6, ISK: 990 }
};
