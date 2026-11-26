import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { createTranslator, languageFromHass, resolveLanguage, type LanguageCode, type Translator } from "./i18n";
import type { DiskConfig, HomeAssistant, PoolConfig, RaidConfig, StorageMonitorConfig } from "./types";
import { capacityText, formatNumber, formatValue, getEntity, healthKind, iconForState, numericState, openMoreInfo, percent, resolveValue, stateLabel, type TextContext } from "./helpers";

const DEFAULTS: Required<Pick<StorageMonitorConfig,
  "showPools" | "showDisks" | "showRaid" | "showTemperature" | "showHealth" |
  "showEmptySections" | "compact" | "warningThreshold" | "criticalThreshold" |
  "temperatureWarning" | "temperatureCritical" | "entityTapAction" | "language"
>> = {
  showPools: true,
  showDisks: true,
  showRaid: true,
  showTemperature: true,
  showHealth: true,
  showEmptySections: false,
  compact: false,
  warningThreshold: 75,
  criticalThreshold: 90,
  temperatureWarning: 45,
  temperatureCritical: 55,
  entityTapAction: "more-info",
  language: "auto",
};

@customElement("storage-monitor-card")
export class StorageMonitorCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: StorageMonitorConfig;

  public static getConfigElement(): HTMLElement {
    return document.createElement("storage-monitor-card-editor");
  }

  public static getStubConfig(): StorageMonitorConfig {
    return {
      type: "custom:storage-monitor-card",
      pools: [],
      disks: [],
      showPools: true,
      showDisks: true,
      showRaid: true,
    };
  }

  public setConfig(config: StorageMonitorConfig): void {
    const t = createTranslator(resolveLanguage(config?.language, languageFromHass(this.hass)));
    if (!config || typeof config !== "object") throw new Error(t("error.configObject"));
    if (config.pools !== undefined && !Array.isArray(config.pools)) throw new Error(t("error.poolsArray"));
    if (config.disks !== undefined && !Array.isArray(config.disks)) throw new Error(t("error.disksArray"));
    this._config = { ...DEFAULTS, ...config };
  }

  /** Resolved display language: follows Home Assistant unless `language` forces one. */
  private get _language(): LanguageCode {
    return resolveLanguage(this._config?.language, languageFromHass(this.hass));
  }

  private get _t(): Translator {
    return createTranslator(this._language);
  }

  private get _text(): TextContext {
    return { t: this._t, locale: this._language };
  }

  public getCardSize(): number {
    const c = this._config;
    return 2 + (c?.showPools && (c.pools?.length ?? 0) ? (c.pools?.length ?? 0) * 2 : 0)
      + (c?.showDisks && (c.disks?.length ?? 0) ? (c.disks?.length ?? 0) : 0)
      + (c?.showRaid && c.raid ? 2 : 0);
  }

  private _tap(entityId?: string): void {
    if (this._config?.entityTapAction !== "none") openMoreInfo(this, entityId);
  }

  private _thresholdClass(value: number | null): string {
    if (value === null) return "neutral";
    if (value >= (this._config?.criticalThreshold ?? DEFAULTS.criticalThreshold)) return "bad";
    if (value >= (this._config?.warningThreshold ?? DEFAULTS.warningThreshold)) return "warning";
    return "good";
  }

  private _temperatureC(entityId?: string): number | null {
    const value = numericState(this.hass, entityId);
    if (value === null) return null;
    const unit = String(getEntity(this.hass, entityId)?.attributes.unit_of_measurement ?? "°C").toLowerCase();
    return unit.includes("f") ? (value - 32) * 5 / 9 : value;
  }

  private _temperatureClass(value: number | null): string {
    if (value === null) return "neutral";
    if (value >= (this._config?.temperatureCritical ?? DEFAULTS.temperatureCritical)) return "bad";
    if (value >= (this._config?.temperatureWarning ?? DEFAULTS.temperatureWarning)) return "warning";
    return "good";
  }

  private _health(entityId?: string): { label: string; kind: string; raw?: string } {
    const entity = getEntity(this.hass, entityId);
    if (!entity) return { label: this._t("state.unconfigured"), kind: "neutral" };
    return { label: stateLabel(entity.state, this._text), kind: healthKind(entity.state), raw: entity.state };
  }

  private _progress(entityId?: string): TemplateResult {
    const value = percent(this.hass, entityId);
    const kind = this._thresholdClass(value);
    return html`
      <div class="progress ${kind}" role="progressbar"
        aria-valuemin="0" aria-valuemax="100" aria-valuenow=${value ?? 0}>
        <div class="progress__fill" style=${`width:${value ?? 0}%`}></div>
      </div>
    `;
  }

  private _entityLine(label: string, entityId?: string, fallbackUnit = ""): TemplateResult | typeof nothing {
    if (!entityId) return nothing;
    const ctx = this._text;
    const value = capacityText(this.hass, entityId, ctx);
    const displayValue = value === "—" ? formatValue(this.hass, entityId, fallbackUnit, ctx) : value;
    return html`<span class="metric"><span class="metric__label">${label}</span><span class="metric__value">${displayValue}</span></span>`;
  }

  private _poolCard(pool: PoolConfig, index: number): TemplateResult {
    const usage = percent(this.hass, pool.usage);
    const kind = this._thresholdClass(usage);
    const health = this._health(pool.health);
    const hasHealth = Boolean(pool.health);
    return html`
      <section class="pool-card" @click=${() => this._tap(pool.usage || pool.used || pool.total)} role="button" tabindex="0">
        <div class="pool-main">
          <div class="pool-heading">
            <ha-icon class="section-icon" .icon=${pool.icon || "mdi:database"}></ha-icon>
            <div class="pool-title">
              <div class="item-name">${pool.name || this._t("pool.defaultName", { index: index + 1 })}</div>
              ${pool.raid ? html`<div class="item-subtitle">${this._stateText(pool.raid)}</div>` : nothing}
            </div>
            <div class="usage-value ${kind}">${usage === null ? "—" : `${usage.toFixed(1)}%`}</div>
          </div>
          ${this._progress(pool.usage)}
          <div class="metrics">
            ${this._entityLine(this._t("metric.used"), pool.used)}
            ${this._entityLine(this._t("metric.free"), pool.free)}
            ${this._entityLine(this._t("metric.total"), pool.total)}
          </div>
          ${hasHealth && this._config?.showHealth ? html`
            <div class="inline-status">
              <ha-icon .icon=${iconForState(health.raw)} class=${`status-icon ${health.kind}`}></ha-icon>
              <span>${health.label}</span>
            </div>` : nothing}
        </div>
      </section>
    `;
  }

  private _stateText(entityId?: string): string {
    const entity = getEntity(this.hass, entityId);
    if (!entity) return "";
    return entity.state;
  }

  private _raidSection(raid: RaidConfig): TemplateResult {
    const health = this._health(raid.health || raid.state);
    const progress = percent(this.hass, raid.progress);
    return html`
      <section class="section">
        ${this._sectionHeader("mdi:server-network", this._t("section.raid"))}
        <div class="raid-card">
          <div class="raid-row">
            <div>
              <div class="item-name">${raid.name || this._t("raid.defaultName")}</div>
              <div class="item-subtitle">${raid.level ? this._t("raid.level", { level: this._stateText(raid.level) }) : this._t("raid.defaultInfo")}</div>
            </div>
            <div class="status-pill ${health.kind}">
              <ha-icon .icon=${iconForState(health.raw)}></ha-icon>${health.label}
            </div>
          </div>
          ${raid.state && raid.health && raid.state !== raid.health ? html`
            <div class="raid-detail">${this._entityLine(this._t("raid.state"), raid.state)}</div>` : nothing}
          ${raid.progress ? html`
            <div class="raid-progress">
              <div class="metrics"><span class="metric__label">${this._t("raid.progress")}</span><span class="metric__value">${progress === null ? this._stateText(raid.progress) : `${progress.toFixed(1)}%`}</span></div>
              ${this._progress(raid.progress)}
            </div>` : nothing}
        </div>
      </section>
    `;
  }

  private _diskCard(disk: DiskConfig, index: number): TemplateResult {
    const health = this._health(disk.health);
    const temp = this._temperatureC(disk.temperature);
    const tempClass = this._temperatureClass(temp);
    const usage = percent(this.hass, disk.usage);
    const usageClass = this._thresholdClass(usage);
    const diskModel = disk.model ? this._stateText(disk.model) : "";
    const powerOnHours = resolveValue(this.hass, disk.powerOnHours, this._text);
    const powerOnHoursText = powerOnHours.raw === null
      ? powerOnHours.text
      : this._t("disk.hours", { value: formatNumber(powerOnHours.raw, 0, this._language) });
    return html`
      <div class="disk-row" @click=${() => this._tap(disk.health || disk.temperature || disk.powerOnHours || disk.usage || disk.capacity)} role="button" tabindex="0">
        <div class="disk-icon-wrap">
          <ha-icon class="disk-icon" .icon=${disk.icon || "mdi:harddisk"}></ha-icon>
        </div>
        <div class="disk-content">
          <div class="disk-heading">
            <div class="disk-name-wrap">
              <div class="item-name">${disk.name || this._t("disk.defaultName", { index: index + 1 })}</div>
              ${diskModel ? html`<div class="item-subtitle">${diskModel}</div>` : nothing}
            </div>
            ${this._config?.showHealth && disk.health ? html`
              <span class="status-pill ${health.kind}"><ha-icon .icon=${iconForState(health.raw)}></ha-icon>${health.label}</span>
            ` : nothing}
          </div>
          <div class="disk-metrics">
            ${disk.capacity ? html`<span>${this._entityLine(this._t("metric.capacity"), disk.capacity)}</span>` : nothing}
            ${disk.temperature && this._config?.showTemperature ? html`
              <span class=${`temperature ${tempClass}`}><ha-icon icon="mdi:thermometer"></ha-icon>${disk.temperature ? formatValue(this.hass, disk.temperature, "°C", this._text) : "—"}</span>
            ` : nothing}
            ${disk.powerOnHours ? html`
              <span class="power-on-hours"><ha-icon icon="mdi:clock-outline"></ha-icon>${this._t("disk.powerOnHours")} ${powerOnHoursText}</span>
            ` : nothing}
            ${usage !== null ? html`<span class=${`disk-usage ${usageClass}`}>${usage.toFixed(1)}%</span>` : nothing}
          </div>
          ${disk.usage ? this._progress(disk.usage) : nothing}
          <div class="metrics">
            ${this._entityLine(this._t("metric.used"), disk.used)}
            ${this._entityLine(this._t("metric.free"), disk.free)}
          </div>
        </div>
      </div>
    `;
  }

  private _sectionHeader(icon: string, title: string): TemplateResult {
    return html`<div class="section-header"><ha-icon .icon=${icon}></ha-icon><span>${title}</span></div>`;
  }

  private _summary(): TemplateResult | typeof nothing {
    const config = this._config;
    if (!config) return nothing;
    const disks = this._config?.disks ?? [];
    const temperatures = disks
      .filter((d) => d.temperature && this._config?.showTemperature)
      .map((d) => this._temperatureC(d.temperature))
      .filter((v): v is number => v !== null);
    const maxTemp = temperatures.length ? Math.max(...temperatures) : null;
    const healthStates = [
      ...(config.pools ?? []).filter((p) => p.health).map((p) => this._health(p.health)),
      ...disks.filter((d) => d.health).map((d) => this._health(d.health)),
      ...(config.raid?.health || config.raid?.state ? [this._health(config.raid.health || config.raid.state)] : []),
    ];
    const overall = healthStates.some((h) => h.kind === "bad") ? "bad"
      : healthStates.some((h) => h.kind === "warning") ? "warning"
      : healthStates.length && healthStates.every((h) => h.kind === "good") ? "good" : "neutral";
    const label = overall === "good" ? this._t("summary.healthy") : overall === "warning" ? this._t("summary.warning") : overall === "bad" ? this._t("summary.critical") : this._t("summary.unknown");
    if (!healthStates.length && maxTemp === null) return nothing;
    return html`
      <div class="summary">
        ${healthStates.length ? html`
          <div class="summary-chip ${overall}">
            <ha-icon .icon=${overall === "good" ? "mdi:check-circle" : overall === "bad" ? "mdi:alert-circle" : overall === "warning" ? "mdi:alert" : "mdi:help-circle"}></ha-icon>
            <span>${label}</span>
          </div>` : nothing}
        ${maxTemp !== null ? html`
          <div class="summary-chip ${this._temperatureClass(maxTemp)}">
            <ha-icon icon="mdi:thermometer"></ha-icon>
            <span>${this._t("summary.maxTemperature", { value: maxTemp.toFixed(0) })}</span>
          </div>` : nothing}
      </div>
    `;
  }

  protected render(): TemplateResult {
    if (!this._config) return html`<ha-card><div class="empty">${this._t("card.configurePrompt")}</div></ha-card>`;
    const config = this._config;
    const pools = config.pools ?? [];
    const disks = config.disks ?? [];
    const showPools = config.showPools !== false && (pools.length > 0 || config.showEmptySections);
    const showDisks = config.showDisks !== false && (disks.length > 0 || config.showEmptySections);
    const showRaid = config.showRaid !== false && Boolean(config.raid);
    return html`
      <ha-card class=${config.compact ? "compact" : ""}>
        <div class="card-content">
          <header class="card-header">
            <div class="header-text">
              <div class="card-title">${config.title || this._t("card.title")}</div>
              ${config.subtitle ? html`<div class="card-subtitle">${config.subtitle}</div>` : nothing}
            </div>
            ${this._summary()}
          </header>

          ${showPools ? html`
            <section class="section">
              ${this._sectionHeader("mdi:database", this._t("section.pools"))}
              ${pools.length ? html`<div class="pool-list">${pools.map((pool, i) => this._poolCard(pool, i))}</div>` : html`<div class="empty">${this._t("pools.empty")}</div>`}
            </section>` : nothing}

          ${showRaid ? this._raidSection(config.raid!) : nothing}

          ${showDisks ? html`
            <section class="section">
              ${this._sectionHeader("mdi:harddisk", this._t("section.disks"))}
              ${disks.length ? html`<div class="disk-list">${disks.map((disk, i) => this._diskCard(disk, i))}</div>` : html`<div class="empty">${this._t("disks.empty")}</div>`}
            </section>` : nothing}
        </div>
      </ha-card>
    `;
  }

  static styles = css`
    :host {
      display: block;
      color: var(--primary-text-color);
      --sm-radius: var(--ha-card-border-radius, 12px);
      --sm-good: var(--success-color, #43a047);
      --sm-warning: var(--warning-color, #f9a825);
      --sm-bad: var(--error-color, #db4437);
      --sm-muted: var(--secondary-text-color);
      --sm-line: var(--divider-color, rgba(127, 127, 127, .18));
      --sm-surface: var(--ha-card-background, var(--card-background-color));
    }
    ha-card {
      overflow: hidden;
      border-radius: var(--sm-radius);
      background: var(--ha-card-background, var(--card-background-color));
      color: var(--primary-text-color);
      box-shadow: var(--ha-card-box-shadow, none);
    }
    .card-content { padding: 16px; display: flex; flex-direction: column; gap: 18px; }
    .card-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
    .header-text { min-width: 0; }
    .card-title { font-size: 1.15rem; line-height: 1.4; font-weight: 600; letter-spacing: -.01em; }
    .card-subtitle { margin-top: 3px; color: var(--sm-muted); font-size: .85rem; }
    .summary { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 6px; }
    .summary-chip, .status-pill { display: inline-flex; align-items: center; gap: 5px; border-radius: 999px; padding: 5px 9px; font-size: .75rem; font-weight: 500; white-space: nowrap; background: var(--secondary-background-color, rgba(127,127,127,.10)); }
    ha-icon { --mdc-icon-size: 18px; }
    .summary-chip ha-icon, .status-pill ha-icon { --mdc-icon-size: 15px; }
    .good { color: var(--sm-good); }
    .warning { color: var(--sm-warning); }
    .bad { color: var(--sm-bad); }
    .neutral { color: var(--sm-muted); }
    .section { display: flex; flex-direction: column; gap: 10px; }
    .section-header { display: flex; align-items: center; gap: 8px; color: var(--sm-muted); font-size: .82rem; font-weight: 600; letter-spacing: .015em; }
    .section-header ha-icon { --mdc-icon-size: 17px; }
    .pool-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr)); gap: 10px; }
    .pool-card, .raid-card { background: var(--secondary-background-color, rgba(127,127,127,.08)); border-radius: calc(var(--sm-radius) - 2px); padding: 13px; min-width: 0; }
    .pool-card, .disk-row { cursor: pointer; }
    .pool-main { display: flex; flex-direction: column; gap: 10px; }
    .pool-heading, .raid-row { display: flex; align-items: center; gap: 10px; }
    .section-icon { color: var(--sm-muted); --mdc-icon-size: 22px; }
    .pool-title { min-width: 0; flex: 1; }
    .item-name { font-size: .9rem; font-weight: 600; line-height: 1.35; overflow-wrap: anywhere; }
    .item-subtitle { color: var(--sm-muted); font-size: .75rem; margin-top: 2px; }
    .usage-value { font-size: 1.05rem; font-weight: 650; font-variant-numeric: tabular-nums; }
    .progress { height: 7px; width: 100%; background: var(--divider-color, rgba(127,127,127,.16)); border-radius: 99px; overflow: hidden; }
    .progress__fill { height: 100%; border-radius: inherit; background: currentColor; transition: width .25s ease; }
    .progress.good { color: var(--sm-good); }
    .progress.warning { color: var(--sm-warning); }
    .progress.bad { color: var(--sm-bad); }
    .progress.neutral { color: var(--sm-muted); }
    .metrics { display: flex; flex-wrap: wrap; gap: 5px 14px; }
    .metric { display: inline-flex; gap: 4px; font-size: .75rem; min-width: 0; }
    .metric__label { color: var(--sm-muted); }
    .metric__value { font-weight: 500; font-variant-numeric: tabular-nums; }
    .inline-status { display: flex; align-items: center; gap: 5px; font-size: .75rem; }
    .status-icon { --mdc-icon-size: 16px; }
    .raid-card { display: flex; flex-direction: column; gap: 12px; }
    .raid-row { justify-content: space-between; }
    .raid-row > div:first-child { min-width: 0; }
    .raid-progress { display: flex; flex-direction: column; gap: 7px; }
    .raid-detail { font-size: .8rem; }
    .disk-list { display: flex; flex-direction: column; gap: 0; }
    .disk-row { display: flex; gap: 11px; padding: 12px 0; border-bottom: 1px solid var(--sm-line); min-width: 0; }
    .disk-row:first-child { padding-top: 2px; }
    .disk-row:last-child { border-bottom: none; padding-bottom: 0; }
    .disk-icon-wrap { width: 36px; height: 36px; flex: 0 0 36px; border-radius: 12px; background: var(--secondary-background-color, rgba(127,127,127,.08)); display: grid; place-items: center; color: var(--sm-muted); }
    .disk-icon { --mdc-icon-size: 20px; }
    .disk-content { min-width: 0; flex: 1; display: flex; flex-direction: column; gap: 7px; }
    .disk-heading { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
    .disk-name-wrap { min-width: 0; }
    .disk-metrics { display: flex; flex-wrap: wrap; align-items: center; gap: 5px 12px; font-size: .75rem; }
    .temperature, .power-on-hours { display: inline-flex; align-items: center; gap: 3px; font-weight: 500; font-variant-numeric: tabular-nums; }
    .temperature ha-icon, .power-on-hours ha-icon { --mdc-icon-size: 15px; }
    .power-on-hours { color: var(--sm-muted); }
    .disk-usage { font-weight: 600; font-variant-numeric: tabular-nums; }
    .empty { color: var(--sm-muted); font-size: .82rem; padding: 5px 0; }
    .compact .card-content { padding: 12px; gap: 13px; }
    @media (max-width: 420px) {
      .card-content { padding: 13px; gap: 15px; }
      .card-header { flex-direction: column; }
      .summary { justify-content: flex-start; }
      .pool-list { grid-template-columns: 1fr; }
    }
  `;
}
