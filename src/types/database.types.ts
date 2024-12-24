export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          full_name: string | null
          avatar_url: string | null
          website: string | null
          company: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          company?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          company?: string | null
        }
      }
      seo_content: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          title: string
          content: string
          language: string
          status: string
          meta_description: string | null
          keywords: string[] | null
          url: string | null
          page_type: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          title: string
          content: string
          language?: string
          status?: string
          meta_description?: string | null
          keywords?: string[] | null
          url?: string | null
          page_type?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          title?: string
          content?: string
          language?: string
          status?: string
          meta_description?: string | null
          keywords?: string[] | null
          url?: string | null
          page_type?: string | null
        }
      }
      keyword_analysis: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          keyword: string
          search_volume: number | null
          difficulty: number | null
          cpc: number | null
          competition: number | null
          intent: string | null
          related_keywords: string[] | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          keyword: string
          search_volume?: number | null
          difficulty?: number | null
          cpc?: number | null
          competition?: number | null
          intent?: string | null
          related_keywords?: string[] | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          keyword?: string
          search_volume?: number | null
          difficulty?: number | null
          cpc?: number | null
          competition?: number | null
          intent?: string | null
          related_keywords?: string[] | null
        }
      }
      backlink_analysis: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          source_url: string
          target_url: string
          anchor_text: string | null
          domain_authority: number | null
          page_authority: number | null
          follow: boolean
          status: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          source_url: string
          target_url: string
          anchor_text?: string | null
          domain_authority?: number | null
          page_authority?: number | null
          follow?: boolean
          status?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          source_url?: string
          target_url?: string
          anchor_text?: string | null
          domain_authority?: number | null
          page_authority?: number | null
          follow?: boolean
          status?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
