"use client";

import { useCallback, useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Save, RotateCcw } from "lucide-react";

import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { getNavMenuConfig, saveNavMenuConfig, type NavMenuItem } from "@/services/nav-menu-config";
import { configToFlat, flatToConfig, type FlatItem } from "./menu-utils";
import { MenuPalette } from "./menu-palette";
import { MenuCanvas } from "./menu-canvas";
import { useMenuDnd, DndContext, DragOverlay } from "./use-menu-dnd";

function computeExpanded(flat: FlatItem[]): Set<string> {
  const expanded = new Set<string>();
  for (let i = 0; i < flat.length; i++) {
    if (flat[i].type === "group") {
      const hasChildren = i + 1 < flat.length && flat[i + 1].depth > flat[i].depth;
      if (hasChildren) expanded.add(flat[i].id);
    }
  }
  return expanded;
}

export function MenuPage() {
  const queryClient = useQueryClient();
  const { data: menuConfig } = useQuery({
    queryKey: ["nav-menu-config"],
    queryFn: getNavMenuConfig,
    staleTime: 60_000,
    retry: false,
  });

  const [flat, setFlat] = useState<FlatItem[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [dirty, setDirty] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized || menuConfig === undefined) return;
    const newFlat = configToFlat(menuConfig?.items ?? null);
    setFlat(newFlat);
    setExpandedGroups(computeExpanded(newFlat));
    setDirty(false);
    setInitialized(true);
  }, [menuConfig, initialized]);

  const saveMut = useMutation({
    mutationFn: (items: NavMenuItem[]) => saveNavMenuConfig({ items }),
    onSuccess: () => {
      toast.success("Menu guardado");
      queryClient.invalidateQueries({ queryKey: ["nav-menu-config"] });
      setDirty(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const {
    sensors,
    collisionDetection,
    activeDrag,
    dropIndicator,
    canvasIds,
    onDragStart,
    onDragMove,
    onDragEnd,
    onDragCancel,
  } = useMenuDnd({ flat, expandedGroups, setFlat, setExpandedGroups, setDirty });

  const toggleGroup = useCallback((id: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setFlat((prev) => {
      const idx = prev.findIndex((f) => f.id === id);
      if (idx === -1) return prev;
      const item = prev[idx];
      let end = idx + 1;
      while (end < prev.length && prev[end].depth > item.depth) end++;
      return [...prev.slice(0, idx), ...prev.slice(end)];
    });
    setDirty(true);
  }, []);

  const renameItem = useCallback((id: string, customLabel: string) => {
    setFlat((prev) =>
      prev.map((f) =>
        f.id === id
          ? {
              ...f,
              customLabel: customLabel.trim() || undefined,
              label: customLabel.trim() || f.defaultLabel,
            }
          : f,
      ),
    );
    setDirty(true);
  }, []);

  const handleSave = () => {
    saveMut.mutate(flatToConfig(flat));
  };

  const handleReset = () => {
    const newFlat = configToFlat(null);
    setFlat(newFlat);
    setExpandedGroups(computeExpanded(newFlat));
    setDirty(true);
    toast.info("Estructura reseteada al orden por defecto");
  };

  return (
    <div className="app-page p-6">
      <div className="flex items-start justify-between">
        <PageHeader
          title="Configuracion del menu"
          lead="Ordena y personaliza los items del menu lateral"
        />
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
          >
            <RotateCcw className="mr-2 size-4" />
            Reset
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={!dirty || saveMut.isPending}
          >
            <Save className="mr-2 size-4" />
            Guardar
          </Button>
        </div>
      </div>

      {!initialized ? (
        <div className="flex h-44 items-center justify-center">
          <div className="text-muted-foreground text-sm">Cargando menu...</div>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={collisionDetection}
          onDragStart={onDragStart}
          onDragMove={onDragMove}
          onDragEnd={onDragEnd}
          onDragCancel={onDragCancel}
        >
          <div className="grid gap-6 lg:grid-cols-[280px_1fr] mt-6">
            <div className="app-card p-4">
              <MenuPalette canvasIds={canvasIds} />
            </div>
            <div className="app-card p-4">
              <MenuCanvas
                flat={flat}
                expandedGroups={expandedGroups}
                dropIndicator={dropIndicator}
                onToggleGroup={toggleGroup}
                onRemove={removeItem}
                onRename={renameItem}
              />
            </div>
          </div>

          <DragOverlay>
            {activeDrag ? (
              <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 border bg-card shadow-lg">
                <activeDrag.icon className="h-4 w-4" />
                <span className="text-sm">{activeDrag.label}</span>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
}
