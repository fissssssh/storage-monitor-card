export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  last_changed?: string;
  last_updated?: string;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  themes?: { darkMode?: boolean; themes?: Record<string, unknown> };
  language?: string;
  locale?: { language?: string };
  formatEntityState?: (stateObj: HassEntity) => string;
  callService?: (domain: string, service: string, data?: Record<string, unknown>) => Promise<unknown>;
}

export interface PoolConfig {
  name: string;
  total?: string;
  used?: string;
  free?: string;
  usage?: string;
  raid?: string;
  raidProgress?: string;
  health?: string;
  icon?: string;
}

export interface DiskConfig {
  name: string;
  capacity?: string;
  used?: string;
  free?: string;
  usage?: string;
  temperature?: string;
  powerOnHours?: string;
  health?: string;
  model?: string;
  serial?: string;
  icon?: string;
}

export interface RaidConfig {
  name?: string;
  level?: string;
  state?: string;
  progress?: string;
  health?: string;
  icon?: string;
}

export type CardLanguage = "auto" | "en" | "zh-Hans" | "zh";

export interface StorageMonitorConfig {
  type: string;
  title?: string;
  subtitle?: string;
  language?: CardLanguage;
  pools?: PoolConfig[];
  disks?: DiskConfig[];
  raid?: RaidConfig;
  showPools?: boolean;
  showDisks?: boolean;
  showRaid?: boolean;
  showTemperature?: boolean;
  showHealth?: boolean;
  showEmptySections?: boolean;
  compact?: boolean;
  warningThreshold?: number;
  criticalThreshold?: number;
  temperatureWarning?: number;
  temperatureCritical?: number;
  entityTapAction?: "more-info" | "none";
}

export interface ResolvedValue {
  raw: number | null;
  text: string;
  unit: string;
  entityId?: string;
  state?: string;
}
