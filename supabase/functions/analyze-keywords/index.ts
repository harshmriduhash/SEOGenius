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
    const { keywords, user_id } = await req.json()

    if (!keywords || !user_id) {
      throw new Error('Missing required fields')
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY') || '')
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `
    Analyze the following keywords and categorize them by search intent:
    ${keywords.join(', ')}

    Group them into these categories:
    1. Informational (users seeking information)
    2. Navigational (users looking for specific websites/brands)
    3. Transactional (users intending to make a purchase)

    Respond in JSON format like this:
    {
      "informational": ["keyword1", "keyword2"],
      "navigational": ["keyword3"],
      "transactional": ["keyword4", "keyword5"]
    }
    `

    const result = await model.generateContent(prompt)
    const response = result.response
    const clusters = JSON.parse(response.text())

    // Save to Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { error: saveError } = await supabase
      .from('seo_data')
      .insert({
        user_id,
        keywords,
        clusters
      })

    if (saveError) throw saveError

    return new Response(
      JSON.stringify({
        clusters,
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
