import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface WhatsAppGroup {
  id: string;
  user_id: string;
  instance_id: string | null;
  group_jid: string;
  name: string;
  description: string | null;
  participants_count: number;
  is_admin: boolean;
  extracted_at: string | null;
  created_at: string;
}

export function useWhatsAppGroups() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["whatsapp-groups"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("whatsapp_groups")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      return data as WhatsAppGroup[];
    },
    enabled: !!user,
  });
}
