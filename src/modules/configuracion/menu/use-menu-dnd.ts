"use client";

import { useCallback, useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragStartEvent,
  type DragEndEvent,
  type DragMoveEvent,
  type CollisionDetection,
} from "@dnd-kit/core";
import { toast } from "sonner";
import type { LucideIcon } from "lucide-react";

import {
  AVAILABLE_MAP,
  type FlatItem,
} from "./menu-utils";

interface ActiveDrag {
  id: string;
  label: string;
  icon: LucideIcon;
  isGroup: boolean;
}

interface DropIndicatorState {
  id: string;
  position: "before" | "after";
}

function createMenuCollisionDetection(hasItems: boolean): CollisionDetection {
  return (args) => {
    const collisions = closestCenter(args);
    if (hasItems) {
      const itemCollisions = collisions.filter((c) => c.id !== "canvas-root");
      if (itemCollisions.length > 0) return itemCollisions;
    }
    return collisions;
  };
}

interface UseMenuDndArgs {
  flat: FlatItem[];
  expandedGroups: Set<string>;
  setFlat: React.Dispatch<React.SetStateAction<FlatItem[]>>;
  setExpandedGroups: React.Dispatch<React.SetStateAction<Set<string>>>;
  setDirty: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useMenuDnd({
  flat,
  expandedGroups,
  setFlat,
  setExpandedGroups,
  setDirty,
}: UseMenuDndArgs) {
  const [activeDrag, setActiveDrag] = useState<ActiveDrag | null>(null);
  const [dropIndicator, setDropIndicator] = useState<DropIndicatorState | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  );

  const collisionDetection = useMemo(
    () => createMenuCollisionDetection(flat.length > 0),
    [flat.length],
  );

  const canvasIds = useMemo(
    () => new Set(flat.map((f) => `${f.type}:${f.key}`)),
    [flat],
  );

  const onDragStart = useCallback((e: DragStartEvent) => {
    const data = e.active.data.current;
    if (data?.source === "palette") {
      const avail = AVAILABLE_MAP.get(`${data.type}:${data.key}`);
      if (avail) {
        setActiveDrag({ id: e.active.id as string, label: avail.label, icon: avail.icon, isGroup: data.type === "group" });
      }
    } else if (data?.source === "canvas") {
      const item = flat.find((f) => f.id === data.itemId);
      if (item) {
        setActiveDrag({ id: e.active.id as string, label: item.label, icon: item.icon, isGroup: item.type === "group" });
      }
    }
  }, [flat]);

  const onDragMove = useCallback((e: DragMoveEvent) => {
    const { over } = e;
    if (!over || over.id === "canvas-root") {
      setDropIndicator(null);
      return;
    }
    const overId = over.id as string;
    const overRect = over.rect;
    const activatorEvent = e.activatorEvent as PointerEvent;
    const cursorY = activatorEvent.clientY + e.delta.y;
    const isUpperHalf = cursorY < overRect.top + overRect.height / 2;
    setDropIndicator({ id: overId, position: isUpperHalf ? "before" : "after" });
  }, []);

  const onDragCancel = useCallback(() => {
    setActiveDrag(null);
    setDropIndicator(null);
  }, []);

  const onDragEnd = useCallback((e: DragEndEvent) => {
    setActiveDrag(null);
    setDropIndicator(null);
    const { active, over } = e;
    if (!over) return;

    const activeData = active.data.current as
      | { source: string; type?: string; key?: string; itemId?: string }
      | undefined;
    const overId = over.id as string;

    if (activeData?.source === "palette" && activeData.type && activeData.key) {
      handlePaletteDrop({ type: activeData.type, key: activeData.key }, overId, over, e, canvasIds, expandedGroups, setFlat, setExpandedGroups, setDirty);
      return;
    }

    if (activeData?.source === "canvas" && activeData.itemId) {
      handleCanvasReorder({ itemId: activeData.itemId }, overId, over, e, expandedGroups, setFlat, setExpandedGroups, setDirty);
    }
  }, [canvasIds, expandedGroups, setFlat, setExpandedGroups, setDirty]);

  return {
    sensors,
    collisionDetection,
    activeDrag,
    dropIndicator,
    canvasIds,
    onDragStart,
    onDragMove,
    onDragEnd,
    onDragCancel,
  };
}

