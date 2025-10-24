"use client";

import { useFormStatus } from "react-dom";
import { uploadDocument } from "@/lib/actions/document.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef } from "react";
import { useToast } from "@/components/ui/use-toast";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Enviando..." : "Enviar Arquivo"}
    </Button>
); }

export function DocumentForm({ caseId }: { caseId: string }) {
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
    <form ref={formRef} action={handleAction} className="flex items-end gap-4">
      <input type="hidden" name="case_id" value={caseId} />
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="file">Novo Documento</Label>
        <Input id="file" name="file" type="file" required />
      </div>
      <SubmitButton />
    </form>
); }