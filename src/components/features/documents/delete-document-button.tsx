"use client";

import { Trash2 } from "lucide-react";
import { deleteDocument } from "@/lib/actions/document.actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface DeleteDocumentButtonProps {
  documentId: string;
  path: string;
  caseId: string;
}

export function DeleteDocumentButton({ documentId, path, caseId }: DeleteDocumentButtonProps) {
  const { toast } = useToast();

  const handleDelete = async (formData: FormData) => {
    formData.append("document_id", documentId);
    formData.append("path", path);
    formData.append("case_id", caseId);
    
    const result = await deleteDocument(formData);

    if (result.success) {
      toast({ title: "Sucesso!", description: result.message });
    } else {
      toast({ title: "Erro!", description: result.message, variant: "destructive" });
  } };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-destructive h-8 w-8">
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Excluir documento</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <form action={handleDelete}>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita e o arquivo será permanentemente removido.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction type="submit">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
); }