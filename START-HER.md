# Opdatering 4 – mail med kode, profilbillede og indbakke

Denne pakke bygger oven på version 3. **Rør ikke din `assets/config.js`** – den indeholder dine egne indstillinger.

## Hvad er nyt
- Koden til at bekræfte e-mail sendes som en rigtig mail (kræver trin A–C nedenfor).
- Profilbillede: tilføjes under profilen (klik på dit navn øverst til højre).
- Indbakke til henvendelser: køber skriver til sælger via siden. Sælgers e-mail vises ikke længere.
- Eksempelannoncer og TEST-mærkat er fjernet.

## Indhold
```
index.html                                   (erstat)
VERSION.txt                                  (ny)
assets/app.js                                (erstat)
assets/store.js                              (erstat)
assets/i18n-inbox.js                         (ny)
assets/style-inbox.css                       (ny)
supabase/migrations/004_indbakke_profilbillede.sql   (ny – køres i Supabase)
tools/export-translations.js                 (erstat)
```
`assets/data-demo.js` bruges ikke mere og kan slettes.

---

## A. Database (Supabase) – 5 min
1. Gå til din Supabase → **SQL Editor** → **New query**.
2. Åbn `supabase/migrations/004_indbakke_profilbillede.sql` i Notesblok, kopiér alt, indsæt, og tryk **Run**.
3. Der skal stå *Success*. (Fejler den med "relation profiles does not exist", skal `supabase/schema.sql` fra version 3 køres først.)

Kør denne fil lige før, du lægger den nye side online (trin D).

## B. Mail fra Supabase – 20 min
Supabase' indbyggede mailafsender sender kun til teammedlemmer og højst 2 mails i timen, så den kan ikke bruges til rigtige brugere. Du skal koble din egen mailafsender på.

1. **Opret en mailkonto hos one.com** til afsenderen, fx `hello@gymmarket.dk`, hvis den ikke findes.
2. Supabase → **Authentication → Emails → SMTP Settings** → slå **Enable custom SMTP** til:

| Felt | Værdi |
|---|---|
| Sender email | din one.com-adresse, fx hello@gymmarket.dk |
| Sender name | GymMarket |
| Host | `send.one.com` |
| Port | `587` (alternativt `465`) |
| Username | den fulde e-mailadresse |
| Password | mailkontoens adgangskode |

3. Supabase → **Authentication → Emails → Templates → Confirm sign up**:
   - **Subject:** `Din GymMarket-kode: {{ .Token }}`
   - **Body** (slet det gamle, og indsæt):
```html
<h2>Din kode til GymMarket</h2>
<p>Indtast denne kode for at bekræfte din e-mail:</p>
<p style="font-size:32px;letter-spacing:8px;font-weight:bold">{{ .Token }}</p>
<p>Har du ikke oprettet en bruger på gymmarket.dk, kan du ignorere denne mail.</p>
```
   `{{ .Token }}` er den 6-cifrede kode. Står der stadig `{{ .ConfirmationURL }}` i skabelonen, får brugeren et link i stedet for en kode.
4. Supabase → **Authentication → Sign In / Providers → Email** → sørg for, at **Confirm email** er slået **til**.
5. (Anbefalet) Tilføj en SPF-post for gymmarket.dk hos one.com (se one.com's hjælp "Tilføj en SPF-record"), så mailen ikke ender i spam.

## C. Slå rigtige brugere til i siden – 2 min
Åbn `assets/config.js` i dit repository og find `backend`. Den skal se sådan ud (dine egne værdier fra Supabase → **Project Settings → API**):
```js
backend: {
  type: "supabase",
  supabaseUrl: "https://DIT-PROJEKT.supabase.co",
  supabaseAnonKey: "din-anon-public-nøgle",
  test: { supabaseUrl: "", supabaseAnonKey: "" }
},
```
Brug **anon**-nøglen. Aldrig `service_role`.
**Står `type` stadig til `"local"`, kører siden som prototype og kan ikke sende mails.** En side uden database kan ikke sende e-mail.

## D. Læg opdateringen på GitHub – 10 min
1. Pak zip-filen ud.
2. I repository-mappen: erstat filerne fra listen øverst (kopiér ind, vælg **Erstat**). Slet ikke andet.
3. GitHub Desktop → Summary `Opdatering 4` → **Commit to main** → **Push origin**.
4. Vent 1–2 min. Tjek, at `VERSION.txt` står på github.com.

## E. Test – 5 min (privat vindue)
1. Opret en bruger med din egen e-mail → mailen med koden kommer. Kig i spam, hvis ikke.
2. Indtast koden → du er logget ind.
3. Klik på dit navn → **Tilføj billede**.
4. Opret en annonce. Log ud, opret en bruger nr. 2 (en anden e-mail), åbn annoncen → **Send besked**.
5. Log ind som bruger 1 → **Indbakke** (tal ved siden af) → svar.

## Kendt begrænsning
Sælger får ingen mail, når der kommer en ny henvendelse. Beskeder ses i indbakken på siden (tallet ved menuen og en prik ved brugerknappen viser nye beskeder). Mailnotifikation kan bygges som næste skridt.
