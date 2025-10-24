"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createClient, ActionResult } from "@/lib/actions/client.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter } from "@/components/ui/card";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="ml-auto">
      {pending ? "Salvando..." : "Salvar Cliente"}
    </Button>
); }

export function ClientForm() {
  const [state, formAction] = useActionState<ActionResult | null, FormData>(createClient, null);

  return (
    <form action={formAction}>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Nome Completo</Label>
          <Input id="name" name="name" placeholder="Nome do cliente" required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" name="email" placeholder="cliente@email.com" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" name="phone" placeholder="(99) 99999-9999" />
            </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="document_number">CPF/CNPJ</Label>
          <Input id="document_number" name="document_number" placeholder="Número do documento" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        {state && !state.success ? (
            <p className="text-sm font-medium text-destructive">
              {state.message}
            </p>
        ) : <div />}
        <SubmitButton />
      </CardFooter>
    </form>
); }