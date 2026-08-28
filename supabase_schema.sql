-- ==============================================================================
-- THE PODDAR'S FOOD & BAR - SUPABASE DATABASE SCHEMA & RLS POLICIES
-- Project ID: nfsttzbqcfsffnojikyo
-- Copy and run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/nfsttzbqcfsffnojikyo/sql/new
-- ==============================================================================

-- 1. Create PROFILES Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS 
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name);
  RETURN NEW;
END;
 LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 2. Create ORDERS Table for Order History
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  guest_name TEXT NOT NULL,
  user_email TEXT,
  mode TEXT DEFAULT 'Dine in',
  table_number TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  instructions TEXT,
  subtotal NUMERIC(10, 2) DEFAULT 0,
  discount NUMERIC(10, 2) DEFAULT 0,
  discount_label TEXT,
  gst NUMERIC(10, 2) DEFAULT 0,
  total NUMERIC(10, 2) DEFAULT 0,
  status TEXT DEFAULT 'New',
  payment_status TEXT DEFAULT 'Unpaid',
  payment_method TEXT DEFAULT 'Pending at Table',
  paid_at TIMESTAMPTZ,
  estimated_prep_time INTEGER,
  approved_at TIMESTAMPTZ,
  ready_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  chef_note TEXT,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Orders RLS Policies
DROP POLICY IF EXISTS "Anyone can create an order" ON public.orders;
CREATE POLICY "Anyone can create an order" 
  ON public.orders FOR INSERT 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
CREATE POLICY "Users can view their own orders" 
  ON public.orders FOR SELECT 
  USING (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id) 
    OR (auth.uid() IS NULL)
    OR (user_id IS NULL)
  );

DROP POLICY IF EXISTS "Anyone can update orders" ON public.orders;
CREATE POLICY "Anyone can update orders" 
  ON public.orders FOR UPDATE 
  USING (true);

-- 3. Indexes for High Performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_table ON public.orders(table_number);
CREATE INDEX IF NOT EXISTS idx_orders_user_email ON public.orders(user_email);

-- 4. Enable Realtime on Orders
DO 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'orders'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
  END IF;
END ;
