
-- Allow users to insert their own role during signup
CREATE POLICY "Users can assign their own role" ON public.user_roles
    FOR INSERT WITH CHECK (auth.uid() = user_id);
