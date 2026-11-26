import "./storage-monitor-card";
import "./storage-monitor-card-editor";

const CARD_VERSION = "0.2.0";

(window as typeof window & { customCards?: Array<Record<string, unknown>> }).customCards =
  (window as typeof window & { customCards?: Array<Record<string, unknown>> }).customCards || [];

(window as typeof window & { customCards: Array<Record<string, unknown>> }).customCards.push({
  type: "storage-monitor-card",
  name: "Storage Monitor Card",
  description: "Mushroom-inspired storage pool, RAID and disk health dashboard.",
  preview: true,
  documentationURL: "https://github.com/fissssssh/storage-monitor-card",
});

console.info(
  `%c STORAGE-MONITOR-CARD %c ${CARD_VERSION} `,
  "color: white; background: #16a34a; font-weight: 700;",
  "color: #16a34a; background: transparent; font-weight: 700;",
);
