import { useState } from "react";
import { WhatsAppLayout } from "@/components/whatsapp/WhatsAppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWhatsAppGroups } from "@/hooks/useWhatsAppGroups";
import { useWhatsAppInstances, useFetchGroups, useExtractParticipants } from "@/hooks/useWhatsAppInstances";
import {
  UsersRound,
  RefreshCw,
  UserPlus,
  Users,
  Crown,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useMemo } from "react";

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

type SortField = "name" | "participants" | "extracted_at";
type SortOrder = "asc" | "desc";

export default function WhatsAppGroups() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  
  const { data: groups, isLoading } = useWhatsAppGroups();
  const { data: instances } = useWhatsAppInstances();
  const fetchGroups = useFetchGroups();
  const extractParticipants = useExtractParticipants();
  
  // Sort groups
  const sortedGroups = useMemo(() => {
    if (!groups) return [];
    return [...groups].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "participants":
          comparison = a.participants_count - b.participants_count;
          break;
        case "extracted_at":
          const dateA = a.extracted_at ? new Date(a.extracted_at).getTime() : 0;
          const dateB = b.extracted_at ? new Date(b.extracted_at).getTime() : 0;
          comparison = dateA - dateB;
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [groups, sortField, sortOrder]);
  
  // Pagination calculations
  const totalGroups = sortedGroups.length;
  const totalPages = Math.ceil(totalGroups / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedGroups = sortedGroups.slice(startIndex, endIndex);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 opacity-50" />;
    return sortOrder === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />;
  };

  const connectedInstances = instances?.filter((i) => i.status === "connected") || [];

  const handleFetchGroups = () => {
    if (connectedInstances.length > 0) {
      fetchGroups.mutate(connectedInstances[0].id);
    }
  };

  const handleExtract = (groupJid: string) => {
    if (connectedInstances.length > 0) {
      extractParticipants.mutate({
        instanceId: connectedInstances[0].id,
        groupJid,
      });
    }
  };

  const totalParticipants = groups?.reduce((acc, g) => acc + g.participants_count, 0) || 0;

  return (
    <WhatsAppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Grupos</h1>
            <p className="text-muted-foreground">
              Extraia contatos dos seus grupos do WhatsApp
            </p>
          </div>
          <Button
            className="gap-2 bg-[hsl(var(--whatsapp))] hover:bg-[hsl(var(--whatsapp))]/90"
            onClick={handleFetchGroups}
            disabled={fetchGroups.isPending || connectedInstances.length === 0}
          >
            <RefreshCw className={`h-4 w-4 ${fetchGroups.isPending ? "animate-spin" : ""}`} />
            Buscar Grupos
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10">
                  <UsersRound className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{groups?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Total de Grupos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[hsl(var(--whatsapp)/0.1)]">
                  <Users className="h-6 w-6 text-[hsl(var(--whatsapp))]" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalParticipants}</p>
                  <p className="text-sm text-muted-foreground">Total de Participantes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10">
                  <Crown className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {groups?.filter((g) => g.is_admin).length || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Você é Admin</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Groups List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
            <CardTitle>Lista de Grupos</CardTitle>
            {totalGroups > 0 && (
              <div className="flex items-center gap-4 flex-wrap">
                {/* Sort Controls */}
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Ordenar:</span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant={sortField === "name" ? "secondary" : "ghost"}
                      size="sm"
                      className="h-8 gap-1"
                      onClick={() => handleSort("name")}
                    >
                      Nome
                      <SortIcon field="name" />
                    </Button>
                    <Button
                      variant={sortField === "participants" ? "secondary" : "ghost"}
                      size="sm"
                      className="h-8 gap-1"
                      onClick={() => handleSort("participants")}
                    >
                      Participantes
                      <SortIcon field="participants" />
                    </Button>
                    <Button
                      variant={sortField === "extracted_at" ? "secondary" : "ghost"}
                      size="sm"
                      className="h-8 gap-1"
                      onClick={() => handleSort("extracted_at")}
                    >
                      Data
                      <SortIcon field="extracted_at" />
                    </Button>
                  </div>
                </div>
                
                {/* Items per page */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Exibir:</span>
                  <Select
                    value={String(itemsPerPage)}
                    onValueChange={(value) => {
                      setItemsPerPage(Number(value));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-20 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                        <SelectItem key={option} value={String(option)}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span>por página</span>
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-20" />
                ))}
              </div>
            ) : groups && groups.length > 0 ? (
              <>
                <div className="space-y-3">
                  {paginatedGroups.map((group) => (
                    <div
                      key={group.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10">
                          <UsersRound className="h-6 w-6 text-purple-500" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{group.name}</p>
                            {group.is_admin && (
                              <Badge variant="secondary" className="bg-amber-500/10 text-amber-600">
                                Admin
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {group.participants_count} participantes
                            </span>
                            {group.extracted_at && (
                              <span>
                                Extraído em{" "}
                                {new Date(group.extracted_at).toLocaleDateString("pt-BR")}
                              </span>
                            )}
                          </div>
                          {group.description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                              {group.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleExtract(group.group_jid)}
                        disabled={extractParticipants.isPending}
                      >
                        <UserPlus className="h-4 w-4" />
                        Extrair Contatos
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      Mostrando {startIndex + 1}-{Math.min(endIndex, totalGroups)} de {totalGroups} grupos
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Anterior
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum: number;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "default" : "outline"}
                              size="sm"
                              className="w-8 h-8 p-0"
                              onClick={() => setCurrentPage(pageNum)}
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Próximo
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                <UsersRound className="h-12 w-12 mb-4 opacity-20" />
                <p>Nenhum grupo encontrado</p>
                <p className="text-sm">Clique em "Buscar Grupos" para sincronizar</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </WhatsAppLayout>
  );
}
