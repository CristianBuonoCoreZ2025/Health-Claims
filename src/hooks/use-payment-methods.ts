"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { PaymentMethodsRepository, paymentMethodsQueryKeys } from "@/repositories/payment-methods.repository";
import type { PaymentMethodInput } from "@/schemas/payment-method.schema";
import type { PaymentMethod } from "@/types";

export function usePaymentMethods() {
  const client = createSupabaseBrowserClient();
  const repo = new PaymentMethodsRepository(client);
  return useQuery({
    queryKey: paymentMethodsQueryKeys.active(),
    queryFn: async () => repo.listActive(),
  });
}

export function useSearchPaymentMethodsByName(name: string) {
  const client = createSupabaseBrowserClient();
  const repo = new PaymentMethodsRepository(client);
  return useQuery({
    queryKey: paymentMethodsQueryKeys.searchByName(name),
    enabled: name.length > 0,
    queryFn: async () => repo.searchByName(name),
  });
}

export function useCreatePaymentMethod() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new PaymentMethodsRepository(client);
  return useMutation({
    mutationFn: async (input: PaymentMethodInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as PaymentMethod;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: paymentMethodsQueryKeys.all() });
    },
  });
}

export function useUpdatePaymentMethod() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new PaymentMethodsRepository(client);
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<PaymentMethodInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as PaymentMethod;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: paymentMethodsQueryKeys.all() });
    },
  });
}

export function useDeletePaymentMethod() {
  const qc = useQueryClient();
  const client = createSupabaseBrowserClient();
  const repo = new PaymentMethodsRepository(client);
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.softDelete(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: paymentMethodsQueryKeys.all() });
    },
  });
}
