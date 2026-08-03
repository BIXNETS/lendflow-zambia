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
      country_settings: {
        Row: {
          commitment_pct_max: number
          commitment_pct_min: number
          country_code: string
          country_name: string
          created_at: string
          currency_code: string
          currency_symbol: string
          eligibility_rules: Json
          id: string
          is_active: boolean
          max_loan_amount: number
          max_term_months: number
          min_loan_amount: number
          min_term_months: number
          payment_methods: Json
          sort_order: number
          updated_at: string
        }
        Insert: {
          commitment_pct_max?: number
          commitment_pct_min?: number
          country_code: string
          country_name: string
          created_at?: string
          currency_code: string
          currency_symbol: string
          eligibility_rules?: Json
          id?: string
          is_active?: boolean
          max_loan_amount?: number
          max_term_months?: number
          min_loan_amount?: number
          min_term_months?: number
          payment_methods?: Json
          sort_order?: number
          updated_at?: string
        }
        Update: {
          commitment_pct_max?: number
          commitment_pct_min?: number
          country_code?: string
          country_name?: string
          created_at?: string
          currency_code?: string
          currency_symbol?: string
          eligibility_rules?: Json
          id?: string
          is_active?: boolean
          max_loan_amount?: number
          max_term_months?: number
          min_loan_amount?: number
          min_term_months?: number
          payment_methods?: Json
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      kyc_documents: {
        Row: {
          created_at: string
          doc_type: Database["public"]["Enums"]["kyc_doc_type"]
          id: string
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["kyc_doc_status"]
          storage_path: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          doc_type: Database["public"]["Enums"]["kyc_doc_type"]
          id?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["kyc_doc_status"]
          storage_path: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          doc_type?: Database["public"]["Enums"]["kyc_doc_type"]
          id?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["kyc_doc_status"]
          storage_path?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      loan_applications: {
        Row: {
          amount: number
          created_at: string
          currency_code: string
          decided_at: string | null
          decided_by: string | null
          decision_notes: string | null
          email: string
          employment: string | null
          first_name: string
          id: string
          id_back_path: string | null
          id_front_path: string | null
          last_name: string
          loan_id: string | null
          mobile_number: string | null
          mobile_provider: string | null
          monthly_income: number | null
          monthly_payment: number
          phone: string
          product_id: string | null
          product_title: string | null
          purpose: string | null
          rate: number
          selfie_path: string | null
          service_fee: number
          service_fee_pct: number
          status: string
          term_months: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency_code?: string
          decided_at?: string | null
          decided_by?: string | null
          decision_notes?: string | null
          email: string
          employment?: string | null
          first_name: string
          id?: string
          id_back_path?: string | null
          id_front_path?: string | null
          last_name: string
          loan_id?: string | null
          mobile_number?: string | null
          mobile_provider?: string | null
          monthly_income?: number | null
          monthly_payment: number
          phone: string
          product_id?: string | null
          product_title?: string | null
          purpose?: string | null
          rate: number
          selfie_path?: string | null
          service_fee?: number
          service_fee_pct?: number
          status?: string
          term_months: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency_code?: string
          decided_at?: string | null
          decided_by?: string | null
          decision_notes?: string | null
          email?: string
          employment?: string | null
          first_name?: string
          id?: string
          id_back_path?: string | null
          id_front_path?: string | null
          last_name?: string
          loan_id?: string | null
          mobile_number?: string | null
          mobile_provider?: string | null
          monthly_income?: number | null
          monthly_payment?: number
          phone?: string
          product_id?: string | null
          product_title?: string | null
          purpose?: string | null
          rate?: number
          selfie_path?: string | null
          service_fee?: number
          service_fee_pct?: number
          status?: string
          term_months?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loan_applications_loan_id_fkey"
            columns: ["loan_id"]
            isOneToOne: false
            referencedRelation: "loans"
            referencedColumns: ["id"]
          },
        ]
      }
      loan_tiers: {
        Row: {
          activation_fee: number
          created_at: string
          description: string | null
          eligibility_rules: Json
          id: string
          interest_rate: number
          is_active: boolean
          max_active_loans: number
          max_amount: number
          max_outstanding_principal: number | null
          max_repayment_frequency_days: number
          max_term_months: number
          min_age: number
          min_amount: number
          min_repayment_frequency_days: number
          min_term_months: number
          name: string
          processing_fee: number
          required_activation_status: string
          required_kyc_status: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          activation_fee?: number
          created_at?: string
          description?: string | null
          eligibility_rules?: Json
          id?: string
          interest_rate: number
          is_active?: boolean
          max_active_loans?: number
          max_amount: number
          max_outstanding_principal?: number | null
          max_repayment_frequency_days?: number
          max_term_months: number
          min_age?: number
          min_amount: number
          min_repayment_frequency_days?: number
          min_term_months: number
          name: string
          processing_fee?: number
          required_activation_status?: string
          required_kyc_status?: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          activation_fee?: number
          created_at?: string
          description?: string | null
          eligibility_rules?: Json
          id?: string
          interest_rate?: number
          is_active?: boolean
          max_active_loans?: number
          max_amount?: number
          max_outstanding_principal?: number | null
          max_repayment_frequency_days?: number
          max_term_months?: number
          min_age?: number
          min_amount?: number
          min_repayment_frequency_days?: number
          min_term_months?: number
          name?: string
          processing_fee?: number
          required_activation_status?: string
          required_kyc_status?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      loans: {
        Row: {
          amount_paid: number
          application_id: string | null
          country_code: string | null
          created_at: string
          currency_code: string
          disbursed_at: string | null
          due_at: string | null
          id: string
          interest_rate: number
          msisdn: string | null
          outstanding_principal: number
          principal: number
          product_id: string | null
          product_title: string | null
          provider: string | null
          repayment_frequency_days: number
          service_fee: number
          status: string
          term_months: number
          tier_id: string | null
          total_repayment: number
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_paid?: number
          application_id?: string | null
          country_code?: string | null
          created_at?: string
          currency_code?: string
          disbursed_at?: string | null
          due_at?: string | null
          id?: string
          interest_rate: number
          msisdn?: string | null
          outstanding_principal: number
          principal: number
          product_id?: string | null
          product_title?: string | null
          provider?: string | null
          repayment_frequency_days: number
          service_fee?: number
          status?: string
          term_months: number
          tier_id?: string | null
          total_repayment?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_paid?: number
          application_id?: string | null
          country_code?: string | null
          created_at?: string
          currency_code?: string
          disbursed_at?: string | null
          due_at?: string | null
          id?: string
          interest_rate?: number
          msisdn?: string | null
          outstanding_principal?: number
          principal?: number
          product_id?: string | null
          product_title?: string | null
          provider?: string | null
          repayment_frequency_days?: number
          service_fee?: number
          status?: string
          term_months?: number
          tier_id?: string | null
          total_repayment?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loans_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "loan_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loans_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "loan_tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          application_id: string | null
          audience: string
          body: string
          created_at: string
          id: string
          kind: string
          loan_id: string | null
          read_at: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          application_id?: string | null
          audience?: string
          body: string
          created_at?: string
          id?: string
          kind: string
          loan_id?: string | null
          read_at?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          application_id?: string | null
          audience?: string
          body?: string
          created_at?: string
          id?: string
          kind?: string
          loan_id?: string | null
          read_at?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "loan_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_loan_id_fkey"
            columns: ["loan_id"]
            isOneToOne: false
            referencedRelation: "loans"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_transactions: {
        Row: {
          amount: number
          application_id: string | null
          created_at: string
          currency_code: string
          id: string
          loan_id: string | null
          msisdn: string | null
          occurred_at: string
          provider: string
          provider_ref: string
          raw_payload: Json
          status: string
          tx_type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          application_id?: string | null
          created_at?: string
          currency_code: string
          id?: string
          loan_id?: string | null
          msisdn?: string | null
          occurred_at?: string
          provider: string
          provider_ref: string
          raw_payload?: Json
          status?: string
          tx_type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          application_id?: string | null
          created_at?: string
          currency_code?: string
          id?: string
          loan_id?: string | null
          msisdn?: string | null
          occurred_at?: string
          provider?: string
          provider_ref?: string
          raw_payload?: Json
          status?: string
          tx_type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "loan_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_loan_id_fkey"
            columns: ["loan_id"]
            isOneToOne: false
            referencedRelation: "loans"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          activation_status: string
          address: string | null
          city: string | null
          created_at: string
          date_of_birth: string | null
          first_name: string | null
          gender: string | null
          id: string
          kyc_status: string
          last_name: string | null
          national_id: string | null
          phone: string | null
          province: string | null
          tier_id: string | null
          updated_at: string
        }
        Insert: {
          activation_status?: string
          address?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          first_name?: string | null
          gender?: string | null
          id: string
          kyc_status?: string
          last_name?: string | null
          national_id?: string | null
          phone?: string | null
          province?: string | null
          tier_id?: string | null
          updated_at?: string
        }
        Update: {
          activation_status?: string
          address?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          first_name?: string | null
          gender?: string | null
          id?: string
          kyc_status?: string
          last_name?: string | null
          national_id?: string | null
          phone?: string | null
          province?: string | null
          tier_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "loan_tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          created_at: string
          error: string | null
          event_id: string
          event_type: string | null
          id: string
          payload: Json
          processed_at: string | null
          provider: string
          signature_valid: boolean
        }
        Insert: {
          created_at?: string
          error?: string | null
          event_id: string
          event_type?: string | null
          id?: string
          payload?: Json
          processed_at?: string | null
          provider: string
          signature_valid?: boolean
        }
        Update: {
          created_at?: string
          error?: string | null
          event_id?: string
          event_type?: string | null
          id?: string
          payload?: Json
          processed_at?: string | null
          provider?: string
          signature_valid?: boolean
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_admin: { Args: never; Returns: boolean }
      evaluate_tier_eligibility: {
        Args: { _user_id: string }
        Returns: {
          active_loan_count: number
          eligible: boolean
          outstanding_principal: number
          reasons: string[]
          tier_id: string
          tier_name: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "borrower"
      kyc_doc_status: "pending" | "approved" | "rejected"
      kyc_doc_type: "id_front" | "id_back" | "selfie"
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
      app_role: ["admin", "borrower"],
      kyc_doc_status: ["pending", "approved", "rejected"],
      kyc_doc_type: ["id_front", "id_back", "selfie"],
    },
  },
} as const
