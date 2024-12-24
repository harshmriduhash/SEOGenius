import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0"
import { google } from "npm:@googleapis/mybusiness@1.0.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { businessName } = await req.json()

    if (!businessName) {
      throw new Error('Business name is required')
    }

    // Initialize Google My Business API
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(Deno.env.get('GOOGLE_CREDENTIALS') || ''),
      scopes: ['https://www.googleapis.com/auth/business.manage'],
    })

    const mybusiness = google.mybusinessbusinessinformation({
      version: 'v1',
      auth: await auth.getClient(),
    })

    // Fetch GMB data
    const gmbData = await mybusiness.accounts.locations.list({
      parent: `accounts/${Deno.env.get('GMB_ACCOUNT_ID')}`,
      readMask: 'name,title,regularHours,primaryPhone,websiteUri,regularHours,primaryCategory,labels',
    })

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY') || '')
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    // Analyze GMB data with Gemini
    const analysisPrompt = `
    Analyze this Google My Business data for ${businessName}:
    ${JSON.stringify(gmbData.data)}

    Provide analysis in this JSON format:
    {
      "gmb_data": {
        "reviews": [{"rating": number, "text": string, "sentiment": string}],
        "metrics": {
          "total_reviews": number,
          "average_rating": number,
          "positive_sentiment_percentage": number
        }
      },
      "local_keywords": string[],
      "recommendations": string[]
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
      .from('local_seo')
      .insert({
        business_name: businessName,
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
