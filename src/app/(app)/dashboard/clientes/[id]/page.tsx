import Link from "next/link";
import { notFound } from "next/navigation";
import { MoreHorizontal, PlusCircle } from "lucide-react";
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

export default async function ClienteDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const client = await getClientById(params.id);

  if (!client) {
    notFound();
  }

  const cases = await getCasesByClientId(client.id);

  return (
    <div className="max-w-4xl mx-auto grid gap-8">
      {/* Detalhes do Cliente */}
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{client.name}</CardTitle>
          <CardDescription>
            Informações detalhadas do cliente.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
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
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Casos Vinculados</h2>
          <Link href={`/dashboard/clientes/${client.id}/casos/novo`}>
            <Button className="gap-1">
              <PlusCircle className="h-4 w-4" />
              Novo Caso
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead className="hidden sm:table-cell">Nº do Processo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Data de Criação</TableHead>
                  <TableHead>
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
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground capitalize">
                          {caseItem.status === 'open' && 'Aberto'}
                          {caseItem.status === 'pending' && 'Pendente'}
                          {caseItem.status === 'closed' && 'Fechado'}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(caseItem.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link href={`/dashboard/casos/${caseItem.id}/editar`}>Editar</Link>
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
    </div>
); }