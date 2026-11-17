(async function () {
  const C = window.GM_CONFIG, S = window.GMStore;
  const lang = await GMT.init();
  const t = GMT.t;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const DAY = 864e5, LOC = GMT.locale();

  const CATS = [["spring", "🤸", "#fff1e8"], ["trampolin", "🟦", "#e8f0ff"], ["airtrack", "💨", "#e9fbf2"], ["maatter", "🟧", "#fff6dc"], ["teamgym", "🏆", "#f1ebff"],
    ["ag", "🏅", "#ffeef2"], ["rg", "🎀", "#ffeefa"], ["skum", "🧽", "#eefaff"], ["reservedele", "🔧", "#f0f2f5"], ["andet", "📦", "#f3f3f3"]].map(([id, ic, c]) => ({ id, ic, c }));
  const CONDS = ["new", "like_new", "good", "fair"];
  const SELLERS = ["club", "school", "venue", "dealer", "private"];
  const ORG = ["club", "school", "venue"];
  const cat = id => CATS.find(c => c.id === id) || CATS[CATS.length - 1];
  const catName = id => t("cat_" + cat(id).id);

  /* ---------- Sprog, land og valuta ---------- */
  const [homeCountry, langCur] = C.langDefaults[lang] || ["", "EUR"];
  let dispCur = (() => { try { const c = localStorage.getItem("gm_cur"); if (C.currencies.includes(c)) return c; } catch (e) { } return langCur; })();
  const fx = c => C.fxToEUR[c] || 1;
  const convert = (amount, from, to) => amount * fx(from) / fx(to);
  const money = (n, cur) => { try { return new Intl.NumberFormat(LOC, { style: "currency", currency: cur, maximumFractionDigits: 0, minimumFractionDigits: 0 }).format(Math.round(Number(n) || 0)); } catch (e) { return Math.round(n) + " " + cur; } };
  const num = n => new Intl.NumberFormat(LOC).format(n);
  const countryCodes = Object.keys(C.countries).sort((a, b) => GMT.country(a).localeCompare(GMT.country(b), LOC));
  const flag = cc => cc ? cc.toUpperCase().replace(/./g, ch => String.fromCodePoint(127397 + ch.charCodeAt(0))) : "";

  let settings = { payments_enabled: C.paymentsEnabled, listing_days: C.listingDays, founder_free_listings: C.founderFreeListings };
  let markets = {}, tierPrices = C.tierPrices, all = [], wanted = [], activeCat = "", pendingImages = [];
  const paidIn = cc => cc && markets[cc] ? !!markets[cc].payments_enabled : !!settings.payments_enabled;
  const paidForCur = cur => {
    if (homeCountry && C.countries[homeCountry] === cur) return paidIn(homeCountry);
    return Object.keys(C.countries).filter(c => C.countries[c] === cur).some(paidIn);
  };
  const tierFor = (cur, p) => window.GMTierFor(tierPrices, cur, p);
  const tiersOf = cur => { const l = tierPrices.filter(r => r.currency === cur); return l.length ? l : tierPrices.filter(r => r.currency === "EUR"); };
  const tierLabel = r => r.min_price === 0 ? t("tier_under", { x: money(r.max_price + 1, r.currency) })
    : r.max_price == null ? t("tier_over", { x: money(r.min_price - 1, r.currency) })
      : t("tier_between", { a: money(r.min_price, r.currency), b: money(r.max_price, r.currency) });

  function toast(msg, isErr) {
    const el = $("#toast"); el.textContent = msg; el.classList.toggle("err", !!isErr); el.classList.add("show");
    clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove("show"), 3400);
  }
  const errMsg = ex => ex && ex.i18n ? t(ex.i18n) : t("err_generic");
  let lastFocus = null;
  function openModal(id) {
    lastFocus = document.activeElement;
    $$(".modal.open").forEach(m => m.classList.remove("open"));
    const m = $("#" + id); if (!m) return;
    m.classList.add("open"); document.body.style.overflow = "hidden";
    const f = m.querySelector("input:not([type=hidden]),select,textarea,button:not(.mclose)") || m.querySelector("button"); f && f.focus();
  }
  function closeModals() {
    $$(".modal.open").forEach(m => m.classList.remove("open"));
    document.body.style.overflow = "";
    if (location.hash.indexOf("#a=") === 0 || location.hash === "#import") history.replaceState(null, "", location.pathname + location.search);
    lastFocus && lastFocus.focus && lastFocus.focus();
  }
  window.GMApp = { openModal, closeModals, toast };

  /* ---------- Statisk opsætning ---------- */
  GMT.apply();
  document.title = t("meta_title");
  $("#yr").textContent = new Date().getFullYear();
  $("#ver").textContent = C.version || "";
  const legal = t("draft") + (GMT.has("terms_html") ? "" : " " + t("legal_fallback"));
  $$(".legalnote").forEach(e => e.textContent = legal);

  $("#langSel").innerHTML = C.languages.map(l => {
    let n = l; try { n = new Intl.DisplayNames([l], { type: "language" }).of(l); n = n.charAt(0).toUpperCase() + n.slice(1); } catch (e) { }
    return `<option value="${l}"${l === lang ? " selected" : ""}>${esc(n)}</option>`;
  }).join("");
  $("#footLangs").innerHTML = C.languages.map(l => `<a href="?lang=${l}" hreflang="${l}">${esc($(`#langSel option[value="${l}"]`).textContent)}</a>`).join("");
  $("#langSel").addEventListener("change", e => GMT.setLang(e.target.value));
  $("#curSel").innerHTML = C.currencies.map(c => `<option${c === dispCur ? " selected" : ""}>${c}</option>`).join("");
  $("#curSel").addEventListener("change", e => {
    dispCur = e.target.value; try { localStorage.setItem("gm_cur", dispCur); } catch (x) { }
    renderPricing(); renderGrid();
  });

  $("#cats").innerHTML = CATS.map(c => `<button type="button" class="cat" data-cat="${c.id}" aria-pressed="false"><div class="ic" aria-hidden="true">${c.ic}</div><div>${esc(catName(c.id))}</div></button>`).join("");
  $("#sCat").innerHTML = CATS.map(c => `<option value="${c.id}">${esc(catName(c.id))}</option>`).join("");
  const countryOpts = sel => countryCodes.map(c => `<option value="${c}"${c === sel ? " selected" : ""}>${flag(c)} ${esc(GMT.country(c))}</option>`).join("");
  $("#qCountry").innerHTML = `<option value="">${esc(t("all_countries"))}</option>` + countryOpts("");
  $("#sCountry").innerHTML = (homeCountry ? "" : `<option value="" selected disabled>—</option>`) + countryOpts(homeCountry);
  $("#sCurrency").innerHTML = C.currencies.map(c => `<option${c === (C.countries[homeCountry] || langCur) ? " selected" : ""}>${c}</option>`).join("");
  $("#sCond").innerHTML = CONDS.map(v => `<option value="${v}"${v === "good" ? " selected" : ""}>${esc(t("cond_" + v))}</option>`).join("");
  $("#sSeller").innerHTML = SELLERS.map(v => `<option value="${v}">${esc(t("st_" + v))}</option>`).join("");
  $("#fConds").innerHTML = CONDS.map(v => `<label class="chk"><input type="checkbox" class="fCond" value="${v}"> ${esc(t("cond_" + v))}</label>`).join("");
  $("#fSellers").innerHTML = SELLERS.map(v => `<label class="chk"><input type="checkbox" class="fSeller" value="${v}"> ${esc(t("st_" + v))}</label>`).join("");
  $("#statCountries").textContent = countryCodes.length;

  /* ---------- Data ---------- */
  try {
    const r = await S.init();
    if (r.settings) settings = Object.assign(settings, r.settings);
    if (r.markets) markets = r.markets;
    if (r.tierPrices && r.tierPrices.length) tierPrices = r.tierPrices;
  } catch (e) { toast(t("err_settings"), true); }

  async function loadListings() {
    let real = [];
    try { real = await S.listings(); } catch (e) { toast(t("err_load"), true); }
    all = real.concat(C.showDemoListings ? (window.GM_DEMO || []) : []);
    renderGrid();
  }
  async function loadWanted() {
    let real = [];
    try { real = await S.wanted(); } catch (e) { }
    wanted = real.concat(C.showDemoListings ? (window.GM_DEMO_WANTED || []) : []);
    renderWanted();
  }

  /* ---------- Priser ---------- */
  function renderPricing() {
    const paid = paidForCur(dispCur), days = settings.listing_days, rows = tiersOf(dispCur), cur = rows[0].currency;
    const minP = money(Math.min.apply(null, rows.map(r => r.amount)), cur);
    const homePaid = homeCountry ? paidIn(homeCountry) : paid;
    $("#launchBar").textContent = homePaid ? t("launch_paid", { price: minP, days }) : t("launch_free");
    $("#statPrice").textContent = homePaid ? t("from", { x: minP }) : money(0, cur);
    $("#statPriceTxt").textContent = homePaid ? t("stat_per_listing") : t("stat_to_list");
    $("#statDays").textContent = days;
    $("#fMaxLabel").textContent = t("max_price", { cur: dispCur });
    const b = $("#priceBanner"); b.classList.toggle("paid", paid);
    b.textContent = paid ? t("banner_paid", { days }) : t("banner_free");
    const addon = (C.addonFeature || {})[cur];
    $("#feeRows").innerHTML = rows.map(r => `<tr><td>${esc(tierLabel(r))}</td><td class="now">${money(paid ? r.amount : 0, cur)}</td><td class="old">${money(r.amount, cur)}</td></tr>`).join("")
      + (addon ? `<tr><td>${esc(t("addon_feature"))}</td><td class="now">${money(paid ? addon : 0, cur)}</td><td class="old">${money(addon, cur)}</td></tr>` : "")
      + `<tr><td>${esc(t("wanted_row"))}</td><td class="now">${money(0, cur)}</td><td class="old">${money(0, cur)} (${esc(t("always_free"))})</td></tr>`;
    $("#priceFoot").textContent = t("prices_shown_in", { cur });
    $("#note2").textContent = t("note2_p", { n: settings.founder_free_listings });
    const list = rows.map(r => money(r.amount, cur)).join(" / ");
    $("#faqPrice").textContent = paid ? t("a_price_paid", { list: rows.map(r => tierLabel(r) + ": " + money(r.amount, cur)).join("; ") }) : t("a_price_free", { list });
    $("#faqDays").textContent = t("a_days", { days });
  }
  function updateFeeLive() {
    const cc = $("#sCountry").value, cur = $("#sCurrency").value, p = Math.max(0, Number($("#sPrice").value) || 0);
    const tr = tierFor(cur, p), paid = paidIn(cc), days = settings.listing_days, fee = money(tr.amount, tr.currency);
    const el = $("#feeLive"); el.classList.toggle("paid", paid);
    el.innerHTML = paid ? t("fee_paid", { fee: esc(fee), days }) : t("fee_free", { fee: esc(fee), days });
    $("#sellBtn").textContent = paid ? t("btn_pay", { fee }) : t("btn_free");
  }

  /* ---------- Annoncer ---------- */
  const thumbHtml = l => (l.images && l.images[0]) ? `<img src="${esc(l.images[0])}" alt="" loading="lazy">` : `<span aria-hidden="true">${cat(l.category).ic}</span>`;
  const priceHtml = l => {
    const main = money(l.price, l.currency);
    return l.currency === dispCur ? main : `${main}<small>${esc(t("approx", { x: money(convert(l.price, l.currency, dispCur), dispCur) }))}</small>`;
  };
  function renderGrid() {
    const q = $("#q").value.trim().toLowerCase(), cc = $("#qCountry").value;
    const mv = Number($("#fMax").value), max = $("#fMax").value !== "" && mv >= 0 ? mv : Infinity;
    const conds = $$(".fCond:checked").map(x => x.value), sellers = $$(".fSeller:checked").map(x => x.value), tr = $("#fTransport").checked;
    const r = all.filter(l => (!activeCat || l.category === activeCat) && (!cc || l.country === cc)
      && convert(l.price, l.currency, dispCur) <= max
      && (!conds.length || conds.includes(l.condition)) && (!sellers.length || sellers.includes(l.seller_type)) && (!tr || l.transport)
      && (!q || [l.title, l.brand, catName(l.category), l.city, GMT.country(l.country), l.description].join(" ").toLowerCase().includes(q)));
    const s = $("#fSort").value, eur = l => convert(l.price, l.currency, "EUR");
    r.sort((a, b) => s === "low" ? eur(a) - eur(b) : s === "high" ? eur(b) - eur(a)
      : (a.demo ? 1 : 0) - (b.demo ? 1 : 0) || Date.parse(b.created_at) - Date.parse(a.created_at));
    const realCount = all.filter(l => !l.demo).length;
    $("#statCount").textContent = num(realCount || all.length);
    $("#resultCount").textContent = (r.length === 1 ? t("results_one") : t("results", { n: num(r.length) })) + (activeCat ? " " + t("results_in", { c: catName(activeCat) }) : "");
    $("#grid").innerHTML = r.length ? r.map(l => {
      const c = cat(l.category);
      return `<article class="card" tabindex="0" data-id="${esc(l.id)}" aria-label="${esc(l.title)}">
        <div class="thumb" style="background:${c.c}">${thumbHtml(l)}${l.demo ? `<span class="badge">${esc(t("example"))}</span>` : ""}${ORG.includes(l.seller_type) ? `<span class="badge v">${esc(t("st_" + l.seller_type))}</span>` : l.is_trader ? `<span class="badge v">${esc(t("trader_badge"))}</span>` : ""}<span class="badge flag">${esc(l.country)}</span></div>
        <div class="body"><h3>${esc(l.title)}</h3><div class="meta">${esc(l.city)} · ${esc(t("cond_" + l.condition))}${l.year ? " · " + esc(l.year) : ""}</div>
        <div class="price">${priceHtml(l)}</div></div></article>`;
    }).join("") : `<div class="empty">—<br><button class="btn btn-blue" type="button" data-open="mWant" style="margin-top:12px">${esc(t("wanted_new"))}</button></div>`;
  }

  async function openDetail(id) {
    let l = all.find(x => x.id === id);
    if (!l) { try { l = await S.listing(id); } catch (e) { } }
    if (!l) { toast(t("not_found"), true); return; }
    const c = cat(l.category), imgs = l.images || [];
    const save = l.new_price && l.new_price > l.price ? Math.round((1 - l.price / l.new_price) * 100) : 0;
    const subj = t("mail_subject", { t: l.title }), body = t("mail_body", { t: l.title });
    const mail = l.contact_email ? `mailto:${encodeURIComponent(l.contact_email)}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}` : "";
    const sellerBox = l.is_trader
      ? `<div class="notice trader"><b>${esc(t("trader_note"))}</b><br>${esc(t("company"))}: ${esc(l.trader_company || l.seller_name)} · ${esc(t("vat"))}: ${esc(l.trader_vat || "–")}<br>${esc(t("address"))}: ${esc(l.trader_address || "–")}</div>`
      : `<div class="notice priv">${esc(t("private_note"))}</div>`;
    $("#detail").innerHTML = `
      <div class="mhero" id="mMain">${imgs.length ? `<img src="${esc(imgs[0])}" alt="${esc(l.title)}">` : `<span aria-hidden="true">${c.ic}</span>`}</div>
      ${imgs.length > 1 ? `<div class="gal">${imgs.map((u, i) => `<button type="button" class="${i ? "" : "on"}" data-img="${esc(u)}" aria-label="${i + 1}"><img src="${esc(u)}" alt=""></button>`).join("")}</div>` : ""}
      <div class="mcontent">
        <div class="meta">${esc(catName(l.category))} · ${flag(l.country)} ${esc(l.city)}${l.postcode ? " " + esc(l.postcode) : ""}, ${esc(GMT.country(l.country))}${l.demo ? " · " + esc(t("example")) : ""}</div>
        <h2 style="margin:4px 0">${esc(l.title)}</h2>
        <div style="font-size:1.8rem;font-weight:800">${money(l.price, l.currency)} ${save > 0 ? `<span style="font-size:.9rem;color:var(--green);font-weight:600">${esc(t("under_new", { p: save }))}</span>` : ""}</div>
        ${l.currency !== dispCur ? `<div class="meta">${esc(t("approx", { x: money(convert(l.price, l.currency, dispCur), dispCur) }))}</div>` : ""}
        <div class="specs">
          <div><span>${esc(t("brand"))}</span>${esc(l.brand || "–")}</div><div><span>${esc(t("year"))}</span>${esc(l.year || "–")}</div>
          <div><span>${esc(t("condition"))}</span>${esc(t("cond_" + l.condition))}</div><div><span>${esc(t("new_price"))}</span>${l.new_price ? money(l.new_price, l.currency) : "–"}</div>
          <div><span>${esc(t("seller"))}</span>${esc(l.seller_name)} (${esc(t("st_" + l.seller_type))})</div><div><span>${esc(t("transport"))}</span>${esc(l.transport ? t("transport_yes") : t("pickup"))}</div>
        </div>
        <p style="white-space:pre-line">${esc(l.description || t("no_desc"))}</p>
        ${l.lang && l.lang !== lang ? `<p class="meta">${esc(t("listed_in", { lang: GMT.language(l.lang) }))}</p>` : ""}
        ${sellerBox}
        <div class="detail-actions" style="display:flex;gap:10px;margin-top:18px;flex-wrap:wrap">
          ${l.demo ? `<button class="btn btn-primary" type="button" data-demo>${esc(t("write_seller"))}</button>`
            : `<a class="btn btn-primary" href="${mail}">${esc(t("write_seller"))}</a>${l.contact_phone ? `<a class="btn btn-blue" href="tel:${esc(l.contact_phone.replace(/[^\d+]/g, ""))}">${esc(t("call", { x: l.contact_phone }))}</a>` : ""}`}
          <button class="btn btn-ghost" type="button" data-share="${esc(l.id)}">${esc(t("share"))}</button>
          <button class="btn btn-ghost" type="button" data-report="${esc(l.id)}">⚑ ${esc(t("report"))}</button>
        </div>
        <p class="meta" style="margin-top:14px">${esc(t("tip"))}</p>
      </div>`;
    openModal("mDetail");
    if (!l.demo) history.replaceState(null, "", location.pathname + location.search + "#a=" + encodeURIComponent(l.id));
    document.dispatchEvent(new CustomEvent("gm:detail", { detail: l }));
  }

  /* ---------- Efterlysninger ---------- */
  function renderWanted() {
    $("#wanted").innerHTML = wanted.length ? wanted.map(w => `<div class="want"><b>${esc(w.title)}</b>
      <div class="meta">${esc(w.name)} · ${esc(w.area || t("anywhere"))} · ${esc(t("budget"))}: ${esc(w.budget || t("by_agreement"))}${w.demo ? " · " + esc(t("example")) : ""}</div>
      ${w.contact_email ? `<a class="btn btn-ghost btn-sm" href="mailto:${encodeURIComponent(w.contact_email)}?subject=${encodeURIComponent(t("mail_subject", { t: w.title }))}">${esc(t("wanted_write"))}</a>`
        : `<button class="btn btn-ghost btn-sm" type="button" data-open="mSell">${esc(t("wanted_have"))}</button>`}</div>`).join("")
      : `<div class="empty">${esc(t("wanted_none"))}</div>`;
  }

  /* ---------- Mine annoncer ---------- */
  async function renderMine() {
    let mine = [];
    try { mine = await S.myListings(); } catch (e) { }
    if (!mine.length) { $("#mineList").innerHTML = `<div class="empty">${esc(t("mine_none"))}</div>`; return; }
    $("#mineList").innerHTML = mine.map(l => {
      const c = cat(l.category), left = l.expires_at ? Math.max(0, Math.ceil((Date.parse(l.expires_at) - Date.now()) / DAY)) : 0;
      let info = "", acts = "";
      if (l.status === "aktiv") {
        info = t("days_left", { n: left });
        acts = `<button class="btn btn-ghost btn-sm" type="button" data-view="${esc(l.id)}">${esc(t("view"))}</button><button class="btn btn-blue btn-sm" type="button" data-sold="${esc(l.id)}">${esc(t("mark_sold"))}</button>`;
      } else if (l.status === "afventer_betaling") {
        info = t("needs_payment", { x: money(l.fee_charged, l.fee_currency || l.currency) });
        acts = `<button class="btn btn-primary btn-sm" type="button" data-pay="${esc(l.id)}" data-fee="${Number(l.fee_charged) || 0}" data-cur="${esc(l.fee_currency || l.currency)}">${esc(t("pay"))}</button>`;
      } else if (l.status === "udloebet") {
        const tr = tierFor(l.currency, l.price);
        info = t("expired");
        acts = `<button class="btn btn-primary btn-sm" type="button" data-renew="${esc(l.id)}">${esc(paidIn(l.country) ? t("renew", { x: money(tr.amount, tr.currency) }) : t("renew_free"))}</button>`;
      } else if (l.status === "solgt") info = t("sold_msg");
      acts += `<button class="btn btn-danger btn-sm" type="button" data-del="${esc(l.id)}">${esc(t("del"))}</button>`;
      return `<div class="mine-row"><div class="mthumb" style="background:${c.c}">${thumbHtml(l)}</div>
        <div><b>${esc(l.title)}</b><div class="meta"><span class="chip ${esc(l.status)}">${esc(t("status_" + l.status))}</span>${money(l.price, l.currency)} · ${esc(l.country)} · ${esc(info)}</div></div>
        <div class="mine-actions">${acts}</div></div>`;
    }).join("");
  }

  /* ---------- Betaling ---------- */
  function openPay(id, fee, cur) {
    const canSim = typeof S.simulatePayment === "function";
    $("#payBody").innerHTML = `<h2>${esc(t("pay_h"))}</h2>
      <p style="margin:10px 0 16px">${esc(t("pay_p", { days: settings.listing_days }))}</p>
      <div class="specs" style="grid-template-columns:1fr"><div><span>${esc(t("pay_amount"))}</span><b style="font-size:1.4rem">${money(fee, cur)}</b></div></div>
      <p class="meta">${esc(t("pay_note"))}</p>
      <div style="display:flex;gap:10px;margin-top:16px;flex-wrap:wrap">
        ${canSim ? `<button class="btn btn-primary" type="button" data-simpay="${esc(id)}">${esc(t("pay_sim"))}</button>` : ""}
        <button class="btn btn-ghost" type="button" data-close>${esc(t("pay_later"))}</button></div>`;
    openModal("mPay");
  }

  /* ---------- Formularer ---------- */
  function resizeImage(file, max, q) {
    return new Promise((res, rej) => {
      const u = URL.createObjectURL(file), img = new Image();
      img.onload = () => {
        const s = Math.min(1, max / Math.max(img.width, img.height)), cv = document.createElement("canvas");
        cv.width = Math.round(img.width * s); cv.height = Math.round(img.height * s);
        cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
        URL.revokeObjectURL(u); res(cv.toDataURL("image/jpeg", q));
      };
      img.onerror = () => { URL.revokeObjectURL(u); rej(Object.assign(new Error(), { i18n: "err_img" })); };
      img.src = u;
    });
  }
  $("#sImgs").addEventListener("change", async e => {
    const files = Array.from(e.target.files || []).filter(f => f.type.indexOf("image/") === 0).slice(0, 6), local = S.mode === "local";
    pendingImages = []; $("#sellErr").textContent = "";
    try { for (const f of files) pendingImages.push(await resizeImage(f, local ? 700 : 1400, local ? .6 : .82)); }
    catch (ex) { $("#sellErr").textContent = errMsg(ex); }
    $("#previews").innerHTML = pendingImages.map(u => `<img src="${u}" alt="">`).join("");
    if ((e.target.files || []).length > 6) $("#sellErr").textContent = t("err_imgs_max");
  });
  function validate(form, errEl) {
    for (const el of $$("input,select,textarea", form)) {
      if (el.type === "hidden" || el.closest("[hidden]")) continue;
      if (!el.checkValidity()) {
        if (el.type === "checkbox") errEl.textContent = el.id === "sTerms" ? t("err_terms") : t("err_field", { f: ($(`label[for="${el.id}"]`) || el.parentElement).textContent.trim() });
        else errEl.textContent = t("err_field", { f: (($(`label[for="${el.id}"]`) || {}).textContent || "").replace(" *", "").trim() });
        el.focus(); return false;
      }
    }
    errEl.textContent = ""; return true;
  }
  function syncTrader() {
    const on = $("#sTrader").checked; $("#traderBox").hidden = !on;
    ["#sCompany", "#sVat", "#sAddress"].forEach(s => $(s).required = on);
  }
  $("#sSeller").addEventListener("change", () => { if ($("#sSeller").value === "dealer") { $("#sTrader").checked = true; syncTrader(); } });
  $("#sTrader").addEventListener("change", syncTrader);
  $("#sCountry").addEventListener("change", () => { const c = C.countries[$("#sCountry").value]; if (c) $("#sCurrency").value = c; updateFeeLive(); });
  ["#sPrice", "#sCurrency"].forEach(s => $(s).addEventListener("input", updateFeeLive));

  $("#sellForm").addEventListener("submit", async e => {
    e.preventDefault();
    const form = e.target, er = $("#sellErr"), btn = $("#sellBtn");
    if (!$("#sCountry").value) { er.textContent = t("err_field", { f: t("l_country").replace(" *", "") }); $("#sCountry").focus(); return; }
    if (!validate(form, er)) return;
    const y = Number($("#sYear").value), np = Math.round(Number($("#sNew").value)), trader = $("#sTrader").checked;
    const data = {
      lang, title: $("#sTitle").value.trim(), category: $("#sCat").value, brand: $("#sBrand").value.trim(),
      year: y >= 1970 && y <= 2030 ? Math.round(y) : null, condition: $("#sCond").value,
      price: Math.max(0, Math.round(Number($("#sPrice").value) || 0)), currency: $("#sCurrency").value, new_price: np > 0 ? np : null,
      city: $("#sCity").value.trim(), postcode: $("#sPost").value.trim(), country: $("#sCountry").value, description: $("#sDesc").value.trim(),
      seller_type: $("#sSeller").value, seller_name: $("#sName").value.trim(), contact_email: $("#sEmail").value.trim(), contact_phone: $("#sPhone").value.trim(),
      transport: $("#sTransport").checked, is_trader: trader,
      trader_company: trader ? $("#sCompany").value.trim() : null, trader_vat: trader ? $("#sVat").value.trim() : null, trader_address: trader ? $("#sAddress").value.trim() : null,
      images: pendingImages.slice()
    };
    btn.disabled = true; btn.textContent = t("creating");
    try {
      const r = await S.createListing(data);
      form.reset(); pendingImages = []; $("#previews").innerHTML = "";
      $("#sCountry").value = homeCountry || ""; $("#sCurrency").value = C.countries[homeCountry] || langCur; syncTrader();
      await Promise.all([loadListings(), renderMine()]);
      if (r.status === "afventer_betaling") openPay(r.id, r.fee_charged, r.fee_currency || data.currency);
      else { closeModals(); toast(t("t_created", { days: settings.listing_days })); $("#mine").scrollIntoView(); }
    } catch (ex) { er.textContent = errMsg(ex); }
    finally { btn.disabled = false; updateFeeLive(); }
  });

  $("#wantForm").addEventListener("submit", async e => {
    e.preventDefault();
    const form = e.target, er = $("#wantErr"), btn = $("#wantBtn");
    if (!validate(form, er)) return;
    btn.disabled = true;
    try {
      await S.addWanted({ title: $("#wTitle").value.trim(), budget: $("#wBudget").value.trim(), area: $("#wArea").value.trim(), name: $("#wName").value.trim(), contact_email: $("#wEmail").value.trim() });
      form.reset(); closeModals(); await loadWanted(); toast(t("t_wanted"));
    } catch (ex) { er.textContent = errMsg(ex); }
    finally { btn.disabled = false; }
  });

  $("#repForm").addEventListener("submit", async e => {
    e.preventDefault();
    const form = e.target, er = $("#repErr"), btn = $("#repBtn");
    if (!validate(form, er)) return;
    btn.disabled = true;
    try {
      const lid = $("#rListing").value;
      await S.report({ listing_id: lid && lid.indexOf("demo-") !== 0 ? lid : null, reason: $("#rReason").value, details: $("#rDetails").value.trim(), reporter_email: $("#rEmail").value.trim(), good_faith: true, lang });
      form.reset(); closeModals(); toast(t("t_reported"));
    } catch (ex) { er.textContent = errMsg(ex); }
    finally { btn.disabled = false; }
  });

  /* ---------- Hændelser ---------- */
  async function act(fn, okKey) {
    try { const r = await fn(); await Promise.all([loadListings(), renderMine()]); okKey && toast(t(okKey)); return r; }
    catch (ex) { toast(errMsg(ex), true); }
  }
  document.addEventListener("click", async e => {
    const el = e.target;
    const o = el.closest("[data-open]"); if (o) { e.preventDefault(); if (o.dataset.open === "mSell") updateFeeLive(); openModal(o.dataset.open); return; }
    if (el.closest("[data-close]") || el.classList.contains("modal")) { closeModals(); return; }
    const rp = el.closest("[data-report]"); if (rp) { $("#rListing").value = rp.dataset.report; openModal("mReport"); return; }
    const c = el.closest(".cat");
    if (c) {
      activeCat = activeCat === c.dataset.cat ? "" : c.dataset.cat;
      $$(".cat").forEach(x => { const on = x.dataset.cat === activeCat; x.classList.toggle("active", on); x.setAttribute("aria-pressed", on); });
      renderGrid(); $("#annoncer").scrollIntoView(); return;
    }
    const g = el.closest("[data-img]");
    if (g) { $("#mMain").innerHTML = `<img src="${esc(g.dataset.img)}" alt="">`; $$(".gal button").forEach(b => b.classList.toggle("on", b === g)); return; }
    if (el.closest("[data-demo]")) { toast(t("demo_toast")); return; }
    const sh = el.closest("[data-share]");
    if (sh) {
      const link = location.origin + location.pathname + "?lang=" + lang + "#a=" + encodeURIComponent(sh.dataset.share);
      try { await navigator.clipboard.writeText(link); toast(t("link_copied")); } catch (x) { window.prompt(t("copy_prompt"), link); }
      return;
    }
    const v = el.closest("[data-view]"); if (v) { openDetail(v.dataset.view); return; }
    const so = el.closest("[data-sold]"); if (so) { await act(() => S.markSold(so.dataset.sold), "t_sold"); return; }
    const rn = el.closest("[data-renew]");
    if (rn) { const r = await act(() => S.renew(rn.dataset.renew)); if (r && r.status === "afventer_betaling") openPay(rn.dataset.renew, r.fee_charged, r.fee_currency); else if (r) toast(t("t_renewed")); return; }
    const pay = el.closest("[data-pay]"); if (pay) { openPay(pay.dataset.pay, Number(pay.dataset.fee), pay.dataset.cur); return; }
    const sp = el.closest("[data-simpay]"); if (sp) { await act(() => S.simulatePayment(sp.dataset.simpay), "t_paid"); closeModals(); return; }
    const d = el.closest("[data-del]"); if (d) { if (confirm(t("confirm_delete"))) await act(() => S.remove(d.dataset.del), "t_deleted"); return; }
    const card = el.closest(".card"); if (card) { openDetail(card.dataset.id); return; }
    if (el.closest(".menu a")) { $("#menu").classList.remove("open"); $("#burger").setAttribute("aria-expanded", "false"); }
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeModals();
    if ((e.key === "Enter" || e.key === " ") && e.target.classList && e.target.classList.contains("card")) { e.preventDefault(); openDetail(e.target.dataset.id); }
  });
  $("#burger").addEventListener("click", () => { const m = $("#menu"); m.classList.toggle("open"); $("#burger").setAttribute("aria-expanded", m.classList.contains("open")); });
  $("#heroSearch").addEventListener("submit", e => { e.preventDefault(); renderGrid(); $("#annoncer").scrollIntoView(); });
  ["#q", "#qCountry", "#fSort", "#fMax", "#fTransport"].forEach(s => $(s).addEventListener("input", renderGrid));
  $$(".fCond,.fSeller").forEach(x => x.addEventListener("change", renderGrid));
  $("#reset").addEventListener("click", () => {
    ["#fMax", "#q", "#qCountry"].forEach(s => $(s).value = ""); $("#fSort").value = "new"; $("#fTransport").checked = false;
    $$(".fCond,.fSeller").forEach(x => x.checked = false); activeCat = "";
    $$(".cat").forEach(x => { x.classList.remove("active"); x.setAttribute("aria-pressed", "false"); }); renderGrid();
  });

  /* ---------- Start ---------- */
  renderPricing(); updateFeeLive();
  await Promise.all([loadListings(), loadWanted(), renderMine()]);
  if (location.hash.indexOf("#a=") === 0) openDetail(decodeURIComponent(location.hash.slice(3)));
  document.dispatchEvent(new Event("gm:ready"));
})();
