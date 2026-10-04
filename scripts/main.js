const MODULE_ID = "pf2e-all-resistance-errata";
const PATCHED = Symbol(`${MODULE_ID}.patched`);
const IN_PROGRESS = Symbol(`${MODULE_ID}.inProgress`);

function t(key, data) {
  const fullKey = `${MODULE_ID}.${key}`;
  try {
    if (data) return game.i18n.format(fullKey, data);
    return game.i18n.localize(fullKey);
  } catch (e) {
    return fullKey;
  }
}

const DAMAGE_COLORS = {
  acid: "#a8d94a",
  bleed: "#c0392b",
  bludgeoning: "#656565",
  cold: "#4db8ff",
  electricity: "#ffd93b",
  fire: "#ff6b35",
  force: "#b070ff",
  mental: "#d47aff",
  negative: "#000000",
  piercing: "#656565",
  poison: "#6ab04c",
  positive: "#ffd700",
  slashing: "#656565",
  sonic: "#7fc4ff",
  spirit: "#DAD4FF",
  vitality: "#FFED8E",
  void: "#000000",
  untyped: "#FFCBCB",
};

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
    --ar-warning: #ff9d5c;
    --ar-highlight-border: var(--color-border-highlight, #ff6400);
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
    --ar-warning: #a04a00;
    --ar-highlight-border: #c05000;
  }
  .pf2e-ar * { text-align: center; }
  .pf2e-ar-sep { opacity: 0.4; margin: 0 6px; }
  .pf2e-ar-total { opacity: 0.85; font-size: 20px; }
  .pf2e-ar-total-num { color: var(--ar-total-num); font-weight: 700; font-size: 22px; }
  .pf2e-ar-hero {
    padding: 16px 18px;
    border-radius: 6px;
    background: var(--ar-bg-hero);
    border: 1px solid var(--ar-border);
    margin-bottom: 14px;
  }
  .pf2e-ar-hero-name {
    font-size: 28px;
    font-weight: 700;
    color: var(--ar-text-strong);
    line-height: 1.35;
    margin-bottom: 10px;
  }
  .pf2e-ar-hero-dmg { margin-bottom: 8px; }
  .pf2e-ar-hero-res {
    margin-top: 12px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }
  .pf2e-ar-hero-res-label { font-size: 21px; opacity: 0.75; }
  .pf2e-ar-chip {
    font-size: 21px;
    padding: 3px 12px;
    border-radius: 12px;
    border: 1px solid;
    background: var(--ar-chip-bg);
    font-weight: 600;
  }
  .pf2e-ar-chip-all {
    font-size: 21px;
    padding: 3px 14px;
    border-radius: 12px;
    border: 1px solid #FF1818;
    background: rgba(255, 24, 24, 0.14);
    color: #FF1818;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .pf2e-ar-chip-all-icon { font-size: 18px; line-height: 1; }
  .pf2e-ar-baseline {
    padding: 14px 16px;
    border-radius: 5px;
    background: var(--ar-bg-baseline);
    margin-bottom: 16px;
    border-left: 3px solid var(--ar-border);
  }
  .pf2e-ar-baseline-label { opacity: 0.75; font-size: 21px; margin-bottom: 6px; }
  .pf2e-ar-prompt { font-size: 25px; opacity: 0.95; margin-bottom: 12px; }
  .pf2e-ar-options { display: flex; flex-direction: column; gap: 8px; }
  .pf2e-ar-option {
    padding: 14px 16px;
    border-radius: 6px;
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
  .pf2e-ar-option-wasted { opacity: 0.85; }
  .pf2e-ar-option-main {
    display: flex;
    align-items: baseline;
    gap: 14px;
    flex-wrap: wrap;
    justify-content: center;
  }
  .pf2e-ar-option-main input[type="radio"] { display: none; }
  .pf2e-ar-option-name { font-size: 26px; font-weight: 700; }
  .pf2e-ar-option-final-label { font-size: 25px; opacity: 0.9; }
  .pf2e-ar-final-num {
    font-size: 29px;
    font-weight: 700;
    color: var(--ar-num-gold);
    margin-left: -8px;
    font-variant-numeric: tabular-nums;
  }
  .pf2e-ar-warning {
    margin-top: 4px;
    font-size: 15px;
    font-style: italic;
    opacity: 0.85;
    color: var(--ar-warning);
    line-height: 1.35;
  }
  .pf2e-ar-chat {
    --ar-text: var(--color-text-primary, #e8e8e8);
    --ar-num-gold: #ffd15c;
    --ar-chip-bg: rgba(0,0,0,0.25);
    font-family: var(--font-primary, sans-serif);
    font-size: 14px;
    line-height: 1.5;
    padding: 8px 10px;
    border-radius: 5px;
    background: var(--ar-chip-bg);
    border-left: 3px solid #FF1818;
    color: var(--ar-text);
  }
  body.theme-light .pf2e-ar-chat {
    --ar-text: var(--color-text-primary, #191813);
    --ar-num-gold: #a86500;
    --ar-chip-bg: rgba(0,0,0,0.05);
  }
  .pf2e-ar-chat-title {
    font-weight: 700;
    color: #FF1818;
    margin-bottom: 6px;
    font-size: 14px;
  }
  .pf2e-ar-chat-row { margin-bottom: 3px; }
  .pf2e-ar-chat-num { color: var(--ar-num-gold); font-weight: 700; }
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

function log(...args) {
  console.log(`[${MODULE_ID}]`, ...args);
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
    const localized = game.i18n.localize(key);
    return localized === key ? type : localized;
  } catch (e) {
    return type;
  }
}

function getExceptions(resistance) {
  const list = resistance?.exceptions;
  if (!Array.isArray(list)) return [];
  return list.map((x) => (typeof x === "string" ? x : x?.type ?? ""));
}

function resistanceAppliesTo(resistance, instance) {
  if (!resistance) return false;
  if (resistance.ignored) return false;
  const type = instance?.type;
  if (!type) return false;
  const rType = resistance.type;
  if (rType !== "all-damage" && rType !== type) return false;
  const exceptions = getExceptions(resistance);
  if (exceptions.includes(type)) return false;
  return true;
}

function buildInstanceOptions(instance, damage, rollOptions) {
  const opts = new Set();

  const addAll = (arr) => {
    if (!arr) return;
    const iterable = arr instanceof Set ? arr : Array.isArray(arr) ? arr : null;
    if (!iterable) return;
    for (const o of iterable) {
      if (typeof o === "string") opts.add(o);
    }
  };

  addAll(damage?.options);
  addAll(damage?._options);
  addAll(rollOptions);
  addAll(instance?.options);
  addAll(instance?.formalDescription);

  if (instance?.type) {
    opts.add(`damage:type:${instance.type}`);
  }

  const magicalTraits = new Set(["magical", "arcane", "divine", "occult", "primal"]);

  if (instance?.magical === true) opts.add("item:magical");

  if (Array.isArray(instance?.traits)) {
    for (const tr of instance.traits) {
      if (magicalTraits.has(tr)) {
        opts.add("item:magical");
        break;
      }
    }
  }
  if (Array.isArray(instance?.item?.traits)) {
    for (const tr of instance.item.traits) {
      if (magicalTraits.has(tr)) {
        opts.add("item:magical");
        break;
      }
    }
  }
  if (Array.isArray(instance?.item?.system?.traits?.value)) {
    for (const tr of instance.item.system.traits.value) {
      if (magicalTraits.has(tr)) {
        opts.add("item:magical");
        break;
      }
    }
  }

  for (const o of opts) {
    if (typeof o === "string" && o.toLowerCase().includes("magical")) {
      opts.add("item:magical");
      break;
    }
  }

  return opts;
}

function resistanceValueFor(resistance, instance, damage, rollOptions) {
  if (!resistance) return 0;
  let value = Number(resistance.value) || 0;
  if (typeof resistance.getDoubledValue === "function") {
    try {
      const opts = buildInstanceOptions(instance, damage, rollOptions);
      const doubled = resistance.getDoubledValue(opts);
      if (Number.isFinite(doubled) && doubled > 0) value = doubled;
    } catch (e) {
      // ignore
    }
  }
  return value;
}

function getSpecificResistanceForInstance(actor, instance, excludeAllResistance, damage, rollOptions) {
  let best = 0;
  for (const r of (actor.attributes?.resistances ?? [])) {
    if (r === excludeAllResistance) continue;
    if (r.ignored) continue;
    if (!resistanceAppliesTo(r, instance)) continue;
    const value = resistanceValueFor(r, instance, damage, rollOptions);
    if (value > best) best = value;
  }
  return best;
}

function computeOutcome(actor, instances, chosenType, allResistance, allValue, damage, rollOptions) {
  const parts = [];
  let baseTotal = 0;
  let totalReduction = 0;
  let finalTotal = 0;

  for (const inst of instances) {
    const specific = getSpecificResistanceForInstance(actor, inst, allResistance, damage, rollOptions);
    let effective = specific;

    if (chosenType && inst.type === chosenType && allResistance) {
      if (resistanceAppliesTo(allResistance, inst)) {
        const v = resistanceValueFor(allResistance, inst, damage, rollOptions);
        effective = Math.max(effective, v);
      }
    }

    const applied = Math.min(effective, inst.total);
    const net = Math.max(0, inst.total - applied);

    baseTotal += inst.total;
    totalReduction += applied;
    finalTotal += net;

    parts.push({
      type: inst.type,
      label: damageTypeLabel(inst.type),
      color: DAMAGE_COLORS[inst.type] ?? "#dddddd",
      total: inst.total,
      specific,
      effective,
      applied,
      net,
    });
  }

  return { baseTotal, totalReduction, finalTotal, parts };
}

function computeChoices(actor, instances, resistance, resistanceValue, damage, rollOptions) {
  const baseline = computeOutcome(actor, instances, null, resistance, resistanceValue, damage, rollOptions);

  const choices = instances.map((instance, index) => {
    const outcome = computeOutcome(
      actor,
      instances,
      instance.type,
      resistance,
      resistanceValue,
      damage,
      rollOptions
    );

    const specific = getSpecificResistanceForInstance(actor, instance, resistance, damage, rollOptions);
    const ownPart = outcome.parts.find((p) => p.type === instance.type);
    const allApplies = resistanceAppliesTo(resistance, instance);
    const effectiveAll = resistanceValueFor(resistance, instance, damage, rollOptions);

    const isNotApplicable = !allApplies;
    const isWasted = isNotApplicable || specific >= effectiveAll;
    const isCapped =
      allApplies && ownPart && ownPart.applied < effectiveAll && !isWasted;

    return {
      index,
      type: instance.type,
      label: damageTypeLabel(instance.type),
      color: DAMAGE_COLORS[instance.type] ?? "#dddddd",
      outcome,
      specific,
      effectiveAll,
      allApplies,
      ownPart,
      isWasted,
      isNotApplicable,
      isCapped,
    };
  });

  const sortedChoices = [...choices].sort(
    (a, b) => a.outcome.finalTotal - b.outcome.finalTotal
  );

  return { baseline, choices, sortedChoices };
}

function pickBestChoice(sortedChoices) {
  const useful = sortedChoices.filter((c) => !c.isNotApplicable);
  if (useful.length) return useful[0];
  return sortedChoices[0] ?? null;
}

const SEP = '<span class="pf2e-ar-sep">·</span>';

function totalSuffix(n) {
  return ` <span class="pf2e-ar-total">(${t("dialog.total", { value: `<span class="pf2e-ar-total-num">${n}</span>` })})</span>`;
}

async function chooseResistance(actor, instances, resistance, resistanceValue, targetName, damage, rollOptions) {
  const { baseline, sortedChoices } = computeChoices(
    actor,
    instances,
    resistance,
    resistanceValue,
    damage,
    rollOptions
  );

  const otherResistances = (actor.attributes?.resistances ?? []).filter(
    (r) =>
      r !== resistance &&
      !r.ignored &&
      r.type !== "all-damage" &&
      (Number(r.value) || 0) > 0
  );

  const originalTotal = instances.reduce((s, i) => s + i.total, 0);

  const originalLine =
    instances
      .map((i) => {
        const c = DAMAGE_COLORS[i.type] ?? "#dddddd";
        return `<span style="color:${c}; font-weight:600;">${i.total}</span>&nbsp;<span style="color:${c};">${damageTypeLabel(i.type)}</span>`;
      })
      .join(SEP) + totalSuffix(originalTotal);

  const baselineTotal = baseline.parts.reduce((s, p) => s + p.net, 0);

  const baselineLine =
    baseline.parts
      .map((p) => {
        return `<span style="color:${p.color}; font-weight:600;">${p.net}</span>&nbsp;<span style="color:${p.color};">${p.label}</span>`;
      })
      .join(SEP) + totalSuffix(baselineTotal);

  const allChip = `<span class="pf2e-ar-chip-all">
    <span class="pf2e-ar-chip-all-icon">🛡</span>
    <span>${t("dialog.chipAll", { value: resistanceValue })}</span>
  </span>`;

  const otherChips = otherResistances
    .map((r) => {
      const c = DAMAGE_COLORS[r.type] ?? "#dddddd";
      return `<span class="pf2e-ar-chip" style="color:${c}; border-color:${c};">${damageTypeLabel(r.type)} ${r.value}</span>`;
    })
    .join(SEP);

  const resLine = `<div class="pf2e-ar-hero-res">
    <span class="pf2e-ar-hero-res-label">${t("dialog.resistancesLabel")}</span>
    ${allChip}
    ${otherChips ? SEP + otherChips : ""}
  </div>`;

  const rows = sortedChoices
    .map((c, i) => {
      const warnings = [];
      if (c.isNotApplicable) {
        warnings.push(t("dialog.warningNotApplicable"));
      } else if (c.isWasted) {
        warnings.push(
          t("dialog.warningAlreadyHave", { label: c.label, value: c.specific })
        );
      } else if (c.isCapped) {
        warnings.push(
          t("dialog.warningCapped", {
            applied: c.ownPart.applied,
            total: c.ownPart.total,
          })
        );
      }

      return `
        <label class="pf2e-ar-option${c.isWasted ? " pf2e-ar-option-wasted" : ""}">
          <div class="pf2e-ar-option-main">
            <input type="radio" name="pf2e-all-resist-choice" value="${c.index}" ${i === 0 ? "checked" : ""}>
            <span class="pf2e-ar-option-name" style="color:${c.color};">${c.label} ${resistanceValue}</span>
            <span class="pf2e-ar-option-final-label">${t("dialog.finalDamage")}</span>
            <span class="pf2e-ar-final-num">${c.outcome.finalTotal}</span>
          </div>
          ${warnings.length ? `<div class="pf2e-ar-warning">⚠ ${warnings.join("<br>⚠ ")}</div>` : ""}
        </label>
      `;
    })
    .join("");

  const content = `
    <div class="pf2e-ar">
      <div class="pf2e-ar-hero">
        <div class="pf2e-ar-hero-name">${targetName}</div>
        <div class="pf2e-ar-hero-dmg">${t("dialog.damageReceived", { list: originalLine })}</div>
        ${resLine}
      </div>
      <div class="pf2e-ar-baseline">
        <div class="pf2e-ar-baseline-label">${t("dialog.damageAfterResistances")}</div>
        <div>${baselineLine}</div>
      </div>
      <div class="pf2e-ar-prompt">${t("dialog.chooseResistance")}</div>
      <div class="pf2e-ar-options">${rows}</div>
    </div>
  `;

  return foundry.applications.api.DialogV2.prompt({
    window: { title: t("dialog.title") },
    position: { width: 900 },
    content,
    ok: {
      label: t("dialog.apply"),
      callback: (event, button, dialog) => {
        const checked = dialog.element.querySelector(
          'input[name="pf2e-all-resist-choice"]:checked'
        );
        return checked ? Number(checked.value) : null;
      },
    },
    rejectClose: false,
  });
}

async function postChatMessage({
  targetActor,
  targetName,
  selectedType,
  resistanceValue,
  beforeTotal,
  afterTotal,
  applied,
  mode,
}) {
  let show = true;
  let privacy = "auto";
  try {
    show = game.settings.get(MODULE_ID, "showChatMessage");
    privacy = game.settings.get(MODULE_ID, "chatPrivacy");
  } catch (e) {
    return;
  }
  if (!show) return;

  const typeLabel = damageTypeLabel(selectedType);
  const typeColor = DAMAGE_COLORS[selectedType] ?? "#dddddd";
  const modeLabel = mode === "auto" ? t("chat.autoSuffix") : "";

  const appliedNote = applied
    ? `<span style="color:${typeColor}; font-weight:700;">${typeLabel}</span>`
    : `<span style="color:${typeColor}; font-weight:700;">${typeLabel}</span> <span style="opacity:.75;">${t("chat.notApplicable")}</span>`;

  const beforeHtml = `<span class="pf2e-ar-chat-num">${beforeTotal}</span>`;
  const afterHtml = `<span class="pf2e-ar-chat-num">${afterTotal}</span>`;

  const content = `
    <div class="pf2e-ar-chat">
      <div class="pf2e-ar-chat-title">${t("chat.title", { value: resistanceValue })}${modeLabel}</div>
      <div class="pf2e-ar-chat-row">
        ${t("chat.appliedTo", { name: `<strong>${targetName}</strong>`, type: appliedNote })}
      </div>
      <div class="pf2e-ar-chat-row">
        ${t("chat.damageChanged", { before: beforeHtml, after: afterHtml })}
      </div>
    </div>
  `;

  const messageData = {
    content,
    speaker: ChatMessage.getSpeaker({ alias: t("chat.speakerAlias") }),
    flags: { [MODULE_ID]: { applied: true, selectedType, resistanceValue } },
  };

  let whisperToGM = false;
  if (privacy === "gm") {
    whisperToGM = true;
  } else if (privacy === "auto") {
    whisperToGM = !targetActor?.hasPlayerOwner;
  }

  if (whisperToGM) {
    messageData.whisper = ChatMessage.getWhisperRecipients("GM").map((u) => u.id);
  }

  try {
    await ChatMessage.create(messageData);
  } catch (e) {
    console.error(`[${MODULE_ID}] failed to post chat message`, e);
  }
}

Hooks.once("init", () => {
  try { console.log(`[${MODULE_ID}] init hook fired`); } catch (e) {}
  try { injectStyles(); } catch (e) { console.error(`[${MODULE_ID}] injectStyles at init failed`, e); }

  try {
    game.settings.register(MODULE_ID, "autoApplyBest", {
      name: `${MODULE_ID}.settings.autoApplyBest.name`,
      hint: `${MODULE_ID}.settings.autoApplyBest.hint`,
      scope: "world",
      config: true,
      type: Boolean,
      default: false,
    });
  } catch (e) {
    console.error(`[${MODULE_ID}] register autoApplyBest failed`, e);
  }

  try {
    game.settings.register(MODULE_ID, "showChatMessage", {
      name: `${MODULE_ID}.settings.showChatMessage.name`,
      hint: `${MODULE_ID}.settings.showChatMessage.hint`,
      scope: "world",
      config: true,
      type: Boolean,
      default: true,
    });
  } catch (e) {
    console.error(`[${MODULE_ID}] register showChatMessage failed`, e);
  }

  try {
    game.settings.register(MODULE_ID, "chatPrivacy", {
      name: `${MODULE_ID}.settings.chatPrivacy.name`,
      hint: `${MODULE_ID}.settings.chatPrivacy.hint`,
      scope: "world",
      config: true,
      type: String,
      choices: {
        auto: `${MODULE_ID}.settings.chatPrivacy.choices.auto`,
        public: `${MODULE_ID}.settings.chatPrivacy.choices.public`,
        gm: `${MODULE_ID}.settings.chatPrivacy.choices.gm`,
      },
      default: "auto",
    });
  } catch (e) {
    console.error(`[${MODULE_ID}] register chatPrivacy failed`, e);
  }
});

Hooks.once("ready", () => {
  try { console.log(`[${MODULE_ID}] ready hook fired`); } catch (e) {}
  try { injectStyles(); } catch (e) { console.error(`[${MODULE_ID}] injectStyles at ready failed`, e); }

  try {
    const ActorClass = CONFIG?.Actor?.documentClass;

    if (!ActorClass?.prototype?.applyDamage) {
      console.error(`[${MODULE_ID}] Could not find Actor.applyDamage`);
      ui.notifications.error(t("notifications.notFound"));
      return;
    }

    const proto = ActorClass.prototype;

    if (proto[PATCHED]) {
      console.log(`[${MODULE_ID}] already patched`);
      return;
    }

    const originalApplyDamage = proto.applyDamage;

    proto.applyDamage = async function (params = {}) {
      try {
        if (this[IN_PROGRESS]) {
          return originalApplyDamage.call(this, params);
        }

        const damage = params?.damage;
        const rollOptions = params?.rollOptions;

        if (
          !damage ||
          typeof damage !== "object" ||
          !Array.isArray(damage.instances) ||
          params.final ||
          params.skipIWR
        ) {
          return originalApplyDamage.call(this, params);
        }

        const instances = getDamageInstances(damage);
        if (instances.length < 2) {
          return originalApplyDamage.call(this, params);
        }

        const allResistances = (this.attributes?.resistances ?? []).filter(
          (r) => r?.type === "all-damage" && !r.ignored
        );

        if (!allResistances.length) {
          return originalApplyDamage.call(this, params);
        }

        const resistance = allResistances.reduce((best, current) =>
          (Number(current.value) || 0) > (Number(best.value) || 0) ? current : best
        );
        const resistanceValue = Number(resistance.value) || 0;
        if (resistanceValue <= 0) {
          return originalApplyDamage.call(this, params);
        }

        const anyApplies = instances.some((inst) =>
          resistanceAppliesTo(resistance, inst)
        );
        if (!anyApplies) {
          log("All-resist does not apply to any instance (all are exceptions), skipping");
          return originalApplyDamage.call(this, params);
        }

        const targetName = params.token?.name ?? this.name;

        let autoApply = false;
        try {
          autoApply = game.settings.get(MODULE_ID, "autoApplyBest");
        } catch (e) {
          autoApply = false;
        }

        let selectedInstance;
        let selectedChoice;
        let baselineTotal = 0;

        if (autoApply) {
          const { baseline, sortedChoices } = computeChoices(
            this,
            instances,
            resistance,
            resistanceValue,
            damage,
            rollOptions
          );
          baselineTotal = baseline.finalTotal;
          const best = pickBestChoice(sortedChoices);
          if (!best) {
            return originalApplyDamage.call(this, params);
          }
          selectedInstance = instances[best.index];
          selectedChoice = best;
          log("Auto-selected best resistance", {
            target: targetName,
            selectedType: best.type,
            finalTotal: best.outcome.finalTotal,
          });
        } else {
          const { baseline } = computeChoices(
            this,
            instances,
            resistance,
            resistanceValue,
            damage,
            rollOptions
          );
          baselineTotal = baseline.finalTotal;

          let selectedIndex;
          try {
            selectedIndex = await chooseResistance(
              this,
              instances,
              resistance,
              resistanceValue,
              targetName,
              damage,
              rollOptions
            );
          } catch (e) {
            log("Dialog threw, falling back to best choice", e);
            selectedIndex = null;
          }

          if (selectedIndex === null || selectedIndex === undefined) {
            log("Dialog closed, auto-selecting best resistance.");
            const { sortedChoices } = computeChoices(
              this,
              instances,
              resistance,
              resistanceValue,
              damage,
              rollOptions
            );
            const best = pickBestChoice(sortedChoices);
            if (!best) {
              return originalApplyDamage.call(this, params);
            }
            selectedInstance = instances[best.index];
            selectedChoice = best;
          } else {
            selectedInstance = instances[selectedIndex];
            if (selectedInstance) {
              const outcome = computeOutcome(
                this,
                instances,
                selectedInstance.type,
                resistance,
                resistanceValue,
                damage,
                rollOptions
              );
              const allApplies = resistanceAppliesTo(resistance, selectedInstance);
              selectedChoice = {
                type: selectedInstance.type,
                outcome,
                allApplies,
              };
            }
          }
        }

        if (!selectedInstance) {
          return originalApplyDamage.call(this, params);
        }

        this[IN_PROGRESS] = true;

        const originalType = resistance.type;
        resistance.type = selectedInstance.type;

        try {
          const result = await originalApplyDamage.call(this, params);
          log("Applied errata resistance", {
            target: targetName,
            selectedType: selectedInstance.type,
            resistance: resistanceValue,
          });

          if (selectedChoice) {
            await postChatMessage({
              targetActor: this,
              targetName,
              selectedType: selectedInstance.type,
              resistanceValue,
              beforeTotal: baselineTotal,
              afterTotal: selectedChoice.outcome.finalTotal,
              applied: selectedChoice.allApplies !== false,
              mode: autoApply ? "auto" : "manual",
            });
          }

          return result;
        } catch (e) {
          console.error(`[${MODULE_ID}] originalApplyDamage failed`, e);
          ui.notifications.error(t("notifications.errorDamage"));
          throw e;
        } finally {
          resistance.type = originalType;
          this[IN_PROGRESS] = false;
        }
      } catch (e) {
        console.error(`[${MODULE_ID}] applyDamage wrapper failed`, e);
        return originalApplyDamage.call(this, params);
      }
    };

    Object.defineProperty(proto, PATCHED, {
      value: true,
      configurable: false,
      enumerable: false,
    });

    log("patched Actor.applyDamage successfully");
    try {
      ui.notifications.info(t("notifications.active"));
    } catch (e) {}
  } catch (e) {
    console.error(`[${MODULE_ID}] ready hook failed`, e);
    try {
      ui.notifications.error(t("notifications.errorLoad"));
    } catch (e2) {}
  }
});