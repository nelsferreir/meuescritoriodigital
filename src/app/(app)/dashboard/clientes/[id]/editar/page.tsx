import { getClientById } from "@/lib/actions/client.actions";
import { ClientForm } from "@/components/features/clients/client-form";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { notFound } from "next/navigation";

interface EditarClientePageProps {
  params: { id: string };
}

export default async function EditarClientePage({
  params,
}: EditarClientePageProps) {

  const resolvedParams = await params;
  const id = resolvedParams?.id;

  if (!id) {
    notFound();
  }

  const client = await getClientById(id);

  if (!client) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Editar Cliente</CardTitle>
          <CardDescription>
            Atualize as informações do cliente abaixo.
          </CardDescription>
        </CardHeader>
        <ClientForm clientData={client} />
      </Card>
    </div>
); }