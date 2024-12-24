-- Create necessary tables for SEOGenius
CREATE TABLE IF NOT EXISTS public.rank_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    keyword TEXT NOT NULL,
    position INTEGER,
    url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE IF NOT EXISTS public.backlinks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    source_url TEXT NOT NULL,
    target_url TEXT NOT NULL,
    anchor_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE IF NOT EXISTS public.seo_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    url TEXT NOT NULL,
    title TEXT,
    description TEXT,
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE IF NOT EXISTS public.chat_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    message TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Add RLS policies
ALTER TABLE public.rank_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backlinks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own rank tracking data"
    ON public.rank_tracking FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own backlinks"
    ON public.backlinks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own SEO content"
    ON public.seo_content FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own chat logs"
    ON public.chat_logs FOR SELECT
    USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_rank_tracking_user_id ON public.rank_tracking(user_id);
CREATE INDEX idx_backlinks_user_id ON public.backlinks(user_id);
CREATE INDEX idx_seo_content_user_id ON public.seo_content(user_id);
CREATE INDEX idx_chat_logs_user_id ON public.chat_logs(user_id);
