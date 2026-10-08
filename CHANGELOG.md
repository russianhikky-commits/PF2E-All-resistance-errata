# Changelog

## v1.1.0

**Main changes**
- Resistances now trigger once per effect, not once per damage type.
- Removed the module's separate chat card. All information is now shown in the native PF2e message — a small (i) icon next to "X takes N damage".

**Added**
- A dialog opens for each applicable resistance, one after another, so you can choose which damage type it applies to.
- If a resistance only has one valid damage type, it is applied automatically — no dialog.
- New setting "Automatically select best resistance" — when enabled, no dialog is shown at all; the module picks for you.
- Support for area damage, spells, weapons and other IWR types — they are now correctly detected and appear in the tooltip.
- Tooltip shows which damage type each resistance was applied to (debug setting).

**Changed**
- Some settings are now **client-side** — each player decides for themselves whether to use auto-select or not. These are "Automatically select best resistance" and "Debug: show applied damage type". All other settings remain shared across the whole world.
- The active resistance in the dialog is now highlighted in red, matching the old "Resistance to All Damage" look.

**Fixed**
- Magical damage is no longer treated as non-magical (important for ghosts and similar creatures with double resistance vs non-magical).
- Weakness to all damage no longer overrides a more specific weakness (e.g. weakness to cold).

## v1.0.0

- Initial release.
