"use client";

import { useEffect, useRef, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import {
  ChevronDown,
  ChevronRight,
  CornerDownRight,
  GripVertical,
  Pencil,
  Check,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { FlatItem } from "./menu-utils";

interface SortableMenuNodeProps {
  item: FlatItem;
  isExpanded: boolean;
  onToggleGroup: () => void;
  onRemove: () => void;
  onRename: (customLabel: string) => void;
  isDropTarget: boolean;
  dropIndicator: "before" | "after" | null;
}

export function SortableMenuNode({
  item,
  isExpanded,
  onToggleGroup,
  onRemove,
  onRename,
  isDropTarget,
  dropIndicator,
}: SortableMenuNodeProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useSortable({
    id: item.id,
    data: { source: "canvas", itemId: item.id },
  });

  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(item.label);
  const inputRef = useRef<HTMLInputElement>(null);
  const [prevLabel, setPrevLabel] = useState(item.label);
  if (item.label !== prevLabel) {
    setPrevLabel(item.label);
    setEditValue(item.label);
  }

  const isGroup = item.type === "group";
  const Icon = item.icon;

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const startEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditValue(item.customLabel || item.defaultLabel);
    setEditing(true);
  };

  const commitEdit = () => {
    setEditing(false);
    onRename(editValue);
  };

  const cancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditing(false);
    setEditValue(item.label);
  };

  return (
    <div
      ref={setNodeRef}
      style={{ opacity: isDragging ? 0.3 : 1 }}
      className={cn(
        "group relative flex items-center gap-2 rounded-lg px-2 py-1.5 border transition-all duration-150",
        isGroup ? "bg-violet-500/10 border-violet-500/25" : "bg-sky-500/10 border-sky-500/20",
        editing ? "cursor-default" : "hover:scale-[1.01]",
        isDropTarget && "ring-2 ring-violet-500/60 scale-[1.02]",
      )}
      onClick={isGroup && !editing ? onToggleGroup : undefined}
    >
      {item.depth === 1 && (
        <CornerDownRight className="h-3 w-3 text-muted-foreground/40 shrink-0" />
      )}
      {item.depth === 2 && (
        <CornerDownRight className="h-3 w-3 text-muted-foreground/30 shrink-0 ml-3" />
      )}

      <button
        type="button"
        className="cursor-grab active:cursor-grabbing touch-none text-muted-foreground hover:text-foreground"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <Icon className={cn("h-4 w-4 shrink-0", isGroup ? "text-violet-500" : "text-sky-500")} />

      {editing ? (
        <input
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitEdit();
            if (e.key === "Escape") {
              setEditing(false);
              setEditValue(item.label);
            }
          }}
          className="flex-1 bg-transparent border-b border-primary outline-none text-sm px-1"
        />
      ) : (
        <span className="flex-1 text-sm truncate">{item.label}</span>
      )}

      {isGroup && !editing && (
        isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />
      )}

      {editing ? (
        <div className="flex items-center gap-1">
          <button type="button" onClick={commitEdit} className="text-green-500 hover:text-green-400 p-1">
            <Check className="h-3.5 w-3.5" />
          </button>
          <button type="button" onClick={cancelEdit} className="text-muted-foreground hover:text-foreground p-1">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button type="button" onClick={startEdit} className="text-muted-foreground hover:text-foreground p-1">
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button type="button" onClick={(e) => { e.stopPropagation(); onRemove(); }} className="text-muted-foreground hover:text-destructive p-1">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {dropIndicator === "before" && (
        <div className="absolute -top-0.5 left-0 right-0 h-0.5 bg-violet-500 rounded-full" />
      )}
      {dropIndicator === "after" && (
        <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-violet-500 rounded-full" />
      )}
    </div>
  );
}
