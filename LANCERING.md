# Tjekliste – GymMarket går live

## 1. Udfyld config (5 min)
Åbn `public/assets/config.js`:
- [ ] `backend.supabaseUrl` og `backend.supabaseAnonKey` (Supabase → Project Settings → API)
- [ ] `site.company.name`, `cvr`, `address` – vises i footer og privatlivspolitik
      (En erhvervsdrivende hjemmeside skal vise navn, adresse og CVR. Felterne skjules, hvis de er tomme.)
- [x] `site.email` er sat til `hello@gymmarket.dk`

## 2. Database (10 min)
Supabase → SQL Editor → kør i rækkefølge:
- [ ] `supabase/migrations/001_schema.sql`
- [ ] `supabase/migrations/002_facebook_import.sql`
- [ ] `supabase/migrations/003_launch.sql`
- [ ] **Én gang lige før åbning:** `supabase/engangs/nulstil-foer-lancering.sql` (sletter alle testannoncer)

## 3. Mail
- [ ] `hello@gymmarket.dk` er oprettet hos one.com og kan modtage mail (send en testmail)

## 4. Upload
- [ ] Erstat hele indholdet i GitHub-repositoriet med denne mappe (slet de gamle filer i roden – siden ligger nu i `public/`)
- [ ] GitHub Desktop → Commit → Push. Netlify bruger automatisk `public/` via `netlify.toml`
- [ ] Netlify → Domain management: `gymmarket.dk` står som primært domæne, HTTPS er grøn

## 5. Kontrol efter upload (10 min)
- [ ] https://gymmarket.dk åbner uden rød "åbner snart"-bjælke
- [ ] Opret én annonce med billede → den vises → slet den igen under "Mine annoncer"
- [ ] Opret og slet en efterlysning
- [ ] Importér en Facebook-annonce via https://gymmarket.dk/#import
- [ ] Skift sprog og valuta øverst
- [ ] Tjek på mobil

## 6. Synlighed
- [ ] Google Search Console → tilføj `gymmarket.dk` → indsend `https://gymmarket.dk/sitemap.xml`
- [ ] Del https://gymmarket.dk/#import i Facebook-grupperne

## Står stadig åbent (kan ikke løses i koden)
- Juridisk gennemgang af vilkår og privatlivspolitik
- Gennemlæsning af oversættelser (de, sv, nb, fi, nl, fr, es, it, pl) af modersmålstalende
