// jela-website/src/lib/supabase.ts

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client with service role key (for API routes only)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

// Database types (will be auto-generated in the future with Supabase CLI)
export type Database = {
  public: {
    Tables: {
      portfolio_images: {
        Row: {
          id: string
          image_url: string
          title: string | null
          description: string | null
          category: string | null
          order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          image_url: string
          title?: string | null
          description?: string | null
          category?: string | null
          order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          image_url?: string
          title?: string | null
          description?: string | null
          category?: string | null
          order?: number
          created_at?: string
          updated_at?: string
        }
      }
      hero_images: {
        Row: {
          id: string
          image_url: string
          position: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          image_url: string
          position: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          image_url?: string
          position?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      newsletter_subscribers: {
        Row: {
          id: string
          email: string
          subscribed_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          email: string
          subscribed_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          email?: string
          subscribed_at?: string
          is_active?: boolean
        }
      }
      contact_submissions: {
        Row: {
          id: string
          full_name: string
          email: string
          phone: string | null
          message: string
          submitted_at: string
          status: string
        }
        Insert: {
          id?: string
          full_name: string
          email: string
          phone?: string | null
          message: string
          submitted_at?: string
          status?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          phone?: string | null
          message?: string
          submitted_at?: string
          status?: string
        }
      }
    }
  }
}