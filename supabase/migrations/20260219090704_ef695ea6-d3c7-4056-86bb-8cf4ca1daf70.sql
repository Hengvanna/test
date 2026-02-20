ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS catalog_url text,
  ADD COLUMN IF NOT EXISTS drawing_2d_url text,
  ADD COLUMN IF NOT EXISTS drawing_3d_url text;
