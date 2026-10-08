const MODULE_ID = "pf2e-all-resistance-errata";
const PATCHED = Symbol(`${MODULE_ID}.patched`);
const IN_PROGRESS = Symbol(`${MODULE_ID}.inProgress`);

const pendingIWR = new Map();

function t(key, data) {
  const fullKey = `${MODULE_ID}.${key}`;
  try {
    if (data) return game.i18n.format(fullKey, data);
    return game.i18n.localize(fullKey);
  } catch (e) { return fullKey; }
}

const DAMAGE_COLORS = {
  acid: "#a8d94a", bleed: "#c0392b", bludgeoning: "#656565", cold: "#4db8ff",
  electricity: "#ffd93b", fire: "#ff6b35", force: "#b070ff", mental: "#d47aff",
  negative: "#000000", piercing: "#656565", poison: "#6ab04c", positive: "#ffd700",
  slashing: "#656565", sonic: "#7fc4ff", spirit: "#DAD4FF", vitality: "#FFED8E",
  void: "#000000", untyped: "#FFCBCB",
};
const NEUTRAL_COLOR = "#e8e8e8";

function colorFor(type) { return DAMAGE_COLORS[type] ?? NEUTRAL_COLOR; }

function resistanceChipColor(r) {
  if (!r) return NEUTRAL_COLOR;
  if (r.type === "all-damage") return NEUTRAL_COLOR;
  if (isDamageType(r.type)) return colorFor(r.type);
  return NEUTRAL_COLOR;
}

