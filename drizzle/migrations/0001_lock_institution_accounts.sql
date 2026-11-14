DROP POLICY IF EXISTS "Institutions can view own data" ON public.institution_accounts;
DROP POLICY IF EXISTS "Allow public registration" ON public.institution_accounts;
CREATE POLICY "Admins read institutions" ON public.institution_accounts FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins create institutions" ON public.institution_accounts FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));