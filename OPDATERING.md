# Sådan lægger du en opdatering ud

## Almindelig opdatering (5 minutter)
1. **Kopiér de nye/ændrede filer** ind i projektmappen (overskriv de gamle).
2. **Database?** Er der en ny fil i `supabase/migrations/`, så kør den i Supabase SQL Editor
   **før** du pusher koden. Kør kun de numre, du ikke har kørt før.
3. **Versionsnummer:** Ret `version` i `assets/config.js` og `?v=` i `index.html` (fx 1.1.0 → 1.2.0),
   så browserne henter de nye filer i stedet for gamle kopier.
4. **GitHub Desktop:** Se ændringerne → skriv en kort beskrivelse → **Commit to main** → **Push origin**.
5. Netlify opdaterer siden automatisk på ca. ét minut.
6. Skriv en linje i `CHANGELOG.md`.

## Større ændringer – test først
1. GitHub Desktop → **Current branch → New branch** → fx `test-betaling`.
2. Læg ændringerne ind → Commit → **Publish branch** → opret Pull Request på GitHub.
3. Netlify laver automatisk et **testlink** (Deploy Preview). Tjek siden der.
4. Ser alt godt ud: **Merge** på GitHub → siden opdateres.

⚠️ Testlinket bruger samme database som den rigtige side. Opret et separat Supabase-projekt til test, når der er rigtige brugere.

## Noget gik galt – rul tilbage
Netlify → **Deploys** → vælg den seneste version, der virkede → **Publish deploy**. Tager 10 sekunder.
Databaseændringer rulles ikke automatisk tilbage – derfor er migrationerne skrevet, så de kan køres sikkert igen.

## Hvilke migrationer er kørt?
| Migration | Kørt dato |
|---|---|
| 001_schema.sql | |
| 002_facebook_import.sql | |
