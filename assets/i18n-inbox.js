/* Tekster til indbakke, profilbillede og e-mailkode (lægges oven på sprogfilerne) */
(function () {
  const X = {
    da: {
      inbox: "Indbakke", inbox_sub: "Henvendelser på dine annoncer og efterlysninger", inbox_empty: "Du har ingen beskeder endnu. Når nogen skriver til dig, dukker det op her.", inbox_back: "Tilbage",
      msg_send: "Send besked", msg_h: "Besked til {name}", msg_about: "Vedrørende: {t}", msg_ph: "Skriv din besked …", msg_hint: "Beskeden lander i modtagerens indbakke på GymMarket. Din e-mail bliver ikke vist.", msg_btn: "Send",
      msg_sent: "Beskeden er sendt.", msg_err_empty: "Skriv en besked først.", msg_err_self: "Du kan ikke skrive til dig selv.", msg_err_rate: "Du har sendt for mange beskeder. Prøv igen om lidt.", msg_own: "Det er din egen annonce.",
      reply_ph: "Skriv et svar …", reply_btn: "Svar", you_prefix: "Dig", thread_open: "Se annoncen",
      avatar_h: "Profilbillede", avatar_add: "Tilføj billede", avatar_change: "Skift billede", avatar_remove: "Fjern", avatar_hint: "JPG, PNG eller WebP. Billedet beskæres til en firkant.",
      avatar_saved: "Profilbilledet er gemt.", avatar_removed: "Profilbilledet er fjernet.", avatar_err: "Kunne ikke gemme billedet. Prøv et andet.",
      verify_spam: "Kan du ikke finde mailen? Tjek spam-mappen, eller tryk på \"Send igen\".", resend_in: "Send igen om {s} sek.", err_rate_email: "Der er sendt for mange mails. Vent et øjeblik, og prøv igen.",
      contact_note: "Dit navn og din telefon (hvis du angiver den) vises på dine annoncer. Din e-mail vises ikke – købere skriver til dig via din indbakke.",
      empty_first: "Der er ingen annoncer endnu. Bliv den første til at sælge et redskab.",
      privacy_html: "<h3>Dataansvarlig</h3><p>{co_name}, CVR {co_cvr}, {co_address}. E-mail: {co_email}.</p><h3>Hvilke oplysninger?</h3><p>Brugerkonto: navn, e-mail, adgangskode (krypteret), brugertype, organisationsnavn, land, evt. telefon og evt. profilbillede. Ved verificering også land, nummertype og registreringsnummer, og for EU-momsnumre resultatet af opslag i EU's VIES-register. For erhvervsdrivende virksomhedsnavn, adresse og registreringsnummer. Desuden annoncernes indhold og billeder samt beskeder, som brugere sender til hinanden via indbakken.</p><h3>Formål og grundlag</h3><p>At levere din bruger, vise dine annoncer og formidle beskeder mellem brugere (GDPR art. 6, stk. 1, litra b) og at overholde EU-regler om markedspladser (litra c). Dit navn, evt. telefon og profilbillede vises på dine annoncer. Din e-mail vises ikke for andre brugere. Når du bekræfter din e-mail, sender vi en mail med en engangskode.</p><h3>Opbevaring</h3><p>Annoncer slettes 12 måneder efter, at de er udløbet eller solgt. Beskeder slettes, når en af brugerne slettes. Din bruger og dine data slettes, når du beder om det.</p><h3>Databehandlere</h3><p>Data opbevares hos hostingudbyder og database i EU. Mails med bekræftelseskode sendes via vores e-mailudbyder.</p><h3>Cookies</h3><p>Ingen sporingscookies. Browserens lokale lager bruges til sprogvalg og til at holde dig logget ind.</p><h3>Dine rettigheder</h3><p>Du har ret til indsigt, berigtigelse, sletning og dataportabilitet. Skriv til {co_email}. Du kan klage til Datatilsynet eller tilsynsmyndigheden i dit land.</p>"
    },
    en: {
      inbox: "Inbox", inbox_sub: "Enquiries about your listings and wanted ads", inbox_empty: "You have no messages yet. When someone writes to you, it will show up here.", inbox_back: "Back",
      msg_send: "Send message", msg_h: "Message to {name}", msg_about: "Regarding: {t}", msg_ph: "Write your message …", msg_hint: "The message goes to the recipient's inbox on GymMarket. Your email address is not shown.", msg_btn: "Send",
      msg_sent: "Your message has been sent.", msg_err_empty: "Write a message first.", msg_err_self: "You cannot message yourself.", msg_err_rate: "You have sent too many messages. Please try again later.", msg_own: "This is your own listing.",
      reply_ph: "Write a reply …", reply_btn: "Reply", you_prefix: "You", thread_open: "View listing",
      avatar_h: "Profile picture", avatar_add: "Add picture", avatar_change: "Change picture", avatar_remove: "Remove", avatar_hint: "JPG, PNG or WebP. The picture is cropped to a square.",
      avatar_saved: "Profile picture saved.", avatar_removed: "Profile picture removed.", avatar_err: "Could not save the picture. Try another one.",
      verify_spam: "Can't find the email? Check your spam folder, or press \"Resend\".", resend_in: "Resend in {s} s", err_rate_email: "Too many emails have been sent. Wait a moment and try again.",
      contact_note: "Your name and phone (if you provide one) are shown on your listings. Your email is not shown – buyers write to you via your inbox.",
      empty_first: "There are no listings yet. Be the first to sell equipment.",
      privacy_html: "<h3>Controller</h3><p>{co_name}, Danish CVR {co_cvr}, {co_address}. Email: {co_email}.</p><h3>What data?</h3><p>Account: name, email, password (encrypted), user type, organisation name, country, optional phone and optional profile picture. For verification also country, number type and registration number, and for EU VAT numbers the result of a lookup in the EU's VIES register. For traders company name, address and registration number. Also the content and photos of your listings and the messages users send each other via the inbox.</p><h3>Purpose and legal basis</h3><p>To provide your account, display your listings and pass on messages between users (GDPR Art. 6(1)(b)) and to comply with EU marketplace rules (Art. 6(1)(c)). Your name, optional phone and profile picture are shown on your listings. Your email is not shown to other users. When you confirm your email, we send an email with a one-time code.</p><h3>Retention</h3><p>Listings are deleted 12 months after expiry or sale. Messages are deleted when one of the users is deleted. Your account and data are deleted on request.</p><h3>Processors</h3><p>Data is stored with a hosting provider and database in the EU. Emails with confirmation codes are sent via our email provider.</p><h3>Cookies</h3><p>No tracking cookies. The browser's local storage is used for your language and to keep you logged in.</p><h3>Your rights</h3><p>You have the right of access, rectification, erasure and data portability. Write to {co_email}. You may complain to your national data protection authority.</p>"
    },
    de: {
      inbox: "Posteingang", inbox_sub: "Anfragen zu Ihren Anzeigen und Suchanzeigen", inbox_empty: "Sie haben noch keine Nachrichten. Wenn Ihnen jemand schreibt, erscheint es hier.", inbox_back: "Zurück",
      msg_send: "Nachricht senden", msg_h: "Nachricht an {name}", msg_about: "Betrifft: {t}", msg_ph: "Schreiben Sie Ihre Nachricht …", msg_hint: "Die Nachricht landet im Posteingang des Empfängers auf GymMarket. Ihre E-Mail-Adresse wird nicht angezeigt.", msg_btn: "Senden",
      msg_sent: "Die Nachricht wurde gesendet.", msg_err_empty: "Schreiben Sie zuerst eine Nachricht.", msg_err_self: "Sie können sich nicht selbst schreiben.", msg_err_rate: "Sie haben zu viele Nachrichten gesendet. Bitte versuchen Sie es später erneut.", msg_own: "Das ist Ihre eigene Anzeige.",
      reply_ph: "Antwort schreiben …", reply_btn: "Antworten", you_prefix: "Sie", thread_open: "Anzeige ansehen",
      avatar_h: "Profilbild", avatar_add: "Bild hinzufügen", avatar_change: "Bild ändern", avatar_remove: "Entfernen", avatar_hint: "JPG, PNG oder WebP. Das Bild wird quadratisch zugeschnitten.",
      avatar_saved: "Profilbild gespeichert.", avatar_removed: "Profilbild entfernt.", avatar_err: "Das Bild konnte nicht gespeichert werden. Versuchen Sie ein anderes.",
      verify_spam: "E-Mail nicht gefunden? Prüfen Sie den Spam-Ordner oder klicken Sie auf „Erneut senden“.", resend_in: "Erneut senden in {s} s", err_rate_email: "Es wurden zu viele E-Mails gesendet. Warten Sie kurz und versuchen Sie es erneut.",
      contact_note: "Ihr Name und Ihre Telefonnummer (falls angegeben) werden in Ihren Anzeigen angezeigt. Ihre E-Mail-Adresse wird nicht angezeigt – Käufer schreiben Ihnen über Ihren Posteingang.",
      empty_first: "Es gibt noch keine Anzeigen. Seien Sie der Erste, der ein Gerät verkauft."
    },
    sv: {
      inbox: "Inkorg", inbox_sub: "Förfrågningar om dina annonser och efterlysningar", inbox_empty: "Du har inga meddelanden än. När någon skriver till dig visas det här.", inbox_back: "Tillbaka",
      msg_send: "Skicka meddelande", msg_h: "Meddelande till {name}", msg_about: "Gäller: {t}", msg_ph: "Skriv ditt meddelande …", msg_hint: "Meddelandet hamnar i mottagarens inkorg på GymMarket. Din e-postadress visas inte.", msg_btn: "Skicka",
      msg_sent: "Meddelandet har skickats.", msg_err_empty: "Skriv ett meddelande först.", msg_err_self: "Du kan inte skriva till dig själv.", msg_err_rate: "Du har skickat för många meddelanden. Försök igen senare.", msg_own: "Det här är din egen annons.",
      reply_ph: "Skriv ett svar …", reply_btn: "Svara", you_prefix: "Du", thread_open: "Visa annonsen",
      avatar_h: "Profilbild", avatar_add: "Lägg till bild", avatar_change: "Byt bild", avatar_remove: "Ta bort", avatar_hint: "JPG, PNG eller WebP. Bilden beskärs till en kvadrat.",
      avatar_saved: "Profilbilden är sparad.", avatar_removed: "Profilbilden är borttagen.", avatar_err: "Kunde inte spara bilden. Prova en annan.",
      verify_spam: "Hittar du inte mejlet? Kolla skräpposten eller tryck på \"Skicka igen\".", resend_in: "Skicka igen om {s} s", err_rate_email: "För många mejl har skickats. Vänta en stund och försök igen.",
      contact_note: "Ditt namn och din telefon (om du anger den) visas i dina annonser. Din e-post visas inte – köpare skriver till dig via din inkorg.",
      empty_first: "Det finns inga annonser än. Bli först med att sälja ett redskap."
    },
    nb: {
      inbox: "Innboks", inbox_sub: "Henvendelser om annonsene og etterlysningene dine", inbox_empty: "Du har ingen meldinger ennå. Når noen skriver til deg, dukker det opp her.", inbox_back: "Tilbake",
      msg_send: "Send melding", msg_h: "Melding til {name}", msg_about: "Gjelder: {t}", msg_ph: "Skriv meldingen din …", msg_hint: "Meldingen havner i mottakerens innboks på GymMarket. E-postadressen din vises ikke.", msg_btn: "Send",
      msg_sent: "Meldingen er sendt.", msg_err_empty: "Skriv en melding først.", msg_err_self: "Du kan ikke skrive til deg selv.", msg_err_rate: "Du har sendt for mange meldinger. Prøv igjen senere.", msg_own: "Dette er din egen annonse.",
      reply_ph: "Skriv et svar …", reply_btn: "Svar", you_prefix: "Deg", thread_open: "Se annonsen",
      avatar_h: "Profilbilde", avatar_add: "Legg til bilde", avatar_change: "Bytt bilde", avatar_remove: "Fjern", avatar_hint: "JPG, PNG eller WebP. Bildet beskjæres til en firkant.",
      avatar_saved: "Profilbildet er lagret.", avatar_removed: "Profilbildet er fjernet.", avatar_err: "Kunne ikke lagre bildet. Prøv et annet.",
      verify_spam: "Finner du ikke e-posten? Sjekk søppelpost, eller trykk \"Send igjen\".", resend_in: "Send igjen om {s} s", err_rate_email: "For mange e-poster er sendt. Vent litt og prøv igjen.",
      contact_note: "Navnet ditt og telefonnummeret ditt (hvis du oppgir det) vises i annonsene dine. E-postadressen din vises ikke – kjøpere skriver til deg via innboksen din.",
      empty_first: "Det finnes ingen annonser ennå. Bli den første til å selge utstyr."
    },
    fi: {
      inbox: "Postilaatikko", inbox_sub: "Yhteydenotot ilmoituksiisi ja ostetaan-ilmoituksiisi", inbox_empty: "Sinulla ei ole vielä viestejä. Kun joku kirjoittaa sinulle, viesti näkyy tässä.", inbox_back: "Takaisin",
      msg_send: "Lähetä viesti", msg_h: "Viesti käyttäjälle {name}", msg_about: "Koskee: {t}", msg_ph: "Kirjoita viestisi …", msg_hint: "Viesti menee vastaanottajan postilaatikkoon GymMarketissa. Sähköpostiosoitettasi ei näytetä.", msg_btn: "Lähetä",
      msg_sent: "Viesti on lähetetty.", msg_err_empty: "Kirjoita ensin viesti.", msg_err_self: "Et voi kirjoittaa itsellesi.", msg_err_rate: "Olet lähettänyt liian monta viestiä. Yritä myöhemmin uudelleen.", msg_own: "Tämä on oma ilmoituksesi.",
      reply_ph: "Kirjoita vastaus …", reply_btn: "Vastaa", you_prefix: "Sinä", thread_open: "Näytä ilmoitus",
      avatar_h: "Profiilikuva", avatar_add: "Lisää kuva", avatar_change: "Vaihda kuva", avatar_remove: "Poista", avatar_hint: "JPG, PNG tai WebP. Kuva rajataan neliöksi.",
      avatar_saved: "Profiilikuva tallennettu.", avatar_removed: "Profiilikuva poistettu.", avatar_err: "Kuvaa ei voitu tallentaa. Kokeile toista.",
      verify_spam: "Etkö löydä viestiä? Tarkista roskaposti tai paina \"Lähetä uudelleen\".", resend_in: "Lähetä uudelleen {s} s kuluttua", err_rate_email: "Liian monta sähköpostia on lähetetty. Odota hetki ja yritä uudelleen.",
      contact_note: "Nimesi ja puhelinnumerosi (jos annat sen) näytetään ilmoituksissasi. Sähköpostiosoitettasi ei näytetä – ostajat kirjoittavat sinulle postilaatikkosi kautta.",
      empty_first: "Ilmoituksia ei ole vielä. Ole ensimmäinen, joka myy välineen."
    },
    nl: {
      inbox: "Inbox", inbox_sub: "Vragen over je advertenties en zoekadvertenties", inbox_empty: "Je hebt nog geen berichten. Als iemand je schrijft, verschijnt het hier.", inbox_back: "Terug",
      msg_send: "Bericht sturen", msg_h: "Bericht aan {name}", msg_about: "Betreft: {t}", msg_ph: "Schrijf je bericht …", msg_hint: "Het bericht komt in de inbox van de ontvanger op GymMarket. Je e-mailadres wordt niet getoond.", msg_btn: "Versturen",
      msg_sent: "Het bericht is verstuurd.", msg_err_empty: "Schrijf eerst een bericht.", msg_err_self: "Je kunt jezelf geen bericht sturen.", msg_err_rate: "Je hebt te veel berichten verstuurd. Probeer het later opnieuw.", msg_own: "Dit is je eigen advertentie.",
      reply_ph: "Schrijf een antwoord …", reply_btn: "Antwoorden", you_prefix: "Jij", thread_open: "Advertentie bekijken",
      avatar_h: "Profielfoto", avatar_add: "Foto toevoegen", avatar_change: "Foto wijzigen", avatar_remove: "Verwijderen", avatar_hint: "JPG, PNG of WebP. De foto wordt vierkant bijgesneden.",
      avatar_saved: "Profielfoto opgeslagen.", avatar_removed: "Profielfoto verwijderd.", avatar_err: "De foto kon niet worden opgeslagen. Probeer een andere.",
      verify_spam: "Geen e-mail gevonden? Kijk in je spammap of klik op 'Opnieuw versturen'.", resend_in: "Opnieuw versturen over {s} s", err_rate_email: "Er zijn te veel e-mails verstuurd. Wacht even en probeer het opnieuw.",
      contact_note: "Je naam en telefoonnummer (als je dat invult) worden bij je advertenties getoond. Je e-mailadres wordt niet getoond – kopers schrijven je via je inbox.",
      empty_first: "Er zijn nog geen advertenties. Wees de eerste die een toestel verkoopt."
    },
    fr: {
      inbox: "Messagerie", inbox_sub: "Demandes concernant vos annonces et recherches", inbox_empty: "Vous n'avez pas encore de messages. Quand quelqu'un vous écrit, cela apparaît ici.", inbox_back: "Retour",
      msg_send: "Envoyer un message", msg_h: "Message à {name}", msg_about: "Objet : {t}", msg_ph: "Écrivez votre message …", msg_hint: "Le message arrive dans la messagerie du destinataire sur GymMarket. Votre adresse e-mail n'est pas affichée.", msg_btn: "Envoyer",
      msg_sent: "Le message a été envoyé.", msg_err_empty: "Écrivez d'abord un message.", msg_err_self: "Vous ne pouvez pas vous écrire à vous-même.", msg_err_rate: "Vous avez envoyé trop de messages. Réessayez plus tard.", msg_own: "C'est votre propre annonce.",
      reply_ph: "Écrivez une réponse …", reply_btn: "Répondre", you_prefix: "Vous", thread_open: "Voir l'annonce",
      avatar_h: "Photo de profil", avatar_add: "Ajouter une photo", avatar_change: "Changer de photo", avatar_remove: "Supprimer", avatar_hint: "JPG, PNG ou WebP. La photo est recadrée en carré.",
      avatar_saved: "Photo de profil enregistrée.", avatar_removed: "Photo de profil supprimée.", avatar_err: "Impossible d'enregistrer la photo. Essayez-en une autre.",
      verify_spam: "Vous ne trouvez pas l'e-mail ? Vérifiez vos courriers indésirables ou cliquez sur \"Renvoyer\".", resend_in: "Renvoyer dans {s} s", err_rate_email: "Trop d'e-mails ont été envoyés. Patientez un instant et réessayez.",
      contact_note: "Votre nom et votre téléphone (si vous en indiquez un) sont affichés sur vos annonces. Votre e-mail n'est pas affiché : les acheteurs vous écrivent via votre messagerie.",
      empty_first: "Il n'y a pas encore d'annonces. Soyez le premier à vendre du matériel."
    },
    es: {
      inbox: "Bandeja de entrada", inbox_sub: "Consultas sobre tus anuncios y búsquedas", inbox_empty: "Aún no tienes mensajes. Cuando alguien te escriba, aparecerá aquí.", inbox_back: "Volver",
      msg_send: "Enviar mensaje", msg_h: "Mensaje para {name}", msg_about: "Asunto: {t}", msg_ph: "Escribe tu mensaje …", msg_hint: "El mensaje llega a la bandeja de entrada del destinatario en GymMarket. Tu correo no se muestra.", msg_btn: "Enviar",
      msg_sent: "El mensaje se ha enviado.", msg_err_empty: "Escribe primero un mensaje.", msg_err_self: "No puedes escribirte a ti mismo.", msg_err_rate: "Has enviado demasiados mensajes. Inténtalo más tarde.", msg_own: "Este es tu propio anuncio.",
      reply_ph: "Escribe una respuesta …", reply_btn: "Responder", you_prefix: "Tú", thread_open: "Ver anuncio",
      avatar_h: "Foto de perfil", avatar_add: "Añadir foto", avatar_change: "Cambiar foto", avatar_remove: "Quitar", avatar_hint: "JPG, PNG o WebP. La foto se recorta en formato cuadrado.",
      avatar_saved: "Foto de perfil guardada.", avatar_removed: "Foto de perfil eliminada.", avatar_err: "No se pudo guardar la foto. Prueba con otra.",
      verify_spam: "¿No encuentras el correo? Revisa la carpeta de spam o pulsa \"Reenviar\".", resend_in: "Reenviar en {s} s", err_rate_email: "Se han enviado demasiados correos. Espera un momento e inténtalo de nuevo.",
      contact_note: "Tu nombre y tu teléfono (si lo indicas) se muestran en tus anuncios. Tu correo no se muestra: los compradores te escriben a través de tu bandeja de entrada.",
      empty_first: "Todavía no hay anuncios. Sé el primero en vender material."
    },
    it: {
      inbox: "Posta in arrivo", inbox_sub: "Richieste sui tuoi annunci e sulle tue ricerche", inbox_empty: "Non hai ancora messaggi. Quando qualcuno ti scrive, comparirà qui.", inbox_back: "Indietro",
      msg_send: "Invia messaggio", msg_h: "Messaggio a {name}", msg_about: "Oggetto: {t}", msg_ph: "Scrivi il tuo messaggio …", msg_hint: "Il messaggio arriva nella posta in arrivo del destinatario su GymMarket. Il tuo indirizzo e-mail non viene mostrato.", msg_btn: "Invia",
      msg_sent: "Il messaggio è stato inviato.", msg_err_empty: "Scrivi prima un messaggio.", msg_err_self: "Non puoi scrivere a te stesso.", msg_err_rate: "Hai inviato troppi messaggi. Riprova più tardi.", msg_own: "Questo è il tuo annuncio.",
      reply_ph: "Scrivi una risposta …", reply_btn: "Rispondi", you_prefix: "Tu", thread_open: "Vedi annuncio",
      avatar_h: "Foto profilo", avatar_add: "Aggiungi foto", avatar_change: "Cambia foto", avatar_remove: "Rimuovi", avatar_hint: "JPG, PNG o WebP. La foto viene ritagliata in formato quadrato.",
      avatar_saved: "Foto profilo salvata.", avatar_removed: "Foto profilo rimossa.", avatar_err: "Impossibile salvare la foto. Provane un'altra.",
      verify_spam: "Non trovi l'e-mail? Controlla la cartella spam o premi \"Invia di nuovo\".", resend_in: "Invia di nuovo tra {s} s", err_rate_email: "Sono state inviate troppe e-mail. Attendi un momento e riprova.",
      contact_note: "Il tuo nome e il tuo telefono (se lo indichi) sono mostrati nei tuoi annunci. La tua e-mail non viene mostrata: gli acquirenti ti scrivono tramite la tua posta in arrivo.",
      empty_first: "Non ci sono ancora annunci. Sii il primo a vendere un attrezzo."
    },
    pl: {
      inbox: "Skrzynka", inbox_sub: "Zapytania dotyczące Twoich ogłoszeń", inbox_empty: "Nie masz jeszcze wiadomości. Gdy ktoś do Ciebie napisze, pojawi się tutaj.", inbox_back: "Wstecz",
      msg_send: "Wyślij wiadomość", msg_h: "Wiadomość do: {name}", msg_about: "Dotyczy: {t}", msg_ph: "Napisz wiadomość …", msg_hint: "Wiadomość trafia do skrzynki odbiorcy w GymMarket. Twój adres e-mail nie jest wyświetlany.", msg_btn: "Wyślij",
      msg_sent: "Wiadomość została wysłana.", msg_err_empty: "Najpierw napisz wiadomość.", msg_err_self: "Nie możesz pisać do siebie.", msg_err_rate: "Wysłano zbyt wiele wiadomości. Spróbuj później.", msg_own: "To Twoje ogłoszenie.",
      reply_ph: "Napisz odpowiedź …", reply_btn: "Odpowiedz", you_prefix: "Ty", thread_open: "Zobacz ogłoszenie",
      avatar_h: "Zdjęcie profilowe", avatar_add: "Dodaj zdjęcie", avatar_change: "Zmień zdjęcie", avatar_remove: "Usuń", avatar_hint: "JPG, PNG lub WebP. Zdjęcie zostanie przycięte do kwadratu.",
      avatar_saved: "Zdjęcie profilowe zapisano.", avatar_removed: "Zdjęcie profilowe usunięto.", avatar_err: "Nie udało się zapisać zdjęcia. Spróbuj innego.",
      verify_spam: "Nie widzisz e-maila? Sprawdź folder spam lub kliknij \"Wyślij ponownie\".", resend_in: "Wyślij ponownie za {s} s", err_rate_email: "Wysłano zbyt wiele e-maili. Poczekaj chwilę i spróbuj ponownie.",
      contact_note: "Twoje imię i nazwisko oraz telefon (jeśli go podasz) są widoczne w ogłoszeniach. Twój e-mail nie jest wyświetlany – kupujący piszą do Ciebie przez skrzynkę.",
      empty_first: "Nie ma jeszcze ogłoszeń. Bądź pierwszy i sprzedaj sprzęt."
    }
  };
  const V = window.GM_I18N_VERIFY = window.GM_I18N_VERIFY || {};
  Object.keys(X).forEach(l => { V[l] = Object.assign(V[l] || {}, X[l]); });
})();
