-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('student', 'parent', 'teacher', 'doctor', 'admin');

-- Create user_roles table for role-based access
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create students table
CREATE TABLE public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    sr_number TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    class TEXT NOT NULL,
    section TEXT,
    date_of_birth DATE,
    parent_id UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Create parents table
CREATE TABLE public.parents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    linked_student_sr TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.parents ENABLE ROW LEVEL SECURITY;

-- Add foreign key to students after parents table exists
ALTER TABLE public.students ADD CONSTRAINT fk_parent FOREIGN KEY (parent_id) REFERENCES public.parents(id) ON DELETE SET NULL;

-- Create teachers table
CREATE TABLE public.teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

-- Create doctors table
CREATE TABLE public.doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    specialization TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

-- Create attendance table
CREATE TABLE public.attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late')),
    marked_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (student_id, date)
);

ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Create marks table
CREATE TABLE public.marks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    subject TEXT NOT NULL,
    marks NUMERIC NOT NULL,
    max_marks NUMERIC NOT NULL DEFAULT 100,
    exam_type TEXT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.marks ENABLE ROW LEVEL SECURITY;

-- Create health_records table
CREATE TABLE public.health_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    height NUMERIC,
    weight NUMERIC,
    bmi NUMERIC,
    blood_group TEXT,
    vaccination_status TEXT,
    medical_conditions TEXT,
    doctor_notes TEXT,
    feeling_status TEXT DEFAULT 'fine' CHECK (feeling_status IN ('fine', 'not_well')),
    last_checkup DATE,
    updated_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.health_records ENABLE ROW LEVEL SECURITY;

-- Create events table
CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    event_time TIME,
    google_form_link TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Create leave_letters table
CREATE TABLE public.leave_letters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    reason TEXT NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    submitted_by UUID REFERENCES auth.users(id),
    reviewed_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.leave_letters ENABLE ROW LEVEL SECURITY;

-- Create alerts/notifications table
CREATE TABLE public.alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL,
    message TEXT NOT NULL,
    receiver_id UUID REFERENCES auth.users(id),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id LIMIT 1
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON public.user_roles
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all profiles" ON public.profiles
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for students
CREATE POLICY "Students can view their own data" ON public.students
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Teachers can view all students" ON public.students
    FOR SELECT USING (public.has_role(auth.uid(), 'teacher'));

CREATE POLICY "Doctors can view all students" ON public.students
    FOR SELECT USING (public.has_role(auth.uid(), 'doctor'));

CREATE POLICY "Admins can manage all students" ON public.students
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Parents can view their linked students" ON public.students
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.parents p
            WHERE p.user_id = auth.uid()
            AND p.id = students.parent_id
        )
    );

-- RLS Policies for parents
CREATE POLICY "Parents can view their own data" ON public.parents
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all parents" ON public.parents
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for teachers
CREATE POLICY "Teachers can view their own data" ON public.teachers
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all teachers" ON public.teachers
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for doctors
CREATE POLICY "Doctors can view their own data" ON public.doctors
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all doctors" ON public.doctors
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for attendance
CREATE POLICY "Students can view their own attendance" ON public.attendance
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.students s WHERE s.id = attendance.student_id AND s.user_id = auth.uid())
    );

CREATE POLICY "Teachers can manage attendance" ON public.attendance
    FOR ALL USING (public.has_role(auth.uid(), 'teacher'));

CREATE POLICY "Parents can view their child's attendance" ON public.attendance
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.students s
            JOIN public.parents p ON p.id = s.parent_id
            WHERE s.id = attendance.student_id AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage all attendance" ON public.attendance
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for marks
CREATE POLICY "Students can view their own marks" ON public.marks
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.students s WHERE s.id = marks.student_id AND s.user_id = auth.uid())
    );

CREATE POLICY "Teachers can manage marks" ON public.marks
    FOR ALL USING (public.has_role(auth.uid(), 'teacher'));

CREATE POLICY "Parents can view their child's marks" ON public.marks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.students s
            JOIN public.parents p ON p.id = s.parent_id
            WHERE s.id = marks.student_id AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage all marks" ON public.marks
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for health_records
CREATE POLICY "Students can view their own health records" ON public.health_records
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.students s WHERE s.id = health_records.student_id AND s.user_id = auth.uid())
    );

CREATE POLICY "Students can update their feeling status" ON public.health_records
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.students s WHERE s.id = health_records.student_id AND s.user_id = auth.uid())
    );

CREATE POLICY "Doctors can manage health records" ON public.health_records
    FOR ALL USING (public.has_role(auth.uid(), 'doctor'));

CREATE POLICY "Parents can view their child's health records" ON public.health_records
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.students s
            JOIN public.parents p ON p.id = s.parent_id
            WHERE s.id = health_records.student_id AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage all health records" ON public.health_records
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for events
CREATE POLICY "Everyone can view events" ON public.events
    FOR SELECT USING (true);

CREATE POLICY "Teachers can create events" ON public.events
    FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'teacher'));

CREATE POLICY "Admins can manage all events" ON public.events
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for leave_letters
CREATE POLICY "Students can view their own leave letters" ON public.leave_letters
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.students s WHERE s.id = leave_letters.student_id AND s.user_id = auth.uid())
    );

CREATE POLICY "Parents can submit leave letters" ON public.leave_letters
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.students s
            JOIN public.parents p ON p.id = s.parent_id
            WHERE s.id = leave_letters.student_id AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Teachers can manage leave letters" ON public.leave_letters
    FOR ALL USING (public.has_role(auth.uid(), 'teacher'));

CREATE POLICY "Admins can manage all leave letters" ON public.leave_letters
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for alerts
CREATE POLICY "Users can view their own alerts" ON public.alerts
    FOR SELECT USING (auth.uid() = receiver_id);

CREATE POLICY "Users can update their own alerts" ON public.alerts
    FOR UPDATE USING (auth.uid() = receiver_id);

CREATE POLICY "Admins can manage all alerts" ON public.alerts
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_health_records_updated_at BEFORE UPDATE ON public.health_records
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, full_name, email)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();