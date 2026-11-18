# -*- coding: utf-8 -*-
"""
Kilde for landespecifik verificering. Kør:  python tools/registries.py
Genererer assets/registries.js og supabase/id_formats.sql.
Typer: vat = momsnummer (EU: VIES), company = virksomhedsregister, assoc = foreningsregister.
Formater og registerlinks bør efterprøves land for land før drift.
"""
import json, os

VIES = "https://ec.europa.eu/taxation_customs/vies/"
BRIS = "https://e-justice.europa.eu/"

R = {
 "AT": {"vat": ("UID-Nummer", r"U\d{8}", "ATU12345678"), "company": ("Firmenbuchnummer (FN)", r"(FN)?\d{1,6}[A-Z]", "FN 123456a"), "assoc": ("ZVR-Zahl", r"\d{9}", "123456789"), "url": BRIS},
 "BE": {"vat": ("BTW/TVA", r"[01]\d{9}", "BE0123456789"), "company": ("Ondernemingsnummer / N° d'entreprise", r"[01]\d{9}", "0123.456.789"), "assoc": ("Ondernemingsnummer (VZW/ASBL)", r"[01]\d{9}", "0123.456.789"), "url": BRIS},
 "BG": {"vat": ("ДДС номер", r"\d{9,10}", "BG123456789"), "company": ("ЕИК / BULSTAT", r"\d{9}|\d{13}", "123456789"), "assoc": ("ЕИК / BULSTAT", r"\d{9}|\d{13}", "123456789"), "url": BRIS},
 "HR": {"vat": ("PDV ID", r"\d{11}", "HR12345678901"), "company": ("OIB", r"\d{11}", "12345678901"), "assoc": ("OIB (udruga)", r"\d{11}", "12345678901"), "url": BRIS},
 "CY": {"vat": ("ΦΠΑ / VAT", r"\d{8}[A-Z]", "CY12345678X"), "company": ("Αριθμός Εγγραφής (HE)", r"(HE)?\d{1,6}", "HE123456"), "assoc": ("Αριθμός Εγγραφής Σωματείου", r"[A-Z0-9]{3,12}", "1234"), "url": BRIS},
 "CZ": {"vat": ("DIČ", r"\d{8,10}", "CZ12345678"), "company": ("IČO", r"\d{8}", "12345678"), "assoc": ("IČO (spolek)", r"\d{8}", "12345678"), "url": BRIS},
 "DK": {"vat": ("SE-/momsnummer", r"\d{8}", "DK12345678"), "company": ("CVR-nummer", r"\d{8}", "12345678"), "assoc": ("CVR-nummer (forening)", r"\d{8}", "12345678"), "url": "https://datacvr.virk.dk/"},
 "EE": {"vat": ("KMKR number", r"\d{9}", "EE123456789"), "company": ("Registrikood", r"\d{8}", "12345678"), "assoc": ("Registrikood (MTÜ)", r"8\d{7}", "80123456"), "url": BRIS},
 "FI": {"vat": ("ALV-numero", r"\d{8}", "FI12345678"), "company": ("Y-tunnus", r"\d{8}", "1234567-8"), "assoc": ("Y-tunnus / Yhdistysrekisterinumero", r"\d{1,8}", "1234567-8"), "url": "https://www.ytj.fi/"},
 "FR": {"vat": ("N° TVA intracommunautaire", r"[0-9A-Z]{2}\d{9}", "FR12345678901"), "company": ("SIREN / SIRET", r"\d{9}|\d{14}", "123 456 789"), "assoc": ("RNA", r"W\d{9}", "W123456789"), "url": "https://annuaire-entreprises.data.gouv.fr/"},
 "DE": {"vat": ("USt-IdNr.", r"\d{9}", "DE123456789"), "company": ("Handelsregisternummer", r"HR[AB]\d{1,6}[A-Z]{0,2}", "HRB 12345"), "assoc": ("Vereinsregisternummer", r"VR\d{1,6}", "VR 1234"), "url": "https://www.handelsregister.de/"},
 "GR": {"vat": ("ΑΦΜ (EL)", r"\d{9}", "EL123456789"), "company": ("ΓΕΜΗ", r"\d{9,12}", "123456789000"), "assoc": ("ΑΦΜ σωματείου", r"\d{9}", "123456789"), "url": BRIS},
 "HU": {"vat": ("Közösségi adószám", r"\d{8}", "HU12345678"), "company": ("Cégjegyzékszám", r"\d{10}", "01-09-123456"), "assoc": ("Nyilvántartási szám", r"\d{5,13}", "01-02-0001234"), "url": BRIS},
 "IE": {"vat": ("VAT number", r"\d{7}[A-Z]{1,2}|\d[A-Z+*]\d{5}[A-Z]", "IE1234567T"), "company": ("CRO number", r"\d{5,6}", "123456"), "assoc": ("CRO / Charity number", r"\d{5,6}|\d{11}", "123456"), "url": BRIS},
 "IT": {"vat": ("Partita IVA", r"\d{11}", "IT12345678901"), "company": ("Partita IVA / Codice fiscale", r"\d{11}", "12345678901"), "assoc": ("Codice fiscale associazione", r"\d{11}|[A-Z0-9]{16}", "91234567890"), "url": BRIS},
 "LV": {"vat": ("PVN numurs", r"\d{11}", "LV12345678901"), "company": ("Reģistrācijas numurs", r"\d{11}", "40001234567"), "assoc": ("Reģistrācijas numurs (biedrība)", r"\d{11}", "40008123456"), "url": BRIS},
 "LT": {"vat": ("PVM kodas", r"\d{9}|\d{12}", "LT123456789"), "company": ("Įmonės kodas", r"\d{9}", "123456789"), "assoc": ("Juridinio asmens kodas", r"\d{9}", "123456789"), "url": BRIS},
 "LU": {"vat": ("N° TVA", r"\d{8}", "LU12345678"), "company": ("RCS", r"B\d{1,6}", "B123456"), "assoc": ("RCS (ASBL)", r"F\d{1,6}", "F1234"), "url": BRIS},
 "MT": {"vat": ("VAT number", r"\d{8}", "MT12345678"), "company": ("Company registration", r"C\d{1,6}", "C 12345"), "assoc": ("VO number", r"(VO)?\d{1,5}", "VO/1234"), "url": BRIS},
 "NL": {"vat": ("Btw-identificatienummer", r"\d{9}B\d{2}", "NL123456789B01"), "company": ("KvK-nummer", r"\d{8}", "12345678"), "assoc": ("KvK-nummer (vereniging)", r"\d{8}", "40123456"), "url": "https://www.kvk.nl/"},
 "PL": {"vat": ("NIP (VAT UE)", r"\d{10}", "PL1234567890"), "company": ("KRS / NIP", r"\d{10}", "0000123456"), "assoc": ("KRS (stowarzyszenie)", r"\d{10}", "0000123456"), "url": BRIS},
 "PT": {"vat": ("NIF / NIPC", r"\d{9}", "PT123456789"), "company": ("NIPC", r"\d{9}", "512345678"), "assoc": ("NIPC (associação)", r"\d{9}", "512345678"), "url": BRIS},
 "RO": {"vat": ("Cod TVA", r"\d{2,10}", "RO1234567"), "company": ("CUI / CIF", r"\d{2,10}", "1234567"), "assoc": ("CIF (asociație)", r"\d{2,10}", "1234567"), "url": BRIS},
 "SK": {"vat": ("IČ DPH", r"\d{10}", "SK1234567890"), "company": ("IČO", r"\d{8}", "12345678"), "assoc": ("IČO (občianske združenie)", r"\d{8}", "12345678"), "url": BRIS},
 "SI": {"vat": ("ID za DDV", r"\d{8}", "SI12345678"), "company": ("Matična številka", r"\d{7}(\d{3})?", "1234567000"), "assoc": ("Matična številka (društvo)", r"\d{7}(\d{3})?", "1234567"), "url": BRIS},
 "ES": {"vat": ("NIF-IVA", r"[A-Z0-9]\d{7}[A-Z0-9]", "ESB12345678"), "company": ("NIF / CIF", r"[A-Z]\d{7}[A-Z0-9]", "B12345678"), "assoc": ("NIF (asociación)", r"G\d{8}", "G12345678"), "url": BRIS},
 "SE": {"vat": ("Momsregistreringsnummer", r"\d{10}01", "SE556123456701"), "company": ("Organisationsnummer", r"\d{10}", "556123-4567"), "assoc": ("Organisationsnummer (förening)", r"\d{10}", "802123-4567"), "url": BRIS},
 "NO": {"vat": ("MVA-nummer", r"\d{9}(MVA)?", "NO 123456789 MVA"), "company": ("Organisasjonsnummer", r"\d{9}", "123 456 789"), "assoc": ("Organisasjonsnummer (lag/forening)", r"\d{9}", "912 345 678"), "url": "https://www.brreg.no/"},
 "IS": {"vat": ("VSK-númer", r"\d{5,6}", "12345"), "company": ("Kennitala", r"\d{10}", "123456-7890"), "assoc": ("Kennitala (félag)", r"\d{10}", "123456-7890"), "url": BRIS},
 "CH": {"vat": ("MWST/TVA/IVA-Nr.", r"(CHE)?\d{9}(MWST|TVA|IVA)?", "CHE-123.456.789 MWST"), "company": ("UID", r"(CHE)?\d{9}", "CHE-123.456.789"), "assoc": ("UID (Verein)", r"(CHE)?\d{9}", "CHE-123.456.789"), "url": "https://www.uid.admin.ch/"},
 "GB": {"vat": ("VAT registration number", r"\d{9}|\d{12}", "GB123456789"), "company": ("Companies House number", r"[A-Z0-9]{8}", "01234567"), "assoc": ("Charity number", r"\d{6,8}(-\d)?|SC\d{6}", "1234567"), "url": "https://find-and-update.company-information.service.gov.uk/"},
}
VIES_PREFIX = {"GR": "EL"}
NON_EU = {"NO", "IS", "CH", "GB"}

