/* Læser rettede regneark ind igen.
   Kør:  node tools/import-translations.js
   Pladsholdere i {krøllede parenteser} skal bevares – ellers afvises rettelsen. */
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, ".."), dir = path.join(root, "oversaettelse");
function parseCsv(txt) {
  txt = txt.replace(/^\uFEFF/, ""); const rows = []; let row = [], cur = "", q = false;
  const sep = txt.split("\n")[0].includes(";") ? ";" : ",";
  for (let i = 0; i < txt.length; i++) {
    const c = txt[i];
    if (q) { if (c === '"') { if (txt[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c; }
    else if (c === '"') q = true; else if (c === sep) { row.push(cur); cur = ""; }
    else if (c === "\n") { row.push(cur.replace(/\r$/, "")); rows.push(row); row = []; cur = ""; } else cur += c;
  }
  if (cur || row.length) { row.push(cur); rows.push(row); }
  return rows;
}
const ph = s => (String(s).match(/\{\w+\}/g) || []).sort().join(",");
let old = {}; try { global.window = {}; eval(fs.readFileSync(path.join(root, "assets/i18n-overrides.js"), "utf8")); old = window.GM_I18N_OVERRIDES || {}; } catch (e) {}
const res = Object.assign({}, old); let n = 0, bad = [];
for (const f of fs.existsSync(dir) ? fs.readdirSync(dir) : []) {
  if (!f.endsWith(".csv")) continue;
  const l = f.slice(0, -4), rows = parseCsv(fs.readFileSync(path.join(dir, f), "utf8"));
  for (const r of rows.slice(1)) {
    const [key, en, , , fixed] = r; if (!key || !fixed || !fixed.trim()) continue;
    if (ph(fixed) !== ph(en)) { bad.push(`${l}/${key}: pladsholdere passer ikke (skal være ${ph(en) || "ingen"})`); continue; }
    (res[l] = res[l] || {})[key] = fixed.trim(); n++;
  }
}
fs.writeFileSync(path.join(root, "assets/i18n-overrides.js"),
  "/* GENERERET af tools/import-translations.js – rettelser fra oversættere. Ret ikke i hånden. */\nwindow.GM_I18N_OVERRIDES = " + JSON.stringify(res, null, 1) + ";\n", "utf8");
console.log("Indlæst", n, "rettelser."); if (bad.length) console.log("Afvist:\n  " + bad.join("\n  "));
