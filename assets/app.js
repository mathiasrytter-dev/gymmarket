(async function () {
  const C = window.GM_CONFIG, S = window.GMStore, Reg = window.GMReg;
  const lang = await GMT.init();
  const t = GMT.t;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const DAY = 864e5, LOC = GMT.locale();

  const CATS = [["trampolin", "#1f5eff", "#eef3ff"], ["airtrack", "#0c8f6a", "#e9f8f2"], ["teamgym", "#6f42c1", "#f3eeff"],
    ["ag", "#c2255c", "#fff0f5"], ["rg", "#d6336c", "#fff0f7"], ["skum", "#e8590c", "#fff4ec"], ["andet", "#5c6b7a", "#f3f5f7"]].map(([id, k, c]) => ({ id, k, c }));
  const CONDS = ["new", "like_new", "good", "fair"];
  const SELLERS = ["club", "school", "venue", "dealer", "private"];
  const cat = id => CATS.find(c => c.id === id) || CATS[CATS.length - 1];
  const catName = id => t("cat_" + cat(id).id);
  const vcheck = s => `<span class="vcheck" title="${esc(t("verified"))}">${GMIcon("check", s || 12, 3)}</span>`;
  const verifiedVia = o => o && o.org_country ? t("verified_via", { label: Reg.label(o.org_country, o.org_id_type || "company") || t("id_" + (o.org_id_type || "company")), country: GMT.country(o.org_country) }) : t("verified");
  const initials = n => String(n || "?").trim().split(/\s+/).slice(0, 2).map(w => w.charAt(0)).join("").toUpperCase() || "?";
  const av = (url, name, s) => { s = s || 32; return url
    ? `<img class="av" src="${esc(url)}" alt="" width="${s}" height="${s}" style="width:${s}px;height:${s}px">`
    : `<span class="av av-i" style="width:${s}px;height:${s}px;font-size:${Math.round(s * .4)}px" aria-hidden="true">${esc(initials(name))}</span>`; };
  const fmtWhen = iso => { const d = new Date(iso), same = d.toDateString() === new Date().toDateString();
    return new Intl.DateTimeFormat(LOC, same ? { hour: "2-digit", minute: "2-digit" } : { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(d); };

  const [homeCountry, langCur] = C.langDefaults[lang] || ["", "EUR"];
  let dispCur = (() => { try { const c = localStorage.getItem("gm_cur"); if (C.currencies.includes(c)) return c; } catch (e) { } return langCur; })();
  const fx = c => C.fxToEUR[c] || 1;
  const convert = (a, from, to) => a * fx(from) / fx(to);
  const money = (n, cur) => { try { return new Intl.NumberFormat(LOC, { style: "currency", currency: cur, maximumFractionDigits: 0, minimumFractionDigits: 0 }).format(Math.round(Number(n) || 0)); } catch (e) { return Math.round(n) + " " + cur; } };
  const num = n => new Intl.NumberFormat(LOC).format(n);
  const countryCodes = Object.keys(C.countries).sort((a, b) => GMT.country(a).localeCompare(GMT.country(b), LOC));

  let settings = { listing_days: C.listingDays }, all = [], wanted = [], activeCat = "", pendingImages = [];
  let afterAuth = null, verifyEmail = "", unread = 0, inboxState = { view: "list" }, lastDetail = null, cooldown = 0, cdTimer = null;

  function toast(msg, isErr) {
    const el = $("#toast"); el.textContent = msg; el.classList.toggle("err", !!isErr); el.classList.add("show");
    clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove("show"), 3600);
  }
  const errMsg = ex => ex && ex.i18n ? t(ex.i18n, ex.vars) : t("err_generic");
  let lastFocus = null;
  function openModal(id) {
    lastFocus = document.activeElement;
    $$(".modal.open").forEach(m => m.classList.remove("open"));
    const m = $("#" + id); if (!m) return;
    m.classList.add("open"); document.body.style.overflow = "hidden";
    const f = m.querySelector(".mcontent > div:not([hidden]) input:not([type=hidden]), form input:not([type=hidden]):not([type=checkbox]), form textarea, select") || m.querySelector("button:not(.mclose)");
    f && f.focus();
  }
  function closeModals() {
    $$(".modal.open").forEach(m => m.classList.remove("open"));
    document.body.style.overflow = "";
    if (location.hash.indexOf("#a=") === 0) history.replaceState(null, "", location.pathname + location.search);
    if (inboxState.view !== "list") inboxState = { view: "list" };
    lastFocus && lastFocus.focus && lastFocus.focus();
    refreshUnread();
  }

  /* ---------- Statisk opsætning ---------- */
  GMT.apply();
  document.title = t("meta_title");

  const CO = C.company || {};
  const coName = CO.legalName || "GymMarket", coMail = CO.email || C.site.email, missing = t("co_missing");
  $("#copyLine").textContent = ["© " + new Date().getFullYear() + " " + coName, "gymmarket.dk", CO.cvr ? "CVR " + CO.cvr : "", CO.address || ""].filter(Boolean).join(" · ");
  $("#footMail").textContent = coMail; $("#footMail").href = "mailto:" + coMail;
  const coVars = { co_name: esc(coName), co_cvr: esc(CO.cvr || missing), co_address: esc(CO.address || missing), co_email: esc(coMail) };
  $$("[data-legal]").forEach(el => el.innerHTML = t(el.dataset.legal, coVars));
  $$(".legalnote").forEach(e => e.textContent = t("draft") + (GMT.has("terms_html") ? "" : " " + t("legal_fallback")));

  $("#langSel").innerHTML = C.languages.map(l => {
    let n = l; try { n = new Intl.DisplayNames([l], { type: "language" }).of(l); n = n.charAt(0).toUpperCase() + n.slice(1); } catch (e) { }
    return `<option value="${l}"${l === lang ? " selected" : ""}>${esc(n)}</option>`;
  }).join("");
  $("#footLangs").innerHTML = C.languages.map(l => `<a href="?lang=${l}" hreflang="${l}">${esc($(`#langSel option[value="${l}"]`).textContent)}</a>`).join("");
  $("#langSel").addEventListener("change", e => GMT.setLang(e.target.value));
  $("#curSel").innerHTML = C.currencies.map(c => `<option${c === dispCur ? " selected" : ""}>${c}</option>`).join("");
  $("#curSel").addEventListener("change", e => { dispCur = e.target.value; try { localStorage.setItem("gm_cur", dispCur); } catch (x) { } $("#fMaxLabel").textContent = t("max_price", { cur: dispCur }); renderGrid(); });
  $("#fMaxLabel").textContent = t("max_price", { cur: dispCur });
  $("#faqDays").textContent = t("a_days", { days: C.listingDays });

  $("#cats").innerHTML = CATS.map(c => `<button type="button" class="cat" data-cat="${c.id}" aria-pressed="false"><div class="ic" style="--k:${c.k};--b:${c.c}">${GMIcon(c.id, 28)}</div><div>${esc(catName(c.id))}</div></button>`).join("");
  $("#sCat").innerHTML = CATS.map(c => `<option value="${c.id}">${esc(catName(c.id))}</option>`).join("");
  const countryOpts = sel => countryCodes.map(c => `<option value="${c}"${c === sel ? " selected" : ""}>${esc(GMT.country(c))}</option>`).join("");
  const blankOpt = homeCountry ? "" : `<option value="" selected disabled>—</option>`;
  $("#qCountry").innerHTML = `<option value="">${esc(t("all_countries"))}</option>` + countryOpts("");
  $("#sCountry").innerHTML = blankOpt + countryOpts(homeCountry);
  $("#suCountry").innerHTML = blankOpt + countryOpts(homeCountry);
  $("#sCurrency").innerHTML = C.currencies.map(c => `<option${c === (C.countries[homeCountry] || langCur) ? " selected" : ""}>${c}</option>`).join("");
  $("#sCond").innerHTML = CONDS.map(v => `<option value="${v}"${v === "good" ? " selected" : ""}>${esc(t("cond_" + v))}</option>`).join("");
  $("#suType").innerHTML = SELLERS.map(v => `<option value="${v}">${esc(t("st_" + v))}</option>`).join("");
  $("#fConds").innerHTML = CONDS.map(v => `<label class="chk"><input type="checkbox" class="fCond" value="${v}"> ${esc(t("cond_" + v))}</label>`).join("");
  $("#fSellers").innerHTML = SELLERS.map(v => `<label class="chk"><input type="checkbox" class="fSeller" value="${v}"> ${esc(t("st_" + v))}</label>`).join("");

  try { const r = await S.init(); if (r.settings) settings = Object.assign(settings, r.settings); } catch (e) { toast(t("err_load"), true); }

  async function loadListings() { try { all = await S.listings(); } catch (e) { all = []; toast(t("err_load"), true); } renderGrid(); }
  async function loadWanted() { try { wanted = await S.wanted(); } catch (e) { wanted = []; } renderWanted(); }

  /* ---------- Bruger og ulæste beskeder ---------- */
  const user = () => S.user();
  function renderUserBtn() {
    const u = user(), b = $("#userBtn");
    if (!u) { b.innerHTML = `${GMIcon("user", 18)}<span class="uname">${esc(t("login"))}</span>`; return; }
    const nm = (u.user_type !== "private" && u.org_name) ? u.org_name : u.name;
    b.innerHTML = `${av(u.avatar_url, nm, 26)}<span class="uname">${esc(nm.length > 18 ? nm.slice(0, 17) + "…" : nm)}</span>${u.org_status === "approved" ? vcheck() : ""}${unread > 0 ? `<span class="udot" aria-hidden="true"></span>` : ""}`;
  }
  function updateBadges() {
    const b = $("#inboxBadge"); b.hidden = unread < 1; b.textContent = unread > 99 ? "99+" : String(unread);
    b.setAttribute("aria-label", unread + " " + t("inbox")); renderUserBtn();
  }
  async function refreshUnread() {
    if (!user()) unread = 0; else { try { unread = await S.unreadCount(); } catch (e) { } }
    updateBadges();
  }
  setInterval(() => { if (!document.hidden && user()) refreshUnread(); }, 60000);

  function showPane(id) { ["paneLogin", "paneSignup", "paneVerify", "paneLink"].forEach(p => $("#" + p).hidden = p !== id); $$(".form-err", $("#mAuth")).forEach(e => e.textContent = ""); }
  function openAuth(pane, reasonKey) {
    showPane(pane || "paneLogin");
    const r = $("#authReason"); r.hidden = !reasonKey; if (reasonKey) r.textContent = t(reasonKey);
    openModal("mAuth");
  }
  function requireUser(then) {
    const u = user();
    if (!u) { afterAuth = then; openAuth("paneLogin", "login_required"); return; }
    if (!u.email_verified) { afterAuth = then; doResendAndShow(u.email); return; }
    then();
  }
  async function doResendAndShow(email) { try { const r = await S.resend(email); showVerify(Object.assign({ needsCode: true, email }, r)); } catch (ex) { showVerify({ needsCode: true, email }); } }
  function startCooldown(sec) {
    cooldown = sec; clearInterval(cdTimer);
    const tick = () => { const b = $("#resendBtn"); if (cooldown > 0) { b.disabled = true; b.textContent = t("resend_in", { s: cooldown }); cooldown--; } else { clearInterval(cdTimer); b.disabled = false; b.textContent = t("resend"); } };
    tick(); cdTimer = setInterval(tick, 1000);
  }
  function showVerify(r) {
    verifyEmail = r.email;
    if (r.needsLink) { $("#linkText").textContent = t("verify_link_p", { email: r.email }); showPane("paneLink"); }
    else {
      $("#verifyText").textContent = t("verify_p", { email: r.email });
      const d = $("#verifyDemo"); d.hidden = !r.demoCode; if (r.demoCode) d.textContent = t("verify_demo", { code: r.demoCode });
      $("#verifySpam").hidden = !!r.demoCode;
      showPane("paneVerify"); $("#vCode").value = ""; if (!r.demoCode) startCooldown(60); else { clearInterval(cdTimer); $("#resendBtn").disabled = false; $("#resendBtn").textContent = t("resend"); }
    }
    $("#authReason").hidden = true;
    if (!$("#mAuth").classList.contains("open")) openModal("mAuth");
    setTimeout(() => (r.needsLink ? null : $("#vCode").focus()), 50);
  }
  async function onLoggedIn(u) {
    renderUserBtn(); closeModals(); toast(t("t_welcome", { name: u.name }));
    await Promise.all([renderMine(), loadListings().then(loadWanted), refreshUnread()]);
    if (afterAuth) { const f = afterAuth; afterAuth = null; f(); }
  }

  /* ---------- Profilbillede ---------- */
  function squareImage(file, size) {
    return new Promise((res, rej) => {
      if (!file || file.type.indexOf("image/") !== 0) return rej(Object.assign(new Error(), { i18n: "avatar_err" }));
      const u = URL.createObjectURL(file), img = new Image();
      img.onload = () => {
        const s = Math.min(img.width, img.height), cv = document.createElement("canvas"); cv.width = cv.height = size;
        cv.getContext("2d").drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, size, size);
        URL.revokeObjectURL(u); res(cv.toDataURL("image/jpeg", .85));
      };
      img.onerror = () => { URL.revokeObjectURL(u); rej(Object.assign(new Error(), { i18n: "avatar_err" })); };
      img.src = u;
    });
  }
  async function saveAvatar(file) {
    try { await S.setAvatar(file ? await squareImage(file, 256) : null); toast(t(file ? "avatar_saved" : "avatar_removed")); renderProfile(); renderUserBtn(); loadListings().then(loadWanted); }
    catch (ex) { toast(ex && ex.i18n ? t(ex.i18n) : t("avatar_err"), true); }
  }

  /* ---------- Profil og verificering (alle 31 lande) ---------- */
  function renderProfile() {
    const u = user(); if (!u) return;
    const nm = (u.user_type !== "private" && u.org_name) ? u.org_name : u.name;
    const orgCls = { none: "none", pending: "pending", approved: "ok", rejected: "no" }[u.org_status] || "none";
    const canRequest = u.org_status === "none" || u.org_status === "rejected";
    const submitted = u.org_country && u.org_number ? t("org_submitted", { label: Reg.label(u.org_country, u.org_id_type), number: u.org_number, country: GMT.country(u.org_country) }) : "";
    const defType = u.user_type === "private" ? "company" : (u.is_trader || u.user_type === "dealer") ? "vat" : (u.user_type === "club" ? "assoc" : "company");
    $("#profileBody").innerHTML = `
      <div class="avrow">${av(u.avatar_url, nm, 72)}
        <div><h2 style="font-size:1.35rem">${esc(u.name)} ${u.org_status === "approved" ? vcheck(14) : ""}</h2>
        <div class="meta">${esc(u.org_name ? u.org_name + " · " : "")}${esc(t("st_" + u.user_type))}</div>
        <div class="avbtns" style="margin-top:8px"><label class="btn btn-ghost btn-sm" for="avFile" style="cursor:pointer">${esc(t(u.avatar_url ? "avatar_change" : "avatar_add"))}</label>
        <input type="file" id="avFile" accept="image/*" hidden>${u.avatar_url ? `<button class="btn btn-danger btn-sm" type="button" id="avRemove">${esc(t("avatar_remove"))}</button>` : ""}</div></div></div>
      <p class="hint" style="margin:-4px 0 14px">${esc(t("avatar_hint"))}</p>
      <div class="prof-rows">
        <div><span>${esc(t("l_email").replace(" *", ""))}</span><b>${esc(u.email)} <span class="chip ${u.email_verified ? "ok" : "no"}" style="margin:0 0 0 4px">${esc(t(u.email_verified ? "email_ok" : "email_no"))}</span></b></div>
        <div><span>${esc(t("country"))}</span><b>${esc(GMT.country(u.country))}</b></div>
        ${u.phone ? `<div><span>${esc(t("l_phone"))}</span><b>${esc(u.phone)}</b></div>` : ""}
        <div><span>${esc(t("verified"))}</span><span class="chip ${orgCls}">${esc(t("org_" + u.org_status))}</span></div>
        ${submitted ? `<div><span></span><small>${esc(submitted)}</small></div>` : ""}
      </div>
      <p class="hint" style="margin-bottom:14px">${esc(t("contact_note"))}</p>
      ${canRequest ? `<h3>${esc(t("org_h"))}</h3><p style="margin-bottom:12px">${esc(t("org_p"))}</p>
        <form id="orgForm" class="form-grid" novalidate>
          <div><label class="l" for="oCountry">${esc(t("l_org_country"))}</label><select id="oCountry" required>${countryOpts(u.org_country || u.country || homeCountry)}</select></div>
          <div><label class="l" for="oType">${esc(t("l_id_type"))}</label><select id="oType" required></select></div>
          <div class="full"><label class="l" for="oNum" id="oNumLabel">${esc(t("l_org_number"))}</label><input id="oNum" required maxlength="40" autocomplete="off"><div class="hint" id="oHint" aria-live="polite"></div></div>
          <div class="full"><label class="l" for="oNote">${esc(t("l_org_note"))}</label><textarea id="oNote" maxlength="500" style="min-height:60px"></textarea></div>
          <p class="full hint" id="oVies"></p>
          <div class="full form-err" id="orgErr"></div>
          <div class="full"><button class="btn btn-blue" type="submit" style="width:100%">${esc(t("btn_request"))}</button></div>
        </form>` : ""}
      ${u.org_status === "pending" && typeof S.approveDemo === "function" ? `<div class="notice demo" style="margin-top:4px">${esc(t("org_pending"))} – <button class="link" type="button" id="approveDemo">${esc(t("approve_demo"))}</button></div>` : ""}
      <div style="display:flex;gap:10px;margin-top:18px;flex-wrap:wrap">
        <button class="btn btn-ghost" type="button" data-inbox>${esc(t("inbox"))}${unread > 0 ? ` <span class="nbadge">${unread}</span>` : ""}</button>
        <a class="btn btn-ghost" href="#mine" data-close>${esc(t("nav_mine"))}</a>
        <button class="btn btn-danger" type="button" id="logoutBtn">${esc(t("logout"))}</button>
      </div>`;
    $("#avFile").addEventListener("change", e => { const f = e.target.files && e.target.files[0]; if (f) saveAvatar(f); });
    const f = $("#orgForm"); if (!f) return;
    const oC = $("#oCountry"), oT = $("#oType"), oN = $("#oNum"), oH = $("#oHint");
    function fillTypes(keep) {
      const cc = oC.value, types = Reg.types(cc), cur = keep && types.includes(oT.value) ? oT.value : (types.includes(defType) ? defType : types[0]);
      oT.innerHTML = types.map(ty => { const a = t("id_" + ty), b = Reg.label(cc, ty); return `<option value="${ty}"${ty === cur ? " selected" : ""}>${esc(a === b || !b ? a : a + " – " + b)}</option>`; }).join("");
      $("#oVies").textContent = t("vies_note");
      syncNum();
    }
    function syncNum() {
      const cc = oC.value, ty = oT.value, lab = Reg.label(cc, ty), ex = Reg.example(cc, ty);
      $("#oNumLabel").textContent = (lab || t("l_org_number").replace(" *", "")) + " *";
      oN.placeholder = ex;
      const v = oN.value.trim();
      if (!v) { oH.className = "hint"; oH.textContent = t("id_hint", { ex }); return; }
      const ok = Reg.check(cc, ty, v);
      oH.className = "hint " + (ok ? "ok" : "bad");
      oH.textContent = ok ? "✓ " + t("format_ok", { label: lab }) : t("err_id_format", { label: lab, ex });
    }
    oC.addEventListener("change", () => fillTypes(true)); oT.addEventListener("change", syncNum); oN.addEventListener("input", syncNum);
    fillTypes(false);
    f.addEventListener("submit", async e => {
      e.preventDefault(); if (!validate(f, $("#orgErr"))) return;
      try {
        await S.requestOrgVerification({ country: oC.value, type: oT.value, number: oN.value.trim(), note: $("#oNote").value.trim() });
        toast(t("t_requested")); renderProfile(); renderUserBtn();
      } catch (ex) { $("#orgErr").textContent = errMsg(ex); }
    });
  }

  /* ---------- Annoncer ---------- */
  const thumbHtml = (l, size) => (l.images && l.images[0]) ? `<img src="${esc(l.images[0])}" alt="" loading="lazy">` : `<span class="ph" style="--k:${cat(l.category).k}">${GMIcon(cat(l.category).id, size || 56)}</span>`;
  const priceHtml = l => { const m = money(l.price, l.currency); return l.currency === dispCur ? m : `${m}<small>${esc(t("approx", { x: money(convert(l.price, l.currency, dispCur), dispCur) }))}</small>`; };
  function renderGrid() {
    const q = $("#q").value.trim().toLowerCase(), cc = $("#qCountry").value;
    const mv = Number($("#fMax").value), max = $("#fMax").value !== "" && mv >= 0 ? mv : Infinity;
    const conds = $$(".fCond:checked").map(x => x.value), sellers = $$(".fSeller:checked").map(x => x.value);
    const tr = $("#fTransport").checked, ver = $("#fVerified").checked;
    const r = all.filter(l => (!activeCat || cat(l.category).id === activeCat) && (!cc || l.country === cc)
      && convert(l.price, l.currency, dispCur) <= max && (!conds.length || conds.includes(l.condition))
      && (!sellers.length || sellers.includes(l.seller_type)) && (!tr || l.transport) && (!ver || l.seller_verified)
      && (!q || [l.title, l.brand, catName(l.category), l.city, GMT.country(l.country), l.description, l.seller_name].join(" ").toLowerCase().includes(q)));
    const s = $("#fSort").value, eur = l => convert(l.price, l.currency, "EUR");
    r.sort((a, b) => s === "low" ? eur(a) - eur(b) : s === "high" ? eur(b) - eur(a) : Date.parse(b.created_at) - Date.parse(a.created_at));
    $("#resultCount").textContent = all.length ? (r.length === 1 ? t("results_one") : t("results", { n: num(r.length) })) + (activeCat ? " " + t("results_in", { c: catName(activeCat) }) : "") : "";
    $("#grid").innerHTML = r.length ? r.map(l => {
      const c = cat(l.category);
      return `<article class="card" tabindex="0" data-id="${esc(l.id)}" aria-label="${esc(l.title)}">
        <div class="thumb" style="background:${c.c}">${thumbHtml(l)}${l.seller_verified ? `<span class="badge v" title="${esc(verifiedVia(l))}">${GMIcon("check", 11, 3)} ${esc(t("verified"))}</span>` : ""}<span class="badge flag">${esc(l.country)}</span></div>
        <div class="body"><h3>${esc(l.title)}</h3><div class="meta">${esc(l.city)} · ${esc(t("cond_" + l.condition))}${l.year ? " · " + esc(l.year) : ""}</div>
        <div class="meta cardseller">${av(l.seller_avatar, l.seller_name, 18)}<span>${esc(l.seller_name || "")} · ${esc(t("st_" + l.seller_type))}</span></div>
        <div class="price">${priceHtml(l)}</div></div></article>`;
    }).join("") : all.length
      ? `<div class="empty">${esc(t("no_results"))}<br><button class="btn btn-blue" type="button" data-want style="margin-top:12px">${esc(t("wanted_new"))}</button></div>`
      : `<div class="empty">${esc(t("empty_first"))}<br><button class="btn btn-primary" type="button" data-sell style="margin-top:12px">${esc(t("nav_sell"))}</button></div>`;
  }

  async function openDetail(id) {
    let l = all.find(x => x.id === id);
    if (!l) { try { l = await S.listing(id); } catch (e) { } }
    if (!l) { toast(t("not_found"), true); return; }
    lastDetail = l;
    const c = cat(l.category), imgs = l.images || [], u = user();
    const save = l.new_price && l.new_price > l.price ? Math.round((1 - l.price / l.new_price) * 100) : 0;
    const isOwn = !!(u && l.seller_id && l.seller_id === u.id);
    const sellerBox = l.is_trader
      ? `<div class="notice trader"><b>${esc(t("trader_note"))}</b><br>${esc(t("company"))}: ${esc(l.trader_company || l.seller_name)} · ${esc(t("vat"))}: ${esc(l.trader_vat || "–")}<br>${esc(t("address"))}: ${esc(l.trader_address || "–")}</div>`
      : `<div class="notice priv">${esc(t("private_note"))}</div>`;
    $("#detail").innerHTML = `
      <div class="mhero" id="mMain" style="background:${c.c}">${imgs.length ? `<img src="${esc(imgs[0])}" alt="${esc(l.title)}">` : thumbHtml(l, 120)}</div>
      ${imgs.length > 1 ? `<div class="gal">${imgs.map((x, i) => `<button type="button" class="${i ? "" : "on"}" data-img="${esc(x)}" aria-label="${i + 1}"><img src="${esc(x)}" alt=""></button>`).join("")}</div>` : ""}
      <div class="mcontent">
        <div class="meta">${esc(catName(l.category))} · ${esc(l.city)}${l.postcode ? " " + esc(l.postcode) : ""}, ${esc(GMT.country(l.country))}</div>
        <h2 style="margin:4px 0">${esc(l.title)}</h2>
        <div style="font-size:1.8rem;font-weight:800">${money(l.price, l.currency)} ${save > 0 ? `<span style="font-size:.9rem;color:var(--green);font-weight:600">${esc(t("under_new", { p: save }))}</span>` : ""}</div>
        ${l.currency !== dispCur ? `<div class="meta">${esc(t("approx", { x: money(convert(l.price, l.currency, dispCur), dispCur) }))}</div>` : ""}
        <div class="specs">
          <div><span>${esc(t("brand"))}</span>${esc(l.brand || "–")}</div><div><span>${esc(t("year"))}</span>${esc(l.year || "–")}</div>
          <div><span>${esc(t("condition"))}</span>${esc(t("cond_" + l.condition))}</div><div><span>${esc(t("new_price"))}</span>${l.new_price ? money(l.new_price, l.currency) : "–"}</div>
          <div><span>${esc(t("seller"))}</span><div class="sellerline">${av(l.seller_avatar, l.seller_name, 32)}<div>${esc(l.seller_name)} ${l.seller_verified ? vcheck() : ""}<br><small>${esc(t("st_" + l.seller_type))}</small></div></div></div>
          <div><span>${esc(t("transport"))}</span>${esc(l.transport ? t("transport_yes") : t("pickup"))}</div>
        </div>
        <p style="white-space:pre-line">${esc(l.description || t("no_desc"))}</p>
        ${l.lang && l.lang !== lang ? `<p class="meta">${esc(t("listed_in", { lang: GMT.language(l.lang) }))}</p>` : ""}
        ${l.seller_verified ? `<div class="notice ver">${vcheck()} ${esc(verifiedVia(l))}</div>` : ""}
        ${sellerBox}
        <div style="display:flex;gap:10px;margin-top:18px;flex-wrap:wrap;align-items:center">
          ${isOwn ? `<span class="meta">${esc(t("msg_own"))}</span>` : `<button class="btn btn-primary" type="button" data-msg-listing="${esc(l.id)}">${esc(t("msg_send"))}</button>`}
          ${l.contact_phone ? `<a class="btn btn-blue" href="tel:${esc(l.contact_phone.replace(/[^\d+]/g, ""))}">${esc(t("call", { x: l.contact_phone }))}</a>` : ""}
          <button class="btn btn-ghost" type="button" data-share="${esc(l.id)}">${esc(t("share"))}</button>
          <button class="btn btn-ghost" type="button" data-report="${esc(l.id)}">⚑ ${esc(t("report"))}</button>
        </div>
        <p class="meta" style="margin-top:14px">${esc(t("tip"))}</p>
      </div>`;
    openModal("mDetail");
    history.replaceState(null, "", location.pathname + location.search + "#a=" + encodeURIComponent(l.id));
  }

  function renderWanted() {
    const u = user();
    $("#wanted").innerHTML = wanted.length ? wanted.map(w => `<div class="want"><b>${esc(w.title)}</b>
      <div class="meta cardseller">${av(w.seller_avatar, w.name, 18)}<span>${esc(w.name)} ${w.verified ? vcheck() : ""} · ${esc(w.area || t("anywhere"))} · ${esc(t("budget"))}: ${esc(w.budget || t("by_agreement"))}</span></div>
      ${u && w.seller_id === u.id ? "" : `<button class="btn btn-ghost btn-sm" type="button" style="margin-top:10px" data-msg-wanted="${esc(w.id)}">${esc(t("wanted_write"))}</button>`}</div>`).join("")
      : `<div class="empty">${esc(t("wanted_none"))}</div>`;
  }

  async function renderMine() {
    if (!user()) { $("#mineList").innerHTML = `<div class="empty">${esc(t("mine_login"))}<br><button class="btn btn-blue" type="button" data-login style="margin-top:12px">${esc(t("login"))}</button></div>`; return; }
    let mine = []; try { mine = await S.myListings(); } catch (e) { }
    if (!mine.length) { $("#mineList").innerHTML = `<div class="empty">${esc(t("mine_none"))}</div>`; return; }
    $("#mineList").innerHTML = mine.map(l => {
      const c = cat(l.category), left = l.expires_at ? Math.max(0, Math.ceil((Date.parse(l.expires_at) - Date.now()) / DAY)) : 0;
      let info = "", acts = "";
      if (l.status === "aktiv") { info = t("days_left", { n: left }); acts = `<button class="btn btn-ghost btn-sm" type="button" data-view="${esc(l.id)}">${esc(t("view"))}</button><button class="btn btn-blue btn-sm" type="button" data-sold="${esc(l.id)}">${esc(t("mark_sold"))}</button>`; }
      else if (l.status === "udloebet") { info = t("expired"); acts = `<button class="btn btn-primary btn-sm" type="button" data-renew="${esc(l.id)}">${esc(t("renew"))}</button>`; }
      else if (l.status === "solgt") info = t("sold_msg");
      acts += `<button class="btn btn-danger btn-sm" type="button" data-del="${esc(l.id)}">${esc(t("del"))}</button>`;
      return `<div class="mine-row"><div class="mthumb" style="background:${c.c}">${thumbHtml(l, 32)}</div>
        <div><b>${esc(l.title)}</b><div class="meta"><span class="chip ${esc(l.status)}">${esc(t("status_" + l.status))}</span>${money(l.price, l.currency)} · ${esc(l.country)} · ${esc(info)}</div></div>
        <div class="mine-actions">${acts}</div></div>`;
    }).join("");
  }

  /* ---------- Indbakke ---------- */
  function openInbox() { inboxState = { view: "list" }; renderInbox(); openModal("mInbox"); }
  async function renderInbox() {
    const box = $("#inboxBody");
    if (inboxState.view === "thread") return renderThread(inboxState.id);
    box.innerHTML = `<h2 id="inboxH">${esc(t("inbox"))}</h2><p class="sub">${esc(t("inbox_sub"))}</p><div class="convlist" id="convList" aria-live="polite"></div>`;
    let list = []; try { list = await S.conversations(); } catch (ex) { toast(errMsg(ex), true); }
    $("#convList").innerHTML = list.length ? list.map(c => `<button type="button" class="conv ${c.unread ? "unread" : ""}" data-conv="${esc(c.id)}">
        ${av(c.other_avatar, c.other_name, 44)}
        <div class="cmain"><b>${esc(c.other_name)} ${c.other_verified ? vcheck() : ""}</b><div class="meta" style="margin:0">${esc(c.subject)}</div>
        <div class="conv-last">${c.last_from_me ? esc(t("you_prefix")) + ": " : ""}${esc(c.last_body)}</div></div>
        <div class="conv-meta"><span>${esc(fmtWhen(c.last_at))}</span>${c.unread ? `<span class="nbadge" style="margin:0">${c.unread}</span>` : ""}</div></button>`).join("")
      : `<div class="empty">${esc(t("inbox_empty"))}</div>`;
    refreshUnread();
  }
  async function renderThread(id) {
    const box = $("#inboxBody");
    let th; try { th = await S.thread(id); } catch (ex) { toast(errMsg(ex), true); inboxState = { view: "list" }; return renderInbox(); }
    box.innerHTML = `<button class="link" type="button" data-inbox-back>← ${esc(t("inbox_back"))}</button>
      <div class="thead">${av(th.other_avatar, th.other_name, 44)}<div><b id="inboxH">${esc(th.other_name)} ${th.other_verified ? vcheck() : ""}</b><div class="meta" style="margin:0">${esc(th.subject)}</div>
      ${th.listing_id ? `<button class="link" type="button" data-view-listing="${esc(th.listing_id)}">${esc(t("thread_open"))}</button>` : ""}</div></div>
      <div class="msgs" id="msgList">${(th.messages || []).map(m => `<div class="bubble ${m.mine ? "mine" : ""}"><div>${esc(m.body)}</div><small>${esc(fmtWhen(m.created_at))}</small></div>`).join("")}</div>
      <form class="reply" id="replyForm" novalidate><textarea id="replyBody" maxlength="2000" required placeholder="${esc(t("reply_ph"))}" aria-label="${esc(t("reply_btn"))}"></textarea>
      <div class="form-err" id="replyErr" aria-live="assertive"></div><button class="btn btn-primary" type="submit">${esc(t("reply_btn"))}</button></form>`;
    const ml = $("#msgList"); ml.scrollTop = ml.scrollHeight;
    $("#replyForm").addEventListener("submit", async e => {
      e.preventDefault(); const body = $("#replyBody").value.trim();
      if (body.length < 1) { $("#replyErr").textContent = t("msg_err_empty"); return; }
      try { await S.reply(id, body); await renderThread(id); } catch (ex) { $("#replyErr").textContent = errMsg(ex); }
    });
    refreshUnread();
  }
  function openMsg(o) {
    $("#msgListing").value = o.listing_id || ""; $("#msgWanted").value = o.wanted_id || "";
    $("#msgH").textContent = t("msg_h", { name: o.name }); $("#msgAbout").textContent = t("msg_about", { t: o.title });
    $("#msgBody").value = ""; $("#msgErr").textContent = ""; openModal("mMsg");
  }
  $("#msgForm").addEventListener("submit", async e => {
    e.preventDefault(); const er = $("#msgErr"), body = $("#msgBody").value.trim(), btn = $("#msgBtn");
    if (body.length < 2) { er.textContent = t("msg_err_empty"); return; }
    btn.disabled = true;
    try { await S.sendMessage({ listing_id: $("#msgListing").value || null, wanted_id: $("#msgWanted").value || null, body }); closeModals(); toast(t("msg_sent")); }
    catch (ex) { er.textContent = errMsg(ex); } finally { btn.disabled = false; }
  });

  /* ---------- Formularer ---------- */
  function validate(form, errEl) {
    for (const el of $$("input,select,textarea", form)) {
      if (el.type === "hidden" || el.closest("[hidden]")) continue;
      if (!el.checkValidity()) {
        if (el.type === "checkbox") errEl.textContent = /Terms/.test(el.id) ? t("err_terms") : t("err_field", { f: el.parentElement.textContent.trim() });
        else if (el.id === "suPw") errEl.textContent = t("err_pw");
        else errEl.textContent = t("err_field", { f: (($(`label[for="${el.id}"]`) || {}).textContent || "").replace(" *", "").trim() });
        el.focus(); return false;
      }
    }
    errEl.textContent = ""; return true;
  }
  function resizeImage(file, max, q) {
    return new Promise((res, rej) => {
      const u = URL.createObjectURL(file), img = new Image();
      img.onload = () => { const s = Math.min(1, max / Math.max(img.width, img.height)), cv = document.createElement("canvas");
        cv.width = Math.round(img.width * s); cv.height = Math.round(img.height * s); cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
        URL.revokeObjectURL(u); res(cv.toDataURL("image/jpeg", q)); };
      img.onerror = () => { URL.revokeObjectURL(u); rej(Object.assign(new Error(), { i18n: "err_img" })); };
      img.src = u;
    });
  }
  $("#sImgs").addEventListener("change", async e => {
    const files = Array.from(e.target.files || []).filter(f => f.type.indexOf("image/") === 0).slice(0, 6), local = S.mode === "local";
    pendingImages = []; $("#sellErr").textContent = "";
    try { for (const f of files) pendingImages.push(await resizeImage(f, local ? 700 : 1400, local ? .6 : .82)); } catch (ex) { $("#sellErr").textContent = errMsg(ex); }
    $("#previews").innerHTML = pendingImages.map(u => `<img src="${u}" alt="">`).join("");
    if ((e.target.files || []).length > 6) $("#sellErr").textContent = t("err_imgs_max");
  });
  $("#sCountry").addEventListener("change", () => { const c = C.countries[$("#sCountry").value]; if (c) $("#sCurrency").value = c; });

  function syncVat() {
    const cc = $("#suCountry").value, v = $("#suVat").value.trim(), h = $("#suVatHint");
    if (!cc || !Reg.has(cc)) { h.className = "hint"; h.textContent = ""; return true; }
    if (!v) { h.className = "hint"; h.textContent = t("id_hint", { ex: Reg.example(cc, "vat") + " / " + Reg.example(cc, "company") }); return true; }
    const m = Reg.matchAny(cc, v);
    h.className = "hint " + (m ? "ok" : "bad");
    h.textContent = m ? "✓ " + t("format_ok", { label: Reg.label(cc, m) }) : t("err_id_format", { label: Reg.label(cc, "vat") + " / " + Reg.label(cc, "company"), ex: Reg.example(cc, "vat") });
    return !!m;
  }
  function syncSignup() {
    const ty = $("#suType").value, priv = ty === "private";
    $("#suOrgWrap").hidden = priv; $("#suOrg").required = !priv;
    if (ty === "dealer") $("#suTrader").checked = true;
    const tr = $("#suTrader").checked; $("#traderBox").hidden = !tr;
    ["#suCompany", "#suVat", "#suAddress"].forEach(s => $(s).required = tr);
    syncVat();
  }
  $("#suType").addEventListener("change", syncSignup); $("#suTrader").addEventListener("change", syncSignup);
  $("#suCountry").addEventListener("change", syncVat); $("#suVat").addEventListener("input", syncVat); syncSignup();

  $("#loginForm").addEventListener("submit", async e => {
    e.preventDefault(); const er = $("#loginErr"); if (!validate(e.target, er)) return;
    try {
      const r = await S.login($("#liEmail").value, $("#liPw").value);
      if (r.needsCode || r.needsLink) showVerify(r); else { e.target.reset(); await onLoggedIn(r.user); }
    } catch (ex) { er.textContent = errMsg(ex); }
  });
  $("#signupForm").addEventListener("submit", async e => {
    e.preventDefault(); const er = $("#signupErr"); if (!validate(e.target, er)) return;
    if (!$("#suCountry").value) { er.textContent = t("err_field", { f: t("l_country").replace(" *", "") }); return; }
    const tr = $("#suTrader").checked, priv = $("#suType").value === "private";
    if (tr && !syncVat()) { er.textContent = $("#suVatHint").textContent; $("#suVat").focus(); return; }
    const btn = $("#signupForm button[type=submit]"); btn.disabled = true;
    try {
      const r = await S.signup({ name: $("#suName").value.trim(), email: $("#suEmail").value, password: $("#suPw").value,
        user_type: $("#suType").value, org_name: priv ? "" : $("#suOrg").value.trim(), country: $("#suCountry").value, phone: $("#suPhone").value.trim(),
        is_trader: tr, trader_company: tr ? $("#suCompany").value.trim() : null, trader_vat: tr ? $("#suVat").value.trim() : null, trader_address: tr ? $("#suAddress").value.trim() : null, lang });
      e.target.reset(); $("#suCountry").value = homeCountry || ""; syncSignup();
      if (r.user) await onLoggedIn(r.user); else showVerify(r);
    } catch (ex) { er.textContent = errMsg(ex); } finally { btn.disabled = false; }
  });
  $("#verifyForm").addEventListener("submit", async e => {
    e.preventDefault(); const er = $("#verifyErr"); if (!validate(e.target, er)) return;
    try { const u = await S.verifyEmail(verifyEmail, $("#vCode").value); toast(t("t_verified")); await onLoggedIn(u); }
    catch (ex) { er.textContent = errMsg(ex); }
  });
  async function doResend() {
    try { const r = await S.resend(verifyEmail); toast(t("t_resent")); if (r && r.demoCode) { $("#verifyDemo").hidden = false; $("#verifyDemo").textContent = t("verify_demo", { code: r.demoCode }); } else startCooldown(60); }
    catch (ex) { toast(errMsg(ex), true); startCooldown(60); }
  }
  $("#resendBtn").addEventListener("click", doResend); $("#resendLinkBtn").addEventListener("click", doResend);

  function openSell() {
    const u = user(), nm = (u.user_type !== "private" && u.org_name) ? u.org_name : u.name;
    $("#sellAs").innerHTML = esc(t("sell_as", { name: nm })) + " " + (u.org_status === "approved" ? vcheck() : "");
    openModal("mSell");
  }
  $("#sellForm").addEventListener("submit", async e => {
    e.preventDefault();
    const form = e.target, er = $("#sellErr"), btn = $("#sellBtn");
    if (!$("#sCountry").value) { er.textContent = t("err_field", { f: t("l_country").replace(" *", "") }); return; }
    if (!validate(form, er)) return;
    const y = Number($("#sYear").value), np = Math.round(Number($("#sNew").value));
    const data = { lang, title: $("#sTitle").value.trim(), category: $("#sCat").value, brand: $("#sBrand").value.trim(),
      year: y >= 1970 && y <= 2030 ? Math.round(y) : null, condition: $("#sCond").value,
      price: Math.max(0, Math.round(Number($("#sPrice").value) || 0)), currency: $("#sCurrency").value, new_price: np > 0 ? np : null,
      city: $("#sCity").value.trim(), postcode: $("#sPost").value.trim(), country: $("#sCountry").value, description: $("#sDesc").value.trim(),
      transport: $("#sTransport").checked, images: pendingImages.slice() };
    btn.disabled = true; btn.textContent = t("creating");
    try {
      await S.createListing(data);
      form.reset(); pendingImages = []; $("#previews").innerHTML = ""; $("#sCountry").value = homeCountry || ""; $("#sCurrency").value = C.countries[homeCountry] || langCur;
      await Promise.all([loadListings().then(loadWanted), renderMine()]);
      closeModals(); toast(t("t_created", { days: settings.listing_days })); $("#mine").scrollIntoView();
    } catch (ex) { er.textContent = errMsg(ex); }
    finally { btn.disabled = false; btn.textContent = t("btn_create"); }
  });
  $("#wantForm").addEventListener("submit", async e => {
    e.preventDefault(); const er = $("#wantErr"); if (!validate(e.target, er)) return;
    try { await S.addWanted({ title: $("#wTitle").value.trim(), budget: $("#wBudget").value.trim(), area: $("#wArea").value.trim() }); e.target.reset(); closeModals(); await loadWanted(); toast(t("t_wanted")); }
    catch (ex) { er.textContent = errMsg(ex); }
  });
  $("#repForm").addEventListener("submit", async e => {
    e.preventDefault(); const er = $("#repErr"); if (!validate(e.target, er)) return;
    try { const lid = $("#rListing").value;
      await S.report({ listing_id: lid || null, reason: $("#rReason").value, details: $("#rDetails").value.trim(), reporter_email: $("#rEmail").value.trim(), good_faith: true, lang });
      e.target.reset(); closeModals(); toast(t("t_reported")); }
    catch (ex) { er.textContent = errMsg(ex); }
  });

  /* ---------- Hændelser ---------- */
  async function act(fn, okKey) { try { const r = await fn(); await Promise.all([loadListings().then(loadWanted), renderMine()]); okKey && toast(t(okKey)); return r; } catch (ex) { toast(errMsg(ex), true); } }
  document.addEventListener("click", async e => {
    const el = e.target;
    if (el.closest("#userBtn")) { user() ? (renderProfile(), openModal("mProfile")) : openAuth("paneLogin"); return; }
    if (el.closest("[data-login]")) { openAuth("paneLogin"); return; }
    if (el.closest("[data-inbox-back]")) { inboxState = { view: "list" }; renderInbox(); return; }
    if (el.closest("[data-inbox]")) { e.preventDefault(); $("#menu").classList.remove("open"); requireUser(openInbox); return; }
    const cv = el.closest("[data-conv]"); if (cv) { inboxState = { view: "thread", id: cv.dataset.conv }; renderInbox(); return; }
    const vl = el.closest("[data-view-listing]"); if (vl) { openDetail(vl.dataset.viewListing); return; }
    const ml = el.closest("[data-msg-listing]");
    if (ml) { const l = lastDetail; if (l && l.id === ml.dataset.msgListing) requireUser(() => openMsg({ listing_id: l.id, title: l.title, name: l.seller_name })); return; }
    const mw = el.closest("[data-msg-wanted]");
    if (mw) { const w = wanted.find(x => x.id === mw.dataset.msgWanted); if (w) requireUser(() => openMsg({ wanted_id: w.id, title: w.title, name: w.name })); return; }
    if (el.closest("[data-sell]")) { e.preventDefault(); $("#menu").classList.remove("open"); requireUser(openSell); return; }
    if (el.closest("[data-want]")) { e.preventDefault(); requireUser(() => openModal("mWant")); return; }
    const pn = el.closest("[data-pane]"); if (pn) { showPane(pn.dataset.pane); return; }
    if (el.closest("#avRemove")) { saveAvatar(null); return; }
    if (el.closest("#logoutBtn")) { await S.logout(); unread = 0; renderUserBtn(); updateBadges(); closeModals(); toast(t("t_logged_out")); await Promise.all([renderMine(), loadListings().then(loadWanted)]); return; }
    if (el.closest("#approveDemo")) { await S.approveDemo(); renderProfile(); renderUserBtn(); await loadListings().then(loadWanted); return; }
    const o = el.closest("[data-open]"); if (o) { e.preventDefault(); openModal(o.dataset.open); return; }
    if (el.closest("[data-close]") || el.classList.contains("modal")) { closeModals(); return; }
    const rp = el.closest("[data-report]"); if (rp) { $("#rListing").value = rp.dataset.report; const u = user(); if (u) $("#rEmail").value = u.email; openModal("mReport"); return; }
    const c = el.closest(".cat");
    if (c) { activeCat = activeCat === c.dataset.cat ? "" : c.dataset.cat;
      $$(".cat").forEach(x => { const on = x.dataset.cat === activeCat; x.classList.toggle("active", on); x.setAttribute("aria-pressed", on); });
      renderGrid(); $("#annoncer").scrollIntoView(); return; }
    const g = el.closest("[data-img]"); if (g) { $("#mMain").innerHTML = `<img src="${esc(g.dataset.img)}" alt="">`; $$(".gal button").forEach(b => b.classList.toggle("on", b === g)); return; }
    const sh = el.closest("[data-share]");
    if (sh) { const link = location.origin + location.pathname + "?lang=" + lang + "#a=" + encodeURIComponent(sh.dataset.share);
      try { await navigator.clipboard.writeText(link); toast(t("link_copied")); } catch (x) { window.prompt(t("copy_prompt"), link); } return; }
    const v = el.closest("[data-view]"); if (v) { openDetail(v.dataset.view); return; }
    const so = el.closest("[data-sold]"); if (so) { await act(() => S.markSold(so.dataset.sold), "t_sold"); return; }
    const rn = el.closest("[data-renew]"); if (rn) { await act(() => S.renew(rn.dataset.renew), "t_renewed"); return; }
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
  ["#q", "#qCountry", "#fSort", "#fMax", "#fTransport", "#fVerified"].forEach(s => $(s).addEventListener("input", renderGrid));
  $$(".fCond,.fSeller").forEach(x => x.addEventListener("change", renderGrid));
  $("#reset").addEventListener("click", () => {
    ["#fMax", "#q", "#qCountry"].forEach(s => $(s).value = ""); $("#fSort").value = "new"; $("#fTransport").checked = false; $("#fVerified").checked = false;
    $$(".fCond,.fSeller").forEach(x => x.checked = false); activeCat = "";
    $$(".cat").forEach(x => { x.classList.remove("active"); x.setAttribute("aria-pressed", "false"); }); renderGrid();
  });

  renderUserBtn();
  await Promise.all([loadListings().then(loadWanted), renderMine(), refreshUnread()]);
  if (location.hash.indexOf("#a=") === 0) openDetail(decodeURIComponent(location.hash.slice(3)));
})();
