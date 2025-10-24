"use server";

import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { unstable_noStore as noStore } from 'next/cache';
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type Client = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  document_number: string | null;
  created_at: string;
};

export type ActionResult = {
  success: boolean;
  message: string;
};

async function getActiveWorkspaceId(): Promise<string | null> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: workspace, error } = await supabase
    .from('workspaces')
    .select('id')
    .eq('owner_id', user.id)
    .single();
    
  if (error) {
    console.error("Erro ao buscar workspace:", error);
    return null;
  }
  
  return workspace?.id;
}


export async function getClients(): Promise<Client[]> {
  noStore();
  const supabase = await createSupabaseClient();
  const workspaceId = await getActiveWorkspaceId();

  if (!workspaceId) return [];

  const { data, error } = await supabase
    .from('clients')
    .select('id, name, email, phone, created_at, document_number')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar clientes:', error);
    return [];
  }

  return data;
}

export async function createClient(
    previousState: ActionResult | null,
    formData: FormData
): Promise<ActionResult> {
    const supabase = await createSupabaseClient();
    const workspaceId = await getActiveWorkspaceId();

    if (!workspaceId) {
        return { success: false, message: "Ambiente de trabalho não encontrado." };
    }

    const name = formData.get("name") as string;
    if (!name || name.trim().length < 3) {
      return { success: false, message: "O nome é obrigatório e precisa ter pelo menos 3 caracteres." };
    }

    const { error } = await supabase.from('clients').insert({
      workspace_id: workspaceId,
      name: name,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      document_number: formData.get("document_number") as string,
    });

    if (error) {
      console.error("Erro ao criar cliente:", error);
      return { success: false, message: "Não foi possível cadastrar o cliente." };
    }

    revalidatePath("/dashboard/clientes");
    redirect("/dashboard/clientes");
}

export async function getClientById(id: string): Promise<Client | null> {
  noStore();

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!id || !uuidRegex.test(id)) {
    console.error('Tentativa de buscar cliente com ID inválido:', id);
    return null;
  }
  
  const supabase = await createSupabaseClient();
  const workspaceId = await getActiveWorkspaceId();

  if (!workspaceId) return null;

  const { data, error } = await supabase
    .from('clients')
    .select('id, name, email, phone, created_at, document_number')
    .eq('id', id)
    .eq('workspace_id', workspaceId)
    .single();

  if (error) {
    console.error('Erro ao buscar cliente:', error);
    return null;
  }

  return data;
}