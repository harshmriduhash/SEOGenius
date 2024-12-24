import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { keyword } = await req.json()

    if (!keyword) {
      throw new Error('Missing keyword')
    }

    const serpApiKey = Deno.env.get('SERP_API_KEY')
    if (!serpApiKey) {
      throw new Error('SERP API key not configured')
    }

    // Fetch SERP data
    const params = new URLSearchParams({
      api_key: serpApiKey,
      q: keyword,
      engine: 'google',
    })

    const response = await fetch(`https://serpapi.com/search?${params}`)
    const data = await response.json()

    // Process organic results
    const results = data.organic_results.slice(0, 10).map((result: any, index: number) => ({
      position: index + 1,
      title: result.title,
      description: result.snippet,
      url: result.link,
    }))

    // Save to Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { error: saveError } = await supabase
      .from('serp_results')
      .insert({
        keyword,
        results
      })

    if (saveError) throw saveError

    return new Response(JSON.stringify({ results }), { 
      headers: { 
        ...corsHeaders,
        'Content-Type': 'application/json'
      } 
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 400,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    })
  }
})
