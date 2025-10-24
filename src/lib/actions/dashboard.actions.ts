"use server";

import { createClient } from "@/lib/supabase/server";
import { unstable_noStore as noStore } from 'next/cache';

async function getActiveWorkspaceId(): Promise<string | null> {
  const supabase = await createClient();
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

export async function getDashboardMetrics() {
  noStore();
  const supabase = await createClient();
  const workspaceId = await getActiveWorkspaceId();

  if (!workspaceId) {
    return { clientCount: 0, activeCasesCount: 0 };
  }
  
  const { count: clientCount, error: clientError } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })
    .eq('workspace_id', workspaceId);

  const { count: activeCasesCount, error: casesError } = await supabase
    .from('cases')
    .select('*', { count: 'exact', head: true })
    .eq('workspace_id', workspaceId)
    .eq('status', 'open');

  if (clientError || casesError) {
    console.error("Erro ao buscar métricas do dashboard:", clientError || casesError);
    return { clientCount: 0, activeCasesCount: 0 };
  }

  return { 
    clientCount: clientCount ?? 0, 
    activeCasesCount: activeCasesCount ?? 0 
}; }