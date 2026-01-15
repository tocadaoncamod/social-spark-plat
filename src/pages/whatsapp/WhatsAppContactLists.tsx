import { useState, useRef } from "react";
import { WhatsAppLayout } from "@/components/whatsapp/WhatsAppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Upload, FileText, Trash2, CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";
import { useContactLists } from "@/hooks/useContactLists";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function WhatsAppContactLists() {
  const { lists, isLoading, upload, isUploading, deleteList, isDeleting } = useContactLists();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listName, setListName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!listName) {
        setListName(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleUpload = () => {
    if (!selectedFile || !listName.trim()) return;
    
    upload({ file: selectedFile, name: listName.trim() }, {
      onSuccess: () => {
        setIsModalOpen(false);
        setListName("");
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" /> Processado</Badge>;
      case 'processing':
        return <Badge className="bg-blue-500"><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Processando</Badge>;
      case 'failed':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Erro</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" /> Pendente</Badge>;
    }
  };

  return (
    <WhatsAppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Listas de Contatos</h1>
            <p className="text-muted-foreground">
              Faça upload de arquivos CSV ou TXT com seus contatos
            </p>
          </div>
          
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="w-4 h-4 mr-2" />
                Upload de Lista
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload de Lista de Contatos</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="listName">Nome da Lista</Label>
                  <Input
                    id="listName"
                    placeholder="Ex: Clientes Janeiro 2026"
                    value={listName}
                    onChange={(e) => setListName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="file">Arquivo (CSV ou TXT)</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                       onClick={() => fileInputRef.current?.click()}>
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="file"
                      accept=".csv,.txt"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    {selectedFile ? (
                      <div className="flex items-center justify-center gap-2">
                        <FileText className="w-8 h-8 text-primary" />
                        <div className="text-left">
                          <p className="font-medium">{selectedFile.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(selectedFile.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Clique para selecionar ou arraste o arquivo
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Formatos: CSV, TXT (um número por linha ou nome,telefone)
                        </p>
                      </>
                    )}
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={handleUpload}
                  disabled={!selectedFile || !listName.trim() || isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Fazer Upload
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Listas Importadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : lists.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Nenhuma lista importada ainda</p>
                <p className="text-sm">Faça upload de um arquivo CSV ou TXT para começar</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Total</TableHead>
                    <TableHead className="text-center">Válidos</TableHead>
                    <TableHead className="text-center">Inválidos</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lists.map((list) => (
                    <TableRow key={list.id}>
                      <TableCell className="font-medium">{list.name}</TableCell>
                      <TableCell>{getStatusBadge(list.status)}</TableCell>
                      <TableCell className="text-center">{list.total_contacts}</TableCell>
                      <TableCell className="text-center text-green-600">{list.valid_contacts}</TableCell>
                      <TableCell className="text-center text-red-600">{list.invalid_contacts}</TableCell>
                      <TableCell>
                        {format(new Date(list.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                      </TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir lista?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação não pode ser desfeita. A lista será removida permanentemente.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => deleteList(list.id)}
                                className="bg-destructive text-destructive-foreground"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </WhatsAppLayout>
  );
}
