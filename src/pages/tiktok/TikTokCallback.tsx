import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

export default function TikTokCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Processando autorização...");

  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const error = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");

      if (error) {
        setStatus("error");
        setMessage(errorDescription || "Erro na autorização do TikTok");
        toast.error("Falha na autorização");
        setTimeout(() => navigate("/tiktok/settings"), 3000);
        return;
      }

      if (!code) {
        setStatus("error");
        setMessage("Código de autorização não encontrado");
        setTimeout(() => navigate("/tiktok/settings"), 3000);
        return;
      }

      if (!user) {
        setStatus("error");
        setMessage("Usuário não autenticado");
        setTimeout(() => navigate("/login"), 3000);
        return;
      }

      try {
        // Exchange code for tokens via Edge Function
        const { data, error: fnError } = await supabase.functions.invoke("tiktok-shop-api", {
          body: {
            action: "exchange_code",
            code,
            state,
            redirect_uri: `${window.location.origin}/tiktok/callback`
          }
        });

        if (fnError) throw fnError;

        if (data?.access_token) {
          // Update the app with the new tokens
          const appId = state; // We use state to pass the app ID
          
          if (appId) {
            const { error: updateError } = await supabase
              .from("tiktok_apps")
              .update({
                access_token: data.access_token,
                refresh_token: data.refresh_token,
                token_expires_at: data.expires_at,
                status: "active",
                updated_at: new Date().toISOString()
              })
              .eq("id", appId)
              .eq("user_id", user.id);

            if (updateError) throw updateError;
          }

          setStatus("success");
          setMessage("Conectado com sucesso! Redirecionando...");
          toast.success("TikTok conectado com sucesso!");
          setTimeout(() => navigate("/tiktok/settings"), 2000);
        } else {
          throw new Error("Tokens não recebidos");
        }
      } catch (err) {
        console.error("OAuth callback error:", err);
        setStatus("error");
        setMessage("Erro ao processar autorização. Tente novamente.");
        toast.error("Erro na conexão");
        setTimeout(() => navigate("/tiktok/settings"), 3000);
      }
    };

    processCallback();
  }, [searchParams, navigate, user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-12">
          {status === "loading" && (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <h2 className="text-xl font-semibold mb-2">Conectando ao TikTok</h2>
              <p className="text-muted-foreground text-center">{message}</p>
            </>
          )}
          
          {status === "success" && (
            <>
              <div className="p-4 rounded-full bg-success/10 mb-4">
                <CheckCircle2 className="h-12 w-12 text-success" />
              </div>
              <h2 className="text-xl font-semibold mb-2 text-success">Sucesso!</h2>
              <p className="text-muted-foreground text-center">{message}</p>
            </>
          )}
          
          {status === "error" && (
            <>
              <div className="p-4 rounded-full bg-destructive/10 mb-4">
                <XCircle className="h-12 w-12 text-destructive" />
              </div>
              <h2 className="text-xl font-semibold mb-2 text-destructive">Erro</h2>
              <p className="text-muted-foreground text-center">{message}</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
