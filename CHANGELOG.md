# Ændringslog

## 1.2.0 – 2026-11-17 · Lanceringsversion
- Eksempelannoncer og -efterlysninger fjernet
- Testtilstand fjernet: ingen lokal browserdatabase, ingen `?betaling=1`, ingen simuleret betaling
- Kontaktmail ændret til hello@gymmarket.dk overalt (footer, vilkår, privatlivspolitik, FAQ)
- Virksomhedsnavn, CVR og adresse styres fra config.js og vises automatisk, når de er udfyldt
- "Udkast"-mærkater og prototype-tekster fjernet fra siden
- Tom forside viser "Bliv den første til at sælge" i stedet for tomme kort
- "Åbner snart"-bjælke, hvis databasen ikke kan nås
- Spambeskyttelse: skjult felt i formularer + grænse pr. e-mail pr. døgn (migration 003)
- Kun `public/` lægges online; sikkerhedsheaders, cache og www → gymmarket.dk i netlify.toml
- Engangsscript til at slette testdata før lancering

## 1.1.0 – 2026-11-17
- Klargjort til GitHub + Netlify, Facebook-import bygget ind

## 1.0.0 – 2026-11-16
- EU-version: 11 sprog, 31 lande, 11 valutaer, betaling pr. annonce pr. land, DSA-funktioner
