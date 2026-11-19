/* ============================================================
   GymMarket – Opdatering 6: rediger egne annoncer og efterlysninger
   - "Rediger" på hver annonce under "Mine annoncer"
   - Ny sektion "Mine efterlysninger" med Rediger, Slet og Henvendelser
   - Henvendelser på efterlysninger går til indbakken (som annoncer)
   Indlæses EFTER app.js i index.html.
   ============================================================ */
(function () {
  "use strict";
  const C = window.GM_CONFIG, S = window.GMStore;
  const TX = {
    da: { edit: "Rediger", save: "Gem ændringer", cancel: "Annullér", del: "Slet", edit_l: "Rediger annonce", edit_w: "Rediger efterlysning", my_w: "Mine efterlysninger", my_w_sub: "Efterlysninger på din bruger. Svar fra sælgere lander i din indbakke.", my_w_none: "Du har ingen efterlysninger.", inq: "Henvendelser ({n})", saved: "Ændringerne er gemt.", w_deleted: "Efterlysningen er slettet.", confirm_w: "Vil du slette efterlysningen permanent?", imgs: "Billeder (højst 6)", add_img: "Tilføj billeder", expired: "Udløbet", active_until: "Aktiv til {d}", err: "Kunne ikke gemme. Prøv igen.", err_access: "Du har ikke adgang.", saving: "Gemmer…" },
    en: { edit: "Edit", save: "Save changes", cancel: "Cancel", del: "Delete", edit_l: "Edit listing", edit_w: "Edit wanted ad", my_w: "My wanted ads", my_w_sub: "Wanted ads on your account. Replies from sellers arrive in your inbox.", my_w_none: "You have no wanted ads.", inq: "Enquiries ({n})", saved: "Your changes have been saved.", w_deleted: "The wanted ad has been deleted.", confirm_w: "Delete this wanted ad permanently?", imgs: "Photos (max 6)", add_img: "Add photos", expired: "Expired", active_until: "Active until {d}", err: "Could not save. Please try again.", err_access: "You do not have access.", saving: "Saving…" },
    de: { edit: "Bearbeiten", save: "Änderungen speichern", cancel: "Abbrechen", del: "Löschen", edit_l: "Anzeige bearbeiten", edit_w: "Suchanzeige bearbeiten", my_w: "Meine Suchanzeigen", my_w_sub: "Suchanzeigen in Ihrem Konto. Antworten von Verkäufern landen in Ihrem Posteingang.", my_w_none: "Sie haben keine Suchanzeigen.", inq: "Anfragen ({n})", saved: "Die Änderungen wurden gespeichert.", w_deleted: "Die Suchanzeige wurde gelöscht.", confirm_w: "Suchanzeige endgültig löschen?", imgs: "Fotos (max. 6)", add_img: "Fotos hinzufügen", expired: "Abgelaufen", active_until: "Aktiv bis {d}", err: "Speichern fehlgeschlagen. Bitte erneut versuchen.", err_access: "Kein Zugriff.", saving: "Wird gespeichert…" },
    sv: { edit: "Redigera", save: "Spara ändringar", cancel: "Avbryt", del: "Radera", edit_l: "Redigera annons", edit_w: "Redigera efterlysning", my_w: "Mina efterlysningar", my_w_sub: "Efterlysningar på ditt konto. Svar från säljare hamnar i din inkorg.", my_w_none: "Du har inga efterlysningar.", inq: "Förfrågningar ({n})", saved: "Ändringarna är sparade.", w_deleted: "Efterlysningen är raderad.", confirm_w: "Vill du radera efterlysningen permanent?", imgs: "Bilder (högst 6)", add_img: "Lägg till bilder", expired: "Utgången", active_until: "Aktiv till {d}", err: "Kunde inte spara. Försök igen.", err_access: "Du har inte åtkomst.", saving: "Sparar…" },
    nb: { edit: "Rediger", save: "Lagre endringer", cancel: "Avbryt", del: "Slett", edit_l: "Rediger annonse", edit_w: "Rediger etterlysning", my_w: "Mine etterlysninger", my_w_sub: "Etterlysninger på brukeren din. Svar fra selgere havner i innboksen din.", my_w_none: "Du har ingen etterlysninger.", inq: "Henvendelser ({n})", saved: "Endringene er lagret.", w_deleted: "Etterlysningen er slettet.", confirm_w: "Vil du slette etterlysningen permanent?", imgs: "Bilder (maks 6)", add_img: "Legg til bilder", expired: "Utløpt", active_until: "Aktiv til {d}", err: "Kunne ikke lagre. Prøv igjen.", err_access: "Du har ikke tilgang.", saving: "Lagrer…" },
    fi: { edit: "Muokkaa", save: "Tallenna muutokset", cancel: "Peruuta", del: "Poista", edit_l: "Muokkaa ilmoitusta", edit_w: "Muokkaa ostetaan-ilmoitusta", my_w: "Omat ostetaan-ilmoitukset", my_w_sub: "Tilisi ostetaan-ilmoitukset. Myyjien vastaukset tulevat postilaatikkoosi.", my_w_none: "Sinulla ei ole ostetaan-ilmoituksia.", inq: "Yhteydenotot ({n})", saved: "Muutokset tallennettu.", w_deleted: "Ilmoitus on poistettu.", confirm_w: "Poistetaanko ilmoitus pysyvästi?", imgs: "Kuvat (enintään 6)", add_img: "Lisää kuvia", expired: "Vanhentunut", active_until: "Voimassa {d} asti", err: "Tallennus epäonnistui. Yritä uudelleen.", err_access: "Ei käyttöoikeutta.", saving: "Tallennetaan…" },
    nl: { edit: "Bewerken", save: "Wijzigingen opslaan", cancel: "Annuleren", del: "Verwijderen", edit_l: "Advertentie bewerken", edit_w: "Zoekadvertentie bewerken", my_w: "Mijn zoekadvertenties", my_w_sub: "Zoekadvertenties op je account. Reacties van verkopers komen in je inbox.", my_w_none: "Je hebt geen zoekadvertenties.", inq: "Reacties ({n})", saved: "De wijzigingen zijn opgeslagen.", w_deleted: "De zoekadvertentie is verwijderd.", confirm_w: "Zoekadvertentie definitief verwijderen?", imgs: "Foto's (max. 6)", add_img: "Foto's toevoegen", expired: "Verlopen", active_until: "Actief tot {d}", err: "Opslaan mislukt. Probeer opnieuw.", err_access: "Geen toegang.", saving: "Opslaan…" },
    fr: { edit: "Modifier", save: "Enregistrer", cancel: "Annuler", del: "Supprimer", edit_l: "Modifier l'annonce", edit_w: "Modifier la recherche", my_w: "Mes recherches", my_w_sub: "Recherches de votre compte. Les réponses des vendeurs arrivent dans votre messagerie.", my_w_none: "Vous n'avez aucune recherche.", inq: "Demandes ({n})", saved: "Les modifications sont enregistrées.", w_deleted: "La recherche a été supprimée.", confirm_w: "Supprimer définitivement la recherche ?", imgs: "Photos (6 max.)", add_img: "Ajouter des photos", expired: "Expirée", active_until: "Active jusqu'au {d}", err: "Échec de l'enregistrement. Réessayez.", err_access: "Accès refusé.", saving: "Enregistrement…" },
    es: { edit: "Editar", save: "Guardar cambios", cancel: "Cancelar", del: "Eliminar", edit_l: "Editar anuncio", edit_w: "Editar búsqueda", my_w: "Mis búsquedas", my_w_sub: "Búsquedas de tu cuenta. Las respuestas de los vendedores llegan a tu bandeja de entrada.", my_w_none: "No tienes búsquedas.", inq: "Consultas ({n})", saved: "Cambios guardados.", w_deleted: "La búsqueda se ha eliminado.", confirm_w: "¿Eliminar la búsqueda definitivamente?", imgs: "Fotos (máx. 6)", add_img: "Añadir fotos", expired: "Caducada", active_until: "Activa hasta {d}", err: "No se pudo guardar. Inténtalo de nuevo.", err_access: "No tienes acceso.", saving: "Guardando…" },
    it: { edit: "Modifica", save: "Salva modifiche", cancel: "Annulla", del: "Elimina", edit_l: "Modifica annuncio", edit_w: "Modifica ricerca", my_w: "Le mie ricerche", my_w_sub: "Ricerche del tuo account. Le risposte dei venditori arrivano nella tua posta.", my_w_none: "Non hai ricerche.", inq: "Richieste ({n})", saved: "Modifiche salvate.", w_deleted: "La ricerca è stata eliminata.", confirm_w: "Eliminare definitivamente la ricerca?", imgs: "Foto (max 6)", add_img: "Aggiungi foto", expired: "Scaduta", active_until: "Attiva fino al {d}", err: "Salvataggio non riuscito. Riprova.", err_access: "Accesso negato.", saving: "Salvataggio…" },
    pl: { edit: "Edytuj", save: "Zapisz zmiany", cancel: "Anuluj", del: "Usuń", edit_l: "Edytuj ogłoszenie", edit_w: "Edytuj ogłoszenie „kupię”", my_w: "Moje ogłoszenia „kupię”", my_w_sub: "Ogłoszenia „kupię” na Twoim koncie. Odpowiedzi sprzedawców trafiają do skrzynki.", my_w_none: "Nie masz ogłoszeń „kupię”.", inq: "Zapytania ({n})", saved: "Zmiany zapisano.", w_deleted: "Ogłoszenie usunięto.", confirm_w: "Usunąć ogłoszenie na stałe?", imgs: "Zdjęcia (maks. 6)", add_img: "Dodaj zdjęcia", expired: "Wygasłe", active_until: "Aktywne do {d}", err: "Nie udało się zapisać. Spróbuj ponownie.", err_access: "Brak dostępu.", saving: "Zapisywanie…" }
  };
  const lang = () => (window.GMT && GMT.lang()) || "da";
  const x = (k, v) => { let s = (TX[lang()] || TX.en)[k] || TX.en[k] || k; if (v) s = s.replace(/\{(\w+)\}/g, (m, n) => v[n] != null ? v[n] : m); return s; };
  const g = k => GMT.t(k);
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const lbl = k => esc(g(k));
  const uuid = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2));
  const fmtDate = iso => { try { return new Intl.DateTimeFormat(GMT.locale(), { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso)); } catch (e) { return iso.slice(0, 10); } };
  function toast(msg, bad) { const el = $("#toast"); if (!el) return alert(msg); el.textContent = msg; el.classList.toggle("err", !!bad); el.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove("show"), 3600); }
  const errText = e => /Ingen adgang/.test(String(e && e.message)) ? x("err_access") : x("err");

  /* ---------- Backend ---------- */
  const B = C.backend || {}, SB = B.type === "supabase" && B.supabaseUrl && B.supabaseAnonKey;
  const URL0 = SB ? B.supabaseUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "") : "";
  const tok = () => { try { return (JSON.parse(localStorage.getItem("gm_sb_session")) || {}).access_token; } catch (e) { return null; } };
  async function rpc(fn, args) {
    const r = await fetch(URL0 + "/rest/v1/rpc/" + fn, { method: "POST", headers: { apikey: B.supabaseAnonKey, Authorization: "Bearer " + (tok() || B.supabaseAnonKey), "Content-Type": "application/json" }, body: JSON.stringify(args || {}) });
    const t = await r.text(); if (!r.ok) throw new Error(t.slice(0, 200)); return t ? JSON.parse(t) : null;
  }
  async function uploadImg(dataUrl) {
    const u = S.user(), blob = await (await fetch(dataUrl)).blob(), path = u.id + "/" + uuid() + ".jpg";
    const r = await fetch(URL0 + "/storage/v1/object/annoncebilleder/" + path, { method: "POST", headers: { apikey: B.supabaseAnonKey, Authorization: "Bearer " + tok(), "Content-Type": "image/jpeg" }, body: blob });
    if (!r.ok) throw new Error("upload");
    return URL0 + "/storage/v1/object/public/annoncebilleder/" + path;
  }
  async function deleteImg(url) {
    const m = String(url).match(/\/object\/public\/annoncebilleder\/(.+)$/); if (!m) return;
    try { await fetch(URL0 + "/storage/v1/object/annoncebilleder/" + m[1], { method: "DELETE", headers: { apikey: B.supabaseAnonKey, Authorization: "Bearer " + tok() } }); } catch (e) { }
  }
  // Prototype (lokal) – samme handlinger direkte i browserens lager
  const LK = "gm_db_v3";
  const ldb = () => { try { return JSON.parse(localStorage.getItem(LK)) || {}; } catch (e) { return {}; } };
  const lsave = d => localStorage.setItem(LK, JSON.stringify(d));
  const API = {
    async myWanted() {
      const u = S.user(); if (!u) return [];
      if (SB) return (await rpc("my_wanted")) || [];
      const d = ldb(); return (d.wanted || []).filter(w => w.owner_id === u.id).map(w => Object.assign({}, w, { conversations: (d.conversations || []).filter(c => c.wanted_id === w.id).length }));
    },
    async updateListing(id, p) {
      if (SB) return rpc("update_listing", { p_id: id, p });
      const d = ldb(), l = (d.listings || []).find(l => l.id === id && l.owner_id === S.user().id); if (!l) throw new Error("Ingen adgang");
      Object.assign(l, p); lsave(d);
    },
    async updateWanted(id, p) {
      if (SB) return rpc("update_wanted", { p_id: id, p });
      const d = ldb(), w = (d.wanted || []).find(w => w.id === id && w.owner_id === S.user().id); if (!w) throw new Error("Ingen adgang");
      Object.assign(w, p); lsave(d);
    },
    async deleteWanted(id) {
      if (SB) return rpc("delete_wanted", { p_id: id });
      const d = ldb(); d.wanted = (d.wanted || []).filter(w => !(w.id === id && w.owner_id === S.user().id)); lsave(d);
    },
    async addImage(dataUrl) { return SB ? uploadImg(dataUrl) : dataUrl; },
    async removeImage(url) { if (SB) await deleteImg(url); }
  };

  /* ---------- Hjælpere ---------- */
  function resize(file, max) {
    return new Promise((res, rej) => {
      const u = URL.createObjectURL(file), img = new Image();
      img.onload = () => { const s = Math.min(1, max / Math.max(img.width, img.height)), cv = document.createElement("canvas");
        cv.width = Math.round(img.width * s); cv.height = Math.round(img.height * s); cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
        URL.revokeObjectURL(u); res(cv.toDataURL("image/jpeg", .82)); };
      img.onerror = () => { URL.revokeObjectURL(u); rej(new Error("img")); };
      img.src = u;
    });
  }
  function modal(id, html) {
    let m = $("#" + id);
    if (!m) { m = document.createElement("div"); m.className = "modal"; m.id = id; m.setAttribute("role", "dialog"); m.setAttribute("aria-modal", "true"); document.body.appendChild(m); }
    m.innerHTML = `<div class="mbox"><button class="mclose" type="button" data-close aria-label="×">×</button><div class="mcontent">${html}</div></div>`;
    $$(".modal.open").forEach(o => o.classList.remove("open"));
    m.classList.add("open"); document.body.style.overflow = "hidden";
    return m;
  }
  function closeAll() { $$(".modal.open").forEach(o => o.classList.remove("open")); document.body.style.overflow = ""; }
  function doneReload(msg) { try { sessionStorage.setItem("gm_edit_toast", msg); } catch (e) { } location.reload(); }
  const opts = (list, sel) => list.map(([v, t]) => `<option value="${esc(v)}"${String(v) === String(sel) ? " selected" : ""}>${esc(t)}</option>`).join("");
  const CATS = ["trampolin", "airtrack", "teamgym", "ag", "rg", "skum", "andet"];
  const CONDS = ["new", "like_new", "good", "fair"];

  /* ---------- Rediger annonce ---------- */
  let editImgs = [];
  async function openEditListing(id) {
    let l; try { l = (await S.myListings()).find(x => x.id === id); } catch (e) { }
    if (!l) { toast(x("err_access"), true); return; }
    editImgs = (l.images || []).map(u => ({ url: u }));
    const countries = Object.keys(C.countries).map(c => [c, GMT.country(c)]).sort((a, b) => a[1].localeCompare(b[1], GMT.locale()));
    const m = modal("mEditL", `<h2>${esc(x("edit_l"))}</h2>
      <form id="elForm" class="form-grid" style="margin-top:16px" novalidate>
        <div class="full"><label class="l" for="elTitle">${lbl("l_title")}</label><input id="elTitle" required minlength="3" maxlength="80" value="${esc(l.title)}"></div>
        <div><label class="l" for="elCat">${lbl("l_cat")}</label><select id="elCat">${opts(CATS.map(c => [c, g("cat_" + c)]), l.category)}</select></div>
        <div><label class="l" for="elBrand">${lbl("l_brand")}</label><input id="elBrand" maxlength="60" value="${esc(l.brand || "")}"></div>
        <div><label class="l" for="elYear">${lbl("l_year")}</label><input id="elYear" type="number" min="1970" max="2030" value="${esc(l.year || "")}"></div>
        <div><label class="l" for="elCond">${lbl("l_cond")}</label><select id="elCond">${opts(CONDS.map(c => [c, g("cond_" + c)]), l.condition)}</select></div>
        <div><label class="l" for="elCountry">${lbl("l_country")}</label><select id="elCountry">${opts(countries, l.country)}</select></div>
        <div><label class="l" for="elCur">${lbl("l_currency")}</label><select id="elCur">${opts(C.currencies.map(c => [c, c]), l.currency)}</select></div>
        <div><label class="l" for="elPrice">${lbl("l_price")}</label><input id="elPrice" type="number" min="0" max="100000000" required value="${esc(l.price)}"></div>
        <div><label class="l" for="elNew">${lbl("l_new")}</label><input id="elNew" type="number" min="0" max="100000000" value="${esc(l.new_price || "")}"></div>
        <div><label class="l" for="elCity">${lbl("l_city")}</label><input id="elCity" required maxlength="60" value="${esc(l.city)}"></div>
        <div><label class="l" for="elPost">${lbl("l_postcode")}</label><input id="elPost" maxlength="12" value="${esc(l.postcode || "")}"></div>
        <div class="full"><label class="l" for="elDesc">${lbl("l_desc")}</label><textarea id="elDesc" maxlength="3000">${esc(l.description || "")}</textarea></div>
        <div class="full"><label class="l">${esc(x("imgs"))}</label><div class="previews" id="elPrev"></div>
          <label class="btn btn-ghost btn-sm" for="elFile" style="margin-top:8px;cursor:pointer">${esc(x("add_img"))}</label><input id="elFile" type="file" accept="image/*" multiple hidden></div>
        <div class="full"><label class="chk"><input type="checkbox" id="elTr"${l.transport ? " checked" : ""}> <span>${lbl("l_transport")}</span></label></div>
        <div class="full form-err" id="elErr" aria-live="assertive"></div>
        <div class="full" style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn btn-primary" type="submit" id="elBtn">${esc(x("save"))}</button><button class="btn btn-ghost" type="button" data-close>${esc(x("cancel"))}</button></div>
      </form>`);
    const prev = () => { $("#elPrev").innerHTML = editImgs.map((im, i) => `<div style="position:relative"><img src="${esc(im.url || im.data)}" alt=""><button type="button" data-elrm="${i}" aria-label="×" style="position:absolute;top:-6px;right:-6px;width:22px;height:22px;border-radius:50%;border:0;background:#d93838;color:#fff;cursor:pointer">×</button></div>`).join(""); };
    prev();
    m.addEventListener("click", e => { const b = e.target.closest("[data-elrm]"); if (b) { editImgs.splice(+b.dataset.elrm, 1); prev(); } });
    $("#elFile").addEventListener("change", async e => {
      for (const f of Array.from(e.target.files || [])) { if (editImgs.length >= 6) break; if (f.type.indexOf("image/") === 0) { try { editImgs.push({ data: await resize(f, SB ? 1400 : 700) }); } catch (er) { } } }
      e.target.value = ""; prev();
    });
    $("#elForm").addEventListener("submit", async e => {
      e.preventDefault(); const er = $("#elErr"), btn = $("#elBtn");
      for (const el of $$("input,select,textarea", e.target)) if (!el.checkValidity()) { er.textContent = g("err_field").replace("{f}", (($(`label[for="${el.id}"]`) || {}).textContent || "").replace(" *", "")); el.focus(); return; }
      btn.disabled = true; btn.textContent = x("saving"); er.textContent = "";
      try {
        const urls = [];
        for (const im of editImgs) urls.push(im.url || await API.addImage(im.data));
        const removed = (l.images || []).filter(u => urls.indexOf(u) < 0);
        const y = Number($("#elYear").value), np = Math.round(Number($("#elNew").value));
        await API.updateListing(id, {
          title: $("#elTitle").value.trim(), category: $("#elCat").value, brand: $("#elBrand").value.trim(),
          year: y >= 1970 && y <= 2030 ? Math.round(y) : null, condition: $("#elCond").value,
          price: Math.max(0, Math.round(Number($("#elPrice").value) || 0)), currency: $("#elCur").value, new_price: np > 0 ? np : null,
          city: $("#elCity").value.trim(), postcode: $("#elPost").value.trim(), country: $("#elCountry").value,
          description: $("#elDesc").value.trim(), transport: $("#elTr").checked, images: urls
        });
        for (const u of removed) await API.removeImage(u);
        doneReload(x("saved"));
      } catch (ex) { er.textContent = errText(ex); btn.disabled = false; btn.textContent = x("save"); }
    });
  }

  /* ---------- Rediger / slet efterlysning ---------- */
  let myWanted = [];
  function openEditWanted(id) {
    const w = myWanted.find(v => v.id === id); if (!w) { toast(x("err_access"), true); return; }
    modal("mEditW", `<h2>${esc(x("edit_w"))}</h2>
      <form id="ewForm" class="form-grid" style="margin-top:16px" novalidate>
        <div class="full"><label class="l" for="ewTitle">${lbl("w_title")}</label><input id="ewTitle" required minlength="3" maxlength="80" value="${esc(w.title)}"></div>
        <div><label class="l" for="ewBudget">${lbl("w_budget")}</label><input id="ewBudget" maxlength="40" value="${esc(w.budget || "")}"></div>
        <div><label class="l" for="ewArea">${lbl("w_area")}</label><input id="ewArea" maxlength="40" value="${esc(w.area || "")}"></div>
        <div class="full form-err" id="ewErr" aria-live="assertive"></div>
        <div class="full" style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn btn-blue" type="submit" id="ewBtn">${esc(x("save"))}</button><button class="btn btn-ghost" type="button" data-close>${esc(x("cancel"))}</button></div>
      </form>`);
    $("#ewForm").addEventListener("submit", async e => {
      e.preventDefault(); const t = $("#ewTitle").value.trim();
      if (t.length < 3) { $("#ewErr").textContent = g("err_field").replace("{f}", g("w_title").replace(" *", "")); return; }
      $("#ewBtn").disabled = true;
      try { await API.updateWanted(id, { title: t, budget: $("#ewBudget").value.trim(), area: $("#ewArea").value.trim() }); doneReload(x("saved")); }
      catch (ex) { $("#ewErr").textContent = errText(ex); $("#ewBtn").disabled = false; }
    });
  }
  async function deleteWanted(id) {
    if (!confirm(x("confirm_w"))) return;
    try { await API.deleteWanted(id); doneReload(x("w_deleted")); } catch (ex) { toast(errText(ex), true); }
  }

  /* ---------- Sektion "Mine efterlysninger" ---------- */
  function ensureSection() {
    let sec = $("#mineWanted"); if (sec) return sec;
    const mine = $("#mine .wrap"); if (!mine) return null;
    sec = document.createElement("div"); sec.id = "mineWanted"; sec.style.marginTop = "36px";
    sec.innerHTML = `<div class="sec-head"><div><h2 style="font-size:1.4rem">${esc(x("my_w"))}</h2><p class="sub">${esc(x("my_w_sub"))}</p></div>
      <button class="btn btn-blue" type="button" data-want>${esc(g("wanted_new"))}</button></div><div id="mineWantedList"></div>`;
    mine.appendChild(sec); return sec;
  }
  let busy = false;
  async function renderMyWanted() {
    if (busy) return; busy = true;
    try {
      const sec = ensureSection(); if (!sec) return;
      if (!S.user()) { sec.hidden = true; myWanted = []; decorateWantedCards(); return; }
      sec.hidden = false;
      try { myWanted = await API.myWanted(); } catch (e) { myWanted = []; }
      $("#mineWantedList").innerHTML = myWanted.length ? myWanted.map(w => {
        const exp = w.expires_at && Date.parse(w.expires_at) < Date.now();
        return `<div class="mine-row" style="grid-template-columns:1fr auto"><div><b>${esc(w.title)}</b>
          <div class="meta"><span class="chip ${exp ? "udloebet" : "aktiv"}">${esc(exp ? x("expired") : g("status_aktiv"))}</span>${esc(w.area || g("anywhere"))} · ${esc(g("budget"))}: ${esc(w.budget || g("by_agreement"))}${w.expires_at && !exp ? " · " + esc(x("active_until", { d: fmtDate(w.expires_at) })) : ""}</div></div>
          <div class="mine-actions">${w.conversations ? `<button class="btn btn-ghost btn-sm" type="button" data-inbox>${esc(x("inq", { n: w.conversations }))}</button>` : ""}
          <button class="btn btn-ghost btn-sm" type="button" data-editw="${esc(w.id)}">${esc(x("edit"))}</button>
          <button class="btn btn-danger btn-sm" type="button" data-delw="${esc(w.id)}">${esc(x("del"))}</button></div></div>`;
      }).join("") : `<div class="empty">${esc(x("my_w_none"))}</div>`;
      decorateWantedCards();
    } finally { busy = false; }
  }
  // Egne kort i "Efterlyses" får Rediger/Slet
  function decorateWantedCards() {
    const mineByTitle = {}; myWanted.forEach(w => { (mineByTitle[w.title] = mineByTitle[w.title] || []).push(w); });
    $$("#wanted .want").forEach(card => {
      if (card.querySelector("[data-msg-wanted],[data-editw]")) return;
      const t = (card.querySelector("b") || {}).textContent, w = t && mineByTitle[t] && mineByTitle[t][0];
      if (!w) return;
      const d = document.createElement("div"); d.style.cssText = "display:flex;gap:6px;margin-top:10px;flex-wrap:wrap";
      d.innerHTML = `<button class="btn btn-ghost btn-sm" type="button" data-editw="${esc(w.id)}">${esc(x("edit"))}</button><button class="btn btn-danger btn-sm" type="button" data-delw="${esc(w.id)}">${esc(x("del"))}</button>${w.conversations ? `<button class="btn btn-ghost btn-sm" type="button" data-inbox>${esc(x("inq", { n: w.conversations }))}</button>` : ""}`;
      card.appendChild(d);
    });
  }
  // "Rediger" på egne annoncer
  function decorateMine() {
    $$("#mineList .mine-row").forEach(row => {
      if (row.querySelector("[data-editl]")) return;
      const del = row.querySelector("[data-del]"); if (!del) return;
      const b = document.createElement("button"); b.type = "button"; b.className = "btn btn-ghost btn-sm"; b.dataset.editl = del.dataset.del; b.textContent = x("edit");
      del.parentNode.insertBefore(b, del);
    });
  }

  /* ---------- Start ---------- */
  document.addEventListener("click", e => {
    const el = e.target;
    const a = el.closest("[data-editl]"); if (a) { e.stopPropagation(); openEditListing(a.dataset.editl); return; }
    const b = el.closest("[data-editw]"); if (b) { e.stopPropagation(); openEditWanted(b.dataset.editw); return; }
    const c = el.closest("[data-delw]"); if (c) { e.stopPropagation(); deleteWanted(c.dataset.delw); return; }
    if ((el.closest("#mEditL,#mEditW") && (el.closest("[data-close]") || el.classList.contains("modal")))) closeAll();
  }, true);
  function init() {
    const ml = $("#mineList"), wl = $("#wanted");
    if (ml) new MutationObserver(() => { decorateMine(); renderMyWanted(); }).observe(ml, { childList: true });
    if (wl) new MutationObserver(renderMyWanted).observe(wl, { childList: true });
    decorateMine(); renderMyWanted();
    try { const m = sessionStorage.getItem("gm_edit_toast"); if (m) { sessionStorage.removeItem("gm_edit_toast"); setTimeout(() => toast(m), 600); } } catch (e) { }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => setTimeout(init, 300)); else setTimeout(init, 300);
})();
