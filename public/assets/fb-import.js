/* ============================================================
   GymMarket – Importér Facebook-annonce (manuelt)
   Sælger indsætter link + tekst + billeder fra sit opslag og
   får "Sælg et redskab" udfyldt. Der hentes INTET fra Facebook.
   Direkte link: gymmarket.dk/#import
   ============================================================ */
(function () {
  const TX = {
    da: { open: "Importér fra Facebook", h: "Importér din Facebook-annonce", sub: "Kopiér teksten fra dit opslag og sæt den ind her. Så udfylder vi annoncen for dig, og du tjekker felterne, før den oprettes.", privacy: "Vi henter ikke noget fra Facebook. Kun det, du selv indsætter, bliver brugt.", l_url: "Link til opslaget (valgfrit)", url_help: "Tryk på ··· eller \"Del\" på opslaget, og vælg \"Kopiér link\".", l_text: "Teksten fra opslaget *", text_help: "Markér hele teksten i opslaget (tryk \"Se mere\" først), kopiér og sæt ind.", l_imgs: "Billeder fra opslaget", imgs_help: "Gem billederne fra opslaget på din telefon eller computer, og vælg dem her (op til 6).", own: "Jeg er selv sælger, eller jeg har sælgers tilladelse til at lægge annoncen her", btn: "Udfyld annoncen", err_url: "Linket skal være til et opslag på Facebook.", err_text: "Sæt teksten fra opslaget ind.", err_own: "Du skal bekræfte, at du er sælger eller har tilladelse.", done: "Vi har udfyldt {n} felter fra din Facebook-annonce. Tjek de gule felter, og udfyld det, der mangler.", none: "Vi kunne ikke genkende pris eller by. Teksten er sat ind som beskrivelse, så udfyld resten selv.", hint: "Har du allerede en annonce på Facebook?", source: "Se det oprindelige opslag på Facebook", preview: "Det har vi fundet", f_title: "Titel", f_price: "Pris", f_city: "By", f_year: "Årgang", f_brand: "Producent", f_cat: "Kategori", f_cond: "Stand", f_contact: "Kontakt", f_new: "Nypris" },
    en: { open: "Import from Facebook", h: "Import your Facebook listing", sub: "Copy the text from your post and paste it here. We fill in the listing for you, and you check the fields before it is published.", privacy: "We don't fetch anything from Facebook. Only what you paste is used.", l_url: "Link to the post (optional)", url_help: "Tap ··· or \"Share\" on the post and choose \"Copy link\".", l_text: "Text from the post *", text_help: "Select all text in the post (tap \"See more\" first), copy and paste it.", l_imgs: "Photos from the post", imgs_help: "Save the photos from the post to your phone or computer and choose them here (up to 6).", own: "I am the seller, or I have the seller's permission to post the listing here", btn: "Fill in the listing", err_url: "The link must point to a Facebook post.", err_text: "Paste the text from the post.", err_own: "You must confirm that you are the seller or have permission.", done: "We filled in {n} fields from your Facebook listing. Check the yellow fields and complete what is missing.", none: "We could not detect price or city. The text has been added as the description. Please fill in the rest.", hint: "Already have a listing on Facebook?", source: "See the original post on Facebook", preview: "What we found", f_title: "Title", f_price: "Price", f_city: "City", f_year: "Year", f_brand: "Brand", f_cat: "Category", f_cond: "Condition", f_contact: "Contact", f_new: "New price" },
    de: { open: "Aus Facebook importieren", h: "Facebook-Anzeige importieren", sub: "Kopieren Sie den Text Ihres Beitrags und fügen Sie ihn hier ein. Wir füllen die Anzeige aus, und Sie prüfen die Felder vor der Veröffentlichung.", privacy: "Wir laden nichts von Facebook. Es wird nur verwendet, was Sie selbst einfügen.", l_url: "Link zum Beitrag (optional)", url_help: "Tippen Sie auf ··· oder \"Teilen\" und wählen Sie \"Link kopieren\".", l_text: "Text des Beitrags *", text_help: "Markieren Sie den ganzen Text (zuerst \"Mehr ansehen\"), kopieren und einfügen.", l_imgs: "Fotos aus dem Beitrag", imgs_help: "Speichern Sie die Fotos auf Handy oder Computer und wählen Sie sie hier aus (bis zu 6).", own: "Ich bin der Verkäufer oder habe seine Erlaubnis, die Anzeige hier einzustellen", btn: "Anzeige ausfüllen", err_url: "Der Link muss auf einen Facebook-Beitrag verweisen.", err_text: "Fügen Sie den Text des Beitrags ein.", err_own: "Bitte bestätigen Sie, dass Sie Verkäufer sind oder eine Erlaubnis haben.", done: "Wir haben {n} Felder aus Ihrer Facebook-Anzeige ausgefüllt. Prüfen Sie die gelben Felder und ergänzen Sie den Rest.", none: "Preis oder Ort wurden nicht erkannt. Der Text wurde als Beschreibung eingefügt. Bitte den Rest selbst ausfüllen.", hint: "Haben Sie schon eine Anzeige auf Facebook?", source: "Originalbeitrag auf Facebook ansehen", preview: "Erkannt", f_title: "Titel", f_price: "Preis", f_city: "Ort", f_year: "Baujahr", f_brand: "Hersteller", f_cat: "Kategorie", f_cond: "Zustand", f_contact: "Kontakt", f_new: "Neupreis" },
    sv: { open: "Importera från Facebook", h: "Importera din Facebookannons", sub: "Kopiera texten från ditt inlägg och klistra in den här. Vi fyller i annonsen åt dig, och du kontrollerar fälten innan den publiceras.", privacy: "Vi hämtar inget från Facebook. Bara det du själv klistrar in används.", l_url: "Länk till inlägget (valfritt)", url_help: "Tryck på ··· eller \"Dela\" och välj \"Kopiera länk\".", l_text: "Texten från inlägget *", text_help: "Markera hela texten (tryck \"Visa mer\" först), kopiera och klistra in.", l_imgs: "Bilder från inlägget", imgs_help: "Spara bilderna i telefonen eller datorn och välj dem här (upp till 6).", own: "Jag är säljaren eller har säljarens tillstånd att lägga upp annonsen här", btn: "Fyll i annonsen", err_url: "Länken måste gå till ett inlägg på Facebook.", err_text: "Klistra in texten från inlägget.", err_own: "Du måste bekräfta att du är säljare eller har tillstånd.", done: "Vi har fyllt i {n} fält från din Facebookannons. Kontrollera de gula fälten och fyll i det som saknas.", none: "Vi kunde inte hitta pris eller ort. Texten har lagts in som beskrivning. Fyll i resten själv.", hint: "Har du redan en annons på Facebook?", source: "Se ursprungsinlägget på Facebook", preview: "Det här hittade vi", f_title: "Rubrik", f_price: "Pris", f_city: "Ort", f_year: "Årsmodell", f_brand: "Tillverkare", f_cat: "Kategori", f_cond: "Skick", f_contact: "Kontakt", f_new: "Nypris" },
    nb: { open: "Importer fra Facebook", h: "Importer Facebook-annonsen din", sub: "Kopier teksten fra innlegget ditt og lim den inn her. Vi fyller ut annonsen for deg, og du sjekker feltene før den publiseres.", privacy: "Vi henter ingenting fra Facebook. Bare det du selv limer inn, brukes.", l_url: "Lenke til innlegget (valgfritt)", url_help: "Trykk på ··· eller \"Del\" og velg \"Kopier lenke\".", l_text: "Teksten fra innlegget *", text_help: "Marker hele teksten (trykk \"Se mer\" først), kopier og lim inn.", l_imgs: "Bilder fra innlegget", imgs_help: "Lagre bildene på telefonen eller datamaskinen og velg dem her (opptil 6).", own: "Jeg er selger eller har selgers tillatelse til å legge ut annonsen her", btn: "Fyll ut annonsen", err_url: "Lenken må gå til et innlegg på Facebook.", err_text: "Lim inn teksten fra innlegget.", err_own: "Du må bekrefte at du er selger eller har tillatelse.", done: "Vi har fylt ut {n} felt fra Facebook-annonsen din. Sjekk de gule feltene og fyll ut resten.", none: "Vi fant ikke pris eller sted. Teksten er lagt inn som beskrivelse. Fyll ut resten selv.", hint: "Har du allerede en annonse på Facebook?", source: "Se det opprinnelige innlegget på Facebook", preview: "Dette fant vi", f_title: "Tittel", f_price: "Pris", f_city: "Sted", f_year: "Årsmodell", f_brand: "Produsent", f_cat: "Kategori", f_cond: "Tilstand", f_contact: "Kontakt", f_new: "Nypris" },
    fi: { open: "Tuo Facebookista", h: "Tuo Facebook-ilmoituksesi", sub: "Kopioi julkaisusi teksti ja liitä se tähän. Täytämme ilmoituksen puolestasi, ja tarkistat kentät ennen julkaisua.", privacy: "Emme hae mitään Facebookista. Käytämme vain sitä, minkä itse liität.", l_url: "Linkki julkaisuun (valinnainen)", url_help: "Napauta julkaisun ··· tai \"Jaa\" ja valitse \"Kopioi linkki\".", l_text: "Julkaisun teksti *", text_help: "Valitse koko teksti (napauta ensin \"Näytä lisää\"), kopioi ja liitä.", l_imgs: "Julkaisun kuvat", imgs_help: "Tallenna kuvat puhelimeen tai tietokoneelle ja valitse ne tässä (enintään 6).", own: "Olen myyjä tai minulla on myyjän lupa julkaista ilmoitus täällä", btn: "Täytä ilmoitus", err_url: "Linkin on osoitettava Facebook-julkaisuun.", err_text: "Liitä julkaisun teksti.", err_own: "Vahvista, että olet myyjä tai sinulla on lupa.", done: "Täytimme {n} kenttää Facebook-ilmoituksestasi. Tarkista keltaiset kentät ja täydennä puuttuvat.", none: "Hintaa tai paikkakuntaa ei tunnistettu. Teksti lisättiin kuvaukseksi. Täytä loput itse.", hint: "Onko sinulla jo ilmoitus Facebookissa?", source: "Näytä alkuperäinen julkaisu Facebookissa", preview: "Löysimme", f_title: "Otsikko", f_price: "Hinta", f_city: "Paikkakunta", f_year: "Vuosimalli", f_brand: "Valmistaja", f_cat: "Kategoria", f_cond: "Kunto", f_contact: "Yhteystiedot", f_new: "Uushinta" },
    nl: { open: "Importeren uit Facebook", h: "Je Facebook-advertentie importeren", sub: "Kopieer de tekst van je bericht en plak hem hier. Wij vullen de advertentie in, en jij controleert de velden voordat hij online gaat.", privacy: "We halen niets op bij Facebook. Alleen wat je zelf plakt, wordt gebruikt.", l_url: "Link naar het bericht (optioneel)", url_help: "Tik op ··· of \"Delen\" en kies \"Link kopiëren\".", l_text: "Tekst van het bericht *", text_help: "Selecteer alle tekst (tik eerst op \"Meer weergeven\"), kopieer en plak.", l_imgs: "Foto's uit het bericht", imgs_help: "Sla de foto's op je telefoon of computer op en kies ze hier (max. 6).", own: "Ik ben de verkoper of heb toestemming van de verkoper om de advertentie hier te plaatsen", btn: "Advertentie invullen", err_url: "De link moet naar een Facebook-bericht verwijzen.", err_text: "Plak de tekst van het bericht.", err_own: "Bevestig dat je de verkoper bent of toestemming hebt.", done: "We hebben {n} velden ingevuld uit je Facebook-advertentie. Controleer de gele velden en vul de rest aan.", none: "We konden prijs of plaats niet herkennen. De tekst is als beschrijving toegevoegd. Vul de rest zelf in.", hint: "Heb je al een advertentie op Facebook?", source: "Bekijk het oorspronkelijke bericht op Facebook", preview: "Gevonden", f_title: "Titel", f_price: "Prijs", f_city: "Plaats", f_year: "Bouwjaar", f_brand: "Merk", f_cat: "Categorie", f_cond: "Staat", f_contact: "Contact", f_new: "Nieuwprijs" },
    fr: { open: "Importer depuis Facebook", h: "Importer votre annonce Facebook", sub: "Copiez le texte de votre publication et collez-le ici. Nous remplissons l'annonce pour vous, et vous vérifiez les champs avant publication.", privacy: "Nous ne récupérons rien sur Facebook. Seul ce que vous collez est utilisé.", l_url: "Lien vers la publication (facultatif)", url_help: "Appuyez sur ··· ou « Partager » puis « Copier le lien ».", l_text: "Texte de la publication *", text_help: "Sélectionnez tout le texte (appuyez d'abord sur « Voir plus »), copiez et collez.", l_imgs: "Photos de la publication", imgs_help: "Enregistrez les photos sur votre téléphone ou ordinateur et choisissez-les ici (6 max.).", own: "Je suis le vendeur ou j'ai son autorisation pour publier l'annonce ici", btn: "Remplir l'annonce", err_url: "Le lien doit mener à une publication Facebook.", err_text: "Collez le texte de la publication.", err_own: "Vous devez confirmer que vous êtes le vendeur ou avez son autorisation.", done: "Nous avons rempli {n} champs depuis votre annonce Facebook. Vérifiez les champs en jaune et complétez le reste.", none: "Prix ou ville non détectés. Le texte a été ajouté en description. Complétez le reste.", hint: "Vous avez déjà une annonce sur Facebook ?", source: "Voir la publication d'origine sur Facebook", preview: "Ce que nous avons trouvé", f_title: "Titre", f_price: "Prix", f_city: "Ville", f_year: "Année", f_brand: "Marque", f_cat: "Catégorie", f_cond: "État", f_contact: "Contact", f_new: "Prix neuf" },
    es: { open: "Importar desde Facebook", h: "Importa tu anuncio de Facebook", sub: "Copia el texto de tu publicación y pégalo aquí. Rellenamos el anuncio por ti y tú revisas los campos antes de publicarlo.", privacy: "No descargamos nada de Facebook. Solo usamos lo que tú pegas.", l_url: "Enlace a la publicación (opcional)", url_help: "Pulsa ··· o «Compartir» y elige «Copiar enlace».", l_text: "Texto de la publicación *", text_help: "Selecciona todo el texto (pulsa antes «Ver más»), cópialo y pégalo.", l_imgs: "Fotos de la publicación", imgs_help: "Guarda las fotos en tu móvil u ordenador y elígelas aquí (hasta 6).", own: "Soy el vendedor o tengo su permiso para publicar el anuncio aquí", btn: "Rellenar el anuncio", err_url: "El enlace debe llevar a una publicación de Facebook.", err_text: "Pega el texto de la publicación.", err_own: "Debes confirmar que eres el vendedor o tienes permiso.", done: "Hemos rellenado {n} campos de tu anuncio de Facebook. Revisa los campos amarillos y completa lo que falte.", none: "No detectamos precio ni ciudad. El texto se ha añadido como descripción. Completa el resto.", hint: "¿Ya tienes un anuncio en Facebook?", source: "Ver la publicación original en Facebook", preview: "Lo que hemos encontrado", f_title: "Título", f_price: "Precio", f_city: "Ciudad", f_year: "Año", f_brand: "Marca", f_cat: "Categoría", f_cond: "Estado", f_contact: "Contacto", f_new: "Precio nuevo" },
    it: { open: "Importa da Facebook", h: "Importa il tuo annuncio Facebook", sub: "Copia il testo del tuo post e incollalo qui. Compiliamo l'annuncio per te e tu controlli i campi prima della pubblicazione.", privacy: "Non scarichiamo nulla da Facebook. Usiamo solo ciò che incolli.", l_url: "Link al post (facoltativo)", url_help: "Tocca ··· o «Condividi» e scegli «Copia link».", l_text: "Testo del post *", text_help: "Seleziona tutto il testo (tocca prima «Altro»), copia e incolla.", l_imgs: "Foto del post", imgs_help: "Salva le foto sul telefono o computer e selezionale qui (fino a 6).", own: "Sono il venditore o ho il suo permesso di pubblicare l'annuncio qui", btn: "Compila l'annuncio", err_url: "Il link deve portare a un post di Facebook.", err_text: "Incolla il testo del post.", err_own: "Conferma di essere il venditore o di avere il permesso.", done: "Abbiamo compilato {n} campi dal tuo annuncio Facebook. Controlla i campi gialli e completa il resto.", none: "Prezzo o città non riconosciuti. Il testo è stato inserito come descrizione. Completa il resto.", hint: "Hai già un annuncio su Facebook?", source: "Vedi il post originale su Facebook", preview: "Cosa abbiamo trovato", f_title: "Titolo", f_price: "Prezzo", f_city: "Città", f_year: "Anno", f_brand: "Marca", f_cat: "Categoria", f_cond: "Condizione", f_contact: "Contatto", f_new: "Prezzo da nuovo" },
    pl: { open: "Importuj z Facebooka", h: "Importuj ogłoszenie z Facebooka", sub: "Skopiuj tekst swojego posta i wklej go tutaj. Wypełnimy ogłoszenie za Ciebie, a Ty sprawdzisz pola przed publikacją.", privacy: "Niczego nie pobieramy z Facebooka. Używamy tylko tego, co wkleisz.", l_url: "Link do posta (opcjonalnie)", url_help: "Stuknij ··· lub „Udostępnij” i wybierz „Kopiuj link”.", l_text: "Tekst posta *", text_help: "Zaznacz cały tekst (najpierw „Wyświetl więcej”), skopiuj i wklej.", l_imgs: "Zdjęcia z posta", imgs_help: "Zapisz zdjęcia na telefonie lub komputerze i wybierz je tutaj (do 6).", own: "Jestem sprzedawcą lub mam jego zgodę na dodanie ogłoszenia", btn: "Wypełnij ogłoszenie", err_url: "Link musi prowadzić do posta na Facebooku.", err_text: "Wklej tekst posta.", err_own: "Potwierdź, że jesteś sprzedawcą lub masz zgodę.", done: "Wypełniliśmy {n} pól z ogłoszenia na Facebooku. Sprawdź żółte pola i uzupełnij resztę.", none: "Nie rozpoznano ceny ani miejscowości. Tekst dodano jako opis. Uzupełnij resztę.", hint: "Masz już ogłoszenie na Facebooku?", source: "Zobacz oryginalny post na Facebooku", preview: "Znaleźliśmy", f_title: "Tytuł", f_price: "Cena", f_city: "Miejscowość", f_year: "Rok", f_brand: "Producent", f_cat: "Kategoria", f_cond: "Stan", f_contact: "Kontakt", f_new: "Cena nowego" }
  };

  /* ---------- Genkendelse af tekst ---------- */
  const BRANDS = ["AirTrack Factory", "Eurotramp", "Gymnova", "Spieth", "Janssen-Fritsen", "Janssen Fritsen", "Continental Sports", "Reuther", "Bänfer", "Kübler", "Benz", "AAI", "Tumbl Trak", "Gymo", "Sport-Thieme", "Akrobat", "Berg", "Acromat", "Senoh"];
  const CATS = [
    ["airtrack", /air\s?track|air\s?floor|airfloor|air\s?roll|airrol|luft(bane|måtte)|tumbl\s?trak/i],
    ["reservedele", /fjedre|fjeder|springs?\b|reservedel|ersatzteil|reservdel|spare part|fjær|jousi|ressort|molle|sprężyn/i],
    ["teamgym", /team\s?gym/i],
    ["skum", /skum(klods|grav|terning|blok)|springgrav|foam|schaumstoff|skumgrop|skumgrav|grop\b|pit\b|grube|kuil|fosse|vaahto/i],
    ["rg", /rytmisk|rhythmic|rhythmische|\brg\b|køller|ribbon|keulen|hula/i],
    ["ag", /\bbarre|\bbom\b|\breck\b|\bringe\b|\bbeam\b|balken|\bbars\b|\bbarr\b|\brings?\b|parallel|poutre|trave|poręcz/i],
    ["trampolin", /trampolin|trampoline|trampoliini|minitramp/i],
    ["spring", /springbane|springbord|springhest|pegasus|plint|buk\b|bukk|sprungtisch|vault|tumblingbane|tumbling|hoppbord/i],
    ["maatter", /måtte|matte|matter|madras|\bmats?\b|landingsm|rullemåtte|matta|mattor|patja|materac|tapis|colchon|materass/i]
  ];
  const COND = [
    ["like_new", /som ny|næsten ny|like new|wie neu|som nytt?|kuin uusi|zo goed als nieuw|comme neuf|como nuevo|come nuovo|jak nowy|næsten ubrugt/i],
    ["new", /helt ny|\bubrugt|uåbnet|aldrig brugt|brand new|unused|unbenutzt|oanvänd|ubrukt|käyttämätön|ongebruikt|jamais utilisé|sin usar|mai usato|nieużywan|\bny\b|\bnew\b|\bneu\b|\buusi\b|\bnowy\b/i],
    ["fair", /slidt|brugbar|trænger|slitage|defekt|skader|worn|wear|abgenutzt|sliten|slitet|kulunut|versleten|usé|desgastado|usurat|zużyt|brugsspor/i]
  ];
  const TRANSPORT = /kan (evt\.?\s*|eventuelt\s*|godt\s*)?leveres|leveres mod|kan bringes|levering|kan levere|leverer gerne|kan køre|fragt mulig|delivery|can deliver|lieferung möglich|kann liefern|kan levereras|leverans|frakt|toimitus|bezorgen|livraison|envío|consegna|dostaw/i;
  const NEWPRICE = /(?:nypris|ny pris|nyvärde|ny-pris|neupreis|new price|np|uushinta|nieuwprijs|prix neuf|precio nuevo|prezzo nuovo|cena nowego)\s*(?:var|was|war|:|ca\.?|approx\.?|omkring)?\s*:?\s*(?:ca\.?\s*)?(?:kr\.?|dkk|sek|nok|€|eur)?\s*([\d][\d .,]*\d|\d)/i;
  const FREE = /gives væk|bortgives|gratis|gives bort|free to|zu verschenken|ges bort|gis bort|ilmaiseksi|gratis af te halen|à donner|se regala|regalo|oddam/i;
  const NOISE = /^(se mere|see more|mehr ansehen|visa mer|se mer|näytä lisää|meer weergeven|voir plus|ver más|altro|wyświetl więcej|synes godt om|like|kommentér|kommentar|comment|del|share|svar|reply|send besked|message|skriv en kommentar.*|write a comment.*|til salg|for sale|sælges|säljes|selges|zu verkaufen|myydään|te koop|à vendre|se vende|vendo|sprzedam)$/i;
  const TS = /^(?:\d{1,2}\s*(?:t|d|u|m|h|w|min|mins|timer?|time|dage?|dagar|uger?|std|hrs?|tim|tage?|godz|uur)\b\.?|i går|i dag|yesterday|gestern|igår|\d{1,2}\.?\s+[a-zæøåäö]{3,}\.?(?:\s+\d{4})?(?:\s+(?:kl\.?|at|um)\s+[\d.:]+)?)\s*(?:·.*)?$/i;
  const SELLW = /^(sælges|til salg|for sale|säljes|selges|verkaufe|zu verkaufen|myydään|te koop|à vendre|se vende|vendo|sprzedam|bortgives|gives væk|ges bort|gis bort|zu verschenken)\b/i;

  const toNum = s => {
    s = String(s).replace(/[\s\u00a0]/g, "").replace(/,-$/, "").replace(/\.-$/, "");
    const m = s.match(/^(\d{1,3}(?:[.,]\d{3})+|\d+)(?:[.,](\d{1,2}))?$/);
    return m ? Number(m[1].replace(/[.,]/g, "")) : NaN;
  };
  const curOf = (tok, fallback) => {
    tok = (tok || "").toLowerCase();
    if (/€|eur/.test(tok)) return "EUR";
    if (/sek/.test(tok)) return "SEK"; if (/nok/.test(tok)) return "NOK"; if (/dkk/.test(tok)) return "DKK";
    if (/zł|zl|pln/.test(tok)) return "PLN"; if (/chf/.test(tok)) return "CHF"; if (/£|gbp/.test(tok)) return "GBP";
    return fallback;
  };

  function parse(text, kroneCur) {
    const out = {};
    let raw = text.replace(/\r/g, "").split("\n").map(s => s.replace(/\s+/g, " ").trim()).filter(Boolean);
    for (let i = 0; i < Math.min(raw.length - 1, 4); i++) {
      if ((TS.test(raw[i + 1]) || /^·|·$/.test(raw[i + 1])) && raw[i].length <= 50 && !/\d/.test(raw[i])) { raw.splice(i, 2); break; }
    }
    const lines = raw.filter(s => !NOISE.test(s) && !TS.test(s) && s !== "·");
    const body = lines.join("\n");
    const strip = s => s.replace(/^(bortgives|gives væk|ges bort|gis bort|zu verschenken|sælges|til salg|for sale|säljes|selges|verkaufe|zu verkaufen|myydään|te koop|à vendre|se vende|vendo|sprzedam)\s*[:\-–!]*\s*/i, "").trim();
    const priceOnly = /^(pris|price|preis|hinta|prijs|prix|precio|prezzo|cena)?\s*:?\s*(kr\.?|dkk|sek|nok|€|eur)?\s*[\d .,]+\s*(kr\.?|,-|dkk|sek|nok|€|eur)?$/i;
    const pref = lines.find(x => SELLW.test(x) && strip(x).length >= 3);
    const tl = pref ? strip(pref) : lines.map(strip).find(s => s.length >= 3 && !priceOnly.test(s));
    if (tl) {
      let tt = tl.length > 80 ? tl.slice(0, 80).replace(/\s+\S*$/, "") : tl;
      tt = tt.replace(/[.,:;\-–]+$/, "").trim(); out.title = tt.charAt(0).toUpperCase() + tt.slice(1);
    }
    const np = body.match(NEWPRICE);
    if (np) { const v = toNum(np[1]); if (v > 0) out.new_price = v; }
    const npIdx = np ? [np.index, np.index + np[0].length] : [-1, -1];
    const pats = [
      /(?<!ny\s?|neu|new\s|prix\s|uus)(?:\bpris|\bprice|\bpreis|\bhinta|\bprijs|\bprix|\bprecio|\bprezzo|\bcena)\s*(?:kun|only|nur|bara|endast|vain|ca\.?)?\s*:?\s*(kr\.?|dkk|sek|nok|€|eur|zł|pln|chf|£)?\s*([\d][\d .,]*\d|\d)\s*(kr\.?|,-|\.-|dkk|sek|nok|€|eur|euro|zł|pln|chf)?/gi,
      /(kr\.?|dkk|sek|nok|€|eur|zł|pln|chf|£)\s*([\d][\d .,]*\d|\d)()/gi,
      /()([\d][\d .,]*\d|\d)\s*(kr\.?(?![a-zæøå])|,-|\.-|dkk|sek|nok|€|euro?\b|zł|pln|chf)/gi
    ];
    for (const re of pats) {
      let m;
      while ((m = re.exec(body))) {
        if (m.index >= npIdx[0] && m.index < npIdx[1]) continue;
        const before = body.slice(Math.max(0, m.index - 14), m.index).toLowerCase();
        if (/ny\s?pris|nypris|neupreis|new price|np\s*:?\s*$|nyvärde|uushinta|nieuwprijs|prix neuf|precio nuevo|prezzo nuovo|cena nowego/.test(before)) continue;
        const v = toNum(m[2]);
        if (isNaN(v) || v < 0) continue;
        out.price = v; out.currency = curOf((m[1] || "") + (m[3] || ""), kroneCur); break;
      }
      if (out.price != null) break;
    }
    if (out.price == null && FREE.test(body)) out.price = 0;
    const ym = body.match(/(?:årgang|fra|købt|model|år|year|baujahr|bj\.?|årsmodell|köpt|kjøpt|vuosimalli|bouwjaar|année|año|anno|rok)\s*:?\s*(?:i|in)?\s*(19[89]\d|20[0-3]\d)\b/i)
      || body.match(/\b(19[89]\d|20[0-3]\d)\b(?!\s*(kr|,-|€|dkk|sek|nok|eur|zł|\d))/i);
    if (ym) { const y = Number(ym[1]); if (y <= new Date().getFullYear() + 1 && y !== out.price) out.year = y; }
    const b = BRANDS.find(x => new RegExp("\\b" + x.replace(/[-\s]/g, "[-\\s]?") + "\\b", "i").test(body));
    if (b) out.brand = b.replace("Janssen Fritsen", "Janssen-Fritsen");
    const c = CATS.find(([, re]) => re.test(out.title || "")) || CATS.find(([, re]) => re.test(body)); if (c) out.category = c[0];
    const cd = COND.find(([, re]) => re.test(body)); if (cd) out.condition = cd[0];
    if (TRANSPORT.test(body)) out.transport = true;
    const pc = body.match(/\b(\d{4,5}|\d{3}\s\d{2}|\d{2}-\d{3})\s+([A-ZÆØÅÄÖÜ][a-zæøåäöüéA-ZÆØÅÄÖÜ.\-]+(?:\s[A-ZÆØÅÄÖÜ][a-zæøåäöüé.\-]*|\s[CNSVØ]\b)?)/);
    const kw = body.match(/(?:afhentes|afhentning|hentes|kan hentes|placering|lokation|beliggende|står|befinder sig|ligger|hämtas|finns i|abholung|standort|location|pickup|pick up|located|noudetaan|sijainti|ophalen|op te halen|à récupérer|recoger|ritiro|odbiór)\s*(?:i|in|på|en|à|a|w|:)?\s*:?\s*([A-ZÆØÅÄÖÜ][a-zæøåäöüé\-]+(?:\s[A-ZÆØÅÄÖÜ][a-zæøåäöüé\-]+)?)/i);
    if (pc && !(pc[1].length === 4 && /^(19|20)\d\d$/.test(pc[1]) && Number(pc[1]) >= 1980 && Number(pc[1]) <= 2035)) { out.postcode = pc[1]; out.city = pc[2].trim(); }
    else if (kw) out.city = kw[1].trim();
    const em = body.match(/[^\s@<>()]+@[^\s@<>()]+\.[a-z]{2,}/i); if (em) out.email = em[0];
    const ph = body.match(/(?:tlf\.?|tel\.?|telefon|mobil|ring|sms|phone|call|puh\.?|tél\.?)\s*(?:på|:|nr\.?)?\s*:?\s*(\+?\d[\d \-]{6,15}\d)/i) || body.match(/(\+\d{2}[\s\-]?\d[\d \-]{6,13}\d)/);
    if (ph) out.phone = ph[1].replace(/\s+/g, " ").trim();
    out.description = body.slice(0, 3000);
    return out;
  }

  function cleanUrl(u) {
    u = (u || "").trim(); if (!u) return "";
    if (!/^https?:\/\//i.test(u)) u = "https://" + u;
    let x; try { x = new URL(u); } catch (e) { return null; }
    if (!/(^|\.)(facebook\.com|fb\.com|fb\.me|fb\.watch)$/i.test(x.hostname)) return null;
    const keep = /permalink\.php|story\.php|photo\.php/i.test(x.pathname);
    return "https://" + x.hostname.replace(/^(m|web|mbasic)\./, "www.") + x.pathname.replace(/\/+$/, "/") + (keep ? x.search.replace(/&?(__cft__|__tn__|mibextid|rdid|ref|sfnsn)[^&]*/g, "") : "");
  }
  const isFbUrl = u => typeof u === "string" && /^https:\/\/([a-z0-9-]+\.)*(facebook\.com|fb\.com|fb\.me|fb\.watch)\//i.test(u);

  /* ---------- UI ---------- */
  function boot() {
    const lang = GMT.lang(), L = Object.assign({}, TX.en, TX[lang] || {});
    const f = (k, v) => L[k].replace(/\{(\w+)\}/g, (m, n) => v && v[n] != null ? v[n] : m);
    const $ = s => document.querySelector(s), esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    const C = window.GM_CONFIG, S = window.GMStore;
    let pendingSource = null, importing = false, importFiles = [];

    const modal = document.createElement("div");
    modal.className = "modal"; modal.id = "mImport"; modal.setAttribute("role", "dialog"); modal.setAttribute("aria-modal", "true"); modal.setAttribute("aria-labelledby", "fbiH");
    modal.innerHTML = `<div class="mbox"><button class="mclose" type="button" data-close aria-label="×">×</button><div class="mcontent">
      <h2 id="fbiH">${esc(L.h)}</h2><p class="sub" style="margin:6px 0 14px">${esc(L.sub)}</p>
      <div class="fbi-priv">🔒 ${esc(L.privacy)}</div>
      <form id="fbiForm" class="form-grid" novalidate>
        <div class="full"><label class="l" for="fbiUrl">${esc(L.l_url)}</label><input id="fbiUrl" type="url" inputmode="url" maxlength="500" placeholder="https://www.facebook.com/groups/…"><div class="fbi-help">${esc(L.url_help)}</div></div>
        <div class="full"><label class="l" for="fbiText">${esc(L.l_text)}</label><textarea id="fbiText" required minlength="10" maxlength="6000" style="min-height:170px"></textarea><div class="fbi-help">${esc(L.text_help)}</div>
          <div class="fbi-found" id="fbiFound" aria-live="polite" hidden></div></div>
        <div class="full"><label class="l" for="fbiImgs">${esc(L.l_imgs)}</label><input id="fbiImgs" type="file" accept="image/*" multiple><div class="fbi-help">${esc(L.imgs_help)}</div><div class="previews" id="fbiPrev"></div></div>
        <div class="full"><label class="chk"><input type="checkbox" id="fbiOwn"> <span>${esc(L.own)}</span></label></div>
        <div class="full form-err" id="fbiErr" aria-live="assertive"></div>
        <div class="full"><button class="btn btn-primary" type="submit" style="width:100%">${esc(L.btn)} →</button></div>
      </form></div></div>`;
    document.body.appendChild(modal);

    const fbBox = $(".fb");
    if (fbBox) {
      const old = fbBox.querySelector(":scope > .btn");
      const wrap = document.createElement("div"); wrap.className = "fb-btns";
      wrap.innerHTML = `<button class="btn" type="button" data-open="mImport">📥 ${esc(L.open)}</button>`;
      if (old) { old.classList.add("alt"); old.replaceWith(wrap); wrap.appendChild(old); } else fbBox.appendChild(wrap);
    }
    const hint = document.createElement("div"); hint.className = "fbi-hint"; hint.id = "fbiHint";
    hint.innerHTML = `<span>${esc(L.hint)}</span> <button type="button" class="link" data-open="mImport">${esc(L.open)}</button>`;
    const banner = document.createElement("div"); banner.className = "fbi-banner"; banner.id = "fbiBanner"; banner.hidden = true;
    const sf = $("#sellForm"); sf.parentNode.insertBefore(hint, sf); sf.parentNode.insertBefore(banner, sf);
    const footSell = document.querySelector('footer [data-open="mSell"]');
    if (footSell) { const b2 = document.createElement("button"); b2.className = "flink"; b2.type = "button"; b2.dataset.open = "mImport"; b2.textContent = L.open; footSell.after(b2); }

    const catName = id => GMT.t("cat_" + id), condName = id => GMT.t("cond_" + id);
    const kroneCur = () => { const c = C.countries[$("#sCountry").value]; return c && /DKK|SEK|NOK|ISK/.test(c) ? c : ({ sv: "SEK", nb: "NOK" }[lang] || "DKK"); };
    const money = (n, cur) => { try { return new Intl.NumberFormat(GMT.locale(), { style: "currency", currency: cur, maximumFractionDigits: 0 }).format(n); } catch (e) { return n + " " + cur; } };
    $("#fbiText").addEventListener("input", () => {
      const v = $("#fbiText").value.trim(), box = $("#fbiFound");
      if (v.length < 10) { box.hidden = true; return; }
      const p = parse(v, kroneCur()), chips = [];
      if (p.title) chips.push(L.f_title + ": " + p.title);
      if (p.price != null) chips.push(L.f_price + ": " + money(p.price, p.currency || kroneCur()));
      if (p.new_price) chips.push(L.f_new + ": " + money(p.new_price, p.currency || kroneCur()));
      if (p.city) chips.push(L.f_city + ": " + (p.postcode ? p.postcode + " " : "") + p.city);
      if (p.year) chips.push(L.f_year + ": " + p.year);
      if (p.brand) chips.push(L.f_brand + ": " + p.brand);
      if (p.category) chips.push(L.f_cat + ": " + catName(p.category));
      if (p.condition) chips.push(L.f_cond + ": " + condName(p.condition));
      if (p.phone || p.email) chips.push(L.f_contact + ": " + [p.phone, p.email].filter(Boolean).join(" · "));
      box.innerHTML = `<b>${esc(L.preview)}</b>` + chips.map(c => `<span>${esc(c)}</span>`).join("");
      box.hidden = !chips.length;
    });
    $("#fbiImgs").addEventListener("change", e => {
      importFiles = Array.from(e.target.files || []).filter(x => x.type.indexOf("image/") === 0).slice(0, 6);
      $("#fbiPrev").innerHTML = ""; importFiles.forEach(file => { const i = document.createElement("img"); i.src = URL.createObjectURL(file); i.alt = ""; $("#fbiPrev").appendChild(i); });
    });

    function setVal(sel, v, evt) {
      if (v == null || v === "") return 0;
      const el = $(sel); if (!el) return 0;
      if (el.tagName === "SELECT" && !Array.from(el.options).some(o => o.value === String(v))) return 0;
      el.value = v; el.classList.add("gm-auto"); if (evt) el.dispatchEvent(new Event(evt, { bubbles: true })); return 1;
    }
    $("#fbiForm").addEventListener("submit", e => {
      e.preventDefault();
      const err = $("#fbiErr"), url = cleanUrl($("#fbiUrl").value), text = $("#fbiText").value.trim();
      if (url === null) { err.textContent = L.err_url; $("#fbiUrl").focus(); return; }
      if (text.length < 10) { err.textContent = L.err_text; $("#fbiText").focus(); return; }
      if (!$("#fbiOwn").checked) { err.textContent = L.err_own; $("#fbiOwn").focus(); return; }
      err.textContent = "";
      const country = $("#sCountry").value, p = parse(text, kroneCur());
      sf.reset(); sf.querySelectorAll(".gm-auto").forEach(x => x.classList.remove("gm-auto"));
      if (country) $("#sCountry").value = country;
      $("#sTrader").dispatchEvent(new Event("change", { bubbles: true }));
      let n = 0;
      n += setVal("#sTitle", p.title);
      n += setVal("#sCat", p.category);
      n += setVal("#sBrand", p.brand);
      n += setVal("#sYear", p.year);
      n += setVal("#sCond", p.condition);
      if (p.currency) n += setVal("#sCurrency", p.currency, "input");
      n += setVal("#sPrice", p.price != null ? p.price : "", "input");
      n += setVal("#sNew", p.new_price);
      n += setVal("#sCity", p.city);
      n += setVal("#sPost", p.postcode);
      n += setVal("#sEmail", p.email);
      n += setVal("#sPhone", p.phone);
      setVal("#sDesc", p.description);
      if (p.transport) { $("#sTransport").checked = true; n++; }
      try { const dt = new DataTransfer(); importFiles.forEach(x => dt.items.add(x)); $("#sImgs").files = dt.files; } catch (x) { }
      $("#sImgs").dispatchEvent(new Event("change", { bubbles: true }));
      pendingSource = url || "";
      banner.textContent = (p.price == null && !p.city) ? L.none : f("done", { n });
      banner.hidden = false; hint.hidden = true;
      importing = true; GMApp.openModal("mSell"); $("#sPrice").dispatchEvent(new Event("input", { bubbles: true })); importing = false;
      const empty = ["#sTitle", "#sPrice", "#sCity", "#sName", "#sEmail"].map(s => $(s)).find(x => x && !x.value);
      setTimeout(() => (empty || $("#sTitle")).focus(), 50);
    });
    sf.addEventListener("input", e => e.target.classList && e.target.classList.remove("gm-auto"));

    document.addEventListener("click", e => {
      if (!importing && e.target.closest('[data-open="mSell"]')) {
        pendingSource = null; banner.hidden = true; hint.hidden = false;
        sf.querySelectorAll(".gm-auto").forEach(x => x.classList.remove("gm-auto"));
      }
    }, true);

    if (S) {
      const origCreate = S.createListing.bind(S);
      S.createListing = async data => {
        const r = await origCreate(Object.assign({}, data, pendingSource ? { source_url: pendingSource } : {}));
        pendingSource = null; banner.hidden = true; hint.hidden = false;
        $("#fbiForm").reset(); $("#fbiPrev").innerHTML = ""; $("#fbiFound").hidden = true; importFiles = [];
        return r;
      };
    }

    document.addEventListener("gm:detail", ev => {
      const l = ev.detail, det = $("#detail"), actions = det && det.querySelector(".detail-actions");
      if (!l || !isFbUrl(l.source_url) || !actions || det.querySelector(".fbi-src")) return;
      const a = document.createElement("a"); a.className = "fbi-src"; a.href = l.source_url; a.target = "_blank"; a.rel = "noopener noreferrer nofollow";
      a.textContent = "↗ " + L.source;
      actions.after(a);
    });

    if (location.hash === "#import") GMApp.openModal("mImport");
  }
  if (window.GMApp && document.getElementById("cats").children.length && document.getElementById("resultCount").textContent) boot();
  else document.addEventListener("gm:ready", boot, { once: true });
})();
