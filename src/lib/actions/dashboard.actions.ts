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

export async function getSystemAlerts() {
  noStore();
  const supabase = await createClient();
  const workspaceId = await getActiveWorkspaceId();
  const alerts = [];

  if (!workspaceId) return [];

  const today = new Date().toISOString();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const { data: overdueCases, error: overdueError } = await supabase
    .from('cases')
    .select('id, title')
    .eq('workspace_id', workspaceId)
    .lt('deadline', today)
    .in('status', ['open', 'pending']);
  
  if (overdueError) console.error("Erro ao buscar prazos vencidos:", overdueError);
  if (overdueCases && overdueCases.length > 0) {
    alerts.push({
      id: 'overdue_cases',
      type: 'warning',
      message: `Você tem ${overdueCases.length} caso(s) com o prazo vencido.`,
      link: `/dashboard/casos?query=${overdueCases.map(c => c.title).join(',')}`
  }); }

  const { data: inactiveCases, error: inactiveError } = await supabase
    .from('cases')
    .select('id, title')
    .eq('workspace_id', workspaceId)
    .lt('updated_at', thirtyDaysAgo)
    .eq('status', 'open');
  
  if (inactiveError) console.error("Erro ao buscar casos inativos:", inactiveError);
  if (inactiveCases && inactiveCases.length > 0) {
    alerts.push({
      id: 'inactive_cases',
      type: 'info',
      message: `${inactiveCases.length} caso(s) não são atualizados há mais de 30 dias.`,
      link: `/dashboard/casos?query=${inactiveCases.map(c => c.title).join(' ')}`
  }); }

  if (alerts.length === 0) {
    alerts.push({
      id: 'all_ok',
      type: 'success',
      message: 'Nenhum alerta crítico para o sistema.',
      link: null
  }); }

  return alerts;
}


export async function getDashboardMetrics() {
  noStore();
  const supabase = await createClient();
  const workspaceId = await getActiveWorkspaceId();

  if (!workspaceId) {
    return { 
      clientCount: 0, 
      activeCasesCount: 0,
      upcomingDeadlines: 0,
      totalDocumentsCount: 0,
      recentActivitiesCount: 0,
      successRate: 0,
      recentActivityFeed: []
  }; }
  
  const today = new Date();
  const sevenDaysFromNow = new Date(today);
  sevenDaysFromNow.setDate(today.getDate() + 7);

  const [
    { count: clientCount },
    { count: activeCasesCount },
    { data: deadlinesData },
    { count: closedCasesCount },
    { count: totalCasesCount },
    { count: totalDocumentsCount },
    { data: recentClients },
    { data: recentCases },
  ] = await Promise.all([
    supabase.from('clients').select('*', { count: 'exact', head: true }).eq('workspace_id', workspaceId),
    supabase.from('cases').select('*', { count: 'exact', head: true }).eq('workspace_id', workspaceId).eq('status', 'open'),
    supabase.from('cases').select('deadline').eq('workspace_id', workspaceId).gte('deadline', today.toISOString()).lte('deadline', sevenDaysFromNow.toISOString()),
    supabase.from('cases').select('*', { count: 'exact', head: true }).eq('workspace_id', workspaceId).eq('status', 'closed'),
    supabase.from('cases').select('*', { count: 'exact', head: true }).eq('workspace_id', workspaceId),
    supabase.from('documents').select('*', { count: 'exact', head: true }).eq('workspace_id', workspaceId),
    supabase.from('clients').select('name, created_at, updated_at').eq('workspace_id', workspaceId).order('updated_at', { ascending: false }).limit(3),
    supabase.from('cases').select('title, created_at, updated_at').eq('workspace_id', workspaceId).order('updated_at', { ascending: false }).limit(3),
  ]);

  const upcomingDeadlines = deadlinesData?.length ?? 0;

  const successRate = (totalCasesCount ?? 0) > 0 
    ? Math.round(((closedCasesCount ?? 0) / (totalCasesCount ?? 0)) * 100) 
    : 0;

  const clientActivities = (recentClients || []).map(c => {
    const isUpdate = new Date(c.updated_at).getTime() - new Date(c.created_at).getTime() > 1000;
    return { type: isUpdate ? 'Cliente atualizado' : 'Novo cliente', name: c.name, time: new Date(c.updated_at), entity: 'client' };
  });

  const caseActivities = (recentCases || []).map(c => {
    const isUpdate = new Date(c.updated_at).getTime() - new Date(c.created_at).getTime() > 1000;
    return { type: isUpdate ? 'Caso atualizado' : 'Novo caso', name: c.title, time: new Date(c.updated_at), entity: 'case' };
  });
  
  const combinedActivities = [...clientActivities, ...caseActivities]
    .sort((a, b) => b.time.getTime() - a.time.getTime())
    .slice(0, 4);

  const recentActivitiesCount = combinedActivities.length;

  return { 
    clientCount: clientCount ?? 0, 
    activeCasesCount: activeCasesCount ?? 0,
    upcomingDeadlines,
    totalDocumentsCount: totalDocumentsCount ?? 0,
    recentActivitiesCount,
    successRate: successRate,
    recentActivityFeed: combinedActivities
}; }