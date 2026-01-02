-- Create feedback table
CREATE TABLE public.feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert feedback (public form)
CREATE POLICY "Anyone can submit feedback" ON public.feedback
    FOR INSERT WITH CHECK (true);

-- Policy: Only admins can view feedback
CREATE POLICY "Admins can view feedback" ON public.feedback
    FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
