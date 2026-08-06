"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { BanksRepository, banksQueryKeys } from "@/repositories/banks.repository";
import type { BankInput } from "@/schemas/bank.schema";
import type { Bank } from "@/types";

export function useBanks() {
  const client = createSupabaseBrowserClient();
  const repo = new BanksRepository(client);
  return useQuery({
    queryKey: banksQueryKeys.active(),
    queryFn: async () => repo.listActive(),
  });
}

export function useSearchBanksByName(name: string) {
  const client = createSupabaseBrowserClient();
  const repo = new BanksRepository(client);
  return useQuery({
    queryKey: banksQueryKeys.searchByName(name),
    enabled: name.length > 0,
    queryFn: async () => repo.searchByName(name),
  });
}

export function useCreateBank() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new BanksRepository(client);
  return useMutation({
    mutationFn: async (input: BankInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as Bank;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: banksQueryKeys.all() });
    },
  });
}

export function useUpdateBank() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new BanksRepository(client);
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<BankInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as Bank;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: banksQueryKeys.all() });
    },
  });
}

export function useDeleteBank() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new BanksRepository(client);
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.softDelete(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: banksQueryKeys.all() });
    },
  });
}
