import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Sparkles } from "lucide-react";

interface ProfessionalPrompt {
  id: string;
  name: string;
  category: string;
  icon: string | null;
  description: string | null;
  prompt_template: string;
  variables: Record<string, string> | null;
}

interface PromptPreviewProps {
  prompt: ProfessionalPrompt | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (variables: Record<string, string>) => void;
}

const VARIABLE_LABELS: Record<string, string> = {
  NOME_EMPRESA: "Nome da Empresa",
  NOME_BOT: "Nome do Assistente",
  CIDADE: "Cidade",
};

export function PromptPreview({ prompt, open, onClose, onConfirm }: PromptPreviewProps) {
  const [variables, setVariables] = useState<Record<string, string>>({});

  useEffect(() => {
    if (prompt?.variables) {
      setVariables({ ...prompt.variables });
    } else {
      setVariables({});
    }
  }, [prompt]);

  if (!prompt) return null;

  const handleConfirm = () => {
    onConfirm(variables);
    setVariables({});
  };

  const variableKeys = Object.keys(prompt.variables || {});
  const allFilled = variableKeys.every((key) => variables[key]?.trim());

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-4xl">{prompt.icon || "📝"}</span>
            <div>
              <span className="block">{prompt.name}</span>
              <Badge variant="secondary" className="mt-1">
                {prompt.category}
              </Badge>
            </div>
          </DialogTitle>
          <DialogDescription>
            {prompt.description}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[50vh] pr-4">
          <div className="space-y-6">
            {variableKeys.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h4 className="font-semibold">Personalize seu prompt</h4>
                </div>
                
                {variableKeys.map((key) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={key} className="flex items-center gap-2">
                      {VARIABLE_LABELS[key] || key.replace(/_/g, ' ')}
                      {variables[key]?.trim() && (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      )}
                    </Label>
                    <Input
                      id={key}
                      value={variables[key] || ''}
                      onChange={(e) => setVariables({...variables, [key]: e.target.value})}
                      placeholder={`Digite ${(VARIABLE_LABELS[key] || key).toLowerCase()}`}
                      className="transition-all focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-muted-foreground">
                Preview do Prompt (primeiras linhas)
              </h4>
              <div className="bg-muted/50 rounded-lg p-4 text-sm font-mono whitespace-pre-wrap max-h-48 overflow-auto">
                {renderPreview(prompt.prompt_template, variables).slice(0, 500)}
                {prompt.prompt_template.length > 500 && "..."}
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm}
            className="bg-[hsl(var(--whatsapp))] hover:bg-[hsl(var(--whatsapp))]/90"
            disabled={variableKeys.length > 0 && !allFilled}
          >
            {variableKeys.length > 0 && !allFilled 
              ? "Preencha todos os campos"
              : "Confirmar Instalação"
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function renderPreview(template: string, variables: Record<string, string>): string {
  let result = template;
  Object.keys(variables).forEach(key => {
    const regex = new RegExp(`\\[${key}\\]`, 'g');
    result = result.replace(regex, variables[key] || `[${key}]`);
  });
  return result;
}
