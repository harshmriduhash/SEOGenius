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
    const { url } = await req.json()

    if (!url) {
      throw new Error('URL is required')
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY') || '')
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    // Fetch page data and perform basic checks
    const pageContent = await fetch(url).then(res => res.text())
    
    // Use Chrome Lighthouse API for performance metrics
    const lighthouse = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&key=${Deno.env.get('GOOGLE_API_KEY')}`)
      .then(res => res.json())

    // Use Gemini to analyze the technical SEO aspects
    const auditPrompt = `
    Perform a technical SEO audit for ${url} with this data:

    Page Content:
    ${pageContent}

    Lighthouse Data:
    ${JSON.stringify(lighthouse)}

    Analyze and provide results in this JSON format:
    {
      "broken_links": [{"url": string, "status": number}],
      "meta_issues": [{"page": string, "missing_tags": string[]}],
      "performance": {
        "page_speed": number,
        "core_web_vitals": {
          "lcp": number,
          "fid": number,
          "cls": number
        }
      },
      "recommendations": string[]
    }
    `

    const result = await model.generateContent(auditPrompt)
    const auditResults = JSON.parse(result.response.text())

    // Save to Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { error: saveError } = await supabase
      .from('seo_audit')
      .insert({
        url,
        ...auditResults
      })

    if (saveError) throw saveError

    return new Response(
      JSON.stringify({
        auditResults,
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
