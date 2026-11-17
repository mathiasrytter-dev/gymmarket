# GymMarket.dk

Markedsplads for køb og salg af gymnastikredskaber i hele EU + Norge, Island, Schweiz og UK.
11 sprog · 11 valutaer · gratis i lanceringsfasen · betaling pr. annonce kan slås til land for land.

## Mappestruktur

```
gymmarket/
├── index.html                  Selve siden
├── favicon.svg, robots.txt, sitemap.xml, CNAME
├── netlify.toml                Opsætning til Netlify (cache, sikkerhed)
├── assets/
│   ├── config.js               ⚙️  INDSTILLINGER – backend, priser, sprog, lande, kurser
│   ├── style.css               Design
│   ├── app.js                  Hovedfunktioner
│   ├── store.js                Datalag (local / Supabase)
│   ├── i18n.js                 Sprogmotor
│   ├── i18n/*.js               Én fil pr. sprog
│   ├── fb-import.js            Import af Facebook-annoncer
│   └── data-demo.js            Eksempelannoncer
├── supabase/
│   ├── migrations/             Databaseændringer – køres i nummerorden
│   │   ├── 001_schema.sql
│   │   └── 002_facebook_import.sql
│   └── admin-kommandoer.sql    Nyttige SQL-kommandoer (betaling til/fra, priser)
├── README.md                   Denne fil
├── OPDATERING.md               Sådan lægger du opdateringer ud
└── CHANGELOG.md                Hvad er ændret, og hvornår
```

## Kom i gang (én gang)

### 1. Database – Supabase (gratis)
1. Opret konto på supabase.com → **New project** → vælg en **EU-region** (fx Frankfurt).
2. **SQL Editor** → kør `supabase/migrations/001_schema.sql`, derefter `002_facebook_import.sql`.
3. **Project Settings → API**: kopiér *Project URL* og *anon public key*.
4. Indsæt dem i `assets/config.js`:
   ```js
   backend: { type: "supabase", supabaseUrl: "https://xxxx.supabase.co", supabaseAnonKey: "eyJ..." },
   ```
   Anon-nøglen må gerne være offentlig. **Del aldrig `service_role`-nøglen.**

### 2. Kode – GitHub (gratis)
1. Opret konto på github.com → **New repository** → navn `gymmarket` → **Private**.
2. Installér **GitHub Desktop** → *Add existing repository* → vælg denne mappe → **Publish**.

### 3. Hosting – Netlify (gratis)
1. netlify.com → **Add new site → Import an existing project → GitHub** → vælg `gymmarket`.
2. Build command: *tom*. Publish directory: `.` (står allerede i `netlify.toml`). → **Deploy**.
3. **Domain management → Add a domain** → `gymmarket.dk`. Netlify viser DNS-værdierne.

### 4. Domæne – one.com
**Domain → DNS settings** – tag først et skærmbillede af de nuværende poster.

| Type | Hostname | Værdi |
|---|---|---|
| A | *(tom)* | `75.2.60.5` (brug værdien Netlify viser) |
| CNAME | `www` | `dit-site.netlify.app` |

Rør **ikke** MX-posterne (mail). HTTPS sættes automatisk op, når DNS virker (op til 48 timer).

## Test lokalt
Dobbeltklik ikke på `index.html` – kør en lille server, så sprogfilerne kan indlæses:
```
python -m http.server
```
Åbn `http://localhost:8000`. Nyttige links:
- `?lang=de` – skift sprog
- `?betaling=1` – se siden med betaling slået til (kun i local-tilstand)
- `#import` – åbn Facebook-importen direkte

## Daglig drift
| Opgave | Hvor |
|---|---|
| Slå betaling til i et land | `supabase/admin-kommandoer.sql` |
| Ændre annoncepriser | `tier_prices` i databasen (+ `tierTable` i config.js til visning) |
| Behandle anmeldelser | `select * from reports where status = 'ny'` |
| Fjerne eksempelannoncer | `showDemoListings: false` i config.js |
| Opdatere valutakurser | `fxToEUR` i config.js |

## Før lancering
- [ ] CVR og adresse i footer og privatlivspolitik
- [ ] Juridisk gennemgang af vilkår og privatlivspolitik
- [ ] Oversættelser læst af modersmålstalende
- [ ] `showDemoListings: false`, når der er rigtige annoncer
- [ ] Google Search Console: indsend `sitemap.xml`
- [ ] Opret et ekstra Supabase-projekt til test, når der er rigtige brugere
