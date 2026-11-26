import { createTranslator, DEFAULT_LANGUAGE, type Translator } from "./i18n";
import type { HassEntity, HomeAssistant, ResolvedValue } from "./types";

const UNKNOWN = new Set(["unknown", "unavailable", "none", ""]);

/** Optional localization context used by helpers that return display text. */
export interface TextContext {
  t?: Translator;
  locale?: string;
}

const defaultTranslator = createTranslator(DEFAULT_LANGUAGE);

export function getEntity(hass: HomeAssistant | undefined, entityId?: string): HassEntity | undefined {
  if (!hass || !entityId) return undefined;
  return hass.states[entityId];
}

export function numericState(hass: HomeAssistant | undefined, entityId?: string): number | null {
  const entity = getEntity(hass, entityId);
  if (!entity || UNKNOWN.has(entity.state.toLowerCase())) return null;
  const value = Number(entity.state);
  return Number.isFinite(value) ? value : null;
}

export function resolveValue(hass: HomeAssistant | undefined, entityId?: string, ctx: TextContext = {}): ResolvedValue {
  const t = ctx.t ?? defaultTranslator;
  const entity = getEntity(hass, entityId);
  if (!entity) return { raw: null, text: t("state.unconfigured"), unit: "", entityId };
  const state = entity.state;
  if (UNKNOWN.has(state.toLowerCase())) {
    return { raw: null, text: state.toLowerCase() === "unavailable" ? t("state.unavailable") : t("state.unknown"), unit: "", entityId, state };
  }
  const raw = Number(state);
  const unit = String(entity.attributes.unit_of_measurement ?? "");
  return {
    raw: Number.isFinite(raw) ? raw : null,
    text: Number.isFinite(raw) ? formatNumber(raw, 1, ctx.locale) : state,
    unit,
    entityId,
    state,
  };
}

export function formatNumber(value: number, maximumFractionDigits = 1, locale?: string): string {
  return new Intl.NumberFormat(locale, { maximumFractionDigits }).format(value);
}

export function formatValue(
  hass: HomeAssistant | undefined,
  entityId?: string,
  fallbackUnit = "",
  ctx: TextContext = {},
): string {
  const value = resolveValue(hass, entityId, ctx);
  if (value.raw === null) return value.text;
  return `${value.text}${value.unit || fallbackUnit ? ` ${value.unit || fallbackUnit}` : ""}`;
}

export function formatBytes(value: number, unit = "B", locale?: string): string {
  const normalized = unit.trim().toLowerCase();
  // Preserve the source unit system: SI (KB/MB/GB/TB) or IEC (KiB/MiB/GiB/TiB).
  const isBinary = normalized.endsWith("ib") || normalized === "b" || normalized === "byte" || normalized === "bytes";
  const base = isBinary ? 1024 : 1000;
  const factors: Record<string, number> = {
    b: 1, byte: 1, bytes: 1,
    kb: 1000, mb: 1000 ** 2, gb: 1000 ** 3, tb: 1000 ** 4, pb: 1000 ** 5,
    kib: 1024, mib: 1024 ** 2, gib: 1024 ** 3, tib: 1024 ** 4, pib: 1024 ** 5,
  };
  const bytes = value * (factors[normalized] ?? 1);
  if (!Number.isFinite(bytes)) return "—";
  const units = isBinary ? ["B", "KiB", "MiB", "GiB", "TiB", "PiB"] : ["B", "KB", "MB", "GB", "TB", "PB"];
  let amount = bytes;
  let index = 0;
  while (amount >= base && index < units.length - 1) {
    amount /= base;
    index++;
  }
  // Keep the display compact while retaining useful precision for small capacities.
  const digits = amount >= 100 ? 1 : amount >= 10 ? 2 : 2;
  return `${formatNumber(amount, digits, locale)} ${units[index]}`;
}

export function capacityText(hass: HomeAssistant | undefined, entityId?: string, ctx: TextContext = {}): string {
  const entity = getEntity(hass, entityId);
  if (!entity) return "—";
  const value = Number(entity.state);
  if (!Number.isFinite(value)) return resolveValue(hass, entityId, ctx).text;
  const unit = String(entity.attributes.unit_of_measurement ?? "").trim();
  const byteUnits = new Set(["b", "byte", "bytes", "kb", "mb", "gb", "tb", "pb", "kib", "mib", "gib", "tib", "pib"]);
  if (byteUnits.has(unit.toLowerCase())) return formatBytes(value, unit, ctx.locale);
  return `${formatNumber(value, 2, ctx.locale)}${unit ? ` ${unit}` : ""}`;
}

export function percent(hass: HomeAssistant | undefined, entityId?: string): number | null {
  const value = numericState(hass, entityId);
  if (value === null) return null;
  return Math.max(0, Math.min(100, value));
}

export function healthKind(value: string | undefined): "good" | "warning" | "bad" | "neutral" {
  const normalized = (value ?? "").toLowerCase();
  if (!normalized || UNKNOWN.has(normalized)) return "neutral";
  if (/(healthy|normal|ok|good|passed|online|optimal|clean|健康|已正常|正常|良好)/i.test(normalized)) return "good";
  if (/(warn|degrad|rebuild|repair|scrub|predict|注意|警告|降级|重建|修复)/i.test(normalized)) return "warning";
  if (/(failed|error|critical|fault|offline|bad|broken|异常|故障|失败|损坏)/i.test(normalized)) return "bad";
  return "neutral";
}

export function stateLabel(value: string | undefined, ctx: TextContext = {}): string {
  const t = ctx.t ?? defaultTranslator;
  if (!value || UNKNOWN.has(value.toLowerCase())) return t("state.unknown");
  const kind = healthKind(value);
  if (kind === "good") return t("state.healthy");
  if (kind === "warning") return t("state.warning");
  if (kind === "bad") return t("state.critical");
  return value;
}

export function iconForState(value: string | undefined): string {
  const kind = healthKind(value);
  if (kind === "good") return "mdi:check-circle";
  if (kind === "warning") return "mdi:alert";
  if (kind === "bad") return "mdi:alert-circle";
  return "mdi:help-circle";
}

export function friendlyName(hass: HomeAssistant | undefined, entityId?: string, fallback = ""): string {
  if (!entityId) return fallback;
  const entity = getEntity(hass, entityId);
  return String(entity?.attributes.friendly_name ?? fallback ?? entityId);
}

export function openMoreInfo(host: HTMLElement, entityId?: string): void {
  if (!entityId) return;
  host.dispatchEvent(new CustomEvent("hass-more-info", {
    bubbles: true,
    composed: true,
    detail: { entityId },
  }));
}
