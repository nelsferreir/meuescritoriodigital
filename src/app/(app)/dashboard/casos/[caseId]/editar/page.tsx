import { getCaseById } from "@/lib/actions/case.actions";
import { getDocumentsByCaseId } from "@/lib/actions/document.actions";
import { CaseForm } from "@/components/features/cases/case-form";
import { DocumentForm } from "@/components/features/documents/document-form";
import { DeleteDocumentButton } from "@/components/features/documents/delete-document-button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster";
import { notFound } from "next/navigation";
import { FileText } from "lucide-react";
import Link from "next/link";

export default async function EditarCasoPage({
  params,
}: {
  params: { caseId: string };
}) {
  const resolvedParams = await params;
  const caseData = await getCaseById(resolvedParams.caseId);

  if (!caseData) {
    notFound();
  }

  const documents = await getDocumentsByCaseId(resolvedParams.caseId);

  return (
    <>
      <div className="max-w-2xl mx-auto grid gap-8">
        {/* Card de Edição do Caso */}
        <Card>
          <CardHeader>
              <CardTitle>Editar Caso</CardTitle>
              <CardDescription>
                  Atualize as informações do caso abaixo.
              </CardDescription>
          </CardHeader>
          <CaseForm clientId={caseData.client_id} caseData={caseData} />
        </Card>

        {/* Card de Documentos */}
        <Card>
          <CardHeader>
              <CardTitle>Documentos</CardTitle>
              <CardDescription>
                  Anexe arquivos importantes a este caso.
              </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
              <DocumentForm caseId={caseData.id} />
              <div className="space-y-4">
                  {documents.length > 0 ? (
                      documents.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between p-2 rounded-md border">
                              <div className="flex items-center gap-3">
                                  <FileText className="h-5 w-5 text-muted-foreground" />
                                  <div className="flex flex-col">
                                      <Link href={doc.download_url} target="_blank" className="font-medium hover:underline text-sm">
                                          {doc.name}
                                      </Link>
                                      <span className="text-xs text-muted-foreground">
                                          Adicionado em {new Date(doc.created_at).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                                      </span>
                                  </div>
                              </div>
                              <DeleteDocumentButton
                                  documentId={doc.id}
                                  path={doc.path}
                                  caseId={caseData.id}
                              />
                          </div>
                  )) ) : (
                      <p className="text-sm text-center text-muted-foreground py-4">Nenhum documento anexado a este caso.</p>
                  )}
              </div>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </>
); }