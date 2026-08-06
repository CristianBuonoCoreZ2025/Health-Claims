// Tipos generados para Supabase.
//
// Este archivo se genera con `npm run db:gen` tras vincular el proyecto
// (supabase link). Mientras el proyecto Supabase no este vinculado, se mantiene
// una version manual que refleja el esquema de las migraciones iniciales
// (Fase 1). Ejecutar `db:gen` para regenerarlo automaticamente desde el schema
// remoto; el formato es compatible con @supabase/supabase-js.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AppRole = "admin" | "supervisor" | "liquidator";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: AppRole;
          team_id: string | null;
          full_name: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          updated_by: string | null;
        };
        Insert: {
          id: string;
          role?: AppRole;
          team_id?: string | null;
          full_name?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          updated_by?: string | null;
        };
        Update: {
          id?: string;
          role?: AppRole;
          team_id?: string | null;
          full_name?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          updated_by?: string | null;
        };
        Relationships: [];
      };
      companies: {
        Row: {
          id: string;
          name: string;
          rut: string;
          address: string | null;
          phone: string | null;
          email: string | null;
          holding_id: string | null;
          logo_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          updated_by: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          rut: string;
          address?: string | null;
          phone?: string | null;
          email?: string | null;
          holding_id?: string | null;
          logo_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          updated_by?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          rut?: string;
          address?: string | null;
          phone?: string | null;
          email?: string | null;
          holding_id?: string | null;
          logo_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "companies_holding_id_fkey";
            columns: ["holding_id"];
            isOneToOne: false;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          },
        ];
      };
      providers: {
        Row: {
          id: string;
          rut: string;
          name: string;
          business_name: string | null;
          specialty: string | null;
          email: string | null;
          phone: string | null;
          bank_account: string | null;
          bank_id: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          updated_by: string | null;
        };
        Insert: {
          id?: string;
          rut: string;
          name: string;
          business_name?: string | null;
          specialty?: string | null;
          email?: string | null;
          phone?: string | null;
          bank_account?: string | null;
          bank_id?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          updated_by?: string | null;
        };
        Update: {
          id?: string;
          rut?: string;
          name?: string;
          business_name?: string | null;
          specialty?: string | null;
          email?: string | null;
          phone?: string | null;
          bank_account?: string | null;
          bank_id?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          updated_by?: string | null;
        };
        Relationships: [];
      };
      diagnostics: {
        Row: {
          id: string;
          code_cie10: string;
          name: string;
          description: string | null;
          keywords: unknown | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          updated_by: string | null;
        };
        Insert: {
          id?: string;
          code_cie10: string;
          name: string;
          description?: string | null;
          keywords?: unknown | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          updated_by?: string | null;
        };
        Update: {
          id?: string;
          code_cie10?: string;
          name?: string;
          description?: string | null;
          keywords?: unknown | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          updated_by?: string | null;
        };
        Relationships: [];
      };
      medications: {
        Row: {
          id: string;
          name: string;
          active_ingredient: string | null;
          dosage: string | null;
          presentation: string | null;
          laboratory: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          updated_by: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          active_ingredient?: string | null;
          dosage?: string | null;
          presentation?: string | null;
          laboratory?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          updated_by?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          active_ingredient?: string | null;
          dosage?: string | null;
          presentation?: string | null;
          laboratory?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          updated_by?: string | null;
        };
        Relationships: [];
      };
      coverage_types: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          updated_by: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          updated_by?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          updated_by?: string | null;
        };
        Relationships: [];
      };
    };
    Views: { [key: string]: never };
    Functions: {
      current_user_id: { Args: Record<string, never>; Returns: string | null };
      current_user_role: { Args: Record<string, never>; Returns: string | null };
      has_role: { Args: { p_role: string }; Returns: boolean };
      handle_new_user: { Args: Record<string, never>; Returns: unknown };
      set_updated_at: { Args: Record<string, never>; Returns: unknown };
      set_audit_user: { Args: Record<string, never>; Returns: unknown };
      diagnostics_keywords_tsv: { Args: Record<string, never>; Returns: unknown };
    };
    Enums: {
      app_role: AppRole;
    };
    CompositeTypes: { [key: string]: never };
  };
}

export default Database;
