"use client";

import { useSyncExternalStore } from "react";
import {
  UI_STYLE_LABELS,
  UI_STYLE_SWATCHES,
  getUiStyleSnapshot,
  getUiStyleServerSnapshot,
  subscribeUiStyle,
  persistUiStyleChoice,
  type UiStyleSkin,
} from "@/lib/ui-style-client-store";

const SKINS: UiStyleSkin[] = [
  "nordic-air",
  "pastel-dream",
  "bubble-play",
  "kinetic-pop",
  "neo-playful",
];

export function TemasPage() {
  const currentSkin = useSyncExternalStore(
    subscribeUiStyle,
    getUiStyleSnapshot,
    getUiStyleServerSnapshot,
  );

  const handleSelect = (skin: UiStyleSkin) => {
    persistUiStyleChoice(skin);
  };

  return (
    <div className="app-page p-6">
      <div className="app-page-header">
        <h1 className="app-page-title">Temas</h1>
        <p className="app-page-lead">Selecciona la piel visual de la interfaz</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6">
        {SKINS.map((skin) => {
          const isActive = currentSkin === skin;
          const swatch = UI_STYLE_SWATCHES[skin];
          const label = UI_STYLE_LABELS[skin];
          return (
            <button
              key={skin}
              type="button"
              onClick={() => handleSelect(skin)}
              className={`app-card text-left transition-all ${isActive ? "ring-2 ring-primary" : "hover:scale-[1.02]"}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="h-10 w-10 rounded-full border-2 border-border"
                  style={{ backgroundColor: swatch }}
                />
                <span className="app-card-title">{label}</span>
                {isActive && (
                  <span className="ml-auto text-xs font-medium text-primary">
                    Activo
                  </span>
                )}
              </div>
              <div
                className="h-20 rounded-lg border border-border overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${swatch}40, ${swatch}10)` }}
              >
                <div className="flex items-center justify-center h-full">
                  <div
                    className="h-8 w-8 rounded-md"
                    style={{ backgroundColor: swatch }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
