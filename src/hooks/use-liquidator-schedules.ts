"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  LiquidatorSchedulesRepository,
  liquidatorSchedulesQueryKeys,
} from "@/repositories/liquidator-schedules.repository";
import type { LiquidatorScheduleInput } from "@/schemas/liquidator-schedule.schema";
import type { LiquidatorSchedule } from "@/types";

function useRepo() {
  const client = createSupabaseBrowserClient();
  return new LiquidatorSchedulesRepository(client);
}

export function useLiquidatorSchedules() {
  const repo = useRepo();
  return useQuery({
    queryKey: liquidatorSchedulesQueryKeys.all(),
    queryFn: async () => {
      const { data, error } = await repo.findAll();
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCreateLiquidatorSchedule() {
  const qc = useQueryClient();
  const repo = useRepo();
  return useMutation({
    mutationFn: async (input: LiquidatorScheduleInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as LiquidatorSchedule;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: liquidatorSchedulesQueryKeys.all() });
    },
  });
}

export function useUpdateLiquidatorSchedule() {
  const qc = useQueryClient();
  const repo = useRepo();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<LiquidatorScheduleInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as LiquidatorSchedule;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: liquidatorSchedulesQueryKeys.all() });
    },
  });
}

export function useDeleteLiquidatorSchedule() {
  const qc = useQueryClient();
  const repo = useRepo();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.remove(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: liquidatorSchedulesQueryKeys.all() });
    },
  });
}
