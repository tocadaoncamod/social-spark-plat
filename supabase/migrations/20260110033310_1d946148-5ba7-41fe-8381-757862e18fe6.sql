-- Create TikTok Shop tables for MarketFlow platform

-- TikTok Products table
CREATE TABLE public.tiktok_products (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    tiktok_product_id TEXT,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    compare_at_price DECIMAL(10,2),
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    sku TEXT,
    category TEXT,
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'out_of_stock', 'pending')),
    promotion_active BOOLEAN DEFAULT false,
    promotion_discount DECIMAL(5,2),
    promotion_start_date TIMESTAMPTZ,
    promotion_end_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- TikTok Sales table
CREATE TABLE public.tiktok_sales (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.tiktok_products(id) ON DELETE SET NULL,
    tiktok_order_id TEXT,
    customer_name TEXT,
    customer_phone TEXT,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'refunded')),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    region TEXT,
    influencer_id UUID,
    sale_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- TikTok Influencers table
CREATE TABLE public.tiktok_influencers (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    tiktok_username TEXT NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    followers_count INTEGER DEFAULT 0,
    engagement_rate DECIMAL(5,2) DEFAULT 0,
    total_sales DECIMAL(12,2) DEFAULT 0,
    total_orders INTEGER DEFAULT 0,
    commission_rate DECIMAL(5,2) DEFAULT 5.00,
    commission_earned DECIMAL(12,2) DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
    tier TEXT DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
    joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add foreign key for influencer in sales
ALTER TABLE public.tiktok_sales
ADD CONSTRAINT tiktok_sales_influencer_id_fkey
FOREIGN KEY (influencer_id) REFERENCES public.tiktok_influencers(id) ON DELETE SET NULL;

-- TikTok Content table
CREATE TABLE public.tiktok_content (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    tiktok_video_id TEXT,
    title TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    video_url TEXT,
    content_type TEXT NOT NULL DEFAULT 'video' CHECK (content_type IN ('video', 'livestream', 'story')),
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    products_tagged UUID[] DEFAULT '{}',
    influencer_id UUID REFERENCES public.tiktok_influencers(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
    scheduled_for TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- TikTok Financial table
CREATE TABLE public.tiktok_financial (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('sale', 'refund', 'commission', 'fee', 'payout')),
    amount DECIMAL(12,2) NOT NULL,
    description TEXT,
    reference_id UUID,
    reference_type TEXT CHECK (reference_type IN ('sale', 'influencer', 'product')),
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    transaction_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- TikTok AI Insights table
CREATE TABLE public.tiktok_ai_insights (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    insight_type TEXT NOT NULL CHECK (insight_type IN ('sales', 'product', 'influencer', 'content', 'alert')),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    is_read BOOLEAN DEFAULT false,
    action_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- TikTok App Credentials table (for storing API credentials)
CREATE TABLE public.tiktok_apps (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    app_id TEXT NOT NULL,
    app_key TEXT NOT NULL,
    app_name TEXT NOT NULL,
    app_secret TEXT,
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMPTZ,
    permissions_granted INTEGER DEFAULT 0,
    market TEXT DEFAULT 'BR',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.tiktok_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tiktok_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tiktok_influencers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tiktok_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tiktok_financial ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tiktok_ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tiktok_apps ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tiktok_products
CREATE POLICY "Users can view their own products" ON public.tiktok_products
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own products" ON public.tiktok_products
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own products" ON public.tiktok_products
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own products" ON public.tiktok_products
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for tiktok_sales
CREATE POLICY "Users can view their own sales" ON public.tiktok_sales
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own sales" ON public.tiktok_sales
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own sales" ON public.tiktok_sales
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own sales" ON public.tiktok_sales
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for tiktok_influencers
CREATE POLICY "Users can view their own influencers" ON public.tiktok_influencers
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own influencers" ON public.tiktok_influencers
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own influencers" ON public.tiktok_influencers
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own influencers" ON public.tiktok_influencers
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for tiktok_content
CREATE POLICY "Users can view their own content" ON public.tiktok_content
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own content" ON public.tiktok_content
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own content" ON public.tiktok_content
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own content" ON public.tiktok_content
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for tiktok_financial
CREATE POLICY "Users can view their own financial data" ON public.tiktok_financial
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own financial data" ON public.tiktok_financial
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own financial data" ON public.tiktok_financial
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own financial data" ON public.tiktok_financial
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for tiktok_ai_insights
CREATE POLICY "Users can view their own insights" ON public.tiktok_ai_insights
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own insights" ON public.tiktok_ai_insights
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own insights" ON public.tiktok_ai_insights
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own insights" ON public.tiktok_ai_insights
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for tiktok_apps
CREATE POLICY "Users can view their own apps" ON public.tiktok_apps
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own apps" ON public.tiktok_apps
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own apps" ON public.tiktok_apps
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own apps" ON public.tiktok_apps
    FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at triggers
CREATE TRIGGER update_tiktok_products_updated_at
    BEFORE UPDATE ON public.tiktok_products
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tiktok_influencers_updated_at
    BEFORE UPDATE ON public.tiktok_influencers
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tiktok_content_updated_at
    BEFORE UPDATE ON public.tiktok_content
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tiktok_apps_updated_at
    BEFORE UPDATE ON public.tiktok_apps
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_tiktok_products_user_id ON public.tiktok_products(user_id);
CREATE INDEX idx_tiktok_products_status ON public.tiktok_products(status);
CREATE INDEX idx_tiktok_sales_user_id ON public.tiktok_sales(user_id);
CREATE INDEX idx_tiktok_sales_sale_date ON public.tiktok_sales(sale_date);
CREATE INDEX idx_tiktok_sales_product_id ON public.tiktok_sales(product_id);
CREATE INDEX idx_tiktok_influencers_user_id ON public.tiktok_influencers(user_id);
CREATE INDEX idx_tiktok_content_user_id ON public.tiktok_content(user_id);
CREATE INDEX idx_tiktok_financial_user_id ON public.tiktok_financial(user_id);
CREATE INDEX idx_tiktok_financial_transaction_date ON public.tiktok_financial(transaction_date);
CREATE INDEX idx_tiktok_ai_insights_user_id ON public.tiktok_ai_insights(user_id);
CREATE INDEX idx_tiktok_apps_user_id ON public.tiktok_apps(user_id);