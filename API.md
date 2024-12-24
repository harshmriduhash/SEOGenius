# SEO Tool API Documentation

This document describes all available API endpoints (Supabase Edge Functions) in the SEO Tool.

## Common Headers

All requests require the following headers:
```
Authorization: Bearer <supabase-anon-key>
Content-Type: application/json
```

## Content Generation

### Generate SEO Content

**Endpoint:** `/functions/v1/generate-content`

**Method:** POST

**Request Body:**
```json
{
  "topic": "string",
  "targetAudience": "string",
  "keywords": "string[]"
}
```

**Response:**
```json
{
  "content": "string (markdown formatted)",
  "status": "success"
}
```

## Keyword Analysis

### Analyze Keywords

**Endpoint:** `/functions/v1/analyze-keywords`

**Method:** POST

**Request Body:**
```json
{
  "keywords": "string[]",
  "user_id": "string"
}
```

**Response:**
```json
{
  "clusters": {
    "informational": "string[]",
    "navigational": "string[]",
    "transactional": "string[]"
  },
  "status": "success"
}
```

## SERP Analysis

### Analyze SERP Results

**Endpoint:** `/functions/v1/analyze-serp`

**Method:** POST

**Request Body:**
```json
{
  "keyword": "string"
}
```

**Response:**
```json
{
  "results": [
    {
      "position": "number",
      "title": "string",
      "description": "string",
      "url": "string"
    }
  ],
  "status": "success"
}
```

## Rank Tracking

### Track Rankings

**Endpoint:** `/functions/v1/track-rankings`

**Method:** POST

**Response:**
```json
{
  "rankings": [
    {
      "keyword": "string",
      "position": "number",
      "clicks": "number",
      "impressions": "number",
      "ctr": "number"
    }
  ],
  "status": "success"
}
```

## Social Media Analysis

### Analyze Social Media Impact

**Endpoint:** `/functions/v1/analyze-social-media`

**Method:** POST

**Request Body:**
```json
{
  "userId": "string",
  "platforms": "string[]"
}
```

**Response:**
```json
{
  "analysis": {
    "top_performing_posts": [
      {
        "url": "string",
        "platform": "string",
        "engagement_score": "number",
        "success_factors": "string[]"
      }
    ],
    "content_insights": {
      "topics": "string[]",
      "best_posting_times": "string[]",
      "engagement_patterns": "string[]"
    },
    "seo_impact": {
      "social_signals": "number",
      "brand_visibility": "number",
      "traffic_potential": "number",
      "recommendations": "string[]"
    }
  },
  "status": "success"
}
```

## Error Responses

All endpoints return errors in this format:

```json
{
  "error": "string",
  "status": "error"
}
```

## Rate Limits

- 100 requests per minute per IP
- 1000 requests per day per user

## Integration Example

Using fetch in React:

```typescript
const generateContent = async (topic: string, targetAudience: string, keywords: string[]) => {
  const response = await fetch(
    'https://your-project.supabase.co/functions/v1/generate-content',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic,
        targetAudience,
        keywords,
      }),
    }
  )
  
  if (!response.ok) {
    throw new Error('Failed to generate content')
  }
  
  return response.json()
}
```
