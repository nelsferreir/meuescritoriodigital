"use server";

import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "./client.actions";

export type Document = {
  id: string;
  name: string;
  path: string;
  created_at: string;
  case_id: string;
  download_url: string;
};

async function getActiveWorkspaceId(): Promise<string | null> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: workspace } = await supabase
    .from('workspaces')
    .select('id')
    .eq('owner_id', user.id)
    .single();
  
  return workspace?.id;
}

export async function uploadDocument(formData: FormData): Promise<ActionResult> {
  const supabase = await createSupabaseClient();
  const workspaceId = await getActiveWorkspaceId();

  const caseId = formData.get("case_id") as string;
  const file = formData.get("file") as File;

  if (!workspaceId || !caseId || !file || file.size === 0) {
    return { success: false, message: "Dados inválidos para upload." };
  }

  const filePath = `${workspaceId}/${caseId}/${Date.now()}-${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from('documents')
    .upload(filePath, file);

  if (uploadError) {
    console.error("Erro no upload:", uploadError);
    return { success: false, message: "Falha ao enviar o arquivo." };
  }

  const { error: insertError } = await supabase.from('documents').insert({
    workspace_id: workspaceId,
    case_id: caseId,
    name: file.name,
    path: filePath,
  });

  if (insertError) {
    console.error("Erro ao salvar no DB:", insertError);
    return { success: false, message: "Falha ao registrar o documento." };
  }

  revalidatePath(`/dashboard/casos/${caseId}/editar`);
  return { success: true, message: "Documento enviado com sucesso!" };
}

export async function getDocumentsByCaseId(caseId: string): Promise<Document[]> {
    const supabase = await createSupabaseClient();
    const { data: documents, error } = await supabase
      .from('documents')
      .select('id, name, path, created_at, case_id')
      .eq('case_id', caseId)
      .order('created_at', { ascending: false });
  
    if (error) {
      console.error('Erro ao buscar documentos:', error);
      return [];
    }
  
    const documentsWithUrls = await Promise.all(
      documents.map(async (doc) => {
        const { data } = await supabase.storage
          .from('documents')
          .createSignedUrl(doc.path, 3600);
        return { ...doc, download_url: data?.signedUrl || '' };
    }) );
  
    return documentsWithUrls;
  }

export async function deleteDocument(formData: FormData): Promise<ActionResult> {
  const supabase = await createSupabaseClient();
  const documentId = formData.get("document_id") as string;
  const path = formData.get("path") as string;
  const caseId = formData.get("case_id") as string;

  if (!documentId || !path || !caseId) {
    return { success: false, message: "Informações insuficientes para excluir." };
  }

  const { error: storageError } = await supabase.storage
    .from('documents')
    .remove([path]);

  if (storageError) {
    console.error("Erro ao remover do Storage:", storageError);
    return { success: false, message: "Falha ao remover o arquivo do armazenamento." };
  }

  const { error: dbError } = await supabase
    .from('documents')
    .delete()
    .eq('id', documentId);

  if (dbError) {
    console.error("Erro ao remover do DB:", dbError);
    return { success: false, message: "Falha ao remover o registro do documento." };
  }

  revalidatePath(`/dashboard/casos/${caseId}/editar`);
  return { success: true, message: "Documento excluído com sucesso." };
}

export async function getAllDocuments(): Promise<(Document & { cases: { title: string } | null })[]> {
  const supabase = await createSupabaseClient();
  const workspaceId = await getActiveWorkspaceId();

  if (!workspaceId) return [];

  const { data: documentsData, error } = await supabase
    .from('documents')
    .select('id, name, path, created_at, case_id, cases (title)')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar todos os documentos:', error);
    return [];
  }

  if (!documentsData) {
    return [];
  }
  
  const documentsWithUrls = await Promise.all(
    documentsData.map(async (doc: any) => { 
      const { data } = await supabase.storage
        .from('documents')
        .createSignedUrl(doc.path, 3600);
        
        const caseData = Array.isArray(doc.cases) && doc.cases.length > 0 ? doc.cases[0] : doc.cases;

        return { 
          ...doc, 
          cases: caseData,
          download_url: data?.signedUrl || '' 
    }; }) );
  
    return documentsWithUrls;
}