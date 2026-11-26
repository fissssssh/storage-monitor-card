import type { HomeAssistant } from "./types";

/**
 * Languages shipped with the card. English is the default so the card renders
 * the same way regardless of the Home Assistant UI language.
 */
export type LanguageCode = "en" | "zh-Hans";

export const DEFAULT_LANGUAGE: LanguageCode = "en";

const en = {
  "card.title": "Storage",
  "card.configurePrompt": "Storage Monitor Card is not configured yet.",
  "state.unconfigured": "Not configured",
  "state.unavailable": "Unavailable",
  "state.unknown": "Unknown",
  "state.healthy": "Healthy",
  "state.warning": "Warning",
  "state.critical": "Fault",
  "summary.healthy": "All healthy",
  "summary.warning": "Needs attention",
  "summary.critical": "Issues detected",
  "summary.unknown": "Status unknown",
  "summary.maxTemperature": "Max {value} °C",
  "section.pools": "Storage pools",
  "section.raid": "RAID",
  "section.disks": "Physical disks",
  "pools.empty": "No storage pools configured",
  "pool.defaultName": "Pool {index}",
  "raid.defaultName": "Array status",
  "raid.defaultInfo": "Array information",
  "raid.level": "Level {level}",
  "raid.state": "Array state",
  "raid.progress": "Rebuild / sync progress",
  "disks.empty": "No disks configured",
  "disk.defaultName": "Disk {index}",
  "metric.used": "Used",
  "metric.free": "Free",
  "metric.total": "Total",
  "metric.capacity": "Capacity",
  "disk.powerOnHours": "Power-on",
  "disk.hours": "{value} h",
  "error.configObject": "Storage Monitor Card: the configuration must be an object.",
  "error.poolsArray": "Storage Monitor Card: pools must be an array.",
  "error.disksArray": "Storage Monitor Card: disks must be an array.",
  "editor.intro": "Storage Monitor Card configuration editor. Entity IDs are listed under Developer tools → States.",
  "editor.title": "Card title",
  "editor.subtitle": "Subtitle",
  "editor.language": "Language",
  "editor.languageAuto": "Follow Home Assistant",
  "editor.languageEnglish": "English",
  "editor.languageChinese": "简体中文",
  "editor.showPools": "Show storage pools",
  "editor.showRaid": "Show RAID",
  "editor.showDisks": "Show physical disks",
  "editor.showTemperature": "Show temperatures",
  "editor.showHealth": "Show health status",
  "editor.poolsJson": "Storage pools (JSON array)",
  "editor.disksJson": "Disks (JSON array)",
  "editor.raidJson": "RAID (JSON object)",
  "editor.jsonTypeError": "Unexpected JSON type",
  "editor.jsonFormatError": "Invalid JSON",
  "editor.jsonError": "JSON error: {error}. The card updates automatically once the JSON is valid.",
  "editor.hint": "Only valid JSON is applied to the card. You can also edit the dashboard YAML directly.",
} as const;

export type TranslationKey = keyof typeof en;

