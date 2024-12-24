export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          website: string | null;
          company: string | null;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          website?: string | null;
          company?: string | null;
        };
        Update: {
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          website?: string | null;
          company?: string | null;
        };
      };
      chat_logs: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          role: "user" | "assistant";
          content: string;
        };
        Insert: {
          user_id: string;
          role: "user" | "assistant";
          content: string;
        };
        Update: {
          content?: string;
          role?: "user" | "assistant";
        };
      };
      seo_content: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          user_id: string;
          title: string;
          content: string;
          language: string;
          status: string;
          meta_description: string | null;
          keywords: string[] | null;
          url: string | null;
          page_type: string | null;
        };
        Insert: {
          user_id: string;
          title: string;
          content: string;
          language?: string;
          status?: string;
          meta_description?: string | null;
          keywords?: string[] | null;
          url?: string | null;
          page_type?: string | null;
        };
        Update: {
          title?: string;
          content?: string;
          language?: string;
          status?: string;
          meta_description?: string | null;
          keywords?: string[] | null;
          url?: string | null;
          page_type?: string | null;
        };
      };
      rank_tracking: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          keyword: string;
          position: number;
          clicks: number;
          impressions: number;
          ctr: number;
        };
        Insert: {
          user_id: string;
          keyword: string;
          position: number;
          clicks: number;
          impressions: number;
          ctr: number;
        };
        Update: {
          keyword?: string;
          position?: number;
          clicks?: number;
          impressions?: number;
          ctr?: number;
        };
      };
      backlinks: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          source_url: string;
          target_url: string;
          anchor_text: string | null;
          domain_authority: number | null;
          page_authority: number | null;
          follow: boolean;
          status: string | null;
        };
        Insert: {
          user_id: string;
          source_url: string;
          target_url: string;
          anchor_text?: string | null;
          domain_authority?: number | null;
          page_authority?: number | null;
          follow?: boolean;
          status?: string | null;
        };
        Update: {
          source_url?: string;
          target_url?: string;
          anchor_text?: string | null;
          domain_authority?: number | null;
          page_authority?: number | null;
          follow?: boolean;
          status?: string | null;
        };
      };
      keyword_analysis: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          keyword: string;
          search_volume: number;
          difficulty: number;
          cpc: number;
          competition: number;
        };
        Insert: {
          user_id: string;
          keyword: string;
          search_volume: number;
          difficulty: number;
          cpc: number;
          competition: number;
        };
        Update: {
          keyword?: string;
          search_volume?: number;
          difficulty?: number;
          cpc?: number;
          competition?: number;
        };
      };
      backlink_analysis: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          domain: string;
          total_backlinks: number;
          referring_domains: number;
          domain_rating: number;
          organic_traffic: number;
        };
        Insert: {
          user_id: string;
          domain: string;
          total_backlinks: number;
          referring_domains: number;
          domain_rating: number;
          organic_traffic: number;
        };
        Update: {
          domain?: string;
          total_backlinks?: number;
          referring_domains?: number;
          domain_rating?: number;
          organic_traffic?: number;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
