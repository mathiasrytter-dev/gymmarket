/* ============================================================
   Datalag – Supabase.
   Livscyklus: kladde -> afventer_betaling -> aktiv -> udloebet / solgt
   Status og pris sættes altid af databasen.
   ============================================================ */
(function () {
  const C = window.GM_CONFIG, b = C.backend || {};
  const uid = () => (window.crypto && crypto.randomUUID) ? crypto.randomUUID()
    : "id-" + Date.now().toString(36) + Math.random().toString(36).slice(2);

  window.GMTierFor = function (rows, currency, price) {
    let list = rows.filter(r => r.currency === currency);
    if (!list.length) { list = rows.filter(r => r.currency === "EUR"); price = price * (C.fxToEUR[currency] || 1); }
    return list.find(r => price >= r.min_price && (r.max_price == null || price <= r.max_price)) || list[list.length - 1];
  };

  if (!b.supabaseUrl || !b.supabaseAnonKey) {
    console.error("GymMarket: Supabase er ikke sat op i assets/config.js");
    window.GMStore = null;
    return;
  }

  const TOK = "gm_owner_tokens";
  const tokens = {
    all() { try { return JSON.parse(localStorage.getItem(TOK)) || {}; } catch (e) { return {}; } },
    set(id, t) { const a = this.all(); a[id] = t; localStorage.setItem(TOK, JSON.stringify(a)); },
    del(id) { const a = this.all(); delete a[id]; localStorage.setItem(TOK, JSON.stringify(a)); }
  };
  const err = key => { const e = new Error(key); e.i18n = key; return e; };

  const url = b.supabaseUrl.replace(/\/$/, ""), key = b.supabaseAnonKey;
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

  window.GMStore = {
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
    async wanted() { return api("/rest/v1/wanted?select=id,created_at,title,budget,area,name,contact_email,expires_at&expires_at=gt." + nowIso() + "&order=created_at.desc&limit=300"); },
    async addWanted(w) { return rpc("create_wanted", { p: w }); },
    async report(r) { return rpc("create_report", { p: r }); }
  };
})();
