"use client";

import { useState, useMemo } from "react";
import { Plus, ChevronRight, ChevronDown, Loader2, Layers, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useArancelesTree } from "@/hooks/use-aranceles";
import { formatCurrency } from "@/utils/format";
import type { Arancel } from "@/types";

interface TreeNode extends Arancel {
  children: TreeNode[];
}

function buildTree(aranceles: Arancel[]): TreeNode[] {
  const map = new Map<string, TreeNode>();
  const roots: TreeNode[] = [];

  for (const a of aranceles) {
    map.set(a.id, { ...a, children: [] });
  }

  for (const a of aranceles) {
    const node = map.get(a.id);
    if (!node) continue;
    if (a.parent_id) {
      const parent = map.get(a.parent_id);
      if (parent) {
        parent.children.push(node);
      } else {
        roots.push(node);
      }
    } else {
      roots.push(node);
    }
  }

  return roots;
}

function TreeRow({ node, depth }: { node: TreeNode; depth: number }) {
  const [expanded, setExpanded] = useState(depth < 2);
  const hasChildren = node.children.length > 0;

  return (
    <>
      <div
        className={cn(
          "flex items-center gap-2 border-b py-2.5 pr-3",
          depth > 0 && "bg-muted/30"
        )}
        style={{ paddingLeft: `${depth * 24 + 12}px` }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="text-muted-foreground hover:text-foreground"
          >
            {expanded ? (
              <ChevronDown className="size-4" />
            ) : (
              <ChevronRight className="size-4" />
            )}
          </button>
        ) : (
          <span className="w-4" />
        )}
        <span className="text-muted-foreground w-20 font-mono text-xs">
          {node.code}
        </span>
        <span className="flex-1 font-medium">{node.name}</span>
        {node.level === 3 && node.amount > 0 && (
          <span className="text-muted-foreground text-sm">
            {formatCurrency(node.amount)}
          </span>
        )}
        <Badge variant="outline" className="text-xs">
          N{node.level}
        </Badge>
        <Button variant="ghost" size="icon" className="size-7">
          <Pencil className="size-3.5" />
        </Button>
      </div>
      {expanded &&
        node.children.map((child) => (
          <TreeRow key={child.id} node={child} depth={depth + 1} />
        ))}
    </>
  );
}

export function ArancelesPage() {
  const { data: aranceles, isLoading } = useArancelesTree();
  const tree = useMemo(() => buildTree(aranceles ?? []), [aranceles]);

  return (
    <div className="app-page">
      <div className="flex items-center justify-between">
        <div className="app-page-header">
          <h1 className="app-page-title">Aranceles</h1>
          <p className="app-page-lead">
            Arancel de prestaciones de salud (jerarquia 3 niveles)
          </p>
        </div>
        <Button>
          <Plus className="mr-2 size-4" />
          Nuevo arancel
        </Button>
      </div>

      <div className="rounded-lg border">
        <div className="bg-muted/50 flex items-center gap-2 border-b px-3 py-2 text-xs font-medium text-muted-foreground">
          <span className="w-4" />
          <span className="w-20">Codigo</span>
          <span className="flex-1">Nombre</span>
          <span className="w-24 text-right">Monto</span>
          <span className="w-12">Nivel</span>
          <span className="w-9" />
        </div>

        {isLoading && (
          <div className="text-muted-foreground py-12 text-center">
            <Loader2 className="mx-auto size-5 animate-spin" />
          </div>
        )}

        {!isLoading && tree.length === 0 && (
          <div className="text-muted-foreground py-12 text-center">
            <div className="flex flex-col items-center gap-2">
              <Layers className="size-8 opacity-40" />
              <p>No hay aranceles registrados</p>
            </div>
          </div>
        )}

        {!isLoading && tree.map((node) => <TreeRow key={node.id} node={node} depth={0} />)}
      </div>
    </div>
  );
}