out = {}
for cc, d in R.items():
    types = {}
    for k in ("vat", "company", "assoc"):
        if k in d:
            label, rx, ex = d[k]
            types[k] = {"label": label, "re": rx, "ex": ex}
    out[cc] = {"types": types, "url": d["url"], "vies": cc not in NON_EU, "vatPrefix": VIES_PREFIX.get(cc, cc)}

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
js = """/* GENERERET af tools/registries.py – ret dér, ikke her. */
window.GM_REGISTRIES = %s;
window.GM_VIES_URL = %s;
(function () {
  const R = window.GM_REGISTRIES;
  const norm = (cc, type, v) => {
    let s = String(v || "").toUpperCase().replace(/[\\s.\\-\\/]/g, "");
    const r = R[cc];
    if (r && type === "vat") { const p = r.vatPrefix; if (s.startsWith(p)) s = s.slice(p.length); else if (s.startsWith(cc)) s = s.slice(cc.length); }
    return s;
  };
  const check = (cc, type, v) => {
    const r = R[cc], ty = r && r.types[type];
    if (!ty) return String(v || "").trim().length >= 4;
    return new RegExp("^(" + ty.re + ")$").test(norm(cc, type, v));
  };
  window.GMReg = {
    has: cc => !!R[cc],
    types: cc => R[cc] ? Object.keys(R[cc].types) : ["company", "assoc"],
    label: (cc, type) => (R[cc] && R[cc].types[type] && R[cc].types[type].label) || "",
    example: (cc, type) => (R[cc] && R[cc].types[type] && R[cc].types[type].ex) || "",
    url: cc => (R[cc] && R[cc].url) || "",
    inVies: cc => !!(R[cc] && R[cc].vies),
    norm, check,
    matchAny: (cc, v) => (R[cc] ? Object.keys(R[cc].types) : []).find(ty => check(cc, ty, v)) || null
  };
})();
""" % (json.dumps(out, ensure_ascii=False, indent=1), json.dumps(VIES))
open(os.path.join(root, "assets", "registries.js"), "w", encoding="utf-8").write(js)

def q(s): return "'" + s.replace("'", "''") + "'"
rows = []
for cc, o in out.items():
    for ty, v in o["types"].items():
        rows.append(f"({q(cc)},{q(ty)},{q(v['label'])},{q(v['re'])},{q(v['ex'])},{q(o['url'])},{'true' if o['vies'] and ty=='vat' else 'false'},{q(o['vatPrefix'])})")
sql = """-- GENERERET af tools/registries.py
create table if not exists id_formats (
  country char(2) not null, id_type text not null check (id_type in ('vat','company','assoc')),
  label text not null, pattern text not null, example text not null,
  registry_url text not null, vies boolean not null default false, vat_prefix text not null,
  primary key (country, id_type)
);
insert into id_formats (country, id_type, label, pattern, example, registry_url, vies, vat_prefix) values
""" + ",\n".join(rows) + """
on conflict (country, id_type) do update set label = excluded.label, pattern = excluded.pattern, example = excluded.example,
  registry_url = excluded.registry_url, vies = excluded.vies, vat_prefix = excluded.vat_prefix;
"""
open(os.path.join(root, "supabase", "id_formats.sql"), "w", encoding="utf-8").write(sql)
print(len(out), "lande,", len(rows), "nummertyper")
