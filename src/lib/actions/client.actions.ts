"use server";

import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
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

export async function getClientStats() {
  noStore();
  const supabase = await createSupabaseClient();
  const workspaceId = await getActiveWorkspaceId();

  if (!workspaceId) {
    return { totalClients: 0, newClientsThisMonth: 0, activeClients: 0 };
  }

  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();

  const { count: totalClients } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })
    .eq('workspace_id', workspaceId);

  const { count: newClientsThisMonth } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })
    .eq('workspace_id', workspaceId)
    .gte('created_at', firstDayOfMonth);

  const { data: activeClientsData, error: activeClientsError } = await supabase
    .from('cases')
    .select('client_id', { count: 'exact' })
    .eq('workspace_id', workspaceId)
    .eq('status', 'open');
  
  if (activeClientsError) {
    console.error("Erro ao buscar clientes ativos:", activeClientsError);
  }
  
  const activeClients = activeClientsData ? new Set(activeClientsData.map(c => c.client_id)).size : 0;

  return {
    totalClients: totalClients ?? 0,
    newClientsThisMonth: newClientsThisMonth ?? 0,
    activeClients: activeClients ?? 0,
}; }

export async function getClients(query?: string): Promise<Client[]> {
  noStore();
  const supabase = await createSupabaseClient();
  const workspaceId = await getActiveWorkspaceId();

  if (!workspaceId) return [];

  let queryBuilder = supabase
    .from('clients')
    .select('id, name, email, phone, created_at, document_number')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false });

  if (query) {
    queryBuilder = queryBuilder.or(`name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`);
  }

  const { data, error } = await queryBuilder;

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

    const document_number = formData.get("document_number") as string;

    if (document_number) {
      const { data: existingClient, error: existingClientError } = await supabase
        .from('clients')
        .select('id')
        .eq('workspace_id', workspaceId)
        .eq('document_number', document_number)
        .limit(1);

      if (existingClientError) {
        console.error("Erro ao verificar cliente existente:", existingClientError);
        return { success: false, message: "Ocorreu um erro ao verificar o CPF/CNPJ." };
      }

      if (existingClient && existingClient.length > 0) {
        return { success: false, message: "Já existe um cliente cadastrado com este CPF/CNPJ." };
    } }

    const { error } = await supabase.from('clients').insert({
      workspace_id: workspaceId,
      name: name,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      document_number: document_number,
    });

    if (error) {
      console.error("Erro ao criar cliente:", error);
      return { success: false, message: "Não foi possível cadastrar o cliente." };
    }

    revalidatePath("/dashboard/clientes");
    redirect("/dashboard/clientes");
}

export async function updateClient(
  previousState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createSupabaseClient();
  const clientId = formData.get("client_id") as string;

  const name = formData.get("name") as string;
  if (!name || name.trim().length < 3) {
    return { success: false, message: "O nome é obrigatório." };
  }

  const { error } = await supabase
    .from('clients')
    .update({
      name: name,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      document_number: formData.get("document_number") as string,
    })
    .eq('id', clientId);

  if (error) {
    console.error("Erro ao atualizar cliente:", error);
    return { success: false, message: "Não foi possível atualizar os dados do cliente." };
  }

  revalidatePath(`/dashboard/clientes`);
  revalidatePath(`/dashboard/clientes/${clientId}`);
  revalidatePath(`/dashboard/clientes/${clientId}/editar`);
  redirect(`/dashboard/clientes/${clientId}`);
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

export async function deleteClient(formData: FormData): Promise<ActionResult> {
  const supabase = await createSupabaseClient();
  const clientId = formData.get("client_id") as string;

  if (!clientId) {
    return { success: false, message: "ID do cliente não fornecido." };
  }

  const { error } = await supabase.from('clients').delete().eq('id', clientId);

  if (error) {
      console.error("Erro ao excluir cliente:", error);
      return { success: false, message: "Não foi possível excluir o cliente." };
  }

  revalidatePath(`/dashboard/clientes`);
  redirect('/dashboard/clientes');
}