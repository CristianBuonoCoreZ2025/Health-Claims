"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { CountriesRepository, countriesQueryKeys } from "@/repositories/countries.repository";
import type { CountryInput } from "@/schemas/country.schema";
import type { Country } from "@/types";

export function useCountries() {
  const client = createSupabaseBrowserClient();
  const repo = new CountriesRepository(client);
  return useQuery({
    queryKey: countriesQueryKeys.active(),
    queryFn: async () => repo.listActive(),
  });
}

export function useSearchCountriesByName(name: string) {
  const client = createSupabaseBrowserClient();
  const repo = new CountriesRepository(client);
  return useQuery({
    queryKey: countriesQueryKeys.searchByName(name),
    enabled: name.length > 0,
    queryFn: async () => repo.searchByName(name),
  });
}

export function useCreateCountry() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new CountriesRepository(client);
  return useMutation({
    mutationFn: async (input: CountryInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as Country;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: countriesQueryKeys.all() });
    },
  });
}

export function useUpdateCountry() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new CountriesRepository(client);
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<CountryInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as Country;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: countriesQueryKeys.all() });
    },
  });
}

export function useDeleteCountry() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new CountriesRepository(client);
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.softDelete(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: countriesQueryKeys.all() });
    },
  });
}
