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
      alerts: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          receiver_id: string | null
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          receiver_id?: string | null
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          receiver_id?: string | null
          type?: string
        }
        Relationships: []
      }
      attendance: {
        Row: {
          created_at: string
          date: string
          id: string
          marked_by: string | null
          status: string
          student_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          marked_by?: string | null
          status: string
          student_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          marked_by?: string | null
          status?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      doctors: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          specialization: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          phone?: string | null
          specialization?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          specialization?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          event_date: string
          event_time: string | null
          google_form_link: string | null
          id: string
          title: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          event_date: string
          event_time?: string | null
          google_form_link?: string | null
          id?: string
          title: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          event_date?: string
          event_time?: string | null
          google_form_link?: string | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          id: string
          name: string
          email: string
          subject: string
          message: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          subject: string
          message: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          subject?: string
          message?: string
          status?: string
          created_at?: string
        }
        Relationships: []
      }
      health_records: {
        Row: {
          blood_group: string | null
          bmi: number | null
          created_at: string
          doctor_notes: string | null
          feeling_status: string | null
          height: number | null
          id: string
          last_checkup: string | null
          medical_conditions: string | null
          student_id: string
          updated_at: string
          updated_by: string | null
          vaccination_status: string | null
          weight: number | null
        }
        Insert: {
          blood_group?: string | null
          bmi?: number | null
          created_at?: string
          doctor_notes?: string | null
          feeling_status?: string | null
          height?: number | null
          id?: string
          last_checkup?: string | null
          medical_conditions?: string | null
          student_id: string
          updated_at?: string
          updated_by?: string | null
          vaccination_status?: string | null
          weight?: number | null
        }
        Update: {
          blood_group?: string | null
          bmi?: number | null
          created_at?: string
          doctor_notes?: string | null
          feeling_status?: string | null
          height?: number | null
          id?: string
          last_checkup?: string | null
          medical_conditions?: string | null
          student_id?: string
          updated_at?: string
          updated_by?: string | null
          vaccination_status?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "health_records_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_letters: {
        Row: {
          created_at: string
          from_date: string
          id: string
          reason: string
          reviewed_by: string | null
          status: string
          student_id: string
          submitted_by: string | null
          to_date: string
        }
        Insert: {
          created_at?: string
          from_date: string
          id?: string
          reason: string
          reviewed_by?: string | null
          status?: string
          student_id: string
          submitted_by?: string | null
          to_date: string
        }
        Update: {
          created_at?: string
          from_date?: string
          id?: string
          reason?: string
          reviewed_by?: string | null
          status?: string
          student_id?: string
          submitted_by?: string | null
          to_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "leave_letters_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      marks: {
        Row: {
          created_at: string
          created_by: string | null
          date: string
          exam_type: string
          id: string
          marks: number
          max_marks: number
          student_id: string
          subject: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          date?: string
          exam_type: string
          id?: string
          marks: number
          max_marks?: number
          student_id: string
          subject: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          date?: string
          exam_type?: string
          id?: string
          marks?: number
          max_marks?: number
          student_id?: string
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "marks_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      parents: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          linked_student_sr: string | null
          phone: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          linked_student_sr?: string | null
          phone: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          linked_student_sr?: string | null
          phone?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      students: {
        Row: {
          class: string
          created_at: string
          date_of_birth: string | null
          full_name: string
          id: string
          parent_id: string | null
          section: string | null
          sr_number: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          class: string
          created_at?: string
          date_of_birth?: string | null
          full_name: string
          id?: string
          parent_id?: string | null
          section?: string | null
          sr_number: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          class?: string
          created_at?: string
          date_of_birth?: string | null
          full_name?: string
          id?: string
          parent_id?: string | null
          section?: string | null
          sr_number?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_parent"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "parents"
            referencedColumns: ["id"]
          },
        ]
      }
      teachers: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          subject: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          phone?: string | null
          subject: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          subject?: string
          user_id?: string | null
        }
        Relationships: []
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
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
      app_role: "student" | "parent" | "teacher" | "doctor" | "admin"
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
      app_role: ["student", "parent", "teacher", "doctor", "admin"],
    },
  },
} as const
