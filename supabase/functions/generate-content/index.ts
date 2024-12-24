import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "@google/generative-ai"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { topic, targetAudience, keywords } = await req.json()

    // Validate input
    if (!topic || !targetAudience || !keywords) {
      throw new Error('Missing required fields')
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY') || '')
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    // Construct the prompt
    const prompt = `
    Create SEO-optimized content for the following:
    
    Topic: ${topic}
    Target Audience: ${targetAudience}
    Keywords to include: ${keywords.join(', ')}
    
    Please provide content that:
    1. Has a compelling title
    2. Includes an engaging introduction
    3. Contains well-structured body paragraphs
    4. Naturally incorporates the provided keywords
    5. Ends with a clear conclusion
    6. Is optimized for search engines
    7. Uses appropriate headings and subheadings
    8. Maintains a conversational yet professional tone
    
    Format the response in markdown.
    `

    // Generate content
    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    return new Response(
      JSON.stringify({
        content: text,
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
