import Link from "next/link";
import { notFound } from "next/navigation";
import { MoreHorizontal, PlusCircle, Edit, Trash2, BookUser } from "lucide-react";
import { getClientById } from "@/lib/actions/client.actions";
import { getCasesByClientId } from "@/lib/actions/case.actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteCaseButton } from "@/components/features/cases/delete-case-button";
import { DeleteClientButton } from "@/components/features/clients/delete-client-button";
import { Badge } from "@/components/ui/badge";

export default async function ClienteDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  if (!id) {
    notFound();
  }

  const client = await getClientById(id);

  if (!client) {
    notFound();
  }

  const cases = await getCasesByClientId(client.id);

  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100/60 text-blue-800 border-blue-200/80 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800/80';
      case 'pending':
        return 'bg-yellow-100/60 text-yellow-800 border-yellow-200/80 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-800/80';
      case 'closed':
        return 'bg-green-100/60 text-green-800 border-green-200/80 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800/80';
      default:
        return 'bg-stone-100/60 text-stone-800 border-stone-200/80 dark:bg-stone-900/40 dark:text-stone-300 dark:border-stone-800/80';
  } };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open': return 'Aberto';
      case 'pending': return 'Pendente';
      case 'closed': return 'Fechado';
      default: return 'Desconhecido';
  } };

  return (
    <div className="max-w-4xl mx-auto grid gap-8">
      {/* Detalhes do Cliente */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="text-3xl mb-4">{client.name}</CardTitle>
            <CardDescription>
              Informações detalhadas do cliente.
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Opções</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/clientes/${client.id}/editar`}>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Editar Cliente</span>
                </Link>
              </DropdownMenuItem>
              <DeleteClientButton clientId={client.id} />
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="grid gap-4 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p>{client.email || "Não informado"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Telefone
              </p>
              <p>{client.phone || "Não informado"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                CPF/CNPJ
              </p>
              <p>{client.document_number || "Não informado"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Cliente desde
              </p>
              <p>{new Date(client.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seção de Casos Vinculados */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl mb-4">Casos Vinculados</CardTitle>
            <CardDescription>
              Todos os processos associados a este cliente.
            </CardDescription>
          </div>
          <Link href={`/dashboard/casos/novo?clientId=${client.id}`}>
            <Button className="gap-1">
              <PlusCircle className="h-4 w-4" />
              Novo Caso
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead className="hidden sm:table-cell">Nº do Processo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Data de Criação</TableHead>
                <TableHead className="text-right">
                  <span className="sr-only">Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cases.length > 0 ? (
                cases.map((caseItem) => (
                  <TableRow key={caseItem.id}>
                    <TableCell className="font-medium">{caseItem.title}</TableCell>
                    <TableCell className="hidden sm:table-cell">{caseItem.case_number || "N/A"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusClasses(caseItem.status)}>
                        {getStatusLabel(caseItem.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(caseItem.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                              <Link href={`/dashboard/casos/${caseItem.id}/editar`}>
                                <Edit className="h-4 w-4 mr-2"/>
                                Editar Caso
                              </Link>
                          </DropdownMenuItem>
                          <DeleteCaseButton caseId={caseItem.id} clientId={client.id} />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
              )) ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Nenhum caso encontrado para este cliente.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
); }