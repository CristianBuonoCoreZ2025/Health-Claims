"use client";

import { useDraggable } from "@dnd-kit/core";
import { GripVertical } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  ALL_AVAILABLE,
  PALETTE_CATEGORIES,
  type AvailableItem,
} from "./menu-utils";

interface PaletteItemProps {
  item: AvailableItem;
}

function PaletteItem({ item }: PaletteItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette:${item.type}:${item.key}`,
    data: { source: "palette", type: item.type, key: item.key },
  });

  const Icon = item.icon;

  return (
    <button
      ref={setNodeRef}
      type="button"
      {...attributes}
      {...listeners}
      className={cn(
        "flex items-center gap-2 w-full rounded-lg px-2 py-1.5 border text-left transition-all touch-none",
        "bg-card border-border hover:border-primary/40 hover:bg-accent/50",
        isDragging && "opacity-30",
      )}
    >
      <GripVertical className="h-3.5 w-3.5 text-muted-foreground shrink-0 cursor-grab" />
      <Icon className={cn("h-4 w-4 shrink-0", item.type === "group" ? "text-emerald-500" : "text-teal-500")} />
      <span className="text-xs truncate">{item.label}</span>
    </button>
  );
}

interface MenuPaletteProps {
  canvasIds: Set<string>;
}

export function MenuPalette({ canvasIds }: MenuPaletteProps) {
  const paletteByCategory = new Map<string, AvailableItem[]>();
  for (const cat of PALETTE_CATEGORIES) paletteByCategory.set(cat, []);
  for (const item of ALL_AVAILABLE) {
    const inCanvas = canvasIds.has(`${item.type}:${item.key}`);
    if (!inCanvas) {
      paletteByCategory.get(item.category)?.push(item);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-semibold mb-1">Paleta de items</h3>
        <p className="text-xs text-muted-foreground">
          Arrastra los items al canvas para agregarlos al menu.
        </p>
      </div>
      {PALETTE_CATEGORIES.map((cat) => {
        const items = paletteByCategory.get(cat) ?? [];
        if (items.length === 0) return null;
        return (
          <div key={cat} className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {cat}
            </span>
            <div className="flex flex-col gap-1">
              {items.map((item) => (
                <PaletteItem key={`${item.type}:${item.key}`} item={item} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
