"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { CurrenciesRepository, currenciesQueryKeys } from "@/repositories/currencies.repository";
import type { CurrencyInput } from "@/schemas/currency.schema";
import type { Currency } from "@/types";

export function useCurrencies() {
  const client = createSupabaseBrowserClient();
  const repo = new CurrenciesRepository(client);
  return useQuery({
    queryKey: currenciesQueryKeys.active(),
    queryFn: async () => repo.listActive(),
  });
}

export function useSearchCurrenciesByName(name: string) {
  const client = createSupabaseBrowserClient();
  const repo = new CurrenciesRepository(client);
  return useQuery({
    queryKey: currenciesQueryKeys.searchByName(name),
    enabled: name.length > 0,
    queryFn: async () => repo.searchByName(name),
  });
}

export function useCreateCurrency() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new CurrenciesRepository(client);
  return useMutation({
    mutationFn: async (input: CurrencyInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as Currency;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: currenciesQueryKeys.all() });
    },
  });
}

export function useUpdateCurrency() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new CurrenciesRepository(client);
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<CurrencyInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as Currency;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: currenciesQueryKeys.all() });
    },
  });
}

export function useDeleteCurrency() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new CurrenciesRepository(client);
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.softDelete(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: currenciesQueryKeys.all() });
    },
  });
}
