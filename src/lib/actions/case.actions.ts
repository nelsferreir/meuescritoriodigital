"use server";

import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ActionResult } from "./client.actions";

export type Case = {
  id: string;
  title: string;
  description: string | null;
  status: 'open' | 'closed' | 'pending';
  case_number: string | null;
  created_at: string;
  updated_at: string;
  client_id: string;
  deadline: string | null;
  clients: { name: string } | null;
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

export async function createCase(
    previousState: ActionResult | null,
    formData: FormData
): Promise<ActionResult> {
    const supabase = await createSupabaseClient();
    const workspaceId = await getActiveWorkspaceId();
    const clientId = formData.get("client_id") as string;
    const deadline = formData.get("deadline") as string;

    if (!workspaceId) {
        return { success: false, message: "Ambiente de trabalho não encontrado." };
    }
    if (!clientId) {
        return { success: false, message: "Cliente não especificado." };
    }

    const title = formData.get("title") as string;
    if (!title || title.trim().length < 3) {
      return { success: false, message: "O título é obrigatório e precisa ter pelo menos 3 caracteres." };
    }

    const { error } = await supabase.from('cases').insert({
      workspace_id: workspaceId,
      client_id: clientId,
      title: title,
      description: formData.get("description") as string,
      status: formData.get("status") as 'open' | 'pending' | 'closed' || 'open',
      case_number: formData.get("case_number") as string,
      deadline: deadline || null,
    });

    if (error) {
      console.error("Erro ao criar caso:", error);
      return { success: false, message: "Não foi possível cadastrar o caso." };
    }

    revalidatePath(`/dashboard/clientes/${clientId}`);
    revalidatePath('/dashboard/casos');
    redirect(`/dashboard/clientes/${clientId}`);
}

export async function updateCase(
    previousState: ActionResult | null,
    formData: FormData
): Promise<ActionResult> {
    const supabase = await createSupabaseClient();
    const caseId = formData.get("case_id") as string;
    const clientId = formData.get("client_id") as string;
    const deadline = formData.get("deadline") as string;

    const title = formData.get("title") as string;
    if (!title || title.trim().length < 3) {
      return { success: false, message: "O título é obrigatório." };
    }

    const { error } = await supabase
      .from('cases')
      .update({
        title: title,
        description: formData.get("description") as string,
        case_number: formData.get("case_number") as string,
        status: formData.get("status") as any,
        deadline: deadline || null,
      })
      .eq('id', caseId);

    if (error) {
      console.error("Erro ao atualizar caso:", error);
      return { success: false, message: "Não foi possível atualizar o caso." };
    }

    revalidatePath(`/dashboard/clientes/${clientId}`);
    revalidatePath(`/dashboard/casos`);
    revalidatePath(`/dashboard/casos/${caseId}/editar`);
    redirect(`/dashboard/clientes/${clientId}`);
}

export async function getCaseById(caseId: string): Promise<Case | null> {
  noStore();
  const supabase = await createSupabaseClient();
  const workspaceId = await getActiveWorkspaceId();

  if (!workspaceId) return null;

  const { data, error } = await supabase
    .from('cases')
    .select('*, clients (name)')
    .eq('id', caseId)
    .eq('workspace_id', workspaceId)
    .single();

  if (error) {
    console.error('Erro ao buscar caso:', error);
    return null;
  }

  return data;
}

export async function getCasesByClientId(clientId: string): Promise<Case[]> {
  noStore();
  const supabase = await createSupabaseClient();
  const workspaceId = await getActiveWorkspaceId();

  if (!workspaceId) return [];

  const { data, error } = await supabase
    .from('cases')
    .select('*, clients (name)')
    .eq('workspace_id', workspaceId)
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar casos:', error);
    return [];
  }

  return data;
}

export async function getAllCases(query?: string): Promise<Case[]> {
  noStore();
  const supabase = await createSupabaseClient();
  const workspaceId = await getActiveWorkspaceId();

  if (!workspaceId) return [];

  let queryBuilder = supabase
    .from('cases')
    .select('*, clients(name)')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false });
  
  if (query) {
    const cleanedQuery = query.replace(/[%_]/g, '');

    if (cleanedQuery.includes(',')) {
        const titles = cleanedQuery.split(',').map(t => t.trim()).filter(t => t);
        const orFilter = titles.map(title => `title.ilike.%${title}%`).join(',');
        queryBuilder = queryBuilder.or(orFilter);
    } else {
        const { data: matchingClients, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('workspace_id', workspaceId)
        .ilike('name', `%${cleanedQuery}%`);

        if (clientError) {
        console.error('Erro ao buscar clientes correspondentes:', clientError);
        }
        const clientIds = matchingClients ? matchingClients.map(c => c.id) : [];

        let orFilter = `title.ilike.%${cleanedQuery}%,case_number.ilike.%${cleanedQuery}%`;
        
        if (clientIds.length > 0) {
        orFilter += `,client_id.in.(${clientIds.join(',')})`;
        }

        queryBuilder = queryBuilder.or(orFilter);
  } }

  const { data, error } = await queryBuilder;

  if (error) {
    console.error('Erro ao buscar todos os casos:', error);
    return [];
  }

  return data as Case[];
}

export async function getCaseStats() {
  noStore();
  const supabase = await createSupabaseClient();
  const workspaceId = await getActiveWorkspaceId();

  if (!workspaceId) {
    return { openCases: 0, pendingCases: 0, closedCases: 0 };
  }

  const { count: openCases } = await supabase
    .from('cases')
    .select('*', { count: 'exact', head: true })
    .eq('workspace_id', workspaceId)
    .eq('status', 'open');

  const { count: pendingCases } = await supabase
    .from('cases')
    .select('*', { count: 'exact', head: true })
    .eq('workspace_id', workspaceId)
    .eq('status', 'pending');

  const { count: closedCases } = await supabase
    .from('cases')
    .select('*', { count: 'exact', head: true })
    .eq('workspace_id', workspaceId)
    .eq('status', 'closed');
  
  return {
    openCases: openCases ?? 0,
    pendingCases: pendingCases ?? 0,
    closedCases: closedCases ?? 0,
}; }

export async function deleteCase(formData: FormData): Promise<ActionResult> {
    const supabase = await createSupabaseClient();
    const caseId = formData.get("case_id") as string;
    const clientId = formData.get("client_id") as string;

    const { error } = await supabase.from('cases').delete().eq('id', caseId);

    if (error) {
        console.error("Erro ao excluir caso:", error);
        return { success: false, message: "Não foi possível excluir o caso." };
    }

    revalidatePath(`/dashboard/clientes/${clientId}`);
    revalidatePath('/dashboard/casos');
    return { success: true, message: "Caso excluído com sucesso." };
}