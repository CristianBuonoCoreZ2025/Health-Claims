"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { BrokersRepository, brokersQueryKeys } from "@/repositories/brokers.repository";
import type { BrokerInput } from "@/schemas/broker.schema";
import type { Broker } from "@/types";

function useBrokersRepo() {
  const client = createSupabaseBrowserClient();
  return new BrokersRepository(client);
}

export function useBrokers() {
  const repo = useBrokersRepo();
  return useQuery({
    queryKey: brokersQueryKeys.active(),
    queryFn: async () => repo.listActive(),
  });
}

export function useBrokerDetail(id: string) {
  const repo = useBrokersRepo();
  return useQuery({
    queryKey: brokersQueryKeys.detail(id),
    enabled: Boolean(id),
    queryFn: async () => {
      const { data, error } = await repo.findById(id);
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateBroker() {
  const qc = useQueryClient();
  const repo = useBrokersRepo();
  return useMutation({
    mutationFn: async (input: BrokerInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as Broker;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: brokersQueryKeys.all() });
    },
  });
}

export function useUpdateBroker() {
  const qc = useQueryClient();
  const repo = useBrokersRepo();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<BrokerInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as Broker;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: brokersQueryKeys.all() });
    },
  });
}

export function useDeleteBroker() {
  const qc = useQueryClient();
  const repo = useBrokersRepo();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.softDelete(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: brokersQueryKeys.all() });
    },
  });
}
