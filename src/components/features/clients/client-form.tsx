"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createClient, updateClient, ActionResult, Client } from "@/lib/actions/client.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter } from "@/components/ui/card";

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="ml-auto">
      {pending ? "Salvando..." : isEditing ? "Salvar Alterações" : "Salvar Cliente"}
    </Button>
); }

interface ClientFormProps {
  clientData?: Client;
}

export function ClientForm({ clientData }: ClientFormProps) {
  const isEditing = !!clientData;
  const action = isEditing ? updateClient : createClient;
  const [state, formAction] = useActionState<ActionResult | null, FormData>(action, null);

  return (
    <form action={formAction}>
      {isEditing && <input type="hidden" name="client_id" value={clientData.id} />}
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Nome Completo</Label>
          <Input id="name" name="name" placeholder="Nome do cliente" required defaultValue={clientData?.name} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" name="email" placeholder="cliente@email.com" defaultValue={clientData?.email || ''} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" name="phone" placeholder="(99) 99999-9999" defaultValue={clientData?.phone || ''} />
            </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="document_number">CPF/CNPJ</Label>
          <Input id="document_number" name="document_number" placeholder="Número do documento" defaultValue={clientData?.document_number || ''} />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        {state && !state.success ? (
            <p className="text-sm font-medium text-destructive">
              {state.message}
            </p>
        ) : <div />}
        <SubmitButton isEditing={isEditing} />
      </CardFooter>
    </form>
); }