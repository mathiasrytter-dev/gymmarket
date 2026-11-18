/* ============================================================
   Datalag med brugere.
   Miljøer:
     drift  = backend.supabaseUrl / supabaseAnonKey
     test   = backend.test.* – bruges automatisk på localhost/127.0.0.1/fil,
              eller når siden åbnes med ?env=test (huskes i fanen).
              ?env=prod slår test fra igen.
   Verificering i to trin – gælder alle 31 lande:
     1. E-mail bekræftet
     2. Verificeret organisation (land + nummertype + nummer)
   ============================================================ */
(function () {
  const C = window.GM_CONFIG, Reg = window.GMReg;
  const DAY = 864e5;
  const uid = () => (window.crypto && crypto.randomUUID) ? crypto.randomUUID()
    : "id-" + Date.now().toString(36) + Math.random().toString(36).slice(2);
  const err = (key, vars) => { const e = new Error(key); e.i18n = key; e.vars = vars; return e; };
  const lsGet = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } };
  const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } };

  /* ---------- Miljø ---------- */
  function pickEnv() {
    const q = new URLSearchParams(location.search).get("env");
    try { if (q === "test") sessionStorage.setItem("gm_env", "test"); if (q === "prod") sessionStorage.removeItem("gm_env"); } catch (e) { }
    let forced = null; try { forced = sessionStorage.getItem("gm_env"); } catch (e) { }
    const localHost = location.protocol === "file:" || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
    return (forced === "test" || (localHost && q !== "prod")) ? "test" : "prod";
  }
  const ENV = pickEnv();

  function tierFor(rows, currency, price) {
    let list = rows.filter(r => r.currency === currency);
    if (!list.length) { list = rows.filter(r => r.currency === "EUR"); price = price * (C.fxToEUR[currency] || 1); }
    return list.find(r => price >= r.min_price && (r.max_price == null || price <= r.max_price)) || list[list.length - 1];
  }
  window.GMTierFor = tierFor;

  async function hash(pw, salt) {
    const s = salt + ":" + pw;
    if (window.crypto && crypto.subtle) {
      const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
      return Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2, "0")).join("");
    }
    let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return "f" + h;
  }
  const code6 = () => String(Math.floor(100000 + Math.random() * 900000));
  const publicProfile = u => u && ({
    id: u.id, email: u.email, name: u.name, user_type: u.user_type, org_name: u.org_name, country: u.country, phone: u.phone,
    is_trader: u.is_trader, trader_company: u.trader_company, trader_vat: u.trader_vat, trader_address: u.trader_address,
    email_verified: !!u.email_verified, org_status: u.org_status || "none",
    org_country: u.org_country || "", org_id_type: u.org_id_type || "", org_number: u.org_number || "", created_at: u.created_at
  });
  const displayName = u => (u.user_type !== "private" && u.org_name) ? u.org_name : u.name;
  function checkOrg(d) {
    if (!d.country || !d.type || !d.number) throw err("err_generic");
    if (!Reg.check(d.country, d.type, d.number)) throw err("err_id_format", { label: Reg.label(d.country, d.type), ex: Reg.example(d.country, d.type) });
    return Reg.norm(d.country, d.type, d.number);
  }

  /* ======================= LOCAL (prototype) ======================= */
  function LocalStore() {
    const K = { users: "gm_users_v1", sess: "gm_session_v1", db: "gm_db_v3" };
    let users = lsGet(K.users, []);
    let db = lsGet(K.db, { listings: [], wanted: [], reports: [], payments: [] });
    const saveUsers = () => lsSet(K.users, users);
    const saveDb = () => lsSet(K.db, db);
    const findUser = id => users.find(u => u.id === id);
    const me = () => { const id = lsGet(K.sess, null); return id ? findUser(id) : null; };
    const settings = { payments_enabled: C.paymentsEnabled, listing_days: C.listingDays };
    const paidIn = c => !!((C.markets[c] || {}).payments_enabled ?? C.paymentsEnabled);
    const activate = l => { l.status = "aktiv"; l.published_at = new Date().toISOString(); l.expires_at = new Date(Date.now() + settings.listing_days * DAY).toISOString(); };
    const sweep = () => { const now = Date.now(); db.listings.forEach(l => { if (l.status === "aktiv" && Date.parse(l.expires_at) < now) l.status = "udloebet"; }); };
    const withSeller = l => {
      const u = findUser(l.owner_id) || {};
      return Object.assign({}, l, {
        seller_name: displayName(u), seller_type: u.user_type, contact_email: u.email, contact_phone: u.phone,
        is_trader: !!u.is_trader, trader_company: u.trader_company, trader_vat: u.trader_vat, trader_address: u.trader_address,
        seller_verified: u.org_status === "approved", org_country: u.org_country, org_id_type: u.org_id_type
      });
    };
    const own = id => { const u = me(), l = db.listings.find(x => x.id === id); if (!u || !l || l.owner_id !== u.id) throw err("no_access"); return l; };
    const price = l => {
      const t = tierFor(C.tierPrices, l.currency, l.price); l.price_tier = t.tier; l.fee_currency = t.currency;
      if (paidIn(l.country)) { l.status = "afventer_betaling"; l.fee_charged = t.amount; } else { l.fee_charged = 0; activate(l); }
    };
    const needUser = verified => { const u = me(); if (!u) throw err("login_required"); if (verified && !u.email_verified) throw err("err_unverified"); return u; };

    return {
      mode: "local", env: ENV,
      async init() { sweep(); saveDb(); return { settings, markets: {}, tierPrices: C.tierPrices }; },
      user() { return publicProfile(me()); },
      async signup(d) {
        const email = d.email.trim().toLowerCase();
        if (users.some(u => u.email === email)) throw err("err_exists");
        const salt = uid(), u = Object.assign({}, d, { id: uid(), email, salt, pw: await hash(d.password, salt), created_at: new Date().toISOString(), email_verified: false, code: code6(), org_status: "none" });
        delete u.password; users.push(u); saveUsers();
        return { needsCode: true, email, demoCode: u.code };
      },
      async login(email, pw) {
        email = email.trim().toLowerCase();
        const u = users.find(x => x.email === email);
        if (!u || u.pw !== await hash(pw, u.salt)) throw err("err_login");
        if (!u.email_verified) { u.code = code6(); saveUsers(); return { needsCode: true, email, demoCode: u.code }; }
        lsSet(K.sess, u.id); return { user: publicProfile(u) };
      },
      async verifyEmail(email, code) {
        const u = users.find(x => x.email === email.trim().toLowerCase());
        if (!u || u.code !== String(code).trim()) throw err("err_code");
        u.email_verified = true; u.code = null; saveUsers(); lsSet(K.sess, u.id);
        return publicProfile(u);
      },
      async resend(email) { const u = users.find(x => x.email === email); if (!u) return {}; u.code = code6(); saveUsers(); return { demoCode: u.code }; },
      async logout() { localStorage.removeItem(K.sess); },
      async requestOrgVerification(d) {
        const u = needUser(true), n = checkOrg(d);
        Object.assign(u, { org_country: d.country, org_id_type: d.type, org_number: n, org_note: d.note, org_status: "pending" });
        saveUsers(); return publicProfile(u);
      },
      async approveDemo() { const u = needUser(true); u.org_status = "approved"; saveUsers(); return publicProfile(u); },
      async listings() { sweep(); return db.listings.filter(l => l.status === "aktiv").map(withSeller); },
      async listing(id) { const l = db.listings.find(x => x.id === id && x.status === "aktiv"); return l ? withSeller(l) : null; },
      async createListing(data) {
        const u = needUser(true);
        const l = Object.assign({}, data, { id: uid(), owner_id: u.id, created_at: new Date().toISOString(), status: "kladde" });
        price(l); db.listings.unshift(l);
        if (!saveDb()) { db.listings.shift(); throw err("err_storage"); }
        return { id: l.id, status: l.status };
      },
      async myListings() { sweep(); const u = me(); return u ? db.listings.filter(l => l.owner_id === u.id).map(withSeller) : []; },
      async markSold(id) { own(id).status = "solgt"; saveDb(); },
      async renew(id) { const l = own(id); price(l); saveDb(); return { status: l.status }; },
      async remove(id) { own(id); db.listings = db.listings.filter(x => x.id !== id); saveDb(); },
      async wanted() {
        const now = Date.now();
        return db.wanted.filter(w => Date.parse(w.expires_at) > now).map(w => {
          const u = findUser(w.owner_id) || {};
          return Object.assign({}, w, { name: displayName(u), contact_email: u.email, verified: u.org_status === "approved" });
        });
      },
      async addWanted(w) {
        const u = needUser(true);
        db.wanted.unshift(Object.assign({}, w, { id: uid(), owner_id: u.id, created_at: new Date().toISOString(), expires_at: new Date(Date.now() + C.wantedDays * DAY).toISOString() }));
        saveDb();
      },
      async report(r) { db.reports.push(Object.assign({ id: uid(), created_at: new Date().toISOString(), status: "ny" }, r)); saveDb(); }
    };
  }

  /* ======================= SUPABASE (drift / test) ======================= */
  function SupabaseStore(url, anon) {
    url = url.replace(/\/$/, "");
    const SK = "gm_sb_session_" + ENV;
    let session = lsGet(SK, null), profile = null;
    const LCOLS = "id,created_at,lang,title,category,brand,year,condition,price,currency,new_price,city,postcode,country,description,transport,images,status,expires_at,seller_name,seller_type,contact_email,contact_phone,is_trader,trader_company,trader_vat,trader_address,seller_verified,org_country,org_id_type";

    async function authFetch(path, body) {
      const r = await fetch(url + "/auth/v1/" + path, { method: "POST", headers: { apikey: anon, "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) {
        const m = (j.msg || j.error_description || j.message || "").toLowerCase();
        if (m.includes("not confirmed")) throw err("email_not_confirmed");
        if (m.includes("already")) throw err("err_exists");
        if (m.includes("invalid login")) throw err("err_login");
        if (m.includes("password")) throw err("err_pw");
        throw err("err_generic");
      }
      return j;
    }
    const setSession = j => { session = { access_token: j.access_token, refresh_token: j.refresh_token, expires_at: Date.now() + (j.expires_in - 60) * 1000 }; lsSet(SK, session); };
    async function token() {
      if (!session) return null;
      if (Date.now() > session.expires_at) {
        try { setSession(await authFetch("token?grant_type=refresh_token", { refresh_token: session.refresh_token })); }
        catch (e) { session = null; profile = null; localStorage.removeItem(SK); return null; }
      }
      return session.access_token;
    }
    async function api(path, opts) {
      opts = opts || {};
      const tk = await token();
      const r = await fetch(url + path, Object.assign({}, opts, {
        headers: Object.assign({ apikey: anon, Authorization: "Bearer " + (tk || anon), "Content-Type": "application/json" }, opts.headers || {})
      }));
      const txt = await r.text();
      if (!r.ok) {
        const e = new Error(txt.slice(0, 200));
        if (/Ingen adgang/.test(txt)) e.i18n = "no_access";
        if (/Log ind/.test(txt)) e.i18n = "login_required";
        if (/Ugyldigt format/.test(txt)) e.i18n = "err_id_format";
        throw e;
      }
      return txt ? JSON.parse(txt) : null;
    }
    const rpc = (fn, args) => api("/rest/v1/rpc/" + fn, { method: "POST", body: JSON.stringify(args || {}) });
    async function loadProfile() {
      if (!(await token())) { profile = null; return null; }
      const r = await rpc("my_profile");
      profile = r ? Object.assign({ email_verified: true }, r) : null;
      return profile;
    }
    async function upload(dataUrl) {
      const blob = await (await fetch(dataUrl)).blob(), name = (profile ? profile.id + "/" : "") + uid() + ".jpg";
      const r = await fetch(url + "/storage/v1/object/annoncebilleder/" + name, {
        method: "POST", headers: { apikey: anon, Authorization: "Bearer " + await token(), "Content-Type": "image/jpeg" }, body: blob
      });
      if (!r.ok) throw err("err_img");
      return url + "/storage/v1/object/public/annoncebilleder/" + name;
    }
    const redirect = encodeURIComponent(location.origin + location.pathname);
    return {
      mode: "supabase", env: ENV,
      async init() {
        const h = new URLSearchParams(location.hash.slice(1));
        if (h.get("access_token")) {
          setSession({ access_token: h.get("access_token"), refresh_token: h.get("refresh_token"), expires_in: Number(h.get("expires_in") || 3600) });
          history.replaceState(null, "", location.pathname + location.search);
        }
        await loadProfile().catch(() => null);
        const res = await Promise.all([api("/rest/v1/settings?select=payments_enabled,listing_days&id=eq.1"), api("/rest/v1/markets?select=country,payments_enabled")]);
        const markets = {}; res[1].forEach(m => markets[m.country] = m);
        return { settings: res[0][0], markets };
      },
      user() { return profile; },
      async signup(d) {
        const r = await fetch(url + "/auth/v1/signup?redirect_to=" + redirect, {
          method: "POST", headers: { apikey: anon, "Content-Type": "application/json" },
          body: JSON.stringify({ email: d.email.trim(), password: d.password, data: {
            name: d.name, user_type: d.user_type, org_name: d.org_name, country: d.country, phone: d.phone,
            is_trader: d.is_trader, trader_company: d.trader_company, trader_vat: d.trader_vat, trader_address: d.trader_address } })
        });
        if (!r.ok) { const j = await r.json().catch(() => ({})); const m = (j.msg || j.message || "").toLowerCase(); throw err(m.includes("already") ? "err_exists" : m.includes("password") ? "err_pw" : "err_generic"); }
        return { needsLink: true, email: d.email.trim() };
      },
      async login(email, pw) {
        try { setSession(await authFetch("token?grant_type=password", { email: email.trim(), password: pw })); }
        catch (e) { if (e.i18n === "email_not_confirmed") return { needsLink: true, email: email.trim() }; throw e; }
        return { user: await loadProfile() };
      },
      async verifyEmail() { throw err("err_generic"); },
      async resend(email) { await authFetch("resend", { type: "signup", email }); return {}; },
      async logout() { try { await fetch(url + "/auth/v1/logout", { method: "POST", headers: { apikey: anon, Authorization: "Bearer " + await token() } }); } catch (e) { } session = null; profile = null; localStorage.removeItem(SK); },
      async requestOrgVerification(d) {
        checkOrg(d);
        await rpc("request_verification", { p_country: d.country, p_type: d.type, p_number: d.number, p_note: d.note || "" });
        if (d.type === "vat" && Reg.inVies(d.country)) {
          try { await fetch(url + "/functions/v1/vies-check", { method: "POST", headers: { Authorization: "Bearer " + await token(), "Content-Type": "application/json" }, body: "{}" }); } catch (e) { }
        }
        return loadProfile();
      },
      approveDemo: null,
      async listings() { return api("/rest/v1/listings_public?select=" + LCOLS + "&order=created_at.desc&limit=1000"); },
      async listing(id) { const r = await api("/rest/v1/listings_public?select=" + LCOLS + "&id=eq." + encodeURIComponent(id)); return r[0] || null; },
      async createListing(data) {
        if (!profile) throw err("login_required");
        const images = []; for (const d of data.images || []) images.push(await upload(d));
        return rpc("create_listing", { p: Object.assign({}, data, { images }) });
      },
      async myListings() { return profile ? rpc("my_listings") : []; },
      async markSold(id) { await rpc("mark_listing_sold", { p_id: id }); },
      async renew(id) { return rpc("renew_listing", { p_id: id }); },
      async remove(id) { await rpc("delete_listing", { p_id: id }); },
      async wanted() { return api("/rest/v1/wanted_public?select=*&order=created_at.desc&limit=300"); },
      async addWanted(w) { if (!profile) throw err("login_required"); return rpc("create_wanted", { p: w }); },
      async report(r) { return rpc("create_report", { p: r }); }
    };
  }

  // Vælg backend: test-projekt i testmiljø (hvis udfyldt), ellers drift
  const b = C.backend || {};
  const t = b.test || {};
  const cfg = (ENV === "test" && t.supabaseUrl && t.supabaseAnonKey) ? t : (ENV === "prod" ? b : null);
  window.GMStore = (b.type === "supabase" && cfg && cfg.supabaseUrl && cfg.supabaseAnonKey)
    ? SupabaseStore(cfg.supabaseUrl, cfg.supabaseAnonKey)
    : LocalStore();
  window.GM_ENV = { env: ENV, backend: window.GMStore.mode, isTestDb: window.GMStore.mode === "supabase" && cfg === t };
})();