function capitalizeFirst(s) {
  if (!s || typeof s !== "string") return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function isDamageType(type) {
  return type !== "all-damage" && Object.prototype.hasOwnProperty.call(DAMAGE_COLORS, type);
}

const CSS = `
  .pf2e-ar {
    --ar-text: var(--color-text-primary, #e8e8e8);
    --ar-text-strong: var(--color-text-light-highlight, #fff);
    --ar-bg-hero: rgba(255,255,255,0.03);
    --ar-bg-baseline: rgba(0,0,0,0.22);
    --ar-bg-option: rgba(0,0,0,0.15);
    --ar-bg-option-hover: rgba(255,255,255,0.05);
    --ar-bg-option-selected: rgba(255,100,0,0.07);
    --ar-border: var(--color-border-light-2, rgba(255,255,255,0.15));
    --ar-border-soft: rgba(255,255,255,0.12);
    --ar-num-gold: #ffd15c;
    --ar-total-num: #cfcfcf;
    --ar-chip-bg: rgba(0,0,0,0.25);
    --ar-chip-weakness-bg: rgba(120, 0, 0, 0.22);
    --ar-chip-weakness-border: #ff4d4d;
    --ar-warning: #ff9d5c;
    --ar-highlight-border: var(--color-border-highlight, #ff6400);
    --ar-step: #ffd15c;
    font-family: var(--font-primary, sans-serif);
    font-size: 25px;
    line-height: 1.55;
    color: var(--ar-text);
    text-align: center;
  }
  body.theme-light .pf2e-ar {
    --ar-text: var(--color-text-primary, #191813);
    --ar-text-strong: var(--color-text-emphatic, #000);
    --ar-bg-hero: rgba(0,0,0,0.03);
    --ar-bg-baseline: rgba(0,0,0,0.06);
    --ar-bg-option: rgba(0,0,0,0.04);
    --ar-bg-option-hover: rgba(0,0,0,0.09);
    --ar-bg-option-selected: rgba(255,100,0,0.12);
    --ar-border: rgba(0,0,0,0.2);
    --ar-border-soft: rgba(0,0,0,0.15);
    --ar-num-gold: #a86500;
    --ar-total-num: #333;
    --ar-chip-bg: rgba(0,0,0,0.06);
    --ar-chip-weakness-bg: rgba(180, 0, 0, 0.10);
    --ar-chip-weakness-border: #c03030;
    --ar-warning: #a04a00;
    --ar-highlight-border: #c05000;
    --ar-step: #a86500;
  }
  .pf2e-ar * { text-align: center; }
  .pf2e-ar-sep { opacity: 0.4; margin: 0 6px; }
  .pf2e-ar-total { opacity: 0.85; font-size: 20px; }
  .pf2e-ar-total-num { color: var(--ar-total-num); font-weight: 700; font-size: 22px; }
  .pf2e-ar-hero {
    padding: 16px 18px; border-radius: 6px;
    background: var(--ar-bg-hero);
    border: 1px solid var(--ar-border);
    margin-bottom: 14px;
  }
  .pf2e-ar-step {
    font-size: 18px;
    color: var(--ar-step);
    font-weight: 700;
    margin-bottom: 8px;
    opacity: 0.95;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
  .pf2e-ar-hero-name {
    font-size: 28px; font-weight: 700;
    color: var(--ar-text-strong);
    line-height: 1.35; margin-bottom: 10px;
  }
  .pf2e-ar-hero-dmg { margin-bottom: 8px; }
  .pf2e-ar-hero-res {
    margin-top: 10px;
    display: flex; flex-wrap: wrap;
    align-items: center; justify-content: center;
    gap: 6px;
  }
  .pf2e-ar-hero-res-label { font-size: 21px; opacity: 0.75; }
  .pf2e-ar-chip {
    font-size: 21px; padding: 3px 12px; border-radius: 12px;
    border: 1px solid; background: var(--ar-chip-bg); font-weight: 600;
    display: inline-flex; align-items: center; gap: 6px;
  }
  .pf2e-ar-chip-all {
    font-size: 21px; padding: 3px 14px; border-radius: 12px;
    border: 1px solid; background: var(--ar-chip-bg);
    font-weight: 700;
    display: inline-flex; align-items: center; gap: 6px;
  }
  .pf2e-ar-chip-all-active {
    font-size: 21px; padding: 3px 14px; border-radius: 12px;
    border: 1px solid #FF1818; background: rgba(255, 24, 24, 0.14);
    color: #FF1818; font-weight: 700;
    display: inline-flex; align-items: center; gap: 6px;
    box-shadow: 0 0 0 3px rgba(255, 24, 24, 0.55);
  }
  .pf2e-ar-chip-weakness-all {
    font-size: 21px; padding: 3px 14px; border-radius: 12px;
    border: 1px solid #FF1818; background: rgba(255, 24, 24, 0.14);
    color: #FF1818; font-weight: 700;
    display: inline-flex; align-items: center; gap: 6px;
  }
  .pf2e-ar-chip-all-icon,
  .pf2e-ar-chip-weakness-all-icon { font-size: 18px; line-height: 1; }
  .pf2e-ar-chip-weakness {
    font-size: 21px; padding: 3px 12px; border-radius: 12px;
    border: 1px solid var(--ar-chip-weakness-border);
    background: var(--ar-chip-weakness-bg);
    font-weight: 600;
  }
  .pf2e-ar-chip-is-active {
    box-shadow: 0 0 0 3px rgba(255, 24, 24, 0.55);
    border-color: #FF1818 !important;
    color: #FF1818 !important;
    background: rgba(255, 24, 24, 0.14) !important;
  }
  .pf2e-ar-dmg-before {
    opacity: 0.45;
    font-weight: 500;
  }
  .pf2e-ar-dmg-arrow {
    opacity: 0.35;
    margin: 0 6px;
    font-weight: 400;
    font-size: 0.9em;
  }
  .pf2e-ar-dmg-after {
    font-weight: 700;
    cursor: help;
    text-decoration: underline dotted;
    text-underline-offset: 4px;
  }
  .pf2e-ar-applied {
    padding: 14px 16px; border-radius: 5px;
    background: rgba(255, 255, 255, 0.04);
    margin-bottom: 16px;
    border-left: 3px solid var(--ar-border);
    display: flex; align-items: center; justify-content: center;
    gap: 10px; flex-wrap: wrap;
  }
  .pf2e-ar-applied-label { font-size: 19px; opacity: 0.8; }
  .pf2e-ar-baseline {
    padding: 14px 16px; border-radius: 5px;
    background: var(--ar-bg-baseline);
    margin-bottom: 16px;
    border-left: 3px solid var(--ar-border);
  }
  .pf2e-ar-baseline-label { opacity: 0.75; font-size: 21px; margin-bottom: 6px; }
  .pf2e-ar-prompt { font-size: 25px; opacity: 0.95; margin-bottom: 12px; }
  .pf2e-ar-options { display: flex; flex-direction: column; gap: 8px; }
  .pf2e-ar-option {
    padding: 14px 16px; border-radius: 6px;
    background: var(--ar-bg-option);
    border: 1px solid var(--ar-border-soft);
    cursor: pointer;
    transition: background .12s, border-color .12s;
  }
  .pf2e-ar-option:hover { background: var(--ar-bg-option-hover); }
  .pf2e-ar-option:has(input:checked) {
    border-color: var(--ar-highlight-border);
    background: var(--ar-bg-option-selected);
  }
  .pf2e-ar-option-main {
    display: flex; align-items: baseline; gap: 14px;
    flex-wrap: wrap; justify-content: center;
  }
  .pf2e-ar-option-main input[type="radio"] { display: none; }
  .pf2e-ar-option-name { font-size: 26px; font-weight: 700; }
  .pf2e-ar-option-final-label { font-size: 25px; opacity: 0.9; }
  .pf2e-ar-final-num {
    font-size: 29px; font-weight: 700;
    color: var(--ar-num-gold);
    margin-left: -8px;
    font-variant-numeric: tabular-nums;
  }
  .pf2e-ar-warning {
    margin-top: 4px; font-size: 15px;
    font-style: italic; opacity: 0.85;
    color: var(--ar-warning); line-height: 1.35;
  }
`;

function injectStyles() {
  try {
    const id = `${MODULE_ID}-styles`;
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement("style");
      el.id = id;
      document.head.appendChild(el);
    }
    el.textContent = CSS;
  } catch (e) {
    console.error(`[${MODULE_ID}] injectStyles failed`, e);
  }
}

