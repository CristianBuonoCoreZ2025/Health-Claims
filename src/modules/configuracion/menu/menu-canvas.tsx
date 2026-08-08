"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

import { cn } from "@/lib/utils";
import type { FlatItem } from "./menu-utils";
import { SortableMenuNode } from "./menu-item-row";

interface DropIndicatorState {
  id: string;
  position: "before" | "after";
}

interface MenuCanvasProps {
  flat: FlatItem[];
  expandedGroups: Set<string>;
  dropIndicator: DropIndicatorState | null;
  onToggleGroup: (id: string) => void;
  onRemove: (id: string) => void;
  onRename: (id: string, customLabel: string) => void;
}

export function MenuCanvas({
  flat,
  expandedGroups,
  dropIndicator,
  onToggleGroup,
  onRemove,
  onRename,
}: MenuCanvasProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: "canvas-root",
    data: { source: "canvas-root" },
  });

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h3 className="text-sm font-semibold mb-1">Estructura del menu</h3>
        <p className="text-xs text-muted-foreground">
          Arrastra para reordenar. Click en un grupo para expandirlo.
        </p>
      </div>
      <div
        ref={setNodeRef}
        className={cn(
          "flex flex-col gap-1 min-h-75 rounded-xl border-2 border-dashed p-3 transition-colors",
          isOver ? "border-primary/50 bg-primary/5" : "border-border",
        )}
      >
        {flat.length === 0 ? (
          <div className="flex items-center justify-center h-70 text-sm text-muted-foreground">
            Arrastra items aqui para construir el menu
          </div>
        ) : (
          <SortableContext items={flat.map((f) => f.id)} strategy={verticalListSortingStrategy}>
            {flat.map((item) => (
              <SortableMenuNode
                key={item.id}
                item={item}
                isExpanded={expandedGroups.has(item.id)}
                onToggleGroup={() => onToggleGroup(item.id)}
                onRemove={() => onRemove(item.id)}
                onRename={(customLabel) => onRename(item.id, customLabel)}
                isDropTarget={dropIndicator?.id === item.id}
                dropIndicator={
                  dropIndicator?.id === item.id ? dropIndicator.position : null
                }
              />
            ))}
          </SortableContext>
        )}
      </div>
    </div>
  );
}
