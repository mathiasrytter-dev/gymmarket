/* ============================================================
   Datalag. Samme interface for begge backends.
   Livscyklus: kladde -> afventer_betaling -> aktiv -> udloebet / solgt
   Betaling styres pr. land (markets). Prisen findes ud fra
   annoncens valuta og pris (tier_prices).
   ============================================================ */
(function () {
  const C = window.GM_CONFIG;
  const DAY = 864e5;
  const uid = () => (window.crypto && crypto.randomUUID) ? crypto.randomUUID()
    : "id-" + Date.now().toString(36) + Math.random().toString(36).slice(2);

  function tierFor(rows, currency, price) {
    let list = rows.filter(r => r.currency === currency);
    if (!list.length) { list = rows.filter(r => r.currency === "EUR"); price = price * (C.fxToEUR[currency] || 1); }
    return list.find(r => price >= r.min_price && (r.max_price == null || price <= r.max_price)) || list[list.length - 1];
  }
  window.GMTierFor = tierFor;

  const TOK = "gm_owner_tokens";
  const tokens = {
    all() { try { return JSON.parse(localStorage.getItem(TOK)) || {}; } catch (e) { return {}; } },
    set(id, t) { const a = this.all(); a[id] = t; localStorage.setItem(TOK, JSON.stringify(a)); },
    del(id) { const a = this.all(); delete a[id]; localStorage.setItem(TOK, JSON.stringify(a)); }
  };
  const err = key => { const e = new Error(key); e.i18n = key; return e; };

  /* ---------- LOCAL (prototype) ---------- */
  function LocalStore() {
    const KEY = "gm_local_db_v2";
    let db = null;
    try { db = JSON.parse(localStorage.getItem(KEY)); } catch (e) { }
    db = db || { listings: [], wanted: [], payments: [], reports: [] };
    db.reports = db.reports || [];
    const save = () => { try { localStorage.setItem(KEY, JSON.stringify(db)); return true; } catch (e) { return false; } };
    const forcePaid = new URLSearchParams(location.search).get("betaling") === "1";
    const settings = { payments_enabled: forcePaid || C.paymentsEnabled, listing_days: C.listingDays, founder_free_listings: C.founderFreeListings };
    const markets = {};
    Object.keys(C.countries).forEach(c => {
      const m = C.markets[c] || {};
      markets[c] = { payments_enabled: forcePaid || (m.payments_enabled != null ? m.payments_enabled : C.paymentsEnabled) };
    });
    const paidIn = c => (markets[c] || settings).payments_enabled;
    const activate = l => { l.status = "aktiv"; l.published_at = new Date().toISOString(); l.expires_at = new Date(Date.now() + settings.listing_days * DAY).toISOString(); };
    const sweep = () => { const now = Date.now(); db.listings.forEach(l => { if (l.status === "aktiv" && Date.parse(l.expires_at) < now) l.status = "udloebet"; }); };
    const strip = l => { const r = Object.assign({}, l); delete r.owner_token; return r; };
    const own = id => { const l = db.listings.find(x => x.id === id); if (!l || tokens.all()[id] !== l.owner_token) throw err("no_access"); return l; };
    const price = l => {
      const t = tierFor(C.tierPrices, l.currency, l.price);
      l.price_tier = t.tier;
      if (paidIn(l.country)) { l.status = "afventer_betaling"; l.fee_charged = t.amount; l.fee_currency = t.currency; }
      else { l.fee_charged = 0; l.fee_currency = t.currency; activate(l); }
    };
    return {
      mode: "local",
      async init() { sweep(); save(); return { settings, markets, tierPrices: C.tierPrices }; },
      async listings() { sweep(); return db.listings.filter(l => l.status === "aktiv").map(strip); },
      async listing(id) { const l = db.listings.find(x => x.id === id && x.status === "aktiv"); return l ? strip(l) : null; },
      async createListing(data) {
        const token = uid();
        const l = Object.assign({}, data, { id: uid(), created_at: new Date().toISOString(), owner_token: token, status: "kladde", published_at: null, expires_at: null });
        price(l);
        db.listings.unshift(l);
        if (!save()) { db.listings.shift(); throw err("err_storage"); }
        tokens.set(l.id, token);
        return { id: l.id, status: l.status, fee_charged: l.fee_charged, fee_currency: l.fee_currency };
      },
      async myListings() { sweep(); const tk = tokens.all(); return db.listings.filter(l => tk[l.id] === l.owner_token).map(strip); },
      async markSold(id) { own(id).status = "solgt"; save(); },
      async renew(id) { const l = own(id); price(l); save(); return { status: l.status, fee_charged: l.fee_charged, fee_currency: l.fee_currency }; },
      async remove(id) { own(id); db.listings = db.listings.filter(x => x.id !== id); tokens.del(id); save(); },
      async simulatePayment(id) {
        const l = own(id);
        db.payments.push({ id: uid(), listing_id: id, amount: l.fee_charged, currency: l.fee_currency, provider: "demo", created_at: new Date().toISOString() });
        activate(l); save();
      },
      async sourceUrl(id) { const l = db.listings.find(x => x.id === id); return l ? l.source_url || null : null; },
      async wanted() { const now = Date.now(); return db.wanted.filter(w => Date.parse(w.expires_at) > now); },
      async addWanted(w) {
        const r = Object.assign({}, w, { id: uid(), created_at: new Date().toISOString(), expires_at: new Date(Date.now() + C.wantedDays * DAY).toISOString() });
        db.wanted.unshift(r); save(); return r;
      },
      async report(r) { db.reports.push(Object.assign({ id: uid(), created_at: new Date().toISOString(), status: "ny" }, r)); save(); }
    };
  }

  /* ---------- SUPABASE (drift) ---------- */
  function SupabaseStore(url, key) {
    url = url.replace(/\/$/, "");
    const COLS = "id,created_at,lang,title,category,brand,year,condition,price,currency,new_price,city,postcode,country,seller_type,seller_name,contact_email,contact_phone,description,transport,images,is_trader,trader_company,trader_vat,trader_address,source_url,status,price_tier,fee_charged,fee_currency,published_at,expires_at";
    const nowIso = () => encodeURIComponent(new Date().toISOString());
    async function api(path, opts) {
      opts = opts || {};
      const r = await fetch(url + path, Object.assign({}, opts, {
        headers: Object.assign({ apikey: key, Authorization: "Bearer " + key, "Content-Type": "application/json" }, opts.headers || {})
      }));
      const txt = await r.text();
      if (!r.ok) { const e = new Error(txt.slice(0, 200)); if (/Ingen adgang/.test(txt)) e.i18n = "no_access"; throw e; }
      return txt ? JSON.parse(txt) : null;
    }
    const rpc = (fn, args) => api("/rest/v1/rpc/" + fn, { method: "POST", body: JSON.stringify(args) });
    async function upload(dataUrl) {
      const blob = await (await fetch(dataUrl)).blob();
      const name = uid() + ".jpg";
      const r = await fetch(url + "/storage/v1/object/annoncebilleder/" + name, {
        method: "POST", headers: { apikey: key, Authorization: "Bearer " + key, "Content-Type": "image/jpeg" }, body: blob
      });
      if (!r.ok) throw err("err_img");
      return url + "/storage/v1/object/public/annoncebilleder/" + name;
    }
    const tok = id => tokens.all()[id];
    return {
      mode: "supabase",
      async init() {
        const res = await Promise.all([
          api("/rest/v1/settings?select=payments_enabled,listing_days,founder_free_listings&id=eq.1"),
          api("/rest/v1/markets?select=country,payments_enabled"),
          api("/rest/v1/tier_prices?select=tier,currency,min_price,max_price,amount&order=currency,min_price")
        ]);
        const markets = {}; res[1].forEach(m => markets[m.country] = m);
        return { settings: res[0][0], markets, tierPrices: res[2] };
      },
      async listings() { return api("/rest/v1/listings?select=" + COLS + "&status=eq.aktiv&expires_at=gt." + nowIso() + "&order=created_at.desc&limit=1000"); },
      async listing(id) { const r = await api("/rest/v1/listings?select=" + COLS + "&id=eq." + encodeURIComponent(id)); return r[0] || null; },
      async createListing(data) {
        const images = [];
        for (const d of data.images || []) images.push(await upload(d));
        const token = uid();
        const r = await rpc("create_listing", { p: Object.assign({}, data, { images }), p_token: token });
        tokens.set(r.id, token);
        return r;
      },
      async myListings() {
        const tk = tokens.all(), ids = Object.keys(tk);
        if (!ids.length) return [];
        return rpc("my_listings", { p_ids: ids, p_tokens: ids.map(i => tk[i]) });
      },
      async markSold(id) { await rpc("mark_listing_sold", { p_id: id, p_token: tok(id) }); },
      async renew(id) { return rpc("renew_listing", { p_id: id, p_token: tok(id) }); },
      async remove(id) { await rpc("delete_listing", { p_id: id, p_token: tok(id) }); tokens.del(id); },
      simulatePayment: null, // erstattes af Stripe-webhook i betalingsfasen
      async sourceUrl(id) { try { const r = await api("/rest/v1/listings?select=source_url&id=eq." + encodeURIComponent(id)); return r[0] ? r[0].source_url : null; } catch (e) { return null; } },
      async wanted() { return api("/rest/v1/wanted?select=id,created_at,title,budget,area,name,contact_email,expires_at&expires_at=gt." + nowIso() + "&order=created_at.desc&limit=300"); },
      async addWanted(w) { return rpc("create_wanted", { p: w }); },
      async report(r) { return rpc("create_report", { p: r }); }
    };
  }

  const b = C.backend || {};
  window.GMStore = (b.type === "supabase" && b.supabaseUrl && b.supabaseAnonKey) ? SupabaseStore(b.supabaseUrl, b.supabaseAnonKey) : LocalStore();
})();
