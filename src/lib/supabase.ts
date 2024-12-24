import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'
import type { RealtimeChannel } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Real-time subscriptions helper
export const subscribeToChannel = <T extends Record<string, any>>(
  channel: string,
  callback: (payload: T) => void
): RealtimeChannel => {
  return supabase
    .channel(channel)
    .on('INSERT' as never, { event: 'INSERT', schema: 'public' }, (payload) => callback(payload.new as T))
    .on('UPDATE' as never, { event: 'UPDATE', schema: 'public' }, (payload) => callback(payload.new as T))
    .on('DELETE' as never, { event: 'DELETE', schema: 'public' }, (payload) => callback(payload.old as T))
    .subscribe()
}

// Common database queries
export const queries = {
  // Profile queries
  async getProfile(userId: string) {
    return supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
  },

  async updateProfile(userId: string, data: Database['public']['Tables']['profiles']['Update']) {
    return supabase
      .from('profiles')
      .update(data)
      .eq('id', userId)
  },

  // SEO Content queries
  async getContent(userId: string) {
    return supabase
      .from('seo_content')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
  },

  async createContent(data: Database['public']['Tables']['seo_content']['Insert']) {
    return supabase
      .from('seo_content')
      .insert(data)
  },

  async updateContent(id: string, data: Database['public']['Tables']['seo_content']['Update']) {
    return supabase
      .from('seo_content')
      .update(data)
      .eq('id', id)
  },

  // Keyword Analysis queries
  async getKeywordAnalysis(userId: string) {
    return supabase
      .from('keyword_analysis')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
  },

  async createKeywordAnalysis(data: Database['public']['Tables']['keyword_analysis']['Insert']) {
    return supabase
      .from('keyword_analysis')
      .insert(data)
  },

  // Backlink Analysis queries
  async getBacklinks(userId: string) {
    return supabase
      .from('backlink_analysis')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
  },

  async createBacklink(data: Database['public']['Tables']['backlink_analysis']['Insert']) {
    return supabase
      .from('backlink_analysis')
      .insert(data)
  },

  async updateBacklink(id: string, data: Database['public']['Tables']['backlink_analysis']['Update']) {
    return supabase
      .from('backlink_analysis')
      .update(data)
      .eq('id', id)
  }
}
