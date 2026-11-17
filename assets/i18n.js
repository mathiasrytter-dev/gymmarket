/* Oversættelser. Engelsk er altid indlæst og bruges, hvis en tekst mangler. */
(function () {
  const C = window.GM_CONFIG;
  window.GM_I18N = window.GM_I18N || {};
  let lang = "en";

  function pick() {
    const q = new URLSearchParams(location.search).get("lang");
    if (q && C.languages.includes(q)) return q;
    try { const s = localStorage.getItem("gm_lang"); if (s && C.languages.includes(s)) return s; } catch (e) { }
    for (const l of navigator.languages || [navigator.language || ""]) {
      let b = (l || "").toLowerCase().split("-")[0];
      if (b === "no" || b === "nn") b = "nb";
      if (C.languages.includes(b)) return b;
    }
    return C.defaultLanguage;
  }
  function loadScript(l) {
    return new Promise(res => {
      if (window.GM_I18N[l]) return res();
      const s = document.createElement("script");
      s.src = "assets/i18n/" + l + ".js?v=" + (C.version || "1"); s.onload = res; s.onerror = res;
      document.head.appendChild(s);
    });
  }
  function t(key, vars) {
    const d = window.GM_I18N[lang] || {}, en = window.GM_I18N.en || {};
    let s = d[key] != null ? d[key] : en[key] != null ? en[key] : key;
    if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => vars[k] != null ? vars[k] : m);
    return s;
  }
  const has = key => (window.GM_I18N[lang] || {})[key] != null;
  function apply(root) {
    root = root || document;
    root.querySelectorAll("[data-i18n]").forEach(el => el.textContent = t(el.dataset.i18n));
    root.querySelectorAll("[data-i18n-html]").forEach(el => el.innerHTML = t(el.dataset.i18nHtml));
    root.querySelectorAll("[data-i18n-ph]").forEach(el => el.placeholder = t(el.dataset.i18nPh));
    root.querySelectorAll("[data-i18n-aria]").forEach(el => el.setAttribute("aria-label", t(el.dataset.i18nAria)));
  }
  async function init() {
    lang = pick();
    await loadScript("en");
    if (lang !== "en") await loadScript(lang);
    document.documentElement.lang = lang;
    try { localStorage.setItem("gm_lang", lang); } catch (e) { }
    return lang;
  }
  function setLang(l) {
    const u = new URL(location.href); u.searchParams.set("lang", l); u.hash = "";
    try { localStorage.setItem("gm_lang", l); } catch (e) { }
    location.href = u.toString();
  }
  const locale = () => ({ da: "da-DK", en: "en-IE", de: "de-DE", sv: "sv-SE", nb: "nb-NO", fi: "fi-FI", nl: "nl-NL", fr: "fr-FR", es: "es-ES", it: "it-IT", pl: "pl-PL" }[lang] || lang);
  const dn = type => { try { return new Intl.DisplayNames([locale()], { type }); } catch (e) { return { of: x => x }; } };
  window.GMT = { init, t, has, apply, setLang, locale, lang: () => lang,
    country: c => c ? dn("region").of(c) : "", language: l => dn("language").of(l) };
})();
