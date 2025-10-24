import { getClientById } from "@/lib/actions/client.actions";
import { CaseForm } from "@/components/features/cases/case-form";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { notFound } from "next/navigation";

export default async function NovoCasoPage({
  params,
}: {
  params: { id: string };
}) {
  const client = await getClientById(params.id);

  if (!client) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto">
        <Card>
            <CardHeader>
                <CardTitle>Novo Caso</CardTitle>
                <CardDescription>
                    Cadastrando um novo caso para o cliente: <span className="font-semibold">{client.name}</span>
                </CardDescription>
            </CardHeader>
            <CaseForm clientId={client.id} />
        </Card>
    </div>
); }