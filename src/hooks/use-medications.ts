"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  MedicationsRepository,
  medicationsQueryKeys,
} from "@/repositories/medications.repository";
import type { MedicationInput } from "@/schemas/medication.schema";
import type { Medication } from "@/types";

// Hook cliente para obtener el repositorio de medications con el browser client.
function useMedicationsRepo() {
  const client = createSupabaseBrowserClient();
  return new MedicationsRepository(client);
}

// Lista todos los medicamentos activos.
export function useMedications() {
  const repo = useMedicationsRepo();
  return useQuery({
    queryKey: medicationsQueryKeys.active(),
    queryFn: async () => repo.listActive(),
  });
}

// Busca medicamentos por nombre.
export function useSearchMedicationsByName(name: string) {
  const repo = useMedicationsRepo();
  return useQuery({
    queryKey: medicationsQueryKeys.searchByName(name),
    enabled: name.length > 0,
    queryFn: async () => repo.searchByName(name),
  });
}

// Busca medicamentos por principio activo.
export function useSearchMedicationsByActiveIngredient(ingredient: string) {
  const repo = useMedicationsRepo();
  return useQuery({
    queryKey: medicationsQueryKeys.searchByActiveIngredient(ingredient),
    enabled: ingredient.length > 0,
    queryFn: async () => repo.searchByActiveIngredient(ingredient),
  });
}

// Crea un medicamento.
export function useCreateMedication() {
  const qc = useQueryClient();
  const repo = useMedicationsRepo();
  return useMutation({
    mutationFn: async (input: MedicationInput) => {
      const { data, error } = await repo.insert(input);
      if (error) throw error;
      return data as Medication;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: medicationsQueryKeys.all() });
    },
  });
}

// Actualiza un medicamento.
export function useUpdateMedication() {
  const qc = useQueryClient();
  const repo = useMedicationsRepo();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<MedicationInput> }) => {
      const { data, error } = await repo.update(id, input);
      if (error) throw error;
      return data as Medication;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: medicationsQueryKeys.all() });
    },
  });
}

// Desactiva un medicamento (soft delete).
export function useDeleteMedication() {
  const qc = useQueryClient();
  const repo = useMedicationsRepo();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await repo.softDelete(id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: medicationsQueryKeys.all() });
    },
  });
}
