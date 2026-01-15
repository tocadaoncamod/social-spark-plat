import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useLojasParceiras, LojaParceira } from '@/hooks/useLojasParceiras';
import { Store, Globe, Key, Database, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AddLojaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddLojaModal({ isOpen, onClose }: AddLojaModalProps) {
  const { addLoja, testarConexao } = useLojasParceiras();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'untested' | 'success' | 'failed'>('untested');
  
  const [formData, setFormData] = useState({
    nome: '',
    url_base: '',
    supabase_url: '',
    supabase_anon_key: '',
    tabela_produtos: 'products',
    mapeamento_campos: JSON.stringify({
      nome: 'name',
      descricao: 'description',
      preco: 'sale_price',
      precoOriginal: 'original_price',
      imagens: 'images',
      categoria: 'category_name',
      tamanhos: 'sizes',
      cores: 'colors'
    }, null, 2),
    ativo: true
  });

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setConnectionStatus('untested');
  };

  const handleTestarConexao = async () => {
    if (!formData.supabase_url || !formData.supabase_anon_key) {
      toast.error('Preencha a URL e a chave do Supabase');
      return;
    }

    setIsTesting(true);
    try {
      let mapeamento: Record<string, string>;
      try {
        mapeamento = JSON.parse(formData.mapeamento_campos);
      } catch {
        toast.error('JSON de mapeamento inválido');
        setIsTesting(false);
        return;
      }

      const testLoja: LojaParceira = {
        id: 'test',
        user_id: null,
        nome: formData.nome,
        url_base: formData.url_base,
        supabase_url: formData.supabase_url,
        supabase_anon_key: formData.supabase_anon_key,
        tabela_produtos: formData.tabela_produtos,
        mapeamento_campos: mapeamento,
        ativo: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const success = await testarConexao(testLoja);
      setConnectionStatus(success ? 'success' : 'failed');
      
      if (success) {
        toast.success('Conexão estabelecida com sucesso!');
      } else {
        toast.error('Falha ao conectar com a API da loja');
      }
    } catch (error) {
      console.error('Erro ao testar conexão:', error);
      setConnectionStatus('failed');
      toast.error('Erro ao testar conexão');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.nome || !formData.url_base) {
      toast.error('Preencha o nome e URL da loja');
      return;
    }

    setIsLoading(true);
    try {
      let mapeamento: Record<string, string>;
      try {
        mapeamento = JSON.parse(formData.mapeamento_campos);
      } catch {
        toast.error('JSON de mapeamento inválido');
        setIsLoading(false);
        return;
      }

      await addLoja({
        nome: formData.nome,
        url_base: formData.url_base,
        supabase_url: formData.supabase_url || null,
        supabase_anon_key: formData.supabase_anon_key || null,
        tabela_produtos: formData.tabela_produtos,
        mapeamento_campos: mapeamento,
        ativo: formData.ativo
      });

      onClose();
      setFormData({
        nome: '',
        url_base: '',
        supabase_url: '',
        supabase_anon_key: '',
        tabela_produtos: 'products',
        mapeamento_campos: JSON.stringify({
          nome: 'name',
          descricao: 'description',
          preco: 'sale_price',
          precoOriginal: 'original_price',
          imagens: 'images',
          categoria: 'category_name',
          tamanhos: 'sizes',
          cores: 'colors'
        }, null, 2),
        ativo: true
      });
      setConnectionStatus('untested');
    } catch (error) {
      console.error('Erro ao adicionar loja:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Store className="h-5 w-5 text-primary" />
            Adicionar Loja Parceira
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Informações básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome da Loja *</Label>
              <div className="relative">
                <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="nome"
                  placeholder="Ex: Minha Loja"
                  value={formData.nome}
                  onChange={(e) => handleChange('nome', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="url_base">URL da Loja *</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="url_base"
                  placeholder="https://minhaloja.com"
                  value={formData.url_base}
                  onChange={(e) => handleChange('url_base', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Configurações da API */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Database className="h-4 w-4" />
              Configurações da API (opcional)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="supabase_url">URL do Supabase</Label>
                <Input
                  id="supabase_url"
                  placeholder="https://xxx.supabase.co"
                  value={formData.supabase_url}
                  onChange={(e) => handleChange('supabase_url', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tabela_produtos">Tabela de Produtos</Label>
                <Input
                  id="tabela_produtos"
                  placeholder="products"
                  value={formData.tabela_produtos}
                  onChange={(e) => handleChange('tabela_produtos', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="supabase_anon_key">Chave Anon (API Key)</Label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="supabase_anon_key"
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={formData.supabase_anon_key}
                  onChange={(e) => handleChange('supabase_anon_key', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Mapeamento de campos */}
          <div className="space-y-2">
            <Label htmlFor="mapeamento">Mapeamento de Campos (JSON)</Label>
            <Textarea
              id="mapeamento"
              rows={8}
              className="font-mono text-sm"
              value={formData.mapeamento_campos}
              onChange={(e) => handleChange('mapeamento_campos', e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Define como os campos da API da loja correspondem aos campos do sistema
            </p>
          </div>

          {/* Status e ativo */}
          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.ativo}
                onCheckedChange={(checked) => handleChange('ativo', checked)}
              />
              <Label>Loja ativa</Label>
            </div>

            <div className="flex items-center gap-2">
              {connectionStatus === 'success' && (
                <span className="flex items-center gap-1 text-sm text-green-500">
                  <CheckCircle className="h-4 w-4" />
                  Conectada
                </span>
              )}
              {connectionStatus === 'failed' && (
                <span className="flex items-center gap-1 text-sm text-red-500">
                  <XCircle className="h-4 w-4" />
                  Falha
                </span>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleTestarConexao}
                disabled={isTesting || !formData.supabase_url || !formData.supabase_anon_key}
              >
                {isTesting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Testando...
                  </>
                ) : (
                  'Testar Conexão'
                )}
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              'Adicionar Loja'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
