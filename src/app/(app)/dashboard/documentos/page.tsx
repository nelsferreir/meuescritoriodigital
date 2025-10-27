import { getAllDocuments } from "@/lib/actions/document.actions";
import { getAllCases } from "@/lib/actions/case.actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Download, Upload, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DocumentForm } from "@/components/features/documents/document-form";
import { Toaster } from "@/components/ui/toaster";
import { DeleteDocumentButton } from "@/components/features/documents/delete-document-button";

export default async function DocumentsPage() {
  const documents = await getAllDocuments();
  const cases = await getAllCases();

  return (
    <>
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Gerencie seus Documentos</h1>
          <p className="text-stone-600 dark:text-stone-400 text-base">
            Consulte todos os documentos de todos os seus casos.
          </p>
        </div>

        {/* Formulário de Upload */}
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Adicionar Novo Documento
                </CardTitle>
            </CardHeader>
            <CardContent>
                {cases.length > 0 ? (
                    <DocumentForm cases={cases} />
                ) : (
                    <div className="text-center p-6 bg-secondary/30 rounded-lg">
                        <p className="text-muted-foreground">Você precisa cadastrar um caso antes de poder adicionar um documento.</p>
                        <Link href="/dashboard/casos/novo" className="mt-4 inline-block">
                            <Button>Criar Primeiro Caso</Button>
                        </Link>
                    </div>
                )}
            </CardContent>
        </Card>

        {/* Tabela de Documentos */}
        <Card>
          <CardHeader>
            <CardTitle>Todos os Documentos</CardTitle>
            <CardDescription>
              {documents.length} documento{documents.length !== 1 ? 's' : ''} encontrado{documents.length !== 1 ? 's' : ''}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Arquivo</TableHead>
                  <TableHead className="hidden sm:table-cell">Caso Vinculado</TableHead>
                  <TableHead className="hidden md:table-cell">Data de Upload</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.length > 0 ? (
                  documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          {doc.name}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Link href={`/dashboard/casos/${doc.case_id}/editar`} className="hover:underline text-muted-foreground">
                          {doc.cases?.title || 'Caso não encontrado'}
                        </Link>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(doc.created_at).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                          <Link href={doc.download_url} target="_blank">
                              <Button variant="outline" size="sm" className="gap-2">
                                  <Download className="h-4 w-4" />
                                  Baixar
                              </Button>
                          </Link>

                          <DeleteDocumentButton documentId={doc.id} path={doc.path} caseId={doc.case_id} />
                      </TableCell>
                    </TableRow>
                )) ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      Nenhum documento encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </>
); }