# PF2e All Damage Resistance (Errata)

A Foundry VTT module for the PF2e system that implements the **Spring 2026 errata** for *Resistance to All Damage*.

Resistance is applied to **one** chosen damage type per effect, not to every type separately. The applied resistances and weaknesses are shown in the native PF2e damage tooltip.

---

## Features

- Intercepts multi-type damage against `Resistance to All Damage`.
- Sequential dialog for each applicable resistance, sorted by value.
- Native PF2e chat tooltip shows applied resistances and weaknesses.
- Auto-applies resistances that have only one valid target.
- Handles `exceptions` (e.g. ghost) and `doubleVs` (double resistance vs non-magical).
- Handles effect-scoped IWR (area-damage, spells, weapons, etc.).
- Fixes the "weakness/resistance triggers once per damage type" bug in the base system.
- Dark and light theme support.
- Localization: **English** and **Russian**.

---

## Installation

1. In Foundry, open **Add-on Modules → Install Module**.
2. Paste this into **Manifest URL**:
   ```
   https://raw.githubusercontent.com/russianhikky-commits/PF2E-All-resistance-errata/main/module.json
   ```
3. Click **Install**.

## Folder structure

```
pf2e-all-resistance-errata/
├── module.json
├── README.md
├── CHANGELOG.md
├── scripts/
│   └── main.js
└── lang/
    ├── en.json
    └── ru.json
```

## Settings

Found in **Game Settings → Configure Settings → Module Settings → PF2e All Damage Resistance (Errata)**.

| Setting | Default | Description |
|---|---|---|
| **Apply Resistance to All Damage rule (errata)** | on | Toggle the all-res rule. When off, the module only fixes the weakness/resistance bug. |
| **Automatically select best resistance** | on | Don't show the dialog. Auto-pick the resistance target that yields the lowest total damage. |
| **Show IWR breakdown in chat** | on | Add the info icon with applied resistances and weaknesses to the PF2e damage card. |
| **Apply weakness/resistance once per effect (errata)** | on | Fix the bug where weakness/resistance triggers once per damage instance. |
| **Debug: show applied damage type** | off | Append the damage type each resistance was applied to. Debug only. |

## Usage

1. Target a creature with `Resistance to All Damage`.
2. Roll damage with two or more damage types.
3. Click **Apply Damage**.
4. If multiple targets are valid, a dialog opens for each resistance.
5. The result is applied and the PF2e tooltip shows the full breakdown.

## Compatibility

- Foundry VTT **v14** (verified).
- PF2e system **v8.5.1+**.
- Tested with **PF2e Toolbelt**.

## Known limitations

- Only works when `applyDamage` runs on the client that has the target's actor. For NPC targets this means the GM client always handles it.
- Weakness and resistance preview in the dialog does not include external modifiers (only actor's IWR).

## License

MIT.