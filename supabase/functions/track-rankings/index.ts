import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { google } from "https://esm.sh/@googleapis/searchconsole@0.1.0"
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
    const searchConsole = google.searchconsole('v1')

    // Auth with Google Search Console
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(Deno.env.get('GOOGLE_CREDENTIALS') || ''),
      scopes: ['https://www.googleapis.com/auth/webmasters'],
    })

    const authClient = await auth.getClient()

    // Get the site URL from environment variable
    const siteUrl = Deno.env.get('SITE_URL')
    if (!siteUrl) throw new Error('Site URL not configured')

    // Get date range (last 30 days)
    const now = new Date()
    const startDate = new Date(now.setDate(now.getDate() - 30)).toISOString().split('T')[0]
    const endDate = new Date().toISOString().split('T')[0]

    // Fetch search analytics data
    const searchData = await searchConsole.searchanalytics.query({
      auth: authClient,
      siteUrl,
      requestBody: {
        startDate,
        endDate,
        dimensions: ['query'],
        rowLimit: 100,
      },
    })

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Process and save each keyword's data
    const rankings = searchData.data.rows?.map((row: any) => ({
      keyword: row.keys[0],
      position: row.position,
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: row.ctr,
    })) || []

    // Batch insert rankings
    const { error: saveError } = await supabase
      .from('rank_tracking')
      .insert(rankings)

    if (saveError) throw saveError

    return new Response(
      JSON.stringify({
        rankings,
        status: 'success'
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
        status: 'error'
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 400,
      }
    )
  }
})
