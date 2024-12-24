import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "@google/generative-ai"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { content, targetLanguage, userId } = await req.json()

    if (!content || !targetLanguage || !userId) {
      throw new Error('Missing required fields')
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY') || '')
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `
    Translate and optimize the following content for SEO in ${targetLanguage}:

    ${content}

    Requirements:
    1. Translate accurately while preserving meaning
    2. Adapt cultural nuances and expressions
    3. Optimize for SEO in the target language
    4. Maintain proper formatting and structure
    5. Include relevant local keywords

    Provide the response in this format:
    ---CONTENT---
    {translated content}
    ---METADATA---
    {
      "local_keywords": [],
      "meta_description": "",
      "title_tag": "",
      "hreflang_tag": ""
    }
    `

    const result = await model.generateContent(prompt)
    const response = result.response.text()

    // Parse the response
    const [contentPart, metadataPart] = response.split('---METADATA---')
    const translatedContent = contentPart.replace('---CONTENT---', '').trim()
    const seoMetadata = JSON.parse(metadataPart.trim())

    return new Response(
      JSON.stringify({
        translatedContent,
        seoMetadata,
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