function getDamageInstances(damage) {
  return damage?.instances?.filter((i) =>
    i && typeof i.type === "string" && Number.isFinite(i.total) && !i.persistent
  ) ?? [];
}

function damageTypeLabel(type) {
  const key = CONFIG.PF2E?.damageTypes?.[type];
  if (!key) return type;
  try {
    const l = game.i18n.localize(key);
    return l === key ? type : l;
  } catch (e) { return type; }
}

function iwrTypeLabel(type, element) {
  if (!type) return "";
  const labels = element?.typeLabels;
  if (labels && typeof labels === "object" && labels[type]) {
    try {
      const l = game.i18n.localize(labels[type]);
      if (l && l !== labels[type]) return capitalizeFirst(l);
    } catch (e) {}
  }
  const dm = damageTypeLabel(type);
  if (dm !== type) return capitalizeFirst(dm);
  return capitalizeFirst(type);
}

function iwrTypeLabelLower(type, element) {
  const s = iwrTypeLabel(type, element);
  return s ? s.toLowerCase() : s;
}

function buildInstanceOptions(instance, damage, rollOptions) {
  const opts = new Set();
  const addAll = (arr) => {
    if (!arr) return;
    if (arr instanceof Set) { for (const o of arr) if (typeof o === "string") opts.add(o); return; }
    if (Array.isArray(arr)) { for (const o of arr) if (typeof o === "string") opts.add(o); }
  };
  addAll(damage?.options);
  addAll(damage?._options);
  addAll(rollOptions);
  addAll(instance?.options);
  addAll(instance?.formalDescription);
  addAll(damage?.context?.options);
  addAll(damage?.roll?.options);
  if (instance?.type) opts.add(`damage:type:${instance.type}`);
  const addTraits = (traits) => {
    if (!Array.isArray(traits)) return;
    for (const tr of traits) {
      if (typeof tr !== "string") continue;
      opts.add(`item:trait:${tr}`);
      opts.add(`item:${tr}`);
      if (["magical", "arcane", "divine", "occult", "primal"].includes(tr)) {
        opts.add("item:magical");
      }
    }
  };
  addTraits(instance?.traits);
  addTraits(instance?.item?.traits);
  addTraits(instance?.item?.system?.traits?.value);
  if (instance?.magical === true) opts.add("item:magical");
  for (const o of opts) {
    if (typeof o === "string" && o.toLowerCase().includes("magical")) {
      opts.add("item:magical");
      break;
    }
  }
  return opts;
}

function iwrMatchesType(iwr, instanceType) {
  if (!iwr) return false;
  const t = iwr.type;
  if (!t) return false;
  if (t === "all-damage") return true;
  if (t === instanceType) return true;
  if (!isDamageType(t)) return true;
  return false;
}

function resistanceAppliesTo(resistance, instance, damage, rollOptions) {
  if (!resistance || resistance.ignored) return false;
  const type = instance?.type;
  if (!type) return false;
  if (!iwrMatchesType(resistance, type)) return false;
  if (typeof resistance.test === "function") {
    try { return !!resistance.test(buildInstanceOptions(instance, damage, rollOptions)); }
    catch (e) {}
  }
  return resistance.type === "all-damage" || resistance.type === type;
}

function resistanceValueFor(resistance, instance, damage, rollOptions) {
  if (!resistance) return 0;
  let value = Number(resistance.value) || 0;
  const hasDoubleVs = Array.isArray(resistance.doubleVs) && resistance.doubleVs.length > 0;
  if (hasDoubleVs && typeof resistance.getDoubledValue === "function") {
    try {
      const d = resistance.getDoubledValue(buildInstanceOptions(instance, damage, rollOptions));
      if (Number.isFinite(d) && d > 0) value = d;
    } catch (e) {}
  }
  return value;
}

function weaknessAppliesToInstance(weakness, instance, damage, rollOptions) {
  if (!weakness || weakness.ignored) return false;
  const type = instance?.type;
  if (!type) return false;
  if (!iwrMatchesType(weakness, type)) return false;
  if (typeof weakness.test === "function") {
    try { return !!weakness.test(buildInstanceOptions(instance, damage, rollOptions)); }
    catch (e) {}
  }
  return weakness.type === "all-damage" || weakness.type === type;
}

function weaknessAppliesToEffect(weakness, instances, damage, rollOptions) {
  if (!weakness || weakness.ignored) return false;
  if (typeof weakness.test !== "function") return false;
  for (const inst of instances) {
    try {
      if (weakness.test(buildInstanceOptions(inst, damage, rollOptions))) return true;
    } catch (e) {}
  }
  return false;
}

function isEffectScopedIWR(element) {
  const type = element?.type;
  if (!type) return false;
  if (type === "all-damage") return false;
  if (isDamageType(type)) return false;
  return true;
}

