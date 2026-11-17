# Sådan lægger du en opdatering ud

1. Kopiér de nye/ændrede filer ind i projektmappen (overskriv de gamle).
2. Ny fil i `supabase/migrations/`? Kør den i Supabase SQL Editor **før** du pusher koden.
3. Hæv versionsnummeret alle steder (`version` i `public/assets/config.js` og alle `?v=` i `public/index.html`),
   så browserne henter de nye filer. **Gælder også, når du kun har rettet config.js.**
4. GitHub Desktop → Commit → Push. Netlify opdaterer siden på ca. ét minut.
5. Noget gik galt? Netlify → Deploys → vælg forrige version → **Publish deploy**.
6. Skriv en linje i `CHANGELOG.md`.

## Kørte migrationer
| Migration | Kørt dato |
|---|---|
| 001_schema.sql | |
| 002_facebook_import.sql | |
| 003_launch.sql | |
| engangs/nulstil-foer-lancering.sql | |
