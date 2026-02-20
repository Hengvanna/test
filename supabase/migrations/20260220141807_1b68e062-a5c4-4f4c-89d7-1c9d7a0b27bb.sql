
UPDATE storage.buckets SET public = true WHERE id = 'media';

-- Ensure public read access policy exists
CREATE POLICY "Public can view media files"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');
