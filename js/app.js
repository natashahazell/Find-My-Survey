/* Find My Survey — case file prototype (v2). No data leaves the browser. */
(function () {
  "use strict";
  const C = window.FMS;
  const app = document.getElementById("app");
  const SAVE_KEY = "fms-case-v2";
  const WEEK = 7 * 24 * 3600 * 1000;
  const DAY = 864e5;
  const ROUTES = { buying: "Buying a home", condition: "A home I own", works: "Building work", valuing: "A valuation", dispute: "A dispute or claim", worry: "A specific concern" };
  const TYPES = { detached: "Detached house", semi: "Semi-detached or terraced house", bungalow: "Bungalow", flat: "Flat or maisonette", newbuild: "New build" };

  let S = fresh();
  function fresh() {
    return { screen: "landing", brief: "", match: null, preFlags: {}, history: [], explain: null, showHelp: false, pending: [],
             caseNo: "FMS-" + String(Date.now()).slice(-6), opened: new Date().toISOString().slice(0, 10) };
  }

  /* ---------- Storage (optional) ---------- */
  function save() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(Object.assign({}, S, { explain: null, savedAt: Date.now() }))); } catch (e) {}
  }
  function loadSaved() {
    try {
      const d = JSON.parse(localStorage.getItem(SAVE_KEY) || "null");
      if (d && d.history && d.history.length && Date.now() - d.savedAt < WEEK) return d;
    } catch (e) {}
    return null;
  }
  function clearSaved() { try { localStorage.removeItem(SAVE_KEY); } catch (e) {} }

  /* ---------- Engine ---------- */
  const qById = Object.fromEntries(C.questions.map(q => [q.id, q]));
  const optOf = (qid, v) => (qById[qid].options || []).find(o => o.v === v);
  const vals = v => Array.isArray(v) ? v : [v];

  function derive() {
    const flags = Object.assign({}, S.preFlags);
    const scores = {}, reasons = [], also = [], mins = [], notes = [], tells = [];
    const push = (arr, x) => { if (x && !arr.includes(x)) arr.push(x); };
    for (const h of S.history) {
      const q = qById[h.qid];
      flags["_" + h.qid] = h.v;
      if (q.type === "date") { flags[q.dateKey] = h.v === "none" ? null : h.v; continue; }
      for (const v of vals(h.v)) {
        const o = optOf(h.qid, v);
        if (!o) continue;
        Object.assign(flags, o.set || {});
        for (const [k, w] of Object.entries(o.score || {})) scores[k] = (scores[k] || 0) + w;
        if (o.min) mins.push(o.min);
        if (o.why) reasons.push({ text: o.why, red: o.min === "L3" });
        (o.also || []).forEach(a => push(also, a));
        push(notes, o.note);
        push(tells, o.tell);
      }
    }
    if (flags.needsPlans) push(also, "MEAS");
    return { flags, scores, reasons, also, mins, notes, tells };
  }

  function nextQuestion(d) {
    const answered = new Set(S.history.map(h => h.qid));
    return C.questions.find(q => !answered.has(q.id) && (!q.when || q.when(d.flags))) || null;
  }

  const ranked = d => Object.entries(d.scores).filter(([k, v]) => v > 0 && C.outcomes[k]).sort((a, b) => b[1] - a[1]);

  function decide(d) {
    const f = d.flags;
    // Level 1 only for homes built in the last 10 years.
    const l1Allowed = !!f.recent;
    let r = ranked(d).filter(([k]) => k !== "L1" || l1Allowed);
    if (!r.length) r = [[f.route === "valuing" ? "RB" : "L2", 1]];
    let primary = r[0][0];
    const notes = [];
    const minRank = Math.max(0, ...d.mins.map(m => C.outcomes[m].rank));
    if (C.outcomes[primary].family === "survey" && minRank > C.outcomes[primary].rank) {
      primary = "L" + minRank;
      notes.push("Some of your answers mean anything less than " + C.outcomes[primary].short + " could miss important issues.");
    }
    if (!l1Allowed && d.scores.L1 > (d.scores[primary] || 0) && C.outcomes[primary].family === "survey" && primary === "L2") {
      notes.push(`Level 1 is only suggested for homes built in ${C.TEN_YEARS_AGO} or later, so we've located Level 2.`);
    }
    let valuation = false;
    if (C.outcomes[primary].family === "survey" && f.wantVal) {
      valuation = true;
      if (primary === "L1") { primary = "L2"; notes.push("Level 1 doesn't include a valuation, so we've located Level 2 with valuation."); }
    }
    const belowMin = k => C.outcomes[k].family === "survey" && (C.outcomes[k].rank < minRank || (k === "L1" && (!l1Allowed || valuation)));
    const runnerHit = r.find(([k]) => k !== primary && !belowMin(k));
    const runner = runnerHit ? runnerHit[0] : null;
    const also = d.also.filter(a => a !== primary);
    const sP = Math.max(d.scores[primary] || 0, 1), sR = runnerHit ? Math.max(runnerHit[1], 0) : 0;
    const certainty = minRank && C.outcomes[primary].family === "survey" ? 10 : 0;
    const confidence = Math.max(35, Math.min(97, Math.round(40 + 45 * Math.max(sP - sR, 0) / sP + Math.min(15, S.history.length * 2) + certainty)));
    return { primary, runner, also, valuation, notes, confidence };
  }

  function candidates(d) {
    if (S.history.length < 2) return Object.keys(C.outcomes).length;
    return Math.max(1, ranked(d).length);
  }

  /* ---------- Timeline guidance ---------- */
  const fmt = iso => new Date(iso + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  const addDays = (iso, n) => new Date(Date.parse(iso + "T12:00:00") + n * DAY).toISOString().slice(0, 10);
  const today = () => new Date().toISOString().slice(0, 10);
  const daysUntil = iso => Math.round((Date.parse(iso + "T12:00:00") - Date.parse(today() + "T12:00:00")) / DAY);

  function timeline(f, R) {
    const P = R.primary, out = { steps: [], advice: [], date: null };
    const mark = (labels, nowIdx) => labels.map((t, i) => ({ t, state: i < nowIdx ? "done" : i === nowIdx ? "now" : "next" }));
    const typical = "Surveyors can often inspect within one to two weeks of instruction, with the report about a week later; Level 3 reports can take longer. Confirm timings when you book.";

    if (f.route === "buying" && f.newbuild) {
      out.steps = mark(["Reserve", "Exchange", "Pre-completion inspection", "Completion", "Builder's 2-year period", "Warranty years 3–10"], f.nbStage === "within2" ? 4 : 2);
      out.advice.push(f.nbStage === "within2" ? "Instruct the snagging inspection now and report defects to the builder in writing while they remain responsible." : "Book the snagging inspection for the days just before completion, once the home is finished.");
      if (f.targetDate) out.date = { label: "Completion", iso: f.targetDate };
    } else if (f.route === "buying") {
      const idx = { looking: 0, offer: 1, searches: 1, exchange: 1, exchanged: 5 }[f.stage] ?? 1;
      out.steps = mark(["Offer accepted", "Instruct survey", "Inspection", "Report and questions", "Exchange", "Completion"], idx);
      if (f.stage === "looking") out.advice.push("Line up a surveyor now, but instruct once your offer is accepted.");
      if (["offer", "searches"].includes(f.stage)) out.advice.push("Instruct now. The report should be back before you exchange, while you can still ask questions or renegotiate.");
      if (f.stage === "exchange") out.advice.push("Instruct today and tell the surveyor your exchange date. Don't exchange until you've read the report.");
      if (f.stage === "exchanged") out.advice.push("Once contracts are exchanged you're committed. A survey now helps you plan repairs rather than negotiate.");
      if (f.chain === "none") out.advice.push("Chain-free purchases can move quickly, so don't wait.");
      if (f.chain === "long") out.advice.push("Long chains often take longer overall, but a late survey can hold everyone up. Instruct early so any renegotiation happens early.");
      out.advice.push(typical);
      if (f.targetDate) out.date = { label: "Exchange / completion", iso: f.targetDate };
    } else if (f.route === "condition") {
      out.steps = mark(["Instruct", "Inspection", "Report", f._q_c_why === "selling" ? "Put the home on the market" : "Plan repairs and works"], 0);
      if (f._q_c_why === "selling") out.advice.push("Before you market the home, so problems don't surface late and delay the sale.");
      out.advice.push(typical);
    } else if (P === "PW" || f.route === "works") {
      out.steps = mark(["Instruct surveyor", "Serve notice", "Neighbour responds (14 days)", "Award agreed", "Work starts"], 0);
      const months = f.pwType === "wall" ? 2 : 1;
      if (f.pwType) out.advice.push(`Notices must be served at least ${months} month${months > 1 ? "s" : ""} before this kind of work starts.`);
      if (f.startDate && f.pwType) out.advice.push(`To start on ${fmt(f.startDate)}, serve notice by ${fmt(addDays(f.startDate, -months * 30))} at the latest; earlier is safer.`);
      if (f.neighbourWorks) out.advice.push("If you receive a notice, you have 14 days to respond. Arrange a schedule of condition before work begins.");
      if (f.startDate) out.date = { label: "Planned start", iso: f.startDate };
    } else if (P === "HTB" || P === "SO") {
      out.steps = mark(["Instruct valuer", "Inspection", "Report (valid 3 months)", P === "HTB" ? "Send to Homes England within 5 days" : "Send to your provider", "Complete"], 0);
      out.advice.push("Time the valuation so it is still valid when the transaction completes; it lasts 3 months.");
      if (f.deadline) out.advice.push(`For ${fmt(f.deadline)}, instruct no earlier than about ${fmt(addDays(f.deadline, -84))}, leaving time for checks.`);
      if (f.deadline) out.date = { label: "Your date", iso: f.deadline };
    } else if (P === "PROB") {
      out.steps = mark(["Date of death", "Instruct valuer", "Valuation at date of death", "Inheritance tax paid", "Estate administered"], 1);
      out.advice.push("Inheritance tax is normally due by the end of the sixth month after the death, so instruct early.");
    } else if (f.route === "dispute") {
      out.steps = mark(["Problem noticed", "Speak to a solicitor", "Expert instructed", "Report", "Resolution"], 1);
      if (f.boundaryQ) out.steps = mark(["Talk to your neighbour", "Boundary survey", "Mediation", "Agreement recorded"], 1);
      if (f.claim || ["mid", "old", "unsure"].includes(f.awareness)) out.advice.push("Claims have strict legal time limits. Speak to a solicitor now rather than waiting for a report.");
    } else if (f.route === "worry") {
      out.steps = mark(["Instruct", "Inspection", "Diagnosis", "Repair"], 0);
      if (f.active || f.severe) out.advice.push("Active or severe cracking: get advice promptly. If you own the home and suspect subsidence, tell your insurer before repairs.");
      if (f.buyingToo) out.advice.push("If you're buying, instruct before you exchange.");
    } else {
      out.steps = mark(["Instruct", "Inspection", "Report"], 0);
      if (f.deadline) out.date = { label: "Your date", iso: f.deadline };
    }

    if (out.date) {
      const n = daysUntil(out.date.iso);
      out.date.days = n;
      if (n < 0) out.advice.unshift(`Your date (${fmt(out.date.iso)}) has passed. Check it with your conveyancer or adviser.`);
      else if (n <= 14 && f.route === "buying") out.advice.unshift(`${n} days to go. That is tight: instruct today and tell the surveyor your deadline.`);
      else if (n <= 28) out.advice.unshift(`${n} days to go. Instruct this week.`);
    }
    return out;
  }

  /* ---------- New-build warranty guidance ---------- */
  function warrantyGuidance(f, R) {
    if (!(f.recent || f.newbuild)) return [];
    const g = [];
    if (f.newbuild || f.warranty === "builder") g.push("While the builder is responsible (usually the first 2 years), a snagging inspection or Level 1 records defects so you can report them in writing.");
    if (f.warranty === "structural") g.push("In years 3–10, warranties usually cover specified structural defects only. A Level 1 or 2 shows what is yours to maintain.");
    if (f.warranty === "none") g.push("Without a recognised warranty, lenders may need a Professional Consultant's Certificate. Level 2 is the safer choice.");
    if (f.extension) g.push("Alterations made after the home was built are not covered by the original warranty.");
    g.push("Ask your conveyancer for the warranty certificate and confirm it passes to you.");
    return g;
  }

  /* ---------- Actions ---------- */
  function answer(qid, v) {
    const o = !Array.isArray(v) && optOf(qid, v);
    S.history.push({ qid, v });
    S.showHelp = false; S.pending = [];
    if (o && o.unsure) { S.explain = { q: qById[qid] }; S.screen = "explain"; }
    else advance();
    save(); render();
  }
  function advance() { S.screen = nextQuestion(derive()) ? "question" : "result"; }
  function back() {
    if (!S.history.length) { S.screen = "brief"; return render(); }
    S.history.pop(); S.explain = null; S.showHelp = false; S.pending = [];
    S.screen = "question";
    save(); render();
  }
  function startFromBrief(text) {
    S.brief = text.trim(); S.history = []; S.preFlags = {}; S.match = null;
    if (S.brief) {
      const hits = C.keywords.filter(k => k.re.test(S.brief));
      // A specific line of enquiry beats a single concern; the concern is carried over as flags.
      const routeHit = hits.find(h => h.route && !h.ambiguous && h.route !== "worry") || hits.find(h => h.route === "worry");
      if (routeHit && routeHit.route !== "worry") hits.filter(h => h.flags).forEach(h => Object.assign(S.preFlags, h.flags));
      const amb = hits.find(h => h.ambiguous);
      const suggest = {};
      hits.forEach(h => Object.assign(suggest, h.suggest || {}));
      hits.forEach(h => { if (h.flag) S.preFlags[h.flag] = true; });
      if (amb && !routeHit) S.match = { hint: amb.hint, ambiguous: amb.ambiguous, suggest };
      else if (routeHit) { S.match = { hint: routeHit.hint, route: routeHit.route, suggest }; S.history.push({ qid: "q_route", v: routeHit.route, auto: true }); }
    }
    S.screen = "question"; save(); render();
  }

  /* ---------- Rendering ---------- */
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const L = i => String.fromCharCode(65 + i);
  const pad = n => String(n).padStart(2, "0");

  function index(stage) {
    return `<ol class="index" aria-label="Case progress">${C.stages.map((s, i) =>
      `<li class="${i < stage ? "done" : i === stage ? "now" : ""}" ${i === stage ? 'aria-current="step"' : ""}><span class="n">${pad(i + 1)}</span><span class="s">${esc(s)}</span></li>`).join("")}</ol>`;
  }

  function caseFile(d, open) {
    const f = d.flags, lean = S.history.length >= 2 ? decide(d) : null, n = candidates(d);
    const label = (qid) => { const h = S.history.find(x => x.qid === qid); if (!h) return null; return vals(h.v).map(v => (optOf(qid, v) || {}).label).filter(Boolean).join(", "); };
    const property = [f._q_p_type && TYPES[f._q_p_type], label("q_p_flat"), label("q_p_age"), label("q_p_build")].filter(Boolean).join(" · ");
    const concerns = [label("q_c_issue"), label("q_c_crack"), label("q_c_damp"), label("q_x_kind"), label("q_w_what"), label("q_d_kind"), label("q_v_why")].filter(Boolean).join(" · ");
    const dateIso = f.targetDate || f.startDate || f.deadline;
    const tl = [label("q_t_stage") || label("q_p_nb"), label("q_t_chain"), dateIso && fmt(dateIso)].filter(Boolean).join(" · ");
    const row = (k, v) => `<div class="cf-row"><dt>${k}</dt><dd>${v ? esc(v) : '<span class="blank">—</span>'}</dd></div>`;
    return `<details class="casefile" ${open ? "open" : ""}><summary><span class="mono">Case file</span><span class="mono">${esc(S.caseNo)}</span></summary>
      <div class="status"><span class="ping" aria-hidden="true"></span><span class="mono">${lean ? (n <= 3 ? "Narrowing" : "Searching") : "Searching"}</span><span class="cnt">${n} possible service${n === 1 ? "" : "s"}</span></div>
      <dl>
        ${row("Opened", fmt(S.opened))}
        ${row("Enquiry", f.route && ROUTES[f.route])}
        ${row("Brief", S.brief)}
        ${row("Property", property)}
        ${row("Concerns", concerns)}
        ${row("Timeline", tl)}
        ${row("Last seen near", lean ? C.outcomes[lean.primary].short : "")}
      </dl></details>`;
  }

  function landing() {
    const saved = loadSaved();
    return `<section class="landing">
      <div class="land-copy">
        <p class="mono label">Case 001 — Missing</p>
        <h1>Your survey is missing.<br>Let's find it.</h1>
        <p class="lead">Open a case, answer a few precise questions about the property, your concern and your timeline. We'll locate the RICS survey, valuation or specialist you need, explain what it covers, and tell you when to instruct it.</p>
        <div class="actions">
          <button class="btn solid" data-act="begin">Open a case</button>
          ${saved ? `<button class="btn" data-act="resume">Resume case ${esc(saved.caseNo)}</button>` : ""}
        </div>
      </div>
      <div class="land-art" aria-hidden="true">
        <svg viewBox="0 0 400 400"><g fill="none" stroke="currentColor" stroke-width=".75"><circle cx="200" cy="200" r="60"/><circle cx="200" cy="200" r="120" opacity=".6"/><circle cx="200" cy="200" r="180" opacity=".3"/><path d="M200 10v380M10 200h380" opacity=".25"/></g><circle class="dot" cx="248" cy="164" r="5"/></svg>
      </div>
      <ul class="facts-row">
        <li><span class="mono">01</span>Free and anonymous. Nothing you enter leaves your device.</li>
        <li><span class="mono">02</span>Based on the RICS Home Survey Standard descriptions.</li>
        <li><span class="mono">03</span>Guidance only. A surveyor confirms the right service.</li>
      </ul>
    </section>`;
  }

  function brief() {
    return `<section class="stage-wrap narrow">
      ${index(0)}
      <p class="mono label">${esc(S.caseNo)} · Brief</p>
      <h2 id="qtitle" tabindex="-1">Describe the case in a sentence.</h2>
      <p class="muted">We'll use it to skip questions you've already answered.</p>
      <form data-form="brief">
        <label class="sr-only" for="brief">Case brief</label>
        <textarea id="brief" rows="3" placeholder="e.g. Offer accepted on a 1930s semi with a loft conversion; exchange planned for March">${esc(S.brief)}</textarea>
        <div class="chips">${C.chips.map(c => `<button type="button" class="chip" data-chip="${esc(c)}">${esc(c)}</button>`).join("")}</div>
        <div class="bar"><button type="button" class="link" data-act="skip">Skip</button><button class="btn solid" type="submit">Continue</button></div>
      </form>
    </section>`;
  }

  function noteBlock(id) {
    const n = C.notes[id];
    return n ? `<aside class="note"><span class="mono">Case note</span><strong>${esc(n.title)}</strong><p>${esc(n.text)}</p><small>${esc(n.source)}</small></aside>` : "";
  }

  function question(d) {
    const q = nextQuestion(d);
    if (!q) { S.screen = "result"; return result(d); }
    const sug = (S.match && S.match.suggest) || {};
    const amb = q.id === "q_route" && S.match && S.match.ambiguous ? S.match.ambiguous : [];
    const last = S.history[S.history.length - 1];
    const lastNote = last && !Array.isArray(last.v) && (optOf(last.qid, last.v) || {}).note;
    let banner = "";
    if (amb.length) banner = `<p class="flag">You mentioned ${esc(S.match.hint.toLowerCase())}. Is this about building work, or a dispute over the boundary or damage?</p>`;
    else if (S.match && S.match.route && S.history.length === 1 && S.history[0].auto) banner = `<p class="flag">From your brief: <strong>${esc(S.match.hint)}</strong>. <button class="link" data-act="back">Change</button></p>`;

    let body;
    if (q.type === "date") {
      body = `<div class="datefield"><label for="dateinput" class="mono">Date</label><input id="dateinput" type="date" min="${today()}"></div>
        <div class="bar"><button class="link" data-date="none">No date yet</button><button class="btn solid" data-date="set">Continue</button></div>`;
    } else {
      body = `<div class="options" role="${q.multi ? "group" : "list"}">${q.options.map((o, i) => {
        const hl = sug[q.id] === o.v || amb.includes(o.v);
        const on = q.multi && S.pending.includes(o.v);
        return `<button class="opt${hl ? " suggested" : ""}${on ? " on" : ""}" data-q="${q.id}" data-v="${esc(o.v)}" ${q.multi ? `aria-pressed="${on}"` : ""}>
          <span class="mono k">${q.multi ? `<span class="box"></span>` : L(i)}</span>
          <span class="txt"><span class="ol">${esc(o.label)}</span>${o.sub ? `<span class="os">${esc(o.sub)}</span>` : ""}</span>
          ${hl ? `<span class="mono tag">Suggested</span>` : q.multi ? "<span></span>" : `<span class="arrow" aria-hidden="true">→</span>`}
        </button>`; }).join("")}</div>
        ${q.multi ? `<div class="bar"><span class="muted small">${S.pending.length} selected</span><button class="btn solid" data-act="multi" ${S.pending.length ? "" : "disabled"}>Continue</button></div>` : ""}`;
    }
    return `<div class="grid">
      <section class="stage-wrap">
        ${index(q.stage)}
        <p class="mono label">${esc(S.caseNo)} · ${pad(q.stage + 1)} ${esc(C.stages[q.stage])}${q.followUp ? " · Follow-up" : ""}</p>
        ${banner}
        <h2 id="qtitle" tabindex="-1">${esc(q.text)}</h2>
        ${q.help ? `<button class="link why" data-act="help" aria-expanded="${S.showHelp}">Why we ask</button>${S.showHelp ? `<p class="help">${esc(q.help)}</p>` : ""}` : ""}
        ${body}
        <div class="bar end"><button class="link" data-act="back">← Back</button><span class="muted small">${S.history.length} answered</span></div>
        ${lastNote ? noteBlock(lastNote) : ""}
      </section>
      <div class="side">${caseFile(d, window.innerWidth > 900)}</div>
    </div>`;
  }

  function explain(d) {
    const q = S.explain.q;
    return `<div class="grid"><section class="stage-wrap">
      ${index(q.stage)}
      <p class="mono label">Not sure · that's fine</p>
      <h2 id="qtitle" tabindex="-1">${esc(q.text)}</h2>
      <p class="help">${esc(q.help || "We'll take the cautious route so nothing important is missed.")}</p>
      <p class="muted">We've applied a cautious default that never lowers the level of survey we locate.</p>
      <div class="bar end"><button class="link" data-act="back">← Back</button><button class="btn solid" data-act="continue">Continue</button></div>
    </section><div class="side">${caseFile(d, window.innerWidth > 900)}</div></div>`;
  }

  const list = items => `<ul class="plain">${items.map(i => `<li>${esc(i)}</li>`).join("")}</ul>`;
  const section = (n, title, inner) => `<section class="rsec"><div class="rlabel"><span class="mono">${pad(n)}</span><h3>${esc(title)}</h3></div><div class="rbody">${inner}</div></section>`;

  function result(d) {
    const R = decide(d), O = C.outcomes[R.primary], f = d.flags;
    // Only Level 2 has a "survey and valuation" product; for Level 3 a valuation is an agreed extra service.
    const l3Val = R.valuation && R.primary === "L3";
    const title = R.valuation ? O.short + (l3Val ? " + valuation" : " with valuation") : O.short;
    const fullName = R.valuation ? (l3Val ? O.name + ", with market valuation agreed as an extra service" : O.name + " (survey and valuation)") : O.name;
    const reasons = d.reasons.filter(r => r.red).concat(d.reasons.filter(r => !r.red).reverse()).map(r => r.text).filter((t, i, a) => a.indexOf(t) === i).slice(0, 4);
    const who = O.who.slice(), rules = (O.rules || []).slice();
    if (R.primary === "HTB") {
      if (f.htbYear === "2021") who.unshift("Must be an RICS member or fellow (MRICS or FRICS): required for Help to Buy: Equity Loan (2021–2023)");
      if (f.htbYear === "unsure") who.unshift("If your loan is from the 2021–2023 scheme the valuer must be MRICS or FRICS; choosing one covers either case");
      if (f.htbSpecial) rules.unshift("Cladding or a planning breach: Homes England may require a specialist valuation");
    }
    const covers = O.covers.concat(!R.valuation ? [] : l3Val
      ? ["Market value and reinstatement cost, if agreed in writing before the inspection as an extra service"]
      : O.valuationAdds || []);
    const notCovers = O.notCovers.filter(n => !(R.valuation && /valuation/i.test(n)));
    const alerts = [];
    if (f.needsPlans && R.primary !== "MEAS") alerts.push("You need floor plans or sizes. Home surveys and valuations take no measurements, so you'll also need a measured survey.");
    if (f.boundaryQ && R.primary === "PW") alerts.push("A party wall surveyor won't settle where the boundary is. If that's in doubt, you need a boundary survey too.");
    if (f.route === "buying" && f._q_t_money === "mortgage" && !R.valuation) alerts.push("Your lender's valuation is for the lender. It is not a survey.");
    if (f.ews1 && O.family === "survey") alerts.push("No RICS Home Survey inspects external wall systems." + (R.valuation ? " The valuation may be held back until they are investigated." : ""));
    if (f.structural && O.family === "survey") alerts.push("With cracking of 5 mm or more, expect the surveyor to recommend a structural engineer. You can instruct one alongside the survey to save time.");
    const tl = timeline(f, R), wg = warrantyGuidance(f, R);
    const tells = d.tells.concat(f.route === "buying" ? ["The agreed or proposed price"] : []);
    const specialists = R.also.map(a => C.outcomes[a]);
    const runner = R.runner && C.outcomes[R.runner];
    const strength = R.confidence >= 80 ? "Strong" : R.confidence >= 60 ? "Good" : "Possible";
    let n = 0;
    clearSaved();

    return `<article class="result">
      ${index(4)}
      <header class="r-head">
        <p class="mono label"><span class="ping" aria-hidden="true"></span>Located · ${esc(S.caseNo)}</p>
        <h1 id="qtitle" tabindex="-1">${esc(title)}</h1>
        <p class="lead">${esc(O.tagline)}</p>
        <dl class="meta"><div><dt class="mono">Service</dt><dd>${esc(fullName)}</dd></div><div><dt class="mono">Match</dt><dd>${strength}</dd></div>${runner ? `<div><dt class="mono">Also possible</dt><dd>${esc(runner.short)}</dd></div>` : ""}</dl>
        ${R.notes.map(x => `<p class="flag">${esc(x)}</p>`).join("")}
      </header>

      ${section(++n, "Why this fits", list(reasons.length ? reasons : ["It best matches your answers overall"]))}

      ${section(++n, "Timeline", `<ol class="tline">${tl.steps.map(s => `<li class="${s.state}"><span class="tdot"></span><span>${esc(s.t)}</span>${s.state === "now" ? '<em class="mono">You are here</em>' : ""}</li>`).join("")}</ol>
        ${tl.date ? `<p class="mono small">${esc(tl.date.label)}: ${fmt(tl.date.iso)}${tl.date.days >= 0 ? ` · ${tl.date.days} days` : ""}</p>` : ""}
        ${tl.advice.length ? list(tl.advice) : ""}`)}

      ${section(++n, "Scope", `<div class="two"><div><h4 class="mono">Covers</h4>${list(covers)}</div><div><h4 class="mono">Does not cover</h4>${list(notCovers)}</div></div>`)}

      ${alerts.length ? section(++n, "Check before you instruct", list(alerts)) : ""}

      ${section(++n, "Who to instruct", list(who) + (rules.length ? `<h4 class="mono">Rules</h4>${list(rules)}` : ""))}

      ${specialists.length ? section(++n, "Specialists you may also need", `<table class="spec"><thead><tr><th class="mono">Specialist</th><th class="mono">Look for</th></tr></thead><tbody>${specialists.map(s => `<tr><td>${esc(s.short)}<span class="muted">${esc(s.tagline)}</span></td><td>${esc(s.who.join(". "))}</td></tr>`).join("")}</tbody></table>`) : ""}

      ${wg.length ? section(++n, "New-home warranty", list(wg)) : ""}

      ${O.family === "survey" ? section(++n, "Tell your surveyor before the inspection", list(tells.length ? tells : ["Any particular concerns about the property"]) + `<p class="muted small">RICS terms ask you to share the price and any concerns before the inspection.</p>`) : ""}

      ${O.family === "survey" ? section(++n, "How the levels compare", compareTable(R)) : ""}

      ${d.notes.length ? section(++n, "Case notes", `<div class="notes">${d.notes.map(id => `<div><strong>${esc(C.notes[id].title)}</strong><p>${esc(C.notes[id].text)}</p><small class="mono">${esc(C.notes[id].source)}</small></div>`).join("")}</div>`) : ""}

      ${section(++n, "Next steps", `<ol class="steps"><li>Find an RICS-regulated firm and check the designations above.</li><li>Share this case file and anything the service doesn't cover.</li><li>Get written terms of engagement before the inspection.</li></ol>
        <div class="actions noprint"><a class="btn solid" href="https://www.ricsfirms.com/" target="_blank" rel="noopener">Find an RICS surveyor</a><button class="btn" data-act="print">Save case file (PDF)</button><button class="btn" data-act="restart">Open a new case</button></div>`)}

      <p class="disclaimer">General guidance, not professional advice. A qualified surveyor will confirm the right service. Not affiliated with or endorsed by RICS.</p>
      <div class="bar noprint"><button class="link" data-act="back">← Back</button></div>
    </article>`;
  }

  function compareTable(R) {
    const rows = [
      ["Condition ratings and risks listed", 1, 1, 1, 1],
      ["Helps you decide on further advice before buying", 0, 1, 1, 1],
      ["Advice on repairs and maintenance", 0, 1, 1, 1],
      ["Enters the roof space", 0, 1, 1, 1],
      ["Market value and reinstatement cost", 0, 0, 1, 0],
      ["How it's built and how materials will perform", 0, 0, 0, 1],
      ["Hidden defects, causes, repair options and timescales", 0, 0, 0, 1],
      ["Energy efficiency commentary", 0, 0, 0, 1],
    ];
    const col = R.primary === "L1" ? 1 : R.primary === "L2" ? (R.valuation ? 3 : 2) : R.primary === "L3" ? 4 : 0;
    const th = ["", "Level 1", "Level 2", "Level 2 + valuation", "Level 3"];
    return `<div class="tablewrap"><table class="cmp"><thead><tr>${th.map((h, i) => `<th class="mono${i === col ? " hi" : ""}">${h}</th>`).join("")}</tr></thead><tbody>
      ${rows.map(r => `<tr><td>${esc(r[0])}</td>${r.slice(1).map((c, i) => `<td class="${i + 1 === col ? "hi" : ""}">${c ? "●" : "–"}</td>`).join("")}</tr>`).join("")}
      </tbody></table></div><p class="muted small">Source: RICS, Helping you choose the right survey. Level 1 suggested only for homes built in ${C.TEN_YEARS_AGO} or later.</p>`;
  }

  function render() {
    const d = derive();
    const view = { landing, brief, question, explain, result }[S.screen] || landing;
    app.innerHTML = view(d);
    document.body.dataset.screen = S.screen;
    const h = document.getElementById("qtitle");
    if (h) h.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }

  app.addEventListener("click", e => {
    const t = e.target.closest("button, a");
    if (!t) return;
    if (t.dataset.q) {
      const q = qById[t.dataset.q];
      if (q.multi) {
        const v = t.dataset.v, o = optOf(q.id, v);
        if (o.exclusive) S.pending = S.pending.includes(v) ? [] : [v];
        else { S.pending = S.pending.filter(x => !optOf(q.id, x).exclusive); S.pending = S.pending.includes(v) ? S.pending.filter(x => x !== v) : S.pending.concat(v); }
        return render();
      }
      return answer(q.id, t.dataset.v);
    }
    if (t.dataset.date) {
      const q = nextQuestion(derive());
      if (t.dataset.date === "none") return answer(q.id, "none");
      const v = document.getElementById("dateinput").value;
      if (!v) { document.getElementById("dateinput").focus(); return; }
      return answer(q.id, v);
    }
    if (t.dataset.chip) { const ta = document.getElementById("brief"); ta.value = t.dataset.chip; ta.focus(); return; }
    const a = t.dataset.act;
    if (!a) return;
    if (a === "begin" || a === "restart") { S = fresh(); S.screen = "brief"; clearSaved(); }
    else if (a === "resume") { Object.assign(S, loadSaved()); advance(); }
    else if (a === "skip") return startFromBrief("");
    else if (a === "back") return back();
    else if (a === "help") S.showHelp = !S.showHelp;
    else if (a === "continue") { S.explain = null; advance(); }
    else if (a === "multi") { const q = nextQuestion(derive()); return answer(q.id, S.pending.slice()); }
    else if (a === "print") return window.print();
    render();
  });
  app.addEventListener("submit", e => { e.preventDefault(); if (e.target.dataset.form === "brief") startFromBrief(document.getElementById("brief").value); });
  document.getElementById("home").addEventListener("click", e => { e.preventDefault(); S.screen = "landing"; render(); });

  window.FMS_debug = { state: () => S, derive, decide, timeline };
  render();
})();
