import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { createTranslator, languageFromHass, resolveLanguage, type LanguageCode, type Translator } from "./i18n";
import type { CardLanguage, HomeAssistant, StorageMonitorConfig } from "./types";

@customElement("storage-monitor-card-editor")
export class StorageMonitorCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config: StorageMonitorConfig = { type: "custom:storage-monitor-card" };
  @state() private _poolsJson = "[]";
  @state() private _disksJson = "[]";
  @state() private _raidJson = "{}";
  @state() private _error = "";

  public setConfig(config: StorageMonitorConfig): void {
    this._config = { ...config };
    this._poolsJson = JSON.stringify(config.pools ?? [], null, 2);
    this._disksJson = JSON.stringify(config.disks ?? [], null, 2);
    this._raidJson = JSON.stringify(config.raid ?? {}, null, 2);
  }

  private get _language(): LanguageCode {
    return resolveLanguage(this._config.language, languageFromHass(this.hass));
  }

  private get _t(): Translator {
    return createTranslator(this._language);
  }

  private _update<K extends keyof StorageMonitorConfig>(key: K, value: StorageMonitorConfig[K]): void {
    this._config = { ...this._config, [key]: value };
    this._fire();
  }

  private _fire(): void {
    this.dispatchEvent(new CustomEvent("config-changed", {
      bubbles: true,
      composed: true,
      detail: { config: { ...this._config, type: "custom:storage-monitor-card" } },
    }));
  }

  private _parseJson(kind: "pools" | "disks" | "raid", value: string): void {
    if (kind === "pools") this._poolsJson = value;
    if (kind === "disks") this._disksJson = value;
    if (kind === "raid") this._raidJson = value;
    try {
      const parsed: unknown = JSON.parse(value);
      if (kind === "pools" && Array.isArray(parsed)) this._update("pools", parsed as StorageMonitorConfig["pools"]);
      else if (kind === "disks" && Array.isArray(parsed)) this._update("disks", parsed as StorageMonitorConfig["disks"]);
      else if (kind === "raid" && typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) this._update("raid", parsed as StorageMonitorConfig["raid"]);
      else throw new Error(this._t("editor.jsonTypeError"));
      this._error = "";
    } catch (error) {
      this._error = error instanceof Error ? error.message : this._t("editor.jsonFormatError");
    }
  }

  protected render() {
    const t = this._t;
    // `auto` (follow Home Assistant) is the default; aliases such as `zh` are shown as `auto`.
    const languageValue = this._config.language === "en" || this._config.language === "zh-Hans"
      ? this._config.language
      : "auto";
    return html`
      <div class="editor">
        <div class="intro">${t("editor.intro")}</div>
        <label>${t("editor.title")}<input .value=${this._config.title ?? ""} placeholder=${t("card.title")} @input=${(e: InputEvent) => this._update("title", (e.target as HTMLInputElement).value)}></label>
        <label>${t("editor.subtitle")}<input .value=${this._config.subtitle ?? ""} @input=${(e: InputEvent) => this._update("subtitle", (e.target as HTMLInputElement).value)}></label>
        <label>${t("editor.language")}
          <select .value=${languageValue} @change=${(e: Event) => this._update("language", (e.target as HTMLSelectElement).value as CardLanguage)}>
            <option value="auto">${t("editor.languageAuto")}</option>
            <option value="en">${t("editor.languageEnglish")}</option>
            <option value="zh-Hans">${t("editor.languageChinese")}</option>
          </select>
        </label>
        <label class="check"><input type="checkbox" .checked=${this._config.showPools !== false} @change=${(e: Event) => this._update("showPools", (e.target as HTMLInputElement).checked)}>${t("editor.showPools")}</label>
        <label class="check"><input type="checkbox" .checked=${this._config.showRaid !== false} @change=${(e: Event) => this._update("showRaid", (e.target as HTMLInputElement).checked)}>${t("editor.showRaid")}</label>
        <label class="check"><input type="checkbox" .checked=${this._config.showDisks !== false} @change=${(e: Event) => this._update("showDisks", (e.target as HTMLInputElement).checked)}>${t("editor.showDisks")}</label>
        <label class="check"><input type="checkbox" .checked=${this._config.showTemperature !== false} @change=${(e: Event) => this._update("showTemperature", (e.target as HTMLInputElement).checked)}>${t("editor.showTemperature")}</label>
        <label class="check"><input type="checkbox" .checked=${this._config.showHealth !== false} @change=${(e: Event) => this._update("showHealth", (e.target as HTMLInputElement).checked)}>${t("editor.showHealth")}</label>
        <div class="group">
          <label>${t("editor.poolsJson")}<textarea .value=${this._poolsJson} spellcheck="false" @input=${(e: InputEvent) => this._parseJson("pools", (e.target as HTMLTextAreaElement).value)}></textarea></label>
          <label>${t("editor.disksJson")}<textarea .value=${this._disksJson} spellcheck="false" @input=${(e: InputEvent) => this._parseJson("disks", (e.target as HTMLTextAreaElement).value)}></textarea></label>
          <label>${t("editor.raidJson")}<textarea .value=${this._raidJson} spellcheck="false" @input=${(e: InputEvent) => this._parseJson("raid", (e.target as HTMLTextAreaElement).value)}></textarea></label>
        </div>
        ${this._error ? html`<div class="error">${t("editor.jsonError", { error: this._error })}</div>` : ""}
        <div class="hint">${t("editor.hint")}</div>
      </div>
    `;
  }

  static styles = css`
    :host { display: block; color: var(--primary-text-color); }
    .editor { display: flex; flex-direction: column; gap: 12px; padding: 8px 0; }
    .intro, .hint { color: var(--secondary-text-color); font-size: .85rem; line-height: 1.5; }
    label { display: flex; flex-direction: column; gap: 5px; font-size: .9rem; }
    input:not([type="checkbox"]), select, textarea { box-sizing: border-box; width: 100%; border: 1px solid var(--divider-color); border-radius: 8px; background: var(--input-fill-color, var(--card-background-color)); color: var(--primary-text-color); padding: 9px 10px; font: inherit; }
    select { cursor: pointer; }
    .check { flex-direction: row; align-items: center; gap: 9px; }
    .check input { width: 18px; height: 18px; }
    textarea { min-height: 125px; resize: vertical; font-family: var(--code-font-family, monospace); font-size: .82rem; }
    .group { display: flex; flex-direction: column; gap: 12px; }
    .error { color: var(--error-color, #db4437); font-size: .85rem; }
  `;
}
