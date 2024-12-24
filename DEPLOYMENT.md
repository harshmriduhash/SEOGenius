# Deployment Guide

## Backend (Supabase)

1. Create a new Supabase project
2. Set up environment variables in Supabase:
```bash
supabase secrets set GEMINI_API_KEY=your_gemini_api_key
supabase secrets set TWITTER_BEARER_TOKEN=your_twitter_bearer_token
supabase secrets set LINKEDIN_ACCESS_TOKEN=your_linkedin_access_token
supabase secrets set GOOGLE_CREDENTIALS=your_google_credentials_json
supabase secrets set SERP_API_KEY=your_serp_api_key
supabase secrets set MOZ_API_KEY=your_moz_api_key
```

3. Deploy Supabase functions:
```bash
supabase functions deploy generate-content
supabase functions deploy analyze-keywords
supabase functions deploy analyze-serp
supabase functions deploy track-rankings
supabase functions deploy analyze-social-media
```

4. Enable the functions in Supabase Dashboard

## Frontend (Vercel)

1. Create a new project on Vercel
2. Connect your GitHub repository
3. Configure environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

4. Deploy using Vercel CLI:
```bash
vercel
```

Or configure GitHub integration for automatic deployments.

## Environment Variables

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Fill in all required values in `.env.local`

## Database Setup

1. Run Supabase migrations:
```sql
-- Create social_media_impact table
create table public.social_media_impact (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  posts jsonb,
  analysis jsonb,
  analyzed_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- Set up RLS policies
alter table public.social_media_impact enable row level security;

create policy "Users can view their own social media analysis"
  on public.social_media_impact
  for select using (auth.uid() = user_id);

create policy "Users can insert their own social media analysis"
  on public.social_media_impact
  for insert with check (auth.uid() = user_id);
```

## Post-Deployment Verification

1. Test all API endpoints using the provided examples in `API.md`
2. Verify frontend connectivity to Supabase
3. Check authentication flow
4. Test social media integration
5. Monitor error logs in Supabase and Vercel dashboards

## Troubleshooting

Common issues and solutions:

1. CORS errors
   - Verify Supabase function headers
   - Check Vercel configuration

2. Authentication issues
   - Verify Supabase URL and anon key
   - Check RLS policies

3. API rate limits
   - Monitor usage in respective dashboards
   - Implement caching if needed

## Maintenance

1. Regular updates:
```bash
npm update
supabase functions deploy
```

2. Monitor:
   - Supabase function logs
   - Vercel deployment logs
   - API usage and quotas
