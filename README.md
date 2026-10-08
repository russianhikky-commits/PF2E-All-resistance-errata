# PF2e All Damage Resistance (Errata)

A Foundry VTT module for the PF2e system that implements the **Spring 2026 errata** for *New rules for resistances and weaknesses*.

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

Found in **Settings → Game Settings → PF2e All Damage Resistance (Errata)**.

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
3. Click **Apply**.
4. If multiple targets are valid, a dialog opens for each resistance.
5. The result is applied and the PF2e tooltip shows the full breakdown.

## Compatibility

- Foundry VTT **v14** (verified).
- PF2e system **v8.5.1+**.
- Tested with **PF2e Toolbelt**.

## License

MIT.

---

# PF2e All Damage Resistance (Errata) — Русский

Модуль для Foundry VTT (система PF2e), реализующий **эррату Spring 2026** для *Новых правил сопротивлений и уязвимостей*.

Сопротивление применяется к **одному** выбранному типу урона за эффект, а не к каждому типу отдельно. Применённые сопротивления и уязвимости отображаются в родном тултипе PF2e.

---

## Возможности

- Перехватывает многотипный урон против `Сопротивления всему урону`.
- Диалог выбора типа урона для каждого подходящего сопротивления, отсортирован по значению.
- Родной тултип PF2e показывает применённые сопротивления и уязвимости.
- Сопротивления с единственным подходящим типом урона применяются автоматически.
- Учёт исключений (`exceptions`, например у призрака) и двойного сопротивления против немагического (`doubleVs`).
- Учёт IWR-типов, действующих на эффект целиком (урон по области, заклинания, оружие и т.д.).
- Исправляет баг базовой системы: weakness/resistance срабатывали раз на каждый тип урона.
- Поддержка тёмной и светлой темы.
- Локализация: **английский** и **русский**.

---

## Установка

1. В Foundry открой **Add-on Modules → Install Module**.
2. Вставь в поле **Manifest URL**:
   ```
   https://raw.githubusercontent.com/russianhikky-commits/PF2E-All-resistance-errata/main/module.json
   ```
3. Нажми **Install**.

## Структура папки

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

## Настройки

Находятся в **Настройки → Настройки игры → PF2e All Damage Resistance (Erratta)**.

| Настройка | По умолчанию | Описание |
|---|---|---|
| **Применять правило сопротивления всему урону (эррата)** | вкл | Включает или выключает правило all-res. Если выключить — модуль только исправляет баг с weakness/resistance. |
| **Автоматически выбирать лучшее сопротивление** | вкл | Не показывать диалог. Модуль сам применяет сопротивление к типу урона, дающему наименьший итоговый урон. |
| **Показывать разбивку IWR в чате** | вкл | Добавляет в PF2e-сообщение о применении урона значок с деталями применённых сопротивлений и уязвимостей. |
| **Применять weakness/resistance один раз к эффекту (эррата)** | вкл | Исправляет баг, при котором weakness/resistance срабатывали на каждый инстанс урона отдельно. |
| **Debug: показывать к какому типу урона применено** | выкл | В тултипе чата после названия сопротивления указывать тип урона, к которому оно было применено. Только для отладки. |

## Использование

1. Наведись на существо с `Сопротивлением всему урону`.
2. Нанеси урон двух или более типов.
3. Нажми **Apply Damage**.
4. Если подходящих типов урона несколько, для каждого сопротивления откроется диалог выбора.
5. Результат применяется, а тултип PF2e показывает полную разбивку.

## Совместимость

- Foundry VTT **v14** (проверено).
- Система PF2e **v8.5.1+**.
- Протестировано с **PF2e Toolbelt**.

## Лицензия

MIT.
