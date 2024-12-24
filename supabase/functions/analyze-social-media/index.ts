import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SocialPost {
  platform: string
  content: string
  engagement: {
    likes: number
    shares: number
    comments: number
  }
  url: string
  timestamp: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userId, platforms } = await req.json()

    if (!userId || !platforms) {
      throw new Error('Missing required fields')
    }

    // Initialize API clients
    const twitterClient = {
      bearerToken: Deno.env.get('TWITTER_BEARER_TOKEN')
    }
    
    const linkedinClient = {
      accessToken: Deno.env.get('LINKEDIN_ACCESS_TOKEN')
    }

    // Fetch social media posts
    const posts: SocialPost[] = []

    // Fetch Twitter posts if included
    if (platforms.includes('twitter')) {
      const twitterResponse = await fetch(
        'https://api.twitter.com/2/tweets/search/recent?query=from:your_handle',
        {
          headers: {
            Authorization: `Bearer ${twitterClient.bearerToken}`,
          },
        }
      )
      const twitterData = await twitterResponse.json()
      
      // Transform Twitter data to common format
      posts.push(...twitterData.data.map((tweet: any) => ({
        platform: 'twitter',
        content: tweet.text,
        engagement: {
          likes: tweet.public_metrics.like_count,
          shares: tweet.public_metrics.retweet_count,
          comments: tweet.public_metrics.reply_count,
        },
        url: `https://twitter.com/user/status/${tweet.id}`,
        timestamp: tweet.created_at,
      })))
    }

    // Fetch LinkedIn posts if included
    if (platforms.includes('linkedin')) {
      const linkedinResponse = await fetch(
        'https://api.linkedin.com/v2/ugcPosts?q=authors&authors=List(your_profile_id)',
        {
          headers: {
            Authorization: `Bearer ${linkedinClient.accessToken}`,
          },
        }
      )
      const linkedinData = await linkedinResponse.json()
      
      // Transform LinkedIn data to common format
      posts.push(...linkedinData.elements.map((post: any) => ({
        platform: 'linkedin',
        content: post.specificContent['com.linkedin.ugc.ShareContent'].shareCommentary.text,
        engagement: {
          likes: post.socialMetrics.numLikes,
          shares: post.socialMetrics.numShares,
          comments: post.socialMetrics.numComments,
        },
        url: post.originalUrl,
        timestamp: post.created.time,
      })))
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY') || '')
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    // Analyze posts with Gemini
    const analysisPrompt = `
    Analyze these social media posts and their engagement metrics:
    ${JSON.stringify(posts)}

    Provide analysis in this JSON format:
    {
      "top_performing_posts": [
        {
          "url": string,
          "platform": string,
          "engagement_score": number,
          "success_factors": string[]
        }
      ],
      "content_insights": {
        "topics": string[],
        "best_posting_times": string[],
        "engagement_patterns": string[]
      },
      "seo_impact": {
        "social_signals": number,
        "brand_visibility": number,
        "traffic_potential": number,
        "recommendations": string[]
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
      .from('social_media_impact')
      .insert({
        user_id: userId,
        posts,
        analysis,
        analyzed_at: new Date().toISOString()
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
