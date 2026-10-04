# PF2e All Damage Resistance (Errata)

A Foundry VTT module for the PF2e system that applies **Resistance to All Damage**
according to the Spring 2026 errata: the resistance applies to **one** chosen
damage type in a multi-type damage roll, not to every type separately.

---

## English

### What it does

When a creature with `Resistance N to all damage` receives damage of **two or
more types**, the module intercepts `Actor.applyDamage` and shows a dialog where
you pick which damage type receives the resistance. The resistance is applied
only to that type; other types are unaffected. Specific resistances (e.g. `fire 5`)
still apply normally to their own damage types.

If the damage roll has only one damage type, or the target has no all-damage
resistance, the module does nothing — everything works as in vanilla PF2e.

### Features

- Intercepts multi-type damage against `Resistance to all damage`.
- Dialog with a preview of the final damage for each choice.
- Correctly handles `exceptions` (e.g. ghost's resistance to all except force,
  ghost-touch, spirit, vitality).
- Correctly handles `doubleVs` (e.g. double resistance against non-magical)
  and magical traits from items.
- Auto-selects the best resistance (setting).
- Optional chat message with the applied result, with privacy control.
- Dark and light theme support.
- Localization: **English** and **Russian**.

### Installation

1. Extract the module folder into `Data/modules/pf2e-all-resistance-errata/`.
2. Ensure the structure is:
```
pf2e-all-resistance-errata/
├── module.json
├── README.md
├── scripts/
│ └── main.js
└── lang/
├── en.json
└── ru.json
```
3. Reload Foundry (F5).
4. Enable the module in **Manage Modules**.

### Settings

Found in **Game Settings → PF2e All Damage Resistance (Errata)**:

| Setting | Description |
|---|---|
| **Automatically select best resistance** | Don't show the dialog. The module picks the damage type that results in the lowest total damage. |
| **Show application result in chat** | Post a chat message with the applied resistance and final damage. |
| **Message privacy** | `By target` (player — public, NPC — GM only) / `Always public` / `Always GM only`. |

### Usage

1. Target a creature with `Resistance N to all damage`.
2. Roll damage with two or more damage types.
3. Click **Apply**.
4. Choose the damage type that receives the resistance.
5. If you close the dialog without choosing, the module auto-selects the best option.

### Compatibility

- Foundry VTT **v14** (verified), minimum v14.
- PF2e system **v8.5.1+** (verified).
- Tested with **PF2e Toolbelt** (combined damage).

### Known limitations

- The module relies on `Actor.applyDamage` internals. If another module
overrides the same method, conflicts may occur.
- Weakness preview is not included in the dialog totals (only resistances are shown).

### License

MIT.

---

## Русский

Модуль для Foundry VTT (система PF2e), который применяет *Сопротивление всему
урону* по эррате Spring 2026: сопротивление применяется к *одному* выбранному
типу урона в броске, а не к каждому типу отдельно.

### Что делает

Когда существо с `Сопротивление всему урона` получает урон **двух или более
типов**, модуль перехватывает `Actor.applyDamage` и показывает окно выбора типа
урона. Сопротивление применяется только к выбранному типу; остальные не
затрагиваются. Специфические сопротивления (например, `fire 5`) продолжают
работать как обычно.

Если урон одного типа или у цели нет резиста ко всему — модуль не вмешивается, всё
работает как в ваниле.

### Возможности

- Перехват многотипного урона против `Сопротивления всему урону`.
- Диалог с предпросмотром итогового урона по каждому варианту.
- Корректная обработка `исключений` (например, у призрака резист ко всему, кроме
force, ghost-touch, spirit, vitality).
- Корректная обработка `двойное против` (двойное сопротивление против немагического)
и магических трейтов предметов.
- Автоматический выбор лучшего сопротивления (настройка).
- Опциональное сообщение в чате с результатом, с настройкой приватности.
- Поддержка тёмной и светлой темы.
- Локализация: **английский** и **русский**.

### Установка

1. Распакуй папку модуля в `Data/modules/pf2e-all-resistance-errata/`.
2. Убедись, что структура такая:
```
pf2e-all-resistance-errata/
├── module.json
├── README.md
├── scripts/
│ └── main.js
└── lang/
├── en.json
└── ru.json
```
3. Перезагрузи Foundry.
4. Включи модуль в **Управление модулями**.

### Настройки

Найти в **Настройки игры → PF2e All Damage Resistance (Errata)**:

| Настройка | Описание |
|---|---|
| **Автоматически выбирать лучшее сопротивление** | Не показывать диалог. Модуль сам применяет сопротивление к типу, дающему наименьший итоговый урон. |
| **Показывать в чате результат применения** | Публиковать в чат сообщение о применённом сопротивлении и итоговом уроне. |
| **Приватность сообщений** | `По цели` (игрок — всем, НПС — только ГМ) / `Всегда всем` / `Всегда только ГМ`. |

### Использование

1. Выбери цель с `Сопротивлением всему урону`.
2. Нанеси урон двух или более типов.
3. Нажми **Применить**.
4. Выбери тип урона, к которому применить сопротивление.
5. Если закрыть окно без выбора — модуль автоматически применит лучший вариант.

### Совместимость

- Foundry VTT **v14** (проверено), минимум v14.
- Система PF2e **v8.5.1+** (проверено).
- Протестировано с **PF2e Toolbelt** (объединение урона).

### Известные ограничения

- Модуль опирается на внутренности `Actor.applyDamage`. Если другой модуль
переопределяет тот же метод — возможны конфликты.
- Слабости в предпросмотре диалога не учитывается (только сопротивления).

### Лицензия

MIT.
