/* ============================================================
   GymMarket – Importér annonce fra Facebook (manuelt)
   Sælger kopierer selv teksten fra sit eget Facebook-opslag og
   indsætter den. Teksten læses lokalt i browseren, og annonce-
   formularen udfyldes. Intet hentes fra Facebook.
   Indlæses EFTER app.js i index.html.
   ============================================================ */
(function () {
  "use strict";

  const T = {
    da: { cta_q: "Har du allerede annoncen på Facebook?", cta_b: "Importér fra Facebook", h: "Importér din Facebook-annonce", p: "Åbn dit eget opslag på Facebook, markér hele teksten, kopiér den (Ctrl+C) og indsæt den her. Vi udfylder formularen for dig – du tjekker bare felterne bagefter.", l_text: "Teksten fra dit Facebook-opslag", ph: "Indsæt hele opslaget her …", l_img: "Billeder fra opslaget", drop: "Træk billederne hertil, klik for at vælge, eller indsæt med Ctrl+V", img_hint: "Gem billederne fra Facebook på din computer eller telefon først. Højst 6.", consent: "Jeg bekræfter, at det er min egen annonce, og at jeg har ret til at bruge tekst og billeder", found: "Fundet i teksten", btn: "Udfyld formularen", cancel: "Annullér", done: "{n} felter er udfyldt. Tjek de markerede felter, før du opretter annoncen.", missing: "Udfyld selv: {f}", err_text: "Indsæt teksten fra dit opslag først.", err_consent: "Du skal bekræfte, at det er din egen annonce.", how: "Sådan gør du", s1: "Åbn dit opslag på Facebook", s2: "Markér og kopiér teksten", s3: "Indsæt her og tilføj billeder", f_title: "Titel", f_price: "Pris", f_new: "Nypris", f_city: "By", f_post: "Postnr.", f_cat: "Kategori", f_cond: "Stand", f_brand: "Producent", f_year: "Årgang", f_transport: "Levering", f_desc: "Beskrivelse", f_img: "Billeder" },
    en: { cta_q: "Already have the listing on Facebook?", cta_b: "Import from Facebook", h: "Import your Facebook listing", p: "Open your own post on Facebook, select all the text, copy it (Ctrl+C) and paste it here. We fill in the form for you – you just check the fields afterwards.", l_text: "The text from your Facebook post", ph: "Paste the whole post here …", l_img: "Photos from the post", drop: "Drag the photos here, click to choose, or paste with Ctrl+V", img_hint: "Save the photos from Facebook to your computer or phone first. Max 6.", consent: "I confirm that this is my own listing and that I have the right to use the text and photos", found: "Found in the text", btn: "Fill in the form", cancel: "Cancel", done: "{n} fields have been filled in. Check the highlighted fields before creating the listing.", missing: "Fill in yourself: {f}", err_text: "Paste the text from your post first.", err_consent: "You must confirm that this is your own listing.", how: "How it works", s1: "Open your post on Facebook", s2: "Select and copy the text", s3: "Paste it here and add photos", f_title: "Title", f_price: "Price", f_new: "New price", f_city: "City", f_post: "Postcode", f_cat: "Category", f_cond: "Condition", f_brand: "Brand", f_year: "Year", f_transport: "Delivery", f_desc: "Description", f_img: "Photos" },
    de: { cta_q: "Haben Sie die Anzeige schon auf Facebook?", cta_b: "Von Facebook importieren", h: "Facebook-Anzeige importieren", p: "Öffnen Sie Ihren eigenen Beitrag auf Facebook, markieren Sie den ganzen Text, kopieren Sie ihn (Strg+C) und fügen Sie ihn hier ein. Wir füllen das Formular aus – Sie prüfen danach nur die Felder.", l_text: "Text aus Ihrem Facebook-Beitrag", ph: "Ganzen Beitrag hier einfügen …", l_img: "Fotos aus dem Beitrag", drop: "Fotos hierher ziehen, zum Auswählen klicken oder mit Strg+V einfügen", img_hint: "Speichern Sie die Fotos von Facebook zuerst auf Ihrem Computer oder Handy. Max. 6.", consent: "Ich bestätige, dass es meine eigene Anzeige ist und ich Text und Fotos verwenden darf", found: "Im Text gefunden", btn: "Formular ausfüllen", cancel: "Abbrechen", done: "{n} Felder wurden ausgefüllt. Prüfen Sie die markierten Felder, bevor Sie die Anzeige erstellen.", missing: "Bitte selbst ausfüllen: {f}", err_text: "Fügen Sie zuerst den Text Ihres Beitrags ein.", err_consent: "Bitte bestätigen Sie, dass es Ihre eigene Anzeige ist.", how: "So geht's", s1: "Beitrag auf Facebook öffnen", s2: "Text markieren und kopieren", s3: "Hier einfügen und Fotos hinzufügen", f_title: "Titel", f_price: "Preis", f_new: "Neupreis", f_city: "Ort", f_post: "PLZ", f_cat: "Kategorie", f_cond: "Zustand", f_brand: "Hersteller", f_year: "Baujahr", f_transport: "Lieferung", f_desc: "Beschreibung", f_img: "Fotos" },
    sv: { cta_q: "Har du redan annonsen på Facebook?", cta_b: "Importera från Facebook", h: "Importera din Facebookannons", p: "Öppna ditt eget inlägg på Facebook, markera hela texten, kopiera den (Ctrl+C) och klistra in den här. Vi fyller i formuläret – du kontrollerar bara fälten efteråt.", l_text: "Texten från ditt Facebookinlägg", ph: "Klistra in hela inlägget här …", l_img: "Bilder från inlägget", drop: "Dra bilderna hit, klicka för att välja eller klistra in med Ctrl+V", img_hint: "Spara bilderna från Facebook på din dator eller telefon först. Högst 6.", consent: "Jag bekräftar att det är min egen annons och att jag har rätt att använda text och bilder", found: "Hittat i texten", btn: "Fyll i formuläret", cancel: "Avbryt", done: "{n} fält har fyllts i. Kontrollera de markerade fälten innan du skapar annonsen.", missing: "Fyll i själv: {f}", err_text: "Klistra in texten från ditt inlägg först.", err_consent: "Du måste bekräfta att det är din egen annons.", how: "Så gör du", s1: "Öppna ditt inlägg på Facebook", s2: "Markera och kopiera texten", s3: "Klistra in här och lägg till bilder", f_title: "Rubrik", f_price: "Pris", f_new: "Nypris", f_city: "Ort", f_post: "Postnr", f_cat: "Kategori", f_cond: "Skick", f_brand: "Tillverkare", f_year: "Årsmodell", f_transport: "Leverans", f_desc: "Beskrivning", f_img: "Bilder" },
    nb: { cta_q: "Har du allerede annonsen på Facebook?", cta_b: "Importer fra Facebook", h: "Importer Facebook-annonsen din", p: "Åpne ditt eget innlegg på Facebook, marker hele teksten, kopier den (Ctrl+C) og lim den inn her. Vi fyller ut skjemaet – du sjekker bare feltene etterpå.", l_text: "Teksten fra Facebook-innlegget ditt", ph: "Lim inn hele innlegget her …", l_img: "Bilder fra innlegget", drop: "Dra bildene hit, klikk for å velge, eller lim inn med Ctrl+V", img_hint: "Lagre bildene fra Facebook på datamaskinen eller telefonen først. Maks 6.", consent: "Jeg bekrefter at det er min egen annonse, og at jeg har rett til å bruke tekst og bilder", found: "Funnet i teksten", btn: "Fyll ut skjemaet", cancel: "Avbryt", done: "{n} felt er fylt ut. Sjekk de markerte feltene før du oppretter annonsen.", missing: "Fyll ut selv: {f}", err_text: "Lim inn teksten fra innlegget ditt først.", err_consent: "Du må bekrefte at det er din egen annonse.", how: "Slik gjør du", s1: "Åpne innlegget ditt på Facebook", s2: "Marker og kopier teksten", s3: "Lim inn her og legg til bilder", f_title: "Tittel", f_price: "Pris", f_new: "Nypris", f_city: "Sted", f_post: "Postnr.", f_cat: "Kategori", f_cond: "Tilstand", f_brand: "Produsent", f_year: "Årsmodell", f_transport: "Levering", f_desc: "Beskrivelse", f_img: "Bilder" },
    fi: { cta_q: "Onko ilmoitus jo Facebookissa?", cta_b: "Tuo Facebookista", h: "Tuo Facebook-ilmoituksesi", p: "Avaa oma julkaisusi Facebookissa, valitse koko teksti, kopioi se (Ctrl+C) ja liitä tähän. Täytämme lomakkeen puolestasi – tarkistat vain kentät jälkeenpäin.", l_text: "Facebook-julkaisusi teksti", ph: "Liitä koko julkaisu tähän …", l_img: "Julkaisun kuvat", drop: "Vedä kuvat tähän, valitse napsauttamalla tai liitä Ctrl+V:llä", img_hint: "Tallenna kuvat Facebookista ensin tietokoneelle tai puhelimeen. Enintään 6.", consent: "Vahvistan, että ilmoitus on oma ja että minulla on oikeus käyttää tekstiä ja kuvia", found: "Löytyi tekstistä", btn: "Täytä lomake", cancel: "Peruuta", done: "{n} kenttää täytetty. Tarkista merkityt kentät ennen ilmoituksen luomista.", missing: "Täytä itse: {f}", err_text: "Liitä ensin julkaisusi teksti.", err_consent: "Vahvista, että ilmoitus on oma.", how: "Näin teet", s1: "Avaa julkaisusi Facebookissa", s2: "Valitse ja kopioi teksti", s3: "Liitä tähän ja lisää kuvat", f_title: "Otsikko", f_price: "Hinta", f_new: "Uushinta", f_city: "Paikkakunta", f_post: "Postinro", f_cat: "Kategoria", f_cond: "Kunto", f_brand: "Valmistaja", f_year: "Vuosimalli", f_transport: "Toimitus", f_desc: "Kuvaus", f_img: "Kuvat" },
    nl: { cta_q: "Staat je advertentie al op Facebook?", cta_b: "Importeren van Facebook", h: "Je Facebook-advertentie importeren", p: "Open je eigen bericht op Facebook, selecteer alle tekst, kopieer die (Ctrl+C) en plak hem hier. Wij vullen het formulier in – jij controleert daarna alleen de velden.", l_text: "Tekst uit je Facebookbericht", ph: "Plak hier het hele bericht …", l_img: "Foto's uit het bericht", drop: "Sleep de foto's hierheen, klik om te kiezen of plak met Ctrl+V", img_hint: "Sla de foto's van Facebook eerst op je computer of telefoon op. Max. 6.", consent: "Ik bevestig dat dit mijn eigen advertentie is en dat ik de tekst en foto's mag gebruiken", found: "Gevonden in de tekst", btn: "Formulier invullen", cancel: "Annuleren", done: "{n} velden zijn ingevuld. Controleer de gemarkeerde velden voordat je de advertentie plaatst.", missing: "Zelf invullen: {f}", err_text: "Plak eerst de tekst van je bericht.", err_consent: "Bevestig dat dit je eigen advertentie is.", how: "Zo werkt het", s1: "Open je bericht op Facebook", s2: "Selecteer en kopieer de tekst", s3: "Plak hier en voeg foto's toe", f_title: "Titel", f_price: "Prijs", f_new: "Nieuwprijs", f_city: "Plaats", f_post: "Postcode", f_cat: "Categorie", f_cond: "Staat", f_brand: "Merk", f_year: "Bouwjaar", f_transport: "Levering", f_desc: "Beschrijving", f_img: "Foto's" },
    fr: { cta_q: "Votre annonce est déjà sur Facebook ?", cta_b: "Importer depuis Facebook", h: "Importer votre annonce Facebook", p: "Ouvrez votre propre publication sur Facebook, sélectionnez tout le texte, copiez-le (Ctrl+C) et collez-le ici. Nous remplissons le formulaire – vous vérifiez simplement les champs ensuite.", l_text: "Texte de votre publication Facebook", ph: "Collez toute la publication ici …", l_img: "Photos de la publication", drop: "Glissez les photos ici, cliquez pour choisir ou collez avec Ctrl+V", img_hint: "Enregistrez d'abord les photos de Facebook sur votre ordinateur ou téléphone. 6 max.", consent: "Je confirme qu'il s'agit de ma propre annonce et que j'ai le droit d'utiliser le texte et les photos", found: "Trouvé dans le texte", btn: "Remplir le formulaire", cancel: "Annuler", done: "{n} champs ont été remplis. Vérifiez les champs en surbrillance avant de publier.", missing: "À remplir vous-même : {f}", err_text: "Collez d'abord le texte de votre publication.", err_consent: "Confirmez qu'il s'agit de votre propre annonce.", how: "Comment faire", s1: "Ouvrez votre publication sur Facebook", s2: "Sélectionnez et copiez le texte", s3: "Collez ici et ajoutez les photos", f_title: "Titre", f_price: "Prix", f_new: "Prix neuf", f_city: "Ville", f_post: "Code postal", f_cat: "Catégorie", f_cond: "État", f_brand: "Marque", f_year: "Année", f_transport: "Livraison", f_desc: "Description", f_img: "Photos" },
    es: { cta_q: "¿Ya tienes el anuncio en Facebook?", cta_b: "Importar desde Facebook", h: "Importa tu anuncio de Facebook", p: "Abre tu propia publicación en Facebook, selecciona todo el texto, cópialo (Ctrl+C) y pégalo aquí. Rellenamos el formulario por ti; tú solo revisas los campos después.", l_text: "Texto de tu publicación de Facebook", ph: "Pega aquí toda la publicación …", l_img: "Fotos de la publicación", drop: "Arrastra las fotos aquí, haz clic para elegir o pega con Ctrl+V", img_hint: "Guarda primero las fotos de Facebook en tu ordenador o móvil. Máx. 6.", consent: "Confirmo que es mi propio anuncio y que tengo derecho a usar el texto y las fotos", found: "Encontrado en el texto", btn: "Rellenar el formulario", cancel: "Cancelar", done: "Se han rellenado {n} campos. Revisa los campos marcados antes de publicar.", missing: "Rellena tú: {f}", err_text: "Pega primero el texto de tu publicación.", err_consent: "Confirma que es tu propio anuncio.", how: "Cómo hacerlo", s1: "Abre tu publicación en Facebook", s2: "Selecciona y copia el texto", s3: "Pégalo aquí y añade fotos", f_title: "Título", f_price: "Precio", f_new: "Precio nuevo", f_city: "Ciudad", f_post: "C.P.", f_cat: "Categoría", f_cond: "Estado", f_brand: "Marca", f_year: "Año", f_transport: "Entrega", f_desc: "Descripción", f_img: "Fotos" },
    it: { cta_q: "Hai già l'annuncio su Facebook?", cta_b: "Importa da Facebook", h: "Importa il tuo annuncio Facebook", p: "Apri il tuo post su Facebook, seleziona tutto il testo, copialo (Ctrl+C) e incollalo qui. Compiliamo il modulo per te: tu controlli solo i campi.", l_text: "Testo del tuo post su Facebook", ph: "Incolla qui l'intero post …", l_img: "Foto del post", drop: "Trascina qui le foto, clicca per sceglierle o incolla con Ctrl+V", img_hint: "Salva prima le foto da Facebook sul computer o sul telefono. Max 6.", consent: "Confermo che è il mio annuncio e che ho il diritto di usare testo e foto", found: "Trovato nel testo", btn: "Compila il modulo", cancel: "Annulla", done: "{n} campi compilati. Controlla i campi evidenziati prima di pubblicare.", missing: "Compila tu: {f}", err_text: "Incolla prima il testo del tuo post.", err_consent: "Conferma che è il tuo annuncio.", how: "Come fare", s1: "Apri il tuo post su Facebook", s2: "Seleziona e copia il testo", s3: "Incolla qui e aggiungi le foto", f_title: "Titolo", f_price: "Prezzo", f_new: "Prezzo da nuovo", f_city: "Città", f_post: "CAP", f_cat: "Categoria", f_cond: "Condizione", f_brand: "Marca", f_year: "Anno", f_transport: "Consegna", f_desc: "Descrizione", f_img: "Foto" },
    pl: { cta_q: "Masz już ogłoszenie na Facebooku?", cta_b: "Importuj z Facebooka", h: "Importuj ogłoszenie z Facebooka", p: "Otwórz swój post na Facebooku, zaznacz cały tekst, skopiuj go (Ctrl+C) i wklej tutaj. Wypełnimy formularz za Ciebie – sprawdzisz tylko pola.", l_text: "Tekst z Twojego posta na Facebooku", ph: "Wklej tutaj cały post …", l_img: "Zdjęcia z posta", drop: "Przeciągnij zdjęcia tutaj, kliknij, aby wybrać, lub wklej Ctrl+V", img_hint: "Najpierw zapisz zdjęcia z Facebooka na komputerze lub telefonie. Maks. 6.", consent: "Potwierdzam, że to moje ogłoszenie i mam prawo do użycia tekstu i zdjęć", found: "Znaleziono w tekście", btn: "Wypełnij formularz", cancel: "Anuluj", done: "Wypełniono pól: {n}. Sprawdź zaznaczone pola przed dodaniem ogłoszenia.", missing: "Uzupełnij samodzielnie: {f}", err_text: "Najpierw wklej tekst swojego posta.", err_consent: "Potwierdź, że to Twoje ogłoszenie.", how: "Jak to zrobić", s1: "Otwórz swój post na Facebooku", s2: "Zaznacz i skopiuj tekst", s3: "Wklej tutaj i dodaj zdjęcia", f_title: "Tytuł", f_price: "Cena", f_new: "Cena nowego", f_city: "Miejscowość", f_post: "Kod", f_cat: "Kategoria", f_cond: "Stan", f_brand: "Producent", f_year: "Rok", f_transport: "Dostawa", f_desc: "Opis", f_img: "Zdjęcia" }
  };
  window.GM_FB_I18N = T;
  // Rettelser fra oversættere (nøgler med "fb."-præfiks)
  (function (O) { for (const l in O) for (const k in O[l]) if (k.indexOf("fb.") === 0 && O[l][k] && T[l]) T[l][k.slice(3)] = O[l][k]; })(window.GM_I18N_OVERRIDES || {});
  const lang = () => (window.GMT && GMT.lang && GMT.lang()) || (document.documentElement.lang || "da").slice(0, 2);
  const t = (k, v) => { let s = (T[lang()] || T.en)[k] ?? T.en[k] ?? k; if (v) s = s.replace(/\{(\w+)\}/g, (m, x) => v[x] ?? m); return s; };
  const loc = () => (window.GMT && GMT.locale && GMT.locale()) || ({ da: "da-DK", en: "en-IE", de: "de-DE", sv: "sv-SE", nb: "nb-NO", fi: "fi-FI", nl: "nl-NL", fr: "fr-FR", es: "es-ES", it: "it-IT", pl: "pl-PL" }[lang()] || "da-DK");
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ======================= PARSER ======================= */
  const UB = "(?:(?<![\\p{L}\\p{N}])(?=[\\p{L}\\p{N}])|(?<=[\\p{L}\\p{N}])(?![\\p{L}\\p{N}]))";
  const U = re => new RegExp(re.source.split("\\b").join(UB), "iu");
  const SALE_PREFIX = U(/^\s*(til\s+salg|sælges|saelges|sælger|salg|säljes|säljer|selges|selger|myydään|myytävänä|te\s+koop|verkaufe|zu\s+verkaufen|verkauf|for\s+sale|selling|fs|à\s+vendre|a\s+vendre|vends|se\s+vende|vendo|in\s+vendita|sprzedam|na\s+sprzedaż|gives\s+væk|gis\s+bort|bortskänkes|zu\s+verschenken|to\s+give\s+away|free|gratis)\s*[:\-–!]*\s*/i);
  const NOISE = U(/^(detaljer|details|beskrivelse|description|beschreibung|beskrivning|kuvaus|beschrijving|descripción|descrizione|opis|send besked.*|send.*sælger.*|message seller|nachricht senden|skicka meddelande|er denne stadig tilgængelig\??|is this still available\??|ist das noch verfügbar\??|finns den kvar\??|se mere|see more|mehr anzeigen|visa mer|vis mer|näytä lisää|meer weergeven|voir plus|ver más|altro|zobacz więcej|del|share|gem|save|teilen|dela|jaa|delen|partager|compartir|condividi|udostępnij|synes godt om|like|kommentér|comment|kommentieren|kommentera|følg|follow|·|\.\.\.|…|\d+\s*(kommentarer|comments|kommentare|kommenttia)|sælgerinformation|seller information|verkäuferinformationen|säljarinformation|selgerinformasjon|myyjän tiedot|verkopersinformatie|informations sur le vendeur|información del vendedor|informazioni sul venditore|informacje o sprzedawcy|tilstand|stand|condition|zustand|skick|kunto|staat|état|estado|condizione|stan)$/i);
  const LISTED = /(opført|listed|eingestellt|publicerad|lagt ut|julkaistu|geplaatst|mis en vente|publicado|pubblicato|wystawione).{0,60}?\b(i|in|en|à|a|w|på)\s+([A-ZÆØÅÄÖÜÉÈŁŚŻ][\p{L}\-' ]{1,40}?)(?:,\s*([A-Z]{2}|[\p{L} ]+))?\s*$/iu;
  const LOC_LINE = /^(lokation|placering|location|standort|ort|plats|sted|sijainti|locatie|lieu|ubicación|ubicazione|lokalizacja|afhentning|afhentes|pickup|abholung|hämtas|hentes|nouto|ophalen|retrait|recogida|ritiro|odbiór)(?:\s+(in|i|en|à|w|på)(?=\s))?\s*[:\-–]?\s*(.+)$/iu;
  const LOC_ANY = new RegExp("(?<![\\p{L}])" + LOC_LINE.source.slice(1), "iu");
  const NEW_PRICE_WORDS = U(/(ny\s*pris|nypris|new\s*price|retail|rrp|neupreis|neu\s*preis|uvp|ny-pris|uushinta|nieuwprijs|nieuw\s*prijs|prix\s*neuf|precio\s*nuevo|prezzo\s*(da\s*)?nuovo|cena\s*now(ego|a)|kostede|kostet|kostade|maksoi|kostte|coûtait|costó|costava|kosztował)/i);
  const CUR_TOKENS = [
    [/^(€|eur|euro|euros)$/i, "EUR"], [/^(dkk|kr\.?|kroner|,-|kr,-)$/i, "KR"], [/^(sek)$/i, "SEK"], [/^(nok)$/i, "NOK"],
    [/^(zł|zl|pln)$/i, "PLN"], [/^(chf|fr\.?)$/i, "CHF"], [/^(£|gbp)$/i, "GBP"], [/^(kč|czk)$/i, "CZK"], [/^(ft|huf)$/i, "HUF"], [/^(lei|ron)$/i, "RON"], [/^(isk)$/i, "ISK"]
  ];
  const curOf = tok => { for (const [re, c] of CUR_TOKENS) if (re.test(tok.trim())) return c; return null; };
  const NUM = "(\\d{1,3}(?:[ .\\u00a0\\u202f]\\d{3})+(?:,\\d{1,2})?|\\d{1,3}(?:,\\d{3})+(?:\\.\\d{1,2})?|\\d+(?:[.,]\\d{1,2})?)";
  const CUR = "(€|£|eur(?:o|os)?|dkk|kr\\.?|kroner|sek|nok|zł|zl|pln|chf|gbp|kč|czk|ft|huf|lei|ron|isk)";
  const RE_AFTER = new RegExp(NUM + "\\s*(?:" + CUR + "|(,-))", "giu");
  const RE_BEFORE = new RegExp("(€|£|dkk|eur|sek|nok|pln|chf|gbp|czk|huf|ron|isk|kr\\.?)\\s*" + NUM, "giu");
  const RE_LABEL = new RegExp("(?:pris|price|preis|hinta|prijs|prix|precio|prezzo|cena|vb|vhb)\\s*[:\\-–]?\\s*" + NUM, "giu");
  function toNumber(s) {
    s = s.replace(/[\u00a0\u202f ]/g, "");
    if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) s = s.replace(/\./g, "").replace(",", ".");
    else if (/^\d{1,3}(,\d{3})+(\.\d+)?$/.test(s)) s = s.replace(/,/g, "");
    else s = s.replace(",", ".");
    const n = Math.round(parseFloat(s));
    return isFinite(n) ? n : null;
  }
  function findPrices(text) {
    const out = [];
    const push = (num, curTok, idx, len) => {
      const v = toNumber(num); if (v == null || v < 1 || v > 50000000) return;
      const lineStart = text.lastIndexOf("\n", idx) + 1, ctx = text.slice(Math.max(lineStart, idx - 40), idx + len);
      out.push({ value: v, cur: curTok ? curOf(curTok) : null, isNew: NEW_PRICE_WORDS.test(ctx), idx });
    };
    let m;
    RE_AFTER.lastIndex = 0; while ((m = RE_AFTER.exec(text))) push(m[1], m[2] || m[3], m.index, m[0].length);
    RE_BEFORE.lastIndex = 0; while ((m = RE_BEFORE.exec(text))) push(m[2], m[1], m.index, m[0].length);
    RE_LABEL.lastIndex = 0; while ((m = RE_LABEL.exec(text))) if (!out.some(o => Math.abs(o.idx - m.index) < 25)) push(m[1], null, m.index, m[0].length);
    return out.sort((a, b) => a.idx - b.idx);
  }

  const CAT_RULES = [
    ["airtrack", /\b(air\s*-?track|airtrack|air\s*floor|airfloor|air\s*block|airblock|air\s*spot|luftbane|luftmåtte|luftmatte|luftmatta|ilmapatja|ilmarata|luchtbaan|piste\s+gonflable|pista\s+hinchable|pista\s+gonfiabile|ścieżka\s+pneumatyczna|tumbl\w*\s+air)\b/i],
    ["teamgym", /\b(team\s*gym|teamgym|mini\s*-?tramp\w*|minitramp\w*|trampet|tramp\s*et|minitrampolin\w*|minitrampoliini)\b/i],
    ["trampolin", /\b(trampolin\w*|trampoline\w*|trampoliini|trampolino|trampolina|cama\s+elástica|stortrampolin|konkurrencetrampolin)\b/i],
    ["rg", /\b(rytmisk|rhythmic|rhythmische|rytminen|ritmische|rythmique|rítmica|ritmica|artystyczna|bånd|ribbon|reifen|hoop|køller|clubs|keulen|rg[\s-]?gulv|rg\s*floor)\b/i],
    ["ag", /\b(barre|barren|stufenbarren|ringe|rings|ringar|renkaat|anneaux|anillas|anelli|kółka|reck|svingstang|rekki|bom|beam|schwebebalken|puomi|balk|poutre|barra\s+de\s+equilibrio|trave|równoważnia|hest|pommel|pauschenpferd|bygelhäst|hevonen|voltigeplint|arçons|potro|cavallo|koń|parallel|parallelle|poręcze|nojapuut|parallèles|paralelas|parallele|idrætsgymnastik|apparatturn|gerätturnen|artistic)\b/i],
    ["skum", /\b(skum\w*|foam|schaumstoff\w*|vaahtomuovi\w*|schuim\w*|mousse|espuma|gommapiuma|pianka|springgrav|grav|pit|grube|grop|monttu|kuil|fosse|foso|buca|dół|springbord|sprungtisch|pegasus|plint|kast|vault|hoppbord|hyppypöytä|springkast|table\s+de\s+saut|mesa\s+de\s+salto|tavola|stół|tumbling\w*|springbane|springbana|bodenbahn|tumblingbane|landings?måtte\w*|måtte\w*|matte\w*|matta|matter|mattor|patja\w*|mat|mats|tapis|colchoneta\w*|materass\w*|materac\w*|dobbel\s*måtte|gulvmåtte|rullemåtte|vippebræt|springbræt|sprungbrett|trempolino|minitrampolín)\b/i],
    ["andet", /\b(fjedre|fjeder|springs?|federn|fjädrar|fjærer|jouset|veren|ressorts|muelles|molle|sprężyny|reservedel\w*|spare\s*parts?|ersatzteil\w*|reservdel\w*|varaos\w*|onderde\w*|pièces|recambios|ricambi|części|magnesia|chalk|kridt)\b/i]
  ].map(([k, re]) => [k, U(re)]);
  const BRANDS = ["AirTrack Factory", "AirTrack", "Gymnova", "Eurotramp", "Spieth", "Janssen-Fritsen", "Janssen Fritsen", "Continental Sports", "Acromat", "Tumbl Trak", "AAI", "American Athletic", "Reuther", "Benz", "Bänfer", "Huck", "Berg", "Taishan", "Gymnastics Stuff", "Nordic Games", "Stockholm Gymnastics", "Niels Larsen", "Schelde", "Kübler", "Sport-Thieme", "Gymtrade", "Senoh", "Paradise Mats", "Sardar", "Trampoline Factory", "Oxford", "Erhard Sport", "Hammer", "Polspran", "Tramp-Line", "Vuly", "Akrobat", "Dinasports", "Elan", "Unigym", "Gymplus"];
  const COND_RULES = [
    ["like_new", /\b(som\s+ny|næsten\s+ny|like\s+new|as\s+new|wie\s+neu|neuwertig|nästan\s+ny|kuin\s+uusi|zo\s+goed\s+als\s+nieuw|als\s+nieuw|comme\s+neuf|como\s+nuevo|come\s+nuovo|jak\s+nowy|prawie\s+nowy)\b/i],
    ["new", /\b(ny|ubrugt|uåbnet|aldrig\s+brugt|brand\s+new|new|unused|neu|unbenutzt|originalverpackt|oanvänd|helt\s+ny|ubrukt|uusi|käyttämätön|nieuw|ongebruikt|neuf|jamais\s+utilisé|nuevo|sin\s+usar|nuovo|mai\s+usato|nowy|nieużywany)\b(?!\s*(pris|price|preis))/i],
    ["fair", /\b(slidt|brugbar|trænger|slitage|fair|worn|wear|repair|gebrauchsspuren|abgenutzt|sliten|slitt|kulunut|käyttökelpoinen|gebruikt|slijtage|usé|usure|desgastado|usurato|zużyty|ślady\s+użytkowania)\b/i],
    ["good", /\b(god|pæn|fin|velholdt|good|great|nice|well\s+kept|gut|guter\s+zustand|gepflegt|bra|fint|välskött|pent|godt|hyvä|siisti|goed|nette|bon\s+état|buen\s+estado|buono|ottimo|dobry|zadbany|brugt|used|gebraucht|begagnad|brukt|käytetty|d'occasion|usado|usato|używany)\b/i]
  ].map(([k, re]) => [k, U(re)]);
  const DELIVERY_YES = U(/\b(kan\s+(evt\.?\s+|godt\s+|også\s+)?leveres|levering\s+(er\s+)?mulig|leverer|kan\s+fragtes|fragt|delivery\s+(possible|available)|can\s+deliver|lieferung\s+möglich|versand|kan\s+levereras|frakt|toimitus|kuljetus\s+onnistuu|bezorgen|levering\s+mogelijk|livraison\s+possible|envío|consegna|spedizione|dostawa\s+możliwa|wysyłka)\b/i);
  const PICKUP_ONLY = U(/\b(kun\s+afhentning|skal\s+afhentes|afhentes|pickup\s+only|collection\s+only|nur\s+abholung|selbstabholung|endast\s+avhämtning|hämtas|må\s+hentes|kun\s+henting|nouto|alleen\s+ophalen|à\s+retirer|retrait\s+uniquement|solo\s+recogida|solo\s+ritiro|tylko\s+odbiór)\b/i);
  const POSTCODE = [
    [/\b(\d{4})\s+([A-ZÆØÅ][\p{L}\- ]{1,30})/u, "DK"],
    [/\b(\d{3}\s?\d{2})\s+([A-ZÅÄÖ][\p{L}\- ]{1,30})/u, "SE"],
    [/\b(\d{5})\s+([A-ZÄÖÜ][\p{L}\- ]{1,30})/u, "DE"],
    [/\b(\d{4}\s?[A-Z]{2})\s+([A-Z][\p{L}\- ]{1,30})/u, "NL"],
    [/\b(\d{2}-\d{3})\s+([A-ZŁŚŻŹ][\p{L}\- ]{1,30})/u, "PL"]
  ];

  function parse(raw, opts) {
    opts = opts || {};
    const text = String(raw || "").replace(/\r/g, "").replace(/[\u200b\u200e\u200f]/g, "").trim();
    const out = { fields: {} };
    if (!text) return out;
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    const clean = lines.filter(l => !NOISE.test(l) && !/^\d+\s*(t|h|d|min|uger?|w|weeks?|dage?|days?)\.?$/i.test(l));

    let title = "";
    for (const l of clean) {
      const s = l.replace(SALE_PREFIX, "").replace(/^[\s#*•\-–|]+/, "").trim();
      if (s.length >= 3 && !/^(€|£)?\s*[\d .,]+\s*(kr\.?|dkk|€|eur|sek|nok|zł|,-)?$/i.test(s) && !LISTED.test(s)) { title = s; break; }
    }
    if (title) out.fields.title = title.length > 80 ? title.slice(0, 77).replace(/\s+\S*$/, "") + "…" : title;

    const prices = findPrices(text);
    const sale = prices.find(p => !p.isNew), np = prices.find(p => p.isNew);
    const krFromText = () => {
      if (/[äö]/i.test(text) && !/[æø]/i.test(text)) return "SEK";
      if (U(/\b(selges|hentes|kjøpt|kjøpe|brukt|pent|ønskes|fin\s+stand)\b/i).test(text) && !U(/\b(sælges|afhentes|købt|brugt)\b/i).test(text)) return "NOK";
      if (/[æø]/i.test(text) || U(/\b(sælges|afhentes|købt|brugt|kr\.)\b/i).test(text)) return "DKK";
      if (/[ðþ]/i.test(text)) return "ISK";
      return null;
    };
    const resolveCur = c => c === "KR" ? (krFromText() || opts.krCurrency || "DKK") : c;
    if (sale) { out.fields.price = sale.value; const c = resolveCur(sale.cur); if (c) out.fields.currency = c; }
    if (np && (!sale || np.value > sale.value)) out.fields.new_price = np.value;
    if (/\b(gratis|free|kostenlos|ilmainen|gratuit|gratuito|za\s+darmo|bortskänkes|gives\s+væk|gis\s+bort)\b/i.test(text) && !sale) out.fields.price = 0;

    for (const l of lines) {
      let m = l.match(LISTED);
      if (m) { out.fields.city = m[3].trim(); break; }
      m = l.match(LOC_LINE) || (l.split(/[.;,]\s+/).map(x => x.match(LOC_ANY)).find(Boolean));
      if (m && m[3] && m[3].length < 60) { const c = m[3].replace(/[.!]$/, "").trim(); const pc = c.match(/^(\d[\d -]{2,6}[A-Z]{0,2})\s+(.+)$/); if (pc) { out.fields.postcode = pc[1].trim(); out.fields.city = pc[2].trim(); } else out.fields.city = c.split(",")[0].trim(); break; }
    }
    if (!out.fields.city) { const m = text.match(/(?:only|uniquement|nur|kun|endast|tylko|solo)[,:]?\s+(?:(?:in|à|a|i|w|en|på)\s+)?([A-ZÆØÅÄÖÜÉŁŚ][\p{L}\-']{2,30})/u); if (m) out.fields.city = m[1]; }
    if (!out.fields.postcode) {
      for (const [re] of POSTCODE) {
        for (const l of lines) {
          if (/\d\s*(kr|dkk|€|eur|sek|nok|cm|mm|m\b|kg|x)/i.test(l)) continue;
          const m = l.match(re);
          if (m && !/^(19|20)\d\d$/.test(m[1])) { out.fields.postcode = m[1]; if (!out.fields.city) out.fields.city = m[2].trim().split(/[,.]/)[0]; break; }
        }
        if (out.fields.postcode) break;
      }
    }
    if (out.fields.city) out.fields.city = out.fields.city.replace(/^(kun|only|nur|endast|bara|vain|alleen|uniquement|seulement|solo|solamente|tylko)\s+/iu, "").replace(/^(i|in|en|à|a|w|på|bei|nahe|near|ved|nær)\s+/iu, "").replace(/\s+(DK|DE|SE|NO|FI|NL)$/, "").slice(0, 60);

    const hay = [out.fields.title || "", text];
    outer: for (const h of hay) for (const [id, re] of CAT_RULES) if (re.test(h)) { out.fields.category = id; break outer; }
    for (const [id, re] of COND_RULES) if (re.test(text)) { out.fields.condition = id; break; }
    const b = BRANDS.find(x => new RegExp("\\b" + x.replace(/[-\s]/g, "[-\\s]?") + "\\b", "i").test(text));
    if (b) out.fields.brand = b === "Janssen Fritsen" ? "Janssen-Fritsen" : b;

    const yCtx = text.match(/(årgang|købt|fra|model|year|bought|purchased|baujahr|gekauft|köpt|årsmodell|kjøpt|vuosimalli|ostettu|bouwjaar|gekocht|acheté|année|comprado|año|acquistato|anno|rok|kupiony)\s*(i|in|en|im|år|:)?\s*((19[89]|20[0-3])\d)\b/i);
    const yAny = (out.fields.title || "").match(/\b((19[89]|20[0-3])\d)\b/);
    const yr = yCtx ? +yCtx[3] : yAny ? +yAny[1] : null;
    if (yr && yr <= new Date().getFullYear() + 1 && (!out.fields.price || yr !== out.fields.price)) out.fields.year = yr;

    if (DELIVERY_YES.test(text)) out.fields.transport = true;
    else if (PICKUP_ONLY.test(text)) out.fields.transport = false;

    const desc = clean.filter(l => l !== lines.find(x => x.replace(SALE_PREFIX, "").trim().startsWith((out.fields.title || "").replace(/…$/, "").slice(0, 20)))).join("\n").trim();
    if (desc) out.fields.description = desc.slice(0, 3000);
    return out;
  }
  window.GMFbParse = parse;

  /* ======================= UI ======================= */
  const $ = (s, r) => (r || document).querySelector(s);
  const FIELD_MAP = { title: "#sTitle", price: "#sPrice", new_price: "#sNew", currency: "#sCurrency", city: "#sCity", postcode: "#sPost", category: "#sCat", condition: "#sCond", brand: "#sBrand", year: "#sYear", description: "#sDesc", transport: "#sTransport" };
  const LABEL = { title: "f_title", price: "f_price", new_price: "f_new", city: "f_city", postcode: "f_post", category: "f_cat", condition: "f_cond", brand: "f_brand", year: "f_year", transport: "f_transport", description: "f_desc" };

  function css() {
    if ($("#fbiCss")) return;
    const s = document.createElement("style"); s.id = "fbiCss";
    s.textContent = `
.fbi-cta{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;background:#eef3ff;border:1.5px dashed #9db6ff;border-radius:12px;padding:12px 14px;margin:0 0 18px}
.fbi-cta b{font-size:.95rem}.fbi-cta .fbi-fb{display:inline-flex;width:22px;height:22px;border-radius:50%;background:#1877f2;color:#fff;align-items:center;justify-content:center;font-weight:800;font-family:Arial,sans-serif;margin-right:8px;font-size:14px}
.fbi-btn{display:inline-flex;align-items:center;gap:6px;border:0;border-radius:10px;padding:9px 14px;cursor:pointer;background:#1877f2;color:#fff;font:inherit;font-weight:600}
.fbi-btn:hover{filter:brightness(.93)}.fbi-btn.ghost{background:#fff;color:#1a2233;border:1.5px solid #e3e8f1}
.fbi-panel{background:#f6f8fc;border:1px solid #e3e8f1;border-radius:14px;padding:18px;margin:0 0 20px}
.fbi-panel h3{margin:0 0 6px;font-size:1.15rem}.fbi-panel p{margin:0 0 12px;color:#5b6578;font-size:.92rem}
.fbi-steps{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 14px;padding:0;list-style:none;counter-reset:s}
.fbi-steps li{counter-increment:s;background:#fff;border:1px solid #e3e8f1;border-radius:20px;padding:4px 12px 4px 6px;font-size:.84rem;display:flex;align-items:center;gap:6px}
.fbi-steps li:before{content:counter(s);display:inline-flex;width:20px;height:20px;border-radius:50%;background:#1877f2;color:#fff;font-size:.75rem;font-weight:700;align-items:center;justify-content:center}
.fbi-panel label.fbi-l{display:block;font-weight:600;font-size:.88rem;margin:10px 0 4px}
.fbi-panel textarea{width:100%;min-height:150px;padding:10px;border:1px solid #e3e8f1;border-radius:8px;font:inherit;resize:vertical;background:#fff;box-sizing:border-box}
.fbi-drop{border:2px dashed #c6d2e8;border-radius:12px;padding:16px;text-align:center;color:#5b6578;font-size:.9rem;cursor:pointer;background:#fff;transition:.15s}
.fbi-drop.over{border-color:#1877f2;background:#eef3ff}
.fbi-thumbs{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}
.fbi-thumbs div{position:relative}.fbi-thumbs img{width:64px;height:64px;object-fit:cover;border-radius:8px;display:block}
.fbi-thumbs button{position:absolute;top:-6px;right:-6px;width:20px;height:20px;border-radius:50%;border:0;background:#d93838;color:#fff;font-size:12px;line-height:20px;cursor:pointer;padding:0}
.fbi-hint{font-size:.8rem;color:#5b6578;margin-top:4px}
.fbi-found{display:flex;gap:6px;flex-wrap:wrap;margin:12px 0 4px;min-height:24px}
.fbi-chip{font-size:.78rem;background:#e3f7ea;color:#0b6b36;border-radius:20px;padding:3px 9px;font-weight:600;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.fbi-chip.miss{background:#eceff4;color:#5b6578;font-weight:500}
.fbi-consent{display:flex;gap:8px;align-items:flex-start;font-size:.88rem;margin:12px 0 4px;cursor:pointer}.fbi-consent input{margin-top:3px}
.fbi-err{color:#d93838;font-size:.88rem;min-height:1.2em;margin:4px 0}
.fbi-actions{display:flex;gap:8px;flex-wrap:wrap}
.fbi-result{background:#e9f8ef;border:1px solid #bfe9cf;color:#0b6b36;border-radius:10px;padding:10px 12px;font-size:.9rem;margin:0 0 16px}
.fbi-result small{display:block;color:#7a5200;margin-top:4px}
.fbi-filled{outline:2px solid #12a150!important;outline-offset:1px;background:#f3fcf6!important}
.fbi-check{outline:2px solid #e5b84f!important;outline-offset:1px}`;
    document.head.appendChild(s);
  }

  let images = [], panelOpen = false, openOnNextSell = false;

  function build() {
    const form = $("#sellForm"); if (!form || $("#fbiRoot")) return;
    css();
    const root = document.createElement("div"); root.id = "fbiRoot";
    form.parentNode.insertBefore(root, form);
    render();
  }
  function render() {
    const root = $("#fbiRoot"); if (!root) return;
    if (!panelOpen) {
      root.innerHTML = `<div class="fbi-cta"><b><span class="fbi-fb" aria-hidden="true">f</span>${esc(t("cta_q"))}</b><button type="button" class="fbi-btn" id="fbiOpen">${esc(t("cta_b"))}</button></div>`;
      $("#fbiOpen").addEventListener("click", () => { panelOpen = true; render(); setTimeout(() => $("#fbiText").focus(), 30); });
      return;
    }
    root.innerHTML = `<div class="fbi-panel" role="region" aria-labelledby="fbiH">
      <h3 id="fbiH">${esc(t("h"))}</h3><p>${esc(t("p"))}</p>
      <ol class="fbi-steps" aria-label="${esc(t("how"))}"><li>${esc(t("s1"))}</li><li>${esc(t("s2"))}</li><li>${esc(t("s3"))}</li></ol>
      <label class="fbi-l" for="fbiText">${esc(t("l_text"))}</label>
      <textarea id="fbiText" placeholder="${esc(t("ph"))}" maxlength="8000"></textarea>
      <div class="fbi-found" id="fbiFound" aria-live="polite"></div>
      <label class="fbi-l" for="fbiFile">${esc(t("l_img"))}</label>
      <div class="fbi-drop" id="fbiDrop" tabindex="0" role="button">${esc(t("drop"))}</div>
      <input type="file" id="fbiFile" accept="image/*" multiple hidden>
      <div class="fbi-hint">${esc(t("img_hint"))}</div>
      <div class="fbi-thumbs" id="fbiThumbs"></div>
      <label class="fbi-consent"><input type="checkbox" id="fbiConsent"> <span>${esc(t("consent"))}</span></label>
      <div class="fbi-err" id="fbiErr" aria-live="assertive"></div>
      <div class="fbi-actions"><button type="button" class="fbi-btn" id="fbiApply">${esc(t("btn"))}</button><button type="button" class="fbi-btn ghost" id="fbiCancel">${esc(t("cancel"))}</button></div>
    </div>`;
    const ta = $("#fbiText"), drop = $("#fbiDrop"), file = $("#fbiFile");
    ta.addEventListener("input", preview);
    drop.addEventListener("click", () => file.click());
    drop.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); file.click(); } });
    file.addEventListener("change", () => { addFiles(file.files); file.value = ""; });
    ["dragenter", "dragover"].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add("over"); }));
    ["dragleave", "drop"].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove("over"); }));
    drop.addEventListener("drop", e => addFiles(e.dataTransfer.files));
    $("#fbiRoot").addEventListener("paste", e => {
      const files = Array.from(e.clipboardData && e.clipboardData.files || []).filter(f => f.type.startsWith("image/"));
      if (files.length) { e.preventDefault(); addFiles(files); }
    });
    $("#fbiCancel").addEventListener("click", () => { panelOpen = false; images = []; render(); });
    $("#fbiApply").addEventListener("click", apply);
    renderThumbs(); preview();
  }
  function addFiles(list) {
    for (const f of Array.from(list || [])) { if (f.type.startsWith("image/") && images.length < 6) images.push(f); }
    renderThumbs(); preview();
  }
  function renderThumbs() {
    const box = $("#fbiThumbs"); if (!box) return;
    box.innerHTML = "";
    images.forEach((f, i) => {
      const d = document.createElement("div"), img = document.createElement("img"), x = document.createElement("button");
      img.src = URL.createObjectURL(f); img.alt = ""; img.onload = () => URL.revokeObjectURL(img.src);
      x.type = "button"; x.textContent = "×"; x.setAttribute("aria-label", "×"); x.addEventListener("click", () => { images.splice(i, 1); renderThumbs(); preview(); });
      d.append(img, x); box.appendChild(d);
    });
  }
  function catLabel(id) { const o = $(`#sCat option[value="${id}"]`); return o ? o.textContent : id; }
  function condLabel(id) { const o = $(`#sCond option[value="${id}"]`); return o ? o.textContent : id; }
  function krCurrency() { const c = $("#sCurrency") && $("#sCurrency").value; return ["DKK", "SEK", "NOK", "ISK"].includes(c) ? c : ({ sv: "SEK", nb: "NOK" }[lang()] || "DKK"); }
  function fmt(k, v, f) {
    if (k === "price" || k === "new_price") { try { return new Intl.NumberFormat(loc(), { style: "currency", currency: f.currency || krCurrency(), maximumFractionDigits: 0 }).format(v); } catch (e) { return v; } }
    if (k === "category") return catLabel(v); if (k === "condition") return condLabel(v);
    if (k === "transport") return v ? "✓" : "–"; if (k === "description") return (v.length > 30 ? v.slice(0, 30) + "…" : v);
    return v;
  }
  function preview() {
    const box = $("#fbiFound"); if (!box) return;
    const f = parse($("#fbiText").value, { krCurrency: krCurrency() }).fields;
    if (!$("#fbiText").value.trim()) { box.innerHTML = ""; return; }
    const keys = ["title", "price", "city", "category", "condition", "brand", "year", "new_price", "transport"];
    box.innerHTML = `<span class="fbi-hint" style="margin:0 4px 0 0">${esc(t("found"))}:</span>` + keys.map(k =>
      f[k] != null ? `<span class="fbi-chip" title="${esc(t(LABEL[k]))}">✓ ${esc(t(LABEL[k]))}: ${esc(fmt(k, f[k], f))}</span>` : (["title", "price", "city", "category"].includes(k) ? `<span class="fbi-chip miss">${esc(t(LABEL[k]))}</span>` : "")
    ).join("") + (images.length ? `<span class="fbi-chip">✓ ${esc(t("f_img"))}: ${images.length}</span>` : "");
  }
  function setVal(sel, v) {
    const el = $(sel); if (!el) return false;
    if (el.type === "checkbox") el.checked = !!v;
    else if (el.tagName === "SELECT") { if (![...el.options].some(o => o.value === String(v))) return false; el.value = String(v); }
    else el.value = v;
    el.dispatchEvent(new Event("input", { bubbles: true })); el.dispatchEvent(new Event("change", { bubbles: true }));
    el.classList.add("fbi-filled"); el.addEventListener("input", () => el.classList.remove("fbi-filled"), { once: true });
    return true;
  }
  function setCheck(sel) { const el = $(sel); if (!el) return; el.classList.add("fbi-check"); el.addEventListener("input", () => el.classList.remove("fbi-check"), { once: true }); el.addEventListener("change", () => el.classList.remove("fbi-check"), { once: true }); }
  function apply() {
    const err = $("#fbiErr"), text = $("#fbiText").value;
    if (!text.trim()) { err.textContent = t("err_text"); $("#fbiText").focus(); return; }
    if (!$("#fbiConsent").checked) { err.textContent = t("err_consent"); $("#fbiConsent").focus(); return; }
    err.textContent = "";
    const f = parse(text, { krCurrency: krCurrency() }).fields;
    let n = 0;
    for (const k of ["currency", "title", "category", "condition", "brand", "year", "price", "new_price", "city", "postcode", "transport", "description"]) {
      if (f[k] == null || f[k] === "") continue;
      if (setVal(FIELD_MAP[k], f[k]) && k !== "currency") n++;
    }
    const inp = $("#sImgs");
    if (images.length && inp && window.DataTransfer) {
      try { const dt = new DataTransfer(); images.slice(0, 6).forEach(x => dt.items.add(x)); inp.files = dt.files; inp.dispatchEvent(new Event("change", { bubbles: true })); n++; } catch (e) { }
    }
    const missKeys = ["title", "price", "city", "category"].filter(k => f[k] == null);
    const miss = missKeys.map(k => { setCheck(FIELD_MAP[k]); return t(LABEL[k]); });
    if (!$("#sCountry") || !$("#sCountry").value) setCheck("#sCountry");
    panelOpen = false; images = [];
    $("#fbiRoot").innerHTML = `<div class="fbi-result" role="status">✓ ${esc(t("done", { n }))}${miss.length ? `<small>${esc(t("missing", { f: miss.join(", ") }))}</small>` : ""}</div>`;
    const first = missKeys.length ? $(FIELD_MAP[missKeys[0]]) : $("#sTitle");
    first && first.focus();
    setTimeout(() => { if (!panelOpen && $("#fbiRoot")) render(); }, 15000);
  }

  function init() {
    build();
    document.addEventListener("click", e => { if (e.target.closest(".fb [data-sell]")) openOnNextSell = true; }, true);
    const modal = $("#mSell");
    if (modal) new MutationObserver(() => {
      if (!modal.classList.contains("open")) return;
      build();
      if (openOnNextSell) { openOnNextSell = false; panelOpen = true; render(); setTimeout(() => $("#fbiText") && $("#fbiText").focus(), 60); }
    }).observe(modal, { attributes: true, attributeFilter: ["class"] });
    const form = $("#sellForm"); if (form) form.addEventListener("reset", () => { panelOpen = false; images = []; setTimeout(render, 0); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => setTimeout(init, 0)); else setTimeout(init, 0);
})();
