(function () {
  "use strict";

  const STORAGE_KEY = "kfm-v1";

  const KIDS = [
    { id: "adam", name: "אדם", letter: "א" },
    { id: "tom", name: "טום", letter: "ט" },
  ];

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
    { id: "strength", name: "ידיים ורגליים", ids: ["pullups", "pushups", "squats"] },
  ];

  const PRESET_AMOUNTS = [1, 2, 3, 5, 10, 15, 20];

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
    coin:
      '<svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="26" fill="#f0c14b"/><circle cx="32" cy="32" r="21" fill="#d4a017" opacity=".35"/><circle cx="32" cy="32" r="21" stroke="#8a6a10" stroke-width="2" fill="none"/><text x="32" y="42" text-anchor="middle" font-size="28" font-weight="800" fill="#5a4308" font-family="Rubik,Arial,sans-serif">₪</text></svg>',
    back:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>',
    gear:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H8a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V8c.3.6.9 1 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
  };

  /* ---------- state ---------- */
  let db = load();
  const ui = {
    screen: "home",
    kid: null,
    target: 5,
    plan: emptyPlan(),
    included: allIncluded(true),
    checks: {},
    lastEarned: 0,
  };

  function emptyPlan() {
    const p = {};
    EXERCISES.forEach((e) => (p[e.id] = 0));
    return p;
  }
  function allIncluded(v) {
    const o = {};
    EXERCISES.forEach((e) => (o[e.id] = v));
    return o;
  }
  function kidById(id) {
    return KIDS.find((k) => k.id === id);
  }
  function exById(id) {
    return EXERCISES.find((e) => e.id === id);
  }
  function rate(id) {
    return db.rates[id] || DEFAULT_RATES[id];
  }
  function planSum(plan) {
    return EXERCISES.reduce((s, e) => s + (plan[e.id] || 0), 0);
  }
  function planReps(plan, id) {
    return (plan[id] || 0) * rate(id);
  }

  /* ---------- storage ---------- */
  function defaultKid() {
    return { balance: 0, workouts: [], payouts: [] };
  }
  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (raw && raw.version === 1) {
        raw.rates = { ...DEFAULT_RATES, ...(raw.rates || {}) };
        KIDS.forEach((k) => {
          raw.kids[k.id] = { ...defaultKid(), ...(raw.kids[k.id] || {}) };
        });
        return raw;
      }
    } catch (e) {}
    return {
      version: 1,
      rates: { ...DEFAULT_RATES },
      kids: { adam: defaultKid(), tom: defaultKid() },
    };
  }
  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  }

  /* ---------- helpers ---------- */
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

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function formatWhen(ts) {
    return new Date(ts).toLocaleString("he-IL", {
      timeZone: "Asia/Jerusalem",
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function planLabel(plan) {
    const parts = EXERCISES.filter((e) => plan[e.id] > 0).map((e) => e.name);
    if (parts.length === 1) return parts[0] + " בלבד";
    if (parts.length === EXERCISES.length) return "מעורב";
    return parts.join(" · ");
  }

  function ils(n, prefix) {
    const sign = prefix || "";
    return `<span class="ils">${sign}₪${n}</span>`;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ---------- render ---------- */
  const root = document.getElementById("app");
  const modalRoot = document.getElementById("modal-root");
  const toastEl = document.getElementById("toast");

  function render() {
    const map = {
      home: viewHome,
      dash: viewDash,
      target: viewTarget,
      plans: viewPlans,
      mixer: viewMixer,
      workout: viewWorkout,
      done: viewDone,
      settings: viewSettings,
    };
    root.innerHTML = (map[ui.screen] || viewHome)();
    bind();
  }

  function header(title, opts) {
    opts = opts || {};
    const back = opts.back
      ? `<button class="icon-btn" data-act="back" aria-label="חזרה">${ICONS.back}</button>`
      : `<span class="spacer"></span>`;
    const right = opts.settings
      ? `<button class="icon-btn" data-act="settings" aria-label="הגדרות">${ICONS.gear}</button>`
      : `<span class="spacer"></span>`;
    return `<header class="top"><div class="top-inner">${back}<h1>${escapeHtml(title)}</h1>${right}</div></header>`;
  }

  function viewHome() {
    const cards = KIDS.map((k) => {
      const bal = db.kids[k.id].balance;
      return `<button class="kid ${k.id}" data-act="pick-kid" data-kid="${k.id}">
        <div class="avatar">${k.letter}</div>
        <div class="nm">${k.name}</div>
        <div class="bal">${ils(bal)} <span>יתרה</span></div>
      </button>`;
    }).join("");
    return `${header("כושר שווה כסף", { settings: true })}
      <main class="main">
        <div class="hero">
          <div class="logo-mark">${ICONS.coin}</div>
          <h2>כושר שווה כסף</h2>
          <p>בוחרים מי מתאמן, קובעים יעד, ומרוויחים שקלים על כל סט.</p>
        </div>
        <div class="kids">${cards}</div>
      </main>`;
  }

  function viewDash() {
    const k = kidById(ui.kid);
    const rec = db.kids[ui.kid];
    const items = rec.workouts.slice().reverse();
    const paidBefore = new Set();
    rec.payouts.forEach((p) => {
      rec.workouts.forEach((w) => {
        if (w.ts <= p.ts) paidBefore.add(w.id);
      });
    });
    let hist = "";
    if (!items.length) {
      hist = `<p class="empty">עדיין אין אימונים. אפשר להתחיל את הראשון.</p>`;
    } else {
      hist =
        `<ul class="hist">` +
        items
          .map((w) => {
            const paid = paidBefore.has(w.id);
            const det = EXERCISES.filter((e) => (w.reps[e.id] || 0) > 0)
              .map((e) => `${e.name} ${w.reps[e.id]}`)
              .join(" · ");
            return `<li>
              <div>
                <div class="when">${escapeHtml(formatWhen(w.ts))}${
              paid ? `<span class="tag paid">שולם</span>` : ""
            }</div>
                <div class="det">${escapeHtml(det)}</div>
              </div>
              <div class="amt">${ils(w.amount)}</div>
            </li>`;
          })
          .join("") +
        `</ul>`;
    }
    const payDisabled = rec.balance <= 0 ? "disabled" : "";
    return `${header(k.name, { back: true, settings: true })}
      <main class="main">
        <div class="dash-bal">
          <div class="who">${k.name}</div>
          <div class="sum">${ils(rec.balance)}</div>
          <p>יתרה שעדיין לא שולמה</p>
        </div>
        <button class="btn primary" data-act="new-workout">אימון חדש</button>
        <div class="sec-title">היסטוריה</div>
        <div class="panel">${hist}</div>
        <button class="btn danger" data-act="payout" ${payDisabled}>שולם — איפוס יתרה</button>
      </main>`;
  }

  function viewTarget() {
    const k = kidById(ui.kid);
    const chips = PRESET_AMOUNTS.map(
      (n) =>
        `<button class="chip${ui.target === n ? " on" : ""}" data-act="set-target" data-n="${n}">${ils(n)}</button>`
    ).join("");
    return `${header(k.name, { back: true, settings: true })}
      <main class="main">
        <div class="panel amount-wrap">
          <p class="muted" style="margin-bottom:8px">כמה כסף רוצים להרוויח?</p>
          <div class="amount-num">${ils(ui.target)}</div>
          <div class="stepper">
            <button class="big" data-act="dec-target" aria-label="פחות">−</button>
            <button class="big" data-act="inc-target" aria-label="יותר">+</button>
          </div>
          <div class="chips">${chips}</div>
        </div>
        <div style="margin-top:16px">
          <button class="btn primary" data-act="show-plans" ${ui.target < 1 ? "disabled" : ""}>הצג אפשרויות</button>
        </div>
      </main>`;
  }

  function pills(plan) {
    return EXERCISES.filter((e) => plan[e.id] > 0)
      .map(
        (e) =>
          `<span class="ex-pill"><i class="dot" style="background:${e.color}"></i>${e.name} · ${planReps(plan, e.id)}</span>`
      )
      .join("");
  }

  function planCard(title, plan, key) {
    const sum = planSum(plan);
    if (sum <= 0) return "";
    return `<article class="pcard">
      <div class="pt"><div class="pn">${escapeHtml(title)}</div><div class="psum">${ils(sum)}</div></div>
      <div class="ex-list">${pills(plan)}</div>
      <div class="pbtns">
        <button class="btn primary row" data-act="start-plan" data-key="${escapeHtml(key)}">התחל</button>
        <button class="btn ghost row" data-act="edit-plan" data-key="${escapeHtml(key)}">שנה</button>
      </div>
    </article>`;
  }

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

  function viewPlans() {
    const k = kidById(ui.kid);
    const all = builtPlans();
    const solos = all.filter((p) => p.key.startsWith("solo-")).map((p) => planCard(p.name, p.plan, p.key)).join("");
    const combos = all.filter((p) => p.key.startsWith("combo-")).map((p) => planCard(p.name, p.plan, p.key)).join("");
    return `${header("יעד " + ui.target + " ₪", { back: true, settings: true })}
      <main class="main">
        <p class="muted" style="margin-bottom:4px">${k.name}, כדי להרוויח ${ils(ui.target)} אפשר לבחור תרגיל אחד או קומבינציה.</p>
        <button class="custom-card" data-act="open-mixer" style="margin:10px 0 4px">
          <div class="pn">קומבינציה משלי</div>
          <p>בוחרים תרגילים ומחלקים את השקלים עד היעד.</p>
          <span class="btn ghost row" style="pointer-events:none;width:auto;display:inline-flex;padding:8px 20px">בנו בעצמכם</span>
        </button>
        <div class="sec-title">תרגיל אחד</div>
        <div class="plans grid2">${solos}</div>
        <div class="sec-title">קומבינציות</div>
        <div class="plans grid2">${combos}</div>
      </main>`;
  }

  function progressBlock(sum, target, mode) {
    const pct = target <= 0 ? 0 : Math.min(100, Math.round((sum / target) * 100));
    let cls = "mid",
      msg;
    if (mode === "sets") {
      if (sum === target && target > 0) {
        cls = "ok";
        msg = "כל הסטים סומנו!";
      } else {
        msg = `עוד ${target - sum} סטים לסיום`;
      }
    } else if (sum === target && target > 0) {
      cls = "ok";
      msg = "הגעתם ליעד! אפשר להתחיל.";
    } else if (sum > target) {
      cls = "over";
      msg = `יותר מהיעד ב־${ils(sum - target)} · סה״כ ${ils(sum)}`;
    } else {
      msg = `עוד ${ils(target - sum)} כדי להגיע ליעד`;
    }
    return `<div class="prog-wrap">
      <div class="prog ${cls}" dir="ltr"><i style="width:${pct}%"></i></div>
      <div class="prog-msg ${cls}">${msg}</div>
    </div>`;
  }

  function viewMixer() {
    const k = kidById(ui.kid);
    const sum = planSum(ui.plan);
    const maxSlide = Math.max(ui.target, sum, 1) + 5;
    const togs = EXERCISES.map((e) => {
      const on = ui.included[e.id];
      return `<button class="tog${on ? " on" : ""}" style="--c:${e.color}" data-act="toggle-ex" data-id="${e.id}">
        <span class="box">${on ? "✓" : ""}</span>${e.name}
      </button>`;
    }).join("");
    const rows = EXERCISES.map((e) => {
      const on = ui.included[e.id];
      const blocks = ui.plan[e.id] || 0;
      const reps = blocks * rate(e.id);
      return `<div class="mix-row${on ? "" : " off"}">
        <div class="exico" style="color:${e.color}">${ICONS[e.id]}</div>
        <div class="mix-meta">
          <div class="en">${e.name}</div>
          <div class="rate">${rate(e.id)} חזרות = ${ils(1)}${blocks ? " · " + reps + " חזרות" : ""}</div>
        </div>
        <div class="mix-ctrl">
          <button data-act="dec-block" data-id="${e.id}" ${!on || blocks <= 0 ? "disabled" : ""}>−</button>
          <div class="val">${ils(blocks)}</div>
          <button data-act="inc-block" data-id="${e.id}" ${!on ? "disabled" : ""}>+</button>
        </div>
        <input class="slider" type="range" min="0" max="${maxSlide}" step="1" value="${blocks}" data-act="slide-block" data-id="${e.id}" ${!on ? "disabled" : ""} aria-label="${e.name}">
      </div>`;
    }).join("");
    return `${header("קומבינציה משלי", { back: true, settings: true })}
      <main class="main has-cta">
        <p class="muted" style="margin-bottom:10px">${k.name} · יעד ${ils(ui.target)}. בוחרים אילו תרגילים נכנסים, ומחלקים את השקלים.</p>
        <div class="panel">
          <div class="toggles">${togs}</div>
        </div>
        <div class="panel">${rows}${progressBlock(sum, ui.target)}</div>
        <div class="actions">
          <button class="btn ghost row" data-act="fill-even">פזר שווה</button>
          <button class="btn ghost row" data-act="fill-rest">השלם ליעד</button>
        </div>
        <div class="sticky-cta"><div class="cta-inner">
          <button class="btn primary" data-act="start-mixer" ${sum < 1 ? "disabled" : ""}>התחל אימון · ${ils(sum)}</button>
        </div></div>
      </main>`;
  }

  function ensureChecks() {
    EXERCISES.forEach((e) => {
      const n = ui.plan[e.id] || 0;
      if (!ui.checks[e.id] || ui.checks[e.id].length !== n) {
        const old = ui.checks[e.id] || [];
        ui.checks[e.id] = Array.from({ length: n }, (_, i) => !!old[i]);
      }
    });
  }

  function viewWorkout() {
    const k = kidById(ui.kid);
    ensureChecks();
    let done = 0,
      total = 0;
    EXERCISES.forEach((e) => {
      const arr = ui.checks[e.id] || [];
      total += arr.length;
      done += arr.filter(Boolean).length;
    });
    const earn = done;
    const pct = total ? Math.round((done / total) * 100) : 0;
    const blocks = EXERCISES.filter((e) => (ui.plan[e.id] || 0) > 0)
      .map((e) => {
        const n = ui.plan[e.id];
        const rows = ui.checks[e.id]
          .map((ok, i) => {
            return `<button class="set-row${ok ? " done" : ""}" data-act="toggle-set" data-id="${e.id}" data-i="${i}">
              <span class="ck">${ok ? "✓" : ""}</span>
              <span>סט ${i + 1} מתוך ${n} · ${rate(e.id)} ${e.name}</span>
            </button>`;
          })
          .join("");
        return `<div class="set-block">
          <div class="set-h">
            <div class="exico" style="color:${e.color}">${ICONS[e.id]}</div>
            <div class="info"><b>${e.name}</b><span class="dim">${n * rate(e.id)} חזרות · ${ils(n)}</span></div>
          </div>
          ${rows}
        </div>`;
      })
      .join("");
    return `${header("אימון", { back: true })}
      <main class="main has-cta">
        <div class="whead">
          <div class="muted">${k.name}</div>
          <div class="big-ils">${ils(earn)} <span class="dim" style="font-size:16px;font-weight:600">מתוך ${ils(planSum(ui.plan))}</span></div>
        </div>
        <div class="panel" style="padding:12px 16px 14px">
          ${progressBlock(done, total || 1, "sets")}
          <p class="dim" style="text-align:center">${done} מתוך ${total} סטים · ${pct}%</p>
        </div>
        ${blocks}
        <div class="sticky-cta"><div class="cta-inner">
          <button class="btn ok" data-act="finish" ${done < 1 ? "disabled" : ""}>${
      done === total && total > 0 ? "סיימתי · הוסף " + ils(done) : "סיימתי חלקית · " + ils(done)
    }</button>
        </div></div>
      </main>`;
  }

  function viewDone() {
    const k = kidById(ui.kid);
    const bal = db.kids[ui.kid].balance;
    return `${header("כל הכבוד", { back: true })}
      <main class="main">
        <div class="panel done-box">
          <div class="confetti">🎉</div>
          <h2>כל הכבוד, ${k.name}!</h2>
          <div class="plus">${ils(ui.lastEarned, "+")}</div>
          <p class="muted">היתרה עכשיו ${ils(bal)}</p>
        </div>
        <button class="btn primary" data-act="back-dash">חזרה למסך של ${k.name}</button>
        <div style="height:10px"></div>
        <button class="btn ghost" data-act="another">אימון נוסף</button>
      </main>`;
  }

  function viewSettings() {
    const rows = EXERCISES.map((e) => {
      return `<div class="set-row2">
        <div class="exico" style="color:${e.color}">${ICONS[e.id]}</div>
        <div class="grow"><div class="nm">${e.name}</div><div class="dim">חזרות עבור ${ils(1)}</div></div>
        <div class="numbox">
          <button data-act="dec-rate" data-id="${e.id}">−</button>
          <input type="text" inputmode="numeric" pattern="[0-9]*" value="${rate(e.id)}" data-act="rate-input" data-id="${e.id}" aria-label="${e.name}">
          <button data-act="inc-rate" data-id="${e.id}">+</button>
        </div>
      </div>`;
    }).join("");
    return `${header("הגדרות", { back: true })}
      <main class="main">
        <p class="muted" style="margin-bottom:12px">כאן ההורה יכול לשנות כמה חזרות שוות שקל אחד. ברירת המחדל נשמרת וניתן לחזור אליה.</p>
        <div class="panel">${rows}</div>
        <button class="btn ghost" data-act="reset-rates">חזרה לברירת המחדל</button>
      </main>`;
  }

  /* ---------- events ---------- */
  function bind() {
    root.querySelectorAll("[data-act]").forEach((el) => {
      if (el.matches("input[type=range]")) {
        el.addEventListener("input", onAction);
      } else if (el.matches("input")) {
        el.addEventListener("change", onAction);
      } else {
        el.addEventListener("click", onAction);
      }
    });
  }

  function findPlan(key) {
    return builtPlans().find((p) => p.key === key);
  }

  function applyPlan(plan) {
    ui.plan = { ...emptyPlan(), ...plan };
    ui.included = allIncluded(false);
    EXERCISES.forEach((e) => {
      if ((ui.plan[e.id] || 0) > 0) ui.included[e.id] = true;
    });
    if (!EXERCISES.some((e) => ui.included[e.id])) ui.included = allIncluded(true);
    ui.checks = {};
  }

  function goWorkout() {
    if (planSum(ui.plan) < 1) return;
    ui.checks = {};
    ensureChecks();
    ui.screen = "workout";
    render();
    window.scrollTo(0, 0);
  }

  function onAction(ev) {
    const el = ev.currentTarget;
    const act = el.getAttribute("data-act");
    const id = el.getAttribute("data-id");
    const key = el.getAttribute("data-key");

    if (act === "back") {
      const prev = {
        dash: "home",
        target: "dash",
        plans: "target",
        mixer: "plans",
        workout: "mixer",
        done: "dash",
        settings: ui.settingsFrom || (ui.kid ? "dash" : "home"),
      };
      ui.screen = prev[ui.screen] || "home";
      render();
      window.scrollTo(0, 0);
      return;
    }
    if (act === "settings") {
      ui.settingsFrom = ui.screen;
      ui.screen = "settings";
      render();
      window.scrollTo(0, 0);
      return;
    }
    if (act === "pick-kid") {
      ui.kid = el.getAttribute("data-kid");
      ui.screen = "dash";
      render();
      window.scrollTo(0, 0);
      return;
    }
    if (act === "new-workout") {
      ui.target = Math.max(1, ui.target || 5);
      ui.screen = "target";
      render();
      window.scrollTo(0, 0);
      return;
    }
    if (act === "inc-target") {
      ui.target = Math.min(200, (ui.target || 0) + 1);
      render();
      return;
    }
    if (act === "dec-target") {
      ui.target = Math.max(1, (ui.target || 1) - 1);
      render();
      return;
    }
    if (act === "set-target") {
      ui.target = Math.max(1, parseInt(el.getAttribute("data-n"), 10) || 1);
      render();
      return;
    }
    if (act === "show-plans") {
      if (ui.target < 1) return;
      ui.screen = "plans";
      render();
      window.scrollTo(0, 0);
      return;
    }
    if (act === "open-mixer") {
      applyPlan(evenSplit(EXERCISES.map((e) => e.id), ui.target));
      ui.screen = "mixer";
      render();
      window.scrollTo(0, 0);
      return;
    }
    if (act === "start-plan") {
      const found = findPlan(key);
      if (!found) return;
      applyPlan(found.plan);
      goWorkout();
      return;
    }
    if (act === "edit-plan") {
      const found = findPlan(key);
      if (!found) return;
      applyPlan(found.plan);
      ui.screen = "mixer";
      render();
      window.scrollTo(0, 0);
      return;
    }
    if (act === "toggle-ex") {
      ui.included[id] = !ui.included[id];
      if (!ui.included[id]) ui.plan[id] = 0;
      render();
      return;
    }
    if (act === "inc-block") {
      if (!ui.included[id]) return;
      ui.plan[id] = (ui.plan[id] || 0) + 1;
      render();
      return;
    }
    if (act === "dec-block") {
      ui.plan[id] = Math.max(0, (ui.plan[id] || 0) - 1);
      render();
      return;
    }
    if (act === "slide-block") {
      if (!ui.included[id]) return;
      ui.plan[id] = Math.max(0, parseInt(el.value, 10) || 0);
      const valEl = el.closest(".mix-row").querySelector(".val");
      const meta = el.closest(".mix-row").querySelector(".rate");
      const blocks = ui.plan[id];
      valEl.innerHTML = `${ils(blocks)}`;
      meta.innerHTML = `${rate(id)} חזרות = ${ils(1)}${blocks ? " · " + blocks * rate(id) + " חזרות" : ""}`;
      const sum = planSum(ui.plan);
      const wrap = el.closest(".panel").querySelector(".prog-wrap");
      if (wrap) wrap.outerHTML = progressBlock(sum, ui.target);
      const cta = root.querySelector("[data-act=start-mixer]");
      if (cta) {
        cta.disabled = sum < 1;
        cta.innerHTML = `התחל אימון · ${ils(sum)}`;
      }
      return;
    }
    if (act === "fill-even") {
      const ids = EXERCISES.filter((e) => ui.included[e.id]).map((e) => e.id);
      if (!ids.length) {
        toast("צריך לבחור לפחות תרגיל אחד");
        return;
      }
      applyPlan(evenSplit(ids, ui.target));
      ids.forEach((i) => (ui.included[i] = true));
      render();
      return;
    }
    if (act === "fill-rest") {
      const ids = EXERCISES.filter((e) => ui.included[e.id]).map((e) => e.id);
      if (!ids.length) {
        toast("צריך לבחור לפחות תרגיל אחד");
        return;
      }
      const remain = ui.target - planSum(ui.plan);
      if (remain <= 0) {
        toast(remain === 0 ? "כבר הגעתם ליעד" : "הסכום כבר מעל היעד");
        return;
      }
      let dest = ids.filter((i) => (ui.plan[i] || 0) === 0);
      if (!dest.length) dest = ids;
      const add = evenSplit(dest, remain);
      dest.forEach((i) => (ui.plan[i] = (ui.plan[i] || 0) + add[i]));
      render();
      return;
    }
    if (act === "start-mixer") {
      goWorkout();
      return;
    }
    if (act === "toggle-set") {
      const i = parseInt(el.getAttribute("data-i"), 10);
      ensureChecks();
      ui.checks[id][i] = !ui.checks[id][i];
      render();
      return;
    }
    if (act === "finish") {
      finishWorkout();
      return;
    }
    if (act === "back-dash") {
      ui.screen = "dash";
      render();
      window.scrollTo(0, 0);
      return;
    }
    if (act === "another") {
      ui.screen = "target";
      render();
      window.scrollTo(0, 0);
      return;
    }
    if (act === "payout") {
      confirmModal(
        "לסמן שהיתרה שולמה?",
        "היתרה של " + kidById(ui.kid).name + " תאופס ל־0 ₪. האימונים יישארו בהיסטוריה עם סימון \"שולם\".",
        "כן, שולם",
        doPayout
      );
      return;
    }
    if (act === "dec-rate") {
      db.rates[id] = Math.max(1, rate(id) - 1);
      save();
      render();
      return;
    }
    if (act === "inc-rate") {
      db.rates[id] = Math.min(99, rate(id) + 1);
      save();
      render();
      return;
    }
    if (act === "rate-input") {
      const n = parseInt(String(el.value).replace(/\D/g, ""), 10);
      db.rates[id] = Math.min(99, Math.max(1, n || 1));
      save();
      render();
      return;
    }
    if (act === "reset-rates") {
      confirmModal("לחזור לברירת המחדל?", "מתח 8, שכיבות שמיכה 12, סקווטים 20, כפיפות בטן 20, גלגלת בטן 12.", "כן, אפס", () => {
        db.rates = { ...DEFAULT_RATES };
        save();
        render();
        toast("התעריפים חזרו לברירת המחדל");
      });
      return;
    }
  }

  function finishWorkout() {
    ensureChecks();
    let done = 0,
      total = 0;
    const earnedPlan = emptyPlan();
    const reps = emptyPlan();
    EXERCISES.forEach((e) => {
      const arr = ui.checks[e.id] || [];
      total += arr.length;
      const n = arr.filter(Boolean).length;
      done += n;
      earnedPlan[e.id] = n;
      reps[e.id] = n * rate(e.id);
    });
    if (done < 1) return;
    const apply = () => {
      const rec = db.kids[ui.kid];
      rec.workouts.push({
        id: uid(),
        ts: Date.now(),
        amount: done,
        sets: { ...earnedPlan },
        reps: { ...reps },
      });
      rec.balance += done;
      save();
      ui.lastEarned = done;
      ui.screen = "done";
      render();
      window.scrollTo(0, 0);
    };
    if (done < total) {
      confirmModal(
        "לסיים חלקית?",
        "סומנו " + done + " מתוך " + total + " סטים. יתווספו ₪" + done + " ליתרה.",
        "כן, הוסף ₪" + done,
        apply
      );
    } else apply();
  }

  function doPayout() {
    const rec = db.kids[ui.kid];
    if (rec.balance <= 0) return;
    rec.payouts.push({ id: uid(), ts: Date.now(), amount: rec.balance });
    rec.balance = 0;
    save();
    render();
    toast("היתרה אופסה. מסומן כשולם.");
  }

  function confirmModal(title, text, okLabel, onOk) {
    modalRoot.innerHTML = `<div class="modal">
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(text)}</p>
      <div class="actions">
        <button class="btn ghost row" id="m-cancel">ביטול</button>
        <button class="btn primary row" id="m-ok">${escapeHtml(okLabel)}</button>
      </div>
    </div>`;
    const close = () => {
      modalRoot.innerHTML = "";
    };
    document.getElementById("m-cancel").onclick = close;
    document.getElementById("m-ok").onclick = () => {
      close();
      onOk();
    };
    modalRoot.onclick = (e) => {
      if (e.target === modalRoot) close();
    };
  }

  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2400);
  }

  /* ---------- screenshot / deep-link helpers ---------- */
  function applyShot(name) {
    const seed = () => {
      if (!db.kids.adam.workouts.length) {
        db.kids.adam.workouts.push({
          id: "demo1",
          ts: Date.now() - 86400000,
          amount: 5,
          sets: { pullups: 1, pushups: 1, squats: 1, situps: 1, abwheel: 1 },
          reps: { pullups: 8, pushups: 12, squats: 20, situps: 20, abwheel: 12 },
        });
        db.kids.adam.balance = 5;
      }
    };
    ui.kid = "adam";
    ui.target = 5;
    applyPlan(evenSplit(["pullups", "pushups", "squats", "situps", "abwheel"], 5));
    if (name === "home") {
      ui.screen = "home";
      ui.kid = null;
    } else if (name === "dash") {
      seed();
      ui.screen = "dash";
    } else if (name === "target") ui.screen = "target";
    else if (name === "plans") ui.screen = "plans";
    else if (name === "mixer") ui.screen = "mixer";
    else if (name === "workout") {
      ensureChecks();
      ui.checks.pullups[0] = true;
      ui.screen = "workout";
    } else if (name === "done") {
      seed();
      ui.lastEarned = 5;
      ui.screen = "done";
    } else if (name === "settings") ui.screen = "settings";
  }

  const params = new URLSearchParams(location.search);
  if (params.get("shot")) applyShot(params.get("shot"));

  render();
})();
