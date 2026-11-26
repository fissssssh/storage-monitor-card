# Changelog

## 0.1.1

- Enable TypeScript legacy decorator compatibility (`experimentalDecorators`) for Lit's `@property` and `@state` decorators.

## 0.1.2

- Automatically scale disk and pool capacities to a readable unit.
- Add optional per-disk `powerOnHours` entity mapping.

## 0.2.0

- Add i18n with English and Simplified Chinese UI strings. The card follows the Home Assistant UI language by default and falls back to English.
- Add the `language` option (`auto`, `en`, `zh-Hans`) to both the card and the visual editor, plus a language selector in the editor.
- Format numbers, capacities and power-on hours with the locale of the active language.
- Remove the hard-coded Chinese default title so a card without `title` follows the configured language.
- Add HACS packaging, README previews and installation instructions.
