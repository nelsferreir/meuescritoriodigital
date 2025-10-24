import Link from "next/link";
import { Download, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getClients } from "@/lib/actions/client.actions";
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

export default async function ClientesPage() {
  const clients = await getClients();

  return (
    <div className="max-w-4xl mx-auto grid gap-6">
      <div className="flex items-center justify-between">
        <div className="grid gap-2">
            <h1 className="font-semibold text-3xl">Clientes</h1>
            <CardDescription>
                Gerencie todos os seus clientes em um só lugar.
            </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/api/export/clients" target="_blank">
            <Button variant="outline" className="gap-1">
              <Download className="h-4 w-4" />
              Exportar PDF
            </Button>
          </Link>
          
          <Link href="/dashboard/clientes/novo">
            <Button className="gap-1">
              <PlusCircle className="h-4 w-4" />
              Novo Cliente
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden md:table-cell">Telefone</TableHead>
                <TableHead className="hidden sm:table-cell">
                  Data de Cadastro
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.length > 0 ? (
                clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">
                      <Link href={`/dashboard/clientes/${client.id}`} className="hover:underline">
                          {client.name}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {client.email || 'N/A'}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {client.phone || 'N/A'}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {new Date(client.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center"
                  >
                    Nenhum cliente encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
); }