function computeAppliedWeaknesses(actor, instances, damage, rollOptions) {
  const weaknesses = (actor.attributes?.weaknesses ?? []).filter(
    (w) => !w.ignored && (Number(w.value) || 0) > 0
  );
  const used = new Set();
  const instanceApps = [];
  const effectApps = [];

  for (const w of weaknesses) {
    if (!isEffectScopedIWR(w)) continue;
    if (weaknessAppliesToEffect(w, instances, damage, rollOptions)) {
      const value = Number(w.value) || 0;
      effectApps.push({ weakness: w, value });
      used.add(w);
    }
  }

  for (let i = 0; i < instances.length; i++) {
    const inst = instances[i];
    const candidates = weaknesses.filter((w) => {
      if (used.has(w)) return false;
      if (isEffectScopedIWR(w)) return false;
      if (!weaknessAppliesToInstance(w, inst, damage, rollOptions)) return false;
      return true;
    });
    if (!candidates.length) continue;
    candidates.sort((a, b) => {
      const aAll = a.type === "all-damage" ? 1 : 0;
      const bAll = b.type === "all-damage" ? 1 : 0;
      if (aAll !== bAll) return aAll - bAll;
      return (Number(b.value) || 0) - (Number(a.value) || 0);
    });
    const winner = candidates[0];
    instanceApps.push({ weakness: winner, instanceIndex: i, value: Number(winner.value) || 0 });
    used.add(winner);
  }

  const effectBonus = effectApps.reduce((s, x) => s + x.value, 0);
  return { instanceApps, effectApps, effectBonus };
}

// ============== IWR injection into PF2e chat message ==============

function compareResistanceSpecificity(a, b) {
  if (a.value !== b.value) return a.value - b.value;
  const scoreOf = (r) => {
    if (r.type === "all-damage") return 0;
    if (isDamageType(r.type)) return 2;
    return 1;
  };
  return scoreOf(a.resistance) - scoreOf(b.resistance);
}

function shouldShowDebugType() {
  try { return game.settings.get(MODULE_ID, "debugIWRType"); } catch (e) { return false; }
}

function buildIWRApplications(simState, weaknessInstApps, effectApps) {
  const apps = [];
  const debug = shouldShowDebugType();

  // Effect-scoped weaknesses: no specific target instance, so no debug suffix.
  for (const ea of effectApps) {
    apps.push({
      category: "weakness",
      type: iwrTypeLabelLower(ea.weakness.type, ea.weakness),
      adjustment: ea.value,
    });
  }

  // Per-instance weaknesses: have a target instance.
  for (const ia of weaknessInstApps) {
    let typeStr = iwrTypeLabelLower(ia.weakness.type, ia.weakness);
    if (debug) {
      const s = simState[ia.instanceIndex];
      if (s) typeStr = `${typeStr} → ${s.label.toLowerCase()}`;
    }
    apps.push({
      category: "weakness",
      type: typeStr,
      adjustment: ia.value,
    });
  }

  // Resistances: pick winner per instance and, if debug, append target type.
  for (const s of simState) {
    if (!s.assignedResistances || s.assignedResistances.length === 0) continue;
    let best = s.assignedResistances[0];
    for (const a of s.assignedResistances) {
      if (compareResistanceSpecificity(a, best) > 0) best = a;
    }
    let typeStr = iwrTypeLabelLower(best.resistance.type, best.resistance);
    if (debug) {
      typeStr = `${typeStr} → ${s.label.toLowerCase()}`;
    }
    apps.push({
      category: "resistance",
      type: typeStr,
      adjustment: -best.value,
    });
  }

  return apps;
}

