/* GENERERET af tools/registries.py – ret dér, ikke her. */
window.GM_REGISTRIES = {
 "AT": {
  "types": {
   "vat": {
    "label": "UID-Nummer",
    "re": "U\\d{8}",
    "ex": "ATU12345678"
   },
   "company": {
    "label": "Firmenbuchnummer (FN)",
    "re": "(FN)?\\d{1,6}[A-Z]",
    "ex": "FN 123456a"
   },
   "assoc": {
    "label": "ZVR-Zahl",
    "re": "\\d{9}",
    "ex": "123456789"
   }
  },
  "url": "https://e-justice.europa.eu/",
  "vies": true,
  "vatPrefix": "AT"
 },
 "BE": {
  "types": {
   "vat": {
    "label": "BTW/TVA",
    "re": "[01]\\d{9}",
    "ex": "BE0123456789"
   },
   "company": {
    "label": "Ondernemingsnummer / N° d'entreprise",
    "re": "[01]\\d{9}",
    "ex": "0123.456.789"
   },
   "assoc": {
    "label": "Ondernemingsnummer (VZW/ASBL)",
    "re": "[01]\\d{9}",
    "ex": "0123.456.789"
   }
  },
  "url": "https://e-justice.europa.eu/",
  "vies": true,
  "vatPrefix": "BE"
 },
 "BG": {
  "types": {
   "vat": {
    "label": "ДДС номер",
    "re": "\\d{9,10}",
    "ex": "BG123456789"
   },
   "company": {
    "label": "ЕИК / BULSTAT",
    "re": "\\d{9}|\\d{13}",
    "ex": "123456789"
   },
   "assoc": {
    "label": "ЕИК / BULSTAT",
    "re": "\\d{9}|\\d{13}",
    "ex": "123456789"
   }
  },
  "url": "https://e-justice.europa.eu/",
  "vies": true,
  "vatPrefix": "BG"
 },
 "HR": {
  "types": {
   "vat": {
    "label": "PDV ID",
    "re": "\\d{11}",
    "ex": "HR12345678901"
   },
   "company": {
    "label": "OIB",
    "re": "\\d{11}",
    "ex": "12345678901"
   },
   "assoc": {
    "label": "OIB (udruga)",
    "re": "\\d{11}",
    "ex": "12345678901"
   }
  },
  "url": "https://e-justice.europa.eu/",
  "vies": true,
  "vatPrefix": "HR"
 },
 "CY": {
  "types": {
   "vat": {
    "label": "ΦΠΑ / VAT",
    "re": "\\d{8}[A-Z]",
    "ex": "CY12345678X"
   },
   "company": {
    "label": "Αριθμός Εγγραφής (HE)",
    "re": "(HE)?\\d{1,6}",
    "ex": "HE123456"
   },
   "assoc": {
    "label": "Αριθμός Εγγραφής Σωματείου",
    "re": "[A-Z0-9]{3,12}",
    "ex": "1234"
   }
  },
  "url": "https://e-justice.europa.eu/",
  "vies": true,
  "vatPrefix": "CY"
 },
 "CZ": {
  "types": {
   "vat": {
    "label": "DIČ",
    "re": "\\d{8,10}",
    "ex": "CZ12345678"
   },
   "company": {
    "label": "IČO",
    "re": "\\d{8}",
    "ex": "12345678"
   },
   "assoc": {
    "label": "IČO (spolek)",
    "re": "\\d{8}",
    "ex": "12345678"
   }
  },
  "url": "https://e-justice.europa.eu/",
  "vies": true,
  "vatPrefix": "CZ"
 },
 "DK": {
  "types": {
   "vat": {
    "label": "SE-/momsnummer",
    "re": "\\d{8}",
    "ex": "DK12345678"
   },
   "company": {
    "label": "CVR-nummer",
    "re": "\\d{8}",
    "ex": "12345678"
   },
   "assoc": {
    "label": "CVR-nummer (forening)",
    "re": "\\d{8}",
    "ex": "12345678"
   }
  },
  "url": "https://datacvr.virk.dk/",
  "vies": true,
  "vatPrefix": "DK"
 },
 "EE": {
  "types": {
   "vat": {
    "label": "KMKR number",
    "re": "\\d{9}",
    "ex": "EE123456789"
   },
   "company": {
    "label": "Registrikood",
    "re": "\\d{8}",
    "ex": "12345678"
   },
   "assoc": {
    "label": "Registrikood (MTÜ)",
    "re": "8\\d{7}",
    "ex": "80123456"
   }
  },
  "url": "https://e-justice.europa.eu/",
  "vies": true,
  "vatPrefix": "EE"
 },
 "FI": {
  "types": {
   "vat": {
    "label": "ALV-numero",
    "re": "\\d{8}",
    "ex": "FI12345678"
   },
   "company": {
    "label": "Y-tunnus",
    "re": "\\d{8}",
    "ex": "1234567-8"
   },
   "assoc": {
    "label": "Y-tunnus / Yhdistysrekisterinumero",
    "re": "\\d{1,8}",
    "ex": "1234567-8"
   }
  },
  "url": "https://www.ytj.fi/",
  "vies": true,
  "vatPrefix": "FI"
 },
 "FR": {
  "types": {
   "vat": {
    "label": "N° TVA intracommunautaire",
    "re": "[0-9A-Z]{2}\\d{9}",
    "ex": "FR12345678901"
   },
   "company": {
    "label": "SIREN / SIRET",
    "re": "\\d{9}|\\d{14}",
    "ex": "123 456 789"
   },
   "assoc": {
    "label": "RNA",
    "re": "W\\d{9}",
    "ex": "W123456789"
   }
  },
  "url": "https://annuaire-entreprises.data.gouv.fr/",
  "vies": true,
  "vatPrefix": "FR"
 },
 "DE": {
  "types": {
   "vat": {
    "label": "USt-IdNr.",
    "re": "\\d{9}",
    "ex": "DE123456789"
   },
   "company": {
    "label": "Handelsregisternummer",
    "re": "HR[AB]\\d{1,6}[A-Z]{0,2}",
    "ex": "HRB 12345"
   },
   "assoc": {
    "label": "Vereinsregisternummer",
    "re": "VR\\d{1,6}",
    "ex": "VR 1234"
   }
  },
  "url": "https://www.handelsregister.de/",
  "vies": true,
  "vatPrefix": "DE"
 },
 "GR": {
  "types": {
   "vat": {
    "label": "ΑΦΜ (EL)",
    "re": "\\d{9}",
    "ex": "EL123456789"
   },
   "company": {
    "label": "ΓΕΜΗ",
    "re": "\\d{9,12}",
    "ex": "123456789000"
   },
   "assoc": {
    "label": "ΑΦΜ σωματείου",
    "re": "\\d{9}",
    "ex": "123456789"
   }
  },
  "url": "https://e-justice.europa.eu/",
  "vies": true,
  "vatPrefix": "EL"
 },
 "HU": {
  "types": {
   "vat": {
    "label": "Közösségi adószám",
    "re": "\\d{8}",
    "ex": "HU12345678"
   },
   "company": {
    "label": "Cégjegyzékszám",
    "re": "\\d{10}",
    "ex": "01-09-123456"
   },
   "assoc": {
    "label": "Nyilvántartási szám",
    "re": "\\d{5,13}",
    "ex": "01-02-0001234"
   }
  },
  "url": "https://e-justice.europa.eu/",
  "vies": true,
  "vatPrefix": "HU"
 },
 "IE": {
  "types": {
   "vat": {
    "label": "VAT number",
    "re": "\\d{7}[A-Z]{1,2}|\\d[A-Z+*]\\d{5}[A-Z]",
    "ex": "IE1234567T"
   },
   "company": {
    "label": "CRO number",
    "re": "\\d{5,6}",
    "ex": "123456"
   },
   "assoc": {
    "label": "CRO / Charity number",
    "re": "\\d{5,6}|\\d{11}",
    "ex": "123456"
   }
  },
  "url": "https://e-justice.europa.eu/",
  "vies": true,
  "vatPrefix": "IE"
 },
 "IT": {
  "types": {
   "vat": {
    "label": "Partita IVA",
    "re": "\\d{11}",
    "ex": "IT12345678901"
   },
   "company": {
    "label": "Partita IVA / Codice fiscale",
    "re": "\\d{11}",
    "ex": "12345678901"
   },
   "assoc": {
    "label": "Codice fiscale associazione",
    "re": "\\d{11}|[A-Z0-9]{16}",
    "ex": "91234567890"
   }
  },
  "url": "https://e-justice.europa.eu/",
  "vies": true,
  "vatPrefix": "IT"
 },
 "LV": {
  "types": {
   "vat": {
    "label": "PVN numurs",
    "re": "\\d{11}",
    "ex": "LV12345678901"
   },
   "company": {
    "label": "Reģistrācijas numurs",
    "re": "\\d{11}",
    "ex": "40001234567"
   },
   "assoc": {
    "label": "Reģistrācijas numurs (biedrība)",
    "re": "\\d{11}",
    "ex": "40008123456"
   }
  },
  "url": "https://e-justice.europa.eu/",
  "vies": true,
  "vatPrefix": "LV"
 },
 "LT": {
  "types": {
   "vat": {
    "label": "PVM kodas",
    "re": "\\d{9}|\\d{12}",
    "ex": "LT123456789"
   },
   "company": {
    "label": "Įmonės kodas",
    "re": "\\d{9}",
    "ex": "123456789"
   },
   "assoc": {
    "label": "Juridinio asmens kodas",
    "re": "\\d{9}",
    "ex": "123456789"
   }
  },
  "url": "https://e-justice.europa.eu/",
  "vies": true,
  "vatPrefix": "LT"
 },
 "LU": {
  "types": {
   "vat": {
    "label": "N° TVA",
    "re": "\\d{8}",
    "ex": "LU12345678"
   },
   "company": {
    "label": "RCS",
    "re": "B\\d{1,6}",
    "ex": "B123456"
   },
   "assoc": {
    "label": "RCS (ASBL)",
    "re": "F\\d{1,6}",
    "ex": "F1234"
   }
  },
  "url": "https://e-justice.europa.eu/",
  "vies": true,
  "vatPrefix": "LU"
 },
 "MT": {
  "types": {
   "vat": {
    "label": "VAT number",
    "re": "\\d{8}",
    "ex": "MT12345678"
   },
   "company": {
    "label": "Company registration",
    "re": "C\\d{1,6}",
    "ex": "C 12345"
   },
   "assoc": {
    "label": "VO number",
    "re": "(VO)?\\d{1,5}",
    "ex": "VO/1234"
   }
  },
  "url": "https://e-justice.europa.eu/",
  "vies": true,
  "vatPrefix": "MT"
 },
 "NL": {
  "types": {
   "vat": {
    "label": "Btw-identificatienummer",
    "re": "\\d{9}B\\d{2}",
    "ex": "NL123456789B01"
   },
   "company": {
    "label": "KvK-nummer",
    "re": "\\d{8}",
    "ex": "12345678"
   },
   "assoc": {
    "label": "KvK-nummer (vereniging)",
    "re": "\\d{8}",
    "ex": "40123456"
   }
  },
  "url": "https://www.kvk.nl/",
  "vies": true,
  "vatPrefix": "NL"
 },
 "PL": {
  "types": {
   "vat": {
    "label": "NIP (VAT UE)",
    "re": "\\d{10}",
    "ex": "PL1234567890"
   },
   "company": {
    "label": "KRS / NIP",
    "re": "\\d{10}",
    "ex": "0000123456"
   },
   "assoc": {
    "label": "KRS (stowarzyszenie)",
    "re": "\\d{10}",
    "ex": "0000123456"
   }
  },
  "url": "https://e-justice.europa.eu/",
  "vies": true,
  "vatPrefix": "PL"
 },
 "PT": {
  "types": {
   "vat": {
    "label": "NIF / NIPC",
    "re": "\\d{9}",
    "ex": "PT123456789"
   },
   "company": {
    "label": "NIPC",
    "re": "\\d{9}",
    "ex": "512345678"
   },
   "assoc": {
    "label": "NIPC (associação)",
    "re": "\\d{9}",
    "ex": "512345678"
   }
  },
  "url": "https://e-justice.europa.eu/",
  "vies": true,
  "vatPrefix": "PT"
 },
 "RO": {
  "types": {
   "vat": {
    "label": "Cod TVA",
    "re": "\\d{2,10}",
    "ex": "RO1234567"
   },
   "company": {
    "label": "CUI / CIF",
    "re": "\\d{2,10}",
    "ex": "1234567"
   },
   "assoc": {
    "label": "CIF (asociație)",
    "re": "\\d{2,10}",
    "ex": "1234567"
   }
  },
  "url": "https://e-justice.europa.eu/",
  "vies": true,
  "vatPrefix": "RO"
 },
 "SK": {
  "types": {
   "vat": {
    "label": "IČ DPH",
    "re": "\\d{10}",
    "ex": "SK1234567890"
   },
   "company": {
    "label": "IČO",
    "re": "\\d{8}",
    "ex": "12345678"
   },
   "assoc": {
    "label": "IČO (občianske združenie)",
    "re": "\\d{8}",
    "ex": "12345678"
   }
  },
  "url": "https://e-justice.europa.eu/",
  "vies": true,
  "vatPrefix": "SK"
 },
 "SI": {
  "types": {
   "vat": {
    "label": "ID za DDV",
    "re": "\\d{8}",
    "ex": "SI12345678"
   },
   "company": {
    "label": "Matična številka",
    "re": "\\d{7}(\\d{3})?",
    "ex": "1234567000"
   },
   "assoc": {
    "label": "Matična številka (društvo)",
    "re": "\\d{7}(\\d{3})?",
    "ex": "1234567"
   }
  },
  "url": "https://e-justice.europa.eu/",
  "vies": true,
  "vatPrefix": "SI"
 },
 "ES": {
  "types": {
   "vat": {
    "label": "NIF-IVA",
    "re": "[A-Z0-9]\\d{7}[A-Z0-9]",
    "ex": "ESB12345678"
   },
   "company": {
    "label": "NIF / CIF",
    "re": "[A-Z]\\d{7}[A-Z0-9]",
    "ex": "B12345678"
   },
   "assoc": {
    "label": "NIF (asociación)",
    "re": "G\\d{8}",
    "ex": "G12345678"
   }
  },
  "url": "https://e-justice.europa.eu/",
  "vies": true,
  "vatPrefix": "ES"
 },
 "SE": {
  "types": {
   "vat": {
    "label": "Momsregistreringsnummer",
    "re": "\\d{10}01",
    "ex": "SE556123456701"
   },
   "company": {
    "label": "Organisationsnummer",
    "re": "\\d{10}",
    "ex": "556123-4567"
   },
   "assoc": {
    "label": "Organisationsnummer (förening)",
    "re": "\\d{10}",
    "ex": "802123-4567"
   }
  },
  "url": "https://e-justice.europa.eu/",
  "vies": true,
  "vatPrefix": "SE"
 },
 "NO": {
  "types": {
   "vat": {
    "label": "MVA-nummer",
    "re": "\\d{9}(MVA)?",
    "ex": "NO 123456789 MVA"
   },
   "company": {
    "label": "Organisasjonsnummer",
    "re": "\\d{9}",
    "ex": "123 456 789"
   },
   "assoc": {
    "label": "Organisasjonsnummer (lag/forening)",
    "re": "\\d{9}",
    "ex": "912 345 678"
   }
  },
  "url": "https://www.brreg.no/",
  "vies": false,
  "vatPrefix": "NO"
 },
 "IS": {
  "types": {
   "vat": {
    "label": "VSK-númer",
    "re": "\\d{5,6}",
    "ex": "12345"
   },
   "company": {
    "label": "Kennitala",
    "re": "\\d{10}",
    "ex": "123456-7890"
   },
   "assoc": {
    "label": "Kennitala (félag)",
    "re": "\\d{10}",
    "ex": "123456-7890"
   }
  },
  "url": "https://e-justice.europa.eu/",
  "vies": false,
  "vatPrefix": "IS"
 },
 "CH": {
  "types": {
   "vat": {
    "label": "MWST/TVA/IVA-Nr.",
    "re": "(CHE)?\\d{9}(MWST|TVA|IVA)?",
    "ex": "CHE-123.456.789 MWST"
   },
   "company": {
    "label": "UID",
    "re": "(CHE)?\\d{9}",
    "ex": "CHE-123.456.789"
   },
   "assoc": {
    "label": "UID (Verein)",
    "re": "(CHE)?\\d{9}",
    "ex": "CHE-123.456.789"
   }
  },
  "url": "https://www.uid.admin.ch/",
  "vies": false,
  "vatPrefix": "CH"
 },
 "GB": {
  "types": {
   "vat": {
    "label": "VAT registration number",
    "re": "\\d{9}|\\d{12}",
    "ex": "GB123456789"
   },
   "company": {
    "label": "Companies House number",
    "re": "[A-Z0-9]{8}",
    "ex": "01234567"
   },
   "assoc": {
    "label": "Charity number",
    "re": "\\d{6,8}(-\\d)?|SC\\d{6}",
    "ex": "1234567"
   }
  },
  "url": "https://find-and-update.company-information.service.gov.uk/",
  "vies": false,
  "vatPrefix": "GB"
 }
};
window.GM_VIES_URL = "https://ec.europa.eu/taxation_customs/vies/";
(function () {
  const R = window.GM_REGISTRIES;
  const norm = (cc, type, v) => {
    let s = String(v || "").toUpperCase().replace(/[\s.\-\/]/g, "");
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
