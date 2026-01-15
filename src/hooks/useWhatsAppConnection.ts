import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

interface WhatsAppInstance {
  id: string;
  instance_name: string;
  api_key: string | null;
  evolution_url: string | null;
  status: string;
  display_name: string | null;
}

export function useWhatsAppConnection(instanceId: string | null) {
  const [status, setStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [instance, setInstance] = useState<WhatsAppInstance | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchInstance = useCallback(async () => {
    if (!instanceId) return;
    const { data, error } = await supabase
      .from('whatsapp_instances')
      .select('*')
      .eq('id', instanceId)
      .single();

    if (error) {
      console.error('Error fetching instance:', error);
      return;
    }

    setInstance(data);
    setStatus(data.status as 'connected' | 'disconnected' | 'connecting');
  }, [instanceId]);

  const checkStatus = useCallback(async () => {
    if (!instance || !instance.api_key || !instance.evolution_url) return;

    try {
      const response = await fetch(
        `${instance.evolution_url}/instance/connectionState/${instance.instance_name}`,
        {
          headers: {
            apikey: instance.api_key
          }
        }
      );
      const data = await response.json();
      const newStatus = data.state === 'open' ? 'connected' : 'disconnected';

      if (newStatus !== status) {
        setStatus(newStatus);
        await supabase
          .from('whatsapp_instances')
          .update({ 
            status: newStatus, 
            last_connected_at: newStatus === 'connected' ? new Date().toISOString() : undefined 
          })
          .eq('id', instanceId);

        if (newStatus === 'connected') {
          toast({
            title: "WhatsApp conectado!",
            description: `${instance.display_name || instance.instance_name} está online.`,
          });
          setQrCode(null);
        }
      }
    } catch (error) {
      console.error('Error checking status:', error);
    }
  }, [instance, status, instanceId, toast]);

  useEffect(() => {
    if (!instanceId) return;
    fetchInstance();
  }, [instanceId, fetchInstance]);

  useEffect(() => {
    if (!instance) return;
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, [instance, checkStatus]);

  const connect = async () => {
    if (!instance || !instance.api_key || !instance.evolution_url) {
      toast({
        title: "Erro de configuração",
        description: "API Key ou URL da Evolution não configurada.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      setStatus('connecting');
      
      const response = await fetch(
        `${instance.evolution_url}/instance/connect/${instance.instance_name}`,
        {
          headers: {
            apikey: instance.api_key
          }
        }
      );
      const data = await response.json();

      if (data.base64) {
        setQrCode(data.base64);
        await supabase
          .from('whatsapp_instances')
          .update({ status: 'connecting', qr_code: data.base64 })
          .eq('id', instanceId);
      } else if (data.qrcode?.base64) {
        setQrCode(data.qrcode.base64);
        await supabase
          .from('whatsapp_instances')
          .update({ status: 'connecting', qr_code: data.qrcode.base64 })
          .eq('id', instanceId);
      }
    } catch (error) {
      console.error('Error connecting:', error);
      toast({
        title: "Erro ao conectar",
        description: "Não foi possível gerar o QR Code.",
        variant: "destructive",
      });
      setStatus('disconnected');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = async () => {
    if (!instance || !instance.api_key || !instance.evolution_url) return;

    try {
      setIsLoading(true);
      await fetch(
        `${instance.evolution_url}/instance/logout/${instance.instance_name}`,
        {
          method: 'DELETE',
          headers: {
            apikey: instance.api_key
          }
        }
      );
      setStatus('disconnected');
      setQrCode(null);
      await supabase
        .from('whatsapp_instances')
        .update({ status: 'disconnected', qr_code: null })
        .eq('id', instanceId);

      toast({
        title: "WhatsApp desconectado",
        description: `${instance.display_name || instance.instance_name} foi desconectado.`,
      });
    } catch (error) {
      console.error('Error disconnecting:', error);
      toast({
        title: "Erro ao desconectar",
        description: "Não foi possível desconectar a instância.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetQrCode = () => {
    setQrCode(null);
  };

  return { status, qrCode, connect, disconnect, isLoading, resetQrCode };
}
