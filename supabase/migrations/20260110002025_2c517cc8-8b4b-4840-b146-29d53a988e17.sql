-- Create profiles table (links to auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255),
  name VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posts table
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  platform VARCHAR(50) NOT NULL,
  content TEXT,
  media_urls TEXT[],
  scheduled_for TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'draft',
  metrics JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaigns table
CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  platform VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  budget DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'draft',
  metrics JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  platform VARCHAR(50) NOT NULL,
  chat_id VARCHAR(255) NOT NULL,
  content TEXT,
  direction VARCHAR(20),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- WhatsApp Contacts table
CREATE TABLE public.whatsapp_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255),
  phone VARCHAR(50) NOT NULL,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_posts_user ON public.posts(user_id);
CREATE INDEX idx_posts_platform ON public.posts(platform);
CREATE INDEX idx_campaigns_user ON public.campaigns(user_id);
CREATE INDEX idx_campaigns_platform ON public.campaigns(platform);
CREATE INDEX idx_messages_user ON public.messages(user_id);
CREATE INDEX idx_messages_chat ON public.messages(chat_id);
CREATE INDEX idx_whatsapp_contacts_user ON public.whatsapp_contacts(user_id);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_contacts ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Posts RLS policies
CREATE POLICY "Users can view their own posts"
ON public.posts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own posts"
ON public.posts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
ON public.posts FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
ON public.posts FOR DELETE
USING (auth.uid() = user_id);

-- Campaigns RLS policies
CREATE POLICY "Users can view their own campaigns"
ON public.campaigns FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own campaigns"
ON public.campaigns FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own campaigns"
ON public.campaigns FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own campaigns"
ON public.campaigns FOR DELETE
USING (auth.uid() = user_id);

-- Messages RLS policies
CREATE POLICY "Users can view their own messages"
ON public.messages FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own messages"
ON public.messages FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own messages"
ON public.messages FOR DELETE
USING (auth.uid() = user_id);

-- WhatsApp Contacts RLS policies
CREATE POLICY "Users can view their own contacts"
ON public.whatsapp_contacts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own contacts"
ON public.whatsapp_contacts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own contacts"
ON public.whatsapp_contacts FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own contacts"
ON public.whatsapp_contacts FOR DELETE
USING (auth.uid() = user_id);

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for auto-creating profiles
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();