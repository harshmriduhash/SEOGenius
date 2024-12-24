import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "@google/generative-ai"
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
    const { domain } = await req.json()

    if (!domain) {
      throw new Error('Domain is required')
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY') || '')
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    // Analyze backlinks using Moz API (you'll need to implement this)
    const mozApiKey = Deno.env.get('MOZ_API_KEY')
    const backlinksData = await fetch(`https://lsapi.seomoz.com/v2/links?target=${domain}`, {
      headers: { Authorization: `Bearer ${mozApiKey}` }
    }).then(res => res.json())

    // Use Gemini to analyze toxic links and opportunities
    const analysisPrompt = `
    Analyze these backlinks for ${domain} and identify:
    1. Potentially toxic links based on domain metrics and relevance
    2. Link-building opportunities based on competitor analysis
    3. Overall domain authority and health metrics

    Backlinks data:
    ${JSON.stringify(backlinksData)}

    Format response as JSON with:
    {
      "toxic_links": [{"url": string, "reason": string}],
      "opportunities": [{"domain": string, "relevance": number, "strategy": string}],
      "metrics": {
        "total_backlinks": number,
        "toxic_percentage": number,
        "domain_authority": number
      }
    }
    `

    const result = await model.generateContent(analysisPrompt)
    const analysis = JSON.parse(result.response.text())

    // Save to Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { error: saveError } = await supabase
      .from('backlinks')
      .insert({
        domain,
        ...analysis
      })

    if (saveError) throw saveError

    return new Response(
      JSON.stringify({
        analysis,
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
