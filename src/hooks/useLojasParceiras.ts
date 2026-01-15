import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface LojaParceira {
  id: string;
  user_id: string | null;
  nome: string;
  url_base: string;
  supabase_url: string | null;
  supabase_anon_key: string | null;
  tabela_produtos: string;
  mapeamento_campos: Record<string, string>;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductData {
  nome: string;
  descricao: string;
  preco: number;
  precoOriginal?: number;
  precoAtacado?: number;
  imagens: string[];
  categoria?: string;
  tamanhos?: string[];
  cores?: string[];
  loja?: string;
}

export function useLojasParceiras() {
  const { user } = useAuth();
  const [lojas, setLojas] = useState<LojaParceira[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchLojas = async () => {
    try {
      const { data, error } = await supabase
        .from('lojas_parceiras')
        .select('*')
        .or(`user_id.is.null,user_id.eq.${user?.id}`)
        .eq('ativo', true)
        .order('nome');

      if (error) throw error;
      
      // Type assertion para resolver o problema de tipagem
      setLojas((data || []) as unknown as LojaParceira[]);
    } catch (error) {
      console.error('Erro ao buscar lojas parceiras:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLojas();
  }, [user?.id]);

  const refresh = async () => {
    setIsRefreshing(true);
    await fetchLojas();
  };

  const detectarLoja = (url: string): LojaParceira | null => {
    if (!url) return null;
    
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;
      
      return lojas.find(loja => {
        try {
          const lojaUrl = new URL(loja.url_base);
          return hostname === lojaUrl.hostname || hostname.includes(lojaUrl.hostname.replace('www.', ''));
        } catch {
          return false;
        }
      }) || null;
    } catch {
      return null;
    }
  };

  const extrairProductIdDaUrl = (url: string): string | null => {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      
      // Procura por UUID no path
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      
      for (const part of pathParts) {
        if (uuidRegex.test(part)) {
          return part;
        }
      }
      
      // Tenta último segmento do path
      const lastPart = pathParts[pathParts.length - 1];
      if (lastPart && lastPart.length > 0) {
        return lastPart;
      }
      
      return null;
    } catch {
      return null;
    }
  };

  const buscarProdutoViaApi = async (
    loja: LojaParceira, 
    productId: string
  ): Promise<ProductData | null> => {
    if (!loja.supabase_url || !loja.supabase_anon_key) {
      console.log('Loja sem configuração de API:', loja.nome);
      return null;
    }

    try {
      const apiUrl = `${loja.supabase_url}/rest/v1/${loja.tabela_produtos}?id=eq.${productId}&select=*`;
      
      const response = await fetch(apiUrl, {
        headers: {
          'apikey': loja.supabase_anon_key,
          'Authorization': `Bearer ${loja.supabase_anon_key}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error('Erro na API da loja:', response.status, response.statusText);
        return null;
      }

      const products = await response.json();
      
      if (!products || products.length === 0) {
        console.log('Produto não encontrado na API');
        return null;
      }

      const product = products[0];
      const mapping = loja.mapeamento_campos || {};

      // Mapear campos usando o mapeamento da loja
      const extractedData: ProductData = {
        nome: product[mapping.nome || 'name'] || product.name || '',
        descricao: product[mapping.descricao || 'description'] || product.description || '',
        preco: parseFloat(product[mapping.preco || 'sale_price'] || product.sale_price || product.price || 0),
        precoOriginal: parseFloat(product[mapping.precoOriginal || 'original_price'] || product.original_price || 0) || undefined,
        precoAtacado: parseFloat(product[mapping.precoAtacado || 'wholesale_price'] || product.wholesale_price || 0) || undefined,
        imagens: product[mapping.imagens || 'images'] || product.images || [],
        categoria: product[mapping.categoria || 'category_name'] || product.category_name || product.category || '',
        tamanhos: product[mapping.tamanhos || 'sizes'] || product.sizes || [],
        cores: product[mapping.cores || 'colors'] || product.colors || [],
        loja: loja.nome
      };

      // Garantir que imagens é um array
      const rawImagens = extractedData.imagens as unknown;
      if (typeof rawImagens === 'string') {
        try {
          extractedData.imagens = JSON.parse(rawImagens);
        } catch {
          extractedData.imagens = [rawImagens];
        }
      } else if (!Array.isArray(rawImagens)) {
        extractedData.imagens = [];
      }

      return extractedData;
    } catch (error) {
      console.error('Erro ao buscar produto via API:', error);
      return null;
    }
  };

  const buscarProdutoPorUrl = async (url: string): Promise<{
    loja: LojaParceira | null;
    produto: ProductData | null;
    metodo: 'api' | 'fallback' | null;
  }> => {
    const loja = detectarLoja(url);
    
    if (!loja) {
      return { loja: null, produto: null, metodo: null };
    }

    const productId = extrairProductIdDaUrl(url);
    
    if (!productId) {
      return { loja, produto: null, metodo: null };
    }

    // Tentar via API primeiro
    const produto = await buscarProdutoViaApi(loja, productId);
    
    if (produto) {
      return { loja, produto, metodo: 'api' };
    }

    // Fallback: retornar só a loja identificada
    return { loja, produto: null, metodo: 'fallback' };
  };

  const addLoja = async (data: {
    nome: string;
    url_base: string;
    supabase_url: string | null;
    supabase_anon_key: string | null;
    tabela_produtos: string;
    mapeamento_campos: Record<string, string>;
    ativo: boolean;
  }) => {
    if (!user) {
      toast.error('Você precisa estar logado para adicionar uma loja');
      return null;
    }

    try {
      const { data: newLoja, error } = await supabase
        .from('lojas_parceiras')
        .insert({
          nome: data.nome,
          url_base: data.url_base,
          supabase_url: data.supabase_url,
          supabase_anon_key: data.supabase_anon_key,
          tabela_produtos: data.tabela_produtos,
          mapeamento_campos: data.mapeamento_campos,
          ativo: data.ativo,
          user_id: user.id
        } as any)
        .select()
        .single();

      if (error) throw error;

      toast.success('Loja adicionada com sucesso!');
      await refresh();
      return newLoja as unknown as LojaParceira;
    } catch (error) {
      console.error('Erro ao adicionar loja:', error);
      toast.error('Erro ao adicionar loja');
      return null;
    }
  };

  const updateLoja = async (id: string, data: Partial<LojaParceira>) => {
    try {
      const { error } = await supabase
        .from('lojas_parceiras')
        .update(data as any)
        .eq('id', id);

      if (error) throw error;

      toast.success('Loja atualizada com sucesso!');
      await refresh();
      return true;
    } catch (error) {
      console.error('Erro ao atualizar loja:', error);
      toast.error('Erro ao atualizar loja');
      return false;
    }
  };

  const deleteLoja = async (id: string) => {
    try {
      const { error } = await supabase
        .from('lojas_parceiras')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Loja removida com sucesso!');
      await refresh();
      return true;
    } catch (error) {
      console.error('Erro ao remover loja:', error);
      toast.error('Erro ao remover loja');
      return false;
    }
  };

  const testarConexao = async (loja: LojaParceira): Promise<boolean> => {
    if (!loja.supabase_url || !loja.supabase_anon_key) {
      return false;
    }

    try {
      const apiUrl = `${loja.supabase_url}/rest/v1/${loja.tabela_produtos}?limit=1`;
      
      const response = await fetch(apiUrl, {
        headers: {
          'apikey': loja.supabase_anon_key,
          'Authorization': `Bearer ${loja.supabase_anon_key}`,
          'Content-Type': 'application/json'
        }
      });

      return response.ok;
    } catch {
      return false;
    }
  };

  return {
    lojas,
    isLoading,
    isRefreshing,
    refresh,
    detectarLoja,
    extrairProductIdDaUrl,
    buscarProdutoViaApi,
    buscarProdutoPorUrl,
    addLoja,
    updateLoja,
    deleteLoja,
    testarConexao
  };
}
