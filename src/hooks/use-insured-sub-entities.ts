"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  PreExistingConditionsRepository,
  preExistingConditionsQueryKeys,
} from "@/repositories/pre-existing-conditions.repository";
import {
  InsuredAddressesRepository,
  insuredAddressesQueryKeys,
} from "@/repositories/insured-addresses.repository";
import {
  InsuredBankAccountsRepository,
  insuredBankAccountsQueryKeys,
} from "@/repositories/insured-bank-accounts.repository";
import type { PreExistingConditionInput } from "@/schemas/pre-existing-condition.schema";
import type { InsuredAddressInput } from "@/schemas/insured-address.schema";
import type { InsuredBankAccountInput } from "@/schemas/insured-bank-account.schema";
import type { PreExistingCondition, InsuredAddress, InsuredBankAccount } from "@/types";

function usePreExistingRepo() {
  const client = createSupabaseBrowserClient();
  return new PreExistingConditionsRepository(client);
}

function useAddressesRepo() {
  const client = createSupabaseBrowserClient();
  return new InsuredAddressesRepository(client);
}

function useBankAccountsRepo() {
  const client = createSupabaseBrowserClient();
  return new InsuredBankAccountsRepository(client);
}

// --- Pre-existing conditions ---

export function usePreExistingConditions(insuredId: string) {
  const repo = usePreExistingRepo();
  return useQuery({
    queryKey: preExistingConditionsQueryKeys.byInsured(insuredId),
    enabled: Boolean(insuredId),
    queryFn: async () => repo.getByInsured(insuredId),
  });
}

export function useCreatePreExistingCondition() {
  const qc = useQueryClient();
  const repo = usePreExistingRepo();
  return useMutation({
    mutationFn: async (input: PreExistingConditionInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as PreExistingCondition;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: preExistingConditionsQueryKeys.all() });
    },
  });
}

export function useDeletePreExistingCondition() {
  const qc = useQueryClient();
  const repo = usePreExistingRepo();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.remove(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: preExistingConditionsQueryKeys.all() });
    },
  });
}

// --- Insured addresses ---

export function useInsuredAddresses(insuredId: string) {
  const repo = useAddressesRepo();
  return useQuery({
    queryKey: insuredAddressesQueryKeys.byInsured(insuredId),
    enabled: Boolean(insuredId),
    queryFn: async () => repo.getByInsured(insuredId),
  });
}

export function useCreateInsuredAddress() {
  const qc = useQueryClient();
  const repo = useAddressesRepo();
  return useMutation({
    mutationFn: async (input: InsuredAddressInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as InsuredAddress;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: insuredAddressesQueryKeys.all() });
    },
  });
}

export function useDeleteInsuredAddress() {
  const qc = useQueryClient();
  const repo = useAddressesRepo();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.remove(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: insuredAddressesQueryKeys.all() });
    },
  });
}

// --- Insured bank accounts ---

export function useInsuredBankAccounts(insuredId: string) {
  const repo = useBankAccountsRepo();
  return useQuery({
    queryKey: insuredBankAccountsQueryKeys.byInsured(insuredId),
    enabled: Boolean(insuredId),
    queryFn: async () => repo.getByInsured(insuredId),
  });
}

export function useCreateInsuredBankAccount() {
  const qc = useQueryClient();
  const repo = useBankAccountsRepo();
  return useMutation({
    mutationFn: async (input: InsuredBankAccountInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as InsuredBankAccount;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: insuredBankAccountsQueryKeys.all() });
    },
  });
}

export function useDeleteInsuredBankAccount() {
  const qc = useQueryClient();
  const repo = useBankAccountsRepo();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.remove(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: insuredBankAccountsQueryKeys.all() });
    },
  });
}