function injectIWRSpan(content, applications) {
  if (!applications || applications.length === 0) return content;
  if (typeof content !== "string" || !content) return content;

  const cleaned = content.replace(
    /<span class="iwr"[^>]*>[\s\S]*?<\/span>\s*/g,
    ""
  );

  const json = JSON.stringify(applications).replace(/"/g, "&quot;");
  const iwrSpan = `<span class="iwr" data-visibility="all" data-applications="${json}"><i class="fa-solid fa-circle-info small"></i></span>`;

  const re = /(<span class="statements">[\s\S]*?<\/span>)\s*(<button)/;
  if (re.test(cleaned)) {
    return cleaned.replace(re, `$1\n        ${iwrSpan}\n        $2`);
  }
  return cleaned.replace(/(<\/section>)/, `    ${iwrSpan}\n$1`);
}

Hooks.on("preCreateChatMessage", (message) => {
  try {
    const flags = message.flags?.pf2e;
    if (flags?.context?.type !== "damage-taken") return;
    const uuid = flags.appliedDamage?.uuid;
    if (!uuid || !pendingIWR.has(uuid)) return;

    const data = pendingIWR.get(uuid);
    pendingIWR.delete(uuid);

    let show = true;
    try { show = game.settings.get(MODULE_ID, "showChatMessage"); } catch (e) {}
    if (!show) return;

    if (!data.applications || data.applications.length === 0) return;

    const newContent = injectIWRSpan(message.content, data.applications);
    if (newContent && newContent !== message.content) {
      message.updateSource({ content: newContent });
    }
  } catch (e) {
    console.error(`[${MODULE_ID}] preCreateChatMessage injection failed`, e);
  }
});

// ============== Main pipeline ==============

async function runSequentialDialogs(actor, original, params, instances, damage, rollOptions) {
  const targetName = params.token?.name ?? actor.name;

  const { instanceApps: weaknessInstApps, effectApps, effectBonus } = computeAppliedWeaknesses(
    actor, instances, damage, rollOptions
  );
  const weaknessByInstance = new Map();
  const weaknessLabelsByInstance = new Map();
  for (const wa of weaknessInstApps) {
    weaknessByInstance.set(wa.instanceIndex,
      (weaknessByInstance.get(wa.instanceIndex) ?? 0) + wa.value);
    const lbl = iwrTypeLabel(wa.weakness.type, wa.weakness);
    const arr = weaknessLabelsByInstance.get(wa.instanceIndex) ?? [];
    arr.push({ label: lbl, value: wa.value });
    weaknessLabelsByInstance.set(wa.instanceIndex, arr);
  }

  const allRes = (actor.attributes?.resistances ?? []).filter(
    r => r && !r.ignored && (Number(r.value) || 0) > 0
  );
  const applicableRes = allRes.filter(res =>
    instances.some(inst => resistanceAppliesTo(res, inst, damage, rollOptions))
  );

  const sortedRes = [...applicableRes].sort((a, b) =>
    (Number(b.value) || 0) - (Number(a.value) || 0)
  );

  const plan = sortedRes.map(res => {
    const candidates = [];
    for (let i = 0; i < instances.length; i++) {
      if (resistanceAppliesTo(res, instances[i], damage, rollOptions)) candidates.push(i);
    }
    return { res, candidates, needsDialog: candidates.length > 1 };
  });

  const simState = instances.map((inst, i) => ({
    index: i,
    type: inst.type,
    label: damageTypeLabel(inst.type),
    color: colorFor(inst.type),
    original: inst.total,
    weakness: weaknessByInstance.get(i) ?? 0,
    weaknessLabels: weaknessLabelsByInstance.get(i) ?? [],
    assignedResistances: [],
  }));

  function currentValue(s) {
    let maxRed = 0;
    for (const a of s.assignedResistances) {
      if (a.value > maxRed) maxRed = a.value;
    }
    return Math.max(0, s.original + s.weakness - maxRed);
  }
  function currentTotal() {
    return simState.reduce((sum, s) => sum + currentValue(s), 0);
  }
  function assign(res, idx) {
    simState[idx].assignedResistances.push({
      resistance: res, value: Number(res.value) || 0,
    });
  }

  let autoApply = false;
  try { autoApply = game.settings.get(MODULE_ID, "autoApplyBest"); } catch (e) {}

  const autoPass = plan.filter(p => !p.needsDialog);
  const dialogPass = plan.filter(p => p.needsDialog);

  for (const p of autoPass) {
    const { res, candidates } = p;
    if (!candidates.length) continue;
    let chosen;
    let bestRed = -1;
    for (const idx of candidates) {
      const cur = currentValue(simState[idx]);
      const existing = simState[idx].assignedResistances.length > 0
        ? Math.max(...simState[idx].assignedResistances.map(a => a.value))
        : 0;
      const newMax = Math.max(existing, Number(res.value) || 0);
      const newVal = Math.max(0, simState[idx].original + simState[idx].weakness - newMax);
      const reduction = cur - newVal;
      if (reduction > bestRed) { bestRed = reduction; chosen = idx; }
    }
    if (chosen !== undefined) assign(res, chosen);
  }

  const totalDialogs = dialogPass.length;
  let step = 0;

  for (const p of dialogPass) {
    const { res, candidates } = p;
    if (!candidates.length) continue;

    let chosen;
    if (autoApply) {
      let bestRed = -1;
      for (const idx of candidates) {
        const cur = currentValue(simState[idx]);
        const existing = simState[idx].assignedResistances.length > 0
          ? Math.max(...simState[idx].assignedResistances.map(a => a.value))
          : 0;
        const newMax = Math.max(existing, Number(res.value) || 0);
        const newVal = Math.max(0, simState[idx].original + simState[idx].weakness - newMax);
        const reduction = cur - newVal;
        if (reduction > bestRed) { bestRed = reduction; chosen = idx; }
      }
    } else {
      step++;
      chosen = await showStepDialog({
        actor, res, simState, candidates, step, totalSteps: totalDialogs,
        targetName, currentValue, currentTotal,
      });
      if (chosen === null || chosen === undefined) {
        let bestRed = -1;
        for (const idx of candidates) {
          const cur = currentValue(simState[idx]);
          const existing = simState[idx].assignedResistances.length > 0
            ? Math.max(...simState[idx].assignedResistances.map(a => a.value))
            : 0;
          const newMax = Math.max(existing, Number(res.value) || 0);
          const newVal = Math.max(0, simState[idx].original + simState[idx].weakness - newMax);
          const reduction = cur - newVal;
          if (reduction > bestRed) { bestRed = reduction; chosen = idx; }
        }
      }
    }
    if (chosen !== undefined) assign(res, chosen);
  }

  const finalValues = simState.map(currentValue);
  let finalTotal = finalValues.reduce((a, b) => a + b, 0);
  let effectAdded = 0;
  if (finalTotal > 0 && effectBonus > 0) {
    finalTotal += effectBonus;
    effectAdded = effectBonus;
  }

  const applications = buildIWRApplications(simState, weaknessInstApps, effectApps);
  if (applications.length > 0) {
    pendingIWR.set(actor.uuid, { applications, createdAt: Date.now() });
  }

  const savedRes = actor.attributes.resistances;
  const savedWeak = actor.attributes.weaknesses;

  try {
    actor.attributes.resistances = [];
    actor.attributes.weaknesses = [];
    const syntheticDamage = await buildSyntheticDamageRoll(instances, finalValues, effectAdded);
    return await original.call(actor, { ...params, damage: syntheticDamage, skipIWR: true });
  } finally {
    actor.attributes.resistances = savedRes;
    actor.attributes.weaknesses = savedWeak;
  }
}

async function buildSyntheticDamageRoll(instances, finalValues, effectBonus) {
  const parts = [];
  for (let i = 0; i < instances.length; i++) {
    const v = Math.max(0, Math.floor(finalValues[i]));
    if (v <= 0) continue;
    parts.push(`${v}[${instances[i].type}]`);
  }
  if (effectBonus > 0) {
    parts.push(`${Math.floor(effectBonus)}[untyped]`);
  }

  const formula = parts.length ? parts.join(" + ") : "0";

  const DamageRollClass = CONFIG.Dice.rolls.find((r) => r.name === "DamageRoll") ?? Roll;
  let roll;
  try {
    roll = new DamageRollClass(formula, {}, {});
    await roll.evaluate();
  } catch (e) {
    console.error(`[${MODULE_ID}] synthetic roll build failed`, e);
    roll = new Roll(formula);
    await roll.evaluate();
  }
  return roll;
}

// ============== Step dialog ==============

async function showStepDialog({ actor, res, simState, candidates, step, totalSteps, targetName, currentValue, currentTotal }) {
  const resValue = Number(res.value) || 0;
  const resLabel = iwrTypeLabel(res.type, res);
  const SEP = '<span class="pf2e-ar-sep">·</span>';

  const originalTotal = simState.reduce((s, x) => s + x.original, 0);

  const originalLine = simState.map(s => {
    const c = s.color;
    const labelSpan = `<span style="color:${c};">${s.label}</span>`;
    if (s.weakness > 0) {
      const after = s.original + s.weakness;
      const tooltipParts = s.weaknessLabels.map(w =>
        t("dialog.weaknessTooltipItem", { type: w.label, value: w.value })
      ).join(", ");
      const tooltip = t("dialog.weaknessTooltip", { list: tooltipParts });
      return `<span class="pf2e-ar-dmg-before">${s.original}</span>` +
             `<span class="pf2e-ar-dmg-arrow">→</span>` +
             `<span class="pf2e-ar-dmg-after" style="color:${c};" ` +
             `data-tooltip="${tooltip}" data-tooltip-direction="UP">${after}</span>` +
             `&nbsp;${labelSpan}`;
    }
    return `<span style="color:${c}; font-weight:600;">${s.original}</span>&nbsp;${labelSpan}`;
  }).join(SEP) + ` <span class="pf2e-ar-total">(${t("dialog.total", { value: `<span class="pf2e-ar-total-num">${originalTotal}</span>` })})</span>`;

  const allRes = (actor.attributes?.resistances ?? []).filter(
    r => !r.ignored && (Number(r.value) || 0) > 0
  );

  const resChips = allRes.map(r => {
    const isCurrent = r === res;
    const c = resistanceChipColor(r);
    const label = iwrTypeLabel(r.type, r);
    const activeClass = isCurrent ? " pf2e-ar-chip-is-active" : "";
    const icon = r.type === "all-damage"
      ? `<span class="pf2e-ar-chip-all-icon">🛡</span>`
      : "";
    return `<span class="pf2e-ar-chip${activeClass}" style="color:${c}; border-color:${c};">
      ${icon}${label} ${r.value}
    </span>`;
  }).join(SEP);

  const resLine = allRes.length ? `<div class="pf2e-ar-hero-res">
    <span class="pf2e-ar-hero-res-label">${t("dialog.resistancesLabel")}</span>
    ${resChips}
  </div>` : "";

  const currentLine = simState.map(s => {
    const c = s.color;
    const v = currentValue(s);
    return `<span style="color:${c}; font-weight:600;">${v}</span> <span style="color:${c};">${s.label}</span>`;
  }).join(SEP);
  const curTotal = currentTotal();
  const currentLineWithTotal = currentLine +
    ` <span class="pf2e-ar-total">(${t("dialog.total", { value: `<span class="pf2e-ar-total-num">${curTotal}</span>` })})</span>`;

  const optionData = candidates.map((idx) => {
    const s = simState[idx];
    const cur = currentValue(s);
    const existing = s.assignedResistances.length > 0
      ? Math.max(...s.assignedResistances.map(a => a.value))
      : 0;
    const newMax = Math.max(existing, resValue);
    const newVal = Math.max(0, s.original + s.weakness - newMax);
    const delta = cur - newVal;
    const totalIfPicked = curTotal - delta;

    const warnings = [];
    if (existing >= resValue && s.assignedResistances.length > 0) {
      const first = s.assignedResistances[0];
      const lbl = iwrTypeLabel(first.resistance.type, first.resistance);
      warnings.push(t("dialog.warningAlreadyHave", { label: lbl, value: existing }));
    } else if (cur === 0) {
      warnings.push(t("dialog.warningNoEffect"));
    } else if (resValue > cur) {
      warnings.push(t("dialog.warningCapped", { applied: cur, total: cur }));
    }

    return { idx, s, totalIfPicked, warnings };
  });

  optionData.sort((a, b) => a.totalIfPicked - b.totalIfPicked);

  const rows = optionData.map(({ idx, s, totalIfPicked, warnings }, i) => {
    const isSelected = i === 0 ? "checked" : "";
    return `
      <label class="pf2e-ar-option">
        <div class="pf2e-ar-option-main">
          <input type="radio" name="pf2e-ar-choice" value="${idx}" ${isSelected}>
          <span class="pf2e-ar-option-name" style="color:${s.color};">${s.label}</span>
          <span class="pf2e-ar-option-final-label">${t("dialog.finalDamage")}</span>
          <span class="pf2e-ar-final-num">${totalIfPicked}</span>
        </div>
        ${warnings.length ? `<div class="pf2e-ar-warning">⚠ ${warnings.join("<br>⚠ ")}</div>` : ""}
      </label>
    `;
  }).join("");

  const appliedColor = resistanceChipColor(res);
  const appliedIcon = res.type === "all-damage"
    ? `<span class="pf2e-ar-chip-all-icon">🛡</span>`
    : "";
  const appliedChip = `<span class="pf2e-ar-chip pf2e-ar-chip-is-active" style="color:${appliedColor}; border-color:${appliedColor}; font-size:21px; padding:3px 14px;">
    ${appliedIcon}${resLabel} ${resValue}
  </span>`;

  const showStep = totalSteps > 1;
  const stepLine = showStep
    ? `<div class="pf2e-ar-step">${t("dialog.step", { n: step, total: totalSteps })}</div>`
    : "";

  const content = `
    <div class="pf2e-ar">
      <div class="pf2e-ar-hero">
        ${stepLine}
        <div class="pf2e-ar-hero-name">${targetName}</div>
        <div class="pf2e-ar-hero-dmg">${t("dialog.damageReceived", { list: originalLine })}</div>
        ${resLine}
      </div>
      <div class="pf2e-ar-applied">
        <span class="pf2e-ar-applied-label">${t("dialog.applyingResistance")}</span>
        ${appliedChip}
      </div>
      <div class="pf2e-ar-baseline">
        <div class="pf2e-ar-baseline-label">${t("dialog.currentDamage")}</div>
        <div>${currentLineWithTotal}</div>
      </div>
      <div class="pf2e-ar-prompt">${t("dialog.chooseResistance")}</div>
      <div class="pf2e-ar-options">${rows}</div>
    </div>
  `;

  let okLabel;
  if (totalSteps <= 1) {
    okLabel = t("dialog.apply");
  } else if (step >= totalSteps) {
    okLabel = t("dialog.applyLast", { n: step, total: totalSteps });
  } else {
    okLabel = t("dialog.applyNext", { n: step, total: totalSteps });
  }

  return foundry.applications.api.DialogV2.prompt({
    window: { title: t("dialog.title") },
    position: { width: 900 },
    content,
    ok: {
      label: okLabel,
      callback: (event, button, dialog) => {
        const checked = dialog.element.querySelector('input[name="pf2e-ar-choice"]:checked');
        return checked ? Number(checked.value) : null;
      },
    },
    rejectClose: false,
  });
}

// ============== IWR wrapper ==============

function wrapIWR(actor) {
  const weaknesses = actor.attributes?.weaknesses ?? [];
  const resistances = actor.attributes?.resistances ?? [];
  const allElements = [...weaknesses, ...resistances];
  const originals = new Map();
  const originalTests = new Map();
  const used = new Set();
  for (const el of allElements) {
    if (!el || typeof el.test !== "function") continue;
    originalTests.set(el, el.test.bind(el));
  }
  for (const el of allElements) {
    if (!el || typeof el.test !== "function") continue;
    const originalFn = originalTests.get(el);
    originals.set(el, el.test);
    el.test = function (options) {
      let res = false;
      try { res = !!originalFn(options); } catch (e) { res = false; }
      if (!res) return false;
      if (el.type === "all-damage") {
        const hasMoreSpecific = weaknesses.some((other) => {
          if (other === el) return false;
          if (other.ignored) return false;
          if (other.type === "all-damage") return false;
          if (used.has(other)) return false;
          const tt = originalTests.get(other);
          if (!tt) return false;
          try { return !!tt(options); } catch (e) { return false; }
        });
        if (hasMoreSpecific) return false;
      }
      if (used.has(el)) return false;
      used.add(el);
      return true;
    };
  }
  return function unwrap() {
    for (const [el, orig] of originals) {
      try { el.test = orig; } catch (e) {}
    }
  };
}

function shouldFixIWR() {
  try { return game.settings.get(MODULE_ID, "errataIWR"); } catch (e) { return false; }
}
function isAllResEnabled() {
  try { return game.settings.get(MODULE_ID, "allResEnabled"); } catch (e) { return true; }
}
async function plainCall(actor, original, params) {
  return original.call(actor, params);
}
async function callOriginalWithIWRFix(actor, original, params) {
  if (!shouldFixIWR()) return original.call(actor, params);
  const instances = getDamageInstances(params?.damage);
  if (instances.length < 2) return original.call(actor, params);
  const unwrap = wrapIWR(actor);
  try { return await original.call(actor, params); }
  finally { unwrap(); }
}

// ============== Hooks ==============

Hooks.once("init", () => {
  try { injectStyles(); } catch (e) { console.error(`[${MODULE_ID}] injectStyles at init failed`, e); }

  try {
    game.settings.register(MODULE_ID, "allResEnabled", {
      name: `${MODULE_ID}.settings.allResEnabled.name`,
      hint: `${MODULE_ID}.settings.allResEnabled.hint`,
      scope: "world", config: true, type: Boolean, default: true,
    });
  } catch (e) { console.error(`[${MODULE_ID}] register allResEnabled failed`, e); }

  try {
    game.settings.register(MODULE_ID, "autoApplyBest", {
      name: `${MODULE_ID}.settings.autoApplyBest.name`,
      hint: `${MODULE_ID}.settings.autoApplyBest.hint`,
      scope: "client", config: true, type: Boolean, default: false,
    });
  } catch (e) { console.error(`[${MODULE_ID}] register autoApplyBest failed`, e); }

  try {
    game.settings.register(MODULE_ID, "showChatMessage", {
      name: `${MODULE_ID}.settings.showChatMessage.name`,
      hint: `${MODULE_ID}.settings.showChatMessage.hint`,
      scope: "world", config: true, type: Boolean, default: true,
    });
  } catch (e) { console.error(`[${MODULE_ID}] register showChatMessage failed`, e); }

  try {
    game.settings.register(MODULE_ID, "errataIWR", {
      name: `${MODULE_ID}.settings.errataIWR.name`,
      hint: `${MODULE_ID}.settings.errataIWR.hint`,
      scope: "world", config: true, type: Boolean, default: true,
    });
  } catch (e) { console.error(`[${MODULE_ID}] register errataIWR failed`, e); }

  try {
    game.settings.register(MODULE_ID, "debugIWRType", {
      name: `${MODULE_ID}.settings.debugIWRType.name`,
      hint: `${MODULE_ID}.settings.debugIWRType.hint`,
      scope: "client", config: true, type: Boolean, default: false,
    });
  } catch (e) { console.error(`[${MODULE_ID}] register debugIWRType failed`, e); }
});

Hooks.once("ready", () => {
  try { injectStyles(); } catch (e) { console.error(`[${MODULE_ID}] injectStyles at ready failed`, e); }

  try {
    const ActorClass = CONFIG?.Actor?.documentClass;
    if (!ActorClass?.prototype?.applyDamage) {
      console.error(`[${MODULE_ID}] Could not find Actor.applyDamage`);
      ui.notifications.error(t("notifications.notFound"));
      return;
    }
    const proto = ActorClass.prototype;
    if (proto[PATCHED]) return;
    const originalApplyDamage = proto.applyDamage;

    proto.applyDamage = async function (params = {}) {
      try {
        if (this[IN_PROGRESS]) return plainCall(this, originalApplyDamage, params);

        if (!isAllResEnabled()) {
          return callOriginalWithIWRFix(this, originalApplyDamage, params);
        }

        const damage = params?.damage;
        const rollOptions = params?.rollOptions;

        if (
          !damage || typeof damage !== "object" ||
          !Array.isArray(damage.instances) ||
          params.final || params.skipIWR
        ) {
          return callOriginalWithIWRFix(this, originalApplyDamage, params);
        }

        const instances = getDamageInstances(damage);
        if (instances.length < 2) {
          return callOriginalWithIWRFix(this, originalApplyDamage, params);
        }

        const hasAnyRes = (this.attributes?.resistances ?? []).some(
          r => !r.ignored && (Number(r.value) || 0) > 0
        );
        if (!hasAnyRes) {
          return callOriginalWithIWRFix(this, originalApplyDamage, params);
        }

        this[IN_PROGRESS] = true;
        try {
          return await runSequentialDialogs(
            this, originalApplyDamage, params, instances, damage, rollOptions
          );
        } finally {
          this[IN_PROGRESS] = false;
        }
      } catch (e) {
        console.error(`[${MODULE_ID}] applyDamage wrapper failed`, e);
        ui.notifications.error(t("notifications.errorDamage"));
        return originalApplyDamage.call(this, params);
      }
    };

    Object.defineProperty(proto, PATCHED, { value: true, configurable: false, enumerable: false });
  } catch (e) {
    console.error(`[${MODULE_ID}] ready hook failed`, e);
    try { ui.notifications.error(t("notifications.errorLoad")); } catch (e2) {}
  }
});