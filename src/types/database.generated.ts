export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      aranceles: {
        Row: {
          amount: number
          code: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          level: number
          name: string
          parent_id: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          amount?: number
          code: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          level?: number
          name: string
          parent_id?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          amount?: number
          code?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          level?: number
          name?: string
          parent_id?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "aranceles_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "aranceles"
            referencedColumns: ["id"]
          },
        ]
      }
      claim_details: {
        Row: {
          amount: number
          claim_id: string
          copayment_applied: number
          coverage_type_id: string | null
          created_at: string
          created_by: string | null
          deductible_applied: number
          diagnostic_id: string | null
          final_reimbursement: number
          id: string
          is_active: boolean
          medication_id: string | null
          observation: string | null
          provider_id: string | null
          service_date: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          amount?: number
          claim_id: string
          copayment_applied?: number
          coverage_type_id?: string | null
          created_at?: string
          created_by?: string | null
          deductible_applied?: number
          diagnostic_id?: string | null
          final_reimbursement?: number
          id?: string
          is_active?: boolean
          medication_id?: string | null
          observation?: string | null
          provider_id?: string | null
          service_date: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          amount?: number
          claim_id?: string
          copayment_applied?: number
          coverage_type_id?: string | null
          created_at?: string
          created_by?: string | null
          deductible_applied?: number
          diagnostic_id?: string | null
          final_reimbursement?: number
          id?: string
          is_active?: boolean
          medication_id?: string | null
          observation?: string | null
          provider_id?: string | null
          service_date?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "claim_details_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "claims"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claim_details_coverage_type_id_fkey"
            columns: ["coverage_type_id"]
            isOneToOne: false
            referencedRelation: "coverage_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claim_details_diagnostic_id_fkey"
            columns: ["diagnostic_id"]
            isOneToOne: false
            referencedRelation: "diagnostics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claim_details_medication_id_fkey"
            columns: ["medication_id"]
            isOneToOne: false
            referencedRelation: "medications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claim_details_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      claim_timeline: {
        Row: {
          action_type: Database["public"]["Enums"]["claim_action_type"]
          claim_id: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
        }
        Insert: {
          action_type: Database["public"]["Enums"]["claim_action_type"]
          claim_id: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
        }
        Update: {
          action_type?: Database["public"]["Enums"]["claim_action_type"]
          claim_id?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "claim_timeline_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "claims"
            referencedColumns: ["id"]
          },
        ]
      }
      claims: {
        Row: {
          amount_requested: number
          assigned_liquidator_id: string | null
          claim_number: string
          created_at: string
          created_by: string | null
          description: string | null
          final_reimbursement: number | null
          id: string
          incident_date: string
          insured_id: string
          is_active: boolean
          policy_id: string
          report_date: string
          status: Database["public"]["Enums"]["claim_status"]
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          amount_requested?: number
          assigned_liquidator_id?: string | null
          claim_number: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          final_reimbursement?: number | null
          id?: string
          incident_date: string
          insured_id: string
          is_active?: boolean
          policy_id: string
          report_date?: string
          status?: Database["public"]["Enums"]["claim_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          amount_requested?: number
          assigned_liquidator_id?: string | null
          claim_number?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          final_reimbursement?: number | null
          id?: string
          incident_date?: string
          insured_id?: string
          is_active?: boolean
          policy_id?: string
          report_date?: string
          status?: Database["public"]["Enums"]["claim_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "claims_insured_id_fkey"
            columns: ["insured_id"]
            isOneToOne: false
            referencedRelation: "insureds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claims_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "policies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          address: string | null
          created_at: string
          created_by: string | null
          email: string | null
          holding_id: string | null
          id: string
          is_active: boolean
          logo_url: string | null
          name: string
          phone: string | null
          rut: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          holding_id?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name: string
          phone?: string | null
          rut: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          holding_id?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name?: string
          phone?: string | null
          rut?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_holding_id_fkey"
            columns: ["holding_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      coverage_types: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      diagnostics: {
        Row: {
          code_cie10: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          keywords: unknown
          name: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          code_cie10: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          keywords?: unknown
          name: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          code_cie10?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          keywords?: unknown
          name?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      insured_addresses: {
        Row: {
          city: string | null
          created_at: string
          created_by: string | null
          id: string
          insured_id: string
          is_active: boolean
          label: string
          postal_code: string | null
          region: string | null
          street: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          insured_id: string
          is_active?: boolean
          label?: string
          postal_code?: string | null
          region?: string | null
          street: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          insured_id?: string
          is_active?: boolean
          label?: string
          postal_code?: string | null
          region?: string | null
          street?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "insured_addresses_insured_id_fkey"
            columns: ["insured_id"]
            isOneToOne: false
            referencedRelation: "insureds"
            referencedColumns: ["id"]
          },
        ]
      }
      insured_bank_accounts: {
        Row: {
          account_number: string
          account_type: string
          bank_name: string
          created_at: string
          created_by: string | null
          id: string
          insured_id: string
          is_active: boolean
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          account_number: string
          account_type?: string
          bank_name: string
          created_at?: string
          created_by?: string | null
          id?: string
          insured_id: string
          is_active?: boolean
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          account_number?: string
          account_type?: string
          bank_name?: string
          created_at?: string
          created_by?: string | null
          id?: string
          insured_id?: string
          is_active?: boolean
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "insured_bank_accounts_insured_id_fkey"
            columns: ["insured_id"]
            isOneToOne: false
            referencedRelation: "insureds"
            referencedColumns: ["id"]
          },
        ]
      }
      insureds: {
        Row: {
          birth_date: string | null
          created_at: string
          created_by: string | null
          email: string | null
          first_name: string
          gender: Database["public"]["Enums"]["gender_type"] | null
          id: string
          is_active: boolean
          is_titular: boolean
          last_name: string
          phone: string | null
          policy_id: string
          relationship: Database["public"]["Enums"]["relationship_type"]
          rut: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          birth_date?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          first_name: string
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id?: string
          is_active?: boolean
          is_titular?: boolean
          last_name: string
          phone?: string | null
          policy_id: string
          relationship?: Database["public"]["Enums"]["relationship_type"]
          rut: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          birth_date?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          first_name?: string
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id?: string
          is_active?: boolean
          is_titular?: boolean
          last_name?: string
          phone?: string | null
          policy_id?: string
          relationship?: Database["public"]["Enums"]["relationship_type"]
          rut?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "insureds_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "policies"
            referencedColumns: ["id"]
          },
        ]
      }
      liquidator_weights: {
        Row: {
          coverage_type_id: string | null
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          level: string
          updated_at: string
          updated_by: string | null
          user_id: string
          weight_value: number
        }
        Insert: {
          coverage_type_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          level?: string
          updated_at?: string
          updated_by?: string | null
          user_id: string
          weight_value?: number
        }
        Update: {
          coverage_type_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          level?: string
          updated_at?: string
          updated_by?: string | null
          user_id?: string
          weight_value?: number
        }
        Relationships: [
          {
            foreignKeyName: "liquidator_weights_coverage_type_id_fkey"
            columns: ["coverage_type_id"]
            isOneToOne: false
            referencedRelation: "coverage_types"
            referencedColumns: ["id"]
          },
        ]
      }
      medications: {
        Row: {
          active_ingredient: string | null
          created_at: string
          created_by: string | null
          dosage: string | null
          id: string
          is_active: boolean
          laboratory: string | null
          name: string
          presentation: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          active_ingredient?: string | null
          created_at?: string
          created_by?: string | null
          dosage?: string | null
          id?: string
          is_active?: boolean
          laboratory?: string | null
          name: string
          presentation?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          active_ingredient?: string | null
          created_at?: string
          created_by?: string | null
          dosage?: string | null
          id?: string
          is_active?: boolean
          laboratory?: string | null
          name?: string
          presentation?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      policies: {
        Row: {
          company_id: string
          contract_type: Database["public"]["Enums"]["contract_type"]
          created_at: string
          created_by: string | null
          end_date: string
          endorsement_number: string
          holder_name: string
          id: string
          is_active: boolean
          policy_number: string
          start_date: string
          status: Database["public"]["Enums"]["policy_status"]
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          company_id: string
          contract_type?: Database["public"]["Enums"]["contract_type"]
          created_at?: string
          created_by?: string | null
          end_date: string
          endorsement_number?: string
          holder_name: string
          id?: string
          is_active?: boolean
          policy_number: string
          start_date: string
          status?: Database["public"]["Enums"]["policy_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          company_id?: string
          contract_type?: Database["public"]["Enums"]["contract_type"]
          created_at?: string
          created_by?: string | null
          end_date?: string
          endorsement_number?: string
          holder_name?: string
          id?: string
          is_active?: boolean
          policy_number?: string
          start_date?: string
          status?: Database["public"]["Enums"]["policy_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "policies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      policy_conditions: {
        Row: {
          copayment_percentage: number
          coverage_type_id: string
          created_at: string
          created_by: string | null
          deductible_percentage: number
          event_limit: number
          id: string
          is_active: boolean
          policy_id: string
          updated_at: string
          updated_by: string | null
          waiting_period_days: number
          yearly_limit: number
        }
        Insert: {
          copayment_percentage?: number
          coverage_type_id: string
          created_at?: string
          created_by?: string | null
          deductible_percentage?: number
          event_limit?: number
          id?: string
          is_active?: boolean
          policy_id: string
          updated_at?: string
          updated_by?: string | null
          waiting_period_days?: number
          yearly_limit?: number
        }
        Update: {
          copayment_percentage?: number
          coverage_type_id?: string
          created_at?: string
          created_by?: string | null
          deductible_percentage?: number
          event_limit?: number
          id?: string
          is_active?: boolean
          policy_id?: string
          updated_at?: string
          updated_by?: string | null
          waiting_period_days?: number
          yearly_limit?: number
        }
        Relationships: [
          {
            foreignKeyName: "policy_conditions_coverage_type_id_fkey"
            columns: ["coverage_type_id"]
            isOneToOne: false
            referencedRelation: "coverage_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "policy_conditions_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "policies"
            referencedColumns: ["id"]
          },
        ]
      }
      pre_existing_conditions: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          diagnosed_date: string | null
          id: string
          insured_id: string
          is_active: boolean
          name: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          diagnosed_date?: string | null
          id?: string
          insured_id: string
          is_active?: boolean
          name: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          diagnosed_date?: string | null
          id?: string
          insured_id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pre_existing_conditions_insured_id_fkey"
            columns: ["insured_id"]
            isOneToOne: false
            referencedRelation: "insureds"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          created_by: string | null
          full_name: string
          id: string
          is_active: boolean
          role: Database["public"]["Enums"]["app_role"]
          team_id: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          full_name?: string
          id: string
          is_active?: boolean
          role?: Database["public"]["Enums"]["app_role"]
          team_id?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          full_name?: string
          id?: string
          is_active?: boolean
          role?: Database["public"]["Enums"]["app_role"]
          team_id?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      provider_coverages: {
        Row: {
          coverage_type_id: string
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          provider_id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          coverage_type_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          provider_id: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          coverage_type_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          provider_id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "provider_coverages_coverage_type_id_fkey"
            columns: ["coverage_type_id"]
            isOneToOne: false
            referencedRelation: "coverage_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_coverages_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      providers: {
        Row: {
          bank_account: string | null
          bank_id: string | null
          business_name: string | null
          created_at: string
          created_by: string | null
          email: string | null
          id: string
          is_active: boolean
          name: string
          phone: string | null
          rut: string
          specialty: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          bank_account?: string | null
          bank_id?: string | null
          business_name?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          name: string
          phone?: string | null
          rut: string
          specialty?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          bank_account?: string | null
          bank_id?: string | null
          business_name?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          name?: string
          phone?: string | null
          rut?: string
          specialty?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_liquidator: {
        Args: { p_coverage_type_id?: string }
        Returns: string
      }
      calculate_claim: {
        Args: {
          p_amount_requested: number
          p_coverage_type_id?: string
          p_policy_id: string
        }
        Returns: {
          applicable: boolean
          copayment_applied: number
          copayment_percentage: number
          deductible_applied: number
          deductible_percentage: number
          event_limit: number
          final_reimbursement: number
          waiting_period_days: number
          yearly_limit: number
        }[]
      }
      current_user_id: { Args: never; Returns: string }
      current_user_role: { Args: never; Returns: string }
      has_role: { Args: { p_role: string }; Returns: boolean }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      update_claim_status: {
        Args: {
          p_claim_id: string
          p_description?: string
          p_new_status: Database["public"]["Enums"]["claim_status"]
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "supervisor" | "liquidator"
      claim_action_type:
        | "creado"
        | "asignado"
        | "en_revision"
        | "antecedentes_solicitados"
        | "aprobado"
        | "rechazado"
        | "pagado"
        | "comentario"
        | "documento_agregado"
      claim_status:
        | "ingresado"
        | "asignado"
        | "en_revision"
        | "solicitando_antecedentes"
        | "aprobado"
        | "rechazado"
        | "pagado"
      contract_type: "individual" | "colectivo"
      gender_type: "masculino" | "femenino" | "otro"
      policy_status: "vigente" | "vencida" | "anulada" | "pendiente"
      relationship_type: "titular" | "conyuge" | "hijo" | "otro"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "supervisor", "liquidator"],
      claim_action_type: [
        "creado",
        "asignado",
        "en_revision",
        "antecedentes_solicitados",
        "aprobado",
        "rechazado",
        "pagado",
        "comentario",
        "documento_agregado",
      ],
      claim_status: [
        "ingresado",
        "asignado",
        "en_revision",
        "solicitando_antecedentes",
        "aprobado",
        "rechazado",
        "pagado",
      ],
      contract_type: ["individual", "colectivo"],
      gender_type: ["masculino", "femenino", "otro"],
      policy_status: ["vigente", "vencida", "anulada", "pendiente"],
      relationship_type: ["titular", "conyuge", "hijo", "otro"],
    },
  },
} as const
