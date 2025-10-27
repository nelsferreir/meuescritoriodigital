"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createCase, updateCase } from "@/lib/actions/case.actions";
import type { Case } from "@/lib/actions/case.actions";
import type { ActionResult, Client } from "@/lib/actions/client.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CardContent, CardFooter } from "@/components/ui/card";

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="ml-auto">
      {pending ? "Salvando..." : isEditing ? "Salvar Alterações" : "Salvar Caso"}
    </Button>
); }

interface CaseFormProps {
  clientId?: string;
  caseData?: Case;
  clients?: Client[];
}

export function CaseForm({ clientId, caseData, clients = [] }: CaseFormProps) {
  const isEditing = !!caseData;
  const action = isEditing ? updateCase : createCase;
  const [state, formAction] = useActionState<ActionResult | null, FormData>(
    action,
    null
  );

  const effectiveClientId = caseData?.client_id || clientId;
  const deadlineDate = caseData?.deadline ? new Date(caseData.deadline).toISOString().split('T')[0] : '';

  return (
    <form action={formAction}>
      {effectiveClientId && <input type="hidden" name="client_id" value={effectiveClientId} />}
      {isEditing && <input type="hidden" name="case_id" value={caseData.id} />}

      <CardContent className="grid gap-6">
        {clients.length > 0 && (
           <div className="grid gap-2">
              <Label htmlFor="client_id">Cliente</Label>
              <Select
                name="client_id"
                required
                defaultValue={effectiveClientId}

                disabled={!!effectiveClientId}
              >
                  <SelectTrigger>
                      <SelectValue placeholder="Selecione um cliente para este caso" />
                  </SelectTrigger>
                  <SelectContent>
                      {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                              {client.name}
                          </SelectItem>
                      ))}
                  </SelectContent>
              </Select>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Título do Caso</Label>
              <Input id="title" name="title" placeholder="Ex: Ação de divórcio" required defaultValue={caseData?.title} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue={caseData?.status || 'open'}>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="open">Aberto</SelectItem>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="closed">Fechado</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="case_number">Número do Processo (Opcional)</Label>
            <Input id="case_number" name="case_number" placeholder="0000000-00.0000.0.00.0000" defaultValue={caseData?.case_number || ''} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="deadline">Prazo Final (Opcional)</Label>
            <Input id="deadline" name="deadline" type="date" defaultValue={deadlineDate} />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Descrição (Opcional)</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Descreva os detalhes importantes do caso..."
            defaultValue={caseData?.description || ''}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        {state && !state.success ? (
          <p className="text-sm font-medium text-destructive">{state.message}</p>
        ) : (
          <div />
        )}
        <SubmitButton isEditing={isEditing} />
      </CardFooter>
    </form>
); }