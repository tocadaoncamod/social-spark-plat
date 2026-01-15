export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      agent_action_logs: {
        Row: {
          action_data: Json | null
          action_type: string
          agent_id: string
          created_at: string | null
          duration_ms: number | null
          id: string
          result: Json | null
          status: string | null
          user_id: string
        }
        Insert: {
          action_data?: Json | null
          action_type: string
          agent_id: string
          created_at?: string | null
          duration_ms?: number | null
          id?: string
          result?: Json | null
          status?: string | null
          user_id: string
        }
        Update: {
          action_data?: Json | null
          action_type?: string
          agent_id?: string
          created_at?: string | null
          duration_ms?: number | null
          id?: string
          result?: Json | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      agent_cache: {
        Row: {
          created_at: string | null
          expires_at: string
          hit_count: number | null
          id: string
          personas_used: string[] | null
          query_hash: string
          response: string
          tools_used: string[] | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          hit_count?: number | null
          id?: string
          personas_used?: string[] | null
          query_hash: string
          response: string
          tools_used?: string[] | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          hit_count?: number | null
          id?: string
          personas_used?: string[] | null
          query_hash?: string
          response?: string
          tools_used?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      agent_knowledge: {
        Row: {
          content: string
          id: string
          learned_at: string | null
          source_type: string | null
          source_url: string | null
          summary: string | null
          title: string
          user_id: string
        }
        Insert: {
          content: string
          id?: string
          learned_at?: string | null
          source_type?: string | null
          source_url?: string | null
          summary?: string | null
          title: string
          user_id: string
        }
        Update: {
          content?: string
          id?: string
          learned_at?: string | null
          source_type?: string | null
          source_url?: string | null
          summary?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      agent_learned_knowledge: {
        Row: {
          access_count: number | null
          content: string
          id: string
          importance: number | null
          last_accessed: string | null
          learned_at: string | null
          source: string | null
          topic: string
          user_id: string
        }
        Insert: {
          access_count?: number | null
          content: string
          id?: string
          importance?: number | null
          last_accessed?: string | null
          learned_at?: string | null
          source?: string | null
          topic: string
          user_id: string
        }
        Update: {
          access_count?: number | null
          content?: string
          id?: string
          importance?: number | null
          last_accessed?: string | null
          learned_at?: string | null
          source?: string | null
          topic?: string
          user_id?: string
        }
        Relationships: []
      }
      agent_memory: {
        Row: {
          access_count: number | null
          context: string | null
          created_at: string
          expires_at: string | null
          id: string
          importance: number | null
          last_accessed: string | null
          memory_key: string
          memory_type: Database["public"]["Enums"]["memory_type"]
          memory_value: string
          updated_at: string
          user_id: string
        }
        Insert: {
          access_count?: number | null
          context?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          importance?: number | null
          last_accessed?: string | null
          memory_key: string
          memory_type?: Database["public"]["Enums"]["memory_type"]
          memory_value: string
          updated_at?: string
          user_id: string
        }
        Update: {
          access_count?: number | null
          context?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          importance?: number | null
          last_accessed?: string | null
          memory_key?: string
          memory_type?: Database["public"]["Enums"]["memory_type"]
          memory_value?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      agentes_especializados: {
        Row: {
          ativo: boolean | null
          conhecimentos: Json | null
          created_at: string | null
          ia_primaria: string | null
          ia_secundaria: string | null
          id: string
          nome: string
          plataforma: string
          prompt_base: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ativo?: boolean | null
          conhecimentos?: Json | null
          created_at?: string | null
          ia_primaria?: string | null
          ia_secundaria?: string | null
          id?: string
          nome: string
          plataforma: string
          prompt_base: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ativo?: boolean | null
          conhecimentos?: Json | null
          created_at?: string | null
          ia_primaria?: string | null
          ia_secundaria?: string | null
          id?: string
          nome?: string
          plataforma?: string
          prompt_base?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      businesses: {
        Row: {
          address: string | null
          category: string | null
          created_at: string | null
          google_maps_url: string | null
          id: string
          lat: number | null
          lng: number | null
          name: string
          phone: string | null
          photos: string[] | null
          place_id: string
          rating: number | null
          types: string[] | null
          user_id: string
          user_ratings_total: number | null
          website: string | null
        }
        Insert: {
          address?: string | null
          category?: string | null
          created_at?: string | null
          google_maps_url?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          name: string
          phone?: string | null
          photos?: string[] | null
          place_id: string
          rating?: number | null
          types?: string[] | null
          user_id: string
          user_ratings_total?: number | null
          website?: string | null
        }
        Update: {
          address?: string | null
          category?: string | null
          created_at?: string | null
          google_maps_url?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          name?: string
          phone?: string | null
          photos?: string[] | null
          place_id?: string
          rating?: number | null
          types?: string[] | null
          user_id?: string
          user_ratings_total?: number | null
          website?: string | null
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          budget: number | null
          created_at: string | null
          id: string
          metrics: Json | null
          name: string
          platform: string
          status: string | null
          user_id: string
        }
        Insert: {
          budget?: number | null
          created_at?: string | null
          id?: string
          metrics?: Json | null
          name: string
          platform: string
          status?: string | null
          user_id: string
        }
        Update: {
          budget?: number | null
          created_at?: string | null
          id?: string
          metrics?: Json | null
          name?: string
          platform?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      case_comments: {
        Row: {
          attachments: Json | null
          case_id: string
          content: string
          created_at: string
          id: string
          is_internal: boolean | null
          user_id: string
        }
        Insert: {
          attachments?: Json | null
          case_id: string
          content: string
          created_at?: string
          id?: string
          is_internal?: boolean | null
          user_id: string
        }
        Update: {
          attachments?: Json | null
          case_id?: string
          content?: string
          created_at?: string
          id?: string
          is_internal?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_comments_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "support_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      competitor_analysis: {
        Row: {
          analysis: string | null
          competitor_name: string
          content_strategy: string | null
          created_at: string | null
          id: string
          platform: string | null
          price_range: Json | null
          products: Json | null
          profile_url: string | null
          strengths: string[] | null
          target_audience: string | null
          updated_at: string | null
          user_id: string
          weaknesses: string[] | null
        }
        Insert: {
          analysis?: string | null
          competitor_name: string
          content_strategy?: string | null
          created_at?: string | null
          id?: string
          platform?: string | null
          price_range?: Json | null
          products?: Json | null
          profile_url?: string | null
          strengths?: string[] | null
          target_audience?: string | null
          updated_at?: string | null
          user_id: string
          weaknesses?: string[] | null
        }
        Update: {
          analysis?: string | null
          competitor_name?: string
          content_strategy?: string | null
          created_at?: string | null
          id?: string
          platform?: string | null
          price_range?: Json | null
          products?: Json | null
          profile_url?: string | null
          strengths?: string[] | null
          target_audience?: string | null
          updated_at?: string | null
          user_id?: string
          weaknesses?: string[] | null
        }
        Relationships: []
      }
      contact_lists: {
        Row: {
          created_at: string | null
          error_message: string | null
          file_url: string | null
          id: string
          invalid_contacts: number | null
          name: string
          processed_at: string | null
          status: string | null
          total_contacts: number | null
          user_id: string
          valid_contacts: number | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          file_url?: string | null
          id?: string
          invalid_contacts?: number | null
          name: string
          processed_at?: string | null
          status?: string | null
          total_contacts?: number | null
          user_id: string
          valid_contacts?: number | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          file_url?: string | null
          id?: string
          invalid_contacts?: number | null
          name?: string
          processed_at?: string | null
          status?: string | null
          total_contacts?: number | null
          user_id?: string
          valid_contacts?: number | null
        }
        Relationships: []
      }
      facebook_ad_campaigns: {
        Row: {
          ad_id: string | null
          adset_id: string | null
          campaign_id: string
          campaign_name: string | null
          clicks: number | null
          conversions: number | null
          created_at: string | null
          creative_id: string | null
          daily_budget: number | null
          id: string
          impressions: number | null
          objective: string | null
          status: string | null
          targeting: Json | null
          total_spent: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ad_id?: string | null
          adset_id?: string | null
          campaign_id: string
          campaign_name?: string | null
          clicks?: number | null
          conversions?: number | null
          created_at?: string | null
          creative_id?: string | null
          daily_budget?: number | null
          id?: string
          impressions?: number | null
          objective?: string | null
          status?: string | null
          targeting?: Json | null
          total_spent?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ad_id?: string | null
          adset_id?: string | null
          campaign_id?: string
          campaign_name?: string | null
          clicks?: number | null
          conversions?: number | null
          created_at?: string | null
          creative_id?: string | null
          daily_budget?: number | null
          id?: string
          impressions?: number | null
          objective?: string | null
          status?: string | null
          targeting?: Json | null
          total_spent?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      facebook_grupos_automaticos: {
        Row: {
          created_at: string | null
          descricao: string | null
          grupo_id: string
          id: string
          membros: number | null
          nome: string
          permite_vendas: boolean | null
          proximo_post: string | null
          regras: Json | null
          requisitos_entrada: Json | null
          status: string | null
          ultimo_post: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          descricao?: string | null
          grupo_id: string
          id?: string
          membros?: number | null
          nome: string
          permite_vendas?: boolean | null
          proximo_post?: string | null
          regras?: Json | null
          requisitos_entrada?: Json | null
          status?: string | null
          ultimo_post?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          descricao?: string | null
          grupo_id?: string
          id?: string
          membros?: number | null
          nome?: string
          permite_vendas?: boolean | null
          proximo_post?: string | null
          regras?: Json | null
          requisitos_entrada?: Json | null
          status?: string | null
          ultimo_post?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      facebook_marketplace_produtos: {
        Row: {
          categoria: string | null
          condicao: string | null
          created_at: string | null
          descricao: string
          id: string
          imagens: Json | null
          listagem_id: string | null
          localizacao: string | null
          mensagens: number | null
          preco: number
          produto_id: string | null
          status: string | null
          titulo: string
          ultima_atualizacao: string | null
          user_id: string
          visualizacoes: number | null
        }
        Insert: {
          categoria?: string | null
          condicao?: string | null
          created_at?: string | null
          descricao: string
          id?: string
          imagens?: Json | null
          listagem_id?: string | null
          localizacao?: string | null
          mensagens?: number | null
          preco: number
          produto_id?: string | null
          status?: string | null
          titulo: string
          ultima_atualizacao?: string | null
          user_id: string
          visualizacoes?: number | null
        }
        Update: {
          categoria?: string | null
          condicao?: string | null
          created_at?: string | null
          descricao?: string
          id?: string
          imagens?: Json | null
          listagem_id?: string | null
          localizacao?: string | null
          mensagens?: number | null
          preco?: number
          produto_id?: string | null
          status?: string | null
          titulo?: string
          ultima_atualizacao?: string | null
          user_id?: string
          visualizacoes?: number | null
        }
        Relationships: []
      }
      facebook_posts_grupos: {
        Row: {
          agendado_para: string | null
          created_at: string | null
          grupo_id: string | null
          id: string
          imagem_url: string | null
          link: string | null
          post_id: string | null
          produto_id: string | null
          publicado_em: string | null
          status: string | null
          texto: string
          user_id: string
        }
        Insert: {
          agendado_para?: string | null
          created_at?: string | null
          grupo_id?: string | null
          id?: string
          imagem_url?: string | null
          link?: string | null
          post_id?: string | null
          produto_id?: string | null
          publicado_em?: string | null
          status?: string | null
          texto: string
          user_id: string
        }
        Update: {
          agendado_para?: string | null
          created_at?: string | null
          grupo_id?: string | null
          id?: string
          imagem_url?: string | null
          link?: string | null
          post_id?: string | null
          produto_id?: string | null
          publicado_em?: string | null
          status?: string | null
          texto?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "facebook_posts_grupos_grupo_id_fkey"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "facebook_grupos_automaticos"
            referencedColumns: ["id"]
          },
        ]
      }
      facebook_response_templates: {
        Row: {
          category: string
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          template_text: string
          updated_at: string
          usage_count: number | null
          user_id: string
          variables: Json | null
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          template_text: string
          updated_at?: string
          usage_count?: number | null
          user_id: string
          variables?: Json | null
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          template_text?: string
          updated_at?: string
          usage_count?: number | null
          user_id?: string
          variables?: Json | null
        }
        Relationships: []
      }
      facebook_respostas_automaticas: {
        Row: {
          contexto: string | null
          conversa_id: string
          created_at: string | null
          id: string
          mensagem_recebida: string
          produto_id: string | null
          remetente_id: string
          remetente_nome: string | null
          respondido: boolean | null
          respondido_em: string | null
          resposta_enviada: string | null
          user_id: string
        }
        Insert: {
          contexto?: string | null
          conversa_id: string
          created_at?: string | null
          id?: string
          mensagem_recebida: string
          produto_id?: string | null
          remetente_id: string
          remetente_nome?: string | null
          respondido?: boolean | null
          respondido_em?: string | null
          resposta_enviada?: string | null
          user_id: string
        }
        Update: {
          contexto?: string | null
          conversa_id?: string
          created_at?: string | null
          id?: string
          mensagem_recebida?: string
          produto_id?: string | null
          remetente_id?: string
          remetente_nome?: string | null
          respondido?: boolean | null
          respondido_em?: string | null
          resposta_enviada?: string | null
          user_id?: string
        }
        Relationships: []
      }
      facebook_token_config: {
        Row: {
          access_token_expires_at: string | null
          ad_account_id: string | null
          created_at: string
          id: string
          last_validated_at: string | null
          page_id: string | null
          page_name: string | null
          permissions_granted: string[] | null
          token_status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token_expires_at?: string | null
          ad_account_id?: string | null
          created_at?: string
          id?: string
          last_validated_at?: string | null
          page_id?: string | null
          page_name?: string | null
          permissions_granted?: string[] | null
          token_status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token_expires_at?: string | null
          ad_account_id?: string | null
          created_at?: string
          id?: string
          last_validated_at?: string | null
          page_id?: string | null
          page_name?: string | null
          permissions_granted?: string[] | null
          token_status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      generations: {
        Row: {
          category: string | null
          created_at: string | null
          external_job_id: string | null
          id: string
          input_garment_url: string
          input_model_url: string
          output_url: string | null
          sku_id: string
          status: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          external_job_id?: string | null
          id?: string
          input_garment_url: string
          input_model_url: string
          output_url?: string | null
          sku_id: string
          status?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          external_job_id?: string | null
          id?: string
          input_garment_url?: string
          input_model_url?: string
          output_url?: string | null
          sku_id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      google_maps_searches: {
        Row: {
          created_at: string | null
          id: string
          location: string | null
          query: string
          results_count: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          location?: string | null
          query: string
          results_count?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          location?: string | null
          query?: string
          results_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      lead_behavior_analytics: {
        Row: {
          behavior_type: string
          created_at: string
          engagement_score: number | null
          id: string
          insights: Json | null
          interaction_count: number | null
          last_interaction: string | null
          lead_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          behavior_type: string
          created_at?: string
          engagement_score?: number | null
          id?: string
          insights?: Json | null
          interaction_count?: number | null
          last_interaction?: string | null
          lead_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          behavior_type?: string
          created_at?: string
          engagement_score?: number | null
          id?: string
          insights?: Json | null
          interaction_count?: number | null
          last_interaction?: string | null
          lead_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_behavior_analytics_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "lead_scraper_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_scraper_campaigns: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          instance_id: string | null
          keywords: string[]
          location: string | null
          metadata: Json | null
          name: string
          radius_km: number | null
          sources: string[]
          started_at: string | null
          status: string | null
          total_leads: number | null
          unique_leads: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          instance_id?: string | null
          keywords?: string[]
          location?: string | null
          metadata?: Json | null
          name: string
          radius_km?: number | null
          sources?: string[]
          started_at?: string | null
          status?: string | null
          total_leads?: number | null
          unique_leads?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          instance_id?: string | null
          keywords?: string[]
          location?: string | null
          metadata?: Json | null
          name?: string
          radius_km?: number | null
          sources?: string[]
          started_at?: string | null
          status?: string | null
          total_leads?: number | null
          unique_leads?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_scraper_campaigns_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_scraper_leads: {
        Row: {
          address: string | null
          bio: string | null
          business_name: string | null
          campaign_id: string
          category: string | null
          city: string | null
          created_at: string | null
          facebook_url: string | null
          id: string
          instagram_url: string | null
          keywords_matched: string[] | null
          name: string | null
          phone_number: string
          platform_destination: string | null
          profile_picture_url: string | null
          rating: number | null
          relevance_score: number | null
          source: string
          source_metadata: Json | null
          source_url: string | null
          state: string | null
          status: string | null
          updated_at: string | null
          user_id: string
          website_url: string | null
        }
        Insert: {
          address?: string | null
          bio?: string | null
          business_name?: string | null
          campaign_id: string
          category?: string | null
          city?: string | null
          created_at?: string | null
          facebook_url?: string | null
          id?: string
          instagram_url?: string | null
          keywords_matched?: string[] | null
          name?: string | null
          phone_number: string
          platform_destination?: string | null
          profile_picture_url?: string | null
          rating?: number | null
          relevance_score?: number | null
          source: string
          source_metadata?: Json | null
          source_url?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
          website_url?: string | null
        }
        Update: {
          address?: string | null
          bio?: string | null
          business_name?: string | null
          campaign_id?: string
          category?: string | null
          city?: string | null
          created_at?: string | null
          facebook_url?: string | null
          id?: string
          instagram_url?: string | null
          keywords_matched?: string[] | null
          name?: string | null
          phone_number?: string
          platform_destination?: string | null
          profile_picture_url?: string | null
          rating?: number | null
          relevance_score?: number | null
          source?: string
          source_metadata?: Json | null
          source_url?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_scraper_leads_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "lead_scraper_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      leads_contatados: {
        Row: {
          created_at: string | null
          data_envio: string | null
          id: string
          lead_id: string | null
          lead_scraper_id: string | null
          mensagem_enviada: string
          respondeu: boolean | null
          resposta: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data_envio?: string | null
          id?: string
          lead_id?: string | null
          lead_scraper_id?: string | null
          mensagem_enviada: string
          respondeu?: boolean | null
          resposta?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          data_envio?: string | null
          id?: string
          lead_id?: string | null
          lead_scraper_id?: string | null
          mensagem_enviada?: string
          respondeu?: boolean | null
          resposta?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_contatados_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_contatados_lead_scraper_id_fkey"
            columns: ["lead_scraper_id"]
            isOneToOne: false
            referencedRelation: "lead_scraper_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lojas_parceiras: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          id: string
          mapeamento_campos: Json | null
          nome: string
          supabase_anon_key: string | null
          supabase_url: string | null
          tabela_produtos: string | null
          updated_at: string | null
          url_base: string
          user_id: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          id?: string
          mapeamento_campos?: Json | null
          nome: string
          supabase_anon_key?: string | null
          supabase_url?: string | null
          tabela_produtos?: string | null
          updated_at?: string | null
          url_base: string
          user_id?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          id?: string
          mapeamento_campos?: Json | null
          nome?: string
          supabase_anon_key?: string | null
          supabase_url?: string | null
          tabela_produtos?: string | null
          updated_at?: string | null
          url_base?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lojas_parceiras_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      master_prompts: {
        Row: {
          act: string
          category: string | null
          created_at: string
          for_devs: boolean | null
          id: string
          is_active: boolean | null
          prompt: string
          usage_count: number | null
        }
        Insert: {
          act: string
          category?: string | null
          created_at?: string
          for_devs?: boolean | null
          id?: string
          is_active?: boolean | null
          prompt: string
          usage_count?: number | null
        }
        Update: {
          act?: string
          category?: string | null
          created_at?: string
          for_devs?: boolean | null
          id?: string
          is_active?: boolean | null
          prompt?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          chat_id: string
          content: string | null
          direction: string | null
          id: string
          platform: string
          sent_at: string | null
          user_id: string
        }
        Insert: {
          chat_id: string
          content?: string | null
          direction?: string | null
          id?: string
          platform: string
          sent_at?: string | null
          user_id: string
        }
        Update: {
          chat_id?: string
          content?: string | null
          direction?: string | null
          id?: string
          platform?: string
          sent_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_progress: {
        Row: {
          achievements: Json | null
          completed_at: string | null
          completed_steps: number[] | null
          created_at: string
          current_step: number | null
          first_campaign_created: boolean | null
          first_chatbot_activated: boolean | null
          first_contacts_imported: boolean | null
          first_instance_connected: boolean | null
          first_lead_analyzed: boolean | null
          id: string
          onboarding_completed: boolean | null
          total_points: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          achievements?: Json | null
          completed_at?: string | null
          completed_steps?: number[] | null
          created_at?: string
          current_step?: number | null
          first_campaign_created?: boolean | null
          first_chatbot_activated?: boolean | null
          first_contacts_imported?: boolean | null
          first_instance_connected?: boolean | null
          first_lead_analyzed?: boolean | null
          id?: string
          onboarding_completed?: boolean | null
          total_points?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          achievements?: Json | null
          completed_at?: string | null
          completed_steps?: number[] | null
          created_at?: string
          current_step?: number | null
          first_campaign_created?: boolean | null
          first_chatbot_activated?: boolean | null
          first_contacts_imported?: boolean | null
          first_instance_connected?: boolean | null
          first_lead_analyzed?: boolean | null
          id?: string
          onboarding_completed?: boolean | null
          total_points?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          media_urls: string[] | null
          metrics: Json | null
          platform: string
          published_at: string | null
          scheduled_for: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          media_urls?: string[] | null
          metrics?: Json | null
          platform: string
          published_at?: string | null
          scheduled_for?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          media_urls?: string[] | null
          metrics?: Json | null
          platform?: string
          published_at?: string | null
          scheduled_for?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_prompts: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_default: boolean | null
          name: string
          prompt_template: string
          variables: Json | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          prompt_template: string
          variables?: Json | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          prompt_template?: string
          variables?: Json | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          credits: number | null
          email: string | null
          id: string
          is_admin: boolean | null
          name: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          credits?: number | null
          email?: string | null
          id: string
          is_admin?: boolean | null
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          credits?: number | null
          email?: string | null
          id?: string
          is_admin?: boolean | null
          name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      purchase_recommendations: {
        Row: {
          ad_platform: string | null
          created_at: string | null
          estimated_cost: number | null
          estimated_sale_price: number | null
          id: string
          product_category: string
          product_name: string | null
          profit_margin: number | null
          reasoning: string | null
          sales_probability: number | null
          sources: Json | null
          supplier_name: string | null
          supplier_url: string | null
          target_region: string | null
          user_id: string
        }
        Insert: {
          ad_platform?: string | null
          created_at?: string | null
          estimated_cost?: number | null
          estimated_sale_price?: number | null
          id?: string
          product_category: string
          product_name?: string | null
          profit_margin?: number | null
          reasoning?: string | null
          sales_probability?: number | null
          sources?: Json | null
          supplier_name?: string | null
          supplier_url?: string | null
          target_region?: string | null
          user_id: string
        }
        Update: {
          ad_platform?: string | null
          created_at?: string | null
          estimated_cost?: number | null
          estimated_sale_price?: number | null
          id?: string
          product_category?: string
          product_name?: string | null
          profit_margin?: number | null
          reasoning?: string | null
          sales_probability?: number | null
          sources?: Json | null
          supplier_name?: string | null
          supplier_url?: string | null
          target_region?: string | null
          user_id?: string
        }
        Relationships: []
      }
      rotas_vendas: {
        Row: {
          created_at: string | null
          distancia_total: number | null
          id: string
          leads_ids: string[] | null
          nome: string | null
          ordem_otimizada: Json | null
          ponto_partida: string | null
          tempo_total: number | null
          url_google_maps: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          distancia_total?: number | null
          id?: string
          leads_ids?: string[] | null
          nome?: string | null
          ordem_otimizada?: Json | null
          ponto_partida?: string | null
          tempo_total?: number | null
          url_google_maps?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          distancia_total?: number | null
          id?: string
          leads_ids?: string[] | null
          nome?: string | null
          ordem_otimizada?: Json | null
          ponto_partida?: string | null
          tempo_total?: number | null
          url_google_maps?: string | null
          user_id?: string
        }
        Relationships: []
      }
      scheduled_auto_messages: {
        Row: {
          campaign_id: string | null
          completed_at: string | null
          created_at: string
          delay_max: number
          delay_min: number
          failed_count: number | null
          id: string
          instance_id: string | null
          lead_types: string[]
          media_type: string | null
          media_url: string | null
          messages: Json
          name: string
          scheduled_for: string
          sent_count: number | null
          started_at: string | null
          status: string
          total_leads: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          campaign_id?: string | null
          completed_at?: string | null
          created_at?: string
          delay_max?: number
          delay_min?: number
          failed_count?: number | null
          id?: string
          instance_id?: string | null
          lead_types?: string[]
          media_type?: string | null
          media_url?: string | null
          messages: Json
          name: string
          scheduled_for: string
          sent_count?: number | null
          started_at?: string | null
          status?: string
          total_leads?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          campaign_id?: string | null
          completed_at?: string | null
          created_at?: string
          delay_max?: number
          delay_min?: number
          failed_count?: number | null
          id?: string
          instance_id?: string | null
          lead_types?: string[]
          media_type?: string | null
          media_url?: string | null
          messages?: Json
          name?: string
          scheduled_for?: string
          sent_count?: number | null
          started_at?: string | null
          status?: string
          total_leads?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_auto_messages_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "lead_scraper_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_auto_messages_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      send_time_analytics: {
        Row: {
          avg_response_time_minutes: number | null
          day_of_week: number
          engagement_score: number | null
          hour_of_day: number
          id: string
          messages_read: number | null
          messages_sent: number | null
          platform: string
          responses_received: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avg_response_time_minutes?: number | null
          day_of_week: number
          engagement_score?: number | null
          hour_of_day: number
          id?: string
          messages_read?: number | null
          messages_sent?: number | null
          platform: string
          responses_received?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avg_response_time_minutes?: number | null
          day_of_week?: number
          engagement_score?: number | null
          hour_of_day?: number
          id?: string
          messages_read?: number | null
          messages_sent?: number | null
          platform?: string
          responses_received?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      social_leads_list_items: {
        Row: {
          created_at: string
          id: string
          lead_id: string
          list_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          lead_id: string
          list_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          lead_id?: string
          list_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_leads_list_items_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "lead_scraper_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_leads_list_items_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "social_leads_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      social_leads_lists: {
        Row: {
          category: string
          created_at: string
          id: string
          name: string
          platform: string
          region: string
          state_code: string | null
          total_leads: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          name: string
          platform: string
          region: string
          state_code?: string | null
          total_leads?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          name?: string
          platform?: string
          region?: string
          state_code?: string | null
          total_leads?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      support_cases: {
        Row: {
          assigned_to: string | null
          category: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          description: string | null
          first_response_at: string | null
          id: string
          metadata: Json | null
          platform: string | null
          priority: string
          resolution_notes: string | null
          resolved_at: string | null
          sla_due_at: string | null
          status: string
          tags: string[] | null
          thread_id: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          category?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          first_response_at?: string | null
          id?: string
          metadata?: Json | null
          platform?: string | null
          priority?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          sla_due_at?: string | null
          status?: string
          tags?: string[] | null
          thread_id?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          category?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          first_response_at?: string | null
          id?: string
          metadata?: Json | null
          platform?: string | null
          priority?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          sla_due_at?: string | null
          status?: string
          tags?: string[] | null
          thread_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tarefas_multiplataforma: {
        Row: {
          completed_at: string | null
          created_at: string | null
          descricao: string
          id: string
          plataformas: string[]
          resultados: Json | null
          status: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          descricao: string
          id?: string
          plataformas?: string[]
          resultados?: Json | null
          status?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          descricao?: string
          id?: string
          plataformas?: string[]
          resultados?: Json | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      tiktok_ai_insights: {
        Row: {
          action_url: string | null
          content: string
          created_at: string
          id: string
          insight_type: string
          is_read: boolean | null
          priority: string
          title: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          content: string
          created_at?: string
          id?: string
          insight_type: string
          is_read?: boolean | null
          priority?: string
          title: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          content?: string
          created_at?: string
          id?: string
          insight_type?: string
          is_read?: boolean | null
          priority?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tiktok_ai_insights_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tiktok_apps: {
        Row: {
          access_token: string | null
          app_id: string
          app_key: string
          app_name: string
          app_secret: string | null
          created_at: string
          id: string
          market: string | null
          permissions_granted: number | null
          refresh_token: string | null
          status: string
          token_expires_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          app_id: string
          app_key: string
          app_name: string
          app_secret?: string | null
          created_at?: string
          id?: string
          market?: string | null
          permissions_granted?: number | null
          refresh_token?: string | null
          status?: string
          token_expires_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string | null
          app_id?: string
          app_key?: string
          app_name?: string
          app_secret?: string | null
          created_at?: string
          id?: string
          market?: string | null
          permissions_granted?: number | null
          refresh_token?: string | null
          status?: string
          token_expires_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tiktok_apps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tiktok_content: {
        Row: {
          comments_count: number | null
          content_type: string
          created_at: string
          description: string | null
          id: string
          influencer_id: string | null
          likes_count: number | null
          products_tagged: string[] | null
          published_at: string | null
          scheduled_for: string | null
          shares_count: number | null
          status: string
          thumbnail_url: string | null
          tiktok_video_id: string | null
          title: string
          updated_at: string
          user_id: string
          video_url: string | null
          views_count: number | null
        }
        Insert: {
          comments_count?: number | null
          content_type?: string
          created_at?: string
          description?: string | null
          id?: string
          influencer_id?: string | null
          likes_count?: number | null
          products_tagged?: string[] | null
          published_at?: string | null
          scheduled_for?: string | null
          shares_count?: number | null
          status?: string
          thumbnail_url?: string | null
          tiktok_video_id?: string | null
          title: string
          updated_at?: string
          user_id: string
          video_url?: string | null
          views_count?: number | null
        }
        Update: {
          comments_count?: number | null
          content_type?: string
          created_at?: string
          description?: string | null
          id?: string
          influencer_id?: string | null
          likes_count?: number | null
          products_tagged?: string[] | null
          published_at?: string | null
          scheduled_for?: string | null
          shares_count?: number | null
          status?: string
          thumbnail_url?: string | null
          tiktok_video_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          video_url?: string | null
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tiktok_content_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "tiktok_influencers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tiktok_content_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tiktok_financial: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          reference_id: string | null
          reference_type: string | null
          status: string
          transaction_date: string
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          reference_type?: string | null
          status?: string
          transaction_date?: string
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          reference_type?: string | null
          status?: string
          transaction_date?: string
          transaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tiktok_financial_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tiktok_influencers: {
        Row: {
          avatar_url: string | null
          commission_earned: number | null
          commission_rate: number | null
          created_at: string
          display_name: string | null
          engagement_rate: number | null
          followers_count: number | null
          id: string
          joined_at: string
          status: string
          tier: string | null
          tiktok_username: string
          total_orders: number | null
          total_sales: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          commission_earned?: number | null
          commission_rate?: number | null
          created_at?: string
          display_name?: string | null
          engagement_rate?: number | null
          followers_count?: number | null
          id?: string
          joined_at?: string
          status?: string
          tier?: string | null
          tiktok_username: string
          total_orders?: number | null
          total_sales?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          commission_earned?: number | null
          commission_rate?: number | null
          created_at?: string
          display_name?: string | null
          engagement_rate?: number | null
          followers_count?: number | null
          id?: string
          joined_at?: string
          status?: string
          tier?: string | null
          tiktok_username?: string
          total_orders?: number | null
          total_sales?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tiktok_influencers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tiktok_products: {
        Row: {
          category: string | null
          compare_at_price: number | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          price: number
          promotion_active: boolean | null
          promotion_discount: number | null
          promotion_end_date: string | null
          promotion_start_date: string | null
          sku: string | null
          status: string
          stock_quantity: number
          tiktok_product_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          compare_at_price?: number | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          price: number
          promotion_active?: boolean | null
          promotion_discount?: number | null
          promotion_end_date?: string | null
          promotion_start_date?: string | null
          sku?: string | null
          status?: string
          stock_quantity?: number
          tiktok_product_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          compare_at_price?: number | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          promotion_active?: boolean | null
          promotion_discount?: number | null
          promotion_end_date?: string | null
          promotion_start_date?: string | null
          sku?: string | null
          status?: string
          stock_quantity?: number
          tiktok_product_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tiktok_products_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tiktok_sales: {
        Row: {
          created_at: string
          customer_name: string | null
          customer_phone: string | null
          discount_amount: number | null
          id: string
          influencer_id: string | null
          payment_status: string
          product_id: string | null
          quantity: number
          region: string | null
          sale_date: string
          shipping_cost: number | null
          status: string
          tiktok_order_id: string | null
          total_amount: number
          unit_price: number
          user_id: string
        }
        Insert: {
          created_at?: string
          customer_name?: string | null
          customer_phone?: string | null
          discount_amount?: number | null
          id?: string
          influencer_id?: string | null
          payment_status?: string
          product_id?: string | null
          quantity?: number
          region?: string | null
          sale_date?: string
          shipping_cost?: number | null
          status?: string
          tiktok_order_id?: string | null
          total_amount: number
          unit_price: number
          user_id: string
        }
        Update: {
          created_at?: string
          customer_name?: string | null
          customer_phone?: string | null
          discount_amount?: number | null
          id?: string
          influencer_id?: string | null
          payment_status?: string
          product_id?: string | null
          quantity?: number
          region?: string | null
          sale_date?: string
          shipping_cost?: number | null
          status?: string
          tiktok_order_id?: string | null
          total_amount?: number
          unit_price?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tiktok_sales_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "tiktok_influencers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tiktok_sales_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "tiktok_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tiktok_sales_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      unified_analytics: {
        Row: {
          avg_response_time_minutes: number | null
          created_at: string
          engagement_rate: number | null
          id: string
          leads_captured: number | null
          leads_converted: number | null
          messages_received: number | null
          messages_sent: number | null
          metadata: Json | null
          metric_date: string
          platform: string
          response_rate: number | null
          revenue: number | null
          user_id: string
        }
        Insert: {
          avg_response_time_minutes?: number | null
          created_at?: string
          engagement_rate?: number | null
          id?: string
          leads_captured?: number | null
          leads_converted?: number | null
          messages_received?: number | null
          messages_sent?: number | null
          metadata?: Json | null
          metric_date: string
          platform: string
          response_rate?: number | null
          revenue?: number | null
          user_id: string
        }
        Update: {
          avg_response_time_minutes?: number | null
          created_at?: string
          engagement_rate?: number | null
          id?: string
          leads_captured?: number | null
          leads_converted?: number | null
          messages_received?: number | null
          messages_sent?: number | null
          metadata?: Json | null
          metric_date?: string
          platform?: string
          response_rate?: number | null
          revenue?: number | null
          user_id?: string
        }
        Relationships: []
      }
      universal_agents: {
        Row: {
          agent_type: string
          category: string
          config: Json | null
          created_at: string | null
          id: string
          is_active: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          agent_type: string
          category: string
          config?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          agent_type?: string
          category?: string
          config?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      voice_conversations: {
        Row: {
          agent_response: string | null
          agent_type: string | null
          created_at: string | null
          id: string
          user_id: string
          user_message: string
        }
        Insert: {
          agent_response?: string | null
          agent_type?: string | null
          created_at?: string | null
          id?: string
          user_id: string
          user_message: string
        }
        Update: {
          agent_response?: string | null
          agent_type?: string | null
          created_at?: string | null
          id?: string
          user_id?: string
          user_message?: string
        }
        Relationships: []
      }
      whatsapp_campaign_contacts: {
        Row: {
          campaign_id: string
          contact_id: string | null
          created_at: string
          error_message: string | null
          id: string
          name: string | null
          phone: string
          sent_at: string | null
          status: string
          variables: Json | null
        }
        Insert: {
          campaign_id: string
          contact_id?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          name?: string | null
          phone: string
          sent_at?: string | null
          status?: string
          variables?: Json | null
        }
        Update: {
          campaign_id?: string
          contact_id?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          name?: string | null
          phone?: string
          sent_at?: string | null
          status?: string
          variables?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_campaign_contacts_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_campaign_contacts_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_campaigns: {
        Row: {
          completed_at: string | null
          created_at: string
          delay_max_seconds: number | null
          delay_min_seconds: number | null
          delivered_count: number | null
          failed_count: number | null
          id: string
          instance_id: string | null
          media_type: string | null
          media_url: string | null
          message_template: string
          name: string
          sent_count: number | null
          started_at: string | null
          status: string
          total_contacts: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          delay_max_seconds?: number | null
          delay_min_seconds?: number | null
          delivered_count?: number | null
          failed_count?: number | null
          id?: string
          instance_id?: string | null
          media_type?: string | null
          media_url?: string | null
          message_template: string
          name: string
          sent_count?: number | null
          started_at?: string | null
          status?: string
          total_contacts?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          delay_max_seconds?: number | null
          delay_min_seconds?: number | null
          delivered_count?: number | null
          failed_count?: number | null
          id?: string
          instance_id?: string | null
          media_type?: string | null
          media_url?: string | null
          message_template?: string
          name?: string
          sent_count?: number | null
          started_at?: string | null
          status?: string
          total_contacts?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_campaigns_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_instances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_campaigns_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_chatbot_config: {
        Row: {
          auto_classify_leads: boolean | null
          created_at: string
          excluded_contacts: string[] | null
          fallback_message: string | null
          id: string
          instance_id: string | null
          is_active: boolean | null
          system_prompt: string | null
          updated_at: string
          user_id: string
          welcome_message: string | null
          working_days: number[] | null
          working_hours_end: string | null
          working_hours_start: string | null
        }
        Insert: {
          auto_classify_leads?: boolean | null
          created_at?: string
          excluded_contacts?: string[] | null
          fallback_message?: string | null
          id?: string
          instance_id?: string | null
          is_active?: boolean | null
          system_prompt?: string | null
          updated_at?: string
          user_id: string
          welcome_message?: string | null
          working_days?: number[] | null
          working_hours_end?: string | null
          working_hours_start?: string | null
        }
        Update: {
          auto_classify_leads?: boolean | null
          created_at?: string
          excluded_contacts?: string[] | null
          fallback_message?: string | null
          id?: string
          instance_id?: string | null
          is_active?: boolean | null
          system_prompt?: string | null
          updated_at?: string
          user_id?: string
          welcome_message?: string | null
          working_days?: number[] | null
          working_hours_end?: string | null
          working_hours_start?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_chatbot_config_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_instances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_chatbot_config_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_contacts: {
        Row: {
          created_at: string | null
          group_name: string | null
          id: string
          is_valid: boolean | null
          last_seen: string | null
          name: string | null
          phone: string
          profile_picture: string | null
          source: string | null
          status_message: string | null
          tags: string[] | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          group_name?: string | null
          id?: string
          is_valid?: boolean | null
          last_seen?: string | null
          name?: string | null
          phone: string
          profile_picture?: string | null
          source?: string | null
          status_message?: string | null
          tags?: string[] | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          group_name?: string | null
          id?: string
          is_valid?: boolean | null
          last_seen?: string | null
          name?: string | null
          phone?: string
          profile_picture?: string | null
          source?: string | null
          status_message?: string | null
          tags?: string[] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_contacts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_groups: {
        Row: {
          created_at: string
          description: string | null
          extracted_at: string | null
          group_jid: string
          id: string
          instance_id: string | null
          is_admin: boolean | null
          name: string
          participants_count: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          extracted_at?: string | null
          group_jid: string
          id?: string
          instance_id?: string | null
          is_admin?: boolean | null
          name: string
          participants_count?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          extracted_at?: string | null
          group_jid?: string
          id?: string
          instance_id?: string | null
          is_admin?: boolean | null
          name?: string
          participants_count?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_groups_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_instances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_groups_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_instances: {
        Row: {
          api_key: string | null
          created_at: string
          display_name: string | null
          evolution_url: string | null
          id: string
          instance_name: string
          is_active: boolean | null
          is_default: boolean | null
          last_connected_at: string | null
          phone_number: string | null
          qr_code: string | null
          status: string
          updated_at: string
          user_id: string
          webhook_url: string | null
        }
        Insert: {
          api_key?: string | null
          created_at?: string
          display_name?: string | null
          evolution_url?: string | null
          id?: string
          instance_name: string
          is_active?: boolean | null
          is_default?: boolean | null
          last_connected_at?: string | null
          phone_number?: string | null
          qr_code?: string | null
          status?: string
          updated_at?: string
          user_id: string
          webhook_url?: string | null
        }
        Update: {
          api_key?: string | null
          created_at?: string
          display_name?: string | null
          evolution_url?: string | null
          id?: string
          instance_name?: string
          is_active?: boolean | null
          is_default?: boolean | null
          last_connected_at?: string | null
          phone_number?: string | null
          qr_code?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          webhook_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_instances_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_lead_rules: {
        Row: {
          classification: string
          created_at: string
          id: string
          is_active: boolean | null
          keywords: string[]
          name: string
          score_change: number | null
          user_id: string
        }
        Insert: {
          classification: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          keywords: string[]
          name: string
          score_change?: number | null
          user_id: string
        }
        Update: {
          classification?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          keywords?: string[]
          name?: string
          score_change?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_lead_rules_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_leads: {
        Row: {
          classification: string
          contact_id: string
          created_at: string
          id: string
          keywords_matched: string[] | null
          last_interaction: string | null
          notes: string | null
          score: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          classification?: string
          contact_id: string
          created_at?: string
          id?: string
          keywords_matched?: string[] | null
          last_interaction?: string | null
          notes?: string | null
          score?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          classification?: string
          contact_id?: string
          created_at?: string
          id?: string
          keywords_matched?: string[] | null
          last_interaction?: string | null
          notes?: string | null
          score?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_leads_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_leads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_messages: {
        Row: {
          contact_id: string | null
          content: string | null
          created_at: string
          delivered_at: string | null
          direction: string
          error_message: string | null
          id: string
          instance_id: string | null
          media_type: string | null
          media_url: string | null
          read_at: string | null
          remote_jid: string | null
          sent_at: string
          status: string
          user_id: string
        }
        Insert: {
          contact_id?: string | null
          content?: string | null
          created_at?: string
          delivered_at?: string | null
          direction?: string
          error_message?: string | null
          id?: string
          instance_id?: string | null
          media_type?: string | null
          media_url?: string | null
          read_at?: string | null
          remote_jid?: string | null
          sent_at?: string
          status?: string
          user_id: string
        }
        Update: {
          contact_id?: string | null
          content?: string | null
          created_at?: string
          delivered_at?: string | null
          direction?: string
          error_message?: string | null
          id?: string
          instance_id?: string | null
          media_type?: string | null
          media_url?: string | null
          read_at?: string | null
          remote_jid?: string | null
          sent_at?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_messages_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_messages_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_instances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_scheduled: {
        Row: {
          contact_id: string | null
          created_at: string
          error_message: string | null
          id: string
          instance_id: string | null
          media_type: string | null
          media_url: string | null
          message: string
          phone: string
          scheduled_for: string
          sent_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          contact_id?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          instance_id?: string | null
          media_type?: string | null
          media_url?: string | null
          message: string
          phone: string
          scheduled_for: string
          sent_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          contact_id?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          instance_id?: string | null
          media_type?: string | null
          media_url?: string | null
          message?: string
          phone?: string
          scheduled_for?: string
          sent_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_scheduled_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_scheduled_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_instances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_scheduled_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_status_config: {
        Row: {
          auto_fetch_products: boolean | null
          created_at: string | null
          end_hour: number | null
          id: string
          instance_id: string | null
          is_active: boolean | null
          last_post_at: string | null
          last_reset_date: string | null
          next_scheduled_at: string | null
          posts_per_day: number | null
          product_urls: string[] | null
          products_posted_today: number | null
          start_hour: number | null
          total_posts_sent: number | null
          total_views: number | null
          updated_at: string | null
          user_id: string
          website_url: string | null
        }
        Insert: {
          auto_fetch_products?: boolean | null
          created_at?: string | null
          end_hour?: number | null
          id?: string
          instance_id?: string | null
          is_active?: boolean | null
          last_post_at?: string | null
          last_reset_date?: string | null
          next_scheduled_at?: string | null
          posts_per_day?: number | null
          product_urls?: string[] | null
          products_posted_today?: number | null
          start_hour?: number | null
          total_posts_sent?: number | null
          total_views?: number | null
          updated_at?: string | null
          user_id: string
          website_url?: string | null
        }
        Update: {
          auto_fetch_products?: boolean | null
          created_at?: string | null
          end_hour?: number | null
          id?: string
          instance_id?: string | null
          is_active?: boolean | null
          last_post_at?: string | null
          last_reset_date?: string | null
          next_scheduled_at?: string | null
          posts_per_day?: number | null
          product_urls?: string[] | null
          products_posted_today?: number | null
          start_hour?: number | null
          total_posts_sent?: number | null
          total_views?: number | null
          updated_at?: string | null
          user_id?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_status_config_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_status_posts: {
        Row: {
          caption: string | null
          config_id: string | null
          created_at: string | null
          error_message: string | null
          id: string
          instance_id: string | null
          media_type: string | null
          product_image: string | null
          product_images: string[] | null
          product_name: string | null
          product_price: string | null
          product_price_wholesale: string | null
          product_url: string | null
          sent_at: string | null
          status: string | null
          user_id: string
          views_count: number | null
        }
        Insert: {
          caption?: string | null
          config_id?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          instance_id?: string | null
          media_type?: string | null
          product_image?: string | null
          product_images?: string[] | null
          product_name?: string | null
          product_price?: string | null
          product_price_wholesale?: string | null
          product_url?: string | null
          sent_at?: string | null
          status?: string | null
          user_id: string
          views_count?: number | null
        }
        Update: {
          caption?: string | null
          config_id?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          instance_id?: string | null
          media_type?: string | null
          product_image?: string | null
          product_images?: string[] | null
          product_name?: string | null
          product_price?: string | null
          product_price_wholesale?: string | null
          product_url?: string | null
          sent_at?: string | null
          status?: string | null
          user_id?: string
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_status_posts_config_id_fkey"
            columns: ["config_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_status_config"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_status_posts_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_instances"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      memory_type:
        | "personal_info"
        | "password"
        | "preference"
        | "fact"
        | "conversation_summary"
        | "instruction"
        | "reminder"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      memory_type: [
        "personal_info",
        "password",
        "preference",
        "fact",
        "conversation_summary",
        "instruction",
        "reminder",
      ],
    },
  },
} as const
