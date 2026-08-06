"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { DispatchCampaignsRepository, dispatchCampaignsQueryKeys } from "@/repositories/dispatch-campaigns.repository";
import type { DispatchCampaignInput } from "@/schemas/dispatch-campaign.schema";
import type { DispatchCampaign } from "@/types";

export function useDispatchCampaigns() {
  const client = createSupabaseBrowserClient();
  const repo = new DispatchCampaignsRepository(client);
  return useQuery({
    queryKey: dispatchCampaignsQueryKeys.active(),
    queryFn: async () => repo.listActive(),
  });
}

export function useSearchDispatchCampaignsByName(name: string) {
  const client = createSupabaseBrowserClient();
  const repo = new DispatchCampaignsRepository(client);
  return useQuery({
    queryKey: dispatchCampaignsQueryKeys.searchByName(name),
    enabled: name.length > 0,
    queryFn: async () => repo.searchByName(name),
  });
}

export function useCreateDispatchCampaign() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new DispatchCampaignsRepository(client);
  return useMutation({
    mutationFn: async (input: DispatchCampaignInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as DispatchCampaign;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: dispatchCampaignsQueryKeys.all() });
    },
  });
}

export function useUpdateDispatchCampaign() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new DispatchCampaignsRepository(client);
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<DispatchCampaignInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as DispatchCampaign;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: dispatchCampaignsQueryKeys.all() });
    },
  });
}

export function useDeleteDispatchCampaign() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new DispatchCampaignsRepository(client);
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.softDelete(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: dispatchCampaignsQueryKeys.all() });
    },
  });
}
