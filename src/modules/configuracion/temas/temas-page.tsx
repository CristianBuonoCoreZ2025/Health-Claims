"use client";

import { useSyncExternalStore } from "react";
import { Check } from "lucide-react";

import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
  "liquid-glass-26",
  "vibrancy-operations",
  "sequoia",
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
      <PageHeader
        title="Temas"
        lead="Selecciona la piel visual de la interfaz"
      />

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
              className="text-left"
            >
              <Card
                className={`h-full transition-all ${
                  isActive
                    ? "ring-2 ring-primary"
                    : "hover:scale-[1.02]"
                }`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-full border-2 border-border"
                      style={{ backgroundColor: swatch }}
                    />
                    <CardTitle className="text-base">{label}</CardTitle>
                    {isActive && (
                      <Badge className="ml-auto" variant="default">
                        <Check className="mr-1 size-3" />
                        Activo
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div
                    className="h-24 rounded-lg border border-border overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${swatch}40, ${swatch}10)`,
                    }}
                  >
                    <div className="flex h-full items-center justify-center gap-2">
                      <div
                        className="h-8 w-12 rounded-md"
                        style={{ backgroundColor: swatch }}
                      />
                      <div
                        className="h-6 w-16 rounded-md opacity-60"
                        style={{ backgroundColor: swatch }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </button>
          );
        })}
      </div>
    </div>
  );
}
