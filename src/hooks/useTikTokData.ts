import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Re-export API hooks
export { useTikTokShopAPI, useTikTokAppConnection } from "./useTikTokShopAPI";

// Types
export interface TikTokProduct {
  id: string;
  user_id: string;
  tiktok_product_id?: string;
  name: string;
  description?: string;
  price: number;
  compare_at_price?: number;
  stock_quantity: number;
  sku?: string;
  category?: string;
  image_url?: string;
  status: 'active' | 'inactive' | 'out_of_stock' | 'pending';
  promotion_active?: boolean;
  promotion_discount?: number;
  promotion_start_date?: string;
  promotion_end_date?: string;
  marketing_content?: any;
  created_at: string;
  updated_at: string;
}

export interface TikTokSale {
  id: string;
  user_id: string;
  product_id?: string;
  tiktok_order_id?: string;
  customer_name?: string;
  customer_phone?: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  discount_amount?: number;
  shipping_cost?: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  payment_status: 'pending' | 'paid' | 'refunded';
  region?: string;
  influencer_id?: string;
  sale_date: string;
  created_at: string;
  product?: TikTokProduct;
  influencer?: TikTokInfluencer;
}

export interface TikTokInfluencer {
  id: string;
  user_id: string;
  tiktok_username: string;
  display_name?: string;
  avatar_url?: string;
  followers_count: number;
  engagement_rate: number;
  total_sales: number;
  total_orders: number;
  commission_rate: number;
  commission_earned: number;
  status: 'active' | 'inactive' | 'pending';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  joined_at: string;
  created_at: string;
  updated_at: string;
}

export interface TikTokContent {
  id: string;
  user_id: string;
  tiktok_video_id?: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  video_url?: string;
  content_type: 'video' | 'livestream' | 'story';
  views_count: number;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  products_tagged?: string[];
  influencer_id?: string;
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  scheduled_for?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
  influencer?: TikTokInfluencer;
}

export interface TikTokFinancial {
  id: string;
  user_id: string;
  transaction_type: 'sale' | 'refund' | 'commission' | 'fee' | 'payout';
  amount: number;
  description?: string;
  reference_id?: string;
  reference_type?: 'sale' | 'influencer' | 'product';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  transaction_date: string;
  created_at: string;
}

export interface TikTokInsight {
  id: string;
  user_id: string;
  insight_type: 'sales' | 'product' | 'influencer' | 'content' | 'alert';
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  is_read: boolean;
  action_url?: string;
  created_at: string;
}

export interface TikTokApp {
  id: string;
  user_id: string;
  app_id: string;
  app_key: string;
  app_name: string;
  app_secret?: string;
  access_token?: string;
  refresh_token?: string;
  token_expires_at?: string;
  permissions_granted: number;
  market: string;
  status: 'active' | 'inactive' | 'expired';
  created_at: string;
  updated_at: string;
}

// Products Hook
export function useTikTokProducts() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['tiktok-products', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tiktok_products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as TikTokProduct[];
    },
    enabled: !!user,
  });

  const createProduct = useMutation({
    mutationFn: async (product: Omit<TikTokProduct, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('tiktok_products')
        .insert({ ...product, user_id: user!.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tiktok-products'] }),
  });

  const updateProduct = useMutation({
    mutationFn: async ({ id, ...product }: Partial<TikTokProduct> & { id: string }) => {
      const { data, error } = await supabase
        .from('tiktok_products')
        .update(product)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tiktok-products'] }),
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('tiktok_products').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tiktok-products'] }),
  });

  return { ...query, createProduct, updateProduct, deleteProduct };
}

// Sales Hook
export function useTikTokSales() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['tiktok-sales', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tiktok_sales')
        .select(`
          *,
          product:tiktok_products(*),
          influencer:tiktok_influencers(*)
        `)
        .order('sale_date', { ascending: false });

      if (error) throw error;
      return data as TikTokSale[];
    },
    enabled: !!user,
  });
}