function handlePaletteDrop(
  activeData: { type: string; key: string },
  overId: string,
  over: { rect: { top: number; height: number } },
  e: DragEndEvent,
  canvasIds: Set<string>,
  expandedGroups: Set<string>,
  setFlat: React.Dispatch<React.SetStateAction<FlatItem[]>>,
  setExpandedGroups: React.Dispatch<React.SetStateAction<Set<string>>>,
  setDirty: React.Dispatch<React.SetStateAction<boolean>>,
) {
  const avail = AVAILABLE_MAP.get(`${activeData.type}:${activeData.key}`);
  if (!avail) return;
  const newItem: FlatItem = {
    id: `${activeData.type}:${activeData.key}`,
    type: activeData.type as "link" | "group",
    key: activeData.key,
    defaultLabel: avail.label,
    customLabel: undefined,
    label: avail.label,
    icon: avail.icon,
    depth: 0,
  };

  if (canvasIds.has(`${newItem.type}:${newItem.key}`)) {
    toast.error("Ese item ya esta en el menu");
    return;
  }

  const overRect = over.rect;
  const activatorEvent = e.activatorEvent as PointerEvent;
  const cursorY = activatorEvent.clientY + e.delta.y;
  const isUpperHalf = cursorY < overRect.top + overRect.height / 2;

  setFlat((prev) => {
    if (overId === "canvas-root" || prev.length === 0) return [...prev, newItem];
    const overIdx = prev.findIndex((f) => f.id === overId);
    if (overIdx === -1) return [...prev, newItem];
    const overItem = prev[overIdx];

    if (overItem.type === "group") {
      let hasChildren = false;
      for (let i = overIdx + 1; i < prev.length; i++) {
        if (prev[i].depth <= overItem.depth) break;
        hasChildren = true;
        break;
      }
      const isExpanded = expandedGroups.has(overItem.id);
      if (!hasChildren || !isExpanded) {
        if (newItem.type === "group" && overItem.depth >= 1) {
          toast.error("No se pueden anidar mas de 2 niveles de grupos");
          return prev;
        }
        const childDepth = overItem.depth + 1;
        let insertAfter = overIdx;
        for (let i = overIdx + 1; i < prev.length; i++) {
          if (prev[i].depth <= overItem.depth) break;
          insertAfter = i;
        }
        const next = [...prev];
        next.splice(insertAfter + 1, 0, { ...newItem, depth: childDepth });
        setExpandedGroups((exp) => new Set([...exp, overItem.id]));
        return next;
      }
      if (isUpperHalf) {
        const next = [...prev];
        next.splice(overIdx, 0, { ...newItem, depth: overItem.depth });
        return next;
      }
      let insertAfter = overIdx;
      for (let i = overIdx + 1; i < prev.length; i++) {
        if (prev[i].depth <= overItem.depth) break;
        insertAfter = i;
      }
      const next = [...prev];
      next.splice(insertAfter + 1, 0, { ...newItem, depth: overItem.depth });
      return next;
    }

    if (isUpperHalf) {
      const next = [...prev];
      next.splice(overIdx, 0, { ...newItem, depth: overItem.depth });
      return next;
    }
    const next = [...prev];
    next.splice(overIdx + 1, 0, { ...newItem, depth: overItem.depth });
    return next;
  });
  setDirty(true);
}

function handleCanvasReorder(
  activeData: { itemId: string },
  overId: string,
  over: { rect: { top: number; height: number } },
  e: DragEndEvent,
  expandedGroups: Set<string>,
  setFlat: React.Dispatch<React.SetStateAction<FlatItem[]>>,
  setExpandedGroups: React.Dispatch<React.SetStateAction<Set<string>>>,
  setDirty: React.Dispatch<React.SetStateAction<boolean>>,
) {
  const activeId = activeData.itemId;
  if (activeId === overId) return;

  const overRect = over.rect;
  const activatorEvent = e.activatorEvent as PointerEvent;
  const cursorY = activatorEvent.clientY + e.delta.y;
  const isUpperHalf = cursorY < overRect.top + overRect.height / 2;

  setFlat((prev) => {
    const oldIdx = prev.findIndex((f) => f.id === activeId);
    if (oldIdx === -1) return prev;
    const activeItem = prev[oldIdx];

    let blockEnd = oldIdx + 1;
    while (blockEnd < prev.length && prev[blockEnd].depth > activeItem.depth) {
      blockEnd++;
    }
    const movedBlock = prev.slice(oldIdx, blockEnd);
    const remaining = [...prev.slice(0, oldIdx), ...prev.slice(blockEnd)];

    if (overId === "canvas-root") {
      const adjustedBlock = movedBlock.map((item, i) => ({
        ...item,
        depth: i === 0 ? 0 : item.depth - activeItem.depth,
      }));
      return [...remaining, ...adjustedBlock];
    }

    const overIdx = remaining.findIndex((f) => f.id === overId);
    if (overIdx === -1) return prev;
    const overItem = remaining[overIdx];

    if (overItem.type === "group") {
      let hasChildren = false;
      for (let i = overIdx + 1; i < remaining.length; i++) {
        if (remaining[i].depth <= overItem.depth) break;
        hasChildren = true;
        break;
      }
      const isExpanded = expandedGroups.has(overItem.id);
      if (!hasChildren || !isExpanded) {
        if (activeItem.type === "group" && overItem.depth >= 1) {
          toast.error("No se pueden anidar mas de 2 niveles de grupos");
          return prev;
        }
        const childDepth = overItem.depth + 1;
        let insertAfter = overIdx;
        for (let i = overIdx + 1; i < remaining.length; i++) {
          if (remaining[i].depth <= overItem.depth) break;
          insertAfter = i;
        }
        const depthDiff = childDepth - activeItem.depth;
        const adjustedBlock = movedBlock.map((item, i) => ({
          ...item,
          depth: i === 0 ? childDepth : item.depth + depthDiff,
        }));
        const next = [...remaining];
        next.splice(insertAfter + 1, 0, ...adjustedBlock);
        setExpandedGroups((exp) => new Set([...exp, overItem.id]));
        return next;
      }
    }

    const targetDepth = overItem.depth;
    const depthDiff = targetDepth - activeItem.depth;
    const adjustedBlock = movedBlock.map((item, i) => ({
      ...item,
      depth: i === 0 ? targetDepth : item.depth + depthDiff,
    }));

    if (isUpperHalf) {
      const next = [...remaining];
      next.splice(overIdx, 0, ...adjustedBlock);
      return next;
    }
    const next = [...remaining];
    next.splice(overIdx + 1, 0, ...adjustedBlock);
    return next;
  });
  setDirty(true);
}

export { DndContext, DragOverlay };
