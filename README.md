# GymMarket.dk

Markedsplads for køb og salg af gymnastikredskaber i hele EU samt Norge, Island, Schweiz og UK.
11 sprog · 11 valutaer · gratis i lanceringsperioden · betaling pr. annonce kan slås til land for land.
Kontakt: **hello@gymmarket.dk**

## Mappestruktur

```
gymmarket/
├── public/                     ← KUN denne mappe lægges online
│   ├── index.html
│   ├── favicon.svg, robots.txt, sitemap.xml, CNAME
│   └── assets/
│       ├── config.js           ⚙️  Supabase-nøgler, virksomhedsoplysninger, kurser
│       ├── app.js, store.js, i18n.js, fb-import.js, style.css
│       └── i18n/*.js           11 sprogfiler
├── supabase/
│   ├── migrations/             001, 002, 003 – køres i rækkefølge
│   ├── engangs/                nulstil-foer-lancering.sql (slet testdata én gang)
│   └── admin-kommandoer.sql    anmeldelser, priser, betaling til/fra
├── netlify.toml                hosting, sikkerhed, cache, www → gymmarket.dk
├── LANCERING.md                ← tjekliste til at gå live
├── OPDATERING.md               sådan lægger du fremtidige opdateringer ud
└── CHANGELOG.md
```

## Daglig drift

| Opgave | Hvor |
|---|---|
| Behandle anmeldelser | `supabase/admin-kommandoer.sql` |
| Slå betaling til i et land | `supabase/admin-kommandoer.sql` (varsl 30 dage før) |
| Ændre annoncepriser | `tier_prices` i databasen |
| Opdatere valutakurser | `fxToEUR` i `public/assets/config.js` |
| Ændre kontaktmail eller virksomhedsoplysninger | `site` i `public/assets/config.js` |

Eksempelannoncer, testtilstand og simuleret betaling er fjernet. Siden viser kun rigtige annoncer fra databasen.

## Test lokalt
```
cd public
python -m http.server
```
Åbn `http://localhost:8000`. Lokalt bruges samme database som den rigtige side, så slet de annoncer, du opretter for at teste.