// Influencers Hook
export function useTikTokInfluencers() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['tiktok-influencers', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tiktok_influencers')
        .select('*')
        .order('total_sales', { ascending: false });

      if (error) throw error;
      return data as TikTokInfluencer[];
    },
    enabled: !!user,
  });

  const createInfluencer = useMutation({
    mutationFn: async (influencer: Omit<TikTokInfluencer, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'joined_at'>) => {
      const { data, error } = await supabase
        .from('tiktok_influencers')
        .insert({ ...influencer, user_id: user!.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tiktok-influencers'] }),
  });

  return { ...query, createInfluencer };
}

// Content Hook
export function useTikTokContent() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['tiktok-content', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tiktok_content')
        .select(`
          *,
          influencer:tiktok_influencers(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as TikTokContent[];
    },
    enabled: !!user,
  });

  const createContent = useMutation({
    mutationFn: async (content: Omit<TikTokContent, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('tiktok_content')
        .insert({ ...content, user_id: user!.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tiktok-content'] }),
  });

  return { ...query, createContent };
}

// Financial Hook
export function useTikTokFinancial() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['tiktok-financial', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tiktok_financial')
        .select('*')
        .order('transaction_date', { ascending: false });

      if (error) throw error;
      return data as TikTokFinancial[];
    },
    enabled: !!user,
  });
}

// AI Insights Hook
export function useTikTokInsights() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['tiktok-insights', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tiktok_ai_insights')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as TikTokInsight[];
    },
    enabled: !!user,
  });

  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tiktok_ai_insights')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tiktok-insights'] }),
  });

  return { ...query, markAsRead };
}

// Apps Hook
export function useTikTokApps() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['tiktok-apps', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tiktok_apps')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as TikTokApp[];
    },
    enabled: !!user,
  });

  const createApp = useMutation({
    mutationFn: async (app: Omit<TikTokApp, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('tiktok_apps')
        .insert({ ...app, user_id: user!.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tiktok-apps'] }),
  });

  return { ...query, createApp };
}

// Dashboard Stats Hook
export function useTikTokDashboardStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['tiktok-dashboard-stats', user?.id],
    queryFn: async () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const [salesResult, productsResult, influencersResult] = await Promise.all([
        supabase
          .from('tiktok_sales')
          .select('*')
          .gte('sale_date', thirtyDaysAgo.toISOString()),
        supabase
          .from('tiktok_products')
          .select('*')
          .eq('status', 'active'),
        supabase
          .from('tiktok_influencers')
          .select('*')
          .eq('status', 'active'),
      ]);

      const sales = salesResult.data || [];
      const products = productsResult.data || [];
      const influencers = influencersResult.data || [];

      const totalSales = sales.reduce((sum, s) => sum + Number(s.total_amount), 0);
      const totalOrders = sales.length;
      const averageTicket = totalOrders > 0 ? totalSales / totalOrders : 0;

      // Group sales by date for chart
      const salesByDate = sales.reduce((acc, sale) => {
        const date = new Date(sale.sale_date).toLocaleDateString('pt-BR');
        acc[date] = (acc[date] || 0) + Number(sale.total_amount);
        return acc;
      }, {} as Record<string, number>);

      // Get top products
      const productSales = sales.reduce((acc, sale) => {
        if (sale.product_id) {
          acc[sale.product_id] = (acc[sale.product_id] || 0) + Number(sale.total_amount);
        }
        return acc;
      }, {} as Record<string, number>);

      const topProducts = Object.entries(productSales)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([id, amount]) => ({
          id,
          product: products.find(p => p.id === id),
          amount,
        }));

      // Get top influencers
      const topInfluencers = [...influencers]
        .sort((a, b) => Number(b.total_sales) - Number(a.total_sales))
        .slice(0, 5);

      return {
        totalSales,
        totalOrders,
        averageTicket,
        activeProducts: products.length,
        activeInfluencers: influencers.length,
        salesByDate,
        topProducts,
        topInfluencers,
      };
    },
    enabled: !!user,
  });
}
