(function () {
  "use strict";

  const STORAGE_KEY = "kfm-v2";
  const MAX_TARGET = 999;
  const PRESETS = [10, 20, 50, 100];

  const DEFAULT_RATES = {
    pullups: 8,
    pushups: 12,
    squats: 20,
    situps: 20,
    abwheel: 12,
  };

  const EXERCISES = [
    { id: "pullups", name: "מתח", color: "#ff7a1a" },
    { id: "pushups", name: "שכיבות שמיכה", color: "#3ec6b6" },
    { id: "squats", name: "סקווטים", color: "#e8b84a" },
    { id: "situps", name: "כפיפות בטן", color: "#ff6b6b" },
    { id: "abwheel", name: "גלגלת בטן", color: "#9b7dff" },
  ];

  const COMBOS = [
    { id: "mixed", name: "מעורב", ids: ["pullups", "pushups", "squats", "situps", "abwheel"] },
    { id: "core", name: "בטן בלבד", ids: ["situps", "abwheel"] },
    { id: "upper", name: "פלג גוף עליון", ids: ["pullups", "pushups"] },
    { id: "legs-core", name: "רגליים ובטן", ids: ["squats", "situps", "abwheel"] },
    { id: "no-pull", name: "בלי מתח", ids: ["pushups", "squats", "situps", "abwheel"] },
  ];

  const ICONS = {
    pullups:
      '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 10h48M12 10V6M52 10V6"/><circle cx="32" cy="24" r="5" fill="currentColor" stroke="none"/><path d="M18 12h8M38 12h8"/><path d="M18 12c1 8 6 11 14 11s13-3 14-11"/><path d="M32 29v9"/><path d="M32 38l-8 16M32 38l8 16"/></svg>',
    pushups:
      '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="50" cy="22" r="5" fill="currentColor" stroke="none"/><path d="M46 26 28 34 10 30"/><path d="M28 34v8l10 6M28 42l-10 8"/><path d="M8 52h12M42 54h14"/></svg>',
    squats:
      '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="12" r="5" fill="currentColor" stroke="none"/><path d="M32 17v10"/><path d="M18 24h28"/><path d="M32 27l-12 10 2 15M32 27l12 10-2 15"/><path d="M16 52h10M38 52h10"/></svg>',
    situps:
      '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 50h48"/><circle cx="28" cy="18" r="5" fill="currentColor" stroke="none"/><path d="M28 23c2 8 8 12 18 14"/><path d="M26 28 14 50"/><path d="M22 50h20l8-8"/></svg>',
    abwheel:
      '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="36" r="16"/><circle cx="32" cy="36" r="6"/><path d="M18 28 8 16M46 28l10-12"/><path d="M6 16h8M50 16h8"/></svg>',
    gear:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H8a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V8c.3.6.9 1 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
  };

  let rates = loadRates();
  const ui = {
    target: 0,
    plan: emptyPlan(),
    picked: "",
    settings: false,
  };

  function emptyPlan() {
    const p = {};
    EXERCISES.forEach((e) => (p[e.id] = 0));
    return p;
  }
  function rate(id) {
    return rates[id] || DEFAULT_RATES[id];
  }
  function planSum(plan) {
    return EXERCISES.reduce((s, e) => s + (plan[e.id] || 0), 0);
  }
  function evenSplit(ids, target) {
    const plan = emptyPlan();
    if (!ids.length || target <= 0) return plan;
    const base = Math.floor(target / ids.length);
    let rem = target % ids.length;
    ids.forEach((id) => {
      plan[id] = base + (rem > 0 ? 1 : 0);
      if (rem > 0) rem--;
    });
    return plan;
  }
  function plansEqual(a, b) {
    return EXERCISES.every((e) => (a[e.id] || 0) === (b[e.id] || 0));
  }
  function fmt(n) {
    return Number(n).toLocaleString("he-IL");
  }
  function ils(n) {
    return `<span class="ils">₪${fmt(n)}</span>`;
  }
  function clampTarget(n) {
    if (!Number.isFinite(n) || n < 0) return 0;
    return Math.min(MAX_TARGET, Math.floor(n));
  }

  function loadRates() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (raw && raw.rates) return { ...DEFAULT_RATES, ...raw.rates };
      const old = JSON.parse(localStorage.getItem("kfm-v1") || "null");
      if (old && old.rates) return { ...DEFAULT_RATES, ...old.rates };
    } catch (e) {}
    return { ...DEFAULT_RATES };
  }
  function saveRates() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ rates }));
  }

  const root = document.getElementById("app");
  const toastEl = document.getElementById("toast");

  function builtPlans() {
    const t = ui.target;
    const list = [];
    EXERCISES.forEach((e) => {
      const p = emptyPlan();
      p[e.id] = t;
      list.push({ key: "solo-" + e.id, name: e.name + " בלבד", plan: p });
    });
    COMBOS.forEach((c) => {
      list.push({ key: "combo-" + c.id, name: c.name, plan: evenSplit(c.ids, t) });
    });
    return list;
  }

  function planDetail(plan) {
    return EXERCISES.filter((e) => plan[e.id] > 0)
      .map((e) => `${e.name} ${fmt(plan[e.id] * rate(e.id))}`)
      .join(" · ");
  }

  function recCard(item) {
    const on = item.key === ui.picked ? " on" : "";
    return `<button class="rcard${on}" data-act="pick" data-key="${item.key}">
      <div class="hd"><span class="nm">${item.name}</span>${ils(planSum(item.plan))}</div>
      <div class="det">${planDetail(item.plan)}</div>
    </button>`;
  }

  function progressHTML() {
    const sum = planSum(ui.plan);
    const target = ui.target;
    const pct = target <= 0 ? 0 : Math.min(100, Math.round((sum / target) * 100));
    let cls = "mid",
      msg;
    if (sum === target && target > 0) {
      cls = "ok";
      msg = "הגעתם ליעד.";
    } else if (sum > target) {
      cls = "over";
      msg = `יותר מהיעד ב־${ils(sum - target)} · סה״כ ${ils(sum)}`;
    } else {
      msg = `עוד ${ils(target - sum)} כדי להגיע ליעד`;
    }
    return `<div class="prog-wrap">
      <div class="prog ${cls}"><i style="width:${pct}%"></i></div>
      <div class="prog-msg ${cls}">${msg}</div>
    </div>`;
  }

  function resultsHTML() {
    if (ui.target < 1) {
      return `<p class="empty">מזינים יעד, ומיד מופיעות אפשרויות — תרגיל אחד או קומבינציה.</p>`;
    }
    const all = builtPlans();
    const solos = all.filter((p) => p.key.startsWith("solo-")).map(recCard).join("");
    const combos = all.filter((p) => p.key.startsWith("combo-")).map(recCard).join("");
    const rows = EXERCISES.map((e) => {
      const blocks = ui.plan[e.id] || 0;
      const reps = blocks * rate(e.id);
      return `<div class="mix-row">
        <div class="exico" style="color:${e.color}">${ICONS[e.id]}</div>
        <div class="mix-meta">
          <div class="en">${e.name}</div>
          <div class="rate">${rate(e.id)} חזרות = ${ils(1)}${blocks ? " · " + fmt(reps) + " חזרות" : ""}</div>
        </div>
        <div class="mix-ctrl">
          <button data-act="dec" data-id="${e.id}" ${blocks <= 0 ? "disabled" : ""} aria-label="פחות ${e.name}">−</button>
          <div class="val">${ils(blocks)}</div>
          <button data-act="inc" data-id="${e.id}" aria-label="יותר ${e.name}">+</button>
        </div>
      </div>`;
    }).join("");
    return `
      <section class="sec">
        <h2>אפשרויות</h2>
        <div class="recs">${solos}</div>
        <h2 style="margin-top:18px">קומבינציות</h2>
        <div class="recs">${combos}</div>
      </section>
      <section class="sec">
        <h2>קומבינציה משלי</h2>
        <div class="mix-tools">
          <button class="btn-soft" data-act="fill-even">פזר שווה</button>
          <button class="btn-soft" data-act="fill-rest">השלם ליעד</button>
        </div>
        <div class="panel">${rows}${progressHTML()}</div>
      </section>`;
  }

  function settingsHTML() {
    const rows = EXERCISES.map((e) => {
      return `<div class="set-row">
        <div class="exico" style="color:${e.color}">${ICONS[e.id]}</div>
        <div class="nm">${e.name}<span class="dim">חזרות עבור ${ils(1)}</span></div>
        <div class="numbox">
          <button data-act="dec-rate" data-id="${e.id}">−</button>
          <input type="text" inputmode="numeric" pattern="[0-9]*" value="${rate(e.id)}" data-act="rate-input" data-id="${e.id}" aria-label="${e.name}">
          <button data-act="inc-rate" data-id="${e.id}">+</button>
        </div>
      </div>`;
    }).join("");
    return `${rows}<button class="linkish" data-act="reset-rates">חזרה לברירת המחדל</button>`;
  }

  function pageHTML() {
    const chips = PRESETS.map(
      (n) => `<button class="chip" data-act="add" data-n="${n}">+${n}</button>`
    ).join("");
    return `
      <header class="top">
        <div class="top-inner">
          <span style="width:44px;flex:none"></span>
          <h1>כושר שווה כסף</h1>
          <button class="icon-btn${ui.settings ? " on" : ""}" data-act="toggle-settings" aria-label="הגדרות" aria-expanded="${ui.settings}">${ICONS.gear}</button>
        </div>
      </header>
      <div class="wrap">
        <div class="settings${ui.settings ? " show" : ""}" id="settings">${ui.settings ? settingsHTML() : ""}</div>
        <div class="hero">
          <p>כמה כסף רוצים להרוויח?</p>
          <div class="amount-field">
            <span class="sym">₪</span>
            <input class="amount-input" type="text" inputmode="numeric" pattern="[0-9]*"
              enterkeyhint="done" autocomplete="off" autocorrect="off" spellcheck="false"
              data-act="target-input" value="${ui.target ? ui.target : ""}" placeholder="0"
              aria-label="סכום היעד בשקלים">
          </div>
        </div>
        <div class="chips">${chips}</div>
        <p class="hint">כל לחיצה מוסיפה ליעד. אפשר גם להקליד.</p>
        <button class="btn-reset" data-act="reset">איפוס</button>
        <div id="results">${resultsHTML()}</div>
      </div>`;
  }

  function bindAll() {
    bind(root);
  }
  function bind(scope) {
    scope.querySelectorAll("[data-act]").forEach((el) => {
      const act = el.getAttribute("data-act");
      if (act === "target-input") {
        el.addEventListener("input", onType);
        el.addEventListener("blur", onTypeBlur);
        el.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            el.blur();
          }
        });
      } else if (act === "rate-input") {
        el.addEventListener("change", onAction);
      } else {
        el.addEventListener("click", onAction);
      }
    });
  }

  function refreshResults() {
    const box = document.getElementById("results");
    if (!box) return;
    box.innerHTML = resultsHTML();
    bind(box);
    syncPicked();
  }

  function syncPicked() {
    const match = builtPlans().find((p) => plansEqual(p.plan, ui.plan));
    ui.picked = match ? match.key : "";
    document.querySelectorAll(".rcard").forEach((el) => {
      el.classList.toggle("on", el.getAttribute("data-key") === ui.picked);
    });
  }

  function render() {
    root.innerHTML = pageHTML();
    bindAll();
  }

  function onType(ev) {
    const raw = ev.currentTarget.value;
    if (raw === "") {
      ui.target = 0;
      ui.picked = "";
      refreshResults();
      return;
    }
    const n = clampTarget(parseInt(String(raw).replace(/\D/g, ""), 10) || 0);
    ui.target = n;
    refreshResults();
  }
  function onTypeBlur(ev) {
    ui.target = clampTarget(parseInt(String(ev.currentTarget.value).replace(/\D/g, ""), 10) || 0);
    ev.currentTarget.value = ui.target ? String(ui.target) : "";
    refreshResults();
  }

  function setTarget(n, notifyMax) {
    const next = clampTarget(n);
    if (notifyMax && n > MAX_TARGET) toast("אפשר עד ₪" + MAX_TARGET);
    ui.target = next;
    render();
    const inp = root.querySelector("[data-act=target-input]");
    if (inp) inp.blur();
  }

  function onAction(ev) {
    const el = ev.currentTarget;
    const act = el.getAttribute("data-act");
    const id = el.getAttribute("data-id");

    if (act === "toggle-settings") {
      ui.settings = !ui.settings;
      const panel = document.getElementById("settings");
      const btn = el;
      panel.classList.toggle("show", ui.settings);
      btn.classList.toggle("on", ui.settings);
      btn.setAttribute("aria-expanded", String(ui.settings));
      if (ui.settings) {
        panel.innerHTML = settingsHTML();
        bind(panel);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }
    if (act === "add") {
      const n = parseInt(el.getAttribute("data-n"), 10) || 0;
      setTarget((ui.target || 0) + n, true);
      return;
    }
    if (act === "reset") {
      ui.target = 0;
      ui.plan = emptyPlan();
      ui.picked = "";
      render();
      return;
    }
    if (act === "pick") {
      const key = el.getAttribute("data-key");
      const found = builtPlans().find((p) => p.key === key);
      if (!found) return;
      ui.plan = { ...found.plan };
      ui.picked = key;
      refreshResults();
      const mix = document.querySelector(".sec:last-of-type");
      if (mix) mix.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (act === "inc") {
      ui.plan[id] = Math.min(MAX_TARGET, (ui.plan[id] || 0) + 1);
      refreshResults();
      return;
    }
    if (act === "dec") {
      ui.plan[id] = Math.max(0, (ui.plan[id] || 0) - 1);
      refreshResults();
      return;
    }
    if (act === "fill-even") {
      ui.plan = evenSplit(EXERCISES.map((e) => e.id), ui.target);
      refreshResults();
      return;
    }
    if (act === "fill-rest") {
      const remain = ui.target - planSum(ui.plan);
      if (remain <= 0) {
        toast(remain === 0 ? "כבר הגעתם ליעד" : "הסכום כבר מעל היעד");
        return;
      }
      let dest = EXERCISES.filter((e) => (ui.plan[e.id] || 0) === 0).map((e) => e.id);
      if (!dest.length) dest = EXERCISES.map((e) => e.id);
      const add = evenSplit(dest, remain);
      dest.forEach((i) => (ui.plan[i] = (ui.plan[i] || 0) + add[i]));
      refreshResults();
      return;
    }
    if (act === "dec-rate") {
      rates[id] = Math.max(1, rate(id) - 1);
      saveRates();
      refreshSettingsAndResults();
      return;
    }
    if (act === "inc-rate") {
      rates[id] = Math.min(99, rate(id) + 1);
      saveRates();
      refreshSettingsAndResults();
      return;
    }
    if (act === "rate-input") {
      const n = parseInt(String(el.value).replace(/\D/g, ""), 10);
      rates[id] = Math.min(99, Math.max(1, n || 1));
      saveRates();
      refreshSettingsAndResults();
      return;
    }
    if (act === "reset-rates") {
      rates = { ...DEFAULT_RATES };
      saveRates();
      refreshSettingsAndResults();
      toast("התעריפים חזרו לברירת המחדל");
      return;
    }
  }

  function refreshSettingsAndResults() {
    const panel = document.getElementById("settings");
    if (panel && ui.settings) {
      panel.innerHTML = settingsHTML();
      bind(panel);
    }
    refreshResults();
  }

  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2200);
  }

  const params = new URLSearchParams(location.search);
  if (params.get("n")) ui.target = clampTarget(parseInt(params.get("n"), 10) || 0);
  if (params.get("settings") === "1") ui.settings = true;
  if (ui.target > 0) ui.plan = evenSplit(EXERCISES.map((e) => e.id), ui.target);

  render();
})();
