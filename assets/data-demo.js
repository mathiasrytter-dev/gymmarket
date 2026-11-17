/* Eksempelannoncer – vises kun når showDemoListings = true */
(function () {
  const far = new Date(Date.now() + 3650 * 864e5).toISOString();
  const L = (i, o) => Object.assign({
    id: "demo-" + i, demo: true, status: "aktiv", images: [], brand: "", year: null, new_price: null, postcode: "",
    contact_email: "", contact_phone: "", transport: false, is_trader: false, expires_at: far,
    created_at: new Date(Date.now() - i * 864e5).toISOString()
  }, o);
  window.GM_DEMO = [
    L(1, { title: "AirTrack 15 x 2 m inkl. blæser", lang: "da", category: "airtrack", brand: "AirTrack Factory", year: 2021, condition: "good", price: 28000, new_price: 52000, currency: "DKK", city: "Silkeborg", country: "DK", seller_type: "club", seller_name: "Gymnastikforening", transport: true, description: "Velholdt AirTrack brugt til træning to gange om ugen. Ingen huller. Blæser medfølger. Ca. 95 kg." }),
    L(2, { title: "TeamGym minitrampoliner – sæt af 2", lang: "da", category: "teamgym", brand: "Eurotramp", year: 2019, condition: "good", price: 16500, new_price: 34000, currency: "DKK", city: "Vejle", country: "DK", seller_type: "club", seller_name: "Idrætsforening", transport: true, description: "Nye fjedre i 2024. Sælges pga. udskiftning." }),
    L(3, { title: "Pegasus Sprungtisch – Vorführgerät", lang: "de", category: "spring", brand: "Spieth", year: 2020, condition: "like_new", price: 1990, new_price: 3200, currency: "EUR", city: "Hamburg", country: "DE", seller_type: "dealer", seller_name: "Turngeräte Nord GmbH", is_trader: true, trader_company: "Turngeräte Nord GmbH", trader_vat: "DE123456789", trader_address: "Musterstraße 1, 20095 Hamburg", transport: true, description: "Ausstellungsgerät, voll funktionsfähig. Rechnung mit MwSt." }),
    L(4, { title: "Tumblingbana 15 m", lang: "sv", category: "spring", brand: "Gymnova", year: 2017, condition: "fair", price: 45000, new_price: 140000, currency: "SEK", city: "Malmö", country: "SE", seller_type: "club", seller_name: "Gymnastikförening", transport: true, description: "Synligt slitage på ytan men fullt fungerande." }),
    L(5, { title: "Landingsmåtter 20 cm – 6 stk.", lang: "da", category: "maatter", brand: "Gymnova", year: 2018, condition: "good", price: 7200, new_price: 18000, currency: "DKK", city: "Roskilde", country: "DK", seller_type: "club", seller_name: "Gymnastikforening", description: "6 stk. 200 x 300 x 20 cm. Afhentes." }),
    L(6, { title: "Konkurransetrampoline 5 x 3 m", lang: "nb", category: "trampolin", brand: "Eurotramp", year: 2016, condition: "good", price: 32000, new_price: 85000, currency: "NOK", city: "Bergen", country: "NO", seller_type: "club", seller_name: "Turnforening", transport: true, description: "Med sikkerhetsmatter. Selger demonterer." }),
    L(7, { title: "Foam blocks for pit – approx. 400 pcs", lang: "en", category: "skum", year: 2022, condition: "good", price: 450, new_price: 1600, currency: "EUR", city: "Utrecht", country: "NL", seller_type: "school", seller_name: "Sports academy", description: "20 x 20 x 20 cm. Pickup in bags." }),
    L(8, { title: "Poręcze równoległe – męskie", lang: "pl", category: "ag", brand: "Spieth", year: 2015, condition: "fair", price: 6500, new_price: 25000, currency: "PLN", city: "Kraków", country: "PL", seller_type: "club", seller_name: "Klub gimnastyczny", transport: true, description: "Nowe żerdzie z 2023 r." }),
    L(9, { title: "Rytmisk gulv 13 x 13 m", lang: "da", category: "rg", brand: "Gymnova", year: 2019, condition: "like_new", price: 39000, new_price: 78000, currency: "DKK", city: "København", country: "DK", seller_type: "club", seller_name: "RG-klub", transport: true, description: "Komplet tæppe og underlag." }),
    L(10, { title: "Ressorts mini-trampoline – 36 pièces", lang: "fr", category: "reservedele", brand: "Eurotramp", year: 2025, condition: "new", price: 190, new_price: 290, currency: "EUR", city: "Lyon", country: "FR", seller_type: "private", seller_name: "Particulier", description: "Paquet non ouvert." }),
    L(11, { title: "Poutre de compétition 5 m", lang: "fr", category: "ag", brand: "Gymnova", year: 2021, condition: "like_new", price: 1450, new_price: 2900, currency: "EUR", city: "Bruxelles", country: "BE", seller_type: "school", seller_name: "École", transport: true, description: "Réglable en hauteur." }),
    L(12, { title: "Minitrampolino TeamGym", lang: "it", category: "teamgym", brand: "Eurotramp", year: 2020, condition: "good", price: 1100, new_price: 2400, currency: "EUR", city: "Milano", country: "IT", seller_type: "club", seller_name: "Società ginnastica", description: "Molle sostituite nel 2025." })
  ];
  window.GM_DEMO_WANTED = [
    { id: "dw1", demo: true, title: "2 stk. TeamGym minitrampoliner", budget: "15.000–25.000 kr.", area: "Jylland", name: "Gymnastikforening" },
    { id: "dw2", demo: true, title: "AirTrack min. 12 m", budget: "≤ 2.500 €", area: "DE / NL / BE", name: "Turnverein" },
    { id: "dw3", demo: true, title: "Skumklossar till grop", budget: "", area: "Sverige", name: "Gymnastikförening" }
  ];
})();
