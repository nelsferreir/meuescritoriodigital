// src/components/features/documents/document-form.tsx
"use client";

import { useFormStatus } from "react-dom";
import { uploadDocument } from "@/lib/actions/document.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { Case } from "@/lib/actions/case.actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="mt-auto h-10">
      {pending ? "Enviando..." : "Enviar Arquivo"}
    </Button>
  );
}

interface DocumentFormProps {
  caseId?: string;
  cases?: Pick<Case, "id" | "title">[];
}

export function DocumentForm({ caseId, cases = [] }: DocumentFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const handleAction = async (formData: FormData) => {
    const result = await uploadDocument(formData);
    if (result.success) {
      toast({ title: "Sucesso!", description: result.message });
      formRef.current?.reset();
    } else {
      toast({ title: "Erro!", description: result.message, variant: "destructive" });
  } };

  return (
    <form ref={formRef} action={handleAction} className="grid sm:flex items-end gap-4 p-4 border rounded-lg bg-card">
      {caseId && <input type="hidden" name="case_id" value={caseId} />}
      
      {!caseId && cases.length > 0 && (
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="case_id">Selecione o Caso</Label>
          <Select name="case_id" required>
            <SelectTrigger>
              <SelectValue placeholder="Escolha um caso para anexar" />
            </SelectTrigger>
            <SelectContent>
              {cases.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="file">Novo Documento</Label>
        <Input id="file" name="file" type="file" required />
      </div>
      <SubmitButton />
    </form>
); }