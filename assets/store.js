/* ============================================================
   Datalag med brugere, e-mailkode, profilbillede og indbakke.
   "supabase" (drift): rigtige brugere. Koden sendes som mail af Supabase Auth.
   "local" (prototype): alt gemmes i denne browser, og koden vises på skærmen.
   ============================================================ */
(function () {
  const C = window.GM_CONFIG, Reg = window.GMReg;
  const DAY = 864e5, HOUR = 36e5;
  const uid = () => (window.crypto && crypto.randomUUID) ? crypto.randomUUID()
    : "id-" + Date.now().toString(36) + Math.random().toString(36).slice(2);
  const err = (key, vars) => { const e = new Error(key); e.i18n = key; e.vars = vars; return e; };
  const lsGet = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } };
  const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } };

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
    avatar_url: u.avatar_url || "", email_verified: !!u.email_verified, org_status: u.org_status || "none",
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
    db.conversations = db.conversations || []; db.messages = db.messages || [];
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
        seller_id: l.owner_id, seller_avatar: u.avatar_url || "", seller_name: displayName(u), seller_type: u.user_type, contact_phone: u.phone,
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
    const mine = (c, u) => c.starter_id === u.id || c.owner_id === u.id;
    const summary = (c, u) => {
      const o = findUser(c.starter_id === u.id ? c.owner_id : c.starter_id) || {};
      const msgs = db.messages.filter(m => m.conversation_id === c.id), last = msgs[msgs.length - 1];
      return { id: c.id, subject: c.subject, listing_id: c.listing_id, wanted_id: c.wanted_id,
        other_name: displayName(o), other_avatar: o.avatar_url || "", other_verified: o.org_status === "approved",
        last_body: last ? last.body : "", last_at: c.last_message_at, last_from_me: !!last && last.sender_id === u.id,
        unread: msgs.filter(m => m.sender_id !== u.id && !m.read_at).length };
    };
    const rateCheck = u => { if (db.messages.filter(m => m.sender_id === u.id && Date.now() - Date.parse(m.created_at) < HOUR).length >= 20) throw err("msg_err_rate"); };

    return {
      mode: "local",
      async init() { sweep(); saveDb(); return { settings, markets: {} }; },
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
      async setAvatar(dataUrl) {
        const u = needUser(true), old = u.avatar_url; u.avatar_url = dataUrl || "";
        if (!saveUsers()) { u.avatar_url = old; throw err("avatar_err"); }
        return publicProfile(u);
      },
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
          return Object.assign({}, w, { name: displayName(u), verified: u.org_status === "approved", seller_id: w.owner_id, seller_avatar: u.avatar_url || "" });
        });
      },
      async addWanted(w) {
        const u = needUser(true);
        db.wanted.unshift(Object.assign({}, w, { id: uid(), owner_id: u.id, created_at: new Date().toISOString(), expires_at: new Date(Date.now() + C.wantedDays * DAY).toISOString() }));
        saveDb();
      },
      async report(r) { db.reports.push(Object.assign({ id: uid(), created_at: new Date().toISOString(), status: "ny" }, r)); saveDb(); },

      /* ---- Indbakke ---- */
      async sendMessage(d) {
        const u = needUser(true), body = String(d.body || "").trim();
        if (!body) throw err("msg_err_empty");
        const target = d.listing_id ? db.listings.find(l => l.id === d.listing_id && l.status === "aktiv") : db.wanted.find(w => w.id === d.wanted_id);
        if (!target) throw err("not_found");
        if (target.owner_id === u.id) throw err("msg_err_self");
        rateCheck(u);
        let c = db.conversations.find(x => x.starter_id === u.id && (d.listing_id ? x.listing_id === d.listing_id : x.wanted_id === d.wanted_id));
        const now = new Date().toISOString();
        if (!c) { c = { id: uid(), listing_id: d.listing_id || null, wanted_id: d.wanted_id || null, subject: target.title, starter_id: u.id, owner_id: target.owner_id, created_at: now, last_message_at: now }; db.conversations.unshift(c); }
        db.messages.push({ id: uid(), conversation_id: c.id, sender_id: u.id, body: body.slice(0, 2000), created_at: now, read_at: null });
        c.last_message_at = now;
        if (!saveDb()) throw err("err_storage");
        return { conversation_id: c.id };
      },
      async conversations() {
        const u = needUser();
        return db.conversations.filter(c => mine(c, u)).sort((a, b) => Date.parse(b.last_message_at) - Date.parse(a.last_message_at)).map(c => summary(c, u));
      },
      async thread(id) {
        const u = needUser(), c = db.conversations.find(x => x.id === id);
        if (!c || !mine(c, u)) throw err("no_access");
        const now = new Date().toISOString();
        db.messages.forEach(m => { if (m.conversation_id === id && m.sender_id !== u.id && !m.read_at) m.read_at = now; }); saveDb();
        return Object.assign(summary(c, u), { messages: db.messages.filter(m => m.conversation_id === id).map(m => ({ id: m.id, mine: m.sender_id === u.id, body: m.body, created_at: m.created_at })) });
      },
      async reply(id, body) {
        const u = needUser(true), c = db.conversations.find(x => x.id === id);
        if (!c || !mine(c, u)) throw err("no_access");
        body = String(body || "").trim(); if (!body) throw err("msg_err_empty");
        rateCheck(u);
        const now = new Date().toISOString();
        db.messages.push({ id: uid(), conversation_id: id, sender_id: u.id, body: body.slice(0, 2000), created_at: now, read_at: null });
        c.last_message_at = now; saveDb();
      },
      async unreadCount() {
        const u = me(); if (!u) return 0;
        const ids = new Set(db.conversations.filter(c => mine(c, u)).map(c => c.id));
        return db.messages.filter(m => ids.has(m.conversation_id) && m.sender_id !== u.id && !m.read_at).length;
      }
    };
  }

  /* ======================= SUPABASE (drift) ======================= */
  function SupabaseStore(url, anon) {
    url = url.replace(/\/$/, "");
    const SK = "gm_sb_session";
    let session = lsGet(SK, null), profile = null;
    const LCOLS = "id,created_at,lang,title,category,brand,year,condition,price,currency,new_price,city,postcode,country,description,transport,images,status,expires_at,seller_id,seller_avatar,seller_name,seller_type,contact_phone,is_trader,trader_company,trader_vat,trader_address,seller_verified,org_country,org_id_type";

    function mapAuthError(status, j) {
      const code = (j.error_code || j.code || "").toString().toLowerCase(), m = (j.msg || j.error_description || j.message || "").toLowerCase();
      if (code === "email_not_confirmed" || m.includes("not confirmed")) return err("email_not_confirmed");
      if (code === "invalid_credentials" || m.includes("invalid login")) return err("err_login");
      if (code === "user_already_exists" || code === "email_exists" || m.includes("already")) return err("err_exists");
      if (code === "weak_password" || m.includes("password")) return err("err_pw");
      if (code === "otp_expired" || m.includes("expired or is invalid") || m.includes("otp")) return err("err_code");
      if (status === 429 || code.startsWith("over_") || m.includes("rate limit")) return err("err_rate_email");
      return err("err_generic");
    }
    async function authFetch(path, body) {
      const r = await fetch(url + "/auth/v1/" + path, { method: "POST", headers: { apikey: anon, "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw mapAuthError(r.status, j);
      return j;
    }
    const setSession = j => { session = { access_token: j.access_token, refresh_token: j.refresh_token, expires_at: Date.now() + ((j.expires_in || 3600) - 60) * 1000 }; lsSet(SK, session); };
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
        if (/Egen annonce/.test(txt)) e.i18n = "msg_err_self";
        if (/For mange beskeder/.test(txt)) e.i18n = "msg_err_rate";
        if (/Tom besked/.test(txt)) e.i18n = "msg_err_empty";
        if (/Ikke fundet/.test(txt)) e.i18n = "not_found";
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
    async function upload(bucket, path, dataUrl) {
      const blob = await (await fetch(dataUrl)).blob();
      const r = await fetch(url + "/storage/v1/object/" + bucket + "/" + path, {
        method: "POST", headers: { apikey: anon, Authorization: "Bearer " + await token(), "Content-Type": "image/jpeg" }, body: blob
      });
      if (!r.ok) throw err(bucket === "avatars" ? "avatar_err" : "err_img");
      return url + "/storage/v1/object/public/" + bucket + "/" + path;
    }
    const uidn = () => (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(36).slice(2);
    return {
      mode: "supabase",
      async init() {
        await loadProfile().catch(() => null);
        const res = await Promise.all([api("/rest/v1/settings?select=payments_enabled,listing_days&id=eq.1"), api("/rest/v1/markets?select=country,payments_enabled")]);
        const markets = {}; res[1].forEach(m => markets[m.country] = m);
        return { settings: res[0][0], markets };
      },
      user() { return profile; },

      // Oprettelse: Supabase sender en mail med en 6-cifret kode (skabelonen "Confirm sign up" skal indeholde {{ .Token }})
      async signup(d) {
        const r = await fetch(url + "/auth/v1/signup", {
          method: "POST", headers: { apikey: anon, "Content-Type": "application/json" },
          body: JSON.stringify({ email: d.email.trim(), password: d.password, data: {
            name: d.name, user_type: d.user_type, org_name: d.org_name, country: d.country, phone: d.phone,
            is_trader: d.is_trader, trader_company: d.trader_company, trader_vat: d.trader_vat, trader_address: d.trader_address } })
        });
        const j = await r.json().catch(() => ({}));
        if (!r.ok) throw mapAuthError(r.status, j);
        // Er adressen allerede i brug, returnerer Supabase en bruger uden identiteter (og sender ingen kode)
        const ids = Array.isArray(j.identities) ? j.identities : (j.user && Array.isArray(j.user.identities) ? j.user.identities : null);
        if (ids && ids.length === 0) throw err("err_exists");
        if (j.access_token) { setSession(j); await loadProfile(); return { user: profile }; }
        return { needsCode: true, email: d.email.trim() };
      },
      async login(email, pw) {
        try { setSession(await authFetch("token?grant_type=password", { email: email.trim(), password: pw })); }
        catch (e) {
          if (e.i18n === "email_not_confirmed") { try { await authFetch("resend", { type: "signup", email: email.trim() }); } catch (x) { } return { needsCode: true, email: email.trim() }; }
          throw e;
        }
        return { user: await loadProfile() };
      },
      async verifyEmail(email, code) {
        const r = await fetch(url + "/auth/v1/verify", { method: "POST", headers: { apikey: anon, "Content-Type": "application/json" },
          body: JSON.stringify({ type: "signup", email: email.trim(), token: String(code).trim() }) });
        const j = await r.json().catch(() => ({}));
        if (!r.ok || !j.access_token) throw (r.status === 429 ? err("err_rate_email") : err("err_code"));
        setSession(j); return loadProfile();
      },
      async resend(email) { await authFetch("resend", { type: "signup", email: email.trim() }); return {}; },
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

      // Profilbillede: gemmes i bucket "avatars" i brugerens egen mappe
      async setAvatar(dataUrl) {
        if (!profile) throw err("login_required");
        const old = profile.avatar_url;
        const removeOld = async u => {
          const m = u && u.match(/\/object\/public\/avatars\/(.+)$/); if (!m) return;
          try { await fetch(url + "/storage/v1/object/avatars/" + m[1].split("?")[0], { method: "DELETE", headers: { apikey: anon, Authorization: "Bearer " + await token() } }); } catch (e) { }
        };
        if (!dataUrl) { await rpc("set_avatar", { p_url: null }); removeOld(old); return loadProfile(); }
        const pub = await upload("avatars", profile.id + "/avatar-" + uidn() + ".jpg", dataUrl);
        await rpc("set_avatar", { p_url: pub }); removeOld(old);
        return loadProfile();
      },

      async listings() { return api("/rest/v1/listings_public?select=" + LCOLS + "&order=created_at.desc&limit=1000"); },
      async listing(id) { const r = await api("/rest/v1/listings_public?select=" + LCOLS + "&id=eq." + encodeURIComponent(id)); return r[0] || null; },
      async createListing(data) {
        if (!profile) throw err("login_required");
        const images = []; for (const d of data.images || []) images.push(await upload("annoncebilleder", profile.id + "/" + uidn() + ".jpg", d));
        return rpc("create_listing", { p: Object.assign({}, data, { images }) });
      },
      async myListings() { return profile ? rpc("my_listings") : []; },
      async markSold(id) { await rpc("mark_listing_sold", { p_id: id }); },
      async renew(id) { return rpc("renew_listing", { p_id: id }); },
      async remove(id) { await rpc("delete_listing", { p_id: id }); },
      async wanted() { return api("/rest/v1/wanted_public?select=*&order=created_at.desc&limit=300"); },
      async addWanted(w) { if (!profile) throw err("login_required"); return rpc("create_wanted", { p: w }); },
      async report(r) { return rpc("create_report", { p: r }); },

      // Indbakke
      async sendMessage(d) { if (!profile) throw err("login_required"); return rpc("send_message", { p_listing: d.listing_id || null, p_wanted: d.wanted_id || null, p_body: d.body }); },
      async conversations() { return (await rpc("my_conversations")) || []; },
      async thread(id) { return rpc("conversation_thread", { p_id: id }); },
      async reply(id, body) { await rpc("reply_message", { p_id: id, p_body: body }); },
      async unreadCount() { if (!profile) return 0; const n = await rpc("unread_count"); return Number(n) || 0; }
    };
  }

  const b = C.backend || {};
  window.GMStore = (b.type === "supabase" && b.supabaseUrl && b.supabaseAnonKey) ? SupabaseStore(b.supabaseUrl, b.supabaseAnonKey) : LocalStore();
})();
