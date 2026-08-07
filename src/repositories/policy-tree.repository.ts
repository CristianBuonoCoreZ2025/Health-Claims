import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";

import type {
  Database,
  PolicyTreeCondition,
  PolicyTreeNode,
  PolicyTreeNodeInsert,
  PolicyTreeNodeUpdate,
  PolicyTreeConditionInsert,
  PolicyTreeConditionUpdate,
} from "@/types";
import { queryKeys } from "./base.repository";

type TreeNodeWithConditions = PolicyTreeNode & {
  policy_tree_conditions: PolicyTreeCondition[];
};

export class PolicyTreeRepository {
  constructor(private readonly client: SupabaseClient<Database>) {}

  async getTreeByPolicy(policyId: string): Promise<PolicyTreeNode[]> {
    const { data, error } = await this.client
      .from("policy_tree_nodes")
      .select("*")
      .eq("policy_id", policyId)
      .order("level_code", { ascending: true })
      .order("sort_order", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async getTreeWithConditions(
    policyId: string
  ): Promise<{ data: TreeNodeWithConditions[] | null; error: PostgrestError | null }> {
    const { data, error } = await this.client
      .from("policy_tree_nodes")
      .select("*, policy_tree_conditions(*)")
      .eq("policy_id", policyId)
      .order("level_code", { ascending: true })
      .order("sort_order", { ascending: true });
    return { data: (data as unknown as TreeNodeWithConditions[]) ?? null, error };
  }

  async createNode(input: PolicyTreeNodeInsert): Promise<{ data: PolicyTreeNode | null; error: PostgrestError | null }> {
    const { data, error } = await this.client
      .from("policy_tree_nodes")
      .insert(input)
      .select("*")
      .maybeSingle();
    return { data: data ?? null, error };
  }

  async updateNode(id: string, input: PolicyTreeNodeUpdate): Promise<{ data: PolicyTreeNode | null; error: PostgrestError | null }> {
    const { data, error } = await this.client
      .from("policy_tree_nodes")
      .update(input)
      .eq("id", id)
      .select("*")
      .maybeSingle();
    return { data: data ?? null, error };
  }

  async deleteNode(id: string): Promise<{ error: PostgrestError | null }> {
    const { error } = await this.client.from("policy_tree_nodes").delete().eq("id", id);
    return { error };
  }

  async getConditionsByNode(nodeId: string): Promise<PolicyTreeCondition[]> {
    const { data, error } = await this.client
      .from("policy_tree_conditions")
      .select("*")
      .eq("node_id", nodeId)
      .order("created_at", { ascending: true });
    if (error) return [];
    return data ?? [];
  }

  async createCondition(input: PolicyTreeConditionInsert): Promise<{ data: PolicyTreeCondition | null; error: PostgrestError | null }> {
    const { data, error } = await this.client
      .from("policy_tree_conditions")
      .insert(input)
      .select("*")
      .maybeSingle();
    return { data: data ?? null, error };
  }

  async updateCondition(id: string, input: PolicyTreeConditionUpdate): Promise<{ data: PolicyTreeCondition | null; error: PostgrestError | null }> {
    const { data, error } = await this.client
      .from("policy_tree_conditions")
      .update(input)
      .eq("id", id)
      .select("*")
      .maybeSingle();
    return { data: data ?? null, error };
  }

  async deleteCondition(id: string): Promise<{ error: PostgrestError | null }> {
    const { error } = await this.client.from("policy_tree_conditions").delete().eq("id", id);
    return { error };
  }
}

export const policyTreeQueryKeys = {
  all: () => [...queryKeys.table("policy_tree_nodes")] as const,
  treeByPolicy: (policyId: string) =>
    [...queryKeys.tableList("policy_tree_nodes", { policy: policyId })] as const,
  treeWithConditions: (policyId: string) =>
    [...queryKeys.tableList("policy_tree_nodes", { policy: policyId, withConditions: true })] as const,
  conditionsByNode: (nodeId: string) =>
    [...queryKeys.tableList("policy_tree_conditions", { node: nodeId })] as const,
};
