(function () {
  "use strict";

  const STORAGE_KEY = "kfm-v2";
  const RATES_REV = 7;
  const MAX = 999;
  const PRESETS = [10, 20, 50, 100];
  const DEFAULT_RATES = {
    pullups: 8,
    pushups: 12,
    squats: 8,
    situps: 20,
    abwheel: 12,
  };
  const EXERCISES = [
    { id: "pullups", name: "מתח", color: "#ff7a1a" },
    { id: "pushups", name: "שכיבות שמיכה", color: "#ff7a1a" },
    { id: "squats", name: "סקווטים", color: "#ff7a1a" },
    { id: "situps", name: "כפיפות בטן", color: "#ff7a1a" },
    { id: "abwheel", name: "גלגלת בטן", color: "#ff7a1a" },
  ];
  const QUICK = [
    { id: "mixed", name: "מעורב", ids: ["pullups", "pushups", "squats", "situps", "abwheel"] },
    { id: "core", name: "רק בטן", ids: ["situps", "abwheel"] },
    { id: "arms", name: "ידיים", ids: ["pullups", "pushups"] },
    { id: "legs", name: "רגליים ובטן", ids: ["squats", "situps", "abwheel"] },
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


  function empty() {
    const p = {};
    EXERCISES.forEach((e) => (p[e.id] = 0));
    return p;
  }
  function rate(id) {
    return rates[id] || DEFAULT_RATES[id];
  }
  function sum() {
    return EXERCISES.reduce((s, e) => s + (ui.plan[e.id] || 0), 0);
  }
  function fmt(n) {
    return Number(n).toLocaleString("he-IL");
  }
  function ils(n) {
    return `<span class="ils">₪${fmt(n)}</span>`;
  }
  function clamp(n) {
    n = Math.floor(Number(n) || 0);
    if (n < 0) return 0;
    return Math.min(MAX, n);
  }
  function evenSplit(ids, target) {
    const p = empty();
    if (!ids.length || target <= 0) return p;
    const base = Math.floor(target / ids.length);
    let rem = target % ids.length;
    ids.forEach((id) => {
      p[id] = base + (rem > 0 ? 1 : 0);
      if (rem > 0) rem--;
    });
    return p;
  }
  function plansEqual(a, b) {
    return EXERCISES.every((e) => (a[e.id] || 0) === (b[e.id] || 0));
  }
  function loadRates() {
    try {
      let store = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (!store || !store.rates) {
        const old = JSON.parse(localStorage.getItem("kfm-v1") || "null");
        if (old && old.rates) store = old;
      }
      const r = { ...DEFAULT_RATES, ...((store && store.rates) || {}) };
      const rev = (store && store.rev) || 0;
      if (rev < RATES_REV) {
        // Old factory default was 20 squats per ₪. Move saved copies to 12 once.
        if (r.squats === 20 || r.squats === 12) r.squats = 8;
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ rates: r, rev: RATES_REV }));
        localStorage.setItem("kfm-squats12", "1");
      }
      return r;
    } catch (e) {}
    return { ...DEFAULT_RATES };
  }
  function saveRates() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ rates, rev: RATES_REV }));
  }

  let rates = loadRates();
  const ui = { target: 0, plan: empty(), done: {}, settings: false, quick: "" };

  const root = document.getElementById("app");
  const toastEl = document.getElementById("toast");

  function syncQuick() {
    ui.quick = "";
    if (ui.target < 1) return;
    const found = QUICK.find((q) => plansEqual(ui.plan, evenSplit(q.ids, ui.target)));
    if (found) ui.quick = found.id;
  }

  function tileHTML(e, last) {
    const n = ui.plan[e.id] || 0;
    const on = n > 0 ? " on" : "";
    const wide = last ? " wide" : "";
    const reps = n * rate(e.id);
    return `<button type="button" class="tile${on}${wide}" data-act="add-ex" data-id="${e.id}" aria-label="הוסף שקל ל${e.name}">
      <span class="minus" data-act="sub-ex" data-id="${e.id}" aria-label="הורד שקל מ${e.name}">−</span>
      <span class="ico">${ICONS[e.id]}</span>
      <span class="copy">
        <span class="nm">${e.name}</span>
        <span class="cap">${rate(e.id)} חזרות = ${ils(1)}</span>
      </span>
      <span class="got">
        <span class="amt">${ils(n)}</span>
        <span class="reps">${fmt(reps)} ${e.name}</span>
      </span>
    </button>`;
  }


  function pruneDone() {
    EXERCISES.forEach((e) => {
      if (!(ui.plan[e.id] > 0)) delete ui.done[e.id];
    });
  }

  function tasksHTML() {
    const items = EXERCISES.filter((e) => (ui.plan[e.id] || 0) > 0);
    if (!items.length) return "";
    const rows = items
      .map((e) => {
        const n = ui.plan[e.id];
        const reps = n * rate(e.id);
        const on = ui.done[e.id] ? " done" : "";
        const mark = ui.done[e.id] ? "✓" : "";
        return `<button type="button" class="task${on}" data-act="toggle-done" data-id="${e.id}">
          <span class="chk" aria-hidden="true">${mark}</span>
          <span class="txt">${fmt(reps)} ${e.name} — ${ils(n)}</span>
        </button>`;
      })
      .join("");
    return `<section class="tasks" id="tasks">
      <h2>המשימות שלי</h2>
      <ul>${rows}</ul>
      <div class="tasks-total">סה״כ ${ils(sum())}</div>
    </section>`;
  }

  function dockHTML() {
    const s = sum();
    const t = ui.target;
    const pct = t <= 0 ? 0 : Math.min(100, Math.round((s / t) * 100));
    let cls = "idle",
      msg;
    if (t < 1 && s < 1) {
      msg = "בוחרים יעד, או לוחצים על תרגיל.";
    } else if (t < 1) {
      cls = "earn";
      msg = `סה״כ ${ils(s)}`;
    } else if (s === t) {
      cls = "ok";
      msg = "✓  הגעת ליעד!";
    } else if (s > t) {
      cls = "over";
      msg = `נבחר ${ils(s)} מתוך ${ils(t)} · עברת ב-${ils(s - t)}`;
    } else {
      cls = "";
      msg = `נבחר ${ils(s)} מתוך ${ils(t)} · חסר עוד ${ils(t - s)}`;
    }
    const tasks = tasksHTML();
    const bar = t >= 1 ? `<div class="prog"><i style="width:${pct}%"></i></div>` : "";
    const msgHtml = t < 1 && tasks ? "" : `<div class="dock-msg">${msg}</div>`;
    return `<div class="dock ${cls}${tasks ? " has-tasks" : ""}" id="dock">
      <div class="dock-inner">
        ${tasks}
        ${bar}
        ${msgHtml}
      </div>
    </div>`;
  }

  function settingsHTML() {
    const rows = EXERCISES.map((e) => {
      return `<div class="set-row">
        <div class="set-ico">${ICONS[e.id]}</div>
        <div class="nm">${e.name}<span class="dim">חזרות עבור ${ils(1)}</span></div>
        <div class="numbox">
          <button type="button" data-act="dec-rate" data-id="${e.id}">−</button>
          <input type="text" inputmode="numeric" pattern="[0-9]*" value="${rate(e.id)}" data-act="rate-input" data-id="${e.id}" aria-label="${e.name}">
          <button type="button" data-act="inc-rate" data-id="${e.id}">+</button>
        </div>
      </div>`;
    }).join("");
    return `<h3>כמה חזרות = ₪1</h3>
      ${rows}
      <div class="sheet-actions">
        <button type="button" data-act="reset-rates">ברירת מחדל</button>
        <button type="button" class="done" data-act="close-settings">סגור</button>
      </div>`;
  }

  function pageHTML() {
    syncQuick();
    const chips = PRESETS.map((n) => `<button type="button" class="add" data-act="add-target" data-n="${n}">+${n}</button>`).join("");
    const quick = QUICK.map(
      (q) =>
        `<button type="button" class="qchip${ui.quick === q.id ? " on" : ""}" data-act="quick" data-id="${q.id}">${q.name}</button>`
    ).join("");
    const tiles = EXERCISES.map((e, i) => tileHTML(e, i === EXERCISES.length - 1)).join("");
    return `
      <header class="top">
        <h1>כושר שווה כסף</h1>
        <button type="button" class="gear${ui.settings ? " on" : ""}" data-act="open-settings" aria-label="הגדרות">${ICONS.gear}</button>
      </header>
      <div class="wrap">
        <div class="hero">
          <h2>כמה כסף?</h2>
          <div class="amount-field">
            <span class="sym">₪</span>
            <input class="amount-input" type="text" inputmode="numeric" pattern="[0-9]*"
              enterkeyhint="done" autocomplete="off" autocorrect="off" spellcheck="false"
              data-act="target-input" value="${ui.target ? ui.target : ""}" placeholder="0"
              aria-label="סכום היעד בשקלים">
          </div>
        </div>
        <div class="adds">${chips}</div>
        <div class="hero-reset"><button type="button" class="reset" data-act="reset">איפוס</button></div>
        <div class="quick" id="quick">${quick}</div>
        <div class="grid" id="grid">${tiles}</div>
      </div>
      ${dockHTML()}
      <div class="veil${ui.settings ? " show" : ""}" data-act="close-settings" id="veil"></div>
      <div class="sheet${ui.settings ? " show" : ""}" id="sheet" role="dialog" aria-label="הגדרות">${ui.settings ? settingsHTML() : ""}</div>`;
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

  function refreshBoard() {
    syncQuick();
    const grid = document.getElementById("grid");
    const quick = document.getElementById("quick");
    const dock = document.getElementById("dock");
    if (grid) {
      grid.innerHTML = EXERCISES.map((e, i) => tileHTML(e, i === EXERCISES.length - 1)).join("");
      bind(grid);
    }
    if (quick) {
      quick.innerHTML = QUICK.map(
        (q) =>
          `<button type="button" class="qchip${ui.quick === q.id ? " on" : ""}" data-act="quick" data-id="${q.id}">${q.name}</button>`
      ).join("");
      bind(quick);
    }
    if (dock) {
      const tmp = document.createElement("div");
      tmp.innerHTML = dockHTML();
      const next = tmp.firstElementChild;
      dock.replaceWith(next);
      bind(next);
    }
    syncDockPad();
  }

  function syncDockPad() {
    const dock = document.getElementById("dock");
    const wrap = document.querySelector(".wrap");
    if (!dock) return;
    const h = dock.offsetHeight;
    document.documentElement.style.setProperty("--dock-h", h + "px");
    document.documentElement.style.scrollPaddingBottom = h + 16 + "px";
    if (wrap) wrap.style.paddingBottom = h + 16 + "px";
  }

  function render() {
    root.innerHTML = pageHTML();
    bind(root);
    syncDockPad();
  }

  function onType(ev) {
    const raw = ev.currentTarget.value;
    const next = raw === "" ? 0 : clamp(parseInt(String(raw).replace(/\D/g, ""), 10) || 0);
    if (next === ui.target) return;
    ui.target = next;
    refreshBoard();
  }
  function onTypeBlur(ev) {
    const next = clamp(parseInt(String(ev.currentTarget.value).replace(/\D/g, ""), 10) || 0);
    ev.currentTarget.value = next ? String(next) : "";
    if (next === ui.target) return;
    ui.target = next;
    refreshBoard();
  }

  function onAction(ev) {
    const el = ev.currentTarget;
    const act = el.getAttribute("data-act");
    const id = el.getAttribute("data-id");
    ev.stopPropagation();

    if (act === "add-target") {
      const n = parseInt(el.getAttribute("data-n"), 10) || 0;
      const next = (ui.target || 0) + n;
      if (next > MAX) toast("אפשר עד ₪" + MAX);
      ui.target = clamp(next);
      const inp = root.querySelector("[data-act=target-input]");
      if (inp) inp.value = ui.target ? String(ui.target) : "";
      refreshBoard();
      return;
    }
    if (act === "reset") {
      ui.target = 0;
      ui.plan = empty();
      ui.done = {};
      ui.quick = "";
      render();
      return;
    }
    if (act === "add-ex") {
      if (ev.target.closest && ev.target.closest('[data-act=sub-ex]')) return;
      ui.plan[id] = Math.min(MAX, (ui.plan[id] || 0) + 1);
      pruneDone();
      refreshBoard();
      return;
    }
    if (act === "sub-ex") {
      ui.plan[id] = Math.max(0, (ui.plan[id] || 0) - 1);
      pruneDone();
      refreshBoard();
      return;
    }
    if (act === "quick") {
      const q = QUICK.find((x) => x.id === id);
      if (!q) return;
      if (ui.target < 1) {
        toast("קודם בוחרים כמה כסף");
        return;
      }
      ui.plan = evenSplit(q.ids, ui.target);
      ui.done = {};
      refreshBoard();
      return;
    }
    if (act === "toggle-done") {
      if (!(ui.plan[id] > 0)) return;
      ui.done[id] = !ui.done[id];
      refreshBoard();
      return;
    }
    if (act === "open-settings") {
      ui.settings = true;
      const sheet = document.getElementById("sheet");
      const veil = document.getElementById("veil");
      const gear = root.querySelector(".gear");
      sheet.innerHTML = settingsHTML();
      sheet.classList.add("show");
      veil.classList.add("show");
      if (gear) gear.classList.add("on");
      bind(sheet);
      return;
    }
    if (act === "close-settings") {
      ui.settings = false;
      document.getElementById("sheet").classList.remove("show");
      document.getElementById("veil").classList.remove("show");
      const gear = root.querySelector(".gear");
      if (gear) gear.classList.remove("on");
      refreshBoard();
      return;
    }
    if (act === "dec-rate") {
      rates[id] = Math.max(1, rate(id) - 1);
      saveRates();
      document.getElementById("sheet").innerHTML = settingsHTML();
      bind(document.getElementById("sheet"));
      refreshBoard();
      return;
    }
    if (act === "inc-rate") {
      rates[id] = Math.min(99, rate(id) + 1);
      saveRates();
      document.getElementById("sheet").innerHTML = settingsHTML();
      bind(document.getElementById("sheet"));
      refreshBoard();
      return;
    }
    if (act === "rate-input") {
      const n = parseInt(String(el.value).replace(/\D/g, ""), 10);
      rates[id] = Math.min(99, Math.max(1, n || 1));
      saveRates();
      document.getElementById("sheet").innerHTML = settingsHTML();
      bind(document.getElementById("sheet"));
      refreshBoard();
      return;
    }
    if (act === "reset-rates") {
      rates = { ...DEFAULT_RATES };
      saveRates();
      document.getElementById("sheet").innerHTML = settingsHTML();
      bind(document.getElementById("sheet"));
      refreshBoard();
      toast("התעריפים חזרו לברירת המחדל");
      return;
    }
  }

  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2200);
  }

  const params = new URLSearchParams(location.search);
  if (params.get("n")) ui.target = clamp(params.get("n"));
  if (params.get("settings") === "1") ui.settings = true;
  if (params.get("fill")) {
    const q = QUICK.find((x) => x.id === params.get("fill"));
    if (q && ui.target > 0) ui.plan = evenSplit(q.ids, ui.target);
  }
  if (params.get("plan")) {
    params.get("plan").split(",").forEach((part) => {
      const [k, v] = part.split(":");
      if (k && ui.plan[k] !== undefined) ui.plan[k] = clamp(v);
    });
  }

  render();
})();
