import { getClients } from "@/lib/actions/client.actions";
import { CaseForm } from "@/components/features/cases/case-form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function NovoCasoPage({
  searchParams,
}: {
  searchParams?: { clientId?: string };
}) {
  const resolvedSearchParams = await searchParams;
  const clientId = resolvedSearchParams?.clientId;
  const clients = await getClients();

  const clientName = clientId
    ? clients.find((c) => c.id === clientId)?.name
    : null;

  return (
    <div className="max-w-2xl mx-auto">
        <Card>
            <CardHeader>
                <CardTitle>Novo Caso</CardTitle>
                <CardDescription>
                    {clientName
                      ? `Cadastrando um novo caso para o cliente: ${clientName}`
                      : "Selecione um cliente e preencha as informações para criar um novo caso."
                    }
                </CardDescription>
            </CardHeader>
            {clients.length > 0 ? (
              <CaseForm clients={clients} clientId={clientId} />
            ) : (
              <CardContent className="text-center py-10">
                <p className="text-sm text-muted-foreground">
                  Você precisa ter pelo menos um cliente cadastrado para criar um caso.
                </p>
                <Link href="/dashboard/clientes/novo" className="mt-4 inline-block">
                  <Button>Cadastrar Primeiro Cliente</Button>
                </Link>
              </CardContent>
            )}
        </Card>
    </div>
); }