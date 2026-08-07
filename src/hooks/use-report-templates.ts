"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  ReportTemplatesRepository,
  reportTemplatesQueryKeys,
} from "@/repositories/report-templates.repository";
import type { ReportTemplateInput } from "@/schemas/report-template.schema";
import type { ReportTemplate } from "@/types";

function useRepo() {
  const client = createSupabaseBrowserClient();
  return new ReportTemplatesRepository(client);
}

export function useReportTemplates() {
  const repo = useRepo();
  return useQuery({
    queryKey: reportTemplatesQueryKeys.all(),
    queryFn: async () => {
      const { data, error } = await repo.findAll();
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCreateReportTemplate() {
  const qc = useQueryClient();
  const repo = useRepo();
  return useMutation({
    mutationFn: async (input: ReportTemplateInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as ReportTemplate;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: reportTemplatesQueryKeys.all() });
    },
  });
}

export function useUpdateReportTemplate() {
  const qc = useQueryClient();
  const repo = useRepo();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<ReportTemplateInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as ReportTemplate;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: reportTemplatesQueryKeys.all() });
    },
  });
}

export function useDeleteReportTemplate() {
  const qc = useQueryClient();
  const repo = useRepo();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.remove(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: reportTemplatesQueryKeys.all() });
    },
  });
}
