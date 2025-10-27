import Link from "next/link";
import { 
  Download,
  PlusCircle,
  Search,
  MoreVertical,
  Eye,
  Edit,
  User,
  Users,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getClients, getClientStats } from "@/lib/actions/client.actions";
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
import { DeleteClientButton } from "@/components/features/clients/delete-client-button";

export default async function ClientesPage({
  searchParams,
}: {
  searchParams?: { query?: string };
}) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.query || "";
  
  const clients = await getClients(query);
  const { totalClients, newClientsThisMonth } = await getClientStats();

  const stats = [
    { label: "Total de Clientes", value: totalClients, icon: <Users className="h-6 w-6 text-stone-500 dark:text-stone-400" /> },
    { label: "Novos este mês", value: newClientsThisMonth, icon: <UserPlus className="h-6 w-6 text-stone-500 dark:text-stone-400" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-stone-900 to-stone-700 bg-clip-text text-transparent dark:from-stone-200 dark:to-stone-400">
          Gerencie seus Clientes
        </h1>
        <p className="text-stone-600 dark:text-stone-400 text-base">
          Busque, adicione e organize todas as informações de todos os seus clientes.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
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
            <form action="/dashboard/clientes" method="GET" className="flex-1 w-full md:max-w-sm">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  name="query"
                  placeholder="Buscar clientes..."
                  className="pl-10 bg-stone-50 dark:bg-input border-stone-300 dark:border-input focus:border-orange-500 rounded-lg w-full"
                  defaultValue={query}
                />
              </div>
            </form>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Link href="/api/export/clients" target="_blank" className="flex-1 md:flex-none">
                <Button variant="outline" className="gap-2 rounded-lg w-full">
                  <Download className="h-4 w-4" />
                  Exportar
                </Button>
              </Link>
              <Link href="/dashboard/clientes/novo" className="flex-1 md:flex-none">
                <Button className="gap-2 bg-gradient-to-r from-orange-600 to-amber-700 hover:from-orange-700 hover:to-amber-800 text-white shadow-md hover:shadow-lg rounded-lg transition-all duration-300 w-full">
                  <PlusCircle className="h-4 w-4" />
                  Novo Cliente
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card className="border-0 shadow-md overflow-hidden">
        <CardHeader className="bg-stone-50/50 dark:bg-card/50 border-b dark:border-border">
          <CardTitle className="text-lg font-semibold">
            Lista de Clientes
          </CardTitle>
          <CardDescription>
            {clients.length} cliente{clients.length !== 1 ? 's' : ''} encontrado{clients.length !== 1 ? 's' : ''}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-6">
            <Table>
              <TableHeader className="bg-stone-100/50 dark:bg-card/20">
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead className="font-semibold pl-6">Cliente</TableHead>
                  <TableHead className="font-semibold hidden lg:table-cell">Email</TableHead>
                  <TableHead className="font-semibold hidden lg:table-cell">Telefone</TableHead>
                  <TableHead className="font-semibold hidden sm:table-cell">Data de Cadastro</TableHead>
                  <TableHead className="font-semibold text-right pr-6">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.length > 0 ? (
                  clients.map((client) => (
                    <TableRow key={client.id} className="border-border">
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 text-white text-sm font-semibold shadow-sm">
                            {client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <Link 
                              href={`/dashboard/clientes/${client.id}`}
                              className="font-semibold text-card-foreground hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-200"
                            >
                              {client.name}
                            </Link>
                            <p className="text-xs text-muted-foreground lg:hidden">{client.email || 'N/A'}</p>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell className="hidden lg:table-cell text-sm text-foreground">
                        {client.email || 'N/A'}
                      </TableCell>

                      <TableCell className="hidden lg:table-cell text-sm text-foreground">
                        {client.phone || 'N/A'}
                      </TableCell>
                      
                      <TableCell className="hidden sm:table-cell text-sm text-foreground">
                          {new Date(client.created_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0 rounded-md">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-lg shadow-lg">
                               <DropdownMenuItem asChild>
                                  <Link href={`/dashboard/clientes/${client.id}`} className="cursor-pointer">
                                    <Eye className="h-4 w-4 mr-2" />
                                    Ver Detalhes
                                  </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                  <Link href={`/dashboard/clientes/${client.id}/editar`} className="cursor-pointer">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Editar
                                  </Link>
                              </DropdownMenuItem>
                              <DeleteClientButton clientId={client.id} />
                            </DropdownMenuContent>
                          </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-48 text-center">
                      <div className="flex flex-col items-center gap-3 text-muted-foreground">
                        <User className="h-12 w-12 text-border" />
                        <div className="space-y-1">
                          <p className="font-semibold text-lg text-foreground">Nenhum cliente encontrado</p>
                          <p className="text-sm">Comece adicionando seu primeiro cliente no sistema.</p>
                        </div>
                        <Link href="/dashboard/clientes/novo" className="mt-2">
                          <Button className="gap-2 bg-gradient-to-r from-orange-600 to-amber-700 hover:from-orange-700 hover:to-amber-800 text-white rounded-lg">
                            <PlusCircle className="h-4 w-4" />
                            Adicionar Cliente
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