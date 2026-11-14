DROP POLICY IF EXISTS "Authenticated users can upload ebooks" ON storage.objects;
DROP POLICY IF EXISTS "Service role can upload sample books" ON storage.objects;
CREATE POLICY "Admins upload book files" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id IN ('course-ebooks','sample-books') AND public.is_admin(auth.uid()) AND owner_id = (select auth.uid()::text));