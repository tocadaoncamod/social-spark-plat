import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";

interface QRCodeModalProps {
  open: boolean;
  qrCode: string | null;
  instanceName: string;
  onClose: () => void;
  onRefresh?: () => void;
}

export function QRCodeModal({ open, qrCode, instanceName, onClose, onRefresh }: QRCodeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Escanear QR Code</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Abra o WhatsApp no seu celular e escaneie o código
          </p>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          {qrCode ? (
            <>
              <div className="p-4 bg-white rounded-lg shadow-inner">
                <img 
                  src={qrCode} 
                  alt="QR Code WhatsApp" 
                  className="w-64 h-64 object-contain"
                />
              </div>
              <div className="text-center space-y-2">
                <p className="text-sm font-medium">
                  Conectando: {instanceName}
                </p>
                <ol className="text-xs text-muted-foreground text-left space-y-1">
                  <li>1. Abra o WhatsApp no celular</li>
                  <li>2. Toque em Mais opções → Aparelhos conectados</li>
                  <li>3. Toque em Conectar um aparelho</li>
                  <li>4. Aponte o celular para esta tela</li>
                </ol>
              </div>
              {onRefresh && (
                <Button variant="outline" onClick={onRefresh} className="mt-2">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Atualizar QR Code
                </Button>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Gerando QR Code...
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
