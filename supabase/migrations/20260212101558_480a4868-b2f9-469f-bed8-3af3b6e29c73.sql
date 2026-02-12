
-- Create sample-books storage bucket (public read access)
INSERT INTO storage.buckets (id, name, public) VALUES ('sample-books', 'sample-books', true);

-- Allow public read access
CREATE POLICY "Public can read sample books"
ON storage.objects FOR SELECT
USING (bucket_id = 'sample-books');

-- Allow service role to upload (edge functions use service role)
CREATE POLICY "Service role can upload sample books"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'sample-books');

CREATE POLICY "Service role can update sample books"
ON storage.objects FOR UPDATE
USING (bucket_id = 'sample-books');

CREATE POLICY "Service role can delete sample books"
ON storage.objects FOR DELETE
USING (bucket_id = 'sample-books');
