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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string
          data_transferred_mb: number | null
          description: string | null
          id: string
          metadata: Json | null
          node_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          data_transferred_mb?: number | null
          description?: string | null
          id?: string
          metadata?: Json | null
          node_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          data_transferred_mb?: number | null
          description?: string | null
          id?: string
          metadata?: Json | null
          node_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "grid_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          metadata: Json | null
          role: string
          session_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role: string
          session_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "ai_chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_chat_sessions: {
        Row: {
          created_at: string
          id: string
          language: string | null
          metadata: Json | null
          session_token: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          language?: string | null
          metadata?: Json | null
          session_token: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          language?: string | null
          metadata?: Json | null
          session_token?: string
          updated_at?: string
        }
        Relationships: []
      }
      alerts: {
        Row: {
          acknowledged_at: string | null
          created_at: string
          description: string | null
          id: string
          latitude: number | null
          location: string | null
          longitude: number | null
          metadata: Json | null
          node_id: string | null
          resolved_at: string | null
          severity: Database["public"]["Enums"]["alert_severity"]
          status: Database["public"]["Enums"]["alert_status"]
          title: string
          updated_at: string
        }
        Insert: {
          acknowledged_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          metadata?: Json | null
          node_id?: string | null
          resolved_at?: string | null
          severity?: Database["public"]["Enums"]["alert_severity"]
          status?: Database["public"]["Enums"]["alert_status"]
          title: string
          updated_at?: string
        }
        Update: {
          acknowledged_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          metadata?: Json | null
          node_id?: string | null
          resolved_at?: string | null
          severity?: Database["public"]["Enums"]["alert_severity"]
          status?: Database["public"]["Enums"]["alert_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "grid_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      donations: {
        Row: {
          amount_kobo: number
          amount_ngn: number | null
          completed_at: string | null
          created_at: string
          currency: string
          donor_name: string | null
          donor_phone: string | null
          email: string
          id: string
          location: string | null
          metadata: Json | null
          mission_id: string | null
          mission_type: string | null
          notify_sms: boolean | null
          payment_reference: string | null
          status: string
        }
        Insert: {
          amount_kobo: number
          amount_ngn?: number | null
          completed_at?: string | null
          created_at?: string
          currency?: string
          donor_name?: string | null
          donor_phone?: string | null
          email: string
          id?: string
          location?: string | null
          metadata?: Json | null
          mission_id?: string | null
          mission_type?: string | null
          notify_sms?: boolean | null
          payment_reference?: string | null
          status?: string
        }
        Update: {
          amount_kobo?: number
          amount_ngn?: number | null
          completed_at?: string | null
          created_at?: string
          currency?: string
          donor_name?: string | null
          donor_phone?: string | null
          email?: string
          id?: string
          location?: string | null
          metadata?: Json | null
          mission_id?: string | null
          mission_type?: string | null
          notify_sms?: boolean | null
          payment_reference?: string | null
          status?: string
        }
        Relationships: []
      }
      grid_nodes: {
        Row: {
          component_type: Database["public"]["Enums"]["component_type"]
          created_at: string
          data_rate_gbps: number | null
          id: string
          last_ping_at: string | null
          latitude: number | null
          longitude: number | null
          metadata: Json | null
          name: string
          region: string | null
          status: Database["public"]["Enums"]["node_status"]
          updated_at: string
          uptime_percent: number | null
        }
        Insert: {
          component_type: Database["public"]["Enums"]["component_type"]
          created_at?: string
          data_rate_gbps?: number | null
          id?: string
          last_ping_at?: string | null
          latitude?: number | null
          longitude?: number | null
          metadata?: Json | null
          name: string
          region?: string | null
          status?: Database["public"]["Enums"]["node_status"]
          updated_at?: string
          uptime_percent?: number | null
        }
        Update: {
          component_type?: Database["public"]["Enums"]["component_type"]
          created_at?: string
          data_rate_gbps?: number | null
          id?: string
          last_ping_at?: string | null
          latitude?: number | null
          longitude?: number | null
          metadata?: Json | null
          name?: string
          region?: string | null
          status?: Database["public"]["Enums"]["node_status"]
          updated_at?: string
          uptime_percent?: number | null
        }
        Relationships: []
      }
      sms_notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          metadata: Json | null
          notification_type: string
          phone_number: string
          related_id: string | null
          sent_at: string | null
          status: string
          twilio_sid: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          metadata?: Json | null
          notification_type: string
          phone_number: string
          related_id?: string | null
          sent_at?: string | null
          status?: string
          twilio_sid?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          metadata?: Json | null
          notification_type?: string
          phone_number?: string
          related_id?: string | null
          sent_at?: string | null
          status?: string
          twilio_sid?: string | null
        }
        Relationships: []
      }
      system_metrics: {
        Row: {
          component_type: Database["public"]["Enums"]["component_type"] | null
          id: string
          metric_name: string
          metric_value: number
          recorded_at: string
          unit: string | null
        }
        Insert: {
          component_type?: Database["public"]["Enums"]["component_type"] | null
          id?: string
          metric_name: string
          metric_value: number
          recorded_at?: string
          unit?: string | null
        }
        Update: {
          component_type?: Database["public"]["Enums"]["component_type"] | null
          id?: string
          metric_name?: string
          metric_value?: number
          recorded_at?: string
          unit?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      alert_severity: "info" | "warning" | "critical" | "emergency"
      alert_status: "open" | "acknowledged" | "in_progress" | "resolved"
      component_type:
        | "micro_hub"
        | "sensing_mesh"
        | "compassion_ledger"
        | "response_swarms"
        | "ai_companion"
      node_status:
        | "active"
        | "processing"
        | "standby"
        | "offline"
        | "maintenance"
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
      alert_severity: ["info", "warning", "critical", "emergency"],
      alert_status: ["open", "acknowledged", "in_progress", "resolved"],
      component_type: [
        "micro_hub",
        "sensing_mesh",
        "compassion_ledger",
        "response_swarms",
        "ai_companion",
      ],
      node_status: [
        "active",
        "processing",
        "standby",
        "offline",
        "maintenance",
      ],
    },
  },
} as const
