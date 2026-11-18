/* Eksporterer alle tekster til regneark, som oversætterne kan rette i.
   Kør:  node tools/export-translations.js   ->  oversaettelse/<sprog>.csv (åbnes i Excel) */
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
global.window = {}; global.GM_I18N = {}; window.GM_I18N = global.GM_I18N;
global.document = { readyState: "complete", documentElement: { lang: "da" }, addEventListener() {}, querySelector() { return null }, head: { appendChild() {} } };
global.setTimeout = () => {};
for (const f of fs.readdirSync(path.join(root, "assets/i18n"))) eval(fs.readFileSync(path.join(root, "assets/i18n", f), "utf8"));
eval(fs.readFileSync(path.join(root, "assets/i18n-verify.js"), "utf8"));
eval(fs.readFileSync(path.join(root, "assets/i18n-inbox.js"), "utf8"));
try { eval(fs.readFileSync(path.join(root, "assets/i18n-overrides.js"), "utf8")); } catch (e) {}
eval(fs.readFileSync(path.join(root, "assets/fb-import.js"), "utf8"));
const V = window.GM_I18N_VERIFY, F = window.GM_FB_I18N, O = window.GM_I18N_OVERRIDES || {};
const langs = ["da", "en", "de", "sv", "nb", "fi", "nl", "fr", "es", "it", "pl"];
const merged = l => Object.assign({}, GM_I18N[l] || {}, V[l] || {});
const fb = l => Object.fromEntries(Object.entries(F[l] || {}).map(([k, v]) => ["fb." + k, v]));
const all = l => Object.assign(merged(l), fb(l), O[l] || {});
const EN = all("en"), DA = all("da");
const keys = Object.keys(EN).filter(k => typeof EN[k] === "string");
const q = s => '"' + String(s == null ? "" : s).replace(/"/g, '""') + '"';
const out = path.join(root, "oversaettelse"); fs.mkdirSync(out, { recursive: true });
for (const l of langs) {
  const L = all(l);
  const rows = [["Nøgle", "Engelsk (reference)", "Dansk (reference)", "Nuværende tekst (" + l + ")", "Rettet tekst", "Kommentar"].map(q).join(";")];
  for (const k of keys) rows.push([k, EN[k], DA[k], L[k] != null ? L[k] : "⚠ MANGLER – vises på engelsk", "", ""].map(q).join(";"));
  fs.writeFileSync(path.join(out, l + ".csv"), "\uFEFF" + rows.join("\r\n"), "utf8");
}
console.log("Eksporteret", keys.length, "tekster ×", langs.length, "sprog til", out);
