"use client";

const UI_STYLE_KEY = "healthclaims-ui-style";

export type UiStyleSkin =
  | "liquid-glass-26"
  | "vibrancy-operations"
  | "sequoia";

export const UI_STYLE_LABELS: Record<UiStyleSkin, string> = {
  "liquid-glass-26": "Liquid Glass 26",
  "vibrancy-operations": "Vibrancy Operations",
  sequoia: "Sequoia",
};

export const UI_STYLE_SWATCHES: Record<UiStyleSkin, string> = {
  "liquid-glass-26": "#06b6d4",
  "vibrancy-operations": "#0ea5e9",
  sequoia: "#0a84ff",
};

export function getUiStyleSnapshot(): UiStyleSkin {
  if (typeof window === "undefined") return "liquid-glass-26";
  try {
    const stored = localStorage.getItem(UI_STYLE_KEY) as UiStyleSkin | null;
    if (stored && UI_STYLE_LABELS[stored]) return stored;
  } catch {
    return "liquid-glass-26";
  }
  return "liquid-glass-26";
}

export function getUiStyleServerSnapshot(): UiStyleSkin {
  return "liquid-glass-26";
}

export function subscribeUiStyle(callback: () => void): () => void {
  const handler = (e: StorageEvent) => {
    if (e.key === UI_STYLE_KEY) callback();
  };
  window.addEventListener("storage", handler);
  const customHandler = () => callback();
  window.addEventListener("ui-style-change", customHandler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("ui-style-change", customHandler);
  };
}

export function persistUiStyleChoice(skin: UiStyleSkin) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(UI_STYLE_KEY, skin);
    window.dispatchEvent(new Event("ui-style-change"));
  } catch {
    return;
  }
}
