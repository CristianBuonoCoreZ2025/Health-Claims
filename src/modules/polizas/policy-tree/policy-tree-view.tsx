"use client";

import { useMemo, useState } from "react";
import { ChevronRight, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PolicyTreeNode } from "@/types";
import { TreeConditionList } from "./tree-condition-list";
import { TreeNodeForm } from "./tree-node-form";

const LEVEL_LABELS: Record<number, string> = {
  10: "Poliza",
  20: "Plan",
  30: "Tipo Cobertura",
  40: "Cobertura",
  50: "Agrupacion",
  60: "Sub-agrupacion",
  70: "Prestacion",
};

interface PolicyTreeViewProps {
  policyId: string;
  nodes: PolicyTreeNode[];
}

interface TreeNodeItem {
  node: PolicyTreeNode;
  children: TreeNodeItem[];
  depth: number;
}

function buildTree(nodes: PolicyTreeNode[]): TreeNodeItem[] {
  const map = new Map<string, TreeNodeItem>();
  const roots: TreeNodeItem[] = [];
  const sorted = [...nodes].sort(
    (a, b) => a.level_code - b.level_code || a.sort_order - b.sort_order
  );
  for (const node of sorted) {
    map.set(node.id, { node, children: [], depth: 0 });
  }
  for (const node of sorted) {
    const item = map.get(node.id);
    if (!item) continue;
    if (node.parent_id && map.has(node.parent_id)) {
      const parent = map.get(node.parent_id);
      if (parent) {
        item.depth = parent.depth + 1;
        parent.children.push(item);
      }
    } else {
      roots.push(item);
    }
  }
  return roots;
}

function levelLabel(code: number): string {
  return LEVEL_LABELS[code] ?? `Nivel ${code}`;
}

export function PolicyTreeView({ policyId, nodes }: PolicyTreeViewProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [showNodeForm, setShowNodeForm] = useState(false);
  const [editingNode, setEditingNode] = useState<PolicyTreeNode | null>(null);
  const [parentForNew, setParentForNew] = useState<PolicyTreeNode | null>(null);

  const tree = useMemo(() => buildTree(nodes), [nodes]);
  const selectedNode = nodes.find((n) => n.id === selectedNodeId) ?? null;

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAddRoot = () => {
    setEditingNode(null);
    setParentForNew(null);
    setShowNodeForm(true);
  };

  const handleAddChild = (parent: PolicyTreeNode) => {
    setEditingNode(null);
    setParentForNew(parent);
    setShowNodeForm(true);
  };

  const handleEdit = (node: PolicyTreeNode) => {
    setEditingNode(node);
    setParentForNew(null);
    setShowNodeForm(true);
  };

  const renderNode = (item: TreeNodeItem): React.ReactNode => {
    const { node, children, depth } = item;
    const hasChildren = children.length > 0;
    const isExpanded = expanded.has(node.id);
    const isSelected = selectedNodeId === node.id;
    return (
      <div key={node.id}>
        <div
          className={cn(
            "flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-accent cursor-pointer",
            isSelected && "bg-accent"
          )}
          style={{ paddingLeft: `${depth * 20 + 8}px` }}
          onClick={() => setSelectedNodeId(node.id)}
        >
          {hasChildren ? (
            <button
              type="button"
              className="flex size-5 items-center justify-center rounded hover:bg-muted"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(node.id);
              }}
            >
              <ChevronRight
                className={cn("size-4 transition-transform", isExpanded && "rotate-90")}
              />
            </button>
          ) : (
            <span className="size-5" />
          )}
          <Badge variant="outline" className="shrink-0 text-xs">
            {node.level_code}
          </Badge>
          <span className="text-sm font-medium">{node.name}</span>
          <span className="text-muted-foreground text-xs">{levelLabel(node.level_code)}</span>
          <div className="ml-auto flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleAddChild(node);
              }}
            >
              <Plus className="size-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(node);
              }}
            >
              Editar
            </Button>
          </div>
        </div>
        {hasChildren && isExpanded && children.map((c) => renderNode(c))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="app-card-title">Arbol de coberturas</h3>
        <Button type="button" variant="outline" className="pg-btn-platinum" onClick={handleAddRoot}>
          <Plus className="mr-1 size-4" />
          Agregar
        </Button>
      </div>

      <div className="app-card min-h-50">
        {nodes.length === 0 ? (
          <p className="text-muted-foreground p-6 text-center text-sm">
            No hay nodos configurados para esta poliza.
          </p>
        ) : (
          <div className="p-2">{tree.map((item) => renderNode(item))}</div>
        )}
      </div>

      {selectedNode && (
        <TreeConditionList policyId={policyId} nodeId={selectedNode.id} nodeName={selectedNode.name} />
      )}

      {showNodeForm && (
        <TreeNodeForm
          policyId={policyId}
          node={editingNode}
          parentNode={parentForNew}
          onClose={() => setShowNodeForm(false)}
        />
      )}
    </div>
  );
}
