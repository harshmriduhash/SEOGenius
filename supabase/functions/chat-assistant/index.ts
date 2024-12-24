import { serve, GoogleGenerativeAI } from "./deps.ts";

// Deno types
declare global {
  const Deno: {
    env: {
      get(key: string): string | undefined;
    };
  };
}

// Configure CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ChatRequest {
  messages: Array<{
    role: 'user' | 'assistant'
    content: string
  }>
}

serve(async (request: Request) => {
  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const apiKey = Deno.env.get('GEMINI_API_KEY')
    if (!apiKey) {
      throw new Error('Missing Gemini API key')
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const { messages } = await request.json() as ChatRequest

    // Convert messages to Gemini format
    const chat = model.startChat({
      history: messages.map(msg => ({
        role: msg.role,
        parts: msg.content,
      })),
    })

    const result = await chat.sendMessage(messages[messages.length - 1].content)
    const response = await result.response
    const text = response.text()

    return new Response(
      JSON.stringify({
        response: text,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    return new Response(
      JSON.stringify({
        error: errorMessage,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  }
})
