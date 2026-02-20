-- Create news_items table
CREATE TABLE public.news_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  excerpt text,
  content text,
  category text NOT NULL DEFAULT 'news', -- 'news' | 'event' | 'announcement'
  event_type text, -- e.g. 'Product Launch', 'Company News', 'Exhibition'
  event_date date,
  venue text,
  booth text,
  status text DEFAULT 'published', -- 'published' | 'draft'
  featured boolean NOT NULL DEFAULT false,
  image_url text,
  image_path text,
  published_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.news_items ENABLE ROW LEVEL SECURITY;

-- Public can view published news
CREATE POLICY "Public can view published news"
ON public.news_items
FOR SELECT
USING (status = 'published');

-- Admins can manage all news
CREATE POLICY "Admins can manage news"
ON public.news_items
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_news_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_news_items_updated_at
BEFORE UPDATE ON public.news_items
FOR EACH ROW EXECUTE FUNCTION public.update_news_updated_at();