const zhHans: Record<TranslationKey, string> = {
  "card.title": "存储空间",
  "card.configurePrompt": "请先配置 Storage Monitor Card。",
  "state.unconfigured": "未配置",
  "state.unavailable": "不可用",
  "state.unknown": "未知",
  "state.healthy": "正常",
  "state.warning": "警告",
  "state.critical": "异常",
  "summary.healthy": "运行正常",
  "summary.warning": "需要关注",
  "summary.critical": "存在异常",
  "summary.unknown": "状态未知",
  "summary.maxTemperature": "最高 {value} °C",
  "section.pools": "存储池",
  "section.raid": "RAID / 阵列",
  "section.disks": "物理硬盘",
  "pools.empty": "尚未配置存储池",
  "pool.defaultName": "存储池 {index}",
  "raid.defaultName": "阵列状态",
  "raid.defaultInfo": "阵列信息",
  "raid.level": "级别 {level}",
  "raid.state": "阵列状态",
  "raid.progress": "重建 / 同步进度",
  "disks.empty": "尚未配置硬盘",
  "disk.defaultName": "硬盘 {index}",
  "metric.used": "已用",
  "metric.free": "剩余",
  "metric.total": "总量",
  "metric.capacity": "容量",
  "disk.powerOnHours": "通电时长",
  "disk.hours": "{value} 小时",
  "error.configObject": "Storage Monitor Card: 配置必须是对象。",
  "error.poolsArray": "Storage Monitor Card: pools 必须是数组。",
  "error.disksArray": "Storage Monitor Card: disks 必须是数组。",
  "editor.intro": "Storage Monitor Card 配置编辑器。实体 ID 可在「开发者工具 → 状态」中查找。",
  "editor.title": "卡片标题",
  "editor.subtitle": "副标题",
  "editor.language": "语言",
  "editor.languageAuto": "跟随 Home Assistant",
  "editor.languageEnglish": "English",
  "editor.languageChinese": "简体中文",
  "editor.showPools": "显示存储池",
  "editor.showRaid": "显示 RAID",
  "editor.showDisks": "显示物理硬盘",
  "editor.showTemperature": "显示温度",
  "editor.showHealth": "显示健康状态",
  "editor.poolsJson": "存储池配置（JSON 数组）",
  "editor.disksJson": "硬盘配置（JSON 数组）",
  "editor.raidJson": "RAID 配置（JSON 对象）",
  "editor.jsonTypeError": "JSON 类型不正确",
  "editor.jsonFormatError": "JSON 格式错误",
  "editor.jsonError": "JSON 错误：{error}。修正后会自动保存。",
  "editor.hint": "提示：编辑 JSON 时，只有合法 JSON 才会同步到卡片配置。也可以直接在仪表盘 YAML 编辑器中配置。",
};

type TranslationTable = Record<TranslationKey, string>;

export const TRANSLATIONS: Record<LanguageCode, TranslationTable> = {
  en,
  "zh-Hans": zhHans,
};

export type TranslationVars = Record<string, string | number>;
export type Translator = (key: TranslationKey, vars?: TranslationVars) => string;

function interpolate(template: string, vars?: TranslationVars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : match,
  );
}

/**
 * Maps a BCP 47 language tag (as reported by Home Assistant) to a shipped
 * language. Any Chinese variant falls back to Simplified Chinese, everything
 * else falls back to English.
 */
export function normalizeLanguage(tag?: string | null): LanguageCode | undefined {
  if (typeof tag !== "string") return undefined;
  const normalized = tag.trim().replace(/_/g, "-").toLowerCase();
  if (!normalized) return undefined;
  return normalized === "zh" || normalized.startsWith("zh-") ? "zh-Hans" : "en";
}

export function languageFromHass(hass?: HomeAssistant): string | undefined {
  return hass?.language ?? hass?.locale?.language;
}

/**
 * Resolves the display language. Without an explicit `language` option (or with
 * `language: auto`) the card follows the Home Assistant UI language and falls
 * back to English when that language is not shipped.
 */
export function resolveLanguage(configured?: string, hassLanguage?: string): LanguageCode {
  const requested = typeof configured === "string" ? configured.trim() : "";
  if (!requested || requested.toLowerCase() === "auto") {
    return normalizeLanguage(hassLanguage) ?? DEFAULT_LANGUAGE;
  }
  return normalizeLanguage(requested) ?? DEFAULT_LANGUAGE;
}

export function createTranslator(language: LanguageCode | string = DEFAULT_LANGUAGE): Translator {
  const code = normalizeLanguage(language) ?? DEFAULT_LANGUAGE;
  const table = TRANSLATIONS[code] ?? TRANSLATIONS[DEFAULT_LANGUAGE];
  return (key, vars) => interpolate(table[key] ?? TRANSLATIONS[DEFAULT_LANGUAGE][key] ?? key, vars);
}
