import { ClientForm } from "@/components/features/clients/client-form";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";

export default function NovoClientePage() {
  return (
    <div className="max-w-2xl mx-auto">
        <Card>
            <CardHeader>
                <CardTitle>Novo Cliente</CardTitle>
                <CardDescription>
                    Preencha as informações abaixo para cadastrar um novo cliente.
                </CardDescription>
            </CardHeader>
            <ClientForm />
        </Card>
    </div>
); }