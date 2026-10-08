# Changelog

## v1.1.1

**Fixed**
- Immunities are now handled correctly.

## v1.1.0

### Added
- Native PF2e tooltip integration: applied resistances and weaknesses now appear in the standard "X takes N damage" chat card (info icon).
- Sequential dialogs for multiple applicable resistances. Each resistance is applied to one damage instance of your choice.
- Auto-apply setting for resistances with a single valid target.
- Option to show the damage type each resistance was applied to (debug).
- `IWR Types` (area-damage, spells, weapons, etc.) are now correctly detected and displayed.

### Changed
- **Client-scoped settings**: `Automatically select best resistance` and the debug toggle are now per-user. Each client can choose whether to use the selection dialog or auto-apply. World-scoped settings (`allResEnabled`, `errataIWR`, `showChatMessage`) remain shared across all users.
- Removed the custom chat card. All breakdown info is now shown inside the PF2e damage message.
- Resistances are no longer applied once per damage instance — each resistance triggers once per effect, as per errata.
- Active resistance chip highlighting uses the old "all damage" red palette.

### Fixed
- Magical damage is no longer treated as non-magical in `doubleVs` checks.
- `all-damage` weakness no longer overrides more specific weaknesses.

## v1.0.0

- Initial release.