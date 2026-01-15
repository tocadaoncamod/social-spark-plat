import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Library } from "lucide-react";

interface ProfessionalPrompt {
  id: string;
  name: string;
  category: string;
  icon: string | null;
  description: string | null;
  prompt_template: string;
  variables: Record<string, string> | null;
}

interface PromptLibraryProps {
  onInstall: (prompt: ProfessionalPrompt) => void;
}

export function PromptLibrary({ onInstall }: PromptLibraryProps) {
  const [prompts, setPrompts] = useState<ProfessionalPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      const { data, error } = await supabase
        .from('professional_prompts')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      
      // Cast the data properly
      const formattedData = (data || []).map((item: any) => ({
        ...item,
        variables: item.variables as Record<string, string> | null
      }));
      
      setPrompts(formattedData);
    } catch (error) {
      console.error('Error fetching prompts:', error);
      toast({
        title: "Erro ao carregar prompts",
        description: "Não foi possível carregar a biblioteca de prompts.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <Skeleton className="h-6 w-32" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-16 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (prompts.length === 0) {
    return (
      <div className="text-center py-12">
        <Library className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Nenhum prompt profissional disponível.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {prompts.map((prompt) => (
        <Card 
          key={prompt.id} 
          className="hover:shadow-lg transition-all hover:border-primary/50 group"
        >
          <CardHeader>
            <div className="flex items-center gap-3">
              <span className="text-4xl group-hover:scale-110 transition-transform">
                {prompt.icon || "📝"}
              </span>
              <div>
                <h3 className="font-semibold text-lg">{prompt.name}</h3>
                <Badge variant="secondary" className="mt-1">
                  {prompt.category}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {prompt.description}
            </p>
            {prompt.variables && Object.keys(prompt.variables).length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {Object.keys(prompt.variables).map((key) => (
                  <Badge key={key} variant="outline" className="text-xs">
                    {key.replace(/_/g, ' ')}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => onInstall(prompt)} 
              className="w-full bg-[hsl(var(--whatsapp))] hover:bg-[hsl(var(--whatsapp))]/90"
            >
              Instalar Prompt
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
