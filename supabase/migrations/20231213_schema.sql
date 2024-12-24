-- Create auth schema extensions
create extension if not exists "uuid-ossp";

-- Create profiles table
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    email text unique not null,
    full_name text,
    avatar_url text,
    website text,
    company text
);

-- Create RLS policies for profiles
alter table public.profiles enable row level security;

create policy "Users can view their own profile"
    on profiles for select
    using ( auth.uid() = id );

create policy "Users can update their own profile"
    on profiles for update
    using ( auth.uid() = id );

-- Create seo_content table
create table if not exists public.seo_content (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    user_id uuid references public.profiles(id) on delete cascade not null,
    title text not null,
    content text not null,
    language text not null default 'en',
    status text not null default 'draft',
    meta_description text,
    keywords text[],
    url text,
    page_type text
);

-- Create RLS policies for seo_content
alter table public.seo_content enable row level security;

create policy "Users can view their own content"
    on seo_content for select
    using ( auth.uid() = user_id );

create policy "Users can insert their own content"
    on seo_content for insert
    with check ( auth.uid() = user_id );

create policy "Users can update their own content"
    on seo_content for update
    using ( auth.uid() = user_id );

create policy "Users can delete their own content"
    on seo_content for delete
    using ( auth.uid() = user_id );

-- Create keyword_analysis table
create table if not exists public.keyword_analysis (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    user_id uuid references public.profiles(id) on delete cascade not null,
    keyword text not null,
    search_volume integer,
    difficulty numeric,
    cpc numeric,
    competition numeric,
    intent text,
    related_keywords text[]
);

-- Create RLS policies for keyword_analysis
alter table public.keyword_analysis enable row level security;

create policy "Users can view their own keyword analysis"
    on keyword_analysis for select
    using ( auth.uid() = user_id );

create policy "Users can insert their own keyword analysis"
    on keyword_analysis for insert
    with check ( auth.uid() = user_id );

create policy "Users can update their own keyword analysis"
    on keyword_analysis for update
    using ( auth.uid() = user_id );

create policy "Users can delete their own keyword analysis"
    on keyword_analysis for delete
    using ( auth.uid() = user_id );

-- Create backlink_analysis table
create table if not exists public.backlink_analysis (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    user_id uuid references public.profiles(id) on delete cascade not null,
    source_url text not null,
    target_url text not null,
    anchor_text text,
    domain_authority numeric,
    page_authority numeric,
    follow boolean default true,
    status text
);

-- Create RLS policies for backlink_analysis
alter table public.backlink_analysis enable row level security;

create policy "Users can view their own backlink analysis"
    on backlink_analysis for select
    using ( auth.uid() = user_id );

create policy "Users can insert their own backlink analysis"
    on backlink_analysis for insert
    with check ( auth.uid() = user_id );

create policy "Users can update their own backlink analysis"
    on backlink_analysis for update
    using ( auth.uid() = user_id );

create policy "Users can delete their own backlink analysis"
    on backlink_analysis for delete
    using ( auth.uid() = user_id );

-- Create functions and triggers for updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Add updated_at triggers to all tables
create trigger handle_updated_at
    before update on public.profiles
    for each row
    execute function public.handle_updated_at();

create trigger handle_updated_at
    before update on public.seo_content
    for each row
    execute function public.handle_updated_at();

create trigger handle_updated_at
    before update on public.keyword_analysis
    for each row
    execute function public.handle_updated_at();

create trigger handle_updated_at
    before update on public.backlink_analysis
    for each row
    execute function public.handle_updated_at();
