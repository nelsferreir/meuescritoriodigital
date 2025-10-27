import Link from "next/link";
import { 
  Briefcase,
  Search,
  MoreVertical,
  Edit,
  BookUser,
  Clock,
  CheckCircle,
  AlertCircle,
  PlusCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAllCases, getCaseStats } from "@/lib/actions/case.actions";
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
import { Badge } from "@/components/ui/badge";
import { DeleteCaseButton } from "@/components/features/cases/delete-case-button";

export default async function CasosPage({
  searchParams,
}: {
  searchParams?: { query?: string };
}) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.query || "";
  
  const cases = await getAllCases(query);
  const { openCases, pendingCases, closedCases } = await getCaseStats();

  const stats = [
    { label: "Casos Abertos", value: openCases, icon: <Clock className="h-6 w-6 text-stone-500 dark:text-stone-400" /> },
    { label: "Casos Pendentes", value: pendingCases, icon: <AlertCircle className="h-6 w-6 text-stone-500 dark:text-stone-400" /> },
    { label: "Casos Fechados", value: closedCases, icon: <CheckCircle className="h-6 w-6 text-stone-500 dark:text-stone-400" /> },
  ];

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
      case 'open':
        return 'Aberto';
      case 'pending':
        return 'Pendente';
      case 'closed':
        return 'Fechado';
      default:
        return 'Desconhecido';
  } }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-stone-900 to-stone-700 bg-clip-text text-transparent dark:from-stone-200 dark:to-stone-400">
          Gerencie seus Casos
        </h1>
        <p className="text-stone-600 dark:text-stone-400 text-base">
          Busque, adicione e organize todas as informações de todos os seus casos.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-2">
              {stat.icon}
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <div className="text-3xl font-bold text-card-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions and Filters Panel */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <form action="/dashboard/casos" method="GET" className="flex-1 w-full md:max-w-sm">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  name="query"
                  placeholder="Buscar por título ou nº do processo..."
                  className="pl-10 bg-stone-50 dark:bg-input border-stone-300 dark:border-input focus:border-orange-500 rounded-lg w-full"
                  defaultValue={query}
                />
              </div>
            </form>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Link href="/dashboard/casos/novo" className="flex-1 md:flex-none">
                <Button className="gap-2 bg-gradient-to-r from-orange-600 to-amber-700 hover:from-orange-700 hover:to-amber-800 text-white shadow-md hover:shadow-lg rounded-lg transition-all duration-300 w-full">
                  <PlusCircle className="h-4 w-4" />
                  Novo Caso
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cases Table */}
      <Card className="border-0 shadow-md overflow-hidden">
        <CardHeader className="bg-stone-50/50 dark:bg-card/50 border-b dark:border-border">
          <CardTitle className="text-lg font-semibold text-card-foreground">
            Lista de Casos
          </CardTitle>
          <CardDescription>
            {cases.length} caso{cases.length !== 1 ? 's' : ''} encontrado{cases.length !== 1 ? 's' : ''}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-6">
            <Table>
              <TableHeader className="bg-stone-100/50 dark:bg-card/20">
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead className="font-semibold text-foreground pl-6">Título do Caso</TableHead>
                  <TableHead className="font-semibold text-foreground hidden lg:table-cell">Cliente</TableHead>
                  <TableHead className="font-semibold text-foreground hidden md:table-cell">Nº do Processo</TableHead>
                  <TableHead className="font-semibold text-foreground hidden sm:table-cell">Status</TableHead>
                  <TableHead className="font-semibold text-foreground text-right pr-6">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cases.length > 0 ? (
                  cases.map((caseItem) => (
                    <TableRow key={caseItem.id} className="border-border">
                      <TableCell className="font-medium pl-6">
                        <Link href={`/dashboard/casos/${caseItem.id}/editar`} className="text-card-foreground hover:text-orange-600 dark:hover:text-orange-400">
                          {caseItem.title}
                        </Link>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {caseItem.client_id ? (
                           <Link href={`/dashboard/clientes/${caseItem.client_id}`} className="text-muted-foreground hover:underline">
                            {caseItem.clients?.name || 'Cliente não encontrado'}
                          </Link>
                        ) : (
                          <span className="text-muted-foreground">Sem cliente associado</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">{caseItem.case_number || 'N/A'}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant="outline" className={getStatusClasses(caseItem.status)}>
                          {getStatusLabel(caseItem.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:bg-accent rounded-md">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-lg shadow-lg">
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/casos/${caseItem.id}/editar`} className="cursor-pointer">
                                <Edit className="h-4 w-4 mr-2" />
                                Editar / Ver
                              </Link>
                            </DropdownMenuItem>
                            
                            {caseItem.client_id && (
                              <>
                                <DropdownMenuItem asChild>
                                  <Link href={`/dashboard/clientes/${caseItem.client_id}`} className="cursor-pointer">
                                    <BookUser className="h-4 w-4 mr-2" />
                                    Ver Cliente
                                  </Link>
                                </DropdownMenuItem>
                                <DeleteCaseButton caseId={caseItem.id} clientId={caseItem.client_id} />
                              </>
                            )}

                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                )) ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-48 text-center">
                      <div className="flex flex-col items-center gap-3 text-muted-foreground">
                        <Briefcase className="h-12 w-12 text-border" />
                        <div className="space-y-1">
                          <p className="font-semibold text-lg text-foreground">Nenhum caso encontrado</p>
                          <p className="text-sm">Comece adicionando seu primeiro caso no sistema.</p>
                        </div>
                        <Link href="/dashboard/casos/novo" className="mt-2">
                          <Button className="gap-2 bg-gradient-to-r from-orange-600 to-amber-700 hover:from-orange-700 hover:to-amber-800 text-white rounded-lg">
                            <PlusCircle className="h-4 w-4" />
                            Adicionar Caso
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
); }