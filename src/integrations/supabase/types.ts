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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      app_settings: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          is_public: boolean | null
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          new_data: Json | null
          old_data: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          cancellation_reason: string | null
          cancelled_at: string | null
          company_name: string | null
          country_code: string | null
          created_at: string
          currency: string | null
          customer_address: string
          customer_email: string | null
          customer_name: string
          customer_phone: string
          customer_type: Database["public"]["Enums"]["user_type"] | null
          discount_amount: number | null
          electricity_available: boolean | null
          id: string
          lead_id: string | null
          license_plate: string | null
          package_id: string | null
          parking_details: string | null
          promo_code: string | null
          quote_id: string | null
          referral_code_used: string | null
          rescheduled_from: string | null
          scheduled_date: string
          scheduled_time: string
          service_id: string | null
          source: string | null
          special_instructions: string | null
          status: string
          total_amount: number
          updated_at: string
          user_id: string | null
          vehicle_color: string | null
          vehicle_make: string | null
          vehicle_model: string | null
          vehicle_notes: string | null
          vehicle_type: string | null
          vehicle_year: number | null
          water_available: boolean | null
        }
        Insert: {
          cancellation_reason?: string | null
          cancelled_at?: string | null
          company_name?: string | null
          country_code?: string | null
          created_at?: string
          currency?: string | null
          customer_address: string
          customer_email?: string | null
          customer_name: string
          customer_phone: string
          customer_type?: Database["public"]["Enums"]["user_type"] | null
          discount_amount?: number | null
          electricity_available?: boolean | null
          id?: string
          lead_id?: string | null
          license_plate?: string | null
          package_id?: string | null
          parking_details?: string | null
          promo_code?: string | null
          quote_id?: string | null
          referral_code_used?: string | null
          rescheduled_from?: string | null
          scheduled_date: string
          scheduled_time: string
          service_id?: string | null
          source?: string | null
          special_instructions?: string | null
          status?: string
          total_amount: number
          updated_at?: string
          user_id?: string | null
          vehicle_color?: string | null
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_notes?: string | null
          vehicle_type?: string | null
          vehicle_year?: number | null
          water_available?: boolean | null
        }
        Update: {
          cancellation_reason?: string | null
          cancelled_at?: string | null
          company_name?: string | null
          country_code?: string | null
          created_at?: string
          currency?: string | null
          customer_address?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string
          customer_type?: Database["public"]["Enums"]["user_type"] | null
          discount_amount?: number | null
          electricity_available?: boolean | null
          id?: string
          lead_id?: string | null
          license_plate?: string | null
          package_id?: string | null
          parking_details?: string | null
          promo_code?: string | null
          quote_id?: string | null
          referral_code_used?: string | null
          rescheduled_from?: string | null
          scheduled_date?: string
          scheduled_time?: string
          service_id?: string | null
          source?: string | null
          special_instructions?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string | null
          vehicle_color?: string | null
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_notes?: string | null
          vehicle_type?: string | null
          vehicle_year?: number | null
          water_available?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "package_tiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          billing_address: string | null
          booking_id: string | null
          created_at: string
          currency: string | null
          customer_email: string | null
          customer_id: string | null
          customer_name: string
          customer_phone: string | null
          discount_amount: number | null
          due_date: string | null
          id: string
          invoice_number: string
          line_items: Json
          notes: string | null
          paid_at: string | null
          payment_method: string | null
          payment_reference: string | null
          quote_id: string | null
          status: string | null
          subtotal: number
          tax_amount: number | null
          tax_rate: number | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          billing_address?: string | null
          booking_id?: string | null
          created_at?: string
          currency?: string | null
          customer_email?: string | null
          customer_id?: string | null
          customer_name: string
          customer_phone?: string | null
          discount_amount?: number | null
          due_date?: string | null
          id?: string
          invoice_number: string
          line_items?: Json
          notes?: string | null
          paid_at?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          quote_id?: string | null
          status?: string | null
          subtotal?: number
          tax_amount?: number | null
          tax_rate?: number | null
          total_amount?: number
          updated_at?: string
        }
        Update: {
          billing_address?: string | null
          booking_id?: string | null
          created_at?: string
          currency?: string | null
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string | null
          discount_amount?: number | null
          due_date?: string | null
          id?: string
          invoice_number?: string
          line_items?: Json
          notes?: string | null
          paid_at?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          quote_id?: string | null
          status?: string | null
          subtotal?: number
          tax_amount?: number | null
          tax_rate?: number | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      job_assignments: {
        Row: {
          accepted_at: string | null
          after_photos: string[] | null
          assigned_at: string | null
          before_photos: string[] | null
          booking_id: string
          check_in_location: Json | null
          check_out_location: Json | null
          completed_at: string | null
          created_at: string
          customer_signature: string | null
          id: string
          notes: string | null
          started_at: string | null
          status: string | null
          updated_at: string
          vendor_id: string | null
          vendor_notes: string | null
        }
        Insert: {
          accepted_at?: string | null
          after_photos?: string[] | null
          assigned_at?: string | null
          before_photos?: string[] | null
          booking_id: string
          check_in_location?: Json | null
          check_out_location?: Json | null
          completed_at?: string | null
          created_at?: string
          customer_signature?: string | null
          id?: string
          notes?: string | null
          started_at?: string | null
          status?: string | null
          updated_at?: string
          vendor_id?: string | null
          vendor_notes?: string | null
        }
        Update: {
          accepted_at?: string | null
          after_photos?: string[] | null
          assigned_at?: string | null
          before_photos?: string[] | null
          booking_id?: string
          check_in_location?: Json | null
          check_out_location?: Json | null
          completed_at?: string | null
          created_at?: string
          customer_signature?: string | null
          id?: string
          notes?: string | null
          started_at?: string | null
          status?: string | null
          updated_at?: string
          vendor_id?: string | null
          vendor_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_assignments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_assignments_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_assignments_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors_public"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          assigned_to: string | null
          booking_id: string | null
          company_name: string | null
          converted_at: string | null
          country_code: string | null
          created_at: string
          customer_email: string | null
          customer_name: string
          customer_phone: string
          first_contact_at: string | null
          follow_up_count: number | null
          id: string
          last_contact_at: string | null
          lead_score: number | null
          message: string | null
          next_follow_up: string | null
          notes: Json | null
          referral_code: string | null
          service_interest: string[] | null
          source: string
          status: Database["public"]["Enums"]["lead_status"]
          updated_at: string
          user_type: Database["public"]["Enums"]["user_type"] | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          assigned_to?: string | null
          booking_id?: string | null
          company_name?: string | null
          converted_at?: string | null
          country_code?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name: string
          customer_phone: string
          first_contact_at?: string | null
          follow_up_count?: number | null
          id?: string
          last_contact_at?: string | null
          lead_score?: number | null
          message?: string | null
          next_follow_up?: string | null
          notes?: Json | null
          referral_code?: string | null
          service_interest?: string[] | null
          source?: string
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"] | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          assigned_to?: string | null
          booking_id?: string | null
          company_name?: string | null
          converted_at?: string | null
          country_code?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string
          first_contact_at?: string | null
          follow_up_count?: number | null
          id?: string
          last_contact_at?: string | null
          lead_score?: number | null
          message?: string | null
          next_follow_up?: string | null
          notes?: Json | null
          referral_code?: string | null
          service_interest?: string[] | null
          source?: string
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"] | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "vendors_public"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          message: string
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          message: string
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          message?: string
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      package_tiers: {
        Row: {
          created_at: string
          description: string | null
          features: Json | null
          id: string
          is_active: boolean
          name: string
          price_multiplier: number
          type: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean
          name: string
          price_multiplier?: number
          type: string
        }
        Update: {
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean
          name?: string
          price_multiplier?: number
          type?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string
          currency: string | null
          customer_email: string | null
          customer_name: string
          customer_phone: string | null
          id: string
          metadata: Json | null
          payment_method: string
          payment_provider: string
          provider_reference: string | null
          receipt_number: string | null
          service_name: string | null
          status: string | null
          transaction_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          booking_id?: string | null
          created_at?: string
          currency?: string | null
          customer_email?: string | null
          customer_name: string
          customer_phone?: string | null
          id?: string
          metadata?: Json | null
          payment_method: string
          payment_provider: string
          provider_reference?: string | null
          receipt_number?: string | null
          service_name?: string | null
          status?: string | null
          transaction_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string
          currency?: string | null
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string
          payment_provider?: string
          provider_reference?: string | null
          receipt_number?: string | null
          service_name?: string | null
          status?: string | null
          transaction_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          billing_address: string | null
          company_name: string | null
          company_registration: string | null
          country_code: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          is_verified: boolean | null
          phone: string | null
          preferred_currency: string | null
          preferred_language: string | null
          tax_id: string | null
          timezone: string | null
          updated_at: string
          user_id: string
          user_type: Database["public"]["Enums"]["user_type"] | null
        }
        Insert: {
          avatar_url?: string | null
          billing_address?: string | null
          company_name?: string | null
          company_registration?: string | null
          country_code?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          is_verified?: boolean | null
          phone?: string | null
          preferred_currency?: string | null
          preferred_language?: string | null
          tax_id?: string | null
          timezone?: string | null
          updated_at?: string
          user_id: string
          user_type?: Database["public"]["Enums"]["user_type"] | null
        }
        Update: {
          avatar_url?: string | null
          billing_address?: string | null
          company_name?: string | null
          company_registration?: string | null
          country_code?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          is_verified?: boolean | null
          phone?: string | null
          preferred_currency?: string | null
          preferred_language?: string | null
          tax_id?: string | null
          timezone?: string | null
          updated_at?: string
          user_id?: string
          user_type?: Database["public"]["Enums"]["user_type"] | null
        }
        Relationships: []
      }
      promotions: {
        Row: {
          applicable_services: string[] | null
          applicable_user_types:
            | Database["public"]["Enums"]["user_type"][]
            | null
          code: string
          created_at: string
          description: string | null
          discount_type: string
          discount_value: number
          expires_at: string | null
          id: string
          is_active: boolean | null
          max_discount_amount: number | null
          min_order_amount: number | null
          name: string
          starts_at: string
          updated_at: string
          usage_count: number | null
          usage_limit: number | null
        }
        Insert: {
          applicable_services?: string[] | null
          applicable_user_types?:
            | Database["public"]["Enums"]["user_type"][]
            | null
          code: string
          created_at?: string
          description?: string | null
          discount_type?: string
          discount_value: number
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_discount_amount?: number | null
          min_order_amount?: number | null
          name: string
          starts_at?: string
          updated_at?: string
          usage_count?: number | null
          usage_limit?: number | null
        }
        Update: {
          applicable_services?: string[] | null
          applicable_user_types?:
            | Database["public"]["Enums"]["user_type"][]
            | null
          code?: string
          created_at?: string
          description?: string | null
          discount_type?: string
          discount_value?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_discount_amount?: number | null
          min_order_amount?: number | null
          name?: string
          starts_at?: string
          updated_at?: string
          usage_count?: number | null
          usage_limit?: number | null
        }
        Relationships: []
      }
      quotes: {
        Row: {
          accepted_at: string | null
          created_at: string
          created_by: string | null
          currency: string | null
          customer_email: string | null
          customer_id: string | null
          customer_name: string
          customer_phone: string | null
          discount_amount: number | null
          discount_reason: string | null
          id: string
          lead_id: string | null
          notes: string | null
          quote_number: string
          rejected_at: string | null
          sent_at: string | null
          services: Json
          status: string | null
          subtotal: number
          tax_amount: number | null
          tax_rate: number | null
          terms_conditions: string | null
          total_amount: number
          updated_at: string
          valid_until: string | null
          viewed_at: string | null
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string | null
          customer_email?: string | null
          customer_id?: string | null
          customer_name: string
          customer_phone?: string | null
          discount_amount?: number | null
          discount_reason?: string | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          quote_number: string
          rejected_at?: string | null
          sent_at?: string | null
          services?: Json
          status?: string | null
          subtotal?: number
          tax_amount?: number | null
          tax_rate?: number | null
          terms_conditions?: string | null
          total_amount?: number
          updated_at?: string
          valid_until?: string | null
          viewed_at?: string | null
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string | null
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string | null
          discount_amount?: number | null
          discount_reason?: string | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          quote_number?: string
          rejected_at?: string | null
          sent_at?: string | null
          services?: Json
          status?: string | null
          subtotal?: number
          tax_amount?: number | null
          tax_rate?: number | null
          terms_conditions?: string | null
          total_amount?: number
          updated_at?: string
          valid_until?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_codes: {
        Row: {
          code: string
          created_at: string
          id: string
          is_active: boolean
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          is_active?: boolean
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          user_id?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string
          credit_amount: number
          credited_at: string | null
          currency: string
          id: string
          referral_code: string
          referred_booking_id: string | null
          referred_user_id: string | null
          referrer_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          credit_amount?: number
          credited_at?: string | null
          currency?: string
          id?: string
          referral_code: string
          referred_booking_id?: string | null
          referred_user_id?: string | null
          referrer_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          credit_amount?: number
          credited_at?: string | null
          currency?: string
          id?: string
          referral_code?: string
          referred_booking_id?: string | null
          referred_user_id?: string | null
          referrer_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referred_booking_id_fkey"
            columns: ["referred_booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          booking_id: string
          comment: string | null
          created_at: string
          customer_id: string | null
          helpful_count: number | null
          id: string
          is_public: boolean | null
          is_verified: boolean | null
          rating: number
          response: string | null
          response_at: string | null
          title: string | null
          updated_at: string
          vendor_id: string | null
        }
        Insert: {
          booking_id: string
          comment?: string | null
          created_at?: string
          customer_id?: string | null
          helpful_count?: number | null
          id?: string
          is_public?: boolean | null
          is_verified?: boolean | null
          rating: number
          response?: string | null
          response_at?: string | null
          title?: string | null
          updated_at?: string
          vendor_id?: string | null
        }
        Update: {
          booking_id?: string
          comment?: string | null
          created_at?: string
          customer_id?: string | null
          helpful_count?: number | null
          id?: string
          is_public?: boolean | null
          is_verified?: boolean | null
          rating?: number
          response?: string | null
          response_at?: string | null
          title?: string | null
          updated_at?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors_public"
            referencedColumns: ["id"]
          },
        ]
      }
      service_categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          base_price: number
          category_id: string | null
          created_at: string
          description: string | null
          duration_hours: number | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          base_price?: number
          category_id?: string | null
          created_at?: string
          description?: string | null
          duration_hours?: number | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          base_price?: number
          category_id?: string | null
          created_at?: string
          description?: string | null
          duration_hours?: number | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_credits: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          granted_at: string | null
          granted_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vendors: {
        Row: {
          bank_details: Json | null
          commission_rate: number | null
          created_at: string
          documents: Json | null
          email: string | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          name: string
          phone: string
          profile_image: string | null
          rating: number | null
          service_areas: string[] | null
          specializations: string[] | null
          total_jobs: number | null
          total_reviews: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          bank_details?: Json | null
          commission_rate?: number | null
          created_at?: string
          documents?: Json | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          name: string
          phone: string
          profile_image?: string | null
          rating?: number | null
          service_areas?: string[] | null
          specializations?: string[] | null
          total_jobs?: number | null
          total_reviews?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          bank_details?: Json | null
          commission_rate?: number | null
          created_at?: string
          documents?: Json | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          name?: string
          phone?: string
          profile_image?: string | null
          rating?: number | null
          service_areas?: string[] | null
          specializations?: string[] | null
          total_jobs?: number | null
          total_reviews?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      vendors_public: {
        Row: {
          created_at: string | null
          email: string | null
          id: string | null
          is_active: boolean | null
          is_verified: boolean | null
          name: string | null
          phone: string | null
          profile_image: string | null
          rating: number | null
          service_areas: string[] | null
          specializations: string[] | null
          total_jobs: number | null
          total_reviews: number | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string | null
          is_active?: boolean | null
          is_verified?: boolean | null
          name?: string | null
          phone?: string | null
          profile_image?: string | null
          rating?: number | null
          service_areas?: string[] | null
          specializations?: string[] | null
          total_jobs?: number | null
          total_reviews?: number | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string | null
          is_active?: boolean | null
          is_verified?: boolean | null
          name?: string | null
          phone?: string | null
          profile_image?: string | null
          rating?: number | null
          service_areas?: string[] | null
          specializations?: string[] | null
          total_jobs?: number | null
          total_reviews?: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      generate_referral_code: { Args: { user_uuid: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "manager" | "vendor" | "customer"
      booking_status:
        | "pending"
        | "confirmed"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "rescheduled"
      lead_status:
        | "new"
        | "contacted"
        | "qualified"
        | "proposal"
        | "negotiation"
        | "won"
        | "lost"
        | "abandoned"
      user_type: "home" | "business" | "government"
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
      app_role: ["admin", "manager", "vendor", "customer"],
      booking_status: [
        "pending",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
        "rescheduled",
      ],
      lead_status: [
        "new",
        "contacted",
        "qualified",
        "proposal",
        "negotiation",
        "won",
        "lost",
        "abandoned",
      ],
      user_type: ["home", "business", "government"],
    },
  },
} as const
