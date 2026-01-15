import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ContactListProcessor, ProcessingResult } from "@/lib/services/contact-list-processor";
import { toast } from "sonner";

interface ContactList {
  id: string;
  user_id: string;
  name: string;
  file_url: string | null;
  total_contacts: number;
  valid_contacts: number;
  invalid_contacts: number;
  status: string;
  error_message: string | null;
  created_at: string;
  processed_at: string | null;
}

export function useContactLists() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const listsQuery = useQuery({
    queryKey: ['contact-lists', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('contact_lists')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ContactList[];
    },
    enabled: !!user?.id
  });

  const uploadMutation = useMutation({
    mutationFn: async ({ file, name }: { file: File; name: string }) => {
      if (!user?.id) throw new Error('Usuário não autenticado');
      return ContactListProcessor.uploadAndProcess(user.id, file, name);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['contact-lists'] });
      queryClient.invalidateQueries({ queryKey: ['whatsapp-contacts'] });
      toast.success(`Lista processada! ${data.result.valid} contatos válidos de ${data.result.total}`);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (listId: string) => {
      const { error } = await supabase
        .from('contact_lists')
        .delete()
        .eq('id', listId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-lists'] });
      toast.success('Lista excluída com sucesso');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao excluir: ${error.message}`);
    }
  });

  return {
    lists: listsQuery.data || [],
    isLoading: listsQuery.isLoading,
    upload: uploadMutation.mutate,
    isUploading: uploadMutation.isPending,
    deleteList: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending
  };
}
